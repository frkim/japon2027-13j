# japon2027-13j
Circuit Merveilles du Japon - 17 au 29 mai 2027 · 13 jours / 10 nuits

Carnet de voyage public, responsive et sans mot de passe : 13 journées filtrables,
parcours interactif, 5 hébergements, vols Finnair, formalités, prestations et
conseils pratiques. Checklist enregistrée localement, convertisseur indicatif
euros/yens et impression de l’intégralité du carnet, même après filtrage.

## Développement

Node.js 22.12+ et npm sont nécessaires.
Le fichier `.npmrc` utilise le flux npm protégé Microsoft. Le workflow refuse les
sources de paquets qui ne passent pas par ce flux ou son miroir Azure Artifacts.

```sh
npm ci
npm run dev
```

```sh
node --check src/main.js
node --check src/data.js
npm run build
npm run preview
```

Il n’existait pas d’infrastructure de tests dans le dépôt. Le workflow vérifie
la syntaxe JavaScript et le build de production à chaque pull request.

Les données sont centralisées dans `src/data.js`, le rendu et les interactions
dans `src/main.js`, les styles responsive et d’impression dans `src/style.css`.
`dist/` et `node_modules/` ne sont pas versionnés.

## Déploiement Azure

Le workflow `.github/workflows/azure.yml` construit le site sur les pull requests.
Après fusion sur `main` (ou lancement manuel depuis `main`), il se connecte avec
le secret GitHub **`AZURE_CREDENTIALS`**, crée si nécessaire un groupe de ressources
et un compte Azure Storage, active son site web statique HTTPS et publie
uniquement `dist/`. Aucun identifiant n’est intégré à l’application.

Le secret doit contenir les identifiants JSON d’un principal de service Azure :
`clientId`, `clientSecret`, `subscriptionId`, `tenantId`. Ne les ajoutez jamais au
dépôt. Le principal doit pouvoir créer le groupe et le compte de stockage,
modifier la configuration du site et publier les blobs avec Microsoft Entra ID,
sans utiliser les clés du compte. Le rôle Contributor sur l’abonnement permet
le provisionnement initial ; pour limiter sa portée, créez d’abord le groupe et
attribuez le rôle à ce groupe. Attribuez aussi au principal le rôle
**Storage Blob Data Contributor** sur le compte de stockage avant la publication.
Un rôle Owner ou Contributor seul ne donne pas accès aux données des blobs.
Lors d’un premier provisionnement, l’attribution de ce rôle peut nécessiter un
second lancement du workflow, après propagation des autorisations.

Variables GitHub facultatives :

| Variable | Valeur par défaut |
| --- | --- |
| `AZURE_RESOURCE_GROUP` | `rg-japon2027-13j` |
| `AZURE_LOCATION` | `swedencentral` |
| `AZURE_STORAGE_ACCOUNT` | Nom stable calculé à partir du dépôt et de l’abonnement |

Un nom de compte personnalisé doit être unique dans Azure et contenir 3 à 24
lettres minuscules ou chiffres. Le workflow active l’accès réseau public requis
par le site et désactive l’authentification par clé partagée.
Le workflow ne supprime pas les ressources et peut occasionner des frais Azure.
Le site est volontairement public ; ne placez aucune donnée personnelle dans
ses sources. L’accès public anonyme aux conteneurs de blobs reste désactivé,
indépendamment du point de terminaison public du site statique.

L’URL `https://….web.core.windows.net/` est publiée dans le résumé du job et dans
l’environnement GitHub `production`. Une requête HTTP vérifie la publication.
Le premier déploiement nécessite que le secret existe et que les éventuelles
protections de l’environnement `production` soient approuvées.

## Contenu et visuels

Les informations fournies sont reprises sans inventer de visites ou de repas
confirmés. Les nuitées sont déduites de l’itinéraire et les suggestions sont
identifiées comme non incluses. Les formalités et les horaires doivent être
revérifiés avant le départ. La donnée électrique du dossier est conservée et
complétée par la correction de l’office du tourisme japonais :
[100 V, 50/60 Hz](https://www.japan.travel/en/plan/plug-and-electricity/).

Photos d’ambiance, pas des photos des hôtels : Osaka, Nara, Himeji, Hikone,
Kamakura et Tokyo ont été fournies pour le carnet ;
[Mont Fuji](https://images.unsplash.com/photo-1490806843957-31f4c9a91c65),
[Kyoto](https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e),
[ambiance urbaine à Tokyo](https://images.unsplash.com/photo-1519608487953-e999c86e7455) et
[temple](https://images.unsplash.com/photo-1478436127897-769e1b3f0f36)
proviennent d’Unsplash ([licence](https://unsplash.com/license)).
Photo du Mont-Koya : [663highland / Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Danjogaran_Koyasan12n3200.jpg),
[CC BY 2.5](https://creativecommons.org/licenses/by/2.5/) ; recadrée à l’affichage.
L’illustration SVG locale prend le relais si une photo échoue.
Les polices Google Fonts disposent de polices système de secours. Les photos
et polices distantes nécessitent une connexion ; les outils du carnet ne
dépendent d’aucun service tiers.
