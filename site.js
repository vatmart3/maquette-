/*
 * ARVÉO — script commun (sans dépendance).
 * Menu, visite de la toiture (accueil), formulaires (dépannage, devis,
 * rendez-vous, rappel, contact) envoyés à /api/demande, mesure des actions.
 */
(function () {
  "use strict";

  var S = window.SITE || {};
  var html = document.documentElement;
  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var telHref = (function () {
    var c = String(S.telephone || "").replace(/\D/g, "");
    return "tel:" + (c.indexOf("33") === 0 ? "+" + c : "+33" + c.replace(/^0/, ""));
  })();

  /* ---------- Mesure (prête pour l'analytics) ---------- */

  window.dataLayer = window.dataLayer || [];
  function mesurer(nom, details) {
    var ev = { event: "arv_" + String(nom).replace(/-/g, "_"), page: location.pathname };
    if (details) for (var k in details) ev[k] = details[k];
    window.dataLayer.push(ev);
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-track]");
    if (a && a.tagName !== "FORM") mesurer(a.getAttribute("data-track"));
  });

  /* ---------- Menu mobile ---------- */

  var boutonMenu = document.querySelector(".entete__menu");
  var menu = document.getElementById("menu");
  if (boutonMenu && menu) {
    var fermer = function (focus) {
      menu.hidden = true;
      menu.classList.remove("est-ouvert");
      boutonMenu.setAttribute("aria-expanded", "false");
      if (focus) boutonMenu.focus();
    };
    boutonMenu.addEventListener("click", function () {
      if (menu.hidden) {
        menu.hidden = false;
        menu.classList.add("est-ouvert");
        boutonMenu.setAttribute("aria-expanded", "true");
      } else fermer(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) fermer(true);
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (e) {
      if (e.matches) fermer(false);
    });
  }

  /* ---------- Dates ---------- */

  var aujourdhui = new Date();
  var aujourdhuiIso = new Date(aujourdhui.getTime() - aujourdhui.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  document.querySelectorAll("[data-date]").forEach(function (el) {
    el.textContent = aujourdhui.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  });
  document.querySelectorAll("[data-date-rdv]").forEach(function (el) {
    el.min = aujourdhuiIso;
  });

  /* ---------- Scène 3D : image de secours si elle n'arrive pas ---------- */

  var scene = document.querySelector("[data-scene]");
  if (scene) {
    setTimeout(function () {
      if (!scene.classList.contains("scene--prete") && !scene.classList.contains("scene--svg")) {
        scene.classList.add("scene--svg");
        scene.style.opacity = "1";
        scene.innerHTML = '<img src="/img/toiture.svg" alt="">';
        html.classList.remove("intro");
      }
    }, 7000);
  }

  /* ---------- Visite de la toiture (accueil) ---------- */

  var visite = document.querySelector("[data-visite]");
  if (visite) {
    var fiches = visite.querySelectorAll(".fiche");
    var reperes = visite.querySelectorAll(".visite__reperes button");
    var collant = visite.querySelector(".visite__collant");
    var fil = visite.querySelector(".visite__fil");
    var filLigne = fil && fil.querySelector("line");
    var filPoint = fil && fil.querySelector("circle");
    var n = fiches.length;
    var zone = -1;

    var activer = function (i) {
      if (i === zone) return;
      zone = i;
      fiches.forEach(function (f, k) { f.classList.toggle("est-active", k === i); });
      reperes.forEach(function (r, k) { r.setAttribute("aria-current", k === i ? "true" : "false"); });
      if (fil) fil.setAttribute("hidden", "");
      document.dispatchEvent(new CustomEvent("arv:zone", { detail: { zone: i } }));
    };

    var depuisScroll = function () {
      var course = visite.offsetHeight - window.innerHeight;
      var p = (window.scrollY - visite.offsetTop) / Math.max(1, course);
      activer(p < -0.02 || p > 1 ? -1 : Math.min(n - 1, Math.max(0, Math.floor(p * n))));
    };
    window.addEventListener("scroll", depuisScroll, { passive: true });
    window.addEventListener("resize", depuisScroll);
    depuisScroll();

    reperes.forEach(function (r, k) {
      r.addEventListener("click", function () {
        var course = visite.offsetHeight - window.innerHeight;
        window.scrollTo({ top: visite.offsetTop + course * ((k + 0.5) / n), behavior: reduit ? "auto" : "smooth" });
      });
    });

    document.addEventListener("arv:ancre", function (e) {
      if (!fil || zone < 0 || e.detail.zone !== zone) return;
      var oeillet = fiches[zone].querySelector(".fiche__oeillet");
      var boite = collant.getBoundingClientRect();
      var o = oeillet.getBoundingClientRect();
      var x1 = o.left + o.width / 2 - boite.left, y1 = o.top + o.height / 2 - boite.top;
      var x2 = e.detail.x - boite.left, y2 = e.detail.y - boite.top;
      filLigne.setAttribute("x1", x1); filLigne.setAttribute("y1", y1);
      filLigne.setAttribute("x2", x2); filLigne.setAttribute("y2", y2);
      filPoint.setAttribute("cx", x2); filPoint.setAttribute("cy", y2);
      fil.removeAttribute("hidden");
    });
  }

  /* ---------- Pré-remplissage depuis l'URL (?travaux=…) ---------- */

  var params = new URLSearchParams(location.search);
  if (params.get("travaux")) {
    document.querySelectorAll('input[name="travaux"]').forEach(function (c) {
      if (c.value === params.get("travaux")) c.checked = true;
    });
  }

  /* ---------- Formulaires ---------- */

  var REGEX_TEL = /^(?:\+33|0033|0)[1-9]\d{8}$/;
  var REGEX_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var TYPES = {
    depannage: "demande de dépannage",
    devis: "demande de devis",
    rdv: "demande de rendez-vous",
    rappel: "demande de rappel",
    contact: "message",
  };

  function zoneErreur(el) {
    var ids = (el.getAttribute("aria-describedby") || "").split(" ");
    for (var i = 0; i < ids.length; i++) if (/-erreur$/.test(ids[i])) return document.getElementById(ids[i]);
    return null;
  }
  function poser(el, message) {
    el.setAttribute("aria-invalid", "true");
    var z = zoneErreur(el);
    if (z) z.textContent = message;
  }
  function effacer(el) {
    el.removeAttribute("aria-invalid");
    var z = zoneErreur(el);
    if (z) z.textContent = "";
  }

  function verifierControle(el) {
    if (el.type === "checkbox") {
      if (el.required && !el.checked) return el.getAttribute("data-message") || "Cochez cette case.";
      return "";
    }
    var v = (el.value || "").trim();
    if (el.required && !v) return el.getAttribute("data-message") || "Ce champ est nécessaire.";
    if (!v) return "";
    if (el.type === "tel" && !REGEX_TEL.test(v.replace(/[\s.\-()]/g, ""))) return "Ce numéro semble incomplet. Il faut 10 chiffres, par exemple 06 12 34 56 78.";
    if (el.type === "email" && !REGEX_MAIL.test(v)) return "Cette adresse e-mail semble incomplète.";
    if (el.name === "code_postal" && !/^\d{5}$/.test(v)) return "Le code postal doit compter 5 chiffres.";
    if (el.hasAttribute("data-date-rdv")) {
      if (v < aujourdhuiIso) return "Choisissez une date à venir.";
      if (new Date(v + "T12:00:00").getDay() === 0) return "Nous ne travaillons pas le dimanche, choisissez un autre jour.";
    }
    return "";
  }

  function verifierGroupe(g) {
    if (!g.hasAttribute("data-requis")) return "";
    return g.querySelector("input:checked") ? "" : g.getAttribute("data-requis");
  }

  function texteLabel(el) {
    var t = el.cloneNode(true);
    t.querySelectorAll(".requis, .facultatif").forEach(function (x) { x.remove(); });
    return t.textContent.replace(/\s+/g, " ").trim();
  }

  // Liste ordonnée des réponses, rangées par rubrique, pour l'e-mail.
  function collecter(form) {
    var lignes = [];
    var donnees = {};
    form.querySelectorAll(".champ, .groupe").forEach(function (bloc) {
      if (bloc.classList.contains("fichier")) return;
      var section = "";
      var b = bloc.closest(".bloc");
      if (b) section = texteLabel(b.querySelector(".bloc__titre")).replace(/^\d+\s*/, "");
      if (bloc.classList.contains("groupe")) {
        var coches = Array.prototype.map.call(bloc.querySelectorAll("input:checked"), function (c) { return c.value; });
        var nom = bloc.querySelector("input") && bloc.querySelector("input").name;
        if (nom) donnees[nom] = coches.join(", ");
        lignes.push({ section: section, label: texteLabel(bloc.querySelector("legend")), valeur: coches.join(", ") });
      } else {
        var c = bloc.querySelector("input, select, textarea");
        var l = bloc.querySelector("label");
        if (!c || !l) return;
        var v = (c.value || "").trim();
        if (c.type === "date" && v) v = new Date(v + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        donnees[c.name] = v;
        lignes.push({ section: section, label: texteLabel(l), valeur: v });
      }
    });
    var ctx = form.querySelector('input[name="contexte"]');
    if (ctx) donnees.contexte = ctx.value;
    return { lignes: lignes, donnees: donnees };
  }

  // Photos : réduites à 1600 px en JPEG avant l'envoi (limite d'envoi ~4 Mo).
  function preparerPhotos(input) {
    if (!input || !input.files || !input.files.length) return Promise.resolve([]);
    var fichiers = Array.prototype.slice.call(input.files, 0, 4).filter(function (f) { return /^image\//.test(f.type); });
    return Promise.all(
      fichiers.map(function (f) {
        return new Promise(function (ok) {
          var img = new Image();
          var url = URL.createObjectURL(f);
          img.onload = function () {
            var max = 1600, w = img.naturalWidth, h = img.naturalHeight;
            var k = Math.min(1, max / Math.max(w, h));
            var c = document.createElement("canvas");
            c.width = Math.round(w * k);
            c.height = Math.round(h * k);
            c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
            URL.revokeObjectURL(url);
            var data = c.toDataURL("image/jpeg", 0.78).split(",")[1];
            ok({ nom: f.name.replace(/\.[^.]+$/, "") + ".jpg", type: "image/jpeg", contenu: data });
          };
          img.onerror = function () { URL.revokeObjectURL(url); ok(null); };
          img.src = url;
        });
      })
    ).then(function (liste) {
      var total = 0;
      return liste.filter(function (p) {
        if (!p) return false;
        total += p.contenu.length;
        return total < 3600000;
      });
    });
  }

  function mailtoSecours(type, lignes) {
    var corps = lignes.filter(function (l) { return l.valeur; }).map(function (l) { return l.label + " : " + l.valeur; }).join("\n");
    return "mailto:" + encodeURIComponent(S.email || "") + "?subject=" + encodeURIComponent("Site web : " + (TYPES[type] || "demande")) + "&body=" + encodeURIComponent(corps.slice(0, 1800));
  }

  document.querySelectorAll("form[data-formulaire]").forEach(function (form) {
    var type = form.getAttribute("data-formulaire");
    var retour = form.querySelector(".formulaire__retour");
    var essaye = false;
    var debut = Date.now();

    var controles = form.querySelectorAll("input:not([type=hidden]):not([type=file]):not([name=site_web]), select, textarea");
    var groupes = form.querySelectorAll(".groupe");

    controles.forEach(function (el) {
      if (el.closest(".groupe")) return;
      el.addEventListener(el.tagName === "SELECT" || el.type === "checkbox" || el.type === "date" ? "change" : "input", function () {
        if (!essaye) return;
        var m = verifierControle(el);
        if (m) poser(el, m); else effacer(el);
      });
    });
    groupes.forEach(function (g) {
      g.addEventListener("change", function () {
        if (!essaye) return;
        var m = verifierGroupe(g);
        if (m) poser(g, m); else effacer(g);
      });
    });

    var photos = form.querySelector("[data-photos]");
    if (photos) {
      var liste = form.querySelector(".fichier__liste");
      photos.addEventListener("change", function () {
        var noms = Array.prototype.map.call(photos.files, function (f) { return f.name; });
        if (noms.length > 4) noms = noms.slice(0, 4).concat(["(4 photos maximum, les suivantes ne seront pas envoyées)"]);
        liste.textContent = noms.length ? noms.join(", ") : "";
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      essaye = true;
      var premiere = null;
      controles.forEach(function (el) {
        if (el.closest(".groupe")) return;
        var m = verifierControle(el);
        if (m) { poser(el, m); if (!premiere) premiere = el; } else effacer(el);
      });
      groupes.forEach(function (g) {
        var m = verifierGroupe(g);
        if (m) { poser(g, m); if (!premiere) premiere = g.querySelector("input"); } else effacer(g);
      });
      if (premiere) { premiere.focus(); return; }

      var collecte = collecter(form);
      form.classList.add("est-envoi");
      retour.className = "formulaire__retour";
      retour.innerHTML = "<p>Envoi en cours…</p>";

      preparerPhotos(photos)
        .then(function (images) {
          return fetch("/api/demande", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: type,
              page: location.pathname,
              date: aujourdhui.toLocaleDateString("fr-FR"),
              lignes: collecte.lignes,
              donnees: collecte.donnees,
              photos: images,
              site_web: (form.querySelector('[name="site_web"]') || {}).value || "",
              duree: Date.now() - debut,
            }),
          });
        })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) {
            if (!r.ok || !j.ok) throw new Error(j.erreur || "Envoi impossible");
            return j;
          });
        })
        .then(function (j) {
          form.classList.remove("est-envoi");
          form.classList.add("est-envoye");
          retour.className = "formulaire__retour est-ok";
          var tel = collecte.donnees.telephone ? " au " + esc(collecte.donnees.telephone) : "";
          retour.innerHTML =
            "<strong>" + (type === "rappel" ? "C'est noté, on vous rappelle." : "Votre " + TYPES[type] + " est bien envoyée.") + "</strong>" +
            (j.reference ? '<p>Référence : <span class="mono">' + esc(j.reference) + "</span></p>" : "") +
            "<p>On vous rappelle dans la journée" + tel + ".</p>" +
            (type === "depannage" ? '<p>Fuite active ? Appelez sans attendre : <a class="mono" href="' + telHref + '">' + esc(S.telephone) + "</a></p>" : "");
          retour.focus({ preventScroll: true });
          retour.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "center" });
          mesurer("form-submit", { formulaire: type });
        })
        .catch(function () {
          form.classList.remove("est-envoi");
          retour.className = "formulaire__retour est-erreur";
          retour.innerHTML =
            "<strong>L'envoi n'a pas fonctionné.</strong>" +
            '<p>Appelez-nous au <a class="mono" href="' + telHref + '">' + esc(S.telephone) + "</a>, ou " +
            '<a href="' + mailtoSecours(type, collecte.lignes) + '">envoyez votre demande par e-mail</a> (elle est déjà rédigée).</p>';
          retour.focus({ preventScroll: true });
          mesurer("form-erreur", { formulaire: type });
        });
    });
  });
})();
