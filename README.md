# Maquette — Multiservice Thau (v3 « la maison tracée au cordeau »)

Maquette de site vitrine (4 pages) réalisée par MJAGENCY pour une entreprise multiservice du Bassin de Thau.
HTML, CSS et JavaScript vanilla + Three.js 0.169.0 (import map jsDelivr), sans étape de build.

## Remplacer les infos du client

Tout est dans **`config.js`** : nom, téléphone, WhatsApp, e-mail, horaires, villes, arguments de confiance
(marqués `// À CONFIRMER`), numéro de bon, liens. En-tête, barre d'actions mobile, pied de page, liens
`tel:` et WhatsApp, listes de villes et données structurées (JSON-LD) en découlent.

Restent écrits en dur dans les HTML : `<title>`, `meta description`, balises Open Graph, textes des avis
d'exemple, des questions de la FAQ et de la page Notre histoire.

## Lancer en local

```bash
npx serve .
```

## Déployer

```bash
npx vercel --prod
```

---

## Plan

### Palette
| Rôle | Couleur | Contraste vérifié |
| --- | --- | --- |
| Fond | Plâtre `#E9ECE8` | — |
| Bon, fiches, surfaces de lecture | Blanc papier `#FFFFFF` | — |
| Marque, traits de la maison, boutons, bandeau | Bleu de travail `#2347A0` | blanc sur bleu 8,5:1 ; bleu sur plâtre 7,1:1 |
| Texte | Bleu nuit `#14213D` | 13,3:1 sur plâtre |
| Cordeau, zone allumée, focus | Jaune cordeau `#F2C230` | jamais pour du texte ; focus doublé de bleu nuit |
| Texte secondaire | Gris ciment `#5F666D` | 4,9:1 sur plâtre ; 5,8:1 sur blanc |

Au-dessus de la 3D : la maison est dessinée en traits fins de 1,5 px ; tout bloc de texte qui la croise
repose sur un fond plâtre ou papier (opacité ≥ 0,9), donc le contraste reste celui du tableau.

### Typographie
Archivo variable auto-hébergée (`font-display: swap`). Titres en largeur 125 %, graisse 780–820,
interlignage 1,02 ; texte en largeur 100 %, 18 px, interlignage 1,6, 65 caractères max.
Échelle 1,25 en variables CSS (`--t--1` à `--t-8`).

### Wireframes
- **Accueil** — hero à gauche (titre très large, un bouton « Appeler », lien WhatsApp, 3 coches de confiance)
  + mini bon incliné à droite, maison 3D en arrière-plan à droite → **Visite de la maison** (section collante
  de 4 écrans, une fiche épinglée par zone reliée à la maison par un trait jaune, indicateur 4 traits)
  → mètre ruban (4 étapes) → avis (1 grand + 2 petits) → FAQ en accordéon → villes en bloc typographique
  → bandeau bleu (numéro géant + WhatsApp).
- **Notre histoire** — titre large, 3 paragraphes provisoires, grand emplacement photo plâtre,
  3 engagements (promesse + explication), bandeau d'appel.
- **Avis clients** — titre + avertissement « exemples », un avis géant, 5 petits mots épinglés de largeurs
  différentes, bouton Google, bandeau d'appel.
- **Contact** — bon d'intervention pleine largeur en 3 étapes (Le besoin, Où et quand, Vos coordonnées)
  avec progression en haut, cachet « Demande reçue » ; à côté : téléphone géant, WhatsApp, horaires,
  e-mail, zone, emplacement carte.

### Plans de caméra
| Plan | Moment | Caméra |
| --- | --- | --- |
| Intro | Arrivée sur l'accueil (2,5 s, 1,5 s mobile) | Face, à hauteur d'homme : le cordeau traverse l'écran, claque, la maison se trace |
| Hero | Haut de l'accueil | Trois-quarts avant gauche, maison décalée dans la moitié droite |
| Dedans | Visite, zone 1 | Face à la façade, cadrage serré sur les fenêtres et l'escalier intérieur |
| Dehors | Visite, zone 2 | Côté gauche : terrasse sous pergola, olivier, muret |
| Petits travaux | Visite, zone 3 | Au ras du portillon : volets, boîte aux lettres, gouttière |
| Pour les pros | Visite, zone 4 | Trois-quarts avant droit sur le local commercial et son store |
| Vue large | Après la visite, jusqu'au pied de page | Recul en plongée, maison discrète (opacité 0,3) |
| Pages intérieures | Toute la page | Lent travelling latéral lié au scroll, opacité 0,3, sans intro |

### Relecture « est-ce que ça irait à n'importe quel artisan ? » — ce qui a changé
1. La maison était au départ une maison générique (toit à deux pans pentu, cheminée) : elle devient une
   maison du Bassin de Thau — toit de tuiles canal à faible pente, volets battants, pergola sur la terrasse,
   olivier, cyprès, muret bas avec portillon, et un petit local commercial à store pour les pros.
2. Les fiches de la visite devaient être des cartes flottantes : ce sont des étiquettes de chantier
   épinglées, reliées à la maison par un fil jaune, comme un cordeau tendu entre la fiche et la zone.
3. L'intro prévoyait une simple ligne qui se dessine : elle devient le geste réel du métier
   (le cordeau se tend, vibre, claque, la poudre retombe), et ce trait devient le sol de la maison.
4. La barre d'actions mobile devait être trois boutons identiques : « Appeler » est plein (le plus urgent),
   les deux autres sont en papier.
5. Les étapes du formulaire ne sont pas des onglets : ce sont les rubriques d'un même bon, avec une
   progression imprimée en haut, comme un carnet.
