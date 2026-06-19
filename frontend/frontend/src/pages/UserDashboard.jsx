import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/UserDashboard.css";

import CustomerOverview from "../components/CustomerOverview";
import CustomerBookings from "../components/CustomerBookings";
import CustomerBookForm from "../components/CustomerBookForm";
import CustomerProfile from "../components/CustomerProfile";
import CustomerWallet from "../components/CustomerWallet";
import Footer from "../components/Footer";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
}

const USER_MENU = [
  { key: "overview", label: "Dashboard", icon: "" },
  { key: "bookings", label: "My Bookings", icon: "" },
  { key: "book", label: "Book Service", icon: "" },
  { key: "wallet", label: "Wallet", icon: "" },
  { key: "profile", label: "My Profile", icon: "" }
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const [activePanel, setActivePanel] = useState("overview");
  const [servicesList, setServicesList] = useState([]);

  function fetchServices() {
    axios.get("http://localhost:5000/api/services", getAuthHeaders())
      .then(res => setServicesList(res.data.services || []))
      .catch(err => {
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          localStorage.removeItem("userRole");
          navigate("/login");
        }
      });
  }

  useEffect(() => {
    fetchServices();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/login");
  }

  function renderActivePanel() {
    if (activePanel === "bookings") {
      return <CustomerBookings services={servicesList} />;
    } else if (activePanel === "book") {
      return <CustomerBookForm onServiceAdded={fetchServices} userName={userName} />;
    } else if (activePanel === "wallet") {
      return <CustomerWallet />;
    } else if (activePanel === "profile") {
      return <CustomerProfile />;
    } else {
      return (
        <CustomerOverview
          services={servicesList}
          setActive={setActivePanel}
          userName={userName}
        />
      );
    }
  }

  const panelTitles = {
    overview: "DashBoard",
    bookings: "My Bookings History",
    book: "Book a New Service",
    wallet: "My Wallet",
    profile: "My Profile Settings"
  };

  return (
    <div className="ud-shell">
      <aside className="ud-sidebar">
        <div className="ud-sidebar-logo">
          <div className="ud-sidebar-logo-text">
            Vehicle Hub
            <small>Customer Portal</small>
          </div>
        </div>

        <nav className="ud-sidebar-nav">
          {USER_MENU.map(item => (
            <button
              key={item.key}
              className={`ud-nav-item ${activePanel === item.key ? "active" : ""}`}
              onClick={() => setActivePanel(item.key)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="ud-sidebar-footer">
          <div className="ud-sidebar-user">
            <div className="ud-sidebar-user-info">
              <strong>{userName}</strong>
              <span>Customer</span>
            </div>
          </div>
          <button className="ud-nav-item" style={{ marginTop: 8 }} onClick={handleLogout}>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="ud-main" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <header className="ud-topbar">
          <div>
            <span className="ud-topbar-title">{panelTitles[activePanel]}</span>
          </div>
          <div className="ud-topbar-right">
            <span className="ud-topbar-greeting">
              Welcome, <strong>{userName}</strong>
            </span>
            <span className="ud-online-dot">Online</span>
          </div>
        </header>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {renderActivePanel()}
        </div>

        <Footer />
      </div>
    </div>
  );
}
