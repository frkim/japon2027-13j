import './style.css';
import { photos, hotels, days, flights, highlights, included, excluded, important, formalities, practical, checklist } from './data.js';

const paths = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 5h2m4 0h2"/>',
  plane: '<path d="m3 12 7 2-1 6 3-2 2-5 6-5c3-3 1-5-2-2l-5 6-5 2-2 3 6-1-2-7Z"/>',
  moon: '<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>',
  mountain: '<path d="m2 20 8-15 5 9 2-4 5 10Zm5-9 3 2 3-2"/>',
  temple: '<path d="M3 8h18M5 8v13m14-13v13M2 21h20M6 4l6-2 6 2M2 8l10-4 10 4M9 21v-7h6v7"/>',
  castle: '<path d="M4 21V8h4V4h3v4h2V4h3v4h4v13Zm5 0v-6h6v6M4 12h16"/>',
  city: '<path d="M3 21V9h7v12m0 0V3h10v18M1 21h22M6 12v2m0 3v1m8-11h2m-2 4h2m-2 4h2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6Z"/>',
  bowl: '<path d="M3 12h18a9 9 0 0 1-18 0Zm4 9h10M7 8l8-6m-2 6 8-6"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  print: '<path d="M6 8V3h12v5M6 17H3V8h18v9h-3M6 14h12v7H6Z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  external: '<path d="M14 3h7v7m0-7L10 14m0-10H3v17h17v-7"/>',
};
const icon = (name, className = '') => `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.pin}</svg>`;
const list = (items) => `<ul class="check-list">${items.map((item) => `<li>${icon('check')}<span>${item}</span></li>`).join('')}</ul>`;
const definitions = (items) => `<dl class="info-list">${items.map(([title, text]) => `<div><dt>${title}</dt><dd>${text}</dd></div>`).join('')}</dl>`;
const dateLabel = (day) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2027, 4, 16 + day)));
const mapLink = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ', Japon')}`;
const externalLink = (href, label) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${label} ${icon('external')}</a>`;

document.querySelector('#app').innerHTML = `
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="#accueil" aria-label="Merveilles du Japon, accueil"><span class="brand-seal" lang="ja">日</span><span>Japon <b>2027</b><small>LE CARNET DE VOYAGE</small></span></a>
      <button class="menu-button" aria-label="Ouvrir la navigation" aria-expanded="false" aria-controls="navigation">${icon('menu')}</button>
      <nav id="navigation" aria-label="Navigation principale">
        <a href="#accueil" class="active">L’essentiel</a><a href="#programme">Le programme</a><a href="#hebergements">Hébergements</a><a href="#vols">Les vols</a><a href="#pratique">Infos pratiques</a>
      </nav>
      <button class="print-button" data-print>${icon('print')}<span>Mon carnet</span></button>
    </div>
  </header>
  <main id="contenu">
    <section id="accueil" class="hero" aria-labelledby="hero-title">
      <img class="hero-image" src="${photos.fuji}" alt="Le Mont Fuji, sommet emblématique du Japon" fetchpriority="high" />
      <div class="hero-shade"></div>
      <div class="hero-content">
        <p class="eyebrow hero-eyebrow"><span></span> L’ART DE DÉCOUVRIR · MAI 2027</p>
        <h1 id="hero-title">Merveilles<br>du <em>Japon.</em></h1>
        <p class="hero-description">Des temples paisibles de Kyoto aux lumières de Tokyo.<br>Treize jours pour rencontrer un pays extraordinaire.</p>
        <a class="button button-light" href="#programme">Explorer le voyage ${icon('arrow')}</a>
      </div>
      <div class="hero-japanese" lang="ja" aria-hidden="true">日本の旅<span>LE VOYAGE, AUTREMENT.</span></div>
      <div class="hero-bottom"><span>${icon('pin')} De Mont-Koya à Tokyo</span><span>35°21′ N · 138°43′ E</span></div>
      <span class="photo-caption">Photographie d’ambiance · Mont Fuji</span>
    </section>

    <div class="container">
      <section class="trip-stats" aria-label="Le voyage en bref">
        <div>${icon('calendar')}<span><small>LE RENDEZ-VOUS</small><strong>17 — 29 mai 2027</strong></span></div>
        <div>${icon('sun')}<span><small>LE TEMPS DE DÉCOUVRIR</small><strong>13 jours <i>/</i> 10 nuits</strong></span></div>
        <div>${icon('plane')}<span><small>ON VOUS EMMÈNE</small><strong>Avec Finnair</strong></span></div>
        <div class="countdown"><span class="status-dot"></span><span><small>L’AVENTURE APPROCHE</small><strong id="countdown">Cap sur le Japon</strong></span></div>
      </section>

      <section class="intro section-space" aria-labelledby="intro-title">
        <div><p class="eyebrow">UN VOYAGE, MILLE ÉMOTIONS</p><h2 id="intro-title">Le Japon dont<br>vous avez <em>rêvé.</em></h2></div>
        <div class="intro-copy"><p>Une nuit dans un monastère bouddhiste, des sanctuaires classés UNESCO, des châteaux chargés d’histoire… Puis Hakone et le Mont Fuji, avant l’effervescence de Tokyo.</p><p>Un circuit complet accompagné d’un guide francophone, pour découvrir les incontournables, la culture, les traditions et la gastronomie du Japon.</p><a class="text-link" href="#itineraire">Le fil du voyage ${icon('arrow')}</a></div>
      </section>
      <div class="highlights">${highlights.map(([name, title, text]) => `<article>${icon(name)}<h3>${title}</h3><p>${text}</p></article>`).join('')}</div>
      <aside class="notice registration">${icon('calendar')}<div><strong>Inscriptions du mardi 1er au mercredi 30 septembre 2026</strong><p>Voyage exclusivement réservé aux adultes : le rythme du circuit et ses nombreuses étapes ne sont pas adaptés aux enfants.</p></div><span class="small-tag">À NOTER</span></aside>

      <section id="itineraire" class="route-section section-space" aria-labelledby="route-title">
        <div class="section-heading"><div><p class="eyebrow">LE FIL DU VOYAGE</p><h2 id="route-title">Une traversée <em>inoubliable.</em></h2></div><span class="section-note">D’ouest en est, au rythme du Japon</span></div>
        <div class="route-panel">
          <div class="route-topline"><span>${icon('plane')} Paris → Osaka</span><span>JAPON · HONSHŪ</span><span>Tokyo → Paris ${icon('plane')}</span></div>
          <div class="route-stops" aria-label="Étapes principales, accéder à la journée">${[['Osaka', 2, 'Arrivée'], ['Mont-Koya', 2, '1 nuit'], ['Nara', 3, 'Étape'], ['Kyoto', 4, '3 nuits'], ['Uji · Himeji', 5, 'Étapes'], ['Hikone · Nagoya', 6, '1 nuit'], ['Yaizu · Hakone', 7, '1 nuit'], ['Kamakura · Tokyo', 8, '4 nuits']].map(([city, day, note], i) => `<button class="route-stop" data-day="${day}"><span class="stop-dot">${String(i + 1).padStart(2, '0')}</span><strong>${city}</strong><small>${note}</small></button>`).join('')}</div>
          <p class="route-footnote">Schéma des étapes, non à l’échelle. Sélectionnez une étape pour ouvrir sa journée.</p>
        </div>
      </section>

      <section id="programme" class="section-space" aria-labelledby="program-title">
        <div class="section-heading"><div><p class="eyebrow">CHAQUE JOUR, UNE DÉCOUVERTE</p><h2 id="program-title">Votre voyage, <em>jour après jour.</em></h2></div><span class="section-note">Du 17 au 29 mai 2027</span></div>
        <div class="program-toolbar">
          <div class="filters" role="group" aria-label="Filtrer les journées">${['Tout', 'Culture', 'Nature', 'Ville', 'Transport'].map((tag) => `<button class="filter ${tag === 'Tout' ? 'selected' : ''}" data-filter="${tag}" aria-pressed="${tag === 'Tout'}">${tag === 'Tout' ? 'Tout le voyage' : tag}</button>`).join('')}</div>
          <label class="search-field">${icon('search')}<span class="sr-only">Rechercher une étape ou un hébergement</span><input id="search" type="search" placeholder="Une ville, une étape…" autocomplete="off"></label>
        </div>
        <p class="result-count" id="result-count" role="status" aria-live="polite">13 journées à découvrir</p>
        <div class="day-grid">${days.map((day) => `
          <details class="day-card" id="jour-${day.day}" data-category="${day.tag}">
            <summary><div class="day-image-wrap"><img src="${day.image}" alt="${day.alt}" loading="lazy" decoding="async" width="900" height="600"><span class="day-number">J${String(day.day).padStart(2, '0')}</span><span class="image-tag">${day.tag}</span></div>
              <div class="day-summary" data-print-day="Jour ${day.day}"><p class="day-date">${dateLabel(day.day)} 2027 <span>${day.distance || 'Durée non précisée'}</span></p><h3>${day.title}</h3><p class="day-route">${day.route}</p><div class="day-bottom"><span>${icon('moon')}${day.stay}</span><span class="expand-icon" aria-hidden="true">+</span></div></div>
            </summary>
            <div class="day-detail"><p>${day.text}</p><ul>${day.items.map((item) => `<li>${item}</li>`).join('')}</ul><p class="meal-note">${icon('bowl')}${day.meals}</p>${externalLink(mapLink(day.route.replaceAll('›', ' ')), 'Repérer l’étape')}</div>
          </details>`).join('')}</div>
        <div id="no-results" class="empty-state" hidden>${icon('search')}<h3>Aucune étape trouvée</h3><p>Essayez une autre ville ou affichez tout le voyage.</p><button class="button button-dark" id="reset-search">Réinitialiser les filtres</button></div>
        <p class="fine-print">Distances et durées indicatives, reprises du programme. Le détail des visites, les horaires et les repas non mentionnés restent à confirmer avec l’organisateur. Les suggestions ne sont pas incluses.</p>
      </section>

      <section id="hebergements" class="section-space" aria-labelledby="hotel-title">
        <div class="section-heading"><div><p class="eyebrow">POSER SES VALISES</p><h2 id="hotel-title">Des nuits qui font <em>le voyage.</em></h2></div><span class="section-note">${icon('moon')} 5 hébergements · 10 nuits</span></div>
        <div class="hotel-grid">${hotels.map((hotel, i) => `<article class="hotel-card"><div class="hotel-image"><img src="${hotel.image}" alt="Vue de l’établissement : ${hotel.name}" loading="lazy" decoding="async" width="900" height="600"><span class="night-badge">${hotel.nights} nuit${hotel.nights > 1 ? 's' : ''}</span></div><div class="hotel-content"><p class="eyebrow">${hotel.city} <span>0${i + 1}</span></p><h3>${hotel.name}</h3><p class="hotel-dates">${icon('calendar')}${hotel.dates} 2027</p><span class="hotel-type">${hotel.type}</span><p>${hotel.note}</p>${externalLink(mapLink(hotel.name), 'Voir sur la carte')}</div></article>`).join('')}</div>
        <aside class="notice">${icon('moon')}<p>Liste non contractuelle, sous réserve de disponibilités au moment de la réservation. Hôtels 3* en chambre double, mentionnés ou similaires. Les dates de nuitées sont déduites de l’itinéraire. Photos des établissements fournies pour le carnet, non contractuelles.</p></aside>
      </section>

      <section id="vols" class="section-space" aria-labelledby="flights-title">
        <div class="section-heading"><div><p class="eyebrow">D’UN CIEL À L’AUTRE</p><h2 id="flights-title">Le Japon commence <em>ici.</em></h2></div><span class="airline">${icon('plane')} FINNAIR</span></div>
        <div class="flight-grid">${flights.map((flight, i) => `<article class="flight-card"><div class="flight-heading"><span class="small-tag">${i < 2 ? 'ALLER' : 'RETOUR'} · ${flight.date}</span><strong>${flight.number}</strong></div><div class="flight-route"><div><strong>${flight.departure}</strong><span>${flight.from}</span></div><div class="flight-line">${icon('plane')}</div><div><strong>${flight.arrival}</strong><span>${flight.to}</span>${flight.next ? `<small>${flight.next}</small>` : ''}</div></div></article>`).join('')}</div>
        <p class="fine-print">Tous les horaires sont locaux. Escale à Helsinki à l’aller et au retour. Vols réguliers mentionnés ou similaires, sous réserve de disponibilité lors de la réservation.</p>
      </section>
    </div>

    <section id="pratique" class="practical-section section-space" aria-labelledby="practical-title">
      <div class="container">
        <div class="section-heading"><div><p class="eyebrow">PARTIR L’ESPRIT TRANQUILLE</p><h2 id="practical-title">L’essentiel, <em>bien préparé.</em></h2></div><span class="section-note">Vos repères avant le départ</span></div>
        <div class="practical-layout">
          <div class="accordions">
            <details class="info-accordion" open><summary>${icon('compass')} Formalités & documents <span>+</span></summary><div>${definitions(formalities)}<div class="official-links">${externalLink('https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/conseils-par-pays-destination/japon/', 'France Diplomatie — Japon')}${externalLink('https://www.vjw.digital.go.jp/', 'Visit Japan Web officiel')}</div><p class="fine-print">Consignes du dossier de voyage, à revérifier auprès des autorités avant le départ. Elles ne remplacent pas un conseil officiel actualisé.</p></div></details>
            <details class="info-accordion"><summary>${icon('moon')} Bien vivre le voyage <span>+</span></summary><div>${definitions(important)}</div></details>
            <details class="info-accordion"><summary>${icon('sun')} Santé, monnaie & quotidien <span>+</span></summary><div>${definitions(practical)}<div class="official-links">${externalLink('https://www.japan.travel/en/plan/plug-and-electricity/', 'Électricité — Office du tourisme japonais')}</div></div></details>
            <details class="info-accordion"><summary>${icon('check')} Ce qui est inclus <span>+</span></summary><div>${list(included)}</div></details>
            <details class="info-accordion"><summary>${icon('bowl')} Ce qui n’est pas inclus <span>+</span></summary><div>${list(excluded)}</div></details>
          </div>
          <aside class="travel-tools">
            <div class="checklist-panel"><p class="eyebrow">AVANT DE BOUCLER LA VALISE</p><h3>Ma petite checklist</h3><p>Un départ serein, ça se prépare.</p><div class="checklist-progress"><span id="checklist-progress"></span></div><p class="checklist-count" id="checklist-count" aria-live="polite"></p>${checklist.map((label, i) => `<label class="check-item"><input type="checkbox" data-check="${i}"><span>${label}</span></label>`).join('')}<small id="storage-note">Enregistrée uniquement dans ce navigateur.</small></div>
            <div class="currency-panel"><p class="eyebrow">UN REPÈRE POUR VOS ACHATS</p><h3>Euros → yens</h3><label for="euros">Montant en euros</label><div class="currency-input"><input id="euros" type="number" min="0" max="1000000" step="0.01" value="50" inputmode="decimal"><span>EUR</span></div><output id="yen" for="euros" aria-live="polite"></output><small>1 € ≈ 185 JPY · référence d’avril 2026.<br>Estimation indicative, pas un taux en temps réel.</small></div>
          </aside>
        </div>
      </div>
    </section>
    <section class="closing container"><span lang="ja" aria-hidden="true">またね</span><p class="eyebrow">IL Y A DES VOYAGES QUI RESTENT.</p><h2>Celui-ci en fera <em>partie.</em></h2><a class="text-link" href="#accueil">Revenir au début ↑</a></section>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><a class="brand" href="#accueil"><span class="brand-seal" lang="ja">日</span><span>Japon <b>2027</b><small>MERVEILLES DU JAPON</small></span></a><p>17 — 29 mai 2027 · 13 jours / 10 nuits<br>Un carnet pour ne rien oublier.</p><div><button class="text-link" data-print>${icon('print')} Imprimer mon carnet</button><small>Photos d’ambiance : <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash</a> · photos des hébergements fournies pour le carnet · illustration de secours originale</small></div></div></footer>
`;

document.querySelectorAll('img').forEach((image) => {
  const fallback = () => {
    image.src = '/landscape.svg';
    image.alt = 'Illustration du Mont Fuji et d’un paysage japonais (image de secours)';
  };
  image.addEventListener('error', fallback, { once: true });
  if (image.complete && !image.naturalWidth) fallback();
});

const dayCards = [...document.querySelectorAll('.day-card')];
let filter = 'Tout';
const search = document.querySelector('#search');
const normalize = (value) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
function filterDays() {
  const query = normalize(search.value.trim());
  let count = 0;
  dayCards.forEach((card, index) => {
    const day = days[index];
    const haystack = normalize([day.title, day.route, day.stay, day.text, day.tag, dateLabel(day.day), `jour ${day.day}`].join(' '));
    const visible = (filter === 'Tout' || day.tag === filter) && haystack.includes(query);
    card.hidden = !visible;
    if (visible) count++;
  });
  document.querySelector('#result-count').textContent = `${count} journée${count > 1 ? 's' : ''} à découvrir`;
  document.querySelector('#no-results').hidden = count !== 0;
  document.querySelectorAll('[data-filter]').forEach((button) => {
    const selected = button.dataset.filter === filter;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}
document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  filterDays();
}));
search.addEventListener('input', filterDays);
function resetFilters() {
  filter = 'Tout';
  search.value = '';
  filterDays();
}
document.querySelector('#reset-search').addEventListener('click', resetFilters);
document.querySelectorAll('[data-day]').forEach((button) => button.addEventListener('click', () => {
  resetFilters();
  const card = document.querySelector(`#jour-${button.dataset.day}`);
  card.open = true;
  card.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  card.querySelector('summary').focus({ preventScroll: true });
}));

const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Ouvrir la navigation');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fermer la navigation' : 'Ouvrir la navigation');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigation.querySelectorAll('a').forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-15% 0px -65% 0px' });
['accueil', 'programme', 'hebergements', 'vols', 'pratique'].forEach((id) => navObserver.observe(document.getElementById(id)));

const checklistKey = 'japon2027-checklist-v1';
const checkboxes = [...document.querySelectorAll('[data-check]')];
try {
  const saved = JSON.parse(localStorage.getItem(checklistKey) || '[]');
  if (Array.isArray(saved)) checkboxes.forEach((checkbox, i) => { checkbox.checked = saved[i] === true; });
} catch {
  document.querySelector('#storage-note').textContent = 'Stockage indisponible : la checklist reste utilisable pendant cette visite.';
}
function updateChecklist(save = false) {
  const values = checkboxes.map((checkbox) => checkbox.checked);
  const count = values.filter(Boolean).length;
  document.querySelector('#checklist-count').textContent = `${count} / ${checkboxes.length} préparatifs terminés`;
  document.querySelector('#checklist-progress').style.width = `${count / checkboxes.length * 100}%`;
  if (save) {
    try { localStorage.setItem(checklistKey, JSON.stringify(values)); } catch {
      document.querySelector('#storage-note').textContent = 'Stockage indisponible : les coches ne seront pas conservées.';
    }
  }
}
checkboxes.forEach((checkbox) => checkbox.addEventListener('change', () => updateChecklist(true)));
updateChecklist();

document.querySelector('#euros').addEventListener('input', updateCurrency);
function updateCurrency() {
  const input = document.querySelector('#euros');
  const value = input.valueAsNumber;
  document.querySelector('#yen').textContent = input.validity.valid && Number.isFinite(value) && value >= 0
    ? `≈ ${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value * 185)} ¥`
    : 'Saisissez un montant entre 0 et 1 000 000 €.';
}
updateCurrency();

function updateCountdown() {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const remaining = Math.ceil((Date.UTC(2027, 4, 17) - today) / 86400000);
  document.querySelector('#countdown').textContent = remaining > 0 ? `J − ${remaining} avant le départ` : today <= Date.UTC(2027, 4, 29) ? 'Le voyage a commencé !' : 'Un voyage inoubliable';
}
updateCountdown();
setInterval(updateCountdown, 60000);

let printState;
window.addEventListener('beforeprint', () => {
  if (printState) return;
  printState = [...document.querySelectorAll('details')].map((element) => ({ element, open: element.open }));
  printState.forEach(({ element }) => { element.open = true; });
});
window.addEventListener('afterprint', () => {
  printState?.forEach(({ element, open }) => { element.open = open; });
  printState = undefined;
});
document.querySelectorAll('[data-print]').forEach((button) => button.addEventListener('click', () => window.print()));
