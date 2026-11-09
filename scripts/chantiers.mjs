/*
 * ARVÉO — réalisations (chantiers terminés).
 * Chaque chantier ajouté ici génère une fiche /realisations/<slug> au format « bon d'intervention »,
 * la page /realisations (filtrable par service et par commune), les liens dans le menu et le pied
 * de page, et les entrées du sitemap. Tant que la liste est vide, rien de tout cela n'est publié.
 *
 * Après modification : node scripts/build.mjs
 */

// Remplir uniquement avec de vrais chantiers
export const CHANTIERS = [
  // Exemple de structure (à recopier sans les // et à compléter avec un vrai chantier) :
  // {
  //   slug: "refection-toiture-sete-mont-saint-clair-2026",  // unique, minuscules et tirets
  //   commune: "sete",                       // slug de la commune (voir les pages /couvreur/…)
  //   service: "refection-toiture",          // slug du service (voir les pages /services/…)
  //   mois: 3, annee: 2026,                  // date de fin du chantier
  //   duree: "8 jours",                      // durée réelle du chantier
  //   maison: "Maison de ville mitoyenne, deux niveaux",
  //   materiaux: ["Tuiles canal de réemploi", "Écran sous-toiture HPV", "Liteaux traités"],
  //   probleme: "Infiltrations répétées au-dessus de la chambre, tuiles poreuses et liteaux affaissés.",
  //   travaux: ["Dépose de la couverture", "Remplacement de deux chevrons", "Pose d'un écran sous-toiture", "Repose en tuiles canal, faîtage scellé"],
  //   resultat: "Couverture étanche, combles ventilés, gouttières nettoyées.",
  //   photos: ["sete__refection-toiture__tuiles-canal-reposees.jpg"], // fichiers déposés dans photos/
  //   temoignage: { texte: "…", auteur: "M. D." }, // facultatif, uniquement un vrai témoignage, avec accord du client
  // },
];
