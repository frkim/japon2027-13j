import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import * as data from './data.js';
import { mapPlaces } from './map-data.js';
import { linkPlaces, initImageFallbacks } from './program.js';

test('descriptions link itinerary cities, aliases, hotels and airports to specific Google Maps queries', () => {
  for (const name of [
    ...mapPlaces.map((place) => place.name), 'Mont Koya', 'Mont Fuji', 'Fuji',
    'Ikebukuro', 'Paris', 'Paris CDG', 'Helsinki', 'Osaka KIX', 'Tokyo NRT', 'Tokyo Narita',
  ]) {
    const html = linkPlaces(`Étape : ${name}.`);
    assert.equal((html.match(/<a /g) || []).length, 1, name);
    assert.ok(html.includes(`>${name}</a>`), name);
    assert.match(html, /href="https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=/);
    assert.match(html, /target="_blank" rel="noopener noreferrer"/);
  }
  assert.ok(linkPlaces('Paris CDG').includes(encodeURIComponent('Aéroport Paris Charles de Gaulle, France')));
  assert.ok(linkPlaces('Tokyo Narita').includes(encodeURIComponent('Aéroport international de Narita, Japon')));
});

test('place links preserve punctuation, repeated names and case without matching parts of other words', () => {
  const html = linkPlaces('Nara, Kyoto › Nara ; TOKYO. Mont Koya et Mont-Koya.');
  assert.equal((html.match(/<a /g) || []).length, 6);
  assert.ok(html.includes('>TOKYO</a>.'));
  assert.ok(html.includes(encodeURIComponent('Tokyo, Japon')));
  assert.equal(linkPlaces('Naramachi, Fujiyama et Kyotoite'), 'Naramachi, Fujiyama et Kyotoite');
  assert.equal(linkPlaces('Une journée au monastère.'), 'Une journée au monastère.');
});

test('plain text is escaped even around linked place names', () => {
  const html = linkPlaces('<img src=x onerror="alert(1)">Nara & Kyoto');
  assert.ok(html.startsWith('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'));
  assert.ok(html.includes('</a> &amp; <a'));
  assert.doesNotMatch(html, /<img|<script/);
});

const app = { innerHTML: '' };
const source = readFileSync(new URL('./main.js', import.meta.url), 'utf8')
  .split('\ninitImageFallbacks();')[0]
  .replace(/^import .*;\r?$/gm, '');
runInNewContext(source, { ...data, linkPlaces, document: { querySelector: () => app } });

test('the timeline has chronological collapsible date pills and detail controls for all thirteen days', () => {
  assert.match(app.innerHTML, /class="day-timeline"/);
  assert.doesNotMatch(app.innerHTML, /class="day-grid"/);
  assert.equal((app.innerHTML.match(/class="day-card"/g) || []).length, 13);
  data.days.forEach((day) => {
    assert.ok(app.innerHTML.includes(`id="jour-${day.day}" data-category="${day.tag}" open`));
    assert.ok(app.innerHTML.includes(`data-open-day="${day.day}"`));
    assert.ok(app.innerHTML.includes(`<p>${linkPlaces(day.text)}</p>`));
    day.items.forEach((item) => assert.ok(app.innerHTML.includes(`<li>${linkPlaces(item)}</li>`)));
  });
  assert.match(app.innerHTML, /J01 · lundi 17 mai 2027/);
  assert.match(app.innerHTML, /J13 · samedi 29 mai 2027/);
  for (const summary of app.innerHTML.matchAll(/<summary class="day-date-pill">([\s\S]*?)<\/summary>/g)) {
    assert.doesNotMatch(summary[1], /<a|<button/);
  }
  assert.match(app.innerHTML, /<dialog[^>]*aria-labelledby="day-dialog-title"/);
});

test('multi-stop days show separate chronological stage cards under a single date', () => {
  const stagesByDay = new Map([
    [2, ['Arrivée à Osaka', 'Une nuit au Mont-Koya']],
    [3, ['Étape à Nara', 'Installation à Kyoto']],
    [5, ['Étape à Uji', 'Étape à Himeji', 'Retour à Kyoto']],
    [6, ['Étape à Hikone', 'Nuit à Nagoya']],
    [7, ['Étape à Yaizu', 'Hakone et le Mont Fuji']],
    [8, ['Étape à Kamakura', 'Installation à Tokyo']],
  ]);
  for (const day of data.days) {
    const html = app.innerHTML.match(new RegExp(`<details class="day-card" id="jour-${day.day}"[\\s\\S]*?</details>`))[0];
    const previews = [...html.matchAll(/<article class="day-preview">([\s\S]*?)<\/article>/g)];
    const titles = stagesByDay.get(day.day) || [day.title];
    assert.equal(previews.length, titles.length, `day ${day.day}`);
    assert.equal((html.match(/class="day-date-pill"/g) || []).length, 1);
    assert.equal((html.match(/class="day-detail"/g) || []).length, 1);
    assert.equal((html.match(/class="day-duration"/g) || []).length, 1);
    previews.forEach(([preview], index) => {
      assert.ok(preview.includes(`data-open-day="${day.day}">${titles[index]}</button>`));
      assert.ok(preview.includes(`aria-label="Voir les détails du jour ${day.day}"`));
      const stage = day.stages?.[index] || day;
      assert.ok(preview.includes(`<p class="day-route">${linkPlaces(stage.route)}</p>`));
      assert.ok(preview.includes(`<p>${linkPlaces(stage.text)}</p>`));
    });
    if (day.stages) {
      assert.ok(previews[0][0].includes(`Trajet de la journée : ${day.distance}`));
      assert.ok(!previews.some(([preview]) => preview.includes(`<p>${linkPlaces(day.text)}</p>`)));
    }
  }
});

test('searching stage text keeps its whole day and category filtering still applies', () => {
  const cards = data.days.map(() => ({ hidden: false }));
  const search = { value: 'ÉTAPE À YAIZU' };
  const count = {};
  const empty = {};
  const filterSource = readFileSync(new URL('./main.js', import.meta.url), 'utf8')
    .split("let filter = 'Tout';")[1]
    .split("document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener")[0]
    .replace("const search = document.querySelector('#search');", '');
  const context = {
    filter: 'Tout', search, dayCards: cards, days: data.days, dateLabel: () => '',
    document: {
      querySelector: (selector) => selector === '#result-count' ? count : empty,
      querySelectorAll: () => [],
    },
  };
  runInNewContext(`${filterSource}\nfilterDays();`, context);
  assert.deepEqual(cards.map((card, index) => !card.hidden ? index + 1 : null).filter(Boolean), [7]);
  assert.equal(count.textContent, '1 journée à découvrir');
  context.filter = 'Culture';
  runInNewContext('filterDays();', context);
  assert.ok(cards.every((card) => card.hidden));
  assert.equal(empty.hidden, false);
  context.filter = 'Nature';
  search.value = 'Préparer un petit sac';
  runInNewContext('filterDays();', context);
  assert.equal(cards[6].hidden, false);
  assert.equal(empty.hidden, true);
});

test('map help appears once in a native popover beside reset and remains the map accessible description', () => {
  assert.match(app.innerHTML, /id="map-reset">Recentrer le circuit<\/button>\s*<button[^>]*popovertarget="map-help" aria-label=/);
  assert.equal((app.innerHTML.match(/id="map-help"/g) || []).length, 1);
  assert.match(app.innerHTML, /id="map-help" popover>Noms des étapes en français/);
  const help = 'Noms des étapes en français sur les repères ; les autres noms du fond OpenStreetMap restent en langue locale · Zoomez pour distinguer les étapes proches. Déplacez la carte et utilisez + / − pour zoomer, ou deux doigts sur mobile. Au clavier : flèches pour déplacer la carte, + / − pour zoomer et Entrée sur un repère pour le consulter. Le tracé relie les étapes à titre indicatif : ce n’est pas un itinéraire routier. Les visites sont situées au centre des villes ; les repères des hébergements sont approximatifs, adresses à confirmer. Les excursions correspondent aux étapes du programme, sans ajout de visites non confirmées.';
  assert.ok(app.innerHTML.includes(`id="map-help" popover>${help}</p>`));
  assert.match(app.innerHTML, /id="trip-map"[^>]*aria-describedby="map-help"/);
  const css = readFileSync(new URL('./style.css', import.meta.url), 'utf8').split('@media print {')[1];
  assert.match(css, /\.day-dialog \{ display: none !important; \}/);
  assert.match(css, /\.day-card\[hidden\] \{ display: block !important; \}/);
  assert.match(css, /\.day-detail\[hidden\] \{ display: block !important; \}/);
  assert.doesNotMatch(css, /\.day-duration[^}]*display: none/);
});

function setupDialog() {
  let focused;
  class Element {
    constructor() { this.listeners = {}; this.dataset = {}; this.disabled = false; }
    addEventListener(name, callback) { this.listeners[name] = callback; }
    focus() { focused = this; }
    click() { if (!this.disabled) this.listeners.click?.({ target: this }); }
    querySelectorAll() { return []; }
  }
  const controls = Object.fromEntries([
    '#day-dialog-title', '#day-dialog-date', '#day-dialog-position', '.day-dialog-body',
    '[data-previous-day]', '[data-next-day]', '[data-close-day]',
  ].map((selector) => [selector, new Element()]));
  const dialog = new Element();
  dialog.querySelector = (selector) => controls[selector];
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => { dialog.open = false; dialog.listeners.close(); };
  const opener = new Element();
  const cards = data.days.map((day) => {
    const buttons = (day.stages || [day]).flatMap(() => Array.from({ length: 2 }, () => {
      const button = new Element();
      button.dataset.openDay = String(day.day);
      return button;
    }));
    return {
      id: `jour-${day.day}`, hidden: false, button: buttons[0], buttons,
      querySelector: () => ({ innerHTML: `<p>Jour ${day.day}</p>` }),
      querySelectorAll: () => buttons,
    };
  });
  const dialogSource = readFileSync(new URL('./program.js', import.meta.url), 'utf8')
    .replace(/^import .*;\r?$/gm, '')
    .replace(/^export /gm, '');
  const showDay = runInNewContext(`${dialogSource}\ninitDayDialog(cards, days, dateLabel);`, {
    hotels: data.hotels, mapPlaces, cards, days: data.days, dateLabel: (day) => `${16 + day} mai`,
    document: { querySelector: () => dialog, activeElement: opener },
  });
  function key(key, modifiers = {}) {
    const event = { key, ...modifiers, prevented: false, preventDefault() { this.prevented = true; } };
    dialog.listeners.keydown(event);
    return event;
  }
  return { dialog, controls, cards, showDay, opener, key, get focused() { return focused; } };
}

test('detail controls open the selected day, show its content and restore focus when closed', () => {
  const ui = setupDialog();
  ui.cards[2].button.click();
  assert.equal(ui.dialog.open, true);
  assert.equal(ui.controls['#day-dialog-title'].textContent, data.days[2].title);
  assert.equal(ui.controls['#day-dialog-date'].textContent, 'Jour 3 · 19 mai 2027');
  assert.equal(ui.controls['.day-dialog-body'].innerHTML, '<p>Jour 3</p>');
  assert.equal(ui.controls['#day-dialog-position'].textContent, '3 / 13');
  assert.equal(ui.focused, ui.controls['[data-close-day]']);
  ui.controls['[data-close-day]'].click();
  assert.equal(ui.dialog.open, false);
  assert.equal(ui.focused, ui.opener);
});

test('every stage control opens the parent day without adding dialog navigation positions', () => {
  const ui = setupDialog();
  for (const button of ui.cards[6].buttons) {
    button.click();
    assert.equal(ui.controls['#day-dialog-title'].textContent, data.days[6].title);
    assert.equal(ui.controls['.day-dialog-body'].innerHTML, '<p>Jour 7</p>');
    assert.equal(ui.controls['#day-dialog-position'].textContent, '7 / 13');
  }
  ui.controls['[data-next-day]'].click();
  assert.equal(ui.controls['#day-dialog-title'].textContent, data.days[7].title);
  assert.equal(ui.controls['#day-dialog-position'].textContent, '8 / 13');
});

test('dialog buttons and arrow keys skip filtered days and stop at the first and last visible day', () => {
  const ui = setupDialog();
  ui.cards.forEach((card, index) => { card.hidden = ![1, 4, 7].includes(index); });
  ui.showDay(2);
  assert.equal(ui.controls['[data-previous-day]'].disabled, true);
  assert.equal(ui.key('ArrowLeft').prevented, true);
  assert.equal(ui.controls['#day-dialog-title'].textContent, data.days[1].title);
  ui.controls['[data-next-day]'].click();
  assert.equal(ui.controls['#day-dialog-title'].textContent, data.days[4].title);
  assert.equal(ui.focused, ui.controls['[data-next-day]']);
  ui.key('ArrowRight');
  assert.equal(ui.controls['#day-dialog-title'].textContent, data.days[7].title);
  assert.equal(ui.controls['#day-dialog-position'].textContent, '3 / 3');
  assert.equal(ui.controls['[data-next-day]'].disabled, true);
  assert.equal(ui.focused, ui.controls['[data-close-day]']);
  ui.key('ArrowRight');
  assert.equal(ui.controls['#day-dialog-title'].textContent, data.days[7].title);
  ui.key('ArrowLeft');
  assert.equal(ui.controls['#day-dialog-title'].textContent, data.days[4].title);
});

test('unrelated keys and modified shortcuts do not change the day; clicking the backdrop closes the dialog', () => {
  const ui = setupDialog();
  ui.showDay(4);
  assert.equal(ui.key('Tab').prevented, false);
  for (const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey']) {
    assert.equal(ui.key('ArrowRight', { [modifier]: true }).prevented, false);
  }
  assert.equal(ui.controls['#day-dialog-title'].textContent, data.days[3].title);
  ui.dialog.listeners.click({ target: ui.controls['.day-dialog-body'] });
  assert.equal(ui.dialog.open, true);
  ui.dialog.listeners.click({ target: ui.dialog });
  assert.equal(ui.dialog.open, false);
  assert.equal(ui.focused, ui.opener);
});

test('missing and failed images use the existing landscape fallback, including inside the dialog', () => {
  const image = { complete: false, addEventListener(name, callback, options) {
    assert.equal(name, 'error');
    assert.equal(options.once, true);
    this.fallback = callback;
  } };
  const broken = { ...image, complete: true, naturalWidth: 0 };
  initImageFallbacks({ querySelectorAll: () => [image, broken] });
  assert.equal(broken.src, '/landscape.svg');
  image.fallback();
  assert.equal(image.src, '/landscape.svg');
  assert.match(image.alt, /image de secours/);
});
