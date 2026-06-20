import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

// Premium Inline SVGs for SaaS blueprint
const WrenchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ActivityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const HistoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <polyline points="3 3 3 8 8 8"/>
    <line x1="12" y1="7" x2="12" y2="12"/>
    <line x1="12" y1="12" x2="16" y2="14"/>
  </svg>
);

const BarChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"/>
    <polyline points="7 7 17 7 17 17"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.12
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => {
        try {
          observer.unobserve(el);
        } catch (e) {
          // ignore
        }
      });
    };
  }, []);

  const handleNavigateToAuth = (path = "/register") => {
    navigate(path);
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="saas-landing">
      {/* Navigation Header */}
      <header className={`saas-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="saas-container saas-nav">
          <a href="#" className="saas-logo">
            <div className="saas-logo-icon">
              <WrenchIcon />
            </div>
            <span>Vehicle Hub</span>
          </a>

          <ul className="saas-nav-links">
            <li className="saas-nav-link">
              <a href="#features" onClick={(e) => scrollToSection(e, "features")}>Features</a>
            </li>
            <li className="saas-nav-link">
              <a href="#dashboard" onClick={(e) => scrollToSection(e, "dashboard")}>Dashboard Preview</a>
            </li>
            <li className="saas-nav-link">
              <a href="#why-choose-us" onClick={(e) => scrollToSection(e, "why-choose-us")}>Why Choose Us</a>
            </li>
            <li className="saas-nav-link">
              <a href="#testimonials" onClick={(e) => scrollToSection(e, "testimonials")}>Testimonials</a>
            </li>
          </ul>

          <div className="saas-nav-actions">
            <button className="saas-btn-text" onClick={() => handleNavigateToAuth("/login")}>
              Log In
            </button>
            <button className="saas-btn-primary small" onClick={() => handleNavigateToAuth("/register")}>
              Get Started
            </button>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <MenuIcon />
          </button>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="saas-container hero-grid">
          <div className="hero-content reveal reveal-left">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              SaaS Workshop Management
            </div>
            <h1 className="hero-title">
              Smart Vehicle Service <br />
              <span>Management System</span>
            </h1>
            <p className="hero-desc">
              Manage vehicle services, track maintenance, schedule repairs, and streamline workshop operations effortlessly with our premium SaaS platform.
            </p>
            <div className="hero-actions">
              <button className="saas-btn-primary" onClick={() => handleNavigateToAuth("/register")}>
                Get Started
                <ArrowUpRightIcon />
              </button>
              <button className="saas-btn-secondary" onClick={() => handleNavigateToAuth("/login")}>
                Log In
              </button>
            </div>
          </div>

          {/* Premium Vector garage style SVG representing cars, mechanics, and analytics */}
          <div className="hero-illustration reveal reveal-right">
            <svg className="illustration-img" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Grid Background */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(37, 99, 235, 0.04)" strokeWidth="1"/>
                </pattern>
                <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Backglow Glows */}
              <circle cx="250" cy="250" r="160" fill="rgba(37, 99, 235, 0.06)" filter="blur(20px)" />
              <circle cx="380" cy="180" r="100" fill="rgba(6, 182, 212, 0.05)" filter="blur(15px)" />
              
              {/* Mock Dashboard Widget (Right) */}
              <rect x="260" y="80" width="200" height="150" rx="16" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <circle cx="290" cy="110" r="12" fill="url(#blueGrad)" />
              <rect x="312" y="104" width="80" height="12" rx="4" fill="#64748b" />
              {/* Mini Chart */}
              <line x1="280" y1="200" x2="440" y2="200" stroke="#475569" strokeWidth="2" />
              <rect x="295" y="160" width="16" height="40" rx="2" fill="#3b82f6" />
              <rect x="325" y="140" width="16" height="60" rx="2" fill="#10b981" />
              <rect x="355" y="125" width="16" height="75" rx="2" fill="#6366f1" />
              <rect x="385" y="150" width="16" height="50" rx="2" fill="#f59e0b" />
              <rect x="415" y="170" width="16" height="30" rx="2" fill="#ef4444" />

              {/* Modern sports car outline/silhouette */}
              <g transform="translate(60, 200)">
                {/* Wheels Background shadow */}
                <ellipse cx="100" cy="140" rx="35" ry="35" fill="rgba(0,0,0,0.15)" />
                <ellipse cx="280" cy="140" rx="35" ry="35" fill="rgba(0,0,0,0.15)" />
                
                {/* Car Base Body */}
                <path d="M20 110 C20 100, 40 90, 80 90 L120 90 C150 50, 200 40, 260 40 C320 40, 340 70, 360 90 L390 100 C410 105, 420 115, 420 125 L420 140 C420 145, 410 150, 400 150 L370 150 C360 130, 340 120, 320 120 C300 120, 280 130, 270 150 L110 150 C100 130, 80 120, 60 120 C40 120, 20 130, 10 150 L0 150 L0 125 C0 115, 10 110, 20 110 Z" fill="url(#blueGrad)" />
                
                {/* Car Windows */}
                <path d="M130 90 L155 60 C170 50, 200 50, 245 50 L250 50 L250 90 Z" fill="#f8fafc" opacity="0.8" />
                <path d="M260 90 L260 50 C290 50, 310 60, 325 75 L335 90 Z" fill="#f8fafc" opacity="0.8" />
                
                {/* Car Wheels */}
                <circle cx="60" cy="140" r="28" fill="#1e293b" stroke="#64748b" strokeWidth="6" />
                <circle cx="60" cy="140" r="12" fill="#cbd5e1" />
                <circle cx="320" cy="140" r="28" fill="#1e293b" stroke="#64748b" strokeWidth="6" />
                <circle cx="320" cy="140" r="12" fill="#cbd5e1" />

                {/* Headlights */}
                <path d="M410 115 L420 115 L420 125 L415 125 Z" fill="#f59e0b" />
              </g>

              {/* Mock Mechanic Gear Widget (Left) */}
              <g transform="translate(60, 60)" className="float-gear">
                <rect x="0" y="0" width="130" height="90" rx="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                <circle cx="45" cy="45" r="20" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="8 4" />
                <circle cx="45" cy="45" r="8" fill="#2563eb" />
                <rect x="75" y="32" width="40" height="8" rx="2" fill="#94a3b8" />
                <rect x="75" y="46" width="30" height="8" rx="2" fill="#cbd5e1" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section id="features" className="features-section">
        <div className="saas-container">
          <div className="section-head reveal reveal-up">
            <span className="section-subtitle">Core Platform Capabilities</span>
            <h2 className="section-title">Automate every facet of your service flow</h2>
            <p className="section-desc">Enterprise-grade utilities mapped into an intuitive, responsive dashboard interface.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card reveal reveal-up" style={{ transitionDelay: "50ms" }}>
              <div className="feature-icon"><CalendarIcon /></div>
              <h3>Service Booking</h3>
              <p>Let customers book service slots online natively. Automated load-balancing prevents workshop overbooking.</p>
            </div>

            <div className="feature-card reveal reveal-up" style={{ transitionDelay: "100ms" }}>
              <div className="feature-icon"><ActivityIcon /></div>
              <h3>Vehicle Tracking</h3>
              <p>Track repairs in real time. Notify users as vehicles transition from diagnostics to active servicing and final wash bays.</p>
            </div>

            <div className="feature-card reveal reveal-up" style={{ transitionDelay: "150ms" }}>
              <div className="feature-icon"><UsersIcon /></div>
              <h3>Customer Management</h3>
              <p>Track owner details, maintenance histories, and feedback logs within unified customer profiles.</p>
            </div>

            <div className="feature-card reveal reveal-up" style={{ transitionDelay: "200ms" }}>
              <div className="feature-icon"><HistoryIcon /></div>
              <h3>Service History</h3>
              <p>Store full documentation for every repair. Maintain immutable logs of parts replaced, mechanic notes, and final costs.</p>
            </div>

            <div className="feature-card reveal reveal-up" style={{ transitionDelay: "250ms" }}>
              <div className="feature-icon"><BarChartIcon /></div>
              <h3>Dashboard Analytics</h3>
              <p>Monitor revenue generation, service volumes, pending queues, and staff allocation stats in real-time.</p>
            </div>

            <div className="feature-card reveal reveal-up" style={{ transitionDelay: "300ms" }}>
              <div className="feature-icon"><BellIcon /></div>
              <h3>Real-Time Updates</h3>
              <p>Push critical notification alerts to mechanics and car owners. Minimize delays and maximize transparency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dashboard Preview Section */}
      <section id="dashboard" className="dashboard-preview-section">
        <div className="saas-container">
          <div className="section-head reveal reveal-up">
            <span className="section-subtitle">Real-Time Insights</span>
            <h2 className="section-title">Powerful Admin Dashboard</h2>
            <p className="section-desc">Get a bird's-eye view of your entire workshop operation and financial growth.</p>
          </div>

          <div className="preview-mockup-wrapper reveal reveal-up">
            <div className="mockup-header">
              <div className="mockup-window-controls">
                <span className="window-dot red"></span>
                <span className="window-dot yellow"></span>
                <span className="window-dot green"></span>
              </div>
              <div className="mockup-title">admin_dashboard_v2.0.sh</div>
              <div style={{ width: 48 }}></div>
            </div>

            {/* Mockup Stats Row */}
            <div className="mockup-stats-grid">
              <div className="mockup-stat-card">
                <div className="mockup-stat-head">
                  <span>Total Services</span>
                  <ActivityIcon />
                </div>
                <div className="mockup-stat-num">1,248</div>
                <span className="mockup-stat-trend green">+12.4% this month</span>
              </div>

              <div className="mockup-stat-card">
                <div className="mockup-stat-head">
                  <span>Pending Services</span>
                  <ClockIcon />
                </div>
                <div className="mockup-stat-num">18</div>
                <span className="mockup-stat-trend yellow">Priority assignment required</span>
              </div>

              <div className="mockup-stat-card">
                <div className="mockup-stat-head">
                  <span>Completed Services</span>
                  <CheckIcon />
                </div>
                <div className="mockup-stat-num">1,230</div>
                <span className="mockup-stat-trend green">98.5% resolution rate</span>
              </div>

              <div className="mockup-stat-card">
                <div className="mockup-stat-head">
                  <span>Revenue Generated</span>
                  <span>₹</span>
                </div>
                <div className="mockup-stat-num">₹4,82,500</div>
                <span className="mockup-stat-trend green">+18.2% vs Q1 average</span>
              </div>
            </div>

            {/* Mockup split panels */}
            <div className="mockup-body-grid">
              {/* Left Panel: Active Services table */}
              <div className="mockup-panel">
                <h4>Active Service Queue</h4>
                <table className="mockup-table">
                  <thead>
                    <tr>
                      <th>Vehicle Number</th>
                      <th>Service Type</th>
                      <th>Owner Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>AP39AB1234</td>
                      <td>Full Annual Service</td>
                      <td>Ram Kumar</td>
                      <td><span className="mockup-badge progress">In Progress</span></td>
                    </tr>
                    <tr>
                      <td>KA03HA9876</td>
                      <td>Brake Pad Replacement</td>
                      <td>John Doe</td>
                      <td><span className="mockup-badge pending">Pending</span></td>
                    </tr>
                    <tr>
                      <td>DL01MA4321</td>
                      <td>Engine Tuning & Oil Change</td>
                      <td>Siddharth Sen</td>
                      <td><span className="mockup-badge completed">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Right Panel: Monthly Performance bar chart */}
              <div className="mockup-panel">
                <h4>Monthly Volume Performance</h4>
                <div className="chart-container">
                  <div className="chart-bars">
                    <div className="chart-bar-group">
                      <div className="chart-bar" style={{ height: "45px" }}></div>
                      <span className="chart-label">Jan</span>
                    </div>
                    <div className="chart-bar-group">
                      <div className="chart-bar accent" style={{ height: "65px" }}></div>
                      <span className="chart-label">Feb</span>
                    </div>
                    <div className="chart-bar-group">
                      <div className="chart-bar" style={{ height: "95px" }}></div>
                      <span className="chart-label">Mar</span>
                    </div>
                    <div className="chart-bar-group">
                      <div className="chart-bar accent" style={{ height: "80px" }}></div>
                      <span className="chart-label">Apr</span>
                    </div>
                    <div className="chart-bar-group">
                      <div className="chart-bar" style={{ height: "115px" }}></div>
                      <span className="chart-label">May</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section id="why-choose-us" className="why-us-section">
        <div className="saas-container why-us-grid">
          {/* Left Visual: SVG combining trust & mechanics graphics */}
          <div className="why-us-visual reveal reveal-left">
            <svg width="400" height="350" viewBox="0 0 400 350" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="360" height="310" rx="16" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
              
              {/* Concentric circles representing security / speed */}
              <circle cx="200" cy="160" r="80" fill="rgba(37, 99, 235, 0.05)" />
              <circle cx="200" cy="160" r="50" fill="rgba(37, 99, 235, 0.1)" />
              
              {/* Check Shield Graphic */}
              <g transform="translate(170, 130)">
                <path d="M30 0 L60 10 L60 35 C60 55, 30 70, 30 70 C30 70, 0 55, 0 35 L0 10 Z" fill="#2563eb" />
                <path d="M18 35 L26 43 L42 27" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              {/* Pulsing rings */}
              <circle cx="200" cy="160" r="110" stroke="rgba(37, 99, 235, 0.1)" strokeWidth="2" strokeDasharray="6 6" />
            </svg>
          </div>

          <div className="why-us-content reveal reveal-right">
            <span className="section-subtitle">Operational Excellence</span>
            <h2 className="section-title">Engineered for modern service workshops</h2>
            <p className="hero-desc" style={{ marginBottom: "30px" }}>
              Our platform offers a specialized toolkit tailored to optimize auto mechanics' efficiency and maintain absolute transparency with your car clients.
            </p>

            <div className="saas-why-us-list">
              <div className="why-us-item">
                <div className="why-us-bullet"><CheckIcon /></div>
                <div className="why-us-item-text">
                  <h4>Fast Service Tracking</h4>
                  <p>Update repair status milestones instantly in a single click, keeping owners aligned.</p>
                </div>
              </div>

              <div className="why-us-item" style={{ marginTop: 20 }}>
                <div className="why-us-bullet"><CheckIcon /></div>
                <div className="why-us-item-text">
                  <h4>Secure Authentication</h4>
                  <p>JWT-driven secure login credentials protect sensitive diagnostic and wallet logs.</p>
                </div>
              </div>

              <div className="why-us-item" style={{ marginTop: 20 }}>
                <div className="why-us-bullet"><CheckIcon /></div>
                <div className="why-us-item-text">
                  <h4>Easy Management</h4>
                  <p>An intuitive interface that requires zero learning curve for workshop attendants and customers.</p>
                </div>
              </div>

              <div className="why-us-item" style={{ marginTop: 20 }}>
                <div className="why-us-bullet"><CheckIcon /></div>
                <div className="why-us-item-text">
                  <h4>Responsive Design</h4>
                  <p>Accurate presentation and layout optimization across mobiles, iPads, and large TV displays.</p>
                </div>
              </div>

              <div className="why-us-item" style={{ marginTop: 20 }}>
                <div className="why-us-bullet"><CheckIcon /></div>
                <div className="why-us-item-text">
                  <h4>Real-Time Notifications</h4>
                  <p>Never miss repair updates. Get automated warnings when statuses are changed or costs populated.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="saas-container">
          <div className="section-head reveal reveal-up">
            <span className="section-subtitle">User Feedback</span>
            <h2 className="section-title">Validated by auto service leaders</h2>
            <p className="section-desc">Hear how workshop mechanics and drivers have simplified their service trackers.</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card reveal reveal-left">
              <p className="testimonial-text">
                "AutoSuite completely resolved our garage scheduling blockages. We can delegate service vehicles and track diagnostics in real-time. Our customers love the transparent notifications!"
              </p>
              <div className="testimonial-user">
                <div className="testimonial-avatar">JD</div>
                <div className="testimonial-info">
                  <h4>Jaydev Deshmukh</h4>
                  <span>Director, Apex Motors</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card reveal reveal-up">
              <p className="testimonial-text">
                "Checking my car's service history and monthly expenditure is incredibly simple. I don't have to keep physical paper receipts in my glovebox anymore."
              </p>
              <div className="testimonial-user">
                <div className="testimonial-avatar">PM</div>
                <div className="testimonial-info">
                  <h4>Pooja Mehta</h4>
                  <span>Subaru Outback Driver</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card reveal reveal-right">
              <p className="testimonial-text">
                "Our mechanic productivity spiked by 35% after integrating this system. No more verbal task assignments—everything is scheduled and documented clearly."
              </p>
              <div className="testimonial-user">
                <div className="testimonial-avatar">RK</div>
                <div className="testimonial-info">
                  <h4>Rajesh Kolar</h4>
                  <span>Manager, AutoCare Hub</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call To Action Section */}
      <section className="cta-section">
        <div className="cta-glow"></div>
        <div className="saas-container cta-content reveal reveal-up">
          <h2>Transform Your Vehicle Service Operations Today</h2>
          <p>Join thousands of workshop owners and drivers experiencing streamlined car service booking and operations management.</p>
          <div className="cta-buttons">
            <button className="saas-btn-primary" onClick={() => handleNavigateToAuth("/register")}>
              Register Now
              <ArrowUpRightIcon />
            </button>
            <button className="saas-btn-secondary" onClick={() => handleNavigateToAuth("/login")}>
              Explore Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="saas-footer">
        <div className="saas-container footer-grid">
          <div className="footer-brand">
            <a href="#" className="saas-logo footer-logo">
              <div className="saas-logo-icon">
                <WrenchIcon />
              </div>
              <span>AutoSuite</span>
            </a>
            <p>Smart SaaS platform engineered to optimize automobile diagnostics, scheduling, and billing tracker operations.</p>
          </div>

          <div className="footer-col">
            <h5>Product</h5>
            <ul>
              <li><a href="#features" onClick={(e) => scrollToSection(e, "features")}>System Features</a></li>
              <li><a href="#dashboard" onClick={(e) => scrollToSection(e, "dashboard")}>Dashboard Mock</a></li>
              <li><a href="#why-choose-us" onClick={(e) => scrollToSection(e, "why-choose-us")}>Why Choose Us</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="#" onClick={() => handleNavigateToAuth("/login")}>Log In Portal</a></li>
              <li><a href="#" onClick={() => handleNavigateToAuth("/register")}>Sign Up Portal</a></li>
              <li><a href="#">Support Hub</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Contact Us</h5>
            <ul className="footer-contact">
              <li>info@autosuite.io</li>
              <li>+91 (80) 4928-1002</li>
              <li>Bengaluru, Karnataka, India</li>
            </ul>
          </div>
        </div>

        <div className="saas-container footer-bottom">
          <p>&copy; {new Date().getFullYear()} AutoSuite. All rights reserved.</p>
          <div className="footer-socials">
            <a href="#" className="footer-social-link">Twitter</a>
            <a href="#" className="footer-social-link">LinkedIn</a>
            <a href="#" className="footer-social-link">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
