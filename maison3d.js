/*
 * Couvreur Proximité 34 — la maison de l'accueil en 3D.
 * Maison de plain-pied reconstituée d'après la photo, seule sur fond clair : garage à gauche,
 * entrée en retrait, corps principal avec deux portes-fenêtres, trois toitures à quatre pans en
 * tuiles romanes grises (relief des tuiles, tuiles d'égout et faîtières posées une à une),
 * gouttières demi-rondes, descentes, enduit, soubassement.
 * La caméra tourne autour de la maison selon l'intervention choisie (défilement), la zone est
 * signalée en orange et par une étiquette. La barre avant / après coupe l'image en deux :
 * à gauche la maison avant travaux (mousses, tuiles cassées, coulures), à droite après.
 * Three.js 0.169 par import map ; chargé seulement quand la section approche de l'écran.
 */
import * as THREE from "three";

const fig = document.querySelector("[data-avant-apres]");
const cadre = fig && fig.querySelector(".avant-apres__cadre");
const curseur = fig && fig.querySelector(".avant-apres__curseur");
const reperes = [...document.querySelectorAll(".visite__reperes button")];
const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = window.matchMedia("(max-width: 859px)").matches;

if (cadre) demarrer();

function demarrer() {
  /* ------------------------------------------------------------------ */
  /* Rendu, lumière                                                       */
  /* ------------------------------------------------------------------ */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false; // scène immobile : ombres calculées une fois
  renderer.autoClear = false;
  const toileGL = renderer.domElement;
  toileGL.className = "avant-apres__3d";
  toileGL.setAttribute("aria-hidden", "true");
  cadre.insertBefore(toileGL, cadre.firstChild);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1.5, 0.3, 300);

  // éclairage d'ambiance : un ciel bleu dégradé, converti en carte d'environnement (reflets, ombres douces)
  {
    const ciel = new THREE.Scene();
    ciel.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(50, 32, 16),
        new THREE.ShaderMaterial({
          side: THREE.BackSide,
          vertexShader: "varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
          fragmentShader:
            "varying vec3 p; void main(){ vec3 haut = vec3(0.36,0.58,0.92); vec3 horizon = vec3(0.92,0.95,0.98); vec3 sol = vec3(0.55,0.55,0.52); vec3 c = p.y > 0.0 ? mix(horizon, haut, smoothstep(0.0, 0.6, p.y)) : mix(horizon, sol, smoothstep(0.0, 0.25, -p.y)); gl_FragColor = vec4(c, 1.0); }",
        })
      )
    );
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(ciel, 0.02).texture;
    scene.environmentIntensity = 0.85;
    pmrem.dispose();
  }
  const soleil = new THREE.DirectionalLight("#fff3e2", 2.4);
  soleil.position.set(-10, 19, 24);
  soleil.target.position.set(2, 0, -4);
  soleil.castShadow = true;
  soleil.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  Object.assign(soleil.shadow.camera, { left: -14, right: 14, top: 12, bottom: -12, near: 1, far: 70 });
  soleil.shadow.bias = -0.0003;
  soleil.shadow.normalBias = 0.025;
  scene.add(soleil, soleil.target);

  /* ------------------------------------------------------------------ */
  /* Textures dessinées                                                   */
  /* ------------------------------------------------------------------ */
  let graine = 34;
  const alea = () => ((graine = (graine * 16807) % 2147483647) / 2147483647);
  const anisotropie = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  function toile(l, h, dessin, { couleur = true, repete = true } = {}) {
    const c = document.createElement("canvas");
    c.width = l;
    c.height = h;
    dessin(c.getContext("2d"), l, h);
    const t = new THREE.CanvasTexture(c);
    if (couleur) t.colorSpace = THREE.SRGBColorSpace;
    if (repete) t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = anisotropie;
    return t;
  }
  function partout(l, h, x, y, r, f) {
    for (const dx of [-l, 0, l]) for (const dy of [-h, 0, h]) if (x + dx > -r && x + dx < l + r && y + dy > -r && y + dy < h + r) f(x + dx, y + dy);
  }
  const rond = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); };

  // Tuiles romanes : 7 colonnes × 6 rangs pour 2,1 m ; le haut de l'image est vers le faîtage.
  const COLS = 7, RANGS = 6;
  const nuances = Array.from({ length: COLS * RANGS }, () => 0.86 + alea() * 0.24);
  function tuiles(g, L, H) {
    const cl = L / COLS, rh = H / RANGS;
    for (let r = 0; r < RANGS; r++)
      for (let c = 0; c < COLS; c++) {
        const x = c * cl, y = r * rh, k = nuances[r * COLS + c];
        const ton = (v) => Math.round(v * k);
        // canal (partie creuse, 55 % de la largeur)
        let gr = g.createLinearGradient(x, 0, x + cl * 0.55, 0);
        gr.addColorStop(0, `rgb(${ton(66)},${ton(68)},${ton(72)})`);
        gr.addColorStop(0.5, `rgb(${ton(48)},${ton(50)},${ton(54)})`);
        gr.addColorStop(1, `rgb(${ton(60)},${ton(62)},${ton(66)})`);
        g.fillStyle = gr;
        g.fillRect(x, y, cl * 0.55, rh);
        // ombre du rouleau sur le canal
        g.fillStyle = "rgba(0,0,0,0.35)";
        g.fillRect(x + cl * 0.47, y, cl * 0.08, rh);
        // rouleau (partie bombée), arrondi au nez
        const bx = x + cl * 0.53, bl = cl * 0.47;
        gr = g.createLinearGradient(bx, 0, bx + bl, 0);
        gr.addColorStop(0, `rgb(${ton(40)},${ton(42)},${ton(46)})`);
        gr.addColorStop(0.3, `rgb(${ton(104)},${ton(107)},${ton(112)})`);
        gr.addColorStop(0.45, `rgb(${ton(118)},${ton(121)},${ton(126)})`);
        gr.addColorStop(0.75, `rgb(${ton(74)},${ton(77)},${ton(82)})`);
        gr.addColorStop(1, `rgb(${ton(38)},${ton(40)},${ton(44)})`);
        g.fillStyle = gr;
        g.beginPath();
        if (g.roundRect) g.roundRect(bx, y - 2, bl, rh, [0, 0, bl / 2, bl / 2]);
        else g.rect(bx, y - 2, bl, rh);
        g.fill();
        // le haut de la tuile passe sous le rang supérieur
        gr = g.createLinearGradient(0, y, 0, y + rh * 0.3);
        gr.addColorStop(0, "rgba(0,0,0,0.5)");
        gr.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = gr;
        g.fillRect(x, y, cl, rh * 0.3);
      }
    for (let i = 0; i < 5000; i++) {
      g.fillStyle = alea() < 0.5 ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)";
      g.fillRect(alea() * L, alea() * H, 1.5, 1.5);
    }
  }
  // relief des tuiles (carte de hauteur) : rond des tuiles et ressaut entre les rangs
  function relief(g, L, H) {
    const cl = L / COLS, rh = H / RANGS;
    g.fillStyle = "#000";
    g.fillRect(0, 0, L, H);
    for (let r = 0; r < RANGS; r++) {
      const y = r * rh;
      for (let c = 0; c < COLS; c++) {
        const x = c * cl;
        // canal creux puis rouleau bombé
        const gh = g.createLinearGradient(x, 0, x + cl, 0);
        gh.addColorStop(0, "#5a5a5a");
        gh.addColorStop(0.27, "#3a3a3a");
        gh.addColorStop(0.52, "#505050");
        gh.addColorStop(0.62, "#9a9a9a");
        gh.addColorStop(0.77, "#e0e0e0");
        gh.addColorStop(0.92, "#9a9a9a");
        gh.addColorStop(1, "#555555");
        g.fillStyle = gh;
        g.fillRect(x, y, cl, rh);
      }
      // ressaut : chaque rang descend vers le haut (sous le rang supérieur)
      const gv = g.createLinearGradient(0, y, 0, y + rh);
      gv.addColorStop(0, "rgba(0,0,0,0.75)");
      gv.addColorStop(0.25, "rgba(0,0,0,0.25)");
      gv.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gv;
      g.fillRect(0, y, L, rh);
    }
  }
  function tuilesAvant(g, L, H) {
    tuiles(g, L, H);
    g.globalCompositeOperation = "multiply";
    g.fillStyle = "rgb(196,184,158)";
    g.fillRect(0, 0, L, H);
    g.globalCompositeOperation = "source-over";
    g.fillStyle = "rgba(120,112,96,0.18)";
    g.fillRect(0, 0, L, H);
    for (let i = 0; i < 22; i++) {
      const x = alea() * L, y = alea() * H, r = 18 + alea() * 45;
      partout(L, H, x, y, r, (px, py) => {
        const gr = g.createRadialGradient(px, py, 0, px, py, r);
        gr.addColorStop(0, "rgba(14,14,8,0.35)");
        gr.addColorStop(1, "rgba(14,14,8,0)");
        g.fillStyle = gr;
        g.fillRect(px - r, py - r, r * 2, r * 2);
      });
    }
    // mousse dans les creux, au bas des rangs
    const cl = L / COLS, rh = H / RANGS;
    for (let i = 0; i < 520; i++) {
      const c = Math.floor(alea() * COLS), r = Math.floor(alea() * RANGS);
      if (alea() < 0.45) continue;
      const x = c * cl + cl * (0.12 + alea() * 0.32), y = r * rh + rh * (0.55 + alea() * 0.4), rr = 2 + alea() * 4.5;
      g.fillStyle = `hsl(${76 + alea() * 18}, ${38 + alea() * 18}%, ${22 + alea() * 18}%)`;
      partout(L, H, x, y, rr, (px, py) => rond(g, px, py, rr));
    }
    for (let i = 0; i < 300; i++) {
      g.fillStyle = alea() < 0.6 ? "rgba(212,190,118,0.9)" : "rgba(206,208,186,0.85)";
      const r = 0.9 + alea() * 1.7;
      partout(L, H, alea() * L, alea() * H, r, (x, y) => rond(g, x, y, r));
    }
  }
  // enduit : 1 répétition = 4 m de large sur toute la hauteur du mur ; ombrage sous l'avant-toit et en pied
  function enduit(g, L, H, base = [236, 236, 231]) {
    g.fillStyle = `rgb(${base})`;
    g.fillRect(0, 0, L, H);
    for (let i = 0; i < 9000; i++) {
      g.fillStyle = alea() < 0.5 ? "rgba(0,0,0,0.035)" : "rgba(255,255,255,0.06)";
      g.fillRect(alea() * L, alea() * H, 1.5, 1.5);
    }
    let gr = g.createLinearGradient(0, 0, 0, H * 0.16);
    gr.addColorStop(0, "rgba(40,44,48,0.38)");
    gr.addColorStop(1, "rgba(40,44,48,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, L, H * 0.16);
    gr = g.createLinearGradient(0, H, 0, H * 0.9);
    gr.addColorStop(0, "rgba(40,44,48,0.18)");
    gr.addColorStop(1, "rgba(40,44,48,0)");
    g.fillStyle = gr;
    g.fillRect(0, H * 0.9, L, H * 0.1);
  }
  function enduitAvant(g, L, H) {
    enduit(g, L, H, [222, 222, 214]);
    const voile = g.createLinearGradient(0, 0, 0, H * 0.4);
    voile.addColorStop(0, "rgba(62,70,52,0.4)");
    voile.addColorStop(1, "rgba(62,70,52,0)");
    g.fillStyle = voile;
    g.fillRect(0, 0, L, H * 0.4);
    let x = alea() * 12;
    while (x < L) {
      const l = 2 + alea() * 8, long = 50 + alea() * (H * 0.7), f = 0.25 + alea() * 0.45;
      partout(L, H, x, 0, l, (px) => {
        const gr = g.createLinearGradient(0, 0, 0, long);
        gr.addColorStop(0, `rgba(46,54,38,${f})`);
        gr.addColorStop(1, "rgba(46,54,38,0)");
        g.fillStyle = gr;
        g.fillRect(px - l / 2, 0, l, long);
      });
      x += 6 + alea() * 26;
    }
    g.strokeStyle = "rgba(78,78,72,0.85)";
    g.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      let px = 60 + alea() * (L - 120), py = 50 + alea() * (H * 0.35);
      g.beginPath();
      g.moveTo(px, py);
      for (let k = 0; k < 9; k++) g.lineTo((px += (alea() - 0.5) * 12), (py += 6 + alea() * 10));
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
  function porteGarage(g, L, H) {
    g.fillStyle = "#2b2e33";
    g.fillRect(0, 0, L, H);
    const c = 4, r = 4, ml = L / c, mh = H / r;
    for (let i = 0; i < c; i++)
      for (let j = 0; j < r; j++) {
        const gr = g.createLinearGradient(0, j * mh, 0, (j + 1) * mh);
        gr.addColorStop(0, "#3a3f46");
        gr.addColorStop(1, "#30343a");
        g.fillStyle = gr;
        g.fillRect(i * ml + 9, j * mh + 8, ml - 18, mh - 16);
        g.strokeStyle = "#1b1d20";
        g.lineWidth = 3;
        g.strokeRect(i * ml + 9, j * mh + 8, ml - 18, mh - 16);
      }
    for (let j = 1; j < r; j++) { g.fillStyle = "#17191c"; g.fillRect(0, j * mh - 1, L, 2); }
  }
  function porteGarageRelief(g, L, H) {
    g.fillStyle = "#808080";
    g.fillRect(0, 0, L, H);
    const c = 4, r = 4, ml = L / c, mh = H / r;
    for (let i = 0; i < c; i++) for (let j = 0; j < r; j++) { g.fillStyle = "#b0b0b0"; g.fillRect(i * ml + 12, j * mh + 11, ml - 24, mh - 22); }
    for (let j = 1; j < r; j++) { g.fillStyle = "#303030"; g.fillRect(0, j * mh - 2, L, 4); }
  }
  function trou(g, L, H) {
    g.clearRect(0, 0, L, H);
    const pts = [];
    for (let k = 0; k < 11; k++) {
      const a = (k / 11) * Math.PI * 2, r = 0.72 + alea() * 0.28;
      pts.push([L / 2 + Math.cos(a) * L * 0.46 * r, H / 2 + Math.sin(a) * H * 0.44 * r]);
    }
    const trace = (dx, couleur) => { g.fillStyle = couleur; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x + dx, y + dx) : g.moveTo(x + dx, y + dx))); g.fill(); };
    trace(2, "#4b4038");
    trace(0, "#110e0c");
    g.fillStyle = "#8a6440";
    g.fillRect(L * 0.12, H * 0.36, L * 0.76, 4);
    g.fillRect(L * 0.12, H * 0.66, L * 0.76, 4);
  }
  function ombreSol(g, L, H) {
    const gr = g.createRadialGradient(L / 2, H / 2, 0, L / 2, H / 2, L / 2);
    gr.addColorStop(0, "rgb(255,255,255)");
    gr.addColorStop(0.55, "rgb(110,110,110)");
    gr.addColorStop(1, "rgb(0,0,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, L, H);
  }

  const T = {
    tuiles: toile(512, 512, tuiles),
    tuilesAvant: toile(512, 512, tuilesAvant),
    relief: toile(512, 512, relief, { couleur: false }),
    enduit: toile(512, 512, enduit),
    enduitAvant: toile(1024, 512, enduitAvant),
    sombre: toile(256, 256, (g, L, H) => enduit(g, L, H, [70, 74, 81])),
    grain: toile(256, 256, grain, { couleur: false }),
    garage: toile(256, 220, porteGarage, { repete: false }),
    garageRelief: toile(256, 220, porteGarageRelief, { couleur: false, repete: false }),
    trou: toile(128, 72, trou, { repete: false }),
    ombreSol: toile(256, 256, ombreSol, { couleur: false, repete: false }),
  };

  /* ------------------------------------------------------------------ */
  /* Matériaux (chaque surface « avant / après » a sa paire)            */
  /* ------------------------------------------------------------------ */
  const ORANGE = new THREE.Color("#f0915a");
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const paire = (apres, avant) => ({ apres, avant: avant || apres });
  const tuile = () =>
    paire(
      std({ map: T.tuiles, bumpMap: T.relief, bumpScale: 9, roughness: 0.8, metalness: 0, envMapIntensity: 0.35 }),
      std({ map: T.tuilesAvant, bumpMap: T.relief, bumpScale: 9, roughness: 0.9, envMapIntensity: 0.5 })
    );
  const M = {
    toitR: tuile(),
    toitG: tuile(),
    toitC: tuile(),
    mur: paire(std({ map: T.enduit, bumpMap: T.grain, bumpScale: 0.6, roughness: 0.95 }), std({ map: T.enduitAvant, bumpMap: T.grain, bumpScale: 0.6, roughness: 0.97 })),
    murSombre: paire(std({ map: T.sombre, bumpMap: T.grain, bumpScale: 0.6, roughness: 0.9 })),
    zinc: paire(std({ color: "#3a3e44", roughness: 0.38, metalness: 0.65, side: THREE.DoubleSide })),
    bois: paire(std({ color: "#b98149", roughness: 0.75 })),
  };
  const noir = std({ color: "#1c1e21", roughness: 0.45, metalness: 0.3 });
  const verre = std({ color: "#6f8796", roughness: 0.06, metalness: 0.55, envMapIntensity: 1.6 });
  const verreDepoli = std({ color: "#b9c4cb", roughness: 0.35, metalness: 0.2 });
  const pierre = std({ color: "#d9d6cf", roughness: 0.9, map: T.grain });
  const soubassement = std({ color: "#8d9094", roughness: 0.95, bumpMap: T.grain, bumpScale: 1 });
  const sousFace = std({ color: "#e6e6e1", roughness: 0.9, side: THREE.DoubleSide });
  const garageMat = std({ map: T.garage, bumpMap: T.garageRelief, bumpScale: 4, roughness: 0.5, metalness: 0.25 });

  const aPaire = []; // maillages dont le matériau change entre la moitié « avant » et la moitié « après »
  const avantSeul = new THREE.Group(); // éléments présents seulement dans la moitié « avant »
  scene.add(avantSeul);
  function maillage(geo, p, parent = scene) {
    const m = new THREE.Mesh(geo, p.apres || p);
    m.castShadow = true;
    m.receiveShadow = true;
    if (p.apres) { m.userData.paire = p; aPaire.push(m); }
    parent.add(m);
    return m;
  }
  function instances(geo, p, matrices) {
    const m = new THREE.InstancedMesh(geo, p.apres || p, matrices.length);
    matrices.forEach((mx, i) => m.setMatrixAt(i, mx));
    m.castShadow = true;
    m.receiveShadow = true;
    if (p.apres) { m.userData.paire = p; aPaire.push(m); }
    scene.add(m);
    return m;
  }
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const HAUT = V3(0, 1, 0);

  /* ------------------------------------------------------------------ */
  /* La maison                                                            */
  /* ------------------------------------------------------------------ */
  const HM = 2.8;      // hauteur des murs
  const PENTE = 0.45;  // pente des toits (≈ 24°)
  const DEBORD = 0.4;  // débord des toits

  // mur de (xa, za) à (xb, zb), vu de l'extérieur de gauche à droite ; trous = ouvertures
  // [x0, y0, x1, y1] en mètres depuis le début du mur
  function mur(xa, za, xb, zb, p, trous = []) {
    const long = Math.hypot(xb - xa, zb - za), h = HM;
    const forme = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(long, 0), new THREE.Vector2(long, h), new THREE.Vector2(0, h)]);
    for (const [u0, v0, u1, v1] of trous) forme.holes.push(new THREE.Path([new THREE.Vector2(u0, v0), new THREE.Vector2(u0, v1), new THREE.Vector2(u1, v1), new THREE.Vector2(u1, v0)]));
    const g = new THREE.ShapeGeometry(forme);
    const pos = g.attributes.position, uv = g.attributes.uv;
    const echelle = p === M.mur ? 4 : 2;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / echelle, pos.getY(i) / h);
    const m = maillage(g, p);
    m.position.set(xa, 0, za);
    m.rotation.y = -Math.atan2(zb - za, xb - xa);
    // soubassement gris en pied de mur, interrompu aux ouvertures qui descendent jusqu'en bas
    if (p === M.mur) {
      const coupes = trous.filter((t) => t[1] < 0.2).map((t) => [t[0], t[2]]).sort((x, y) => x[0] - y[0]);
      let debut = 0;
      for (const [c0, c1] of [...coupes, [long, long]]) {
        if (c0 - debut > 0.02) {
          const sb = new THREE.Mesh(new THREE.BoxGeometry(c0 - debut, 0.2, 0.03), soubassement);
          sb.position.set((debut + c0) / 2, 0.1, 0.012);
          sb.receiveShadow = true;
          m.add(sb);
        }
        debut = c1;
      }
    }
    return m;
  }

  // toit à quatre pans sur [x0, x1] × [z0, z1] : pans en tuiles, sous-face, rives, gouttières,
  // tuiles d'égout et faîtières posées une à une
  function toit(x0, x1, z0, z1, p) {
    const w = { x0, x1, z0, z1 };
    x0 -= DEBORD; x1 += DEBORD; z0 -= DEBORD; z1 += DEBORD;
    const ye = HM - 0.02;
    const L = x1 - x0, P = z1 - z0;
    const pos = [], uvs = [];
    const n = V3(0, 0, 0), a = V3(0, 0, 0), b = V3(0, 0, 0), monte = V3(0, 0, 0), le = V3(0, 0, 0);
    const face = (pts) => {
      a.subVectors(pts[1], pts[0]);
      b.subVectors(pts[2], pts[0]);
      n.crossVectors(a, b).normalize();
      if (n.y < 0) { pts = [pts[0], pts[2], pts[1]]; n.negate(); }
      monte.copy(HAUT).addScaledVector(n, -n.y).normalize();
      le.crossVectors(monte, n);
      for (const q of pts) {
        pos.push(q.x, q.y, q.z);
        uvs.push(q.dot(le) / 2.1, (q.y - ye) / monte.y / 2.1);
      }
    };
    let r0, r1;
    const c00 = V3(x0, ye, z0), c10 = V3(x1, ye, z0), c01 = V3(x0, ye, z1), c11 = V3(x1, ye, z1);
    if (L >= P) {
      const h = (PENTE * P) / 2, zm = (z0 + z1) / 2;
      r0 = V3(x0 + P / 2, ye + h, zm); r1 = V3(x1 - P / 2, ye + h, zm);
      face([c01, c11, r1]); face([c01, r1, r0]);
      face([c10, c00, r0]); face([c10, r0, r1]);
      face([c00, c01, r0]); face([c11, c10, r1]);
    } else {
      const h = (PENTE * L) / 2, xm = (x0 + x1) / 2;
      r0 = V3(xm, ye + h, z0 + L / 2); r1 = V3(xm, ye + h, z1 - L / 2);
      face([c00, c01, r1]); face([c00, r1, r0]);
      face([c11, c10, r0]); face([c11, r0, r1]);
      face([c01, c11, r1]); face([c10, c00, r0]);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    g.computeVertexNormals();
    maillage(g, p);

    // sous-face du débord (entre le mur et le bord du toit)
    const sf = [];
    const anneau = [[c00, c10, V3(w.x1, ye, w.z0), V3(w.x0, ye, w.z0)], [c10, c11, V3(w.x1, ye, w.z1), V3(w.x1, ye, w.z0)], [c11, c01, V3(w.x0, ye, w.z1), V3(w.x1, ye, w.z1)], [c01, c00, V3(w.x0, ye, w.z0), V3(w.x0, ye, w.z1)]];
    for (const [q0, q1, q2, q3] of anneau) for (const q of [q0, q2, q1, q0, q3, q2]) sf.push(q.x, q.y - 0.01, q.z);
    const gsf = new THREE.BufferGeometry();
    gsf.setAttribute("position", new THREE.Float32BufferAttribute(sf, 3));
    gsf.computeVertexNormals();
    const msf = new THREE.Mesh(gsf, sousFace);
    msf.receiveShadow = true;
    scene.add(msf);

    // planches de rive, gouttières demi-rondes, tuiles d'égout
    const mats = [];
    const bord = (qa, qb) => {
      const long = qa.distanceTo(qb);
      const ang = -Math.atan2(qb.z - qa.z, qb.x - qa.x);
      const nx = Math.sin(ang), nz = Math.cos(ang);
      const planche = maillage(new THREE.BoxGeometry(long, 0.22, 0.04), M.zinc);
      planche.position.set((qa.x + qb.x) / 2, ye - 0.1, (qa.z + qb.z) / 2);
      planche.rotation.y = ang;
      const gouttiere = maillage(new THREE.CylinderGeometry(0.075, 0.075, long + 0.04, 14, 1, true, Math.PI, Math.PI), M.zinc);
      gouttiere.rotation.set(0, ang, Math.PI / 2);
      gouttiere.position.set((qa.x + qb.x) / 2 + nx * 0.1, ye - 0.07, (qa.z + qb.z) / 2 + nz * 0.1);
      const o = new THREE.Object3D();
      for (let s = 0.12; s < long - 0.05; s += 0.3) {
        o.position.set(qa.x + ((qb.x - qa.x) * s) / long, ye + 0.03, qa.z + ((qb.z - qa.z) * s) / long);
        o.rotation.set(0, ang, 0);
        o.rotateX(Math.PI / 2 + Math.atan(PENTE));
        o.translateY(0.06);
        o.updateMatrix();
        mats.push(o.matrix.clone());
      }
    };
    bord(c01, c11); bord(c10, c00); bord(c00, c01); bord(c11, c10);
    instances(new THREE.CylinderGeometry(0.075, 0.085, 0.16, 10, 1, false, Math.PI / 2, Math.PI), p, mats);

    // faîtières le long du faîtage et des arêtiers
    const fai = [];
    const arretes = [[r0, r1], [c00, r0], [c01, L >= P ? r0 : r1], [c10, L >= P ? r1 : r0], [c11, r1]];
    const o = new THREE.Object3D();
    for (const [u, v] of arretes) {
      const d = v.distanceTo(u);
      if (d < 0.05) continue;
      const dir = v.clone().sub(u).normalize();
      for (let s = 0.2; s < d; s += 0.38) {
        o.position.copy(u).addScaledVector(dir, s);
        o.quaternion.setFromUnitVectors(HAUT, dir);
        o.updateMatrix();
        fai.push(o.matrix.clone());
      }
    }
    instances(new THREE.CylinderGeometry(0.1, 0.115, 0.42, 14), p, fai);
    return { x0, x1, z0, z1, ye, r0, r1 };
  }

  // garage (G), entrée en retrait, bloc central (C), corps principal (R)
  const G = { x0: -7.2, x1: -2.2, z0: -6, z1: 0 };
  const R = { x0: 0, x1: 11, z0: -9, z1: 0 };
  const C = { x0: -3.2, x1: 1, z0: -10, z1: -1.4 };
  mur(G.x0, G.z1, G.x1, G.z1, M.mur, [[-4.7 - 1.3 - G.x0, 0, -4.7 + 1.3 - G.x0, 2.2]]);
  mur(G.x0, G.z0, G.x0, G.z1, M.mur);
  mur(G.x1, G.z0, G.x0, G.z0, M.mur);
  mur(R.x0, R.z1, R.x1, R.z1, M.mur, [[3.2 - 0.46, 0.12, 3.2 + 0.46, 2.42], [7.7 - 0.46, 0.12, 7.7 + 0.46, 2.42]]);
  mur(R.x1, R.z1, R.x1, R.z0, M.mur);
  mur(R.x1, R.z0, R.x0, R.z0, M.mur);
  mur(C.x1, C.z0, C.x0, C.z0, M.mur);
  mur(C.x0, C.z0, C.x0, G.z0, M.mur);
  mur(C.x1, R.z0, C.x1, C.z0, M.mur);
  // entrée en retrait : murs anthracite, sol, plafond
  mur(G.x1, C.z1, R.x0, C.z1, M.murSombre);
  mur(G.x1, 0, G.x1, C.z1, M.murSombre);
  mur(R.x0, C.z1, R.x0, 0, M.murSombre);
  const plafond = new THREE.Mesh(new THREE.PlaneGeometry(R.x0 - G.x1, -C.z1), sousFace);
  plafond.rotation.x = Math.PI / 2;
  plafond.position.set((G.x1 + R.x0) / 2, HM - 0.03, C.z1 / 2);
  scene.add(plafond);
  const seuil = new THREE.Mesh(new THREE.BoxGeometry(R.x0 - G.x1, 0.06, -C.z1 + 0.3), pierre);
  seuil.position.set((G.x1 + R.x0) / 2, 0.03, C.z1 / 2 + 0.15);
  seuil.receiveShadow = true;
  scene.add(seuil);
  const linteau = maillage(new THREE.BoxGeometry(R.x0 - G.x1, 0.26, 0.05), M.zinc);
  linteau.position.set((G.x1 + R.x0) / 2, HM - 0.1, 0.02);

  const toitG = toit(G.x0, G.x1, G.z0, G.z1, M.toitG);
  toit(C.x0, C.x1, C.z0, C.z1, M.toitC);
  const toitR = toit(R.x0, R.x1, R.z0, R.z1, M.toitR);
  const yPanR = (z) => toitR.ye + PENTE * (toitR.z1 - z);
  const yPanGav = (z) => toitG.ye + PENTE * (toitG.z1 - z);

  // ouvertures dans l'épaisseur du mur (embrasures), menuiseries noires
  const piece = (l, h, p, mat, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(l, h, p), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  };
  function baie(x, y0, l, h, profondeur, fond) {
    const yc = y0 + h / 2;
    piece(0.04, h, profondeur, M.mur.apres, x - l / 2 - 0.02, yc, -profondeur / 2);
    piece(0.04, h, profondeur, M.mur.apres, x + l / 2 + 0.02, yc, -profondeur / 2);
    piece(l + 0.08, 0.04, profondeur, M.mur.apres, x, y0 + h + 0.02, -profondeur / 2);
    fond(x, yc, -profondeur);
  }
  function fenetre(x, y0, l, h) {
    baie(x, y0, l, h, 0.18, (cx, cy, cz) => {
      const e = 0.06;
      piece(l, e, 0.07, noir, cx, cy - h / 2 + e / 2, cz + 0.04);
      piece(l, e, 0.07, noir, cx, cy + h / 2 - e / 2, cz + 0.04);
      piece(e, h, 0.07, noir, cx - l / 2 + e / 2, cy, cz + 0.04);
      piece(e, h, 0.07, noir, cx + l / 2 - e / 2, cy, cz + 0.04);
      const v = new THREE.Mesh(new THREE.PlaneGeometry(l - 2 * e, h - 2 * e), verre);
      v.position.set(cx, cy, cz + 0.03);
      scene.add(v);
    });
    piece(l + 0.16, 0.05, 0.26, pierre, x, y0 - 0.02, 0.06); // appui
  }
  fenetre(3.2, 0.12, 0.92, 2.3);
  fenetre(7.7, 0.12, 0.92, 2.3);
  // porte de garage
  baie(-4.7, 0, 2.6, 2.2, 0.16, (cx, cy, cz) => {
    const pg = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.2), garageMat);
    pg.position.set(cx, cy, cz + 0.005);
    pg.receiveShadow = true;
    scene.add(pg);
  });
  piece(0.2, 0.14, 0.12, noir, -6.75, 2.35, 0.06); // projecteur
  // porte d'entrée avec hublot, vitrage latéral, poignée
  const zp = C.z1 + 0.02;
  piece(1.04, 2.2, 0.08, noir, -1.25, 1.1, zp + 0.02);
  const hublot = new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), verreDepoli);
  hublot.position.set(-1.25, 1.68, zp + 0.065);
  scene.add(hublot);
  const inox = std({ color: "#a7adb3", metalness: 0.9, roughness: 0.25 });
  const cerclage = new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.015, 8, 32), inox);
  cerclage.position.set(-1.25, 1.68, zp + 0.065);
  scene.add(cerclage);
  piece(0.03, 0.5, 0.04, inox, -0.86, 1.05, zp + 0.09);
  const lat = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 1.9), verreDepoli);
  lat.position.set(-0.5, 1.05, zp + 0.01);
  scene.add(lat);
  // descentes d'eau avec coude et dauphin
  for (const [x, z] of [[0.16, 0.2], [10.84, 0.2]]) {
    const d = maillage(new THREE.CylinderGeometry(0.045, 0.045, HM - 0.45, 12), M.zinc);
    d.position.set(x, (HM - 0.45) / 2 + 0.1, z - 0.06);
    const coude = maillage(new THREE.CylinderGeometry(0.045, 0.045, 0.32, 12), M.zinc);
    coude.position.set(x, HM - 0.25, z + 0.04);
    coude.rotation.x = 0.6;
    const pied = maillage(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 12), M.zinc);
    pied.position.set(x, 0.12, z - 0.02);
    pied.rotation.x = -0.5;
  }

  // ombre portée au sol (le sol lui-même est invisible) et ombre de contact sous la maison
  const solOmbre = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.28 }));
  solOmbre.rotation.x = -Math.PI / 2;
  solOmbre.receiveShadow = true;
  scene.add(solOmbre);
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(23, 16), new THREE.MeshBasicMaterial({ alphaMap: T.ombreSol, color: 0x000000, transparent: true, opacity: 0.38, depthWrite: false }));
  contact.rotation.x = -Math.PI / 2;
  contact.position.set(1.9, 0.005, -4.6);
  scene.add(contact);

  // charpente du corps principal (visible quand la couverture devient transparente)
  const charpente = new THREE.Group();
  charpente.visible = false;
  scene.add(charpente);
  const poutre = (u, v, ep = 0.07, h = 0.16) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(ep, u.distanceTo(v), h), M.bois.apres);
    m.position.copy(u).add(v).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(HAUT, v.clone().sub(u).normalize());
    charpente.add(m);
  };
  {
    const t = toitR, demi = (t.z1 - t.z0) / 2, zm = (t.z0 + t.z1) / 2, bas = 0.2;
    for (let x = t.x0 + 0.4; x <= t.x1 - 0.35; x += 0.6) {
      const s = Math.min(x - t.x0, t.x1 - x, demi);
      for (const sens of [1, -1]) {
        const ze = sens > 0 ? t.z1 : t.z0;
        poutre(V3(x, t.ye - bas, ze), V3(x, t.ye - bas + PENTE * s, ze - sens * s));
      }
    }
    poutre(V3(t.r0.x, t.r0.y - 0.26, zm), V3(t.r1.x, t.r1.y - 0.26, zm), 0.14, 0.22);
    for (const k of [0.33, 0.66])
      for (const sens of [1, -1]) {
        const s = demi * k, ze = sens > 0 ? t.z1 : t.z0, z = ze - sens * s;
        poutre(V3(t.x0 + s + 0.25, t.ye - 0.32 + PENTE * s, z), V3(t.x1 - s - 0.25, t.ye - 0.32 + PENTE * s, z), 0.12, 0.18);
      }
  }

  /* ------------------------------------------------------------------ */
  /* État « avant » : tuiles cassées, touffes de mousse, gouttières bouchées */
  /* ------------------------------------------------------------------ */
  const normaleAv = V3(0, 1, PENTE).normalize();
  const trouMat = new THREE.MeshStandardMaterial({ map: T.trou, transparent: true, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -4 });
  const TROUS = [[7.2, -1.1], [8.1, -1.7], [7.6, -2.35], [8.9, -1.0], [3.1, -2.0], [5.2, -3.0], [9.8, -0.8]];
  const poserSurPan = (m, x, z, y) => {
    m.position.set(x, y + 0.03, z);
    m.quaternion.setFromUnitVectors(V3(0, 0, 1), normaleAv);
    avantSeul.add(m);
  };
  for (const [x, z] of TROUS) poserSurPan(new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.3), trouMat), x, z, yPanR(z));
  for (const [x, z] of [[-5.1, -0.9], [-4.1, -1.8]]) poserSurPan(new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.28), trouMat), x, z, yPanGav(z));
  {
    // éclats de tuiles autour des trous
    const mats = [];
    const o = new THREE.Object3D();
    for (const [x, z] of TROUS)
      for (let k = 0; k < 3; k++) {
        const zz = z + 0.15 + alea() * 0.4, xx = x + (alea() - 0.5) * 0.6;
        o.position.set(xx, yPanR(zz) + 0.05, zz);
        o.rotation.set(alea() * 0.6, alea() * 3, alea() * 0.6);
        o.scale.set(0.8 + alea(), 1, 0.8 + alea());
        o.updateMatrix();
        mats.push(o.matrix.clone());
      }
    const eclats = new THREE.InstancedMesh(new THREE.BoxGeometry(0.11, 0.02, 0.07), std({ color: "#4a4e54", roughness: 0.8 }), mats.length);
    mats.forEach((m, i) => eclats.setMatrixAt(i, m));
    avantSeul.add(eclats);
  }
  {
    // touffes de mousse en relief : en plaques sur les pans, et dans les gouttières
    const mats = [];
    const o = new THREE.Object3D();
    const plaque = (cx, cz, yPan, n, r) => {
      for (let i = 0; i < n; i++) {
        const a = alea() * Math.PI * 2, d = Math.sqrt(alea()) * r;
        const x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d * 0.6;
        o.position.set(x, yPan(z) + 0.02, z);
        o.quaternion.setFromUnitVectors(HAUT, normaleAv);
        const s = 0.35 + alea() * 0.5;
        o.scale.set(s, s * (0.6 + alea() * 0.4), s);
        o.updateMatrix();
        mats.push(o.matrix.clone());
      }
    };
    plaque(2.2, -1.2, yPanR, 130, 0.9);
    plaque(6.2, -0.7, yPanR, 90, 0.7);
    plaque(9.3, -1.9, yPanR, 110, 0.8);
    plaque(4.6, -2.6, yPanR, 70, 0.6);
    plaque(-4.7, -1.2, yPanGav, 170, 1.0);
    o.quaternion.identity();
    for (const [xa, xb, z] of [[R.x0 - 0.3, R.x1 + 0.3, toitR.z1 + 0.1], [G.x0 - 0.3, G.x1 + 0.3, toitG.z1 + 0.1]])
      for (let x = xa; x < xb; x += 0.05 + alea() * 0.12) {
        o.position.set(x, HM - 0.03 + alea() * 0.03, z + (alea() - 0.5) * 0.05);
        const s = 0.45 + alea() * 0.6;
        o.scale.set(s, s * (0.7 + alea() * 0.5), s);
        o.updateMatrix();
        mats.push(o.matrix.clone());
      }
    const mousse = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.06, 1), std({ color: "#ffffff", roughness: 1 }), mats.length);
    const teintes = ["#3f5a22", "#4f6a28", "#5d742c", "#384f1f"].map((c) => new THREE.Color(c));
    mats.forEach((m, i) => { mousse.setMatrixAt(i, m); mousse.setColorAt(i, teintes[i % 4]); });
    avantSeul.add(mousse);
  }

  /* ------------------------------------------------------------------ */
  /* Points de vue et zones signalées                                     */
  /* ------------------------------------------------------------------ */
  const VUES = [
    { nom: "Maison entière", cible: V3(1.8, 1.5, -4.2), pos: V3(-6.4, 6.6, 18) },
    { nom: "Couverture", cible: V3(5.5, 3.4, -4), pos: V3(12.5, 13.5, 9.5), point: V3(5.5, yPanR(-2.6) + 0.06, -2.6) },
    { nom: "Charpente", cible: V3(5.5, 3.5, -4.5), pos: V3(16.5, 9, 4), point: V3(8.2, 3.75, -3.2) },
    { nom: "Zinguerie", cible: V3(0.1, 2.2, 0), pos: V3(-4.6, 3.3, 7.2), point: V3(0.16, HM - 0.07, toitR.z1 + 0.1) },
    { nom: "Tuiles cassées", cible: V3(7.6, 3.4, -1.6), pos: V3(4.6, 8.4, 6.6), point: V3(7.6, yPanR(-1.7) + 0.06, -1.7) },
    { nom: "Démoussage", cible: V3(-4.7, 2.9, -2.4), pos: V3(-11, 7.6, 6.5), point: V3(-4.7, yPanGav(-1.4) + 0.06, -1.4) },
  ];
  const anneau = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.045, 8, 64), new THREE.MeshBasicMaterial({ color: ORANGE }));
  anneau.position.copy(VUES[4].point).addScaledVector(normaleAv, 0.08);
  anneau.quaternion.setFromUnitVectors(V3(0, 0, 1), normaleAv);
  anneau.visible = false;
  scene.add(anneau);

  const etiquette = document.createElement("span");
  etiquette.className = "repere-3d";
  etiquette.setAttribute("aria-hidden", "true");
  etiquette.innerHTML = '<span class="repere-3d__point"></span><span class="repere-3d__nom"></span>';
  cadre.appendChild(etiquette);
  const etiquetteNom = etiquette.querySelector(".repere-3d__nom");

  const tousToits = [M.toitR, M.toitG, M.toitC];
  const lesDeux = (p) => new Set([p.apres, p.avant]);
  function signaler(z) {
    for (const p of [...tousToits, M.zinc, M.bois]) for (const m of lesDeux(p)) { m.emissive.set(0); m.emissiveIntensity = 1; }
    for (const m of lesDeux(M.toitR)) { m.transparent = false; m.opacity = 1; m.depthWrite = true; m.needsUpdate = true; }
    charpente.visible = false;
    anneau.visible = false;
    const allumer = (p, f) => { for (const m of lesDeux(p)) { m.emissive.copy(ORANGE); m.emissiveIntensity = f; } };
    if (z === 0) tousToits.forEach((p) => allumer(p, 0.12));
    if (z === 1) {
      for (const m of lesDeux(M.toitR)) { m.transparent = true; m.opacity = 0.14; m.depthWrite = false; m.needsUpdate = true; }
      charpente.visible = true;
      allumer(M.bois, 0.35);
    }
    if (z === 2) allumer(M.zinc, 0.55);
    if (z === 3) anneau.visible = true;
    if (z === 4) allumer(M.toitG, 0.14);
    etiquetteNom.textContent = VUES[z + 1].nom;
    etiquette.classList.toggle("est-visible", z >= 0);
  }

  /* ------------------------------------------------------------------ */
  /* Caméra : orbite douce d'un point de vue à l'autre                    */
  /* ------------------------------------------------------------------ */
  const etat = { cible: V3(0, 0, 0), sph: new THREE.Spherical(), zone: -2 };
  const but = { cible: V3(0, 0, 0), sph: new THREE.Spherical() };
  function viser(z, immediat) {
    const v = VUES[z + 1];
    but.cible.copy(v.cible);
    const rel = v.pos.clone().sub(v.cible);
    if (mobile) rel.multiplyScalar(z < 0 ? 0.92 : 1.08); // téléphone : cadre plus large que haut
    but.sph.setFromVector3(rel);
    if (immediat) { etat.cible.copy(but.cible); etat.sph.copy(but.sph); }
  }
  function zone(z) {
    if (z === etat.zone) return;
    const premier = etat.zone === -2;
    etat.zone = z;
    viser(z, premier || reduit);
    signaler(z);
    relancer();
  }

  /* ------------------------------------------------------------------ */
  /* Rendu : moitié gauche « avant », moitié droite « après »             */
  /* ------------------------------------------------------------------ */
  let largeur = 1, hauteur = 1;
  function redimensionner() {
    largeur = Math.max(1, cadre.clientWidth);
    hauteur = Math.max(1, cadre.clientHeight);
    renderer.setSize(largeur, hauteur, false);
    camera.aspect = largeur / hauteur;
    camera.updateProjectionMatrix();
    relancer();
  }
  function poser(etatMateriaux) {
    for (const m of aPaire) m.material = m.userData.paire[etatMateriaux];
    avantSeul.visible = etatMateriaux === "avant";
  }
  const p3 = V3(0, 0, 0);
  let derniere = 0, enCours = false, ombresFaites = false;
  function relancer() {
    if (!enCours) { enCours = true; derniere = 0; requestAnimationFrame(boucle); }
  }
  function boucle(t) {
    const dt = derniere ? Math.min(0.05, (t - derniere) / 1000) : 0.016;
    derniere = t;
    const a = reduit ? 1 : 1 - Math.exp(-dt * 2.6);
    etat.cible.lerp(but.cible, a);
    let dθ = but.sph.theta - etat.sph.theta;
    if (dθ > Math.PI) dθ -= Math.PI * 2;
    if (dθ < -Math.PI) dθ += Math.PI * 2;
    etat.sph.theta += dθ * a;
    etat.sph.phi += (but.sph.phi - etat.sph.phi) * a;
    etat.sph.radius += (but.sph.radius - etat.sph.radius) * a;
    camera.position.setFromSpherical(etat.sph).add(etat.cible);
    camera.lookAt(etat.cible);
    camera.updateMatrixWorld();

    if (!ombresFaites) { renderer.shadowMap.needsUpdate = true; ombresFaites = true; }
    const coupe = Math.round((largeur * (curseur ? Number(curseur.value) : 50)) / 100);
    renderer.setViewport(0, 0, largeur, hauteur);
    renderer.setScissorTest(false);
    renderer.clear();
    renderer.setScissorTest(true);
    if (coupe > 0) { poser("avant"); renderer.setScissor(0, 0, coupe, hauteur); renderer.render(scene, camera); }
    if (coupe < largeur) { poser("apres"); renderer.setScissor(coupe, 0, largeur - coupe, hauteur); renderer.render(scene, camera); }
    renderer.setScissorTest(false);

    const v = VUES[etat.zone + 1];
    if (v && v.point) {
      p3.copy(v.point).project(camera);
      etiquette.style.transform = `translate(${((p3.x * 0.5 + 0.5) * largeur).toFixed(1)}px, ${((-p3.y * 0.5 + 0.5) * hauteur).toFixed(1)}px)`;
    }
    const bouge = etat.cible.distanceToSquared(but.cible) > 1e-5 || Math.abs(dθ) > 1e-4 || Math.abs(but.sph.phi - etat.sph.phi) > 1e-4 || Math.abs(but.sph.radius - etat.sph.radius) > 1e-3;
    if (bouge) requestAnimationFrame(boucle);
    else enCours = false;
  }

  /* ------------------------------------------------------------------ */
  /* Branchements                                                         */
  /* ------------------------------------------------------------------ */
  const zoneActuelle = () => reperes.findIndex((b) => b.getAttribute("aria-current") === "true");
  document.addEventListener("arv:zone", (e) => zone(e.detail.zone));
  if (curseur) curseur.addEventListener("input", relancer);
  if ("ResizeObserver" in window) new ResizeObserver(redimensionner).observe(cadre);
  window.addEventListener("resize", redimensionner);
  redimensionner();
  zone(zoneActuelle());
  fig.classList.add("est-3d");
}
