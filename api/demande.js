/*
 * Couvreur Proximité 34 — réception des formulaires du site (fonction Vercel, Node 18+).
 * Envoie chaque demande par e-mail au client via l'API Resend (https://resend.com).
 *
 * Variables d'environnement à définir dans Vercel (Settings → Environment Variables) :
 *   RESEND_API_KEY   clé API Resend (obligatoire)
 *   ARVEO_EMAIL_TO   adresse qui reçoit les demandes, ex. contact@arveo.fr (obligatoire)
 *   ARVEO_EMAIL_FROM expéditeur sur un domaine vérifié chez Resend,
 *                    ex. "Site Couvreur Proximité 34 <site@arveo.fr>" (par défaut : onboarding@resend.dev, pour tester)
 *   ARVEO_ACCUSE     "1" pour envoyer aussi un accusé de réception au client qui a laissé son e-mail
 */

const TYPES = {
  depannage: { titre: "Demande de dépannage", code: "DEP", urgent: true },
  devis: { titre: "Demande de devis", code: "DEV" },
  rdv: { titre: "Demande de rendez-vous", code: "RDV" },
  rappel: { titre: "Demande de rappel", code: "RAP", urgent: true },
  contact: { titre: "Message du site", code: "MSG" },
};

const LIMITE = new Map(); // anti-abus simple : 6 envois / 10 min / adresse IP (par instance)

function esc(t) {
  return String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

const court = (v, n) => String(v == null ? "" : v).slice(0, n).trim();

function reference(code) {
  const d = new Date();
  const jour = d.toISOString().slice(0, 10).replace(/-/g, "");
  const alea = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ARV-${code}-${jour}-${alea}`;
}

function trop(ip) {
  const maintenant = Date.now();
  const liste = (LIMITE.get(ip) || []).filter((t) => maintenant - t < 10 * 60 * 1000);
  liste.push(maintenant);
  LIMITE.set(ip, liste);
  return liste.length > 6;
}

function lireCorps(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  if (typeof req.body === "string") return Promise.resolve(JSON.parse(req.body || "{}"));
  return new Promise((ok, ko) => {
    let data = "";
    req.on("data", (c) => {
      data += c;
      if (data.length > 5e6) ko(new Error("trop lourd"));
    });
    req.on("end", () => {
      try {
        ok(JSON.parse(data || "{}"));
      } catch (e) {
        ko(e);
      }
    });
    req.on("error", ko);
  });
}

function construireEmail(t, ref, corps) {
  const d = corps.donnees;
  const lignes = (corps.lignes || []).slice(0, 80).map((l) => ({
    section: court(l.section, 80),
    label: court(l.label, 120),
    valeur: court(l.valeur, 4000),
  }));

  // Regroupe par rubrique, comme sur le bon papier.
  const rubriques = [];
  for (const l of lignes) {
    let r = rubriques.find((x) => x.nom === l.section);
    if (!r) rubriques.push((r = { nom: l.section, lignes: [] }));
    r.lignes.push(l);
  }

  const urgent = /urgente/i.test(d.urgence || "") || /urgence/i.test(d.besoin || "");
  const tel = court(d.telephone, 40);
  const telLien = tel.replace(/[^\d+]/g, "");

  const blocs = rubriques
    .map(
      (r, i) => `
      <tr><td style="padding:18px 0 6px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #243746;border-radius:12px;background:#ffffff">
          <tr><td style="padding:14px 18px 6px;font:700 14px Arial,sans-serif;color:#243746;text-transform:uppercase;letter-spacing:.04em">
            <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:50%;background:#B9541F;color:#fff;font-size:11px;margin-right:8px">${String(i + 1).padStart(2, "0")}</span>${esc(r.nom || "Informations")}
          </td></tr>
          ${r.lignes
            .map(
              (l) => `<tr><td style="padding:6px 18px;font:14px/1.5 Arial,sans-serif;color:#1F2933">
            <span style="display:block;color:#58616B;font-size:12px">${esc(l.label)}</span>
            ${l.valeur ? esc(l.valeur).replace(/\n/g, "<br>") : '<span style="color:#9aa3ad">—</span>'}
          </td></tr>`
            )
            .join("")}
          <tr><td style="height:10px"></td></tr>
        </table>
      </td></tr>`
    )
    .join("");

  const htmlMail = `<!doctype html><html lang="fr"><body style="margin:0;background:#F7F5F0">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F0"><tr><td align="center" style="padding:24px 12px">
    <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%">
      <tr><td style="padding:22px 24px;background:#ffffff;border-radius:14px 14px 0 0">
        <table role="presentation" width="100%"><tr>
          <td style="font:800 22px Arial,sans-serif;color:#1F2933;letter-spacing:.06em">Couvreur Proximité 34<br><span style="font:11px Arial,sans-serif;color:#58616B;letter-spacing:.08em">COUVERTURE · ZINGUERIE · DÉPANNAGE</span></td>
          <td align="right" style="font:800 20px Arial,sans-serif;color:#243746;text-transform:uppercase">${esc(t.titre).replace(/^(\S+)/, "$1<br>").replace(/<br>(.*)$/, '<br><span style="color:#C65D28">$1</span>')}</td>
        </tr></table>
      </td></tr>
      <tr><td style="height:6px;background:#243746"></td></tr>
      <tr><td style="height:4px;background:#C65D28"></td></tr>
      <tr><td style="padding:18px 24px;background:#ffffff">
        <p style="margin:0 0 6px;font:14px Arial,sans-serif;color:#58616B">Référence <strong style="font-family:Courier,monospace;color:#1F2933">${esc(ref)}</strong> · reçue le ${esc(new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }))}</p>
        ${urgent ? '<p style="margin:10px 0 0;padding:10px 14px;border-radius:8px;background:#fbeceb;color:#8a1f17;font:700 14px Arial,sans-serif">⚠ Demande marquée URGENTE</p>' : ""}
        ${tel ? `<p style="margin:14px 0 0"><a href="tel:${esc(telLien)}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#B9541F;color:#ffffff;font:700 15px Arial,sans-serif;text-decoration:none">Rappeler ${esc(court(d.nom, 80))} : ${esc(tel)}</a></p>` : ""}
      </td></tr>
      <tr><td style="padding:0 24px 8px;background:#F7F5F0">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${blocs}
          <tr><td style="padding:18px 0 6px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #243746;border-radius:12px;background:#ffffff">
              <tr><td style="padding:14px 18px;font:700 14px Arial,sans-serif;color:#243746;text-transform:uppercase">Suivi par Couvreur Proximité 34</td></tr>
              <tr><td style="padding:0 18px 16px;font:13px/2 Arial,sans-serif;color:#C65D28">Cadre réservé à Couvreur Proximité 34<br><span style="color:#58616B">Date de rappel : ________ &nbsp; Référent : ________ &nbsp; Prochaine étape : ________</span></td></tr>
            </table>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:16px 24px;background:#1F2933;border-radius:0 0 14px 14px;font:12px Arial,sans-serif;color:#D3DCE3">
        Envoyé depuis le site Couvreur Proximité 34 (page ${esc(court(corps.page, 120))}). ${corps.photos && corps.photos.length ? corps.photos.length + " photo(s) en pièce jointe." : "Pas de photo jointe."}<br>
        Le demandeur a accepté d'être recontacté au sujet de cette demande.
      </td></tr>
    </table>
  </td></tr></table></body></html>`;

  const texte =
    `${t.titre} — ${ref}\n${urgent ? "DEMANDE URGENTE\n" : ""}\n` +
    rubriques.map((r) => `== ${r.nom || "Informations"} ==\n` + r.lignes.map((l) => `${l.label} : ${l.valeur || "—"}`).join("\n")).join("\n\n") +
    `\n\nPage : ${court(corps.page, 120)}`;

  return { html: htmlMail, texte, urgent };
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, erreur: "Méthode non autorisée" });
  }

  let corps;
  try {
    corps = await lireCorps(req);
  } catch (e) {
    return res.status(400).json({ ok: false, erreur: "Requête illisible" });
  }

  const t = TYPES[corps.type];
  if (!t) return res.status(400).json({ ok: false, erreur: "Type de demande inconnu" });

  // Robots : champ piège rempli ou formulaire envoyé en moins de 2 secondes. On fait semblant d'accepter.
  if (corps.site_web || (typeof corps.duree === "number" && corps.duree < 2000)) {
    return res.status(200).json({ ok: true, reference: reference(t.code) });
  }

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "?").split(",")[0].trim();
  if (trop(ip)) return res.status(429).json({ ok: false, erreur: "Trop de demandes, réessayez dans quelques minutes" });

  const d = (corps.donnees = corps.donnees && typeof corps.donnees === "object" ? corps.donnees : {});
  const telChiffres = String(d.telephone || "").replace(/[\s.\-()]/g, "");
  if (!court(d.nom, 120) || !/^(?:\+33|0033|0)[1-9]\d{8}$/.test(telChiffres)) {
    return res.status(422).json({ ok: false, erreur: "Nom et téléphone valides nécessaires" });
  }

  const cle = process.env.RESEND_API_KEY;
  const destinataire = process.env.ARVEO_EMAIL_TO;
  if (!cle || !destinataire) {
    console.error("[demande] RESEND_API_KEY ou ARVEO_EMAIL_TO manquant");
    return res.status(503).json({ ok: false, erreur: "Envoi non configuré" });
  }

  const ref = reference(t.code);
  const mail = construireEmail(t, ref, corps);
  const ville = court(d.ville, 60);
  const sujet = `${mail.urgent ? "🔴 URGENT · " : ""}${t.titre}${ville ? " · " + ville : ""} · ${court(d.nom, 60)} · ${ref}`;

  const pieces = (Array.isArray(corps.photos) ? corps.photos : [])
    .slice(0, 4)
    .filter((p) => p && typeof p.contenu === "string" && /^[A-Za-z0-9+/=]+$/.test(p.contenu.slice(0, 200)))
    .map((p, i) => ({ filename: court(p.nom, 80).replace(/[^\w.\-]+/g, "_") || `photo-${i + 1}.jpg`, content: p.contenu }));

  const envoyer = (payload) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

  const expediteur = process.env.ARVEO_EMAIL_FROM || "Site Couvreur Proximité 34 <onboarding@resend.dev>";
  const email = court(d.email, 200);
  const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  try {
    const r = await envoyer({
      from: expediteur,
      to: destinataire.split(",").map((x) => x.trim()),
      subject: sujet,
      html: mail.html,
      text: mail.texte,
      ...(emailValide ? { reply_to: email } : {}),
      ...(pieces.length ? { attachments: pieces } : {}),
    });
    if (!r.ok) {
      console.error("[demande] Resend", r.status, await r.text());
      return res.status(502).json({ ok: false, erreur: "Le service d'envoi a refusé la demande" });
    }
  } catch (e) {
    console.error("[demande] envoi", e);
    return res.status(502).json({ ok: false, erreur: "Service d'envoi injoignable" });
  }

  // Accusé de réception facultatif au demandeur.
  if (process.env.ARVEO_ACCUSE === "1" && emailValide) {
    envoyer({
      from: expediteur,
      to: [email],
      subject: `Couvreur Proximité 34 : nous avons bien reçu votre ${t.titre.toLowerCase()} (${ref})`,
      text: `Bonjour ${court(d.nom, 80)},\n\nNous avons bien reçu votre ${t.titre.toLowerCase()} (référence ${ref}). Nous vous rappelons dans la journée.\n\nPour une urgence, appelez-nous directement.\n\nCouvreur Proximité 34, couvreur à Frontignan`,
    }).catch(() => {});
  }

  return res.status(200).json({ ok: true, reference: ref });
};

module.exports.construireEmail = construireEmail;
