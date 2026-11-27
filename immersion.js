/*
 * Couvreur Proximité 34 — la maison en 3D de l'accueil.
 * Maison de plain-pied d'après les plans fournis : 8,40 × 6,20 m, murs de 2,60 m, faîtage à 5,20 m,
 * toiture à deux pans en tuiles noires, enduit blanc, soubassement gris, porte entre deux fenêtres
 * sur chaque façade, une fenêtre par pignon, cheminée, gouttières et descentes. Construite ici
 * (aucun fichier à télécharger) : légère et fluide, y compris sur téléphone.
 *
 * Au défilement, la caméra suit le doigt et tourne autour de la maison pour aller chercher, de
 * près, chaque intervention, comme sur la planche des plans : dessus (couverture), droite
 * (charpente, couverture rendue transparente), face (gouttière et descente), gauche (solin de
 * cheminée), arrière (démoussage) ; un repère orange signale la partie concernée, puis la maison
 * revient en perspective. La barre avant / après coupe l'image : à gauche, la même maison avant
 * travaux (mousse, lichens, tuiles cassées, coulures).
 * Three.js 0.169 par import map ; chargé par site.js seulement avec une vraie puce graphique.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const fig = document.querySelector("[data-avant-apres]");
const cadre = fig && fig.querySelector(".avant-apres__cadre");
const curseur = fig && fig.querySelector(".avant-apres__curseur");
const visite = document.querySelector("[data-visite]");
const reperes = [...document.querySelectorAll(".visite__reperes button")];
const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const telephone = window.matchMedia("(max-width: 859px)").matches;
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

/* --- Dimensions (mètres) : façades le long de x, pignons le long de z, entrée en z > 0 --- */
const LG = 8.4, PR = 6.2, HM = 2.6, FAITAGE = 5.2;
const X1 = LG / 2, Z1 = PR / 2;
const PENTE = (FAITAGE - HM) / Z1; // ≈ 40°
const DEB = 0.35, DEB_PIGNON = 0.2;  // débords de toiture
const yToit = (z) => FAITAGE - PENTE * Math.abs(z); // dessus du pan (sans épaisseur)
const CHEM = { x: -2.9, z: -0.75, c: 0.56, haut: 5.85 };

/* --- Vues : az = angle autour de la maison (0 = face, π/2 = droite), el = hauteur, d = distance --- */
const PERSPECTIVE = { nom: "Vue en perspective", cible: V3(0, 2.3, 0), az: 0.62, el: 0.24, d: 23.5 };
// chaque intervention : vue rapprochée centrée sur la partie concernée
const P_TOIT = V3(1.6, yToit(1.5) + 0.06, 1.5);
const P_FAITAGE = V3(1.4, FAITAGE - 0.3, 0);
const P_GOUTTIERE = V3(-X1 + 0.15, HM - 0.12, Z1 + DEB + 0.08);
const P_SOLIN = V3(CHEM.x - CHEM.c / 2 - 0.05, yToit(CHEM.z) + 0.15, CHEM.z);
const P_MOUSSE = V3(1.5, yToit(-1.6) + 0.06, -1.6);
const ZONES = [
  { nom: "Vue de dessus", cible: P_TOIT.clone().setY(P_TOIT.y - 0.2), az: 0.12, el: 1.12, d: 9.5, point: P_TOIT },         // couverture
  { nom: "Vue de droite", cible: V3(1.0, 4.2, 0.2), az: 0.95, el: 0.32, d: 9.5, point: P_FAITAGE },                         // charpente
  { nom: "Vue de face", cible: V3(-3.4, 2.2, Z1), az: 0.4, el: 0.12, d: 5.2, point: P_GOUTTIERE },                       // zinguerie
  { nom: "Vue de gauche", cible: V3(CHEM.x, yToit(CHEM.z) + 0.2, CHEM.z), az: -2.05, el: 0.42, d: 5.2, point: P_SOLIN },   // solin de cheminée
  { nom: "Vue arrière", cible: P_MOUSSE.clone().setY(P_MOUSSE.y - 0.3), az: 2.8, el: 0.5, d: 8, point: P_MOUSSE },          // démoussage
];

if (cadre) demarrer().catch(() => {});

async function demarrer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, telephone ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false; // maison immobile : ombres calculées une seule fois
  renderer.debug.checkShaderErrors = false; // vérification lente, inutile en production
  renderer.autoClear = false;
  const toile = renderer.domElement;
  toile.className = "avant-apres__3d";
  toile.setAttribute("aria-hidden", "true");
  cadre.insertBefore(toile, cadre.firstChild);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.6;
  pmrem.dispose();
  const soleil = new THREE.DirectionalLight(0xfff3e4, 2.0);
  soleil.position.set(-9, 16, 12);
  soleil.castShadow = true;
  soleil.shadow.mapSize.set(telephone ? 1024 : 2048, telephone ? 1024 : 2048);
  Object.assign(soleil.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 2, far: 50 });
  soleil.shadow.bias = -0.0004;
  soleil.shadow.normalBias = 0.03;
  scene.add(soleil, new THREE.HemisphereLight(0xf4f6f8, 0xb8ad98, 0.45));

  /* ------------------------------------------------------------------ */
  /* Textures dessinées                                                   */
  /* ------------------------------------------------------------------ */
  let graine = 34;
  const alea = () => ((graine = (graine * 16807) % 2147483647) / 2147483647);
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  function toileTex(l, h, dessin, { couleur = true, repete = true } = {}) {
    const c = document.createElement("canvas");
    c.width = l;
    c.height = h;
    dessin(c.getContext("2d"), l, h);
    const t = new THREE.CanvasTexture(c);
    if (couleur) t.colorSpace = THREE.SRGBColorSpace;
    if (repete) t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = aniso;
    return t;
  }
  const partout = (l, h, x, y, r, f) => {
    for (const dx of [-l, 0, l]) for (const dy of [-h, 0, h]) if (x + dx > -r && x + dx < l + r && y + dy > -r && y + dy < h + r) f(x + dx, y + dy);
  };
  const rond = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); };

  // tuiles noires à emboîtement : 4 colonnes × 4 rangs pour 1,2 m ; le haut de l'image va vers le faîtage
  const NC = 4, NR = 4;
  const nuances = Array.from({ length: NC * NR }, () => 0.85 + alea() * 0.3);
  function tuiles(g, L, H) {
    const cl = L / NC, rh = H / NR;
    for (let r = 0; r < NR; r++)
      for (let c = 0; c < NC; c++) {
        const x = c * cl, y = r * rh, k = nuances[r * NC + c], t = (v) => Math.round(v * k);
        let gr = g.createLinearGradient(x, 0, x + cl, 0);
        gr.addColorStop(0, `rgb(${t(34)},${t(36)},${t(40)})`);
        gr.addColorStop(0.18, `rgb(${t(52)},${t(55)},${t(60)})`);
        gr.addColorStop(0.32, `rgb(${t(40)},${t(42)},${t(47)})`);
        gr.addColorStop(0.7, `rgb(${t(44)},${t(46)},${t(51)})`);
        gr.addColorStop(0.86, `rgb(${t(64)},${t(67)},${t(73)})`);
        gr.addColorStop(1, `rgb(${t(28)},${t(30)},${t(34)})`);
        g.fillStyle = gr;
        g.fillRect(x, y, cl, rh);
        gr = g.createLinearGradient(0, y, 0, y + rh);
        gr.addColorStop(0, "rgba(0,0,0,0.6)");
        gr.addColorStop(0.16, "rgba(0,0,0,0)");
        gr.addColorStop(0.92, "rgba(255,255,255,0.03)");
        gr.addColorStop(1, "rgba(255,255,255,0.1)");
        g.fillStyle = gr;
        g.fillRect(x, y, cl, rh);
      }
    for (let i = 0; i < 5000; i++) {
      g.fillStyle = alea() < 0.5 ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.05)";
      g.fillRect(alea() * L, alea() * H, 1.5, 1.5);
    }
  }
  function relief(g, L, H) {
    const cl = L / NC, rh = H / NR;
    for (let r = 0; r < NR; r++)
      for (let c = 0; c < NC; c++) {
        const x = c * cl, y = r * rh;
        const gh = g.createLinearGradient(x, 0, x + cl, 0);
        gh.addColorStop(0, "#404040");
        gh.addColorStop(0.18, "#b0b0b0");
        gh.addColorStop(0.32, "#707070");
        gh.addColorStop(0.86, "#909090");
        gh.addColorStop(1, "#303030");
        g.fillStyle = gh;
        g.fillRect(x, y, cl, rh);
        const gv = g.createLinearGradient(0, y, 0, y + rh);
        gv.addColorStop(0, "rgba(0,0,0,0.8)");
        gv.addColorStop(0.2, "rgba(0,0,0,0.2)");
        gv.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = gv;
        g.fillRect(x, y, cl, rh);
      }
  }
  function tuilesAvant(g, L, H) {
    tuiles(g, L / 2, H / 2);
    for (const [dx, dy] of [[L / 2, 0], [0, H / 2], [L / 2, H / 2]]) g.drawImage(g.canvas, 0, 0, L / 2, H / 2, dx, dy, L / 2, H / 2);
    g.globalCompositeOperation = "multiply";
    g.fillStyle = "rgb(205,195,170)";
    g.fillRect(0, 0, L, H);
    g.globalCompositeOperation = "source-over";
    // traînées claires de calcaire et taches sombres
    for (let i = 0; i < 18; i++) {
      const x = alea() * L, w = 6 + alea() * 18;
      partout(L, H, x, 0, w, (px) => {
        const gr = g.createLinearGradient(0, 0, 0, H);
        gr.addColorStop(0, "rgba(160,150,120,0)");
        gr.addColorStop(1, "rgba(160,150,120,0.22)");
        g.fillStyle = gr;
        g.fillRect(px - w / 2, 0, w, H);
      });
    }
    // mousse en plaques (vert jaune), plus dense au nez des tuiles
    const cl = L / (2 * NC), rh = H / (2 * NR);
    for (let p = 0; p < 4; p++) {
      const cx = alea() * L, cy = alea() * H, R = 35 + alea() * 70;
      for (let i = 0; i < 110; i++) {
        const a = alea() * Math.PI * 2, d = Math.sqrt(alea()) * R, r = 2.5 + alea() * 6;
        g.fillStyle = `hsl(${74 + alea() * 18}, ${38 + alea() * 22}%, ${24 + alea() * 20}%)`;
        partout(L, H, cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.6, r, (x, y) => rond(g, x, y, r));
      }
    }
    for (let r = 0; r < 2 * NR; r++)
      for (let c = 0; c < 2 * NC; c++) {
        if (alea() < 0.7) continue;
        for (let i = 0; i < 10; i++) {
          g.fillStyle = `hsl(${78 + alea() * 14}, 45%, ${26 + alea() * 16}%)`;
          rond(g, c * cl + alea() * cl, r * rh + rh * (0.78 + alea() * 0.2), 2 + alea() * 3);
        }
      }
    // lichens
    for (let i = 0; i < 420; i++) {
      g.fillStyle = alea() < 0.6 ? "rgba(214,196,120,0.9)" : "rgba(210,212,190,0.85)";
      const r = 1.2 + alea() * 2.2;
      partout(L, H, alea() * L, alea() * H, r, (x, y) => rond(g, x, y, r));
    }
    // deux tuiles cassées par répétition : trou noir et liteau
    for (let k = 0; k < 2; k++) {
    const tc = Math.floor(alea() * 2 * NC), tr = 1 + Math.floor(alea() * (2 * NR - 1));
    const x = tc * cl + cl * 0.1, y = tr * rh + rh * 0.12;
    g.fillStyle = "#0b0a09";
    g.beginPath();
    g.moveTo(x, y + rh * 0.1);
    g.lineTo(x + cl * 0.55, y);
    g.lineTo(x + cl * 0.8, y + rh * 0.35);
    g.lineTo(x + cl * 0.65, y + rh * 0.75);
    g.lineTo(x + cl * 0.1, y + rh * 0.7);
    g.closePath();
    g.fill();
    g.fillStyle = "#7a5636";
    g.fillRect(x + cl * 0.05, y + rh * 0.42, cl * 0.72, 5);
    }
  }
  // enduit blanc : 1 répétition = 2 m
  function enduit(g, L, H) {
    g.fillStyle = "#efefec";
    g.fillRect(0, 0, L, H);
    for (let i = 0; i < 12000; i++) {
      g.fillStyle = alea() < 0.5 ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.06)";
      g.fillRect(alea() * L, alea() * H, 1.5, 1.5);
    }
  }
  // enduit avant travaux : toute la façade (8,4 × 5,2 m), coulures sous l'égout (2,6 m), voile gris
  function enduitAvant(g, L, H) {
    g.fillStyle = "#dcdcd4";
    g.fillRect(0, 0, L, H);
    for (let i = 0; i < 16000; i++) {
      g.fillStyle = alea() < 0.5 ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)";
      g.fillRect(alea() * L, alea() * H, 1.5, 1.5);
    }
    const yEgout = H * (1 - HM / FAITAGE);
    let gr = g.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, "rgba(80,86,70,0.28)");
    gr.addColorStop(0.5, "rgba(80,86,70,0.2)");
    gr.addColorStop(0.62, "rgba(80,86,70,0.04)");
    gr.addColorStop(0.92, "rgba(80,86,70,0.0)");
    gr.addColorStop(1, "rgba(60,64,52,0.3)");
    g.fillStyle = gr;
    g.fillRect(0, 0, L, H);
    let x = alea() * 10;
    while (x < L) {
      const l = 2 + alea() * 7, long = 30 + alea() * (H - yEgout) * 0.75, f = 0.3 + alea() * 0.45;
      gr = g.createLinearGradient(0, yEgout, 0, yEgout + long);
      gr.addColorStop(0, `rgba(40,48,32,${f})`);
      gr.addColorStop(1, "rgba(40,48,32,0)");
      g.fillStyle = gr;
      g.fillRect(x - l / 2, yEgout, l, long);
      x += 5 + alea() * 22;
    }
    g.strokeStyle = "rgba(70,70,64,0.8)";
    g.lineWidth = 1.2;
    for (let i = 0; i < 5; i++) {
      let px = 40 + alea() * (L - 80), py = yEgout + 20 + alea() * 120;
      g.beginPath();
      g.moveTo(px, py);
      for (let k = 0; k < 10; k++) g.lineTo((px += (alea() - 0.5) * 12), (py += 6 + alea() * 10));
      g.stroke();
    }
  }
  function grain(g, L, H) {
    g.fillStyle = "#808080";
    g.fillRect(0, 0, L, H);
    for (let i = 0; i < 12000; i++) {
      const v = Math.round(100 + alea() * 56);
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.fillRect(alea() * L, alea() * H, 1.5, 1.5);
    }
  }
  // plan du rez-de-chaussée : 8,4 × 6,2 m, le haut de l'image = l'arrière de la maison
  function plan(g, L, H) {
    const m = L / LG; // pixels par mètre
    const X = (x) => (x + X1) * m, Y = (z) => (z + Z1) * m;
    const parquet = (x0, z0, x1, z1) => {
      g.fillStyle = "#e3cfa8";
      g.fillRect(X(x0), Y(z0), (x1 - x0) * m, (z1 - z0) * m);
      g.strokeStyle = "rgba(150,115,70,0.25)";
      g.lineWidth = 1;
      for (let x = x0; x < x1; x += 0.16) { g.beginPath(); g.moveTo(X(x), Y(z0)); g.lineTo(X(x), Y(z1)); g.stroke(); }
    };
    const carrelage = (x0, z0, x1, z1) => {
      g.fillStyle = "#d6d9db";
      g.fillRect(X(x0), Y(z0), (x1 - x0) * m, (z1 - z0) * m);
      g.strokeStyle = "rgba(120,128,134,0.35)";
      for (let x = x0; x < x1; x += 0.4) { g.beginPath(); g.moveTo(X(x), Y(z0)); g.lineTo(X(x), Y(z1)); g.stroke(); }
      for (let z = z0; z < z1; z += 0.4) { g.beginPath(); g.moveTo(X(x0), Y(z)); g.lineTo(X(x1), Y(z)); g.stroke(); }
    };
    parquet(-X1, -Z1, X1, Z1);
    carrelage(-X1, -Z1, -1.4, 0);
    carrelage(1.4, -Z1, X1, 0);
    const meuble = (x0, z0, x1, z1, couleur = "#c9cdd1", trait = "#8b9196") => {
      g.fillStyle = couleur;
      g.strokeStyle = trait;
      g.lineWidth = 2;
      g.beginPath();
      if (g.roundRect) g.roundRect(X(x0), Y(z0), (x1 - x0) * m, (z1 - z0) * m, 6);
      else g.rect(X(x0), Y(z0), (x1 - x0) * m, (z1 - z0) * m);
      g.fill();
      g.stroke();
    };
    // chambres : lits et chevets
    for (const [x0, x1] of [[-3.95, -2.35], [2.35, 3.95]]) {
      meuble(x0, 0.7, x1, 2.7, "#eef0f1");
      meuble(x0 + 0.12, 0.8, x1 - 0.12, 1.15, "#d4d8db");
      meuble(x0 - 0.0, 1.6, x1, 2.7, "#b9c2ca");
    }
    // salle de bains : baignoire, lavabo, WC
    meuble(-4.05, -2.95, -3.3, -1.25, "#f4f6f7");
    meuble(-2.6, -2.95, -1.7, -2.45, "#f4f6f7");
    meuble(-2.2, -0.75, -1.65, -0.2, "#f4f6f7");
    // cuisine : plan de travail en L, table
    meuble(1.6, -2.95, 4.05, -2.35, "#c7ccd0");
    meuble(3.45, -2.35, 4.05, -0.9, "#c7ccd0");
    meuble(2.0, -1.6, 2.9, -0.7, "#cfb48a", "#9c8059");
    // séjour : canapé, table basse, table à manger
    meuble(-1.1, 0.5, 1.1, 1.05, "#9aa6b2");
    meuble(-0.5, -0.1, 0.5, 0.3, "#cfb48a", "#9c8059");
    meuble(-0.75, -2.3, 0.75, -1.3, "#cfb48a", "#9c8059");
    // cloisons (avec passages)
    g.fillStyle = "#2a2e33";
    const mur = (x0, z0, x1, z1) => g.fillRect(X(x0), Y(z0), (x1 - x0) * m, (z1 - z0) * m);
    for (const sx of [-1.4, 1.4]) {
      mur(sx - 0.06, -Z1, sx + 0.06, -1.65);
      mur(sx - 0.06, -0.8, sx + 0.06, 1.15);
      mur(sx - 0.06, 2.0, sx + 0.06, Z1);
    }
    mur(-X1, -0.06, -1.4, 0.06);
    mur(1.4, -0.06, X1, 0.06);
    // murs extérieurs épais, ouvertures en clair
    const ep = 0.22;
    mur(-X1, -Z1, X1, -Z1 + ep); mur(-X1, Z1 - ep, X1, Z1); mur(-X1, -Z1, -X1 + ep, Z1); mur(X1 - ep, -Z1, X1, Z1);
    g.fillStyle = "#a9c4d6";
    for (const x of [-2.8, 2.8]) { g.fillRect(X(x - 0.65), Y(Z1 - ep), 1.3 * m, ep * m); g.fillRect(X(x - 0.65), Y(-Z1), 1.3 * m, ep * m); }
    g.fillRect(X(-X1), Y(1.0 - 0.28), ep * m, 0.56 * m);
    g.fillRect(X(X1 - ep), Y(-1.2 - 0.28), ep * m, 0.56 * m);
    g.fillStyle = "#e3cfa8";
    g.fillRect(X(-0.48), Y(Z1 - ep), 0.96 * m, ep * m);
    g.fillRect(X(-0.48), Y(-Z1), 0.96 * m, ep * m);
  }
  const T = {
    tuiles: toileTex(512, 512, tuiles),
    tuilesAvant: toileTex(1024, 1024, tuilesAvant),
    relief: toileTex(512, 512, relief, { couleur: false }),
    enduit: toileTex(512, 512, enduit),
    enduitAvant: toileTex(1024, 634, enduitAvant, { repete: false }),
    grain: toileTex(256, 256, grain, { couleur: false }),
    plan: toileTex(1050, 775, plan, { repete: false }),
  };
  // les murs portent des coordonnées « façade entière » (0 → 1) : l'enduit propre se répète tous les 2 m
  T.enduit.repeat.set(LG / 2, FAITAGE / 2);
  T.tuilesAvant.repeat.set(0.5, 0.5); // une répétition du vieillissement = 2,4 m

  /* ------------------------------------------------------------------ */
  /* Matériaux                                                            */
  /* ------------------------------------------------------------------ */
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const paire = (apres, avant) => ({ apres, avant: avant || apres });
  const M = {
    toit: paire(
      std({ map: T.tuiles, bumpMap: T.relief, bumpScale: 3, roughness: 0.62, metalness: 0.05 }),
      std({ map: T.tuilesAvant, bumpMap: T.relief, bumpScale: 3, roughness: 0.85 })
    ),
    mur: paire(
      std({ map: T.enduit, bumpMap: T.grain, bumpScale: 0.5, roughness: 0.95, side: THREE.DoubleSide }),
      std({ map: T.enduitAvant, bumpMap: T.grain, bumpScale: 0.5, roughness: 0.97, side: THREE.DoubleSide })
    ),
    bois: paire(std({ color: 0xc08a52, roughness: 0.75 }), std({ color: 0x7d6650, roughness: 0.9 })),
  };
  const zinc = std({ color: 0x8e959c, roughness: 0.35, metalness: 0.6, side: THREE.DoubleSide });
  const noir = std({ color: 0x1d1f22, roughness: 0.45, metalness: 0.25 });
  const verre = std({ color: 0x5f7482, roughness: 0.05, metalness: 0.7, envMapIntensity: 1.4, transparent: true, opacity: 0.88 });
  const voilage = std({ color: 0xe9e9e6, roughness: 0.9 });
  const gris = std({ color: 0xa8a9a8, roughness: 0.92, bumpMap: T.grain, bumpScale: 1 });
  const blanc = std({ color: 0xf2f2ef, roughness: 0.85 });
  const cloison = std({ color: 0xf4f4f1, roughness: 0.9, side: THREE.DoubleSide });

  const maison = new THREE.Group();
  scene.add(maison);
  const aPaire = [];
  const avantSeul = new THREE.Group();
  maison.add(avantSeul);
  function ajouter(geo, mat, parent = maison) {
    const m = new THREE.Mesh(geo, mat.apres || mat);
    m.castShadow = true;
    m.receiveShadow = true;
    if (mat.apres) { m.userData.paire = mat; aPaire.push(m); }
    parent.add(m);
    return m;
  }
  const bloc = (l, h, p, mat, x, y, z, parent) => {
    const m = ajouter(new THREE.BoxGeometry(l, h, p), mat, parent);
    m.position.set(x, y, z);
    return m;
  };

  /* ------------------------------------------------------------------ */
  /* La maison                                                            */
  /* ------------------------------------------------------------------ */
  // mur à partir d'un contour (coordonnées locales : u le long du mur, v en hauteur) avec ouvertures
  function mur(contour, trous, origine, angle, uDebut) {
    const forme = new THREE.Shape(contour.map(([u, v]) => new THREE.Vector2(u, v)));
    for (const [u0, v0, u1, v1] of trous) forme.holes.push(new THREE.Path([new THREE.Vector2(u0, v0), new THREE.Vector2(u0, v1), new THREE.Vector2(u1, v1), new THREE.Vector2(u1, v0)]));
    const g = new THREE.ShapeGeometry(forme);
    const pos = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + uDebut) / LG, pos.getY(i) / FAITAGE);
    const m = ajouter(g, M.mur);
    m.position.copy(origine);
    m.rotation.y = angle;
    return m;
  }
  // ouverture : tableau (retours d'enduit), menuiserie noire, vitrage, voilage, appui
  function fenetre(cx, y0, l, h, normale, porte = false) {
    // repère local : u le long de la façade, n vers l'extérieur
    const n = normale, u = V3(-n.z, 0, n.x);
    const place = (obj, du, dy, dn) => obj.position.copy(V3(cx.x, 0, cx.z).addScaledVector(u, du).addScaledVector(n, dn).setY(dy));
    const tourne = (obj) => (obj.rotation.y = Math.atan2(n.x, n.z));
    const ep = 0.22;
    // tableaux en retrait d'1 cm de la façade (pas de surfaces confondues)
    for (const s of [-1, 1]) { const t = bloc(0.03, h, ep - 0.02, M.mur, 0, 0, 0); place(t, s * (l / 2 + 0.015), y0 + h / 2, -ep / 2 - 0.01); tourne(t); }
    const linteau = bloc(l + 0.06, 0.03, ep - 0.02, M.mur, 0, 0, 0); place(linteau, 0, y0 + h + 0.015, -ep / 2 - 0.01); tourne(linteau);
    const e = 0.055, prof = -ep + 0.05;
    for (const [dl, dh, du, dy] of [[l, e, 0, y0 + e / 2], [l, e, 0, y0 + h - e / 2], [e, h, -l / 2 + e / 2, y0 + h / 2], [e, h, l / 2 - e / 2, y0 + h / 2]]) {
      const b = bloc(dl, dh, 0.07, noir, 0, 0, 0); place(b, du, dy, prof); tourne(b);
    }
    if (porte) {
      const p = bloc(l - 2 * e, h - e, 0.05, noir, 0, 0, 0); place(p, 0, y0 + (h - e) / 2, prof - 0.01); tourne(p);
      const v = new THREE.Mesh(new THREE.PlaneGeometry(0.16, h * 0.72), verre); place(v, -l * 0.18, y0 + h * 0.52, prof + 0.02); tourne(v); maison.add(v);
      const poignee = bloc(0.03, 0.22, 0.04, zinc, 0, 0, 0); place(poignee, l * 0.3, y0 + 1.0, prof + 0.05); tourne(poignee);
      const marche = bloc(l + 0.5, 0.14, 0.55, gris, 0, 0, 0); place(marche, 0, 0.07, 0.25); tourne(marche);
    } else {
      const meneau = bloc(e * 0.8, h, 0.07, noir, 0, 0, 0); place(meneau, 0, y0 + h / 2, prof); tourne(meneau);
      const v = new THREE.Mesh(new THREE.PlaneGeometry(l - e, h - e), verre); place(v, 0, y0 + h / 2, prof - 0.01); tourne(v); maison.add(v);
      for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.PlaneGeometry(l * 0.22, h - 0.15), voilage); place(r, s * l * 0.3, y0 + h / 2, prof - 0.12); tourne(r); maison.add(r); }
      const appui = bloc(l + 0.14, 0.045, 0.28, gris, 0, 0, 0); place(appui, 0, y0 - 0.02, 0.04); tourne(appui);
    }
  }
  const FEN = { l: 1.3, h: 1.15, y: 0.95 }, PORTE = { l: 0.95, h: 2.15 }, PET = { l: 0.55, h: 1.25, y: 0.95 };
  // façades avant (z = +Z1) et arrière (z = -Z1) : fenêtres en x = ±2,8, porte au centre
  const trousFacade = (sens) => [-2.8, 2.8].map((x) => [sens * x + X1 - FEN.l / 2, FEN.y, sens * x + X1 + FEN.l / 2, FEN.y + FEN.h]).concat([[X1 - PORTE.l / 2, 0, X1 + PORTE.l / 2, PORTE.h]]);
  const rect = [[0, 0], [LG, 0], [LG, HM], [0, HM]];
  mur(rect, trousFacade(1), V3(-X1, 0, Z1), 0, 0);
  mur(rect, trousFacade(-1), V3(X1, 0, -Z1), Math.PI, 0);
  // pignons : gauche (x = -X1, de l'arrière vers l'avant) et droit (x = +X1, de l'avant vers l'arrière)
  const pignon = [[0, 0], [PR, 0], [PR, HM], [PR / 2, FAITAGE], [0, HM]];
  mur(pignon, [[Z1 + 1.0 - PET.l / 2, PET.y, Z1 + 1.0 + PET.l / 2, PET.y + PET.h]], V3(-X1, 0, -Z1), -Math.PI / 2, 1.1);
  mur(pignon, [[Z1 + 1.2 - PET.l / 2, PET.y, Z1 + 1.2 + PET.l / 2, PET.y + PET.h]], V3(X1, 0, Z1), Math.PI / 2, 1.1);
  for (const x of [-2.8, 2.8]) {
    fenetre(V3(x, 0, Z1), FEN.y, FEN.l, FEN.h, V3(0, 0, 1));
    fenetre(V3(-x, 0, -Z1), FEN.y, FEN.l, FEN.h, V3(0, 0, -1));
  }
  fenetre(V3(0, 0, Z1), 0, PORTE.l, PORTE.h, V3(0, 0, 1), true);
  fenetre(V3(0, 0, -Z1), 0, PORTE.l, PORTE.h, V3(0, 0, -1), true);
  fenetre(V3(-X1, 0, 1.0), PET.y, PET.l, PET.h, V3(-1, 0, 0));
  fenetre(V3(X1, 0, -1.2), PET.y, PET.l, PET.h, V3(1, 0, 0));
  // soubassement gris
  for (const [l, p, x, z] of [[LG + 0.06, 0.04, 0, Z1 + 0.02], [LG + 0.06, 0.04, 0, -Z1 - 0.02], [0.04, PR + 0.06, -X1 - 0.02, 0], [0.04, PR + 0.06, X1 + 0.02, 0]]) bloc(l, 0.24, p, gris, x, 0.12, z);
  // dalle intérieure avec le plan dessiné, et cloisons (visibles par les fenêtres et dans le plan)
  const sol = new THREE.Mesh(new THREE.PlaneGeometry(LG, PR), new THREE.MeshStandardMaterial({ map: T.plan, roughness: 0.85 }));
  sol.rotation.x = -Math.PI / 2;
  sol.position.y = 0.03;
  sol.receiveShadow = true;
  maison.add(sol);
  // cloisons arrêtées à 15 cm des murs extérieurs (pas de surfaces confondues qui scintillent)
  const IN = 0.15;
  for (const sx of [-1.4, 1.4]) for (const [z0, z1] of [[-Z1 + IN, -1.65], [-0.8, 1.15], [2.0, Z1 - IN]]) bloc(0.1, 2.45, z1 - z0, cloison, sx, 1.225, (z0 + z1) / 2);
  bloc(X1 - 1.4 - IN, 2.45, 0.1, cloison, -(X1 + 1.4 + IN) / 2, 1.225, 0);
  bloc(X1 - 1.4 - IN, 2.45, 0.1, cloison, (X1 + 1.4 + IN) / 2, 1.225, 0);
  const plafond = new THREE.Mesh(new THREE.PlaneGeometry(LG, PR), cloison);
  plafond.rotation.x = Math.PI / 2;
  plafond.scale.set((LG - 0.3) / LG, (PR - 0.3) / PR, 1);
  plafond.position.y = HM - 0.06;
  maison.add(plafond);

  // toiture : deux pans en tuiles, rives, bandeau, faîtières
  const toitGroupe = new THREE.Group();
  maison.add(toitGroupe);
  const EP = 0.14; // épaisseur de la couverture
  const z0 = Z1 + DEB, y0 = yToit(z0);
  for (const s of [1, -1]) {
    const longueur = Math.hypot(z0, FAITAGE - y0);
    const g = new THREE.PlaneGeometry(LG + 2 * DEB_PIGNON, longueur);
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * (LG + 2 * DEB_PIGNON)) / 1.2, (uv.getY(i) * longueur) / 1.2);
    const pan = ajouter(g, M.toit, toitGroupe);
    pan.position.set(0, (FAITAGE + y0) / 2 + EP, (s * z0) / 2);
    // le haut de la texture monte vers le faîtage, la face visible regarde le ciel
    if (s > 0) pan.rotation.set(-Math.PI / 2 + Math.atan(PENTE), 0, 0);
    else pan.rotation.set(Math.PI / 2 - Math.atan(PENTE), Math.PI, 0);
    // dessous du débord et épaisseur
    const dessous = ajouter(new THREE.PlaneGeometry(LG + 2 * DEB_PIGNON, longueur), blanc, toitGroupe);
    dessous.position.copy(pan.position).setY(pan.position.y - EP);
    dessous.rotation.copy(pan.rotation);
    dessous.rotateX(Math.PI);
    bloc(LG + 2 * DEB_PIGNON, EP + 0.08, 0.04, blanc, 0, y0 + EP / 2 - 0.02, s * (z0 + 0.01), toitGroupe);
    // rives (bord des pignons)
    for (const sx of [-1, 1]) {
      const rive = bloc(0.05, EP + 0.06, longueur, noir, sx * (X1 + DEB_PIGNON), (FAITAGE + y0) / 2 + EP / 2, (s * z0) / 2, toitGroupe);
      rive.rotation.x = s * Math.atan(PENTE);
    }
    // gouttière demi-ronde et crochets
    const gout = ajouter(new THREE.CylinderGeometry(0.075, 0.075, LG + 0.2, 16, 1, true, Math.PI, Math.PI), zinc, toitGroupe);
    gout.rotation.z = Math.PI / 2;
    gout.position.set(0, y0 - 0.02, s * (z0 + 0.1));
  }
  const faitieres = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.13, 0.15, 0.46, 14, 1, false, 0, Math.PI), M.toit.apres, Math.ceil((LG + 0.4) / 0.42));
  {
    const o = new THREE.Object3D();
    for (let i = 0; i < faitieres.count; i++) {
      o.position.set(-X1 - DEB_PIGNON + 0.2 + i * 0.42, FAITAGE + EP + 0.02, 0);
      o.rotation.set(0, 0, Math.PI / 2);
      o.updateMatrix();
      faitieres.setMatrixAt(i, o.matrix);
    }
  }
  faitieres.castShadow = true;
  faitieres.userData.paire = M.toit;
  aPaire.push(faitieres);
  toitGroupe.add(faitieres);
  // descentes d'eau aux quatre angles, avec coude et dauphin
  for (const sx of [-1, 1])
    for (const s of [1, -1]) {
      const x = sx * (X1 - 0.12), z = s * (Z1 + 0.12);
      const d = ajouter(new THREE.CylinderGeometry(0.045, 0.045, y0 - 0.55, 12), zinc);
      d.position.set(x, (y0 - 0.55) / 2 + 0.1, z);
      const c = ajouter(new THREE.CylinderGeometry(0.045, 0.045, 0.38, 12), zinc);
      c.position.set(x, y0 - 0.32, z + s * 0.15);
      c.rotation.x = s * 0.7;
    }
  // cheminée enduite, chapeau et solin
  {
    const base = yToit(CHEM.z) - 0.4;
    bloc(CHEM.c, CHEM.haut - base, CHEM.c, M.mur, CHEM.x, (CHEM.haut + base) / 2, CHEM.z);
    bloc(CHEM.c + 0.14, 0.07, CHEM.c + 0.14, gris, CHEM.x, CHEM.haut + 0.035, CHEM.z);
    bloc(0.16, 0.18, 0.16, gris, CHEM.x, CHEM.haut + 0.16, CHEM.z);
    const solin = bloc(CHEM.c + 0.12, 0.06, CHEM.c + 0.4, zinc, CHEM.x, yToit(CHEM.z) + EP + 0.02, CHEM.z, toitGroupe);
    solin.rotation.x = -Math.atan(PENTE); // pan arrière
  }

  // charpente : chevrons, pannes et faîtière, visibles quand la couverture devient transparente
  const charpente = new THREE.Group();
  charpente.visible = false;
  maison.add(charpente);
  const poutre = (u, v, ep = 0.07, h = 0.16) => {
    const m = ajouter(new THREE.BoxGeometry(ep, u.distanceTo(v), h), M.bois, charpente);
    m.position.copy(u).add(v).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(V3(0, 1, 0), v.clone().sub(u).normalize());
  };
  for (let x = -X1; x <= X1 + 0.01; x += 0.6)
    for (const s of [1, -1]) poutre(V3(x, HM - 0.05, s * Z1), V3(x, FAITAGE - 0.1, 0));
  poutre(V3(-X1, FAITAGE - 0.18, 0), V3(X1, FAITAGE - 0.18, 0), 0.16, 0.24);
  for (const s of [1, -1]) poutre(V3(-X1, (HM + FAITAGE) / 2 - 0.15, (s * Z1) / 2), V3(X1, (HM + FAITAGE) / 2 - 0.15, (s * Z1) / 2), 0.14, 0.2);

  // état « avant » : mousse dans les gouttières
  {
    const mats = [];
    const o = new THREE.Object3D();
    for (const s of [1, -1])
      for (let x = -X1; x < X1; x += 0.06 + alea() * 0.14) {
        o.position.set(x, y0 + 0.02 + alea() * 0.03, s * (z0 + 0.1) + (alea() - 0.5) * 0.06);
        const t = 0.5 + alea() * 0.7;
        o.scale.set(t, t * 0.8, t);
        o.updateMatrix();
        mats.push(o.matrix.clone());
      }
    const mousse = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.06, 0), std({ color: 0xffffff, roughness: 1, flatShading: true }), mats.length);
    const teintes = ["#3f5a22", "#4f6a28", "#5d742c", "#384f1f"].map((c) => new THREE.Color(c));
    mats.forEach((m, i) => { mousse.setMatrixAt(i, m); mousse.setColorAt(i, teintes[i % 4]); });
    avantSeul.add(mousse);
  }
  // Fusion des pièces fixes qui partagent un matériau : beaucoup moins d'appels de dessin par
  // image (fluidité sur téléphone). La charpente et l'état « avant » restent à part.
  {
    maison.updateMatrixWorld(true);
    const groupes = new Map();
    for (const parent of [maison, toitGroupe])
      for (const m of [...parent.children]) {
        if (!m.isMesh || m.isInstancedMesh || !m.geometry.index) continue;
        const cle = m.userData.paire || m.material;
        if (!groupes.has(cle)) groupes.set(cle, []);
        groupes.get(cle).push(m);
      }
    for (const [cle, liste] of groupes) {
      if (liste.length < 2) continue;
      const geos = liste.map((m) => {
        const g = m.geometry.clone().applyMatrix4(m.matrixWorld);
        for (const nom of Object.keys(g.attributes)) if (!["position", "normal", "uv"].includes(nom)) g.deleteAttribute(nom);
        return g;
      });
      const fusion = mergeGeometries(geos, false);
      if (!fusion) continue;
      const premier = liste[0];
      const m = new THREE.Mesh(fusion, premier.material);
      m.castShadow = liste.some((x) => x.castShadow);
      m.receiveShadow = true;
      if (premier.userData.paire) { m.userData.paire = cle; aPaire.push(m); }
      for (const x of liste) {
        x.parent.remove(x);
        const i = aPaire.indexOf(x);
        if (i >= 0) aPaire.splice(i, 1);
      }
      (premier.material === M.toit.apres ? toitGroupe : maison).add(m);
    }
  }

  const poser = (etat) => {
    for (const m of aPaire) m.material = m.userData.paire[etat];
    avantSeul.visible = etat === "avant";
  };

  /* ------------------------------------------------------------------ */
  /* Jardin (allégé sur téléphone)                                        */
  /* ------------------------------------------------------------------ */
  const herbe = toileTex(512, 512, (g, l, h) => {
    g.fillStyle = "#8aa062";
    g.fillRect(0, 0, l, h);
    for (let i = 0; i < 30; i++) {
      const x = alea() * l, y = alea() * h, r = 40 + alea() * 80;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, alea() < 0.5 ? "rgba(150,170,90,0.25)" : "rgba(70,95,45,0.25)");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    for (let i = 0; i < 22000; i++) {
      const x = alea() * l, y = alea() * h;
      g.strokeStyle = `hsla(${68 + alea() * 26}, ${18 + alea() * 20}%, ${32 + alea() * 24}%, 0.7)`;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + (alea() - 0.5) * 2, y - 3 - alea() * 4);
      g.stroke();
    }
  });
  herbe.repeat.set(9, 9);
  const fondu = toileTex(256, 256, (g, l, h) => {
    const gr = g.createRadialGradient(l / 2, h / 2, 0, l / 2, h / 2, l / 2);
    gr.addColorStop(0, "#fff");
    gr.addColorStop(0.58, "#fff");
    gr.addColorStop(1, "#000");
    g.fillStyle = gr;
    g.fillRect(0, 0, l, h);
  }, { couleur: false, repete: false });
  const pelouse = new THREE.Mesh(new THREE.CircleGeometry(13, 64), new THREE.MeshStandardMaterial({ map: herbe, alphaMap: fondu, transparent: true, roughness: 1, envMapIntensity: 0.5 }));
  pelouse.rotation.x = -Math.PI / 2;
  pelouse.position.y = -0.01;
  pelouse.receiveShadow = true;
  scene.add(pelouse);
  // allée de dalles jusqu'à la porte
  {
    const mats = [];
    const o = new THREE.Object3D();
    for (let z = Z1 + 0.85; z < Z1 + 6.5; z += 0.62) {
      o.position.set((alea() - 0.5) * 0.08, 0.015, z);
      o.rotation.y = (alea() - 0.5) * 0.1;
      o.updateMatrix();
      mats.push(o.matrix.clone());
    }
    const dalles = new THREE.InstancedMesh(new THREE.BoxGeometry(0.95, 0.03, 0.5), new THREE.MeshStandardMaterial({ color: 0xcfcbc2, roughness: 0.9 }), mats.length);
    mats.forEach((m, i) => dalles.setMatrixAt(i, m));
    dalles.receiveShadow = true;
    scene.add(dalles);
  }
  // végétation : petites feuilles instanciées (une seule géométrie pour tout le jardin)
  const densite = telephone ? 0.55 : 1;
  const feuilles = [];
  const o3 = new THREE.Object3D();
  const touffe = (cx, cy, cz, rx, ry, rz, n, taille, teinte) => {
    const base = new THREE.Color(teinte);
    n = Math.round(n * densite);
    taille /= Math.sqrt(densite);
    for (let i = 0; i < n; i++) {
      const a = alea() * Math.PI * 2, b = Math.acos(2 * alea() - 1), r = Math.cbrt(alea());
      o3.position.set(cx + Math.sin(b) * Math.cos(a) * rx * r, cy + Math.cos(b) * ry * r, cz + Math.sin(b) * Math.sin(a) * rz * r);
      const t = taille * (0.7 + alea() * 0.6);
      o3.scale.set(t * (0.8 + alea() * 0.4), t * (0.7 + alea() * 0.4), t * (0.8 + alea() * 0.4));
      o3.rotation.set(alea() * 3, alea() * 3, 0);
      o3.updateMatrix();
      feuilles.push([o3.matrix.clone(), base.clone().multiplyScalar(0.72 + 0.4 * ((o3.position.y - (cy - ry)) / (2 * ry)) + 0.12 * r)]);
    }
  };
  const bois2 = new THREE.MeshStandardMaterial({ color: 0x6b5644, roughness: 0.95 });
  const tronc = (x, z, h, r) => {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.7, r, h, 7), bois2);
    t.position.set(x, h / 2, z);
    t.castShadow = true;
    scene.add(t);
  };
  for (const [x, z, h] of [[-6.6, -4.6, 6.0], [-5.6, -5.6, 5.0], [6.4, -5.0, 6.4]]) {
    tronc(x, z, 0.6, 0.14);
    touffe(x, h / 2 + 0.35, z, 0.65, h / 2, 0.65, 620, 0.12, "#33502a");
  }
  for (const [x, z] of [[-6.8, 4.6], [7.0, 3.4]]) {
    tronc(x, z, 1.8, 0.2);
    touffe(x, 2.6, z, 1.8, 1.0, 1.7, 820, 0.14, "#7f8d62");
  }
  for (let x = -7.2; x <= 7.2; x += 0.8) touffe(x, 0.6, -7.0 + Math.abs(x) * 0.06, 0.55, 0.6, 0.5, 50, 0.13, "#41612f");
  for (const [x, z, r] of [[-2.2, Z1 + 1.0, 0.5], [2.2, Z1 + 1.0, 0.5], [-1.2, Z1 + 0.9, 0.36], [1.2, Z1 + 0.9, 0.36], [-X1 - 1.3, -2.2, 0.6], [X1 + 1.3, 2.0, 0.6]])
    touffe(x, r * 0.85, z, r, r * 0.85, r, 140, 0.11, "#4d6c3a");
  {
    const vegetation = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true, envMapIntensity: 0.6 }), feuilles.length);
    feuilles.forEach(([m, c], i) => { vegetation.setMatrixAt(i, m); vegetation.setColorAt(i, c); });
    vegetation.castShadow = true;
    vegetation.receiveShadow = true;
    scene.add(vegetation);
  }

  /* ------------------------------------------------------------------ */
  /* Étiquettes : nom de la vue, repère orange                           */
  /* ------------------------------------------------------------------ */
  const elt = (classe, html = "") => {
    const e = document.createElement("span");
    e.className = classe;
    e.setAttribute("aria-hidden", "true");
    e.innerHTML = html;
    cadre.appendChild(e);
    return e;
  };
  const nomVue = elt("vue-3d");
  const repere = elt("repere-3d", '<span class="repere-3d__anneau"></span><span class="repere-3d__point"></span><span class="repere-3d__nom"></span>');
  const repereNom = repere.querySelector(".repere-3d__nom");

  /* ------------------------------------------------------------------ */
  /* Caméra : orbite d'une vue à l'autre                                  */
  /* ------------------------------------------------------------------ */
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  let L = 1, H = 1;
  const large = () => L >= 860;
  const tel = { k: 1.4, ox: 0, oy: 0.14, panneau: 0 };
  const recul = () => (large() ? 1.4 : Math.min(2.2, Math.max(1.25, 1.05 / (L / H)))); // téléphone en hauteur : plus de recul
  const decalageAccroche = () => (large() ? [0.21, 0.03] : [tel.ox, tel.oy]);
  const decalageVisite = () => (large() ? [0.17, 0] : [0, -tel.panneau / (2 * H)]);
  // une « étape » = point de vue complet (cible, angles, distance, décalage dans l'image)
  const etape = (v, k, dec) => ({ cx: v.cible.x, cy: v.cible.y, cz: v.cible.z, az: v.az, el: v.el, d: v.d * k, ox: dec[0], oy: dec[1] });
  const etapes = () => {
    const k = recul();
    return [
      etape(PERSPECTIVE, large() ? 1 : tel.k, decalageAccroche()),
      ...ZONES.map((z) => etape(z, k, decalageVisite())),
      etape(PERSPECTIVE, large() ? 1 : 1.35, [0, 0]),
    ];
  };
  // Parcours (0 → 1, donné par site.js) : accroche, 5 interventions, retour en perspective.
  // Dans chaque portion, la caméra va de l'étape précédente à la suivante pendant les 45 premiers
  // pourcents du défilement de la portion, puis reste en place : elle suit le doigt, sans saut.
  const DEBUT = 0.07, FIN = 0.93;
  const lisse = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  function butDe(p) {
    const E = etapes();
    let i, t;
    if (p < DEBUT) { i = 0; t = 1; }
    else if (p < FIN) {
      const n = ZONES.length, u = ((p - DEBUT) / (FIN - DEBUT)) * n;
      i = Math.min(n, Math.floor(u) + 1);
      t = lisse((u - (i - 1)) / 0.45);
    } else { i = E.length - 1; t = lisse((p - FIN) / ((1 - FIN) * 0.6)); }
    const a = E[Math.max(0, i - 1)], b = E[i];
    if (i === 0) return { ...b, t: 1, i };
    let daz = b.az - a.az;
    while (daz > Math.PI) daz -= 2 * Math.PI;
    while (daz < -Math.PI) daz += 2 * Math.PI;
    const m = (k) => a[k] + (b[k] - a[k]) * t;
    // pendant le passage, la caméra prend un peu de recul (elle « tourne autour » de la maison)
    const ecarte = Math.sin(Math.PI * t) * Math.min(1, Math.abs(daz) / 1.5) * 0.35;
    return { cx: m("cx"), cy: m("cy"), cz: m("cz"), az: a.az + daz * t, el: m("el"), d: m("d") * (1 + ecarte), ox: m("ox"), oy: m("oy"), t, i };
  }
  const etat = { p: 0, zone: -1, phase: "accroche", cx: 0, cy: 0, cz: 0, az: 0, el: 0, d: 0, ox: 0, oy: 0, transp: 0, init: false };
  const poserCamera = (c) => {
    camera.position.set(
      c.cx + Math.sin(c.az) * Math.cos(c.el) * c.d,
      c.cy + Math.sin(c.el) * c.d,
      c.cz + Math.cos(c.az) * Math.cos(c.el) * c.d
    );
    camera.lookAt(c.cx, c.cy, c.cz);
  };

  // Téléphone : à l'arrivée, la maison est mise à l'échelle de l'espace libre sous le titre.
  const coins = [];
  for (const x of [-X1 - 0.4, X1 + 0.4]) for (const y of [0, CHEM.haut]) for (const z of [-Z1 - 0.5, Z1 + 0.5]) coins.push(V3(x, y, z));
  function cadrerTelephone() {
    if (large()) return;
    const panneau = visite && visite.querySelector(".immersion__visite");
    tel.panneau = panneau ? panneau.offsetHeight : H * 0.4;
    const texte = document.querySelector(".immersion__accroche .accroche__texte");
    const rc = cadre.getBoundingClientRect();
    const haut = texte ? texte.getBoundingClientRect().bottom - rc.top + 14 : H * 0.45;
    const hautSection = visite.getBoundingClientRect().top + window.scrollY;
    const bas = Math.min(H, window.innerHeight - hautSection) - 64;
    if (bas - haut < 80) return;
    const q = V3(0, 0, 0);
    let x0, x1, y0b, y1b;
    tel.k = 1.4;
    for (let i = 0; i < 4; i++) {
      const v = PERSPECTIVE;
      poserCamera({ cx: v.cible.x, cy: v.cible.y, cz: v.cible.z, az: v.az, el: v.el, d: v.d * tel.k });
      camera.clearViewOffset();
      camera.updateMatrixWorld();
      x0 = y0b = Infinity; x1 = y1b = -Infinity;
      for (const c of coins) {
        q.copy(c).project(camera);
        const x = (q.x * 0.5 + 0.5) * L, y = (-q.y * 0.5 + 0.5) * H;
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0b = Math.min(y0b, y); y1b = Math.max(y1b, y);
      }
      tel.k *= Math.max((y1b - y0b) / (bas - haut), (x1 - x0) / (L * 0.94));
    }
    tel.ox = (L / 2 - (x0 + x1) / 2) / L;
    tel.oy = ((haut + bas) / 2 - (y0b + y1b) / 2) / H;
  }
  function redimensionner() {
    L = Math.max(1, cadre.clientWidth);
    H = Math.max(1, cadre.clientHeight);
    renderer.setSize(L, H, false);
    camera.aspect = L / H;
    camera.fov = large() ? 32 : 40;
    camera.updateProjectionMatrix();
    cadrerTelephone();
    relancer();
  }

  document.addEventListener("arv:avance", (e) => {
    etat.phase = visite ? visite.getAttribute("data-phase") || "accroche" : "accroche";
    etat.p = e.detail.p;
    if (e.detail.zone !== etat.zone) {
      etat.zone = e.detail.zone;
      const r = reperes[etat.zone];
      repereNom.textContent = r ? r.getAttribute("data-nom") : "";
      repere.classList.remove("est-visible");
    }
    relancer();
  });
  if (curseur) curseur.addEventListener("input", relancer);

  // couverture transparente pour la charpente
  let transpAppliquee = -1;
  function appliquerTransparence(t) {
    if (Math.abs(t - transpAppliquee) < 0.005) return;
    transpAppliquee = t;
    const transparent = t > 0.01;
    for (const m of new Set([M.toit.apres, M.toit.avant])) {
      if (m.transparent !== transparent) { m.transparent = transparent; m.depthWrite = !transparent; m.needsUpdate = true; }
      m.opacity = 1 - 0.86 * t;
    }
    charpente.visible = t > 0.01;
  }

  /* --- Rendu à la demande, qualité adaptative --- */
  let enCours = false, derniere = 0, ombres = 1;
  function relancer() {
    if (!enCours) { enCours = true; derniere = 0; requestAnimationFrame(boucle); }
  }
  // Si l'animation descend durablement sous ~45 images par seconde, la finesse du rendu baisse d'un
  // cran (jusqu'à 1 pixel par pixel d'écran) : la fluidité passe avant la netteté. Le changement
  // est appliqué dès que l'image s'arrête (jamais pendant un mouvement : pas d'à-coup).
  const qualite = { ratio: renderer.getPixelRatio(), cible: renderer.getPixelRatio(), cumul: 0, n: 0, change: 0 };
  function surveiller(intervalle, t) {
    if (intervalle <= 0 || intervalle > 120 || qualite.cible <= 1) return;
    qualite.cumul += intervalle;
    if (++qualite.n < 24) return;
    const moyenne = qualite.cumul / qualite.n;
    qualite.cumul = qualite.n = 0;
    if (moyenne > 22 && t - qualite.change > 1200) {
      qualite.cible = Math.max(1, qualite.cible - 0.25);
      qualite.change = t;
    }
  }
  const pt = V3(0, 0, 0);
  const placer = (e, p) => {
    pt.copy(p).project(camera);
    e.style.transform = `translate(${((pt.x * 0.5 + 0.5) * L).toFixed(1)}px, ${((-pt.y * 0.5 + 0.5) * H).toFixed(1)}px)`;
  };
  let nomAffiche = "";
  const CLES = ["cx", "cy", "cz", "el", "d", "ox", "oy"];
  function boucle(t) {
    const brut = derniere ? t - derniere : 0;
    const dt = derniere ? Math.min(0.05, brut / 1000) : 0.016;
    derniere = t;
    const b = butDe(etat.p);
    if (!etat.init) { Object.assign(etat, b); etat.init = true; }
    // la caméra suit le défilement de près (lissage court : pas de retard, pas d'à-coup de molette)
    const a = reduit ? 1 : 1 - Math.exp(-dt * 9);
    let daz = b.az - etat.az;
    while (daz > Math.PI) daz -= 2 * Math.PI;
    while (daz < -Math.PI) daz += 2 * Math.PI;
    etat.az += daz * a;
    for (const k of CLES) etat[k] += (b[k] - etat[k]) * a;
    // couverture transparente pendant la vue de la charpente
    const transpBut = b.i === 2 ? b.t : b.i === 3 ? 1 - b.t : 0;
    etat.transp += (transpBut - etat.transp) * a;
    appliquerTransparence(etat.transp < 0.005 ? 0 : etat.transp);

    poserCamera(etat);
    camera.setViewOffset(L, H, -etat.ox * L, -etat.oy * H, L, H);
    camera.updateMatrixWorld();

    if (ombres > 0) { renderer.shadowMap.needsUpdate = true; ombres--; }
    renderer.setViewport(0, 0, L, H);
    renderer.setScissorTest(false);
    renderer.clear();
    const enVisite = etat.phase === "visite";
    const coupeAA = enVisite ? Math.round((L * Number(curseur ? curseur.value : 50)) / 100) : 0;
    renderer.setScissorTest(true);
    if (coupeAA > 0) { poser("avant"); renderer.setScissor(0, 0, coupeAA, H); renderer.render(scene, camera); }
    if (coupeAA < L) { poser("apres"); renderer.setScissor(coupeAA, 0, L - coupeAA, H); renderer.render(scene, camera); }
    renderer.setScissorTest(false);

    // étiquettes : nom de la vue et repère, une fois la caméra arrivée
    const z = enVisite ? ZONES[etat.zone] : null;
    const arrive = b.t >= 1;
    const nom = z ? z.nom : etat.phase === "fin" ? PERSPECTIVE.nom : "";
    if (nom !== nomAffiche) { nomVue.textContent = nom; nomVue.classList.toggle("est-visible", !!nom); nomAffiche = nom; }
    let ecart = Math.abs(daz) + Math.abs(transpBut - etat.transp);
    for (const k of CLES) ecart += Math.abs(b[k] - etat[k]) / (k === "d" ? 10 : k[0] === "c" ? 5 : 1);
    if (z) {
      placer(repere, z.point);
      repere.classList.toggle("est-visible", arrive && ecart < 0.02);
    } else repere.classList.remove("est-visible");

    if (ecart > 0.0004 || ombres > 0) {
      surveiller(brut, t);
      requestAnimationFrame(boucle);
    } else {
      enCours = false;
      qualite.cumul = qualite.n = 0;
      if (qualite.cible !== qualite.ratio) {
        qualite.ratio = qualite.cible;
        renderer.setPixelRatio(qualite.ratio);
        renderer.setSize(L, H, false);
        requestAnimationFrame(() => relancer());
      }
      if (z && arrive) repere.classList.add("est-visible");
    }
  }

  if ("ResizeObserver" in window) new ResizeObserver(redimensionner).observe(cadre);
  window.addEventListener("resize", redimensionner);
  redimensionner();
  // shaders compilés avant la première image (état « avant » compris) : pas d'à-coup au défilement
  // toutes les combinaisons : avant / après, couverture opaque / transparente
  charpente.visible = true;
  for (const etatMat of ["avant", "apres"])
    for (const t of [0, 1]) {
      poser(etatMat);
      transpAppliquee = -1;
      appliquerTransparence(t);
      charpente.visible = true;
      await renderer.compileAsync(scene, camera).catch(() => {});
    }
  // Premier dessin de chaque combinaison sur 1 pixel, en plusieurs fois : le navigateur termine
  // la préparation des programmes maintenant, pas au moment où la barre avant / après apparaît.
  {
    const v = PERSPECTIVE;
    poserCamera({ cx: v.cible.x, cy: v.cible.y, cz: v.cible.z, az: v.az, el: v.el, d: v.d * 1.6 });
    camera.updateMatrixWorld();
    for (const etatMat of ["apres", "avant"])
      for (const t of [0, 1]) {
        poser(etatMat);
        transpAppliquee = -1;
        appliquerTransparence(t);
        charpente.visible = true;
        renderer.shadowMap.needsUpdate = true;
        renderer.setViewport(0, 0, L, H);
        renderer.setScissorTest(true);
        renderer.setScissor(0, 0, 1, 1);
        renderer.render(scene, camera);
        renderer.setScissorTest(false);
        await new Promise((r) => setTimeout(r, 0));
      }
    renderer.setScissorTest(true);
    renderer.setScissor(0, 0, L, H);
    renderer.clear();
    renderer.setScissorTest(false);
  }
  // textures envoyées à la carte graphique dès maintenant (sinon envoi au premier affichage de
  // l'état « avant » : image figée au début de la visite)
  for (const t of [...Object.values(T), herbe, fondu]) renderer.initTexture(t);
  appliquerTransparence(0);
  poser("apres");
  fig.classList.add("est-3d");
  document.dispatchEvent(new CustomEvent("arv:pret"));
  relancer();
}
