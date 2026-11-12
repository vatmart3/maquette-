/*
 * Couvreur Proximité 34 — configuration du site.
 * Toutes les informations de l'entreprise sont ici. Après modification,
 * relancez :  node scripts/build.mjs   (régénère les pages, le sitemap et les données Google).
 * Les valeurs marquées « À CONFIRMER » doivent être vérifiées avec le client avant la mise en ligne.
 * Tant qu'une ligne porte le commentaire « À CONFIRMER », sa valeur n'est PAS envoyée à Google
 * (données structurées JSON-LD). Une fois la vraie valeur saisie, supprimez le commentaire.
 */
window.SITE = {
  // Passez à true pour la mise en ligne définitive : le build échoue alors si une information
  // légale ou de contact est encore provisoire.
  production: false,

  nom: "Couvreur Proximité 34",
  activite: "Couvreur zingueur",
  slogan: "Couverture, zinguerie et dépannage de toiture",

  // Adresse du site (domaine définitif, sans « / » final). Sert aux liens canoniques et au sitemap.
  siteUrl: "https://arveo.fr", // À CONFIRMER

  telephone: "06 39 98 00 00", // À CONFIRMER : numéro fictif ARCEP, à remplacer par le vrai
  email: "contact@arveo.fr", // À CONFIRMER

  adresse: {
    rue: "", // À CONFIRMER : numéro et rue (laisser vide pour ne pas l'afficher)
    codePostal: "34110",
    ville: "Frontignan",
    region: "Occitanie",
    pays: "FR",
    // Coordonnées GPS de l'entreprise (par défaut : centre de Frontignan).
    latitude: 43.4483, // À CONFIRMER
    longitude: 3.7546, // À CONFIRMER
  },

  horaires: {
    texte: "Du lundi au samedi, de 8 h à 19 h", // À CONFIRMER
    jours: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    ouverture: "08:00",
    fermeture: "19:00",
  },

  // Arguments affichés près des boutons.
  confiance: {
    devisGratuit: "Devis gratuit et détaillé", // À CONFIRMER
    rappel: "Rappel dans la journée", // À CONFIRMER
    decennale: "Garantie décennale", // À CONFIRMER : nom de l'assureur à mettre dans les mentions légales
    local: "Artisan installé à Frontignan", // À CONFIRMER
    experience: "XX ans d'expérience", // À CONFIRMER : remplacer XX
  },

  // Mentions légales (obligatoires pour un site professionnel).
  legal: {
    raisonSociale: "Couvreur Proximité 34", // À CONFIRMER : forme juridique (EI, SARL…)
    siret: "000 000 000 00000", // À CONFIRMER
    assuranceDecennale: "Nom de l'assureur, n° de contrat", // À CONFIRMER
    directeurPublication: "Nom du dirigeant", // À CONFIRMER
    hebergeur: "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  },

  // Liens externes. La fiche Google Business Profile est le levier n°1 du référencement local.
  liens: {
    googleBusiness: "", // À CONFIRMER : lien de la fiche Google (sert au bouton « Voir nos avis »)
    avisGoogle: "", // À CONFIRMER : lien direct « Laisser un avis »
    facebook: "", // À CONFIRMER
    instagram: "", // À CONFIRMER
    pagesJaunes: "", // À CONFIRMER : lien de la fiche PagesJaunes
  },

  // Vrais avis Google à afficher (ne jamais publier d'avis inventés).
  // Copier le texte exact de l'avis Google, sans le modifier. Pas de tri : publiez aussi les avis mitigés.
  // Exemple : { auteur: "Martine R.", ville: "Frontignan", note: 5, texte: "…", date: "2026-10-14", source: "Google" }
  // Avis Google transmis par Couvreur Proximité 34, copiés tels quels. Date de publication à compléter (AAAA-MM-JJ) :
  // sans date, les avis sont affichés sur le site mais pas envoyés à Google (étoiles dans les résultats).
  avis: [
    { auteur: "Thomas M.", note: 5, ville: "Frontignan", date: "", source: "Google", texte: "Très bonne expérience. Intervention rapide pour une fuite sur notre toiture à Frontignan. Travail sérieux et prix correct." },
    { auteur: "Sophie L.", note: 4, ville: "", date: "", source: "Google", texte: "Bon travail dans l'ensemble. Le chantier a pris un peu plus de temps que prévu mais le résultat est satisfaisant." },
    { auteur: "Nicolas B.", note: 5, ville: "", date: "", source: "Google", texte: "Personne agréable et professionnelle. Il a pris le temps de nous expliquer les réparations à effectuer. Je recommande." },
    { auteur: "Julien P.", note: 4, ville: "", date: "", source: "Google", texte: "Devis reçu rapidement et tarif raisonnable pour le démoussage de notre toiture. Travail propre, rien à signaler." },
    { auteur: "Sandrine G.", note: 5, ville: "", date: "", source: "Google", texte: "Nous avons fait appel à Couvreur Proximité 34 pour un problème de gouttière. Intervention efficace et bons conseils pour la suite." },
    { auteur: "Mathieu D.", note: 4, ville: "", date: "", source: "Google", texte: "Satisfait de la réparation de notre toiture. Bon contact et travail sérieux. Je referai appel à eux si besoin." },
  ],

  // Services proposés : seuls ceux-ci ont une page et apparaissent dans les menus et les listes.
  // Retirez un slug pour masquer un service que l'entreprise ne propose pas.
  servicesActifs: [ // À CONFIRMER : liste des services réellement proposés
    "refection-toiture",
    "recherche-de-fuite",
    "remplacement-tuiles",
    "faitage-rives",
    "demoussage-toiture",
    "zinguerie-gouttieres",
    "fenetre-de-toit",
    "etancheite-toit-terrasse",
    "isolation-toiture",
    "charpente",
    "bachage-urgence",
  ],

  // Secteurs de l'Hérault desservis : chaque secteur a sa page /secteur/…, ses communes ont
  // leur page /couvreur/… (contenus dans scripts/secteurs.mjs et scripts/communes-herault.mjs).
  secteurs: [ // À CONFIRMER : secteurs réellement desservis
    "bassin-de-thau",
    "montpellier-metropole",
    "lunellois",
    "biterrois",
    "agde-pezenas",
    "clermontais-lodevois",
    "hauts-cantons",
  ],

  // Mesure d'audience sans cookie (pas de bandeau nécessaire). Laisser vide pour ne rien mesurer.
  // Plausible : { fournisseur: "plausible", domaine: "arveo.fr" }
  // Umami     : { fournisseur: "umami", id: "identifiant-du-site" }
  statistiques: { fournisseur: "", domaine: "", id: "" }, // À CONFIRMER

  // Informations complémentaires pour Google (omises tant qu'elles sont vides ou à confirmer).
  fondation: "", // À CONFIRMER : année de création, ex. "2021"
  gammePrix: "", // À CONFIRMER : ex. "€€"
  paiements: [], // À CONFIRMER : ex. ["Chèque", "Virement bancaire", "Carte bancaire", "Espèces"]

  agence: { nom: "MJAGENCY", url: "https://mjagency.eu" },
};
