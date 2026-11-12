/*
 * Couvreur Proximité 34 — images de partage (Open Graph) 1200 × 630 par page.
 * Gabarit SVG (fond ardoise, dessin de la toiture, logo, titre) rendu en PNG par sharp.
 * Les polices du site sont fournies en TTF dans scripts/og-polices/ (licence OFL).
 * Une image n'est régénérée que si son texte change (empreinte dans scripts/.og-cache.json).
 * Appelé par scripts/build.mjs ; si sharp n'est pas installé, les pages gardent l'image commune og.png.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const ICI = path.dirname(new URL(import.meta.url).pathname);
const RACINE = path.resolve(ICI, "..");
const SORTIE = path.join(RACINE, "img", "og");
const CACHE = path.join(ICI, ".og-cache.json");
const VERSION_GABARIT = "6";

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Coupe un titre en lignes d'environ `max` caractères.
function lignes(texte, max) {
  const mots = String(texte).split(/\s+/);
  const out = [];
  let l = "";
  for (const m of mots) {
    if ((l + " " + m).trim().length > max && l) {
      out.push(l);
      l = m;
    } else l = (l + " " + m).trim();
  }
  if (l) out.push(l);
  return out;
}

function gabarit({ titre, sousTitre, type, pied = "arveo.fr" }) {
  const marque = "data:image/png;base64," + fs.readFileSync(path.join(RACINE, "img", "logo-cp34.png")).toString("base64");
  const toit = fs.readFileSync(path.join(RACINE, "img", "toiture.svg"), "utf8").replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  let taille = 66;
  let tl = lignes(titre, 22);
  if (tl.length > 3) {
    taille = 54;
    tl = lignes(titre, 27);
  }
  const yTitre = 360 - ((tl.length - 1) * taille * 1.1) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#243746"/>
  <svg x="600" y="150" width="680" height="420" viewBox="301 306 1028 628" opacity=".45">${toit}</svg>
  <rect x="0" y="600" width="1200" height="30" fill="#C65D28"/>
  <image x="72" y="56" width="120" height="55" href="${marque}"/>
  <text x="206" y="98" font-family="ARV Titre" font-size="30" fill="#F7F5F0" letter-spacing="0.5">Couvreur Proximité 34</text>
  <text x="72" y="${yTitre - taille - 8}" font-family="ARV Mono" font-size="24" fill="#EE8E55">${esc(type)}</text>
  ${tl.map((l, i) => `<text x="72" y="${yTitre + i * taille * 1.1}" font-family="ARV Titre" font-size="${taille}" fill="#F7F5F0">${esc(l)}</text>`).join("\n  ")}
  <text x="72" y="${yTitre + (tl.length - 1) * taille * 1.1 + 64}" font-family="ARV Texte" font-size="28" fill="#D3DCE3">${esc(sousTitre)}</text>
  <text x="72" y="560" font-family="ARV Mono" font-size="24" fill="#EE8E55">${esc(pied)}</text>
</svg>`;
}

/*
 * images : [{ nom: "couvreur-sete", titre, sousTitre, type }]
 * Retourne true si les images sont disponibles (sharp présent), false sinon.
 */
export async function genererOG(images) {
  // fontconfig doit connaître les polices avant le chargement de sharp.
  const conf = path.join(os.tmpdir(), "arveo-og-fonts.conf");
  fs.writeFileSync(
    conf,
    `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>${path.join(ICI, "og-polices")}</dir><cachedir>${path.join(os.tmpdir(), "arveo-og-cache")}</cachedir></fontconfig>`
  );
  process.env.FONTCONFIG_FILE = conf;
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    return false;
  }
  fs.mkdirSync(SORTIE, { recursive: true });
  const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, "utf8")) : {};
  const nouveau = {};
  const attendus = new Set();
  await Promise.all(
    images.map(async (img) => {
      const fichier = `${img.nom}.png`;
      attendus.add(fichier);
      const empreinte = crypto.createHash("sha1").update(VERSION_GABARIT + JSON.stringify([img.titre, img.sousTitre, img.type, img.pied])).digest("hex").slice(0, 12);
      nouveau[fichier] = empreinte;
      if (cache[fichier] === empreinte && fs.existsSync(path.join(SORTIE, fichier))) return;
      await sharp(Buffer.from(gabarit(img))).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(SORTIE, fichier));
    })
  );
  for (const f of fs.readdirSync(SORTIE)) if (!attendus.has(f)) fs.rmSync(path.join(SORTIE, f));
  fs.writeFileSync(CACHE, JSON.stringify(nouveau, null, 1) + "\n");
  return true;
}
