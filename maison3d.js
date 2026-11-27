/*
 * Couvreur Proximité 34 — la maison en 3D (accueil, section « sous tous les angles »).
 * Le modèle /3d/maison.glb tourne avec le défilement : la section reste à l'écran et le parcours
 * (0 → 1, envoyé par site.js avec l'événement arv:maison3d) fait faire le tour de la maison.
 * La souris incline légèrement la vue. Rendu seulement quand quelque chose bouge.
 * Three.js 0.169 par import map ; chargé par site.js seulement avec une vraie puce graphique.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const section = document.querySelector("[data-maison3d]");
const scene3d = section && section.querySelector(".maison3d__scene");
const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Angle de départ (radians) : côté gauche et façade, vue de trois quarts.
const DEPART = 0.75;
// Rotation sur tout le parcours : on passe devant la façade jusqu'au côté droit (l'arrière, non
// visible sur la photo d'origine, n'est jamais montré).
const TOUR = 2.0;

if (scene3d) demarrer().catch(() => {});

async function demarrer() {
  const url = section.getAttribute("data-modele");
  if (!url) return;
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(url);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const toile = renderer.domElement;
  toile.className = "maison3d__toile";
  toile.setAttribute("aria-hidden", "true");
  scene3d.appendChild(toile);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  pmrem.dispose();

  // Lumière du Midi : soleil chaud en haut à gauche, qui porte une ombre douce au sol.
  const soleil = new THREE.DirectionalLight(0xfff1dc, 1.7);
  soleil.position.set(-4, 12, 5);
  soleil.castShadow = true;
  soleil.shadow.mapSize.set(1024, 1024);
  soleil.shadow.radius = 6;
  soleil.shadow.bias = -0.0005;
  scene.add(soleil, new THREE.HemisphereLight(0xf7f5f0, 0xb9a58c, 0.35));

  // Le modèle : centré, posé au sol, ramené à environ 4 unités de large.
  const maison = gltf.scene;
  const boite = new THREE.Box3().setFromObject(maison);
  const taille = boite.getSize(new THREE.Vector3());
  const echelle = 4 / Math.max(taille.x, taille.z);
  maison.scale.setScalar(echelle);
  boite.setFromObject(maison);
  const centre = boite.getCenter(new THREE.Vector3());
  maison.position.sub(new THREE.Vector3(centre.x, boite.min.y, centre.z));
  maison.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
      if (o.material && o.material.map) o.material.map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    }
  });
  const pivot = new THREE.Group();
  pivot.add(maison);
  scene.add(pivot);
  const hauteur = boite.max.y - boite.min.y;

  const sol = new THREE.Mesh(new THREE.CircleGeometry(6, 48), new THREE.ShadowMaterial({ opacity: 0.18 }));
  sol.rotation.x = -Math.PI / 2;
  sol.position.y = 0.001;
  sol.receiveShadow = true;
  scene.add(sol);
  soleil.shadow.camera.left = soleil.shadow.camera.bottom = -5;
  soleil.shadow.camera.right = soleil.shadow.camera.top = 5;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const cible = new THREE.Vector3(0, hauteur * 0.42, 0);

  let L = 1, H = 1;
  function cadrer() {
    L = Math.max(1, scene3d.clientWidth);
    H = Math.max(1, scene3d.clientHeight);
    renderer.setSize(L, H, false);
    camera.aspect = L / H;
    // assez de recul pour que la maison tienne en entier, en largeur comme en hauteur
    const distH = (hauteur * 0.75) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const distL = (camera.aspect < 1 ? 2.25 : 2.7) / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
    etat.distance = Math.max(distH, distL, 7);
    camera.updateProjectionMatrix();
    relancer();
  }

  /* --- État : parcours (défilement) et souris --- */
  const etat = { parcours: 0, lisse: 0, sx: 0, sy: 0, mx: 0, my: 0, distance: 10 };
  document.addEventListener("arv:maison3d", (e) => { etat.parcours = e.detail.parcours; relancer(); });
  if (!reduit && window.matchMedia("(hover: hover)").matches) {
    section.addEventListener("pointermove", (e) => {
      const r = scene3d.getBoundingClientRect();
      etat.mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      etat.my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      relancer();
    });
    section.addEventListener("pointerleave", () => { etat.mx = etat.my = 0; relancer(); });
  }

  let enCours = false, derniere = 0;
  function relancer() {
    if (!enCours) { enCours = true; derniere = 0; requestAnimationFrame(boucle); }
  }
  function boucle(t) {
    const dt = derniere ? Math.min(0.05, (t - derniere) / 1000) : 0.016;
    derniere = t;
    const a = reduit ? 1 : 1 - Math.exp(-dt * 6);
    etat.lisse += (etat.parcours - etat.lisse) * a;
    etat.sx += (etat.mx - etat.sx) * a;
    etat.sy += (etat.my - etat.sy) * a;

    pivot.rotation.y = DEPART - etat.lisse * TOUR + etat.sx * 0.12;
    // la caméra descend un peu en cours de tour : on finit à hauteur de gouttière
    const haut = THREE.MathUtils.lerp(0.42, 0.26, etat.lisse) + etat.sy * 0.04;
    camera.position.set(0, cible.y + etat.distance * haut, etat.distance);
    camera.lookAt(cible);
    renderer.render(scene, camera);

    const bouge = Math.abs(etat.parcours - etat.lisse) > 0.0004 || Math.abs(etat.mx - etat.sx) > 0.002 || Math.abs(etat.my - etat.sy) > 0.002;
    if (bouge) requestAnimationFrame(boucle);
    else enCours = false;
  }

  if ("ResizeObserver" in window) new ResizeObserver(cadrer).observe(scene3d);
  window.addEventListener("resize", cadrer);
  cadrer();
  section.classList.add("est-3d");
  document.dispatchEvent(new CustomEvent("arv:maison3d-pret"));
}
