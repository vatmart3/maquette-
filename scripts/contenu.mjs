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
          "Une tuile cassée isolée ne justifie pas de tout refaire. Un [remplacement de tuiles](/services/remplacement-tuiles) suffit alors. Notre guide pour décider s'il vaut mieux [refaire ou réparer sa toiture](/conseils/refaire-ou-reparer-toiture) aide à faire la différence avant même la visite.",
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
          "Contrôle et, si besoin, remplacement des chevrons abîmés par notre service de [charpente](/services/charpente)",
          "Pose d'un écran sous-toiture respirant (HPV) contre les infiltrations",
          "Nouveaux liteaux et contre-liteaux traités",
          "Couverture en tuiles canal, romanes ou mécaniques selon votre maison",
          "Faîtage, rives et arêtiers scellés ou posés à sec, closoirs ventilés",
          "Reprise des solins, de la noue et des abergements",
        ],
      },
      {
        h2: "Tuiles canal des vieux quartiers, tuiles mécaniques des lotissements",
        p: [
          "Dans le centre historique de Frontignan, autour de l'église Saint-Paul, comme dans les ruelles de Balaruc-le-Vieux ou du quartier haut de Sète, les maisons portent des tuiles canal posées en courant et en couvert. On garde de préférence les anciennes tuiles patinées en couvert, la rangée visible, et on place les neuves en courant, là où elles disparaissent sous les autres. Le toit conserve ainsi sa teinte d'origine, ce qui compte dans ces rues où chaque terrasse voit le toit du voisin.",
          "Les pavillons bâtis à partir des années soixante-dix, à Frontignan-Plage, à la Peyrade ou au pied du massif de la Gardiole, sont plutôt couverts de tuiles mécaniques ou romanes à emboîtement. Ces modèles acceptent des pentes plus faibles et se fixent plus facilement contre le vent. Pour savoir ce qui couvre votre maison, consultez notre comparatif [tuile canal, romane ou mécanique](/conseils/tuile-canal-romane-mecanique).",
        ],
      },
      {
        h2: "Des matériaux adaptés au climat méditerranéen",
        p: [
          "Entre la tramontane, le vent marin chargé de sel et les épisodes méditerranéens d'automne, une couverture autour de l'étang de Thau doit être bien fixée et bien ventilée. On choisit avec vous le type de tuile, la fixation (crochets, colle, vis) et l'écran adaptés à l'exposition de votre toit.",
          "Près de l'eau, l'air humide et salé attaque l'acier ordinaire, d'où le choix de crochets et de pointes en inox. Sur les versants tournés vers le nord-ouest, on renforce la tenue des rives et des rangs de bas de pente, ceux que la tramontane soulève en premier.",
        ],
      },
      {
        h2: "Un chantier mené pan par pan",
        p: [
          "Une réfection se conduit par sections, pour que la maison ne reste jamais découverte. Chaque matin, on ouvre la surface que l'on sait refermer avant le soir. En fin de journée, l'écran sous-toiture est posé et une bâche protège les zones en attente. En automne, quand un orage peut éclater en quelques heures, on suit la météo de près et on adapte le découpage du chantier.",
        ],
        liste: [
          "Échafaudage avec garde-corps et protection des abords, jardin, piscine ou trottoir",
          "Évacuation des gravats au fur et à mesure, sans stock sur la toiture",
          "Photos des étapes cachées, écran et liteaux, avant qu'elles soient recouvertes",
          "Nettoyage des gouttières et visite de fin de chantier avec vous",
        ],
      },
      {
        h2: "Isolation, démarches et budget",
        p: [
          "Une couverture déposée est le meilleur moment pour [isoler la toiture par l'extérieur](/services/isolation-toiture), puisque les chevrons sont déjà à nu. Si le projet modifie l'aspect du toit, matériau, couleur ou hauteur, une démarche en mairie peut être demandée, et les abords d'un monument historique peuvent imposer des conditions. Notre page sur les [démarches d'urbanisme avant des travaux de toiture](/conseils/travaux-toiture-autorisation-urbanisme) résume les cas courants.",
          "Pour un ordre de grandeur, la page [prix d'une réfection de toiture](/prix/refection-toiture) explique ce qui fait varier le montant. Le chiffrage précis vient après la visite, avec un [devis écrit poste par poste](/devis-toiture).",
        ],
      },
    ],
    faq: [
      {
        q: "Combien de temps dure une réfection de toiture ?",
        r: "Cela dépend de la surface, du nombre de pans, de l'accès et de la météo. La durée prévue est indiquée sur le devis, et on vous prévient si la pluie oblige à décaler une étape.",
      },
      {
        q: "Peut-on refaire un seul pan de toit ?",
        r: "Oui. Si un seul versant est abîmé, on peut le refaire en raccordant proprement le faîtage et les rives. On vous le dit franchement après la visite.",
      },
      {
        q: "Faut-il une autorisation pour refaire sa toiture ?",
        r: "À l'identique, une déclaration préalable n'est en général pas nécessaire. Si vous changez de matériau, de couleur ou de pente, ou en secteur protégé, renseignez-vous en mairie. On vous aide à préparer le dossier.",
      },
      {
        q: "Peut-on réutiliser mes anciennes tuiles canal ?",
        r: "Souvent en partie. On les trie une à une au sol. Celles qui sonnent clair et ne sont ni fendues ni feuilletées repartent en couvert. Les autres sont remplacées par des tuiles de réemploi ou des neuves d'une teinte proche.",
      },
    ],
  },
  {
    slug: "recherche-de-fuite",
    nom: "Recherche de fuite et réparation",
    court: "Fuite de toiture",
    zone: 3,
    title: "Recherche de fuite et réparation à Frontignan | ARVÉO",
    description:
      "Tache au plafond, goutte qui tombe ? Recherche de fuite et réparation de toiture à Frontignan, Sète et Balaruc, sur tuiles, solins et cheminées.",
    h1: "Recherche de fuite et réparation de toiture",
    chapo:
      "Une tache au plafond n'est pas toujours sous la tuile cassée, car l'eau chemine. On trouve l'origine de la fuite avant de réparer, pour ne pas payer deux fois.",
    sections: [
      {
        h2: "Les causes de fuite les plus fréquentes",
        liste: [
          "Tuile cassée, glissée ou soulevée par le vent",
          "Solin fissuré au pied d'une cheminée ou d'un mur",
          "Abergement de [fenêtre de toit](/services/fenetre-de-toit) mal raccordé",
          "Noue encrassée ou zinc percé",
          "Faîtage dont le mortier s'est désagrégé",
          "Gouttière bouchée qui déborde sous la génoise",
        ],
      },
      {
        h2: "Pourquoi la tache n'est pas sous le trou",
        p: [
          "L'eau qui passe sous une tuile tombe rarement à la verticale. Elle suit la pente sur l'écran sous-toiture, glisse le long d'un chevron ou d'une gaine électrique, puis s'arrête sur un point bas du plafond. Une auréole dans l'angle d'une chambre peut ainsi venir d'un solin situé deux mètres plus haut. Changer la tuile juste au-dessus de la tache, sans chercher plus loin, ne règle souvent rien.",
          "Sur les maisons anciennes sans écran, l'eau imbibe d'abord le mortier, la volige ou les canisses avant d'apparaître. La trace visible peut donc dater d'une pluie précédente, ce qui brouille encore les pistes.",
        ],
      },
      {
        h2: "Notre méthode",
        p: [
          "On inspecte d'abord les combles pour repérer les traces d'eau, puis la couverture depuis l'extérieur. Au besoin, on arrose la zone suspecte pour reproduire la fuite. Vous recevez un compte rendu avec photos et un prix avant toute réparation.",
          "Si la pluie menace, on met d'abord la toiture hors d'eau par un [bâchage provisoire](/services/bachage-urgence), puis on revient faire la réparation définitive.",
        ],
      },
      {
        h2: "Les pluies poussées par le vent marin",
        p: [
          "Autour de Frontignan, beaucoup de fuites se déclarent par vent marin. Ce vent de sud-est arrive de la mer chargé d'humidité et plaque la pluie contre les versants exposés. L'eau remonte alors sous des tuiles canal trop peu recouvertes, passe derrière un solin ou contourne le cadre d'une fenêtre de toit. Par temps calme, le même toit reste parfaitement sec.",
          "La tramontane, elle, est un vent sec. Elle ne fait pas entrer l'eau mais déplace les tuiles et fissure les faîtages. La fuite apparaît donc à la pluie suivante, parfois des semaines plus tard. Lors des épisodes méditerranéens d'automne, ces défauts se révèlent tous en même temps, avec des gouttières qui débordent en plus.",
        ],
      },
      {
        h2: "Réparations courantes",
        liste: [
          "Remplacement de tuiles et révision d'un pan",
          "Réfection de solins et d'abergements",
          "Reprise du [faîtage et des rives](/services/faitage-rives)",
          "Changement d'une noue en zinc",
          "Étanchéité autour des sorties de toit et des fenêtres de toit",
          "Reprise d'un relevé ou d'une membrane sur un [toit terrasse](/services/etancheite-toit-terrasse)",
        ],
      },
      {
        h2: "En attendant notre passage, et pour le budget",
        p: [
          "Quelques gestes simples limitent les dégâts avant la réparation. Ils sont détaillés dans notre fiche [fuite de toiture, que faire tout de suite](/conseils/fuite-toiture-que-faire). Si l'eau coule franchement dans une pièce, passez par notre [dépannage de toiture](/depannage-toiture), on vous rappelle dans la journée.",
          "Le coût d'une recherche dépend de l'accès au toit, de sa hauteur et du nombre de points suspects. La page [prix d'une recherche de fuite](/prix/recherche-de-fuite) donne les repères utiles. Quand la réparation peut se faire dans la foulée, elle figure sur une ligne à part que vous validez avant.",
        ],
      },
    ],
    faq: [
      {
        q: "Mon assurance peut-elle prendre en charge la réparation ?",
        r: "Après une tempête ou un orage, c'est souvent le cas, selon votre contrat. On vous remet des photos et un devis détaillé à joindre à votre déclaration de sinistre. Renseignez-vous auprès de votre assureur sur les conditions.",
      },
      {
        q: "Que faire en attendant votre passage ?",
        r: "Placez une bassine sous la goutte, éloignez les objets de valeur et coupez l'électricité de la pièce si l'eau approche d'un luminaire. Ne montez pas sur le toit.",
      },
      {
        q: "Ma fuite n'apparaît que par certains vents, est-ce normal ?",
        r: "C'est fréquent ici. Si l'eau n'entre que par vent marin, le défaut se trouve souvent sur le côté exposé au sud-est, au niveau d'un solin, d'une rive ou d'un recouvrement de tuiles insuffisant. Notez le jour, le vent et l'endroit de la goutte, ces indices nous aident beaucoup.",
      },
      {
        q: "Intervenez-vous sur les maisons de ville mitoyennes ?",
        r: "Oui. Dans les rues étroites du centre de Frontignan ou de Sète, l'eau vient parfois du raccord avec le toit voisin. On examine alors la jonction des deux couvertures et on vous dit honnêtement de quel côté se situe le défaut.",
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
      "La mousse retient l'eau, soulève les tuiles et bouche les gouttières. Un démoussage soigné, complété si besoin d'un traitement hydrofuge, prolonge nettement la durée de vie de votre couverture.",
    sections: [
      {
        h2: "Pourquoi démousser ?",
        p: [
          "Les versants nord, les toits ombragés par les pins et ceux qui regardent l'étang restent humides plus longtemps, et les mousses et lichens s'y installent. Leurs racines s'infiltrent sous les tuiles, gardent l'humidité et favorisent la casse au moindre gel.",
          "Les embruns et des décennies de soleil rendent aussi la surface de la terre cuite plus rugueuse. Une tuile qui a perdu sa peau boit davantage, sèche moins vite, et les lichens s'y accrochent d'autant mieux.",
        ],
      },
      {
        h2: "Pins, garrigue et aiguilles, le cas des maisons boisées",
        p: [
          "Au pied du massif de la Gardiole, à [Vic-la-Gardiole](/couvreur/vic-la-gardiole) ou dans les quartiers plantés de pins de Frontignan, les toits reçoivent chaque année leur lot d'aiguilles. Elles s'entassent dans les noues, derrière les souches de cheminée et dans les gouttières, puis se décomposent en un terreau noir. Les mousses y prospèrent et l'eau ne s'écoule plus.",
          "Sur ces maisons, démousser les tuiles sans vider les noues ni curer la [zinguerie et les gouttières](/services/zinguerie-gouttieres) ne règle que la moitié du problème. On traite donc l'ensemble lors du même passage.",
        ],
      },
      {
        h2: "Comment on procède",
        p: [
          "La haute pression décape la surface des tuiles, ouvre leurs pores et pousse de l'eau sous la couverture. Elle donne un toit propre le jour même et des tuiles plus fragiles pour la suite. On préfère un brossage soigneux, puis un produit qui termine le travail au fil des pluies.",
        ],
        liste: [
          "Brossage manuel des mousses, sans haute pression qui abîme les tuiles",
          "Application d'un traitement anti-mousse qui agit plusieurs mois",
          "Remplacement des [tuiles cassées](/services/remplacement-tuiles) repérées pendant le nettoyage",
          "Nettoyage des gouttières et des descentes",
          "En option, traitement hydrofuge pour limiter la porosité des tuiles",
        ],
      },
      {
        h2: "Protéger l'étang, le jardin et la piscine",
        p: [
          "Autour de l'étang de Thau, une partie des eaux de pluie rejoint les fossés, les canaux puis la lagune, où travaillent les conchyliculteurs. On choisit donc des produits adaptés à cet usage, appliqués par temps sec et sans excès, et on ne rince pas le toit au jet derrière. Les massifs au pied des murs, la piscine et les dallages clairs sont protégés pendant l'application.",
        ],
      },
      {
        h2: "À quelle fréquence ?",
        p: [
          "Selon l'exposition, un traitement tous les quatre à six ans suffit le plus souvent. On vous dit honnêtement s'il est utile ou s'il peut attendre.",
          "La saison compte aussi. Un produit posé juste avant une grosse averse part dans les descentes sans avoir agi, et la forte chaleur d'été le fait sécher trop vite. On évite donc les semaines d'épisodes méditerranéens et le plein été. Notre article sur la [meilleure saison pour démousser](/conseils/demoussage-toiture-saison) détaille ces repères.",
        ],
      },
      {
        h2: "Un démoussage, l'occasion de faire le point",
        p: [
          "Pendant le nettoyage, on voit la couverture de près. Faîtage fissuré, tuiles feuilletées, liteaux qui fléchissent sous le pas, on vous signale tout ce qui mérite attention, photos à l'appui. Si le toit est trop usé pour qu'un traitement ait du sens, on vous le dit et on parle plutôt de [réfection de toiture](/services/refection-toiture).",
          "Pour un budget indicatif selon la surface et l'accès, consultez la page [prix d'un démoussage de toiture](/prix/demoussage-toiture).",
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
      {
        q: "Les taches noires disparaissent-elles le jour même ?",
        r: "Pas toujours. Les lichens noirs et gris s'accrochent fort. Le brossage en retire une bonne partie, puis le produit les fait pâlir progressivement avec les pluies. Le résultat complet se juge après quelques semaines.",
      },
      {
        q: "Faut-il démousser des tuiles mécaniques récentes ?",
        r: "Rarement les premières années. Un coup d'œil depuis le sol suffit le plus souvent. Si des plaques vertes apparaissent sur le versant nord ou sous un arbre, un nettoyage localisé évite qu'elles ne s'étendent.",
      },
    ],
  },
  {
    slug: "zinguerie-gouttieres",
    nom: "Zinguerie et gouttières",
    court: "Zinguerie",
    zone: 2,
    title: "Zinguerie et gouttières à Frontignan | ARVÉO",
    description:
      "Pose et réparation de gouttières en zinc, descentes, noues, solins et abergements à Frontignan, Sète et alentours. Nettoyage de gouttières. Devis gratuit.",
    h1: "Zinguerie et gouttières",
    chapo:
      "Gouttières, descentes, noues et solins conduisent l'eau de pluie loin de vos murs. Quand la zinguerie fatigue, ce sont les façades, les génoises et les fondations qui prennent l'eau.",
    sections: [
      {
        h2: "Nos travaux de zinguerie",
        liste: [
          "Gouttières pendantes en zinc, aluminium ou PVC",
          "Descentes d'eaux pluviales, coudes et dauphins",
          "Noues et chéneaux en zinc",
          "Solins et bandes de rive, en lien avec le [faîtage et les rives](/services/faitage-rives)",
          "Abergements de cheminée et de [fenêtre de toit](/services/fenetre-de-toit)",
          "Nettoyage et débouchage des gouttières",
        ],
      },
      {
        h2: "Les signes qui doivent alerter",
        p: [
          "Une gouttière qui déborde mouille la génoise, puis le haut de la façade. L'enduit cloque, se décolle, et l'humidité finit par gagner les murs intérieurs. Si une tache est déjà apparue au plafond, une [recherche de fuite](/services/recherche-de-fuite) permet de savoir si la zinguerie est en cause ou si l'eau passe par la couverture.",
          "Après un coup de vent, un crochet tordu ou une descente déboîtée se repèrent souvent depuis le sol. Notre guide sur l'[état du toit après la tramontane](/conseils/toiture-apres-tramontane) liste les points à regarder.",
        ],
        liste: [
          "De l'eau qui déborde en coulée sur la façade",
          "Une gouttière qui penche ou se décroche",
          "Des traces vertes ou noires sous la génoise",
          "Une descente qui goutte aux raccords",
          "Une flaque qui revient au pied du mur après chaque averse",
        ],
      },
      {
        h2: "Le zinc, le bon choix près de la mer",
        p: [
          "Le zinc vieillit bien, se répare et se soude. Avec les années, il se couvre d'une patine grise qui le protège. Près du littoral, à Frontignan-Plage comme sur le lido de Sète, on soigne les fixations et la pente des gouttières pour que l'eau et le sable n'y stagnent pas. On évite aussi tout contact avec le cuivre ou l'acier non protégé, qui le font se corroder.",
          "L'aluminium laqué reste une bonne alternative, sans soudure et disponible en de nombreuses teintes. Le PVC convient aux petites longueurs abritées, car il se déforme et devient cassant au soleil du Midi.",
        ],
      },
      {
        h2: "Épisodes méditerranéens, des gouttières à la hauteur",
        p: [
          "En automne, il peut tomber en une soirée autant d'eau qu'en plusieurs mois ordinaires. Une gouttière trop étroite ou une seule descente pour un long versant débordent alors en cascade. Lors d'un remplacement, on vérifie la section de la gouttière, le nombre de descentes et leur position par rapport à la surface du toit.",
          "On regarde aussi où va l'eau en bas. Regard, caniveau ou réseau pluvial, elle doit partir loin des fondations et ne pas inonder la terrasse du voisin.",
        ],
      },
      {
        h2: "Génoises, chéneaux et maisons de ville",
        p: [
          "Beaucoup de maisons anciennes de Frontignan, de [Mireval](/couvreur/mireval) ou de Sète ont une génoise, ces rangs de tuiles en encorbellement sous l'égout du toit. Les crochets de gouttière s'y fixent avec précaution, sans fendre les tuiles ni casser le mortier. Sur les façades alignées du centre ancien, la descente passe souvent au ras d'une porte ou d'une vitrine, et un dauphin en fonte protège le bas du tuyau des chocs.",
          "Les chéneaux encaissés et les vieilles noues en zinc finissent par se percer sous les dépôts d'aiguilles et de feuilles. On les refait en zinc neuf, avec des joints de dilatation, car le métal travaille entre les nuits d'hiver et les après-midi d'août. Envoyez-nous une photo prise depuis la rue avec votre [demande de devis de zinguerie](/devis-toiture).",
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
      {
        q: "Faut-il une grille contre les aiguilles de pin ?",
        r: "Sous des pins, une grille ou une crapaudine en tête de descente évite les bouchons. Elle ne dispense pas du nettoyage, car les aiguilles se tassent dessus, mais elle rend l'entretien plus simple et protège la descente.",
      },
      {
        q: "Zinc, aluminium ou PVC, que choisir ?",
        r: "Le zinc reste la référence pour durer et se réparer. L'aluminium laqué convient quand on veut une teinte assortie aux menuiseries. Le PVC supporte mal le plein soleil sur les façades exposées au sud.",
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
          "Les appuis des pannes dans les murs et les ancrages en tête de mur",
        ],
      },
      {
        h2: "Maisons de village et pavillons, deux charpentes différentes",
        p: [
          "Dans les maisons de village de Frontignan, de [Gigean](/couvreur/gigean) ou de Poussan, la charpente est le plus souvent traditionnelle. Des pannes en bois massif reposent sur les murs de refend, et les chevrons portent les tuiles canal, parfois posées sur des voliges jointives ou des canisses en roseau. Ces vieux bois restent souvent sains au cœur. Leurs appuis noyés dans la maçonnerie, en revanche, pourrissent là où l'eau a coulé pendant des années.",
          "Les pavillons plus récents reposent pour la plupart sur des fermettes industrielles, assemblées par des connecteurs métalliques. Elles sont légères et fiables tant qu'on ne les modifie pas. Couper une fermette pour gagner de la place dans les combles affaiblit tout l'ensemble. Un aménagement ou l'ouverture d'une [fenêtre de toit](/services/fenetre-de-toit) demande donc un renfort étudié au préalable.",
        ],
      },
      {
        h2: "Insectes, humidité et vent, les ennemis du bois ici",
        p: [
          "Le capricorne des maisons et les vrillettes s'attaquent aux résineux et aux bois anciens non traités. Leurs larves creusent pendant des années avant que les trous de sortie ne se voient. Des termites sont également signalés dans une partie de l'Hérault. Votre mairie sait si un arrêté préfectoral concerne votre commune.",
          "L'humidité fait le reste. Une infiltration ancienne, l'absence d'écran ou des combles mal ventilés près de l'étang favorisent les champignons. Si des traces d'eau marquent le bois, une [recherche de fuite](/services/recherche-de-fuite) s'impose avant toute reprise. Enfin, la tramontane exerce de fortes poussées sur les toits exposés. Un chevron mal fixé ou une panne qui a perdu son appui finit par bouger, et la couverture se déforme.",
        ],
      },
      {
        h2: "Nos interventions",
        liste: [
          "Remplacement ou doublage de chevrons",
          "Renforcement de pannes affaissées",
          "Traitement préventif et curatif du bois",
          "Reprise des appuis de pannes dans la maçonnerie",
          "Création d'un chevêtre autour d'une nouvelle ouverture",
          "Reprise de la charpente lors d'une [réfection de toiture](/services/refection-toiture)",
        ],
      },
      {
        h2: "Charpente et couverture, un seul interlocuteur",
        p: [
          "Une charpente abîmée se découvre souvent en refaisant le toit. Comme on gère les deux, vous n'attendez pas un second artisan. Le chantier continue et la maison reste hors d'eau.",
          "Même logique après la chute d'une grosse branche de pin. Si un chevron a cédé, on met d'abord la maison à l'abri avec un [bâchage d'urgence](/services/bachage-urgence), puis on remplace la pièce cassée avant de recouvrir.",
        ],
      },
      {
        h2: "Réparer, renforcer ou remplacer",
        p: [
          "Un chevron fendu se double, une panne qui fléchit se soulage par une jambe de force, un bois attaqué en surface se traite. Le remplacement complet n'a de sens que si les pièces maîtresses sont atteintes en profondeur. On sonde le bois, on mesure la déformation et on vous montre les photos avant de proposer une solution. Notre guide pour choisir entre [refaire ou réparer une toiture](/conseils/refaire-ou-reparer-toiture) aborde aussi cette question.",
          "Une fois la structure saine et sèche, c'est le bon moment pour penser à l'[isolation de la toiture](/services/isolation-toiture), sans risque d'enfermer un bois humide.",
        ],
      },
    ],
    faq: [
      {
        q: "Comment savoir si ma charpente est attaquée ?",
        r: "Sciure au sol des combles, petits trous dans le bois, bois qui s'effrite sous la pointe d'un tournevis sont des signes à faire vérifier.",
      },
      {
        q: "Faut-il traiter une charpente sans insectes visibles ?",
        r: "Un traitement préventif a du sens sur des bois neufs non traités, ou lors d'une réfection quand la charpente est à nu. Sur une charpente ancienne saine et sèche, une surveillance régulière des combles suffit souvent.",
      },
      {
        q: "Peut-on aménager des combles sur fermettes ?",
        r: "Pas sans reprendre la structure. Les fermettes occupent le volume et chaque pièce travaille avec les autres. On vous dit franchement si le projet est réaliste et ce qu'il implique avant tout engagement.",
      },
      {
        q: "Une panne qui fléchit est-elle dangereuse ?",
        r: "Une légère flèche ancienne et stable est courante sur les vieilles maisons. Une déformation qui s'accentue, des fissures dans le plafond ou des tuiles qui se déplacent doivent en revanche être vérifiées sans attendre.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "remplacement-tuiles",
    nom: "Remplacement de tuiles cassées",
    court: "Remplacement de tuiles",
    zone: 0,
    title: "Remplacement de tuiles cassées à Frontignan | ARVÉO",
    description:
      "Tuile fendue, glissée ou envolée ? Remplacement de tuiles canal, romanes ou mécaniques à Frontignan et autour de l'étang de Thau, avec révision du pan.",
    h1: "Remplacement de tuiles cassées à Frontignan",
    chapo:
      "Une seule tuile fendue suffit à laisser passer la pluie d'automne. On remplace les tuiles abîmées par des modèles compatibles, on recale celles qui ont bougé et on vérifie le reste du pan avant de redescendre.",
    resume: "Tuiles fendues, glissées ou envolées remplacées par des modèles compatibles.",
    devis: "Remplacement de tuiles",
    sections: [
      {
        h2: "Pourquoi une tuile casse",
        p: [
          "Sur nos toits, la casse vient rarement de l'âge seul. Un coup de tramontane soulève une tuile mal tenue, qui retombe et se fend. Une branche de pin tombe sur le versant. Un antenniste ou un voisin pressé marche au mauvais endroit. Avec les années, le soleil et le sel du littoral rendent aussi la terre cuite plus cassante.",
          "Le danger est discret. Une tuile fêlée reste en place et rien ne se voit depuis la rue. L'eau passe pourtant à chaque averse, mouille les liteaux, puis finit par tacher un plafond plusieurs mètres plus bas. Si une trace est déjà apparente, une [recherche de fuite](/services/recherche-de-fuite) permet de confirmer que la tuile est bien en cause.",
        ],
        liste: [
          "Tuile fendue en travers ou écornée en bas",
          "Tuile glissée qui laisse un jour entre deux rangs",
          "Tuile de couvert déplacée sur une couverture en canal",
          "Morceaux de terre cuite retrouvés dans la gouttière ou au jardin",
        ],
      },
      {
        h2: "Retrouver une tuile qui s'accorde avec votre toit",
        p: [
          "C'est souvent la vraie difficulté. Les maisons anciennes du centre de Frontignan et de Sète sont couvertes de tuiles canal patinées par des décennies de soleil. Une tuile neuve, bien rouge, se remarque tout de suite. On privilégie donc des tuiles de réemploi de même teinte et de même galbe, ou des modèles vieillis.",
          "Les pavillons construits entre les années soixante et quatre-vingt posent un autre problème. Leurs tuiles mécaniques ou romanes ne sont parfois plus fabriquées. On cherche alors un modèle dont l'emboîtement correspond, ou on récupère quelques tuiles sur un pan moins visible pour les placer côté rue. Notre guide sur la [tuile canal, romane ou mécanique](/conseils/tuile-canal-romane-mecanique) aide à reconnaître votre couverture.",
        ],
      },
      {
        h2: "Comment se passe l'intervention",
        liste: [
          "Accès sécurisé au toit, avec échafaudage ou nacelle si la hauteur l'impose",
          "Dépose des tuiles cassées sans abîmer les voisines",
          "Contrôle des liteaux et de l'écran sous-toiture à l'endroit ouvert",
          "Pose des tuiles de remplacement, fixées par crochet ou collées selon le modèle",
          "Recalage des tuiles glissées sur le reste du versant",
          "Photos avant et après pour que vous voyiez le résultat sans monter",
        ],
      },
      {
        h2: "Quand quelques tuiles ne suffisent plus",
        p: [
          "Remplacer trois ou quatre tuiles est un geste d'entretien normal. En revanche, si elles se brisent dès qu'on les touche, si la mousse a envahi le versant ou si les liteaux plient sous la main, on vous le dira franchement. Il vaut alors mieux envisager un [démoussage de la toiture](/services/demoussage-toiture), la reprise d'un pan ou une [réfection complète de la couverture](/services/refection-toiture).",
          "Pour avoir une première idée du budget avant notre visite, consultez la page [prix du remplacement de tuiles](/prix/remplacement-tuiles). Le montant exact dépend de l'accès, du type de tuile et du nombre de pièces à changer.",
        ],
      },
      {
        h2: "Autour de Frontignan, un passage simple à organiser",
        p: [
          "Ce type de petite réparation se fait le plus souvent en une demi-journée. Pour les maisons de Frontignan, de [Vic-la-Gardiole](/couvreur/vic-la-gardiole) ou de [Balaruc-les-Bains](/couvreur/balaruc-les-bains), on regroupe volontiers la visite et la réparation quand les tuiles nécessaires sont disponibles. Envoyez-nous une photo prise depuis le sol avec votre [demande de devis](/devis-toiture), elle nous aide à prévoir le bon modèle.",
        ],
      },
    ],
    faq: [
      {
        q: "Puis-je remplacer une tuile moi-même ?",
        r: "Sur un abri de jardin bas, c'est envisageable. Sur une maison, marcher sur des tuiles canal ou romanes en casse d'autres et le risque de chute est réel. Un couvreur sait où poser le pied et dispose du matériel de sécurité.",
      },
      {
        q: "Une tuile neuve se verra-t-elle sur mon toit ancien ?",
        r: "On fait en sorte que non. Sur les couvertures anciennes, on utilise des tuiles de récupération patinées. Sur les tuiles plus récentes, on choisit un coloris proche, qui se fond vite après quelques saisons.",
      },
      {
        q: "Faut-il vérifier tout le toit pour une seule tuile cassée ?",
        r: "On jette au moins un œil sur le pan concerné et sur le faîtage. Une tuile cassée par le vent en annonce souvent d'autres qui ont bougé sans se briser, et autant les recaler pendant qu'on est sur place.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "faitage-rives",
    nom: "Faîtage et rives",
    court: "Faîtage et rives",
    zone: 0,
    title: "Faîtage et rives de toiture à Frontignan | ARVÉO",
    description:
      "Faîtières descellées, mortier qui s'effrite, rives arrachées par la tramontane ? Réfection du faîtage, des rives et des arêtiers à Frontignan et alentours.",
    h1: "Réfection du faîtage et des rives de toiture",
    chapo:
      "Le faîtage et les rives sont les points du toit les plus exposés au vent. Quand le mortier se fend ou qu'une faîtière bouge, on reprend ces lignes de la couverture avant que la pluie ne s'y engouffre.",
    resume: "Faîtières, rives et arêtiers rescellés ou reposés à sec, face au vent et au sel.",
    devis: "Faîtage et rives",
    sections: [
      {
        h2: "Le faîtage et les rives, de quoi parle-t-on ?",
        p: [
          "Le faîtage est la ligne haute du toit, là où deux versants se rejoignent. Il est couvert de faîtières, des tuiles arrondies posées à cheval. Les rives sont les bords latéraux de la couverture, du côté des pignons. Sur une maison à quatre pentes, les arêtiers jouent le même rôle sur les angles inclinés.",
          "Ces trois lignes protègent les extrémités des tuiles. Si elles lâchent, le vent passe sous la couverture et l'eau entre directement sur les liteaux et la charpente.",
        ],
      },
      {
        h2: "Ce que la tramontane et le sel font au mortier",
        p: [
          "Autour de l'étang de Thau, la tramontane souffle fort et longtemps depuis le nord-ouest. Elle frappe en premier le faîtage et la rive exposée, qui se trouvent en saillie. À côté de cela, le vent marin dépose du sel, et les écarts de température entre une journée d'août et une nuit d'hiver font travailler le mortier.",
          "Résultat, le scellement des faîtières se fissure, puis s'effrite par morceaux. Les tuiles de rive se soulèvent et certaines finissent dans le jardin. Après un gros coup de vent, notre article sur la [toiture après la tramontane](/conseils/toiture-apres-tramontane) indique quoi regarder depuis le sol.",
        ],
        liste: [
          "Morceaux de mortier gris ou ocre au pied des murs",
          "Faîtière décalée, qui ne suit plus la ligne du toit",
          "Tuile de rive soulevée ou absente sur le pignon",
          "Jour visible entre les faîtières en regardant contre le ciel",
          "Coulures sur le haut du pignon après la pluie",
        ],
      },
      {
        h2: "Faîtage scellé ou faîtage à sec",
        p: [
          "Sur les maisons anciennes à tuiles canal, le faîtage traditionnel est scellé au mortier de chaux, d'une teinte proche des enduits de la région. On le refait dans le même esprit, en purgeant l'ancien mortier jusqu'au sain et en reposant les faîtières alignées.",
          "Sur une couverture en tuiles romanes ou mécaniques, on peut aussi poser un faîtage à sec. Les faîtières sont alors vissées sur une lisse de faîtage, avec un closoir ventilé dessous. Cette solution laisse respirer les combles et ne craint pas la fissuration. On vous présente les deux options selon votre toit et l'aspect recherché.",
        ],
      },
      {
        h2: "Les rives, côté pignon",
        p: [
          "Une rive se traite de plusieurs façons. Tuiles de rive à rabat emboîtées, rive scellée au mortier sur les toits en canal, ou bande de rive en zinc qui coiffe l'extrémité des tuiles. Le zinc tient très bien au vent et protège aussi le haut de l'enduit, un point utile sur les pignons tournés vers le nord-ouest.",
          "Pour les habillages métalliques et les raccords avec les gouttières, ce travail rejoint notre activité de [zinguerie et gouttières](/services/zinguerie-gouttieres).",
        ],
      },
      {
        h2: "Notre façon de reprendre un faîtage",
        liste: [
          "Dépose des faîtières et des tuiles de rive fragilisées",
          "Purge complète du vieux mortier, sans laisser de parties creuses",
          "Remplacement des tuiles de rang supérieur abîmées, voir notre service de [remplacement de tuiles](/services/remplacement-tuiles)",
          "Contrôle de la panne faîtière et des liteaux en tête de versant",
          "Repose au mortier ou à sec, alignée au cordeau",
          "Fixation renforcée des tuiles de rive sur les façades exposées au vent",
        ],
        p: [
          "Si la couverture entière est fatiguée, reprendre seulement le faîtage serait un pansement. Dans ce cas, on vous oriente vers une [réfection de la toiture](/services/refection-toiture), qui inclut faîtage et rives neufs.",
        ],
      },
    ],
    faq: [
      {
        q: "Combien de temps tient un faîtage refait ?",
        r: "Un faîtage bien purgé et correctement scellé, ou posé à sec avec des fixations adaptées, tient de nombreuses années. Sa durée dépend surtout de l'exposition au vent et de l'entretien général du toit.",
      },
      {
        q: "Peut-on simplement reboucher les fissures du mortier ?",
        r: "Un rebouchage en surface tient rarement. Le mortier neuf n'accroche pas sur un support qui s'effrite. Il faut retirer l'ancien scellement et refaire proprement, au moins sur les longueurs fissurées.",
      },
      {
        q: "Le faîtage à sec est-il adapté aux tuiles canal ?",
        r: "Des systèmes existent, mais sur les maisons anciennes en canal on garde le plus souvent un faîtage maçonné. Il respecte l'aspect d'origine, ce qui compte aussi dans les centres anciens.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "fenetre-de-toit",
    nom: "Pose et remplacement de fenêtre de toit",
    court: "Fenêtre de toit",
    zone: 3,
    title: "Fenêtre de toit à Frontignan, pose et remplacement | ARVÉO",
    description:
      "Pose ou remplacement de fenêtre de toit à Frontignan et dans l'Hérault, avec abergement et raccord d'étanchéité adaptés à vos tuiles. Devis gratuit.",
    h1: "Pose et remplacement de fenêtre de toit",
    chapo:
      "Une fenêtre de toit apporte de la lumière dans des combles ou une chambre sous les pentes. Sa durée de vie dépend surtout de son raccord avec la couverture. C'est ce travail de couvreur que nous faisons avec soin.",
    resume: "Fenêtre de toit posée ou remplacée, avec un abergement adapté à vos tuiles.",
    devis: "Fenêtre de toit",
    sections: [
      {
        h2: "Remplacer une ancienne fenêtre de toit",
        p: [
          "Beaucoup de fenêtres de toit posées il y a vingt ou trente ans arrivent en fin de course. Le vitrage s'opacifie, les joints durcissent, les charnières grippent, surtout près de la mer où le sel attaque les parties métalliques. Le remplacement à dimension identique est la solution la plus simple. La nouvelle fenêtre de toit (type Velux) reprend l'ouverture existante dans la charpente, sans toucher aux chevrons.",
          "On dépose l'ancien châssis, on vérifie l'état du bois autour et de l'écran sous-toiture, puis on pose la fenêtre neuve avec un abergement neuf. Réutiliser l'ancien raccord est une fausse économie, car c'est lui qui assure l'étanchéité.",
        ],
        liste: [
          "Infiltrations au bas de la fenêtre après chaque grosse pluie",
          "Buée persistante entre les deux vitres",
          "Ouvrant qui ferme mal ou laisse passer l'air",
          "Traces noires de moisissure sur l'habillage intérieur",
        ],
      },
      {
        h2: "L'abergement, la pièce qui fait l'étanchéité",
        p: [
          "L'abergement est l'ensemble de pièces qui entoure la fenêtre à l'extérieur et raccorde la couverture au châssis. Il renvoie l'eau de la partie haute vers les côtés, puis par-dessus les tuiles du bas. Son modèle dépend du profil de vos tuiles. Une tuile canal, très galbée, demande un abergement pour tuiles à fort relief, avec une bavette souple qui épouse les ondulations.",
          "On soigne aussi le raccord d'étanchéité avec l'écran sous-toiture, à l'aide d'une collerette et d'une gouttière de déviation au-dessus de la fenêtre. Sans ce détail, l'eau qui passe parfois sous les tuiles lors d'un épisode méditerranéen finit par couler dans la pièce. Si une fenêtre de toit fuit déjà chez vous, une [recherche de fuite](/services/recherche-de-fuite) permet de savoir si le problème vient du châssis ou du raccord.",
        ],
      },
      {
        h2: "Créer une nouvelle ouverture dans le toit",
        p: [
          "Ajouter une fenêtre de toit là où il n'y en avait pas demande davantage de travail. On découpe la couverture et les liteaux, puis on crée un chevêtre pour reprendre les efforts du ou des chevrons coupés. Ce travail de structure fait partie de notre activité de [charpente](/services/charpente).",
          "La création d'une ouverture modifie l'aspect extérieur de la maison. Une déclaration préalable peut alors être demandée, et les abords d'un monument historique peuvent imposer des conditions particulières. Renseignez-vous en mairie avant de lancer les travaux. Notre article sur les [autorisations d'urbanisme pour une toiture](/conseils/travaux-toiture-autorisation-urbanisme) fait le point sur les cas courants.",
        ],
      },
      {
        h2: "Penser à la chaleur de l'été",
        p: [
          "Dans l'Hérault, une pièce sous les toits peut devenir étouffante de juin à septembre. Une fenêtre de toit orientée plein sud ou plein ouest laisse entrer beaucoup de soleil. On vous conseille sur l'emplacement, la taille et l'équipement, pour profiter de la lumière sans transformer la chambre en serre.",
        ],
        liste: [
          "Store extérieur ou volet roulant, qui arrête la chaleur avant le vitrage",
          "Vitrage adapté à l'exposition de la pièce",
          "Ouverture à rotation ou à projection selon la hauteur et l'usage",
          "Position permettant une ventilation traversante la nuit",
          "Reprise de l'isolant autour du châssis, en lien avec l'[isolation de toiture](/services/isolation-toiture)",
        ],
      },
      {
        h2: "Préparer votre projet",
        p: [
          "Pour un remplacement, notez si possible les références inscrites sur la plaque du châssis, visibles une fois la fenêtre ouverte. Pour une création, une photo de la pièce et du toit vu de l'extérieur nous aide déjà beaucoup. Joignez-les à votre [demande de devis](/devis-toiture). Pour les communes plus éloignées de Frontignan, on fixe un rendez-vous de visite planifié avant de commander le matériel.",
        ],
      },
    ],
    faq: [
      {
        q: "Peut-on remplacer une fenêtre de toit sans abîmer l'intérieur ?",
        r: "Dans la plupart des cas, oui. Le remplacement à dimension identique se fait depuis l'extérieur et l'habillage intérieur reste en place. Si l'ancien châssis a laissé passer l'eau longtemps, il peut falloir reprendre un peu de plâtre autour.",
      },
      {
        q: "Une fenêtre de toit peut-elle se poser sur des tuiles canal ?",
        r: "Oui, avec un abergement prévu pour les tuiles à fort galbe. On ajuste aussi les tuiles autour du cadre pour que l'eau soit bien renvoyée sur les côtés et en partie basse.",
      },
      {
        q: "Faut-il une autorisation pour changer une fenêtre de toit ?",
        r: "Un remplacement à l'identique, même taille et même aspect, ne demande en général aucune démarche. Pour une création ou un agrandissement, une déclaration préalable est souvent nécessaire. Votre mairie vous le confirmera.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "isolation-toiture",
    nom: "Isolation de toiture",
    court: "Isolation de toiture",
    zone: 1,
    title: "Isolation de toiture à Frontignan | ARVÉO",
    description:
      "Isolation de toiture par l'extérieur lors d'une réfection, isolation des combles, pare-vapeur et ventilation. Confort d'hiver et d'été à Frontignan.",
    h1: "Isolation de toiture à Frontignan et alentours",
    chapo:
      "Une grande partie des pertes de chaleur passe par le toit, et c'est aussi par lui que la chaleur entre l'été. Isoler la toiture rend la maison plus agréable toute l'année, à condition de traiter aussi la ventilation et l'humidité.",
    resume: "Combles ou isolation par l'extérieur, pour une maison plus vivable été comme hiver.",
    devis: "Isolation de toiture",
    sections: [
      {
        h2: "Dans l'Hérault, l'été compte autant que l'hiver",
        p: [
          "On pense d'abord au froid, mais autour de Frontignan le vrai inconfort arrive souvent en juillet. Les tuiles chauffent en plein soleil, la chaleur traverse la charpente et les pièces sous les pentes restent chaudes jusque tard dans la nuit. Une isolation bien pensée doit freiner cette chaleur, pas seulement retenir celle du chauffage.",
          "Pour cela, l'épaisseur ne fait pas tout. Les isolants denses, comme la fibre de bois, ralentissent davantage le passage de la chaleur que des isolants très légers. On parle de déphasage, c'est-à-dire du temps que met la chaleur de l'après-midi pour atteindre l'intérieur. Plus il est long, plus la pièce reste vivable.",
        ],
      },
      {
        h2: "Isoler par l'extérieur lors d'une réfection",
        p: [
          "Si votre couverture doit de toute façon être refaite, c'est le meilleur moment pour isoler. La technique dite du sarking consiste à poser des panneaux isolants rigides par-dessus les chevrons, avant de remettre contre-liteaux, liteaux et tuiles. L'isolant forme une enveloppe continue, sans les coupures que laissent les chevrons dans une isolation intérieure.",
          "Autre avantage, la charpente apparente reste visible depuis l'intérieur et vous ne perdez pas de hauteur sous plafond. Le toit, lui, gagne quelques centimètres d'épaisseur. Il faut donc reprendre les rives, le faîtage et les raccords de zinguerie, ce que l'on fait dans le même chantier de [réfection de toiture](/services/refection-toiture). Cette surélévation peut aussi relever d'une démarche en mairie, voir notre article sur les [autorisations d'urbanisme](/conseils/travaux-toiture-autorisation-urbanisme).",
        ],
      },
      {
        h2: "Isoler les combles",
        p: [
          "Quand la couverture est en bon état, on travaille par l'intérieur. Le choix dépend de l'usage de l'espace sous le toit.",
        ],
        liste: [
          "Combles perdus, non habitables, isolés par soufflage d'un isolant en vrac sur le plancher",
          "Combles aménagés, isolés en rampant entre et sous les chevrons, sous un parement",
          "Trappe d'accès isolée et étanche, souvent oubliée",
          "Contrôle préalable de la charpente, avec reprise par notre service de [charpente](/services/charpente) si un bois est attaqué",
        ],
      },
      {
        h2: "Pare-vapeur et ventilation, les deux points qu'on ne néglige pas",
        p: [
          "La vapeur d'eau produite dans la maison, par la cuisine, la douche ou la respiration, cherche à sortir par le haut. Si elle atteint un isolant froid, elle condense et le mouille. On place donc un pare-vapeur ou une membrane hygrorégulante du côté chauffé, avec des raccords et des passages de gaines bien scotchés.",
          "Côté extérieur, la couverture doit rester ventilée. Une lame d'air sous les tuiles, des entrées d'air en bas de pente et une sortie au faîtage évacuent l'humidité et une partie de la chaleur d'été. Près de l'étang de Thau, où l'air est souvent humide, ce point est particulièrement surveillé.",
        ],
      },
      {
        h2: "Les aides à la rénovation",
        p: [
          "Des aides publiques existent pour les travaux d'isolation, mais leurs conditions évoluent souvent et dépendent de vos revenus, de votre logement et de l'entreprise retenue. Nous ne donnons pas de montant. Le site officiel france-renov.gouv.fr présente les dispositifs en vigueur et les conseillers du réseau public qui peuvent vous accompagner gratuitement. Vérifiez votre éligibilité avant de signer un devis, certaines aides devant être demandées avant le début des travaux.",
          "Si vous hésitez entre isoler maintenant ou attendre de refaire le toit, notre guide pour savoir s'il faut [refaire ou réparer sa toiture](/conseils/refaire-ou-reparer-toiture) aide à trancher. On peut ensuite venir voir votre maison et vous remettre un [devis de toiture](/devis-toiture) détaillé.",
        ],
      },
    ],
    faq: [
      {
        q: "Vaut-il mieux isoler par l'intérieur ou par l'extérieur ?",
        r: "Par l'extérieur, l'isolation est plus continue et protège mieux de la chaleur d'été, mais elle a du sens surtout quand la couverture doit être refaite. Si vos tuiles sont saines, l'isolation des combles par l'intérieur est souvent plus raisonnable.",
      },
      {
        q: "Quel isolant choisir pour le confort d'été ?",
        r: "Les isolants denses, comme la fibre de bois, freinent mieux la chaleur de l'après-midi. Leur choix dépend aussi de l'épaisseur disponible et de l'usage des combles. On en discute lors de la visite.",
      },
      {
        q: "Pourquoi parler de ventilation pour une isolation ?",
        r: "Un isolant humide n'isole plus et peut abîmer la charpente. La ventilation sous les tuiles et le pare-vapeur côté intérieur évitent que l'eau ne s'accumule dans la paroi.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "etancheite-toit-terrasse",
    nom: "Étanchéité de toit terrasse",
    court: "Toit terrasse",
    zone: 3,
    title: "Étanchéité de toit terrasse à Frontignan | ARVÉO",
    description:
      "Réfection et réparation d'étanchéité de toit terrasse, membrane bitumineuse ou EPDM, relevés et évacuations, pour villas et maisons récentes de l'Hérault.",
    h1: "Étanchéité de toit terrasse",
    chapo:
      "Un toit plat ne pardonne pas les détails. Une membrane fendue, un relevé décollé ou une évacuation bouchée suffisent pour que l'eau stagne et s'infiltre. On répare ou on refait l'étanchéité, avec une attention particulière aux points singuliers.",
    resume: "Membrane bitumineuse ou EPDM, relevés et évacuations remis en état.",
    devis: "Étanchéité de toit terrasse",
    sections: [
      {
        h2: "Des toits terrasses de plus en plus nombreux",
        p: [
          "Les villas contemporaines et les maisons des quartiers récents, à Frontignan comme dans les lotissements autour de Montpellier, ont souvent un toit terrasse, en totalité ou sur une extension. Garage accolé, chambre ajoutée au rez-de-chaussée, terrasse accessible au-dessus d'un séjour, ces surfaces plates se sont multipliées.",
          "Elles vieillissent différemment d'un toit en tuiles. Le soleil méditerranéen dégrade les membranes exposées, les écarts de température font travailler les jonctions, et les orages d'automne testent d'un coup toute la surface. Une étanchéité qui tenait depuis quinze ans peut lâcher lors d'un seul épisode méditerranéen.",
        ],
      },
      {
        h2: "Les signes d'une étanchéité fatiguée",
        liste: [
          "Flaques qui restent plusieurs jours après la pluie",
          "Cloques, plis ou fissures visibles sur la membrane",
          "Relevé décollé au pied d'un muret ou d'un acrotère",
          "Végétation qui pousse dans les angles ou sur les gravillons",
          "Taches au plafond de la pièce située juste en dessous",
          "Évacuation qui déborde lors des fortes averses",
        ],
      },
      {
        h2: "Membrane bitumineuse ou EPDM",
        p: [
          "La membrane bitumineuse est la solution la plus répandue. Elle se pose en général en deux couches soudées au chalumeau, la seconde étant autoprotégée par des paillettes minérales quand le toit n'est pas recouvert. Elle se répare bien et se raccorde facilement aux anciennes étanchéités du même type.",
          "L'EPDM est une membrane en caoutchouc synthétique, posée le plus souvent en une seule pièce découpée aux dimensions du toit et collée sur son support. Elle supporte bien les rayons du soleil et les dilatations. On la choisit volontiers pour les petites surfaces, les extensions et les toits où l'usage du chalumeau est délicat.",
          "Le choix dépend du support, de l'accessibilité de la terrasse et de l'étanchéité existante. On vous explique les options après la visite.",
        ],
      },
      {
        h2: "Relevés et évacuations, là où tout se joue",
        p: [
          "La plupart des infiltrations ne viennent pas du milieu du toit mais de ses bords. Les relevés d'étanchéité remontent le long des acrotères, des murets et des seuils de porte. Ils doivent monter assez haut et être protégés en tête par une bande de solin ou une couvertine, faute de quoi l'eau passe derrière.",
          "Les évacuations demandent la même rigueur. Naissance raccordée à la membrane, crapaudine pour arrêter les feuilles, trop-plein pour éviter la mise en charge en cas d'orage. Sous les pins, les aiguilles bouchent vite ces orifices. Pour les descentes et le zinc autour de la terrasse, on s'appuie sur notre activité de [zinguerie et gouttières](/services/zinguerie-gouttieres).",
        ],
      },
      {
        h2: "Réparer ponctuellement ou refaire",
        p: [
          "Une fissure localisée ou un relevé décollé se reprennent souvent par une pièce de renfort. Quand les défauts se multiplient ou que l'isolant sous la membrane est gorgé d'eau, une réfection complète est plus sûre. C'est aussi l'occasion d'améliorer l'[isolation de la toiture](/services/isolation-toiture) en posant un isolant neuf sous la nouvelle étanchéité.",
          "Si l'origine d'une tache reste incertaine, on commence par une [recherche de fuite](/services/recherche-de-fuite) avant de proposer quoi que ce soit.",
        ],
        liste: [
          "Nettoyage du support et dépose des protections, gravillons ou dalles",
          "Reprise ou remplacement de la membrane",
          "Réfection des relevés et des protections en tête",
          "Remise en état des naissances, crapaudines et trop-pleins",
          "Remise en place des protections ou des dalles sur plots",
        ],
      },
    ],
    faq: [
      {
        q: "Un toit terrasse doit-il avoir une pente ?",
        r: "Oui, une légère pente oriente l'eau vers les évacuations. Un toit parfaitement plat garde des flaques qui fatiguent la membrane. Lors d'une réfection, on peut corriger les zones en creux.",
      },
      {
        q: "Peut-on poser une membrane neuve sur l'ancienne ?",
        r: "Parfois, si l'ancienne est bien adhérente et sèche, et que le support le permet. Si elle est cloquée ou si l'isolant dessous est mouillé, il faut déposer. On décide après avoir sondé le complexe.",
      },
      {
        q: "Comment entretenir un toit terrasse ?",
        r: "Deux passages par an suffisent souvent, au printemps et avant l'automne, pour retirer feuilles et aiguilles, vérifier les évacuations et repérer une cloque ou un relevé qui se décolle.",
      },
      {
        q: "Intervenez-vous loin de Frontignan ?",
        r: "Oui, dans tout l'Hérault, sur rendez-vous. Pour les secteurs éloignés, on planifie la visite et on regroupe les déplacements. Consultez notre [zone d'intervention](/zone-intervention).",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "bachage-urgence",
    nom: "Bâchage de toiture en urgence",
    court: "Bâchage d'urgence",
    zone: 3,
    title: "Bâchage de toiture en urgence à Frontignan | ARVÉO",
    description:
      "Toit ouvert après une tempête, une tramontane ou une chute de branche ? Bâchage d'urgence et mise hors d'eau temporaire à Frontignan et dans l'Hérault.",
    h1: "Bâchage de toiture en urgence",
    chapo:
      "Quand le vent arrache des tuiles ou qu'une branche perce le toit, la priorité est d'arrêter l'eau. Dans le cadre de notre service de dépannage, on pose une bâche solidement tenue, puis on prévoit la réparation définitive.",
    resume: "Mise hors d'eau temporaire après tempête, tramontane ou chute de branche.",
    devis: "Bâchage d'urgence",
    sections: [
      {
        h2: "Une mise hors d'eau en attendant la réparation",
        p: [
          "Le bâchage est une mesure provisoire. Il protège l'intérieur de la maison, l'isolant et la charpente le temps de préparer les travaux, de commander les tuiles ou d'obtenir l'accord de l'assurance. Il fait partie de notre [dépannage de toiture](/depannage-toiture), au même titre que les petites réparations immédiates.",
          "Une bâche bien posée tient plusieurs semaines si elle est correctement lestée et fixée. Une bâche mal tenue, au contraire, claque au premier coup de vent, arrache d'autres tuiles et laisse l'eau passer par les côtés.",
        ],
      },
      {
        h2: "Les situations qui demandent un bâchage",
        liste: [
          "Tuiles envolées sur une grande surface après une tempête",
          "Faîtage ou rive arrachés par un coup de tramontane",
          "Chute d'un arbre ou de grosses branches de pin sur la couverture",
          "Toit percé par la grêle ou par un objet projeté",
          "Réparation qui ne peut pas être faite tout de suite, faute de matériaux ou de météo favorable",
        ],
        p: [
          "Les pins parasols, très présents autour de Frontignan, de Sète et sur le littoral, ont un bois cassant. Lors des grands vents, des branches entières tombent sur les toits voisins. Le dégât dépasse alors souvent les tuiles et touche les liteaux, voire un chevron.",
        ],
      },
      {
        h2: "Votre sécurité d'abord",
        p: [
          "Ne montez pas sur le toit, ni pendant la tempête ni juste après. Les tuiles mouillées glissent, certaines sont instables et une couverture percée peut céder sous le poids. Une branche encore accrochée peut aussi tomber sans prévenir.",
          "À l'intérieur, coupez l'électricité des pièces où l'eau coule, protégez les meubles et placez des récipients sous les gouttes. Notre article sur la [fuite de toiture et ce qu'il faut faire](/conseils/fuite-toiture-que-faire) détaille ces gestes. Ensuite, appelez-nous. On vous rappelle dans la journée et on organise le déplacement au plus vite selon la météo et les demandes en cours.",
        ],
      },
      {
        h2: "Photos et assurance",
        p: [
          "Avant toute intervention, prenez des photos depuis le sol, de la toiture, du jardin et des dégâts intérieurs. Elles serviront à votre déclaration de sinistre. De notre côté, on photographie la couverture de près avant de bâcher, puis après la pose.",
          "Vous recevez ces photos avec un descriptif des dégâts et, dès que possible, un devis pour la réparation définitive. La prise en charge dépend de votre contrat et des circonstances. Renseignez-vous auprès de votre assureur, qui demande souvent ces éléments.",
        ],
      },
      {
        h2: "Comment on pose une bâche",
        liste: [
          "Mise en sécurité de la zone et dégagement des branches ou débris",
          "Bâche épaisse et résistante aux UV, plus large que la zone ouverte",
          "Débord par-dessus le faîtage pour que l'eau ne passe pas en tête",
          "Fixation sur des liteaux ou lestage, sans percer les tuiles saines",
          "Contrôle de la tenue au vent, surtout côté nord-ouest",
        ],
      },
      {
        h2: "Après le bâchage, la réparation définitive",
        p: [
          "Une bâche ne reste jamais en place indéfiniment. Selon les dégâts, la suite peut être un [remplacement de tuiles](/services/remplacement-tuiles), une reprise de [charpente](/services/charpente) si un chevron a été touché, ou une [recherche de fuite](/services/recherche-de-fuite) si l'eau a cheminé ailleurs. Après un coup de vent, notre guide sur la [toiture après la tramontane](/conseils/toiture-apres-tramontane) aide à faire le tour des points à vérifier.",
          "Pour toute autre urgence sur votre toit, consultez notre page [dépannage de toiture en urgence](/depannage-toiture).",
        ],
      },
    ],
    faq: [
      {
        q: "Combien de temps une bâche peut-elle rester sur le toit ?",
        r: "Quelques semaines si elle est bien fixée et surveillée après chaque coup de vent. L'objectif reste de faire la réparation définitive dès que les matériaux et la météo le permettent.",
      },
      {
        q: "Puis-je poser une bâche moi-même ?",
        r: "On le déconseille. Monter sur un toit endommagé, sous la pluie ou dans le vent, expose à une chute grave. Une bâche mal lestée peut aussi s'envoler et causer d'autres dégâts.",
      },
      {
        q: "Le bâchage est-il pris en charge par l'assurance ?",
        r: "Souvent, les mesures conservatoires après un sinistre sont prises en compte, mais cela dépend de votre contrat. Gardez la facture et les photos, et renseignez-vous auprès de votre assureur.",
      },
      {
        q: "Intervenez-vous dans tout l'Hérault ?",
        r: "Oui. Autour de Frontignan et du bassin de Thau, le déplacement est simple à organiser. Pour les secteurs plus éloignés, on planifie l'intervention selon la météo et les urgences déjà prises en charge.",
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
    secteur: "bassin-de-thau",
    description:
      "Couvreur à Frontignan (34110), ARVÉO répare et refait les toitures du centre ancien, de La Peyrade et de Frontignan-Plage. Diagnostic et devis gratuits.",
    intro:
      "ARVÉO est installé à Frontignan. Du cœur de ville autour de l'église Saint-Paul jusqu'à La Peyrade et Frontignan-Plage, nous connaissons les toits de la commune et nous y intervenons au plus vite.",
    accent: "Couvreur de proximité, sur toute la commune au plus vite",
    quartiers: ["Centre ancien", "La Peyrade", "Frontignan-Plage"],
    texte: [
      "Le centre historique de Frontignan est fait de maisons de ville mitoyennes, souvent sur deux ou trois niveaux. Leurs toits en tuiles canal reposent sur des génoises et des faîtages scellés au mortier. Quand une tuile casse, l'eau suit les murs du voisin autant que les vôtres. On répare dans les règles, en réemployant les tuiles anciennes chaque fois qu'elles sont saines. Les tuiles neuves de complément sont choisies pour se fondre dans la teinte du toit. Pour comprendre les différences entre modèles, lisez notre guide sur la [tuile canal, romane ou mécanique](/conseils/tuile-canal-romane-mecanique).",
      "Frontignan-Plage vit face à la mer. Les villas y prennent le vent marin et les embruns toute l'année, si bien que les crochets, les solins et la zinguerie s'oxydent plus vite qu'en ville. Un contrôle des gouttières et des descentes tous les deux ou trois ans évite les débordements sous les génoises. Nos interventions de [zinguerie et gouttières](/services/zinguerie-gouttieres) tiennent compte de cet air salin, avec des fixations choisies pour durer.",
      "À La Peyrade, entre l'étang et Sète, on trouve des maisons plus récentes en tuiles mécaniques, des garages et des annexes à toit plat. Les petits toits-terrasses y souffrent surtout aux relevés d'étanchéité et aux évacuations. Sur ces surfaces, une membrane bien posée et une crapaudine dégagée suffisent souvent à régler une infiltration qui revient à chaque orage. Le soleil d'été durcit aussi les membranes anciennes, qui finissent par se fendre aux angles.",
      "Comme nous sommes sur place, une fuite à Frontignan se traite sans attendre une tournée. En cas d'urgence, passez par la page [dépannage toiture](/depannage-toiture). On vous rappelle dans la journée, on organise la mise hors d'eau, puis on revient pour la réparation durable à une date qui vous arrange.",
    ],
    vigilance: [
      "Génoises du centre ancien, dont les rangs de tuiles se descellent et laissent l'eau couler sur la façade.",
      "Faîtages scellés entre maisons mitoyennes, à reprendre en accord avec le voisin pour garder une ligne étanche.",
      "Crochets et pattes de fixation oxydés par les embruns à Frontignan-Plage.",
      "Relevés d'étanchéité des annexes et garages à toit plat de La Peyrade.",
      "Tuiles déplacées par la tramontane sur les versants tournés vers le nord-ouest.",
    ],
    faq: [
      {
        q: "Intervenez-vous à Frontignan-Plage et à La Peyrade ?",
        r: "Oui. ARVÉO est installé à Frontignan et couvre toute la commune, du centre ancien aux villas du bord de mer en passant par La Peyrade. Pour une fuite, on se déplace au plus vite. Pour un projet, on fixe ensemble un rendez-vous de diagnostic.",
      },
      {
        q: "Ma maison de ville partage son faîtage avec le voisin, comment se passe la réparation ?",
        r: "On commence par regarder où l'eau entre vraiment. Si la reprise touche la partie du voisin, on vous conseille de le prévenir avant les travaux. On raccorde ensuite tuiles et mortier proprement, pour que la jonction entre les deux toits reste étanche.",
      },
      {
        q: "Faut-il une autorisation pour refaire un toit dans le centre de Frontignan ?",
        r: "Selon la nature des travaux, une déclaration préalable peut être demandée, en particulier si l'aspect de la toiture change. Dans le centre ancien, la proximité d'édifices protégés peut ajouter des contraintes. Renseignez-vous en mairie avant de lancer le chantier, on vous aide à rassembler les éléments techniques.",
      },
    ],
  },
  {
    nom: "Sète",
    cp: "34200",
    lat: 43.4028,
    lng: 3.6928,
    secteur: "bassin-de-thau",
    description:
      "Couvreur à Sète (34200) pour réparation de toiture, recherche de fuite et zinguerie face aux embruns, du quartier haut au Mont Saint-Clair et à la Corniche.",
    intro:
      "Couvreur à Sète, ARVÉO vient de Frontignan voisine pour réparer, refaire ou entretenir votre toiture. Quartier haut, Mont Saint-Clair, Pointe Courte ou Corniche, chaque partie de la ville a ses contraintes propres.",
    accent: "Zinguerie et fixations pensées pour les embruns",
    quartiers: ["Quartier haut", "Mont Saint-Clair", "Pointe Courte", "La Corniche", "Île de Thau"],
    texte: [
      "À Sète, le sel est partout. Il se dépose sur les tuiles, ronge les crochets et perce les gouttières bien avant l'âge normal. Le vent marin pousse aussi la pluie sous les tuiles lors des fortes averses d'automne. Sur les toits proches des canaux et de la mer, on choisit donc des fixations inox et une zinguerie adaptée. Les toits les plus exposés, face au large, demandent un contrôle plus fréquent que ceux tournés vers l'étang. Notre page [recherche de fuite](/services/recherche-de-fuite) explique comment on retrouve l'origine d'une infiltration.",
      "Le quartier haut, longtemps celui des familles de pêcheurs, aligne des maisons étroites aux toits de tuiles canal, souvent sur des charpentes d'origine. Avant toute réfection, on contrôle l'état des chevrons et des pannes, car le bois a parfois souffert d'infiltrations anciennes. Quand une panne est trop abîmée, on la renforce ou on la remplace avant de reposer la couverture, plutôt que de masquer le problème sous des tuiles neuves. Au centre, les immeubles de plusieurs étages posent d'autres questions, comme l'accès aux chéneaux et aux souches de cheminée.",
      "Sur les pentes du Mont Saint-Clair et dans les ruelles de la Pointe Courte, l'accès se prépare. Échafaudage, monte-matériaux ou nacelle, chaque chantier demande sa solution, parfois une autorisation de voirie auprès de la mairie. On vous aide à préparer le dossier et on choisit le matériel le plus léger possible. Le stationnement des véhicules de chantier se prévoit aussi, car les places manquent dans le centre en été.",
      "Pour un projet plus lourd, voyez notre service de [réfection de toiture](/services/refection-toiture). Sète fait partie de notre [secteur du Bassin de Thau](/secteur/bassin-de-thau), le plus proche de notre base, ce qui facilite les visites de contrôle après travaux.",
    ],
    vigilance: [
      "Gouttières et crochets attaqués par le sel, en particulier le long de la Corniche et des canaux.",
      "Charpentes anciennes du quartier haut, à vérifier avant de reposer une couverture neuve.",
      "Souches de cheminée et solins des immeubles du centre, souvent fissurés.",
      "Accès difficile sur les pentes du Mont Saint-Clair, qui conditionne l'organisation du chantier.",
      "Pluie poussée par le vent marin sous les tuiles canal à faible recouvrement.",
    ],
    faq: [
      {
        q: "Vous occupez-vous des autorisations pour un échafaudage à Sète ?",
        r: "On vous indique la démarche et on prépare les éléments techniques utiles, à savoir l'emprise, la durée et le matériel. La demande d'occupation du domaine public se dépose ensuite auprès de la mairie de Sète, qui fixe ses propres conditions.",
      },
      {
        q: "Pourquoi mes gouttières en zinc sont-elles percées si vite ?",
        r: "Près de la mer, les embruns chargés de sel accélèrent la corrosion, surtout aux soudures et là où l'eau stagne. Une gouttière bien pentée et nettoyée régulièrement dure plus longtemps. On peut aussi remplacer les crochets par des modèles plus résistants.",
      },
      {
        q: "Intervenez-vous sur les immeubles en copropriété du centre de Sète ?",
        r: "Oui, pour les syndics comme pour les copropriétaires. On établit un diagnostic de la toiture avec photos, pour que la décision puisse être prise en assemblée générale. Le devis détaille chaque poste, de la couverture aux chéneaux.",
      },
    ],
  },
  {
    nom: "Balaruc-les-Bains",
    cp: "34540",
    lat: 43.4419,
    lng: 3.6775,
    secteur: "bassin-de-thau",
    description:
      "Couvreur à Balaruc-les-Bains (34540), ARVÉO répare, démousse et entretient les toits des maisons et résidences de la station thermale. Devis gratuit.",
    intro:
      "Couvreur à Balaruc-les-Bains, ARVÉO entretient et répare les toits des maisons, des résidences et des logements de curistes de la station thermale, sur la presqu'île comme dans les quartiers tournés vers l'étang.",
    accent: "Travaux calés entre deux séjours de curistes",
    texte: [
      "Une bonne part des logements de Balaruc-les-Bains se loue à des curistes ou à des vacanciers. Une fuite en pleine saison, c'est une location compromise. On organise donc les réparations entre deux séjours. Si vous ne pouvez pas être présent, on vous adresse des photos une fois le travail terminé. On peut aussi convenir d'un passage d'entretien chaque année, à la même période, pour que votre logement soit prêt avant l'ouverture de la saison des cures.",
      "La commune avance dans l'étang de Thau. L'air y reste humide une grande partie de l'année, et les versants orientés au nord se couvrent vite de mousses et de lichens. Ces végétaux retiennent l'eau et finissent par soulever les tuiles. Sur les versants sud, en revanche, c'est le soleil qui fatigue les tuiles et les mortiers de faîtage. Un [démoussage de toiture](/services/demoussage-toiture) manuel, suivi d'un traitement, prolonge la vie de la couverture sans abîmer la terre cuite.",
      "Les résidences collectives de la station ont souvent des toitures-terrasses ou des toits à faible pente. Sur ces surfaces, les relevés d'étanchéité et les évacuations d'eaux pluviales sont les points faibles. Un contrôle annuel limite les dégâts dans les appartements du dernier étage. Les copropriétés reçoivent un rapport clair, avec photos, pour faciliter les décisions en assemblée. Pour ces travaux, voyez notre page [étanchéité de toit-terrasse](/services/etancheite-toit-terrasse).",
      "Les maisons individuelles, elles, sont surtout couvertes de tuiles canal ou romanes. Gouttières encombrées et tuiles glissées y causent la plupart des infiltrations. Une visite d'entretien avant l'automne suffit souvent à les prévenir, et elle se planifie facilement hors saison touristique. Les tuiles cassées lors de la pose d'une antenne ou d'un climatiseur sont aussi une cause fréquente de fuite.",
    ],
    vigilance: [
      "Mousses et lichens sur les versants nord, entretenus par l'humidité de l'étang.",
      "Toitures-terrasses des résidences, avec des relevés et des évacuations à surveiller.",
      "Gouttières encombrées qui débordent sur les façades lors des pluies d'automne.",
      "Calendrier des locations saisonnières, qui impose de bien choisir la date des travaux.",
    ],
    faq: [
      {
        q: "Pouvez-vous intervenir sans que je sois sur place ?",
        r: "Oui, dès lors que l'accès au toit se fait par l'extérieur. On convient à l'avance des modalités d'accès, du stationnement et du créneau. À la fin, vous recevez un compte rendu avec photos avant et après l'intervention.",
      },
      {
        q: "Mon logement est loué toute la saison, quand faire les travaux ?",
        r: "Le plus simple est de prévoir une révision hors saison, à l'automne ou en fin d'hiver. Pour une fuite pendant un séjour, on intervient dès que possible pour mettre le toit hors d'eau, puis on programme la réparation définitive entre deux locations.",
      },
      {
        q: "Le syndic de ma résidence doit-il commander les travaux de toiture ?",
        r: "Pour une toiture commune, c'est en général le syndic qui commande après décision de la copropriété. On lui transmet un diagnostic et un devis détaillé. Pour une partie privative, renseignez-vous sur le règlement de copropriété de votre immeuble.",
      },
    ],
  },
  {
    nom: "Balaruc-le-Vieux",
    cp: "34540",
    lat: 43.4628,
    lng: 3.6853,
    secteur: "bassin-de-thau",
    description:
      "Couvreur à Balaruc-le-Vieux (34540) pour les toits imbriqués du village circulaire et les locaux en bac acier des zones d'activité. Réparation et dépannage.",
    intro:
      "Couvreur à Balaruc-le-Vieux, ARVÉO intervient dans le village circulaire perché au-dessus de l'étang comme dans les zones d'activité, pour la réparation, la réfection, la zinguerie et le dépannage des toitures.",
    accent: "Village circulaire et locaux professionnels",
    quartiers: ["Vieux village", "Zones d'activité"],
    texte: [
      "Le vieux village de Balaruc-le-Vieux s'est construit en cercle autour de son église. Ces maisons serrées les unes contre les autres forment un ensemble de toits imbriqués. Chaque reprise de faîtage, de noue ou de rive doit se raccorder proprement à la couverture voisine, sans créer de point bas où l'eau s'accumule. Une erreur de raccord se paie vite, car l'eau du toit voisin peut alors se déverser sur le vôtre.",
      "Dans ces ruelles étroites, il n'est pas toujours possible de monter un échafaudage. On travaille alors depuis une toiture voisine, avec l'accord du propriétaire, ou avec un matériel léger. Le matériel passe parfois à la main, tuile après tuile. Les tuiles anciennes sont triées et reposées quand elles le permettent. Les manques sont complétés par des [tuiles de remplacement](/services/remplacement-tuiles) de teinte proche, pour que la reprise reste discrète.",
      "En contrebas, les zones commerciales et artisanales accueillent des bâtiments couverts en bac acier. Les fuites y viennent souvent des recouvrements entre plaques, des vis dont la rondelle a vieilli et des chéneaux encrassés. On intervient en dehors des heures d'ouverture si votre activité l'exige, pour ne pas gêner vos clients. Les plaques translucides devenues cassantes avec le soleil sont aussi à surveiller, car elles se fendent au moindre choc.",
      "Les maisons plus récentes des lotissements posent des questions plus classiques, à savoir faîtage, rives et gouttières. Un coup d'œil après un épisode de tramontane permet de repérer une tuile soulevée avant qu'elle ne s'envole. Notre guide [que vérifier après la tramontane](/conseils/toiture-apres-tramontane) détaille les points à regarder depuis le sol, sans prendre de risque. Les gouttières de ces maisons récentes, souvent en PVC, se déforment aussi avec la chaleur.",
    ],
    vigilance: [
      "Noues et faîtages partagés entre maisons mitoyennes du village circulaire.",
      "Accès limité dans les ruelles, qui oblige à prévoir un matériel adapté.",
      "Vis et rondelles d'étanchéité vieillies sur les toitures en bac acier.",
      "Chéneaux des bâtiments d'activité, encrassés par les poussières et les feuilles.",
      "Tuiles de rive soulevées par la tramontane sur les maisons de lotissement.",
    ],
    faq: [
      {
        q: "Intervenez-vous sur des toitures en bac acier ?",
        r: "Oui, pour la réparation des recouvrements, le remplacement des vis et des plaques abîmées, et le nettoyage des chéneaux. On peut aussi poser des closoirs neufs pour empêcher l'eau et les oiseaux de passer sous les tôles.",
      },
      {
        q: "Peut-on travailler dans le village sans échafaudage ?",
        r: "Souvent oui, pour une réparation ponctuelle. On accède par l'intérieur, par une fenêtre de toit ou depuis une toiture voisine avec l'accord de son propriétaire. Pour une réfection complète, un échafaudage reste en général nécessaire pour travailler en sécurité.",
      },
      {
        q: "Pouvez-vous intervenir sans fermer mon commerce ?",
        r: "Oui, on planifie le chantier tôt le matin, en fin de journée ou le jour de fermeture. Pour une fuite active, on bâche ou on colmate d'abord, puis on revient faire la réparation durable au moment le moins gênant pour vous.",
      },
    ],
  },
  {
    nom: "Vic-la-Gardiole",
    cp: "34110",
    lat: 43.4889,
    lng: 3.7967,
    secteur: "bassin-de-thau",
    description:
      "Couvreur à Vic-la-Gardiole (34110), ARVÉO nettoie gouttières et noues, démousse et répare les toitures entre l'étang de Vic et la pinède de la Gardiole.",
    intro:
      "Couvreur à Vic-la-Gardiole, entre l'étang de Vic et les pentes boisées du massif de la Gardiole, ARVÉO répare les toitures, nettoie les gouttières et démousse les versants exposés à l'humidité.",
    accent: "Gouttières et noues dégagées avant l'automne",
    texte: [
      "Le village s'est installé au pied de la Gardiole, dont les pinèdes descendent jusqu'aux dernières maisons. Chaque coup de vent dépose des aiguilles de pin dans les gouttières et les noues. Elles forment un feutre qui retient l'eau, et la pluie finit par déborder sous la génoise ou par remonter sous les tuiles. Les génoises, saturées d'eau à répétition, finissent par perdre leur mortier. Le phénomène s'aggrave en automne, quand le vent du nord arrache les aiguilles sèches.",
      "Le meilleur moment pour dégager tout cela se situe à la fin de l'été, avant les pluies méditerranéennes. On nettoie les chéneaux et les descentes, on vérifie les crapaudines, puis on contrôle les tuiles du bas de pente. Nos interventions de [zinguerie et gouttières](/services/zinguerie-gouttieres) incluent ce type d'entretien. Si vous le souhaitez, on peut aussi poser des grilles pare-feuilles en tête de descente, qui limitent les bouchons sans dispenser d'un nettoyage.",
      "Côté étang, le climat est plus humide. Les mousses et les lichens colonisent les tuiles canal et les rendent poreuses. On procède par un [démoussage](/services/demoussage-toiture) manuel suivi d'un traitement, sans nettoyeur haute pression, qui casserait la surface des tuiles anciennes. Le produit appliqué ensuite continue d'agir plusieurs mois, porté par la pluie. Pour choisir la bonne période, lisez notre conseil sur le [démoussage selon la saison](/conseils/demoussage-toiture-saison).",
      "Le centre ancien, autour de l'église fortifiée Sainte-Léocadie, garde des maisons de village aux toits anciens et aux génoises fragiles. Les quartiers récents, eux, ont des couvertures en tuiles romanes ou mécaniques posées sur écran sous-toiture. Les deux demandent des gestes différents, et on adapte la méthode à chaque maison. Sur les maisons récentes, ce sont surtout les closoirs et les noues qui demandent une surveillance.",
    ],
    vigilance: [
      "Aiguilles de pin qui bouchent gouttières, noues et crapaudines près de la pinède.",
      "Mousses et lichens sur les tuiles canal des maisons tournées vers l'étang.",
      "Débordements sous la génoise lors des premières grosses pluies d'automne.",
      "Tuiles du bas de pente fragilisées par l'eau qui stagne derrière les débris.",
    ],
    faq: [
      {
        q: "Proposez-vous un entretien annuel des gouttières ?",
        r: "Oui. On peut convenir d'un passage chaque année à la même période, de préférence en fin d'été. On nettoie les gouttières et les noues, on vérifie les descentes et on vous signale toute tuile cassée ou déplacée repérée au passage.",
      },
      {
        q: "Le nettoyeur haute pression est-il une bonne idée pour démousser ?",
        r: "Non, surtout sur des tuiles anciennes. Le jet arrache la surface de la tuile, qui devient plus poreuse et se recouvre de mousse encore plus vite. On préfère un brossage manuel, puis un produit appliqué à basse pression qui agit dans la durée.",
      },
      {
        q: "Les pins du voisin abîment-ils ma toiture ?",
        r: "Pas directement, mais leurs aiguilles et leurs pommes encombrent l'évacuation de l'eau. Une branche qui frotte peut aussi déplacer des tuiles par grand vent. Un nettoyage régulier et, si besoin, un élagage côté toit règlent la plupart des problèmes.",
      },
    ],
  },
  {
    nom: "Mireval",
    cp: "34110",
    lat: 43.5089,
    lng: 3.8008,
    secteur: "bassin-de-thau",
    description:
      "Couvreur à Mireval (34110) pour maisons vigneronnes, remises et maisons de village. Charpente, réparation et réfection de toiture au pays du muscat.",
    intro:
      "Couvreur à Mireval, au pays du muscat, ARVÉO s'occupe des toitures des maisons de village, des anciennes maisons vigneronnes et des remises agricoles, de la simple réparation à la réfection complète.",
    accent: "Grandes toitures sur charpente traditionnelle",
    texte: [
      "Mireval s'étend entre la Gardiole et l'étang de Vic, au milieu des vignes du muscat. Beaucoup de maisons anciennes y ont abrité une activité viticole. Elles ont gardé de grandes toitures à deux pentes, posées sur une charpente traditionnelle en bois massif, avec parfois une cave ou un chai au rez-de-chaussée. Ces toitures couvrent souvent plus de surface que la façade ne le laisse deviner depuis la rue.",
      "Sur ces volumes, la couverture n'est solide que si le bois qui la porte l'est aussi. Avant de refaire un toit, on contrôle les chevrons, les pannes et leurs appuis dans les murs. Un bois attaqué par les insectes ou une panne qui fléchit se traite d'abord. Notre service [charpente](/services/charpente) permet de tout gérer dans le même chantier, sans attendre un second artisan. Les pièces de bois atteintes sont remplacées par du bois traité de même section.",
      "Les remises, hangars et dépendances posent une autre question, celle du budget. Il n'est pas toujours utile de tout refaire. Remplacer les tuiles cassées, reprendre un faîtage et renforcer un chevron suffit souvent à remettre le bâtiment hors d'eau pour de longues années. Pour arbitrer, voyez notre article [refaire ou réparer sa toiture](/conseils/refaire-ou-reparer-toiture). On chiffre chaque option pour que vous puissiez comparer sereinement.",
      "Dans le cœur du village, les maisons mitoyennes ont des toits plus modestes en tuiles canal, avec génoises en façade. On y intervient pour des fuites, des tuiles glissées ou des descentes d'eau à reprendre. Les gouttières pendantes en zinc y côtoient parfois des descentes anciennes, fendues par un choc ou par l'usure. Mireval appartient à notre [secteur du Bassin de Thau](/secteur/bassin-de-thau), tout proche de Frontignan.",
    ],
    vigilance: [
      "Pannes et chevrons des anciennes maisons vigneronnes, à contrôler avant toute réfection.",
      "Grands pans de toiture exposés à la tramontane, où les tuiles glissent par rangées.",
      "Remises et hangars agricoles dont la couverture n'a pas été révisée depuis longtemps.",
      "Génoises des maisons du centre, qui s'effritent et laissent passer l'eau en façade.",
    ],
    faq: [
      {
        q: "Pouvez-vous réparer une vieille remise sans tout refaire ?",
        r: "Oui, dans bien des cas. On remplace les tuiles cassées, on reprend les faîtages et on renforce ponctuellement la charpente. Le bâtiment retrouve son étanchéité pour un coût maîtrisé. On vous dit honnêtement si une réfection devient plus raisonnable.",
      },
      {
        q: "Comment savoir si la charpente de ma maison vigneronne est saine ?",
        r: "Lors du diagnostic, on monte dans les combles quand c'est possible. On sonde le bois, on cherche les traces d'insectes et d'humidité, et on observe la ligne du faîtage. Un faîtage qui ondule signale souvent une panne ou un chevron fatigué.",
      },
      {
        q: "Peut-on transformer une ancienne remise en pièce habitable ?",
        r: "C'est un projet qui touche à l'urbanisme et à la structure. Renseignez-vous d'abord en mairie sur les règles applicables. Côté toiture, on peut ensuite prévoir isolation, écran sous-toiture et fenêtres de toit pour rendre le volume confortable.",
      },
    ],
  },
  {
    nom: "Gigean",
    cp: "34770",
    lat: 43.4994,
    lng: 3.7106,
    secteur: "bassin-de-thau",
    description:
      "Couvreur à Gigean (34770), ARVÉO reprend faîtages, rives et closoirs exposés à la tramontane et répare les toits du centre ancien. Devis gratuit.",
    intro:
      "Couvreur à Gigean, au pied du massif de la Gardiole, ARVÉO répare, refait et entretient les toitures du centre ancien comme celles des quartiers résidentiels qui se sont développés autour du village.",
    accent: "Faîtages et rives renforcés contre la tramontane",
    texte: [
      "Gigean a beaucoup grandi en quelques décennies. Autour du vieux centre se sont ajoutés des lotissements de maisons individuelles couvertes en tuiles romanes ou mécaniques. Ces toits sont récents, mais ils ne sont pas à l'abri. Leurs faiblesses se concentrent aux extrémités, sur le faîtage et les rives. Une faîtière qui bouge ne se voit pas toujours depuis le sol, mais elle laisse entrer l'eau à chaque pluie poussée par le vent.",
      "Le village est ouvert à la tramontane qui descend vers l'étang. Par grand vent, une faîtière mal fixée se soulève, puis entraîne les tuiles voisines. Les rives, en bout de pan, prennent le vent de côté. On contrôle les fixations, on reprend les faîtages posés à sec et on vérifie les closoirs pour garder une couverture ventilée. Les vis et crochets inox remplacent les fixations rouillées. Tout cela relève de notre service [faîtage et rives](/services/faitage-rives).",
      "Dans le centre, les maisons anciennes ont gardé leurs tuiles canal et leurs génoises. Les problèmes y sont plus classiques, à savoir tuiles glissées, mortier fissuré et gouttières fatiguées. On répare en respectant le matériau d'origine, sans remplacer ce qui peut encore servir. Quand une génoise se dégrade, on reprend ses rangs de tuiles au mortier de chaux, sans toucher au reste de la façade.",
      "Sur les hauteurs de la Gardiole, les ruines de l'abbaye Saint-Félix-de-Montceau rappellent l'ancienneté des lieux. Plus près des maisons, la garrigue et les pins laissent leurs débris dans les gouttières. En lisière de garrigue, un nettoyage des gouttières avant l'été limite aussi l'accumulation de débris secs. Après un coup de vent, consultez notre [guide après la tramontane](/conseils/toiture-apres-tramontane) puis, si besoin, la page [dépannage toiture](/depannage-toiture).",
    ],
    vigilance: [
      "Faîtières posées à sec, soulevées par la tramontane sur les maisons récentes.",
      "Tuiles de rive mal fixées en bout de pan, très exposées au vent latéral.",
      "Closoirs abîmés qui laissent entrer l'eau et les nuisibles sous le faîtage.",
      "Mortier fissuré et tuiles glissées sur les toits anciens du centre.",
      "Débris de garrigue et de pins dans les gouttières des maisons en lisière.",
    ],
    faq: [
      {
        q: "Des tuiles se sont envolées après un coup de vent, que faire ?",
        r: "Éloignez-vous de la zone sous le toit et ne montez pas vous-même. Prenez des photos depuis le sol, puis contactez-nous ou faites une demande de dépannage en ligne. On met la toiture hors d'eau, puis on remplace les tuiles et on renforce les fixations.",
      },
      {
        q: "Ma maison a quinze ans, faut-il déjà surveiller le toit ?",
        r: "Oui, surtout le faîtage et les rives. Sur une maison de cet âge, les closoirs et les fixations ont pu vieillir sous le soleil et le vent. Un contrôle visuel tous les deux ou trois ans permet de corriger un défaut avant qu'il ne provoque une fuite.",
      },
      {
        q: "Qu'est-ce qu'un faîtage posé à sec ?",
        r: "C'est un faîtage fixé mécaniquement, sans mortier, avec un closoir ventilé sous les faîtières. Bien posé, il résiste au vent et laisse respirer la toiture. Mal fixé ou avec un closoir dégradé, il devient le premier point d'entrée de l'eau.",
      },
    ],
  },
  {
    nom: "Poussan",
    cp: "34560",
    lat: 43.4889,
    lng: 3.6714,
    secteur: "bassin-de-thau",
    description:
      "Couvreur à Poussan (34560), ARVÉO répare les toits de tuiles canal du vieux village en réemployant les tuiles anciennes. Recherche de fuite et réfection.",
    intro:
      "Couvreur à Poussan, ARVÉO répare, révise et refait les toitures des maisons de pierre du vieux village et des quartiers plus récents tournés vers l'étang de Thau, de la recherche de fuite à la réfection.",
    accent: "Tuiles anciennes du vieux village réemployées",
    texte: [
      "Le centre ancien de Poussan est fait de maisons en pierre aux murs épais, serrées le long de rues étroites. Leurs toits en tuiles canal ont souvent été repris par morceaux au fil des générations. Résultat, on trouve sur un même pan des tuiles de plusieurs époques, de formes et de teintes variées. Certaines tuiles anciennes, moulées à la main, ont une forme plus irrégulière que les modèles actuels.",
      "Quand une réparation s'impose, on privilégie le réemploi des tuiles d'origine. On les dépose, on les trie, on les nettoie, puis on les repose en complétant avec des tuiles de récupération proches. Le toit garde son aspect et le village son caractère. Ce travail demande plus de temps qu'une pose neuve, mais il évite de dénaturer une façade de rue. Pour en savoir plus sur les modèles, lisez notre page sur la [tuile canal, romane ou mécanique](/conseils/tuile-canal-romane-mecanique).",
      "Les épisodes méditerranéens d'automne mettent ces couvertures à rude épreuve. En quelques heures, il tombe parfois l'équivalent de plusieurs semaines de pluie. Une tuile glissée ou un solin fissuré suffit alors à faire couler l'eau dans une chambre. Les gouttières du centre, souvent sous-dimensionnées pour ces pluies, débordent alors sur la rue. Une révision avant l'automne permet de repérer ces défauts à temps.",
      "Si l'eau est déjà entrée, on commence par une [recherche de fuite](/services/recherche-de-fuite), car la tache au plafond se trouve rarement à l'aplomb du défaut. Pour comprendre l'origine, on observe les combles, les traces au plafond et l'état de la couverture au-dessus. On remonte le chemin de l'eau, on répare la cause, puis on vous conseille sur la suite à donner, réparation ciblée ou reprise plus large.",
    ],
    vigilance: [
      "Tuiles d'époques différentes sur un même pan, qui ne s'emboîtent plus correctement.",
      "Solins fissurés au pied des murs et des cheminées en pierre.",
      "Rues étroites du centre où l'accès au toit se prépare à l'avance.",
      "Révision à prévoir avant les épisodes méditerranéens d'automne.",
    ],
    faq: [
      {
        q: "Conservez-vous les tuiles anciennes ?",
        r: "Quand elles sont saines, oui. On les trie une à une, on écarte celles qui sont fendues ou devenues trop poreuses, et on les repose. Les manques sont complétés avec des tuiles de récupération ou neuves de teinte proche, pour que la réparation ne se remarque pas.",
      },
      {
        q: "Une tache au plafond, est-ce forcément la tuile juste au-dessus ?",
        r: "Pas toujours. L'eau peut entrer plus haut, courir le long d'un chevron ou sur l'écran sous-toiture, puis tomber un mètre plus loin. C'est pourquoi on cherche l'origine réelle avant de réparer, pour ne pas changer des tuiles saines.",
      },
      {
        q: "Quand faire réviser ma toiture à Poussan ?",
        r: "La fin de l'été est la meilleure période, avant les grosses pluies d'automne. Le toit est sec, les défauts se voient bien et il reste le temps de réparer. Une seconde visite après un hiver venteux peut aussi être utile sur les toits anciens.",
      },
    ],
  },
  {
    nom: "Villeneuve-lès-Maguelone",
    cp: "34750",
    lat: 43.5325,
    lng: 3.8603,
    secteur: "bassin-de-thau",
    description:
      "Couvreur à Villeneuve-lès-Maguelone (34750), ARVÉO répare toitures, gouttières et solins exposés à l'air marin des étangs. Démoussage et devis gratuit.",
    intro:
      "Couvreur à Villeneuve-lès-Maguelone, entre Montpellier et la mer, ARVÉO répare les toitures, reprend la zinguerie et démousse les couvertures exposées à l'humidité des étangs et au vent marin.",
    accent: "Zinguerie et entretien adaptés à l'air marin",
    texte: [
      "Villeneuve-lès-Maguelone vit au contact des étangs. Entre le village et le cordon littoral, où se dresse la cathédrale de Maguelone, s'étendent des salins et des zones humides. Cet environnement entretient une humidité presque permanente et apporte, par vent marin, un air chargé de sel jusque sur les toits du centre. Les toits proches des étangs sont aussi très fréquentés par les oiseaux, qui déplacent parfois les tuiles en nichant dessous.",
      "Les gouttières et les solins sont donc les premiers éléments à surveiller. Une soudure qui cède, un crochet rouillé ou un solin décollé laissent l'eau ruisseler sur la façade ou s'infiltrer au pied d'un mur. Notre service de [zinguerie et gouttières](/services/zinguerie-gouttieres) remplace les éléments usés par des matériaux qui supportent cet air marin. On vérifie aussi les crochets des gouttières pendantes, souvent les premiers à céder sous le poids de l'eau.",
      "Le centre garde des maisons anciennes en tuiles canal, tandis que les quartiers plus récents ont des tuiles romanes ou mécaniques. Sur les premières, on surveille génoises et faîtages scellés. Sur les secondes, ce sont plutôt les closoirs et les fixations. Les mousses, elles, se plaisent partout, et un [démoussage de toiture](/services/demoussage-toiture) tous les quelques années protège les tuiles. Il se fait à la brosse, jamais au jet haute pression.",
      "La commune appartient à Montpellier Méditerranée Métropole, mais elle touche presque Frontignan. Nous la rattachons donc à notre [secteur du Bassin de Thau](/secteur/bassin-de-thau). On s'y rend aussi pour de petites réparations, en regroupant si possible plusieurs interventions. Pour une visite de contrôle, on vous propose un créneau sur une journée où nous travaillons déjà dans les environs, ce qui simplifie l'organisation.",
    ],
    vigilance: [
      "Gouttières et crochets corrodés par l'air salin venu des étangs et de la mer.",
      "Solins décollés au pied des murs et des souches de cheminée.",
      "Mousses entretenues par l'humidité des zones humides voisines.",
      "Closoirs et fixations des maisons récentes, à contrôler après un coup de vent.",
    ],
    faq: [
      {
        q: "Vous déplacez-vous jusqu'à Villeneuve-lès-Maguelone pour une petite réparation ?",
        r: "Oui. La commune est proche de Frontignan et nous y intervenons volontiers. Pour limiter les frais, on peut regrouper plusieurs petites réparations en une seule visite, par exemple une tuile cassée, une gouttière à refixer et un solin à reprendre.",
      },
      {
        q: "Tous les combien faut-il démousser une toiture près des étangs ?",
        r: "Cela dépend de l'orientation et de l'ombre portée par les arbres. Dans un environnement humide, un contrôle tous les trois à cinq ans est raisonnable. On démousse quand la mousse commence à soulever les tuiles ou à retenir l'eau, pas par principe.",
      },
      {
        q: "Mon solin fuit au pied de la cheminée, est-ce grave ?",
        r: "Pas forcément grave, mais à traiter sans tarder. L'eau qui passe par un solin descend le long du conduit et abîme le plafond, voire la charpente. On reprend le solin au mortier ou on pose un abergement en zinc selon la configuration.",
      },
    ],
  },
  {
    nom: "Montbazin",
    cp: "34560",
    lat: 43.5167,
    lng: 3.6967,
    secteur: "bassin-de-thau",
    description:
      "Couvreur à Montbazin (34560), dans la vallée de la Vène, ARVÉO contrôle et répare les toitures après les orages d'automne. Réfection et isolation.",
    intro:
      "Couvreur à Montbazin, dans la vallée de la Vène, ARVÉO répare, refait et entretient les toitures du village et des mas alentour, avec une attention particulière aux dégâts laissés par les orages d'automne.",
    accent: "Contrôle des toitures après les orages d'automne",
    texte: [
      "Montbazin s'est installé dans la vallée de la Vène, entre la Gardiole et les collines de garrigue qui montent vers le nord. Le village garde un centre ancien aux maisons de pierre, entouré de quartiers plus récents et de quelques mas au milieu des vignes et des oliviers. La Vène, souvent à sec, peut gonfler très vite lors des orages d'automne, ce qui donne une idée de la violence des pluies.",
      "Les toitures anciennes sont souvent à faible pente, couvertes de tuiles canal. Cette pente douce convient à l'été sec, mais elle évacue moins vite l'eau des gros orages. Après un épisode violent, il faut vérifier les tuiles déplacées, l'état du faîtage et les noues, où l'eau se concentre. Une noue encombrée de feuilles d'olivier ou de débris de garrigue déborde en quelques minutes. En cas de dégât, la page [dépannage toiture](/depannage-toiture) vous explique la marche à suivre.",
      "Une réfection est aussi le bon moment pour améliorer le confort de la maison. Quand la couverture est déposée, poser un écran sous-toiture et un isolant se fait bien plus simplement qu'après coup. On vérifie aussi la ventilation, indispensable sous la couverture. On étudie avec vous la solution adaptée, et notre page [isolation de toiture](/services/isolation-toiture) détaille les options. Pour les aides éventuelles, consultez le site france-renov.gouv.fr.",
      "Pour les mas et dépendances, on propose des révisions simples. Remplacer quelques tuiles, refixer une rive ou dégager une gouttière évite qu'un petit défaut ne devienne un chantier. Les toitures des mas, souvent plus vastes, gagnent à être révisées tous les quelques années. Le village fait partie de notre secteur proche, entre Gigean et Poussan, ce qui rend ces passages faciles à organiser.",
    ],
    vigilance: [
      "Tuiles canal déplacées sur les toits à faible pente après les orages.",
      "Noues où l'eau des gros orages se concentre et déborde.",
      "Faîtages scellés dont le mortier se fissure avec les écarts de température.",
      "Absence d'écran sous-toiture sur les maisons anciennes, à envisager lors d'une réfection.",
    ],
    faq: [
      {
        q: "Faites-vous une visite de contrôle après un orage ?",
        r: "Oui, prenez rendez-vous pour un diagnostic. On examine la couverture, les noues et le faîtage, puis on vous dit ce qui doit être réparé et ce qui peut attendre. La visite est sans engagement, et vous recevez un devis si des travaux sont utiles.",
      },
      {
        q: "Peut-on isoler une maison ancienne par la toiture ?",
        r: "Oui, et la réfection de la couverture en est le moment idéal. On peut poser un isolant et un écran sous-toiture par l'extérieur, en conservant si possible les tuiles anciennes. On vérifie avant tout que la charpente supporte la nouvelle composition.",
      },
      {
        q: "Ma toiture a une pente très faible, est-ce un problème ?",
        r: "Pas en soi, les tuiles canal ont été posées ainsi pendant des siècles. Il faut en revanche un recouvrement suffisant entre les tuiles et des noues bien dégagées. Si la pente est trop faible pour le modèle de tuile, on vous propose une solution adaptée.",
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
    r: "Nous sommes installés à Frontignan et intervenons dans tout l'Hérault. Autour de l'étang de Thau au quotidien, et sur rendez-vous à Montpellier, Béziers, Agde, Pézenas, Lunel, Clermont-l'Hérault, Lodève ou Bédarieux.",
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
    lien: { href: "/services/bachage-urgence", texte: "Le bâchage d'urgence en détail" },
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
