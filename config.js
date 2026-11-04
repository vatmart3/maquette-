/*
 * Configuration du site — toutes les informations du client sont ici.
 * Remplacez les valeurs ci-dessous quand le client donne ses vraies infos :
 * en-tête, pied de page, numéros cliquables, listes de villes et données
 * structurées (JSON-LD) se mettent à jour automatiquement.
 */
window.SITE = {
  nom: "Multiservice Thau",

  // Numéro affiché (format français) — le lien tel: est calculé automatiquement.
  telephone: "06 39 98 00 00",

  email: "contact@multiservice-thau.fr",

  horaires: {
    texte: "Du lundi au samedi, de 8 h à 19 h",
    // Pour Google (JSON-LD) : jours en anglais, heures sur 24 h.
    jours: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    ouverture: "08:00",
    fermeture: "19:00",
  },

  // Zone d'intervention, dans l'ordre d'affichage.
  villes: [
    "Sète",
    "Frontignan",
    "Balaruc-les-Bains",
    "Balaruc-le-Vieux",
    "Mèze",
    "Marseillan",
    "Bouzigues",
    "Poussan",
    "Gigean",
    "Vic-la-Gardiole",
  ],

  // Adresse du site en ligne (pour les données structurées).
  siteUrl: "https://maquette-multiservice-thau.vercel.app",

  // Numéro imprimé sur le bon d'intervention.
  numeroBon: "0412",

  liens: {
    mentionsLegales: "#",
    avisGoogle: "#",
  },

  agence: {
    nom: "MJAGENCY",
    url: "https://mjagency.eu",
  },

  // Maquette : passez à false pour retirer le badge « Maquette réalisée par MJAGENCY ».
  maquette: true,
};
