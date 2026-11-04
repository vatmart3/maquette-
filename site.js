/*
 * Multiservice Thau — script commun.
 * Génère l'en-tête, le pied de page, les icônes, la carte de la zone et les
 * infos de contact à partir de config.js ; gère le menu mobile, le mini bon
 * de l'accueil et le bon d'intervention (contact).
 */
(function () {
  "use strict";

  var S = window.SITE;
  if (!S) return;

  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var page = document.body.getAttribute("data-page") || "";

  /* ---------- Outils ---------- */

  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // "06 39 98 00 00" -> "+33639980000"
  function telInternational(t) {
    var chiffres = String(t).replace(/\D/g, "");
    if (chiffres.indexOf("33") === 0) return "+" + chiffres;
    return "+33" + chiffres.replace(/^0/, "");
  }

  function normaliser(t) {
    return String(t || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z]/g, "");
  }

  var tel = telInternational(S.telephone);
  var telHref = "tel:" + tel;
  var mailHref = "mailto:" + S.email;

  /* ---------- Icônes maison (trait 1,75 px) ---------- */

  var ICONES = {
    tel: "M6.6 3.5h2.6l1.6 4.2-2.1 1.5a11.5 11.5 0 0 0 6.1 6.1l1.5-2.1 4.2 1.6v2.6a2 2 0 0 1-2.1 2A16.6 16.6 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1z",
    devis: "M7 3h7l4.5 4.5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M14 3v4.5h4.5 M8.5 12.5h7 M8.5 16h5",
    horloge: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7.5V12l3 2",
    cle: "M15.5 3.5a4.5 4.5 0 0 0-4.2 6.1L4.6 16.3a2 2 0 0 0 2.8 2.8l6.7-6.7a4.5 4.5 0 0 0 6.1-4.2l-2.8 2.8-2.6-.4-.4-2.6 2.8-2.8a4.5 4.5 0 0 0-1.7-.3z",
    calendrier: "M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z M8 3.5V8 M16 3.5V8 M4 10.5h16 M9 15.2l2 2 4-4",
    rouleau: "M5 4h11a1.5 1.5 0 0 1 1.5 1.5v2A1.5 1.5 0 0 1 16 9H5a1.5 1.5 0 0 1-1.5-1.5v-2A1.5 1.5 0 0 1 5 4z M17.5 6.5h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H11v3 M10 14.5h2a.5.5 0 0 1 .5.5v5.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V15a.5.5 0 0 1 .5-.5z",
    equerre: "M4 4v16h16z M8 12.5V16h3.5z M4 8h2 M4 12h2.5 M12 20v-2.5 M16 20v-2",
    propre: "M12 3.5l1.6 4.9 4.9 1.6-4.9 1.6L12 16.5l-1.6-4.9L5.5 10l4.9-1.6z M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z",
    pin: "M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z M12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z",
    mail: "M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M3.5 7l8.5 6 8.5-6",
    check: "M5 12.5l4.5 4.5L19 7.5",
    photo: "M4.5 7.5h3l1.5-2.5h6l1.5 2.5h3a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V9a1.5 1.5 0 0 1 1.5-1.5z M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
    info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v5.5 M12 7.7v.1",
    menu: "M4 7h16 M4 12h16 M4 17h16",
    fermer: "M6 6l12 12 M18 6L6 18",
  };

  var ETOILE = "M12 2.8l2.8 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.1l-5.7 3 1.2-6.3L2.9 9.4l6.3-.8z";

  function ico(nom, classe) {
    return (
      '<svg class="ico' + (classe ? " " + classe : "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' +
      ICONES[nom] +
      '"/></svg>'
    );
  }

  function logo() {
    return (
      '<svg class="logo__marque" viewBox="0 0 44 44" aria-hidden="true" focusable="false">' +
      '<rect width="44" height="44" rx="11" fill="#2347A0"/>' +
      '<path d="M10.5 21.5 22 12l11.5 9.5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M14.5 19.5v9.5h15v-9.5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M10 34.6c6.5-.8 16.5.6 24-.4" fill="none" stroke="#F2C230" stroke-width="3.2" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  function nomLogo() {
    return '<span class="logo__nom">' + esc(S.nom) + "<small>" + esc(S.accroche) + "</small></span>";
  }

  /* ---------- Carte schématique de la zone ---------- */

  // Positions calculées depuis les coordonnées GPS des communes (projection simple).
  var POSITIONS = {
    sete: [368, 272, 10, 5, "start"],
    frontignan: [464, 172, 10, -8, "start"],
    balaruclesbains: [336, 187, 10, 6, "start"],
    balaruclevieux: [347, 140, 10, 4, "start"],
    meze: [219, 221, -10, 4, "end"],
    marseillan: [94, 377, -10, 4, "end"],
    bouzigues: [303, 172, -8, -8, "end"],
    poussan: [324, 80, -10, 4, "end"],
    gigean: [391, 58, 10, 4, "start"],
    viclagardiole: [530, 82, 0, 24, "middle"],
  };

  function carteZone() {
    var points = "";
    var noms = "";
    S.villes.forEach(function (v) {
      var p = POSITIONS[normaliser(v)];
      if (!p) return;
      points += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7"/>';
      noms +=
        '<text x="' + (p[0] + p[2]) + '" y="' + (p[1] + p[3]) + '" text-anchor="' + p[4] + '">' + esc(v) + "</text>";
    });
    var grille = "";
    for (var x = 60; x < 600; x += 60) grille += "M" + x + " 30V470";
    for (var y = 60; y < 470; y += 60) grille += "M0 " + y + "H600";
    return (
      '<svg viewBox="0 30 600 440" role="img" aria-labelledby="carte-titre">' +
      '<title id="carte-titre">Schéma de la zone d\'intervention autour de l\'étang de Thau : ' + esc(S.villes.join(", ")) + "</title>" +
      '<rect x="0" y="30" width="600" height="440" fill="#F6F8FC"/>' +
      '<path d="' + grille + '" stroke="#E7ECF4" stroke-width="1" fill="none"/>' +
      '<path d="M-16.2 510.6C-0.0 500.9 51.4 472.0 81.1 452.6C110.8 433.3 135.1 413.2 162.2 394.7C189.2 376.1 217.6 356.8 243.2 341.1C268.9 325.5 297.3 308.1 316.2 301.0C335.1 294.0 344.1 300.3 356.8 298.8C369.5 297.3 380.3 299.2 392.4 292.1C404.6 285.0 414.1 270.5 429.7 256.4C445.4 242.3 466.2 224.1 486.5 207.4C506.8 190.6 529.7 171.7 551.4 156.1C573.0 140.5 605.4 120.8 616.2 113.7L640 500L-20 520Z" fill="#DCE5F6" stroke="#A9BBE0" stroke-width="1.5"/>' +
      '<path d="M105.4 390.2C110.3 377.9 131.1 354.9 145.9 336.7C160.8 318.5 179.7 296.9 194.6 280.9C209.5 265.0 221.6 253.8 235.1 240.8C248.6 227.8 263.5 211.8 275.7 202.9C287.8 194.0 298.4 188.0 308.1 187.3C317.8 186.6 325.9 194.4 334.1 198.4C342.2 202.5 351.9 205.9 356.8 211.8C361.6 217.8 365.9 227.1 363.2 234.1C360.5 241.2 351.1 246.8 340.5 254.2C330.0 261.6 315.7 267.6 300.0 278.7C284.3 289.9 264.1 307.0 246.5 321.1C228.9 335.2 211.4 350.4 194.6 363.4C177.8 376.5 158.9 391.3 145.9 399.1C133.0 406.9 123.5 411.8 116.8 410.3C110.0 408.8 100.5 402.5 105.4 390.2Z" fill="#DCE5F6" stroke="#A9BBE0" stroke-width="1.5"/>' +
      '<g font-family="Barlow, sans-serif" font-weight="500" font-size="14" fill="#4D66A6" letter-spacing=".02em">' +
      '<text transform="translate(206 330) rotate(-38)">Étang de Thau</text>' +
      '<text transform="translate(410 392) rotate(-33)">Mer Méditerranée</text>' +
      "</g>" +
      '<g fill="#2347A0" stroke="#fff" stroke-width="2.5">' + points + "</g>" +
      '<g font-family="Barlow Semi Condensed, Barlow, sans-serif" font-weight="700" font-size="17" fill="#14213D" stroke="#F6F8FC" stroke-width="4.5" paint-order="stroke" stroke-linejoin="round">' +
      noms +
      "</g></svg>"
    );
  }

  var pages = [
    { id: "accueil", href: "./", texte: "Accueil" },
    { id: "histoire", href: "histoire", texte: "Notre histoire" },
    { id: "avis", href: "avis", texte: "Avis clients" },
    { id: "contact", href: "contact", texte: "Contact" },
  ];

  function liensPages() {
    return pages
      .map(function (p) {
        var courant = p.id === page ? ' aria-current="page"' : "";
        return '<li><a href="' + p.href + '"' + courant + ">" + p.texte + "</a></li>";
      })
      .join("");
  }

  function villesHTML() {
    return S.villes
      .map(function (v, i) {
        return "<span>" + esc(v) + (i === S.villes.length - 1 ? "." : ",") + "</span>";
      })
      .join(" ");
  }

  /* ---------- En-tête ---------- */

  var entete = document.querySelector("[data-slot='entete']");
  if (entete) {
    var barre = document.createElement("div");
    barre.className = "barre-contact";
    barre.innerHTML =
      '<div class="conteneur barre-contact__ligne">' +
      "<p>" + esc(S.accroche) + " autour de l'étang de Thau</p>" +
      '<div class="barre-contact__liens">' +
      '<a href="' + telHref + '">' + ico("tel") + esc(S.telephone) + "</a>" +
      "<span>" + esc(S.horaires.texte) + "</span>" +
      "</div></div>";
    entete.parentNode.insertBefore(barre, entete);

    entete.innerHTML =
      '<div class="conteneur entete__ligne">' +
      '<a class="logo" href="./" aria-label="' + esc(S.nom) + ', accueil">' + logo() + nomLogo() + "</a>" +
      '<nav class="nav" aria-label="Navigation principale"><ul>' + liensPages() + "</ul></nav>" +
      '<a class="bouton bouton--action entete__devis" href="contact">' + ico("devis") + "Demander un devis</a>" +
      '<button class="entete__menu" type="button" aria-expanded="false" aria-controls="menu">' + ico("menu") + "<span>Menu</span></button>" +
      "</div>" +
      '<div class="menu" id="menu" hidden><div class="conteneur">' +
      '<nav aria-label="Navigation mobile"><ul>' + liensPages() + "</ul></nav>" +
      "<p>" + esc(S.horaires.texte) + ".</p>" +
      "</div></div>";

    var boutonMenu = entete.querySelector(".entete__menu");
    var menu = entete.querySelector("#menu");

    function majBoutonMenu(ouvert) {
      boutonMenu.setAttribute("aria-expanded", ouvert ? "true" : "false");
      boutonMenu.innerHTML = ico(ouvert ? "fermer" : "menu") + "<span>" + (ouvert ? "Fermer" : "Menu") + "</span>";
    }

    function fermerMenu(rendreFocus) {
      menu.hidden = true;
      menu.classList.remove("est-ouvert");
      majBoutonMenu(false);
      if (rendreFocus) boutonMenu.focus();
    }

    boutonMenu.addEventListener("click", function () {
      if (menu.hidden) {
        menu.hidden = false;
        menu.classList.add("est-ouvert");
        majBoutonMenu(true);
      } else {
        fermerMenu(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) fermerMenu(true);
    });

    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (e) {
      if (e.matches) fermerMenu(false);
    });
  }

  /* ---------- Pied de page ---------- */

  var pied = document.querySelector("[data-slot='pied']");
  if (pied) {
    pied.innerHTML =
      '<div class="conteneur">' +
      '<div class="pied__grille">' +
      "<div>" +
      '<a class="logo" href="./">' + logo() + nomLogo() + "</a>" +
      "<p>Réparer, entretenir, rénover, aménager.<br>Un seul interlocuteur pour toute la maison.</p>" +
      "</div>" +
      "<div>" +
      "<h2>Nous joindre</h2>" +
      "<ul>" +
      '<li><a class="pied__tel" href="' + telHref + '">' + esc(S.telephone) + "</a></li>" +
      '<li><a href="' + mailHref + '">' + esc(S.email) + "</a></li>" +
      "<li>" + esc(S.horaires.texte) + "</li>" +
      "</ul>" +
      "</div>" +
      "<div>" +
      "<h2>Où on intervient</h2>" +
      '<p class="pied__villes">' + villesHTML() + "</p>" +
      "</div>" +
      "<div>" +
      "<h2>Pages</h2>" +
      "<ul>" + liensPages() + "</ul>" +
      "</div>" +
      "</div>" +
      '<div class="pied__bas">' +
      '<p><a href="' + esc(S.liens.mentionsLegales) + '">Mentions légales</a></p>' +
      '<p>Site réalisé par <a href="' + esc(S.agence.url) + '">' + esc(S.agence.nom) + "</a></p>" +
      "</div>" +
      "</div>";
  }

  /* ---------- Barre d'actions mobile & badge maquette ---------- */

  var barreMobile = document.createElement("div");
  barreMobile.className = "barre-mobile";
  barreMobile.innerHTML =
    '<a class="bouton bouton--bleu" href="' + telHref + '" aria-label="Appeler le ' + esc(S.telephone) + '">' + ico("tel") +
    (page === "contact" ? "Appeler le " + esc(S.telephone) : "Appeler") + "</a>" +
    (page === "contact" ? "" : '<a class="bouton bouton--action" href="contact">' + ico("devis") + "Devis gratuit</a>");
  if (page === "contact") barreMobile.classList.add("barre-mobile--seule");
  document.body.appendChild(barreMobile);

  if (S.maquette) {
    var badge = document.createElement("div");
    badge.className = "badge-maquette";
    badge.textContent = "Maquette réalisée par " + S.agence.nom;
    document.body.appendChild(badge);
  }

  /* ---------- Valeurs de la config dans les pages ---------- */

  var valeurs = {
    nom: S.nom,
    telephone: S.telephone,
    email: S.email,
    horaires: S.horaires.texte,
    numeroBon: S.numeroBon,
  };

  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var cle = el.getAttribute("data-cfg");
    if (valeurs[cle] != null) el.textContent = valeurs[cle];
  });

  document.querySelectorAll("[data-href]").forEach(function (el) {
    var type = el.getAttribute("data-href");
    if (type === "tel") el.href = telHref;
    if (type === "mail") el.href = mailHref;
    if (type === "avis-google") el.href = S.liens.avisGoogle;
  });

  document.querySelectorAll("[data-ico]").forEach(function (el) {
    var nom = el.getAttribute("data-ico");
    if (ICONES[nom]) el.outerHTML = ico(nom, el.getAttribute("class") === "ico" ? "" : el.getAttribute("class"));
  });

  document.querySelectorAll("[data-etoiles]").forEach(function (el) {
    var html = "";
    for (var i = 0; i < 5; i++) html += '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + ETOILE + '"/></svg>';
    el.innerHTML = html;
  });

  document.querySelectorAll("[data-villes]").forEach(function (el) {
    el.innerHTML = villesHTML();
  });

  document.querySelectorAll("[data-villes-pastilles]").forEach(function (el) {
    el.innerHTML = S.villes
      .map(function (v) {
        return "<li>" + ico("pin") + esc(v) + "</li>";
      })
      .join("");
  });

  document.querySelectorAll("[data-carte]").forEach(function (el) {
    el.innerHTML = carteZone();
  });

  document.querySelectorAll("[data-villes-options]").forEach(function (el) {
    var html = "";
    S.villes.forEach(function (v) {
      html += '<option value="' + esc(v) + '">' + esc(v) + "</option>";
    });
    if (el.tagName === "SELECT") html += '<option value="Autre">Autre ville</option>';
    el.insertAdjacentHTML("beforeend", html);
  });

  var aujourdhui = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  document.querySelectorAll("[data-date]").forEach(function (el) {
    el.textContent = aujourdhui;
  });

  /* ---------- Données structurées ---------- */

  var ld = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: S.nom,
    url: S.siteUrl,
    telephone: tel,
    email: S.email,
    areaServed: S.villes.map(function (v) {
      return { "@type": "City", name: v };
    }),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: S.horaires.jours,
        opens: S.horaires.ouverture,
        closes: S.horaires.fermeture,
      },
    ],
  };
  var script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);

  /* ---------- Bon d'intervention (contact) ---------- */

  var bon = document.querySelector("[data-bon]");
  if (!bon) return;

  var form = bon.querySelector("form");
  var champs = bon.querySelector(".bon__champs");
  var selectVille = form.elements.ville;
  var ligneAutre = bon.querySelector(".champ--autre");
  var confirmation = bon.querySelector(".bon__confirmation");
  var essaye = false;

  function majAutre() {
    var autre = selectVille.value === "Autre";
    ligneAutre.hidden = !autre;
    if (!autre) effacerErreur(form.elements.villeAutre);
  }
  selectVille.addEventListener("change", majAutre);

  // Pré-remplissage depuis le mini bon de l'accueil
  var params = new URLSearchParams(window.location.search);
  var repris = false;
  if (params.get("besoin")) {
    form.elements.description.value = params.get("besoin");
    repris = true;
  }
  if (params.get("tel")) {
    form.elements.telephone.value = params.get("tel");
    repris = true;
  }
  if (params.get("ville")) {
    var cherche = normaliser(params.get("ville"));
    var trouvee = S.villes.filter(function (v) {
      return normaliser(v) === cherche;
    })[0];
    if (trouvee) {
      selectVille.value = trouvee;
    } else {
      selectVille.value = "Autre";
      form.elements.villeAutre.value = params.get("ville");
    }
    repris = true;
  }
  majAutre();
  if (repris) bon.querySelector(".bon__prerempli").hidden = false;

  // Liste des photos choisies
  var fichier = form.elements.photos;
  var listeFichiers = bon.querySelector(".fichier__liste");
  fichier.addEventListener("change", function () {
    var noms = Array.prototype.map.call(fichier.files, function (f) {
      return f.name;
    });
    listeFichiers.textContent = noms.length
      ? (noms.length === 1 ? "1 photo jointe : " : noms.length + " photos jointes : ") + noms.join(", ")
      : "";
  });

  // Validation
  function zoneErreur(el) {
    var ids = (el.getAttribute("aria-describedby") || "").split(" ");
    var id = ids.filter(function (i) {
      return /-erreur$/.test(i);
    })[0];
    return id ? document.getElementById(id) : null;
  }

  function poserErreur(el, message) {
    var zone = zoneErreur(el);
    el.setAttribute("aria-invalid", "true");
    if (zone) zone.textContent = message;
  }

  function effacerErreur(el) {
    var zone = zoneErreur(el);
    el.removeAttribute("aria-invalid");
    if (zone) zone.textContent = "";
  }

  var regles = [
    {
      el: form.elements.nom,
      test: function (v) {
        return v.trim().length >= 2 ? "" : "Indiquez votre nom pour qu'on sache qui rappeler.";
      },
    },
    {
      el: form.elements.telephone,
      test: function (v) {
        var t = v.replace(/[\s.\-()]/g, "");
        if (!t) return "Indiquez un numéro pour qu'on puisse vous rappeler.";
        if (!/^(?:\+33|0033|0)[1-9]\d{8}$/.test(t))
          return "Ce numéro semble incomplet. Il faut 10 chiffres, par exemple 06 12 34 56 78.";
        return "";
      },
    },
    {
      el: form.elements.email,
      test: function (v) {
        if (!v.trim()) return "";
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
          ? ""
          : "Cette adresse e-mail semble incomplète. Vous pouvez aussi laisser ce champ vide.";
      },
    },
    {
      el: selectVille,
      test: function (v) {
        return v ? "" : "Choisissez votre ville dans la liste.";
      },
    },
    {
      el: form.elements.villeAutre,
      test: function (v) {
        if (selectVille.value !== "Autre") return "";
        return v.trim() ? "" : "Indiquez le nom de votre ville.";
      },
    },
    {
      el: bon.querySelector(".groupe-besoin"),
      groupe: "besoin",
      test: function () {
        return form.querySelectorAll("input[name='besoin']:checked").length
          ? ""
          : "Cochez au moins une case, même « Autre ».";
      },
    },
    {
      el: form.elements.description,
      test: function (v) {
        return v.trim().length >= 5 ? "" : "Décrivez en quelques mots ce qu'il faut faire.";
      },
    },
    {
      el: bon.querySelector(".groupe-delai"),
      groupe: "delai",
      test: function () {
        return form.querySelector("input[name='delai']:checked") ? "" : "Choisissez un délai.";
      },
    },
  ];

  function verifier(regle) {
    var message = regle.test(regle.groupe ? "" : regle.el.value);
    if (message) poserErreur(regle.el, message);
    else effacerErreur(regle.el);
    return message;
  }

  regles.forEach(function (regle) {
    var evt = regle.groupe || regle.el.tagName === "SELECT" ? "change" : "input";
    regle.el.addEventListener(evt, function () {
      if (essaye) verifier(regle);
    });
    if (!regle.groupe) {
      regle.el.addEventListener("blur", function () {
        if (essaye) verifier(regle);
      });
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    essaye = true;
    var premiere = null;
    regles.forEach(function (regle) {
      if (verifier(regle) && !premiere) premiere = regle;
    });

    if (premiere) {
      var cible = premiere.groupe ? premiere.el.querySelector("input") : premiere.el;
      cible.focus();
      return;
    }

    // Pas de back-end : on tamponne le bon.
    var prenom = form.elements.nom.value.trim().split(/\s+/)[0];
    bon.classList.add("est-envoye");
    champs.inert = true;
    confirmation.innerHTML =
      "<strong>Votre demande est bien envoyée" + (prenom ? ", " + esc(prenom) : "") + ".</strong>" +
      "<p>On vous rappelle dans la journée au " + esc(form.elements.telephone.value.trim()) + ". " +
      "C'est urgent ? Appelez-nous au <a href=\"" + telHref + '">' + esc(S.telephone) + "</a>.</p>";
    confirmation.setAttribute("tabindex", "-1");
    confirmation.focus({ preventScroll: true });
    confirmation.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "center" });
  });
})();
