/*
 * Couvreur Proximité 34 — titres et descriptions des pages (balises <title> et meta description).
 * Règles contrôlées au build (scripts/build.mjs) :
 *  - titre de 50 à 60 caractères, au format « [Service] à [Ville] | Couvreur Proximité 34 » ;
 *  - description de 140 à 155 caractères, avec service, ville, bénéfice, « devis gratuit » et appel à l'action ;
 *  - aucun titre ni aucune description en double.
 * Clé : chemin de la page. Les pages en noindex n'ont pas besoin d'entrée.
 */

const MARQUE = " | Couvreur Proximité 34";
const t = (base) => base + MARQUE;
// Commune : la variante la plus complète qui tient dans les 60 caractères.
const tv = (ville, cp) =>
  [`Couvreur à ${ville} (${cp}), toiture`, `Couvreur à ${ville} (${cp})`, `Couvreur toiture à ${ville}`, `Couvreur à ${ville}`]
    .map(t)
    .find((x) => [...x].length <= 60);

export const META = {
  "/": {
    t: t("Couvreur à Frontignan, toiture (34)"),
    d: "Couvreur zingueur à Frontignan : fuites, tuiles cassées, réfection, démoussage et gouttières. Dépannage rapide à Sète et Balaruc. Devis gratuit, appelez.",
  },
  "/a-propos": {
    t: t("Votre couvreur zingueur à Frontignan"),
    d: "Couvreur Proximité 34, artisan couvreur zingueur à Frontignan : nos engagements, notre méthode et notre zone dans l'Hérault. Devis gratuit, contactez-nous.",
  },
  "/avis": {
    t: t("Avis clients, couvreur Frontignan"),
    d: "Avis des clients de Couvreur Proximité 34 à Frontignan après une réparation, une réfection ou un dépannage de toiture. Devis gratuit, demandez le vôtre.",
  },
  "/confidentialite": {
    t: t("Confidentialité du site, couvreur 34"),
    d: "Confidentialité chez Couvreur Proximité 34, couvreur à Frontignan : données des formulaires, durée de conservation, vos droits. Devis gratuit en ligne.",
  },
  "/mentions-legales": {
    t: t("Mentions légales du site, Hérault"),
    d: "Mentions légales de Couvreur Proximité 34, couvreur zingueur à Frontignan (Hérault) : éditeur, SIRET, hébergement, contact. Devis gratuit, appelez.",
  },
  "/contact": {
    t: t("Contacter un couvreur à Frontignan"),
    d: "Contactez Couvreur Proximité 34 à Frontignan au 06 66 61 50 17, par e-mail ou en ligne, pour un dépannage ou un rendez-vous. Devis gratuit et rapide.",
  },
  "/devis-toiture": {
    t: t("Devis toiture gratuit à Frontignan"),
    d: "Devis gratuit de couvreur à Frontignan et alentours : réfection, réparation, démoussage, zinguerie ou charpente. Faites votre demande en ligne.",
  },
  "/depannage-toiture": {
    t: t("Dépannage de toiture à Frontignan"),
    d: "Fuite, tuiles arrachées, dégâts d'orage à Frontignan et Sète : dépannage de toiture rapide, mise hors d'eau. Devis gratuit, appelez le 06 66 61 50 17.",
  },
  "/rendez-vous": {
    t: t("Rendez-vous couvreur à Frontignan"),
    d: "Rendez-vous pour un diagnostic de toiture à Frontignan et alentours : choisissez date et créneau, on confirme par téléphone. Devis gratuit après visite.",
  },
  "/zone-intervention": {
    t: t("Couvreur dans tout l'Hérault (34)"),
    d: "Couvreur basé à Frontignan, on intervient dans tout l'Hérault, du Bassin de Thau à Montpellier, Béziers, Agde et Lunel. Devis gratuit, appelez-nous.",
  },
  "/conseils": {
    t: t("Conseils toiture, couvreur Hérault"),
    d: "Fuite, tramontane, tuiles, démoussage, autorisations : les conseils d'un couvreur de Frontignan pour votre toiture. Devis gratuit, posez vos questions.",
  },
  "/conseils/demoussage-toiture-saison": {
    t: t("Démoussage, quelle saison choisir"),
    d: "Quand démousser sa toiture dans l'Hérault, automne ou printemps ? Erreurs à éviter, haute pression, hydrofuge : conseils de couvreur. Devis gratuit.",
  },
  "/conseils/fuite-toiture-que-faire": {
    t: t("Fuite de toiture, que faire"),
    d: "Fuite de toiture ? Les bons gestes en attendant le couvreur : sécurité, électricité, meubles, infos utiles. Dépannage à Frontignan, devis gratuit.",
  },
  "/conseils/refaire-ou-reparer-toiture": {
    t: t("Refaire ou réparer sa toiture"),
    d: "Réparer ou refaire sa toiture ? Usure des tuiles, liteaux, écran, réfection par pan : les critères d'un couvreur de l'Hérault. Devis gratuit et honnête.",
  },
  "/conseils/toiture-apres-tramontane": {
    t: t("Toiture après la tramontane"),
    d: "Après la tramontane : tuiles soulevées, rives, faîtage, gouttières. Ce qu'on vérifie du sol et ce qu'on confie au couvreur. Devis gratuit à Frontignan.",
  },
  "/conseils/travaux-toiture-autorisation-urbanisme": {
    t: t("Toiture et autorisations d'urbanisme"),
    d: "Déclaration préalable, permis, PLU, monuments historiques : les démarches en mairie avant vos travaux de toiture dans l'Hérault. Devis gratuit, appelez.",
  },
  "/conseils/tuile-canal-romane-mecanique": {
    t: t("Tuile canal, romane ou mécanique"),
    d: "Tuile canal, romane ou mécanique ? Pose, poids, aspect et contraintes locales dans l'Hérault pour bien choisir sa couverture. Devis gratuit, appelez-nous.",
  },

  /* ---- Services ---- */
  "/services/refection-toiture": {
    t: t("Réfection de toiture à Frontignan"),
    h1: "Réfection de toiture à Frontignan et alentours",
    d: "Réfection de toiture en tuiles canal, romanes ou mécaniques à Frontignan et Sète : écran, liteaux et faîtage neufs, tuiles posées à neuf. Devis gratuit.",
  },
  "/services/remplacement-tuiles": {
    t: t("Remplacement de tuiles à Frontignan"),
    h1: "Remplacement de tuiles cassées à Frontignan",
    d: "Tuile fendue, glissée ou envolée ? Remplacement de tuiles canal, romanes ou mécaniques à Frontignan et autour de Thau, pan révisé. Devis gratuit, appelez.",
  },
  "/services/recherche-de-fuite": {
    t: t("Recherche de fuite à Frontignan"),
    h1: "Recherche de fuite et réparation de toiture à Frontignan",
    d: "Tache au plafond, goutte qui tombe ? Recherche de fuite et réparation de toiture à Frontignan, Sète et Balaruc, solins compris. Devis gratuit, appelez.",
  },
  "/services/faitage-rives": {
    t: t("Faîtage et rives à Frontignan"),
    h1: "Réfection du faîtage et des rives de toiture à Frontignan",
    d: "Faîtières descellées, rives arrachées par la tramontane ? Réfection du faîtage, des rives et arêtiers à Frontignan et alentours. Devis gratuit, appelez.",
  },
  "/services/demoussage-toiture": {
    t: t("Démoussage de toiture à Frontignan"),
    h1: "Démoussage et traitement hydrofuge de toiture à Frontignan",
    d: "Démoussage et hydrofuge de toiture à Frontignan et Sète : mousses et lichens traités sans haute pression agressive. Devis gratuit, appelez-nous.",
  },
  "/services/zinguerie-gouttieres": {
    t: t("Zinguerie et gouttières à Frontignan"),
    h1: "Zinguerie et gouttières à Frontignan",
    d: "Gouttières en zinc, descentes, noues, solins et abergements posés ou réparés à Frontignan, Sète et alentours, nettoyage compris. Devis gratuit, appelez.",
  },
  "/services/charpente": {
    t: t("Réparation de charpente à Frontignan"),
    h1: "Réparation et renforcement de charpente à Frontignan",
    d: "Diagnostic et réparation de charpente bois à Frontignan : chevrons, pannes, liteaux, traitement insectes et champignons. Devis gratuit, appelez-nous.",
  },
  "/services/fenetre-de-toit": {
    t: t("Fenêtre de toit à Frontignan, pose"),
    h1: "Pose et remplacement de fenêtre de toit à Frontignan",
    d: "Pose ou remplacement de fenêtre de toit à Frontignan et dans l'Hérault, abergement et étanchéité adaptés à vos tuiles, sans fuite. Devis gratuit, appelez.",
  },
  "/services/isolation-toiture": {
    t: t("Isolation de toiture à Frontignan"),
    h1: "Isolation de toiture à Frontignan et alentours",
    d: "Isolation de toiture par l'extérieur, combles, pare-vapeur et ventilation à Frontignan : confort d'hiver et d'été. Devis gratuit, appelez-nous.",
  },
  "/services/etancheite-toit-terrasse": {
    t: t("Toit terrasse à Frontignan"),
    h1: "Étanchéité de toit terrasse à Frontignan",
    d: "Étanchéité de toit terrasse à Frontignan et dans l'Hérault : membrane bitumineuse ou EPDM, relevés et évacuations refaits. Devis gratuit, appelez.",
  },
  "/services/bachage-urgence": {
    t: t("Bâchage d'urgence à Frontignan"),
    h1: "Bâchage de toiture en urgence à Frontignan",
    d: "Toit ouvert après une tempête ou une chute de branche ? Bâchage d'urgence et mise hors d'eau rapide à Frontignan et dans l'Hérault. Devis gratuit, appelez.",
  },

  /* ---- Secteurs ---- */
  "/secteur/bassin-de-thau": {
    t: t("Couvreur à Sète et Bassin de Thau"),
    d: "Couvreur dans le Bassin de Thau : Sète, Balaruc, Mèze, Marseillan, Poussan. Réparation, réfection et dépannage de toiture depuis Frontignan. Devis gratuit.",
  },
  "/secteur/montpellier-metropole": {
    t: t("Couvreur à Montpellier Métropole"),
    d: "Couvreur à Montpellier, Lattes, Castelnau-le-Lez, Pérols et alentours : diagnostic et travaux de toiture sur rendez-vous depuis Frontignan. Devis gratuit.",
  },
  "/secteur/agde-pezenas": {
    t: t("Couvreur à Agde et Pézenas"),
    d: "Couvreur à Agde, au Cap d'Agde et à Pézenas : diagnostic, réparation et réfection de toiture planifiés sur rendez-vous. Devis gratuit, appelez-nous.",
  },
  "/secteur/biterrois": {
    t: t("Couvreur à Béziers et Biterrois"),
    d: "Couvreur à Béziers, Sérignan, Valras-Plage et dans le Biterrois : diagnostic et travaux de toiture sur rendez-vous planifié. Devis gratuit, appelez.",
  },
  "/secteur/lunellois": {
    t: t("Couvreur à Lunel et Lunellois"),
    d: "Couvreur à Lunel et dans le Lunellois : diagnostic, réparation et réfection de toiture sur rendez-vous, visites groupées depuis Frontignan. Devis gratuit.",
  },
  "/secteur/clermontais-lodevois": {
    t: t("Couvreur à Clermont et Lodève"),
    d: "Couvreur à Clermont-l'Hérault, Lodève et autour du Salagou : diagnostic et travaux de toiture sur rendez-vous planifié depuis Frontignan. Devis gratuit.",
  },
  "/secteur/hauts-cantons": {
    t: t("Couvreur à Bédarieux, Hauts cantons"),
    d: "Couvreur à Bédarieux et dans les Hauts cantons de l'Hérault : diagnostic, réparation et réfection de toiture sur rendez-vous. Devis gratuit, appelez.",
  },

  /* ---- Communes ---- */
  "/couvreur/frontignan": {
    t: tv("Frontignan", "34110"),
    d: "Couvreur à Frontignan (34110) : toitures du centre ancien, de La Peyrade et de Frontignan-Plage réparées ou refaites, intervention rapide. Devis gratuit.",
  },
  "/couvreur/sete": {
    t: tv("Sète", "34200"),
    d: "Couvreur à Sète (34200) : réparation de toiture, recherche de fuite et zinguerie face aux embruns, du quartier haut au Mont Saint-Clair. Devis gratuit.",
  },
  "/couvreur/agde": {
    t: tv("Agde", "34300"),
    d: "Couvreur à Agde (34300), du centre en pierre noire au Cap d'Agde : tuiles, zinguerie et toits terrasses réparés sur rendez-vous. Devis gratuit, appelez.",
  },
  "/couvreur/balaruc-le-vieux": {
    t: tv("Balaruc-le-Vieux", "34540"),
    d: "Couvreur à Balaruc-le-Vieux (34540) : toits du village circulaire et bac acier des zones d'activité, réparation et dépannage. Devis gratuit, appelez.",
  },
  "/couvreur/balaruc-les-bains": {
    t: tv("Balaruc-les-Bains", "34540"),
    d: "Couvreur à Balaruc-les-Bains (34540) : réparation, démoussage et entretien des toits des maisons et résidences de la station. Devis gratuit, appelez.",
  },
  "/couvreur/bedarieux": {
    t: tv("Bédarieux", "34600"),
    d: "Couvreur à Bédarieux (34600), dans les Hauts cantons : toitures pentues, tuiles et zinguerie réparées sur rendez-vous. Devis gratuit, appelez-nous.",
  },
  "/couvreur/beziers": {
    t: tv("Béziers", "34500"),
    d: "Couvreur à Béziers (34500), du vieux centre aux quartiers récents : tuiles, zinguerie et toits terrasses réparés sur rendez-vous. Devis gratuit, appelez.",
  },
  "/couvreur/castelnau-le-lez": {
    t: tv("Castelnau-le-Lez", "34170"),
    d: "Couvreur à Castelnau-le-Lez (34170) : réparation de toiture, zinguerie, démoussage et recherche de fuite pour villas et copropriétés. Devis gratuit.",
  },
  "/couvreur/clermont-l-herault": {
    t: tv("Clermont-l'Hérault", "34800"),
    d: "Couvreur à Clermont-l'Hérault (34800), cœur d'Hérault : toitures en tuiles canal et zinguerie réparées sur rendez-vous. Devis gratuit, appelez.",
  },
  "/couvreur/gigean": {
    t: tv("Gigean", "34770"),
    d: "Couvreur à Gigean (34770) : faîtages, rives et closoirs repris face à la tramontane, toits du centre ancien réparés. Devis gratuit au 06 66 61 50 17.",
  },
  "/couvreur/grabels": {
    t: tv("Grabels", "34790"),
    d: "Couvreur à Grabels (34790), au nord-ouest de Montpellier : tuiles, faîtages, gouttières et zinguerie des villas de la garrigue. Devis gratuit, appelez.",
  },
  "/couvreur/juvignac": {
    t: tv("Juvignac", "34990"),
    d: "Couvreur à Juvignac (34990) : tuiles, faîtages, gouttières et toits terrasses réparés, de Fontcaude au vieux village. Devis gratuit au 06 66 61 50 17.",
  },
  "/couvreur/lattes": {
    t: tv("Lattes", "34970"),
    d: "Couvreur à Lattes (34970), Port Ariane, Boirargues, Maurin : tuiles, gouttières et étanchéité des maisons proches du Lez réparées. Devis gratuit, appelez.",
  },
  "/couvreur/lodeve": {
    t: tv("Lodève", "34700"),
    d: "Couvreur à Lodève (34700), au pied du Larzac : toitures anciennes et zinguerie réparées face aux pluies cévenoles. Devis gratuit, appelez-nous.",
  },
  "/couvreur/lunel": {
    t: tv("Lunel", "34400"),
    d: "Couvreur à Lunel (34400) et dans le Lunellois : toitures et gouttières réparées sur rendez-vous, déplacement planifié. Devis gratuit, appelez-nous.",
  },
  "/couvreur/marseillan": {
    t: tv("Marseillan", "34340"),
    d: "Couvreur à Marseillan (34340), village et plage : tuiles, faîtages et zinguerie des maisons anciennes et résidences face au sel. Devis gratuit, appelez.",
  },
  "/couvreur/mauguio": {
    t: tv("Mauguio", "34130"),
    d: "Couvreur à Mauguio (34130) et Carnon : tuiles, zinguerie et toits terrasses réparés, du village circulaire au littoral. Devis gratuit, appelez-nous.",
  },
  "/couvreur/meze": {
    t: tv("Mèze", "34140"),
    d: "Couvreur à Mèze (34140), au bord de l'étang de Thau : tuiles canal, génoises et zinguerie des maisons du port et des lotissements. Devis gratuit, appelez.",
  },
  "/couvreur/mireval": {
    t: tv("Mireval", "34110"),
    d: "Couvreur à Mireval (34110) : charpente, réparation et réfection de toiture des maisons vigneronnes et de village au pays du muscat. Devis gratuit, appelez.",
  },
  "/couvreur/montbazin": {
    t: tv("Montbazin", "34560"),
    d: "Couvreur à Montbazin (34560), vallée de la Vène : toitures réparées après les orages d'automne, réfection et isolation. Devis gratuit, appelez-nous.",
  },
  "/couvreur/montpellier": {
    t: tv("Montpellier", "34000"),
    d: "Couvreur à Montpellier (34000), de l'Écusson aux quartiers récents : toitures, zinguerie et toits terrasses réparés. Devis gratuit, appelez-nous.",
  },
  "/couvreur/palavas-les-flots": {
    t: tv("Palavas-les-Flots", "34250"),
    d: "Couvreur à Palavas-les-Flots (34250) : zinguerie, tuiles et toits terrasses rongés par les embruns réparés, rive gauche et droite. Devis gratuit, appelez.",
  },
  "/couvreur/perols": {
    t: tv("Pérols", "34470"),
    d: "Couvreur à Pérols (34470), près des étangs : tuiles, gouttières et zinguerie des maisons, lotissements et locaux pros réparés. Devis gratuit, appelez.",
  },
  "/couvreur/pezenas": {
    t: tv("Pézenas", "34120"),
    d: "Couvreur à Pézenas (34120), centre historique et hôtels particuliers : toitures en tuiles canal réparées et restaurées. Devis gratuit, appelez-nous.",
  },
  "/couvreur/poussan": {
    t: tv("Poussan", "34560"),
    d: "Couvreur à Poussan (34560) : toits en tuiles canal du vieux village réparés avec réemploi des tuiles anciennes, recherche de fuite. Devis gratuit, appelez.",
  },
  "/couvreur/saint-gely-du-fesc": {
    t: tv("Saint-Gély-du-Fesc", "34980"),
    d: "Couvreur à Saint-Gély-du-Fesc (34980), au nord de Montpellier : toitures et zinguerie réparées sur rendez-vous planifié. Devis gratuit, appelez-nous.",
  },
  "/couvreur/saint-jean-de-vedas": {
    t: tv("Saint-Jean-de-Védas", "34430"),
    d: "Couvreur à Saint-Jean-de-Védas (34430) : entretien et réparation des toitures du village, des lotissements et des locaux pros. Devis gratuit, appelez.",
  },
  "/couvreur/serignan": {
    t: tv("Sérignan", "34410"),
    d: "Couvreur à Sérignan (34410), du village à Sérignan-Plage : tuiles, gouttières et zinguerie des maisons et villas réparées. Devis gratuit, appelez-nous.",
  },
  "/couvreur/valras-plage": {
    t: tv("Valras-Plage", "34350"),
    d: "Couvreur à Valras-Plage (34350), à l'embouchure de l'Orb : zinguerie, tuiles et toits terrasses exposés au sel réparés. Devis gratuit, appelez-nous.",
  },
  "/couvreur/vic-la-gardiole": {
    t: tv("Vic-la-Gardiole", "34110"),
    d: "Couvreur à Vic-la-Gardiole (34110) : gouttières et noues nettoyées, toits démoussés et réparés entre étang et pinède. Devis gratuit, appelez-nous.",
  },
  "/couvreur/villeneuve-les-maguelone": {
    t: tv("Villeneuve-lès-Maguelone", "34750"),
    d: "Couvreur à Villeneuve-lès-Maguelone (34750) : toitures, gouttières et solins exposés à l'air marin des étangs réparés, démoussage. Devis gratuit, appelez.",
  },
};

// Contrôle des règles : renvoie la liste des erreurs (vide si tout est conforme).
export function verifierMeta(cheminsIndexables) {
  const erreurs = [];
  const vusT = new Map();
  const vusD = new Map();
  for (const chemin of cheminsIndexables) {
    const m = META[chemin];
    if (!m) {
      erreurs.push(`${chemin} : titre et description absents de scripts/meta-seo.mjs`);
      continue;
    }
    const lt = [...m.t].length;
    const ld = [...m.d].length;
    if (lt < 50 || lt > 60) erreurs.push(`${chemin} : titre de ${lt} caractères (50 à 60) « ${m.t} »`);
    if (!m.t.endsWith(MARQUE)) erreurs.push(`${chemin} : le titre doit finir par « ${MARQUE.trim()} »`);
    if (ld < 140 || ld > 155) erreurs.push(`${chemin} : description de ${ld} caractères (140 à 155)`);
    if (!/devis gratuit/i.test(m.d)) erreurs.push(`${chemin} : « devis gratuit » absent de la description`);
    if (vusT.has(m.t)) erreurs.push(`${chemin} : titre identique à ${vusT.get(m.t)}`);
    if (vusD.has(m.d)) erreurs.push(`${chemin} : description identique à ${vusD.get(m.d)}`);
    vusT.set(m.t, chemin);
    vusD.set(m.d, chemin);
  }
  return erreurs;
}
