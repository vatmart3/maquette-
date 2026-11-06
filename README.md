# ARVÉO — site du couvreur zingueur de Frontignan

Site statique (HTML, CSS, JavaScript vanilla, Three.js 0.169.0 par CDN) + une fonction Vercel qui
envoie les formulaires par e-mail. Réalisé par MJAGENCY.

## Structure

| Fichier | Rôle |
| --- | --- |
| `config.js` | **Toutes les infos de l'entreprise** (téléphone, adresse, horaires, SIRET, liens Google…). Valeurs `// À CONFIRMER` à vérifier. |
| `scripts/contenu.mjs` | Textes des pages services, des 10 pages communes et des FAQ. |
| `scripts/build.mjs` | Génère les 26 pages HTML, `sitemap.xml`, `robots.txt` et les données structurées. |
| `api/demande.js` | Reçoit les formulaires et envoie l'e-mail au client (Resend). |
| `scene.js` | Animation 3D de la toiture (accueil). |
| `site.js`, `styles.css` | Script et styles communs. |

Après toute modification de `config.js` ou `scripts/contenu.mjs` :

```bash
node scripts/build.mjs
```

Le script liste ce qui reste à compléter avant la mise en ligne.

## Mise en ligne (Vercel)

```bash
npx vercel --prod
```

### Envoi des formulaires par e-mail

Les 5 formulaires (dépannage, devis, rendez-vous, rappel, contact) sont envoyés à `/api/demande`, qui
transmet un e-mail mis en page comme le bon « Demande de dépannage » (photos en pièces jointes,
bouton « Rappeler », objet marqué URGENT si besoin, adresse du client en « répondre à »).

1. Créer un compte gratuit sur [resend.com](https://resend.com) (3 000 e-mails/mois offerts).
2. Y vérifier le domaine `arveo.fr` (3 enregistrements DNS à ajouter chez le registrar).
3. Dans Vercel → Project → Settings → Environment Variables :
   - `RESEND_API_KEY` : la clé API Resend
   - `ARVEO_EMAIL_TO` : l'adresse qui reçoit les demandes (plusieurs possibles, séparées par des virgules)
   - `ARVEO_EMAIL_FROM` : `Site ARVÉO <site@arveo.fr>`
   - `ARVEO_ACCUSE` : `1` pour envoyer un accusé de réception au demandeur (facultatif)
4. Redéployer, puis faire une demande de test depuis le site.

Sans ces variables, le formulaire affiche un message d'erreur avec le téléphone et un lien
« envoyer par e-mail » déjà rédigé : aucune demande n'est perdue.

Protection anti-spam : champ piège invisible, envoi refusé en moins de 2 secondes, 6 envois maximum
par adresse IP toutes les 10 minutes, validation côté serveur.

## Référencement local (Frontignan et alentours)

Fait dans le site :
- Une page par commune (`/couvreur/frontignan`, `/couvreur/sete`…) avec un texte propre à chacune
  (quartiers, type de toitures, contraintes locales), et une page par service.
- Titres, descriptions et H1 uniques, ciblés « couvreur + commune » et « service + Frontignan ».
- Données structurées : `RoofingContractor` (adresse, GPS, horaires, zone desservie, catalogue de
  services), `Service`, `FAQPage`, `BreadcrumbList`, `WebSite`.
- Maillage interne : chaque page renvoie vers les communes, les services et les formulaires.
- `sitemap.xml`, `robots.txt`, URLs propres, canonical, Open Graph, balises géographiques.
- Site rapide (pas de framework ; la 3D se charge après le contenu, uniquement sur l'accueil).

**À faire par le client ou l'agence, indispensable pour être visible localement :**
1. **Fiche Google Business Profile** catégorie « Couvreur » à Frontignan : même nom, adresse et
   téléphone que sur le site (NAP identique), horaires, zone desservie, photos de chantiers.
   C'est le facteur n°1 du « pack local » Google Maps. Mettre son lien dans `config.liens.googleBusiness`.
2. **Avis Google** : demander un avis après chaque chantier. Les ajouter dans `config.avis` : la page
   Avis et la note moyenne (données structurées) s'activent automatiquement. Ne jamais inventer d'avis.
3. **Google Search Console** : ajouter le domaine et soumettre `https://arveo.fr/sitemap.xml`.
4. **Annuaires locaux** avec le même NAP : PagesJaunes, Bing Places, Apple Plans, Houzz, annuaire
   de la mairie de Frontignan, CMA Hérault.
5. **Photos réelles** de chantiers (avant/après) à ajouter sur les pages services et communes.
6. Remplacer le téléphone fictif, l'adresse exacte, le SIRET et l'assurance décennale dans `config.js`.

## Identité visuelle

Charte ARVÉO : bleu ardoise `#243746`, orange `#C65D28` (boutons en `#B9541F` pour le contraste AA
avec le blanc), blanc cassé `#F7F5F0`, gris clair `#E5E7EB`, anthracite `#1F2933`.
Manrope (titres), Inter (texte), DM Mono (données : téléphone, références). Logo « AV » redessiné en
vectoriel (`img/arveo-mark.svg`) d'après la planche de charte : à remplacer par le fichier source
officiel s'il existe.

## Animation 3D

Épure d'une toiture méditerranéenne en L : tuiles canal, faîtage et faîtières, rives, génoises,
noues en zinc, gouttières et descentes, cheminée avec solin, fenêtre de toit avec abergement,
charpente en écorché (chevrons, liteaux, pannes, ferme), mousses. À l'arrivée, un cordeau orange
claque et la toiture se trace ; au défilement, la caméra visite 5 zones (couverture, charpente,
zinguerie, étanchéité, démoussage), chacune avec sa fiche et un bouton « Devis pour ça ».
Image SVG de secours sans WebGL, animation coupée en `prefers-reduced-motion`.
