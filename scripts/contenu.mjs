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
    title: "Zinguerie et gouttières à Frontignan | ARVÉO",
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
