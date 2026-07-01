import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../styles/UserDashboard.css";

import CustomerOverview from "../components/CustomerOverview";
import CustomerBookings from "../components/CustomerBookings";
import CustomerBookForm from "../components/CustomerBookForm";
import CustomerProfile from "../components/CustomerProfile";
import CustomerWallet from "../components/CustomerWallet";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "Premium Customer";
  const userInitials = userName.substring(0, 2).toUpperCase();
  
  const activePanel = searchParams.get("tab") || "overview";
  const setActivePanel = (panel) => {
    setSearchParams({ tab: panel });
  };
  
  const [servicesList, setServicesList] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function fetchServices() {
    axios.get("http://localhost:5000/api/services", getAuthHeaders())
      .then(res => setServicesList(res.data.services || []))
      .catch(err => {
        if (err?.response?.status === 401) {
          handleLogout();
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
      return <CustomerBookings services={servicesList} onRefresh={fetchServices} />;
    } else if (activePanel === "book") {
      return <CustomerBookForm onServiceAdded={fetchServices} userName={userName} />;
    } else if (activePanel === "wallet") {
      return <CustomerWallet services={servicesList} />;
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
    overview: "Dashboard",
    bookings: "My Bookings",
    book: "Book Service",
    wallet: "Spend Analysis",
    profile: "My Profile"
  };

  const panelSubtitles = {
    overview: "Manage your vehicle services and bookings",
    bookings: "Track all your past and upcoming service appointments",
    book: "Schedule a new maintenance or repair service",
    wallet: "Review your spending history and active costs",
    profile: "Update your account details and preferences"
  };

  return (
    <div className="flex min-h-screen font-['Plus_Jakarta_Sans'] bg-slate-50">
      {/* SidebarNavigation */}
      <aside className="w-[260px] bg-gradient-to-b from-[#0b1120] to-[#0f172a] text-white flex flex-col sticky top-0 h-screen z-50 shadow-[4px_0_24px_rgba(0,0,0,0.08)] shrink-0">
        <div className="flex items-center gap-3 p-6 border-b border-white/5">
          <div className="w-10 h-10 bg-gradient-to-br from-[#ff8a3d] to-[#ff6b00] rounded-[14px] flex items-center justify-center shadow-[0_0_20px_rgba(255,138,61,0.15)] shrink-0">
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-white fill-none" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div className="font-['Outfit']">
            <h1 className="text-[1.1rem] font-bold leading-[1.2] text-white tracking-wide">Vehicle Hub</h1>
            <small className="block text-[0.7rem] text-[#94a3b8] font-medium font-['Inter']">Customer Portal</small>
          </div>
        </div>

        <nav className="flex-1 p-6 px-4 flex flex-col gap-2 overflow-y-auto">
          <button 
            onClick={() => setActivePanel("overview")} 
            className={`w-full flex items-center gap-[14px] px-4 py-3 rounded-xl text-[0.9rem] font-medium transition-all duration-200 group text-left border-none outline-none cursor-pointer ${activePanel === "overview" ? "bg-gradient-to-r from-[#ff8a3d] to-[#ff6b00] text-white shadow-[0_4px_12px_rgba(255,138,61,0.3)]" : "bg-transparent text-[#94a3b8] hover:bg-[#1e293b] hover:text-white"}`}
          >
            <iconify-icon icon="lucide:layout-dashboard" class={`text-[20px] transition-transform duration-200 ${activePanel !== "overview" ? "group-hover:translate-x-0.5" : ""}`}></iconify-icon>
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActivePanel("bookings")} 
            className={`w-full flex items-center gap-[14px] px-4 py-3 rounded-xl text-[0.9rem] font-medium transition-all duration-200 group text-left border-none outline-none cursor-pointer ${activePanel === "bookings" ? "bg-gradient-to-r from-[#ff8a3d] to-[#ff6b00] text-white shadow-[0_4px_12px_rgba(255,138,61,0.3)]" : "bg-transparent text-[#94a3b8] hover:bg-[#1e293b] hover:text-white"}`}
          >
            <iconify-icon icon="lucide:calendar" class={`text-[20px] transition-transform duration-200 ${activePanel !== "bookings" ? "group-hover:translate-x-0.5" : ""}`}></iconify-icon>
            <span>My Bookings</span>
          </button>
          
          <button 
            onClick={() => setActivePanel("book")} 
            className={`w-full flex items-center gap-[14px] px-4 py-3 rounded-xl text-[0.9rem] font-medium transition-all duration-200 group text-left border-none outline-none cursor-pointer ${activePanel === "book" ? "bg-gradient-to-r from-[#ff8a3d] to-[#ff6b00] text-white shadow-[0_4px_12px_rgba(255,138,61,0.3)]" : "bg-transparent text-[#94a3b8] hover:bg-[#1e293b] hover:text-white"}`}
          >
            <iconify-icon icon="lucide:wrench" class={`text-[20px] transition-transform duration-200 ${activePanel !== "book" ? "group-hover:translate-x-0.5" : ""}`}></iconify-icon>
            <span>Book Service</span>
          </button>
          
          <button 
            onClick={() => setActivePanel("wallet")} 
            className={`w-full flex items-center gap-[14px] px-4 py-3 rounded-xl text-[0.9rem] font-medium transition-all duration-200 group text-left border-none outline-none cursor-pointer ${activePanel === "wallet" ? "bg-gradient-to-r from-[#ff8a3d] to-[#ff6b00] text-white shadow-[0_4px_12px_rgba(255,138,61,0.3)]" : "bg-transparent text-[#94a3b8] hover:bg-[#1e293b] hover:text-white"}`}
          >
            <iconify-icon icon="lucide:bar-chart-3" class={`text-[20px] transition-transform duration-200 ${activePanel !== "wallet" ? "group-hover:translate-x-0.5" : ""}`}></iconify-icon>
            <span>Spend Analysis</span>
          </button>
          
          <button 
            onClick={() => setActivePanel("profile")} 
            className={`w-full flex items-center gap-[14px] px-4 py-3 rounded-xl text-[0.9rem] font-medium transition-all duration-200 group text-left border-none outline-none cursor-pointer ${activePanel === "profile" ? "bg-gradient-to-r from-[#ff8a3d] to-[#ff6b00] text-white shadow-[0_4px_12px_rgba(255,138,61,0.3)]" : "bg-transparent text-[#94a3b8] hover:bg-[#1e293b] hover:text-white"}`}
          >
            <iconify-icon icon="lucide:user" class={`text-[20px] transition-transform duration-200 ${activePanel !== "profile" ? "group-hover:translate-x-0.5" : ""}`}></iconify-icon>
            <span>My Profile</span>
          </button>
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#ff8a3d] flex items-center justify-center text-white font-bold text-[1rem] shrink-0">
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <strong className="block text-[0.9rem] text-white truncate font-medium">{userName}</strong>
              <span className="text-[0.75rem] text-[#94a3b8] truncate block">{userRole}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-[14px] px-4 py-3 rounded-xl text-[0.9rem] font-medium text-[#94a3b8] bg-transparent border-none outline-none cursor-pointer hover:bg-[#1e293b] hover:text-white transition-all duration-200 group text-left"
          >
            <iconify-icon icon="lucide:log-out" class="text-[20px] transition-transform duration-200 group-hover:translate-x-0.5"></iconify-icon>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 relative flex flex-col min-w-0">
        {/* HeaderBar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">{panelTitles[activePanel]}</h2>
            <p className="text-xs text-gray-500">{panelSubtitles[activePanel]}</p>
          </div>
          <div className="flex items-center space-x-6">
            {isOnline ? (
              <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold">ONLINE</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full border border-red-100">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                <span className="text-xs font-bold">OFFLINE</span>
              </div>
            )}
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-900">Welcome, {userName}</p>
                <p className="text-xs text-gray-400 italic">Customer Portal</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <iconify-icon icon="lucide:bell" class="text-lg text-gray-600"></iconify-icon>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {renderActivePanel()}
        </div>

        {/* Footer */}
        <footer className="p-8 text-center text-gray-400 text-sm mt-auto">
          <p className="flex items-center justify-center space-x-2">
            <span>Vehicle Service Management Hub</span>
            <span className="text-gray-300 text-lg">&bull;</span>
            <span>&copy; 2026</span>
            <span className="text-gray-300 text-lg">&bull;</span>
            <span className="font-medium">All rights reserved.</span>
          </p>
        </footer>
      </main>
    </div>
  );
}
