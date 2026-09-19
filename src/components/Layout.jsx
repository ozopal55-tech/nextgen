/* Reusable header + footer + floating buttons, wrapped around every page */
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { BRAND, NAV, LEGAL, WA, PHONE, PHONE_DISPLAY, INSTAGRAM, EMAIL } from "../config.js";
import { Icon, ICON } from "./Icon.jsx";

export function Header() {
  const [menu, setMenu] = useState(false);
  return (
    <header className="bar">
      <div className="wrap row">
        <Link to="/" className="logo"><span className="mark">N</span><span><b>NextGen</b><span className="lsub"> Home Tutors</span></span></Link>
        <nav className={menu ? "open" : ""} aria-label="Main">
          {NAV.map(([id, t]) => <Link key={id} to={"/#" + id} onClick={() => setMenu(false)}>{t}</Link>)}
          <Link to="/become-a-tutor" onClick={() => setMenu(false)}>Teach with us</Link>
        </nav>
        <Link to="/book-demo" className="btn sm">Book Free Demo</Link>
        <button className="burger" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}><span /><span /><span /></button>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap fgrid">
        <div>
          <b className="fbrand">{BRAND}</b>
          <p>Verified home and online tutors for classes 1-12 across Delhi NCR. Your child's first class is free.</p>
          <a className="btn sm" href={WA("Hello, I want a free demo class.")} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
        </div>
        <div><h4>Explore</h4>{NAV.map(([id, t]) => <Link key={id} to={"/#" + id}>{t}</Link>)}<Link to="/book-demo">Book a demo</Link><Link to="/inquiry">Ask a question</Link><Link to="/become-a-tutor">Become a tutor</Link></div>
        <div><h4>Legal</h4>{LEGAL.map(([to, t]) => <Link key={to} to={to}>{t}</Link>)}</div>
        <div><h4>Contact</h4><a href={"tel:+" + PHONE}>{PHONE_DISPLAY}</a><a href={"mailto:" + EMAIL}>{EMAIL}</a><a href={INSTAGRAM} target="_blank" rel="noreferrer">@nextgen_hometutors</a><span>Mon-Sun, 9 AM - 8 PM</span></div>
      </div>
      <div className="wrap"><p className="copy">© {new Date().getFullYear()} {BRAND}. All rights reserved.</p></div>
    </footer>
  );
}

export default function Layout() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) { const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 80); return () => clearTimeout(t); }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <a className="fab" href={WA("Hello NextGen Home Tutors, I want a free demo class.")} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 2a8 8 0 11-4.1 14.9l-.4-.2-2.6.7.7-2.5-.3-.4A8 8 0 0112 4zm-3 4c-.3 0-.7.4-.9 1-.2.7 0 1.5.6 2.4 1.1 1.7 2.6 3 4.3 3.6.9.3 1.5.2 1.9-.2.3-.3.4-.8.3-1l-1.6-.8-.7.8c-.3.1-1.7-.7-2.4-1.9l.5-.7-.7-1.6c-.2-.5-.5-.6-.9-.6z" /></svg>
      </a>
      <a className="callbar" href={"tel:+" + PHONE}><Icon d={ICON.phone} />Call Now</a>
    </>
  );
}
