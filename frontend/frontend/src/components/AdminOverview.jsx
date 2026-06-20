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
          <div className="stat-info">
            <label>Total Services</label>
            <strong>{total}</strong>
            <small>All time</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <label>Pending</label>
            <strong>{pending}</strong>
            <small>Awaiting action</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <label>Completed</label>
            <strong>{completed}</strong>
            <small>Successfully done</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <label>In Progress</label>
            <strong>{progress}</strong>
            <small>Currently active</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <label>Total Revenue</label>
            <strong style={{ fontSize: "1.1rem" }}>₹{revenue.toLocaleString("en-IN")}</strong>
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
                  <th>Service Type</th>
                  <th>Booking Date</th>
                  <th>Completion Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "24px", color: "#9ca3af" }}>
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
                        <td style={{ color: "#9ca3af", fontSize: "0.8rem" }}>{i + 1}</td>
                        <td>
                          <span style={{ fontWeight: 600, fontFamily: "monospace" }}>{s.vehicle}</span>
                        </td>
                        <td>{s.owner}</td>
                        <td>{s.type}</td>
                        <td style={{ color: "#6b7280" }}>{s.date}</td>
                        <td style={{ color: s.status === "completed" ? "#059669" : "#9ca3af", fontWeight: s.status === "completed" ? "600" : "400" }}>
                          {getCompletionDate(s)}
                        </td>
                        <td>
                          {s.status === "completed" || s.status === "cancelled" ? (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            background: s.status === "completed" ? "#dcfce7" : "#fee2e2",
                            color: s.status === "completed" ? "#059669" : "#dc2626"
                          }}>
                            {s.status === "completed" ? "Completed" : "Cancelled"}
                          </span>
                        ) : (
                          <select
                            value={s.status}
                            onChange={e => onUpdateStatus(s._id, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid #d1d5db",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              cursor: "pointer",
                              outline: "none",
                              backgroundColor: s.status === "progress" ? "#eff6ff" : "#fffbeb",
                              color: s.status === "progress" ? "#2563eb" : "#d97706"
                            }}
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
              Add New Service
            </button>
            <button className="action-btn outline" onClick={() => setActive("services")}>
              View All Services
            </button>
            <button className="action-btn outline" onClick={() => setActive("reports")}>
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
