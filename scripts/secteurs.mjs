// À CONFIRMER : secteurs desservis à valider avec Couvreur Proximité 34
/*
 * Couvreur Proximité 34 — pages secteurs (/secteur/<slug>).
 * Chaque secteur a un texte propre. Les communes listées sont celles affichées
 * sur la page, communes avec page dédiée comprises.
 */

export const SECTEURS = [
  {
    slug: "bassin-de-thau",
    nom: "Bassin de Thau",
    title: "Couvreur Bassin de Thau, de Sète à Mèze | Couvreur Proximité 34",
    description:
      "Couvreur dans le Bassin de Thau, on intervient depuis Frontignan à Sète, Balaruc, Mèze, Marseillan et Poussan. Réparation, réfection et dépannage.",
    h1: "Couvreur dans le Bassin de Thau",
    chapo:
      "Le Bassin de Thau est notre secteur de proximité. Installés à Frontignan, nous intervenons autour de l'étang, de Sète à Marseillan, et jusqu'aux villages de la Gardiole, pour réparer, entretenir ou refaire votre toiture.",
    communes: [
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
      "Mèze",
      "Marseillan",
      "Bouzigues",
      "Loupian",
      "Villeveyrac",
      "Pinet",
      "Pomérols",
    ],
    texte: [
      "L'étang de Thau dessine un paysage à part. D'un côté, le mont Saint-Clair et le port de [Sète](/couvreur/sete). De l'autre, les parcs à huîtres de Bouzigues et de [Mèze](/couvreur/meze), puis les vignes du picpoul qui s'étirent vers Pinet et Pomérols. À l'est, le massif de la Gardiole ferme l'horizon au-dessus de Gigean, de Vic-la-Gardiole et de Mireval. Marseillan, au sud-ouest, garde son port tourné vers la lagune.",
      "Le bâti reflète cette double culture, maritime et viticole. Les centres anciens alignent des maisons de pêcheurs et de vignerons couvertes de tuiles canal sur génoises. Autour, les résidences de bord d'étang et les lotissements récents ont plutôt des tuiles romanes ou mécaniques. Les zones d'activité ajoutent leurs bâtiments en bac acier. Pour les dégâts courants, notre service de [remplacement de tuiles](/services/remplacement-tuiles) traite tuiles cassées, glissées ou poreuses. Dans les villages vignerons comme Villeveyrac ou Loupian, d'anciennes caves et remises ajoutent de grandes toitures à surveiller.",
      "Le climat de la lagune impose ses règles. Le sel et l'humidité usent la zinguerie et nourrissent les mousses sur les versants nord. La tramontane soulève faîtières et rives, surtout dans les villages adossés à la Gardiole. Les pluies d'automne, enfin, révèlent la moindre faiblesse d'une noue ou d'un solin. Une révision en fin d'été reste la meilleure prévention. Sur les toits plats des résidences, ce sont les relevés et les évacuations qui demandent de l'attention.",
      "Couvreur Proximité 34 est installé à [Frontignan](/couvreur/frontignan). Dans ce secteur, nous sommes chez nous. Une fuite à Balaruc, à Poussan ou à Mèze se traite au plus vite, sans attendre une tournée, et on vous rappelle dans la journée. Pour un projet, on vient faire le diagnostic à la date qui vous convient. Chaque commune a sa page, avec ses particularités, et la page [devis toiture](/devis-toiture) vous permet de décrire votre besoin.",
    ],
    toitures: [
      "Tuiles canal anciennes sur génoises dans les centres de Sète, Frontignan, Mèze et Poussan.",
      "Zinguerie et crochets usés prématurément par le sel au bord de l'étang et de la mer.",
      "Mousses et lichens sur les versants nord, entretenus par l'humidité de la lagune.",
      "Faîtières et tuiles de rive soulevées par la tramontane dans les villages de la Gardiole.",
      "Toitures-terrasses de résidences et bâtiments en bac acier des zones d'activité.",
    ],
    faq: [
      {
        q: "Intervenez-vous à Mèze et à Marseillan ?",
        r: "Oui, Mèze et Marseillan font partie de notre secteur de proximité, comme Bouzigues, Loupian ou Pinet. Le trajet depuis Frontignan longe l'étang, ce qui nous permet d'intervenir au plus vite pour une fuite et de fixer facilement un rendez-vous de diagnostic.",
      },
      {
        q: "Le sel de l'étang abîme-t-il autant que celui de la mer ?",
        r: "L'étang est salé, et ses abords restent humides une bonne partie de l'année. Les gouttières, les crochets et les solins y vieillissent plus vite que dans l'arrière-pays. Un contrôle régulier de la zinguerie et des fixations limite les mauvaises surprises.",
      },
      {
        q: "Pourquoi choisir un couvreur installé dans le bassin ?",
        r: "Parce que nous connaissons les toits du secteur, des maisons de pêcheurs aux mas vignerons, et que nos trajets restent courts. Une petite réparation ne coûte pas un déplacement démesuré, et le suivi après travaux se fait sans difficulté.",
      },
    ],
  },
  {
    slug: "montpellier-metropole",
    nom: "Montpellier Métropole",
    title: "Couvreur Montpellier et Métropole | Couvreur Proximité 34",
    description:
      "Couvreur à Montpellier, Lattes, Castelnau-le-Lez, Pérols et alentours. Depuis Frontignan, diagnostic et travaux de toiture sur rendez-vous.",
    h1: "Couvreur à Montpellier et dans sa métropole",
    chapo:
      "Ce secteur regroupe Montpellier, plusieurs communes de la Métropole et des communes voisines du Pays de l'Or et du Grand Pic Saint-Loup. Couvreur Proximité 34 s'y déplace depuis Frontignan, sur rendez-vous, pour réparer, entretenir ou refaire votre toiture.",
    communes: [
      "Montpellier",
      "Lattes",
      "Castelnau-le-Lez",
      "Pérols",
      "Mauguio",
      "Palavas-les-Flots",
      "Saint-Jean-de-Védas",
      "Juvignac",
      "Grabels",
      "Saint-Gély-du-Fesc",
      "Le Crès",
      "Clapiers",
      "Jacou",
      "Vendargues",
      "Castries",
      "Fabrègues",
      "Lavérune",
      "Pignan",
      "Saint-Georges-d'Orques",
      "Montferrier-sur-Lez",
      "Prades-le-Lez",
      "Baillargues",
      "Saint-Aunès",
      "Saint-Clément-de-Rivière",
    ],
    texte: [
      "Soyons précis sur ce que recouvre ce secteur. Il réunit Montpellier et des communes de Montpellier Méditerranée Métropole comme [Lattes](/couvreur/lattes), Castelnau-le-Lez, Pérols, Saint-Jean-de-Védas, Juvignac ou Grabels. S'y ajoutent des communes voisines qui n'appartiennent pas à la Métropole, à savoir Mauguio et Palavas-les-Flots, dans l'agglomération du Pays de l'Or, et Saint-Gély-du-Fesc, dans le Grand Pic Saint-Loup. Ce découpage administratif compte peu pour un toit, mais il vaut mieux savoir de quoi on parle.",
      "Les toitures y sont très variées. Dans l'Écusson, le centre historique de [Montpellier](/couvreur/montpellier), hôtels particuliers et immeubles anciens portent des tuiles canal, des chéneaux et des souches de cheminée parfois difficiles d'accès. Les quartiers pavillonnaires des années soixante à quatre-vingt-dix comptent des villas en tuiles romanes ou mécaniques. Les opérations récentes, comme à Port Marianne, multiplient les toits-terrasses. Sur le littoral, de Palavas-les-Flots à Carnon, le sel use la zinguerie. Dans les communes de la première couronne, comme Castelnau-le-Lez, Le Crès ou Jacou, beaucoup de maisons arrivent à l'âge où faîtages et closoirs doivent être repris.",
      "Au nord, vers Grabels et Saint-Gély-du-Fesc, la garrigue et les pins remplissent les gouttières, et les orages d'automne y sont parfois violents. Partout, le vent du nord soulève les rives et les faîtières mal fixées. Quand une tache apparaît au plafond, notre service de [recherche de fuite](/services/recherche-de-fuite) aide à retrouver le point d'entrée de l'eau avant de réparer. À Lattes et à Pérols, la proximité des étangs entretient aussi une humidité favorable aux mousses.",
      "Ce secteur est plus éloigné de Frontignan que le Bassin de Thau. Nous organisons donc nos déplacements à l'avance et regroupons les visites dans une même zone. Le diagnostic se fait sur rendez-vous, puis les travaux sont planifiés avec vous, accès et matériel compris. Pour commencer, demandez un [rendez-vous de diagnostic](/rendez-vous) en indiquant votre commune. Si votre fuite est active, on vous indique comment protéger l'intérieur en attendant notre passage.",
    ],
    toitures: [
      "Tuiles canal, chéneaux et souches de cheminée des immeubles anciens de l'Écusson.",
      "Toits-terrasses des résidences récentes, avec relevés d'étanchéité et évacuations à surveiller.",
      "Villas en tuiles romanes ou mécaniques des quartiers pavillonnaires, aux faîtages vieillissants.",
      "Zinguerie corrodée par l'air marin à Palavas-les-Flots, Pérols et Carnon.",
      "Gouttières encombrées par les pins et la garrigue au nord de Montpellier.",
    ],
    faq: [
      {
        q: "Intervenez-vous en urgence à Montpellier ?",
        r: "Nous sommes installés à Frontignan et nous ne promettons pas de délai pour ce secteur. Pour une fuite, appelez-nous ou faites une demande en ligne. On vous conseille sur les premiers gestes et on organise le déplacement selon notre planning de la semaine.",
      },
      {
        q: "Pouvez-vous intervenir sur un immeuble de l'Écusson ?",
        r: "Oui, pour les copropriétés comme pour les propriétaires. Dans le centre historique, l'accès se prépare avec soin, souvent avec une autorisation de la mairie pour l'échafaudage ou la nacelle. Les abords des monuments protégés peuvent aussi imposer des contraintes, renseignez-vous en mairie.",
      },
      {
        q: "Mauguio et Palavas-les-Flots font-ils partie de la Métropole ?",
        r: "Non, ces deux communes relèvent de l'agglomération du Pays de l'Or, et Saint-Gély-du-Fesc appartient au Grand Pic Saint-Loup. Nous les rattachons à ce secteur pour des raisons pratiques de déplacement, car elles sont proches de Montpellier.",
      },
    ],
  },
  {
    slug: "lunellois",
    nom: "Lunellois",
    title: "Couvreur à Lunel et dans le Lunellois | Couvreur Proximité 34",
    description:
      "Couvreur à Lunel et dans le Lunellois, on organise depuis Frontignan diagnostic, réparation et réfection de toiture sur rendez-vous, visites groupées.",
    h1: "Couvreur dans le Lunellois",
    chapo:
      "Entre Montpellier et la Camargue, le Lunellois a ses vignes, ses manades et son Vidourle. Couvreur Proximité 34 y planifie ses déplacements depuis Frontignan pour diagnostiquer, réparer ou refaire les toitures de Lunel et des villages voisins.",
    communes: [
      "Lunel",
      "Lunel-Viel",
      "Marsillargues",
      "Saint-Just",
      "Saint-Nazaire-de-Pézan",
      "Saturargues",
      "Saint-Sériès",
      "Villetelle",
      "Boisseron",
    ],
    texte: [
      "Le Lunellois occupe l'extrémité est de l'Hérault, à la limite du Gard. Le Vidourle en marque la frontière et rappelle régulièrement sa présence par des crues soudaines, les vidourlades. Au sud, les terres basses de Marsillargues annoncent la Petite Camargue et ses traditions taurines. Au nord, les coteaux du muscat de Lunel s'étirent vers Saturargues et Villetelle. Le paysage reste ouvert, avec peu d'obstacles face au vent.",
      "À [Lunel](/couvreur/lunel), le centre ancien aligne des maisons de ville en pierre aux toits de tuiles canal, souvent mitoyens. Les villages ont gardé des maisons vigneronnes aux grands volumes, avec remises et hangars. Autour, des lotissements récents en tuiles romanes se sont multipliés. Chaque type de toit a ses faiblesses, que nous traitons par des réparations ciblées ou par une [réfection de toiture](/services/refection-toiture) quand la couverture arrive en fin de vie. Les remises agricoles, parfois laissées sans entretien pendant des années, présentent souvent des tuiles cassées et des chevrons affaiblis. Lunel-Viel, Saint-Just ou Boisseron offrent ce même mélange de bâti ancien et récent.",
      "Le climat ajoute ses épreuves. Le mistral souffle parfois jusqu'ici, côté est, et la tramontane balaie aussi le secteur. Les épisodes cévenols et méditerranéens déversent des pluies intenses qui saturent les gouttières et les noues. Après un tel épisode, notre guide [fuite de toiture, que faire](/conseils/fuite-toiture-que-faire) donne les bons réflexes en attendant le diagnostic. Les toits plats des garages et des extensions récentes y sont aussi sensibles aux pluies concentrées.",
      "Lunel est à bonne distance de Frontignan. Nous ne promettons donc pas d'intervention rapide dans le Lunellois. Nous planifions nos déplacements, nous regroupons les visites d'un même secteur et nous réalisons le diagnostic sur rendez-vous. Vous savez ainsi quand nous venons, et le chantier est préparé à l'avance. Pour situer ce secteur parmi les autres, consultez notre [zone d'intervention](/zone-intervention).",
    ],
    toitures: [
      "Maisons de ville mitoyennes du centre de Lunel, couvertes en tuiles canal sur génoises.",
      "Grandes toitures de maisons vigneronnes et de remises dans les villages du muscat.",
      "Lotissements récents en tuiles romanes, où faîtages et rives vieillissent les premiers.",
      "Gouttières et noues saturées par les pluies des épisodes cévenols.",
      "Tuiles déplacées par le mistral et la tramontane sur les versants exposés.",
    ],
    faq: [
      {
        q: "Combien de temps faut-il pour obtenir un rendez-vous dans le Lunellois ?",
        r: "Cela dépend de notre planning et des autres visites prévues dans le secteur. On vous propose une date dès votre demande, en regroupant si possible votre diagnostic avec d'autres rendez-vous proches. On ne promet pas de délai, mais on s'engage sur la date fixée ensemble.",
      },
      {
        q: "Que faire en attendant votre venue si mon toit fuit ?",
        r: "Protégez d'abord l'intérieur avec des bassines et des bâches, et coupez l'électricité dans la pièce si l'eau approche d'un point lumineux. Ne montez pas sur le toit par temps de pluie. Prenez des photos, utiles pour votre assureur et pour notre diagnostic.",
      },
      {
        q: "Les crues du Vidourle concernent-elles la toiture ?",
        r: "Les crues touchent surtout les rez-de-chaussée, mais les pluies qui les provoquent mettent aussi les toits à l'épreuve. Des gouttières bouchées ou une noue encombrée débordent alors très vite. Un entretien avant l'automne réduit nettement ce risque.",
      },
    ],
  },
  {
    slug: "biterrois",
    nom: "Biterrois",
    title: "Couvreur Béziers et Biterrois | Couvreur Proximité 34",
    description:
      "Couvreur à Béziers, Sérignan, Valras-Plage et dans le Biterrois. Depuis Frontignan, diagnostic et travaux de toiture planifiés sur rendez-vous.",
    h1: "Couvreur dans le Biterrois",
    chapo:
      "De Béziers au littoral de Valras-Plage, le Biterrois réunit centres anciens, villages vignerons et stations balnéaires. Couvreur Proximité 34 y organise des déplacements planifiés depuis Frontignan, pour le diagnostic, la réparation et la réfection des toitures.",
    communes: [
      "Béziers",
      "Sérignan",
      "Valras-Plage",
      "Villeneuve-lès-Béziers",
      "Sauvian",
      "Vendres",
      "Portiragnes",
      "Cers",
      "Boujan-sur-Libron",
      "Bassan",
      "Lignan-sur-Orb",
      "Maraussan",
      "Colombiers",
      "Lespignan",
      "Nissan-lez-Ensérune",
      "Cazouls-lès-Béziers",
    ],
    texte: [
      "Le Biterrois s'organise autour de l'Orb, qui passe au pied de la cathédrale Saint-Nazaire de [Béziers](/couvreur/beziers) avant de rejoindre la mer à Valras-Plage. Le canal du Midi y franchit les écluses de Fonseranes. Autour, la plaine viticole s'étend jusqu'à l'étang de Vendres et aux plages de [Sérignan](/couvreur/serignan). Au nord, les premiers coteaux annoncent déjà les reliefs de l'arrière-pays.",
      "La prospérité viticole du XIXe siècle a laissé à Béziers des immeubles bourgeois et des maisons de maître aux toitures soignées, avec chéneaux, corniches et lucarnes. Ces toitures complexes multiplient les points sensibles, à savoir noues, raccords de lucarne et descentes intérieures. Une fuite s'y cache parfois longtemps avant d'apparaître au plafond. Les villages comptent de grandes maisons vigneronnes et leurs caves. Sur le littoral, à Valras-Plage comme à Sérignan, villas et résidences subissent le sel et le vent marin. Pour l'entretien de ces éléments exposés, voyez notre service de [zinguerie et gouttières](/services/zinguerie-gouttieres).",
      "Le climat est marqué par la tramontane, souvent forte dans la plaine, qui soulève les tuiles et fatigue les faîtages. Les étés sont secs et chauds, puis les pluies d'automne arrivent parfois en quelques heures. Une révision de la couverture avant cette saison évite bien des dégâts. Dans les villages, les grandes caves aux toits peu entretenus souffrent particulièrement des coups de vent répétés.",
      "Le Biterrois est éloigné de Frontignan, et nous n'y promettons pas d'intervention rapide. Nous organisons des journées dédiées au secteur, regroupons les rendez-vous et réalisons les diagnostics sur rendez-vous. Les travaux sont ensuite planifiés avec vous, matériel et accès prévus à l'avance, pour éviter les allers-retours inutiles. Si votre besoin est simple, on le regroupe avec d'autres visites à Béziers ou sur le littoral, ce qui limite les frais de déplacement.",
    ],
    toitures: [
      "Toitures d'immeubles bourgeois du XIXe siècle à Béziers, avec chéneaux et lucarnes.",
      "Grandes couvertures en tuiles canal des maisons vigneronnes et de leurs caves.",
      "Faîtages et rives malmenés par la tramontane dans la plaine.",
      "Zinguerie et fixations attaquées par le sel à Valras-Plage et Sérignan.",
      "Toits-terrasses de résidences de bord de mer à reprendre aux relevés.",
    ],
    faq: [
      {
        q: "Vous déplacez-vous à Béziers pour une seule tuile cassée ?",
        r: "On préfère regrouper les petites réparations avec d'autres visites dans le Biterrois, pour que le déplacement reste raisonnable pour vous. Indiquez-nous votre besoin, on vous propose une date où nous serons dans le secteur et on prévoit les tuiles adaptées.",
      },
      {
        q: "Un immeuble ancien du centre de Béziers demande-t-il des précautions ?",
        r: "Oui. L'accès se prépare, souvent avec une autorisation d'occupation de la voirie, et la charpente doit être contrôlée avant une réfection. Les abords de monuments protégés comme la cathédrale peuvent imposer des contraintes, renseignez-vous en mairie avant de lancer le projet.",
      },
      {
        q: "La tramontane abîme-t-elle davantage les toits dans le Biterrois ?",
        r: "Elle y souffle souvent fort, car la plaine lui offre peu d'obstacles. Les tuiles de rive, les faîtières et les tuiles mal accrochées sont les premières touchées. Après un épisode venteux, un coup d'œil depuis le sol permet de repérer une tuile déplacée.",
      },
    ],
  },
  {
    slug: "agde-pezenas",
    nom: "Agde et Pézenas",
    title: "Couvreur Agde et Pézenas | Couvreur Proximité 34",
    description:
      "Couvreur à Agde, au Cap d'Agde et à Pézenas. Depuis Frontignan, diagnostic, réparation et réfection de toiture planifiés sur rendez-vous.",
    h1: "Couvreur à Agde et à Pézenas",
    chapo:
      "D'Agde, la cité de basalte, à Pézenas et ses hôtels particuliers, ce secteur relie le littoral à la vallée de l'Hérault. Couvreur Proximité 34 s'y rend depuis Frontignan sur rendez-vous, avec des visites regroupées et des chantiers préparés.",
    communes: [
      "Agde",
      "Pézenas",
      "Vias",
      "Bessan",
      "Florensac",
      "Saint-Thibéry",
      "Castelnau-de-Guers",
      "Nézignan-l'Évêque",
      "Caux",
      "Tourbes",
      "Lézignan-la-Cèbe",
    ],
    texte: [
      "Le secteur suit le cours inférieur de l'Hérault. Près de l'embouchure, [Agde](/couvreur/agde) s'est bâtie en pierre de basalte issue du volcan du mont Saint-Loup, et sa cathédrale Saint-Étienne a l'allure d'une forteresse. Le Cap d'Agde et le Grau d'Agde forment le versant balnéaire. En remontant le fleuve, on traverse Bessan et Saint-Thibéry avant d'atteindre Pézenas. Ce basalte sombre donne aux rues du centre une teinte qu'on ne retrouve guère ailleurs sur le littoral héraultais.",
      "[Pézenas](/couvreur/pezenas), ville de Molière, conserve un centre ancien riche en hôtels particuliers. Leurs toitures en tuiles canal, leurs génoises et leurs souches de cheminée demandent des interventions respectueuses. Une tuile canal ancienne se remplace par une tuile de même aspect, et un faîtage se reprend dans le respect de la façon d'origine. Ce centre est protégé, et les travaux visibles y sont encadrés. Lisez notre guide sur les [autorisations d'urbanisme pour une toiture](/conseils/travaux-toiture-autorisation-urbanisme) et renseignez-vous en mairie avant tout projet.",
      "Au Cap d'Agde, les résidences et villas récentes posent d'autres questions, à savoir toits-terrasses, zinguerie exposée aux embruns et fixations corrodées. Entre les deux, les villages vignerons gardent de grandes maisons et des caves aux toitures étendues. Partout, la tramontane et les pluies d'automne mettent les couvertures à l'épreuve. Les résidences secondaires, occupées quelques semaines par an, cachent souvent des défauts que personne n'a vus depuis la saison précédente. Pour les terrasses, voyez notre service d'[étanchéité de toit-terrasse](/services/etancheite-toit-terrasse).",
      "Agde et Pézenas sont plus loin de Frontignan que le Bassin de Thau. Nous y venons lors de déplacements planifiés, en regroupant plusieurs visites. Le diagnostic se fait sur rendez-vous, et les travaux sont programmés ensemble, avec le matériel prévu dès le départ pour limiter la durée du chantier. Les communes voisines, comme Vias, Florensac ou Castelnau-de-Guers, sont intégrées aux mêmes déplacements.",
    ],
    toitures: [
      "Toitures en tuiles canal sur maisons de basalte dans le centre ancien d'Agde.",
      "Hôtels particuliers de Pézenas, avec génoises, souches et zinguerie à reprendre avec soin.",
      "Toits-terrasses de résidences au Cap d'Agde, aux relevés d'étanchéité fatigués.",
      "Crochets et gouttières corrodés par les embruns près de la mer.",
      "Grandes couvertures de caves et de maisons vigneronnes dans la vallée de l'Hérault.",
    ],
    faq: [
      {
        q: "Pouvez-vous intervenir dans le centre protégé de Pézenas ?",
        r: "Oui. Dans ce type de centre, les matériaux et l'aspect de la toiture sont encadrés. On établit le diagnostic, puis on vous aide à préparer les éléments techniques de votre demande. La décision appartient à la mairie et, selon les cas, à l'architecte des Bâtiments de France.",
      },
      {
        q: "Ma résidence secondaire au Cap d'Agde est inoccupée l'hiver, pouvez-vous contrôler le toit ?",
        r: "On peut prévoir une visite de contrôle de la toiture à une période convenue, avec un compte rendu et des photos. Si un défaut apparaît, on vous envoie un devis et on programme la réparation lors d'un prochain passage dans le secteur.",
      },
      {
        q: "Le basalte des maisons d'Agde change-t-il quelque chose pour la toiture ?",
        r: "La pierre elle-même est très résistante. En revanche, les maisons anciennes ont souvent des appuis de charpente à vérifier dans des murs épais, ainsi que des génoises et des solins d'origine. On adapte chaque reprise au bâti existant, sans brutaliser la maçonnerie.",
      },
    ],
  },
  {
    slug: "clermontais-lodevois",
    nom: "Clermontais et Lodévois",
    title: "Couvreur Clermontais et Lodévois | Couvreur Proximité 34",
    description:
      "Couvreur à Clermont-l'Hérault, Lodève et autour du Salagou. Depuis Frontignan, diagnostic et travaux de toiture sur rendez-vous planifié.",
    h1: "Couvreur dans le Clermontais et le Lodévois",
    chapo:
      "Du lac du Salagou aux contreforts du Larzac, le Clermontais et le Lodévois ont des toitures marquées par les écarts de température et les pluies cévenoles. Couvreur Proximité 34 y intervient sur rendez-vous, lors de déplacements planifiés depuis Frontignan.",
    communes: [
      "Clermont-l'Hérault",
      "Lodève",
      "Canet",
      "Paulhan",
      "Aspiran",
      "Ceyras",
      "Nébian",
      "Brignac",
      "Octon",
      "Salasc",
      "Le Bosc",
      "Soubès",
    ],
    texte: [
      "Ce secteur s'étend au nord-ouest de Montpellier, là où la plaine laisse place aux reliefs. Autour du lac du Salagou, les ruffes, ces terres rouges, donnent au paysage sa couleur. [Clermont-l'Hérault](/couvreur/clermont-l-herault) s'étage sous les ruines de son château, tandis que [Lodève](/couvreur/lodeve), ancienne cité drapière, se serre au confluent de la Lergue et de la Soulondres, au pied du Larzac. L'autoroute A75 relie les deux villes et facilite nos déplacements.",
      "Les centres anciens sont faits de maisons de pierre hautes et mitoyennes, couvertes de tuiles canal. À Lodève, les toits se superposent dans la pente et l'accès se prépare avec attention. En remontant vers le Larzac, on croise encore des bâtiments anciens couverts de lauzes. Ces lauzes demandent un savoir particulier, et on vous dit franchement si une intervention relève de notre pratique. Dans la plaine du Clermontais, les villages vignerons et les quartiers récents offrent des toitures plus classiques, en tuiles canal ou romanes.",
      "Le climat est plus contrasté qu'au bord de la mer. Les étés sont chauds, les hivers plus froids, avec du gel qui fait éclater les tuiles poreuses et fissure les mortiers. Les gouttières, elles, souffrent du poids de la glace certains hivers. À l'automne, les épisodes cévenols apportent des pluies intenses. Une tuile gélive se remplace avant qu'elle ne laisse passer l'eau, avec notre service de [remplacement de tuiles](/services/remplacement-tuiles).",
      "Ce secteur est loin de Frontignan, et nous n'y promettons aucune rapidité. Nous fixons des journées de déplacement, nous regroupons les rendez-vous de Clermont, de Lodève et des villages, et nous réalisons les diagnostics sur rendez-vous. Les chantiers sont ensuite préparés pour limiter les allers-retours. Avant la visite, des photos de votre toit prises depuis le sol nous aident à préparer le bon matériel.",
    ],
    toitures: [
      "Tuiles canal gélives qui éclatent après les nuits de gel de l'hiver.",
      "Maisons de pierre mitoyennes de Lodève, aux toits étagés dans la pente.",
      "Mortiers de faîtage et de rive fissurés par les écarts de température.",
      "Noues et gouttières débordées lors des épisodes cévenols d'automne.",
      "Toitures de caves et de maisons vigneronnes dans la plaine du Clermontais.",
    ],
    faq: [
      {
        q: "Intervenez-vous autour du lac du Salagou ?",
        r: "Oui, à Octon, Salasc, Le Bosc et dans les villages proches, lors de nos journées dans le secteur. On vous propose un rendez-vous de diagnostic groupé avec d'autres visites, puis les travaux sont planifiés à une date convenue ensemble.",
      },
      {
        q: "Le gel abîme-t-il vraiment les tuiles ?",
        r: "Oui, surtout les tuiles anciennes devenues poreuses. L'eau s'y infiltre, gèle, gonfle et fait éclater la terre cuite. Les fissures restent parfois invisibles jusqu'à la première grosse pluie. Lors d'une révision, on repère et on remplace les tuiles fragilisées.",
      },
      {
        q: "Faut-il une autorisation pour refaire un toit dans le centre de Lodève ?",
        r: "Selon la nature des travaux et l'emplacement de la maison, une déclaration préalable peut être nécessaire. La cathédrale Saint-Fulcran et d'autres édifices protégés peuvent imposer des contraintes à leurs abords. Renseignez-vous en mairie avant de lancer le projet.",
      },
    ],
  },
  {
    slug: "hauts-cantons",
    nom: "Hauts cantons",
    title: "Couvreur Bédarieux et Hauts cantons | Couvreur Proximité 34",
    description:
      "Couvreur à Bédarieux et dans les Hauts cantons de l'Hérault. Depuis Frontignan, diagnostic, réparation et réfection de toiture sur rendez-vous.",
    h1: "Couvreur dans les Hauts cantons de l'Hérault",
    chapo:
      "Dans les Hauts cantons, la montagne commence. Vallée de l'Orb, Caroux, Espinouse, chaque village a son toit et son climat. Couvreur Proximité 34 s'y déplace depuis Frontignan sur rendez-vous planifié, pour le diagnostic, la réparation et la réfection.",
    communes: [
      "Bédarieux",
      "Lamalou-les-Bains",
      "Hérépian",
      "Le Poujol-sur-Orb",
      "Villemagne-l'Argentière",
      "Le Bousquet-d'Orb",
      "Graissessac",
      "Saint-Gervais-sur-Mare",
      "Faugères",
      "Olargues",
      "Saint-Pons-de-Thomières",
      "La Salvetat-sur-Agout",
    ],
    texte: [
      "Les Hauts cantons couvrent la partie montagneuse de l'ouest et du nord-ouest de l'Hérault. [Bédarieux](/couvreur/bedarieux) s'est développée dans la vallée de l'Orb, et son viaduc ferroviaire domine la ville. Le relief est découpé, les routes sinueuses, et chaque vallée vit un peu à son rythme. Plus à l'ouest, le Caroux et l'Espinouse forment le cœur du Parc naturel régional du Haut-Languedoc, autour d'Olargues et de Saint-Pons-de-Thomières.",
      "Le bâti change avec l'altitude. Dans les vallées, les maisons de pierre restent couvertes de tuiles canal. En montant, on rencontre davantage d'ardoise et de lauzes de schiste, sur des charpentes robustes et des toits plus pentus. Les anciennes cités minières, comme Graissessac, et les villes thermales, comme Lamalou-les-Bains, ont aussi leurs immeubles et leurs villas aux toitures plus complexes. Sur ces couvertures particulières, le diagnostic permet de dire honnêtement si nous sommes les bons interlocuteurs ou s'il vaut mieux faire appel à un artisan local spécialisé.",
      "Le climat est rude pour les couvertures. Les épisodes cévenols déversent des pluies très intenses sur les reliefs, la neige et le gel s'invitent en hiver sur les hauteurs, et l'humidité des fonds de vallée nourrit mousses et lichens. Une [charpente](/services/charpente) saine et une couverture bien ventilée sont ici essentielles. Un [démoussage de toiture](/services/demoussage-toiture) régulier aide aussi à préserver les tuiles. Les toits ombragés par les châtaigniers et les chênes verts gardent aussi l'humidité longtemps après la pluie.",
      "C'est notre secteur le plus éloigné de Frontignan, et nous n'y promettons aucun délai d'intervention. Les déplacements sont planifiés, les visites regroupées par vallée, et chaque diagnostic se fait sur rendez-vous. Pour préparer la visite, lisez notre guide [refaire ou réparer sa toiture](/conseils/refaire-ou-reparer-toiture), puis décrivez votre projet sur la page [devis toiture](/devis-toiture). Les chantiers se calent de préférence à la belle saison, quand les routes et la météo le permettent.",
    ],
    toitures: [
      "Tuiles canal sur maisons de pierre dans la vallée de l'Orb.",
      "Couvertures en ardoise ou en lauzes de schiste dans les villages d'altitude.",
      "Tuiles éclatées par le gel et faîtages fissurés après l'hiver.",
      "Mousses et lichens dans les fonds de vallée humides et ombragés.",
      "Gouttières et noues débordées par les pluies des épisodes cévenols.",
    ],
    faq: [
      {
        q: "Venez-vous jusqu'à Bédarieux pour un simple diagnostic ?",
        r: "Oui, sur rendez-vous. On regroupe les diagnostics des Hauts cantons sur des journées dédiées, ce qui rend le déplacement raisonnable. On vous propose une date, puis on vous remet un compte rendu et, si des travaux sont utiles, un devis détaillé.",
      },
      {
        q: "La neige peut-elle endommager ma toiture ?",
        r: "Une neige abondante pèse lourd sur une charpente fatiguée, et sa fonte s'infiltre sous les tuiles mal recouvertes. Le gel qui suit fait éclater les tuiles poreuses. Avant l'hiver, une révision de la couverture et des fixations limite ces risques.",
      },
      {
        q: "Ma maison est isolée en montagne, est-ce un problème pour le chantier ?",
        r: "Non, mais il faut le préparer. On étudie l'accès du camion, l'approvisionnement des matériaux et l'installation de l'échafaudage lors du diagnostic. Les travaux sont ensuite programmés en dehors des périodes de mauvais temps.",
      },
    ],
  },
];
