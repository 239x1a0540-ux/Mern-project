import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

import AdminOverview from "../components/AdminOverview";
import ManageServices from "../components/ManageServices";
import VehiclesList from "../components/VehiclesList";
import CreateService from "../components/CreateService";
import ReportsOverview from "../components/ReportsOverview";
import Footer from "../components/Footer";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
}

const NAVIGATION_MENU = [
  { key: "dashboard", label: "Dashboard", icon: <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
  { key: "services", label: "All Services", icon: <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
  { key: "vehicles", label: "Vehicles", icon: <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> },
  { key: "add", label: "Add Service", icon: <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg> },
  { key: "reports", label: "Reports", icon: <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Admin User";
  const [activePanel, setActivePanel] = useState("dashboard");
  const [servicesList, setServicesList] = useState([]);

  function fetchServices() {
    axios.get("http://localhost:5000/api/services", getAuthHeaders())
      .then(res => {
        setServicesList(res.data.services || []);
      })
      .catch(err => {
        console.error("Fetch services failed:", err);
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          navigate("/login");
        }
      });
  }

  async function updateServiceStatus(id, newStatus) {
    try {
      await axios.put(`http://localhost:5000/api/services/${id}/status`, {
        status: newStatus
      }, getAuthHeaders());
      fetchServices();
    } catch (err) {
      console.error("Update status failed:", err);
      alert("Error: " + (err?.response?.data?.message || "Failed to update service status"));
    }
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
    if (activePanel === "services") {
      return <ManageServices services={servicesList} onUpdateStatus={updateServiceStatus} />;
    } else if (activePanel === "vehicles") {
      return <VehiclesList services={servicesList} />;
    } else if (activePanel === "add") {
      return <CreateService onServiceAdded={fetchServices} />;
    } else if (activePanel === "reports") {
      return <ReportsOverview services={servicesList} />;
    } else {
      return (
        <AdminOverview
          setActive={setActivePanel}
          services={servicesList}
          onUpdateStatus={updateServiceStatus}
        />
      );
    }
  }

  const panelTitles = {
    dashboard: "Dashboard Overview",
    services: "All Services",
    vehicles: "Registered Vehicles",
    add: "Add Service Booking",
    reports: "Reports & Logs"
  };

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div className="sidebar-logo-text">
            Vehicle Hub
            <small>Admin Portal</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAVIGATION_MENU.map(item => (
            <button
              key={item.key}
              className={`nav-item ${activePanel === item.key ? "active" : ""}`}
              onClick={() => setActivePanel(item.key)}
            >
              {item.icon}
              <span className="nav-label">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <strong>{userName}</strong>
              <span>Admin User</span>
            </div>
          </div>
          <button className="nav-item" onClick={handleLogout}>
            <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="nav-label">
              Logout
            </span>
          </button>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <div className="topbar-left">
            <span className="topbar-title">{panelTitles[activePanel]}</span>
          </div>
          <div className="topbar-right">
            <span className="topbar-greeting">
              Welcome, <strong>{userName}</strong>
            </span>
            <span className="online-dot">Online</span>
          </div>
        </header>

        <div className="dash-content">
          {renderActivePanel()}
          <Footer />
        </div>
      </div>
    </div>
  );
}
