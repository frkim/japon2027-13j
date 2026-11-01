import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { hotels } from './data.js';
import { mapPlaces, mapRoute } from './map-data.js';

function setup() {
  let focused;
  class Element {
    constructor() {
      this.children = [];
      this.dataset = {};
      this.listeners = {};
      this.clientWidth = 800;
      this.clientHeight = 600;
    }
    append(...children) { this.children.push(...children); }
    setAttribute(name, value) { this[name] = value; }
    addEventListener(name, callback, options) { this.listeners[name] = { callback, options }; }
    focus() { focused = this; }
    click() { if (!this.disabled) this.listeners.click?.callback(); }
    querySelectorAll() { return this.children; }
  }
  const elements = Object.fromEntries(
    ['trip-map', 'map-status', 'map-error', 'map-places', 'map-reset'].map((id) => [id, new Element()]),
  );
  const inputs = ['visit', 'excursion', 'stay', 'route'].map((category) => {
    const input = new Element();
    input.dataset.mapLayer = category;
    input.checked = true;
    return input;
  });
  const section = {
    querySelector: (selector) => elements[selector.slice(1)],
    querySelectorAll: () => inputs,
  };
  let activeMarker = null;
  const markers = [];
  const map = {
    setView() {},
    fitBounds() {},
    addLayer() {},
    removeLayer(layer) {
      if (layer.markers?.includes(activeMarker)) activeMarker.closePopup();
    },
  };
  const addable = () => ({ addTo() { return this; }, on() {} });
  const L = {
    map: () => map,
    control: { zoom: addable },
    tileLayer: addable,
    layerGroup: () => ({ ...addable(), markers: [] }),
    latLngBounds: (coordinates) => coordinates,
    polyline: addable,
    divIcon: (options) => options,
    marker: () => {
      const node = new Element();
      const events = {};
      const marker = {
        on(name, callback) { events[name] = callback; },
        bindPopup(content, options) {
          this.popup = { content, options };
          return this;
        },
        addTo(layer) {
          layer.markers.push(this);
          events.add?.();
        },
        getElement: () => node,
        openPopup() {
          activeMarker?.closePopup();
          activeMarker = this;
          events.popupopen?.();
        },
        closePopup() {
          activeMarker = null;
          events.popupclose?.();
        },
      };
      markers.push(marker);
      return marker;
    },
  };
  const source = readFileSync(new URL('./trip-map.js', import.meta.url), 'utf8')
    .replace(/^import .*;\r?$/gm, '')
    .replace('export function initTripMap', 'function initTripMap');
  runInNewContext(`${source}\ninitTripMap(() => {});`, {
    L, hotels, mapPlaces, mapRoute,
    document: { querySelector: () => section, createElement: () => new Element() },
    ResizeObserver: class { observe() {} },
  });
  function key(key, modifiers = {}) {
    const event = {
      key, ...modifiers, prevented: false, stopped: false,
      preventDefault() { this.prevented = true; },
      stopPropagation() { this.stopped = true; },
    };
    elements['trip-map'].listeners.keydown.callback(event);
    return event;
  }
  return {
    markers, inputs, elements, key,
    get activeMarker() { return activeMarker; },
    get focused() { return focused; },
  };
}

test('popup arrow keys use button navigation, wrap and keep focus on the arrow', () => {
  const ui = setup();
  assert.equal(ui.elements['trip-map'].listeners.keydown.options.capture, true);
  ui.markers[0].openPopup();
  assert.equal(ui.focused, ui.markers[0].getElement());
  const right = ui.key('ArrowRight');
  assert.equal(right.prevented, true);
  assert.equal(right.stopped, true);
  assert.equal(ui.activeMarker, ui.markers[1]);
  assert.equal(ui.focused, ui.markers[1].popup.content.children[0].children[2]);
  ui.key('ArrowLeft');
  assert.equal(ui.activeMarker, ui.markers[0]);
  ui.key('ArrowLeft');
  assert.equal(ui.activeMarker, ui.markers.at(-1));
  ui.key('ArrowRight');
  assert.equal(ui.activeMarker, ui.markers[0]);
});

test('Escape closes the popup, restores marker focus and leaves closed-map keys alone', () => {
  const ui = setup();
  assert.equal(ui.key('ArrowLeft').prevented, false);
  ui.markers[2].openPopup();
  const escape = ui.key('Escape');
  assert.equal(escape.prevented, true);
  assert.equal(escape.stopped, true);
  assert.equal(ui.activeMarker, null);
  assert.equal(ui.focused, ui.markers[2].getElement());
  assert.equal(ui.key('ArrowRight').prevented, false);
  assert.equal(ui.key('Escape').prevented, false);
});

test('keyboard navigation respects hidden categories and popup closure on filtering', () => {
  const ui = setup();
  ui.inputs.find((input) => input.dataset.mapLayer === 'excursion').checked = false;
  ui.inputs[0].listeners.change.callback();
  ui.markers[1].openPopup();
  ui.key('ArrowRight');
  assert.equal(ui.activeMarker, ui.markers[3]);
  ui.inputs.find((input) => input.dataset.mapLayer === 'visit').checked = false;
  ui.inputs[0].listeners.change.callback();
  assert.equal(ui.activeMarker, null);
  assert.equal(ui.key('ArrowRight').prevented, false);
});

test('unrelated keys and modified shortcuts do not change the popup', () => {
  const ui = setup();
  ui.markers[0].openPopup();
  assert.equal(ui.key('ArrowUp').prevented, false);
  assert.equal(ui.key('Tab').prevented, false);
  for (const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey']) {
    for (const key of ['ArrowLeft', 'ArrowRight', 'Escape']) {
      assert.equal(ui.key(key, { [modifier]: true }).prevented, false);
      assert.equal(ui.activeMarker, ui.markers[0]);
    }
  }
  ui.markers[0].closePopup();
  assert.equal(ui.key('ArrowLeft').prevented, false);
});
