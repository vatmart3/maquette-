# Couvreur Proximité 34 — référencement hors site

Le site est prêt techniquement. Ce qui fera la différence sur Google à partir d'ici se joue surtout
en dehors du code, à savoir la fiche Google, les avis, les citations locales et la régularité des
publications. Ce document est la feuille de route, dans l'ordre d'importance.

Règle d'or partout : **le même nom, la même adresse et le même téléphone (NAP)**, écrits exactement
comme dans `config.js` (« Couvreur Proximité 34 », « 34110 Frontignan », « 06 xx xx xx xx »).

---

## 1. Fiche Google Business Profile (priorité absolue)

1. Créer ou revendiquer la fiche sur business.google.com avec le compte Google de l'entreprise
   (pas un compte personnel d'employé).
2. Catégorie principale « Couvreur ». Catégories secondaires possibles, seulement si elles
   correspondent à une activité réelle : « Entreprise de zinguerie », « Entrepreneur en toiture »,
   « Service de réparation de toiture ».
3. Adresse. Si l'entreprise ne reçoit pas de clients à son local, masquer l'adresse et déclarer
   une **zone desservie** (communes et secteurs de `config.secteurs`, 20 zones maximum, en
   commençant par Frontignan, Sète, le Bassin de Thau et Montpellier).
4. Horaires identiques à ceux du site, lien vers `https://arveo.fr/`, lien de prise de rendez-vous
   vers `https://arveo.fr/rendez-vous`.
5. Services. Reprendre la liste exacte des pages services du site (même intitulés), avec une phrase
   chacun.
6. Photos. Logo, photo de couverture, photos de l'équipe et du véhicule, et surtout des photos
   **réelles** de chantiers, au moins 2 par mois. Ne jamais publier de photos de banque d'images.
7. Une fois la fiche validée :
   - copier son lien dans `config.liens.googleBusiness` ;
   - copier le lien direct « Demander des avis » dans `config.liens.avisGoogle` ;
   - retirer les commentaires `// À CONFIRMER` correspondants ;
   - relancer `node scripts/build.mjs`.
8. Publier un « post » Google tous les 15 jours (un chantier, un conseil de saison, un lien vers un
   article `/conseils/...`).

## 2. Annuaires et citations locales (NAP identique)

À créer ou corriger, dans cet ordre. Noter chaque identifiant dans un tableau partagé.

| Annuaire | Pourquoi |
| --- | --- |
| PagesJaunes / Solocal | le plus consulté en France, lien à mettre dans `config.liens.pagesJaunes` |
| Bing Places | alimente Bing et une partie des assistants vocaux, import possible depuis Google |
| Apple Business Connect (Plans) | visibilité sur iPhone |
| Annuaire des métiers de la CMA Occitanie | crédibilité artisan, lien d'un site institutionnel |
| Site de la mairie de Frontignan (annuaire des entreprises, si disponible) | lien local fort |
| Houzz, Habitatpresto, Travaux.com (fiche gratuite) | annuaires du bâtiment, à remplir sans payer d'option |
| Facebook (page entreprise) et Instagram | liens à mettre dans `config.liens` |
| Waze, Mappy, Hoodspot | cartographie |

Vérifier deux fois par an qu'aucune ancienne adresse ni ancien numéro ne traîne (recherche Google
du numéro entre guillemets).

## 3. Stratégie d'avis

- **Jamais** d'avis inventés, achetés, ou écrits par des proches. Pas de tri non plus (le
  « review gating ») : on demande un avis à **tous** les clients, satisfaits ou non.
- Demander l'avis **le jour de la fin du chantier**, en face à face, puis par SMS le soir même.
- Outil sur place, une **carte ou un autocollant NFC + QR code** au nom de Couvreur Proximité 34 qui ouvre
  `https://arveo.fr/avis/laisser`. Cette adresse redirige vers la page Google « Laisser un avis »
  dès que `config.liens.avisGoogle` est rempli. Si le lien Google change, il suffit de modifier
  la config, les cartes déjà distribuées restent valables.
- Modèle de SMS, à personnaliser :
  « Bonjour, merci pour votre confiance. Si vous avez deux minutes, votre avis aide beaucoup un
  artisan local comme nous. https://arveo.fr/avis/laisser Couvreur Proximité 34 »
- Répondre à **chaque** avis sous 48 h, positif ou négatif, en citant le type de travaux et la
  commune (« Merci pour votre confiance pour la réfection de votre toiture à Mèze »).
- Les vrais avis peuvent ensuite être copiés dans `config.avis` (texte exact, prénom ou initiale,
  commune, note, date). La page `/avis` et les données structurées s'activent alors seules.

## 4. Liens locaux (backlinks)

Viser la qualité et la proximité, jamais l'achat de liens.

- Partenaires de chantier (charpentiers, plombiers, électriciens, agences immobilières, syndics de
  Frontignan et Sète) : échange de recommandations sur leurs sites quand c'est naturel.
- Clubs sportifs et associations de Frontignan, Sète, Balaruc (sponsoring d'un maillot ou d'un
  tournoi, avec lien sur le site du club).
- Presse locale (Midi Libre, Hérault Tribune) pour un chantier remarquable, une rénovation dans un
  centre ancien ou une intervention après un épisode méditerranéen.
- Fournisseurs (négoces en matériaux de couverture) qui ont parfois une page « nos artisans ».
- Fédérations professionnelles si l'entreprise y adhère réellement (FFB Hérault, CAPEB Hérault).

## 5. Mesure et suivi

1. **Google Search Console** : ajouter le domaine `arveo.fr` (vérification DNS), soumettre
   `https://arveo.fr/sitemap.xml`. Suivre chaque mois les requêtes « couvreur + commune »
   et les pages qui montent.
2. **Bing Webmaster Tools** : importer depuis la Search Console, puis lancer
   `node scripts/indexnow.mjs` après chaque mise en ligne importante (voir README).
3. **Statistiques sans cookie** : renseigner `config.statistiques` (Plausible ou Umami). Les clics
   sur « Appeler », « Dépannage », « Devis », « Rendez-vous » et les formulaires envoyés remontent
   automatiquement comme événements.
4. **Indicateurs à suivre chaque mois**, dans un tableau simple :
   - nombre d'appels venant du site et de la fiche Google ;
   - formulaires reçus (dépannage, devis, rendez-vous) ;
   - nombre d'avis et note moyenne ;
   - positions sur « couvreur Frontignan », « couvreur Sète », « couvreur Montpellier » et
     « réparation toiture Hérault ».

## 6. Calendrier éditorial sur 6 mois (2 articles par mois)

Les articles s'ajoutent dans `scripts/articles.mjs` (même structure que les 6 premiers), puis
`node scripts/build.mjs`. Chaque article doit renvoyer vers au moins 4 pages du site et ne promettre
ni délai, ni prise en charge d'assurance, ni montant d'aide.

| Mois | Article 1 | Article 2 |
| --- | --- | --- |
| Mois 1 | Gouttière qui déborde, causes et solutions avant l'automne | Fenêtre de toit qui fuit, les vraies causes |
| Mois 2 | Épisode méditerranéen, préparer sa toiture avant les pluies d'automne | Faîtage scellé ou faîtage à sec, comment choisir |
| Mois 3 | Toit terrasse qui fuit, comprendre les relevés d'étanchéité | Isoler sa toiture pour le confort d'été dans l'Hérault |
| Mois 4 | Acheter une maison ancienne, contrôler la toiture avant de signer | Copropriété et toiture, qui décide et qui paie |
| Mois 5 | Zinc, alu ou PVC pour les gouttières en bord de mer | Tuiles poreuses, quand traiter et quand remplacer |
| Mois 6 | Toiture et pins, chenilles processionnaires, aiguilles et gouttières | Bilan de toiture au printemps, la liste de contrôle |

Rythme conseillé : publier le mardi, relayer le jour même en « post » sur la fiche Google et sur
Facebook, et ajouter le lien du nouvel article dans un article plus ancien du même sujet.
