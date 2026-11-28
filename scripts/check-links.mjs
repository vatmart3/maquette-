#!/usr/bin/env node
/*
 * Couvreur Proximité 34 — contrôle des liens du site généré.
 *   node scripts/check-links.mjs        (ou : npm run check-links)
 * Parcourt toutes les pages HTML construites et échoue (code de sortie 1) si :
 *  - un lien ou une ressource interne pointe vers un fichier qui n'existe pas ;
 *  - un lien interne pointe vers une adresse redirigée (vercel.json) ou finit par « / » ;
 *  - une ancre interne (#id) n'existe pas dans la page visée ;
 *  - un lien mène vers l'adresse provisoire d'hébergement ou un ancien domaine ;
 *  - une adresse externe est en http:// (contenu mixte) ;
 *  - la canonical d'une page n'est pas son adresse exacte sur le domaine officiel ;
 *  - le sitemap contient une page absente, en noindex ou redirigée.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = "https://couvreurproximite34.fr";
const EXCLUS = new Set([".git", "node_modules", "scripts", "docs", "api"]);
const INTERDITS = [/arv[eé]o/i, /vercel\.app/i, /maquette-t8eb/i];

const erreurs = [];
const err = (fichier, msg) => erreurs.push(`${fichier} : ${msg}`);

function pagesHtml(dossier = RACINE, acc = []) {
  for (const e of fs.readdirSync(dossier, { withFileTypes: true })) {
    if (EXCLUS.has(e.name)) continue;
    const p = path.join(dossier, e.name);
    if (e.isDirectory()) pagesHtml(p, acc);
    else if (e.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

// Chemin public d'un fichier HTML (cleanUrls : sans .html).
const cheminPublic = (f) => {
  const r = "/" + path.relative(RACINE, f).replace(/\\/g, "/");
  if (r === "/index.html") return "/";
  return r.replace(/\/index\.html$/, "").replace(/\.html$/, "");
};

// Fichier servi pour un chemin public (null s'il n'existe pas).
function fichierPour(chemin) {
  const c = decodeURIComponent(chemin);
  const candidats = c === "/" ? ["index.html"] : [c.slice(1), c.slice(1) + ".html", path.join(c.slice(1), "index.html")];
  for (const x of candidats) {
    const p = path.join(RACINE, x);
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  return null;
}

const vercel = JSON.parse(fs.readFileSync(path.join(RACINE, "vercel.json"), "utf8"));
const redirections = (vercel.redirects || [])
  .filter((r) => !r.has)
  .map((r) => new RegExp("^" + r.source.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/:\w+\*/g, ".*").replace(/:\w+/g, "[^/]+") + "$"));
const estRedirige = (chemin) => redirections.some((re) => re.test(chemin));

const ids = new Map(); // fichier → Set des id
const idsDe = (f) => {
  if (!ids.has(f)) ids.set(f, new Set([...fs.readFileSync(f, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(f);
};

const pages = pagesHtml();
const noindex = new Set();

for (const f of pages) {
  const rel = path.relative(RACINE, f);
  const html = fs.readFileSync(f, "utf8");
  const page = cheminPublic(f);
  const estNoindex = /<meta name="robots" content="noindex/.test(html);
  if (estNoindex) noindex.add(page);

  for (const re of INTERDITS) if (re.test(html)) err(rel, `mention interdite ${re}`);
  if (!/<html lang="fr"/.test(html)) err(rel, "attribut lang=\"fr\" absent");
  if (!/<meta charset="utf-8">/i.test(html)) err(rel, "meta charset absente");
  if (!/<meta name="viewport"/.test(html)) err(rel, "meta viewport absente");
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) err(rel, "il faut exactement un H1");

  const canon = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (!canon) err(rel, "canonical absente");
  else if (rel !== "404.html" && canon[1] !== SITE_URL + page) err(rel, `canonical ${canon[1]} au lieu de ${SITE_URL + page}`);

  // Toutes les adresses citées dans des attributs.
  const urls = [];
  for (const m of html.matchAll(/\s(href|src|content|action|poster)="([^"]*)"/g)) urls.push([m[1], m[2]]);
  for (const m of html.matchAll(/\s(?:srcset|imagesrcset)="([^"]*)"/g)) for (const part of m[1].split(",")) urls.push(["srcset", part.trim().split(/\s+/)[0]]);

  for (const [attr, brut] of urls) {
    const u = brut.replace(/&amp;/g, "&");
    if (!u) continue;
    if (/^http:\/\//i.test(u)) {
      err(rel, `adresse en http:// : ${u}`);
      continue;
    }
    if (/^(https?:)?\/\//i.test(u)) {
      if (u.startsWith(SITE_URL)) {
        // Adresse absolue du site : doit exister (balises canonical, og:url, og:image…).
        const chemin = u.slice(SITE_URL.length).split(/[?#]/)[0] || "/";
        if (!fichierPour(chemin)) err(rel, `adresse absolue introuvable : ${u}`);
      }
      continue;
    }
    if (attr === "content" || /^(tel|mailto|data|javascript|sms):/i.test(u)) continue;
    if (u.startsWith("#")) {
      if (u.length > 1 && !idsDe(f).has(decodeURIComponent(u.slice(1)))) err(rel, `ancre introuvable dans la page : ${u}`);
      continue;
    }
    if (!u.startsWith("/")) {
      err(rel, `lien relatif (à écrire depuis la racine) : ${u}`);
      continue;
    }
    const [avant, ancre] = u.split("#");
    const chemin = avant.split("?")[0];
    if (chemin.length > 1 && chemin.endsWith("/")) err(rel, `lien avec « / » final : ${u}`);
    if (estRedirige(chemin)) err(rel, `lien vers une adresse redirigée : ${u}`);
    const cible = fichierPour(chemin);
    if (!cible) {
      err(rel, `lien cassé : ${u}`);
      continue;
    }
    if (ancre && cible.endsWith(".html") && !idsDe(cible).has(decodeURIComponent(ancre))) err(rel, `ancre introuvable : ${u}`);
  }
}

// Sitemap : uniquement des pages existantes, indexables et non redirigées.
const sitemap = fs.readFileSync(path.join(RACINE, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) {
  if (!loc.startsWith(SITE_URL)) {
    err("sitemap.xml", `adresse hors domaine officiel : ${loc}`);
    continue;
  }
  const chemin = loc.slice(SITE_URL.length) || "/";
  if (!fichierPour(chemin)) err("sitemap.xml", `page absente : ${loc}`);
  if (noindex.has(chemin)) err("sitemap.xml", `page en noindex : ${loc}`);
  if (estRedirige(chemin)) err("sitemap.xml", `adresse redirigée : ${loc}`);
}
const robots = fs.readFileSync(path.join(RACINE, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) err("robots.txt", "ligne Sitemap absente ou incorrecte");

console.log(`Pages contrôlées : ${pages.length} · adresses du sitemap : ${locs.length}`);
if (erreurs.length) {
  console.error(`${erreurs.length} erreur(s) :\n- ` + erreurs.slice(0, 200).join("\n- "));
  process.exit(1);
}
console.log("Aucune erreur de lien.");
