#!/usr/bin/env node
/*
 * Couvreur Proximité 34 — déclinaisons AVIF et WebP des images du site, aux noms descriptifs.
 *   node scripts/images.mjs   (nécessite sharp : npm install --prefix scripts)
 * Les fichiers produits sont versionnés dans img/ ; à relancer seulement si une image source change.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(ICI, "..");
const sharp = createRequire(path.join(ICI, "package.json"))("sharp");

// source → nom descriptif, largeurs à produire
const IMAGES = [
  { source: "scripts/sources-images/maison-pierre-tuiles-canal.webp", nom: "maison-pierre-tuiles-canal-couvreur-herault", largeurs: [640, 1024, 1672], qAvif: 40, qWebp: 70 },
  { source: "scripts/sources-images/picto-reparer.webp", nom: "picto-reparation-toiture", largeurs: [96, 192] },
  { source: "scripts/sources-images/picto-renover.webp", nom: "picto-renovation-toiture", largeurs: [96, 192] },
  { source: "scripts/sources-images/picto-entretenir.webp", nom: "picto-entretien-toiture", largeurs: [96, 192] },
  { source: "img/logo-cp34.png", nom: "logo-couvreur-proximite-34-frontignan", largeurs: [140, 280, 420] },
];

// Photos des prestations et des avant / après, détectées automatiquement dans scripts/sources-images :
//   prestation-<clé>.(webp|png|jpg)   → img/prestation-<clé>-480|800
//   avant-apres-<n>-avant|apres.(…)   → img/avant-apres-<n>-avant|apres-640|1024 (recadrées en 4:3)
import fs from "node:fs";
for (const f of fs.readdirSync(path.join(ICI, "sources-images"))) {
  const m = f.match(/^(prestation-[a-z-]+|avant-apres-\d-(?:avant|apres))\.(webp|png|jpe?g)$/);
  if (!m) continue;
  const presta = m[1].startsWith("prestation-");
  IMAGES.push({ source: `scripts/sources-images/${f}`, nom: m[1], largeurs: presta ? [480, 800] : [640, 1024], ratio: 4 / 3, qAvif: 50, qWebp: 78 });
}

for (const im of IMAGES) {
  for (const l of im.largeurs) {
    const base = sharp(path.join(RACINE, im.source)).resize(im.ratio ? { width: l, height: Math.round(l / im.ratio), fit: "cover" } : { width: l, withoutEnlargement: true });
    const sortie = path.join(RACINE, "img", `${im.nom}-${l}`);
    await base.clone().avif({ quality: im.qAvif || 55, effort: 7 }).toFile(sortie + ".avif");
    await base.clone().webp({ quality: im.qWebp || 80, effort: 6 }).toFile(sortie + ".webp");
    console.log(`${im.nom}-${l} : avif + webp`);
  }
}
