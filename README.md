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

## Plan de conception

### Idée
Le monde du client, pas un template : **le bleu de travail** (couleur de marque), **le cordeau traceur**
(accent jaune et trait de craie claqué, 2 fois sur tout le site) et **le bon d'intervention**
(le formulaire de devis, seul élément audacieux). Le reste est calme : fond plâtre, beaucoup d'air,
une seule famille typographique.

### Palette
| Rôle | Couleur | Contraste vérifié |
| --- | --- | --- |
| Fond | Plâtre `#E9ECE8` | — |
| Papier du bon, surfaces de lecture | Blanc `#FFFFFF` | — |
| Marque, boutons, bandeau d'appel | Bleu de travail `#2347A0` | blanc sur bleu 8,5:1 ; bleu sur plâtre 7,1:1 |
| Texte | Bleu nuit `#14213D` | 13,3:1 sur plâtre |
| Accent (cordeau, focus, mètre) | Jaune cordeau `#F2C230` | jamais pour du texte ; focus doublé d'un liseré bleu nuit |
| Texte secondaire | Gris ciment `#5F666D` | 4,9:1 sur plâtre ; 5,8:1 sur blanc |

### Typographie
Archivo variable, auto-hébergée (pas d'appel à Google au chargement, plus simple pour le RGPD).
- Titres : largeur 125 %, graisse 780–820, interlignage 1.02, approche −0,01 em.
- Texte : largeur 100 %, graisse 400, 18 px, interlignage 1.6, 65 caractères max.
- Échelle 1.25 en variables CSS (`--t-0` à `--t-8`), les titres descendent de deux crans sur mobile.

### Wireframes
**Accueil** — hero aligné à gauche (titre très large, cordeau claqué, texte court, un seul bouton
« Appeler le … ») + mini bon d'intervention incliné à −1° à droite (dessous sur mobile) →
« Ce qu'on fait » : liste verbe très large / phrase concrète → « Comment ça se passe » : mètre ruban
jaune gradué, 4 étapes dessous (vertical sur mobile) → un avis en grand, marqué « Exemple » →
villes en bloc typographique → bandeau bleu avec le numéro en très grand.

**Notre histoire** — titre large + cordeau (2ᵉ et dernier usage) → 3 paragraphes provisoires →
grand emplacement photo plâtre → 3 engagements (la promesse en titre, une phrase d'explication) → bandeau d'appel.

**Avis clients** — titre + avertissement « exemples » → un avis en très grand → 5 petits mots de
largeurs différentes, légèrement de travers, épinglés comme sur un tableau de chantier → bouton Google → bandeau d'appel.

**Contact** — titre court → le bon d'intervention pleine page : souche bleue perforée, numéro, date
du jour, cases à cocher dessinées au stylo, délai entouré à la main, lignes pointillées → cachet
« Demande reçue » à l'envoi. À côté : téléphone en grand, horaires, e-mail, zone, emplacement carte.

### Relecture « est-ce que ça irait à n'importe quel artisan ? » — ce qui a changé
1. **Menu mobile** : l'icône « hamburger » est remplacée par le mot « Menu ». Plus clair pour un public de 35–70 ans, moins template.
2. **Délai souhaité** : les boutons radio standards deviennent des mots qu'on **entoure au stylo** quand on les choisit, comme sur un vrai bon papier.
3. **Cases « Type de besoin »** : une croix tracée au stylo bleu au lieu d'une coche système.
4. **Emplacements photo** : au lieu de rectangles gris, un aplat plâtre avec un grain de plâtre et une légende ; ils ressemblent à un mur prêt à recevoir la photo.
5. **Engagements** : la première idée (trois icônes + texte) est supprimée ; la promesse elle-même est le titre.
6. **Téléphone dans l'en-tête** : pas d'icône de combiné, le numéro lui-même en caractères larges sur bleu de travail.
7. **Avis** : la grille de cartes identiques est remplacée par des petits mots de largeurs et d'inclinaisons différentes, sans ombre.
8. **Mention « Exemple »** : en minuscules, dans un cadre pointillé, jamais en petites capitales espacées.

### Accessoire retiré avant livraison
Le filet d'ombre dessiné le long du mètre ruban (une fausse « épaisseur » de bande) a été supprimé :
il n'apportait rien à la lecture des étapes. Les graduations et les numéros suffisent.

### Vérifications faites
- Captures Playwright à 1440, 390 et 360 px des 4 pages : aucun débordement horizontal.
- Formulaire : 6 messages d'erreur à l'envoi vide, focus sur le premier champ en erreur,
  cachet « Demande reçue » et message de confirmation à l'envoi.
- Pré-remplissage depuis le mini bon de l'accueil (ville retrouvée sans accents ni majuscules,
  ville hors liste basculée sur « Autre »).
- Un seul `h1` par page, tous les champs ont un label, toutes les images un `alt`,
  `noindex, nofollow` sur les 4 pages, JSON-LD présent.
