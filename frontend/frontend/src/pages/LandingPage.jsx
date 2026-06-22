import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const services = [
  {
    title: "General Maintenance",
    desc: "Oil changes, filters, fluid top-ups, and full multi-point inspections.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    title: "Engine Diagnostics",
    desc: "Computerised fault scans and root-cause checks before any part is touched.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h7l-1 8 11-12h-7l1-8z" />
      </svg>
    ),
  },
  {
    title: "Brake Repair",
    desc: "Pad, rotor, and fluid service with a torque-spec photo log on every job.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Battery & Electrical",
    desc: "Load testing, alternator checks, and wiring diagnostics done right.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="11" rx="2" />
        <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    title: "Tyres & Alignment",
    desc: "Balancing, rotation, and precision alignment for an even ride.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 16l1.5-5h13L20 16M6 16v3M18 16v3" />
        <circle cx="7.5" cy="14" r="1.2" />
        <circle cx="16.5" cy="14" r="1.2" />
      </svg>
    ),
  },
  {
    title: "AC & Climate",
    desc: "Regassing, compressor checks, and cabin filter replacement.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9" />
        <path d="M3 12h6M12 3v6" />
      </svg>
    ),
  },
];

const steps = [
  { num: "01", title: "Book online", desc: "Pick your vehicle, the service you need, and a slot that works — done in under a minute." },
  { num: "02", title: "Drop off or schedule pick-up", desc: "Bring it in, or have one of our drivers collect it from your home or office." },
  { num: "03", title: "Track it live", desc: "Every stage — received, diagnosed, in repair, quality check — updates on your dashboard as it happens." },
  { num: "04", title: "Pay & drive", desc: "Review a digital invoice, pay in-app, and your vehicle is ready at the curb." },
];

const testimonials = [
  { quote: "Watching the status move from \u201Cin bay\u201D to \u201Cquality check\u201D while I was at work was honestly such a relief. No calling around.", name: "Aditi Rao", car: "Honda City owner" },
  { quote: "Booked my brake repair in two minutes, dropped the car off, and had a clear invoice before I even picked it up.", name: "Karthik Iyer", car: "Hyundai Creta owner" },
  { quote: "The technician messaged me directly when they found an extra issue, with photos. Felt completely transparent.", name: "Priya Nair", car: "Maruti Baleno owner" },
  { quote: "Pick-up and drop-off saved me a whole afternoon. The live tracker made it feel like I never lost control of the process.", name: "Sanjay Verma", car: "Tata Nexon owner" },
];

export default function LandingPage() {
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Scroll-reveal: replaces the old IntersectionObserver <script> block
  useEffect(() => {
    const els = rootRef.current.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="lp-root" ref={rootRef}>
      <nav className="nav">
        <div className="nav-inner">
          <div className="logo"><span className="logo-mark"></span>Vehicle Hub</div>
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#how">How it works</a>
            <a href="#tracking">Live Tracking</a>
            <a href="#reviews">Reviews</a>
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {isLoggedIn ? (
              <Link to="/dashboard" className="nav-cta">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" style={{ fontSize: "14.5px", color: "var(--text-dim)", fontWeight: 500, transition: "color 0.2s" }} onMouseOver={(e)=>e.target.style.color="var(--text)"} onMouseOut={(e)=>e.target.style.color="var(--text-dim)"}>Log in</Link>
                <Link to="/register" className="nav-cta">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>Premium care for your vehicle, <em>tracked live</em>, online.</h1>
            <p className="sub">
              Book a service in under a minute, drop your keys off, and watch every step
              — diagnostics, repair, quality check — update in real time from your phone.
            </p>
            <div className="hero-ctas">
              <Link className="btn-primary" to={isLoggedIn ? "/dashboard" : "/login"}>Book Your Service →</Link>
              <a className="btn-ghost" href="#how">See how it works</a>
            </div>
            <div className="hero-stats">
              <div className="stat"><b>12,400+</b><span>Vehicles serviced</span></div>
              <div className="stat"><b>4.9 / 5</b><span>Average rating</span></div>
              <div className="stat"><b>38 min</b><span>Avg. live-status update</span></div>
            </div>
          </div>

          <div className="ticket">
            <div className="ticket-head">
              <span><span className="dot"></span>WORK ORDER #AB-2291</span>
              <span>TOYOTA · CAMRY</span>
            </div>
            <div className="ticket-body">
              <div className="ticket-row"><span>Service</span><span>Brake Pad Replacement</span></div>
              <div className="ticket-row"><span>Technician</span><span>R. MEHTA</span></div>
              <div className="ticket-row"><span>Stage</span><span>QUALITY CHECK</span></div>
              <div className="progress-track"><div className="progress-fill"></div></div>
              <div className="ticket-track-labels">
                <span>RECEIVED</span><span>IN BAY</span><span>READY</span>
              </div>
            </div>
            <div className="ticket-foot">
              <span>Est. ready: Today, 5:40 PM</span>
              <span>₹2,450</span>
            </div>
          </div>
        </div>
      </section>

      <section id="services">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow">What we do</div>
            <h2>Every job, handled by certified hands.</h2>
            <p>Pick a service below — each booking comes with transparent pricing and a live status ticket like the one above.</p>
          </div>
          <div className="services-grid">
            {services.map((s) => (
              <div className="card reveal" key={s.title}>
                <div className="icon-box">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <a className="learn" href="#">Learn more →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow">How it works</div>
            <h2>From booking to back on the road.</h2>
            <p>No phone calls, no guessing. Four stages, each one visible to you the whole way through.</p>
          </div>
          <div className="lane">
            <div className="lane-line"></div>
            {steps.map((step) => (
              <div className="lane-step reveal" key={step.num}>
                <div className="lane-num">{step.num}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tracking">
        <div className="wrap">
          <div className="feature reveal">
            <div>
              <div className="eyebrow">Live tracking</div>
              <h2>Never wonder what's happening in the garage again.</h2>
              <p>Follow your vehicle's service status in real time — the same ticket your technician is updating, right on your phone.</p>
              <ul className="feature-list">
                <li><CheckIcon />Stage-by-stage updates, not vague ETAs</li>
                <li><CheckIcon />Photos logged at every inspection point</li>
                <li><CheckIcon />Direct chat with your assigned technician</li>
              </ul>
            </div>
            <div className="device-mock">
              <div className="device-screen">
                <div className="row"><span>AB-2291</span><span className="dot">● LIVE</span></div>
                <div className="status-pill">In repair bay 4</div>
                <div className="mini-row"><span>Vehicle</span><b>Toyota Camry · KA-04</b></div>
                <div className="mini-row"><span>Stage</span><b>Quality check</b></div>
                <div className="mini-row"><span>Technician</span><b>R. Mehta</b></div>
                <div className="mini-row last"><span>Est. ready</span><b>Today, 5:40 PM</b></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow">Trusted by drivers</div>
            <h2>What customers are saying.</h2>
          </div>
          <div className="testi-track">
            {testimonials.map((t) => (
              <div className="testi-card reveal" key={t.name}>
                <div className="stars">★★★★★</div>
                <p>{t.quote}</p>
                <div className="testi-person">
                  <div className="avatar"></div>
                  <div><b>{t.name}</b><span>{t.car}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="book">
        <div className="wrap">
          <div className="final-cta reveal">
            <h2>Ready to give your car the care it deserves?</h2>
            <p>Book your next service in under a minute and track every step from your phone.</p>
            <Link className="btn-primary" to={isLoggedIn ? "/dashboard" : "/login"}>Book Your Service →</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div className="logo"><span className="logo-mark"></span>Vehicle Hub</div>
            <div className="footer-links">
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Contact</a>
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Vehicle Hub Service Management. All rights reserved.</span>
            <span>Made for drivers who'd rather track than wait.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
