/*
 * Couvreur Proximité 34 — la maison en 3D de l'accueil (/3d/maison.glb).
 * La maison est posée dans un petit jardin méditerranéen (pelouse, pas japonais, cyprès, oliviers,
 * haie, lavandes). À l'arrivée, elle est vue de trois quarts, à côté du titre. En défilant, la
 * caméra va chercher les 5 interventions (couverture, faîtage, gouttière, solin de cheminée, toit
 * à démousser), signalées par un repère orange ; à la fin, elle revient en vue d'ensemble. La barre avant / après coupe l'image : à gauche, la même maison avant
 * travaux, calculée dans le rendu (tuiles encrassées, mousse, lichens, tuiles cassées, coulures
 * sous la gouttière) ; à droite, la maison telle qu'elle est.
 * Le modèle n'est texturé que de face : la caméra reste devant la maison ou de trois quarts.
 * Three.js 0.169 par import map ; chargé par site.js seulement avec une vraie puce graphique.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const fig = document.querySelector("[data-avant-apres]");
const cadre = fig && fig.querySelector(".avant-apres__cadre");
const curseur = fig && fig.querySelector(".avant-apres__curseur");
const visite = document.querySelector("[data-visite]");
const reperes = [...document.querySelectorAll(".visite__reperes button")];
const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const telephone = window.matchMedia("(max-width: 859px)").matches;
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

/* --- Points de vue (unités du modèle : la maison fait 2,6 de large, mur de façade en z ≈ 0,9) --- */
// az : angle autour de la maison (0 = face), el : hauteur de vue, d : distance
const ACCROCHE = { cible: V3(0, 1.25, 0.2), az: 0.62, el: 0.3, d: 9.2 };
const FIN = { cible: V3(0, 1.15, 0.6), az: 0.42, el: 0.34, d: 8.8 }; // vue d'ensemble, fin de la visite
const ZONES = [
  { cible: V3(0.1, 2.05, 0.45), az: 0.32, el: 0.5, d: 6.6, point: V3(0.3, 2.13, 0.5) },       // couverture
  { cible: V3(0.55, 2.2, 0.25), az: 0.72, el: 0.42, d: 5.6, point: V3(0.66, 2.17, 0.36) },    // faîtage et arêtiers
  { cible: V3(-0.95, 1.6, 0.95), az: -0.16, el: 0.14, d: 4.8, point: V3(-1.25, 1.86, 1.0) },   // gouttière et descente
  { cible: V3(0.02, 2.4, 0.1), az: 0.22, el: 0.42, d: 4.4, point: V3(0.03, 2.42, 0.16) },     // solin de cheminée
  { cible: V3(0.75, 1.98, 0.55), az: 0.5, el: 0.55, d: 5.4, point: V3(0.9, 2.02, 0.56) },     // toit à démousser
];

if (cadre) demarrer().catch(() => {});

async function demarrer() {
  const url = fig.getAttribute("data-modele");
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(url);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, telephone ? 1.5 : 1.75)); // téléphone : moins de pixels, plus de fluidité
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false; // maison immobile : ombre calculée une fois
  renderer.autoClear = false;
  const toile = renderer.domElement;
  toile.className = "avant-apres__3d";
  toile.setAttribute("aria-hidden", "true");
  cadre.insertBefore(toile, cadre.firstChild);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  pmrem.dispose();
  const soleil = new THREE.DirectionalLight(0xfff1dc, 1.7);
  soleil.position.set(-4, 12, 7);
  soleil.castShadow = true;
  soleil.shadow.mapSize.set(telephone ? 1024 : 2048, telephone ? 1024 : 2048);
  Object.assign(soleil.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 40 });
  soleil.shadow.bias = -0.0005;
  soleil.shadow.normalBias = 0.02;
  scene.add(soleil, new THREE.HemisphereLight(0xf7f5f0, 0xb9a58c, 0.35));

  // Le modèle : centré, posé au sol, ramené à 4 unités dans sa plus grande dimension au sol.
  const maison = gltf.scene;
  const boite = new THREE.Box3().setFromObject(maison);
  const taille = boite.getSize(V3(0, 0, 0));
  maison.scale.setScalar(4 / Math.max(taille.x, taille.z));
  boite.setFromObject(maison);
  const centre = boite.getCenter(V3(0, 0, 0));
  maison.position.sub(V3(centre.x, boite.min.y, centre.z));
  scene.add(maison);

  /* --- État « avant », calculé dans le rendu à partir de la position de chaque point --- */
  const VIEILLIR = `
    float h3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
    float bruit(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
      return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
                 mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
    float fbm(vec3 p){ return 0.5 * bruit(p) + 0.25 * bruit(p * 2.03) + 0.125 * bruit(p * 4.1) + 0.0625 * bruit(p * 8.3); }
  `;
  maison.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
    const m = o.material;
    if (m.map) m.map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const v = m.clone();
    v.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vPosM;")
        .replace("#include <project_vertex>", "#include <project_vertex>\nvPosM = (modelMatrix * vec4(transformed, 1.0)).xyz;");
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vPosM;\n" + VIEILLIR)
        .replace(
          "#include <map_fragment>",
          `#include <map_fragment>
          {
            vec3 c = diffuseColor.rgb; vec3 P = vPosM;
            // tuiles : terre cuite (couleur), sur le toit ou l'auvent de la porte
            float terre = smoothstep(1.35, 1.8, c.r / max(c.g, 0.02)) * smoothstep(1.6, 2.4, c.r / max(c.b, 0.02));
            float toit = terre * max(step(1.72, P.y), step(0.92, P.y) * step(1.05, P.z));
            // tuiles noircies et grisées, traînées sombres dans le sens de la pente
            float trainee = smoothstep(0.45, 0.8, fbm(vec3(P.x * 9.0, P.y * 1.5, P.z * 9.0)));
            vec3 sale = c * vec3(0.46, 0.43, 0.38) * (1.0 - 0.45 * trainee) + 0.004;
            c = mix(c, sale, 0.85 * toit);
            // mousse en plaques bien visibles (vert jaune), plus dense en bas des pans
            float m = fbm(P * 6.0 + 2.0) + 0.12 * (1.0 - smoothstep(1.75, 2.3, P.y));
            float mousse = smoothstep(0.46, 0.6, m);
            vec3 vert = mix(vec3(0.05, 0.09, 0.012), vec3(0.17, 0.23, 0.04), bruit(P * 60.0));
            c = mix(c, vert, mousse * 0.92 * toit);
            // lichens : petites taches jaune pâle
            c = mix(c, vec3(0.55, 0.5, 0.25), step(0.9, bruit(P * 90.0)) * 0.8 * toit);
            // tuiles cassées ou manquantes : trous noirs, liteau clair
            float n = bruit(P * 11.0 + vec3(3.1, 7.7, 1.3));
            float casse = smoothstep(0.78, 0.81, n);
            c = mix(c, vec3(0.006), casse * toit);
            c = mix(c, vec3(0.2, 0.11, 0.05), smoothstep(0.765, 0.78, n) * (1.0 - casse) * toit);
            // enduit : coulures noires sous la gouttière, voile gris, fissures
            float blanc = smoothstep(0.3, 0.45, min(c.r, min(c.g, c.b))) * (1.0 - toit) * step(0.12, P.y) * step(P.y, 1.84);
            float u = (P.x + P.z) * 26.0;
            float trace = smoothstep(0.42, 0.8, bruit(vec3(u, 0.0, 0.0)));
            float longueur = 0.45 + 1.1 * bruit(vec3(u, 5.0, 0.0));
            float coulure = trace * clamp(1.0 - (1.86 - P.y) / longueur, 0.0, 1.0);
            float voile = 0.38 * smoothstep(1.3, 1.86, P.y) + 0.18 * fbm(P * 3.0) + 0.25 * (1.0 - smoothstep(0.12, 0.5, P.y));
            c = mix(c, c * vec3(0.34, 0.37, 0.29), clamp(coulure * 0.95 + voile, 0.0, 0.9) * blanc);
            float fissure = 1.0 - smoothstep(0.0, 0.012, abs(fbm(P * vec3(4.0, 9.0, 4.0)) - 0.5));
            c = mix(c, vec3(0.04), fissure * 0.7 * blanc);
            // volets bleus délavés et écaillés
            float bleu = smoothstep(1.15, 1.5, c.b / max(c.r, 0.01)) * (1.0 - toit);
            vec3 delave = mix(vec3(0.14, 0.17, 0.2), vec3(0.32, 0.3, 0.26), step(0.7, bruit(P * 55.0)));
            c = mix(c, delave, bleu * 0.85);
            diffuseColor.rgb = c;
          }`
        );
    };
    v.customProgramCacheKey = () => "avant";
    o.userData.apres = m;
    o.userData.avant = v;
  });
  const poser = (etat) => maison.traverse((o) => { if (o.isMesh) o.material = o.userData[etat]; });

  /* --- Jardin --- */
  let graine = 34;
  const alea = () => ((graine = (graine * 16807) % 2147483647) / 2147483647);
  const toileTex = (l, h, dessin, couleur = true) => {
    const c = document.createElement("canvas");
    c.width = l;
    c.height = h;
    dessin(c.getContext("2d"), l, h);
    const t = new THREE.CanvasTexture(c);
    if (couleur) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return t;
  };
  // pelouse : brins sur fond nuancé, bord fondu dans le fond de la page
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
  herbe.wrapS = herbe.wrapT = THREE.RepeatWrapping;
  herbe.repeat.set(6, 6);
  const fondu = toileTex(256, 256, (g, l, h) => {
    const gr = g.createRadialGradient(l / 2, h / 2, 0, l / 2, h / 2, l / 2);
    gr.addColorStop(0, "#fff");
    gr.addColorStop(0.55, "#fff");
    gr.addColorStop(1, "#000");
    g.fillStyle = gr;
    g.fillRect(0, 0, l, h);
  }, false);
  const pelouse = new THREE.Mesh(
    new THREE.CircleGeometry(6.8, 64),
    new THREE.MeshStandardMaterial({ map: herbe, alphaMap: fondu, transparent: true, roughness: 1, envMapIntensity: 0.5 })
  );
  pelouse.rotation.x = -Math.PI / 2;
  pelouse.position.y = -0.006;
  pelouse.receiveShadow = true;
  scene.add(pelouse);

  // pas japonais de la porte vers l'avant du jardin
  {
    const pierres = [];
    const o = new THREE.Object3D();
    for (let z = 1.75; z < 6.6; z += 0.42) {
      o.position.set((alea() - 0.5) * 0.12, 0.012, z);
      o.rotation.set(0, alea() * 0.6, 0);
      o.scale.set(0.95 + alea() * 0.25, 1, 0.75 + alea() * 0.2);
      o.updateMatrix();
      pierres.push(o.matrix.clone());
    }
    const dalles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.2, 0.21, 0.03, 9), new THREE.MeshStandardMaterial({ color: 0xcfc6b4, roughness: 0.9 }), pierres.length);
    pierres.forEach((m, i) => dalles.setMatrixAt(i, m));
    dalles.receiveShadow = true;
    scene.add(dalles);
  }

  // végétation : nuages de petites boules (une seule géométrie instanciée pour tout le jardin)
  const feuilles = [];
  const o3 = new THREE.Object3D();
  const touffe = (cx, cy, cz, rx, ry, rz, n, taille, teinte) => {
    const base = new THREE.Color(teinte);
    for (let i = 0; i < n; i++) {
      const a = alea() * Math.PI * 2, b = Math.acos(2 * alea() - 1), r = Math.cbrt(alea());
      o3.position.set(cx + Math.sin(b) * Math.cos(a) * rx * r, cy + Math.cos(b) * ry * r, cz + Math.sin(b) * Math.sin(a) * rz * r);
      const t = taille * (0.7 + alea() * 0.6);
      o3.scale.set(t * (0.8 + alea() * 0.4), t * (0.7 + alea() * 0.4), t * (0.8 + alea() * 0.4));
      o3.rotation.set(alea() * 3, alea() * 3, 0);
      o3.updateMatrix();
      const l = 0.72 + 0.4 * ((o3.position.y - (cy - ry)) / (2 * ry)) + 0.12 * r; // plus clair en haut
      feuilles.push([o3.matrix.clone(), base.clone().multiplyScalar(l)]);
    }
  };
  const bois = new THREE.MeshStandardMaterial({ color: 0x6b5644, roughness: 0.95 });
  const tronc = (x, z, h, r) => {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.7, r, h, 7), bois);
    t.position.set(x, h / 2, z);
    t.castShadow = true;
    scene.add(t);
  };
  // cyprès derrière la maison
  for (const [x, z, h] of [[-2.9, -2.7, 3.2], [-2.2, -3.3, 2.7], [2.8, -3.0, 3.4], [3.5, -2.0, 2.8]]) {
    tronc(x, z, 0.4, 0.08);
    touffe(x, h / 2 + 0.25, z, 0.34, h / 2, 0.34, 650, 0.065, "#33502a");
  }
  // oliviers devant, feuillage gris-vert
  for (const [x, z] of [[-3.5, 2.7], [3.9, 3.3]]) {
    tronc(x, z, 1.0, 0.11);
    touffe(x, 1.45, z, 1.0, 0.52, 0.95, 900, 0.075, "#86926a");
  }
  // haie basse au fond, arbustes ronds, lavandes
  for (let x = -4.2; x <= 4.2; x += 0.5) touffe(x, 0.38, -3.9 + Math.abs(x) * 0.08, 0.32, 0.36, 0.3, 55, 0.07, "#41612f");
  for (const [x, z, r] of [[-2.4, 1.9, 0.38], [2.3, 2.1, 0.34], [-2.6, -0.6, 0.42], [2.6, 0.4, 0.4], [-1.3, 3.6, 0.3], [1.35, 3.9, 0.3]])
    touffe(x, r * 0.85, z, r, r * 0.85, r, 150, 0.06, "#4d6c3a");
  for (let i = 0; i < 10; i++) {
    const x = 1.2 + (i % 5) * 0.32, z = 2.9 + Math.floor(i / 5) * 0.34;
    touffe(x, 0.18, z, 0.14, 0.15, 0.14, 26, 0.04, "#6f7d5c");
    touffe(x, 0.34, z, 0.12, 0.05, 0.12, 22, 0.022, "#8e80b6");
  }
  {
    const vegetation = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true, envMapIntensity: 0.6 }), feuilles.length);
    feuilles.forEach(([m, c], i) => { vegetation.setMatrixAt(i, m); vegetation.setColorAt(i, c); });
    vegetation.castShadow = true;
    vegetation.receiveShadow = true;
    scene.add(vegetation);
  }

  /* --- Caméra --- */
  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 60);
  let L = 1, H = 1;
  const large = () => L >= 860;
  // décalage de l'image : maison à droite du titre (ordinateur) ou sous le titre (téléphone) à
  // l'arrivée ; au-dessus du panneau des interventions pendant la visite
  // Téléphone : à l'arrivée, la maison est mise à l'échelle de l'espace libre sous le titre ;
  // pendant la visite, la zone se place au-dessus du panneau, à droite de la barre avant / après.
  const tel = { k: 1.25, ox: 0, oy: 0.14, panneau: 0 };
  const decalage = (phase) =>
    phase === "accroche" ? (large() ? [0.21, 0.03] : [tel.ox, tel.oy])
    : phase === "visite" ? (large() ? [0.17, 0] : [0.13, -tel.panneau / (2 * H)])
    : [0, 0];
  const pose = (v) => {
    const k = large() ? 1 : v === ACCROCHE ? tel.k : 1.25; // téléphone en hauteur : un peu plus de recul
    return {
      cible: v.cible.clone(),
      pos: v.cible.clone().add(V3(Math.sin(v.az) * Math.cos(v.el), Math.sin(v.el), Math.cos(v.az) * Math.cos(v.el)).multiplyScalar(v.d * k)),
    };
  };
  const etat = { zone: -1, phase: "accroche", pos: null, cible: null, ox: 0, oy: 0 };

  const repere = document.createElement("span");
  repere.className = "repere-3d";
  repere.setAttribute("aria-hidden", "true");
  repere.innerHTML = '<span class="repere-3d__anneau"></span><span class="repere-3d__point"></span><span class="repere-3d__nom"></span>';
  cadre.appendChild(repere);
  const repereNom = repere.querySelector(".repere-3d__nom");

  function but() {
    if (etat.zone >= 0) return pose(ZONES[etat.zone]);
    return pose(etat.phase === "fin" ? FIN : ACCROCHE);
  }

  const coins = [];
  {
    const b = new THREE.Box3().setFromObject(maison);
    for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) coins.push(V3(x, y, z));
  }
  function cadrerTelephone() {
    if (large()) return;
    const panneau = visite && visite.querySelector(".immersion__visite");
    tel.panneau = panneau ? panneau.offsetHeight : H * 0.4;
    const texte = document.querySelector(".immersion__accroche .accroche__texte");
    const rc = cadre.getBoundingClientRect();
    const haut = texte ? texte.getBoundingClientRect().bottom - rc.top + 14 : H * 0.45;
    // bas visible tout en haut de la page (le bandeau d'urgence pousse la section vers le bas), moins le bouton « Avancez »
    const hautSection = visite.getBoundingClientRect().top + window.scrollY;
    const bas = Math.min(H, window.innerHeight - hautSection) - 64;
    if (bas - haut < 80) return;
    const cam = camera.clone();
    const q = V3(0, 0, 0);
    let x0, x1, y0, y1;
    for (let i = 0; i < 4; i++) {
      const p = pose(ACCROCHE);
      cam.position.copy(p.pos);
      cam.lookAt(p.cible);
      cam.clearViewOffset();
      cam.updateMatrixWorld();
      x0 = y0 = Infinity; x1 = y1 = -Infinity;
      for (const c of coins) {
        q.copy(c).project(cam);
        const x = (q.x * 0.5 + 0.5) * L, y = (-q.y * 0.5 + 0.5) * H;
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
      tel.k *= Math.max((y1 - y0) / (bas - haut), (x1 - x0) / (L * 0.94));
    }
    tel.ox = (L / 2 - (x0 + x1) / 2) / L;
    tel.oy = ((haut + bas) / 2 - (y0 + y1) / 2) / H;
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
    if (e.detail.zone !== etat.zone) {
      etat.zone = e.detail.zone;
      const r = reperes[etat.zone];
      repereNom.textContent = r ? r.getAttribute("data-nom") : "";
      repere.classList.remove("est-visible");
    }
    relancer();
  });
  if (curseur) curseur.addEventListener("input", relancer);

  /* --- Rendu à la demande --- */
  let enCours = false, derniere = 0, ombre = false;
  function relancer() {
    if (!enCours) { enCours = true; derniere = 0; requestAnimationFrame(boucle); }
  }
  const pt = V3(0, 0, 0);
  function boucle(t) {
    const dt = derniere ? Math.min(0.05, (t - derniere) / 1000) : 0.016;
    derniere = t;
    const b = but();
    if (!etat.pos) { etat.pos = b.pos.clone(); etat.cible = b.cible.clone(); }
    // glisse en douceur d'un point de vue à l'autre
    const vit = reduit ? 1 : 1 - Math.exp(-dt * 3.2);
    etat.pos.lerp(b.pos, vit);
    etat.cible.lerp(b.cible, vit);
    const [ox, oy] = decalage(etat.phase);
    etat.ox += (ox - etat.ox) * vit;
    etat.oy += (oy - etat.oy) * vit;
    camera.position.copy(etat.pos);
    camera.lookAt(etat.cible);
    camera.setViewOffset(L, H, -etat.ox * L, -etat.oy * H, L, H);
    camera.updateMatrixWorld();

    if (!ombre) { renderer.shadowMap.needsUpdate = true; ombre = true; }
    renderer.setViewport(0, 0, L, H);
    renderer.setScissorTest(false);
    renderer.clear();
    const enVisite = etat.phase === "visite";
    const coupe = enVisite ? Math.round((L * Number(curseur ? curseur.value : 50)) / 100) : 0;
    renderer.setScissorTest(true);
    if (coupe > 0) { poser("avant"); renderer.setScissor(0, 0, coupe, H); renderer.render(scene, camera); }
    if (coupe < L) { poser("apres"); renderer.setScissor(coupe, 0, L - coupe, H); renderer.render(scene, camera); }
    renderer.setScissorTest(false);

    const ecart = etat.pos.distanceTo(b.pos) + etat.cible.distanceTo(b.cible) + Math.abs(ox - etat.ox) + Math.abs(oy - etat.oy);
    const z = ZONES[etat.zone];
    if (z && enVisite) {
      pt.copy(z.point).project(camera);
      repere.style.transform = `translate(${((pt.x * 0.5 + 0.5) * L).toFixed(1)}px, ${((-pt.y * 0.5 + 0.5) * H).toFixed(1)}px)`;
      repere.classList.toggle("est-visible", ecart < 0.08);
    } else repere.classList.remove("est-visible");

    if (ecart > 0.0008) requestAnimationFrame(boucle);
    else { enCours = false; if (z && enVisite) repere.classList.add("est-visible"); }
  }

  if ("ResizeObserver" in window) new ResizeObserver(redimensionner).observe(cadre);
  window.addEventListener("resize", redimensionner);
  redimensionner();
  // les shaders (dont celui de l'état « avant ») sont compilés avant la première image
  poser("avant");
  await renderer.compileAsync(scene, camera).catch(() => {});
  poser("apres");
  fig.classList.add("est-3d");
  document.dispatchEvent(new CustomEvent("arv:pret"));
  relancer();
}
