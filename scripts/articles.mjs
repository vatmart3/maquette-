/*
 * ARVÉO — articles « conseils ».
 * Chaque article a son angle propre. Liens internes au format [ancre](/chemin).
 * Après modification : node scripts/build.mjs
 */

export const ARTICLES = [
  /* ---------------------------------------------------------------- */
  /* 1. Fuite de toiture                                               */
  /* ---------------------------------------------------------------- */
  {
    slug: "fuite-toiture-que-faire",
    titre: "Fuite de toiture, que faire en attendant le couvreur",
    title: "Fuite de toiture, que faire en attendant | ARVÉO",
    description:
      "Une fuite de toiture se déclare ? Les bons gestes en attendant le couvreur, sécurité, électricité, protection des meubles, et les infos utiles au diagnostic.",
    chapo:
      "L'eau goutte du plafond un soir d'orage et le couvreur ne peut pas être là dans la minute. Voici les gestes qui limitent les dégâts, ceux qu'il vaut mieux éviter, et ce qu'il faut noter pour que la réparation soit juste du premier coup.",
    publie: "2026-11-09",
    maj: "2026-11-09",
    services: ["recherche-de-fuite", "bachage-urgence", "remplacement-tuiles"],
    sections: [
      {
        h2: "Les premiers gestes dans la maison",
        blocs: [
          {
            p: "Face à une infiltration, le réflexe est souvent de chercher d'où vient l'eau. Commencez plutôt par la mettre hors d'état de nuire. Une fuite qui dure une nuit abîme un plafond, une fuite qui touche un circuit électrique peut blesser quelqu'un.",
          },
          { h3: "Mettre l'électricité en sécurité" },
          {
            p: "Si l'eau coule près d'un plafonnier, d'une prise, d'un interrupteur ou d'un spot encastré, coupez le disjoncteur du circuit concerné au tableau. En cas de doute sur le bon circuit, coupez le général. Ne touchez pas un appareil mouillé et ne marchez pas pieds nus dans une flaque proche d'une prise.",
          },
          { h3: "Recueillir l'eau et protéger le mobilier" },
          {
            p: "Placez une bassine ou un seau sous chaque goutte, avec une serpillière au fond pour éviter les éclaboussures. Écartez les meubles, les tapis, les appareils et les cartons. Ce qui ne bouge pas se couvre d'une bâche ou d'un drap plastique.",
          },
          {
            p: "Quand une poche d'eau gonfle sous la peinture d'un plafond, percez-la au point le plus bas avec un tournevis fin, au-dessus d'un seau. L'eau s'évacue par un seul trou au lieu de s'étaler dans tout le placo. Si le plafond s'affaisse ou craque, quittez la pièce et fermez la porte.",
          },
          {
            p: "Une fois l'écoulement maîtrisé, aérez la pièce si le temps le permet. Un plafond ou un isolant détrempé met du temps à sécher, et l'humidité enfermée favorise les moisissures.",
          },
        ],
      },
      {
        h2: "Pourquoi il ne faut pas monter sur le toit",
        blocs: [
          {
            p: "La tentation est grande de grimper avec une échelle pour repositionner une tuile. C'est la cause d'accidents la plus banale chez les particuliers. Une couverture mouillée glisse, surtout avec les mousses et les lichens fréquents sur les pans nord.",
          },
          {
            p: "Les tuiles canal des maisons anciennes ne sont pas faites pour qu'on marche dessus. Elles cassent sous le pied et ce qui n'était qu'une tuile déplacée devient trois tuiles fendues. Par vent fort, une bâche tenue à bout de bras fait office de voile et peut déséquilibrer la personne qui la porte.",
          },
          {
            p: "Restez au sol ou à l'intérieur. Si une trappe donne accès aux combles et que le plancher est solide, vous pouvez y jeter un œil à la lampe, en posant les pieds sur les solives et jamais entre elles.",
          },
        ],
      },
      {
        h2: "Ce qu'il faut observer pour aider le diagnostic",
        blocs: [
          {
            p: "L'endroit où l'eau apparaît au plafond n'est pas toujours sous l'endroit où elle entre. Elle peut courir le long d'un chevron ou d'un écran sous-toiture sur plusieurs mètres. Vos observations font gagner du temps à la [recherche de fuite](/services/recherche-de-fuite) et évitent de remplacer des tuiles saines.",
          },
          {
            liste: [
              "La pièce et l'emplacement exact de la tache ou du goutte-à-goutte.",
              "Le temps qu'il faisait, pluie fine, averse orageuse, pluie poussée par le vent marin venu de la mer.",
              "Le moment où l'eau est apparue, au début de l'averse ou après plusieurs heures.",
              "Les éléments proches, cheminée, fenêtre de toit, mur mitoyen, noue entre deux pans.",
              "Des photos datées du plafond, des combles et de la toiture vue depuis la rue.",
            ],
          },
          {
            p: "Une fuite qui ne se manifeste que par vent de sud-est n'a pas la même origine qu'une fuite qui coule à chaque pluie. Le couvreur en déduit souvent la zone à inspecter avant même d'avoir posé son échelle.",
          },
        ],
      },
      {
        h2: "Les origines fréquentes sur les toitures de l'Hérault",
        blocs: [
          {
            p: "Sur le littoral et dans l'arrière-pays, on retrouve souvent les mêmes causes. Elles tiennent au climat, aux vents et à la façon dont les toitures ont été construites.",
          },
          { h3: "Tuiles déplacées ou cassées" },
          {
            p: "Un coup de vent soulève une tuile de courant ou de rive, une branche de pin tombe, une antenne mal fixée frotte la couverture. Un [remplacement de tuiles](/services/remplacement-tuiles) bien fait règle souvent le problème. Après un épisode venteux, notre article sur la [toiture après un coup de tramontane](/conseils/toiture-apres-tramontane) détaille les points à vérifier.",
          },
          { h3: "Solins, noues et chéneaux" },
          {
            p: "Le solin au pied d'une cheminée se fissure avec le temps et l'eau s'infiltre derrière. Une noue garnie d'aiguilles de pin déborde lors des fortes pluies d'automne. Un chéneau ou une descente bouchés renvoient l'eau sous les tuiles d'égout. Dans ces cas, c'est la [zinguerie et les gouttières](/services/zinguerie-gouttieres) qu'il faut reprendre.",
          },
          { h3: "Toits terrasses" },
          {
            p: "Sur une terrasse, la fuite vient souvent d'un relevé d'étanchéité décollé en périphérie ou d'une évacuation encombrée. L'eau stagne puis trouve le moindre défaut de la membrane.",
          },
          { h3: "Autour d'une fenêtre de toit" },
          {
            p: "Une auréole qui part d'un angle de la fenêtre de toit vient rarement du vitrage. Le plus souvent, c'est le raccord de zinc autour du châssis qui laisse passer l'eau, ou des feuilles accumulées au-dessus qui la font refouler. Vérifiez déjà que la fenêtre est bien fermée et que le joint n'est pas pincé.",
          },
        ],
      },
      {
        h2: "Bâchage provisoire puis réparation",
        blocs: [
          {
            p: "Quand la fuite est importante ou que d'autres pluies sont annoncées, la priorité est la mise hors d'eau. Un [bâchage d'urgence](/services/bachage-urgence) posé par un couvreur, lesté et fixé sans percer la couverture, protège la maison le temps d'organiser la réparation.",
          },
          {
            p: "Pour une intervention rapide, passez par notre page [dépannage de toiture](/depannage-toiture). On vous rappelle dans la journée pour faire le point et on organise le déplacement au plus vite selon les conditions météo et votre secteur.",
          },
          {
            p: "La réparation définitive vient ensuite, une fois l'origine identifiée.",
          },
        ],
      },
      {
        h2: "Assurance et documents à garder",
        blocs: [
          {
            p: "Les dégâts des eaux liés à une toiture sont souvent couverts, mais tout dépend de votre contrat, de la cause de la fuite et de l'entretien de la couverture. Renseignez-vous auprès de votre assureur avant d'engager des travaux importants et demandez-lui la marche à suivre.",
          },
          {
            liste: [
              "Prenez des photos des dégâts intérieurs avant de nettoyer.",
              "Conservez les objets abîmés jusqu'au passage éventuel d'un expert.",
              "Gardez les factures de bâchage et de réparation.",
              "Notez la date et l'heure de l'apparition de la fuite.",
            ],
          },
          {
            p: "Une fois la maison à l'abri, vous pourrez demander un [devis de réparation de toiture](/devis-toiture) détaillé, utile aussi pour votre dossier.",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* 2. Toiture après la tramontane                                    */
  /* ---------------------------------------------------------------- */
  {
    slug: "toiture-apres-tramontane",
    titre: "Toiture après un coup de tramontane, les points à vérifier",
    title: "Toiture après la tramontane, que vérifier | ARVÉO",
    description:
      "Après plusieurs jours de tramontane, tuiles soulevées, rives, faîtage, gouttières. Ce qu'on vérifie depuis le sol et ce qu'il faut confier à un couvreur.",
    chapo:
      "La tramontane descend du nord-ouest, sèche et froide, et peut souffler fort pendant plusieurs jours. Elle mène la vie dure aux couvertures. Une fois le calme revenu, quelques vérifications simples depuis le sol permettent de repérer les dégâts avant la prochaine pluie.",
    publie: "2026-11-09",
    maj: "2026-11-09",
    services: ["faitage-rives", "remplacement-tuiles", "bachage-urgence"],
    sections: [
      {
        h2: "Comment le vent s'attaque à une couverture",
        blocs: [
          {
            p: "Un vent fort ne pousse pas seulement sur la toiture. En passant au-dessus du faîtage, il crée une dépression côté sous le vent qui aspire les tuiles vers le haut. Les rafales répétées finissent par faire bouger ce qui n'est pas solidement tenu.",
          },
          {
            p: "Sur bien des maisons anciennes de l'Hérault, les tuiles canal de couvert reposent simplement sur celles de courant, parfois calées au mortier, rarement attachées. Les rives, les faîtières et les premiers rangs exposés au nord-ouest encaissent le plus.",
          },
          {
            p: "Les éléments en saillie souffrent aussi. Une souche de cheminée, une antenne, un chapeau de ventilation offrent une prise au vent et fatiguent les solins qui les raccordent à la couverture.",
          },
          {
            p: "La tramontane est un vent sec. Elle ne fait pas couler d'eau dans la maison sur le moment. Le problème arrive avec la pluie suivante, quand le vent tourne au sud-est et que le vent marin pousse les averses contre les pans abîmés.",
          },
        ],
      },
      {
        h2: "Les vérifications depuis le sol",
        blocs: [
          {
            p: "Pas besoin d'échelle pour un premier état des lieux. Faites le tour de la maison, de la rue et du jardin, si possible par temps sec et lumineux.",
          },
          { h3: "À l'œil nu ou aux jumelles" },
          {
            liste: [
              "Une ligne de tuiles qui ne suit plus l'alignement des autres, ou un trou sombre dans la couverture.",
              "Des faîtières décalées, un mortier de faîtage fissuré ou tombé par morceaux.",
              "Des tuiles de rive soulevées en bout de pan, surtout côté nord-ouest.",
              "Une gouttière décrochée, pendante ou dont un crochet s'est tordu.",
              "Une antenne ou une parabole penchée qui a pu frotter ou frapper les tuiles.",
            ],
          },
          { h3: "Au pied des murs" },
          {
            p: "Les morceaux de tuile dans le jardin, sur la terrasse ou sur le trottoir sont un indice clair. Des débris de mortier blanc ou gris trahissent un faîtage ou une génoise qui se délite. Notez aussi les branches de pin tombées sur la toiture, elles déplacent souvent plusieurs rangs à la fois.",
          },
        ],
      },
      {
        h2: "Un coup d'œil dans les combles",
        blocs: [
          {
            p: "Si vos combles sont accessibles sans danger, montez-y en journée, lumière éteinte. Un point de jour visible entre les tuiles signale un élément déplacé ou cassé.",
          },
          {
            p: "Sur une toiture équipée d'un écran sous-toiture, regardez s'il est déchiré ou s'il a battu au vent. En l'absence d'écran, cherchez de la poussière de mortier ou des fragments de terre cuite sur l'isolant. Restez sur les solives et ne posez jamais le pied sur le placo du plafond.",
          },
        ],
      },
      {
        h2: "Les points sensibles selon votre toiture",
        blocs: [
          {
            p: "Toutes les couvertures ne réagissent pas de la même façon aux rafales. L'âge de la maison, le type de tuile et la manière dont elle a été posée déterminent les endroits à regarder en priorité.",
          },
          { h3: "Tuiles canal des centres anciens" },
          {
            p: "Dans les cœurs de village, les toits de tuiles canal ont souvent été repris par morceaux au fil des générations. Les tuiles de couvert glissent ou se soulèvent, les génoises perdent des éléments. Une tuile déplacée sur un toit mitoyen peut aussi laisser passer l'eau chez le voisin, d'où l'intérêt de prévenir.",
          },
          { h3: "Tuiles mécaniques des lotissements" },
          {
            p: "Les tuiles à emboîtement résistent mieux au glissement, mais une rafale peut soulever une tuile de rive mal fixée ou casser un tenon. Les closoirs de faîtage en matériaux souples se décollent parfois sur les maisons des années récentes.",
          },
          { h3: "Toits terrasses et bac acier" },
          {
            p: "Sur une terrasse, vérifiez que la membrane n'est pas soulevée en rive et que les relevés tiennent toujours. Sur un abri ou un garage en bac acier, regardez si des vis ont pris du jeu ou si une tôle s'est relevée en bord.",
          },
        ],
      },
      {
        h2: "Agir avant la prochaine pluie",
        blocs: [
          {
            p: "À l'automne, les épisodes méditerranéens peuvent suivre de près un coup de vent. Si vous constatez un dégât, ne montez pas sur la couverture vous-même, même pour remettre une seule tuile. Les tuiles bougées par le vent sont parfois instables autour de la zone visible.",
          },
          {
            p: "Pour une mise hors d'eau rapide, un [bâchage de toiture en urgence](/services/bachage-urgence) protège la maison en attendant la réparation. Vous pouvez aussi nous joindre via la page [intervention de dépannage toiture](/depannage-toiture). Si l'eau est déjà entrée, notre guide [que faire en cas de fuite de toiture](/conseils/fuite-toiture-que-faire) reprend les gestes de sécurité.",
          },
          {
            p: "Côté assurance, la prise en charge des dégâts liés au vent dépend de votre contrat et des conditions qu'il fixe. Renseignez-vous auprès de votre assureur et gardez des photos datées de la toiture et des débris avant toute réparation.",
          },
        ],
      },
      {
        h2: "Maisons mitoyennes et copropriétés",
        blocs: [
          {
            p: "Dans les rues serrées des villages et dans les petits immeubles de centre-ville, les toitures se touchent. Une tuile arrachée chez l'un peut laisser l'eau filer chez l'autre, le long d'un mur commun ou d'une noue partagée.",
          },
          {
            p: "Si vous repérez un dégât sur un toit voisin, prévenez son propriétaire sans tarder. En copropriété, signalez-le au syndic, qui gère les parties communes et missionne l'entreprise. Un constat partagé, avec photos prises depuis la rue ou depuis une fenêtre, évite bien des discussions par la suite.",
          },
          {
            p: "Pour un syndic, regrouper la vérification de plusieurs toitures d'une même résidence en un seul passage simplifie l'organisation. Le couvreur dresse alors un état des lieux bâtiment par bâtiment et hiérarchise les réparations.",
          },
        ],
      },
      {
        h2: "Préparer la toiture au prochain coup de vent",
        blocs: [
          {
            p: "Une toiture régulièrement révisée tient bien mieux les rafales. Quelques améliorations ciblées font une vraie différence sur les zones les plus exposées.",
          },
          {
            liste: [
              "Fixer les tuiles de rive et les rangs d'égout avec des crochets ou des pattes adaptées.",
              "Reprendre un faîtage fatigué, scellé au mortier ou posé à sec avec closoir ventilé.",
              "Remplacer les tuiles fêlées avant qu'elles ne partent au premier coup de vent.",
              "Faire élaguer les pins dont les branches surplombent la couverture.",
            ],
          },
          {
            p: "Ces travaux relèvent de notre service [faîtage et rives](/services/faitage-rives) et du [remplacement de tuiles abîmées](/services/remplacement-tuiles). Nous intervenons autour de l'étang dans tout le [bassin de Thau](/secteur/bassin-de-thau), où le vent souffle souvent fort.",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* 3. Tuile canal, romane ou mécanique                               */
  /* ---------------------------------------------------------------- */
  {
    slug: "tuile-canal-romane-mecanique",
    titre: "Tuile canal, romane ou mécanique, laquelle pour votre maison dans l'Hérault",
    title: "Tuile canal, romane ou mécanique dans l'Hérault | ARVÉO",
    description:
      "Tuile canal, romane ou mécanique ? Différences de pose, de poids, d'aspect et de contraintes locales pour bien choisir la couverture de votre maison.",
    chapo:
      "Refaire une couverture, c'est aussi choisir une tuile. Dans l'Hérault, trois familles dominent, la canal des villages, la romane des maisons récentes et la mécanique des lotissements. Chacune a sa logique de pose et ses contraintes, et le choix dépend d'abord de la maison.",
    publie: "2026-11-09",
    maj: "2026-11-09",
    services: ["refection-toiture", "remplacement-tuiles", "faitage-rives"],
    sections: [
      {
        h2: "Trois familles de tuiles en terre cuite",
        blocs: [
          {
            p: "Toutes trois existent en terre cuite, le matériau le plus répandu dans la région. On trouve aussi des tuiles en béton, plus rares sur nos toits. La différence tient surtout à la forme de la tuile et à la manière de l'assembler.",
          },
          { h3: "La tuile canal" },
          {
            p: "C'est la tuile courbe traditionnelle du Midi. Elle se pose en deux couches, une rangée de tuiles creuses tournées vers le ciel qui forment le canal, puis une rangée retournée qui couvre les joints. Elle donne aux toits des villages leur relief irrégulier et leurs teintes nuancées.",
          },
          { h3: "La tuile romane" },
          {
            p: "Elle reproduit l'aspect ondulé du canal en une seule pièce à emboîtement. On la pose sur liteaux, en une seule couche, avec des recouvrements calibrés. Elle est très présente sur les maisons construites depuis quelques décennies.",
          },
          { h3: "La tuile mécanique" },
          {
            p: "On désigne ainsi les tuiles plates à emboîtement, à côtes ou losangées, fabriquées en série depuis la fin du dix-neuvième siècle. Elles couvrent de nombreuses villas et maisons de lotissement, souvent avec un aspect plus régulier et plus graphique.",
          },
        ],
      },
      {
        h2: "Ce que votre toiture actuelle impose",
        blocs: [
          {
            p: "Le choix n'est jamais totalement libre. La pente du toit, la charpente et la nature du support orientent fortement la décision.",
          },
          {
            p: "Chaque fabricant indique une pente minimale pour ses tuiles, qui varie selon la région et l'exposition au vent. Les toits du Midi sont souvent peu pentus, ce qui convient bien au canal mais peut exclure certains modèles plats. Passer d'un type à l'autre demande donc une vérification sérieuse.",
          },
          {
            p: "Le poids compte aussi. Une couverture canal en double couche pèse plus lourd qu'une tuile à emboîtement, et une charpente ancienne a parfois été calculée au plus juste. Avant de changer de tuile, on contrôle chevrons, pannes et liteaux, et on prévoit si besoin un renfort via notre service [charpente](/services/charpente).",
          },
        ],
      },
      {
        h2: "Le climat héraultais et ses exigences",
        blocs: [
          {
            p: "Le soleil, le sel et le vent jouent sur la durée de vie d'une couverture. Une bonne tuile mal posée vieillira mal, quel que soit son modèle.",
          },
          {
            liste: [
              "Le vent, tramontane au nord-ouest ou rafales marines, impose de fixer les rives, l'égout et le faîtage.",
              "Les embruns près de la mer attaquent les fixations, d'où l'intérêt des crochets inox.",
              "Les fortes pluies d'automne mettent à l'épreuve les recouvrements, les noues et les abouts.",
              "Les pans ombragés sous les pins verdissent vite, quelle que soit la tuile.",
            ],
          },
          {
            p: "La tuile à emboîtement tient mieux en place par grand vent grâce à ses tenons et à son liteaunage. La canal, elle, se fixe par crochets ou se scelle selon les cas. Sur les deux, la qualité du [faîtage et des rives](/services/faitage-rives) fait souvent la différence.",
          },
        ],
      },
      {
        h2: "Centres anciens et secteurs protégés",
        blocs: [
          {
            p: "Dans les cœurs historiques, l'aspect de la toiture fait partie du paysage de la rue. Le règlement local peut demander de conserver la tuile canal, une teinte précise ou un faîtage traditionnel.",
          },
          {
            p: "C'est le cas typique d'une maison de ville ancienne près d'un monument, ou d'un centre comme celui de Pézenas avec ses hôtels particuliers. Avant de remplacer un canal par une tuile plus moderne, renseignez-vous en mairie. Notre article sur les [autorisations d'urbanisme pour une toiture](/conseils/travaux-toiture-autorisation-urbanisme) fait le tour des questions à poser. Nous intervenons comme [couvreur à Pézenas](/couvreur/pezenas) et dans les villages voisins.",
          },
          {
            p: "Une solution courante sur les toits anciens consiste à récupérer les vieilles tuiles canal en bon état pour les poser en couvert, et à placer des tuiles neuves en courant, invisibles depuis la rue. On garde ainsi la patine d'origine.",
          },
        ],
      },
      {
        h2: "Avantages et limites en un coup d'œil",
        blocs: [
          {
            p: "Aucune tuile n'est meilleure dans l'absolu. Chacune répond à un type de maison et à une pente, et c'est en les comparant sur votre propre toit qu'on trouve le bon compromis entre aspect, durée et budget.",
          },
          { h3: "Canal" },
          {
            p: "Aspect authentique, adaptée aux faibles pentes et aux maisons anciennes. En contrepartie, une pose plus longue, une couverture plus lourde et un entretien régulier pour recaler les tuiles déplacées.",
          },
          { h3: "Romane" },
          {
            p: "Un rendu proche du canal pour une pose plus rapide et une couverture plus légère. Le choix fréquent pour une rénovation complète hors secteur protégé, à condition que la pente convienne.",
          },
          { h3: "Mécanique" },
          {
            p: "Régulière, bien emboîtée, elle convient aux toits plus pentus et aux maisons qui l'avaient à l'origine. Sur une maison de village, elle tranche souvent avec les toits voisins.",
          },
        ],
      },
      {
        h2: "Comment décider sans se tromper",
        blocs: [
          {
            p: "Le plus sûr reste de partir de l'existant. Une maison des années soixante-dix en tuiles mécaniques sera rarement mieux servie par du canal, et l'inverse vaut pour une maison de vigneron. Le couvreur relève la pente, l'état du support et les contraintes visibles avant de proposer.",
          },
          {
            p: "Pensez aussi à la suite. Chaque modèle a ses propres accessoires, faîtières, tuiles de rive, chatières de ventilation, demi-tuiles. Choisir une gamme courante permet de retrouver facilement des tuiles identiques pour une réparation dans quelques années, alors qu'un modèle arrêté oblige à chercher du réemploi.",
          },
          {
            p: "Sur une extension, un garage ou un auvent accolé à la maison, reprendre la même tuile que le corps principal donne un ensemble cohérent. Quand la pente de l'annexe est trop faible pour la tuile, on se tourne plutôt vers le zinc, le bac acier ou une membrane, selon l'usage.",
          },
          {
            p: "La teinte mérite enfin un moment de réflexion. Les tuiles rouges unies, les nuances paille ou les mélanges vieillis ne rendent pas pareil sous la lumière du Midi. Demandez à voir des échantillons posés à plat au soleil, et regardez les toits voisins avant de trancher.",
          },
          {
            p: "Si toute la couverture doit être reprise, notre service [réfection de toiture](/services/refection-toiture) présente les étapes, de la dépose au faîtage. Pour un projet chiffré sur votre maison, demandez un [devis de couverture gratuit](/devis-toiture), avec plusieurs options de tuiles si la toiture le permet.",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* 4. Refaire ou réparer                                             */
  /* ---------------------------------------------------------------- */
  {
    slug: "refaire-ou-reparer-toiture",
    titre: "Quand faut-il refaire sa toiture plutôt que la réparer",
    title: "Refaire ou réparer sa toiture, comment choisir | ARVÉO",
    description:
      "Réparer ou refaire sa toiture ? Signes d'usure, état des liteaux et de l'écran, réfection par pan. Les critères concrets pour décider avec votre couvreur.",
    chapo:
      "Une toiture qui fuit ne doit pas forcément être refaite. Une toiture qu'on répare chaque hiver gagnerait parfois à l'être. Entre les deux, quelques signes objectifs aident à trancher, à condition de regarder au-delà des tuiles visibles depuis la rue.",
    publie: "2026-11-09",
    maj: "2026-11-09",
    services: ["refection-toiture", "remplacement-tuiles", "charpente"],
    sections: [
      {
        h2: "Ce qu'une réparation permet de régler",
        blocs: [
          {
            p: "Beaucoup de désordres sont localisés. Une tuile fendue par une branche, un faîtage dont le mortier a lâché sur deux mètres, un solin décollé au pied de la cheminée. Dans ces situations, une intervention ciblée suffit et la couverture repart pour des années.",
          },
          {
            p: "Le [remplacement de tuiles cassées](/services/remplacement-tuiles), la reprise d'une rive ou d'une noue, le changement d'une gouttière percée relèvent de la réparation. Ils coûtent peu au regard d'une réfection et ne touchent pas à la structure.",
          },
          {
            p: "Une révision générale entre aussi dans cette catégorie. Le couvreur parcourt la toiture, recale les tuiles qui ont glissé, change celles qui sont fêlées, vérifie les solins et nettoie les noues. Sur une couverture encore saine, ce passage régulier repousse nettement l'échéance d'une réfection.",
          },
        ],
      },
      {
        h2: "Ce que coûte l'attente",
        blocs: [
          {
            p: "Repousser une réfection nécessaire paraît économique sur le moment. Pourtant, chaque infiltration abîme un peu plus ce qui se trouve sous les tuiles.",
          },
          {
            p: "L'eau qui passe régulièrement fait pourrir les liteaux, puis gagne les chevrons et les pannes. L'isolant gorgé d'eau perd son efficacité et doit être remplacé. Les plafonds se tachent, se fissurent, parfois s'effondrent par endroits. Une réfection décidée à temps se limite à la couverture, alors qu'une réfection trop tardive entraîne souvent des travaux de charpente et de second œuvre.",
          },
          {
            p: "À l'inverse, inutile de céder à la précipitation. Une toiture usée mais étanche peut attendre la bonne saison pour être refaite, le temps de comparer les devis et de préparer le financement.",
          },
        ],
      },
      {
        h2: "Les signes qui orientent vers une réfection",
        blocs: [
          {
            p: "Le basculement se fait quand les problèmes ne sont plus isolés. Une fuite réglée laisse place à une autre, quelques rangs plus loin, puis à une troisième l'année suivante.",
          },
          { h3: "Ce qui se voit depuis l'extérieur" },
          {
            liste: [
              "Des tuiles qui s'effritent, se feuillettent ou se couvrent de mousse en profondeur.",
              "Des tuiles qui cassent dès qu'on les manipule, signe d'une terre cuite devenue poreuse.",
              "Un pan qui ondule ou qui semble creusé au milieu.",
              "Des réparations successives visibles, tuiles de teintes et de modèles différents.",
            ],
          },
          { h3: "Ce qui se voit depuis les combles" },
          {
            liste: [
              "Des liteaux noircis, mous ou fendus, qui ne tiennent plus les crochets.",
              "Des chevrons tachés d'humidité à plusieurs endroits.",
              "L'absence totale d'écran sous-toiture, avec de la poussière qui tombe sur l'isolant.",
              "Une lumière du jour visible en plusieurs points.",
            ],
          },
          {
            p: "Quand plusieurs de ces signes se cumulent, remplacer les tuiles une à une revient à repeindre un mur qui s'effrite. Le support lui-même est en fin de course.",
          },
        ],
      },
      {
        h2: "L'âge de la toiture ne dit pas tout",
        blocs: [
          {
            p: "On entend souvent qu'une couverture doit être refaite au bout d'un certain nombre d'années. En pratique, deux toits du même âge peuvent être dans des états très différents.",
          },
          {
            p: "Une tuile de bonne qualité, posée dans les règles et entretenue, vieillit lentement. Une couverture exposée aux embruns à Sète ou à Marseillan, ombragée par de grands pins ou jamais révisée, s'use plus vite. C'est l'état constaté qui compte, pas la date de construction.",
          },
          {
            p: "L'époque de construction donne malgré tout des indices. Beaucoup de toitures anciennes ont été posées sans écran sous-toiture, sur des liteaux en bois non traité. Elles peuvent rester étanches longtemps, mais supportent mal les pluies poussées par le vent marin, qui remontent sous les tuiles.",
          },
          {
            p: "Le meilleur repère reste un diagnostic complet, dessus et dessous. Une [recherche de fuite](/services/recherche-de-fuite) menée sérieusement donne souvent l'occasion de faire ce bilan.",
          },
        ],
      },
      {
        h2: "La réfection partielle, une solution intermédiaire",
        blocs: [
          {
            p: "Il n'est pas toujours nécessaire de tout refaire d'un coup. Sur une maison à plusieurs pans, l'usure est rarement uniforme.",
          },
          {
            p: "Le pan exposé au nord-ouest, qui prend la tramontane de face, se dégrade souvent avant les autres. Le pan nord, plus humide, se couvre de mousse et retient l'eau. On peut refaire ce pan entièrement, avec liteaux et écran neufs, et réviser le reste.",
          },
          {
            p: "Cette approche étale la dépense. Elle suppose de trouver des tuiles compatibles pour les raccords et d'accepter une différence de teinte au début, qui s'estompe avec le temps.",
          },
          {
            p: "Elle a aussi ses limites. Si tous les pans montrent les mêmes signes de fatigue, refaire morceau par morceau multiplie les installations d'échafaudage et les raccords. Dans ce cas, une réfection d'ensemble revient souvent plus cohérente.",
          },
        ],
      },
      {
        h2: "Profiter du chantier pour améliorer la maison",
        blocs: [
          {
            p: "Une réfection met la charpente à nu. C'est le moment de traiter ce qui sera inaccessible ensuite, sans payer une seconde fois l'échafaudage et la dépose.",
          },
          {
            liste: [
              "Poser un écran sous-toiture HPV qui protège des infiltrations par vent violent.",
              "Renforcer ou remplacer des pièces de charpente fatiguées.",
              "Améliorer l'[isolation de la toiture](/services/isolation-toiture), par l'extérieur ou par les combles.",
              "Créer ou remplacer une fenêtre de toit pour éclairer les combles.",
              "Refaire la zinguerie, chéneaux, descentes et abergements.",
            ],
          },
          {
            p: "Si une charpente doit être reprise, notre service [charpente et renforts](/services/charpente) prend le relais. Pour les aides à la rénovation énergétique, le site france-renov.gouv.fr présente les dispositifs en vigueur et les conditions à remplir.",
          },
        ],
      },
      {
        h2: "Trancher avec votre couvreur",
        blocs: [
          {
            p: "Un artisan honnête vous dira quand une réparation suffit, même si une réfection lui rapporterait davantage. Demandez des photos de ce qu'il a vu sur le toit et dans les combles, c'est la meilleure base pour décider.",
          },
          {
            p: "Le diagnostic se fait sur place, par temps sec de préférence. Autour de Frontignan et de l'étang de Thau, la visite s'organise facilement. Pour une maison du Biterrois, du Lunellois ou des hauts cantons, nous planifions le déplacement sur rendez-vous et regroupons les visites d'un même secteur.",
          },
          {
            p: "Lorsqu'un doute subsiste, faites chiffrer les deux options, réparation ciblée et [réfection complète de toiture](/services/refection-toiture). Le choix de la tuile entre aussi en jeu, notre guide [tuile canal, romane ou mécanique](/conseils/tuile-canal-romane-mecanique) vous aide à y voir clair. Pour un bilan sur votre maison, demandez un [devis toiture sans engagement](/devis-toiture).",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* 5. Urbanisme                                                      */
  /* ---------------------------------------------------------------- */
  {
    slug: "travaux-toiture-autorisation-urbanisme",
    titre: "Travaux de toiture et autorisations d'urbanisme",
    title: "Toiture et autorisations d'urbanisme | ARVÉO",
    description:
      "Déclaration préalable, permis, PLU, abords de monuments historiques. Les repères pour savoir quelles démarches vérifier en mairie avant vos travaux de toit.",
    chapo:
      "Changer de tuile, ouvrir une fenêtre de toit ou surélever une maison ne relève pas des mêmes démarches. Les règles varient selon la nature des travaux et la commune. Voici les questions à se poser et les bons interlocuteurs pour obtenir une réponse fiable.",
    publie: "2026-11-09",
    maj: "2026-11-09",
    services: ["refection-toiture", "fenetre-de-toit", "isolation-toiture"],
    sections: [
      {
        h2: "Pourquoi se renseigner avant de signer un devis",
        blocs: [
          {
            p: "Une toiture se voit depuis la rue. Elle participe à l'aspect du quartier, et c'est pour cela que certains travaux sont encadrés par le droit de l'urbanisme. Engager un chantier sans la formalité requise expose à des difficultés, avec la mairie comme avec un futur acquéreur.",
          },
          {
            p: "Se renseigner tôt permet aussi de bâtir un calendrier réaliste. Si une formalité est nécessaire, le chantier ne pourra commencer qu'après la réponse de la mairie, ce qui compte quand on vise une saison précise pour les travaux.",
          },
          {
            p: "Ce guide donne des repères généraux. Il ne remplace ni les textes ni l'avis de votre mairie, seule à pouvoir vous dire ce qui s'applique à votre adresse.",
          },
        ],
      },
      {
        h2: "Entretenir, réparer ou modifier, la logique générale",
        blocs: [
          {
            p: "La source de référence pour les particuliers est le site officiel service-public.fr. Ses fiches sur la déclaration préalable de travaux et sur le permis de construire expliquent dans quels cas chaque formalité s'applique, avec les formulaires à remplir.",
          },
          { h3: "Réparation et remplacement à l'identique" },
          {
            p: "Remplacer quelques tuiles cassées, reprendre un faîtage ou changer une gouttière par un modèle semblable relèvent en général de l'entretien courant. Même dans ce cas, certains secteurs peuvent prévoir des exigences particulières, d'où l'intérêt d'un simple appel en mairie.",
          },
          { h3: "Changement de matériau, de teinte ou de forme" },
          {
            p: "Passer d'une tuile canal à une tuile mécanique, changer de couleur, remplacer des tuiles par du bac acier modifie l'aspect extérieur du bâtiment. Ce type de travaux nécessite le plus souvent une déclaration préalable. Notre article sur le [choix entre tuile canal, romane ou mécanique](/conseils/tuile-canal-romane-mecanique) aborde l'aspect technique de ce changement.",
          },
          { h3: "Ouvertures, isolation par l'extérieur et surélévation" },
          {
            p: "La création d'une [fenêtre de toit](/services/fenetre-de-toit), une isolation par l'extérieur qui rehausse la toiture ou la modification de la pente touchent elles aussi à l'aspect. Une surélévation qui crée de la surface relève selon les cas de la déclaration préalable ou du permis de construire. Les seuils de surface et les cas particuliers sont détaillés sur service-public.fr.",
          },
        ],
      },
      {
        h2: "Le plan local d'urbanisme de votre commune",
        blocs: [
          {
            p: "Au-delà de la formalité, il faut respecter les règles de fond fixées localement. Le plan local d'urbanisme, ou PLU, peut encadrer la couleur des tuiles, les matériaux autorisés, la pente des toits ou l'aspect des ouvertures.",
          },
          {
            p: "Deux communes voisines peuvent avoir des exigences très différentes. Le règlement se consulte en mairie et, dans beaucoup de communes, en ligne sur le site de la ville ou de l'intercommunalité. Le service urbanisme peut vous indiquer la zone où se trouve votre maison et les articles qui la concernent.",
          },
          { h3: "Lotissements et copropriétés" },
          {
            p: "D'autres documents peuvent s'ajouter aux règles d'urbanisme. Dans un lotissement, un règlement ou un cahier des charges impose parfois un modèle ou une couleur de tuile pour garder une unité entre les maisons. Votre notaire ou l'association syndicale du lotissement peut vous en fournir une copie.",
          },
          {
            p: "En copropriété, la toiture fait en général partie des parties communes. Les travaux se décident alors en assemblée générale et passent par le syndic, qui se charge aussi des démarches auprès de la mairie. En règle générale, un copropriétaire ne modifie donc pas seul la couverture au-dessus de son logement, le règlement de copropriété et le syndic vous diront ce qu'il en est chez vous.",
          },
        ],
      },
      {
        h2: "Secteurs protégés et architecte des Bâtiments de France",
        blocs: [
          {
            p: "Certains périmètres font l'objet d'une protection patrimoniale renforcée. C'est le cas des abords des monuments historiques et des sites patrimoniaux remarquables. Dans ces secteurs, les travaux visibles peuvent être soumis à l'avis de l'architecte des Bâtiments de France.",
          },
          {
            p: "Cet avis peut porter sur le type de tuile, sa teinte, la forme du faîtage, la présence d'une génoise ou l'emplacement d'une ouverture. Il arrive qu'une tuile canal de réemploi ou un modèle précis soient demandés. Le dossier doit alors être particulièrement soigné, et le délai de réponse peut s'allonger.",
          },
          {
            p: "Pour savoir si votre maison se trouve dans un tel périmètre, la mairie reste la meilleure source. L'atlas des patrimoines, service en ligne du ministère de la Culture, permet aussi de visualiser les périmètres protégés sur une carte.",
          },
          {
            p: "Les centres anciens de l'Hérault comptent de nombreux monuments, églises, remparts, hôtels particuliers. Si vous possédez une maison de ville, comme dans le cœur historique de Pézenas où nous intervenons en tant que [couvreur à Pézenas](/couvreur/pezenas), interrogez systématiquement la mairie avant tout changement visible.",
          },
        ],
      },
      {
        h2: "Les démarches en pratique",
        blocs: [
          {
            p: "Prenez contact avant de commander les matériaux. Le premier interlocuteur reste le service urbanisme de votre mairie. Présentez-lui votre projet avec quelques photos de la maison et une description des travaux envisagés. Il vous dira quelle formalité s'applique et quelles pièces fournir.",
          },
          {
            liste: [
              "Des photos de la toiture actuelle et de son environnement proche.",
              "Un plan de situation et, selon le projet, un plan de la toiture.",
              "La description des matériaux, modèle et teinte des tuiles, zinguerie.",
              "Les documents demandés par le formulaire officiel, téléchargeable sur service-public.fr.",
            ],
          },
          {
            p: "Le délai d'instruction est indiqué sur service-public.fr et peut varier selon le dossier et le secteur. Les règles d'affichage sur le terrain y sont également expliquées. Si un échafaudage ou une benne doit occuper le trottoir, une autorisation d'occupation de la voie publique est souvent nécessaire, à demander là encore en mairie.",
          },
        ],
      },
      {
        h2: "Ce qu'un couvreur peut apporter à votre dossier",
        blocs: [
          {
            p: "La démarche administrative appartient au propriétaire, mais le couvreur peut vous faciliter la tâche. Nous fournissons une description technique des travaux, les références des tuiles proposées, des photos de l'existant et, si besoin, plusieurs variantes de teinte à soumettre à la mairie.",
          },
          {
            p: "Pour une [réfection de toiture complète](/services/refection-toiture) ou une [isolation de toiture par l'extérieur](/services/isolation-toiture), mieux vaut intégrer ces éléments au calendrier dès le départ. Le chantier ne démarre qu'une fois l'autorisation obtenue, quand elle est requise.",
          },
          {
            p: "Vous pouvez demander un [devis toiture détaillé](/devis-toiture) pour constituer votre dossier. Pour un projet en centre ancien, par exemple à Sète où nous travaillons comme [couvreur à Sète](/couvreur/sete), nous adaptons la proposition aux exigences que la mairie vous aura indiquées.",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* 6. Démoussage                                                     */
  /* ---------------------------------------------------------------- */
  {
    slug: "demoussage-toiture-saison",
    titre: "Démoussage de toiture, la bonne saison et les erreurs à éviter",
    title: "Démoussage de toiture, quelle saison choisir | ARVÉO",
    description:
      "Quand démousser sa toiture dans l'Hérault, automne ou printemps ? Les erreurs à éviter, haute pression, produits mal choisis, et le rôle de l'hydrofuge.",
    chapo:
      "Mousses, lichens et traînées noires gagnent les toits, surtout sur les pans ombragés et sous les pins. Un démoussage bien mené prolonge la vie des tuiles. Mal fait, il les abîme. Tout se joue sur la période choisie et sur la méthode.",
    publie: "2026-11-09",
    maj: "2026-11-09",
    services: ["demoussage-toiture", "zinguerie-gouttieres", "remplacement-tuiles"],
    sections: [
      {
        h2: "Ce qui pousse sur les toits du littoral",
        blocs: [
          {
            p: "Sous notre climat sec et ensoleillé, on imagine les toits à l'abri des mousses. Pourtant, les pans orientés au nord, les toits proches des étangs et ceux qui restent à l'ombre des pins verdissent vite. L'humidité des nuits d'automne et d'hiver leur suffit.",
          },
          {
            p: "On distingue les mousses, en coussinets verts qui retiennent l'eau, les lichens, en taches grises ou jaunes collées à la tuile, et les algues qui laissent des traînées sombres. Les mousses posent le plus de problèmes, car elles freinent l'écoulement et finissent par bloquer les recouvrements entre tuiles.",
          },
          {
            p: "Une tuile qui reste humide se dégrade plus vite, et les débris végétaux descendent dans les gouttières. D'où l'intérêt d'un [démoussage de toiture](/services/demoussage-toiture) régulier, adapté à l'exposition de la maison.",
          },
        ],
      },
      {
        h2: "Savoir quand intervenir",
        blocs: [
          {
            p: "Il n'existe pas de fréquence valable pour toutes les maisons. Un toit de lotissement en plein soleil à Frontignan peut rester propre longtemps, tandis qu'une maison sous les pins de la Gardiole verdit beaucoup plus vite.",
          },
          {
            liste: [
              "Des coussinets de mousse visibles entre les tuiles ou sur les rangs d'égout.",
              "Une couverture qui reste sombre et humide plusieurs jours après la pluie.",
              "Des débris verts qui s'accumulent dans les gouttières et les regards.",
              "Des lichens qui couvrent une bonne part de la surface des tuiles.",
            ],
          },
          {
            p: "Quelques taches de lichen sur un pan sud ne justifient pas un traitement immédiat. En revanche, une mousse épaisse qui soulève les tuiles demande une intervention avant l'hiver. En cas de doute, un couvreur peut juger de l'état depuis une échelle, sans marcher sur la couverture.",
          },
        ],
      },
      {
        h2: "La bonne saison pour démousser",
        blocs: [
          {
            p: "Les produits de traitement agissent mieux sur une végétation active et une tuile ni brûlante ni gelée. Il faut aussi plusieurs jours secs pour que le produit fasse effet sans être lessivé.",
          },
          { h3: "L'automne, après les fortes chaleurs" },
          {
            p: "Dans l'Hérault, le début de l'automne est souvent un bon moment, une fois l'été passé et avant que les pluies ne s'installent. Il faut toutefois guetter les prévisions, car les épisodes méditerranéens peuvent tomber à cette période. Mieux vaut décaler l'intervention que traiter juste avant un gros orage.",
          },
          { h3: "Le printemps, l'autre fenêtre" },
          {
            p: "La fin de l'hiver et le printemps conviennent aussi, quand les mousses reprennent leur croissance. Les températures sont douces et les journées sèches assez fréquentes. C'est la période idéale pour les pans nord qui restent humides plus longtemps.",
          },
          { h3: "Les conditions à éviter" },
          {
            p: "L'été, la tuile chauffe, le produit sèche trop vite et le travail en toiture devient pénible. Par jour de tramontane, la pulvérisation part avec le vent sur les jardins et les voitures du voisinage. Les matins de gel rendent la couverture dangereuse.",
          },
        ],
      },
      {
        h2: "Les erreurs qui abîment la couverture",
        blocs: [
          {
            p: "Un toit propre en apparence n'est pas forcément un toit bien traité. Certaines méthodes donnent un résultat spectaculaire le jour même et laissent des tuiles fragilisées pour la suite.",
          },
          { h3: "Le nettoyeur haute pression" },
          {
            p: "C'est l'erreur la plus répandue. Le jet décape la surface de la terre cuite, la rend plus poreuse et accélère le retour des mousses. Il peut aussi soulever les tuiles canal, chasser l'eau sous les recouvrements et provoquer des infiltrations dans les combles. Un brossage doux suivi d'un traitement fait mieux, sans casse.",
          },
          {
            p: "Sur les tuiles canal de couvert simplement posées, le risque est encore plus grand. Le jet les déplace sans qu'on s'en rende compte depuis le sol, et la fuite apparaît à la pluie suivante.",
          },
          { h3: "Marcher n'importe où sur le toit" },
          {
            p: "Les tuiles anciennes cassent sous le poids d'une personne mal placée. Un professionnel utilise des échelles de couvreur, des planches de répartition et un équipement antichute. Un particulier sur un toit mouillé et moussu prend un risque réel, mieux vaut s'abstenir.",
          },
          { h3: "Des produits inadaptés" },
          {
            liste: [
              "L'eau de Javel ou les mélanges maison décolorent les tuiles et attaquent la zinguerie.",
              "Un produit répandu sans précaution ruisselle vers le potager, le bassin ou la piscine.",
              "Un dosage plus fort que la notice n'accélère rien et peut abîmer la tuile.",
              "Un traitement appliqué juste avant la pluie finit dans les descentes sans avoir agi.",
            ],
          },
        ],
      },
      {
        h2: "Hydrofuge, utile ou pas ?",
        blocs: [
          {
            p: "Après le démoussage, on propose souvent un hydrofuge. Il limite la pénétration de l'eau dans la tuile tout en la laissant respirer, ce qui ralentit la repousse.",
          },
          {
            p: "Choisissez un produit microporeux prévu pour la terre cuite, appliqué sur une tuile propre et sèche. Un film qui ferme les pores empêcherait l'humidité de s'évacuer et ferait plus de mal que de bien, surtout lors des nuits fraîches où la condensation se forme.",
          },
          {
            p: "Il n'a de sens que sur une couverture saine. Sur des tuiles déjà feuilletées ou fendues, il ne répare rien et masque l'usure. Dans ce cas, un [remplacement des tuiles abîmées](/services/remplacement-tuiles) passe avant. Si l'ensemble est poreux, notre article [refaire ou réparer sa toiture](/conseils/refaire-ou-reparer-toiture) vous aidera à faire le point.",
          },
        ],
      },
      {
        h2: "Gouttières, noues et pins à surveiller",
        blocs: [
          {
            p: "Un démoussage fait descendre une quantité de débris dans les chéneaux et les descentes. Les nettoyer en fin de chantier évite qu'ils ne débordent à la première averse.",
          },
          {
            p: "Les maisons entourées de pins, nombreuses autour de l'étang de Thau comme à [Balaruc-les-Bains](/couvreur/balaruc-les-bains), cumulent mousses et aiguilles. Les noues se garnissent vite et l'eau finit par passer sous les tuiles. Une vérification de la [zinguerie et des gouttières](/services/zinguerie-gouttieres) a toute sa place dans le même passage.",
          },
        ],
      },
      {
        h2: "Faire intervenir un couvreur",
        blocs: [
          {
            p: "Un démoussage confié à un couvreur, c'est aussi une inspection de la couverture. Tuiles fêlées, faîtage fissuré, solin décollé, tout se voit mieux une fois la mousse retirée. On vous signale ce qui mérite attention, sans travaux imposés.",
          },
          {
            p: "Le coût dépend de la surface, de la pente, de l'accès et de la quantité de végétation. Pour une proposition chiffrée sur votre maison, demandez un [devis de démoussage](/devis-toiture), nous fixons ensemble une date adaptée à la saison et à la météo.",
          },
        ],
      },
    ],
  },
];
