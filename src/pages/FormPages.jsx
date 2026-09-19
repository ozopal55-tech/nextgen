/* One premium page per form. Edit the copy in the PAGES object below. */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BRAND, WA, PHONE, PHONE_DISPLAY } from "../config.js";
import { Icon, ICON } from "../components/Icon.jsx";
import { DemoForm, InquiryForm, TutorForm } from "../components/Forms.jsx";

const PAGES = {
  demo: { doc: "Book a Free Demo Class", crumb: "Book demo", h1: "Book your free demo class", sub: "Tell us about your child. We match a verified tutor and arrange a demo at home or online. No payment, no commitment.",
    badges: ["100% free demo", "Reply within hours", "Verified tutors"], Form: DemoForm, wa: "Hello, I need help booking a demo class.",
    side: [
      { t: "steps", h: "What happens after you submit", items: [["We call you", "A counsellor calls within a few hours to confirm details."], ["We shortlist a tutor", "Matched on class, subject, board, area and timing."], ["Free demo class", "Meet the tutor at home or online for one full trial session."], ["You decide", "Continue if you are happy. Not a fit? We change the tutor free."]] },
      { t: "list", h: "What you get", items: ["Background-checked, experienced tutor", "Lessons paced to your child's level", "Flexible timings around school", "Regular progress updates for parents", "Free tutor replacement if needed"] },
      { t: "faq", h: "Quick answers", items: [["Is the demo really free?", "Yes. You pay only if you choose to continue."], ["How soon can the demo happen?", "Usually within 24 to 48 hours."], ["Can I pick online instead of home?", "Yes, choose the mode in the form."]] },
    ] },
  inquiry: { doc: "Ask a Question", crumb: "Ask a question", h1: "Ask us anything", sub: "Fees, timings, boards, safety or subject help. Send your question and a real person will reply on your number.",
    badges: ["Reply within hours", "No spam calls", "9 AM to 8 PM, all days"], Form: InquiryForm, wa: "Hello, I have a question about tuition.",
    side: [
      { t: "cards", h: "Popular questions", items: [["Fees", "Depend on class, subject and mode. Use the fee estimator on the home page for a range."], ["Timings", "Tutors adapt to school hours. Evenings and weekends are most popular."], ["Boards", "CBSE, ICSE and State boards are all covered."], ["Safety", "Every tutor clears ID, qualification and demo checks before assignment."]] },
      { t: "steps", h: "How we respond", items: [["You send your question", "Share your name, number and what you want to know."], ["We reply", "By call or WhatsApp, whichever you prefer, within a few hours."], ["Next step, if you want it", "We can book your free demo right away."]] },
    ] },
  tutor: { doc: "Become a Tutor", crumb: "Become a tutor", h1: "Teach with NextGen Home Tutors", sub: "Get matched with students near you, set your own availability and teach with a team that supports you. Apply in about five minutes.",
    badges: ["Students near you", "Fixed schedules", "Verified and respected"], Form: TutorForm, wa: "Hello, I want to apply as a tutor.",
    side: [
      { t: "cards", h: "Why teach with us", items: [["Students near you", "We match by area, class and subject so travel stays short."], ["Steady schedule", "Regular classes instead of chasing one-off leads."], ["You set your fee", "Tell us your expected rate. We match you with families in that range."], ["Support from our team", "We handle enquiries, scheduling help and parent coordination."]] },
      { t: "list", h: "Who can apply", items: ["Graduate, post-graduate or final-year student", "Strong command of your subjects and classes", "Clear communication and a professional attitude", "Reliable and punctual", "Government photo ID for verification"] },
      { t: "steps", h: "How joining works", items: [["Apply online", "Fill in the form with your subjects, areas and availability."], ["Verification call", "Our team confirms your details, ID and qualifications."], ["Demo evaluation", "A short demo shows us how you teach."], ["Start teaching", "You are matched with students and begin classes."]] },
      { t: "faq", h: "Tutor FAQ", items: [["Is there a joining fee?", "Confirm the exact terms with our team during the verification call."], ["Can I teach online only?", "Yes. Choose Home, Online or Both in the form."], ["How long does verification take?", "Usually 2 to 3 working days."]] },
    ] },
};

function Side({ b }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="sblock">
      <h2>{b.h}</h2>
      {b.t === "steps" && <ol className="tl">{b.items.map(([t, d], i) => <li key={t}><span>{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></li>)}</ol>}
      {b.t === "list" && <ul className="tick-list">{b.items.map((t) => <li key={t}><Icon d={ICON.check} />{t}</li>)}</ul>}
      {b.t === "cards" && <div className="mini">{b.items.map(([t, d]) => <div key={t}><h3>{t}</h3><p>{d}</p></div>)}</div>}
      {b.t === "faq" && <div className="faq">{b.items.map(([q, a], i) => <div key={q} className={"qa" + (open === i ? " open" : "")}><button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{q}<span>+</span></button><div className="ans"><p>{a}</p></div></div>)}</div>}
    </div>
  );
}

function FormPage({ k }) {
  const p = PAGES[k], Form = p.Form;
  useEffect(() => { document.title = `${p.doc} | ${BRAND}`; return () => { document.title = `${BRAND} | Verified Home Tutors in Delhi NCR, Classes 1-12`; }; }, [p]);
  return (
    <>
      <section className="fp-hero"><div className="wrap">
        <p className="crumb"><Link to="/">Home</Link> / {p.crumb}</p>
        <h1>{p.h1}</h1><p className="sub">{p.sub}</p>
        <ul className="badges">{p.badges.map((b) => <li key={b}><Icon d={ICON.check} />{b}</li>)}</ul>
      </div></section>
      <section className="fp-body"><div className="wrap fp-grid">
        <div className="fp-card"><Form /></div>
        <aside className="fp-side">
          {p.side.map((b) => <Side key={b.h} b={b} />)}
          <div className="help"><h3>Prefer to talk?</h3><p>We are available every day, 9 AM to 8 PM.</p>
            <div className="cta"><a className="btn wa" href={WA(p.wa)} target="_blank" rel="noreferrer">WhatsApp us</a><a className="btn ghost" href={"tel:+" + PHONE}>{PHONE_DISPLAY}</a></div></div>
        </aside>
      </div></section>
    </>
  );
}
export const DemoPage = () => <FormPage k="demo" />;
export const InquiryPage = () => <FormPage k="inquiry" />;
export const TutorPage = () => <FormPage k="tutor" />;
