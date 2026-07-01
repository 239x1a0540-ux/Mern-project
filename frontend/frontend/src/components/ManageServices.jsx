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
            className={`action-btn ${statusFilter === f ? 'primary' : 'outline'}`}
            style={{ width: "auto", padding: "8px 16px", marginBottom: 0, borderRadius: "24px" }}
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
                <th>Phone</th>
                <th>Service Type</th>
                <th>Booking Date</th>
                <th>Completion Date</th>
                <th>Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "24px", color: "#9ca3af" }}>
                    No services match the current filter.
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
                      <td style={{ fontWeight: 600 }}>₹{(s.cost || 0).toLocaleString("en-IN")}</td>
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
    </div>
  );
}
