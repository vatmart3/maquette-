/*
 * Couvreur Proximité 34 — la photo de la maison en relief.
 * La photo (2000 × 945) est reconstruite en 3D : chaque pixel est replacé à sa vraie distance.
 * Sol (pelouse, allée, marches) : plan horizontal vu à 1,60 m de hauteur ; maison, arbres et ciel :
 * à la distance du pied de la maison (≈ 12 m). Au premier écran, la caméra est exactement à la
 * place du photographe : l'image est la photo. En défilant, la caméra avance dans l'allée (marche,
 * léger balancement des pas), la pelouse passe sous elle et la maison grandit. Ensuite, la vue se
 * recadre sur chaque intervention. La barre avant / après mélange la photo d'origine et sa version
 * vieillie dans le même rendu.
 * Three.js 0.169 par import map ; chargé par site.js seulement avec une vraie puce graphique.
 */
import * as THREE from "three";

const fig = document.querySelector("[data-avant-apres]");
const cadre = fig && fig.querySelector(".avant-apres__cadre");
const curseur = fig && fig.querySelector(".avant-apres__curseur");
const visite = document.querySelector("[data-visite]");
const reperes = [...document.querySelectorAll(".visite__reperes button")];
const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --- Géométrie de la photo --- */
const LP = 2000, HP = 945;          // taille de la photo
const F = 1013;                     // focale en pixels (champ vertical ≈ 50°)
const CX = LP / 2, CY = HP / 2;     // centre optique
const OEIL = 1.6;                   // hauteur des yeux (m)
const PIED = 606;                   // ligne du pied de la maison sur la photo
const D_MAISON = (OEIL * F) / (PIED - CY); // ≈ 12 m
const MARCHE = 5.2;                 // distance parcourue à pied (m)

if (cadre) demarrer().catch(() => {});

async function demarrer() {
  const photo = cadre.querySelector(".immersion__photo");
  // la plus grande version dès que l'écran est assez grand : l'image reste nette quand on zoome
  const largeurSource = (window.devicePixelRatio || 1) * cadre.clientWidth > 900 ? "2000" : "1400";
  const charger = (url) =>
    new Promise((ok, ko) => {
      const i = new Image();
      i.decoding = "async";
      i.onload = () => ok(i);
      i.onerror = ko;
      i.src = url;
    });
  const [imgApres, imgAvant] = await Promise.all([
    charger(`/img/manoir-${largeurSource}.webp`),
    charger(`/img/manoir-avant-${largeurSource}.webp`),
  ]);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // couleurs de la photo transmises telles quelles
  const toileGL = renderer.domElement;
  toileGL.className = "avant-apres__3d";
  toileGL.setAttribute("aria-hidden", "true");
  cadre.insertBefore(toileGL, cadre.firstChild);

  const texture = (img) => {
    const t = new THREE.Texture(img);
    t.colorSpace = THREE.NoColorSpace;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    t.needsUpdate = true;
    return t;
  };

  /* --- La photo en relief : une grille dont chaque point est replacé à sa distance --- */
  const NX = 200, NY = 120;
  const pos = new Float32Array((NX + 1) * (NY + 1) * 3);
  const uv = new Float32Array((NX + 1) * (NY + 1) * 2);
  // lignes de la grille plus serrées près du pied de la maison et en bas (là où la profondeur change vite)
  const ligne = (j) => {
    const t = j / NY;
    return t < 0.6 ? (t / 0.6) * PIED : PIED + ((t - 0.6) / 0.4) ** 1.25 * (HP - PIED);
  };
  let k = 0;
  for (let j = 0; j <= NY; j++) {
    const py = ligne(j);
    const d = py <= PIED ? D_MAISON : (OEIL * F) / (py - CY); // distance devant la caméra
    for (let i = 0; i <= NX; i++) {
      const px = (i / NX) * LP;
      pos[k * 3] = ((px - CX) / F) * d;
      pos[k * 3 + 1] = OEIL - ((py - CY) / F) * d;
      pos[k * 3 + 2] = -d;
      uv[k * 2] = px / LP;
      uv[k * 2 + 1] = 1 - py / HP;
      k++;
    }
  }
  const index = [];
  for (let j = 0; j < NY; j++)
    for (let i = 0; i < NX; i++) {
      const a = j * (NX + 1) + i, b = a + 1, c = a + NX + 1, e = c + 1;
      index.push(a, c, b, b, c, e);
    }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geo.setIndex(index);

  const uniforms = {
    apres: { value: texture(imgApres) },
    avant: { value: texture(imgAvant) },
    coupe: { value: -1 }, // abscisse de la barre en pixels de l'écran (gauche = avant)
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.DoubleSide,
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader:
      "uniform sampler2D apres; uniform sampler2D avant; uniform float coupe; varying vec2 vUv; void main(){ vec4 c = gl_FragCoord.x < coupe ? texture2D(avant, vUv) : texture2D(apres, vUv); gl_FragColor = vec4(c.rgb, 1.0); }",
  });
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(geo, mat));

  // Caméra : la projection est calculée à la main pour viser un rectangle précis de la façade
  // (plan de la maison, à D_MAISON du point de départ). Pendant la marche, l'angle de vue reste
  // celui de l'écran : la maison grandit à mesure qu'on approche. Pendant la visite, la caméra
  // cadre la zone choisie (même en bord de maison), sans jamais sortir de la photo.
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  const PRES = 0.1, LOIN = 100;
  const enMetres = (px, py) => [((px - CX) / F) * D_MAISON, OEIL - ((py - CY) / F) * D_MAISON];
  const BORD = { x0: enMetres(0, 0)[0], x1: enMetres(LP, 0)[0], y1: enMetres(0, 0)[1], y0: enMetres(0, HP * 0.9)[1] };

  let L = 1, H = 1;
  // demi-angles de vue (tangentes) au départ : plus grand cadrage au format de l'écran dans la photo
  function anglesBase() {
    const a = L / H;
    let w = LP, h = LP / a;
    if (h > HP) { h = HP; w = HP * a; }
    w *= 0.97; h *= 0.97; // marge pour le balancement de la marche
    const yc = Math.min(HP - h / 2, Math.max(h / 2, CY + 20));
    return { gx: -w / 2 / F, dx: w / 2 / F, ha: (CY - (yc - h / 2)) / F, ba: (CY - (yc + h / 2)) / F };
  }
  // rectangle de façade vu depuis la position cam avec les angles de départ
  function rectMarche(cam) {
    const g = anglesBase(), dp = D_MAISON + cam.z;
    return { x0: cam.x + g.gx * dp, x1: cam.x + g.dx * dp, y0: cam.y + g.ba * dp, y1: cam.y + g.ha * dp };
  }
  const FIN = new THREE.Vector3(0, OEIL, -MARCHE);
  function rectZone(z) {
    const r = rectMarche(FIN);
    if (z < 0) return r;
    const v = reperes[z].getAttribute("data-vue").split(",").map(Number);
    const [tx, ty] = enMetres(v[0], v[1]);
    const k = v[2] / 1.5;
    let w = (r.x1 - r.x0) / k, h = (r.y1 - r.y0) / k;
    w = Math.min(w, BORD.x1 - BORD.x0); h = Math.min(h, BORD.y1 - BORD.y0);
    // la zone visée se place à droite du panneau (ordinateur) ou au-dessus du panneau (téléphone)
    const large = L >= 860, fx = large ? 0.64 : 0.5, fy = large ? 0.5 : H < 600 ? 0.24 : 0.34;
    const x0 = Math.min(BORD.x1 - w, Math.max(BORD.x0, tx - w * fx));
    const y0 = Math.min(BORD.y1 - h, Math.max(BORD.y0, ty + h * fy - h));
    return { x0, x1: x0 + w, y0, y1: y0 + h };
  }
  function viser(rect) {
    const c = camera.position, dp = D_MAISON + c.z;
    const f = PRES / dp;
    camera.projectionMatrix.makePerspective((rect.x0 - c.x) * f, (rect.x1 - c.x) * f, (rect.y1 - c.y) * f, (rect.y0 - c.y) * f, PRES, LOIN);
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  }

  /* --- État --- */
  const etat = { marche: 0, zone: -1, rect: null, cible: null };
  const repere = document.createElement("span");
  repere.className = "repere-3d";
  repere.setAttribute("aria-hidden", "true");
  repere.innerHTML = '<span class="repere-3d__anneau"></span><span class="repere-3d__point"></span><span class="repere-3d__nom"></span>';
  cadre.appendChild(repere);
  const repereNom = repere.querySelector(".repere-3d__nom");

  function redimensionner() {
    L = Math.max(1, cadre.clientWidth);
    H = Math.max(1, cadre.clientHeight);
    renderer.setSize(L, H, false);
    relancer();
  }

  document.addEventListener("arv:avance", (e) => {
    etat.marche = e.detail.marche;
    if (e.detail.zone !== etat.zone) {
      etat.zone = e.detail.zone;
      const r = reperes[etat.zone];
      repereNom.textContent = r ? r.getAttribute("data-nom") : "";
      repere.classList.remove("est-visible");
    }
    relancer();
  });
  if (curseur) curseur.addEventListener("input", relancer);

  /* --- Boucle de rendu (seulement quand quelque chose bouge) --- */
  let enCours = false, derniere = 0, lisse = 0;
  function relancer() {
    if (!enCours) { enCours = true; derniere = 0; requestAnimationFrame(boucle); }
  }
  const pt = new THREE.Vector3();
  function boucle(t) {
    const dt = derniere ? Math.min(0.05, (t - derniere) / 1000) : 0.016;
    derniere = t;
    const a = reduit ? 1 : 1 - Math.exp(-dt * 5);
    // marche : la caméra suit le défilement, avec le balancement des pas
    lisse += (etat.marche - lisse) * (reduit ? 1 : 1 - Math.exp(-dt * 9));
    const pas = lisse * 7; // 7 pas sur le parcours
    const bal = Math.sin(lisse * Math.PI); // balancement nul à l'arrêt, au départ et à l'arrivée
    camera.position.set(Math.sin(pas * Math.PI) * 0.035 * bal, OEIL + Math.abs(Math.sin(pas * Math.PI)) * 0.03 * bal, -lisse * MARCHE);
    camera.updateMatrixWorld();
    // cadrage : pendant la marche, il suit la caméra ; pendant la visite, il glisse vers la zone
    const b = etat.zone < 0 ? rectMarche(camera.position) : rectZone(etat.zone);
    if (!etat.rect) etat.rect = { ...b };
    const c = etat.rect;
    const ac = etat.zone < 0 && !reduit ? 1 - Math.exp(-dt * 14) : a; // marche : suit de près ; visite : glisse
    for (const k of ["x0", "x1", "y0", "y1"]) c[k] += (b[k] - c[k]) * ac;
    viser(c);
    // avant / après : seulement pendant la visite
    const enVisite = visite && visite.getAttribute("data-phase") === "visite";
    uniforms.coupe.value = enVisite ? (L * renderer.getPixelRatio() * Number(curseur ? curseur.value : 50)) / 100 : -1;
    renderer.render(scene, camera);

    // étiquette sur la zone, une fois le cadrage presque arrivé
    const ecart = (Math.abs(b.x0 - c.x0) + Math.abs(b.x1 - c.x1) + Math.abs(b.y0 - c.y0) + Math.abs(b.y1 - c.y1)) * 40;
    const r = reperes[etat.zone];
    if (r && enVisite) {
      const p = r.getAttribute("data-point").split(",").map(Number);
      pt.set(((p[0] - CX) / F) * D_MAISON, OEIL - ((p[1] - CY) / F) * D_MAISON, -D_MAISON).project(camera);
      repere.style.transform = `translate(${((pt.x * 0.5 + 0.5) * L).toFixed(1)}px, ${((-pt.y * 0.5 + 0.5) * H).toFixed(1)}px)`;
      repere.classList.toggle("est-visible", ecart < 40);
    } else repere.classList.remove("est-visible");

    const bouge = ecart > 0.3 || Math.abs(etat.marche - lisse) > 0.0005;
    if (bouge) requestAnimationFrame(boucle);
    else { enCours = false; if (r && enVisite) repere.classList.add("est-visible"); }
  }

  if ("ResizeObserver" in window) new ResizeObserver(redimensionner).observe(cadre);
  window.addEventListener("resize", redimensionner);
  redimensionner();
  fig.classList.add("est-3d");
  // la photo d'origine s'efface : on enlève l'agrandissement de secours qu'elle a pu recevoir
  cadre.querySelectorAll("img").forEach((img) => { img.style.transform = ""; });
  document.dispatchEvent(new CustomEvent("arv:pret"));
}
