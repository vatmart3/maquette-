/*
 * Couvreur Proximité 34 — « la toiture tracée au cordeau ».
 * Maison méditerranéenne en L, en couleurs : murs enduits, volets, toiture en tuiles
 * (texture tirée d'une photo de tuiles réelles), faîtage, rives, génoises, noues,
 * charpente en écorché, zinguerie, cheminée, fenêtre de toit, mousses. Tracée au
 * cordeau à l'arrivée, puis pilotée par le défilement (visite en 5 zones).
 * Three.js 0.169.0 par import map, aucun modèle.
 */
import * as THREE from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

const racine = document.querySelector("[data-scene]");
const mobile = window.matchMedia("(max-width: 859px)").matches;
const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const C_ORANGE = new THREE.Color("#F0915A");
const C_SOL = new THREE.Color("#3E5A72");
const C_TERRE = new THREE.Color("#5B7C96");
const FOND = new THREE.Color("#243746");
// arêtes, selon le matériau
const LIGNES = {
  mur: new THREE.Color("#A8957A"),     // enduit, un ton plus foncé que le mur
  toit: new THREE.Color("#7A3418"),    // terre cuite foncée : rives, faîtage, génoises
  bois: new THREE.Color("#B07A45"),    // charpente
  zinc: new THREE.Color("#7D878F"),
  etanche: new THREE.Color("#4F575E"), // solins, abergement
  mousse: new THREE.Color("#7E9A3C"),
};
// faces pleines : couleurs réelles, ombrées selon la lumière
const TEINTES = {
  toit: new THREE.Color("#FFFFFF"),    // multiplié par la texture des tuiles
  mur: new THREE.Color("#EADCC2"),     // enduit sable
  chapeau: new THREE.Color("#A64B26"), // chapeau de cheminée en terre cuite
  zinc: new THREE.Color("#A7B0B7"),
  vitre: new THREE.Color("#2B3F4C"),
  volet: new THREE.Color("#7FA39A"),   // volets vert d'eau
  porte: new THREE.Color("#7A5236"),
  cadre: new THREE.Color("#59626A"),
  mousse: new THREE.Color("#5F7D2C"),
};
const TUILE_ATTENTE = new THREE.Color("#B8643C"); // teinte du toit avant le chargement de la texture
const TEXTURE_TUILES = "/img/tuiles-toit.webp";
const TU = 1.7, TV = 1.6; // une répétition de la texture = 4 tuiles de large, 4 rangs de haut
const LUMIERE = new THREE.Vector3(-0.45, 0.85, 0.55).normalize();

/* ------------------------------------------------------------------ */
/* 1. La toiture : une liste de segments                               */
/* ------------------------------------------------------------------ */

// zones : 0 couverture, 1 charpente, 2 zinguerie, 3 étanchéité, 4 démoussage
// ordre de tracé : 0 sol, 1 murs, 2 lignes du toit, 3 ouvrages, 4 détails
const segs = [];
let Z = [];
let O = 2;
let TON = "toit";

function L(a, b) {
  segs.push({ a, b, zones: Z, ordre: O, ton: TON });
}
function avec(zones, ordre, ton, fn) {
  const z = Z, o = O, t = TON;
  Z = zones; O = ordre; TON = ton;
  fn();
  Z = z; O = o; TON = t;
}
function poly(p, ferme) {
  for (let i = 0; i < p.length - 1; i++) L(p[i], p[i + 1]);
  if (ferme) L(p[p.length - 1], p[0]);
}
function boite(x0, y0, z0, x1, y1, z1) {
  const p = [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]];
  poly([p[0], p[1], p[2], p[3]], true);
  poly([p[4], p[5], p[6], p[7]], true);
  for (let i = 0; i < 4; i++) L(p[i], p[i + 4]);
}

// Géométrie : corps principal A (faîtage selon x) et aile B (faîtage selon z).
const H = 5.5;          // hauteur d'égout
const K = 0.4;          // pente (≈ 22°, tuiles canal)
const YA = H + 4 * K;   // faîtage A = 7.1
const YB = H + 2.5 * K; // faîtage B = 6.5
const yA = (z) => YA - K * Math.abs(z);
const yB = (x) => YB - K * Math.abs(x - 3.5);
const S = 0.42;         // largeur d'une rangée de tuiles canal
const ECORCHE = -1.5;   // à gauche de x = -1,5 sur le versant nord : charpente visible

// Ouvrages sur le versant sud (avant) de A
const CHEM = { x0: -3.4, x1: -2.6, z0: 1.2, z1: 2.0, haut: 8.4 };
const VELUX = { x0: -1.2, x1: -0.2, z0: 2.3, z1: 3.3 };

function arcTuile(p0, p1, bosse) {
  // petite courbe de tuile canal entre p0 et p1, bombée selon le vecteur bosse
  const m1 = p0.map((v, i) => v + (p1[i] - v) * 0.25 + bosse[i]);
  const m2 = p0.map((v, i) => v + (p1[i] - v) * 0.75 + bosse[i]);
  poly([p0, m1, m2, p1]);
}

const MOUSSES = [];
function construire() {
  /* --- Sol : le cordeau devient la ligne de terre --- */
  avec([], 0, "mur", () => {
    L([-16, 0, 12], [19, 0, 12]);
    poly([[-9, 0, 12], [-9, 0, -7], [10, 0, -7], [10, 0, 12]]);
  });

  /* --- Murs (discrets) --- */
  avec([], 1, "mur", () => {
    boite(-6, 0, -4, 6, H, 4);
    boite(1, 0, 4, 6, H, 10);
    // pignons
    poly([[-6, H, -4], [-6, YA, 0], [-6, H, 4]]);
    poly([[6, H, -4], [6, YA, 0], [6, H, 4]]);
    poly([[1, H, 10], [3.5, YB, 10], [6, H, 10]]);
    // quelques ouvertures pour l'échelle
    for (const x of [-4.6, -2.4]) for (const y of [1, 3.4]) poly([[x, y, 4.01], [x + 1, y, 4.01], [x + 1, y + 1.3, 4.01], [x, y + 1.3, 4.01]], true);
    poly([[2.9, 0, 10.01], [4.1, 0, 10.01], [4.1, 2.3, 10.01], [2.9, 2.3, 10.01]], true);
    for (const x of [1.6, 4.4]) poly([[x, 3.2, 10.01], [x + 1, 3.2, 10.01], [x + 1, 4.4, 10.01], [x, 4.4, 10.01]], true);
  });

  /* --- Couverture : lignes du toit --- */
  avec([0], 2, "toit", () => {
    L([-6, H, -4], [6, H, -4]);           // égout nord
    L([-6, H, 4], [1, H, 4]);             // égout sud
    L([-6, YA, 0], [6, YA, 0]);           // faîtage A
    poly([[-6, H, -4], [-6, YA, 0], [-6, H, 4]]); // rives A
    poly([[6, H, -4], [6, YA, 0], [6, H, 4]]);
    L([1, H, 4], [1, H, 10]);             // égouts B
    L([6, H, 4], [6, H, 10]);
    L([3.5, YB, 1.5], [3.5, YB, 10]);     // faîtage B
    poly([[1, H, 10], [3.5, YB, 10], [6, H, 10]]); // rives B
    L([ECORCHE, H, -4], [ECORCHE, YA, 0]); // bord de l'écorché
  });
  avec([0, 2], 2, "toit", () => {
    L([1, H, 4], [3.5, YB, 1.5]);         // noues
    L([6, H, 4], [3.5, YB, 1.5]);
  });

  /* --- Tuiles canal : la surface du toit est texturée, seuls les bouts de tuiles à l'égout sont tracés --- */
  avec([0, 4], 4, "toit", () => {
    for (let x = ECORCHE; x < 6 - S / 2; x += S) arcTuile([x, H, -4], [x + S, H, -4], [0, 0.1, -0.05]);
  });
  avec([0], 4, "toit", () => {
    for (let x = -6; x < 1 - S / 2; x += S) arcTuile([x, H, 4], [x + S, H, 4], [0, 0.1, 0.05]);
    for (let z = 4; z < 10 - S / 2; z += S) {
      arcTuile([1, H, z], [1, H, z + S], [-0.05, 0.1, 0]);
      arcTuile([6, H, z], [6, H, z + S], [0.05, 0.1, 0]);
    }
    // tuiles faîtières
    for (const d of [-0.15, 0.15]) L([-6, YA - 0.06, d], [6, YA - 0.06, d]);
    for (let x = -6; x <= 6; x += 0.45) poly([[x, YA - 0.06, -0.15], [x, YA + 0.13, 0], [x, YA - 0.06, 0.15]]);
    for (const d of [-0.15, 0.15]) L([3.5 + d, YB - 0.06, 1.5], [3.5 + d, YB - 0.06, 10]);
    for (let z = 1.6; z <= 10; z += 0.45) poly([[3.35, YB - 0.06, z], [3.5, YB + 0.13, z], [3.65, YB - 0.06, z]]);
    // génoises sous les égouts (deux rangs de tuiles dans la façade)
    for (const y of [H - 0.16, H - 0.34]) {
      for (let x = -6; x < 6 - 0.1; x += S) arcTuile([x, y, -4], [x + S, y, -4], [0, -0.1, -0.05]);
      for (let x = -6; x < 1 - 0.1; x += S) arcTuile([x, y, 4], [x + S, y, 4], [0, -0.1, 0.05]);
      for (let z = 4; z < 10 - 0.1; z += S) {
        arcTuile([1, y, z], [1, y, z + S], [-0.05, -0.1, 0]);
        arcTuile([6, y, z], [6, y, z + S], [0.05, -0.1, 0]);
      }
    }
  });

  /* --- Charpente, visible dans l'écorché du versant nord --- */
  avec([1], 3, "toit", () => {
    for (let x = -6; x <= ECORCHE + 0.01; x += 0.6) L([x, H - 0.05, -4], [x, YA - 0.05, 0]); // chevrons
    for (let t = 0.08; t < 1; t += 0.11) L([-6, H + 4 * K * t + 0.02, -4 * (1 - t)], [ECORCHE, H + 4 * K * t + 0.02, -4 * (1 - t)]); // liteaux
    for (const t of [1 / 3, 2 / 3]) {
      // pannes
      const y = H + 4 * K * t - 0.2, z = -4 * (1 - t);
      L([-6, y, z], [6, y, z]);
      L([-6, y - 0.18, z], [ECORCHE, y - 0.18, z]);
    }
    L([-6, YA - 0.2, 0], [6, YA - 0.2, 0]); // panne faîtière
    L([-6, YA - 0.38, 0], [ECORCHE, YA - 0.38, 0]);
    // une ferme : entrait, arbalétriers, poinçon, contrefiches
    const fx = -3.75;
    L([fx, H, -4], [fx, H, 4]);
    L([fx, H, -4], [fx, YA - 0.2, 0]);
    L([fx, H, 4], [fx, YA - 0.2, 0]);
    L([fx, H, 0], [fx, YA - 0.2, 0]);
    L([fx, H + 0.25, 0], [fx, H + 0.95, -1.9]);
    L([fx, H + 0.25, 0], [fx, H + 0.95, 1.9]);
  });

  /* --- Zinguerie : gouttières, descentes, noues en zinc --- */
  avec([2], 3, "toit", () => {
    const gouttiere = (a, b, d) => {
      const o = (p, k, dy) => [p[0] + d[0] * k, p[1] + dy, p[2] + d[2] * k];
      L(o(a, 0.34, -0.06), o(b, 0.34, -0.06));
      L(o(a, 0.18, -0.24), o(b, 0.18, -0.24));
      L(o(a, 0.02, -0.06), o(b, 0.02, -0.06));
      for (const p of [a, b]) poly([o(p, 0.02, -0.06), o(p, 0.1, -0.22), o(p, 0.26, -0.22), o(p, 0.34, -0.06)]);
    };
    gouttiere([-6.1, H, -4], [6.1, H, -4], [0, 0, -1]);
    gouttiere([-6.1, H, 4], [1, H, 4], [0, 0, 1]);
    gouttiere([1, H, 4], [1, H, 10.1], [-1, 0, 0]);
    gouttiere([6, H, 4], [6, H, 10.1], [1, 0, 0]);
    const descente = (x, z, dx, dz) => {
      const h = H - 0.24, w = 0.12;
      const px = x + dx * 0.18, pz = z + dz * 0.18;
      L([x + dx * 0.4, h, z + dz * 0.4], [px, h - 0.45, pz]); // coude
      for (const k of [-w / 2, w / 2]) L([px + (dz ? k : 0), h - 0.45, pz + (dx ? k : 0)], [px + (dz ? k : 0), 0.35, pz + (dx ? k : 0)]);
      L([px, 0.35, pz], [px + dx * 0.3, 0.12, pz + dz * 0.3]); // dauphin
      for (const y of [h - 1.6, 2.2, 0.9]) L([px - (dz ? 0.1 : 0), y, pz - (dx ? 0.1 : 0)], [px + (dz ? 0.1 : 0), y, pz + (dx ? 0.1 : 0)]); // colliers
    };
    descente(-5.7, -4, 0, -1);
    descente(5.7, -4, 0, -1);
    descente(-5.7, 4, 0, 1);
    descente(1, 9.7, -1, 0);
    descente(6, 9.7, 1, 0);
    // noues en zinc (deux bords de la bande)
    const noue = (sens) => {
      const xb = sens < 0 ? 1 : 6;
      L([xb, H + 0.02, 4 - 0.22], [3.5, YB + 0.02, 1.5 - 0.22]);
      L([xb - sens * 0.22, H + 0.02, 4], [3.5 - sens * 0.18, YB + 0.02, 1.5 + 0.05]);
    };
    noue(-1);
    noue(1);
  });

  /* --- Étanchéité : cheminée et solin, fenêtre de toit et abergement --- */
  avec([3], 3, "toit", () => {
    const c = CHEM;
    const base = [[c.x0, yA(c.z0), c.z0], [c.x1, yA(c.z0), c.z0], [c.x1, yA(c.z1), c.z1], [c.x0, yA(c.z1), c.z1]];
    avec([3], 3, "mur", () => {
      poly(base, true);
      for (const p of base) L(p, [p[0], c.haut, p[2]]);
      poly(base.map((p) => [p[0], c.haut, p[2]]), true);
    });
    const r = 0.1;
    poly([[c.x0 - r, c.haut, c.z0 - r], [c.x1 + r, c.haut, c.z0 - r], [c.x1 + r, c.haut, c.z1 + r], [c.x0 - r, c.haut, c.z1 + r]], true);
    poly([[c.x0 - r, c.haut + 0.16, c.z0 - r], [c.x1 + r, c.haut + 0.16, c.z0 - r], [c.x1 + r, c.haut + 0.16, c.z1 + r], [c.x0 - r, c.haut + 0.16, c.z1 + r]], true);
    L([(c.x0 + c.x1) / 2, c.haut + 0.16, (c.z0 + c.z1) / 2], [(c.x0 + c.x1) / 2, c.haut + 0.55, (c.z0 + c.z1) / 2]);
    // solin : bande relevée tout autour, bavette côté égout
    const s = 0.16;
    const sol = [[c.x0 - s, yA(c.z0 - s) + 0.04, c.z0 - s], [c.x1 + s, yA(c.z0 - s) + 0.04, c.z0 - s], [c.x1 + s, yA(c.z1 + s) + 0.04, c.z1 + s], [c.x0 - s, yA(c.z1 + s) + 0.04, c.z1 + s]];
    poly(sol, true);
    poly(sol.map((p) => [p[0], p[1] + 0.3, p[2]]), true);
    poly([[c.x0 - s, yA(c.z1 + s) + 0.04, c.z1 + s], [c.x0 - s, yA(c.z1 + 0.5) + 0.03, c.z1 + 0.5], [c.x1 + s, yA(c.z1 + 0.5) + 0.03, c.z1 + 0.5], [c.x1 + s, yA(c.z1 + s) + 0.04, c.z1 + s]]);
    // fenêtre de toit
    const v = VELUX;
    const cadre = (m, dy) => [[v.x0 + m, yA(v.z0 + m) + dy, v.z0 + m], [v.x1 - m, yA(v.z0 + m) + dy, v.z0 + m], [v.x1 - m, yA(v.z1 - m) + dy, v.z1 - m], [v.x0 + m, yA(v.z1 - m) + dy, v.z1 - m]];
    poly(cadre(-0.14, 0.03), true); // abergement
    poly(cadre(0, 0.14), true);
    poly(cadre(0.12, 0.16), true);
    for (const p of cadre(0, 0.14)) L(p, [p[0], p[1] - 0.11, p[2]]);
  });

  /* --- Démoussage : touffes de mousse sur le versant nord --- */
  avec([4], 4, "toit", () => {
    let graine = 7;
    const alea = () => ((graine = (graine * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 18; i++) {
      const cx = ECORCHE + 0.4 + alea() * (6 - ECORCHE - 0.8);
      const cz = -3.7 + Math.pow(alea(), 1.6) * 3.2;
      const r = 0.14 + alea() * 0.18;
      const pts = [];
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * Math.PI * 2, rr = r * (0.7 + alea() * 0.5);
        const x = cx + Math.cos(a) * rr, z = cz + Math.sin(a) * rr * 0.8;
        pts.push([x, yA(z) + 0.05, z]);
      }
      poly(pts, true);
      MOUSSES.push(pts);
    }
  });
}

construire();

// couleur d'une arête selon le matériau qu'elle dessine
for (const sg of segs) {
  const z = sg.zones;
  sg.coul =
    sg.ordre === 0 ? C_TERRE
    : sg.ton === "mur" ? LIGNES.mur
    : z.includes(1) ? LIGNES.bois
    : z.length === 1 && z[0] === 2 ? LIGNES.zinc
    : z.length === 1 && z[0] === 3 ? LIGNES.etanche
    : z.length === 1 && z[0] === 4 ? LIGNES.mousse
    : LIGNES.toit;
}

/* --- Faces pleines --- */
const faces = [];
// centre : point (x, z) intérieur au volume, pour orienter les faces verticales vers l'extérieur
function F(tris, zones, ton, centre) { faces.push({ tris, zones, ton, centre }); }
const quad = (a, b, c, d) => [[a, b, c], [a, c, d]];

function construireFaces() {
  // versant nord de A (hors écorché, pour laisser voir la charpente)
  F(quad([ECORCHE, H, -4], [6, H, -4], [6, YA, 0], [ECORCHE, YA, 0]), [0, 4], "toit");
  // versant sud de A, découpé par l'aile B
  const o = [-6, YA, 0], a = [-6, H, 4], b = [1, H, 4], c = [3.5, YB, 1.5], d = [6, H, 4], e = [6, YA, 0];
  F([[o, a, b], [o, b, c], [o, c, e], [e, c, d]], [0], "toit");
  // aile B
  F(quad([1, H, 4], [1, H, 10], [3.5, YB, 10], [3.5, YB, 1.5]), [0], "toit");
  F(quad([6, H, 4], [6, H, 10], [3.5, YB, 10], [3.5, YB, 1.5]), [0], "toit");
  // murs et pignons
  F(quad([-6, 0, 4], [1, 0, 4], [1, H, 4], [-6, H, 4]), [], "mur");
  F(quad([-6, 0, -4], [6, 0, -4], [6, H, -4], [-6, H, -4]), [], "mur");
  F(quad([-6, 0, -4], [-6, 0, 4], [-6, H, 4], [-6, H, -4]), [], "mur");
  F([[[-6, H, -4], [-6, YA, 0], [-6, H, 4]]], [], "mur");
  F(quad([6, 0, -4], [6, 0, 4], [6, H, 4], [6, H, -4]), [], "mur");
  F([[[6, H, -4], [6, YA, 0], [6, H, 4]]], [], "mur");
  F(quad([1, 0, 4], [1, 0, 10], [1, H, 10], [1, H, 4]), [], "mur");
  F(quad([6, 0, 4], [6, 0, 10], [6, H, 10], [6, H, 4]), [], "mur");
  F(quad([1, 0, 10], [6, 0, 10], [6, H, 10], [1, H, 10]), [], "mur");
  F([[[1, H, 10], [3.5, YB, 10], [6, H, 10]]], [], "mur");
  // cheminée
  const ch = CHEM;
  const bas = [[ch.x0, yA(ch.z0), ch.z0], [ch.x1, yA(ch.z0), ch.z0], [ch.x1, yA(ch.z1), ch.z1], [ch.x0, yA(ch.z1), ch.z1]];
  const cc = [(ch.x0 + ch.x1) / 2, (ch.z0 + ch.z1) / 2];
  for (let i = 0; i < 4; i++) {
    const p0 = bas[i], p1 = bas[(i + 1) % 4];
    F(quad(p0, p1, [p1[0], ch.haut, p1[2]], [p0[0], ch.haut, p0[2]]), [3], "mur", cc);
  }
  // chapeau en terre cuite (dalle débordante)
  const r = 0.1, yc = ch.haut, yh = ch.haut + 0.16;
  const ch4 = (y) => [[ch.x0 - r, y, ch.z0 - r], [ch.x1 + r, y, ch.z0 - r], [ch.x1 + r, y, ch.z1 + r], [ch.x0 - r, y, ch.z1 + r]];
  const cb = ch4(yc), ct = ch4(yh);
  F(quad(...ct), [3], "chapeau");
  for (let i = 0; i < 4; i++) F(quad(cb[i], cb[(i + 1) % 4], ct[(i + 1) % 4], ct[i]), [3], "chapeau", cc);

  // fenêtres et volets ouverts (façade sud du corps A), porte et fenêtres du pignon de l'aile B
  const fenetre = (x, y, l, h, z, sens) => {
    const p = (x0, y0, x1, y1, dz) => quad([x0, y0, z + sens * dz], [x1, y0, z + sens * dz], [x1, y1, z + sens * dz], [x0, y1, z + sens * dz]);
    F(p(x, y, x + l, y + h, 0.03), [], "vitre");
    F(p(x - l / 2, y, x, y + h, 0.05), [], "volet");
    F(p(x + l, y, x + l * 1.5, y + h, 0.05), [], "volet");
    F(p(x - 0.05, y - 0.1, x + l + 0.05, y, 0.06), [], "mur"); // appui
  };
  for (const x of [-4.6, -2.4]) for (const y of [1, 3.4]) fenetre(x, y, 1, 1.3, 4, 1);
  for (const x of [1.6, 4.4]) fenetre(x, 3.2, 1, 1.2, 10, 1);
  F(quad([2.9, 0, 10.03], [4.1, 0, 10.03], [4.1, 2.3, 10.03], [2.9, 2.3, 10.03]), [], "porte");

  // fenêtre de toit : cadre et vitrage
  const v = VELUX;
  const cadre = (m, dy) => [[v.x0 + m, yA(v.z0 + m) + dy, v.z0 + m], [v.x1 - m, yA(v.z0 + m) + dy, v.z0 + m], [v.x1 - m, yA(v.z1 - m) + dy, v.z1 - m], [v.x0 + m, yA(v.z1 - m) + dy, v.z1 - m]];
  F(quad(...cadre(-0.02, 0.13)), [3], "cadre");
  F(quad(...cadre(0.12, 0.15)), [3], "vitre");

  // touffes de mousse
  for (const pts of MOUSSES) {
    const c = pts.reduce((m, q) => [m[0] + q[0] / pts.length, m[1] + q[1] / pts.length, m[2] + q[2] / pts.length], [0, 0, 0]);
    F(pts.map((q, i) => [c, q, pts[(i + 1) % pts.length]]), [4], "mousse");
  }

  // zinguerie : gouttières, descentes et noues en surfaces pleines (pour être colorées)
  const g = (a, b, d) => {
    const o = (p, k, dy) => [p[0] + d[0] * k, p[1] + dy, p[2] + d[2] * k];
    F(quad(o(a, 0.02, -0.06), o(b, 0.02, -0.06), o(b, 0.18, -0.24), o(a, 0.18, -0.24)), [2], "zinc");
    F(quad(o(a, 0.18, -0.24), o(b, 0.18, -0.24), o(b, 0.34, -0.06), o(a, 0.34, -0.06)), [2], "zinc");
  };
  g([-6.1, H, -4], [6.1, H, -4], [0, 0, -1]);
  g([-6.1, H, 4], [1, H, 4], [0, 0, 1]);
  g([1, H, 4], [1, H, 10.1], [-1, 0, 0]);
  g([6, H, 4], [6, H, 10.1], [1, 0, 0]);
  for (const [x, z, dx, dz] of [[-5.7, -4, 0, -1], [5.7, -4, 0, -1], [-5.7, 4, 0, 1], [1, 9.7, -1, 0], [6, 9.7, 1, 0]]) {
    const px = x + dx * 0.18, pz = z + dz * 0.18, w = 0.08, h = H - 0.69;
    const e = (k, y) => [px + (dz ? k : 0), y, pz + (dx ? k : 0)];
    F(quad(e(-w, 0.35), e(w, 0.35), e(w, h), e(-w, h)), [2], "zinc");
  }
  for (const sens of [-1, 1]) {
    const xb = sens < 0 ? 1 : 6;
    F(quad([xb, H + 0.03, 4 - 0.22], [3.5, YB + 0.03, 1.5 - 0.22], [3.5 - sens * 0.18, YB + 0.03, 1.55], [xb - sens * 0.22, H + 0.03, 4]), [2], "zinc");
  }
}
construireFaces();

/* --- Quadrillage au sol, comme sur une épure --- */
avec([], 0, "sol", () => {
  for (let x = -14; x <= 18; x += 2) L([x, 0, -10], [x, 0, 15]);
  for (let z = -10; z <= 15; z += 2) L([-14, 0, z], [18, 0, z]);
});

const ANCRES = [
  new THREE.Vector3(-4.6, yA(2.6), 2.6), // couverture
  new THREE.Vector3(-3.75, 6.2, -1.9),   // charpente
  new THREE.Vector3(6.25, H - 0.1, 8),   // zinguerie
  new THREE.Vector3(-3, CHEM.haut, 1.6), // étanchéité
  new THREE.Vector3(3.2, yA(-2.6), -2.6), // démoussage
];

/* ------------------------------------------------------------------ */
/* 2. Plans de caméra                                                  */
/* ------------------------------------------------------------------ */

const P = (pos, cible, ox, oy) => ({ pos: new THREE.Vector3(...pos), cible: new THREE.Vector3(...cible), ox, oy: oy || 0 });
const loin = (p, k) => P(p.cible.clone().add(p.pos.clone().sub(p.cible).multiplyScalar(k)).toArray(), p.cible.toArray(), 0, p.oy);

const BUREAU = {
  intro: P([0, 3.2, 52], [0, 3.2, 0], 0.25, -0.06),
  hero: P([-24, 18, 35], [0.6, 4, 2.6], 0.31, -0.06),
  zones: [
    P([-13, 15, 22], [-1.5, 6.1, 2.4], 0.2, -0.02),
    P([-17, 12, -18], [-3.6, 6, -1.6], 0.2, -0.02),
    P([18, 8.5, 21], [4.4, 4.6, 6], 0.2, -0.02),
    P([-8.5, 13, 13], [-2.2, 7, 2], 0.2, -0.02),
    P([15, 16, -17], [2.6, 6.2, -2], 0.2, -0.02),
  ],
  large: P([-34, 30, 42], [0, 4, 2], 0.15, 0),
};


const PLANS = mobile
  ? {
      intro: P([0, 3.4, 90], [0, 3.4, 0], 0, -0.2),
      hero: P([-30, 26, 50], [0.6, 4.4, 2.6], 0, -0.3),
      zones: BUREAU.zones.map((z) => ({ ...loin(z, 2), oy: -0.12 })), // oy recalculé selon la mise en page (cadrerMobile)
      large: loin(BUREAU.large, 1.3),
    }
  : BUREAU;

/* ------------------------------------------------------------------ */
/* 3. Rendu                                                            */
/* ------------------------------------------------------------------ */

function webglDisponible() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) {
    return false;
  }
}

if (racine) {
  if (!webglDisponible()) {
    racine.classList.add("scene--svg");
    racine.style.opacity = "1";
    racine.innerHTML = '<img src="/img/toiture.svg" alt="">';
    document.documentElement.classList.remove("intro");
  } else demarrer();
}

function demarrer() {
  const dpr = window.devicePixelRatio || 1;
  // Téléphone : densité plafonnée à 2 ; au-delà de 2 l'écran lisse déjà les traits, l'anticrénelage
  // matériel est alors coupé pour garder 60 images par seconde.
  const optionsRendu = { antialias: !mobile || dpr < 2, alpha: true, stencil: true, powerPreference: mobile ? "high-performance" : "low-power" };
  const renderer = new THREE.WebGLRenderer(optionsRendu);
  renderer.setPixelRatio(Math.min(dpr, mobile ? 1.75 : 1.5));
  // Téléphone sans accélération graphique (rendu logiciel, très lent) : la scène est dessinée
  // sans animation pour ne pas bloquer la page. Tous les téléphones récents ont un GPU.
  const logiciel = mobile && (() => {
    try {
      const gl = renderer.getContext();
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const nom = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
      return /swiftshader|llvmpipe|softpipe|software/i.test(nom);
    } catch (e) {
      return false;
    }
  })();
  const sansAnimation = reduit || logiciel;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  racine.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(mobile ? 38 : 32, 1, 0.1, 500);
  const groupe = new THREE.Group();
  scene.add(groupe);

  // ordre de tracé : sol, murs, toit, ouvrages, détails — de gauche à droite
  segs.sort((s, t) => s.ordre - t.ordre || Math.min(s.a[0], s.b[0]) - Math.min(t.a[0], t.b[0]));
  const n = segs.length;
  const positions = new Float32Array(n * 6);
  segs.forEach((s, i) => {
    positions.set(s.a, i * 6);
    positions.set(s.b, i * 6 + 3);
  });

  const geo = new LineSegmentsGeometry();
  geo.setPositions(positions);
  geo.setColors(new Float32Array(n * 6));
  const mat = new LineMaterial({ vertexColors: true, linewidth: mobile ? 1.25 : 1.5, transparent: true, worldUnits: false });
  mat.fog = true;
  const lignes = new LineSegments2(geo, mat);
  lignes.renderOrder = 1;
  groupe.add(lignes);
  const couleurs = geo.attributes.instanceColorStart.data;
  scene.fog = new THREE.Fog(FOND, 30, 90);

  /* --- Faces pleines en couleurs réelles, ombrées selon la lumière --- */
  // Deux maillages : le toit, texturé avec la photo des tuiles, et tout le reste (enduit,
  // menuiseries, zinc, terre cuite). Les coordonnées de texture suivent la pente de chaque
  // versant : les rangs de tuiles partent de l'égout et montent vers le faîtage.
  const nrm = new THREE.Vector3(), u = new THREE.Vector3(), w2 = new THREE.Vector3();
  const monte = new THREE.Vector3(), long = new THREE.Vector3();
  const nouveauLot = () => ({ pos: [], uv: [], base: [], zones: [], toit: [] });
  const lotToit = nouveauLot(), lotAutre = nouveauLot();
  for (const f of faces) {
    const lot = f.ton === "toit" ? lotToit : lotAutre;
    for (const [a, b, c] of f.tris) {
      u.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      w2.set(c[0] - a[0], c[1] - a[1], c[2] - a[2]);
      nrm.crossVectors(u, w2).normalize();
      // normale tournée vers l'extérieur : vers le ciel pour les pans, hors du volume pour les murs
      if (Math.abs(nrm.y) > 0.3) {
        if (nrm.y < 0) nrm.negate();
      } else {
        const cx = (a[0] + b[0] + c[0]) / 3, cz = (a[2] + b[2] + c[2]) / 3;
        const ctr = f.centre || (cz > 4.1 && cx > 0.9 ? [3.5, 7] : [0, 0]);
        if (nrm.x * (cx - ctr[0]) + nrm.z * (cz - ctr[1]) < 0) nrm.negate();
      }
      const k = 0.56 + 0.52 * Math.max(0, nrm.dot(LUMIERE));
      const base = TEINTES[f.ton].clone().multiplyScalar(k * k);
      if (f.ton === "toit") {
        monte.set(0, 1, 0).addScaledVector(nrm, -nrm.y).normalize();
        long.crossVectors(monte, nrm);
      }
      for (const p of [a, b, c]) {
        lot.pos.push(...p);
        lot.base.push(base);
        lot.zones.push(f.zones);
        lot.toit.push(f.ton === "toit" || f.ton === "mousse");
        if (f.ton === "toit") lot.uv.push((long.x * p[0] + long.y * p[1] + long.z * p[2]) / TU, (p[1] - H) / monte.y / TV);
      }
    }
  }
  const optionsFaces = {
    vertexColors: true,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
    polygonOffset: true,
    polygonOffsetFactor: 1.5,
    polygonOffsetUnits: 2,
    fog: true,
  };
  const maillages = [];
  for (const lot of [lotAutre, lotToit]) {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(lot.pos, 3));
    if (lot.uv.length) g.setAttribute("uv", new THREE.Float32BufferAttribute(lot.uv, 2));
    lot.col = new Float32Array(lot.pos.length);
    g.setAttribute("color", new THREE.BufferAttribute(lot.col, 3));
    lot.geo = g;
    lot.mat = new THREE.MeshBasicMaterial(optionsFaces);
    const m = new THREE.Mesh(g, lot.mat);
    m.renderOrder = 0;
    groupe.add(m);
    maillages.push(lot);
  }
  // Toit : teinte terre cuite unie le temps que la photo des tuiles arrive.
  lotToit.mat.color.copy(TUILE_ATTENTE);
  new THREE.TextureLoader().load(TEXTURE_TUILES, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    lotToit.mat.map = tex;
    lotToit.mat.color.set(0xffffff);
    lotToit.mat.needsUpdate = true;
    relancer();
  });

  /* --- Ombre portée au sol --- */
  // Projection des deux volumes (corps et aile) selon la lumière ; le pochoir évite que
  // les deux ombres se superposent et foncent davantage là où elles se croisent.
  const ombreMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
    fog: true,
    stencilWrite: true,
    stencilRef: 1,
    stencilFunc: THREE.NotEqualStencilFunc,
    stencilZPass: THREE.ReplaceStencilOp,
  });
  const projeter = ([x, y, z]) => [x - (LUMIERE.x * y) / LUMIERE.y, z - (LUMIERE.z * y) / LUMIERE.y];
  const enveloppe = (pts) => {
    const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const x = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const bas = [], haut = [];
    for (const q of p) { while (bas.length > 1 && x(bas[bas.length - 2], bas[bas.length - 1], q) <= 0) bas.pop(); bas.push(q); }
    for (const q of p.reverse()) { while (haut.length > 1 && x(haut[haut.length - 2], haut[haut.length - 1], q) <= 0) haut.pop(); haut.push(q); }
    return bas.slice(0, -1).concat(haut.slice(0, -1));
  };
  const ombrePos = [];
  for (const vol of [
    [[-6, 0, -4], [6, 0, -4], [6, 0, 4], [-6, 0, 4], [-6, H, -4], [6, H, -4], [6, H, 4], [-6, H, 4], [-6, YA, 0], [6, YA, 0]],
    [[1, 0, 4], [6, 0, 4], [6, 0, 10], [1, 0, 10], [1, H, 4], [6, H, 4], [6, H, 10], [1, H, 10], [3.5, YB, 10], [3.5, YB, 1.5]],
  ]) {
    const e = enveloppe(vol.map(projeter));
    for (let i = 1; i < e.length - 1; i++) for (const q of [e[0], e[i], e[i + 1]]) ombrePos.push(q[0], 0.02, q[1]);
  }
  const ombreGeo = new THREE.BufferGeometry();
  ombreGeo.setAttribute("position", new THREE.Float32BufferAttribute(ombrePos, 3));
  const ombre = new THREE.Mesh(ombreGeo, ombreMat);
  ombre.renderOrder = 2; // après les lignes du sol, qu'elle assombrit aussi
  groupe.add(ombre);
  const OPACITE_OMBRE = ombreMat.opacity;

  const opaciteFaces = (o) => {
    for (const l of maillages) l.mat.opacity = o;
    ombreMat.opacity = OPACITE_OMBRE * o;
  };

  /* --- Le cordeau de l'intro --- */
  const NB = 48;
  const cordeauGeo = new LineSegmentsGeometry();
  const cordeauPos = new Float32Array(NB * 6);
  cordeauGeo.setPositions(cordeauPos);
  const cc = new Float32Array(NB * 6);
  for (let i = 0; i < NB * 2; i++) C_ORANGE.toArray(cc, i * 3);
  cordeauGeo.setColors(cc);
  const cordeauMat = new LineMaterial({ vertexColors: true, linewidth: mobile ? 2.2 : 2.6, transparent: true, worldUnits: false });
  const cordeau = new LineSegments2(cordeauGeo, cordeauMat);
  cordeau.visible = false;
  groupe.add(cordeau);

  /* --- La poudre --- */
  const NP = 44;
  const poudreGeo = new THREE.BufferGeometry();
  const poudrePos = new Float32Array(NP * 3);
  const poudreVit = new Float32Array(NP * 3);
  poudreGeo.setAttribute("position", new THREE.BufferAttribute(poudrePos, 3));
  const poudreMat = new THREE.PointsMaterial({ color: C_ORANGE, size: mobile ? 3 : 3.5, sizeAttenuation: false, transparent: true, opacity: 0 });
  const poudre = new THREE.Points(poudreGeo, poudreMat);
  poudre.visible = false;
  groupe.add(poudre);

  const NZ = ANCRES.length;
  const etat = {
    largeur: 1,
    hauteur: 1,
    trace: 1,
    orange: 0,
    zones: new Array(NZ).fill(0),
    zoneActive: -1,
    pos: PLANS.hero.pos.clone(),
    cible: PLANS.hero.cible.clone(),
    ox: PLANS.hero.ox,
    oy: PLANS.hero.oy,
    opacite: 1,
    souris: new THREE.Vector2(),
    lissee: new THREE.Vector2(),
  };

  let intro = null;
  let derniere = 0;
  let enCours = false;
  let visible = !document.hidden;
  let derniereAncre = "";
  let derniereOpacite = "";

  /* --- Téléphone : la maison entière tient entre l'en-tête et le titre de l'accueil --- */
  // Le cadrage est calculé sur l'écran réel (hauteur variable d'un téléphone à l'autre) :
  // la caméra recule jusqu'à ce que toute la maison, cheminée comprise, entre dans l'espace
  // libre, puis la vue est recentrée dans cet espace.
  const HERO0 = { pos: PLANS.hero.pos.clone(), cible: PLANS.hero.cible.clone() };
  const POINTS = [];
  for (const sg of segs) if (sg.ordre >= 1) POINTS.push(sg.a, sg.b); // la maison seule, sans le tracé au sol
  function cadrerAccueil() {
    const accroche = document.querySelector(".accroche");
    const titre = accroche && accroche.querySelector("h1");
    if (!titre) return;
    const sy = window.scrollY;
    const w = etat.largeur, h = etat.hauteur;
    // Espace libre : téléphone, entre l'en-tête et le titre ; ordinateur et tablette en paysage,
    // à droite du texte et sous l'en-tête, quelle que soit la taille de l'écran.
    let gauche = 14, droite = w - 14, haut, bas;
    if (mobile) {
      haut = accroche.getBoundingClientRect().top + sy + 12;
      bas = titre.getBoundingClientRect().top + sy - 16;
    } else {
      const texte = accroche.querySelector(".accroche__texte") || titre;
      const vh = window.innerHeight;
      gauche = texte.getBoundingClientRect().right + Math.max(24, w * 0.02);
      droite = w - Math.max(24, w * 0.03);
      haut = accroche.getBoundingClientRect().top + sy + Math.max(24, vh * 0.05);
      bas = Math.min(vh, haut + vh * 0.62) - Math.max(24, vh * 0.06);
    }
    const A = bas - haut;
    const L = droite - gauche;
    if (A < 60 || L < 60 || w < 2 || h < 2) return;
    const cam = new THREE.PerspectiveCamera(camera.fov, w / h, 0.1, 500);
    const v = new THREE.Vector3();
    const boite = (pos) => {
      cam.position.copy(pos);
      cam.lookAt(HERO0.cible);
      cam.updateMatrixWorld();
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const q of POINTS) {
        v.set(q[0], q[1], q[2]).project(cam);
        const x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h;
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
      return { x0, x1, y0, y1 };
    };
    let pos = HERO0.pos.clone();
    for (let i = 0; i < 4; i++) {
      const b = boite(pos);
      const k = Math.max((b.y1 - b.y0) / A, (b.x1 - b.x0) / L);
      pos = HERO0.cible.clone().add(pos.clone().sub(HERO0.cible).multiplyScalar(k));
    }
    const b = boite(pos);
    PLANS.hero.pos.copy(pos);
    PLANS.hero.ox = -((b.x0 + b.x1) / 2 - (gauche + droite) / 2) / w;
    PLANS.hero.oy = -((b.y0 + b.y1) / 2 - (haut + bas) / 2) / h;
  }

  /* --- Téléphone : la zone est centrée dans l'espace libre entre les repères et la fiche --- */
  function cadrerMobile() {
    if (!mobile) return;
    const collant = document.querySelector(".visite__collant");
    const haut = document.querySelector(".visite__reperes");
    const bas = document.querySelector(".visite__fiches");
    if (!collant || !haut || !bas) return;
    const c = collant.getBoundingClientRect();
    const debut = (parseFloat(getComputedStyle(collant).top) || 0) + (haut.getBoundingClientRect().bottom - c.top);
    const fin = (parseFloat(getComputedStyle(collant).top) || 0) + (bas.getBoundingClientRect().top + 40 - c.top);
    const centre = (debut + fin) / 2;
    const oy = -(etat.hauteur / 2 - centre) / etat.hauteur;
    for (const z of PLANS.zones) z.oy = oy;
    relancer();
  }
  if (mobile && "ResizeObserver" in window) {
    const bas = document.querySelector(".visite__fiches");
    if (bas) new ResizeObserver(cadrerMobile).observe(bas);
  }

  let largeurConnue = 0;
  function redimensionner(e) {
    const w = window.innerWidth;
    const h = mobile ? Math.max(racine.clientHeight, window.innerHeight) : window.innerHeight;
    if (mobile && e && e.type === "resize" && w === largeurConnue) return;
    largeurConnue = w;
    etat.largeur = w;
    etat.hauteur = h;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = w + "px";
    renderer.domElement.style.height = h + "px";
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    mat.resolution.set(w, h);
    cordeauMat.resolution.set(w, h);
    cadrerAccueil();
    cadrerMobile();
    relancer();
  }

  const lisse = (t) => t * t * (3 - 2 * t);
  const c01 = (t) => Math.min(1, Math.max(0, t));
  function melanger(a, b, t, o) {
    o.pos.lerpVectors(a.pos, b.pos, t);
    o.cible.lerpVectors(a.cible, b.cible, t);
    o.ox = a.ox + (b.ox - a.ox) * t;
    o.oy = a.oy + (b.oy - a.oy) * t;
    return o;
  }

  const visite = document.querySelector("[data-visite]");
  const cibleC = { pos: new THREE.Vector3(), cible: new THREE.Vector3(), ox: 0, oy: 0, opacite: 1 };

  let mesures = null;
  function mesurer() {
    const collant = visite && visite.querySelector(".visite__collant");
    if (!collant) return;
    mesures = {
      haut: visite.offsetTop - (parseFloat(getComputedStyle(collant).top) || 0),
      course: Math.max(1, visite.offsetHeight - collant.offsetHeight),
    };
  }
  if (mobile && visite && "ResizeObserver" in window) {
    const ro = new ResizeObserver(() => { mesures = null; relancer(); });
    ro.observe(visite);
    ro.observe(document.body);
  }

  function calculerCible() {
    const y = window.scrollY, vh = window.innerHeight, o = cibleC;
    // Sans section de visite : vue d'ensemble seulement. Avec « réduire les animations »,
    // la caméra suit quand même les zones, mais par simples changements de vue (a = 1).
    if (!visite) {
      melanger(PLANS.hero, PLANS.hero, 0, o);
      o.opacite = y > vh * 0.9 ? 0 : 1;
      return o;
    }
    // Téléphone : la section collante démarre sous l'en-tête et ne fait pas toute la hauteur
    // de l'écran ; sur ordinateur, haut = début de la section et hauteur = écran.
    let haut, course;
    if (mobile) {
      // mesures mises en cache (aucun calcul de mise en page pendant le défilement)
      if (!mesures) mesurer();
      haut = mesures.haut;
      course = mesures.course;
    } else {
      haut = visite.offsetTop;
      course = Math.max(1, visite.offsetHeight - vh);
    }
    const fin = haut + course;
    if (y <= haut) {
      melanger(PLANS.hero, PLANS.zones[0], lisse(c01(y / Math.max(1, haut))), o);
      o.opacite = 1;
    } else if (y <= fin) {
      const p = c01((y - haut) / course) * NZ;
      const i = Math.min(NZ - 1, Math.floor(p));
      if (i === 0) melanger(PLANS.zones[0], PLANS.zones[0], 0, o);
      else melanger(PLANS.zones[i - 1], PLANS.zones[i], lisse(c01((p - i) / 0.45)), o);
      o.opacite = 1;
    } else {
      const t = lisse(c01((y - fin) / (vh * 1.2)));
      melanger(PLANS.zones[NZ - 1], PLANS.large, t, o);
      o.opacite = 1 - c01((y - fin) / (vh * 0.6));
    }
    return o;
  }

  // La zone a pu être choisie avant le chargement de la 3D (carrousel du téléphone).
  {
    const fiches = [...document.querySelectorAll("[data-visite] .fiche")];
    const k = fiches.findIndex((f) => f.classList.contains("est-active"));
    if (mobile && k >= 0) etat.zoneActive = k;
  }
  document.addEventListener("arv:zone", (e) => {
    etat.zoneActive = e.detail.zone;
    derniereAncre = "";
    relancer();
  });

  /* --- Couleurs : chaque matériau garde sa couleur ; la zone active passe à l'orange et le reste s'estompe --- */
  const tmp = new THREE.Color();
  let signature = "";
  function majCouleurs() {
    const sig = etat.orange.toFixed(3) + etat.zones.map((z) => z.toFixed(3)).join();
    if (sig === signature) return;
    signature = sig;
    const focus = Math.max(0, ...etat.zones);
    const arr = couleurs.array;
    for (let i = 0; i < n; i++) {
      const s = segs[i];
      let f = 0;
      for (const z of s.zones) f = Math.max(f, etat.zones[z]);
      if (s.ton === "sol") tmp.copy(C_SOL);
      else tmp.copy(s.coul).multiplyScalar(1 - 0.5 * focus * (1 - f)).lerp(C_ORANGE, Math.max(f, etat.orange));
      arr[i * 6] = arr[i * 6 + 3] = tmp.r;
      arr[i * 6 + 1] = arr[i * 6 + 4] = tmp.g;
      arr[i * 6 + 2] = arr[i * 6 + 5] = tmp.b;
    }
    couleurs.needsUpdate = true;
    for (const lot of maillages) {
      for (let i = 0; i < lot.base.length; i++) {
        let f = 0;
        for (const z of lot.zones[i]) f = Math.max(f, etat.zones[z]);
        tmp.copy(lot.base[i]).multiplyScalar(1 - 0.5 * focus * (1 - f));
        // toit et mousses : ils gardent leur couleur et s'éclairent un peu ; ailleurs, teinte orangée
        if (lot.toit[i]) tmp.multiplyScalar(1 + 0.25 * f);
        else tmp.lerp(C_ORANGE, f * 0.35);
        lot.col[i * 3] = tmp.r;
        lot.col[i * 3 + 1] = tmp.g;
        lot.col[i * 3 + 2] = tmp.b;
      }
      lot.geo.attributes.color.needsUpdate = true;
    }
  }

  /* --- Intro : le cordeau se tend, claque, la toiture se trace --- */
  function lancerIntro() {
    intro = { debut: performance.now(), duree: 2.6 };
    etat.trace = 0;
    etat.orange = 1;
    opaciteFaces(0);
    etat.pos.copy(PLANS.intro.pos);
    etat.cible.copy(PLANS.intro.cible);
    etat.ox = PLANS.intro.ox;
    etat.oy = PLANS.intro.oy;
    cordeau.visible = true;
    poudre.visible = true;
    try { sessionStorage.setItem("arv-intro", "1"); } catch (e) {}
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((ev) => window.addEventListener(ev, finirIntro, { once: true, passive: true }));
    relancer();
  }

  function finirIntro() {
    if (!intro) return;
    intro = null;
    etat.trace = 1;
    etat.orange = 0;
    opaciteFaces(1);
    cordeau.visible = false;
    poudre.visible = false;
    document.documentElement.classList.remove("intro");
    document.documentElement.classList.add("intro-finie");
    // Téléphone : la caméra rejoint sa place en douceur (pas de saut au premier toucher).
    if (!mobile) {
      const c = calculerCible();
      etat.pos.copy(c.pos);
      etat.cible.copy(c.cible);
      etat.ox = c.ox;
      etat.oy = c.oy;
    }
    relancer();
  }

  function animerIntro(t0) {
    const t = (t0 - intro.debut) / 1000;
    const span = 60;
    const tension = lisse(c01(t / 0.45));
    const vib = t > 0.45 && t < 0.72 ? Math.sin((t - 0.45) * 70) * 0.35 * (1 - (t - 0.45) / 0.27) : 0;
    for (let i = 0; i < NB; i++) {
      const u0 = i / NB, u1 = (i + 1) / NB;
      cordeauPos.set([(-span + 2 * span * u0) * tension, Math.sin(Math.PI * u0) * vib, 12, (-span + 2 * span * u1) * tension, Math.sin(Math.PI * u1) * vib, 12], i * 6);
    }
    cordeauGeo.setPositions(cordeauPos);
    if (t >= 0.72 && !intro.poudre) {
      intro.poudre = true;
      for (let i = 0; i < NP; i++) {
        poudrePos.set([(Math.random() - 0.5) * 30, 0.05, 12 + (Math.random() - 0.5) * 0.6], i * 3);
        poudreVit.set([(Math.random() - 0.5) * 1.2, 1.2 + Math.random() * 2.4, (Math.random() - 0.2) * 1.4], i * 3);
      }
    }
    if (intro.poudre) {
      const dt = Math.min(0.05, (t0 - (intro.prec || t0)) / 1000);
      for (let i = 0; i < NP; i++) {
        poudreVit[i * 3 + 1] -= 6 * dt;
        poudrePos[i * 3] += poudreVit[i * 3] * dt;
        poudrePos[i * 3 + 1] = Math.max(0, poudrePos[i * 3 + 1] + poudreVit[i * 3 + 1] * dt);
        poudrePos[i * 3 + 2] += poudreVit[i * 3 + 2] * dt;
      }
      poudreGeo.attributes.position.needsUpdate = true;
      poudreMat.opacity = 0.9 * (1 - c01((t - 0.72) / 0.9));
    }
    intro.prec = t0;
    etat.trace = c01((t - 0.75) / 1.35);
    if (t > 0.8) cordeau.visible = false;
    etat.orange = 1 - lisse(c01((t - 2.05) / 0.55));
    opaciteFaces(lisse(c01((t - 1.7) / 0.7)));
    const c = calculerCible();
    const m = lisse(c01((t - 1.25) / 1.35));
    etat.pos.lerpVectors(PLANS.intro.pos, c.pos, m);
    etat.cible.lerpVectors(PLANS.intro.cible, c.cible, m);
    etat.ox = PLANS.intro.ox + (c.ox - PLANS.intro.ox) * m;
    etat.oy = PLANS.intro.oy + (c.oy - PLANS.intro.oy) * m;
    if (t >= 2.05) document.documentElement.classList.remove("intro");
    if (t >= intro.duree) finirIntro();
  }

  /* --- Boucle de rendu à la demande --- */
  function relancer() {
    if (!enCours && visible) {
      enCours = true;
      derniere = 0;
      requestAnimationFrame(boucle);
    }
  }

  const v3 = new THREE.Vector3();
  // Téléphone : qualité adaptative. Si l'animation descend sous ~40 images par seconde de façon
  // durable, la finesse du rendu baisse d'un cran (jamais sous 1) pour retrouver la fluidité.
  const qualite = { ratio: renderer.getPixelRatio(), cumul: 0, n: 0, dernierChangement: 0 };
  function surveillerFluidite(intervalle, t0) {
    if (!mobile || intervalle <= 0 || intervalle > 100) return;
    qualite.cumul += intervalle;
    qualite.n++;
    if (qualite.n < 40) return;
    const moyenne = qualite.cumul / qualite.n;
    qualite.cumul = 0;
    qualite.n = 0;
    if (moyenne > 25 && qualite.ratio > 1 && t0 - qualite.dernierChangement > 1500) {
      qualite.ratio = Math.max(1, qualite.ratio - 0.25);
      qualite.dernierChangement = t0;
      renderer.setPixelRatio(qualite.ratio);
      renderer.setSize(etat.largeur, etat.hauteur, false);
    }
  }

  // Téléphone : la caméra suit le défilement comme un ressort amorti (accélère et freine en
  // douceur, sans dépasser), au lieu de repartir sèchement à chaque variation du défilement.
  const ressort = { pos: new THREE.Vector3(), cible: new THREE.Vector3(), ox: 0, oy: 0 };
  const W_RESSORT = 7.5;
  const tmpA = new THREE.Vector3();
  function suivreRessort(x, v, but, dt) {
    // accélération = w²·(but − x) − 2w·v (amortissement critique)
    tmpA.subVectors(but, x).multiplyScalar(W_RESSORT * W_RESSORT).addScaledVector(v, -2 * W_RESSORT);
    v.addScaledVector(tmpA, dt);
    x.addScaledVector(v, dt);
  }

  function boucle(t0) {
    if (!visible) { enCours = false; return; }
    const brut = derniere ? t0 - derniere : 0;
    const dt = derniere ? Math.min(0.05, brut / 1000) : 0.016;
    derniere = t0;
    let bouge = false;

    if (intro) {
      animerIntro(t0);
      bouge = true;
    } else {
      const c = calculerCible();
      const a = reduit ? 1 : 1 - Math.exp(-dt * 4.5);
      const ecart = etat.pos.distanceToSquared(c.pos) + etat.cible.distanceToSquared(c.cible);
      if (mobile && !sansAnimation) {
        // sous-pas de 1/120 s pour un ressort stable même si une image arrive en retard
        for (let reste = dt; reste > 1e-4; reste -= 1 / 120) {
          const h = Math.min(reste, 1 / 120);
          suivreRessort(etat.pos, ressort.pos, c.pos, h);
          suivreRessort(etat.cible, ressort.cible, c.cible, h);
          ressort.ox += (W_RESSORT * W_RESSORT * (c.ox - etat.ox) - 2 * W_RESSORT * ressort.ox) * h;
          etat.ox += ressort.ox * h;
          ressort.oy += (W_RESSORT * W_RESSORT * (c.oy - etat.oy) - 2 * W_RESSORT * ressort.oy) * h;
          etat.oy += ressort.oy * h;
        }
        if (ressort.pos.lengthSq() + ressort.cible.lengthSq() > 1e-6) bouge = true;
      } else {
        etat.pos.lerp(c.pos, a);
        etat.cible.lerp(c.cible, a);
        etat.ox += (c.ox - etat.ox) * a;
        etat.oy += (c.oy - etat.oy) * a;
      }
      etat.opacite += (c.opacite - etat.opacite) * a;
      if (ecart > 1e-5 || Math.abs(c.opacite - etat.opacite) > 0.002) bouge = true;
    }

    const az = sansAnimation ? 1 : 1 - Math.exp(-dt * 6);
    for (let i = 0; i < NZ; i++) {
      const but = i === etat.zoneActive ? 1 : 0;
      etat.zones[i] += (but - etat.zones[i]) * az;
      if (Math.abs(but - etat.zones[i]) > 0.003) bouge = true;
      else etat.zones[i] = but;
    }

    if (!reduit) {
      etat.lissee.lerp(etat.souris, 1 - Math.exp(-dt * 3));
      groupe.rotation.y = etat.lissee.x * 0.05;
      groupe.rotation.x = etat.lissee.y * 0.025;
      if (etat.lissee.distanceToSquared(etat.souris) > 1e-6) bouge = true;
    }

    geo.instanceCount = Math.max(1, Math.round(n * etat.trace));
    majCouleurs();

    camera.position.copy(etat.pos);
    camera.lookAt(etat.cible);
    const dist = etat.pos.distanceTo(etat.cible);
    scene.fog.near = dist * 0.8;
    scene.fog.far = dist * 2.1;
    const w = etat.largeur, h = etat.hauteur;
    camera.setViewOffset(w, h, -etat.ox * w, -etat.oy * h, w, h);
    const op = etat.opacite.toFixed(3);
    if (op !== derniereOpacite) { racine.style.opacity = op; derniereOpacite = op; }
    renderer.render(scene, camera);

    if (!mobile && etat.zoneActive >= 0 && !intro) {
      v3.copy(ANCRES[etat.zoneActive]).applyMatrix4(groupe.matrixWorld).project(camera);
      const x = Math.round((v3.x * 0.5 + 0.5) * w), y = Math.round((-v3.y * 0.5 + 0.5) * h);
      const cle = x + "," + y;
      if (cle !== derniereAncre) {
        derniereAncre = cle;
        document.dispatchEvent(new CustomEvent("arv:ancre", { detail: { x, y, zone: etat.zoneActive } }));
      }
    }

    if (bouge) {
      surveillerFluidite(brut, t0);
      requestAnimationFrame(boucle);
    } else {
      enCours = false;
      qualite.cumul = 0;
      qualite.n = 0;
    }
  }

  window.addEventListener("resize", redimensionner);
  window.addEventListener("orientationchange", () => setTimeout(() => redimensionner(), 250));
  window.addEventListener("scroll", relancer, { passive: true });
  if (!sansAnimation) {
    if (!mobile) {
      window.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        etat.souris.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
        relancer();
      }, { passive: true });
    } else {
      window.addEventListener("deviceorientation", (e) => {
        if (e.gamma == null) return;
        const c = (v) => Math.max(-1, Math.min(1, v));
        etat.souris.set(c(e.gamma / 25), c((e.beta - 45) / 30));
        relancer();
      }, { passive: true });
    }
  }
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible) relancer();
  });

  redimensionner();
  racine.classList.add("scene--prete");

  const html = document.documentElement;
  let introVue = false;
  try { introVue = !!sessionStorage.getItem("arv-intro"); } catch (e) {}
  // Téléphone : l'intro au cordeau se joue dès que la 3D est prête, si l'on est encore en haut de page.
  const introMobile = mobile && !sansAnimation && !introVue && window.scrollY < 40;
  if (introMobile || (html.classList.contains("intro") && !reduit && performance.now() < 1900 && window.scrollY < 40)) {
    lancerIntro();
  } else {
    html.classList.remove("intro");
    const c = calculerCible();
    etat.pos.copy(c.pos);
    etat.cible.copy(c.cible);
    etat.ox = c.ox;
    etat.oy = c.oy;
    etat.opacite = c.opacite;
    relancer();
  }

  // Outil : export SVG de la vue courante (window.__arvSVG()) pour l'image de secours.
  window.__arvSVG = (largeurMax = 30) => {
    const w = etat.largeur, h = etat.hauteur;
    camera.clearViewOffset();
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    const p = (q) => { v3.set(...q).applyMatrix4(groupe.matrixWorld).project(camera); return [((v3.x * 0.5 + 0.5) * w).toFixed(1), ((-v3.y * 0.5 + 0.5) * h).toFixed(1)]; };
    let toit = "", mur = "";
    for (const s of segs) {
      if (Math.abs(s.a[0]) > largeurMax || Math.abs(s.b[0]) > largeurMax) continue;
      const [x0, y0] = p(s.a), [x1, y1] = p(s.b);
      if (s.ton === "mur") mur += `M${x0} ${y0}L${x1} ${y1}`;
      else toit += `M${x0} ${y0}L${x1} ${y1}`;
    }
    // cadrage serré sur le dessin
    const nb = (toit + mur).match(/-?\d+(\.\d+)?/g).map(Number);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < nb.length; i += 2) { x0 = Math.min(x0, nb[i]); x1 = Math.max(x1, nb[i]); y0 = Math.min(y0, nb[i + 1]); y1 = Math.max(y1, nb[i + 1]); }
    const m = 12;
    relancer();
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${(x0 - m).toFixed(0)} ${(y0 - m).toFixed(0)} ${(x1 - x0 + 2 * m).toFixed(0)} ${(y1 - y0 + 2 * m).toFixed(0)}"><path d="${mur}" fill="none" stroke="#5B7C96" stroke-width="1.2" stroke-linecap="round"/><path d="${toit}" fill="none" stroke="#A8CAE4" stroke-width="1.3" stroke-linecap="round"/></svg>`;
  };
}
