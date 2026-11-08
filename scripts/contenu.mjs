/*
 * ARVÉO — contenus des pages (services, communes, FAQ).
 * Chaque page a un texte qui lui est propre : c'est ce qui permet à Google de
 * la positionner sur « couvreur + commune » sans contenu dupliqué.
 * Après modification : node scripts/build.mjs
 */

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export const SERVICES = [
  {
    slug: "refection-toiture",
    nom: "Réfection de toiture",
    court: "Réfection de toiture",
    zone: 0,
    title: "Réfection de toiture à Frontignan | Couvreur ARVÉO",
    description:
      "Réfection de toiture en tuiles canal, romanes ou mécaniques à Frontignan, Sète et alentours. Écran sous-toiture, liteaux et faîtage neufs, devis gratuit.",
    h1: "Réfection de toiture à Frontignan et alentours",
    chapo:
      "Quand les tuiles deviennent poreuses, que les fuites reviennent et que les liteaux fatiguent, les réparations ne suffisent plus. On refait la couverture, en totalité ou par pan.",
    sections: [
      {
        h2: "Quand faut-il refaire sa toiture ?",
        p: [
          "Une toiture en tuiles bien entretenue dure longtemps, mais elle finit par s'user. Les tuiles deviennent poreuses et gélives, les liteaux pourrissent, le mortier du faîtage se fissure. Sous le soleil et les embruns du littoral, ce vieillissement est plus rapide côté mer.",
        ],
        liste: [
          "Des fuites qui reviennent malgré les réparations",
          "Des tuiles qui glissent, se cassent ou se décolorent par plaques",
          "Un toit qui ondule, signe de liteaux ou de chevrons affaissés",
          "Des traces d'humidité dans les combles après chaque orage",
        ],
      },
      {
        h2: "Ce que comprend une réfection",
        p: [
          "On dépose l'ancienne couverture, on contrôle la charpente, puis on reconstruit couche par couche. Les tuiles en bon état peuvent être triées et réemployées, notamment les tuiles canal anciennes, très recherchées.",
        ],
        liste: [
          "Dépose des tuiles et des anciens liteaux, évacuation des gravats",
          "Contrôle et, si besoin, remplacement des chevrons abîmés",
          "Pose d'un écran sous-toiture respirant (HPV) contre les infiltrations",
          "Nouveaux liteaux et contre-liteaux traités",
          "Couverture en tuiles canal, romanes ou mécaniques selon votre maison",
          "Faîtage, rives et arêtiers scellés ou posés à sec, closoirs ventilés",
          "Reprise des solins, de la noue et des abergements",
        ],
      },
      {
        h2: "Des matériaux adaptés au climat méditerranéen",
        p: [
          "Entre la tramontane, le vent marin chargé de sel et les épisodes méditerranéens d'automne, une couverture autour de l'étang de Thau doit être bien fixée et bien ventilée. On choisit avec vous le type de tuile, la fixation (crochets, colle, vis) et l'écran adaptés à l'exposition de votre toit.",
        ],
      },
    ],
    faq: [
      {
        q: "Combien de temps dure une réfection de toiture ?",
        r: "Pour une maison individuelle, comptez généralement de quelques jours à deux semaines selon la surface, l'accès et la météo. La durée exacte est indiquée sur le devis.",
      },
      {
        q: "Peut-on refaire un seul pan de toit ?",
        r: "Oui. Si un seul versant est abîmé, on peut le refaire en raccordant proprement le faîtage et les rives. On vous le dit franchement après la visite.",
      },
      {
        q: "Faut-il une autorisation pour refaire sa toiture ?",
        r: "À l'identique, une déclaration préalable n'est en général pas nécessaire. Si vous changez de matériau, de couleur ou de pente, ou en secteur protégé, renseignez-vous en mairie. On vous aide à préparer le dossier.",
      },
    ],
  },
  {
    slug: "recherche-de-fuite",
    nom: "Recherche de fuite et réparation",
    court: "Fuite de toiture",
    zone: 3,
    title: "Recherche de fuite et réparation de toiture à Frontignan | ARVÉO",
    description:
      "Tache au plafond, goutte qui tombe ? Recherche de fuite et réparation de toiture à Frontignan, Sète et Balaruc, sur tuiles, solins, cheminées et fenêtres de toit.",
    h1: "Recherche de fuite et réparation de toiture",
    chapo:
      "Une tache au plafond n'est pas toujours sous la tuile cassée, car l'eau chemine. On trouve l'origine de la fuite avant de réparer, pour ne pas payer deux fois.",
    sections: [
      {
        h2: "Les causes de fuite les plus fréquentes",
        liste: [
          "Tuile cassée, glissée ou soulevée par le vent",
          "Solin fissuré au pied d'une cheminée ou d'un mur",
          "Abergement de fenêtre de toit mal raccordé",
          "Noue encrassée ou zinc percé",
          "Faîtage dont le mortier s'est désagrégé",
          "Gouttière bouchée qui déborde sous la génoise",
        ],
      },
      {
        h2: "Notre méthode",
        p: [
          "On inspecte d'abord les combles pour repérer les traces d'eau, puis la couverture depuis l'extérieur. Au besoin, on arrose la zone suspecte pour reproduire la fuite. Vous recevez un compte rendu avec photos et un prix avant toute réparation.",
          "Si la pluie menace, on met d'abord la toiture hors d'eau (bâchage), puis on revient faire la réparation définitive.",
        ],
      },
      {
        h2: "Réparations courantes",
        liste: [
          "Remplacement de tuiles et révision d'un pan",
          "Réfection de solins et d'abergements",
          "Reprise du faîtage et des rives",
          "Changement d'une noue en zinc",
          "Étanchéité autour des sorties de toit et des fenêtres de toit",
        ],
      },
    ],
    faq: [
      {
        q: "Mon assurance peut-elle prendre en charge la réparation ?",
        r: "Après une tempête ou un orage, souvent oui. On vous remet des photos et un devis détaillé à joindre à votre déclaration de sinistre.",
      },
      {
        q: "Que faire en attendant votre passage ?",
        r: "Placez une bassine sous la goutte, éloignez les objets de valeur et coupez l'électricité de la pièce si l'eau approche d'un luminaire. Ne montez pas sur le toit.",
      },
    ],
  },
  {
    slug: "demoussage-toiture",
    nom: "Démoussage et traitement hydrofuge",
    court: "Démoussage",
    zone: 4,
    title: "Démoussage de toiture à Frontignan et Sète | ARVÉO",
    description:
      "Démoussage et traitement hydrofuge de toiture autour de Frontignan. Mousses, lichens et tuiles poreuses traités sans haute pression agressive. Devis gratuit.",
    h1: "Démoussage et traitement hydrofuge de toiture",
    chapo:
      "La mousse retient l'eau, soulève les tuiles et bouche les gouttières. Un démoussage régulier prolonge nettement la durée de vie de votre couverture.",
    sections: [
      {
        h2: "Pourquoi démousser ?",
        p: [
          "Les versants nord, les toits ombragés par les pins et ceux qui regardent l'étang restent humides plus longtemps, et les mousses et lichens s'y installent. Leurs racines s'infiltrent sous les tuiles, gardent l'humidité et favorisent la casse au moindre gel.",
        ],
      },
      {
        h2: "Comment on procède",
        liste: [
          "Brossage manuel des mousses, sans haute pression qui abîme les tuiles",
          "Application d'un traitement anti-mousse qui agit plusieurs mois",
          "Remplacement des tuiles cassées repérées pendant le nettoyage",
          "Nettoyage des gouttières et des descentes",
          "En option, traitement hydrofuge pour limiter la porosité des tuiles",
        ],
      },
      {
        h2: "À quelle fréquence ?",
        p: [
          "Selon l'exposition, un traitement tous les quatre à six ans suffit le plus souvent. On vous dit honnêtement s'il est utile ou s'il peut attendre.",
        ],
      },
    ],
    faq: [
      {
        q: "Le traitement hydrofuge est-il indispensable ?",
        r: "Non. Il est utile sur des tuiles devenues poreuses. Sur une couverture récente ou en bon état, un simple démoussage suffit.",
      },
      {
        q: "Peut-on démousser soi-même ?",
        r: "C'est possible sur un petit appentis accessible, mais la circulation sur une toiture est dangereuse et casse facilement les tuiles. Pour une maison, faites appel à un couvreur équipé.",
      },
    ],
  },
  {
    slug: "zinguerie-gouttieres",
    nom: "Zinguerie et gouttières",
    court: "Zinguerie",
    zone: 2,
    title: "Zinguerie et gouttières à Frontignan | Couvreur zingueur ARVÉO",
    description:
      "Pose et réparation de gouttières en zinc, descentes, noues, solins et abergements à Frontignan, Sète et alentours. Nettoyage de gouttières. Devis gratuit.",
    h1: "Zinguerie et gouttières",
    chapo:
      "Gouttières, descentes, noues et solins conduisent l'eau loin de vos murs. Quand elle fatigue, ce sont les façades et les fondations qui prennent.",
    sections: [
      {
        h2: "Nos travaux de zinguerie",
        liste: [
          "Gouttières pendantes en zinc, aluminium ou PVC",
          "Descentes d'eaux pluviales, coudes et dauphins",
          "Noues et chéneaux en zinc",
          "Solins et bandes de rive",
          "Abergements de cheminée et de fenêtre de toit",
          "Nettoyage et débouchage des gouttières",
        ],
      },
      {
        h2: "Les signes qui doivent alerter",
        liste: [
          "De l'eau qui déborde en coulée sur la façade",
          "Une gouttière qui penche ou se décroche",
          "Des traces vertes ou noires sous la génoise",
          "Une descente qui goutte aux raccords",
        ],
      },
      {
        h2: "Le zinc, le bon choix près de la mer",
        p: [
          "Le zinc vieillit bien, se répare et se soude. Près du littoral, on soigne les fixations et la pente des gouttières pour que l'eau et le sable n'y stagnent pas.",
        ],
      },
    ],
    faq: [
      {
        q: "À quelle fréquence nettoyer ses gouttières ?",
        r: "Au moins une fois par an, idéalement après la chute des aiguilles de pin et avant les pluies d'automne.",
      },
      {
        q: "Réparer ou remplacer une gouttière ?",
        r: "Un joint ou un crochet se répare. Une gouttière percée sur plusieurs mètres ou mal pentée se remplace. On vous montre l'état réel en photos.",
      },
    ],
  },
  {
    slug: "charpente",
    nom: "Réparation et renforcement de charpente",
    court: "Charpente",
    zone: 1,
    title: "Réparation de charpente à Frontignan | Couvreur ARVÉO",
    description:
      "Diagnostic et réparation de charpente bois à Frontignan et alentours. Chevrons, pannes, liteaux et traitement contre insectes et champignons. Devis gratuit.",
    h1: "Réparation et renforcement de charpente",
    chapo:
      "La charpente porte toute la couverture. Chevron fendu, panne affaissée ou bois attaqué, on la contrôle et on la répare avant de reposer les tuiles.",
    sections: [
      {
        h2: "Ce qu'on vérifie",
        liste: [
          "Les chevrons, les pannes et la panne faîtière",
          "Les fermes, avec leurs arbalétriers, entrait et poinçon",
          "Les liteaux et voliges sous la couverture",
          "La présence d'insectes (capricornes, vrillettes) ou de champignons",
          "Les traces d'eau et d'humidité",
        ],
      },
      {
        h2: "Nos interventions",
        liste: [
          "Remplacement ou doublage de chevrons",
          "Renforcement de pannes affaissées",
          "Traitement préventif et curatif du bois",
          "Reprise de la charpente lors d'une réfection de toiture",
        ],
      },
      {
        h2: "Charpente et couverture, un seul interlocuteur",
        p: [
          "Une charpente abîmée se découvre souvent en refaisant le toit. Comme on gère les deux, vous n'attendez pas un second artisan. Le chantier continue et la maison reste hors d'eau.",
        ],
      },
    ],
    faq: [
      {
        q: "Comment savoir si ma charpente est attaquée ?",
        r: "Sciure au sol des combles, petits trous dans le bois, bois qui s'effrite sous la pointe d'un tournevis sont des signes à faire vérifier.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Communes                                                            */
/* ------------------------------------------------------------------ */

export const VILLES = [
  {
    nom: "Frontignan",
    cp: "34110",
    lat: 43.4483,
    lng: 3.7546,
    intro:
      "ARVÉO est installé à Frontignan. Du centre ancien à La Peyrade, en passant par Frontignan-Plage, on intervient sur toutes les toitures de la commune, souvent dans la journée pour une urgence.",
    texte: [
      "Le centre historique compte beaucoup de maisons de ville mitoyennes couvertes en tuiles canal, avec génoises et faîtages scellés. Ces toitures se réparent dans les règles, en réemployant les tuiles anciennes quand c'est possible.",
      "À Frontignan-Plage, les villas sont exposées au vent marin et aux embruns, si bien que fixations, zinguerie et solins y vieillissent plus vite. À La Peyrade, entre l'étang et Sète, on rencontre aussi des bâtiments plus récents en tuiles mécaniques et des toitures de garages ou d'annexes.",
    ],
    accent: "Couvreur de proximité, intervention rapide sur toute la commune",
    faq: [
      {
        q: "Intervenez-vous à Frontignan-Plage et à La Peyrade ?",
        r: "Oui, partout sur la commune de Frontignan, du centre-ville à La Peyrade, Frontignan-Plage et les quartiers résidentiels.",
      },
    ],
  },
  {
    nom: "Sète",
    cp: "34200",
    lat: 43.4028,
    lng: 3.6928,
    intro:
      "Couvreur à Sète pour la réparation de toiture, la recherche de fuite et la zinguerie. Quartier haut, Mont Saint-Clair, bords des canaux ou corniche, on se déplace depuis Frontignan voisine.",
    texte: [
      "À Sète, le vent marin et le sel attaquent les fixations, les gouttières et les solins plus vite qu'ailleurs. Les maisons du quartier haut et les immeubles anciens du centre ont souvent des toitures en tuiles canal sur des charpentes d'origine, qu'il faut contrôler avant toute réfection.",
      "Les rues étroites et les pentes du Mont Saint-Clair demandent d'organiser l'accès avec échafaudage, monte-matériaux ou nacelle, et autorisation de voirie quand c'est nécessaire. On s'en occupe avec vous.",
    ],
    accent: "Zinguerie et fixations renforcées face aux embruns",
    faq: [
      {
        q: "Vous occupez-vous des autorisations pour un échafaudage à Sète ?",
        r: "On vous indique les démarches et on prépare les informations nécessaires pour la demande d'occupation du domaine public auprès de la mairie.",
      },
    ],
  },
  {
    nom: "Balaruc-les-Bains",
    cp: "34540",
    lat: 43.4419,
    lng: 3.6775,
    intro:
      "Couvreur à Balaruc-les-Bains pour la réparation de toiture, le démoussage et la zinguerie des maisons, résidences et locations de la station thermale.",
    texte: [
      "Beaucoup de logements de Balaruc-les-Bains accueillent des curistes ou des vacanciers. On organise les interventions entre deux locations pour ne pas bloquer votre calendrier, et on vous envoie des photos une fois le travail terminé.",
      "Au bord de l'étang de Thau, l'humidité favorise les mousses sur les versants nord. Un démoussage régulier et des gouttières dégagées évitent bien des infiltrations.",
    ],
    accent: "Interventions planifiées entre deux locations",
    faq: [
      {
        q: "Pouvez-vous intervenir sans que je sois sur place ?",
        r: "Oui, si l'accès extérieur est possible. On convient ensemble des modalités et on vous envoie un compte rendu avec photos.",
      },
    ],
  },
  {
    nom: "Balaruc-le-Vieux",
    cp: "34540",
    lat: 43.4628,
    lng: 3.6853,
    intro:
      "Couvreur à Balaruc-le-Vieux, du village circulaire aux zones d'activité, pour la réparation, la réfection, la zinguerie et le dépannage.",
    texte: [
      "Dans le vieux village, les maisons mitoyennes serrées autour de l'église ont des toitures imbriquées, et chaque reprise de faîtage ou de noue doit se raccorder proprement à celle du voisin.",
      "Côté zones commerciales et artisanales, on intervient aussi sur les toitures de locaux professionnels, y compris en bac acier, pour des réparations rapides qui ne gênent pas votre activité.",
    ],
    accent: "Maisons de village et locaux professionnels",
    faq: [
      {
        q: "Intervenez-vous sur des toitures en bac acier ?",
        r: "Oui, pour la réparation, l'étanchéité des recouvrements et le remplacement de plaques sur des bâtiments professionnels.",
      },
    ],
  },
  {
    nom: "Vic-la-Gardiole",
    cp: "34110",
    lat: 43.4889,
    lng: 3.7967,
    intro:
      "Couvreur à Vic-la-Gardiole, entre les étangs et le massif de la Gardiole, pour la réparation de toiture, le nettoyage des gouttières et le démoussage.",
    texte: [
      "Les maisons proches de la pinède de la Gardiole reçoivent leur lot d'aiguilles de pin, qui bouchent les gouttières et les noues, et l'eau finit par déborder sous la génoise. Un nettoyage avant les pluies d'automne évite la plupart des dégâts.",
      "Côté étangs, l'humidité favorise mousses et lichens. On propose un démoussage manuel suivi d'un traitement, sans haute pression qui fragilise les tuiles.",
    ],
    accent: "Gouttières et noues dégagées avant les pluies d'automne",
    faq: [
      {
        q: "Proposez-vous un entretien annuel des gouttières ?",
        r: "Oui, on peut passer chaque année à la même période pour nettoyer les gouttières et contrôler la couverture.",
      },
    ],
  },
  {
    nom: "Mireval",
    cp: "34110",
    lat: 43.5089,
    lng: 3.8008,
    intro:
      "Couvreur à Mireval pour les toitures de maisons de village, de mas et d'anciennes remises viticoles au pays du muscat.",
    texte: [
      "Les anciennes maisons vigneronnes de Mireval ont souvent de grandes toitures sur charpente traditionnelle. Avant de refaire la couverture, on contrôle chevrons et pannes, car une charpente saine fait une toiture qui ne bouge pas.",
      "Pour les remises et dépendances, on propose aussi des réparations simples et économiques pour remettre le bâtiment hors d'eau.",
    ],
    accent: "Charpentes traditionnelles et grandes toitures",
    faq: [
      {
        q: "Pouvez-vous réparer une vieille remise sans tout refaire ?",
        r: "Oui. Révision de la couverture, remplacement des tuiles cassées et reprise ponctuelle de la charpente suffisent souvent.",
      },
    ],
  },
  {
    nom: "Gigean",
    cp: "34770",
    lat: 43.4994,
    lng: 3.7106,
    intro:
      "Couvreur à Gigean, au pied du massif de la Gardiole, pour la réparation, la réfection et l'entretien des toitures du village et ses quartiers résidentiels.",
    texte: [
      "Gigean mêle maisons anciennes du centre et lotissements plus récents en tuiles romanes ou mécaniques. Sur ces toitures récentes, les problèmes viennent surtout du faîtage et des rives, plus exposés à la tramontane.",
      "On contrôle les fixations, on reprend les faîtages posés à sec et on vérifie les closoirs pour garder une couverture bien ventilée.",
    ],
    accent: "Faîtages et rives exposés à la tramontane",
    faq: [
      {
        q: "Des tuiles se sont envolées après un coup de vent, que faire ?",
        r: "Appelez-nous ou faites une demande de dépannage en ligne. On met la toiture hors d'eau, puis on remplace les tuiles et on renforce les fixations.",
      },
    ],
  },
  {
    nom: "Poussan",
    cp: "34560",
    lat: 43.4889,
    lng: 3.6714,
    intro:
      "Couvreur à Poussan pour la réparation, la recherche de fuite et la réfection des toitures des maisons du vieux village et des quartiers proches de l'étang de Thau.",
    texte: [
      "Le centre ancien de Poussan compte de nombreuses maisons en pierre aux toitures anciennes en tuiles canal. On privilégie le réemploi des tuiles d'origine pour garder le caractère du village.",
      "Les épisodes méditerranéens d'automne mettent ces couvertures à l'épreuve. Une révision avant l'automne permet de repérer les tuiles glissées et les solins fissurés.",
    ],
    accent: "Réemploi des tuiles anciennes du vieux village",
    faq: [
      {
        q: "Conservez-vous les tuiles anciennes ?",
        r: "Quand elles sont saines, oui. On les trie, on les nettoie et on les repose, en complétant si besoin avec des tuiles de récupération.",
      },
    ],
  },
  {
    nom: "Villeneuve-lès-Maguelone",
    cp: "34750",
    lat: 43.5325,
    lng: 3.8603,
    intro:
      "Couvreur à Villeneuve-lès-Maguelone, entre Montpellier et la mer, pour la réparation de toiture, la zinguerie et le démoussage.",
    texte: [
      "Entre étangs et littoral, les toitures de Villeneuve-lès-Maguelone subissent l'humidité et le vent marin. Gouttières et solins sont les premiers points à surveiller.",
      "On intervient aussi bien sur les maisons du centre que sur les quartiers récents, pour un dépannage ponctuel comme pour un entretien régulier.",
    ],
    accent: "Zinguerie et entretien face à l'air marin",
    faq: [
      {
        q: "Vous déplacez-vous jusqu'à Villeneuve-lès-Maguelone pour une petite réparation ?",
        r: "Oui. On peut regrouper plusieurs petites interventions en une seule visite pour limiter les frais.",
      },
    ],
  },
  {
    nom: "Montbazin",
    cp: "34560",
    lat: 43.5167,
    lng: 3.6967,
    intro:
      "Couvreur à Montbazin, dans la vallée de la Vène, pour la réparation, la réfection et l'entretien des toitures du village et ses environs.",
    texte: [
      "Les maisons anciennes de Montbazin ont des toitures à faible pente en tuiles canal. Après les orages violents d'automne, on vérifie les tuiles déplacées, les faîtages et les noues.",
      "Pour une réfection, on étudie avec vous l'isolation de la toiture au moment des travaux, le bon moment pour poser un écran sous-toiture.",
    ],
    accent: "Révision des toitures après les orages d'automne",
    faq: [
      {
        q: "Faites-vous une visite de contrôle après un orage ?",
        r: "Oui, prenez rendez-vous pour un diagnostic. On contrôle la couverture et on vous dit ce qui doit être réparé, sans engagement.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* FAQ de l'accueil                                                    */
/* ------------------------------------------------------------------ */

export const FAQ_ACCUEIL = [
  {
    q: "Intervenez-vous en urgence après une fuite ou un coup de vent ?",
    r: "Oui. Appelez-nous ou remplissez la demande de dépannage en ligne. On vous rappelle au plus vite et on met la toiture hors d'eau avant la réparation définitive.",
    lien: { href: "/depannage-toiture", texte: "Faire une demande de dépannage" },
  },
  {
    q: "Le devis est-il gratuit ?",
    r: "Oui. On passe voir la toiture, on vous remet un devis écrit et détaillé, et vous décidez ensuite. Rien n'est facturé sans votre accord.",
    lien: { href: "/devis-toiture", texte: "Demander un devis" },
  },
  {
    q: "Ma toiture doit-elle être refaite ou simplement réparée ?",
    r: "Tout dépend de l'état des tuiles, des liteaux et de la charpente. Après un diagnostic sur place, on vous dit franchement si une réparation suffit.",
    lien: { href: "/rendez-vous", texte: "Prendre rendez-vous pour un diagnostic" },
  },
  {
    q: "Faut-il démousser sa toiture ?",
    r: "La mousse retient l'eau et soulève les tuiles. Un démoussage tous les quatre à six ans selon l'exposition suffit le plus souvent.",
    lien: { href: "/services/demoussage-toiture", texte: "Le démoussage en détail" },
  },
  {
    q: "Êtes-vous assuré ?",
    r: "Nos travaux de couverture sont couverts par une assurance décennale. Ses références figurent sur chaque devis et dans les mentions légales.",
    lien: { href: "/a-propos", texte: "En savoir plus sur ARVÉO" },
  },
  {
    q: "Dans quelles communes intervenez-vous ?",
    r: "À Frontignan et dans les communes voisines, à Sète, Balaruc-les-Bains, Balaruc-le-Vieux, Vic-la-Gardiole, Mireval, Gigean, Poussan, Villeneuve-lès-Maguelone et Montbazin.",
    lien: { href: "/zone-intervention", texte: "Voir la zone d'intervention" },
  },
];

export const FAQ_DEPANNAGE = [
  {
    q: "Que faire en attendant le couvreur ?",
    r: "Placez une bassine sous la fuite, protégez meubles et appareils, et coupez l'électricité de la pièce si l'eau approche d'un luminaire ou d'une prise. Ne montez jamais sur un toit mouillé.",
  },
  {
    q: "Pouvez-vous bâcher la toiture ?",
    r: "Oui. En cas de fuite importante ou de tuiles arrachées, on pose une bâche de protection pour mettre la maison hors d'eau, puis on programme la réparation.",
  },
  {
    q: "Mon assurance habitation peut-elle prendre en charge les dégâts ?",
    r: "Après une tempête, la grêle ou un dégât des eaux, souvent oui. On vous fournit photos et devis pour votre déclaration de sinistre.",
  },
  {
    q: "Je suis locataire, puis-je faire la demande ?",
    r: "Oui, signalez-le dans le formulaire. Prévenez aussi votre propriétaire ou votre syndic, car les travaux de toiture sont en général à leur charge.",
  },
];
