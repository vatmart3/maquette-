/*
 * ARVÉO — données des pages « prix » (/prix-toiture et /prix/<slug>).
 *
 * Prix indicatifs. Tous les montants sont // À CONFIRMER avec ARVÉO.
 * Tant que valide vaut false, aucun prix n'est publié dans les données structurées (JSON-LD).
 *
 * Montants TTC, main-d'œuvre comprise, établis en novembre 2026 en recoupant des guides
 * de prix français 2025-2026 (recherche web du 09/11/2026). Les sources ne publient pas
 * toujours le même périmètre (HT ou TTC, avec ou sans dépose, avec ou sans accès) ; les
 * fourchettes retenues sont volontairement larges et prudentes.
 *
 * Réfection de toiture (tuiles, dépose et support compris, hors charpente et isolation)
 *   - abctravaux.org, 2026 : couverture seule 80 à 160 €/m², tuiles mécaniques 130 à 180 €/m²,
 *     avec isolation 120 à 250 €/m². https://abctravaux.org/cout-pour-refaire-une-toiture/
 *     et https://abctravaux.org/prix-toiture-140m2/
 *   - Habitatpresto : 130 à 260 €/m² (et 140 à 300 €/m² TTC selon une autre page),
 *     exemple 140 m² env. 25 000 €. https://www.habitatpresto.com/mag/toiture/couverture-de-toit
 *     https://www.habitatpresto.com/mag/toiture/exemple-devis-refection-toiture-140m2
 *   - Futura Maison : 180 à 250 €/m². https://www.futura-sciences.com/maison/questions-reponses/batiment-prix-toiture-m2-13829/
 *   - Quelleenergie : reprise de charpente 50 à 100 €/m² en plus.
 *     https://www.quelleenergie.fr/prix-travaux/isolation/isolation-toiture-refection
 *   - Ootravaux : tuile canal 25 à 35 €/m² (fourniture seule), couvreur 40 à 60 €/h.
 *     https://www.ootravaux.fr/construction-renovation/toiture/couverture/travaux-toiture/prix-toiture-m2.html
 *   => retenu 120 à 220 € le m².
 *
 * Démoussage de toiture (nettoyage + anti-mousse, hydrofuge en haut de fourchette)
 *   - Habitatpresto : 10 à 30 €/m² ; démoussage seul 6 à 11 €/m², avec hydrofuge 12 à 16 €/m².
 *     https://www.habitatpresto.com/mag/toiture/prix-demoussage-toiture
 *     https://www.habitatpresto.com/devis-travaux/devis-demoussage-toiture
 *   - Obat : env. 15 €/m² simple, 15 à 30 €/m² avec hydrofuge, 30 à 45 €/m² avec revêtement.
 *     https://travaux.obat.fr/guides/demoussage-toiture
 *   - prix-travaux-m2.com (2026) : 8 à 16 €/m² simple, 22 à 37 €/m² avec hydrofuge.
 *     https://www.prix-travaux-m2.com/prix-demoussage-toiture.php
 *   - macalculatriceenligne.com (2026) : jusqu'à 40 €/m² en accès difficile, échafaudage en plus.
 *     https://macalculatriceenligne.com/construction/calcul-prix-nettoyage-toiture/
 *   => retenu 12 à 30 € le m².
 *
 * Recherche de fuite sur toiture (forfait par intervention, réparation en sus)
 *   - MesDépanneurs : 150 à 540 € (détection technique), 150 à 500 € (fuite invisible).
 *     https://www.mesdepanneurs.fr/blog/recherche-de-fuite-toiture
 *     https://www.mesdepanneurs.fr/blog/fuite-toiture-introuvable
 *   - Travaux.com : réparation de fuite de 150 € (une tuile) à plus de 3 000 €.
 *     https://www.travaux.com/couverture-toiture
 *   - Travaux.com / Ootravaux (recherche de fuite, toutes méthodes) : caméra thermique env. 200 à 250 €,
 *     fumigène 150 à 250 €. https://www.travaux.com/plomberie/guide-des-prix/prix-dune-recherche-de-fuite
 *     https://www.ootravaux.fr/installation-entretien/plomberie/prix-recherche-fuite-eau.html
 *   - Ootravaux : couvreur 45 à 65 €/h.
 *     https://ootravaux.fr/construction-renovation/toiture/couverture/travaux-toiture/quel-prix-pour-reparation-toiture-fuit.html
 *   => retenu 150 à 500 € l'intervention.
 *
 * Remplacement de tuiles (quelques tuiles, déplacement et sécurité compris)
 *   - Habitatpresto : 10 à 20 € par tuile, 40 à 120 €/m² en remplacement partiel.
 *     https://www.habitatpresto.com/mag/toiture/conseils-reparer-toit
 *   - Ootravaux / prix-travaux-m2.com (2026) : remaniement tuiles canal terre cuite 28 à 35 €/m²,
 *     remplacement complet tuile canal env. 70 €/m².
 *     https://www.ootravaux.fr/construction-renovation/toiture/couverture/travaux-toiture/prix-remaniement-toiture.html
 *     https://www.prix-travaux-m2.com/prix-remaniement-toiture.php
 *   - Travaux.com : à partir d'env. 150 € pour un remplacement de tuile.
 *     https://www.travaux.com/couverture-toiture
 *   - prix-travaux-m2.com : remplacement de tuiles 40 à 140 €/m².
 *     https://www.prix-travaux-m2.com/prix-reparation-toiture.php
 *   => retenu 150 à 450 € l'intervention, 10 à 25 € par tuile posée hors déplacement,
 *      remaniement 30 à 70 € le m².
 */

/* ------------------------------------------------------------------ */
/* Page hub /prix-toiture                                              */
/* ------------------------------------------------------------------ */

export const PRIX_HUB = {
  title: "Prix d'une toiture dans l'Hérault en 2026 | ARVÉO",
  description:
    "Prix indicatifs TTC des travaux de toiture dans l'Hérault, réfection, démoussage, recherche de fuite et tuiles. Fourchettes à confirmer après visite.",
  h1: "Prix d'une toiture dans l'Hérault",
  chapo:
    "Combien coûte une intervention sur votre toit ? Voici des fourchettes indicatives TTC pour les travaux les plus demandés autour de Frontignan et dans l'Hérault. Elles donnent un ordre de grandeur, le prix réel se fixe après visite.",
  sections: [
    {
      h2: "Comment se construit un prix de couverture",
      p: [
        "Un devis de couvreur additionne trois blocs. D'abord la main-d'œuvre, comptée en heures ou en mètres carrés selon le poste. Ensuite les matériaux, à savoir tuiles, liteaux, écran sous-toiture, mortier, zinc ou membrane. Enfin les frais de chantier, qui couvrent l'accès, la sécurité et l'évacuation des déchets.",
        "Ce troisième bloc surprend souvent. Un échafaudage de façade, une nacelle ou des protections collectives coûtent presque autant pour dix tuiles que pour un pan entier. Voilà pourquoi une petite réparation paraît chère rapportée au mètre carré, alors qu'un grand chantier fait baisser le prix unitaire.",
        "Chaque poste a sa page détaillée, avec des cas concrets et la liste de ce qui est compris. Consultez le prix d'une [réfection de toiture](/prix/refection-toiture), d'un [démoussage](/prix/demoussage-toiture), d'une [recherche de fuite](/prix/recherche-de-fuite) ou d'un [remplacement de tuiles](/prix/remplacement-tuiles).",
      ],
      liste: [
        "Main-d'œuvre, en heures pour une réparation, au m² pour une couverture",
        "Fournitures, avec la référence des tuiles et des accessoires",
        "Accès et sécurité, échafaudage, nacelle, garde-corps",
        "Évacuation des gravats et des anciennes tuiles en déchetterie",
      ],
    },
    {
      h2: "Ce qui fait varier la facture",
      p: [
        "Deux toits de même surface peuvent donner des devis très éloignés. La pente, la hauteur, le nombre de pans et de noues pèsent lourd. Une maison de plain-pied à Vic-la-Gardiole ne se traite pas comme un immeuble de trois niveaux dans une rue en pente de Sète.",
        "L'état de ce qu'on ne voit pas compte aussi. Des liteaux pourris, un chevron fendu ou une génoise qui se délite ajoutent des lignes au devis. On les repère pendant la visite, pas depuis le trottoir.",
      ],
      liste: [
        "Type de tuile, canal, romane ou mécanique",
        "Hauteur du bâtiment et place disponible au pied du mur",
        "Complexité, avec noues, arêtiers, cheminée ou fenêtre de toit",
        "Exposition au vent et au sel, qui use plus vite les fixations",
        "Travaux annexes en zinguerie ou en charpente",
      ],
    },
    {
      h2: "Pourquoi on vient voir avant de chiffrer",
      p: [
        "Un prix donné au téléphone reste une estimation. Pour écrire un devis juste, on monte sur le toit ou on l'inspecte de près, on mesure, on regarde les combles quand c'est possible. Cette visite évite les mauvaises surprises en cours de chantier, de votre côté comme du nôtre.",
        "Le [devis de toiture](/devis-toiture) est gratuit et détaillé poste par poste. Vous savez ce qui est prévu, avec quelles fournitures et pour quel montant, avant que le moindre échafaudage soit monté. Pour une fuite qui coule déjà, passez plutôt par le [dépannage de toiture](/depannage-toiture).",
      ],
      liste: [],
    },
    {
      h2: "TVA et aides, ce qu'il faut savoir",
      p: [
        "Nos fourchettes sont exprimées TTC. Pour des travaux dans un logement achevé depuis plus de deux ans, une TVA à taux réduit est possible, selon les conditions prévues par la réglementation et la nature des travaux. Renseignez-vous. Le taux retenu figure sur le devis, avec l'attestation à signer le cas échéant.",
        "Certains travaux, comme l'isolation de la toiture, peuvent ouvrir droit à des aides publiques dont les règles évoluent souvent. Le site france-renov.gouv.fr présente les dispositifs en vigueur et les conseillers gratuits de votre secteur. Une simple réfection de couverture, sans amélioration énergétique, n'y donne en général pas accès.",
      ],
      liste: [],
    },
  ],
  faq: [
    {
      q: "Les prix affichés sont-ils ceux d'ARVÉO ?",
      r: "Ce sont des fourchettes indicatives TTC, établies à partir des prix couramment pratiqués en France pour ces travaux. Elles servent à préparer un budget. Le montant qui engage ARVÉO est celui du devis écrit, remis après la visite.",
    },
    {
      q: "Pourquoi le prix au mètre carré baisse-t-il sur un grand toit ?",
      r: "Les frais fixes, à savoir déplacement, montage de l'échafaudage, mise en sécurité et évacuation, se répartissent sur davantage de surface. Sur un petit pan, ils représentent une grosse part du total, même si le travail sur les tuiles reste modeste.",
    },
    {
      q: "La visite pour établir le devis est-elle facturée ?",
      r: "Non, la visite et le devis sont gratuits dans notre [zone d'intervention](/zone-intervention). Pour les secteurs éloignés de Frontignan, on regroupe les visites et on fixe un rendez-vous à l'avance, afin de limiter les trajets.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Pages /prix/<slug>                                                   */
/* ------------------------------------------------------------------ */

export const PRIX = [
  /* ---------------------------------------------------------------- */
  {
    slug: "refection-toiture",
    service: "refection-toiture",
    nom: "Réfection de toiture",
    title: "Prix réfection de toiture en 2026, Hérault | ARVÉO",
    description: // À CONFIRMER avec ARVÉO (fourchette citée)
      "Prix indicatifs TTC d'une réfection de toiture en tuiles dans l'Hérault, de 120 à 220 € le m² selon la pente, l'accès et la charpente. À confirmer sur visite.",
    h1: "Prix d'une réfection de toiture dans l'Hérault",
    chapo: // À CONFIRMER avec ARVÉO (fourchette citée)
      "Refaire une couverture en tuiles revient le plus souvent entre 120 et 220 € le m² TTC, dépose et écran sous-toiture compris. Ces prix indicatifs se précisent après visite, selon la charpente, l'accès et la tuile choisie.",
    unite: "m²",
    bas: 120, // À CONFIRMER avec ARVÉO
    haut: 220, // À CONFIRMER avec ARVÉO
    valide: false,
    cas: [
      {
        cas: "Maison de plain-pied, 90 m² de couverture en tuiles canal, charpente saine",
        fourchette: "11 000 à 19 000 €", // À CONFIRMER avec ARVÉO
        detail:
          "Dépose, plaques sous-tuiles, anciennes tuiles réemployées en couvert pour garder la patine, tuiles neuves en courant, faîtage et rives refaits.",
      },
      {
        cas: "Maison à étage, 120 m² en tuiles romanes, échafaudage de façade",
        fourchette: "15 000 à 26 000 €", // À CONFIRMER avec ARVÉO
        detail:
          "Écran sous-toiture HPV, contre-liteaux et liteaux neufs, échafaudage sur deux façades, évacuation des déchets comprise.",
      },
      {
        cas: "Un seul pan de 35 m² très dégradé, le reste du toit en bon état",
        fourchette: "4 500 à 8 500 €", // À CONFIRMER avec ARVÉO
        detail:
          "Le prix au m² grimpe car l'installation du chantier se répartit sur une petite surface. Raccord soigné avec les pans conservés.",
      },
      {
        cas: "Toiture de 100 m² avec des chevrons à remplacer par endroits",
        fourchette: "15 000 à 28 000 €", // À CONFIRMER avec ARVÉO
        detail:
          "Reprise partielle de charpente après dépose, traitement des bois conservés, puis couverture complète sur support neuf.",
      },
      {
        cas: "Maison de village de 70 m² en centre ancien, accès par une ruelle",
        fourchette: "10 000 à 18 000 €", // À CONFIRMER avec ARVÉO
        detail:
          "Monte-matériaux ou évacuation à la main, autorisation d'occupation de la voirie à prévoir, tuiles canal de récupération si le secteur l'impose.",
      },
      {
        cas: "Isolation par l'extérieur ajoutée pendant la réfection",
        fourchette: "60 à 150 € le m² en plus", // À CONFIRMER avec ARVÉO
        detail:
          "Panneaux isolants posés sur les chevrons avant la couverture. Une piste sérieuse quand les combles sont aménagés et qu'on ne veut pas toucher aux plafonds.",
      },
    ],
    facteurs: [
      {
        titre: "La tuile choisie",
        texte:
          "La tuile canal demande plus de pièces au m² et plus de temps de pose qu'une tuile mécanique à emboîtement. La romane se situe entre les deux. Le choix dépend souvent de l'existant et des règles du secteur, voir notre [comparatif des tuiles](/conseils/tuile-canal-romane-mecanique).",
      },
      {
        titre: "La hauteur et l'accès",
        texte:
          "Un échafaudage sur trois façades n'a pas le coût d'une simple plateforme. Quand le camion ne peut pas approcher, chaque tuile descend et remonte à la main ou au monte-charge, ce qui allonge le chantier d'autant.",
      },
      {
        titre: "L'état de la charpente",
        texte:
          "Tant que les tuiles sont en place, on ne voit pas tout. Après dépose, un chevron fendu ou une panne attaquée par les insectes doit être repris. Le devis prévoit ce cas sous forme d'option chiffrée, pour éviter une facture qui gonfle sans explication.",
      },
      {
        titre: "La forme du toit",
        texte:
          "Un toit à deux pans se couvre vite. Les noues, arêtiers, croupes et pénétrations, cheminée ou fenêtre de toit, demandent des coupes, des abergements et du zinc. Chacun de ces points ajoute des heures.",
      },
      {
        titre: "Le support sous les tuiles",
        texte:
          "Sous les tuiles canal, on pose souvent des plaques sous-tuiles. Ailleurs, un écran sous-toiture HPV sur contre-liteaux. Ces deux options n'ont pas le même prix, et le bon choix dépend surtout de la pente.",
      },
      {
        titre: "Le réemploi des anciennes tuiles",
        texte:
          "Trier et nettoyer des tuiles anciennes prend du temps, mais évite d'en racheter autant de neuves. Sur une belle couverture canal, garder les pièces patinées en couvert préserve l'aspect de la maison.",
      },
    ],
    inclus: [
      "Installation du chantier, échafaudage et protections",
      "Dépose de l'ancienne couverture et tri des tuiles réemployables",
      "Évacuation des déchets en filière adaptée",
      "Écran sous-toiture ou plaques sous-tuiles selon la pente",
      "Liteaux, contre-liteaux et tuiles neuves",
      "Faîtage, rives et égout refaits, closoirs ventilés",
    ],
    exclus: [
      "Remplacement important de pièces de charpente, chiffré à part",
      "Isolation des combles ou par l'extérieur",
      "Gouttières et descentes neuves, sauf mention au devis",
      "Changement d'une fenêtre de toit",
      "Désamiantage d'anciennes plaques en fibres-ciment",
    ],
    lecture: [
      "Un devis de réfection doit indiquer la surface couverte en m², mesurée en rampant et non au sol. Vérifiez qu'elle correspond à peu près à votre toit, puis regardez le détail. Dépose, support, liteaux, tuiles, faîtage et rives doivent apparaître sur des lignes distinctes, avec quantité et prix unitaire.",
      "Repérez la référence des tuiles, la marque ou au moins le modèle et la teinte. Une ligne vague du type couverture complète ne permet pas de comparer deux offres. Regardez aussi comment sont traités les imprévus de charpente, chiffrés en option ou laissés à l'appréciation de l'entreprise.",
      "Le devis doit mentionner l'assurance décennale de l'entreprise, avec le nom de l'assureur et la zone couverte. Une réfection de couverture relève de cette garantie. Si vous hésitez encore entre réparer et refaire, notre article [refaire ou réparer sa toiture](/conseils/refaire-ou-reparer-toiture) aide à trancher.",
    ],
    sections: [
      {
        h2: "Refaire un toit près de la mer et sous la tramontane",
        p: [
          "Autour de l'étang de Thau, la couverture vit entre le sel apporté par le vent marin et les rafales de tramontane venues du nord-ouest. Les tuiles mal tenues se soulèvent, les mortiers de faîtage se fissurent plus vite qu'à l'intérieur des terres. Lors d'une réfection, on prévoit donc des fixations adaptées au site, crochets inox ou tuiles collées en rive selon l'exposition.",
          "Les épisodes méditerranéens d'automne mettent ensuite l'étanchéité à l'épreuve en quelques heures. Un écran bien posé, raccordé à l'égout et aux noues, évite qu'une tuile déplacée se transforme en dégât des eaux. Les étapes du chantier sont décrites sur notre page [réfection de toiture](/services/refection-toiture).",
        ],
        liste: [],
      },
      {
        h2: "Autorisation et calendrier",
        p: [
          "Remplacer une couverture à l'identique ne demande souvent aucune démarche, mais changer de tuile ou de teinte peut imposer une déclaration préalable. Aux abords des monuments historiques, l'avis de l'architecte des Bâtiments de France peut être requis. Renseignez-vous en mairie, notre [guide des autorisations](/conseils/travaux-toiture-autorisation-urbanisme) résume les cas courants.",
          "Côté calendrier, mieux vaut éviter de découvrir un toit en pleine saison des orages. On avance pan par pan, avec un bâchage chaque soir. Pour une couverture moins abîmée, le [prix du remplacement de tuiles](/prix/remplacement-tuiles) ouvre une piste plus légère.",
        ],
        liste: [],
      },
    ],
    faq: [
      {
        q: "Combien coûte la réfection d'une toiture de 100 m² ?",
        r: "Pour 100 m² de tuiles avec dépose et écran sous-toiture, comptez à titre indicatif 12 000 à 22 000 € TTC, hors charpente. L'écart tient à l'accès, à la forme du toit et à la tuile. Le chiffre exact sort du [devis de toiture](/devis-toiture), établi après visite.", // À CONFIRMER avec ARVÉO
      },
      {
        q: "Peut-on réemployer les anciennes tuiles canal ?",
        r: "Oui, quand elles sont saines. On les trie une à une, on écarte les pièces poreuses ou fêlées, et on les repose en couvert. Les neuves vont en courant, là où elles ne se voient pas. Ce tri réduit l'achat de tuiles sans toujours alléger beaucoup le total, car il demande du temps.",
      },
      {
        q: "La charpente est-elle comprise dans le prix ?",
        r: "Son contrôle, oui. Le remplacement de chevrons, de pannes ou de liteaux en grand nombre, non. Ces travaux sont chiffrés en option et confirmés seulement après dépose, quand on voit vraiment l'état des bois. Voir notre page [charpente](/services/charpente).",
      },
      {
        q: "Combien de temps dure une réfection ?",
        r: "Tout dépend de la surface, de l'accès et de la météo. On vous donne une estimation à la signature et on vous prévient si le vent ou la pluie décalent le chantier. Le toit reste bâché chaque soir tant qu'il n'est pas refermé.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "demoussage-toiture",
    service: "demoussage-toiture",
    nom: "Démoussage de toiture",
    title: "Prix démoussage de toiture en 2026, Hérault | ARVÉO",
    description: // À CONFIRMER avec ARVÉO (fourchette citée)
      "Prix indicatifs TTC d'un démoussage de toiture dans l'Hérault, de 12 à 30 € le m² avec anti-mousse, hydrofuge en option. Montant à confirmer après visite.",
    h1: "Prix d'un démoussage de toiture dans l'Hérault",
    chapo: // À CONFIRMER avec ARVÉO (fourchette citée)
      "Un démoussage complet, nettoyage et traitement anti-mousse, se situe le plus souvent entre 12 et 30 € le m² TTC. Le haut de la fourchette concerne un toit haut, pentu ou traité à l'hydrofuge. Prix indicatifs, à confirmer après visite.",
    unite: "m²",
    bas: 12, // À CONFIRMER avec ARVÉO
    haut: 30, // À CONFIRMER avec ARVÉO
    valide: false,
    cas: [
      {
        cas: "Plain-pied, 100 m² de tuiles canal, brossage manuel et anti-mousse",
        fourchette: "1 200 à 2 200 €", // À CONFIRMER avec ARVÉO
        detail:
          "Mousses retirées à la brosse et au grattoir, produit anti-mousse pulvérisé, rinçage doux, gouttières vidées.",
      },
      {
        cas: "Le même toit avec un hydrofuge en finition",
        fourchette: "1 800 à 3 000 €", // À CONFIRMER avec ARVÉO
        detail:
          "L'hydrofuge s'applique sur tuile propre et sèche, donc lors d'un second passage. Il limite l'absorption d'eau des tuiles devenues poreuses.",
      },
      {
        cas: "Maison à étage, 130 m² de tuiles romanes, travail en nacelle",
        fourchette: "2 000 à 3 900 €", // À CONFIRMER avec ARVÉO
        detail:
          "Location et mise en place de la nacelle, bâches sur les façades et les menuiseries, traitement en deux passages.",
      },
      {
        cas: "Garage ou appentis de 25 m²",
        fourchette: "350 à 700 €", // À CONFIRMER avec ARVÉO
        detail:
          "Petite surface, donc forfait minimum. Le trajet et la mise en sécurité comptent davantage que le temps passé sur les tuiles.",
      },
      {
        cas: "Démoussage de 90 m² avec quelques tuiles fêlées et un chéneau à curer",
        fourchette: "1 500 à 2 900 €", // À CONFIRMER avec ARVÉO
        detail:
          "Les tuiles cassées découvertes pendant le brossage sont remplacées dans la foulée, avec votre accord, et le chéneau est débarrassé des débris.",
      },
    ],
    facteurs: [
      {
        titre: "Le degré d'encrassement",
        texte:
          "Un voile de lichens se traite vite. Des coussins de mousse épais, des aiguilles de pin coincées entre les tuiles et des gouttières pleines réclament plus de temps et davantage de déchets à évacuer.",
      },
      {
        titre: "La méthode de nettoyage",
        texte:
          "On privilégie la brosse et une pression modérée. Un nettoyeur haute pression mal réglé arrache la surface des tuiles anciennes et les rend plus poreuses. La méthode douce est plus lente, et le prix en tient compte.",
      },
      {
        titre: "Le traitement de finition",
        texte:
          "L'anti-mousse seul coûte moins qu'un hydrofuge, qui exige une tuile sèche et un second passage. L'hydrofuge n'a d'intérêt que sur des tuiles saines mais devenues poreuses.",
      },
      {
        titre: "La hauteur et la pente",
        texte:
          "Sur un toit de plain-pied, une échelle et une ligne de vie suffisent parfois. Au-delà, une nacelle ou un échafaudage devient nécessaire, avec une location ajoutée au devis.",
      },
      {
        titre: "La surface traitée",
        texte:
          "Les frais fixes se répartissent mieux sur un grand toit. Sous une trentaine de m², on bascule souvent sur un forfait plutôt que sur un prix au mètre carré.",
      },
      {
        titre: "Ce que le nettoyage révèle",
        texte:
          "Une fois la mousse partie, des fêlures apparaissent parfois. On vous les montre en photo avant d'y toucher, et le remplacement fait l'objet d'un accord séparé.",
      },
    ],
    inclus: [
      "Mise en sécurité, ligne de vie ou nacelle selon la hauteur",
      "Retrait manuel des mousses et lichens",
      "Pulvérisation d'un produit anti-mousse",
      "Rinçage à pression modérée",
      "Vidage des gouttières et des descentes accessibles",
      "Protection des abords et ramassage des déchets",
    ],
    exclus: [
      "Traitement hydrofuge, proposé en option",
      "Remplacement de tuiles cassées au-delà de quelques unités",
      "Peinture ou résine colorée de toiture",
      "Réparation de zinguerie ou de faîtage",
      "Élagage des arbres qui surplombent le toit",
    ],
    lecture: [
      "Sur un devis de démoussage, la surface traitée est chiffrée en m², avec un prix unitaire. Assurez-vous qu'elle correspond au toit et non à l'emprise au sol, plus petite. Le produit utilisé doit être nommé, avec son type, anti-mousse curatif, préventif ou hydrofuge.",
      "Regardez la méthode décrite. Une mention claire du brossage et d'une pression limitée protège vos tuiles. Si seule une haute pression est annoncée sur des tuiles canal anciennes, posez la question avant de signer.",
      "Même pour un entretien, le document porte les mentions légales de l'entreprise et son assurance, dont la décennale dès que des tuiles sont remplacées. Pour choisir le bon moment, lisez notre conseil sur la [saison idéale pour démousser](/conseils/demoussage-toiture-saison).",
    ],
    sections: [
      {
        h2: "Mousses, lichens et pins dans l'Hérault",
        p: [
          "Sur le littoral héraultais, le soleil limite les mousses sur les pans sud. Les faces nord, les toits ombragés par des pins ou des platanes et les maisons au pied du massif de la Gardiole verdissent en revanche assez vite. On y trouve surtout des lichens gris ou jaunes et des dépôts d'aiguilles qui freinent l'écoulement dans les tuiles canal.",
          "Le vent marin apporte humidité et sel, la tramontane sèche ensuite la couverture. Ce cycle favorise les fissures sur les tuiles déjà poreuses. Un démoussage régulier permet de repérer ces faiblesses tôt, avant qu'elles n'imposent un [remplacement de tuiles](/services/remplacement-tuiles).",
        ],
        liste: [],
      },
      {
        h2: "Démousser ou faire plus ?",
        p: [
          "Un démoussage rend sa propreté au toit et prolonge la vie d'une couverture saine. Il ne répare pas des tuiles gélives, un faîtage décollé ou l'absence d'écran sous-toiture. Si la visite révèle ces problèmes, on vous le dit, on chiffre séparément et vous choisissez.",
          "Le détail de notre méthode figure sur la page [démoussage de toiture](/services/demoussage-toiture). Pour un toit très fatigué, comparez avec le [prix d'une réfection de toiture](/prix/refection-toiture), parfois plus raisonnable sur la durée.",
        ],
        liste: [],
      },
    ],
    faq: [
      {
        q: "Tous les combien faut-il démousser un toit dans l'Hérault ?",
        r: "Il n'y a pas de rythme fixe. Un pan nord sous des pins peut demander un passage régulier, un pan sud bien dégagé beaucoup moins. Le plus simple consiste à observer le toit depuis le jardin chaque année et à faire venir un couvreur quand la mousse s'installe dans les emboîtements.",
      },
      {
        q: "Le traitement hydrofuge est-il utile ?",
        r: "Il l'est sur une tuile saine qui commence à boire l'eau. Il devient inutile sur une tuile neuve ou trop abîmée. On vérifie la porosité pendant la visite et on ne propose l'option que si elle a du sens pour votre couverture.",
      },
      {
        q: "Peut-on démousser soi-même ?",
        r: "Monter sur un toit sans harnais ni ligne de vie expose à une chute grave, et marcher sur des tuiles canal sans savoir où poser le pied les casse. Pour un abri de jardin bas, c'est envisageable avec prudence. Pour une maison, confiez le travail à un professionnel équipé.",
      },
      {
        q: "Le prix comprend-il le nettoyage des gouttières ?",
        r: "Le vidage des gouttières et des descentes accessibles fait partie de la prestation, puisque la mousse retirée y tombe. Un chéneau abîmé ou une descente bouchée en profondeur relèvent de la [zinguerie](/services/zinguerie-gouttieres) et sont chiffrés à part sur le [devis de toiture](/devis-toiture).",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "recherche-de-fuite",
    service: "recherche-de-fuite",
    nom: "Recherche de fuite",
    title: "Prix recherche de fuite toiture 2026, Hérault | ARVÉO",
    description: // À CONFIRMER avec ARVÉO (fourchette citée)
      "Prix indicatifs TTC d'une recherche de fuite sur toiture dans l'Hérault, de 150 à 500 € l'intervention selon l'accès et la méthode. À confirmer après visite.",
    h1: "Prix d'une recherche de fuite de toiture dans l'Hérault",
    chapo: // À CONFIRMER avec ARVÉO (fourchette citée)
      "Trouver d'où vient l'eau coûte le plus souvent entre 150 et 500 € TTC par intervention, selon l'accès au toit et la méthode employée. La réparation est chiffrée ensuite, une fois la cause identifiée. Prix indicatifs, à confirmer.",
    unite: "intervention",
    bas: 150, // À CONFIRMER avec ARVÉO
    haut: 500, // À CONFIRMER avec ARVÉO
    valide: false,
    cas: [
      {
        cas: "Toit de plain-pied en tuiles canal, tache au plafond après un orage",
        fourchette: "150 à 300 €", // À CONFIRMER avec ARVÉO
        detail:
          "Inspection des tuiles, du faîtage et des solins, contrôle des combles. Souvent suffisant pour une tuile glissée ou cassée.",
      },
      {
        cas: "Maison à étage, infiltration autour d'une cheminée ou d'une fenêtre de toit",
        fourchette: "200 à 400 €", // À CONFIRMER avec ARVÉO
        detail:
          "Accès sécurisé, dépose de quelques tuiles près de l'abergement, test à l'eau ciblé pour reproduire l'entrée d'eau.",
      },
      {
        cas: "Toit-terrasse sous membrane, humidité diffuse au plafond",
        fourchette: "300 à 600 €", // À CONFIRMER avec ARVÉO
        detail:
          "Humidimètre et caméra thermique pour cartographier les zones mouillées, contrôle des relevés d'étanchéité et des évacuations.",
      },
      {
        cas: "Fuite intermittente qui ne se montre qu'avec le vent marin",
        fourchette: "250 à 500 €", // À CONFIRMER avec ARVÉO
        detail:
          "Plusieurs points testés tour à tour, parfois en deux passages, car l'eau poussée par le vent entre là où la pluie verticale n'entre pas.",
      },
      {
        cas: "Recherche suivie d'une petite réparation le jour même",
        fourchette: "250 à 650 €", // À CONFIRMER avec ARVÉO
        detail:
          "Tuile remplacée, solin repris, closoir recalé. Possible quand le matériel nécessaire est dans le camion et que vous acceptez le prix sur place.",
      },
    ],
    facteurs: [
      {
        titre: "L'accès au toit",
        texte:
          "Un toit bas se contrôle depuis une échelle. Un immeuble ou une maison de ville serrée entre deux voisins demande une nacelle, un passage par une terrasse voisine ou une installation de sécurité, ce qui allonge le temps passé.",
      },
      {
        titre: "Le type de couverture",
        texte:
          "Sur des tuiles, un couvreur trouve souvent la cause en soulevant quelques pièces. Sur une membrane de toit-terrasse, l'eau circule sous le revêtement et ressort loin de son entrée, d'où l'usage d'appareils de mesure.",
      },
      {
        titre: "La méthode employée",
        texte:
          "Inspection visuelle, test à l'eau ciblé, humidimètre, caméra thermique ou fumigène. On commence toujours par le plus simple, et on ne sort les outils plus coûteux que s'ils sont nécessaires.",
      },
      {
        titre: "Une fuite qui va et vient",
        texte:
          "Une infiltration qui coule à chaque averse se localise vite. Celle qui n'apparaît qu'avec un vent de sud-est et une pluie battante oblige à reproduire ces conditions, parfois en plusieurs fois.",
      },
      {
        titre: "Le compte rendu écrit",
        texte:
          "Si votre assureur réclame un rapport avec photos et localisation de la cause, sa rédaction prend du temps. Signalez-le dès l'appel, on l'intègre au prix annoncé.",
      },
      {
        titre: "L'urgence",
        texte:
          "Une intervention planifiée coûte moins qu'un déplacement un soir d'orage. Quand l'eau coule, un [bâchage d'urgence](/services/bachage-urgence) limite les dégâts en attendant la recherche proprement dite.",
      },
    ],
    inclus: [
      "Déplacement et mise en sécurité",
      "Inspection de la couverture, du faîtage, des rives et des solins",
      "Contrôle des combles ou du plafond touché",
      "Test à l'eau ciblé quand c'est utile",
      "Explication de la cause sur place",
      "Devis de réparation séparé et détaillé",
    ],
    exclus: [
      "Réparation de la cause, sauf petite intervention acceptée sur place",
      "Reprise des plafonds, peintures et isolants mouillés",
      "Fuite sur canalisation ou chauffage, du ressort d'un plombier",
      "Nacelle de grande hauteur si l'accès l'impose, chiffrée à part",
      "Démarches auprès de votre assureur",
    ],
    lecture: [
      "Une recherche de fuite se facture en général au forfait. Le bon d'intervention doit préciser ce que couvre ce forfait, à savoir la méthode, le temps sur place et le type de compte rendu, oral ou écrit. Si un second passage reste possible, son prix doit être annoncé dès le départ.",
      "Séparez bien deux choses, la recherche et la réparation. Une offre qui mélange les deux sans détail ne dit pas ce que vous payez. Après la recherche, la réparation fait l'objet d'un devis distinct, fournitures nommées et quantités indiquées.",
      "Quand la réparation touche la couverture ou l'étanchéité, l'assurance décennale de l'entreprise doit figurer sur le devis. Côté habitation, la prise en charge dépend de votre contrat, renseignez-vous auprès de votre assureur avant d'engager les travaux.",
    ],
    sections: [
      {
        h2: "Les fuites typiques de la côte héraultaise",
        p: [
          "Sur les toits de Frontignan, Sète ou Mèze, beaucoup d'infiltrations naissent aux mêmes endroits. Un solin fissuré au pied d'une cheminée, une tuile canal déplacée par la tramontane, une noue encombrée d'aiguilles de pin. Le vent marin pousse la pluie à l'horizontale et la fait remonter sous les tuiles, surtout sur les pentes faibles.",
          "Les épisodes méditerranéens d'automne déversent énormément d'eau en peu de temps. Une gouttière bouchée déborde alors sous la génoise et l'eau longe le mur jusqu'au plafond, ce qui fait croire à un défaut de couverture. Une bonne recherche distingue ces cas et évite de payer une réparation au mauvais endroit.",
        ],
        liste: [],
      },
      {
        h2: "En attendant le couvreur",
        p: [
          "Coupez le courant si l'eau approche d'un luminaire, placez des récipients, éloignez les meubles et prenez des photos datées pour votre assureur. Notre article [fuite de toiture, que faire](/conseils/fuite-toiture-que-faire) détaille ces gestes.",
          "Pour programmer la visite, consultez notre page [recherche de fuite](/services/recherche-de-fuite) ou demandez un [devis de toiture](/devis-toiture). Si quelques tuiles sont en cause, le [prix du remplacement de tuiles](/prix/remplacement-tuiles) vous donnera un ordre de grandeur pour la suite.",
        ],
        liste: [],
      },
    ],
    faq: [
      {
        q: "La recherche de fuite est-elle déduite de la réparation ?",
        r: "Cela varie selon l'entreprise et le chantier. Chez ARVÉO, on vous le précise avant de venir. Dans tous les cas, le prix de la recherche est annoncé à l'avance et apparaît sur la facture.",
      },
      {
        q: "Mon assurance rembourse-t-elle la recherche de fuite ?",
        r: "Souvent, les contrats habitation couvrent une partie des frais de recherche après un dégât des eaux, mais pas toujours, et avec des plafonds variables. Lisez votre contrat ou appelez votre assureur. Un compte rendu écrit peut appuyer votre déclaration.",
      },
      {
        q: "Pourquoi la tache n'est-elle pas sous la fuite ?",
        r: "L'eau suit les chevrons, l'écran sous-toiture ou la pente de l'isolant avant de traverser le plafond. Elle ressort parfois à deux ou trois mètres de son point d'entrée. C'est pour cela qu'on remonte son chemin à la fois depuis les combles et depuis le toit.",
      },
      {
        q: "Faut-il attendre qu'il pleuve pour chercher ?",
        r: "Non. Un test à l'eau ciblé reproduit l'infiltration par temps sec, point par point, et permet de travailler en sécurité. Pour une fuite active, appelez le [dépannage de toiture](/depannage-toiture), on vous rappelle dans la journée.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "remplacement-tuiles",
    service: "remplacement-tuiles",
    nom: "Remplacement de tuiles",
    title: "Prix remplacement de tuiles en 2026, Hérault | ARVÉO",
    description: // À CONFIRMER avec ARVÉO (fourchette citée)
      "Prix indicatifs TTC pour remplacer des tuiles cassées dans l'Hérault, de 150 à 450 € l'intervention pour quelques tuiles. Canal, romane, mécanique, sur devis.",
    h1: "Prix du remplacement de tuiles dans l'Hérault",
    chapo: // À CONFIRMER avec ARVÉO (fourchette citée)
      "Remplacer quelques tuiles cassées revient le plus souvent entre 150 et 450 € TTC par intervention, déplacement et sécurité compris. Au-delà d'une dizaine de tuiles, on parle plutôt de remaniement, chiffré au m². Prix indicatifs, à confirmer.",
    unite: "intervention",
    bas: 150, // À CONFIRMER avec ARVÉO
    haut: 450, // À CONFIRMER avec ARVÉO
    valide: false,
    cas: [
      {
        cas: "Une à trois tuiles cassées sur une maison de plain-pied",
        fourchette: "150 à 300 €", // À CONFIRMER avec ARVÉO
        detail:
          "Accès à l'échelle, tuiles du même modèle fournies, contrôle des tuiles voisines. Le déplacement pèse plus que les tuiles elles-mêmes.",
      },
      {
        cas: "Une dizaine de tuiles à changer sur une maison à étage",
        fourchette: "250 à 500 €", // À CONFIRMER avec ARVÉO
        detail:
          "Ligne de vie ou accès sécurisé, recherche d'un modèle compatible, tuiles posées et calées dans l'alignement.",
      },
      {
        cas: "Tuiles de rive ou faîtières décollées à resceller",
        fourchette: "300 à 700 €", // À CONFIRMER avec ARVÉO
        detail:
          "Dépose des pièces, nettoyage, nouveau scellement au mortier ou fixation mécanique, selon l'exposition au vent.",
      },
      {
        cas: "Une vingtaine de tuiles déplacées ou cassées après un coup de tramontane",
        fourchette: "400 à 900 €", // À CONFIRMER avec ARVÉO
        detail:
          "Contrôle de tout le toit, tuiles remises en place, pièces cassées remplacées, vérification des crochets et des closoirs.",
      },
      {
        cas: "Remaniement d'un pan, tuiles déposées, triées et reposées",
        fourchette: "30 à 70 € le m²", // À CONFIRMER avec ARVÉO
        detail:
          "Les tuiles saines repartent sur le toit, les autres sont remplacées. On en profite pour changer les liteaux fatigués.",
      },
    ],
    facteurs: [
      {
        titre: "Le nombre de tuiles",
        texte:
          "La tuile elle-même pèse peu dans le total, de l'ordre de 10 à 25 € par pièce posée hors déplacement. Le coût vient surtout du trajet, de l'installation et de la sécurité, identiques pour une tuile ou pour dix.", // À CONFIRMER avec ARVÉO
      },
      {
        titre: "Le modèle de tuile",
        texte:
          "Les tuiles mécaniques récentes se trouvent facilement. Certaines romanes de séries arrêtées, ou les tuiles canal anciennes à la teinte patinée, obligent à chercher en récupération. Une pièce neuve trop claire se remarque sur un toit ancien.",
      },
      {
        titre: "L'emplacement sur le toit",
        texte:
          "Une tuile au milieu d'un pan se change en soulevant ses voisines. En rive, au faîtage ou près d'une noue, il faut reprendre un scellement ou un abergement en zinc, ce qui prend plus de temps.",
      },
      {
        titre: "La hauteur et la pente",
        texte:
          "Un toit de plain-pied peu pentu se traite à l'échelle. Une pente forte ou deux niveaux de façade imposent harnais, ligne de vie ou nacelle.",
      },
      {
        titre: "Les dégâts cachés",
        texte:
          "Une tuile cassée depuis longtemps laisse l'eau mouiller le liteau, parfois le chevron. Si le bois a souffert, on vous le montre et on chiffre la reprise à part.",
      },
      {
        titre: "Le regroupement des petits travaux",
        texte:
          "Pour les secteurs éloignés de Frontignan, les visites s'organisent par tournée planifiée. Grouper une tuile, un nettoyage de gouttière et un point de faîtage dans la même venue réduit la part du déplacement.",
      },
    ],
    inclus: [
      "Déplacement et mise en sécurité",
      "Fourniture de tuiles compatibles avec l'existant",
      "Dépose des tuiles cassées et pose des neuves",
      "Contrôle des tuiles voisines et du liteau",
      "Évacuation des débris",
      "Point oral sur l'état général du toit",
    ],
    exclus: [
      "Remplacement de liteaux ou de chevrons abîmés",
      "Réfection complète du faîtage ou des rives",
      "Démoussage de la couverture",
      "Reprise des plafonds tachés à l'intérieur",
      "Recherche de fuite approfondie si la cause n'est pas visible",
    ],
    lecture: [
      "Pour un petit remplacement, le devis tient souvent en quelques lignes. Il doit tout de même séparer le déplacement, la main-d'œuvre et la fourniture, avec le nombre de tuiles prévues. Une marge de quelques pièces supplémentaires est normale, car on en casse parfois en soulevant les voisines.",
      "Vérifiez le modèle annoncé. Le devis nomme la tuile, canal, romane ou mécanique, et précise s'il s'agit de neuf ou de récupération. Pour un remaniement, l'unité passe au m², avec la part de tuiles neuves estimée.",
      "Les coordonnées de l'assureur décennal de l'entreprise doivent y figurer. Après une tempête, conservez ce document avec vos photos pour la déclaration, la prise en charge restant fonction de votre contrat.",
    ],
    sections: [
      {
        h2: "Tuiles cassées après le vent et la grêle",
        p: [
          "Dans l'Hérault, les tuiles bougent surtout avec le vent. La tramontane soulève les tuiles de rive et les canal non fixées, le vent marin d'est et de sud-est force la pluie dessous. Après une nuit agitée, un regard depuis la rue suffit parfois à repérer une pièce de travers. Notre article [toiture après la tramontane](/conseils/toiture-apres-tramontane) indique quoi observer sans monter.",
          "Les orages de fin d'été apportent parfois de la grêle, qui fêle les tuiles anciennes déjà fragilisées par le soleil. Ces fêlures restent invisibles d'en bas et se révèlent au premier gros épisode pluvieux d'automne.",
        ],
        liste: [],
      },
      {
        h2: "Tuile canal, romane ou mécanique, des prix différents",
        p: [
          "La tuile canal, très répandue dans les villages du Bassin de Thau, se pose traditionnellement par simple recouvrement, parfois scellée au mortier. Elle se remplace vite, à condition de retrouver une pièce de même galbe et de même teinte. La tuile mécanique à emboîtement, fréquente sur les constructions plus récentes, se change à l'unité en quelques minutes une fois l'accès installé.",
          "Le déroulé de l'intervention se trouve sur la page [remplacement de tuiles](/services/remplacement-tuiles). Si les casses se multiplient sur tout le toit, comparez avec le [prix d'une réfection](/prix/refection-toiture), ou commencez par un [démoussage](/prix/demoussage-toiture) pour juger de l'état réel des tuiles.",
        ],
        liste: [],
      },
    ],
    faq: [
      {
        q: "Combien coûte une tuile à remplacer ?",
        r: "La tuile ne représente qu'une petite part du prix. Pour une intervention sur une à trois tuiles, comptez à titre indicatif 150 à 300 € TTC, déplacement compris. Le montant exact dépend de la hauteur et du modèle, et figure sur le [devis de toiture](/devis-toiture).", // À CONFIRMER avec ARVÉO
      },
      {
        q: "Peut-on garder une tuile fêlée ?",
        r: "Une fêlure fine en partie haute peut tenir un moment. Mais l'eau finit par passer, mouille le liteau et descend dans l'isolant. Mieux vaut la changer lors de la prochaine venue sur le toit, surtout avant l'automne.",
      },
      {
        q: "Et si on ne trouve plus ma tuile ?",
        r: "On cherche d'abord un modèle compatible chez les fabricants, puis en récupération. Si rien ne convient, on peut prélever des tuiles sur un pan peu visible et poser les neuves à cet endroit. La façade principale garde ainsi un aspect homogène.",
      },
      {
        q: "L'assurance prend-elle en charge des tuiles envolées ?",
        r: "Après un épisode de vent violent, la garantie tempête de votre contrat habitation peut jouer, selon ses conditions. Prenez des photos, gardez les morceaux et contactez votre assureur. Si une infiltration s'est déclarée, voyez aussi le [prix d'une recherche de fuite](/prix/recherche-de-fuite).",
      },
    ],
  },
];
