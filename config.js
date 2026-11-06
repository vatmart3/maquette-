/*
 * ARVÉO — configuration du site.
 * Toutes les informations de l'entreprise sont ici. Après modification,
 * relancez :  node scripts/build.mjs   (régénère les pages, le sitemap et les données Google).
 * Les valeurs marquées « À CONFIRMER » doivent être vérifiées avec le client avant la mise en ligne.
 */
window.SITE = {
  nom: "ARVÉO",
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
    raisonSociale: "ARVÉO", // À CONFIRMER : forme juridique (EI, SARL…)
    siret: "000 000 000 00000", // À CONFIRMER
    assuranceDecennale: "Nom de l'assureur, n° de contrat", // À CONFIRMER
    directeurPublication: "Nom du dirigeant", // À CONFIRMER
    hebergeur: "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  },

  // Liens externes. La fiche Google Business Profile est le levier n°1 du référencement local.
  liens: {
    googleBusiness: "", // À CONFIRMER : lien de la fiche Google (sert au bouton « Voir nos avis »)
    avisGoogle: "", // À CONFIRMER : lien direct « Laisser un avis »
    facebook: "",
    instagram: "",
  },

  // Vrais avis Google à afficher (ne jamais publier d'avis inventés).
  // Exemple : { auteur: "Martine R.", ville: "Frontignan", note: 5, texte: "…", date: "2026-10" }
  avis: [],

  // Communes desservies : chaque commune a sa page « Couvreur à … » (contenu dans scripts/contenu.mjs).
  villes: [
    "Frontignan",
    "Sète",
    "Balaruc-les-Bains",
    "Balaruc-le-Vieux",
    "Vic-la-Gardiole",
    "Mireval",
    "Gigean",
    "Poussan",
    "Villeneuve-lès-Maguelone",
    "Montbazin",
  ],

  agence: { nom: "MJAGENCY", url: "https://mjagency.eu" },
};
