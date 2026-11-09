/*
 * ARVÉO — contrôle qualité SEO, appelé à la fin de scripts/build.mjs.
 * Vérifie chaque page générée : title, description, h1, hiérarchie des titres, liens internes,
 * textes alternatifs, sitemap, canonical et similarité des contenus.
 * Aucune dépendance : petit analyseur de balises suffisant pour le HTML produit par le build.
 */

const VIDES = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const BRUTS = new Set(["script", "style", "template"]);

const decoder = (t) =>
  t
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));

const attr = (attrs, nom) => {
  const m = attrs.match(new RegExp(`(?:^|\\s)${nom}(?:\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+)))?`, "i"));
  if (!m) return undefined;
  return m[2] ?? m[3] ?? m[4] ?? "";
};

// Parcourt le document une fois et en extrait tout ce dont les contrôles ont besoin.
export function analyser(html) {
  const r = { title: "", description: "", canonical: "", robots: "", titres: [], liens: [], images: [], texteMain: "", h1: [] };
  const t = html.match(/<title>([\s\S]*?)<\/title>/i);
  r.title = t ? decoder(t[1]).trim() : "";
  for (const m of html.matchAll(/<meta\s+([^>]*)>/gi)) {
    const nom = attr(m[1], "name");
    if (nom === "description") r.description = decoder(attr(m[1], "content") || "");
    if (nom === "robots") r.robots = attr(m[1], "content") || "";
  }
  const c = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  r.canonical = c ? c[1] : "";

  const corps = html.slice(html.search(/<body[\s>]/i));
  const pile = []; // { tag, cache, commun, main }
  let titreCourant = null;
  const morceauxMain = [];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+)/g;
  let m;
  while ((m = re.exec(corps))) {
    if (m[0].startsWith("<!--")) continue;
    if (m[4] !== undefined) {
      const dansMain = pile.some((e) => e.main);
      const commun = pile.some((e) => e.commun);
      if (titreCourant) titreCourant.texte += m[4];
      if (dansMain && !commun) morceauxMain.push(m[4]);
      continue;
    }
    const ferme = m[1] === "/";
    const tag = m[2].toLowerCase();
    const attrs = m[3] || "";
    if (ferme) {
      const i = pile.map((e) => e.tag).lastIndexOf(tag);
      if (i >= 0) pile.length = i;
      if (/^h[1-6]$/.test(tag) && titreCourant) { titreCourant.texte = decoder(titreCourant.texte).replace(/\s+/g, " ").trim(); titreCourant = null; }
      if (["p", "li", "h1", "h2", "h3", "h4", "h5", "h6", "td", "th", "div", "section", "summary", "dt", "dd"].includes(tag)) morceauxMain.push(" ");
      continue;
    }
    const cache = attr(attrs, "aria-hidden") === "true" || pile.some((e) => e.cache);
    if (BRUTS.has(tag)) {
      const fin = corps.indexOf(`</${tag}>`, re.lastIndex);
      re.lastIndex = fin < 0 ? corps.length : fin + tag.length + 3;
      continue;
    }
    if (/^h[1-6]$/.test(tag)) {
      titreCourant = { niveau: +tag[1], texte: "" };
      r.titres.push(titreCourant);
      morceauxMain.push(" ");
    }
    if (tag === "a") {
      const href = attr(attrs, "href");
      if (href !== undefined) r.liens.push(href);
    }
    if (tag === "img") {
      r.images.push({ src: attr(attrs, "src"), alt: attr(attrs, "alt"), cache, deco: attr(attrs, "role") === "presentation" });
    }
    if (!VIDES.has(tag) && !attrs.trim().endsWith("/")) {
      pile.push({ tag, cache, commun: attr(attrs, "data-commun") !== undefined, main: tag === "main" });
    }
  }
  r.h1 = r.titres.filter((h) => h.niveau === 1);
  r.texteMain = decoder(morceauxMain.join(" ")).replace(/\s+/g, " ").trim();
  return r;
}

const mots = (t) =>
  t
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^a-z0-9àâäçéèêëîïôöùûüÿœæ'-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

export function shingles(t, n = 5) {
  const w = mots(t);
  const s = new Set();
  for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(" "));
  return s;
}

export function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  const [petit, grand] = a.size < b.size ? [a, b] : [b, a];
  for (const x of petit) if (grand.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

export const compterMots = (t) => mots(t).length;

/*
 * pages : [{ path, html, indexable }]
 * options : { base, sitemap: [paths], fichiersStatiques: Set(paths), redirections: [sources], seuilSimilarite }
 * Retourne { erreurs: [], avertissements: [], similarites: [{a, b, j}] }
 */
export function controler(pages, { base, sitemap, existe, seuilSimilarite = 0.25 }) {
  const erreurs = [];
  const alertes = [];
  const analyses = pages.map((p) => ({ ...p, a: analyser(p.html) }));
  const indexables = analyses.filter((p) => p.indexable);

  const doublons = (cle) => {
    const vus = new Map();
    for (const p of indexables) {
      const v = p.a[cle];
      if (vus.has(v)) erreurs.push(`${cle} en double « ${v} » sur ${vus.get(v)} et ${p.path}`);
      else vus.set(v, p.path);
    }
  };

  for (const p of analyses) {
    const { a } = p;
    const ici = p.path;
    if (p.indexable) {
      if (!a.title) erreurs.push(`${ici} : title manquant`);
      else if ([...a.title].length > 60) erreurs.push(`${ici} : title trop long (${[...a.title].length} > 60) « ${a.title} »`);
      const ld = [...a.description].length;
      if (ld < 120 || ld > 160) erreurs.push(`${ici} : meta description de ${ld} caractères (attendu 120 à 160)`);
      if (!a.canonical.startsWith(base + "/")) erreurs.push(`${ici} : canonical non absolu ou hors domaine (${a.canonical})`);
      if (!sitemap.includes(ici)) erreurs.push(`${ici} : page indexable absente du sitemap`);
    }
    if (a.h1.length !== 1) erreurs.push(`${ici} : ${a.h1.length} h1 (attendu 1)`);
    let prec = 0;
    for (const h of a.titres) {
      if (prec && h.niveau > prec + 1) erreurs.push(`${ici} : saut de niveau h${prec} → h${h.niveau} (« ${h.texte.slice(0, 50)} »)`);
      prec = h.niveau;
    }
    if (a.titres.some((h) => /:\s/.test(h.texte))) alertes.push(`${ici} : deux-points dans un titre`);
    for (const href of a.liens) {
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const cible = decodeURI(href.split("#")[0].split("?")[0]) || "/";
      if (!existe(cible)) erreurs.push(`${ici} : lien interne cassé vers ${href}`);
    }
    for (const img of a.images) {
      if (img.alt === undefined) erreurs.push(`${ici} : image sans attribut alt (${img.src})`);
      else if (img.alt.trim() === "" && !img.cache && !img.deco) erreurs.push(`${ici} : image de contenu avec alt vide (${img.src}) ; si elle est décorative, ajoutez role="presentation"`);
    }
  }
  doublons("title");
  doublons("description");
  for (const ici of sitemap) if (!analyses.some((p) => p.path === ici && p.indexable)) erreurs.push(`sitemap : ${ici} n'est pas une page indexable générée`);

  // Similarité de contenu (texte de <main> hors blocs communs marqués data-commun).
  const sh = indexables.map((p) => ({ path: p.path, s: shingles(p.a.texteMain), mots: compterMots(p.a.texteMain) }));
  const similarites = [];
  for (let i = 0; i < sh.length; i++)
    for (let j = i + 1; j < sh.length; j++) {
      const v = jaccard(sh[i].s, sh[j].s);
      similarites.push({ a: sh[i].path, b: sh[j].path, j: v });
      if (v > seuilSimilarite) alertes.push(`contenus trop proches (${(v * 100).toFixed(1)} %) : ${sh[i].path} et ${sh[j].path}`);
    }
  similarites.sort((x, y) => y.j - x.j);
  return { erreurs, alertes, similarites, mots: Object.fromEntries(sh.map((x) => [x.path, x.mots])), analyses };
}
