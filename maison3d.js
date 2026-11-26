/*
 * Couvreur Proximité 34 — la maison de l'accueil en 3D.
 * Maison de plain-pied reconstituée d'après la photo : garage à gauche, entrée en retrait,
 * corps principal avec deux portes-fenêtres, trois toitures à quatre pans en tuiles romanes
 * grises, gouttières et descentes, allée gravillonnée et pelouse.
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
  /* Rendu                                                               */
  /* ------------------------------------------------------------------ */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false; // scène immobile : ombres calculées une seule fois
  const toileGL = renderer.domElement;
  toileGL.className = "avant-apres__3d";
  toileGL.setAttribute("aria-hidden", "true");
  cadre.insertBefore(toileGL, cadre.firstChild);

  const scene = new THREE.Scene();
  const HORIZON = new THREE.Color("#dfe8ef");
  scene.fog = new THREE.Fog(HORIZON, 45, 170);
  const camera = new THREE.PerspectiveCamera(34, 1.5, 0.3, 900);

  // ciel : dégradé bleu → horizon clair
  scene.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(500, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { haut: { value: new THREE.Color("#5f9ee0") }, bas: { value: HORIZON } },
        vertexShader: "varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: "uniform vec3 haut; uniform vec3 bas; varying vec3 p; void main(){ float t = smoothstep(-0.02, 0.45, p.y); gl_FragColor = vec4(mix(bas, haut, t), 1.0); }",
      })
    )
  );

  scene.add(new THREE.HemisphereLight("#dceaff", "#7d8466", 1.35));
  const soleil = new THREE.DirectionalLight("#fff1dc", 2.6);
  soleil.position.set(-9, 20, 26);
  soleil.target.position.set(2, 0, -4);
  soleil.castShadow = true;
  soleil.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  Object.assign(soleil.shadow.camera, { left: -17, right: 17, top: 15, bottom: -15, near: 1, far: 70 });
  soleil.shadow.bias = -0.0004;
  soleil.shadow.normalBias = 0.03;
  scene.add(soleil, soleil.target);

  /* ------------------------------------------------------------------ */
  /* Textures dessinées (tuiles, enduit, sols), état neuf et état « avant » */
  /* ------------------------------------------------------------------ */
  let graine = 34;
  const alea = () => ((graine = (graine * 16807) % 2147483647) / 2147483647);
  const anisotropie = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  function toile(l, h, dessin, repete = true) {
    const c = document.createElement("canvas");
    c.width = l;
    c.height = h;
    const g = c.getContext("2d");
    dessin(g, l, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    if (repete) t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = anisotropie;
    return t;
  }
  // dessine une forme aussi de l'autre côté des bords, pour une texture sans raccord visible
  function partout(l, h, x, y, r, f) {
    for (const dx of [-l, 0, l]) for (const dy of [-h, 0, h]) if (x + dx > -r && x + dx < l + r && y + dy > -r && y + dy < h + r) f(x + dx, y + dy);
  }
  const rond = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); };

  // tuiles romanes grises (1 répétition = 2,1 m) ; le haut de l'image est vers le faîtage
  function tuiles(g, L, H) {
    const cols = 7, rangs = 6, cl = L / cols, rh = H / rangs;
    g.fillStyle = "#23272c";
    g.fillRect(0, 0, L, H);
    for (let r = 0; r < rangs; r++)
      for (let c = 0; c < cols; c++) {
        const x = c * cl, y = r * rh;
        let gr = g.createLinearGradient(x, 0, x + cl, 0);
        gr.addColorStop(0, "#2b2f35"); gr.addColorStop(0.5, "#3c4148"); gr.addColorStop(1, "#2b2f35");
        g.fillStyle = gr;
        g.fillRect(x, y, cl, rh);
        const bx = x + cl * 0.5, bl = cl * 0.5;
        gr = g.createLinearGradient(bx, 0, bx + bl, 0);
        gr.addColorStop(0, "#1c2024"); gr.addColorStop(0.32, "#737a83"); gr.addColorStop(0.55, "#565c64"); gr.addColorStop(1, "#1e2227");
        g.fillStyle = gr;
        g.beginPath();
        if (g.roundRect) g.roundRect(bx, y + 1, bl, rh - 1, [bl / 2, bl / 2, 4, 4]);
        else g.rect(bx, y + 1, bl, rh - 1);
        g.fill();
      }
    for (let r = 1; r <= rangs; r++) {
      const y = (r * rh) % H;
      const gr = g.createLinearGradient(0, y, 0, y + 14);
      gr.addColorStop(0, "rgba(0,0,0,0.55)"); gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr;
      g.fillRect(0, y, L, 14);
      g.fillStyle = "rgba(150,158,168,0.35)";
      g.fillRect(0, y - 2, L, 2);
    }
    for (let i = 0; i < 2500; i++) {
      g.fillStyle = alea() < 0.5 ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.05)";
      g.fillRect(alea() * L, alea() * H, 2, 2);
    }
  }
  function tuilesAvant(g, L, H) {
    tuiles(g, L, H);
    g.globalCompositeOperation = "multiply";
    g.fillStyle = "rgb(190,176,148)";
    g.fillRect(0, 0, L, H);
    g.globalCompositeOperation = "source-over";
    for (let i = 0; i < 26; i++) {
      const x = alea() * L, y = alea() * H, r = 20 + alea() * 50;
      partout(L, H, x, y, r, (px, py) => {
        const gr = g.createRadialGradient(px, py, 0, px, py, r);
        gr.addColorStop(0, "rgba(12,12,6,0.38)"); gr.addColorStop(1, "rgba(12,12,6,0)");
        g.fillStyle = gr;
        g.fillRect(px - r, py - r, r * 2, r * 2);
      });
    }
    // mousses : quelques plaques, pas tout le toit
    for (let p = 0; p < 9; p++) {
      const cx = alea() * L, cy = alea() * H, R = 18 + alea() * 40;
      for (let i = 0; i < 80; i++) {
        const a = alea() * Math.PI * 2, d = Math.sqrt(alea()) * R, r = 2 + alea() * 5;
        g.fillStyle = `hsl(${78 + alea() * 18}, ${40 + alea() * 20}%, ${20 + alea() * 20}%)`;
        partout(L, H, cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.7, r, (x, y) => rond(g, x, y, r));
      }
    }
    for (let i = 0; i < 260; i++) {
      g.fillStyle = alea() < 0.6 ? "rgba(214,190,112,0.9)" : "rgba(206,210,186,0.85)";
      const r = 1 + alea() * 1.8;
      partout(L, H, alea() * L, alea() * H, r, (x, y) => rond(g, x, y, r));
    }
  }
  // enduit blanc (1 répétition = 2 m)
  function enduit(g, L, H) {
    g.fillStyle = "#eeeeea";
    g.fillRect(0, 0, L, H);
    for (let i = 0; i < 3000; i++) {
      g.fillStyle = alea() < 0.5 ? "rgba(0,0,0,0.035)" : "rgba(255,255,255,0.05)";
      g.fillRect(alea() * L, alea() * H, 2, 2);
    }
  }
  // façade avant travaux : coulures sous l'avant-toit, voile gris (1 répétition = 8 m de mur, toute la hauteur)
  function enduitAvant(g, L, H) {
    enduit(g, L, H);
    g.fillStyle = "rgba(120,124,108,0.18)";
    g.fillRect(0, 0, L, H);
    const voile = g.createLinearGradient(0, 0, 0, H * 0.35);
    voile.addColorStop(0, "rgba(70,76,60,0.35)"); voile.addColorStop(1, "rgba(70,76,60,0)");
    g.fillStyle = voile;
    g.fillRect(0, 0, L, H * 0.35);
    let x = alea() * 20;
    while (x < L) {
      const l = 3 + alea() * 12, long = 60 + alea() * (H * 0.7), f = 0.3 + alea() * 0.45;
      partout(L, H, x, 0, l, (px) => {
        const gr = g.createLinearGradient(0, 0, 0, long);
        gr.addColorStop(0, `rgba(48,56,40,${f})`); gr.addColorStop(1, "rgba(48,56,40,0)");
        g.fillStyle = gr;
        g.fillRect(px - l / 2, 0, l, long);
      });
      x += 8 + alea() * 34;
    }
    g.strokeStyle = "rgba(70,70,64,0.8)";
    g.lineWidth = 1.2;
    for (let i = 0; i < 4; i++) {
      let px = 80 + alea() * (L - 160), py = 60 + alea() * (H * 0.4);
      g.beginPath();
      g.moveTo(px, py);
      for (let k = 0; k < 8; k++) g.lineTo((px += (alea() - 0.5) * 16), (py += 8 + alea() * 12));
      g.stroke();
    }
  }
  function porteGarage(g, L, H) {
    g.fillStyle = "#2a2d31";
    g.fillRect(0, 0, L, H);
    const c = 4, r = 4, ml = L / c, mh = H / r;
    for (let i = 0; i < c; i++)
      for (let j = 0; j < r; j++) {
        g.fillStyle = "#363b41";
        g.fillRect(i * ml + 7, j * mh + 6, ml - 14, mh - 12);
        g.strokeStyle = "#1c1f22";
        g.lineWidth = 2;
        g.strokeRect(i * ml + 7, j * mh + 6, ml - 14, mh - 12);
      }
    g.fillStyle = "#1a1c1f";
    g.fillRect(L / 2 - 1, 0, 2, H);
  }
  function pelouse(g, L, H) {
    g.fillStyle = "#6c9a4c";
    g.fillRect(0, 0, L, H);
    for (let i = 0; i < 6000; i++) {
      g.fillStyle = `hsla(${86 + alea() * 18}, ${30 + alea() * 18}%, ${32 + alea() * 18}%, 0.55)`;
      g.fillRect(alea() * L, alea() * H, 1.5, 3);
    }
  }
  function gravier(g, L, H) {
    g.fillStyle = "#cdbf9f";
    g.fillRect(0, 0, L, H);
    for (let i = 0; i < 7000; i++) {
      g.fillStyle = ["#b6a886", "#e2d6ba", "#9d927a", "#d8cbab"][Math.floor(alea() * 4)];
      rond(g, alea() * L, alea() * H, 0.8 + alea() * 1.6);
    }
  }
  function trou(g, L, H) {
    g.clearRect(0, 0, L, H);
    const pts = [];
    for (let k = 0; k < 11; k++) {
      const a = (k / 11) * Math.PI * 2, r = 0.72 + alea() * 0.28;
      pts.push([L / 2 + (Math.cos(a) * L * 0.46) * r, H / 2 + (Math.sin(a) * H * 0.44) * r]);
    }
    g.fillStyle = "#4b4038";
    g.beginPath();
    pts.forEach(([x, y], i) => (i ? g.lineTo(x + 2, y + 2) : g.moveTo(x + 2, y + 2)));
    g.fill();
    g.fillStyle = "#120f0d";
    g.beginPath();
    pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.fill();
    g.fillStyle = "#8a6440";
    g.fillRect(L * 0.12, H * 0.36, L * 0.76, 4);
    g.fillRect(L * 0.12, H * 0.66, L * 0.76, 4);
  }

  const T = {
    tuiles: toile(512, 512, tuiles),
    tuilesAvant: toile(512, 512, tuilesAvant),
    enduit: toile(256, 256, enduit),
    enduitAvant: toile(1024, 512, enduitAvant),
    garage: toile(256, 200, porteGarage, false),
    pelouse: toile(256, 256, pelouse),
    gravier: toile(256, 256, gravier),
    trou: toile(128, 72, trou, false),
  };
  T.pelouse.repeat.set(90, 90);

  /* ------------------------------------------------------------------ */
  /* Matériaux (chaque surface « avant / après » a sa paire)            */
  /* ------------------------------------------------------------------ */
  const ORANGE = new THREE.Color("#f0915a");
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const paire = (apres, avant) => ({ apres, avant: avant || apres });
  const M = {
    toitR: paire(std({ map: T.tuiles, roughness: 0.62, metalness: 0.05 }), std({ map: T.tuilesAvant, roughness: 0.8 })),
    toitG: paire(std({ map: T.tuiles, roughness: 0.62, metalness: 0.05 }), std({ map: T.tuilesAvant, roughness: 0.8 })),
    toitC: paire(std({ map: T.tuiles, roughness: 0.62, metalness: 0.05 }), std({ map: T.tuilesAvant, roughness: 0.8 })),
    mur: paire(std({ map: T.enduit, roughness: 0.92 }), std({ map: T.enduitAvant, roughness: 0.95 })),
    murSombre: paire(std({ color: "#3e4249", roughness: 0.85 })),
    zinc: paire(std({ color: "#33373c", roughness: 0.45, metalness: 0.45 })),
    bois: paire(std({ color: "#b57d46", roughness: 0.8 })),
  };
  const noir = std({ color: "#1e2023", roughness: 0.55, metalness: 0.2 });
  const verre = std({ color: "#5b6c78", roughness: 0.12, metalness: 0.35 });
  const verreClair = std({ color: "#c7d4dc", roughness: 0.2, metalness: 0.1 });
  const blanc = std({ color: "#f3f3ef", roughness: 0.8 });
  const garageMat = std({ map: T.garage, roughness: 0.6, metalness: 0.2 });
  const vegetal = (c) => std({ color: c, roughness: 0.9, flatShading: true });

  const aPaire = []; // maillages dont le matériau change entre la moitié « avant » et la moitié « après »
  const avantSeul = new THREE.Group(); // éléments visibles seulement dans la moitié « avant »
  scene.add(avantSeul);
  function maillage(geo, p, ombre = true) {
    const m = new THREE.Mesh(geo, p.apres || p);
    m.castShadow = ombre;
    m.receiveShadow = true;
    if (p.apres) {
      m.userData.paire = p;
      aPaire.push(m);
    }
    scene.add(m);
    return m;
  }

  /* ------------------------------------------------------------------ */
  /* La maison                                                           */
  /* ------------------------------------------------------------------ */
  const HM = 2.8;      // hauteur des murs
  const PENTE = 0.45;  // pente des toits (≈ 24°)
  const DEBORD = 0.35; // débord des toits

  // mur plan : de (xa, za) à (xb, zb), vu de l'extérieur de gauche à droite ; texture à l'échelle
  function mur(xa, za, xb, zb, p, h = HM, y0 = 0, metres = p === M.mur ? 8 : 2) {
    const long = Math.hypot(xb - xa, zb - za);
    const g = new THREE.PlaneGeometry(long, h);
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setX(i, (uv.getX(i) * long) / metres);
    const m = maillage(g, p);
    m.position.set((xa + xb) / 2, y0 + h / 2, (za + zb) / 2);
    m.rotation.y = Math.atan2(zb - za, xb - xa) * -1;
    return m;
  }
  // toit à quatre pans sur le rectangle [x0, x1] × [z0, z1] (débord compris)
  const faitieres = [];
  function toit(x0, x1, z0, z1, p) {
    x0 -= DEBORD; x1 += DEBORD; z0 -= DEBORD; z1 += DEBORD;
    const ye = HM - 0.05;
    const L = x1 - x0, P = z1 - z0;
    const pos = [], uvs = [];
    const n = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), monte = new THREE.Vector3(), le = new THREE.Vector3();
    const face = (pts) => {
      a.subVectors(pts[1], pts[0]);
      b.subVectors(pts[2], pts[0]);
      n.crossVectors(a, b).normalize();
      if (n.y < 0) { pts = [pts[0], pts[2], pts[1]]; n.negate(); }
      monte.set(0, 1, 0).addScaledVector(n, -n.y).normalize();
      le.crossVectors(monte, n);
      for (const q of pts) {
        pos.push(q.x, q.y, q.z);
        uvs.push(q.dot(le) / 2.1, (q.y - ye) / monte.y / 2.1);
      }
    };
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    let r0, r1;
    if (L >= P) {
      const h = (PENTE * P) / 2, zm = (z0 + z1) / 2;
      r0 = V(x0 + P / 2, ye + h, zm); r1 = V(x1 - P / 2, ye + h, zm);
      face([V(x0, ye, z1), V(x1, ye, z1), r1]); face([V(x0, ye, z1), r1, r0]);
      face([V(x1, ye, z0), V(x0, ye, z0), r0]); face([V(x1, ye, z0), r0, r1]);
      face([V(x0, ye, z0), V(x0, ye, z1), r0]);
      face([V(x1, ye, z1), V(x1, ye, z0), r1]);
    } else {
      const h = (PENTE * L) / 2, xm = (x0 + x1) / 2;
      r0 = V(xm, ye + h, z0 + L / 2); r1 = V(xm, ye + h, z1 - L / 2);
      face([V(x0, ye, z0), V(x0, ye, z1), r1]); face([V(x0, ye, z0), r1, r0]);
      face([V(x1, ye, z1), V(x1, ye, z0), r0]); face([V(x1, ye, z1), r0, r1]);
      face([V(x0, ye, z1), V(x1, ye, z1), r1]);
      face([V(x1, ye, z0), V(x0, ye, z0), r0]);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    g.computeVertexNormals();
    maillage(g, p);
    // faîtage et arêtiers : tuiles faîtières
    const arretes = [[r0, r1], [V(x0, ye, z0), r0], [V(x0, ye, z1), L >= P ? r0 : r1], [V(x1, ye, z0), L >= P ? r1 : r0], [V(x1, ye, z1), r1]];
    for (const [u, v] of arretes) {
      const d = v.distanceTo(u);
      if (d < 0.05) continue;
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, d, 10), p.apres);
      c.position.copy(u).add(v).multiplyScalar(0.5);
      c.quaternion.setFromUnitVectors(V(0, 1, 0), v.clone().sub(u).normalize());
      c.castShadow = true;
      c.userData.paire = p;
      aPaire.push(c);
      scene.add(c);
      faitieres.push(c);
    }
    // planches de rive et gouttières
    const bord = (xa, za, xb, zb) => {
      const long = Math.hypot(xb - xa, zb - za);
      const ang = -Math.atan2(zb - za, xb - xa);
      const planche = maillage(new THREE.BoxGeometry(long, 0.24, 0.05), M.zinc);
      planche.position.set((xa + xb) / 2, ye - 0.1, (za + zb) / 2);
      planche.rotation.y = ang;
      const gout = maillage(new THREE.BoxGeometry(long, 0.12, 0.13), M.zinc);
      const nx = Math.sin(ang) * 0.09, nz = Math.cos(ang) * 0.09;
      gout.position.set((xa + xb) / 2 + nx, ye - 0.06, (za + zb) / 2 + nz);
      gout.rotation.y = ang;
    };
    bord(x0, z1, x1, z1); bord(x1, z0, x0, z0); bord(x0, z0, x0, z1); bord(x1, z1, x1, z0);
    return { x0, x1, z0, z1, ye, r0, r1 };
  }

  // garage (G), entrée en retrait, bloc central (C), corps principal (R)
  const G = { x0: -7.2, x1: -2.2, z0: -6, z1: 0 };
  const R = { x0: 0, x1: 11, z0: -9, z1: 0 };
  const C = { x0: -3.2, x1: 1, z0: -10, z1: -1.4 };
  // murs blancs
  mur(G.x0, G.z1, G.x1, G.z1, M.mur);           // façade garage
  mur(G.x0, G.z0, G.x0, G.z1, M.mur);           // pignon gauche
  mur(G.x1, G.z0, G.x0, G.z0, M.mur);           // arrière garage
  mur(R.x0, R.z1, R.x1, R.z1, M.mur);           // façade principale
  mur(R.x1, R.z1, R.x1, R.z0, M.mur);           // côté droit
  mur(R.x1, R.z0, R.x0, R.z0, M.mur);           // arrière
  mur(C.x1, C.z0, C.x0, C.z0, M.mur);           // arrière du bloc central
  mur(C.x0, C.z0, C.x0, G.z0, M.mur);
  mur(C.x1, R.z0, C.x1, C.z0, M.mur);
  // entrée en retrait, murs anthracite
  mur(G.x1, C.z1, R.x0, C.z1, M.murSombre);     // fond, avec la porte
  mur(G.x1, 0, G.x1, C.z1, M.murSombre);        // côté garage (tourné vers l'entrée)
  mur(R.x0, C.z1, R.x0, 0, M.murSombre);        // côté maison
  const plafond = maillage(new THREE.PlaneGeometry(R.x0 - G.x1, -C.z1), M.murSombre);
  plafond.rotation.x = Math.PI / 2;
  plafond.position.set((G.x1 + R.x0) / 2, HM - 0.02, C.z1 / 2);
  const rive = maillage(new THREE.BoxGeometry(R.x0 - G.x1, 0.3, 0.06), M.zinc);
  rive.position.set((G.x1 + R.x0) / 2, HM - 0.12, 0.02);

  const toitG = toit(G.x0, G.x1, G.z0, G.z1, M.toitG);
  const toitC = toit(C.x0, C.x1, C.z0, C.z1, M.toitC);
  const toitR = toit(R.x0, R.x1, R.z0, R.z1, M.toitR);
  const yPanR = (z) => toitR.ye + PENTE * (toitR.z1 - z); // hauteur du pan avant du toit principal
  const yPanGav = (z) => toitG.ye + PENTE * (toitG.z1 - z); // pan avant du garage

  // ouvertures
  const boite = (l, h, p, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(l, h, p), mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; scene.add(m); return m; };
  boite(2.7, 2.25, 0.08, noir, -4.7, 1.12, 0.02);
  const pg = new THREE.Mesh(new THREE.PlaneGeometry(2.55, 2.12), garageMat);
  pg.position.set(-4.7, 1.08, 0.065);
  scene.add(pg);
  boite(0.22, 0.16, 0.12, noir, -6.75, 2.3, 0.06); // projecteur
  for (const x of [3.2, 7.7]) {
    boite(0.98, 2.33, 0.08, noir, x, 1.31, 0.03);
    const v = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 2.17), verre);
    v.position.set(x, 1.31, 0.075);
    scene.add(v);
    boite(1.1, 0.06, 0.18, blanc, x, 0.12, 0.08); // appui
  }
  boite(1.04, 2.2, 0.08, noir, -1.25, 1.1, C.z1 + 0.04); // porte d'entrée
  const hublot = new THREE.Mesh(new THREE.CircleGeometry(0.14, 24), verreClair);
  hublot.position.set(-1.25, 1.68, C.z1 + 0.085);
  scene.add(hublot);
  const vitre = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 1.85), verreClair);
  vitre.position.set(-0.52, 1.05, C.z1 + 0.02);
  scene.add(vitre);
  // descentes d'eau
  for (const [x, z] of [[0.14, 0.16], [10.86, 0.16]]) {
    const d = maillage(new THREE.CylinderGeometry(0.05, 0.05, HM - 0.1, 10), M.zinc);
    d.position.set(x, (HM - 0.1) / 2, z);
  }

  // charpente du corps principal (visible quand la couverture devient transparente)
  const charpente = new THREE.Group();
  charpente.visible = false;
  scene.add(charpente);
  const piece = (u, v, ep = 0.08, h = 0.16) => {
    const d = v.distanceTo(u);
    const m = new THREE.Mesh(new THREE.BoxGeometry(ep, d, h), M.bois.apres);
    m.position.copy(u).add(v).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().sub(u).normalize());
    charpente.add(m);
  };
  {
    const t = toitR, demi = (t.z1 - t.z0) / 2, zm = (t.z0 + t.z1) / 2, bas = 0.16;
    for (let x = t.x0 + 0.35; x <= t.x1 - 0.3; x += 0.6) {
      const s = Math.min(x - t.x0, t.x1 - x, demi);
      for (const sens of [1, -1]) {
        const ze = sens > 0 ? t.z1 : t.z0;
        piece(new THREE.Vector3(x, t.ye - bas, ze), new THREE.Vector3(x, t.ye - bas + PENTE * s, ze - sens * s));
      }
    }
    piece(new THREE.Vector3(t.r0.x, t.r0.y - 0.22, zm), new THREE.Vector3(t.r1.x, t.r1.y - 0.22, zm), 0.14, 0.2);
    for (const k of [0.33, 0.66])
      for (const sens of [1, -1]) {
        const s = demi * k, ze = sens > 0 ? t.z1 : t.z0, z = ze - sens * s;
        piece(new THREE.Vector3(t.x0 + s + 0.2, t.ye - 0.28 + PENTE * s, z), new THREE.Vector3(t.x1 - s - 0.2, t.ye - 0.28 + PENTE * s, z), 0.12, 0.18);
      }
  }

  // tuiles cassées (moitié « avant ») : trous sur les pans avant
  const trouMat = new THREE.MeshStandardMaterial({ map: T.trou, transparent: true, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2 });
  const normaleAv = new THREE.Vector3(0, 1, PENTE).normalize();
  const TROUS = [[7.2, -1.1], [8.1, -1.7], [7.6, -2.3], [8.9, -1.0], [3.1, -2.0], [5.2, -3.0], [9.8, -0.8]];
  for (const [x, z] of TROUS) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.3), trouMat);
    m.position.set(x, yPanR(z) + 0.025, z);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normaleAv);
    m.rotateZ((alea() - 0.5) * 0.3);
    avantSeul.add(m);
  }
  for (const [x, z] of [[-5.1, -0.9], [-4.1, -1.8]]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.28), trouMat);
    m.position.set(x, yPanGav(z) + 0.025, z);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normaleAv);
    avantSeul.add(m);
  }
  // mousse et herbes dans les gouttières (moitié « avant »)
  {
    const geo = new THREE.IcosahedronGeometry(0.08, 0);
    const mat = vegetal("#4c6b26");
    const pts = [];
    for (let x = R.x0 - 0.2; x < R.x1 + 0.2; x += 0.18 + alea() * 0.3) pts.push([x, toitR.z1 + 0.09]);
    for (let x = G.x0 - 0.2; x < G.x1 + 0.2; x += 0.18 + alea() * 0.3) pts.push([x, toitG.z1 + 0.09]);
    const inst = new THREE.InstancedMesh(geo, mat, pts.length);
    const o = new THREE.Object3D();
    pts.forEach(([x, z], i) => {
      o.position.set(x, HM + 0.02 + alea() * 0.05, z);
      o.scale.set(0.8 + alea() * 1.4, 0.5 + alea() * 0.8, 0.8 + alea() * 0.8);
      o.updateMatrix();
      inst.setMatrixAt(i, o.matrix);
    });
    avantSeul.add(inst);
  }

  /* ------------------------------------------------------------------ */
  /* Abords : pelouse, gravier, plantes, arbres                          */
  /* ------------------------------------------------------------------ */
  const sol = new THREE.Mesh(new THREE.CircleGeometry(160, 48), std({ map: T.pelouse, roughness: 1 }));
  sol.rotation.x = -Math.PI / 2;
  sol.receiveShadow = true;
  scene.add(sol);
  const dalle = (x0, x1, z0, z1, mat, y = 0.012, rep = 0.5) => {
    const g = new THREE.PlaneGeometry(x1 - x0, z1 - z0);
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * (x1 - x0) * rep, uv.getY(i) * (z1 - z0) * rep);
    const m = new THREE.Mesh(g, mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2);
    m.receiveShadow = true;
    scene.add(m);
  };
  const gravierMat = std({ map: T.gravier, roughness: 1 });
  dalle(-8.2, -1.7, 0, 14, gravierMat);                                  // allée du garage
  dalle(-2.2, 0, -1.4, 0.4, std({ color: "#b9b8b2", roughness: 0.9 }), 0.02); // seuil de l'entrée
  dalle(0, 11.3, 0, 0.75, std({ map: T.gravier, color: "#8a8c8c", roughness: 1 }), 0.014, 1.2); // bande gravier
  dalle(-1.45, -0.95, -1.38, -0.9, std({ color: "#26282b", roughness: 1 }), 0.03); // paillasson

  // pots et cycas devant la façade
  for (const x of [4.6, 6.4]) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.17, 0.62, 4), noir);
    pot.position.set(x, 0.31, 0.42);
    pot.rotation.y = Math.PI / 4;
    pot.castShadow = true;
    scene.add(pot);
    for (let k = 0; k < 12; k++) {
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.6, 4), vegetal("#3f6f2a"));
      const a = (k / 12) * Math.PI * 2;
      f.position.set(x + Math.cos(a) * 0.17, 0.82, 0.42 + Math.sin(a) * 0.17);
      f.rotation.set(Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9);
      f.castShadow = true;
      scene.add(f);
    }
  }
  // arbres et haies autour
  const arbre = (x, z, s) => {
    const tronc = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * s, 0.25 * s, 3 * s, 7), vegetal("#5a4632"));
    tronc.position.set(x, 1.5 * s, z);
    scene.add(tronc);
    for (let k = 0; k < 4; k++) {
      const b = new THREE.Mesh(new THREE.IcosahedronGeometry((1.5 + alea() * 0.8) * s, 3), std({ color: ["#3d6a2f", "#4a7a38", "#355e29"][k % 3], roughness: 0.95 }));
      b.position.set(x + (alea() - 0.5) * 2.2 * s, (3.6 + alea() * 1.6) * s, z + (alea() - 0.5) * 2 * s);
      b.castShadow = true;
      scene.add(b);
    }
  };
  [[-14, -21, 1.1], [-6, -24, 1.3], [3, -26, 1.4], [11, -23, 1.25], [19, -18, 1.0], [-21, -12, 0.95], [26, -8, 0.9], [-26, -2, 0.8]].forEach((a) => arbre(...a));
  // haie basse à droite : une rangée de touffes
  for (let x = 13; x < 22; x += 0.9) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6 + alea() * 0.15, 2), std({ color: "#41693a", roughness: 0.95 }));
    b.position.set(x, 0.5, 2 + (x - 13) * 0.2);
    b.scale.y = 0.85;
    scene.add(b);
  }
  for (const [x, z, r] of [[-10.2, 1.5, 0.7], [-10.8, -0.6, 0.85], [-10, -3, 0.65]]) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 3), std({ color: "#46703a", roughness: 0.95 }));
    b.position.set(x, r * 0.7, z);
    b.castShadow = true;
    scene.add(b);
  }

  /* ------------------------------------------------------------------ */
  /* Points de vue et zones signalées                                    */
  /* ------------------------------------------------------------------ */
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const VUES = [
    { nom: "Maison entière", cible: V3(1.6, 1.7, -3.5), pos: V3(-3.5, 6.8, 27) },
    { nom: "Couverture", cible: V3(5.5, 3.6, -4), pos: V3(13, 15, 9), point: V3(5.5, yPanR(-2.6) + 0.05, -2.6) },
    { nom: "Charpente", cible: V3(5.5, 3.6, -4.5), pos: V3(17, 9.5, 3), point: V3(8.2, 3.7, -3.2) },
    { nom: "Zinguerie", cible: V3(0.1, 2.3, 0), pos: V3(-4.4, 3.6, 7.5), point: V3(0.14, HM - 0.06, toitR.z1 + 0.09) },
    { nom: "Tuiles cassées", cible: V3(7.6, 3.5, -1.6), pos: V3(5, 8.8, 6.4), point: V3(7.6, yPanR(-1.7) + 0.05, -1.7) },
    { nom: "Démoussage", cible: V3(-4.7, 3, -2.4), pos: V3(-11, 8, 6.5), point: V3(-4.7, yPanGav(-1.6) + 0.05, -1.6) },
  ];
  // anneau lumineux autour des tuiles cassées
  const anneau = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.05, 8, 48), new THREE.MeshBasicMaterial({ color: ORANGE, fog: false }));
  anneau.position.copy(VUES[4].point).addScaledVector(normaleAv, 0.08);
  anneau.quaternion.setFromUnitVectors(V3(0, 0, 1), normaleAv);
  anneau.visible = false;
  scene.add(anneau);

  // étiquette posée sur l'image
  const etiquette = document.createElement("span");
  etiquette.className = "repere-3d";
  etiquette.setAttribute("aria-hidden", "true");
  etiquette.innerHTML = '<span class="repere-3d__point"></span><span class="repere-3d__nom"></span>';
  cadre.appendChild(etiquette);
  const etiquetteNom = etiquette.querySelector(".repere-3d__nom");

  const tousToits = [M.toitR, M.toitG, M.toitC];
  function signaler(z) {
    // remise à zéro
    for (const p of [...tousToits, M.zinc, M.bois])
      for (const m of new Set([p.apres, p.avant])) { m.emissive.set(0); m.emissiveIntensity = 1; }
    for (const m of new Set([M.toitR.apres, M.toitR.avant])) { m.transparent = false; m.opacity = 1; m.depthWrite = true; m.needsUpdate = true; }
    charpente.visible = false;
    anneau.visible = false;
    const allumer = (p, f) => { for (const m of new Set([p.apres, p.avant])) { m.emissive.copy(ORANGE); m.emissiveIntensity = f; } };
    if (z === 0) tousToits.forEach((p) => allumer(p, 0.1));
    if (z === 1) {
      for (const m of new Set([M.toitR.apres, M.toitR.avant])) { m.transparent = true; m.opacity = 0.16; m.depthWrite = false; m.needsUpdate = true; }
      charpente.visible = true;
      allumer(M.bois, 0.45);
    }
    if (z === 2) allumer(M.zinc, 0.65);
    if (z === 3) anneau.visible = true;
    if (z === 4) allumer(M.toitG, 0.12);
    const v = VUES[z + 1];
    etiquetteNom.textContent = v.nom;
    etiquette.classList.toggle("est-visible", z >= 0);
  }

  /* ------------------------------------------------------------------ */
  /* Caméra : orbite douce d'un point de vue à l'autre                   */
  /* ------------------------------------------------------------------ */
  const etat = { cible: V3(0, 0, 0), sph: new THREE.Spherical(), zone: -2 };
  const but = { cible: V3(0, 0, 0), sph: new THREE.Spherical() };
  function viser(z, immediat) {
    const v = VUES[z + 1];
    but.cible.copy(v.cible);
    const rel = v.pos.clone().sub(v.cible);
    if (mobile) rel.multiplyScalar(1.12);
    but.sph.setFromVector3(rel);
    if (immediat) {
      etat.cible.copy(but.cible);
      etat.sph.copy(but.sph);
    }
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
  /* Rendu : moitié gauche « avant », moitié droite « après »            */
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
    if (!enCours) {
      enCours = true;
      derniere = 0;
      requestAnimationFrame(boucle);
    }
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
    renderer.setScissorTest(true);
    renderer.setViewport(0, 0, largeur, hauteur);
    if (coupe > 0) {
      poser("avant");
      renderer.setScissor(0, 0, coupe, hauteur);
      renderer.render(scene, camera);
    }
    if (coupe < largeur) {
      poser("apres");
      renderer.setScissor(coupe, 0, largeur - coupe, hauteur);
      renderer.render(scene, camera);
    }
    renderer.setScissorTest(false);

    // étiquette au-dessus de la zone signalée
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
  /* Branchements                                                        */
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
