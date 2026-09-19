import { useState } from "react";
import { WA } from "../config.js";
import { Icon, ICON } from "./Icon.jsx";

const SUBJECTS = ["Maths", "Science", "English", "Hindi", "Physics", "Chemistry", "Biology", "Commerce", "Accountancy", "Computer", "Sanskrit", "SST"];
const SLOTS = ["Morning (8-12)", "Afternoon (12-4)", "Evening (4-8)"];

async function send(payload) {
  try {
    const r = await fetch("/.netlify/functions/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, error: d.error || "Something went wrong." };
    return { ok: true };
  } catch { return { ok: false, error: "Could not reach the server. Please try WhatsApp." }; }
}

function Field({ label, error, children }) {
  return <label className="field"><span>{label}</span>{children}{error && <em role="alert">{error}</em>}</label>;
}

/* ===== forms ===== */
function useForm(type, init, required) {
  const [v, setV] = useState(init), [err, setErr] = useState({}), [state, setState] = useState("idle"), [srv, setSrv] = useState("");
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target ? e.target.value : e }));
  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    required.forEach((k) => { if (!String(v[k] || "").trim() || (Array.isArray(v[k]) && !v[k].length)) er[k] = "Required"; });
    if (v.phone && !/^[6-9]\d{9}$/.test(v.phone.replace(/\D/g, "").slice(-10))) er.phone = "Enter a valid 10-digit mobile number";
    if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) er.email = "Enter a valid email";
    setErr(er); if (Object.keys(er).length) return;
    setState("sending");
    const r = await send({ type, ...v });
    if (r.ok) setState("done"); else { setSrv(r.error); setState("idle"); }
  };
  return { v, set, err, state, srv, submit, reset: () => { setV(init); setState("idle"); } };
}

const Consent = () => <p className="privacy">We use these details only to match tutors and contact you. We never sell or share your data.</p>;
const Honeypot = ({ set }) => <input className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" name="website" onChange={set("website")} />;

export function DemoForm() {
  const f = useForm("demo", { name: "", phone: "", email: "", student: "", cls: "", board: "CBSE", subjects: [], mode: "Home", area: "", slot: SLOTS[2], budget: "", message: "" },
    ["name", "phone", "student", "cls", "subjects", "area"]);
  const toggle = (s) => f.set("subjects")(f.v.subjects.includes(s) ? f.v.subjects.filter((x) => x !== s) : [...f.v.subjects, s]);
  if (f.state === "done") {
    const msg = `Hello NextGen Home Tutors, I just requested a free demo.\nParent: ${f.v.name}\nStudent: ${f.v.student} (Class ${f.v.cls}, ${f.v.board})\nSubjects: ${f.v.subjects.join(", ")}\nMode: ${f.v.mode}\nArea: ${f.v.area}\nTime: ${f.v.slot}`;
    return <div className="thanks"><div className="tick"><Icon d={ICON.check} /></div><h3>Thank you, {f.v.name.split(" ")[0]}!</h3><p>Your free demo request is in. We will call you within a few hours.</p>
      <a className="btn wa" href={WA(msg)} target="_blank" rel="noreferrer">Continue on WhatsApp</a><button className="link" onClick={f.reset}>Submit another request</button></div>;
  }
  return (
    <form onSubmit={f.submit} noValidate className="grid">
      <Honeypot set={f.set} />
      <Field label="Parent name" error={f.err.name}><input value={f.v.name} onChange={f.set("name")} autoComplete="name" /></Field>
      <Field label="Mobile number" error={f.err.phone}><input inputMode="numeric" placeholder="10-digit number" value={f.v.phone} onChange={f.set("phone")} autoComplete="tel" /></Field>
      <Field label="Email (optional)" error={f.err.email}><input type="email" value={f.v.email} onChange={f.set("email")} /></Field>
      <Field label="Student name" error={f.err.student}><input value={f.v.student} onChange={f.set("student")} /></Field>
      <Field label="Class" error={f.err.cls}><select value={f.v.cls} onChange={f.set("cls")}><option value="">Select</option>{[...Array(12)].map((_, i) => <option key={i} value={i + 1}>Class {i + 1}</option>)}</select></Field>
      <Field label="Board"><select value={f.v.board} onChange={f.set("board")}>{["CBSE", "ICSE", "State board", "Other"].map((b) => <option key={b}>{b}</option>)}</select></Field>
      <div className="full"><span className="lbl">Subjects needed</span><div className="chips">{SUBJECTS.map((s) => <button type="button" key={s} aria-pressed={f.v.subjects.includes(s)} className={"chip" + (f.v.subjects.includes(s) ? " on" : "")} onClick={() => toggle(s)}>{s}</button>)}</div>{f.err.subjects && <em role="alert" className="e">Pick at least one subject</em>}</div>
      <div className="full"><span className="lbl">Mode</span><div className="seg">{["Home", "Online"].map((m) => <button type="button" key={m} className={f.v.mode === m ? "on" : ""} onClick={() => f.set("mode")(m)}>{m} tuition</button>)}</div></div>
      <Field label="Area / locality" error={f.err.area}><input placeholder="e.g. Sector 15, Faridabad" value={f.v.area} onChange={f.set("area")} /></Field>
      <Field label="Preferred time"><select value={f.v.slot} onChange={f.set("slot")}>{SLOTS.map((s) => <option key={s}>{s}</option>)}</select></Field>
      <Field label="Monthly budget (optional)"><input placeholder="e.g. 4000" value={f.v.budget} onChange={f.set("budget")} /></Field>
      <Field label="Anything else? (optional)"><input value={f.v.message} onChange={f.set("message")} /></Field>
      <div className="full">{f.srv && <p className="srv" role="alert">{f.srv}</p>}<button className="btn big" disabled={f.state === "sending"}>{f.state === "sending" ? "Sending..." : "Book my free demo"}</button><Consent /></div>
    </form>
  );
}

export function InquiryForm() {
  const f = useForm("inquiry", { name: "", phone: "", question: "" }, ["name", "phone", "question"]);
  if (f.state === "done") return <div className="thanks"><div className="tick"><Icon d={ICON.check} /></div><h3>Question received</h3><p>We will reply on your number shortly.</p><button className="link" onClick={f.reset}>Ask another question</button></div>;
  return (
    <form onSubmit={f.submit} noValidate className="grid">
      <Honeypot set={f.set} />
      <Field label="Your name" error={f.err.name}><input value={f.v.name} onChange={f.set("name")} /></Field>
      <Field label="Mobile number" error={f.err.phone}><input inputMode="numeric" value={f.v.phone} onChange={f.set("phone")} /></Field>
      <div className="full"><Field label="Your question" error={f.err.question}><textarea rows="4" value={f.v.question} onChange={f.set("question")} /></Field></div>
      <div className="full">{f.srv && <p className="srv" role="alert">{f.srv}</p>}<button className="btn big" disabled={f.state === "sending"}>{f.state === "sending" ? "Sending..." : "Send question"}</button><Consent /></div>
    </form>
  );
}

export function TutorForm() {
  const f = useForm("tutor", { name: "", phone: "", email: "", gender: "", city: "", areas: "", qualification: "", college: "", experience: "", classes: "", subjects: "", boards: "", mode: "Home", availability: "", fee: "", bio: "", cvLink: "", consent: false },
    ["name", "phone", "email", "qualification", "areas", "subjects", "consent"]);
  if (f.state === "done") return <div className="thanks"><div className="tick"><Icon d={ICON.check} /></div><h3>Application received</h3><p>Our team will call you for verification. Keep your ID and certificates ready.</p><button className="link" onClick={f.reset}>Submit another</button></div>;
  const T = (k, label, ph = "") => <Field label={label} error={f.err[k]}><input placeholder={ph} value={f.v[k]} onChange={f.set(k)} /></Field>;
  return (
    <form onSubmit={f.submit} noValidate className="grid">
      <Honeypot set={f.set} />
      {T("name", "Full name")}{T("phone", "Mobile number", "10-digit number")}{T("email", "Email")}
      <Field label="Gender"><select value={f.v.gender} onChange={f.set("gender")}><option value="">Prefer not to say</option><option>Female</option><option>Male</option><option>Other</option></select></Field>
      {T("city", "City", "e.g. Faridabad")}{T("areas", "Areas you can travel to", "e.g. Sector 21, NIT")}
      {T("qualification", "Highest qualification", "e.g. B.Sc, M.A, B.Tech")}{T("college", "College / university")}
      {T("experience", "Years of experience")}{T("classes", "Classes you teach", "e.g. 6 to 10")}
      {T("subjects", "Subjects", "e.g. Maths, Science")}{T("boards", "Boards", "CBSE, ICSE...")}
      <div className="full"><span className="lbl">Mode</span><div className="seg">{["Home", "Online", "Both"].map((m) => <button type="button" key={m} className={f.v.mode === m ? "on" : ""} onClick={() => f.set("mode")(m)}>{m}</button>)}</div></div>
      {T("availability", "Available days and time", "e.g. Mon-Sat, 4-8 PM")}{T("fee", "Expected fee per hour (INR)")}
      <div className="full"><Field label="Short bio"><textarea rows="3" value={f.v.bio} onChange={f.set("bio")} /></Field></div>
      <div className="full">{T("cvLink", "CV / ID link (Google Drive, optional)")}</div>
      <label className="full check"><input type="checkbox" checked={f.v.consent} onChange={(e) => f.set("consent")(e.target.checked)} /> I agree to identity and qualification verification.</label>
      {f.err.consent && <em className="e full" role="alert">Consent is required to apply</em>}
      <div className="full">{f.srv && <p className="srv" role="alert">{f.srv}</p>}<button className="btn big" disabled={f.state === "sending"}>{f.state === "sending" ? "Sending..." : "Apply as tutor"}</button><Consent /></div>
    </form>
  );
}

