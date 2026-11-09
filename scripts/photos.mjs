#!/usr/bin/env node
/*
 * ARVÉO — préparation des photos de chantier.
 *   npm run photos --prefix scripts     (ou : node scripts/photos.mjs)
 *
 * Lit les originaux de photos/ (nommés commune__service__description.jpg), puis écrit dans
 * img/chantiers/ deux versions WebP (480 et 1280 px de large) :
 *   - orientation EXIF appliquée puis toutes les métadonnées supprimées (GPS, appareil, date) ;
 *   - nom de fichier descriptif pour le référencement, ex. couvreur-sete-refection-toiture-tuiles-canal-1280.webp
 * et le manifeste img/chantiers/photos.json lu par scripts/build.mjs.
 * Sans photo, le manifeste est vide et le site n'affiche aucune section photo.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(RACINE, "photos");
const SORTIE = path.join(RACINE, "img", "chantiers");
const LARGEURS = [480, 1280];
const EXT = /\.(jpe?g|png|webp|tiff?|heic|heif|avif)$/i;

const slug = (t) =>
  String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

fs.mkdirSync(SORTIE, { recursive: true });
const originaux = fs.existsSync(SOURCE) ? fs.readdirSync(SOURCE).filter((f) => EXT.test(f)).sort() : [];
const manifeste = [];
const attendus = new Set(["photos.json"]);
const noms = new Map();

for (const fichier of originaux) {
  const base = fichier.replace(EXT, "");
  const [commune, service, description = ""] = base.split("__").map(slug);
  const legende = (base.split("__")[2] || "").replace(/[-_]+/g, " ").trim(); // accents conservés pour le texte alternatif
  if (!commune || !service) {
    console.warn(`Ignorée : ${fichier} (nom attendu commune__service__description.jpg)`);
    continue;
  }
  let nom = slug(`couvreur-${commune}-${service}-${description}`);
  const n = (noms.get(nom) || 0) + 1;
  noms.set(nom, n);
  if (n > 1) nom += `-${n}`;

  const entree = sharp(path.join(SOURCE, fichier), { failOn: "none" }).rotate(); // applique l'orientation EXIF
  const { width, height } = await entree.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  const versions = {};
  for (const l of LARGEURS) {
    const cible = `${nom}-${l}.webp`;
    attendus.add(cible);
    const dest = path.join(SORTIE, cible);
    // Pas de withMetadata() : sharp retire EXIF, GPS, XMP et IPTC par défaut.
    const info = await entree
      .clone()
      .resize({ width: Math.min(l, width), withoutEnlargement: true })
      .webp({ quality: l > 500 ? 78 : 72, effort: 5 })
      .toFile(dest);
    versions[l] = { src: `/img/chantiers/${cible}`, largeur: info.width, hauteur: info.height };
  }
  manifeste.push({
    original: fichier,
    commune,
    service,
    description: legende,
    largeur: versions[1280].largeur,
    hauteur: versions[1280].hauteur,
    versions,
  });
  console.log(`✓ ${fichier} → ${nom}-{480,1280}.webp (${width}×${height})`);
}

// Supprime les WebP dont l'original a disparu.
for (const f of fs.readdirSync(SORTIE)) if (!attendus.has(f)) fs.rmSync(path.join(SORTIE, f));

fs.writeFileSync(path.join(SORTIE, "photos.json"), JSON.stringify(manifeste, null, 2) + "\n");
console.log(`${manifeste.length} photo(s) prête(s) dans img/chantiers/. Lancez maintenant : node scripts/build.mjs`);
