export const photos = {
  osaka: '/osaka.png',
  koya: '/mont-koya.jpg',
  nara: '/nara.png',
  himeji: '/himeji.png',
  hikone: '/hikone.png',
  kamakura: '/kamakura.png',
  tokyo: '/tokyo.png',
  fuji: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=2000&q=85',
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80',
  urban: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80',
  temple: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=900&q=80',
};

export const hotels = [
  { name: 'Hôtel Monastère Rengejo-In', city: 'Mont-Koya', nights: 1, dates: '18 → 19 mai', type: 'Nuit au monastère', image: photos.temple, note: 'Hébergement traditionnel : sanitaires communs, séparés entre hommes et femmes. Pas de chambre individuelle.' },
  { name: 'Vessel Hotel Campana Gojo 3*', city: 'Kyoto', nights: 3, dates: '19 → 22 mai', type: 'Hôtel · chambre double', image: photos.kyoto, note: 'Votre point de départ pour les étapes à Kyoto, Uji et Himeji.' },
  { name: 'Hôtel Jal City 3*', city: 'Nagoya', nights: 1, dates: '22 → 23 mai', type: 'Hôtel · chambre double', image: photos.urban, note: 'Une nuit à Nagoya après l’étape à Hikone.' },
  { name: 'Ryokan Ichinoyu Honkan 3*', city: 'Hakone', nights: 1, dates: '23 → 24 mai', type: 'Nuit en ryokan', image: photos.fuji, note: 'Hébergement traditionnel : sanitaires communs, séparés entre hommes et femmes. Prévoyez un petit sac pour la nuit.' },
  { name: 'Sunshine City Prince Ikebukuro 3*', city: 'Tokyo', nights: 4, dates: '24 → 28 mai', type: 'Hôtel · chambre double', image: photos.tokyo, note: 'Quatre nuits pour découvrir Tokyo, entre tradition et modernité.' },
];

export const days = [
  { day: 1, title: 'Le grand départ', route: 'Paris ✈ Osaka', tag: 'Transport', image: photos.osaka, alt: 'Rue animée de Shinsekai à Osaka, avec la tour Tsūtenkaku', distance: '', stay: 'Nuit en vol', text: 'Départ de Paris CDG avec Finnair. Escale à Helsinki avant de poursuivre vers Osaka.', items: ['AY1572 · Paris CDG 10h45 → Helsinki 14h40', 'AY0067 · Helsinki 17h45 → Osaka KIX 12h35 le 18 mai'], meals: 'Repas : selon les prestations aériennes.' },
  { day: 2, title: 'Une nuit hors du temps', route: 'Osaka › Mont-Koya', tag: 'Culture', image: photos.koya, alt: 'Pagode et temple du complexe Danjō Garan au Mont Koya', distance: '70 km / 2h', stay: hotels[0].name, text: 'Arrivée à Osaka à 12h35, puis route vers le Mont Koya. Le monastère bouddhiste est l’un des temps forts du circuit.', items: ['Installation au monastère', 'Petit sac conseillé : la valise reste dans la soute de l’autocar'], meals: 'Repas : non précisés dans les informations fournies.' },
  { day: 3, title: 'Sur les chemins de l’ancienne capitale', route: 'Mont-Koya › Nara › Kyoto', tag: 'Culture', image: photos.nara, alt: 'Temple Tōdai-ji se reflétant dans un étang à Nara', distance: '140 km / 4h40', stay: hotels[1].name, text: 'Départ du Mont-Koya, étape à Nara et arrivée à Kyoto pour trois nuits.', items: ['Étape à Nara', 'Installation à Kyoto'], meals: 'Déjeuner et dîner libres.' },
  { day: 4, title: 'L’âme de Kyoto', route: 'Kyoto', tag: 'Culture', image: photos.kyoto, alt: 'Paysage urbain traditionnel de Kyoto', distance: '', stay: hotels[1].name, text: 'Une journée à Kyoto, au cœur du Japon traditionnel, de ses temples et de ses sanctuaires.', items: ['Journée à Kyoto', 'Les sites précis et horaires ne sont pas détaillés dans le programme fourni'], meals: 'Déjeuner et dîner libres.' },
  { day: 5, title: 'Thé, traditions & châteaux', route: 'Kyoto › Uji › Himeji › Kyoto', tag: 'Culture', image: photos.himeji, alt: 'Château blanc de Himeji sous un ciel bleu', distance: '290 km / 4h20', stay: hotels[1].name, text: 'Une boucle au départ de Kyoto, avec des étapes à Uji et Himeji, avant de retrouver votre hôtel.', items: ['Étapes à Uji et Himeji', 'Retour à Kyoto pour la nuit'], meals: 'Déjeuner et dîner libres.' },
  { day: 6, title: 'D’une ville à l’autre', route: 'Kyoto › Hikone › Nagoya', tag: 'Culture', image: photos.hikone, alt: 'Château de Hikone et ses toits traditionnels', distance: '165 km / 2h30', stay: hotels[2].name, text: 'Le circuit se poursuit vers Hikone, puis Nagoya. Les châteaux historiques japonais font partie des points forts du voyage.', items: ['Étape à Hikone', 'Nuit à Nagoya'], meals: 'Dîner libre. Autres repas non précisés.' },
  { day: 7, title: 'À l’horizon, le Mont Fuji', route: 'Nagoya › Yaizu › Hakone', tag: 'Nature', image: photos.fuji, alt: 'Vue sur le Mont Fuji', distance: '300 km / 4h00', stay: hotels[3].name, text: 'Cap sur Yaizu puis Hakone, pour les paysages du Mont Fuji et une nuit en ryokan traditionnel. La visibilité du Fuji dépend de la météo.', items: ['Étape à Yaizu', 'Préparer un petit sac pour la nuit en ryokan'], meals: 'Déjeuner libre. Autres repas non précisés.' },
  { day: 8, title: 'De Kamakura à la ville électrique', route: 'Hakone › Kamakura › Tokyo', tag: 'Culture', image: photos.kamakura, alt: 'Grand Bouddha de Kamakura à ciel ouvert', distance: '111 km / 3h45', stay: hotels[4].name, text: 'Une étape à Kamakura avant de rejoindre Tokyo. Installation pour quatre nuits dans la capitale.', items: ['Étape à Kamakura', 'Installation à Ikebukuro, Tokyo'], meals: 'Déjeuner et dîner libres.' },
  ...[9, 10, 11].map((day) => ({
    day, title: ['Tokyo, mille contrastes', 'La capitale se dévoile', 'Encore un peu de Tokyo'][day - 9],
    route: 'Tokyo', tag: 'Ville', image: photos.tokyo, alt: 'Panorama nocturne de Tokyo et de la tour de Tokyo', distance: '',
    stay: hotels[4].name, text: 'Tokyo, entre tradition et modernité. Le détail des visites de cette journée n’est pas précisé dans les informations fournies.',
    items: ['Suggestion personnelle, non incluse : flâner dans les quartiers traditionnels ou contemporains', 'Horaires et visites à confirmer avec l’accompagnateur'],
    meals: 'Déjeuner libre. Dîner non précisé.',
  })),
  { day: 12, title: 'Sayonara, Japon', route: 'Tokyo ✈ Paris', tag: 'Transport', image: photos.tokyo, alt: 'Panorama nocturne de Tokyo et de la tour de Tokyo', distance: '', stay: 'Nuit en vol', text: 'Départ de Tokyo Narita en soirée pour Helsinki, puis correspondance vers Paris le lendemain.', items: ['AY0074 · Tokyo NRT 23h05 → Helsinki 05h55 le 29 mai'], meals: 'Repas : selon les prestations aériennes.' },
  { day: 13, title: 'Des souvenirs plein les valises', route: 'Arrivée à Paris', tag: 'Transport', image: photos.fuji, alt: 'Silhouette du Mont Fuji', distance: '', stay: 'Retour à la maison', text: 'Dernière correspondance à Helsinki et arrivée à Paris CDG à 09h40.', items: ['AY1571 · Helsinki 07h35 → Paris CDG 09h40'], meals: 'Repas : selon les prestations aériennes.' },
];

export const flights = [
  { number: 'AY1572', date: '17 mai 2027', from: 'Paris CDG', to: 'Helsinki', departure: '10h45', arrival: '14h40', next: '' },
  { number: 'AY0067', date: '17 mai 2027', from: 'Helsinki', to: 'Osaka KIX', departure: '17h45', arrival: '12h35', next: 'le 18 mai' },
  { number: 'AY0074', date: '28 mai 2027', from: 'Tokyo NRT', to: 'Helsinki', departure: '23h05', arrival: '05h55', next: 'le 29 mai' },
  { number: 'AY1571', date: '29 mai 2027', from: 'Helsinki', to: 'Paris CDG', departure: '07h35', arrival: '09h40', next: '' },
];

export const highlights = [
  ['temple', 'Une nuit au monastère', 'Le Mont Koya, un autre Japon.'],
  ['sun', 'Temples & sanctuaires UNESCO', 'Un patrimoine d’exception.'],
  ['castle', 'Châteaux historiques', 'Sur les traces du Japon impérial.'],
  ['mountain', 'Hakone & le Mont Fuji', 'Des paysages à couper le souffle.'],
  ['city', 'Tokyo, ville de contrastes', 'Entre tradition et modernité.'],
  ['compass', 'Un circuit complet accompagné', 'Les incontournables, en toute sérénité.'],
  ['pin', 'Les sites incontournables', 'Une traversée riche en découvertes.'],
  ['bowl', 'Culture & gastronomie', 'Goûter à l’art de vivre japonais.'],
];

export const included = [
  'L’assistance à l’aéroport le jour du départ',
  'Les vols Paris / Osaka / Tokyo / Paris sur vols réguliers',
  'Les taxes d’aéroport et taxes à la consommation',
  'Les transferts et transports en autocar climatisé (44 sièges / 40 personnes maximum)',
  'Le logement dans les hôtels mentionnés ou similaires',
  'Les repas mentionnés au programme',
  'Les services d’un guide francophone (repas, transports et hébergement du guide compris)',
  'Les visites mentionnées au programme et les droits d’entrée',
  'L’accès à tous les documents de voyage dématérialisés via une web appli',
  'La réunion d’information dans vos locaux',
  'L’assurance multirisques : assistance, responsabilité civile, frais médicaux, extension Covid-19, rapatriement et bagages',
  'La contribution à la neutralité carbone globale',
];

export const excluded = [
  'Les boissons pendant les repas (certains restaurants/hôtels servent de l’eau en carafe et du thé vert)',
  'Les repas libres : jours 3, 4, 5 et 8, déjeuner et dîner libres ; jour 6, dîner libre ; jour 7, déjeuner libre ; jours 9 à 11, déjeuner libre',
  'Les dépenses à caractère personnel',
  'Les suggestions au programme',
  'Les pourboires du guide et du chauffeur',
];

export const important = [
  ['Hébergements traditionnels', 'Ryokan, minshuku, hôtel « capsule » et monastère : salles de bains et toilettes communes, séparées entre hommes et femmes.'],
  ['Chambre individuelle', 'Non disponible dans les hébergements traditionnels ; les participants concernés seront regroupés selon leur sexe dans des chambres twin ou triple.'],
  ['Bagages', 'Les valises sont très difficilement transportables dans les hébergements traditionnels (escaliers très étroits, pas d’ascenseur, interdiction de faire rouler les valises sur le bois…). Prévoir un petit sac avec le nécessaire pour ces nuits ; la valise restera dans la soute de l’autocar.'],
  ['Tabac', 'Il est interdit de fumer dans la rue au Japon (tabac, vapotage, cigarette électronique…). Des espaces fumeurs existent (demander à l’accompagnateur) ; les restaurants sont souvent non-fumeurs.'],
  ['Photos', 'Certains sites interdisent les photos, merci de respecter les consignes.'],
  ['Allergies alimentaires', 'À signaler dès l’inscription. Les restaurants se réservent le droit de refuser de servir une personne allergique si cela n’a pas été prévu.'],
];

export const formalities = [
  ['Passeport', 'Valide au moins 6 mois après la fin du séjour. Selon le pays de transit, une durée de validité plus longue peut être exigée. Le CSE n’est pas responsable en cas de refus d’embarquement.'],
  ['Visa', 'Non requis pour les ressortissants français pour un séjour de moins de 90 jours. Les ressortissants d’autres nationalités doivent consulter leur consulat.'],
  ['Visit Japan Web', 'Il est conseillé de compléter les informations à l’avance pour faciliter les contrôles à l’arrivée.'],
  ['Données biométriques', 'À l’arrivée, tous les ressortissants étrangers (y compris les détenteurs d’un visa de retour) sont soumis à la prise d’empreintes digitales et d’une photo du visage.'],
  ['Conjoints', 'Fournir un avis d’imposition justifiant l’appartenance au même foyer fiscal.'],
  ['Conseil', 'Vérifiez votre passeport dès maintenant.'],
];

export const practical = [
  ['Santé', 'Aucune vaccination obligatoire, sauf en provenance de zones à risque (fièvre jaune). Recommandés : mise à jour DTP et ROR ; BCG souhaitable. Selon les conditions de voyage : typhoïde, méningite, hépatites A et B. Demandez conseil à votre médecin ou à un centre de vaccinations internationales. Une assurance couvrant frais médicaux, hospitalisation et rapatriement est vivement recommandée.'],
  ['Décalage horaire', '+7h en été / +8h en hiver par rapport à la France métropolitaine.'],
  ['Monnaie / change', 'Yen japonais (JPY), environ 1 JPY = 0,0054 € / 1 € = 185 JPY (avril 2026). Dans les grandes villes, les distributeurs acceptent les principales cartes internationales ; certaines banques proposent le change au guichet ou au distributeur avec une carte internationale.'],
  ['Courant électrique', 'Information fournie : 110-120 V, 60 Hz (prévoir un adaptateur). Attention : au Japon, le réseau est généralement de 100 V, à 50 Hz à l’est (Tokyo) et 60 Hz à l’ouest (Kyoto/Osaka), prises de type A/B. Vérifiez la compatibilité de vos appareils.'],
];

export const checklist = [
  'Vérifier la validité de mon passeport',
  'Signaler mes allergies dès l’inscription',
  'Préparer les informations Visit Japan Web',
  'Prévoir un adaptateur compatible avec le Japon',
  'Préparer un petit sac pour le monastère et le ryokan',
  'Vérifier mon assurance et mes documents de voyage',
];
