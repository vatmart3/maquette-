#!/usr/bin/env node
/*
 * ARVÉO — générateur du site statique.
 *   node scripts/build.mjs
 * Lit config.js et scripts/contenu.mjs, écrit toutes les pages HTML, le sitemap
 * et robots.txt à la racine du projet. Aucune dépendance.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { SERVICES, VILLES, FAQ_ACCUEIL, FAQ_DEPANNAGE } from "./contenu.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(RACINE, "config.js"), "utf8"), ctx);
const S = ctx.window.SITE;
if (process.env.ARVEO_PRODUCTION === "1") S.production = true; // test du mode production sans modifier config.js
const BASE = S.siteUrl.replace(/\/$/, "");
const AUJOURDHUI = new Date().toISOString().slice(0, 10);
const avertissements = [];

/* ------------------------------------------------------------------ */
/* Valeurs provisoires                                                 */
/* ------------------------------------------------------------------ */
// Une valeur est provisoire si sa ligne de config.js porte « // À CONFIRMER », ou si elle
// ressemble à un bouche-trou (XX, SIRET à zéro, numéro fictif ARCEP, texte d'exemple).
// Les valeurs provisoires ne sont jamais envoyées dans les données structurées.

const A_CONFIRMER = (() => {
  const cles = new Map();
  const pile = [];
  for (const ligne of fs.readFileSync(path.join(RACINE, "config.js"), "utf8").split("\n")) {
    const ouvre = ligne.match(/^\s*([\w$]+):\s*[[{]\s*(?:\/\/.*)?$/);
    if (ouvre) { pile.push(ouvre[1]); continue; }
    if (/^\s*[\]}],?\s*$/.test(ligne)) { pile.pop(); continue; }
    const m = ligne.match(/^\s*([\w$]+):.*\/\/\s*À CONFIRMER\s*:?\s*(.*)$/);
    if (m) cles.set([...pile, m[1]].filter((k) => k !== "SITE").join("."), m[2].trim());
  }
  return cles;
})();

const TEL_FICTIFS = /^0(199|26191|35301|46571|53649|63998|97510)/;
const BOUCHE_TROU = /XX|À CONFIRMER|000 000|Nom de l'assureur|Nom du dirigeant/;

const valeur = (chemin) => chemin.split(".").reduce((o, k) => (o == null ? o : o[k]), S);
function provisoire(chemin) {
  const v = valeur(chemin);
  if (A_CONFIRMER.has(chemin)) return true;
  if (v == null || v === "" || (Array.isArray(v) && !v.length)) return true;
  if (typeof v === "string" && BOUCHE_TROU.test(v)) return true;
  if (chemin === "telephone" && TEL_FICTIFS.test(v.replace(/\D/g, "").replace(/^33/, "0"))) return true;
  return false;
}
// Valeur sûre pour Google, ou undefined.
const fiable = (chemin) => (provisoire(chemin) ? undefined : valeur(chemin));

/* ------------------------------------------------------------------ */
/* Outils                                                              */
/* ------------------------------------------------------------------ */

const esc = (t) =>
  String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Typographie française : espaces fines insécables avant ; ? ! et à l'intérieur des guillemets.
const fr = (t) =>
  esc(t)
    .replace(/ ([?!;])/g, " $1")
    .replace(/ :/g, " :")
    .replace(/« /g, "« ")
    .replace(/ »/g, " »");

const slug = (t) =>
  String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Une valeur encore « à confirmer » ne doit pas apparaître sur le site public.
const confirme = (v) => (v && !/XX|À CONFIRMER|000 000/.test(v) ? v : "");

// NAP : un seul numéro, écrit au format national sur les pages et international dans le JSON-LD.
const TEL_CHIFFRES = (() => {
  const c = S.telephone.replace(/\D/g, "");
  return c.startsWith("33") ? "0" + c.slice(2) : c;
})();
const TEL_NATIONAL = TEL_CHIFFRES.replace(/(\d{2})(?=\d)/g, "$1 ");
const tel = "+33" + TEL_CHIFFRES.slice(1);
const TEL_INTERNATIONAL = `+33 ${TEL_CHIFFRES[1]} ${TEL_CHIFFRES.slice(2).match(/\d{2}/g).join(" ")}`;
S.telephone = TEL_NATIONAL;
const TEL = `tel:${tel}`;
const urlPage = (p) => BASE + (p === "/" ? "/" : p);

const VILLES_PAGES = VILLES.map((v) => ({ ...v, slug: slug(v.nom), path: `/couvreur/${slug(v.nom)}` }));
const SERVICES_PAGES = SERVICES.map((s) => ({ ...s, path: `/services/${s.slug}` }));

/* ------------------------------------------------------------------ */
/* Icônes (trait 1,75 px)                                              */
/* ------------------------------------------------------------------ */

const IC = {
  tel: "M6.6 3.5h2.6l1.6 4.2-2.1 1.5a11.5 11.5 0 0 0 6.1 6.1l1.5-2.1 4.2 1.6v2.6a2 2 0 0 1-2.1 2A16.6 16.6 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1z",
  alerte: "M12 4 2.8 19.5h18.4zM12 10v4.5M12 17.2v.1",
  devis: "M7 3h7l4.5 4.5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM14 3v4.5h4.5M8.5 12.5h7M8.5 16h5",
  agenda: "M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM8 3.5V8M16 3.5V8M4 10.5h16M8 14h2M12 14h2M8 17h2",
  coche: "M5 12.5l4.5 4.5L19 7.5",
  fleche: "M5 12h14M13 6l6 6-6 6",
  pin: "M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11zM12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z",
  horloge: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2",
  mail: "M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3.5 7l8.5 6 8.5-6",
  bouclier: "M12 3l7 3v5.5c0 4.4-3 8.1-7 9.5-4-1.4-7-5.1-7-9.5V6zM8.8 12.2l2.2 2.2 4.4-4.4",
  toit: "M2.5 12 12 4.5l9.5 7.5M5 10v9.5h14V10M9.5 19.5v-5h5v5",
  goutte: "M12 3.5s-6 6.6-6 10.6a6 6 0 0 0 12 0c0-4-6-10.6-6-10.6z",
  photo: "M4.5 7.5h3l1.5-2.5h6l1.5 2.5h3a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V9a1.5 1.5 0 0 1 1.5-1.5zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
  etoile: "M12 2.8l2.8 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.1l-5.7 3 1.2-6.3L2.9 9.4l6.3-.8z",
};
const ico = (n, cls = "ico") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${IC[n]}"/></svg>`;

/* ------------------------------------------------------------------ */
/* Morceaux communs                                                    */
/* ------------------------------------------------------------------ */

const NAV = [
  { id: "services", href: "/#services", texte: "Services" },
  { id: "depannage", href: "/depannage-toiture", texte: "Dépannage" },
  { id: "apropos", href: "/a-propos", texte: "À propos" },
  { id: "contact", href: "/contact", texte: "Contact" },
];
const avecAvis = S.avis.length > 0 || !!S.liens.googleBusiness;
if (avecAvis) NAV.splice(3, 0, { id: "avis", href: "/avis", texte: "Avis" });

function logo(clair = false) {
  return `<a class="logo${clair ? " logo--clair" : ""}" href="/">
        <img class="logo__marque" src="/img/arveo-mark.svg" alt="" width="68" height="36">
        <span class="logo__texte"><span class="logo__nom">${esc(S.nom)}</span><span class="logo__activite">Couvreur à ${esc(S.adresse.ville)} <span class="logo__suite">&amp; ses alentours</span></span></span>
      </a>`;
}

function head(p) {
  const ld = p.jsonld.map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n");
  const scene = p.scene
    ? `
  <script>try{if(!sessionStorage.getItem("arv-intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&matchMedia("(min-width: 860px)").matches){document.documentElement.classList.add("intro");setTimeout(function(){document.documentElement.classList.remove("intro")},4200)}}catch(e){}</script>
  <script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/"}}</script>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js" crossorigin media="(min-width: 860px)">`
    : "";
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(p.title)}</title>
  <meta name="description" content="${esc(p.description)}">
  ${p.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
  <link rel="canonical" href="${urlPage(p.path)}">
  <meta name="theme-color" content="#243746">
  <meta name="geo.region" content="FR-34">
  <meta name="geo.placename" content="${esc(S.adresse.ville)}">
  <meta name="geo.position" content="${S.adresse.latitude};${S.adresse.longitude}">
  <meta name="ICBM" content="${S.adresse.latitude}, ${S.adresse.longitude}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
  <link rel="preload" href="/fonts/manrope.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/styles.min.css">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:site_name" content="${esc(S.nom)}">
  <meta property="og:title" content="${esc(p.ogTitle || p.title)}">
  <meta property="og:description" content="${esc(p.description)}">
  <meta property="og:url" content="${urlPage(p.path)}">
  <meta property="og:image" content="${BASE}/og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="ARVÉO, couvreur à Frontignan : réparation, réfection et dépannage de toiture">
  <meta name="twitter:card" content="summary_large_image">${scene}
${ld}
  <script src="/config.js" defer></script>
  <script src="/site.js" defer></script>
</head>
<body data-page="${p.id}"${p.sombre ? ' class="page-sombre"' : ""}>
  <a class="evitement" href="#contenu">Aller au contenu</a>
${p.scene ? '  <div class="scene" data-scene aria-hidden="true"><picture><source media="(min-width: 860px)" srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><img class="scene__apercu" src="/img/toiture-mobile.webp" alt="" width="780" height="840" decoding="async"></picture></div>\n' : ""}${bandeauUrgence()}
${entete(p.id)}
  <main id="contenu">
`;
}

function bandeauUrgence() {
  return `  <div class="urgence">
    <div class="conteneur urgence__ligne">
      <p>${ico("alerte")}<span><strong>Urgence toiture</strong><span class="urgence__long">Fuite, tuiles arrachées, dégâts après intempéries</span></span></p>
      <p class="urgence__actions">
        <a href="/depannage-toiture" data-track="depannage">Dépannage en ligne</a>
      </p>
    </div>
  </div>`;
}

function entete(id) {
  const liens = NAV.map((n) => `<li><a href="${n.href}"${n.id === id ? ' aria-current="page"' : ""}>${n.texte}</a></li>`).join("");
  return `  <header class="entete">
    <div class="conteneur entete__ligne">
      ${logo()}
      <nav class="nav" aria-label="Navigation principale"><ul>${liens}</ul></nav>
      <a class="entete__tel" href="${TEL}" data-track="call">${ico("tel")}<span class="mono">${esc(S.telephone)}</span></a>
      <a class="bouton bouton--orange entete__devis" href="/devis-toiture" data-track="devis">Devis gratuit</a>
      <button class="entete__menu" type="button" aria-expanded="false" aria-controls="menu"><span class="entete__burger" aria-hidden="true"></span>Menu</button>
    </div>
    <div class="menu" id="menu" hidden>
      <div class="conteneur">
        <nav aria-label="Navigation mobile"><ul>
          <li><a href="/"${id === "accueil" ? ' aria-current="page"' : ""}>Accueil</a></li>
          <li><a href="/a-propos"${id === "apropos" ? ' aria-current="page"' : ""}>À propos</a></li>
          <li><a href="/contact"${id === "contact" ? ' aria-current="page"' : ""}>Contact</a></li>
        </ul></nav>
        <p class="menu__horaires">${esc(S.horaires.texte)}</p>
      </div>
    </div>
  </header>`;
}

function filAriane(items) {
  const tous = [{ nom: "Accueil", path: "/" }, ...items];
  const html = tous
    .map((it, i) => (i === tous.length - 1 ? `<li aria-current="page">${esc(it.nom)}</li>` : `<li><a href="${it.path}">${esc(it.nom)}</a></li>`))
    .join("");
  return {
    html: `<nav class="ariane" aria-label="Fil d'Ariane"><ol>${html}</ol></nav>`,
    ld: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: tous.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.nom, item: urlPage(it.path) })),
    },
  };
}

function actions({ clair = false, ancre = "", secondaire } = {}) {
  const sec = secondaire || { href: ancre || "/depannage-toiture", texte: ancre ? "Remplir la demande" : "Demande de dépannage", icone: "alerte", track: "depannage" };
  return `<div class="actions">
          <a class="bouton bouton--orange" href="${TEL}" data-track="call">${ico("tel")}Appeler le <span class="mono">${esc(S.telephone)}</span></a>
          <a class="bouton ${clair ? "bouton--contour-clair" : "bouton--contour"}" href="${sec.href}" data-track="${sec.track}">${ico(sec.icone)}${sec.texte}</a>
        </div>`;
}

function coches(liste, clair = false) {
  return `<p class="garanties${clair ? " garanties--clair" : ""}">${liste.filter(Boolean).map((t) => `<span>${esc(t)}</span>`).join("")}</p>`;
}

const CONFIANCE = [S.confiance.devisGratuit, S.confiance.rappel, confirme(S.confiance.decennale)];

function bandeauCta(titre = "Un problème de toiture ?", texte = "Appelez-nous, faites une demande de dépannage ou prenez rendez-vous pour un diagnostic gratuit.") {
  return `
    <section class="cta-final" aria-labelledby="titre-cta">
      <div class="conteneur cta-final__grille">
        <div>
          <h2 id="titre-cta">${fr(titre)}</h2>
          <p class="cta-final__texte">${fr(texte)}</p>
          <a class="cta-final__tel" href="${TEL}" data-track="call">${ico("tel")}<span class="mono">${esc(S.telephone)}</span></a>
          <p class="cta-final__horaires">${esc(S.horaires.texte)}</p>
        </div>
        <ul class="cta-final__liens">
          <li><a href="/depannage-toiture" data-track="depannage"><strong>Dépannage urgent</strong><span>Fuite ou tuiles envolées, décrivez le problème en ligne.</span>${ico("fleche")}</a></li>
          <li><a href="/devis-toiture" data-track="devis"><strong>Devis gratuit</strong><span>Réfection, réparation, démoussage, zinguerie.</span>${ico("fleche")}</a></li>
          <li><a href="/rendez-vous" data-track="rdv"><strong>Rendez-vous diagnostic</strong><span>Choisissez une date, on confirme par téléphone.</span>${ico("fleche")}</a></li>
        </ul>
        </div>
      </div>
    </section>
`;
}

function pied() {
  const a = S.adresse;
  const adresse = [confirme(a.rue), `${a.codePostal} ${a.ville}`].filter(Boolean).join("<br>");
  return `
  </main>

  <footer class="pied">
    <div class="conteneur pied__grille">
      <div class="pied__marque">
        ${logo(true)}
        <p>${esc(S.activite)} à ${esc(a.ville)}. ${esc(S.slogan)} pour les particuliers et les professionnels du secteur de Frontignan et de l'étang de Thau.</p>
      </div>
      <div>
        <h2>Nous joindre</h2>
        <address>
          <a class="pied__tel mono" href="${TEL}" data-track="call">${esc(S.telephone)}</a><br>
          <a href="mailto:${esc(S.email)}">${esc(S.email)}</a><br>
          ${adresse}<br>
          ${esc(S.horaires.texte)}
        </address>
      </div>
      <div>
        <h2>Services</h2>
        <ul>
          <li><a href="/depannage-toiture">Dépannage de toiture</a></li>
          ${SERVICES_PAGES.map((s) => `<li><a href="${s.path}">${esc(s.court)}</a></li>`).join("\n          ")}
        </ul>
      </div>
      <div>
        <h2><a href="/zone-intervention">Zone d'intervention</a></h2>
        <ul class="pied__villes">
          ${VILLES_PAGES.map((v) => `<li><a href="${v.path}">Couvreur ${esc(v.nom)}</a></li>`).join("\n          ")}
        </ul>
      </div>
    </div>
    <div class="conteneur pied__bas">
      <ul>
        <li><a href="/devis-toiture">Devis gratuit</a></li>
        <li><a href="/rendez-vous">Rendez-vous</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/zone-intervention">Zone d'intervention</a></li>
        <li><a href="/mentions-legales">Mentions légales</a></li>
        <li><a href="/confidentialite">Confidentialité</a></li>
      </ul>
      <p>© ${new Date().getFullYear()} ${esc(S.nom)}. Site réalisé par <a href="${esc(S.agence.url)}">${esc(S.agence.nom)}</a></p>
    </div>
  </footer>

  <a class="logo-fixe" href="/" aria-label="${esc(S.nom)}, retour à l'accueil"><img src="/img/arveo-mark.svg" alt="" width="64" height="34"></a>

  <nav class="barre-actions" aria-label="Nous contacter">
    <a href="${TEL}" data-track="call">${ico("tel")}<span>Appeler</span></a>
    <a href="/depannage-toiture" data-track="depannage">${ico("alerte")}<span>Dépannage</span></a>
    <a href="/devis-toiture" data-track="devis">${ico("devis")}<span>Devis</span></a>
  </nav>
`;
}

const FIN_PAGE = (scene) => `${scene ? `
  <script type="module">
    // Ordinateur : la 3D se charge tout de suite (intro). Téléphone : au premier geste
    // ou après quelques secondes, pour que la page soit utilisable immédiatement.
    let fait = false;
    const charger = () => { if (fait) return; fait = true; import("/scene.js"); };
    if (matchMedia("(min-width: 860px)").matches) charger();
    else {
      ["touchstart", "scroll", "pointerdown", "keydown"].forEach((e) => addEventListener(e, charger, { once: true, passive: true }));
      addEventListener("load", () => setTimeout(() => (window.requestIdleCallback || setTimeout)(charger), 3500), { once: true });
    }
  </script>` : ""}
</body>
</html>
`;

/* ------------------------------------------------------------------ */
/* Données structurées                                                 */
/* ------------------------------------------------------------------ */

const ENTREPRISE_ID = BASE + "/#entreprise";

function ldEntreprise() {
  const a = S.adresse;
  const o = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": ENTREPRISE_ID,
    name: S.nom,
    description: `${S.activite} à ${a.ville}. Réparation et réfection de toiture, recherche de fuite, démoussage, zinguerie, charpente et dépannage d'urgence.`,
    url: BASE + "/",
    logo: BASE + "/img/logo-arveo.png",
    image: BASE + "/og.png",
    telephone: fiable("telephone") && TEL_INTERNATIONAL,
    email: fiable("email"),
    address: {
      "@type": "PostalAddress",
      streetAddress: fiable("adresse.rue"),
      postalCode: a.codePostal,
      addressLocality: a.ville,
      addressRegion: a.region,
      addressCountry: a.pays,
    },
    geo: fiable("adresse.latitude") && fiable("adresse.longitude") ? { "@type": "GeoCoordinates", latitude: a.latitude, longitude: a.longitude } : undefined,
    areaServed: VILLES_PAGES.map((v) => ({ "@type": "City", name: v.nom })),
    openingHoursSpecification: fiable("horaires.texte")
      ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: S.horaires.jours, opens: S.horaires.ouverture, closes: S.horaires.fermeture }]
      : undefined,
    slogan: S.slogan,
    foundingDate: fiable("fondation"),
    priceRange: fiable("gammePrix"),
    paymentAccepted: fiable("paiements") && S.paiements.join(", "),
    knowsAbout: ["Couverture", "Zinguerie", "Charpente", "Recherche de fuite", "Démoussage de toiture", "Tuiles canal", "Gouttières en zinc"],
    knowsLanguage: "fr",
    currenciesAccepted: "EUR",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Travaux de couverture",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dépannage de toiture", url: BASE + "/depannage-toiture" } },
        ...SERVICES_PAGES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.nom, url: BASE + s.path } })),
      ],
    },
  };
  const sameAs = ["googleBusiness", "facebook", "instagram", "pagesJaunes"].map((k) => fiable("liens." + k)).filter(Boolean);
  if (sameAs.length) o.sameAs = sameAs;
  if (S.avis.length) {
    const moy = S.avis.reduce((t, a) => t + (a.note || 5), 0) / S.avis.length;
    o.aggregateRating = { "@type": "AggregateRating", ratingValue: moy.toFixed(1), reviewCount: S.avis.length, bestRating: 5 };
  }
  return nettoyer(o);
}

// Retire récursivement les propriétés vides (undefined, "", [], {}).
function nettoyer(o) {
  if (Array.isArray(o)) return o.map(nettoyer).filter((v) => v !== undefined);
  if (o && typeof o === "object") {
    const r = {};
    for (const [k, v] of Object.entries(o)) {
      const n = nettoyer(v);
      if (n === undefined || n === "" || (Array.isArray(n) && !n.length) || (n && typeof n === "object" && !Array.isArray(n) && !Object.keys(n).length)) continue;
      r[k] = n;
    }
    return r;
  }
  return o === false ? undefined : o;
}

const ldSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: S.nom,
  url: BASE + "/",
  inLanguage: "fr-FR",
  publisher: { "@id": ENTREPRISE_ID },
};

function ldFaq(liste) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: liste.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.r } })),
  };
}

function ldService(nom, path, zone) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: nom,
    serviceType: nom,
    url: urlPage(path),
    provider: { "@id": ENTREPRISE_ID },
    areaServed: zone ? { "@type": "City", name: zone } : VILLES_PAGES.map((v) => ({ "@type": "City", name: v.nom })),
  };
}

/* ------------------------------------------------------------------ */
/* Formulaires                                                         */
/* ------------------------------------------------------------------ */

let nChamp = 0;
const id = (p) => `${p}-${++nChamp}`;

function champ({ label, name, type = "text", requis, message, attrs = "", aide, options, large, liste }) {
  const i = id(name);
  const err = `${i}-erreur`;
  const req = requis ? ` required data-message="${esc(message || "Ce champ est nécessaire.")}"` : "";
  let input;
  if (type === "textarea") input = `<textarea id="${i}" name="${name}" rows="4" aria-describedby="${err}"${req} ${attrs}></textarea>`;
  else if (type === "select")
    input = `<select id="${i}" name="${name}" aria-describedby="${err}"${req} ${attrs}><option value="">Choisir</option>${options.map((o) => `<option>${esc(o)}</option>`).join("")}</select>`;
  else input = `<input id="${i}" name="${name}" type="${type}" aria-describedby="${err}"${req} ${attrs}${liste ? ` list="${liste}"` : ""}>`;
  return `<div class="champ${large ? " champ--large" : ""}">
              <label for="${i}">${esc(label)}${requis ? ' <span class="requis" aria-hidden="true">*</span>' : ' <span class="facultatif">(facultatif)</span>'}</label>
              ${input}
              ${aide ? `<p class="aide">${fr(aide)}</p>` : ""}
              <p class="erreur" id="${err}"></p>
            </div>`;
}

function choix({ legende, name, type = "checkbox", options, requis, message, colonnes }) {
  const err = id(name) + "-erreur";
  const items = options
    .map((o) => {
      const i = id(name);
      return `<label class="choix" for="${i}"><input id="${i}" type="${type}" name="${name}" value="${esc(o)}"><span class="choix__boite" aria-hidden="true"></span><span>${esc(o)}</span></label>`;
    })
    .join("");
  return `<fieldset class="groupe${colonnes ? " groupe--" + colonnes : ""}"${requis ? ` data-requis="${esc(message)}"` : ""} aria-describedby="${err}">
              <legend>${esc(legende)}${requis ? ' <span class="requis" aria-hidden="true">*</span>' : ""}</legend>
              <div class="groupe__choix">${items}</div>
              <p class="erreur" id="${err}"></p>
            </fieldset>`;
}

const bloc = (num, titre, contenu, cls = "") =>
  `<section class="bloc${cls ? " " + cls : ""}">
            <h3 class="bloc__titre"><span class="bloc__num mono">${num}</span>${esc(titre)}</h3>
            <div class="bloc__corps">
            ${contenu}
            </div>
          </section>`;

const piege = `<div class="hp" aria-hidden="true"><label>Laissez ce champ vide<input type="text" name="site_web" tabindex="-1" autocomplete="off"></label></div>`;

const consentement = (texte) => {
  const i = id("consentement");
  return `<div class="consentement">
            <label class="choix" for="${i}"><input id="${i}" type="checkbox" name="consentement" value="oui" required data-message="Cochez cette case pour que nous puissions vous recontacter." aria-describedby="${i}-erreur"><span class="choix__boite" aria-hidden="true"></span><span>${esc(texte)} <a href="/confidentialite">Données personnelles</a></span></label>
            <p class="erreur" id="${i}-erreur"></p>
          </div>`;
};

const retour = `<div class="formulaire__retour" role="status" aria-live="polite" tabindex="-1"></div>`;

const datalistVilles = `<datalist id="liste-villes">${VILLES_PAGES.map((v) => `<option value="${esc(v.nom)}">`).join("")}</datalist>`;

function photos(name = "photos") {
  const i = id(name);
  return `<div class="champ champ--large fichier">
              <span class="fichier__label">Photos <span class="facultatif">(facultatif, 4 maximum)</span></span>
              <input id="${i}" name="${name}" type="file" accept="image/*" multiple data-photos>
              <label for="${i}" class="fichier__zone">${ico("photo")}<span><strong>Ajouter des photos</strong> Une photo de la toiture ou des dégâts nous aide à préparer l'intervention.</span></label>
              <p class="fichier__liste" aria-live="polite"></p>
            </div>`;
}

function formDepannage() {
  return `<form class="formulaire formulaire--fiche" data-formulaire="depannage" novalidate aria-label="Demande de dépannage">
          ${piege}
          <div class="fiche-tete">
            <div class="fiche-tete__marque">${logo()}<p class="mono">Frontignan &amp; alentours</p></div>
            <h2 class="fiche-tete__titre">Demande de <span>dépannage</span></h2>
          </div>
          <p class="fiche-intro"><strong>Un problème à signaler ?</strong> Remplissez ce formulaire afin de nous transmettre les informations utiles pour préparer votre prise en charge.</p>
          <div class="blocs blocs--2">
          ${bloc("01", "Vos coordonnées", `
            ${champ({ label: "Nom / Prénom", name: "nom", requis: true, message: "Indiquez votre nom pour qu'on sache qui rappeler.", attrs: 'autocomplete="name"', large: true })}
            ${champ({ label: "Adresse de l'intervention", name: "adresse", requis: true, message: "Indiquez l'adresse où se trouve la toiture.", attrs: 'autocomplete="street-address"', large: true })}
            ${champ({ label: "Code postal", name: "code_postal", requis: true, message: "Indiquez le code postal (5 chiffres).", attrs: 'inputmode="numeric" autocomplete="postal-code" pattern="[0-9]{5}" maxlength="5"' })}
            ${champ({ label: "Ville", name: "ville", requis: true, message: "Indiquez la ville.", attrs: 'autocomplete="address-level2"', liste: "liste-villes" })}
            ${champ({ label: "Téléphone", name: "telephone", type: "tel", requis: true, message: "Indiquez un numéro pour qu'on puisse vous rappeler.", attrs: 'inputmode="tel" autocomplete="tel"' })}
            ${champ({ label: "E-mail", name: "email", type: "email", attrs: 'autocomplete="email"' })}
          `)}
          ${bloc("02", "Votre demande", `
            <p class="date-demande">Date de la demande <span class="mono" data-date></span></p>
            ${choix({ legende: "Niveau d'urgence", name: "urgence", type: "radio", options: ["Urgente", "Planifiée"], requis: true, message: "Indiquez le niveau d'urgence." })}
            ${choix({ legende: "Vous êtes", name: "profil", type: "radio", options: ["Propriétaire", "Locataire", "Syndic"], requis: true, message: "Indiquez si vous êtes propriétaire, locataire ou syndic." })}
          `)}
          </div>
          ${bloc("03", "Nature du dépannage", `
            <div class="trois-colonnes">
            ${choix({ legende: "Le problème concerne", name: "probleme", options: ["Fuite / infiltration", "Tuile ou ardoise endommagée", "Gouttière / zinguerie", "Étanchéité / solin"], requis: true, message: "Cochez au moins une case." })}
            ${choix({ legende: "Signaux observés", name: "signaux", options: ["Écoulement d'eau", "Humidité intérieure", "Élément déplacé / cassé", "Dégâts après intempéries"] })}
            ${choix({ legende: "Localisation", name: "localisation", options: ["Toiture principale", "Annexe / garage", "Gouttière", "Autre"] })}
            </div>
          `)}
          <div class="blocs blocs--2-1">
          ${bloc("04", "Décrivez votre situation", `
            ${champ({ label: "Depuis quand le problème est-il constaté ?", name: "depuis", type: "select", options: ["Aujourd'hui", "Depuis quelques jours", "Depuis quelques semaines", "Depuis plus longtemps"], requis: true, message: "Indiquez depuis quand le problème est constaté.", large: true })}
            ${champ({ label: "Description", name: "description", type: "textarea", requis: true, message: "Décrivez le problème en quelques mots.", attrs: 'placeholder="Où se trouve la fuite, ce que vous voyez, ce qui s\'est passé…"', large: true })}
            ${photos()}
          `)}
          ${bloc("05", "Disponibilités & accès", `
            ${choix({ legende: "Créneaux souhaités", name: "creneaux", options: ["Matin", "Après-midi", "Fin de journée"] })}
            ${choix({ legende: "Sur place", name: "acces", options: ["Présence sur place possible", "Accès extérieur disponible"] })}
          `, "bloc--teinte")}
          </div>
          ${consentement("J'autorise ARVÉO à me recontacter au sujet de cette demande.")}
          <div class="formulaire__envoi">
            <button class="bouton bouton--orange bouton--grand" type="submit">${ico("alerte")}Envoyer ma demande de dépannage</button>
          </div>
          ${retour}
          ${datalistVilles}
        </form>`;
}

function formDevis() {
  return `<form class="formulaire" data-formulaire="devis" novalidate aria-label="Demande de devis">
          ${piege}
          ${bloc("01", "Votre projet", `
            ${choix({ legende: "Type de travaux", name: "travaux", options: ["Réparation / fuite", "Réfection de toiture", "Démoussage / traitement", "Zinguerie / gouttières", "Charpente", "Autre"], requis: true, message: "Cochez au moins un type de travaux.", colonnes: "2" })}
            ${choix({ legende: "Type de couverture", name: "couverture", type: "radio", options: ["Tuiles canal", "Tuiles romanes ou mécaniques", "Ardoise", "Bac acier", "Toit plat / terrasse", "Je ne sais pas"], colonnes: "2" })}
            ${champ({ label: "Surface approximative", name: "surface", type: "select", options: ["Moins de 50 m²", "50 à 100 m²", "100 à 150 m²", "Plus de 150 m²", "Je ne sais pas"] })}
            ${champ({ label: "Délai souhaité", name: "delai", type: "select", options: ["Dès que possible", "Dans le mois", "Dans les 3 mois", "Pas pressé"] })}
            ${champ({ label: "Votre projet en quelques mots", name: "description", type: "textarea", requis: true, message: "Décrivez votre projet en quelques mots.", large: true })}
            ${photos()}
          `)}
          ${bloc("02", "Le chantier", `
            ${champ({ label: "Adresse", name: "adresse", attrs: 'autocomplete="street-address"', large: true })}
            ${champ({ label: "Code postal", name: "code_postal", attrs: 'inputmode="numeric" autocomplete="postal-code" maxlength="5"' })}
            ${champ({ label: "Ville", name: "ville", requis: true, message: "Indiquez la ville du chantier.", attrs: 'autocomplete="address-level2"', liste: "liste-villes" })}
          `)}
          ${bloc("03", "Vos coordonnées", `
            ${champ({ label: "Nom / Prénom", name: "nom", requis: true, message: "Indiquez votre nom.", attrs: 'autocomplete="name"' })}
            ${champ({ label: "Téléphone", name: "telephone", type: "tel", requis: true, message: "Indiquez un numéro pour qu'on puisse vous rappeler.", attrs: 'inputmode="tel" autocomplete="tel"' })}
            ${champ({ label: "E-mail", name: "email", type: "email", attrs: 'autocomplete="email"' })}
            ${champ({ label: "Vous êtes", name: "profil", type: "select", options: ["Propriétaire", "Locataire", "Syndic / gestionnaire", "Professionnel"] })}
          `)}
          ${consentement("J'autorise ARVÉO à me recontacter au sujet de ma demande de devis.")}
          <div class="formulaire__envoi">
            <button class="bouton bouton--orange bouton--grand" type="submit">${ico("devis")}Recevoir mon devis gratuit</button>
          </div>
          ${retour}
          ${datalistVilles}
        </form>`;
}

function formRdv() {
  return `<form class="formulaire" data-formulaire="rdv" novalidate aria-label="Demande de rendez-vous">
          ${piege}
          ${bloc("01", "Motif du rendez-vous", `
            ${choix({ legende: "Motif", name: "motif", type: "radio", options: ["Diagnostic toiture gratuit", "Visite pour un devis", "Contrôle après intempéries", "Autre"], requis: true, message: "Choisissez un motif.", colonnes: "2" })}
          `)}
          ${bloc("02", "Date et créneau", `
            ${champ({ label: "Date souhaitée", name: "date", type: "date", requis: true, message: "Choisissez une date du lundi au samedi.", attrs: "data-date-rdv" })}
            ${champ({ label: "Autre date possible", name: "date_2", type: "date", attrs: "data-date-rdv" })}
            ${choix({ legende: "Créneau", name: "creneau", type: "radio", options: ["Matin (8 h – 12 h)", "Après-midi (14 h – 19 h)"], requis: true, message: "Choisissez un créneau." })}
          `)}
          ${bloc("03", "Lieu et coordonnées", `
            ${champ({ label: "Adresse", name: "adresse", attrs: 'autocomplete="street-address"', large: true })}
            ${champ({ label: "Ville", name: "ville", requis: true, message: "Indiquez la ville.", attrs: 'autocomplete="address-level2"', liste: "liste-villes" })}
            ${champ({ label: "Nom / Prénom", name: "nom", requis: true, message: "Indiquez votre nom.", attrs: 'autocomplete="name"' })}
            ${champ({ label: "Téléphone", name: "telephone", type: "tel", requis: true, message: "Indiquez un numéro pour confirmer le rendez-vous.", attrs: 'inputmode="tel" autocomplete="tel"' })}
            ${champ({ label: "E-mail", name: "email", type: "email", attrs: 'autocomplete="email"' })}
          `)}
          ${consentement("J'autorise ARVÉO à me recontacter pour confirmer ce rendez-vous.")}
          <div class="formulaire__envoi">
            <button class="bouton bouton--orange bouton--grand" type="submit">${ico("agenda")}Demander ce rendez-vous</button>
            <p>On vous rappelle pour confirmer l'heure exacte.</p>
          </div>
          ${retour}
          ${datalistVilles}
        </form>`;
}

function formContact() {
  return `<form class="formulaire" data-formulaire="contact" novalidate aria-label="Nous écrire">
          ${piege}
          ${bloc("01", "Votre message", `
            ${champ({ label: "Nom / Prénom", name: "nom", requis: true, message: "Indiquez votre nom.", attrs: 'autocomplete="name"' })}
            ${champ({ label: "Téléphone", name: "telephone", type: "tel", requis: true, message: "Indiquez votre numéro.", attrs: 'inputmode="tel" autocomplete="tel"' })}
            ${champ({ label: "E-mail", name: "email", type: "email", attrs: 'autocomplete="email"', large: true })}
            ${champ({ label: "Message", name: "message", type: "textarea", requis: true, message: "Écrivez votre message.", large: true })}
          `)}
          ${consentement("J'autorise ARVÉO à me recontacter au sujet de ce message.")}
          <div class="formulaire__envoi"><button class="bouton bouton--orange bouton--grand" type="submit">${ico("mail")}Envoyer mon message</button></div>
          ${retour}
        </form>`;
}

/* ------------------------------------------------------------------ */
/* Blocs de contenu                                                    */
/* ------------------------------------------------------------------ */

const APRES_DEMANDE = `<div class="cote-carte">
            <h2>Après votre demande</h2>
            <ol class="suite-demande">
              <li><span class="mono">01</span><span><strong>Réception immédiate</strong>Votre demande arrive directement chez ARVÉO.</span></li>
              <li><span class="mono">02</span><span><strong>Rappel dans la journée</strong>On fait le point avec vous par téléphone.</span></li>
              <li><span class="mono">03</span><span><strong>Visite et devis</strong>Diagnostic sur place, prix écrit avant tout travail.</span></li>
            </ol>
          </div>
          <div class="cote-carte">
            <h2>Une urgence ?</h2>
            <p>Fuite active ou tuiles envolées, utilisez plutôt la demande de dépannage.</p>
            <a class="lien-fleche" href="/depannage-toiture" data-track="depannage">Demande de dépannage ${ico("fleche")}</a>
          </div>`;

function faqHtml(liste, titre = "Vos questions") {
  return `
    <section class="section" aria-labelledby="titre-faq">
      <div class="conteneur faq-bloc">
        <div class="faq-bloc__intro">
          <h2 id="titre-faq">${fr(titre)}</h2>
          <p class="texte">Une question qui n'est pas dans la liste ? Décrivez votre situation, nous vous rappelons dans la journée.</p>
          <a class="bouton bouton--orange" href="/depannage-toiture" data-track="depannage">${ico("alerte")}Faire une demande de dépannage</a>
        </div>
        <div class="faq">
          ${liste
            .map(
              (f) => `<details>
            <summary>${fr(f.q)}</summary>
            <div class="faq__reponse"><p>${fr(f.r)}</p>${f.lien ? `<a class="lien-fleche" href="${f.lien.href}">${esc(f.lien.texte)} ${ico("fleche")}</a>` : ""}</div>
          </details>`
            )
            .join("\n          ")}
        </div>
      </div>
    </section>`;
}

const RESUMES = {
  depannage: "Fuite, tuiles envolées, dégâts d'orage. Mise hors d'eau rapide, puis réparation.",
  "refection-toiture": "Couverture refaite en tuiles canal, romanes ou mécaniques, en totalité ou par pan.",
  "recherche-de-fuite": "On trouve d'où vient l'eau avant de réparer, pour ne pas payer deux fois.",
  "demoussage-toiture": "Brossage, traitement anti-mousse et hydrofuge, sans haute pression agressive.",
  "zinguerie-gouttieres": "Gouttières, descentes, noues et solins en zinc, posés ou réparés.",
  charpente: "Chevrons, pannes et liteaux contrôlés, renforcés ou remplacés.",
};

function cartesServices(exclure) {
  const lignes = [
    { cle: "depannage", path: "/depannage-toiture", nom: "Dépannage de toiture", urgent: true },
    ...SERVICES_PAGES.map((s) => ({ cle: s.slug, path: s.path, nom: s.nom })),
  ].filter((c) => c.path !== exclure);
  return `<ul class="prestations">
          ${lignes
            .map(
              (c) => `<li class="prestation${c.urgent ? " prestation--urgent" : ""}"><a href="${c.path}"><span class="prestation__nom">${esc(c.nom)}</span><span class="prestation__resume">${fr(RESUMES[c.cle])}</span>${ico("fleche", "ico prestation__fleche")}</a></li>`
            )
            .join("\n          ")}
        </ul>`;
}

function listeVilles(exclure) {
  return `<ul class="villes">
          ${VILLES_PAGES.filter((v) => v.nom !== exclure)
            .map((v) => `<li><a href="${v.path}">Couvreur à ${esc(v.nom)}</a></li>`)
            .join("\n          ")}
        </ul>`;
}

function avisHtml() {
  if (!S.avis.length) return "";
  return `
    <section class="section section--claire" aria-labelledby="titre-avis">
      <div class="conteneur">
        <h2 id="titre-avis">Ce que disent nos clients</h2>
        <ul class="avis">
          ${S.avis
            .slice(0, 6)
            .map(
              (a) => `<li class="avis__carte">
            <p class="avis__note" aria-label="${a.note || 5} sur 5">${"★".repeat(a.note || 5)}</p>
            <blockquote><p>« ${esc(a.texte)} »</p></blockquote>
            <p class="avis__auteur">${esc(a.auteur)}${a.ville ? `, <span>${esc(a.ville)}</span>` : ""}</p>
          </li>`
            )
            .join("\n          ")}
        </ul>
        ${S.liens.googleBusiness ? `<p><a class="lien-fleche" href="${esc(S.liens.googleBusiness)}" rel="noopener">Voir tous nos avis sur Google ${ico("fleche")}</a></p>` : ""}
      </div>
    </section>`;
}

function enTetePage({ surTitre, h1, chapo, ariane, rappel, illustration = true, ancre = "" }) {
  return `
    <section class="tete-page">
      ${illustration ? '<img class="tete-page__dessin" src="/img/toiture.svg" alt="" width="1440" height="900" aria-hidden="true">' : ""}
      <div class="conteneur tete-page__grille${rappel ? "" : " tete-page__grille--seule"}">
        <div class="tete-page__texte">
          ${ariane}
          <h1>${fr(h1)}</h1>
          <p class="chapeau">${fr(chapo)}</p>
          ${actions({ clair: true, ancre })}
          ${coches(CONFIANCE, true)}
        </div>
        ${rappel ? `<div class="tete-page__carte">${rappel}</div>` : ""}
      </div>
    </section>`;
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

const pages = [];
const ecrire = (fichier, html, meta) => {
  const f = path.join(RACINE, fichier);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
  if (meta) pages.push(meta);
};

/* --- Accueil --- */

const ZONES_VISITE = [
  { titre: "Couverture et tuiles", texte: "Tuiles canal, romanes ou mécaniques, faîtage, rives et génoises. On répare un pan ou on refait toute la couverture.", lien: "/services/refection-toiture", devis: "Réfection de toiture" },
  { titre: "Charpente", texte: "Chevrons, pannes et liteaux portent vos tuiles. On les contrôle et on les renforce.", lien: "/services/charpente", devis: "Charpente" },
  { titre: "Zinguerie", texte: "Gouttières, descentes et noues en zinc éloignent l'eau de vos murs et de vos façades.", lien: "/services/zinguerie-gouttieres", devis: "Zinguerie / gouttières" },
  { titre: "Fuites et étanchéité", texte: "Solin de cheminée, fenêtre de toit, tuile cassée. On trouve d'où vient l'eau avant de réparer.", lien: "/services/recherche-de-fuite", devis: "Réparation / fuite" },
  { titre: "Démoussage et entretien", texte: "Un nettoyage et un traitement contre mousses et lichens prolongent la vie de la toiture.", lien: "/services/demoussage-toiture", devis: "Démoussage / traitement" },
];

{
  const p = {
    id: "accueil",
    path: "/",
    scene: true,
    title: "Couvreur à Frontignan, réparation et réfection de toiture | ARVÉO",
    ogTitle: "ARVÉO, couvreur à Frontignan",
    description: `Couvreur zingueur à Frontignan pour fuites, tuiles cassées, réfection de toiture, démoussage, gouttières. Dépannage rapide à Sète et Balaruc. Devis gratuit.`,
    jsonld: [ldEntreprise(), ldSite, ldFaq(FAQ_ACCUEIL)],
  };
  const fiches = ZONES_VISITE.map(
    (z, i) => `<article class="fiche" aria-labelledby="titre-zone-${i}">
              <img class="fiche__image" src="/img/toiture-zone-${i + 1}-480.webp" srcset="/img/toiture-zone-${i + 1}-480.webp 480w, /img/toiture-zone-${i + 1}.webp 800w" sizes="(max-width: 859px) 100vw, 1px" alt="${esc(z.titre)} : la zone concernée est en orange sur le schéma de la toiture" width="800" height="600" loading="lazy" decoding="async">
              <span class="fiche__num mono">${String(i + 1).padStart(2, "0")} / ${String(ZONES_VISITE.length).padStart(2, "0")}</span>
              <h3 id="titre-zone-${i}">${esc(z.titre)}</h3>
              <p>${fr(z.texte)}</p>
              <div class="fiche__actions">
                <a class="bouton bouton--orange bouton--petit" href="/devis-toiture?travaux=${encodeURIComponent(z.devis)}" data-track="devis">Devis pour ça</a>
                <a class="lien-fleche" href="${z.lien}">En savoir plus ${ico("fleche")}</a>
              </div>
            </article>`
  ).join("\n            ");
  const reperes = ZONES_VISITE.map((z) => `<li><button type="button" aria-current="false">${esc(z.titre.split(" ")[0])}</button></li>`).join("");
  const html =
    head(p) +
    `
    <section class="accroche" aria-labelledby="titre-page">
      <div class="conteneur accroche__grille">
        <div class="accroche__texte">
          <h1 id="titre-page">Couvreur à Frontignan, <span>votre toiture entre de bonnes mains.</span></h1>
          <p class="chapeau">ARVÉO répare, refait et entretient les toitures de Frontignan, de Sète et de tout le secteur de l'étang de Thau. Devis gratuit et dépannage rapide.</p>
          ${actions({ clair: true })}
          ${coches(CONFIANCE, true)}
        </div>
      </div>
    </section>

    <section class="visite" data-visite id="visite" aria-labelledby="titre-visite">
      <div class="visite__collant">
        <div class="conteneur visite__grille">
          <div class="visite__tete">
            <h2 id="titre-visite">Du faîtage à la gouttière, on s'occupe de tout.</h2>
            <p class="visite__glisser" aria-hidden="true">Faites glisser pour voir chaque zone ${ico("fleche")}</p>
          </div>
          <div class="visite__fiches">
            ${fiches}
          </div>
          <ol class="visite__reperes" aria-label="Étapes de la visite">${reperes}</ol>
        </div>
      </div>
    </section>

    <section class="section" id="services" aria-labelledby="titre-services">
      <div class="conteneur services-bloc">
        <div class="services-bloc__intro">
          <h2 id="titre-services">Tous les travaux de toiture, à Frontignan et alentours</h2>
          <p class="texte">De la tuile cassée à la couverture refaite à neuf, un seul artisan suit votre toiture du diagnostic au nettoyage du chantier.</p>
          <a class="bouton bouton--orange" href="/devis-toiture" data-track="devis">${ico("devis")}Demander un devis gratuit</a>
        </div>
        ${cartesServices()}
      </div>
    </section>

    <section class="section section--claire" aria-labelledby="titre-methode">
      <div class="conteneur">
        <h2 id="titre-methode">Quatre étapes, un seul interlocuteur</h2>
        <ol class="methode">
          <li><span class="methode__num mono">01</span><h3>Diagnostic</h3><p>On inspecte la couverture et les combles, photos à l'appui.</p></li>
          <li><span class="methode__num mono">02</span><h3>Devis détaillé</h3><p>Un prix écrit, poste par poste, avant tout travail. Gratuit.</p></li>
          <li><span class="methode__num mono">03</span><h3>Travaux</h3><p>À la date convenue, avec une toiture protégée à chaque étape.</p></li>
          <li><span class="methode__num mono">04</span><h3>Contrôle et nettoyage</h3><p>Gouttières dégagées, gravats évacués, contrôle final avec vous.</p></li>
        </ol>
        <div class="actions actions--centre">
          <a class="bouton bouton--orange" href="/rendez-vous" data-track="rdv">${ico("agenda")}Prendre rendez-vous pour un diagnostic</a>
          <a class="bouton bouton--contour" href="/devis-toiture" data-track="devis">${ico("devis")}Demander un devis</a>
        </div>
      </div>
    </section>
${avisHtml()}
    <section class="section" aria-labelledby="titre-zone">
      <div class="conteneur zone">
        <div>
          <h2 id="titre-zone">Votre couvreur à Frontignan et dans les communes voisines</h2>
          <p class="texte">Installés à Frontignan, nous intervenons rapidement à Sète, Balaruc-les-Bains, Balaruc-le-Vieux, Vic-la-Gardiole, Mireval, Gigean, Poussan, Villeneuve-lès-Maguelone et Montbazin. Frontignan-Plage et La Peyrade comprises.</p>
          <a class="lien-fleche" href="/zone-intervention">Voir toute la zone d'intervention ${ico("fleche")}</a>
        </div>
        ${listeVilles()}
      </div>
    </section>
${faqHtml(FAQ_ACCUEIL)}
${bandeauCta()}` +
    pied() +
    FIN_PAGE(true);
  ecrire("index.html", html, { path: "/", priorite: "1.0" });
}

/* --- Pages services --- */

for (const s of SERVICES_PAGES) {
  const ar = filAriane([{ nom: s.court, path: s.path }]);
  const p = { id: "services", path: s.path, title: s.title, description: s.description, jsonld: [ldEntreprise(), ldService(s.nom, s.path), ar.ld, ldFaq(s.faq)] };
  const corps = s.sections
    .map(
      (sec) => `<h2>${fr(sec.h2)}</h2>
          ${(sec.p || []).map((t) => `<p>${fr(t)}</p>`).join("\n          ")}
          ${sec.liste ? `<ul class="liste-coches">${sec.liste.map((t) => `<li>${ico("coche")}${fr(t)}</li>`).join("")}</ul>` : ""}`
    )
    .join("\n          ");
  const html =
    head(p) +
    enTetePage({ surTitre: `${S.activite} · Frontignan`, h1: s.h1, chapo: s.chapo, ariane: ar.html }) +
    `
    <section class="section section--claire">
      <div class="conteneur article">
        <div class="article__corps">
          ${corps}
          <div class="encart-cta">
            <p><strong>Besoin d'un avis sur votre toiture ?</strong> Le diagnostic et le devis sont gratuits.</p>
            <div class="actions">
              <a class="bouton bouton--orange" href="/devis-toiture?travaux=${encodeURIComponent(ZONES_VISITE.find((z) => z.lien === s.path)?.devis || "")}" data-track="devis">${ico("devis")}Demander un devis</a>
              <a class="bouton bouton--contour" href="/rendez-vous" data-track="rdv">${ico("agenda")}Prendre rendez-vous</a>
            </div>
          </div>
        </div>
        <aside class="article__cote">
          <div class="cote-carte">
            <h2>Intervention à</h2>
            <ul class="villes villes--compact">${VILLES_PAGES.map((v) => `<li><a href="${v.path}">${ico("pin")}${esc(v.nom)}</a></li>`).join("")}</ul>
          </div>
          <div class="cote-carte cote-carte--orange">
            <h2>Une urgence ?</h2>
            <p>Fuite active ou tuiles envolées ? Faites une demande de dépannage.</p>
            <a class="bouton bouton--orange" href="/depannage-toiture" data-track="depannage">${ico("alerte")}Dépannage</a>
          </div>
        </aside>
      </div>
    </section>
${faqHtml(s.faq, `Vos questions sur ${s.court.toLowerCase() === "charpente" ? "la charpente" : "ce service"}`)}
    <section class="section section--claire" aria-labelledby="titre-autres">
      <div class="conteneur">
        <h2 id="titre-autres">Les autres travaux de toiture</h2>
        ${cartesServices(s.path)}
      </div>
    </section>
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire(`services/${s.slug}.html`, html, { path: s.path, priorite: "0.8" });
}


/* --- Pages communes --- */

for (const v of VILLES_PAGES) {
  const ar = filAriane([{ nom: "Zone d'intervention", path: "/zone-intervention" }, { nom: `Couvreur ${v.nom}`, path: v.path }]);
  const p = {
    id: "zone",
    path: v.path,
    title: (v.nom.length > 16 ? `Couvreur à ${v.nom} (${v.cp}) | ARVÉO` : `Couvreur à ${v.nom} (${v.cp}), réparation de toiture | ARVÉO`),
    description: `Couvreur à ${v.nom} (${v.cp}) pour fuites, tuiles cassées, réfection, démoussage et gouttières. Artisan de Frontignan, dépannage rapide, devis gratuit.`,
    jsonld: [
      ldEntreprise(),
      { ...ldService(`Couvreur à ${v.nom}`, v.path, v.nom), areaServed: { "@type": "City", name: v.nom, geo: { "@type": "GeoCoordinates", latitude: v.lat, longitude: v.lng } } },
      ar.ld,
      ldFaq(v.faq),
    ],
  };
  const html =
    head(p) +
    enTetePage({ surTitre: `Couvreur ${v.nom} · ${v.cp}`, h1: `Couvreur à ${v.nom}`, chapo: v.intro, ariane: ar.html }) +
    `
    <section class="section section--claire">
      <div class="conteneur article">
        <div class="article__corps">
          <p class="encart-accent">${ico("toit")}<strong>${fr(v.accent)}</strong></p>
          <h2>Les toitures de ${esc(v.nom)}</h2>
          ${v.texte.map((t) => `<p>${fr(t)}</p>`).join("\n          ")}
          <h2>Nos interventions à ${esc(v.nom)}</h2>
          <ul class="liste-liens">
            <li><a href="/depannage-toiture">${ico("alerte")}<span><strong>Dépannage de toiture à ${esc(v.nom)}</strong> fuite, tuiles arrachées, bâchage d'urgence</span></a></li>
            ${SERVICES_PAGES.map((s) => `<li><a href="${s.path}">${ico("coche")}<span><strong>${esc(s.nom)}</strong> ${fr(s.chapo.split(".")[0])}.</span></a></li>`).join("\n            ")}
          </ul>
          <div class="encart-cta">
            <p><strong>Un problème de toiture à ${esc(v.nom)} ?</strong> On se déplace pour un diagnostic gratuit.</p>
            <div class="actions">
              <a class="bouton bouton--orange" href="/devis-toiture" data-track="devis">${ico("devis")}Demander un devis</a>
              <a class="bouton bouton--contour" href="/rendez-vous" data-track="rdv">${ico("agenda")}Prendre rendez-vous</a>
            </div>
          </div>
        </div>
        <aside class="article__cote">
          <div class="cote-carte">
            <h2>Communes voisines</h2>
            ${listeVilles(v.nom).replace('class="villes"', 'class="villes villes--compact"')}
          </div>
          <div class="cote-carte cote-carte--orange">
            <h2>Urgence à ${esc(v.nom)} ?</h2>
            <p>Décrivez le problème en ligne, on vous rappelle au plus vite.</p>
            <a class="bouton bouton--orange" href="/depannage-toiture" data-track="depannage">${ico("alerte")}Dépannage</a>
          </div>
        </aside>
      </div>
    </section>
${faqHtml([...v.faq, FAQ_ACCUEIL[0], FAQ_ACCUEIL[1]], `Couvreur à ${v.nom}, vos questions`)}
${bandeauCta(`Votre couvreur à ${v.nom}`, `Réparation, réfection, démoussage ou urgence. Appelez-nous ou faites votre demande en ligne.`)}` +
    pied() +
    FIN_PAGE(false);
  ecrire(`couvreur/${v.slug}.html`, html, { path: v.path, priorite: v.nom === "Frontignan" ? "0.9" : "0.8" });
}

/* --- Zone d'intervention --- */
{
  const ar = filAriane([{ nom: "Zone d'intervention", path: "/zone-intervention" }]);
  const p = {
    id: "zone",
    path: "/zone-intervention",
    title: "Couvreur à Frontignan, Sète et Balaruc, zone d'intervention | ARVÉO",
    description: "Couvreur à Frontignan, ARVÉO intervient à Sète, Balaruc, Vic-la-Gardiole, Mireval, Gigean, Poussan, Villeneuve-lès-Maguelone et Montbazin.",
    jsonld: [ldEntreprise(), ar.ld],
  };
  const html =
    head(p) +
    enTetePage({ surTitre: "Zone d'intervention", h1: "Couvreur à Frontignan et dans les communes voisines", chapo: "Installés à Frontignan, on intervient rapidement dans tout le secteur, entre l'étang de Thau, le massif de la Gardiole et le littoral.", ariane: ar.html }) +
    `
    <section class="section section--claire">
      <div class="conteneur">
        <ul class="villes-cartes">
          ${VILLES_PAGES.map((v) => `<li><a href="${v.path}"><span class="mono">${v.cp}</span><h2>Couvreur ${esc(v.nom)}</h2><p>${fr(v.accent)}</p><span class="lien-fleche">Voir la page ${ico("fleche")}</span></a></li>`).join("\n          ")}
        </ul>
        <p class="texte">Votre commune n'est pas dans la liste ? Appelez-nous, on vous dit tout de suite si on peut intervenir.</p>
      </div>
    </section>
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire("zone-intervention.html", html, { path: "/zone-intervention", priorite: "0.7" });
}

/* --- Dépannage --- */
{
  const ar = filAriane([{ nom: "Dépannage de toiture", path: "/depannage-toiture" }]);
  const p = {
    id: "depannage",
    path: "/depannage-toiture",
    title: "Dépannage de toiture urgent à Frontignan, demande en ligne | ARVÉO",
    description: `Fuite de toiture, tuiles arrachées, dégâts après orage à Frontignan, Sète et alentours. Faites votre demande de dépannage en ligne ou appelez le ${S.telephone}.`,
    jsonld: [ldEntreprise(), ldService("Dépannage de toiture", "/depannage-toiture"), ar.ld, ldFaq(FAQ_DEPANNAGE)],
  };
  const html =
    head(p) +
    enTetePage({ surTitre: "Dépannage de toiture", h1: "Demande de dépannage toiture en ligne", chapo: "Fuite, tuile cassée ou gouttière arrachée ? Remplissez la demande, nous la recevons immédiatement et vous rappelons au plus vite.", ariane: ar.html, ancre: "#formulaire" }) +
    `
    <section class="section section--claire" id="formulaire" aria-label="Formulaire de dépannage">
      <div class="conteneur formulaire-page">
        ${formDepannage()}
        <aside class="formulaire-page__cote">
          <div class="cote-carte cote-carte--sombre">
            <h2>Urgence immédiate</h2>
            <a class="cote-tel mono" href="${TEL}" data-track="call">${esc(S.telephone)}</a>
            <p>${esc(S.horaires.texte)}</p>
          </div>
          <div class="cote-carte">
            <h2>En attendant notre passage</h2>
            <ul class="liste-coches">
              <li>${ico("coche")}Placez une bassine sous la fuite</li>
              <li>${ico("coche")}Protégez meubles et appareils</li>
              <li>${ico("coche")}Coupez l'électricité si l'eau approche d'un luminaire</li>
              <li>${ico("coche")}Ne montez pas sur le toit</li>
              <li>${ico("coche")}Prenez des photos pour votre assurance</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
${faqHtml(FAQ_DEPANNAGE, "Vos questions sur le dépannage")}
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire("depannage-toiture.html", html, { path: "/depannage-toiture", priorite: "0.9" });
}

/* --- Devis --- */
{
  const ar = filAriane([{ nom: "Devis gratuit", path: "/devis-toiture" }]);
  const p = {
    id: "devis",
    path: "/devis-toiture",
    title: "Devis toiture gratuit à Frontignan | Couvreur ARVÉO",
    description: "Demandez votre devis gratuit de couvreur à Frontignan et alentours pour une réfection, une réparation, un démoussage, de la zinguerie ou la charpente.",
    jsonld: [ldEntreprise(), ar.ld],
  };
  const html =
    head(p) +
    enTetePage({ surTitre: "Devis gratuit", h1: "Votre devis de toiture gratuit", chapo: "Décrivez votre projet en deux minutes. Nous vous rappelons pour organiser la visite et vous remettre un devis écrit et détaillé.", ariane: ar.html }) +
    `
    <section class="section section--claire" id="formulaire" aria-label="Formulaire de devis">
      <div class="conteneur formulaire-page">
        ${formDevis()}
        <aside class="formulaire-page__cote">
          <div class="cote-carte">
            <h2>Notre devis comprend</h2>
            <ul class="liste-coches">
              <li>${ico("coche")}Une visite sur place</li>
              <li>${ico("coche")}Des photos de l'état de la toiture</li>
              <li>${ico("coche")}Un prix détaillé poste par poste</li>
              <li>${ico("coche")}Un délai d'intervention</li>
            </ul>
          </div>
          ${APRES_DEMANDE}
        
        </aside>
      </div>
    </section>
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire("devis-toiture.html", html, { path: "/devis-toiture", priorite: "0.9" });
}

/* --- Rendez-vous --- */
{
  const ar = filAriane([{ nom: "Prendre rendez-vous", path: "/rendez-vous" }]);
  const p = {
    id: "rdv",
    path: "/rendez-vous",
    title: "Prendre rendez-vous avec un couvreur à Frontignan | ARVÉO",
    description: "Prenez rendez-vous pour un diagnostic de toiture gratuit à Frontignan et alentours. Choisissez une date et un créneau, nous confirmons par téléphone.",
    jsonld: [ldEntreprise(), ar.ld],
  };
  const html =
    head(p) +
    enTetePage({ surTitre: "Rendez-vous", h1: "Prendre rendez-vous pour un diagnostic", chapo: "Choisissez une date et un créneau, nous vous rappelons pour confirmer l'heure. Le diagnostic et le devis sont gratuits.", ariane: ar.html }) +
    `
    <section class="section section--claire" id="formulaire" aria-label="Formulaire de rendez-vous">
      <div class="conteneur formulaire-page">
        ${formRdv()}
        <aside class="formulaire-page__cote">
          <div class="cote-carte">
            <h2>Pendant le diagnostic</h2>
            <ul class="liste-coches">
              <li>${ico("coche")}Contrôle des tuiles, faîtage et rives</li>
              <li>${ico("coche")}Vérification de la zinguerie</li>
              <li>${ico("coche")}Inspection des combles si accessibles</li>
              <li>${ico("coche")}Conseils et devis gratuit</li>
            </ul>
          </div>
          ${APRES_DEMANDE}
        
        </aside>
      </div>
    </section>
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire("rendez-vous.html", html, { path: "/rendez-vous", priorite: "0.8" });
}

/* --- Contact --- */
{
  const ar = filAriane([{ nom: "Contact", path: "/contact" }]);
  const a = S.adresse;
  const p = {
    id: "contact",
    path: "/contact",
    title: "Contacter ARVÉO, couvreur à Frontignan",
    description: `Contactez ARVÉO, couvreur zingueur à Frontignan, par téléphone au ${S.telephone}, par e-mail ou en ligne pour un devis, un dépannage ou un rendez-vous.`,
    jsonld: [ldEntreprise(), ar.ld],
  };
  const html =
    head(p) +
    enTetePage({ surTitre: "Contact", h1: "Contactez votre couvreur à Frontignan", chapo: "Une question, un projet ou une urgence ? Choisissez le moyen le plus simple pour vous, nous répondons dans la journée.", ariane: ar.html }) +
    `
    <section class="section section--claire">
      <div class="conteneur">
        <ul class="cta-final__liens cta-final__liens--clair">
          <li><a href="${TEL}" data-track="call"><strong class="mono">${esc(S.telephone)}</strong><span>${esc(S.horaires.texte)}</span>${ico("fleche")}</a></li>
          <li><a href="/depannage-toiture" data-track="depannage"><strong>Dépannage urgent</strong><span>Formulaire détaillé avec photos</span>${ico("fleche")}</a></li>
          <li><a href="/devis-toiture" data-track="devis"><strong>Devis gratuit</strong><span>Décrivez votre projet</span>${ico("fleche")}</a></li>
          <li><a href="/rendez-vous" data-track="rdv"><strong>Rendez-vous</strong><span>Diagnostic de toiture</span>${ico("fleche")}</a></li>
        </ul>
        <div class="formulaire-page">
          ${formContact()}
          <aside class="formulaire-page__cote">
            <div class="cote-carte">
              <h2>ARVÉO</h2>
              <address>${[confirme(a.rue), `${a.codePostal} ${a.ville}`].filter(Boolean).join("<br>")}<br><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></address>
              <p>${esc(S.horaires.texte)}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>` +
    pied() +
    FIN_PAGE(false);
  ecrire("contact.html", html, { path: "/contact", priorite: "0.6" });
}

/* --- À propos --- */
{
  const ar = filAriane([{ nom: "À propos", path: "/a-propos" }]);
  const p = {
    id: "apropos",
    path: "/a-propos",
    title: "À propos d'ARVÉO, couvreur zingueur à Frontignan",
    description: "ARVÉO, couvreur zingueur installé à Frontignan. Nos engagements, notre façon de travailler et notre zone d'intervention autour de l'étang de Thau.",
    jsonld: [ldEntreprise(), ar.ld],
  };
  const html =
    head(p) +
    enTetePage({ surTitre: "À propos", h1: "Un couvreur d'ici, pour les toitures d'ici", chapo: "ARVÉO est une entreprise de couverture et de zinguerie installée à Frontignan. Notre métier, garder votre maison au sec durablement.", ariane: ar.html }) +
    `
    <section class="section section--claire">
      <div class="conteneur article">
        <div class="article__corps">
          <h2>Notre façon de travailler</h2>
          <p>Une toiture se répare dans les règles de l'art. On trouve la cause avant de traiter le symptôme, on explique ce qu'on fait et on annonce le prix avant de commencer.</p>
          <p>Entre la tramontane, le vent marin et les orages d'automne, les toitures du littoral héraultais travaillent dur. On choisit les matériaux, les fixations et la ventilation de la couverture en fonction de l'exposition de chaque maison.</p>
          <h2>Nos engagements</h2>
          <ul class="engagements">
            <li>${ico("tel")}<div><h3>On répond et on rappelle</h3><p>Chaque demande reçoit une réponse, et un rappel dans la journée.</p></div></li>
            <li>${ico("devis")}<div><h3>Un prix avant de commencer</h3><p>Un devis écrit, détaillé et gratuit. Pas de mauvaise surprise.</p></div></li>
            <li>${ico("bouclier")}<div><h3>Des travaux assurés</h3><p>Nos travaux de couverture sont couverts par une garantie décennale.</p></div></li>
            <li>${ico("toit")}<div><h3>Un chantier propre</h3><p>Gravats évacués, gouttières nettoyées, toiture contrôlée avec vous.</p></div></li>
          </ul>
        </div>
        <aside class="article__cote">
          <div class="cote-carte cote-carte--sombre">
            <h2>Parlons de votre toiture</h2>
            <a class="bouton bouton--orange" href="/rendez-vous" data-track="rdv">${ico("agenda")}Prendre rendez-vous</a>
          </div>
        </aside>
      </div>
    </section>
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire("a-propos.html", html, { path: "/a-propos", priorite: "0.5" });
}

/* --- Avis --- */
if (avecAvis) {
  const ar = filAriane([{ nom: "Avis clients", path: "/avis" }]);
  const p = {
    id: "avis",
    path: "/avis",
    title: "Avis clients d'ARVÉO, couvreur à Frontignan",
    description: "Les avis Google des clients d'ARVÉO, couvreur zingueur à Frontignan et alentours.",
    jsonld: [ldEntreprise(), ar.ld],
  };
  const html =
    head(p) +
    enTetePage({ surTitre: "Avis clients", h1: "Ce que disent nos clients", chapo: "Les avis laissés par nos clients sur notre fiche Google.", ariane: ar.html }) +
    avisHtml() +
    `
    <section class="section">
      <div class="conteneur actions actions--centre">
        ${S.liens.avisGoogle ? `<a class="bouton bouton--orange" href="${esc(S.liens.avisGoogle)}" rel="noopener">Laisser un avis sur Google</a>` : ""}
        ${S.liens.googleBusiness ? `<a class="bouton bouton--contour" href="${esc(S.liens.googleBusiness)}" rel="noopener">Voir notre fiche Google</a>` : ""}
      </div>
    </section>
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire("avis.html", html, { path: "/avis", priorite: "0.5" });
} else {
  fs.rmSync(path.join(RACINE, "avis.html"), { force: true });
  avertissements.push("Page Avis non générée : ajoutez de vrais avis dans config.avis ou le lien de la fiche Google.");
}

/* --- Pages légales --- */
{
  const L = S.legal;
  const a = S.adresse;
  const legal = (id, pathP, titre, contenu) => {
    const ar = filAriane([{ nom: titre, path: pathP }]);
    const p = { id, path: pathP, title: `${titre} | ${S.nom}`, description: `${titre} du site ${S.nom}, couvreur zingueur à Frontignan (Hérault). Éditeur, hébergement, données personnelles et vos droits.`, jsonld: [ar.ld] };
    return (
      head(p) +
      `
    <section class="section section--claire">
      <div class="conteneur conteneur--etroit texte-legal">
        ${ar.html}
        <h1>${esc(titre)}</h1>
        ${contenu}
      </div>
    </section>` +
      pied() +
      FIN_PAGE(false)
    );
  };
  ecrire(
    "mentions-legales.html",
    legal(
      "legal",
      "/mentions-legales",
      "Mentions légales",
      `<h2>Éditeur du site</h2>
        <p>${esc(L.raisonSociale)}<br>${[esc(fiable("adresse.rue")), `${esc(a.codePostal)} ${esc(a.ville)}`].filter(Boolean).join("<br>")}<br>SIRET ${esc(fiable("legal.siret") || "en cours de renseignement")}<br>Téléphone ${esc(S.telephone)}<br>E-mail ${esc(S.email)}<br>Directeur de la publication ${esc(fiable("legal.directeurPublication") || "en cours de renseignement")}</p>
        <h2>Assurance professionnelle</h2>
        <p>Assurance responsabilité civile décennale ${esc(fiable("legal.assuranceDecennale") || "en cours de renseignement")}. Couverture géographique, France.</p>
        <h2>Hébergement</h2>
        <p>${esc(L.hebergeur)}</p>
        <h2>Conception</h2>
        <p>Site réalisé par <a href="${esc(S.agence.url)}">${esc(S.agence.nom)}</a>.</p>
        <h2>Propriété intellectuelle</h2>
        <p>Les textes, le logo et les illustrations de ce site appartiennent à ${esc(S.nom)}. Toute reproduction sans autorisation est interdite.</p>`
    ),
    { path: "/mentions-legales", priorite: "0.2" }
  );
  ecrire(
    "confidentialite.html",
    legal(
      "legal",
      "/confidentialite",
      "Politique de confidentialité",
      `<h2>Données collectées</h2>
        <p>Les formulaires du site (dépannage, devis, rendez-vous, rappel, contact) recueillent les informations que vous saisissez, à savoir votre nom, vos coordonnées, adresse de l'intervention, description et photos de la toiture.</p>
        <h2>Utilisation</h2>
        <p>Ces données servent uniquement à traiter votre demande et à vous recontacter. Elles sont transmises par e-mail à ${esc(S.nom)} et ne sont ni revendues ni utilisées à des fins publicitaires.</p>
        <h2>Durée de conservation</h2>
        <p>Les demandes sont conservées le temps de les traiter, puis au maximum trois ans après le dernier contact, sauf obligation légale (devis et factures).</p>
        <h2>Vos droits</h2>
        <p>Vous pouvez accéder à vos données, les rectifier ou demander leur suppression en écrivant à <a href="mailto:${esc(S.email)}">${esc(S.email)}</a>. Vous pouvez aussi saisir la CNIL (cnil.fr).</p>
        <h2>Cookies</h2>
        <p>Ce site n'utilise pas de cookie publicitaire ni de mesure d'audience. Le stockage local du navigateur sert seulement à ne pas rejouer l'animation d'accueil.</p>`
    ),
    { path: "/confidentialite", priorite: "0.2" }
  );
}

/* --- 404 --- */
{
  const p = { id: "404", path: "/404", noindex: true, title: `Page introuvable | ${S.nom}`, description: "Cette page n'existe pas ou a été déplacée.", jsonld: [] };
  ecrire(
    "404.html",
    head(p) +
      `
    <section class="tete-page">
      <div class="conteneur tete-page__grille tete-page__grille--seule">
        <div class="tete-page__texte">
          <h1>Cette page s'est envolée.</h1>
          <p class="chapeau">Elle n'existe pas ou a été déplacée. Votre toiture, elle, peut compter sur nous.</p>
          ${actions({ clair: true })}
          <p><a class="lien-fleche lien-fleche--clair" href="/">Retour à l'accueil ${ico("fleche")}</a></p>
        </div>
      </div>
    </section>` +
      pied() +
      FIN_PAGE(false)
  );
}

/* --- Feuille de style compressée (styles.css reste la source à modifier) --- */

{
  const css = fs
    .readFileSync(path.join(RACINE, "styles.css"), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{};,])\s*/g, "$1")
    .replace(/:\s+/g, ":")
    .replace(/;}/g, "}")
    .trim();
  fs.writeFileSync(path.join(RACINE, "styles.min.css"), css);
}

/* --- Sitemap et robots --- */

fs.writeFileSync(
  path.join(RACINE, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${urlPage(p.path)}</loc><lastmod>${AUJOURDHUI}</lastmod><priority>${p.priorite}</priority></url>`).join("\n")}
</urlset>
`
);
fs.writeFileSync(path.join(RACINE, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${BASE}/sitemap.xml\n`);

/* --- Bilan --- */

{
  const LEGAL_CONTACT = ["telephone", "email", "adresse.rue", "legal.raisonSociale", "legal.siret", "legal.assuranceDecennale", "legal.directeurPublication", "siteUrl"];
  const bloquants = LEGAL_CONTACT.filter(provisoire);
  const lignes = [...A_CONFIRMER.entries()].map(([k, note]) => `config.${k}${note ? ` (${note})` : ""}${k === "telephone" && provisoire("telephone") ? " [numéro fictif, omis du JSON-LD]" : ""}`);
  for (const k of ["telephone", "legal.siret", "confiance.experience"]) if (provisoire(k) && !A_CONFIRMER.has(k)) lignes.push(`config.${k} (valeur bouche-trou)`);
  avertissements.unshift(...lignes);
  if (S.production && bloquants.length) {
    console.error(`\nÉchec du build en mode production : informations légales ou de contact provisoires.\n- ${bloquants.map((k) => "config." + k).join("\n- ")}`);
    process.exit(1);
  }
}

console.log(`${pages.length + 1} pages générées, sitemap.xml et robots.txt à jour.`);
if (avertissements.length) console.log(`\nÀ compléter avant la mise en ligne (${avertissements.length}) :\n- ` + avertissements.join("\n- "));
