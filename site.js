/*
 * Couvreur Proximité 34 — script commun (sans dépendance).
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
    // Événements personnalisés pour Plausible ou Umami s'ils sont activés dans config.js.
    try {
      if (window.plausible) window.plausible(ev.event, { props: details || {} });
      if (window.umami && window.umami.track) window.umami.track(ev.event, details || {});
    } catch (e) {}
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

  /* ---------- Téléphone : pied de page et familles de services repliés ---------- */

  var petitEcran = window.matchMedia("(max-width: 859px)");
  if (petitEcran.matches) {
    document.querySelectorAll(".pied__groupe, .famille").forEach(function (d) { d.removeAttribute("open"); });
  }
  // Ordinateur : les familles de services restent toujours dépliées.
  petitEcran.addEventListener("change", function (e) {
    if (!e.matches) document.querySelectorAll(".famille").forEach(function (d) { d.setAttribute("open", ""); });
  });

  /* ---------- Léger fondu des blocs situés plus bas dans la page ---------- */

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var aVoir = [].filter.call(document.querySelectorAll("main .section, main .cta-final"), function (el) {
      return el.getBoundingClientRect().top > window.innerHeight; // ce qui est déjà à l'écran reste tel quel
    });
    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("est-vu"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    aVoir.forEach(function (el) { el.classList.add("apparait"); io.observe(el); });
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

  /* ---------- Accueil : comparaison avant / après ---------- */

  document.querySelectorAll("[data-avant-apres]").forEach(function (fig) {
    var curseur = fig.querySelector(".avant-apres__curseur");
    if (!curseur) return;
    // ordinateur : la barre démarre à droite du panneau des interventions, sur la zone visée
    if (fig.closest(".immersion") && window.matchMedia("(min-width: 860px)").matches) curseur.value = 64;
    var maj = function () { fig.style.setProperty("--pos", curseur.value + "%"); };
    curseur.addEventListener("input", maj);
    maj();
  });

  /* ---------- Accueil : la maison, puis les 5 interventions ---------- */
  // La section reste à l'écran. Le défilement fait avancer un parcours de 0 à 1 :
  //   0 → 0,07 : accroche (la maison à côté du titre) ;
  //   0,07 → 0,93 : la caméra passe d'une vue à l'autre en suivant le doigt, une intervention
  //   par vue (déplacement sur les 45 premiers pourcents de chaque portion, puis arrêt) ;
  //   0,93 → 1 : fin de la visite, la maison revient en perspective avant de quitter l'écran.
  // Avec une puce graphique, immersion.js affiche la maison en 3D (événement arv:avance) ;
  // sinon, l'image de la maison reste affichée et seules les fiches changent.

  var visite = document.querySelector("[data-visite]");
  if (visite) {
    var fiches = visite.querySelectorAll(".fiche");
    var reperes = visite.querySelectorAll(".visite__reperes button");
    var figure = visite.querySelector("[data-avant-apres]");
    var curseurAA = visite.querySelector(".avant-apres__curseur");
    var collant = visite.querySelector(".immersion__collant");
    var n = fiches.length;
    var DEBUT_ZONES = 0.07, FIN_ZONES = 0.93;
    var zone = null, phase = null;

    var zoneDe = function (p) {
      if (p < DEBUT_ZONES || p >= FIN_ZONES) return -1;
      return Math.min(n - 1, Math.floor(((p - DEBUT_ZONES) / (FIN_ZONES - DEBUT_ZONES)) * n));
    };

    var majFiches = function (k) {
      if (k === zone) return;
      zone = k;
      var f = Math.max(0, k);
      fiches.forEach(function (el, i) { el.classList.toggle("est-active", i === f); });
      reperes.forEach(function (b, i) { b.setAttribute("aria-current", i === k ? "true" : "false"); });
      document.dispatchEvent(new CustomEvent("arv:zone", { detail: { zone: k } }));
    };
    // Démonstration avant / après : à chaque intervention, la barre glisse vers la droite puis la
    // gauche avant de revenir, tant que le visiteur ne l'a pas prise en main.
    var touche = false, balayage = 0, balayee = -1;
    if (curseurAA) ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
      curseurAA.addEventListener(ev, function () { touche = true; cancelAnimationFrame(balayage); }, { passive: true });
    });
    var balayer = function () {
      if (!curseurAA || touche || reduit || !(figure && figure.classList.contains("est-3d"))) return;
      cancelAnimationFrame(balayage);
      var depart = Number(curseurAA.value), t0 = 0, DUREE = 2200;
      var pas = function (t) {
        if (!t0) t0 = t;
        var u = Math.min(1, (t - t0) / DUREE);
        // repos, glisse vers 88 %, puis vers 14 %, retour au point de départ
        var v = u < 0.15 ? depart : u < 0.45 ? depart + (88 - depart) * lisse((u - 0.15) / 0.3) : u < 0.8 ? 88 + (14 - 88) * lisse((u - 0.45) / 0.35) : 14 + (depart - 14) * lisse((u - 0.8) / 0.2);
        curseurAA.value = String(Math.round(v * 10) / 10);
        curseurAA.dispatchEvent(new Event("input"));
        if (u < 1) balayage = requestAnimationFrame(pas);
      };
      balayage = requestAnimationFrame(pas);
    };
    var lisse = function (x) { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

    // hauteur du panneau des interventions (téléphone : la poignée de la barre se place au-dessus)
    var panneau = visite.querySelector(".immersion__visite");
    var majPanneau = function () { if (panneau) collant.style.setProperty("--panneau", panneau.offsetHeight + "px"); };
    if (panneau && "ResizeObserver" in window) new ResizeObserver(majPanneau).observe(panneau);
    majPanneau();

    var majPhase = function (p) {
      // logo flottant masqué tant que la section occupe l'écran (il recouvrait le panneau)
      document.documentElement.classList.toggle("immersion-active", p < 0.995);
      var ph = p < DEBUT_ZONES ? "accroche" : p < FIN_ZONES ? "visite" : "fin";
      if (ph === phase) return;
      phase = ph;
      visite.setAttribute("data-phase", ph);
      if (curseurAA) curseurAA.tabIndex = ph === "visite" ? 0 : -1;
      if (ph !== "visite") cancelAnimationFrame(balayage);
    };

    var mesure = null;
    var position = function () {
      if (!mesure) {
        var haut = parseFloat(getComputedStyle(collant).top) || 0;
        mesure = { debut: visite.offsetTop - haut, course: Math.max(1, visite.offsetHeight - collant.offsetHeight) };
      }
      return mesure;
    };
    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(function () { mesure = null; });
      ro.observe(visite);
      ro.observe(document.body);
    }
    var depuisScroll = function () {
      var q = position();
      var p = Math.min(1, Math.max(0, (window.scrollY - q.debut) / q.course));
      majPhase(p);
      var k = zoneDe(p);
      majFiches(k);
      // démonstration avant / après une fois la caméra arrivée sur l'intervention
      if (k >= 0) {
        var local = ((p - DEBUT_ZONES) / (FIN_ZONES - DEBUT_ZONES)) * n - k;
        if (local >= 0.5 && balayee !== k) { balayee = k; balayer(); }
      }
      document.dispatchEvent(new CustomEvent("arv:avance", { detail: { p: p, zone: k } }));
    };
    var attente = false;
    window.addEventListener("scroll", function () {
      if (attente) return;
      attente = true;
      requestAnimationFrame(function () { attente = false; depuisScroll(); });
    }, { passive: true });
    window.addEventListener("resize", function () { mesure = null; depuisScroll(); });
    document.addEventListener("arv:pret", depuisScroll);
    depuisScroll();

    reperes.forEach(function (r, k) {
      r.addEventListener("click", function () {
        var q = position();
        var cible = DEBUT_ZONES + ((k + 0.5) / n) * (FIN_ZONES - DEBUT_ZONES);
        window.scrollTo({ top: q.debut + q.course * cible, behavior: reduit ? "auto" : "smooth" });
      });
    });

    // Maison 3D : seulement avec une vraie puce graphique (sans elle, rendu logiciel trop lent).
    var source3d = figure && figure.getAttribute("data-immersion");
    var puce = function () {
      try {
        var gl = document.createElement("canvas").getContext("webgl");
        if (!gl) return false;
        var ext = gl.getExtension("WEBGL_debug_renderer_info");
        var nom = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
        var perte = gl.getExtension("WEBGL_lose_context");
        if (perte) perte.loseContext();
        return !/swiftshader|llvmpipe|softpipe|software/i.test(nom);
      } catch (e) { return false; }
    };
    if (source3d && HTMLScriptElement.supports && HTMLScriptElement.supports("importmap") && puce()) {
      var charger = function () { try { new Function("u", "return import(u)")(source3d).catch(function () {}); } catch (e) {} };
      var ensuite = function () { (window.requestIdleCallback || setTimeout)(charger, { timeout: 800 }); };
      if (document.readyState === "complete") ensuite();
      else window.addEventListener("load", ensuite, { once: true });
    }
  }

  /* ---------- Filtres des réalisations ---------- */

  var filtres = document.querySelector("[data-filtres]");
  if (filtres) {
    var cartes = document.querySelectorAll(".chantiers li");
    var compte = filtres.querySelector("[data-compte]");
    var filtrer = function () {
      var choix = {};
      filtres.querySelectorAll("[data-filtre]").forEach(function (s) { choix[s.getAttribute("data-filtre")] = s.value; });
      var n = 0;
      cartes.forEach(function (li) {
        var ok = (!choix.service || li.dataset.service === choix.service) && (!choix.commune || li.dataset.commune === choix.commune);
        li.hidden = !ok;
        if (ok) n++;
      });
      if (compte) compte.textContent = n + (n > 1 ? " chantiers" : " chantier");
    };
    filtres.addEventListener("change", filtrer);
    filtres.addEventListener("submit", function (e) { e.preventDefault(); });
    filtrer();
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
          var tel = collecte.donnees.telephone ? ", au numéro que vous nous avez indiqué : <strong class=\"mono\">" + esc(collecte.donnees.telephone) + "</strong>" : "";
          retour.innerHTML =
            "<strong>" + (type === "rappel" ? "C'est noté, on vous rappelle." : "Votre " + TYPES[type] + " est bien envoyée.") + "</strong>" +
            (j.reference ? '<p>Référence <span class="mono">' + esc(j.reference) + "</span></p>" : "") +
            "<p>On vous rappelle dans la journée" + tel + ".</p>" +
            (type === "depannage" ? '<p>Fuite active, appelez sans attendre le <a class="mono" href="' + telHref + '">' + esc(S.telephone) + "</a></p>" : "") +
            '<p class="formulaire__avis">Après l\'intervention, votre avis sur Google aidera beaucoup notre petite entreprise. <a href="/avis/laisser">Laisser un avis</a></p>';
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
