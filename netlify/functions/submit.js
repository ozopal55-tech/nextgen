// Netlify Function: receives all 3 forms, validates, forwards to Google Sheet (Apps Script webhook).
// Env var (Netlify > Site settings > Environment): SHEET_WEBHOOK_URL
const TYPES = ["demo", "inquiry", "tutor"];
const json = (statusCode, body) => ({ statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Invalid request" }); }

  if (data.website) return json(200, { ok: true }); // honeypot: bots fill this hidden field
  if (!TYPES.includes(data.type)) return json(400, { error: "Unknown form type" });
  if (!data.name || !/^[6-9]\d{9}$/.test(String(data.phone || "").replace(/\D/g, "").slice(-10)))
    return json(400, { error: "Name and a valid 10-digit phone number are required" });

  const record = { ...data, submittedAt: new Date().toISOString() };
  delete record.website;

  const url = process.env.SHEET_WEBHOOK_URL;
  if (!url) { console.log("SHEET_WEBHOOK_URL not set. Submission:", record); return json(200, { ok: true, demo: true }); }
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(record) });
    if (!res.ok) throw new Error("Sheet responded " + res.status);
    return json(200, { ok: true });
  } catch (e) {
    console.error(e);
    return json(502, { error: "Could not save right now. Please use WhatsApp." });
  }
};
