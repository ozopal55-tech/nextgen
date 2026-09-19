import { useEffect, useRef, useState } from "react";

/* ===== EDIT ME: business details & placeholder content ===== */
const PHONE = "918383045112";
const WA = (t) => `https://wa.me/${PHONE}?text=${encodeURIComponent(t)}`;
const AREAS = ["Faridabad", "Delhi", "Noida", "Gurgaon", "Ghaziabad", "Greater Noida", "Dwarka", "Rohini"];
// Approximate monthly fee (INR) per class group for Home tuition. Online = 80%.
const FEES = { "1-5": [2000, 4000], "6-8": [3000, 5000], "9-10": [4500, 7500], "11-12": [6500, 11000] };
const GROUPS = [
  { g: "1-5", t: "Classes 1-5", s: ["Maths", "EVS", "English", "Hindi"] },
  { g: "6-8", t: "Classes 6-8", s: ["Maths", "Science", "English", "Hindi", "Sanskrit", "SST"] },
  { g: "9-10", t: "Classes 9-10", s: ["Maths", "Science", "English", "SST", "Computer"] },
  { g: "11-12", t: "Classes 11-12", s: ["Physics", "Chemistry", "Biology", "Maths", "Commerce", "Accountancy"] },
];
const SUBJECTS = ["Maths", "Science", "English", "Hindi", "Physics", "Chemistry", "Biology", "Commerce", "Accountancy", "Computer", "Sanskrit", "SST"];
const REVIEWS = [
  { n: "Neha S.", w: "Parent, Faridabad", q: "The tutor matched my son's pace perfectly. His Maths marks went up within two months." },
  { n: "Rohit K.", w: "Parent, Noida", q: "Free demo made the decision easy. Punctual, polite and genuinely qualified tutor." },
  { n: "Anita M.", w: "Parent, Gurgaon", q: "Online classes for my daughter's Class 11 Physics worked really well. Regular progress updates too." },
  { n: "Deepak V.", w: "Parent, Delhi", q: "They replaced the tutor quickly when the timings did not suit us. Very supportive team." },
];
const FAQ = [
  ["How much do tutors cost?", "Fees depend on class, subject and mode. Use the estimator on this page for a range, and we share the exact fee before you confirm."],
  ["Is the demo class really free?", "Yes. You attend a demo, and only continue if you are happy with the tutor."],
  ["Can I change the tutor?", "Yes. If the teaching style does not suit your child, we arrange a replacement at no extra charge."],
  ["Home tuition or online?", "Both. Home tuition suits younger children; online works well for senior classes and busy schedules."],
  ["Are the tutors safe?", "Every tutor passes ID, qualification and demo checks before being assigned to a family."],
  ["How fast will I get a tutor?", "Usually within 24 to 48 hours of sharing your requirement."],
];
const STEPS = [
  ["Share your requirement", "Tell us the class, subject, area and timing."],
  ["We match a verified tutor", "We shortlist the best-fit tutor for your child."],
  ["Attend a free demo", "See the teaching style before you decide."],
  ["Start learning", "Regular classes with progress updates to you."],
];
const WHY = [
  ["Verified tutors", "ID and background checked"], ["Experienced teachers", "Subject specialists"],
  ["Home and online", "Choose what suits you"], ["Free demo class", "No commitment"],
  ["Personal attention", "Lessons paced to your child"], ["Flexible timings", "Fits school schedules"],
  ["Progress updates", "Regular feedback to parents"],
];
const VERIFY = ["Identity check", "Qualification check", "Demo evaluation", "Parent feedback"];
const SLOTS = ["Morning (8-12)", "Afternoon (12-4)", "Evening (4-8)"];

/* ===== small helpers ===== */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return ref;
}
const Reveal = ({ children, className = "" }) => <div ref={useReveal()} className={"reveal " + className}>{children}</div>;
const Icon = ({ d }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
const ICON = { check: "M20 6 9 17l-5-5", shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z", home: "M3 11l9-8 9 8v10H3z", phone: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" };

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

function DemoForm() {
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

function InquiryForm() {
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

function TutorForm() {
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

function Estimator() {
  const [g, setG] = useState("6-8"), [m, setM] = useState("Home");
  const [lo, hi] = FEES[g].map((x) => Math.round((m === "Home" ? x : x * 0.8) / 100) * 100);
  return (
    <div className="est">
      <div className="seg">{Object.keys(FEES).map((k) => <button key={k} className={g === k ? "on" : ""} onClick={() => setG(k)}>Class {k}</button>)}</div>
      <div className="seg">{["Home", "Online"].map((k) => <button key={k} className={m === k ? "on" : ""} onClick={() => setM(k)}>{k}</button>)}</div>
      <p className="range">₹{lo.toLocaleString("en-IN")} - ₹{hi.toLocaleString("en-IN")}<small> / month</small></p>
      <p className="note">Approximate only. Final fee depends on subject, tutor experience and location.</p>
    </div>
  );
}

/* ===== page ===== */
export default function App() {
  const [tab, setTab] = useState("demo"), [open, setOpen] = useState(0), [ri, setRi] = useState(0), [menu, setMenu] = useState(false);
  useEffect(() => { const t = setInterval(() => setRi((i) => (i + 1) % REVIEWS.length), 5500); return () => clearInterval(t); }, []);
  const go = (t) => { setTab(t); setMenu(false); };
  const NAV = [["how", "How it works"], ["classes", "Classes"], ["why", "Why us"], ["areas", "Areas"], ["faq", "FAQ"], ["contact", "Contact"]];

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <header className="bar">
        <div className="wrap row">
          <a href="#top" className="logo"><span className="mark">N</span><b>NextGen</b> Home Tutors</a>
          <nav className={menu ? "open" : ""}>{NAV.map(([id, t]) => <a key={id} href={"#" + id} onClick={() => setMenu(false)}>{t}</a>)}<a href="#tutor" onClick={() => go("tutor")}>Teach with us</a></nav>
          <a href="#book" className="btn sm" onClick={() => go("demo")}>Book Free Demo</a>
          <button className="burger" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}><span /><span /><span /></button>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="wrap hero-grid">
            <div>
              <p className="pill">Home and online tuition, Delhi NCR</p>
              <h1>Verified Home Tutors for Classes 1-12 in Delhi NCR</h1>
              <p className="sub">Sit in on a free demo class first. We match your child with a background-checked tutor who fits their school, board and pace.</p>
              <div className="cta">
                <a href="#book" className="btn big" onClick={() => go("demo")}>Book a Free Demo Class</a>
                <a href={WA("Hello, I want a home tutor. Please share details.")} target="_blank" rel="noreferrer" className="btn big ghost">Chat on WhatsApp</a>
              </div>
              <ul className="trust">{["Verified Tutors", "Home + Online", "Free Demo Class", "Delhi NCR"].map((t) => <li key={t}><Icon d={ICON.check} />{t}</li>)}</ul>
            </div>
            <div className="board" aria-hidden="true">
              <div className="board-top"><span /><span /><span /></div>
              <p className="chalk">Class 9 · Maths</p>
              <p className="eq">x² + 5x + 6 = 0</p>
              <p className="eq sm">(x + 2)(x + 3) = 0</p>
              <p className="eq ans">x = -2, -3</p>
              <div className="match"><i>✓</i><div><b>Tutor matched</b><small>M.Sc Maths · 6 yrs · Sector 21</small></div></div>
            </div>
          </div>
        </section>

        <section id="how" className="sec grey"><div className="wrap">
          <Reveal><h2>How it works</h2><p className="lead">Four simple steps, and the first class is on us.</p></Reveal>
          <ol className="steps">{STEPS.map(([t, d], i) => <li key={t}><Reveal><span className="num">{i + 1}</span><h3>{t}</h3><p>{d}</p></Reveal></li>)}</ol>
        </div></section>

        <section id="classes" className="sec"><div className="wrap">
          <Reveal><h2>Classes and subjects</h2><p className="lead">CBSE, ICSE and State boards. Every subject, every class.</p></Reveal>
          <div className="cards">{GROUPS.map((c) => <Reveal key={c.g} className="card"><h3>{c.t}</h3><div className="chips">{c.s.map((s) => <span className="tag" key={s}>{s}</span>)}</div></Reveal>)}</div>
          <Reveal className="estwrap"><div><h3>Estimate monthly fees</h3><p>Pick a class and mode to see a rough range.</p></div><Estimator /></Reveal>
        </div></section>

        <section id="why" className="sec navy"><div className="wrap">
          <Reveal><h2>Why parents choose us</h2></Reveal>
          <div className="why">{WHY.map(([t, d]) => <Reveal key={t} className="wcard"><Icon d={ICON.shield} /><h3>{t}</h3><p>{d}</p></Reveal>)}</div>
        </div></section>

        <section className="sec"><div className="wrap">
          <Reveal><h2>How we verify every tutor</h2><p className="lead">No tutor reaches your home without clearing all four.</p></Reveal>
          <div className="verify">{VERIFY.map((v) => <Reveal key={v} className="vstep"><Icon d={ICON.check} />{v}</Reveal>)}</div>
        </div></section>

        <section id="areas" className="sec grey"><div className="wrap">
          <Reveal><h2>Where we teach</h2><p className="lead">Home tuition across Delhi NCR. Online classes anywhere in India.</p></Reveal>
          <div className="chips big">{AREAS.map((a) => <span className="tag lg" key={a}>{a}</span>)}</div>
        </div></section>

        <section className="sec"><div className="wrap narrow">
          <Reveal><h2>What parents say</h2></Reveal>
          <figure className="quote" key={ri}><blockquote>“{REVIEWS[ri].q}”</blockquote><figcaption><b>{REVIEWS[ri].n}</b> {REVIEWS[ri].w}</figcaption></figure>
          <div className="dots">{REVIEWS.map((_, i) => <button key={i} aria-label={"Review " + (i + 1)} className={i === ri ? "on" : ""} onClick={() => setRi(i)} />)}</div>
        </div></section>

        <section id="book" className="sec grey"><div className="wrap narrow">
          <Reveal><h2>Get started</h2><p className="lead">Book a demo, ask a question, or apply to teach.</p></Reveal>
          <div className="tabs" role="tablist">
            {[["demo", "Book free demo"], ["inquiry", "Ask a question"], ["tutor", "Become a tutor"]].map(([k, t]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{t}</button>)}
          </div>
          <div className="formcard" id="tutor" role="tabpanel">{tab === "demo" ? <DemoForm /> : tab === "inquiry" ? <InquiryForm /> : <TutorForm />}</div>
        </div></section>

        <section id="faq" className="sec"><div className="wrap narrow">
          <Reveal><h2>Questions parents ask</h2></Reveal>
          <div className="faq">{FAQ.map(([q, a], i) => <div key={q} className={"qa" + (open === i ? " open" : "")}><button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{q}<span>+</span></button><div className="ans"><p>{a}</p></div></div>)}</div>
        </div></section>

        <section id="contact" className="sec navy"><div className="wrap">
          <Reveal><h2>Talk to us</h2></Reveal>
          <div className="contact">
            <a href="tel:+918383045112"><Icon d={ICON.phone} /><span><small>Call</small>083830 45112</span></a>
            <a href={WA("Hello, I need a tutor.")} target="_blank" rel="noreferrer"><Icon d={ICON.home} /><span><small>WhatsApp</small>083830 45112</span></a>
            <a href="https://www.instagram.com/nextgen_hometutors/" target="_blank" rel="noreferrer"><Icon d={ICON.check} /><span><small>Instagram</small>@nextgen_hometutors</span></a>
            <div><Icon d={ICON.shield} /><span><small>Hours</small>Mon-Sun, 9 AM - 8 PM</span></div>
          </div>
        </div></section>
      </main>

      <footer><div className="wrap frow">
        <div><b>NextGen Home Tutors</b><p>Home and online tuition, classes 1-12, Delhi NCR.</p></div>
        <div className="flinks"><a href="#how">How it works</a><a href="#faq">FAQ</a><a href="#privacy">Privacy policy</a><a href="#terms">Terms</a></div>
        <p className="copy">© {new Date().getFullYear()} NextGen Home Tutors</p>
      </div></footer>

      <a className="fab" href={WA("Hello NextGen Home Tutors, I want a free demo class.")} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 2a8 8 0 11-4.1 14.9l-.4-.2-2.6.7.7-2.5-.3-.4A8 8 0 0112 4zm-3 4c-.3 0-.7.4-.9 1-.2.7 0 1.5.6 2.4 1.1 1.7 2.6 3 4.3 3.6.9.300 1.5.2 1.900-.2.300-.3.400-.8.300-1l-1.600-.8-.7.800c-.3.100-1.7-.7-2.400-1.900l.5-.7-.7-1.600c-.2-.5-.5-.6-.9-.6z"/></svg>
      </a>
      <a className="callbar" href="tel:+918383045112"><Icon d={ICON.phone} />Call Now</a>
    </>
  );
}
