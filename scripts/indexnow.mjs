#!/usr/bin/env node
/*
 * ARVÉO — signale les pages nouvelles ou modifiées aux moteurs compatibles IndexNow (Bing, Yandex,
 * Seznam, Naver… ; Google ne l'utilise pas, pour Google passez par la Search Console).
 *
 *   node scripts/indexnow.mjs              → envoie toutes les URL du sitemap
 *   node scripts/indexnow.mjs /prix-toiture /couvreur/sete   → envoie seulement ces chemins
 *
 * À lancer APRÈS la mise en ligne sur le domaine définitif (arveo.fr), jamais sur une adresse
 * *.vercel.app. La clé est le fichier <clé>.txt à la racine du site, qui doit être en ligne.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cle = fs.readdirSync(RACINE).find((f) => /^[a-f0-9]{32}\.txt$/.test(f))?.replace(".txt", "");
if (!cle) throw new Error("Fichier de clé IndexNow introuvable à la racine (<32 caractères hexadécimaux>.txt).");

const sitemap = fs.readFileSync(path.join(RACINE, "sitemap.xml"), "utf8");
const base = sitemap.match(/<loc>(https?:\/\/[^/<]+)/)[1];
const chemins = process.argv.slice(2);
const urls = chemins.length ? chemins.map((c) => base + c) : [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const corps = { host: new URL(base).host, key: cle, keyLocation: `${base}/${cle}.txt`, urlList: urls };
const r = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(corps),
});
console.log(`IndexNow : ${urls.length} URL envoyée(s), réponse ${r.status} ${r.statusText}`);
if (![200, 202].includes(r.status)) process.exitCode = 1;
