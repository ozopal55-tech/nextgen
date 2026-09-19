/* SAMPLE policy text. Client should review with a legal advisor and edit before going live. */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BRAND, EMAIL, PHONE_DISPLAY } from "../config.js";

const UPDATED = "September 2026";
const DOCS = {
  privacy: { title: "Privacy Policy", intro: `${BRAND} respects your privacy. This page explains what we collect and how we use it.`, s: [
    ["What we collect", "Parent name, phone number, email, student name, class, board, subjects, area and time preferences. For tutors: qualification, experience, availability and any documents shared for verification."],
    ["How we use it", "To match tutors with students, arrange demo classes, contact you about your request, verify tutors and improve our service."],
    ["Who sees it", "Only our team and the matched tutor or family, and only the details needed for classes. We never sell your data or share it with advertisers."],
    ["Children's information", "We collect student details only through a parent or guardian, and only to arrange tuition."],
    ["Storage and security", "Form data is stored in a private spreadsheet with restricted access. Please do not send passwords or payment card details through our forms."],
    ["Your choices", "You can ask us to view, correct or delete your data at any time by writing to us."],
    ["Contact", `Write to ${EMAIL} or call ${PHONE_DISPLAY}.`]] },
  terms: { title: "Terms of Service", intro: `By using this website or booking a class with ${BRAND}, you agree to these terms.`, s: [
    ["Our service", "We connect families with verified tutors for home and online tuition. Tutors teach independently; we handle matching, verification and support."],
    ["Free demo class", "The first demo class is free and carries no obligation to continue."],
    ["Fees and payment", "Monthly fees are agreed before regular classes start. Payments are made as communicated by our team."],
    ["Attendance and rescheduling", "Please give at least 4 hours notice to cancel or reschedule a class. Repeated last-minute cancellations may be charged."],
    ["Tutor replacement", "If the tutor is not a good fit, we will arrange a replacement at no extra cost."],
    ["Conduct", "Parents, students and tutors must behave respectfully. We may end service where safety or conduct is a concern."],
    ["Results", "We work to improve learning outcomes but cannot guarantee specific marks or ranks."],
    ["Changes", "We may update these terms. The latest version is always on this page."]] },
  refund: { title: "Refund Policy", intro: "We want you to feel comfortable trying us. Here is how refunds work.", s: [
    ["Demo class", "The demo class is free, so there is nothing to refund."],
    ["Unused classes", "If you paid in advance and stop, fees for classes not yet taken are refunded, less any discount given for advance payment."],
    ["Classes already taken", "Fees for classes already delivered are not refundable."],
    ["Tutor not suitable", "Tell us within the first 3 classes. We will replace the tutor, or refund the unused portion if you prefer to stop."],
    ["How to request", `Message us on WhatsApp or email ${EMAIL}. Approved refunds are processed within 7 working days.`]] },
};

export default function Legal({ page }) {
  const d = DOCS[page];
  useEffect(() => { document.title = `${d.title} | ${BRAND}`; return () => { document.title = `${BRAND} | Verified Home Tutors in Delhi NCR, Classes 1-12`; }; }, [d]);
  return (
    <section className="sec legal"><div className="wrap narrow">
      <Link to="/" className="back">Back to home</Link>
      <h1>{d.title}</h1><p className="lead">{d.intro} Last updated {UPDATED}.</p>
      {d.s.map(([h, t]) => <div key={h} className="lsec"><h2>{h}</h2><p>{t}</p></div>)}
    </div></section>
  );
}
export const NotFound = () => <section className="sec legal"><div className="wrap narrow"><h1>Page not found</h1><p className="lead">That page does not exist. <Link to="/" className="back">Go to the home page</Link></p></div></section>;
