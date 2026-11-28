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
  { source: "scripts/sources-images/maison-toiture-tuiles.webp", nom: "maison-toiture-tuiles-couvreur-frontignan", largeurs: [800, 1200] },
  { source: "scripts/sources-images/picto-reparer.webp", nom: "picto-reparation-toiture", largeurs: [96, 192] },
  { source: "scripts/sources-images/picto-renover.webp", nom: "picto-renovation-toiture", largeurs: [96, 192] },
  { source: "scripts/sources-images/picto-entretenir.webp", nom: "picto-entretien-toiture", largeurs: [96, 192] },
  { source: "img/logo-cp34.png", nom: "logo-couvreur-proximite-34-frontignan", largeurs: [140, 280, 420] },
];

for (const im of IMAGES) {
  for (const l of im.largeurs) {
    const base = sharp(path.join(RACINE, im.source)).resize({ width: l, withoutEnlargement: true });
    const sortie = path.join(RACINE, "img", `${im.nom}-${l}`);
    await base.clone().avif({ quality: 55, effort: 7 }).toFile(sortie + ".avif");
    await base.clone().webp({ quality: 80, effort: 6 }).toFile(sortie + ".webp");
    console.log(`${im.nom}-${l} : avif + webp`);
  }
}
