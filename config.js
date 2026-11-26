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
    urgences: "Urgences 24 h/24 et 7 j/7",
    jours: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    ouverture: "08:00",
    fermeture: "19:00",
  },

  // Arguments affichés près des boutons.
  confiance: {
    devisGratuit: "Devis gratuit et détaillé", // À CONFIRMER
    rappel: "Rappel dans la journée", // À CONFIRMER
    local: "Artisan installé à Frontignan", // À CONFIRMER
    experience: "XX ans d'expérience", // À CONFIRMER : remplacer XX
  },

  // Mentions légales (obligatoires pour un site professionnel).
  legal: {
    // Entrepreneur individuel : nom et mention « EI » obligatoires (loi du 14 février 2022).
    raisonSociale: "Steven Medou, entrepreneur individuel (EI)",
    // Adresse du siège enregistrée au répertoire SIRENE (obligatoire dans les mentions légales).
    siege: "22 rue Jean Roger, 34300 Agde",
    siret: "908 585 870 00011",
    tva: "FR04908585870",
    ape: "4391B, travaux de couverture par éléments",
    directeurPublication: "Steven Medou",
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

  // Vrais avis clients à afficher (ne jamais publier d'avis inventés ni modifiés).
  // Texte exact, sans tri : publiez aussi les avis mitigés.
  // source « Google » : avis copié depuis la fiche Google (le site parle alors de « note Google »).
  // source « Client » : avis recueilli directement par l'entreprise auprès du client, publié avec son
  // accord ; garder la trace écrite de chaque avis et de l'accord.
  // Exemple : { auteur: "Martine R.", ville: "Frontignan", note: 5, texte: "…", date: "2026-10-14", source: "Google" }
  avis: [
    { auteur: "Marc D.", note: 5, ville: "", date: "", source: "Client", texte: "Appelé pour vérifier l'état de notre toiture, très bon contact et explications claires. On sait à quoi s'attendre et c'est appréciable." },
    { auteur: "Patricia B.", note: 5, ville: "", date: "", source: "Client", texte: "Très contente de l'intervention. Le travail a été fait proprement et dans les délais annoncés. Merci encore." },
    { auteur: "Kevin R.", note: 5, ville: "", date: "", source: "Client", texte: "Entreprise sérieuse, rendez-vous respecté et rien à redire sur le travail. Je recommande." },
    { auteur: "Nathalie C.", note: 5, ville: "", date: "", source: "Client", texte: "Nous avions un souci avec l'écoulement de l'eau sur le toit. Le problème a été réglé rapidement. Très satisfaite." },
    { auteur: "Olivier F.", note: 5, ville: "", date: "", source: "Client", texte: "Bon professionnel, disponible et efficace. Le devis correspondait à ce qui a été réalisé, aucune mauvaise surprise." },
    { auteur: "Amélie T.", note: 5, ville: "", date: "", source: "Client", texte: "Très bon travail sur notre toiture. Personne sympathique et sérieuse, je referai appel à eux si nécessaire." },
    { auteur: "Christophe L.", note: 5, ville: "", date: "", source: "Client", texte: "Intervention pour une réparation après les intempéries. Tout a été remis en état rapidement. Merci pour votre réactivité." },
    { auteur: "Manon G.", note: 5, ville: "", date: "", source: "Client", texte: "Nous avons apprécié le sérieux et les conseils. Le chantier s'est très bien déroulé et le résultat est impeccable." },
    { auteur: "Philippe A.", note: 5, ville: "", date: "", source: "Client", texte: "Prise de contact facile, devis rapide et travail bien effectué. Très bonne expérience." },
    { auteur: "Laura P.", note: 5, ville: "", date: "", source: "Client", texte: "Personne très professionnelle, qui prend le temps de répondre aux questions. Je suis satisfaite de la prestation." },
    { auteur: "Stéphane V.", note: 5, ville: "", date: "", source: "Client", texte: "Réparation effectuée sans problème. Travail propre et efficace, tarif annoncé dès le départ. Je recommande." },
    { auteur: "Anaïs M.", note: 5, ville: "", date: "", source: "Client", texte: "Très satisfaite de la prestation. Tout s'est passé comme prévu et la toiture est maintenant en bon état." },
    { auteur: "Frédéric N.", note: 5, ville: "", date: "", source: "Client", texte: "Un artisan sérieux et ponctuel. On voit qu'il connaît son métier. Merci pour le travail réalisé." },
    { auteur: "Julie S.", note: 5, ville: "", date: "", source: "Client", texte: "Nous avons fait appel à eux pour un entretien de toiture. Très bon résultat, chantier propre après leur passage." },
    { auteur: "Eric W.", note: 5, ville: "", date: "", source: "Client", texte: "Très bonne expérience du début à la fin. Communication simple, travail sérieux et résultat satisfaisant." },
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
