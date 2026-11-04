# Maquette — Multiservice Thau

Maquette de site vitrine (4 pages) réalisée par MJAGENCY pour une entreprise multiservice du Bassin de Thau.
HTML, CSS et JavaScript sans framework ni étape de build.

## Remplacer les infos du client

Tout est dans **`config.js`** : nom, téléphone, e-mail, horaires, villes, numéro de bon, liens.
Les en-têtes, pieds de page, numéros cliquables, listes de villes et données structurées (JSON-LD)
sont générés à partir de ce fichier.

Les seules valeurs écrites en dur dans les fichiers HTML sont les balises `<title>`, `meta description`
et Open Graph (lues par les moteurs et les réseaux sociaux sans exécuter le JavaScript) :
un rechercher/remplacer de « Multiservice Thau » suffit.

## Lancer en local

```bash
npx serve .
```

(`serve` gère les adresses propres `/contact`, comme Vercel avec `cleanUrls`.)

## Déployer

```bash
npx vercel --prod
```

---

## Direction artistique (v2, « atelier soigné »)

Refonte demandée après la première maquette : plus arrondie, plus colorée, plus « pro »,
dans l'esprit du site MCI Sète réalisé par l'agence, tout en gardant l'univers bricolage.

- **Couleurs** : bleu de travail `#2347A0` en grands aplats (accroche, têtes de page, bandeau d'appel),
  jaune chantier `#F2C230` réservé aux boutons d'action (texte bleu nuit dessus, 9:1),
  bleu nuit `#14213D` (barre de contact, pied de page), blanc et gris-bleu `#F2F5FA` en alternance.
- **Typographie** : Barlow Semi Condensed pour les titres, Barlow pour le texte (auto-hébergées, licence OFL dans `fonts/`).
- **Formes** : coins arrondis (8 / 12 / 18 / 26 px), cartes blanches à filet fin, ombres douces pour ce qui flotte.
- **Repères du métier** : logo maison + trait de cordeau jaune, mètre ruban pour les 4 étapes,
  graduations en filigrane au pied des bandeaux bleus, bon d'intervention à souche jaune perforée
  et cachet « Demande reçue » à l'envoi.
- **Carte** : schéma de l'étang de Thau dessiné en SVG, communes placées d'après leurs coordonnées GPS
  (générée depuis la liste `villes` de `config.js`).
- **Mobile** : barre fixe en bas « Appeler / Devis gratuit », toujours sous le pouce.

### Vérifications faites
- Captures Playwright à 1440, 390 et 360 px des 4 pages : aucun débordement horizontal, aucune erreur JavaScript.
- Formulaire : 6 messages d'erreur à l'envoi vide, focus sur le premier champ en erreur,
  cachet « Demande reçue » et message de confirmation à l'envoi (desktop et mobile).
- Pré-remplissage depuis le mini bon de l'accueil (ville retrouvée sans accents ni majuscules,
  ville hors liste basculée sur « Autre »).
- Un seul `h1` par page, tous les champs ont un label, toutes les images un `alt`,
  `noindex, nofollow` sur les 4 pages, JSON-LD présent.
