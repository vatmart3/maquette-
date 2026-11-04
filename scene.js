/*
 * Multiservice Thau — « la maison tracée au cordeau ».
 * Une épure 3D (uniquement des arêtes) d'une maison du Bassin de Thau, tracée au
 * cordeau à l'arrivée, puis pilotée par le défilement.
 * Three.js 0.169.0, chargé par l'import map (jsDelivr). Aucun modèle à télécharger.
 */
import * as THREE from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

const racine = document.querySelector("[data-scene]");
const page = document.body.dataset.page || "";
const mqMobile = window.matchMedia("(max-width: 859px)");
const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = mqMobile.matches;

const BLEU = new THREE.Color("#2347A0");
const JAUNE = new THREE.Color("#F2C230");

/* ------------------------------------------------------------------ */
/* 1. La maison : une liste de segments                                */
/* ------------------------------------------------------------------ */

// zone : 0 dedans, 1 dehors, 2 petits travaux, 3 pros, -1 aucune
// ordre : 0 sol, 1 murs, 2 toit, 3 ouvertures, 4 détails
const segs = [];
let zoneCourante = -1;
let ordreCourant = 1;
let detailCourant = false;

function L(a, b) {
  segs.push({ a, b, zone: zoneCourante, ordre: ordreCourant });
}
function avec(zone, ordre, detail, fn) {
  const z = zoneCourante, o = ordreCourant, d = detailCourant;
  zoneCourante = zone; ordreCourant = ordre; detailCourant = detail;
  fn();
  zoneCourante = z; ordreCourant = o; detailCourant = d;
}
function poly(points, ferme) {
  for (let i = 0; i < points.length - 1; i++) L(points[i], points[i + 1]);
  if (ferme) L(points[points.length - 1], points[0]);
}
function boite(x0, y0, z0, x1, y1, z1) {
  const p = [
    [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1],
    [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1],
  ];
  poly([p[0], p[1], p[2], p[3]], true);
  poly([p[4], p[5], p[6], p[7]], true);
  for (let i = 0; i < 4; i++) L(p[i], p[i + 4]);
}
// rectangle dans un plan de façade avant/arrière (z constant)
function rectZ(x0, y0, x1, y1, z) {
  poly([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], true);
}
// rectangle dans un plan de façade latérale (x constant)
function rectX(z0, y0, z1, y1, x) {
  poly([[x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0]], true);
}
// rectangle horizontal (y constant)
function rectY(x0, z0, x1, z1, y) {
  poly([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], true);
}

const FACE = 4.02; // façade avant de la maison

function construireMaison() {
  /* --- Sol : le cordeau devient la ligne de terre --- */
  avec(-1, 0, false, () => {
    L([-16, 0, 8.6], [19, 0, 8.6]);
    poly([[-10.6, 0, 8.6], [-10.6, 0, -6], [11.6, 0, -6], [11.6, 0, 8.6]]);
  });

  /* --- Dedans : la maison, ses étages, ses ouvertures, l'intérieur --- */
  avec(0, 1, false, () => {
    boite(-5, 0, -4, 5, 6.2, 4);
    // bandeau de plancher
    poly([[-5, 3.1, 4], [5, 3.1, 4]]);
    poly([[-5, 3.1, -4], [-5, 3.1, 4]]);
  });
  avec(0, 3, false, () => {
    rectZ(-0.6, 0, 0.6, 2.3, FACE); // porte
    L([-0.6, 2.55, FACE], [0.6, 2.55, FACE]); // imposte
    for (const cx of [-3, 3]) rectZ(cx - 0.6, 0.9, cx + 0.6, 2.3, FACE);
    for (const cx of [-3, 0, 3]) rectZ(cx - 0.6, 3.9, cx + 0.6, 5.3, FACE);
    rectX(-1.2, 3.9, 0.2, 5.3, -5.02); // fenêtre latérale
  });
  avec(0, 4, true, () => {
    // appuis de fenêtres
    for (const cx of [-3, 3]) L([cx - 0.75, 0.82, FACE + 0.08], [cx + 0.75, 0.82, FACE + 0.08]);
    for (const cx of [-3, 0, 3]) L([cx - 0.75, 3.82, FACE + 0.08], [cx + 0.75, 3.82, FACE + 0.08]);
    // croisillons
    for (const cx of [-3, 3]) L([cx, 0.9, FACE], [cx, 2.3, FACE]);
    for (const cx of [-3, 0, 3]) L([cx, 3.9, FACE], [cx, 5.3, FACE]);
  });
  avec(0, 4, false, () => {
    // escalier intérieur, visible à travers l'épure
    const marches = 10, x0 = -4.4, x1 = -1.2, za = -3.6, zb = -2.6, h = 3.1;
    const profilA = [], profilB = [];
    for (let i = 0; i < marches; i++) {
      const xa = x0 + ((x1 - x0) * i) / marches, xb = x0 + ((x1 - x0) * (i + 1)) / marches;
      const ya = (h * i) / marches, yb = (h * (i + 1)) / marches;
      profilA.push([xa, ya, za], [xa, yb, za]);
      profilB.push([xa, ya, zb], [xa, yb, zb]);
      if (i === marches - 1) { profilA.push([xb, yb, za]); profilB.push([xb, yb, zb]); }
      L([xa, yb, za], [xa, yb, zb]);
    }
    poly(profilA);
    poly(profilB);
    // cloison avec passage
    poly([[1.6, 0, -4], [1.6, 3.1, -4]]);
    poly([[1.6, 3.1, -4], [1.6, 3.1, 0.6], [1.6, 0, 0.6]]);
    poly([[1.6, 0, -1.4], [1.6, 2.2, -1.4], [1.6, 2.2, -0.4], [1.6, 0, -0.4]]);
  });

  /* --- Toit de tuiles canal, faible pente --- */
  avec(-1, 2, false, () => {
    const ye = 6.2, yf = 7.5, d = 0.5;
    poly([[-5 - d, ye, 4 + d], [5 + d, ye, 4 + d], [5 + d, ye, -4 - d], [-5 - d, ye, -4 - d]], true);
    L([-5 - d, yf, 0], [5 + d, yf, 0]);
    for (const x of [-5 - d, 5 + d]) {
      L([x, ye, 4 + d], [x, yf, 0]);
      L([x, ye, -4 - d], [x, yf, 0]);
    }
  });
  avec(-1, 4, true, () => {
    const ye = 6.2, yf = 7.5, d = 0.5;
    for (let x = -5.1; x <= 5.2; x += 0.55) L([x, ye, 4 + d], [x, yf, 0]);
    for (const t of [0.34, 0.67]) {
      const y = ye + (yf - ye) * t, z = (4 + d) * (1 - t);
      L([-5 - d, y, z], [5 + d, y, z]);
    }
  });

  /* --- Dehors : terrasse sous pergola, jardin, muret, arbres --- */
  avec(1, 1, false, () => {
    boite(-10, 0, -2, -5, 0.25, 4.2); // dalle de terrasse
    for (const [x, z] of [[-9.8, -1.8], [-9.8, 4], [-5.2, 4]]) L([x, 0.25, z], [x, 2.9, z]);
    poly([[-5, 2.9, -1.8], [-9.8, 2.9, -1.8], [-9.8, 2.9, 4], [-5, 2.9, 4]]);
    // muret avant, coupé par le portillon
    boite(-10.6, 0, 7.75, -1.3, 0.9, 8.05);
    boite(1.3, 0, 7.75, 5, 0.9, 8.05);
    boite(-10.6, 0, 4.3, -10.3, 0.9, 7.75); // retour du muret
    // allée
    L([-0.6, 0, 7.75], [-0.6, 0, 4.5]);
    L([0.6, 0, 7.75], [0.6, 0, 4.5]);
  });
  avec(1, 4, true, () => {
    for (let x = -9.6; x <= -5.3; x += 0.6) L([x, 2.95, -1.8], [x, 2.95, 4]); // lattes de pergola
    // table et deux chaises sous la pergola
    rectY(-8.4, 0.6, -7.0, 1.6, 0.98);
    for (const [x, z] of [[-8.3, 0.7], [-7.1, 0.7], [-8.3, 1.5], [-7.1, 1.5]]) L([x, 0.25, z], [x, 0.98, z]);
    for (const x of [-9.1, -6.3]) {
      rectY(x - 0.25, 0.85, x + 0.25, 1.35, 0.68);
      L([x - 0.25, 0.25, 0.85], [x - 0.25, 0.68, 0.85]);
      L([x + 0.25, 0.25, 1.35], [x + 0.25, 0.68, 1.35]);
    }
    // lavandes le long du muret
    for (let x = -9.6; x < -2; x += 1.1) {
      for (let k = -1; k <= 1; k++) L([x + k * 0.12, 0, 7.3], [x + k * 0.22, 0.55 - Math.abs(k) * 0.1, 7.3 + k * 0.08]);
    }
  });
  avec(1, 4, false, () => {
    // olivier : tronc noueux et houppier bas, dessiné comme sur une épure
    const ox = -6.8, oz = 6.1;
    poly([[ox, 0, oz], [ox + 0.15, 0.8, oz], [ox - 0.1, 1.6, oz + 0.1], [ox + 0.05, 2.1, oz]]);
    poly([[ox + 0.05, 1.3, oz], [ox + 0.6, 1.9, oz - 0.15]]);
    const nuage = (cx, cy, cz, rx, ry, rz, graine) => {
      const N = 22;
      const bruit = (i) => 1 + 0.12 * Math.sin(i * 2.3 + graine) + 0.08 * Math.sin(i * 5.1 + graine * 2);
      const anneau = (f) => {
        const pts = [];
        for (let i = 0; i < N; i++) pts.push(f((i / N) * Math.PI * 2, bruit(i)));
        poly(pts, true);
      };
      anneau((a, k) => [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k, cz]);
      anneau((a, k) => [cx, cy + Math.sin(a) * ry * k, cz + Math.cos(a) * rz * k]);
      anneau((a, k) => [cx + Math.cos(a) * rx * k, cy - ry * 0.25, cz + Math.sin(a) * rz * k]);
    };
    nuage(ox + 0.15, 2.75, oz, 1.6, 0.85, 1.3, 1.7);
    // cyprès : un fuseau
    const cx = 3.9, cz = 6.6;
    const fuseau = (plan) => {
      const pts = [];
      const N = 16;
      for (let i = 0; i <= N; i++) {
        const t = i / N, y = 0.6 + t * 4.2, r = 0.5 * Math.sin(Math.PI * Math.pow(t, 0.8));
        pts.push(plan(r, y));
      }
      for (let i = N; i >= 0; i--) {
        const t = i / N, y = 0.6 + t * 4.2, r = 0.5 * Math.sin(Math.PI * Math.pow(t, 0.8));
        pts.push(plan(-r, y));
      }
      poly(pts);
    };
    fuseau((r, y) => [cx + r, y, cz]);
    fuseau((r, y) => [cx, y, cz + r]);
    L([cx, 0, cz], [cx, 0.6, cz]);
  });

  /* --- Petits travaux : volets, portillon, boîte aux lettres, gouttière --- */
  avec(2, 3, false, () => {
    const volets = (cx, y0, y1) => {
      rectZ(cx - 1.22, y0, cx - 0.62, y1, FACE + 0.04);
      rectZ(cx + 0.62, y0, cx + 1.22, y1, FACE + 0.04);
    };
    for (const cx of [-3, 3]) volets(cx, 0.9, 2.3);
    for (const cx of [-3, 0, 3]) volets(cx, 3.9, 5.3);
    // portillon et ses piliers
    boite(-1.3, 0, 7.7, -0.95, 1.15, 8.1);
    boite(0.95, 0, 7.7, 1.3, 1.15, 8.1);
    rectZ(-0.9, 0.12, 0.9, 1.0, 7.9);
    // boîte aux lettres sur le pilier
    boite(0.98, 0.72, 8.1, 1.27, 1.05, 8.32);
    // gouttière et descente
    L([-5.5, 6.1, 4.6], [5.5, 6.1, 4.6]);
    L([-5.4, 6.1, 4.6], [-5.4, 0, 4.6]);
    // marche devant la porte
    boite(-0.9, 0, 4.0, 0.9, 0.18, 4.5);
  });
  avec(2, 4, true, () => {
    // lames des volets
    const lames = (x0, x1, y0, y1) => {
      for (let y = y0 + 0.2; y < y1 - 0.05; y += 0.2) L([x0, y, FACE + 0.04], [x1, y, FACE + 0.04]);
    };
    for (const cx of [-3, 3]) { lames(cx - 1.22, cx - 0.62, 0.9, 2.3); lames(cx + 0.62, cx + 1.22, 0.9, 2.3); }
    for (const cx of [-3, 0, 3]) { lames(cx - 1.22, cx - 0.62, 3.9, 5.3); lames(cx + 0.62, cx + 1.22, 3.9, 5.3); }
    for (let x = -0.6; x <= 0.61; x += 0.3) L([x, 0.12, 7.9], [x, 1.0, 7.9]); // barreaux du portillon
    boite(0.9, 2.5, FACE, 1.1, 2.75, FACE + 0.18); // applique près de la porte
  });

  /* --- Pour les pros : le petit local commercial --- */
  avec(3, 1, false, () => {
    boite(5, 0, -3, 11, 3.8, 4);
    rectY(5, -3, 11, 4, 4.15);
    for (const [x, z] of [[5, 4], [11, 4], [11, -3]]) L([x, 3.8, z], [x, 4.15, z]);
  });
  avec(3, 3, false, () => {
    rectZ(5.6, 0.5, 9.2, 2.6, FACE); // vitrine
    rectZ(9.6, 0, 10.6, 2.4, FACE); // porte vitrée
    rectZ(5.8, 3.12, 9.0, 3.6, FACE); // enseigne
    // store banne
    poly([[5.4, 3.0, 4], [5.4, 2.4, 5.7], [10.8, 2.4, 5.7], [10.8, 3.0, 4]]);
    L([5.4, 2.4, 5.7], [5.4, 2.2, 5.7]);
    L([5.4, 2.2, 5.7], [10.8, 2.2, 5.7]);
    L([10.8, 2.4, 5.7], [10.8, 2.2, 5.7]);
  });
  avec(3, 4, true, () => {
    for (const x of [6.8, 8.0]) L([x, 0.5, FACE], [x, 2.6, FACE]);
    for (let x = 5.94; x < 10.8; x += 0.54) L([x, 3.0, 4], [x, 2.4, 5.7]); // rayures du store
  });
}

construireMaison();

const ANCRES = [
  new THREE.Vector3(-1.5, 4.6, 4),   // dedans
  new THREE.Vector3(-7.5, 2.9, 1.5), // dehors
  new THREE.Vector3(1.1, 1.1, 8.3),  // petits travaux
  new THREE.Vector3(8, 3.4, 4),      // pros
];

/* ------------------------------------------------------------------ */
/* 2. Plans de caméra                                                  */
/* ------------------------------------------------------------------ */

const P = (pos, cible, ox, oy) => ({ pos: new THREE.Vector3(...pos), cible: new THREE.Vector3(...cible), ox, oy: oy || 0 });

const PLANS = mobile
  ? {
      intro: P([0, 2.6, 82], [0, 2.6, 0], 0, -0.26),
      hero: P([-30, 25, 58], [0.5, 3, 0], 0, -0.3),
      zones: [
        P([-10, 9, 34], [0, 3.4, 0], 0, -0.12),
        P([-26, 11, 26], [-7, 1.5, 2], 0, -0.12),
        P([5, 6, 30], [0.5, 2, 6], 0, -0.12),
        P([26, 9, 26], [8, 2, 2], 0, -0.12),
      ],
      large: P([-46, 34, 62], [0, 1, 0], 0, -0.05),
    }
  : {
      intro: P([0, 1.9, 48], [0, 2.4, 0], 0.25, -0.075),
      hero: P([-22.5, 19, 45], [1.5, 3, 0], 0.25, -0.135),
      zones: [
        P([-8, 7, 28], [0, 3.2, 0], 0.2, -0.02),
        P([-24, 9, 22], [-7, 1.5, 2], 0.2, -0.02),
        P([4, 4.5, 24], [0.5, 1.8, 6], 0.2, -0.02),
        P([22, 7, 22], [8, 2, 2], 0.2, -0.02),
      ],
      large: P([-40, 30, 50], [0, 2, 0], 0.15, 0),
    };

const PAGE_A = P([24, 15, 34], [0, 2.4, 0], mobile ? 0 : 0.18, 0);
const PAGE_B = P([-24, 17, 34], [0, 2.4, 0], mobile ? 0 : 0.18, 0);

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

function secours() {
  racine.classList.add("scene--svg");
  racine.innerHTML = '<img src="img/maison.svg" alt="">';
  document.documentElement.classList.remove("intro");
}

if (!racine) {
  // rien à faire
} else if (!webglDisponible()) {
  secours();
} else {
  demarrer();
}

function demarrer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  racine.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(mobile ? 38 : 32, 1, 0.1, 500);
  const groupe = new THREE.Group();
  scene.add(groupe);

  // tri : sol, murs, toit, ouvertures, détails (et de gauche à droite dans chaque ordre)
  segs.sort((s, t) => s.ordre - t.ordre || Math.min(s.a[0], s.b[0]) - Math.min(t.a[0], t.b[0]));

  const n = segs.length;
  const positions = new Float32Array(n * 6);
  const couleurs = new Float32Array(n * 6);
  segs.forEach((s, i) => {
    positions.set(s.a, i * 6);
    positions.set(s.b, i * 6 + 3);
  });

  const geo = new LineSegmentsGeometry();
  geo.setPositions(positions);
  geo.setColors(couleurs);
  const mat = new LineMaterial({
    vertexColors: true,
    linewidth: 1.5,
    transparent: true,
    worldUnits: false,
  });
  const maison = new LineSegments2(geo, mat);
  groupe.add(maison);

  const colorBuffer = geo.attributes.instanceColorStart.data;

  /* --- Le cordeau de l'intro --- */
  const NB = 48;
  const cordeauGeo = new LineSegmentsGeometry();
  const cordeauPos = new Float32Array(NB * 6);
  cordeauGeo.setPositions(cordeauPos);
  const cordeauCol = new Float32Array(NB * 6);
  for (let i = 0; i < NB * 2; i++) JAUNE.toArray(cordeauCol, i * 3);
  cordeauGeo.setColors(cordeauCol);
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
  const poudreMat = new THREE.PointsMaterial({ color: JAUNE, size: mobile ? 3 : 3.5, sizeAttenuation: false, transparent: true, opacity: 0 });
  const poudre = new THREE.Points(poudreGeo, poudreMat);
  poudre.visible = false;
  groupe.add(poudre);

  /* --- État --- */
  const etat = {
    largeur: 1,
    hauteur: 1,
    trace: 1,            // part de la maison tracée (0..1)
    jaune: 0,            // jaune global (intro)
    zones: [0, 0, 0, 0], // allumage par zone
    zoneActive: -1,
    pos: PLANS.hero.pos.clone(),
    cible: PLANS.hero.cible.clone(),
    ox: PLANS.hero.ox,
    oy: PLANS.hero.oy,
    opacite: page === "accueil" ? 1 : 0.32,
    souris: new THREE.Vector2(),
    sourisLissee: new THREE.Vector2(),
  };

  let intro = null; // { debut, duree }
  let derniereFrame = 0;
  let enCours = false;
  let visible = !document.hidden;

  function redimensionner() {
    const w = window.innerWidth, h = window.innerHeight;
    etat.largeur = w;
    etat.hauteur = h;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = w + "px";
    renderer.domElement.style.height = h + "px";
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    mat.resolution.set(w, h);
    cordeauMat.resolution.set(w, h);
    relancer();
  }

  /* --- Cible de caméra selon le défilement --- */
  const lisse = (t) => t * t * (3 - 2 * t);
  const clamp01 = (t) => Math.min(1, Math.max(0, t));

  function melanger(a, b, t, sortie) {
    sortie.pos.lerpVectors(a.pos, b.pos, t);
    sortie.cible.lerpVectors(a.cible, b.cible, t);
    sortie.ox = a.ox + (b.ox - a.ox) * t;
    sortie.oy = a.oy + (b.oy - a.oy) * t;
    return sortie;
  }

  const visite = document.querySelector("[data-visite]");
  const cibleCourante = { pos: new THREE.Vector3(), cible: new THREE.Vector3(), ox: 0, oy: 0, opacite: 1 };

  function calculerCible() {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const out = cibleCourante;

    if (reduit) {
      melanger(PLANS.hero, PLANS.hero, 0, out);
      out.opacite = page === "accueil" ? (y > vh ? 0.35 : 1) : 0.3;
      return out;
    }

    if (page !== "accueil" || !visite) {
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      melanger(PAGE_A, PAGE_B, lisse(clamp01(y / max)), out);
      out.opacite = 0.3;
      return out;
    }

    const haut = visite.offsetTop;
    const course = Math.max(1, visite.offsetHeight - vh);
    const fin = haut + course;

    if (y <= haut) {
      melanger(PLANS.hero, PLANS.zones[0], lisse(clamp01(y / Math.max(1, haut))), out);
      out.opacite = 1;
    } else if (y <= fin) {
      const p = clamp01((y - haut) / course) * 4;
      const i = Math.min(3, Math.floor(p));
      const local = p - i;
      if (i === 0) melanger(PLANS.zones[0], PLANS.zones[0], 0, out);
      else melanger(PLANS.zones[i - 1], PLANS.zones[i], lisse(clamp01(local / 0.4)), out);
      out.opacite = 1;
    } else {
      const t = lisse(clamp01((y - fin) / (vh * 1.6)));
      melanger(PLANS.zones[3], PLANS.large, t, out);
      out.opacite = 1 - 0.7 * t;
    }
    return out;
  }

  document.addEventListener("mst:zone", (e) => {
    etat.zoneActive = e.detail.zone;
    derniereAncre = "";
    relancer();
  });

  /* --- Couleurs --- */
  const tmp = new THREE.Color();
  let signature = "";

  function majCouleurs() {
    const sig = etat.jaune.toFixed(3) + etat.zones.map((z) => z.toFixed(3)).join();
    if (sig === signature) return;
    signature = sig;
    const arr = colorBuffer.array;
    for (let i = 0; i < n; i++) {
      const s = segs[i];
      const z = s.zone >= 0 ? etat.zones[s.zone] : 0;
      const f = Math.max(etat.jaune, z);
      tmp.copy(BLEU).lerp(JAUNE, f);
      arr[i * 6] = arr[i * 6 + 3] = tmp.r;
      arr[i * 6 + 1] = arr[i * 6 + 4] = tmp.g;
      arr[i * 6 + 2] = arr[i * 6 + 5] = tmp.b;
    }
    colorBuffer.needsUpdate = true;
  }

  /* --- Intro --- */
  function lancerIntro() {
    const duree = 2.5;
    intro = { debut: performance.now(), duree };
    etat.trace = 0;
    etat.jaune = 1;
    etat.pos.copy(PLANS.intro.pos);
    etat.cible.copy(PLANS.intro.cible);
    etat.ox = PLANS.intro.ox;
    etat.oy = PLANS.intro.oy;
    cordeau.visible = true;
    poudre.visible = true;
    try { sessionStorage.setItem("mst-intro", "1"); } catch (e) {}
    const terminer = () => finirIntro();
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((ev) =>
      window.addEventListener(ev, terminer, { once: true, passive: true })
    );
    relancer();
  }

  function finirIntro() {
    if (!intro) return;
    intro = null;
    etat.trace = 1;
    etat.jaune = 0;
    cordeau.visible = false;
    poudre.visible = false;
    document.documentElement.classList.remove("intro");
    document.documentElement.classList.add("intro-finie");
    const c = calculerCible();
    etat.pos.copy(c.pos);
    etat.cible.copy(c.cible);
    etat.ox = c.ox;
    etat.oy = c.oy;
    relancer();
  }

  function animerIntro(maintenant) {
    const t = (maintenant - intro.debut) / 1000;
    const k = intro.duree / 2.5; // l'intro mobile est une version accélérée
    const T = (s) => s * k;
    const span = 70;

    // 1. le cordeau se tend d'un bord à l'autre (0 → 0.45 s)
    const tension = lisse(clamp01(t / T(0.45)));
    // 2. il vibre (0.45 → 0.7 s), puis claque
    const vib = t > T(0.45) && t < T(0.72) ? Math.sin((t - T(0.45)) * 70) * 0.35 * (1 - (t - T(0.45)) / T(0.27)) : 0;
    for (let i = 0; i < NB; i++) {
      const u0 = i / NB, u1 = (i + 1) / NB;
      const x0 = (-span + 2 * span * u0) * tension, x1 = (-span + 2 * span * u1) * tension;
      const b0 = Math.sin(Math.PI * u0) * vib, b1 = Math.sin(Math.PI * u1) * vib;
      cordeauPos.set([x0, b0, 8.6, x1, b1, 8.6], i * 6);
    }
    cordeauGeo.setPositions(cordeauPos);

    // la poudre au claquement
    const tClaque = T(0.72);
    if (t >= tClaque && !intro.poudre) {
      intro.poudre = true;
      for (let i = 0; i < NP; i++) {
        poudrePos.set([(Math.random() - 0.5) * 30, 0.05, 8.6 + (Math.random() - 0.5) * 0.6], i * 3);
        poudreVit.set([(Math.random() - 0.5) * 1.2, 1.2 + Math.random() * 2.4, (Math.random() - 0.2) * 1.4], i * 3);
      }
    }
    if (intro.poudre) {
      const dt = Math.min(0.05, (maintenant - (intro.derniere || maintenant)) / 1000);
      for (let i = 0; i < NP; i++) {
        poudreVit[i * 3 + 1] -= 6 * dt;
        poudrePos[i * 3] += poudreVit[i * 3] * dt;
        poudrePos[i * 3 + 1] = Math.max(0, poudrePos[i * 3 + 1] + poudreVit[i * 3 + 1] * dt);
        poudrePos[i * 3 + 2] += poudreVit[i * 3 + 2] * dt;
      }
      poudreGeo.attributes.position.needsUpdate = true;
      poudreMat.opacity = 0.9 * (1 - clamp01((t - tClaque) / T(0.9)));
    }
    intro.derniere = maintenant;

    // 3. la maison se trace arête par arête (0.75 → 2.0 s)
    etat.trace = clamp01((t - T(0.75)) / T(1.25));
    if (t > T(0.8)) cordeau.visible = false;

    // 4. jaune → bleu, caméra en trois-quarts, titre (2.0 → 2.5 s)
    const fin = clamp01((t - T(1.95)) / T(0.55));
    etat.jaune = 1 - lisse(fin);
    const c = calculerCible();
    const montee = lisse(clamp01((t - T(1.2)) / T(1.3)));
    etat.pos.lerpVectors(PLANS.intro.pos, c.pos, montee);
    etat.cible.lerpVectors(PLANS.intro.cible, c.cible, montee);
    etat.ox = PLANS.intro.ox + (c.ox - PLANS.intro.ox) * montee;
    etat.oy = PLANS.intro.oy + (c.oy - PLANS.intro.oy) * montee;

    if (t >= T(1.95)) document.documentElement.classList.remove("intro");
    if (t >= intro.duree) finirIntro();
  }

  /* --- Boucle de rendu à la demande --- */
  function relancer() {
    if (!enCours && visible) {
      enCours = true;
      derniereFrame = 0;
      requestAnimationFrame(boucle);
    }
  }

  const ancreEcran = new THREE.Vector3();
  let derniereAncre = "";

  function boucle(maintenant) {
    if (!visible) { enCours = false; return; }
    const dt = derniereFrame ? Math.min(0.05, (maintenant - derniereFrame) / 1000) : 0.016;
    derniereFrame = maintenant;
    let bouge = false;

    if (intro) {
      animerIntro(maintenant);
      bouge = true;
    } else {
      const c = calculerCible();
      const a = reduit ? 1 : 1 - Math.exp(-dt * 4.5);
      const avant = etat.pos.distanceToSquared(c.pos) + etat.cible.distanceToSquared(c.cible);
      etat.pos.lerp(c.pos, a);
      etat.cible.lerp(c.cible, a);
      etat.ox += (c.ox - etat.ox) * a;
      etat.oy += (c.oy - etat.oy) * a;
      etat.opacite += (c.opacite - etat.opacite) * a;
      if (avant > 1e-5 || Math.abs(c.opacite - etat.opacite) > 0.002) bouge = true;
    }

    // allumage des zones
    const az = reduit ? 1 : 1 - Math.exp(-dt * 6);
    for (let i = 0; i < 4; i++) {
      const but = i === etat.zoneActive ? 1 : 0;
      etat.zones[i] += (but - etat.zones[i]) * az;
      if (Math.abs(but - etat.zones[i]) > 0.003) bouge = true;
      else etat.zones[i] = but;
    }

    // parallaxe : souris sur ordinateur, inclinaison du téléphone sur mobile
    if (!reduit) {
      etat.sourisLissee.lerp(etat.souris, 1 - Math.exp(-dt * 3));
      groupe.rotation.y = etat.sourisLissee.x * 0.05;
      groupe.rotation.x = etat.sourisLissee.y * 0.025;
      if (etat.sourisLissee.distanceToSquared(etat.souris) > 1e-6) bouge = true;
    }

    geo.instanceCount = Math.max(1, Math.round(n * etat.trace));
    majCouleurs();

    camera.position.copy(etat.pos);
    camera.lookAt(etat.cible);
    const w = etat.largeur, h = etat.hauteur;
    camera.setViewOffset(w, h, -etat.ox * w, -etat.oy * h, w, h);
    racine.style.opacity = etat.opacite.toFixed(3);

    renderer.render(scene, camera);

    // position à l'écran de la zone active (pour le fil jaune des fiches)
    if (etat.zoneActive >= 0 && !intro) {
      ancreEcran.copy(ANCRES[etat.zoneActive]).applyMatrix4(groupe.matrixWorld).project(camera);
      const x = Math.round((ancreEcran.x * 0.5 + 0.5) * w), y = Math.round((-ancreEcran.y * 0.5 + 0.5) * h);
      const cle = x + "," + y;
      if (cle !== derniereAncre) {
        derniereAncre = cle;
        document.dispatchEvent(new CustomEvent("mst:ancre", { detail: { x, y, zone: etat.zoneActive } }));
      }
    }

    if (bouge) requestAnimationFrame(boucle);
    else enCours = false;
  }

  /* --- Événements --- */
  window.addEventListener("resize", redimensionner);
  window.addEventListener("scroll", relancer, { passive: true });
  if (!mobile && !reduit) {
    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      etat.souris.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      relancer();
    }, { passive: true });
  }
  if (mobile && !reduit) {
    window.addEventListener("deviceorientation", (e) => {
      if (e.gamma == null) return;
      const c = (v) => Math.max(-1, Math.min(1, v));
      etat.souris.set(c(e.gamma / 25), c((e.beta - 45) / 30));
      relancer();
    }, { passive: true });
  }
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible) relancer();
  });

  redimensionner();
  racine.classList.add("scene--prete");

  // Intro : seulement sur l'accueil, une fois par session, si la 3D est prête vite.
  const html = document.documentElement;
  const tropTard = performance.now() > 1900;
  if (page === "accueil" && html.classList.contains("intro") && !reduit && !tropTard && window.scrollY < 40) {
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

  // Export SVG de secours (outil de développement : window.__mstSVG())
  window.__mstSVG = () => {
    const w = etat.largeur, h = etat.hauteur;
    const v = new THREE.Vector3();
    const pts = (p) => { v.set(...p).applyMatrix4(groupe.matrixWorld).project(camera); return [((v.x * 0.5 + 0.5) * w).toFixed(1), ((-v.y * 0.5 + 0.5) * h).toFixed(1)]; };
    let d = "";
    for (const s of segs) {
      if (Math.abs(s.a[0]) > 30 || Math.abs(s.b[0]) > 30) continue;
      const [x0, y0] = pts(s.a), [x1, y1] = pts(s.b);
      d += `M${x0} ${y0}L${x1} ${y1}`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice"><path d="${d}" fill="none" stroke="#2347A0" stroke-width="1.4" stroke-linecap="round"/></svg>`;
  };
}
