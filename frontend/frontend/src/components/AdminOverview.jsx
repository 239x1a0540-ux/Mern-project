import { useState } from "react";

export default function AdminOverview({ setActive, services, onUpdateStatus }) {
  const total = services.length;
  const pending = services.filter(s => s.status === "pending").length;
  const completed = services.filter(s => s.status === "completed").length;
  const progress = services.filter(s => s.status === "progress").length;
  const revenue = services.filter(s => s.status === "completed").reduce((sum, s) => sum + (s.cost || 0), 0);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter(s =>
    s.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dash-content" key="dashboard">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <div className="stat-info">
            <label>Total Services</label>
            <strong>{total}</strong>
            <small>All time</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="stat-info">
            <label>Pending</label>
            <strong>{pending}</strong>
            <small>Awaiting action</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="stat-info">
            <label>Completed</label>
            <strong>{completed}</strong>
            <small>Successfully done</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div className="stat-info">
            <label>In Progress</label>
            <strong>{progress}</strong>
            <small>Currently active</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="stat-info">
            <label>Total Revenue</label>
            <strong>₹{revenue.toLocaleString("en-IN")}</strong>
            <small>Completed only</small>
          </div>
        </div>
      </div>

      <div className="dash-bottom">
        <div className="panel-card">
          <div className="panel-head">
            <h3>Recent Services</h3>
            <span>{filteredServices.length} records</span>
          </div>

          <div className="search-wrap">
            <input
              placeholder="Search vehicle, owner, service…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="services-table-wrap">
            <table className="services-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Vehicle No.</th>
                  <th>Owner</th>
                  <th>Phone</th>
                  <th>Service Type</th>
                  <th>Booking Date</th>
                  <th>Completion Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "24px", color: "#9ca3af" }}>
                      {searchTerm ? `No results found for "${searchTerm}"` : "No services booked yet."}
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((s, i) => {
                    const getCompletionDate = (item) => {
                      if (item.status === "completed" && item.updatedAt) {
                        const d = new Date(item.updatedAt);
                        if (!isNaN(d.getTime())) {
                          return d.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          });
                        }
                      }
                      return "—";
                    };
                    return (
                      <tr key={s._id || i}>
                        <td style={{ color: "#9ca3af", fontSize: "0.85rem", fontWeight: "600" }}>{i + 1}</td>
                        <td>
                          <span style={{ fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.5px" }}>{s.vehicle}</span>
                        </td>
                        <td style={{ fontWeight: 500 }}>{s.owner}</td>
                        <td>{s.phone || "—"}</td>
                        <td>{s.type}</td>
                        <td style={{ color: "#64748b" }}>{s.date}</td>
                        <td style={{ color: s.status === "completed" ? "#10b981" : "#94a3b8", fontWeight: s.status === "completed" ? "600" : "400" }}>
                          {getCompletionDate(s)}
                        </td>
                        <td>
                          {s.status === "completed" || s.status === "cancelled" ? (
                          <span className={`badge ${s.status}`}>
                            {s.status === "completed" ? "Completed" : "Cancelled"}
                          </span>
                        ) : (
                          <select
                            value={s.status}
                            onChange={e => onUpdateStatus(s._id, e.target.value)}
                            className={`status-select ${s.status}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="side-panel">
          <div className="actions-card">
            <h3>Quick Actions</h3>
            <button className="action-btn primary" onClick={() => setActive("add")}>
              <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Add New Service
            </button>
            <button className="action-btn outline" onClick={() => setActive("services")}>
              <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              View All Services
            </button>
            <button className="action-btn outline" onClick={() => setActive("reports")}>
              <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
