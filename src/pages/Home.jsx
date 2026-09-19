import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { WA } from "../config.js";
import { Icon, ICON } from "../components/Icon.jsx";

/* ===== EDIT ME: business details & placeholder content ===== */
const STATS = [["500+", "Students taught"], ["150+", "Verified tutors"], ["4.8/5", "Parent rating"], ["24-48 hrs", "Average tutor match time"]];
const PROGRAMS = [
  ["Board exam prep", "Class 10 and 12 revision, sample papers and doubt sessions."],
  ["JEE and NEET foundation", "Concept building from Class 8 to 12 for competitive exams."],
  ["Spoken English", "Confidence and fluency for school students."],
  ["Homework and doubt help", "Daily support so younger children never fall behind."],
  ["Olympiad and NTSE", "Maths and Science coaching for high scorers."],
  ["Weak subject rescue", "A focused plan for the one subject your child struggles with."],
];
const PROMISE = [["Free demo first", "Pay nothing until you have seen the tutor teach."], ["Free tutor replacement", "Not a good fit? We change the tutor at no cost."], ["Verified tutors only", "ID, qualification and demo checks on every tutor."]];
const AREAS = ["Faridabad", "Delhi", "Noida", "Gurgaon", "Ghaziabad", "Greater Noida", "Dwarka", "Rohini"];
// Approximate monthly fee (INR) per class group for Home tuition. Online = 80%.
const FEES = { "1-5": [2000, 4000], "6-8": [3000, 5000], "9-10": [4500, 7500], "11-12": [6500, 11000] };
const GROUPS = [
  { g: "1-5", t: "Classes 1-5", s: ["Maths", "EVS", "English", "Hindi"] },
  { g: "6-8", t: "Classes 6-8", s: ["Maths", "Science", "English", "Hindi", "Sanskrit", "SST"] },
  { g: "9-10", t: "Classes 9-10", s: ["Maths", "Science", "English", "SST", "Computer"] },
  { g: "11-12", t: "Classes 11-12", s: ["Physics", "Chemistry", "Biology", "Maths", "Commerce", "Accountancy"] },
];
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
const VERIFY = [["Identity check", "Government photo ID and address verified."], ["Qualification check", "Degrees and subject knowledge confirmed."], ["Demo evaluation", "Teaching skill and communication reviewed live."], ["Parent feedback", "Ongoing ratings keep quality high."]];
const WICONS = [ICON.shield, ICON.book, ICON.home, ICON.check, ICON.star, ICON.phone, ICON.check];

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
const Reveal = ({ children, className = "", style }) => <div ref={useReveal()} style={style} className={"reveal " + className}>{children}</div>;

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
export default function Home() {
  const [open, setOpen] = useState(0), [ri, setRi] = useState(0);
  useEffect(() => { const t = setInterval(() => setRi((i) => (i + 1) % REVIEWS.length), 5500); return () => clearInterval(t); }, []);

  return (
    <>
      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <p className="pill">Home and online tuition, Delhi NCR</p>
            <h1>Verified Home Tutors for Classes <span className="nb">1-12</span> in Delhi NCR</h1>
            <p className="sub">Sit in on a free demo class first. We match your child with a background-checked tutor who fits their school, board and pace.</p>
            <div className="cta">
              <Link to="/book-demo" className="btn big">Book a Free Demo Class</Link>
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

      <section className="stats" aria-label="Highlights"><div className="wrap statgrid">{STATS.map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}</div></section>

      <section id="how" className="sec grey"><div className="wrap">
        <Reveal><h2>How it works</h2><p className="lead">Four simple steps, and the first class is on us.</p></Reveal>
        <ol className="steps">{STEPS.map(([t, d], i) => <li key={t}><Reveal><span className="num">{i + 1}</span><h3>{t}</h3><p>{d}</p></Reveal></li>)}</ol>
      </div></section>

      <section id="classes" className="sec"><div className="wrap">
        <Reveal><h2>Classes and subjects</h2><p className="lead">CBSE, ICSE and State boards. Every subject, every class.</p></Reveal>
        <div className="cards">{GROUPS.map((c) => <Reveal key={c.g} className="card"><h3>{c.t}</h3><div className="chips">{c.s.map((s) => <span className="tag" key={s}>{s}</span>)}</div></Reveal>)}</div>
        <Reveal className="estwrap"><div><h3>Estimate monthly fees</h3><p>Pick a class and mode to see a rough range.</p></div><Estimator /></Reveal>
      </div></section>

      <section id="programs" className="sec grey"><div className="wrap">
        <Reveal><h2>Programs for every goal</h2><p className="lead">Beyond school subjects, we match tutors for the goal your child is working towards.</p></Reveal>
        <div className="cards three">{PROGRAMS.map(([t, d]) => <Reveal key={t} className="card"><span className="ico"><Icon d={ICON.book} /></span><h3>{t}</h3><p className="mut">{d}</p></Reveal>)}</div>
      </div></section>

      <section id="why" className="sec navy"><div className="wrap">
        <Reveal><h2>Why parents choose us</h2></Reveal>
        <div className="why">{WHY.map(([t, d], i) => <Reveal key={t} className="rw" style={{ transitionDelay: i * 70 + "ms" }}><div className="wcard"><span className="wico"><Icon d={WICONS[i % WICONS.length]} /></span><h3>{t}</h3><p>{d}</p></div></Reveal>)}</div>
      </div></section>

      <section className="sec"><div className="wrap">
        <Reveal><h2>How we verify every tutor</h2><p className="lead">No tutor reaches your home without clearing all four.</p></Reveal>
        <div className="verify">{VERIFY.map(([t, d], i) => <Reveal key={t} className="rw" style={{ transitionDelay: i * 90 + "ms" }}><div className="vstep"><span className="vico"><Icon d={ICON.check} /></span><div><h3>{t}</h3><p>{d}</p></div></div></Reveal>)}</div>
        <Reveal className="promise">{PROMISE.map(([t, d]) => <div key={t}><h3>{t}</h3><p>{d}</p></div>)}</Reveal>
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

      <section className="sec band"><div className="wrap bandrow">
        <div><h2>Are you a teacher?</h2><p>Get students near you, fixed schedules and on-time support. Apply in two minutes.</p></div>
        <Link to="/become-a-tutor" className="btn big">Apply as a tutor</Link>
      </div></section>

      <section id="book" className="sec grey"><div className="wrap">
        <Reveal><h2>How can we help you today?</h2><p className="lead">Pick what you need. Each page takes about two minutes.</p></Reveal>
        <div className="cards three">{[["/book-demo", "Book a free demo", "Tell us the class, subjects and area. We match a tutor and set up your free demo.", "Book demo", ICON.book], ["/inquiry", "Ask a question", "Fees, timings, boards or safety. Get a clear answer within a few hours.", "Ask us", ICON.phone], ["/become-a-tutor", "Become a tutor", "Teach students near you with fixed schedules and on-time support.", "Apply now", ICON.star]].map(([to, t, d, c, ic], i) => <Reveal key={to} className="rw" style={{ transitionDelay: i * 90 + "ms" }}><Link to={to} className="pathcard"><span className="ico"><Icon d={ic} /></span><h3>{t}</h3><p className="mut">{d}</p><span className="more">{c}</span></Link></Reveal>)}</div>
      </div></section>

      <section id="faq" className="sec"><div className="wrap narrow">
        <Reveal><h2>Questions parents ask</h2></Reveal>
        <div className="faq">{FAQ.map(([q, a], i) => <div key={q} className={"qa" + (open === i ? " open" : "")}><button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{q}<span>+</span></button><div className="ans"><p>{a}</p></div></div>)}</div>
      </div></section>

      <section className="sec final"><div className="wrap">
        <h2>Your child's first class is free</h2>
        <p>Share your requirement and get a tutor match within 24 to 48 hours.</p>
        <div className="cta center"><Link to="/book-demo" className="btn big">Book a Free Demo Class</Link><a href={WA("Hello, I want a free demo class.")} target="_blank" rel="noreferrer" className="btn big wa">Chat on WhatsApp</a></div>
      </div></section>

      <section id="contact" className="sec navy"><div className="wrap">
        <Reveal><h2>Talk to us</h2></Reveal>
        <div className="contact">
          <a href="tel:+918383045112"><Icon d={ICON.phone} /><span><small>Call</small>083830 45112</span></a>
          <a href={WA("Hello, I need a tutor.")} target="_blank" rel="noreferrer"><Icon d={ICON.home} /><span><small>WhatsApp</small>083830 45112</span></a>
          <a href="https://www.instagram.com/nextgen_hometutors/" target="_blank" rel="noreferrer"><Icon d={ICON.star} /><span><small>Instagram</small>@nextgen_hometutors</span></a>
          <div><Icon d={ICON.shield} /><span><small>Hours</small>Mon-Sun, 9 AM - 8 PM</span></div>
        </div>
      </div></section>
    </>
  );
}
