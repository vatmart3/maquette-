/*
 * Multiservice Thau — script commun (sans dépendance).
 * Génère l'en-tête, la barre d'actions mobile, le pied de page et les infos de
 * contact à partir de config.js ; gère le menu, la visite de la maison, la FAQ,
 * le mini bon de l'accueil et le bon d'intervention en 3 étapes (contact).
 * La scène 3D (scene.js) arrive en plus : le site fonctionne sans elle.
 */
(function () {
  "use strict";

  var S = window.SITE;
  if (!S) return;

  var html = document.documentElement;
  var page = document.body.getAttribute("data-page") || "";
  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mqMobile = window.matchMedia("(max-width: 859px)");

  /* ---------- Outils ---------- */

  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

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
  var waHref = "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(S.whatsappMessage || "");

  var ICONES = {
    tel: "M6.6 3.5h2.6l1.6 4.2-2.1 1.5a11.5 11.5 0 0 0 6.1 6.1l1.5-2.1 4.2 1.6v2.6a2 2 0 0 1-2.1 2A16.6 16.6 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1z",
    devis: "M7 3h7l4.5 4.5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M14 3v4.5h4.5 M8.5 12.5h7 M8.5 16h5",
    photo: "M4.5 7.5h3l1.5-2.5h6l1.5 2.5h3a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V9a1.5 1.5 0 0 1 1.5-1.5z M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
    coche: "M5 12.5l4.5 4.5L19 7.5",
  };

  function ico(nom) {
    return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + ICONES[nom] + '"/></svg>';
  }

  function villesHTML() {
    return S.villes
      .map(function (v, i) {
        return "<span>" + esc(v) + (i === S.villes.length - 1 ? "." : ",") + "</span>";
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
        return '<li><a href="' + p.href + '"' + (p.id === page ? ' aria-current="page"' : "") + ">" + p.texte + "</a></li>";
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
      '<a class="entete__tel" href="' + telHref + '" data-track="call"><small>Appelez-nous</small><strong>' + esc(S.telephone) + "</strong></a>" +
      '<button class="entete__menu" type="button" aria-expanded="false" aria-controls="menu">Menu</button>' +
      "</div>" +
      '<div class="menu" id="menu" hidden><div class="conteneur">' +
      '<nav aria-label="Navigation mobile"><ul>' + liensPages() + "</ul></nav>" +
      "<p>" + esc(S.horaires.texte) + ".</p>" +
      "</div></div>";

    var boutonMenu = entete.querySelector(".entete__menu");
    var menu = entete.querySelector("#menu");

    var fermerMenu = function (rendreFocus) {
      menu.hidden = true;
      menu.classList.remove("est-ouvert");
      boutonMenu.setAttribute("aria-expanded", "false");
      boutonMenu.textContent = "Menu";
      if (rendreFocus) boutonMenu.focus();
    };

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

    var majEntete = function () {
      entete.classList.toggle("est-defile", window.scrollY > 8);
    };
    window.addEventListener("scroll", majEntete, { passive: true });
    majEntete();
  }

  /* ---------- Barre d'actions mobile ---------- */

  var barre = document.createElement("nav");
  barre.className = "barre-actions";
  barre.setAttribute("aria-label", "Nous contacter");
  barre.innerHTML =
    '<a href="' + telHref + '" data-track="call">' + ico("tel") + "Appeler</a>" +
    '<a href="contact" data-track="devis">' + ico("devis") + "Devis gratuit</a>" +
    '<a href="' + waHref + '" data-track="whatsapp" target="_blank" rel="noopener">' + ico("photo") + "Photo WhatsApp</a>";
  document.body.appendChild(barre);

  /* ---------- Pied de page ---------- */

  var pied = document.querySelector("[data-slot='pied']");
  if (pied) {
    pied.innerHTML =
      '<div class="conteneur">' +
      '<div class="pied__grille">' +
      "<div>" +
      '<p class="pied__marque">' + esc(S.nom) + "</p>" +
      "<p>On s'occupe de votre maison, dedans comme dehors, autour de l'étang de Thau.</p>" +
      "<p>" + esc(S.confiance.decennale) + ". " + esc(S.confiance.experience) + ".</p>" +
      "</div>" +
      "<div>" +
      "<h2>Nous joindre</h2>" +
      "<ul>" +
      '<li><a class="pied__tel" href="' + telHref + '" data-track="call">' + esc(S.telephone) + "</a></li>" +
      '<li><a href="' + waHref + '" data-track="whatsapp" target="_blank" rel="noopener">Envoyer une photo sur WhatsApp</a></li>' +
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

  /* ---------- Badge maquette ---------- */

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

  document.querySelectorAll("[data-confiance]").forEach(function (el) {
    var cle = el.getAttribute("data-confiance");
    if (S.confiance[cle]) el.textContent = S.confiance[cle];
  });

  document.querySelectorAll("[data-href]").forEach(function (el) {
    var type = el.getAttribute("data-href");
    if (type === "tel") el.href = telHref;
    if (type === "mail") el.href = mailHref;
    if (type === "whatsapp") el.href = waHref;
    if (type === "avis-google") el.href = S.liens.avisGoogle;
  });

  document.querySelectorAll("[data-coches]").forEach(function (el) {
    var cles = (el.getAttribute("data-coches") || "devisGratuit reponse prixAvant").split(" ");
    el.innerHTML = cles
      .map(function (c) {
        return "<li>" + ico("coche") + esc(S.confiance[c]) + "</li>";
      })
      .join("");
  });

  document.querySelectorAll("[data-ico]").forEach(function (el) {
    el.outerHTML = ico(el.getAttribute("data-ico"));
  });

  document.querySelectorAll("[data-villes]").forEach(function (el) {
    el.innerHTML = villesHTML();
  });

  document.querySelectorAll("[data-villes-options]").forEach(function (el) {
    var h = "";
    S.villes.forEach(function (v) {
      h += '<option value="' + esc(v) + '">' + esc(v) + "</option>";
    });
    if (el.tagName === "SELECT") h += '<option value="Autre">Autre ville</option>';
    el.insertAdjacentHTML("beforeend", h);
  });

  var aujourdhui = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  document.querySelectorAll("[data-date]").forEach(function (el) {
    el.textContent = aujourdhui;
  });

  /* ---------- Mesure (prête pour l'analytics) ---------- */

  window.dataLayer = window.dataLayer || [];
  function mesurer(nom, details) {
    var ev = { event: "mst_" + nom.replace(/-/g, "_") };
    if (details) for (var k in details) ev[k] = details[k];
    window.dataLayer.push(ev);
  }
  document.addEventListener("click", function (e) {
    var cible = e.target.closest("a[data-track], button[data-track]");
    if (cible) mesurer(cible.getAttribute("data-track"), { page: page });
  });

  /* ---------- Données structurées ---------- */

  function jsonLd(objet) {
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(objet);
    document.head.appendChild(s);
  }

  jsonLd({
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
  });

  var faq = document.querySelectorAll(".faq details");
  if (faq.length) {
    jsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: Array.prototype.map.call(faq, function (d) {
        var reponse = d.querySelector(".faq__reponse p");
        return {
          "@type": "Question",
          name: d.querySelector("summary").textContent.trim(),
          acceptedAnswer: { "@type": "Answer", text: reponse ? reponse.textContent.trim() : "" },
        };
      }),
    });
  }

  /* ---------- Scène 3D : secours si elle n'arrive pas ---------- */

  var scene = document.querySelector("[data-scene]");
  if (scene) {
    setTimeout(function () {
      if (!scene.classList.contains("scene--prete") && !scene.classList.contains("scene--svg")) {
        scene.classList.add("scene--svg");
        scene.innerHTML = '<img src="img/maison.svg" alt="">';
        html.classList.remove("intro");
      }
    }, 7000);
  }

  /* ---------- Visite de la maison ---------- */

  var visite = document.querySelector("[data-visite]");
  if (visite) {
    var fiches = visite.querySelectorAll(".fiche");
    var reperes = visite.querySelectorAll(".visite__reperes button");
    var collant = visite.querySelector(".visite__collant");
    var fil = visite.querySelector(".visite__fil");
    var filLigne = fil && fil.querySelector("line");
    var filPoint = fil && fil.querySelector("circle");
    var zone = -1;

    var activer = function (i) {
      if (i === zone) return;
      zone = i;
      fiches.forEach(function (f, k) {
        f.classList.toggle("est-active", k === i);
      });
      reperes.forEach(function (r, k) {
        r.setAttribute("aria-current", k === i ? "true" : "false");
      });
      if (fil) fil.setAttribute("hidden", "");
      document.dispatchEvent(new CustomEvent("mst:zone", { detail: { zone: i } }));
    };

    var zoneDepuisScroll = function () {
      if (mqMobile.matches) return;
      var course = visite.offsetHeight - window.innerHeight;
      var p = (window.scrollY - visite.offsetTop) / Math.max(1, course);
      activer(p < -0.02 || p > 1.0 ? -1 : Math.min(3, Math.max(0, Math.floor(p * 4))));
    };

    window.addEventListener("scroll", zoneDepuisScroll, { passive: true });
    window.addEventListener("resize", zoneDepuisScroll);
    zoneDepuisScroll();

    // Mobile : la zone change quand chaque fiche entre à l'écran.
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entrees) {
          if (!mqMobile.matches) return;
          entrees.forEach(function (e) {
            if (e.isIntersecting) activer(Array.prototype.indexOf.call(fiches, e.target));
          });
        },
        { rootMargin: "-35% 0px -35% 0px" }
      );
      fiches.forEach(function (f) {
        io.observe(f);
      });
      new IntersectionObserver(function (entrees) {
        if (mqMobile.matches && !entrees[0].isIntersecting) activer(-1);
      }).observe(visite);
    }

    // Les repères : aller directement à une zone.
    reperes.forEach(function (r, k) {
      r.addEventListener("click", function () {
        var course = visite.offsetHeight - window.innerHeight;
        window.scrollTo({
          top: visite.offsetTop + course * ((k + 0.5) / 4),
          behavior: reduit ? "auto" : "smooth",
        });
      });
    });

    // Le fil jaune entre l'œillet de la fiche et la zone de la maison.
    document.addEventListener("mst:ancre", function (e) {
      if (!fil || mqMobile.matches || zone < 0 || e.detail.zone !== zone) return;
      var oeillet = fiches[zone].querySelector(".fiche__oeillet");
      var boite = collant.getBoundingClientRect();
      var o = oeillet.getBoundingClientRect();
      var x1 = o.left + o.width / 2 - boite.left;
      var y1 = o.top + o.height / 2 - boite.top;
      var x2 = e.detail.x - boite.left;
      var y2 = e.detail.y - boite.top;
      filLigne.setAttribute("x1", x1);
      filLigne.setAttribute("y1", y1);
      filLigne.setAttribute("x2", x2);
      filLigne.setAttribute("y2", y2);
      filPoint.setAttribute("cx", x2);
      filPoint.setAttribute("cy", y2);
      fil.removeAttribute("hidden");
    });
  }

  /* ---------- Bon d'intervention (contact) ---------- */

  var bon = document.querySelector("[data-bon]");
  if (!bon) return;

  var form = bon.querySelector("form");
  var etapes = bon.querySelectorAll(".etape-bon");
  var progression = bon.querySelectorAll(".progression li");
  var boutonSuivant = bon.querySelector("[data-suivant]");
  var boutonRetour = bon.querySelector("[data-retour]");
  var aide = bon.querySelector("[data-aide]");
  var selectVille = form.elements.ville;
  var ligneAutre = bon.querySelector(".ligne--autre");
  var confirmation = bon.querySelector(".bon__confirmation");
  var etapeCourante = 0;
  var essayees = [false, false, false];

  function majAutre() {
    var autre = selectVille.value === "Autre";
    ligneAutre.hidden = !autre;
    if (!autre) effacerErreur(form.elements.villeAutre);
  }
  selectVille.addEventListener("change", majAutre);

  // Pré-remplissage depuis le mini bon de l'accueil ou les fiches de la visite
  var params = new URLSearchParams(window.location.search);
  var repris = false;
  (params.get("type") || "").split(",").forEach(function (t) {
    var c = form.querySelector("input[name='besoin'][value='" + t.replace(/[^a-z]/g, "") + "']");
    if (c) {
      c.checked = true;
      repris = true;
    }
  });
  if (params.get("besoin")) {
    form.elements.description.value = params.get("besoin");
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

  // Photos choisies
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
    var id = (el.getAttribute("aria-describedby") || "").split(" ").filter(function (i) {
      return /-erreur$/.test(i);
    })[0];
    return id ? document.getElementById(id) : null;
  }

  function poserErreur(el, message) {
    el.setAttribute("aria-invalid", "true");
    var z = zoneErreur(el);
    if (z) z.textContent = message;
  }

  function effacerErreur(el) {
    el.removeAttribute("aria-invalid");
    var z = zoneErreur(el);
    if (z) z.textContent = "";
  }

  var regles = [
    [
      {
        el: bon.querySelector(".groupe-besoin"),
        groupe: true,
        test: function () {
          return form.querySelector("input[name='besoin']:checked") ? "" : "Cochez au moins une case, même « Autre ».";
        },
      },
      {
        el: form.elements.description,
        test: function (v) {
          return v.trim().length >= 5 ? "" : "Décrivez en quelques mots ce qu'il faut faire.";
        },
      },
    ],
    [
      {
        el: selectVille,
        test: function (v) {
          return v ? "" : "Choisissez votre ville dans la liste.";
        },
      },
      {
        el: form.elements.villeAutre,
        test: function (v) {
          return selectVille.value !== "Autre" || v.trim() ? "" : "Indiquez le nom de votre ville.";
        },
      },
      {
        el: bon.querySelector(".groupe-delai"),
        groupe: true,
        test: function () {
          return form.querySelector("input[name='delai']:checked") ? "" : "Choisissez un délai.";
        },
      },
    ],
    [
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
          if (!/^(?:\+33|0033|0)[1-9]\d{8}$/.test(t)) return "Ce numéro semble incomplet. Il faut 10 chiffres, par exemple 06 12 34 56 78.";
          return "";
        },
      },
      {
        el: form.elements.email,
        test: function (v) {
          if (!v.trim()) return "";
          return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Cette adresse e-mail semble incomplète. Vous pouvez aussi laisser ce champ vide.";
        },
      },
    ],
  ];

  function verifier(regle) {
    var message = regle.test(regle.groupe ? "" : regle.el.value);
    if (message) poserErreur(regle.el, message);
    else effacerErreur(regle.el);
    return message;
  }

  regles.forEach(function (liste, i) {
    liste.forEach(function (regle) {
      var evt = regle.groupe || regle.el.tagName === "SELECT" ? "change" : "input";
      regle.el.addEventListener(evt, function () {
        if (essayees[i]) verifier(regle);
      });
    });
  });

  function verifierEtape(i) {
    essayees[i] = true;
    var premiere = null;
    regles[i].forEach(function (r) {
      if (verifier(r) && !premiere) premiere = r;
    });
    if (premiere) (premiere.groupe ? premiere.el.querySelector("input") : premiere.el).focus();
    return !premiere;
  }

  function allerA(i, focus) {
    etapeCourante = i;
    etapes.forEach(function (e, k) {
      e.hidden = k !== i;
    });
    progression.forEach(function (li, k) {
      if (k === i) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
      li.classList.toggle("est-fait", k < i);
    });
    boutonRetour.hidden = i === 0;
    boutonSuivant.textContent = i === 2 ? "Envoyer ma demande" : "Continuer";
    aide.textContent = i === 2 ? "On vous rappelle dans la journée." : "Étape " + (i + 1) + " sur 3.";
    if (focus) {
      var titre = etapes[i].querySelector(".etape-bon__titre");
      titre.focus({ preventScroll: true });
      bon.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "start" });
    }
  }

  boutonRetour.addEventListener("click", function () {
    allerA(Math.max(0, etapeCourante - 1), true);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!verifierEtape(etapeCourante)) return;
    if (etapeCourante < 2) {
      allerA(etapeCourante + 1, true);
      return;
    }

    // Pas de back-end : on tamponne le bon.
    var prenom = form.elements.nom.value.trim().split(/\s+/)[0];
    bon.classList.add("est-envoye");
    etapes.forEach(function (e) {
      e.hidden = false;
      e.inert = true;
    });
    confirmation.innerHTML =
      "<strong>Votre demande est bien envoyée" + (prenom ? ", " + esc(prenom) : "") + ".</strong>" +
      "<p>On vous rappelle dans la journée au " + esc(form.elements.telephone.value.trim()) + ".</p>" +
      "<p>Pour aller plus vite, envoyez une photo du problème sur WhatsApp.</p>" +
      '<a class="bouton" href="' + waHref + '" data-track="whatsapp" target="_blank" rel="noopener">' + ico("photo") + "Envoyer une photo sur WhatsApp</a>";
    mesurer("form-submit", { page: page });
    confirmation.setAttribute("tabindex", "-1");
    confirmation.focus({ preventScroll: true });
    confirmation.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "center" });
  });

  allerA(0, false);
})();
