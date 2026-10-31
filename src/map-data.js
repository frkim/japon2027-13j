import { hotels } from './data.js';

/**
 * Geographic itinerary markers, not verified attraction or hotel addresses.
 * Coordinates use [latitude, longitude]; days are itinerary day numbers.
 * `excursion` denotes an intermediate itinerary stop, not an optional purchase.
 * Stay days identify the evenings spent at hotels[hotelIndex].
 * @type {Array<{id: string, name: string, category: 'visit'|'excursion'|'stay', coordinates: [number, number], days: number[], description: string, hotelIndex?: number}>}
 */
export const mapPlaces = [
  {
    id: 'osaka', name: 'Osaka', category: 'visit',
    coordinates: [34.6937, 135.5023], days: [2],
    description: 'Arrivée à Osaka à J2, puis départ vers le Mont-Koya.',
  },
  {
    id: 'koya', name: 'Mont-Koya', category: 'visit',
    coordinates: [34.2125, 135.5865], days: [2, 3],
    description: 'Arrivée à J2 et départ à J3 après une nuit au monastère.',
  },
  {
    id: 'nara', name: 'Nara', category: 'excursion',
    coordinates: [34.6851, 135.8048], days: [3],
    description: 'Étape du circuit à J3 entre le Mont-Koya et Kyoto.',
  },
  {
    id: 'kyoto', name: 'Kyoto', category: 'visit',
    coordinates: [35.0116, 135.7681], days: [3, 4, 5, 6],
    description: 'Séjour de J3 à J6, avec retour à Kyoto après Uji et Himeji à J5.',
  },
  {
    id: 'uji', name: 'Uji', category: 'excursion',
    coordinates: [34.8845, 135.7997], days: [5],
    description: 'Étape du circuit à J5 dans la boucle Kyoto, Uji, Himeji, Kyoto.',
  },
  {
    id: 'himeji', name: 'Himeji', category: 'excursion',
    coordinates: [34.8151, 134.6853], days: [5],
    description: 'Étape du circuit à J5 avant le retour à Kyoto pour la nuit.',
  },
  {
    id: 'hikone', name: 'Hikone', category: 'excursion',
    coordinates: [35.2745, 136.2596], days: [6],
    description: 'Étape du circuit à J6 entre Kyoto et Nagoya.',
  },
  {
    id: 'nagoya', name: 'Nagoya', category: 'visit',
    coordinates: [35.1815, 136.9066], days: [6, 7],
    description: 'Arrivée à J6 pour une nuit, puis départ vers Yaizu à J7.',
  },
  {
    id: 'yaizu', name: 'Yaizu', category: 'excursion',
    coordinates: [34.8669, 138.3232], days: [7],
    description: 'Étape du circuit à J7 entre Nagoya et Hakone.',
  },
  {
    id: 'hakone', name: 'Hakone', category: 'visit',
    coordinates: [35.2324, 139.1069], days: [7, 8],
    description: 'Arrivée à J7 pour une nuit en ryokan, puis départ à J8.',
  },
  {
    id: 'kamakura', name: 'Kamakura', category: 'excursion',
    coordinates: [35.3192, 139.5467], days: [8],
    description: 'Étape du circuit à J8 entre Hakone et Tokyo.',
  },
  {
    id: 'tokyo', name: 'Tokyo', category: 'visit',
    coordinates: [35.6762, 139.6503], days: [8, 9, 10, 11, 12],
    description: 'Séjour à Tokyo de J8 à J12, avec quatre nuits avant le vol retour.',
  },
  {
    id: 'stay-koya', name: hotels[0].name, category: 'stay', hotelIndex: 0,
    coordinates: [34.2165, 135.584], days: [2],
    description: 'Repère approximatif au centre du Mont-Koya ; adresse à confirmer. Nuit de J2.',
  },
  {
    id: 'stay-kyoto', name: hotels[1].name, category: 'stay', hotelIndex: 1,
    coordinates: [34.996, 135.759], days: [3, 4, 5],
    description: 'Repère approximatif dans le quartier Gojo à Kyoto ; adresse à confirmer. Nuits de J3, J4 et J5.',
  },
  {
    id: 'stay-nagoya', name: hotels[2].name, category: 'stay', hotelIndex: 2,
    coordinates: [35.169, 136.891], days: [6],
    description: 'Repère approximatif dans le quartier Fushimi à Nagoya ; adresse à confirmer. Nuit de J6.',
  },
  {
    id: 'stay-hakone', name: hotels[3].name, category: 'stay', hotelIndex: 3,
    coordinates: [35.233, 139.093], days: [7],
    description: 'Repère approximatif dans le quartier Tonosawa à Hakone ; adresse à confirmer. Nuit de J7.',
  },
  {
    id: 'stay-tokyo', name: hotels[4].name, category: 'stay', hotelIndex: 4,
    coordinates: [35.729, 139.718], days: [8, 9, 10, 11],
    description: 'Repère approximatif dans le quartier Ikebukuro à Tokyo ; adresse à confirmer. Nuits de J8, J9, J10 et J11.',
  },
];

/** Place IDs in travel order; repeated Kyoto preserves the J5 return loop. */
export const mapRoute = [
  'osaka', 'koya', 'nara', 'kyoto', 'uji', 'himeji', 'kyoto',
  'hikone', 'nagoya', 'yaizu', 'hakone', 'kamakura', 'tokyo',
];
