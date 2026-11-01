import test from 'node:test';
import assert from 'node:assert/strict';
import { statSync } from 'node:fs';
import { days, hotels, photos } from './data.js';
import { mapPlaces, mapRoute } from './map-data.js';

test('markers have unique valid IDs, names, descriptions and Japan coordinates', () => {
  assert.ok(Array.isArray(mapPlaces) && mapPlaces.length > 0);
  assert.equal(new Set(mapPlaces.map(({ id }) => id)).size, mapPlaces.length);
  for (const place of mapPlaces) {
    assert.match(place.id, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
    assert.ok(typeof place.name === 'string' && place.name.trim().length > 0);
    assert.ok(typeof place.description === 'string' && place.description.trim().length > 0);
    assert.equal(place.coordinates.length, 2);
    const [lat, lng] = place.coordinates;
    assert.ok(Number.isFinite(lat) && lat >= 24 && lat <= 46, place.id);
    assert.ok(Number.isFinite(lng) && lng >= 123 && lng <= 146, place.id);
  }
});

test('categories and itinerary day references are valid', () => {
  const validDays = new Set(days.map(({ day }) => day));
  for (const place of mapPlaces) {
    assert.ok(['visit', 'excursion', 'stay'].includes(place.category), place.id);
    assert.ok(Array.isArray(place.days) && place.days.length > 0, place.id);
    assert.equal(new Set(place.days).size, place.days.length, place.id);
    for (const day of place.days) {
      assert.ok(Number.isInteger(day) && validDays.has(day), `${place.id}: J${day}`);
    }
    if (place.category !== 'stay') assert.equal(place.hotelIndex, undefined);
  }
});

test('all markers have descriptive images using existing public files or HTTPS URLs', () => {
  const publicRoot = new URL('../public/', import.meta.url);
  for (const place of mapPlaces) {
    assert.ok(typeof place.image === 'string' && place.image.trim().length > 0, place.id);
    assert.ok(typeof place.imageAlt === 'string' && place.imageAlt.trim().length > 0, place.id);
    if (place.image.startsWith('/')) {
      assert.ok(!place.image.startsWith('//'), place.id);
      const imageUrl = new URL(place.image.slice(1), publicRoot);
      assert.ok(imageUrl.href.startsWith(publicRoot.href), place.id);
      assert.ok(statSync(imageUrl).isFile(), place.id);
    } else {
      assert.equal(new URL(place.image).protocol, 'https:', place.id);
    }
  }
});

test('dedicated destination photos are reused without substituting other cities', () => {
  const photoIds = ['osaka', 'koya', 'nara', 'kyoto', 'himeji', 'hikone', 'kamakura', 'tokyo'];
  for (const id of photoIds) {
    const place = mapPlaces.find((entry) => entry.id === id);
    assert.equal(place.image, photos[id], id);
    assert.doesNotMatch(place.imageAlt, /illustration/i, id);
  }
});

test('cities without dedicated photos use an explicitly labeled landscape illustration', () => {
  for (const id of ['uji', 'nagoya', 'yaizu', 'hakone']) {
    const place = mapPlaces.find((entry) => entry.id === id);
    assert.equal(place.image, '/landscape.svg', id);
    assert.equal(place.imageAlt, `Illustration de paysage japonais pour l’étape à ${place.name}, et non une photographie de la ville`, id);
  }
});

test('geographic markers match all itinerary stops and their days', () => {
  const expected = {
    osaka: [2], koya: [2, 3], nara: [3], kyoto: [3, 4, 5, 6],
    uji: [5], himeji: [5], hikone: [6], nagoya: [6, 7], yaizu: [7],
    hakone: [7, 8], kamakura: [8], tokyo: [8, 9, 10, 11, 12],
  };
  const stops = mapPlaces.filter(({ category }) => category !== 'stay');
  assert.deepEqual(Object.fromEntries(stops.map(({ id, days }) => [id, days])), expected);
  const excursions = stops.filter(({ category }) => category === 'excursion');
  assert.deepEqual(excursions.map(({ id }) => id), [
    'nara', 'uji', 'himeji', 'hikone', 'yaizu', 'kamakura',
  ]);
  for (const place of excursions) assert.match(place.description, /Étape du circuit/);
});

test('five separate stays reference existing hotels and allocate every hotel night once', () => {
  const stays = mapPlaces.filter(({ category }) => category === 'stay');
  const expectedNights = [[2], [3, 4, 5], [6], [7], [8, 9, 10, 11]];
  const expectedDescriptions = [
    'Nuit de J2.',
    'Nuits de J3, J4 et J5.',
    'Nuit de J6.',
    'Nuit de J7.',
    'Nuits de J8, J9, J10 et J11.',
  ];
  assert.equal(stays.length, 5);
  assert.deepEqual(stays.map(({ hotelIndex }) => hotelIndex).sort((a, b) => a - b), [0, 1, 2, 3, 4]);
  for (const stay of stays) {
    assert.ok(Number.isInteger(stay.hotelIndex));
    const hotel = hotels[stay.hotelIndex];
    assert.ok(hotel, stay.id);
    assert.equal(stay.name, hotel.name);
    assert.equal(stay.image, hotel.image);
    assert.equal(stay.imageAlt, `Vue de l’établissement : ${hotel.name}`);
    assert.deepEqual(stay.days, expectedNights[stay.hotelIndex]);
    assert.equal(stay.days.length, hotel.nights);
    assert.equal(stay.description, expectedDescriptions[stay.hotelIndex]);
    for (const day of stay.days) {
      assert.equal(days.find((entry) => entry.day === day).stay, hotel.name);
    }
    for (const stop of mapPlaces.filter(({ category }) => category !== 'stay')) {
      assert.notDeepEqual(stay.coordinates, stop.coordinates, stay.id);
    }
  }
  const allocatedNights = stays.flatMap(({ days }) => days).sort((a, b) => a - b);
  assert.deepEqual(allocatedNights, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
});

test('flight nights and arrival home are not hotel stays or foreign map markers', () => {
  const nonHotelDays = days
    .filter(({ stay }) => !hotels.some(({ name }) => name === stay))
    .map(({ day }) => day);
  assert.deepEqual(nonHotelDays, [1, 12, 13]);
  for (const stay of mapPlaces.filter(({ category }) => category === 'stay')) {
    assert.ok(stay.days.every((day) => !nonHotelDays.includes(day)));
  }
  assert.ok(mapPlaces.every(({ days }) => !days.includes(1) && !days.includes(13)));
});

test('route references geographic markers in order and preserves the Kyoto return', () => {
  assert.ok(Array.isArray(mapRoute));
  const byId = new Map(mapPlaces.map((place) => [place.id, place]));
  for (const id of mapRoute) {
    assert.ok(byId.has(id), id);
    assert.notEqual(byId.get(id).category, 'stay', id);
  }
  assert.deepEqual(mapRoute, [
    'osaka', 'koya', 'nara', 'kyoto', 'uji', 'himeji', 'kyoto',
    'hikone', 'nagoya', 'yaizu', 'hakone', 'kamakura', 'tokyo',
  ]);
  assert.equal(mapRoute.filter((id) => id === 'kyoto').length, 2);
  assert.deepEqual(new Set(mapRoute), new Set(
    mapPlaces.filter(({ category }) => category !== 'stay').map(({ id }) => id),
  ));
});
