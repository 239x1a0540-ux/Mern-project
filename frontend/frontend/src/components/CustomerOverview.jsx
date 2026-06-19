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

export default function CustomerOverview({ services, setActive, userName }) {
  const total = services.length;
  const pending = services.filter(s => s.status === "pending").length;
  const activeCount = services.filter(s => s.status === "progress").length;
  const completed = services.filter(s => s.status === "completed").length;

  const totalSpent = services.reduce((sum, svc) => sum + (svc.cost || 0), 0);

  return (
    <div className="ud-content">
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", marginBottom: 4 }}>
          Welcome back, {userName}!
        </h2>
        <p style={{ fontSize: ".85rem", color: "#6b7280" }}>
          Here is an overview of your booked vehicle services
        </p>
      </div>

      <div className="ud-stats-row">
        <div className="ud-stat-card">
          <div className="ud-stat-info">
            <label>Total Bookings</label>
            <strong>{total}</strong>
            <small>All time</small>
          </div>
        </div>

        <div className="ud-stat-card">
          <div className="ud-stat-info">
            <label>Pending</label>
            <strong>{pending}</strong>
            <small>Awaiting action</small>
          </div>
        </div>

        <div className="ud-stat-card">
          <div className="ud-stat-info">
            <label>In Progress</label>
            <strong>{activeCount}</strong>
            <small>Currently active</small>
          </div>
        </div>

        <div className="ud-stat-card">
          <div className="ud-stat-info">
            <label>Completed</label>
            <strong>{completed}</strong>
            <small>Successfully done</small>
          </div>
        </div>
      </div>

      <div className="ud-bottom">
        <div className="ud-panel-card">
          <div className="ud-panel-head">
            <h3>Recent Bookings</h3>
            <span>{Math.min(services.length, 5)} of {services.length}</span>
          </div>

          {services.length === 0 ? (
            <div className="ud-empty">
              <h4>No bookings yet</h4>
              <p>Book your first vehicle service to get started!</p>
            </div>
          ) : (
            <div className="ud-table-wrap">
              <table className="ud-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Vehicle</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {services.slice(0, 5).map((s, i) => (
                    <tr key={s._id || i}>
                      <td style={{ color: "#9ca3af", fontSize: ".74rem" }}>{i + 1}</td>
                      <td>
                        <span style={{ fontWeight: 600, fontFamily: "monospace" }}>{s.vehicle}</span>
                      </td>
                      <td>{s.type}</td>
                      <td style={{ color: "#6b7280" }}>{s.date}</td>
                      <td>
                        <StatusBadge status={s.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="ud-panel-card">
            <h3 style={{ fontSize: ".9rem", fontWeight: 700, marginBottom: 12 }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="ud-action-btn primary" onClick={() => setActive("book")}>
                Book a Service
              </button>
              <button className="ud-action-btn outline" onClick={() => setActive("bookings")}>
                View All Bookings
              </button>
              <button className="ud-action-btn outline" onClick={() => setActive("wallet")}>
                View Wallet
              </button>
            </div>
          </div>

          <div className="ud-panel-card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div>
                <p style={{ fontSize: ".7rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>Total Spent</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111827" }}>
                  ₹{totalSpent.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <p style={{ fontSize: ".75rem", color: "#9ca3af", marginTop: 8 }}>
              Across {services.length} booking(s)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
