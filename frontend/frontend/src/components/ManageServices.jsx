import { useState } from "react";

export default function ManageServices({ services, onUpdateStatus }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredServices = services.filter(s => {
    const matchesSearch =
      s.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dash-content" key="services">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["all", "pending", "progress", "completed", "cancelled"].map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            style={{
              padding: "6px 16px",
              borderRadius: "16px",
              border: "1px solid",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: statusFilter === f ? "#3b82f6" : "#ffffff",
              borderColor: statusFilter === f ? "#3b82f6" : "#d1d5db",
              color: statusFilter === f ? "#ffffff" : "#4b5563"
            }}
          >
            {f === "all" ? "All" : f === "progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="panel-card" style={{ flex: 1 }}>
        <div className="panel-head">
          <h3>All Services</h3>
          <span>{filteredServices.length} records</span>
        </div>

        <div className="search-wrap">
          <input
            placeholder="Search vehicle, owner, service type…"
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
                <th>Date</th>
                <th>Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "24px", color: "#9ca3af" }}>
                    No services match the current filter.
                  </td>
                </tr>
              ) : (
                filteredServices.map((s, i) => (
                  <tr key={s._id || i}>
                    <td style={{ color: "#9ca3af", fontSize: "0.8rem" }}>{i + 1}</td>
                    <td>
                      <span style={{ fontWeight: 600, fontFamily: "monospace" }}>{s.vehicle}</span>
                    </td>
                    <td>{s.owner}</td>
                    <td>{s.type}</td>
                    <td style={{ color: "#6b7280" }}>{s.date}</td>
                    <td style={{ fontWeight: 600 }}>₹{(s.cost || 0).toLocaleString("en-IN")}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
