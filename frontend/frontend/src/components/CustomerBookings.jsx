import { useState } from "react";

function StatusBadge({ status }) {
  let label = status;
  if (status === "pending") label = "Pending";
  else if (status === "progress") label = "In Progress";
  else if (status === "completed") label = "Completed";

  return (
    <span className={`ud-badge ${status}`}>
      {label}
    </span>
  );
}

export default function CustomerBookings({ services }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredServices = services.filter(s => {
    const matchesSearch =
      s.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="ud-content">
      <div className="ud-filters">
        {["all", "pending", "progress", "completed"].map(f => (
          <button
            key={f}
            className={`ud-filter-btn ${statusFilter === f ? "active" : ""}`}
            onClick={() => setStatusFilter(f)}
          >
            {f === "all" ? "All" : f === "progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="ud-panel-card" style={{ flex: 1 }}>
        <div className="ud-panel-head">
          <h3>My Service History</h3>
          <span>{filteredServices.length} records</span>
        </div>

        <div className="ud-search-wrap">
          <input
            placeholder="Search vehicle or service type…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredServices.length === 0 ? (
          <div className="ud-empty">
            <h4>No bookings found</h4>
            <p>Try adjusting your search criteria or filter options.</p>
          </div>
        ) : (
          <div className="ud-table-wrap">
            <table className="ud-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Vehicle No.</th>
                  <th>Service Type</th>
                  <th>Booking Date</th>
                  <th>Completion Date</th>
                  <th>Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((s, i) => {
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
                      <td style={{ color: "#9ca3af", fontSize: ".74rem" }}>{i + 1}</td>
                      <td>
                        <span style={{ fontWeight: 600, fontFamily: "monospace" }}>{s.vehicle}</span>
                      </td>
                      <td>{s.type}</td>
                      <td style={{ color: "#6b7280" }}>{s.date}</td>
                      <td style={{ color: s.status === "completed" ? "#10b981" : "#9ca3af", fontWeight: s.status === "completed" ? "600" : "400" }}>
                        {getCompletionDate(s)}
                      </td>
                      <td style={{ fontWeight: 600 }}>₹{s.cost || 0}</td>
                      <td>
                        <StatusBadge status={s.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
