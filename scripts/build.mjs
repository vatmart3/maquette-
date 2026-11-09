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
import { controler } from "./qa.mjs";
import { CHANTIERS } from "./chantiers.mjs";
import { PRIX, PRIX_HUB } from "./prix.mjs";
import { SECTEURS } from "./secteurs.mjs";
import { VILLES_HERAULT } from "./communes-herault.mjs";
import { ARTICLES } from "./articles.mjs";
import { genererOG } from "./og.mjs";
import crypto from "node:crypto";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(RACINE, "config.js"), "utf8"), ctx);
const S = ctx.window.SITE;
if (process.env.ARVEO_PRODUCTION === "1") S.production = true; // test du mode production sans modifier config.js
const BASE = S.siteUrl.replace(/\/$/, "");
const AUJOURDHUI = new Date().toISOString().slice(0, 10);
// sharp (npm install --prefix scripts) sert aux images de partage ; sans lui, og.png commun.
const OG_DISPO = await import("sharp").then(() => true, () => false);
const OG_A_GENERER = [];
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
    if (ouvre) {
      const note = ligne.match(/\/\/\s*À CONFIRMER\s*:?\s*(.*)$/);
      if (note) cles.set([...pile, ouvre[1]].filter((k) => k !== "SITE").join("."), note[1].trim());
      pile.push(ouvre[1]);
      continue;
    }
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

// Texte enrichi : typographie française + liens internes écrits [ancre](/chemin).
const riche = (t) => fr(t).replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, (_, ancre, href) => `<a href="${href}">${ancre}</a>`);
const enumerer = (l) => (l.length < 2 ? l.join("") : `${l.slice(0, -1).join(", ")} et ${l[l.length - 1]}`);

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
// Premier titre de la liste qui tient dans les 60 caractères recommandés.
// Nom de l'image de partage d'une page (img/og/<nom>.png).
const ogNom = (p) => (p === "/" ? "accueil" : p.slice(1).replace(/\//g, "-"));
const titreCourt = (variantes) => variantes.find((t) => [...t].length <= 60) || variantes[variantes.length - 1];

/* Photos de chantier (préparées par scripts/photos.mjs ; manifeste vide = aucune section photo). */
const PHOTOS = (() => {
  const f = path.join(RACINE, "img", "chantiers", "photos.json");
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : [];
})();

// Secteurs actifs (config.secteurs) : seules leurs communes ont une page.
const SECTEURS_ACTIFS = Array.isArray(S.secteurs) && S.secteurs.length ? S.secteurs : SECTEURS.map((x) => x.slug);
const SECTEURS_PAGES = SECTEURS.filter((x) => SECTEURS_ACTIFS.includes(x.slug)).map((x) => ({ ...x, path: `/secteur/${x.slug}` }));
const VILLES_PAGES = [...VILLES, ...VILLES_HERAULT]
  .filter((v) => SECTEURS_ACTIFS.includes(v.secteur || "bassin-de-thau"))
  .map((v) => ({ ...v, secteur: v.secteur || "bassin-de-thau", slug: slug(v.nom), path: `/couvreur/${slug(v.nom)}` }));
// Communes voisines : les 6 plus proches à vol d'oiseau.
const distanceKm = (a, b) => {
  const r = Math.PI / 180;
  const h = Math.sin(((b.lat - a.lat) * r) / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lng - a.lng) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};
for (const v of VILLES_PAGES) v.voisines = VILLES_PAGES.filter((w) => w !== v).sort((x, y) => distanceKm(v, x) - distanceKm(v, y)).slice(0, 6);
const VILLES_THAU = VILLES_PAGES.filter((v) => v.secteur === "bassin-de-thau");
const HERAULT = { "@type": "AdministrativeArea", name: "Hérault", containedInPlace: { "@type": "AdministrativeArea", name: "Occitanie" } };
const zoneDesservie = () => [HERAULT, ...VILLES_PAGES.map((v) => ({ "@type": "City", name: v.nom }))];
// Libellés de la case « Type de travaux » du formulaire de devis (pré-remplissage ?travaux=).
const DEVIS_LIBELLES = ["Réparation / fuite", "Réfection de toiture", "Remplacement de tuiles", "Faîtage et rives", "Fenêtre de toit", "Isolation de toiture", "Étanchéité de toit terrasse", "Démoussage / traitement", "Zinguerie / gouttières", "Charpente", "Autre"];
const DEVIS_SERVICE = { "refection-toiture": "Réfection de toiture", "recherche-de-fuite": "Réparation / fuite", "demoussage-toiture": "Démoussage / traitement", "zinguerie-gouttieres": "Zinguerie / gouttières", charpente: "Charpente", "bachage-urgence": "Réparation / fuite" };
// Seuls les services listés dans config.servicesActifs sont générés et liés.
const ACTIFS = Array.isArray(S.servicesActifs) && S.servicesActifs.length ? S.servicesActifs : SERVICES.map((s) => s.slug);
const SERVICES_PAGES = SERVICES.filter((s) => ACTIFS.includes(s.slug)).map((s) => {
  const devis = DEVIS_SERVICE[s.slug] || s.devis;
  return { ...s, path: `/services/${s.slug}`, devis: DEVIS_LIBELLES.includes(devis) ? devis : "Autre" };
}).sort((a, b) => ACTIFS.indexOf(a.slug) - ACTIFS.indexOf(b.slug));
const serviceActif = (slug) => SERVICES_PAGES.some((s) => s.slug === slug);

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
  { id: "prix", href: "/prix-toiture", texte: "Prix" },
  { id: "apropos", href: "/a-propos", texte: "À propos" },
  { id: "contact", href: "/contact", texte: "Contact" },
];
// Seuls les vrais avis complets sont publiés : texte exact, auteur, date et source Google.
const AVIS = (S.avis || []).filter((a) => a.texte && a.auteur && /^\d{4}-\d{2}(-\d{2})?$/.test(a.date || "") && a.source === "Google" && a.note >= 1 && a.note <= 5);
const avecAvis = AVIS.length > 0;
const avecRealisations = CHANTIERS.length > 0;
if (avecRealisations) NAV.splice(1, 0, { id: "realisations", href: "/realisations", texte: "Réalisations" });
if (avecAvis) NAV.splice(3, 0, { id: "avis", href: "/avis", texte: "Avis" });

function logo(clair = false) {
  return `<a class="logo${clair ? " logo--clair" : ""}" href="/">
        <img class="logo__marque" src="/img/arveo-mark.svg" alt="" role="presentation" width="68" height="36">
        <span class="logo__texte"><span class="logo__nom">${esc(S.nom)}</span><span class="logo__activite">Couvreur à ${esc(S.adresse.ville)} <span class="logo__suite">&amp; ses alentours</span></span></span>
      </a>`;
}

// Image de partage propre à la page (services, communes, secteurs, prix, conseils, hub).
function imageOG(p) {
  const types = [
    [/^\/services\//, "Service"],
    [/^\/couvreur\//, "Couvreur dans l'Hérault"],
    [/^\/secteur\//, "Secteur d'intervention"],
    [/^\/prix/, "Prix indicatifs"],
    [/^\/conseils\/./, "Conseil de couvreur"],
    [/^\/zone-intervention$/, "Zone d'intervention"],
  ];
  const t = types.find(([re]) => re.test(p.path));
  const titre = p.og?.titre || p.title.replace(/\s*\|\s*ARVÉO$/, "");
  if (!t || !OG_DISPO || p.noindex) return { url: `${BASE}/og.png`, alt: "ARVÉO, couvreur à Frontignan, réparation, réfection et dépannage de toiture" };
  const nom = ogNom(p.path);
  OG_A_GENERER.push({ nom, titre, type: p.og?.type || t[1], sousTitre: "Couvreur zingueur à Frontignan, dans tout l'Hérault", pied: new URL(BASE).host });
  return { url: `${BASE}/img/og/${nom}.png`, alt: `${titre}, ARVÉO couvreur zingueur à Frontignan` };
}

// Mesure d'audience sans cookie (config.statistiques), injectée seulement si elle est renseignée.
function statistiques() {
  const st = S.statistiques || {};
  if (st.fournisseur === "plausible" && st.domaine)
    return `
  <script defer data-domain="${esc(st.domaine)}" src="${esc(st.script || "https://plausible.io/js/script.js")}"></script>
  <script>window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}</script>`;
  if (st.fournisseur === "umami" && st.id) return `
  <script defer src="${esc(st.script || "https://cloud.umami.is/script.js")}" data-website-id="${esc(st.id)}"></script>`;
  return "";
}

function head(p) {
  const og = imageOG(p);
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
  <meta property="og:type" content="${p.article ? "article" : "website"}">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:site_name" content="${esc(S.nom)}">
  <meta property="og:title" content="${esc(p.ogTitle || p.title)}">
  <meta property="og:description" content="${esc(p.description)}">
  <meta property="og:url" content="${urlPage(p.path)}">
  <meta property="og:image" content="${og.url}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(og.alt)}">${p.article ? `
  <meta property="article:published_time" content="${p.article.publie}">
  <meta property="article:modified_time" content="${p.article.maj || p.article.publie}">` : ""}
  <meta name="twitter:card" content="summary_large_image">${scene}
${ld}
  <script src="/config.js" defer></script>
  <script src="/site.js" defer></script>${statistiques()}
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
  return `<div class="actions" data-commun>
          <a class="bouton bouton--orange" href="${TEL}" data-track="call">${ico("tel")}Appeler le <span class="mono">${esc(S.telephone)}</span></a>
          <a class="bouton ${clair ? "bouton--contour-clair" : "bouton--contour"}" href="${sec.href}" data-track="${sec.track}">${ico(sec.icone)}${sec.texte}</a>
        </div>`;
}

function coches(liste, clair = false) {
  return `<p class="garanties${clair ? " garanties--clair" : ""}" data-commun>${liste.filter(Boolean).map((t) => `<span>${esc(t)}</span>`).join("")}</p>`;
}

const CONFIANCE = [S.confiance.devisGratuit, S.confiance.rappel, confirme(S.confiance.decennale)];

function bandeauCta(titre = "Un problème de toiture ?", texte = "Appelez-nous, faites une demande de dépannage ou prenez rendez-vous pour un diagnostic gratuit.") {
  return `
    <section class="cta-final" aria-labelledby="titre-cta" data-commun>
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
        <p>${esc(S.activite)} à ${esc(a.ville)}, intervention dans tout l'Hérault. ${esc(S.slogan)} pour les particuliers, les syndics et les professionnels.</p>
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
          ${SECTEURS_PAGES.map((x) => `<li><a href="${x.path}">Couvreur ${esc(x.nom)}</a></li>`).join("\n          ")}
          ${["Frontignan", "Sète", "Montpellier", "Béziers"].map((n) => VILLES_PAGES.find((v) => v.nom === n)).filter(Boolean).map((v) => `<li><a href="${v.path}">Couvreur à ${esc(v.nom)}</a></li>`).join("\n          ")}
        </ul>
      </div>
    </div>
    <div class="conteneur pied__bas">
      <ul>
        <li><a href="/devis-toiture">Devis gratuit</a></li>
        <li><a href="/rendez-vous">Rendez-vous</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/zone-intervention">Zone d'intervention</a></li>
        <li><a href="/prix-toiture">Prix</a></li>
        <li><a href="/conseils">Conseils</a></li>
        ${avecRealisations ? '<li><a href="/realisations">Réalisations</a></li>' : ""}
        <li><a href="/mentions-legales">Mentions légales</a></li>
        <li><a href="/confidentialite">Confidentialité</a></li>
      </ul>
      <p>© ${new Date().getFullYear()} ${esc(S.nom)}. Site réalisé par <a href="${esc(S.agence.url)}">${esc(S.agence.nom)}</a></p>
    </div>
  </footer>

  <a class="logo-fixe" href="/" aria-label="${esc(S.nom)}, retour à l'accueil"><img src="/img/arveo-mark.svg" alt="" role="presentation" width="64" height="34"></a>

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
    areaServed: zoneDesservie(),
    openingHoursSpecification: fiable("horaires.texte")
      ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: S.horaires.jours, opens: S.horaires.ouverture, closes: S.horaires.fermeture }]
      : undefined,
    slogan: S.slogan,
    foundingDate: fiable("fondation"),
    priceRange: fiable("gammePrix"),
    paymentAccepted: fiable("paiements") && S.paiements.join(", "),
    knowsAbout: ["Couverture", "Zinguerie", "Charpente", "Tuiles canal", "Gouttières en zinc", ...SERVICES_PAGES.map((s) => s.nom)],
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
  if (AVIS.length) {
    const moy = AVIS.reduce((t, a) => t + a.note, 0) / AVIS.length;
    o.aggregateRating = { "@type": "AggregateRating", ratingValue: moy.toFixed(1), reviewCount: AVIS.length, bestRating: 5, worstRating: 1 };
    o.review = AVIS.slice(0, 10).map((a) => ({
      "@type": "Review",
      author: { "@type": "Person", name: a.auteur },
      datePublished: a.date,
      reviewBody: a.texte,
      reviewRating: { "@type": "Rating", ratingValue: a.note, bestRating: 5, worstRating: 1 },
      publisher: { "@type": "Organization", name: "Google" },
    }));
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
    areaServed: zone ? { "@type": "City", name: zone } : zoneDesservie(),
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
          <h2 class="sr">Formulaire de demande de devis</h2>
          ${piege}
          ${bloc("01", "Votre projet", `
            ${choix({ legende: "Type de travaux", name: "travaux", options: DEVIS_LIBELLES, requis: true, message: "Cochez au moins un type de travaux.", colonnes: "2" })}
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
          <h2 class="sr">Formulaire de demande de rendez-vous</h2>
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
          <h2 class="sr">Formulaire de contact</h2>
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

const APRES_DEMANDE = `<div class="cote-carte" data-commun>
            <h2>Après votre demande</h2>
            <ol class="suite-demande">
              <li><span class="mono">01</span><span><strong>Réception immédiate</strong>Votre demande arrive directement chez ARVÉO.</span></li>
              <li><span class="mono">02</span><span><strong>Rappel dans la journée</strong>On fait le point avec vous par téléphone.</span></li>
              <li><span class="mono">03</span><span><strong>Visite et devis</strong>Diagnostic sur place, prix écrit avant tout travail.</span></li>
            </ol>
          </div>
          <div class="cote-carte" data-commun>
            <h2>Une urgence ?</h2>
            <p>Fuite active ou tuiles envolées, utilisez plutôt la demande de dépannage.</p>
            <a class="lien-fleche" href="/depannage-toiture" data-track="depannage">Demande de dépannage ${ico("fleche")}</a>
          </div>`;

// Sections de texte {h2, p: [], liste: []}, liens internes autorisés.
const sectionsHtml = (sections = []) =>
  sections
    .map(
      (sec) => `<h2>${fr(sec.h2)}</h2>
          ${(sec.p || []).map((t) => `<p>${riche(t)}</p>`).join("\n          ")}
          ${sec.liste ? `<ul class="liste-coches">${sec.liste.map((t) => `<li>${ico("coche")}${riche(t)}</li>`).join("")}</ul>` : ""}`
    )
    .join("\n          ");

function faqHtml(liste, titre = "Vos questions") {
  return `
    <section class="section" aria-labelledby="titre-faq">
      <div class="conteneur faq-bloc">
        <div class="faq-bloc__intro" data-commun>
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
    ...SERVICES_PAGES.map((s) => ({ cle: s.slug, path: s.path, nom: s.nom, resume: s.resume })),
  ].filter((c) => c.path !== exclure);
  return `<ul class="prestations">
          ${lignes
            .map(
              (c) => `<li class="prestation${c.urgent ? " prestation--urgent" : ""}"><a href="${c.path}"><span class="prestation__nom">${esc(c.nom)}</span><span class="prestation__resume">${fr(c.resume || RESUMES[c.cle])}</span>${ico("fleche", "ico prestation__fleche")}</a></li>`
            )
            .join("\n          ")}
        </ul>`;
}

function listeVilles(exclure) {
  return `<ul class="villes">
          ${VILLES_THAU.filter((v) => v.nom !== exclure)
            .map((v) => `<li><a href="${v.path}">Couvreur à ${esc(v.nom)}</a></li>`)
            .join("\n          ")}
        </ul>`;
}

function avisHtml() {
  if (!AVIS.length) return "";
  return `
    <section class="section section--claire" aria-labelledby="titre-avis">
      <div class="conteneur">
        <h2 id="titre-avis">Ce que disent nos clients</h2>
        <ul class="avis">
          ${AVIS
            .slice(0, 6)
            .map(
              (a) => `<li class="avis__carte">
            <p class="avis__note" aria-label="${a.note || 5} sur 5">${"★".repeat(a.note || 5)}</p>
            <blockquote><p>« ${esc(a.texte)} »</p></blockquote>
            <p class="avis__auteur">${esc(a.auteur)}${a.ville ? `, <span>${esc(a.ville)}</span>` : ""} · <time datetime="${a.date}">${esc(a.date.split("-").reverse().join("/"))}</time>, avis Google</p>
          </li>`
            )
            .join("\n          ")}
        </ul>
        ${S.liens.googleBusiness ? `<p><a class="lien-fleche" href="${esc(S.liens.googleBusiness)}" rel="noopener">Voir tous nos avis sur Google ${ico("fleche")}</a></p>` : ""}
      </div>
    </section>`;
}

function enTetePage({ h1, chapo, ariane, rappel, illustration = true, ancre = "", apres = "" }) {
  return `
    <section class="tete-page">
      ${illustration ? '<img class="tete-page__dessin" src="/img/toiture.svg" alt="" width="1440" height="900" aria-hidden="true">' : ""}
      <div class="conteneur tete-page__grille${rappel ? "" : " tete-page__grille--seule"}">
        <div class="tete-page__texte">
          ${ariane}
          <h1>${fr(h1)}</h1>
          <p class="chapeau">${fr(chapo)}</p>
          ${apres}
          ${actions({ clair: true, ancre })}
          ${coches(CONFIANCE, true)}
        </div>
        ${rappel ? `<div class="tete-page__carte">${rappel}</div>` : ""}
      </div>
    </section>`;
}

/* --- Photos de chantier --- */

const nomCommune = (s) => VILLES_PAGES.find((v) => v.slug === s)?.nom || s.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
const nomService = (s) => (s === "depannage-toiture" ? "Dépannage de toiture" : SERVICES_PAGES.find((x) => x.slug === s)?.nom || s.replace(/-/g, " "));
const altPhoto = (ph) => `${nomService(ph.service)} à ${nomCommune(ph.commune)}${ph.description ? `, ${ph.description}` : ""}`;
const photosDe = ({ commune, service, liste } = {}) =>
  PHOTOS.filter((ph) => (liste ? liste.includes(ph.original) || liste.includes(ph.versions[1280].src.split("/").pop()) : (!commune || ph.commune === commune) && (!service || ph.service === service)));

function galerie(photos, titre, idTitre = "titre-photos") {
  if (!photos.length) return "";
  return `
    <section class="section" aria-labelledby="${idTitre}">
      <div class="conteneur">
        <h2 id="${idTitre}">${fr(titre)}</h2>
        <ul class="photos">
          ${photos
            .slice(0, 9)
            .map(
              (ph) => `<li><figure>
            <img src="${ph.versions[480].src}" srcset="${ph.versions[480].src} ${ph.versions[480].largeur}w, ${ph.versions[1280].src} ${ph.versions[1280].largeur}w" sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px" width="${ph.largeur}" height="${ph.hauteur}" alt="${esc(altPhoto(ph))}" loading="lazy" decoding="async">
            <figcaption>${fr(altPhoto(ph))}</figcaption>
          </figure></li>`
            )
            .join("\n          ")}
        </ul>
      </div>
    </section>`;
}

const ldImages = (photos, ville) =>
  photos.map((ph) =>
    nettoyer({
      "@context": "https://schema.org",
      "@type": "ImageObject",
      contentUrl: BASE + ph.versions[1280].src,
      url: BASE + ph.versions[1280].src,
      width: ph.largeur,
      height: ph.hauteur,
      caption: altPhoto(ph),
      contentLocation: ville ? { "@type": "City", name: ville } : undefined,
      creditText: S.nom,
      copyrightNotice: S.nom,
    })
  );

/* --- Réalisations --- */

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const REALISATIONS = CHANTIERS.map((c) => ({ ...c, path: `/realisations/${c.slug}`, date: `${MOIS[c.mois - 1]} ${c.annee}` })).sort(
  (a, b) => b.annee - a.annee || b.mois - a.mois
);
const titreChantier = (c) => `${nomService(c.service)} à ${nomCommune(c.commune)}`;

function listeRealisations(liste, titre, idTitre = "titre-realisations") {
  if (!liste.length) return "";
  return `
    <section class="section" aria-labelledby="${idTitre}">
      <div class="conteneur">
        <h2 id="${idTitre}">${fr(titre)}</h2>
        <ul class="liste-liens liste-liens--simple">
          ${liste.map((c) => `<li><a href="${c.path}">${ico("coche")}<span>${esc(titreChantier(c))}, ${esc(c.date)}</span></a></li>`).join("\n          ")}
        </ul>
      </div>
    </section>`;
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

const pages = [];
const GENERES = []; // toutes les pages écrites, pour le contrôle qualité
const ecrire = (fichier, html, meta) => {
  const f = path.join(RACINE, fichier);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
  if (meta) pages.push(meta);
  GENERES.push({ fichier, path: meta?.path || "/" + fichier.replace(/\.html$/, ""), html, indexable: !!meta && !/name="robots" content="noindex/.test(html) });
};

/* --- Accueil --- */

const ZONES_VISITE = [
  { titre: "Couverture et tuiles", aussi: ["remplacement-tuiles", "faitage-rives"], texte: "Tuiles canal, romanes ou mécaniques, faîtage, rives et génoises. On répare un pan ou on refait toute la couverture.", lien: "/services/refection-toiture", devis: "Réfection de toiture" },
  { titre: "Charpente", aussi: ["isolation-toiture"], texte: "Chevrons, pannes et liteaux portent vos tuiles. On les contrôle et on les renforce.", lien: "/services/charpente", devis: "Charpente" },
  { titre: "Zinguerie", texte: "Gouttières, descentes et noues en zinc éloignent l'eau de vos murs et de vos façades.", lien: "/services/zinguerie-gouttieres", devis: "Zinguerie / gouttières" },
  { titre: "Fuites et étanchéité", aussi: ["fenetre-de-toit", "etancheite-toit-terrasse", "bachage-urgence"], texte: "Solin de cheminée, fenêtre de toit, tuile cassée. On trouve d'où vient l'eau avant de réparer.", lien: "/services/recherche-de-fuite", devis: "Réparation / fuite" },
  { titre: "Démoussage et entretien", texte: "Un nettoyage et un traitement contre mousses et lichens prolongent la vie de la toiture.", lien: "/services/demoussage-toiture", devis: "Démoussage / traitement" },
];

{
  const p = {
    id: "accueil",
    path: "/",
    scene: true,
    title: "Couvreur à Frontignan, réparation de toiture | ARVÉO",
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
              ${(z.aussi || []).filter(serviceActif).length ? `<p class="fiche__aussi">Voir aussi ${enumerer(z.aussi.filter(serviceActif).map((k) => { const x = SERVICES_PAGES.find((y) => y.slug === k); return `<a href="${x.path}">${esc(x.court.toLowerCase())}</a>`; }))}</p>` : ""}
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
          <p class="texte">Installés à Frontignan, nous intervenons chaque jour autour de l'étang de Thau, de Sète à Mèze et Villeneuve-lès-Maguelone. Plus loin, à Montpellier, Béziers, Agde ou Lunel, nous venons sur rendez-vous, partout dans l'Hérault.</p>
          <a class="lien-fleche" href="/zone-intervention">Voir les secteurs de l'Hérault ${ico("fleche")}</a>
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

/* --- Prix indicatifs --- */

const uniteTexte = (u) => (u === "m²" ? "le m²" : u === "intervention" ? "l'intervention" : u === "ml" ? "le mètre linéaire" : `par ${u}`);
const euros = (n) => new Intl.NumberFormat("fr-FR").format(n).replace(/ | /g, " ");
const fourchette = (x) => `${euros(x.bas)} à ${euros(x.haut)} €`;
const PRIX_PAGES = PRIX.filter((x) => x.service === "depannage-toiture" || serviceActif(x.service)).map((x) => ({ ...x, path: `/prix/${x.slug}` }));
const MENTION_PRIX = "Prix indicatifs TTC, main-d'œuvre comprise, à confirmer après visite et devis écrit.";

function ldPrix(x) {
  const service = SERVICES_PAGES.find((s) => s.slug === x.service);
  return nettoyer({
    "@context": "https://schema.org",
    "@type": "Service",
    name: x.nom,
    serviceType: x.nom,
    url: urlPage(x.path),
    provider: { "@id": ENTREPRISE_ID },
    areaServed: { "@type": "AdministrativeArea", name: "Hérault" },
    isRelatedTo: service ? { "@type": "Service", name: service.nom, url: urlPage(service.path) } : undefined,
    // Aucun prix publié pour Google tant que la fourchette n'est pas validée par ARVÉO.
    offers: x.valide
      ? {
          "@type": "Offer",
          priceCurrency: "EUR",
          priceSpecification: { "@type": "PriceSpecification", minPrice: x.bas, maxPrice: x.haut, priceCurrency: "EUR", valueAddedTaxIncluded: true },
        }
      : undefined,
  });
}

function blocPrixService(s) {
  const x = PRIX_PAGES.find((y) => y.service === s.slug);
  if (!x) return "";
  return `<div class="combien">
            <h2>Combien ça coûte ?</h2>
            <p class="combien__montant"><span class="mono">${fourchette(x)}</span> ${uniteTexte(x.unite)}</p>
            <p>${MENTION_PRIX} Le prix exact dépend de l'accès, de l'état de la toiture et des matériaux.</p>
            <a class="lien-fleche" href="${x.path}">Le détail des prix, ${esc(x.nom.toLowerCase())} ${ico("fleche")}</a>
          </div>`;
}

{
  const H = PRIX_HUB;
  const ar = filAriane([{ nom: "Prix", path: "/prix-toiture" }]);
  const p = { id: "prix", path: "/prix-toiture", title: H.title, description: H.description, jsonld: [ldEntreprise(), ar.ld, ldFaq(H.faq)] };
  const html =
    head(p) +
    enTetePage({ h1: H.h1, chapo: H.chapo, ariane: ar.html }) +
    `
    <section class="section section--claire">
      <div class="conteneur article">
        <div class="article__corps">
          <h2>Les prix par type de travaux</h2>
          <ul class="tarifs">
            ${PRIX_PAGES.map((x) => `<li><a href="${x.path}"><span class="tarifs__nom">Prix ${esc(x.nom.toLowerCase())}</span><span class="tarifs__montant mono">${fourchette(x)} ${uniteTexte(x.unite)}</span>${ico("fleche")}</a></li>`).join("\n            ")}
          </ul>
          <p class="mention-prix">${MENTION_PRIX}</p>
          ${sectionsHtml(H.sections)}
          <div class="encart-cta" data-commun>
            <p><strong>Un prix pour votre toiture ?</strong> Le diagnostic et le devis sont gratuits.</p>
            <div class="actions">
              <a class="bouton bouton--orange" href="/devis-toiture" data-track="devis">${ico("devis")}Demander un devis</a>
              <a class="bouton bouton--contour" href="/rendez-vous" data-track="rdv">${ico("agenda")}Prendre rendez-vous</a>
            </div>
          </div>
        </div>
        <aside class="article__cote">
          <div class="cote-carte">
            <h2>Les services</h2>
            <ul class="liste-liens">${SERVICES_PAGES.map((s) => `<li><a href="${s.path}">${esc(s.court)}</a></li>`).join("")}</ul>
          </div>
        </aside>
      </div>
    </section>
${faqHtml(H.faq, "Vos questions sur les prix")}
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire("prix-toiture.html", html, { path: "/prix-toiture", priorite: "0.7" });
}

for (const x of PRIX_PAGES) {
  const service = SERVICES_PAGES.find((s) => s.slug === x.service);
  const ar = filAriane([{ nom: "Prix", path: "/prix-toiture" }, { nom: x.nom, path: x.path }]);
  const p = { id: "prix", path: x.path, title: x.title, description: x.description, og: { titre: x.h1, type: "Prix indicatifs" }, jsonld: [ldEntreprise(), ldPrix(x), ar.ld, ldFaq(x.faq)] };
  const carte = `<p class="prix-carte__titre">Fourchette indicative</p>
          <p class="prix-carte__montant mono">${fourchette(x)}</p>
          <p class="prix-carte__unite">${uniteTexte(x.unite)}, TTC</p>
          <p class="prix-carte__mention">${MENTION_PRIX}</p>`;
  const html =
    head(p) +
    enTetePage({ h1: x.h1, chapo: x.chapo, ariane: ar.html, rappel: carte }) +
    `
    <section class="section section--claire">
      <div class="conteneur article">
        <div class="article__corps">
          <h2>Prix des cas les plus courants</h2>
          <div class="tableau-defile" role="region" aria-label="Tableau des prix indicatifs" tabindex="0">
          <table class="tableau-prix">
            <thead><tr><th scope="col">Situation</th><th scope="col">Fourchette TTC</th><th scope="col">Ce que ça comprend</th></tr></thead>
            <tbody>
              ${x.cas.map((c) => `<tr><th scope="row">${fr(c.cas)}</th><td class="mono">${fr(c.fourchette)}</td><td>${riche(c.detail)}</td></tr>`).join("\n              ")}
            </tbody>
          </table>
          </div>
          <p class="mention-prix">${MENTION_PRIX}</p>
          <h2>Ce qui fait varier le prix</h2>
          <dl class="facteurs">
            ${x.facteurs.map((f) => `<div><dt>${fr(f.titre)}</dt><dd>${riche(f.texte)}</dd></div>`).join("\n            ")}
          </dl>
          <h2>Ce que comprend le prix</h2>
          <div class="inclus">
            <div><h3>Compris en général</h3><ul class="liste-coches">${x.inclus.map((t) => `<li>${ico("coche")}${riche(t)}</li>`).join("")}</ul></div>
            <div><h3>Chiffré à part</h3><ul class="liste-tirets">${x.exclus.map((t) => `<li>${riche(t)}</li>`).join("")}</ul></div>
          </div>
          <h2>Comment lire un devis de ${esc(x.nom.toLowerCase())}</h2>
          ${x.lecture.map((t) => `<p>${riche(t)}</p>`).join("\n          ")}
          ${sectionsHtml(x.sections)}
          <div class="encart-cta" data-commun>
            <p><strong>Un prix précis pour votre maison ?</strong> On passe voir la toiture et on vous remet un devis écrit, gratuit.</p>
            <div class="actions">
              <a class="bouton bouton--orange" href="/devis-toiture?travaux=${encodeURIComponent(service?.devis || "")}" data-track="devis">${ico("devis")}Demander un devis gratuit</a>
              <a class="bouton bouton--contour" href="/rendez-vous" data-track="rdv">${ico("agenda")}Prendre rendez-vous</a>
            </div>
          </div>
        </div>
        <aside class="article__cote">
          <div class="cote-carte">
            <h2>Voir aussi</h2>
            <ul class="liste-liens">
              ${service ? `<li><a href="${service.path}">${esc(service.nom)}, le service</a></li>` : ""}
              ${PRIX_PAGES.filter((y) => y !== x).map((y) => `<li><a href="${y.path}">Prix ${esc(y.nom.toLowerCase())}</a></li>`).join("")}
              <li><a href="/prix-toiture">Tous les prix de toiture</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
${faqHtml(x.faq, `Vos questions sur le prix`)}
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire(`prix/${x.slug}.html`, html, { path: x.path, priorite: "0.7" });
}

/* --- Pages services --- */

for (const s of SERVICES_PAGES) {
  const ar = filAriane([{ nom: s.court, path: s.path }]);
  const photosS = photosDe({ service: s.slug });
  const p = { id: "services", path: s.path, title: s.title, description: s.description, og: { titre: s.nom, type: "Service de couverture" }, jsonld: [ldEntreprise(), ldService(s.nom, s.path), ar.ld, ldFaq(s.faq), ...ldImages(photosS)] };
  const corps = sectionsHtml(s.sections);
  const html =
    head(p) +
    enTetePage({ h1: s.h1, chapo: s.chapo, ariane: ar.html }) +
    `
    <section class="section section--claire">
      <div class="conteneur article">
        <div class="article__corps">
          ${corps}
          ${blocPrixService(s)}
          <div class="encart-cta" data-commun>
            <p><strong>Besoin d'un avis sur votre toiture ?</strong> Le diagnostic et le devis sont gratuits.</p>
            <div class="actions">
              <a class="bouton bouton--orange" href="/devis-toiture?travaux=${encodeURIComponent(s.devis)}" data-track="devis">${ico("devis")}Demander un devis</a>
              <a class="bouton bouton--contour" href="/rendez-vous" data-track="rdv">${ico("agenda")}Prendre rendez-vous</a>
            </div>
          </div>
        </div>
        <aside class="article__cote">
          <div class="cote-carte">
            <h2>Intervention dans l'Hérault</h2>
            <ul class="villes villes--compact">${SECTEURS_PAGES.map((x) => `<li><a href="${x.path}">${ico("pin")}${esc(x.nom)}</a></li>`).join("")}</ul>
          </div>
          <div class="cote-carte cote-carte--orange" data-commun>
            <h2>Une urgence ?</h2>
            <p>Fuite active ou tuiles envolées ? Faites une demande de dépannage.</p>
            <a class="bouton bouton--orange" href="/depannage-toiture" data-track="depannage">${ico("alerte")}Dépannage</a>
          </div>
        </aside>
      </div>
    </section>
${galerie(photosS, `${s.court}, photos de nos chantiers`)}
${listeRealisations(REALISATIONS.filter((c) => c.service === s.slug), `${s.court}, nos réalisations`)}
${faqHtml(s.faq, `Vos questions sur ${s.court.toLowerCase() === "charpente" ? "la charpente" : "ce service"}`)}
    <section class="section section--claire" aria-labelledby="titre-autres" data-commun>
      <div class="conteneur">
        <h2 id="titre-autres">Les autres travaux de toiture</h2>
        ${cartesServices(s.path)}
      </div>
    </section>
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire(`services/${s.slug}.html`, html, { path: s.path, priorite: "0.8", images: photosS });
}


/* --- Pages communes --- */

for (const v of VILLES_PAGES) {
  const photosV = photosDe({ commune: v.slug });
  const secV = SECTEURS_PAGES.find((x) => x.slug === v.secteur);
  const ar = filAriane([{ nom: "Hérault", path: "/zone-intervention" }, ...(secV ? [{ nom: secV.nom, path: secV.path }] : []), { nom: `Couvreur à ${v.nom}`, path: v.path }]);
  const p = {
    id: "zone",
    path: v.path,
    og: { titre: `Couvreur à ${v.nom}`, type: `Commune · ${v.cp}` },
    title: titreCourt([`Couvreur à ${v.nom} (${v.cp}), réparation de toiture | ARVÉO`, `Couvreur à ${v.nom} (${v.cp}), toiture | ARVÉO`, `Couvreur à ${v.nom} (${v.cp}) | ARVÉO`]),
    description: v.description || `Couvreur à ${v.nom} (${v.cp}) pour fuites, tuiles cassées, réfection, démoussage et gouttières. Artisan de Frontignan, devis gratuit.`,
    jsonld: [
      ldEntreprise(),
      { ...ldService(`Couvreur à ${v.nom}`, v.path, v.nom), areaServed: { "@type": "City", name: v.nom, geo: { "@type": "GeoCoordinates", latitude: v.lat, longitude: v.lng } } },
      ar.ld,
      ldFaq(v.faq),
      ...ldImages(photosV, v.nom),
    ],
  };
  const html =
    head(p) +
    enTetePage({ h1: `Couvreur à ${v.nom}`, chapo: v.intro, ariane: ar.html }) +
    `
    <section class="section section--claire">
      <div class="conteneur article">
        <div class="article__corps">
          <p class="encart-accent">${ico("toit")}<strong>${fr(v.accent)}</strong></p>
          <h2>Les toitures de ${esc(v.nom)}</h2>
          ${v.texte.map((t) => `<p>${riche(t)}</p>`).join("\n          ")}
          ${v.quartiers?.length ? `<p>Nous intervenons notamment à ${fr(enumerer(v.quartiers))}.</p>` : ""}
          ${v.vigilance?.length ? `<h2>Ce que nous surveillons à ${esc(v.nom)}</h2>
          <ul class="liste-coches">${v.vigilance.map((t) => `<li>${ico("coche")}${riche(t)}</li>`).join("")}</ul>` : ""}
          <h2>Nos interventions à ${esc(v.nom)}</h2>
          <ul class="liste-liens liste-liens--simple">
            <li><a href="/depannage-toiture">${ico("alerte")}<span>Dépannage de toiture à ${esc(v.nom)}</span></a></li>
            ${SERVICES_PAGES.map((s) => `<li><a href="${s.path}">${ico("coche")}<span>${esc(s.court)} à ${esc(v.nom)}</span></a></li>`).join("\n            ")}
          </ul>
          <div class="encart-cta" data-commun>
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
            <ul class="villes villes--compact">${v.voisines.map((w) => `<li><a href="${w.path}">Couvreur à ${esc(w.nom)}</a></li>`).join("")}</ul>
            ${(() => { const sec = SECTEURS_PAGES.find((x) => x.slug === v.secteur); return sec ? `<a class="lien-fleche" href="${sec.path}">Le secteur ${esc(sec.nom)} ${ico("fleche")}</a>` : ""; })()}
          </div>
          <div class="cote-carte cote-carte--orange" data-commun>
            <h2>Urgence à ${esc(v.nom)} ?</h2>
            <p>Décrivez le problème en ligne, on vous rappelle au plus vite.</p>
            <a class="bouton bouton--orange" href="/depannage-toiture" data-track="depannage">${ico("alerte")}Dépannage</a>
          </div>
        </aside>
      </div>
    </section>
${galerie(photosV, `Nos chantiers à ${v.nom} en photos`)}
${listeRealisations(REALISATIONS.filter((c) => c.commune === v.slug), `Nos réalisations à ${v.nom}`)}
${faqHtml(v.faq, `Couvreur à ${v.nom}, vos questions`)}
${bandeauCta(`Votre couvreur à ${v.nom}`, `Réparation, réfection, démoussage ou urgence. Appelez-nous ou faites votre demande en ligne.`)}` +
    pied() +
    FIN_PAGE(false);
  ecrire(`couvreur/${v.slug}.html`, html, { path: v.path, priorite: v.nom === "Frontignan" ? "0.9" : "0.8", images: photosV });
}

/* --- Secteurs de l'Hérault --- */

function pageSecteur(sec) {
  const ar = filAriane([{ nom: "Zone d'intervention", path: "/zone-intervention" }, { nom: sec.nom, path: sec.path }]);
  const villes = VILLES_PAGES.filter((v) => v.secteur === sec.slug);
  const avecPage = new Map(villes.map((v) => [v.nom, v]));
  const communesTexte = sec.communes.map((c) => (avecPage.has(c) ? `<a href="${avecPage.get(c).path}">${esc(c)}</a>` : esc(c)));
  const p = {
    id: "zone",
    path: sec.path,
    title: sec.title,
    description: sec.description,
    og: { titre: sec.h1, type: "Secteur d'intervention" },
    jsonld: [
      ldEntreprise(),
      nettoyer({ ...ldService(`Couverture et zinguerie, ${sec.nom}`, sec.path), areaServed: [{ "@type": "AdministrativeArea", name: sec.nom }, ...villes.map((v) => ({ "@type": "City", name: v.nom }))] }),
      ar.ld,
      ldFaq(sec.faq),
    ],
  };
  const html =
    head(p) +
    enTetePage({ h1: sec.h1, chapo: sec.chapo, ariane: ar.html }) +
    `
    <section class="section section--claire">
      <div class="conteneur article">
        <div class="article__corps">
          ${sec.texte.map((t) => `<p>${riche(t)}</p>`).join("\n          ")}
          <h2>Les communes du secteur ${esc(sec.nom)}</h2>
          <p>Nous intervenons à ${enumerer(communesTexte)}.</p>
          <ul class="liste-liens liste-liens--simple">
            ${villes.map((v) => `<li><a href="${v.path}">${ico("pin")}<span>Couvreur à ${esc(v.nom)}</span></a></li>`).join("\n            ")}
          </ul>
          <h2>Les toitures que l'on rencontre ici</h2>
          <ul class="liste-coches">${sec.toitures.map((t) => `<li>${ico("coche")}${riche(t)}</li>`).join("")}</ul>
          <h2>Nos services, ${esc(sec.nom)}</h2>
          <ul class="liste-liens liste-liens--simple">
            <li><a href="/depannage-toiture">${ico("alerte")}<span>Dépannage de toiture</span></a></li>
            ${SERVICES_PAGES.map((s) => `<li><a href="${s.path}">${ico("coche")}<span>${esc(s.court)}</span></a></li>`).join("\n            ")}
          </ul>
          <div class="encart-cta" data-commun>
            <p><strong>Un problème de toiture dans le secteur ?</strong> Décrivez-le en ligne, on organise la visite avec vous.</p>
            <div class="actions">
              <a class="bouton bouton--orange" href="/devis-toiture" data-track="devis">${ico("devis")}Demander un devis</a>
              <a class="bouton bouton--contour" href="/rendez-vous" data-track="rdv">${ico("agenda")}Prendre rendez-vous</a>
            </div>
          </div>
        </div>
        <aside class="article__cote">
          <div class="cote-carte">
            <h2>Les autres secteurs</h2>
            <ul class="liste-liens">${SECTEURS_PAGES.filter((x) => x !== sec).map((x) => `<li><a href="${x.path}">Couvreur, ${esc(x.nom)}</a></li>`).join("")}</ul>
          </div>
          <div class="cote-carte cote-carte--orange" data-commun>
            <h2>Une urgence ?</h2>
            <p>Fuite active ou tuiles envolées, faites une demande de dépannage.</p>
            <a class="bouton bouton--orange" href="/depannage-toiture" data-track="depannage">${ico("alerte")}Dépannage</a>
          </div>
        </aside>
      </div>
    </section>
${faqHtml(sec.faq, `${sec.nom}, vos questions`)}
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire(`secteur/${sec.slug}.html`, html, { path: sec.path, priorite: "0.7" });
}

/* Carte schématique de l'Hérault : chaque point du département est rattaché à la commune desservie
   la plus proche (cellules de Voronoï), et les cellules prennent la couleur de leur secteur. */
function carteHerault() {
  const W = 640, H = 460;
  const LAT0 = 43.18, LAT1 = 44.0, LNG0 = 2.55, LNG1 = 4.22;
  const kx = Math.cos((43.6 * Math.PI) / 180);
  const echelle = Math.min((W - 30) / ((LNG1 - LNG0) * kx), (H - 30) / (LAT1 - LAT0));
  const proj = ([lat, lng]) => [15 + (lng - LNG0) * kx * echelle, 15 + (LAT1 - lat) * echelle];
  // Contour simplifié du département (sens horaire depuis l'embouchure de l'Aude).
  const contour = [
    [43.212, 3.24], [43.245, 3.3], [43.27, 3.36], [43.276, 3.512], [43.315, 3.555], [43.36, 3.62], [43.395, 3.7], [43.43, 3.77], [43.505, 3.875], [43.527, 3.93],
    [43.545, 3.98], [43.56, 4.08], [43.555, 4.12], [43.6, 4.15], [43.665, 4.18], [43.7, 4.16], [43.76, 4.08], [43.8, 4.03], [43.85, 3.97], [43.9, 3.84], [43.95, 3.75],
    [43.97, 3.65], [43.95, 3.52], [43.97, 3.42], [43.93, 3.33], [43.86, 3.24], [43.79, 3.1], [43.72, 2.97], [43.69, 2.84], [43.66, 2.66], [43.58, 2.6], [43.5, 2.6],
    [43.44, 2.67], [43.39, 2.73], [43.33, 2.79], [43.3, 2.92], [43.29, 3.03], [43.26, 3.1], [43.235, 3.16],
  ].map(proj);
  const villes = VILLES_PAGES.map((v) => ({ v, p: proj([v.lat, v.lng]) }));
  // Découpe d'un polygone par le demi-plan des points plus proches de a que de b (Sutherland–Hodgman).
  const couper = (poly, a, b) => {
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], n = [b[0] - a[0], b[1] - a[1]];
    const dedans = (q) => (q[0] - m[0]) * n[0] + (q[1] - m[1]) * n[1] <= 0;
    const inter = (q, r) => { const dq = (q[0] - m[0]) * n[0] + (q[1] - m[1]) * n[1], dr = (r[0] - m[0]) * n[0] + (r[1] - m[1]) * n[1], t = dq / (dq - dr); return [q[0] + t * (r[0] - q[0]), q[1] + t * (r[1] - q[1])]; };
    const out = [];
    poly.forEach((q, k) => { const r = poly[(k + 1) % poly.length], iq = dedans(q), ir = dedans(r); if (iq) out.push(q); if (iq !== ir) out.push(inter(q, r)); });
    return out;
  };
  const cellules = villes.map((c) => ({ ...c, poly: villes.reduce((poly, o) => (o === c || poly.length < 3 ? poly : couper(poly, c.p, o.p)), contour) }));
  const aire = (poly) => poly.reduce((t, q, k) => { const r = poly[(k + 1) % poly.length]; return t + q[0] * r[1] - r[0] * q[1]; }, 0) / 2;
  const centre = (poly) => { const A = aire(poly); let x = 0, y = 0; poly.forEach((q, k) => { const r = poly[(k + 1) % poly.length], f = q[0] * r[1] - r[0] * q[1]; x += (q[0] + r[0]) * f; y += (q[1] + r[1]) * f; }); return [x / (6 * A), y / (6 * A)]; };
  const chemin = (poly) => "M" + poly.map((q) => q.map((n) => n.toFixed(1)).join(" ")).join("L") + "Z";
  const ETIQUETTES = { "bassin-de-thau": ["Bassin", "de Thau"], "montpellier-metropole": ["Montpellier", "Métropole"], "agde-pezenas": ["Agde et", "Pézenas"], "clermontais-lodevois": ["Clermontais", "et Lodévois"], "hauts-cantons": ["Hauts", "cantons"] };
  const zones = SECTEURS_PAGES.map((sec) => {
    const cs = cellules.filter((c) => c.v.secteur === sec.slug && c.poly.length > 2);
    if (!cs.length) return "";
    const A = cs.reduce((t, c) => t + Math.abs(aire(c.poly)), 0);
    let [x, y] = cs.reduce((t, c) => { const [cx, cy] = centre(c.poly), w = Math.abs(aire(c.poly)) / A; return [t[0] + cx * w, t[1] + cy * w]; }, [0, 0]);
    if (sec.slug === "bassin-de-thau") { const [fx, fy] = proj([43.47, 3.62]); x = fx; y = fy; } // au-dessus de l'étang
    const lignes = ETIQUETTES[sec.slug] || [sec.nom];
    const ton = { "bassin-de-thau": "base", "montpellier-metropole": "b", "hauts-cantons": "b", "agde-pezenas": "c" }[sec.slug] || "a";
    return `<a href="${sec.path}" class="carte__zone carte__zone--${ton}" aria-label="Couvreur, secteur ${esc(sec.nom)}">
          ${cs.map((c) => `<path d="${chemin(c.poly)}"/>`).join("")}
          <text x="${x.toFixed(1)}" y="${(y - (lignes.length - 1) * 8).toFixed(1)}">${lignes.map((l, k) => `<tspan x="${x.toFixed(1)}" dy="${k ? "1.1em" : 0}">${esc(l)}</tspan>`).join("")}</text>
        </a>`;
  }).join("\n        ");
  const points = villes.map(({ v, p: [x, y] }) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${v.nom === S.adresse.ville ? 6 : 2.6}"${v.nom === S.adresse.ville ? ' class="carte__base"' : ""}/>`).join("");
  const [fx, fy] = proj([S.adresse.latitude, S.adresse.longitude]);
  const [mx, my] = proj([43.3, 3.8]);
  return `<figure class="carte">
        <svg viewBox="0 0 ${W} ${H}" role="group" aria-labelledby="titre-carte">
          <title id="titre-carte">Carte schématique de l'Hérault et des secteurs d'intervention d'ARVÉO</title>
          ${zones}
          <path class="carte__dept" d="${chemin(contour)}"/>
          <g class="carte__villes" aria-hidden="true">${points}</g>
          <text class="carte__frontignan" x="${(fx + 9).toFixed(1)}" y="${(fy + 16).toFixed(1)}" aria-hidden="true">Frontignan</text>
          <text class="carte__mer" x="${mx.toFixed(0)}" y="${my.toFixed(0)}" aria-hidden="true">Mer Méditerranée</text>
        </svg>
        <figcaption>Carte schématique. Touchez un secteur pour voir ses communes.</figcaption>
      </figure>`;
}

for (const sec of SECTEURS_PAGES) pageSecteur(sec);

/* --- Zone d'intervention : couvreur dans l'Hérault --- */
{
  const ar = filAriane([{ nom: "Couvreur dans l'Hérault", path: "/zone-intervention" }]);
  const p = {
    id: "zone",
    path: "/zone-intervention",
    title: "Couvreur dans l'Hérault, zone d'intervention | ARVÉO",
    description: "Couvreur à Frontignan, ARVÉO intervient dans tout l'Hérault, du Bassin de Thau à Montpellier, Béziers, Agde, Lunel, Clermont-l'Hérault et Bédarieux.",
    og: { titre: "Couvreur dans l'Hérault", type: "Zone d'intervention" },
    jsonld: [ldEntreprise(), nettoyer({ ...ldService("Couverture, zinguerie et dépannage de toiture", "/zone-intervention"), areaServed: [HERAULT, ...SECTEURS_PAGES.map((x) => ({ "@type": "AdministrativeArea", name: x.nom }))] }), ar.ld],
  };
  const html =
    head(p) +
    enTetePage({ h1: "Couvreur dans l'Hérault", chapo: "Couvreur à Frontignan, intervention dans tout l'Hérault. Autour de l'étang de Thau au quotidien, plus loin sur rendez-vous, en organisant chaque déplacement avec vous.", ariane: ar.html }) +
    `
    <section class="section section--claire" aria-labelledby="titre-secteurs">
      <div class="conteneur hub">
        ${carteHerault()}
        <div class="hub__liste">
          <h2 id="titre-secteurs">Nos secteurs d'intervention</h2>
          <ul class="secteurs-liste">
            ${SECTEURS_PAGES.map((x) => {
              const villes = VILLES_PAGES.filter((v) => v.secteur === x.slug);
              return `<li>
              <h3><a href="${x.path}">Couvreur, ${esc(x.nom)}</a></h3>
              <p>${enumerer(villes.map((v) => `<a href="${v.path}">${esc(v.nom)}</a>`))}${x.communes.length > villes.length ? ` et ${x.communes.length - villes.length} autres communes` : ""}</p>
            </li>`;
            }).join("\n            ")}
          </ul>
        </div>
      </div>
    </section>
    <section class="section" aria-labelledby="titre-organisation">
      <div class="conteneur conteneur--etroit">
        <h2 id="titre-organisation">Comment nous organisons nos déplacements</h2>
        <p class="texte">Notre atelier est à Frontignan. Autour de l'étang de Thau, entre Sète, Mèze et Villeneuve-lès-Maguelone, nous passons très souvent et pouvons intervenir vite pour une fuite. Pour Montpellier et ses environs, le Biterrois, le Lunellois, le Clermontais, le Lodévois ou les Hauts cantons, nous fixons un rendez-vous et regroupons les visites d'un même secteur. Cela évite de vous facturer un déplacement trop lourd.</p>
        <p class="texte">Votre commune n'apparaît pas sur cette page ? Décrivez votre projet, nous vous disons franchement si nous pouvons venir.</p>
      </div>
    </section>
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire("zone-intervention.html", html, { path: "/zone-intervention", priorite: "0.8" });
}

/* --- Dépannage --- */
{
  const ar = filAriane([{ nom: "Dépannage de toiture", path: "/depannage-toiture" }]);
  const p = {
    id: "depannage",
    path: "/depannage-toiture",
    title: "Dépannage de toiture à Frontignan, demande en ligne | ARVÉO",
    description: `Fuite de toiture, tuiles arrachées, dégâts après orage à Frontignan, Sète et alentours. Faites votre demande de dépannage en ligne ou appelez le ${S.telephone}.`,
    jsonld: [ldEntreprise(), ldService("Dépannage de toiture", "/depannage-toiture"), ar.ld, ldFaq(FAQ_DEPANNAGE)],
  };
  const html =
    head(p) +
    enTetePage({ h1: "Demande de dépannage toiture en ligne", chapo: "Fuite, tuile cassée ou gouttière arrachée ? Remplissez la demande, nous la recevons immédiatement et vous rappelons au plus vite.", ariane: ar.html, ancre: "#formulaire" }) +
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
            ${serviceActif("bachage-urgence") ? `<a class="lien-fleche" href="/services/bachage-urgence">Bâchage de toiture en urgence ${ico("fleche")}</a>` : ""}
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
    enTetePage({ h1: "Votre devis de toiture gratuit", chapo: "Décrivez votre projet en deux minutes. Nous vous rappelons pour organiser la visite et vous remettre un devis écrit et détaillé.", ariane: ar.html }) +
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
    enTetePage({ h1: "Prendre rendez-vous pour un diagnostic", chapo: "Choisissez une date et un créneau, nous vous rappelons pour confirmer l'heure. Le diagnostic et le devis sont gratuits.", ariane: ar.html }) +
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
    enTetePage({ h1: "Contactez votre couvreur à Frontignan", chapo: "Une question, un projet ou une urgence ? Choisissez le moyen le plus simple pour vous, nous répondons dans la journée.", ariane: ar.html }) +
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
    enTetePage({ h1: "Un couvreur d'ici, pour les toitures d'ici", chapo: "ARVÉO est une entreprise de couverture et de zinguerie installée à Frontignan. Notre métier, garder votre maison au sec durablement.", ariane: ar.html }) +
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
    description: "Les avis Google laissés par les clients d'ARVÉO, couvreur zingueur à Frontignan, après une réparation, une réfection ou un dépannage de toiture.",
    jsonld: [ldEntreprise(), ar.ld],
  };
  const html =
    head(p) +
    enTetePage({ h1: "Ce que disent nos clients", chapo: "Les avis laissés par nos clients sur notre fiche Google, publiés tels quels, sans tri.", ariane: ar.html }) +
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
  avertissements.push("Page Avis non générée : ajoutez de vrais avis Google dans config.avis (texte exact, auteur, date, source « Google »).");
}

/* --- /avis/laisser : lien court pour les cartes NFC et les QR codes --- */
{
  const lien = fiable("liens.avisGoogle");
  const fv = path.join(RACINE, "vercel.json");
  const v = JSON.parse(fs.readFileSync(fv, "utf8"));
  v.redirects = v.redirects.filter((r) => r.source !== "/avis/laisser");
  if (lien) {
    // Redirection temporaire : le lien Google peut changer, les cartes déjà imprimées restent valables.
    v.redirects.unshift({ source: "/avis/laisser", destination: lien, permanent: false });
    fs.rmSync(path.join(RACINE, "avis", "laisser.html"), { force: true });
  } else {
    const p = { id: "avis", path: "/avis/laisser", noindex: true, title: `Laisser un avis | ${S.nom}`, description: "Laisser un avis sur ARVÉO, couvreur zingueur à Frontignan.", jsonld: [] };
    ecrire(
      "avis/laisser.html",
      head(p) +
        `
    <section class="tete-page">
      <div class="conteneur tete-page__grille tete-page__grille--seule">
        <div class="tete-page__texte">
          <h1>Merci de penser à nous</h1>
          <p class="chapeau">Notre page d'avis Google arrive bientôt. En attendant, dites-nous directement ce que vous avez pensé de notre intervention, cela nous aide à progresser.</p>
          ${actions({ clair: true, secondaire: { href: "/contact", texte: "Nous écrire", icone: "mail", track: "contact" } })}
        </div>
      </div>
    </section>` +
        pied() +
        FIN_PAGE(false)
    );
    avertissements.push("/avis/laisser affiche une page d'attente : renseignez config.liens.avisGoogle pour rediriger vers Google.");
  }
  fs.writeFileSync(fv, JSON.stringify(v, null, 2) + "\n");
}

/* --- Réalisations (seulement s'il existe de vrais chantiers) --- */
if (avecRealisations) {
  const ar = filAriane([{ nom: "Réalisations", path: "/realisations" }]);
  const services = [...new Set(REALISATIONS.map((c) => c.service))];
  const communes = [...new Set(REALISATIONS.map((c) => c.commune))];
  const p = {
    id: "realisations",
    path: "/realisations",
    title: "Réalisations, chantiers de toiture dans l'Hérault | ARVÉO",
    description: `Les chantiers de couverture réalisés par ARVÉO, couvreur à Frontignan, avec le problème constaté, les travaux et le résultat. ${REALISATIONS.length} fiche(s) à consulter.`,
    jsonld: [ldEntreprise(), ar.ld],
  };
  const html =
    head(p) +
    enTetePage({ h1: "Nos réalisations de toiture", chapo: "Chaque fiche décrit un vrai chantier, le problème constaté, les travaux réalisés et le résultat.", ariane: ar.html }) +
    `
    <section class="section section--claire" aria-labelledby="titre-liste-chantiers">
      <div class="conteneur">
        <h2 id="titre-liste-chantiers" class="sr">Liste des chantiers</h2>
        <form class="filtres" data-filtres aria-label="Filtrer les réalisations">
          <div class="champ"><label for="filtre-service">Service</label><select id="filtre-service" data-filtre="service"><option value="">Tous les services</option>${services.map((x) => `<option value="${x}">${esc(nomService(x))}</option>`).join("")}</select></div>
          <div class="champ"><label for="filtre-commune">Commune</label><select id="filtre-commune" data-filtre="commune"><option value="">Toutes les communes</option>${communes.map((x) => `<option value="${x}">${esc(nomCommune(x))}</option>`).join("")}</select></div>
          <p class="filtres__compte" aria-live="polite" data-compte></p>
        </form>
        <ul class="chantiers">
          ${REALISATIONS.map((c) => {
            const ph = photosDe({ liste: c.photos || [] })[0];
            return `<li data-service="${c.service}" data-commune="${c.commune}"><a href="${c.path}">
            ${ph ? `<img src="${ph.versions[480].src}" width="${ph.versions[480].largeur}" height="${ph.versions[480].hauteur}" alt="${esc(altPhoto(ph))}" loading="lazy" decoding="async">` : ""}
            <span class="mono">${esc(c.date)}</span>
            <h3>${esc(titreChantier(c))}</h3>
            <p>${fr(c.probleme)}</p>
          </a></li>`;
          }).join("\n          ")}
        </ul>
      </div>
    </section>
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire("realisations.html", html, { path: "/realisations", priorite: "0.6" });

  for (const c of REALISATIONS) {
    const ville = nomCommune(c.commune);
    const service = SERVICES_PAGES.find((x) => x.slug === c.service);
    const servicePath = c.service === "depannage-toiture" ? "/depannage-toiture" : service?.path;
    const villePath = VILLES_PAGES.find((v) => v.slug === c.commune)?.path;
    const photosC = photosDe({ liste: c.photos || [] });
    const arc = filAriane([{ nom: "Réalisations", path: "/realisations" }, { nom: titreChantier(c), path: c.path }]);
    const desc = `${titreChantier(c)} en ${c.date}. ${c.probleme}`;
    const pc = {
      id: "realisations",
      path: c.path,
      title: titreCourt([`${titreChantier(c)}, ${c.date} | ARVÉO`, `${titreChantier(c)} | ARVÉO`]),
      description: (() => {
        let d = desc.length < 120 ? `${desc} Chantier réalisé par ARVÉO, couvreur zingueur à Frontignan.` : desc;
        return d.length > 158 ? d.slice(0, 155).replace(/\s+\S*$/, "") + "…" : d;
      })(),
      jsonld: [
        nettoyer({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${titreChantier(c)}, ${c.date}`,
          url: urlPage(c.path),
          about: { "@type": "Service", name: nomService(c.service), url: servicePath && urlPage(servicePath), provider: { "@id": ENTREPRISE_ID } },
          contentLocation: { "@type": "City", name: ville },
          image: ldImages(photosC, ville).map(({ "@context": _, ...img }) => img),
        }),
        arc.ld,
      ],
    };
    const ligne = (k, v) => (v ? `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>` : "");
    const htmlC =
      head(pc) +
      enTetePage({ h1: `${titreChantier(c)}, ${c.date}`, chapo: c.resultat, ariane: arc.html }) +
      `
    <section class="section section--claire">
      <div class="conteneur article">
        <div class="article__corps">
          <article class="bon" aria-labelledby="titre-bon">
            <header class="bon__tete">
              <h2 id="titre-bon">Bon d'intervention</h2>
              <p class="mono">Réf. ${esc(c.slug.toUpperCase().slice(0, 24))}</p>
            </header>
            <dl class="bon__infos">
              ${ligne("Commune", ville)}${ligne("Service", nomService(c.service))}${ligne("Date", c.date)}${ligne("Durée", c.duree)}${ligne("Maison", c.maison)}${ligne("Matériaux", (c.materiaux || []).join(", "))}
            </dl>
            <h3><span class="mono">01</span>Problème constaté</h3>
            <p>${fr(c.probleme)}</p>
            <h3><span class="mono">02</span>Travaux réalisés</h3>
            <ul class="liste-coches">${(c.travaux || []).map((t) => `<li>${ico("coche")}${fr(t)}</li>`).join("")}</ul>
            <h3><span class="mono">03</span>Résultat</h3>
            <p>${fr(c.resultat)}</p>
          </article>
          ${c.temoignage ? `<figure class="temoignage"><blockquote><p>« ${fr(c.temoignage.texte)} »</p></blockquote><figcaption>${esc(c.temoignage.auteur)}, ${esc(ville)}</figcaption></figure>` : ""}
          <div class="encart-cta" data-commun>
            <p><strong>Un chantier comparable chez vous ?</strong> Le diagnostic et le devis sont gratuits.</p>
            <div class="actions">
              <a class="bouton bouton--orange" href="/devis-toiture" data-track="devis">${ico("devis")}Demander un devis</a>
              <a class="bouton bouton--contour" href="/rendez-vous" data-track="rdv">${ico("agenda")}Prendre rendez-vous</a>
            </div>
          </div>
        </div>
        <aside class="article__cote">
          <div class="cote-carte">
            <h2>Voir aussi</h2>
            <ul class="liste-liens">
              ${servicePath ? `<li><a href="${servicePath}">${esc(nomService(c.service))} en détail</a></li>` : ""}
              ${villePath ? `<li><a href="${villePath}">Couvreur à ${esc(ville)}</a></li>` : ""}
              <li><a href="/realisations">Toutes nos réalisations</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
${galerie(photosC, `Le chantier en photos`)}
${bandeauCta()}` +
      pied() +
      FIN_PAGE(false);
    ecrire(`realisations/${c.slug}.html`, htmlC, { path: c.path, priorite: "0.5", images: photosC });
  }
} else {
  fs.rmSync(path.join(RACINE, "realisations.html"), { force: true });
  fs.rmSync(path.join(RACINE, "realisations"), { recursive: true, force: true });
}

/* --- Conseils (articles) --- */

const dateLongue = (iso) => { const [a, m, j] = iso.split("-").map(Number); return `${j === 1 ? "1er" : j} ${MOIS[m - 1]} ${a}`; };
const texteArticle = (a) => [a.chapo, ...a.sections.flatMap((s) => [s.h2, ...s.blocs.map((b) => b.p || b.h3 || (b.liste || []).join(" "))])].join(" ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
const ARTICLES_PAGES = ARTICLES.map((a) => ({
  ...a,
  path: `/conseils/${a.slug}`,
  lecture: Math.max(1, Math.round(texteArticle(a).split(/\s+/).length / 220)),
}));

function besoinCouvreur(a, fin = false) {
  const s = (a.services || []).map((k) => SERVICES_PAGES.find((x) => x.slug === k)).filter(Boolean)[0];
  return `<aside class="besoin" data-commun aria-label="Besoin d'un couvreur">
            <p class="besoin__titre">Besoin d'un couvreur ?</p>
            <p>${fin ? "On passe voir votre toiture, on vous explique ce qu'on constate et le devis est gratuit." : "Une fuite ou un doute sur votre toiture, décrivez la situation, on vous rappelle dans la journée."}</p>
            <div class="actions">
              <a class="bouton bouton--orange" href="/depannage-toiture" data-track="depannage">${ico("alerte")}Demande de dépannage</a>
              <a class="bouton bouton--contour" href="/devis-toiture${s ? `?travaux=${encodeURIComponent(s.devis)}` : ""}" data-track="devis">${ico("devis")}Devis gratuit</a>
            </div>
          </aside>`;
}

const ldArticle = (a) =>
  nettoyer({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.titre,
    description: a.description,
    datePublished: a.publie,
    dateModified: a.maj || a.publie,
    inLanguage: "fr-FR",
    mainEntityOfPage: urlPage(a.path),
    image: `${BASE}/img/og/${ogNom(a.path)}.png`,
    author: { "@id": ENTREPRISE_ID, "@type": "Organization", name: S.nom, url: BASE + "/" },
    publisher: { "@id": ENTREPRISE_ID, "@type": "Organization", name: S.nom, logo: { "@type": "ImageObject", url: BASE + "/img/logo-arveo.png" } },
    about: (a.services || []).map((k) => SERVICES_PAGES.find((x) => x.slug === k)).filter(Boolean).map((x) => ({ "@type": "Service", name: x.nom, url: urlPage(x.path) })),
  });

{
  const ar = filAriane([{ nom: "Conseils", path: "/conseils" }]);
  const p = {
    id: "conseils",
    path: "/conseils",
    title: "Conseils toiture d'un couvreur de l'Hérault | ARVÉO",
    description: "Fuite, tramontane, choix des tuiles, démoussage, autorisations de travaux. Les conseils pratiques d'ARVÉO, couvreur zingueur à Frontignan, pour votre toiture.",
    jsonld: [ldEntreprise(), ar.ld, nettoyer({ "@context": "https://schema.org", "@type": "CollectionPage", name: "Conseils toiture", url: urlPage("/conseils"), hasPart: ARTICLES_PAGES.map((a) => ({ "@type": "Article", headline: a.titre, url: urlPage(a.path) })) })],
  };
  const html =
    head(p) +
    enTetePage({ h1: "Conseils pour votre toiture", chapo: "Des réponses concrètes aux questions qu'on nous pose sur les chantiers, de la fuite à surveiller au choix des tuiles.", ariane: ar.html }) +
    `
    <section class="section section--claire" aria-labelledby="titre-articles">
      <div class="conteneur">
        <h2 id="titre-articles" class="sr">Tous les articles</h2>
        <ul class="articles">
          ${ARTICLES_PAGES.map((a) => `<li><a href="${a.path}">
            <p class="articles__meta mono"><time datetime="${a.publie}">${dateLongue(a.publie)}</time> · ${a.lecture} min de lecture</p>
            <h3>${fr(a.titre)}</h3>
            <p>${fr(a.chapo)}</p>
          </a></li>`).join("\n          ")}
        </ul>
      </div>
    </section>
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire("conseils.html", html, { path: "/conseils", priorite: "0.6" });
}

for (const a of ARTICLES_PAGES) {
  const ar = filAriane([{ nom: "Conseils", path: "/conseils" }, { nom: a.titre, path: a.path }]);
  const p = { id: "conseils", path: a.path, title: a.title, description: a.description, article: a, og: { titre: a.titre, type: "Conseil de couvreur" }, jsonld: [ldEntreprise(), ldArticle(a), ar.ld] };
  const ids = new Map();
  const idDe = (t) => { let i = slug(t).slice(0, 60); while (ids.has(i)) i += "-2"; ids.set(i, t); return i; };
  const sections = a.sections.map((s) => ({ ...s, id: idDe(s.h2) }));
  const milieu = Math.ceil(sections.length / 2);
  const corps = sections
    .map((s, i) => `${i === milieu ? besoinCouvreur(a) + "\n          " : ""}<h2 id="${s.id}">${fr(s.h2)}</h2>
          ${s.blocs.map((b) => (b.h3 ? `<h3>${fr(b.h3)}</h3>` : b.liste ? `<ul class="liste-coches">${b.liste.map((t) => `<li>${ico("coche")}${riche(t)}</li>`).join("")}</ul>` : `<p>${riche(b.p)}</p>`)).join("\n          ")}`)
    .join("\n          ");
  const proches = ARTICLES_PAGES.filter((x) => x !== a)
    .map((x) => ({ x, n: (x.services || []).filter((k) => (a.services || []).includes(k)).length }))
    .sort((u, v) => v.n - u.n)
    .slice(0, 3)
    .map((y) => y.x);
  const services = (a.services || []).map((k) => SERVICES_PAGES.find((x) => x.slug === k)).filter(Boolean);
  const html =
    head(p) +
    enTetePage({
      h1: a.titre,
      chapo: a.chapo,
      ariane: ar.html,
      apres: `<p class="article-meta mono">Publié le <time datetime="${a.publie}">${dateLongue(a.publie)}</time>${a.maj && a.maj !== a.publie ? `, mis à jour le <time datetime="${a.maj}">${dateLongue(a.maj)}</time>` : ""} · ${a.lecture} min de lecture</p>`,
    }) +
    `
    <section class="section section--claire">
      <div class="conteneur article article--conseil">
        <div class="article__corps">
          ${corps}
          ${besoinCouvreur(a, true)}
        </div>
        <aside class="article__cote">
          <nav class="cote-carte sommaire" aria-labelledby="titre-sommaire">
            <h2 id="titre-sommaire">Sommaire</h2>
            <ol>${sections.map((s) => `<li><a href="#${s.id}">${fr(s.h2)}</a></li>`).join("")}</ol>
          </nav>
          ${services.length ? `<div class="cote-carte">
            <h2>Nos services liés</h2>
            <ul class="liste-liens">${services.map((s) => `<li><a href="${s.path}">${esc(s.nom)}</a></li>`).join("")}</ul>
          </div>` : ""}
        </aside>
      </div>
    </section>
    <section class="section" aria-labelledby="titre-lire-aussi" data-commun>
      <div class="conteneur">
        <h2 id="titre-lire-aussi">À lire aussi</h2>
        <ul class="articles">
          ${proches.map((x) => `<li><a href="${x.path}"><p class="articles__meta mono">${x.lecture} min de lecture</p><h3>${fr(x.titre)}</h3><p>${fr(x.chapo)}</p></a></li>`).join("\n          ")}
        </ul>
      </div>
    </section>
${bandeauCta()}` +
    pied() +
    FIN_PAGE(false);
  ecrire(`conseils/${a.slug}.html`, html, { path: a.path, priorite: "0.6" });
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
        <p>${S.statistiques?.fournisseur ? `Ce site n'utilise aucun cookie. La fréquentation est mesurée de façon anonyme avec ${S.statistiques.fournisseur === "plausible" ? "Plausible" : "Umami"}, un outil sans cookie qui ne suit pas les visiteurs d'un site à l'autre.` : "Ce site n'utilise ni cookie ni mesure d'audience."} Le stockage local du navigateur sert seulement à ne pas rejouer l'animation d'accueil.</p>`
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

// Date de dernière modification réelle : elle ne change que si le contenu de la page change
// (empreinte du HTML conservée dans scripts/.lastmod.json, à committer).
const LASTMOD = (() => {
  const f = path.join(RACINE, "scripts", ".lastmod.json");
  const avant = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {};
  const apres = {};
  for (const g of GENERES.filter((x) => x.indexable)) {
    const empreinte = crypto.createHash("sha1").update(g.html.replace(/© \d{4}/, "")).digest("hex").slice(0, 16);
    apres[g.path] = avant[g.path]?.empreinte === empreinte ? avant[g.path] : { empreinte, date: AUJOURDHUI };
  }
  fs.writeFileSync(f, JSON.stringify(apres, null, 1) + "\n");
  return apres;
})();

fs.writeFileSync(
  path.join(RACINE, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (p) =>
      `  <url><loc>${urlPage(p.path)}</loc><lastmod>${LASTMOD[p.path]?.date || AUJOURDHUI}</lastmod><priority>${p.priorite}</priority>${(p.images || [])
        .map((ph) => `<image:image><image:loc>${BASE}${ph.versions[1280].src}</image:loc></image:image>`)
        .join("")}</url>`
  )
  .join("\n")}
</urlset>
`
);
fs.writeFileSync(path.join(RACINE, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${BASE}/sitemap.xml\n`);

/* --- Images de partage --- */

if (OG_DISPO) await genererOG(OG_A_GENERER);
else avertissements.push("Images de partage par page non générées : lancez npm install --prefix scripts (sharp).");

/* --- Contrôle qualité SEO --- */

const QA = (() => {
  const chemins = new Set(GENERES.map((g) => g.path));
  const redirections = JSON.parse(fs.readFileSync(path.join(RACINE, "vercel.json"), "utf8")).redirects.map((r) => r.source);
  const existe = (c) =>
    c === "/" || chemins.has(c) || redirections.includes(c) || (fs.existsSync(path.join(RACINE, c)) && fs.statSync(path.join(RACINE, c)).isFile());
  return controler(GENERES, { base: BASE, sitemap: pages.map((p) => p.path), existe });
})();


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

console.log(`${GENERES.length} pages générées (${pages.length} dans le sitemap), sitemap.xml et robots.txt à jour.`);
console.log(`\nContrôle SEO : ${QA.erreurs.length} erreur(s), ${QA.alertes.length} alerte(s).`);
for (const e of QA.erreurs) console.log("  ✗ " + e);
for (const e of QA.alertes) console.log("  ! " + e);
console.log("Similarité de contenu, 10 paires les plus proches (seuil 25 %) :");
for (const x of QA.similarites.slice(0, 10)) console.log(`  ${(x.j * 100).toFixed(1).padStart(5)} %  ${x.a}  ↔  ${x.b}`);
if (process.argv.includes("--rapport"))
  fs.writeFileSync(path.join(RACINE, "scripts", ".rapport-seo.json"), JSON.stringify({ similarites: QA.similarites.slice(0, 50), mots: QA.mots, erreurs: QA.erreurs, alertes: QA.alertes }, null, 1));
if (QA.erreurs.length) process.exitCode = 1;
if (avertissements.length) console.log(`\nÀ compléter avant la mise en ligne (${avertissements.length}) :\n- ` + avertissements.join("\n- "));
