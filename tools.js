/* לשונית כלים: ממיר מטבע, ביטויים בגרמנית, טלפונים חשובים */
(() => {
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const KEY = "berlin2.rate";
let rate = (() => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } })() || { v: 4.0, at: 0, est: true };

async function loadRate() {
  if (!navigator.onLine || Date.now() - rate.at < 6 * 3600e3) return;
  try {
    const r = await fetch("https://api.frankfurter.app/latest?from=EUR&to=ILS"); const j = await r.json();
    if (j.rates && j.rates.ILS) { rate = { v: j.rates.ILS, at: Date.now() }; localStorage.setItem(KEY, JSON.stringify(rate)); render(); }
  } catch {}
}

const PHRASES = [
  ["שלום", "Hallo", "האלו"], ["בוקר טוב", "Guten Morgen", "גוּטֶן מוֹרגֶן"], ["תודה (רבה)", "Danke (schön)", "דַּנקֶה (שֵׁן)"],
  ["בבקשה", "Bitte", "בִּיטֶה"], ["סליחה", "Entschuldigung", "אֶנטשׁוּלדִיגוּנג"], ["כן / לא", "Ja / Nein", "יָא / נַיין"],
  ["להתראות", "Tschüss", "צ'וּס"], ["אני לא מדבר גרמנית", "Ich spreche kein Deutsch", "אִיך שְׁפּרֶכֶה קַיין דּוֹיטשׁ"],
  ["אתה מדבר אנגלית?", "Sprechen Sie Englisch?", "שְׁפּרֶכֶן זִי אֶנגלִישׁ?"], ["כמה זה עולה?", "Wie viel kostet das?", "וִי פִיל קוֹסטֶט דַּאס?"],
  ["איפה השירותים?", "Wo ist die Toilette?", "וֹוּ אִיסט דִּי טוֹאָלֶטֶה?"], ["איפה התחנה?", "Wo ist die Haltestelle?", "וֹוּ אִיסט דִּי הַלטֶשׁטֶלֶה?"],
  ["אחד, בבקשה", "Eins, bitte", "אַיינס, בִּיטֶה"], ["החשבון, בבקשה", "Die Rechnung, bitte", "דִּי רֶכנוּנג, בִּיטֶה"],
  ["טעים מאוד!", "Sehr lecker!", "זֶר לֶקֶר!"], ["חג מולד שמח", "Frohe Weihnachten", "פרוֹאֶה וַייהנַאכטֶן"],
  ["גלוויין לילדים (בלי אלכוהול)", "Kinderpunsch", "קִינדֶרפּוּנשׁ"], ["עזרה!", "Hilfe!", "הִילפֶה!"]
];

function speak(t) {
  try { const u = new SpeechSynthesisUtterance(t); u.lang = "de-DE"; u.rate = .85; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch {}
}

function render() {
  const v = $("#v-tools"); if (!v) return;
  const when = rate.at ? new Date(rate.at).toLocaleDateString("he-IL") : "";
  v.innerHTML = `
  <div class="card tool"><h3>💶 ממיר מטבע</h3>
    <div class="cur"><div><input id="eur" inputmode="decimal" placeholder="0"><div class="muted" style="text-align:center">יורו €</div></div>
      <div style="font-size:22px">⇄</div>
      <div><input id="ils" inputmode="decimal" placeholder="0"><div class="muted" style="text-align:center">שקל ₪</div></div></div>
    <div class="muted" style="margin-top:8px;font-size:13px">1 € = ${rate.v.toFixed(2)} ₪ ${rate.est ? "(הערכה – יתעדכן כשיש קליטה)" : `· שער רשמי מ-${when}`}</div></div>

  <div class="card tool"><h3>🗣️ ביטויים בגרמנית</h3><div class="muted" style="font-size:13px">לוחצים על 🔊 כדי לשמוע איך אומרים</div>
    ${PHRASES.map((p, i) => `<div class="ph"><div><small>${esc(p[0])}</small><b>${esc(p[1])}</b><small>${esc(p[2])}</small></div>
      <button class="btn" data-say="${i}">🔊</button></div>`).join("")}</div>

  <div class="card tool"><h3>🆘 טלפונים חשובים</h3>
    <div class="em"><div class="big">112</div><div style="flex:1">אמבולנס וכיבוי אש<div class="muted" style="font-size:13px">מספר חירום בכל אירופה</div></div><a class="btn gold" href="tel:112">📞</a></div>
    <div class="em"><div class="big">110</div><div style="flex:1">משטרה</div><a class="btn gold" href="tel:110">📞</a></div>
    <div class="em"><div class="big">🇮🇱</div><div style="flex:1">שגרירות ישראל בברלין<div class="muted" style="font-size:13px">Auguste-Viktoria-Straße 74–76</div></div>
      <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Botschaft des Staates Israel Auguste-Viktoria-Straße 74 Berlin")}">📍</a>
      <a class="btn" target="_blank" rel="noopener" href="https://new.embassies.gov.il/berlin">🔗</a></div>
    <div class="em"><div class="big">✉️</div><div style="flex:1">מוקד החירום של משרד החוץ<div class="muted" style="font-size:13px">911@mfa.gov.il</div></div><a class="btn" href="mailto:911@mfa.gov.il">✉️</a></div>
    <div class="muted" style="font-size:12px;margin-top:8px">כדאי לשמור גם את מספר החירום של ביטוח הנסיעות שלכם.</div></div>`;
  const e = $("#eur"), s = $("#ils");
  e.oninput = () => { const x = parseFloat(e.value); s.value = isNaN(x) ? "" : (x * rate.v).toFixed(2); };
  s.oninput = () => { const x = parseFloat(s.value); e.value = isNaN(x) ? "" : (x / rate.v).toFixed(2); };
  v.querySelectorAll("[data-say]").forEach(b => b.onclick = () => speak(PHRASES[+b.dataset.say][1]));
}
render(); loadRate();
addEventListener("online", loadRate);
})();
