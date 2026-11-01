import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { hotels } from './data.js';
import { mapPlaces, mapRoute } from './map-data.js';

const categories = {
  visit: { label: 'Visites et étapes', symbol: 'V' },
  excursion: { label: 'Excursions', symbol: 'E' },
  stay: { label: 'Lieux de couchage', symbol: 'N' },
};

export function initTripMap(openDay) {
  const section = document.querySelector('#trip-map-section');
  const container = section.querySelector('#trip-map');
  const status = section.querySelector('#map-status');
  const error = section.querySelector('#map-error');
  const placeList = section.querySelector('#map-places');
  const map = L.map(container, { scrollWheelZoom: false, zoomControl: false });
  L.control.zoom({
    position: 'topright', zoomInTitle: 'Zoom avant', zoomOutTitle: 'Zoom arrière',
  }).addTo(map);
  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  tiles.on('tileerror', () => {
    error.hidden = false;
  });
  const layers = Object.fromEntries(Object.keys(categories).map((category) => [category, L.layerGroup().addTo(map)]));
  const bounds = L.latLngBounds(mapPlaces.map((place) => place.coordinates));
  const fit = () => map.fitBounds(bounds, { padding: [30, 30], animate: false });
  const route = L.polyline(mapRoute.map((id) => mapPlaces.find((place) => place.id === id).coordinates), {
    color: '#a73542', weight: 3, opacity: 0.8, dashArray: '8 8',
    interactive: false,
  }).addTo(map);
  const markers = new Map();
  const navigationControls = new Map();
  let visiblePlaces = mapPlaces;

  function popupSize() {
    return {
      maxWidth: Math.max(50, Math.min(280, container.clientWidth - 60)),
      maxHeight: Math.max(100, Math.min(420, container.clientHeight - 120)),
    };
  }

  function showPlace(place, direction) {
    const marker = markers.get(place.id);
    map.setView(place.coordinates, 12, { animate: false });
    marker.openPopup();
    if (direction) {
      navigationControls.get(place.id)[direction].focus({ preventScroll: true });
    } else {
      marker.getElement()?.focus({ preventScroll: true });
    }
  }

  function updateNavigation() {
    mapPlaces.forEach((place) => {
      const { previous, next, position } = navigationControls.get(place.id);
      const index = visiblePlaces.indexOf(place);
      const disabled = index < 0 || visiblePlaces.length < 2;
      previous.disabled = disabled;
      next.disabled = disabled;
      position.textContent = index < 0 ? '' : `${index + 1} / ${visiblePlaces.length}`;
      previous.title = disabled ? 'Lieu précédent' : `Lieu précédent : ${visiblePlaces[(index - 1 + visiblePlaces.length) % visiblePlaces.length].name}`;
      next.title = disabled ? 'Lieu suivant' : `Lieu suivant : ${visiblePlaces[(index + 1) % visiblePlaces.length].name}`;
    });
  }

  mapPlaces.forEach((place) => {
    const category = categories[place.category];
    const hotel = place.category === 'stay' ? hotels[place.hotelIndex] : null;
    const popup = document.createElement('div');
    popup.className = 'map-popup';
    const image = document.createElement('img');
    image.className = 'map-popup-thumbnail';
    image.src = place.image;
    image.alt = place.imageAlt;
    image.width = 280;
    image.height = 112;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      image.src = '/landscape.svg';
      image.alt = 'Illustration du Mont Fuji et d’un paysage japonais (image de secours)';
    }, { once: true });
    const navigation = document.createElement('div');
    navigation.className = 'map-popup-navigation';
    navigation.setAttribute('role', 'group');
    navigation.setAttribute('aria-label', 'Parcourir les lieux affichés');
    const position = document.createElement('span');
    position.className = 'map-popup-position';
    const controls = { position };
    for (const [direction, offset, label, symbol] of [
      ['previous', -1, 'Lieu précédent', '←'],
      ['next', 1, 'Lieu suivant', '→'],
    ]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'map-popup-arrow';
      button.setAttribute('aria-label', label);
      button.textContent = symbol;
      button.addEventListener('click', () => {
        const index = visiblePlaces.indexOf(place);
        if (index < 0 || visiblePlaces.length < 2) return;
        const target = visiblePlaces[(index + offset + visiblePlaces.length) % visiblePlaces.length];
        showPlace(target, direction);
      });
      controls[direction] = button;
    }
    navigation.append(controls.previous, position, controls.next);
    navigationControls.set(place.id, controls);
    const heading = document.createElement('h3');
    heading.textContent = place.name;
    const kind = document.createElement('p');
    kind.className = 'map-popup-kind';
    kind.textContent = hotel
      ? `${hotel.dates} 2027 · ${hotel.nights} nuit${hotel.nights > 1 ? 's' : ''}`
      : `${category.label} · ${place.days.map((day) => `J${day}`).join(', ')}`;
    const description = document.createElement('p');
    description.textContent = place.description;
    popup.append(navigation, image, heading, kind, description);
    const actions = document.createElement('div');
    actions.className = 'map-popup-actions';
    place.days.forEach((day) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'text-link';
      button.textContent = `Voir J${day}`;
      button.addEventListener('click', () => openDay(day));
      actions.append(button);
    });
    const link = document.createElement('a');
    link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel?.name || place.name}, ${hotel?.city || ''}, Japon`)}`;
    link.textContent = 'Rechercher sur Google Maps ↗';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    popup.append(actions, link);
    const marker = L.marker(place.coordinates, {
      title: place.name,
      alt: `${category.label} : ${place.name}`,
      icon: L.divIcon({
        className: `map-marker map-marker-${place.category}`,
        html: `<span aria-hidden="true">${category.symbol}</span>`,
        iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -18],
      }),
    }).bindPopup(popup, popupSize());
    markers.set(place.id, marker);
    marker.on('add', () => marker.getElement().setAttribute('aria-label', `${category.label} : ${place.name}`));
    marker.addTo(layers[place.category]);
    const item = document.createElement('li');
    item.dataset.mapCategory = place.category;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'text-link';
    button.textContent = `${category.symbol} · ${place.name}`;
    button.addEventListener('click', () => showPlace(place));
    const note = document.createElement('span');
    note.textContent = hotel ? `${hotel.dates} · ${hotel.nights} nuit${hotel.nights > 1 ? 's' : ''}` : place.days.map((day) => `J${day}`).join(', ');
    item.append(button, note);
    placeList.append(item);
  });

  function updateLayers() {
    const active = new Set();
    section.querySelectorAll('[data-map-layer]').forEach((input) => {
      const layer = input.dataset.mapLayer === 'route' ? route : layers[input.dataset.mapLayer];
      if (input.checked) {
        map.addLayer(layer);
        active.add(input.dataset.mapLayer);
      } else {
        map.removeLayer(layer);
      }
    });
    placeList.querySelectorAll('[data-map-category]').forEach((item) => {
      item.hidden = !active.has(item.dataset.mapCategory);
    });
    visiblePlaces = mapPlaces.filter((place) => active.has(place.category));
    updateNavigation();
    const count = visiblePlaces.length;
    status.textContent = `${count} lieu${count > 1 ? 'x' : ''} affiché${count > 1 ? 's' : ''}. Sélectionnez un repère ou un lieu dans la liste.`;
  }
  section.querySelectorAll('[data-map-layer]').forEach((input) => input.addEventListener('change', updateLayers));
  section.querySelector('#map-reset').addEventListener('click', fit);
  new ResizeObserver(() => {
    map.invalidateSize({ pan: false });
    markers.forEach((marker) => {
      const popup = marker.getPopup();
      Object.assign(popup.options, popupSize());
      if (popup.isOpen()) popup.update();
    });
  }).observe(container);
  fit();
  updateLayers();
}
