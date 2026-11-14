import { hotels } from './data.js';
import { mapPlaces } from './map-data.js';

const places = new Map([
  ...mapPlaces.filter((place) => place.category !== 'stay').map((place) => [place.name, `${place.name}, Japon`]),
  ...hotels.map((hotel) => [hotel.name, `${hotel.name}, ${hotel.city}, Japon`]),
  ['Mont Koya', 'Mont Koya, Japon'],
  ['Mont Fuji', 'Mont Fuji, Japon'],
  ['Fuji', 'Mont Fuji, Japon'],
  ['Ikebukuro', 'Ikebukuro, Tokyo, Japon'],
  ['Paris CDG', 'Aéroport Paris Charles de Gaulle, France'],
  ['CDG', 'Aéroport Paris Charles de Gaulle, France'],
  ['Paris', 'Paris, France'],
  ['Helsinki', 'Helsinki, Finlande'],
  ['Osaka KIX', 'Aéroport international du Kansai, Japon'],
  ['Tokyo NRT', 'Aéroport international de Narita, Japon'],
  ['Tokyo Narita', 'Aéroport international de Narita, Japon'],
]);
const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const placePattern = new RegExp(`(?<![\\p{L}\\p{N}])(?:${[...places.keys()]
  .sort((a, b) => b.length - a.length)
  .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![\\p{L}\\p{N}])`, 'giu');
const queries = new Map([...places].map(([name, query]) => [name.toLocaleLowerCase('fr'), query]));

export function linkPlaces(text) {
  let result = '';
  let offset = 0;
  for (const match of text.matchAll(placePattern)) {
    const query = queries.get(match[0].toLocaleLowerCase('fr'));
    const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    result += escapeHtml(text.slice(offset, match.index));
    result += `<a class="place-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(match[0])}</a>`;
    offset = match.index + match[0].length;
  }
  return result + escapeHtml(text.slice(offset));
}

export function initImageFallbacks(root = document) {
  root.querySelectorAll('img').forEach((image) => {
    const fallback = () => {
      image.src = '/landscape.svg';
      image.alt = 'Illustration du Mont Fuji et d’un paysage japonais (image de secours)';
    };
    image.addEventListener('error', fallback, { once: true });
    if (image.complete && !image.naturalWidth) fallback();
  });
}

export function initDayDialog(dayCards, days, dateLabel) {
  const dialog = document.querySelector('#day-dialog');
  const title = dialog.querySelector('#day-dialog-title');
  const date = dialog.querySelector('#day-dialog-date');
  const position = dialog.querySelector('#day-dialog-position');
  const body = dialog.querySelector('.day-dialog-body');
  const previous = dialog.querySelector('[data-previous-day]');
  const next = dialog.querySelector('[data-next-day]');
  const close = dialog.querySelector('[data-close-day]');
  let currentCard;
  let opener;
  const visibleCards = () => dayCards.filter((card) => !card.hidden);

  function showDay(dayNumber, direction) {
    const index = days.findIndex((day) => day.day === Number(dayNumber));
    if (index < 0) return;
    currentCard = dayCards[index];
    const visible = visibleCards();
    const current = visible.indexOf(currentCard);
    title.textContent = days[index].title;
    date.textContent = `Jour ${dayNumber} · ${dateLabel(Number(dayNumber))} 2027`;
    position.textContent = `${current + 1} / ${visible.length}`;
    body.innerHTML = currentCard.querySelector('.day-detail').innerHTML;
    initImageFallbacks(body);
    previous.disabled = current <= 0;
    next.disabled = current < 0 || current === visible.length - 1;
    if (!dialog.open) {
      opener = document.activeElement;
      dialog.showModal();
    }
    dialog.scrollTop = 0;
    const control = direction === 'previous' ? previous : direction === 'next' ? next : close;
    (control.disabled ? close : control).focus({ preventScroll: true });
  }

  function move(offset) {
    const visible = visibleCards();
    const target = visible[visible.indexOf(currentCard) + offset];
    if (target) showDay(target.id.replace('jour-', ''), offset < 0 ? 'previous' : 'next');
  }

  dayCards.forEach((card) => {
    card.querySelectorAll('[data-open-day]').forEach((button) => button.addEventListener('click', () => showDay(button.dataset.openDay)));
  });
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
  dialog.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  return showDay;
}
