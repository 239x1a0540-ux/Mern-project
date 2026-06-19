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
  { key: "dashboard", label: "Dashboard", icon: "" },
  { key: "services", label: "All Services", icon: "" },
  { key: "vehicles", label: "Vehicles", icon: "" },
  { key: "add", label: "Add Service", icon: "" },
  { key: "reports", label: "Reports", icon: "" }
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
              <span className="nav-label" style={{ opacity: 1, pointerEvents: "auto", marginLeft: 4 }}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-info" style={{ opacity: 1 }}>
              <strong>{userName}</strong>
              <span>Admin</span>
            </div>
          </div>
          <button className="nav-item" style={{ marginTop: 8 }} onClick={handleLogout}>
            <span className="nav-label" style={{ opacity: 1, pointerEvents: "auto", marginLeft: 4 }}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      <div className="dash-main" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {renderActivePanel()}
        </div>

        <Footer />
      </div>
    </div>
  );
}
