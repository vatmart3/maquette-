/*
 * Multiservice Thau — script commun.
 * Génère l'en-tête, le pied de page et les infos de contact à partir de config.js,
 * gère le menu mobile, le mini bon de l'accueil et le bon d'intervention (contact).
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

  function villesHTML() {
    return S.villes
      .map(function (v, i) {
        var fin = i === S.villes.length - 1 ? "." : ",";
        return "<span>" + esc(v) + fin + "</span>";
      })
      .join(" ");
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

  /* ---------- En-tête ---------- */

  var entete = document.querySelector("[data-slot='entete']");
  if (entete) {
    entete.innerHTML =
      '<div class="conteneur entete__ligne">' +
      '<a class="marque" href="./">' + esc(S.nom) + "</a>" +
      '<nav class="nav" aria-label="Navigation principale"><ul>' + liensPages() + "</ul></nav>" +
      '<a class="entete__tel" href="' + telHref + '">' +
      '<span class="entete__tel-libelle">Appelez-nous</span>' +
      '<span class="entete__tel-numero">' + esc(S.telephone) + "</span></a>" +
      '<a class="bouton entete__appeler" href="' + telHref + '" aria-label="Appeler le ' + esc(S.telephone) + '">Appeler</a>' +
      '<button class="entete__menu" type="button" aria-expanded="false" aria-controls="menu">Menu</button>' +
      "</div>" +
      '<div class="menu" id="menu" hidden><div class="conteneur">' +
      '<nav aria-label="Navigation mobile"><ul>' + liensPages() + "</ul></nav>" +
      "<p>" + esc(S.horaires.texte) + ".</p>" +
      "</div></div>";

    var boutonMenu = entete.querySelector(".entete__menu");
    var menu = entete.querySelector("#menu");

    function fermerMenu(rendreFocus) {
      menu.hidden = true;
      menu.classList.remove("est-ouvert");
      boutonMenu.setAttribute("aria-expanded", "false");
      boutonMenu.textContent = "Menu";
      if (rendreFocus) boutonMenu.focus();
    }

    boutonMenu.addEventListener("click", function () {
      if (menu.hidden) {
        menu.hidden = false;
        menu.classList.add("est-ouvert");
        boutonMenu.setAttribute("aria-expanded", "true");
        boutonMenu.textContent = "Fermer";
      } else {
        fermerMenu(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) fermerMenu(true);
    });

    window.matchMedia("(min-width: 1000px)").addEventListener("change", function (e) {
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
      '<p class="pied__marque">' + esc(S.nom) + "</p>" +
      "<p>Réparer, entretenir, rénover, aménager.<br>Pour la maison, autour de l'étang de Thau.</p>" +
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
      "<p class=\"pied__villes\">" + villesHTML() + "</p>" +
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

  /* ---------- Badge maquette & bouton d'appel flottant ---------- */

  if (S.maquette) {
    var badge = document.createElement("div");
    badge.className = "badge-maquette";
    badge.textContent = "Maquette réalisée par " + S.agence.nom;
    document.body.appendChild(badge);
  }

  var flottant = document.createElement("a");
  flottant.className = "bouton appel-flottant";
  flottant.href = telHref;
  flottant.textContent = "Appeler";
  flottant.setAttribute("aria-label", "Appeler le " + S.telephone);
  document.body.appendChild(flottant);

  if (entete && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entrees) {
      flottant.classList.toggle("est-visible", !entrees[0].isIntersecting);
    }).observe(entete);
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

  document.querySelectorAll("[data-villes]").forEach(function (el) {
    el.innerHTML = villesHTML();
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

  document.querySelectorAll("[data-annee]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
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
  var ligneAutre = bon.querySelector(".ligne--autre");
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
      ? (noms.length === 1 ? "1 photo jointe\u00a0: " : noms.length + " photos jointes\u00a0: ") + noms.join(", ")
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
          : "Cochez au moins une case, même «\u202fAutre\u202f».";
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
    var valeur = regle.groupe ? "" : regle.el.value;
    var message = regle.test(valeur);
    if (message) poserErreur(regle.el, message);
    else effacerErreur(regle.el);
    return message;
  }

  regles.forEach(function (regle) {
    var cible = regle.el;
    var evt = regle.groupe || regle.el.tagName === "SELECT" ? "change" : "input";
    cible.addEventListener(evt, function () {
      if (essaye) verifier(regle);
    });
    if (!regle.groupe) {
      cible.addEventListener("blur", function () {
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
    champs.setAttribute("aria-disabled", "true");
    confirmation.innerHTML =
      "<strong>Votre demande est bien envoyée" + (prenom ? ", " + esc(prenom) : "") + ".</strong>" +
      "<p>On vous rappelle dans la journée au " + esc(form.elements.telephone.value.trim()) + ". " +
      'C\'est urgent\u202f? Appelez-nous au <a href="' + telHref + '">' + esc(S.telephone) + "</a>.</p>";
    confirmation.setAttribute("tabindex", "-1");
    confirmation.focus({ preventScroll: true });
    confirmation.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "center" });
  });
})();
