/*
 * Couvreur Proximité 34 — fiche PDF d'une demande reçue par le site.
 * Générateur PDF autonome (aucune dépendance) : polices standard Helvetica et Courier,
 * logo et photos du client intégrés en JPEG. Les fichiers commençant par « _ » dans /api
 * ne sont pas exposés comme des pages par Vercel.
 */

const LOGO = require("./_logo.js");

const A4 = { l: 595.28, h: 841.89 };
const MARGE = 46;
const LARGEUR = A4.l - 2 * MARGE;

const COULEURS = {
  marine: [0.141, 0.216, 0.275],
  orange: [0.776, 0.365, 0.157],
  texte: [0.122, 0.161, 0.2],
  gris: [0.345, 0.38, 0.42],
  grisClair: [0.62, 0.66, 0.7],
  trait: [0.84, 0.86, 0.88],
  casse: [0.969, 0.961, 0.941],
  rougeFond: [0.984, 0.925, 0.922],
  rouge: [0.541, 0.122, 0.09],
  blanc: [1, 1, 1],
};

// Chasses des polices standard (unités pour 1000), caractères 32 à 126.
const CHASSE = {
  F1: [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584],
  F2: [278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584],
};

// Unicode → Windows-1252 (encodage WinAnsi des polices standard).
const CP1252 = { "€": 0x80, "‚": 0x82, "„": 0x84, "…": 0x85, "Œ": 0x8c, "‘": 0x91, "’": 0x92, "“": 0x93, "”": 0x94, "•": 0x95, "–": 0x96, "—": 0x97, "™": 0x99, "œ": 0x9c, "Ÿ": 0x9f };

function nettoyer(t) {
  return String(t == null ? "" : t)
    .replace(/[    ]/g, " ")
    .replace(/\r\n?/g, "\n")
    .replace(/\t/g, " ")
    .replace(/≈/g, "~")
    .replace(/[\u2190-\u21ff]/g, "->");
}

// Texte → octets WinAnsi (chaîne « binaire »), caractères impossibles remplacés.
function versWinAnsi(t) {
  let s = "";
  for (const ch of nettoyer(t)) {
    const c = ch.codePointAt(0);
    if (CP1252[ch]) s += String.fromCharCode(CP1252[ch]);
    else if (c >= 32 && c < 127) s += ch;
    else if (c >= 160 && c < 256) s += ch;
    else if (c === 10) s += " ";
    else {
      const base = ch.normalize("NFD").replace(/[̀-ͯ]/g, "");
      s += base.length === 1 && base.codePointAt(0) < 127 ? base : c > 0xffff ? "" : "?";
    }
  }
  return s;
}

function chaine(t) {
  return "(" + versWinAnsi(t).replace(/[\\()]/g, (c) => "\\" + c).replace(/[\x80-\xff]/g, (c) => "\\" + c.charCodeAt(0).toString(8).padStart(3, "0")) + ")";
}

function largeurTexte(t, police, taille) {
  if (police === "F3") return versWinAnsi(t).length * 0.6 * taille;
  const table = CHASSE[police];
  let w = 0;
  for (const ch of versWinAnsi(t)) {
    let c = ch.charCodeAt(0);
    if (c > 126) {
      const base = String.fromCharCode(c).normalize("NFD").charCodeAt(0);
      c = base < 127 ? base : 0;
    }
    w += c >= 32 && c <= 126 ? table[c - 32] : 556;
  }
  return (w / 1000) * taille;
}

// Découpe un texte en lignes tenant dans « max » points.
function couper(t, police, taille, max) {
  const lignes = [];
  for (const para of nettoyer(t).split("\n")) {
    const mots = para.split(/ +/).filter(Boolean);
    if (!mots.length) {
      lignes.push("");
      continue;
    }
    let l = "";
    for (let m of mots) {
      while (largeurTexte(m, police, taille) > max) {
        let n = m.length;
        while (n > 1 && largeurTexte(m.slice(0, n), police, taille) > max) n--;
        if (l) lignes.push(l), (l = "");
        lignes.push(m.slice(0, n));
        m = m.slice(n);
      }
      const essai = l ? l + " " + m : m;
      if (largeurTexte(essai, police, taille) <= max) l = essai;
      else {
        if (l) lignes.push(l);
        l = m;
      }
    }
    if (l) lignes.push(l);
  }
  return lignes;
}

// Dimensions et composantes d'un JPEG (null si ce n'en est pas un utilisable).
function infosJpeg(b) {
  if (!Buffer.isBuffer(b) || b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) return null;
    const m = b[i + 1];
    if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) {
      i += 2;
      continue;
    }
    const len = b.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      const comp = b[i + 9];
      if (comp !== 1 && comp !== 3) return null;
      return { h: b.readUInt16BE(i + 5), l: b.readUInt16BE(i + 7), espace: comp === 1 ? "/DeviceGray" : "/DeviceRGB" };
    }
    i += 2 + len;
  }
  return null;
}

const n2 = (v) => (Math.round(v * 100) / 100).toString();
const rgb = (c, op) => c.map(n2).join(" ") + " " + op;

/*
 * donnees = {
 *   titre: "Demande de devis", reference, date (texte), urgent (bool),
 *   client: { nom, telephone, email, ville },
 *   rubriques: [{ nom, lignes: [{ label, valeur }] }],
 *   photos: [Buffer JPEG], page: "/devis-toiture", telephoneEntreprise
 * }
 * Retourne un Buffer PDF.
 */
function creerPDF(donnees) {
  const pages = [];
  let ops;
  let y;
  const images = [{ nom: "Logo", data: LOGO, infos: infosJpeg(LOGO) }];

  const nouvellePage = () => {
    ops = [];
    pages.push(ops);
    y = A4.h - MARGE;
  };
  const texte = (x, yy, t, police = "F1", taille = 10, couleur = COULEURS.texte) =>
    ops.push(`BT /${police} ${n2(taille)} Tf ${rgb(couleur, "rg")} ${n2(x)} ${n2(yy)} Td ${chaine(t)} Tj ET`);
  const texteDroite = (xd, yy, t, police, taille, couleur) => texte(xd - largeurTexte(t, police, taille), yy, t, police, taille, couleur);
  const pave = (x, yy, l, h, couleur) => ops.push(`${rgb(couleur, "rg")} ${n2(x)} ${n2(yy)} ${n2(l)} ${n2(h)} re f`);
  const cadre = (x, yy, l, h, couleur, ep = 1) => ops.push(`${rgb(couleur, "RG")} ${n2(ep)} w ${n2(x)} ${n2(yy)} ${n2(l)} ${n2(h)} re S`);
  const trait = (x1, y1, x2, y2, couleur, ep = 0.6) => ops.push(`${rgb(couleur, "RG")} ${n2(ep)} w ${n2(x1)} ${n2(y1)} m ${n2(x2)} ${n2(y2)} l S`);
  const disque = (cx, cy, r, couleur) => {
    const k = 0.5523 * r;
    ops.push(
      `${rgb(couleur, "rg")} ${n2(cx + r)} ${n2(cy)} m ${n2(cx + r)} ${n2(cy + k)} ${n2(cx + k)} ${n2(cy + r)} ${n2(cx)} ${n2(cy + r)} c ` +
        `${n2(cx - k)} ${n2(cy + r)} ${n2(cx - r)} ${n2(cy + k)} ${n2(cx - r)} ${n2(cy)} c ` +
        `${n2(cx - r)} ${n2(cy - k)} ${n2(cx - k)} ${n2(cy - r)} ${n2(cx)} ${n2(cy - r)} c ` +
        `${n2(cx + k)} ${n2(cy - r)} ${n2(cx + r)} ${n2(cy - k)} ${n2(cx + r)} ${n2(cy)} c f`
    );
  };
  const image = (nom, x, yy, l, h) => ops.push(`q ${n2(l)} 0 0 ${n2(h)} ${n2(x)} ${n2(yy)} cm /${nom} Do Q`);
  const BAS = MARGE + 26; // au-dessous : pied de page
  const place = (h) => {
    if (y - h < BAS) {
      nouvellePage();
      y -= 6;
    }
  };

  nouvellePage();

  // ---- En-tête ----
  const lLogo = 104;
  const hLogo = (lLogo * images[0].infos.h) / images[0].infos.l;
  image("Logo", MARGE, y - hLogo, lLogo, hLogo);
  const xNom = MARGE + lLogo + 12;
  texte(xNom, y - 16, "Couvreur Proximité 34", "F2", 14.5, COULEURS.texte);
  texte(xNom, y - 29, "COUVERTURE · ZINGUERIE · DÉPANNAGE", "F1", 7.2, COULEURS.gris);
  if (donnees.telephoneEntreprise) texte(xNom, y - 41, `${donnees.telephoneEntreprise} · Frontignan, Hérault`, "F1", 7.8, COULEURS.gris);
  const mots = String(donnees.titre || "Demande").toUpperCase().split(" ");
  texteDroite(A4.l - MARGE, y - 16, mots[0], "F2", 15, COULEURS.marine);
  if (mots.length > 1) texteDroite(A4.l - MARGE, y - 34, mots.slice(1).join(" "), "F2", 15, COULEURS.orange);
  y -= Math.max(hLogo, 44) + 12;
  pave(MARGE, y - 5, LARGEUR, 5, COULEURS.marine);
  pave(MARGE, y - 8, LARGEUR, 3, COULEURS.orange);
  y -= 26;

  // ---- Référence ----
  texte(MARGE, y, "Référence", "F1", 9, COULEURS.gris);
  const xRef = MARGE + largeurTexte("Référence ", "F1", 9);
  texte(xRef, y, donnees.reference, "F3", 9.5, COULEURS.texte);
  texte(xRef + largeurTexte(donnees.reference, "F3", 9.5) + 6, y, `· reçue le ${donnees.date}`, "F1", 9, COULEURS.gris);
  y -= 16;

  if (donnees.urgent) {
    pave(MARGE, y - 22, LARGEUR, 26, COULEURS.rougeFond);
    texte(MARGE + 12, y - 13, "DEMANDE URGENTE : rappeler le client au plus vite", "F2", 10.5, COULEURS.rouge);
    y -= 36;
  }

  // ---- Client ----
  const c = donnees.client || {};
  const champs = [
    ["Nom", c.nom],
    ["Téléphone", c.telephone],
    ["E-mail", c.email],
    ["Commune", c.ville],
  ];
  const lCol = (LARGEUR - 36) / 2;
  const blocs = champs.map(([label, v]) => ({ label, lignes: couper(v || "—", "F2", 11, lCol) }));
  const hRang = (a, b) => 20 + Math.max(a.lignes.length, b.lignes.length) * 14;
  const h1 = hRang(blocs[0], blocs[1]);
  const h2 = hRang(blocs[2], blocs[3]);
  const hClient = 24 + h1 + h2 + 6;
  pave(MARGE, y - hClient, LARGEUR, hClient, COULEURS.casse);
  pave(MARGE, y - hClient, 4, hClient, COULEURS.orange);
  texte(MARGE + 16, y - 16, "CLIENT", "F2", 8.5, COULEURS.orange);
  let yc = y - 34;
  [[blocs[0], blocs[1], h1], [blocs[2], blocs[3], h2]].forEach(([a, b, h]) => {
    [a, b].forEach((bl, k) => {
      const x = MARGE + 16 + k * (lCol + 12);
      texte(x, yc, bl.label, "F1", 7.8, COULEURS.gris);
      bl.lignes.forEach((l, j) => texte(x, yc - 14 - j * 14, l, "F2", 11, bl.lignes[0] === "—" ? COULEURS.grisClair : COULEURS.texte));
    });
    yc -= h;
  });
  y -= hClient + 22;

  // ---- Rubriques du formulaire ----
  (donnees.rubriques || []).forEach((r, i) => {
    place(60);
    disque(MARGE + 9, y - 3.5, 9, COULEURS.orange);
    texteDroite(MARGE + 9 + largeurTexte(String(i + 1).padStart(2, "0"), "F2", 7.5) / 2, y - 6.2, String(i + 1).padStart(2, "0"), "F2", 7.5, COULEURS.blanc);
    texte(MARGE + 26, y - 7.5, String(r.nom || "Informations").toUpperCase(), "F2", 10.5, COULEURS.marine);
    y -= 16;
    trait(MARGE, y, A4.l - MARGE, y, COULEURS.trait, 0.8);
    y -= 14;
    for (const l of r.lignes) {
      const vide = !String(l.valeur || "").trim();
      const lignes = vide ? ["—"] : couper(l.valeur, "F1", 10.5, LARGEUR - 14);
      place(14 + Math.min(lignes.length, 4) * 14);
      texte(MARGE + 14, y, l.label, "F1", 7.8, COULEURS.gris);
      y -= 14;
      for (const t of lignes) {
        place(14);
        texte(MARGE + 14, y, t, "F1", 10.5, vide ? COULEURS.grisClair : COULEURS.texte);
        y -= 14;
      }
      y -= 6;
    }
    y -= 10;
  });

  // ---- Cadre réservé à l'entreprise ----
  place(110);
  const hCadre = 98;
  cadre(MARGE, y - hCadre, LARGEUR, hCadre, COULEURS.marine, 1.2);
  texte(MARGE + 14, y - 18, "SUIVI PAR COUVREUR PROXIMITÉ 34", "F2", 9.5, COULEURS.marine);
  const champSuivi = (x, yy, label, l) => {
    texte(x, yy, label, "F1", 8.5, COULEURS.gris);
    trait(x + largeurTexte(label, "F1", 8.5) + 6, yy - 2, x + l, yy - 2, COULEURS.grisClair, 0.6);
  };
  const demi = (LARGEUR - 42) / 2;
  champSuivi(MARGE + 14, y - 42, "Date de rappel", demi);
  champSuivi(MARGE + 28 + demi, y - 42, "Référent", demi);
  champSuivi(MARGE + 14, y - 64, "Visite prévue le", demi);
  champSuivi(MARGE + 28 + demi, y - 64, "N° de devis", demi);
  champSuivi(MARGE + 14, y - 86, "Prochaine étape", LARGEUR - 28);
  y -= hCadre + 16;

  // ---- Photos du client ----
  const photos = (donnees.photos || []).map((b) => ({ data: b, infos: infosJpeg(b) })).filter((p) => p.infos);
  photos.forEach((p, i) => {
    p.nom = "Photo" + (i + 1);
    images.push(p);
  });
  for (let i = 0; i < photos.length; i += 2) {
    nouvellePage();
    texte(MARGE, y - 10, i === 0 ? "PHOTOS ENVOYÉES PAR LE CLIENT" : "PHOTOS (SUITE)", "F2", 10.5, COULEURS.marine);
    y -= 20;
    trait(MARGE, y, A4.l - MARGE, y, COULEURS.trait, 0.8);
    y -= 14;
    const hCase = (y - BAS - 14) / 2;
    photos.slice(i, i + 2).forEach((p) => {
      const e = Math.min(LARGEUR / p.infos.l, (hCase - 16) / p.infos.h);
      const l = p.infos.l * e;
      const h = p.infos.h * e;
      image(p.nom, MARGE + (LARGEUR - l) / 2, y - h, l, h);
      texte(MARGE, y - h - 12, `Photo ${photos.indexOf(p) + 1} sur ${photos.length}`, "F1", 7.8, COULEURS.gris);
      y -= hCase + 14;
    });
  }

  // ---- Pied de page ----
  pages.forEach((o, i) => {
    ops = o;
    trait(MARGE, MARGE + 10, A4.l - MARGE, MARGE + 10, COULEURS.trait, 0.6);
    texte(MARGE, MARGE - 2, `Couvreur Proximité 34${donnees.telephoneEntreprise ? " · " + donnees.telephoneEntreprise : ""} · ${donnees.reference}${donnees.page ? " · envoyée depuis " + donnees.page : ""}`, "F1", 7, COULEURS.gris);
    texteDroite(A4.l - MARGE, MARGE - 2, `Page ${i + 1} / ${pages.length}`, "F1", 7, COULEURS.gris);
  });

  // ---- Assemblage du fichier ----
  const objets = []; // contenu de chaque objet (Buffer)
  const ajouter = (contenu) => {
    objets.push(Buffer.isBuffer(contenu) ? contenu : Buffer.from(contenu, "latin1"));
    return objets.length;
  };
  const flux = (dico, data) => Buffer.concat([Buffer.from(`<< ${dico} /Length ${data.length} >>\nstream\n`, "latin1"), data, Buffer.from("\nendstream", "latin1")]);

  const idCatalogue = ajouter(""); // rempli plus bas
  const idPages = ajouter("");
  const polices = ["Helvetica", "Helvetica-Bold", "Courier"].map((p) => ajouter(`<< /Type /Font /Subtype /Type1 /BaseFont /${p} /Encoding /WinAnsiEncoding >>`));
  const idImages = images.map((im) =>
    ajouter(flux(`/Type /XObject /Subtype /Image /Width ${im.infos.l} /Height ${im.infos.h} /ColorSpace ${im.infos.espace} /BitsPerComponent 8 /Filter /DCTDecode`, im.data))
  );
  const ressources = `<< /Font << /F1 ${polices[0]} 0 R /F2 ${polices[1]} 0 R /F3 ${polices[2]} 0 R >> /XObject << ${images.map((im, k) => `/${im.nom} ${idImages[k]} 0 R`).join(" ")} >> >>`;
  const idsPages = pages.map((o) => {
    const idFlux = ajouter(flux("", Buffer.from(o.join("\n"), "latin1")));
    return ajouter(`<< /Type /Page /Parent ${idPages} 0 R /MediaBox [0 0 ${A4.l} ${A4.h}] /Resources ${ressources} /Contents ${idFlux} 0 R >>`);
  });
  objets[idCatalogue - 1] = Buffer.from(`<< /Type /Catalog /Pages ${idPages} 0 R >>`, "latin1");
  objets[idPages - 1] = Buffer.from(`<< /Type /Pages /Kids [${idsPages.map((k) => k + " 0 R").join(" ")}] /Count ${idsPages.length} >>`, "latin1");
  const idInfos = ajouter(`<< /Title ${chaine(`${donnees.titre} ${donnees.reference}`)} /Author ${chaine("Site Couvreur Proximité 34")} /Producer ${chaine("Couvreur Proximité 34")} >>`);

  const morceaux = [Buffer.from("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n", "latin1")];
  let pos = morceaux[0].length;
  const positions = [];
  objets.forEach((o, k) => {
    positions.push(pos);
    const b = Buffer.concat([Buffer.from(`${k + 1} 0 obj\n`, "latin1"), o, Buffer.from("\nendobj\n", "latin1")]);
    morceaux.push(b);
    pos += b.length;
  });
  const xref = `xref\n0 ${objets.length + 1}\n0000000000 65535 f \n${positions.map((p) => String(p).padStart(10, "0") + " 00000 n \n").join("")}trailer\n<< /Size ${objets.length + 1} /Root ${idCatalogue} 0 R /Info ${idInfos} 0 R >>\nstartxref\n${pos}\n%%EOF\n`;
  morceaux.push(Buffer.from(xref, "latin1"));
  return Buffer.concat(morceaux);
}

module.exports = { creerPDF, infosJpeg };
