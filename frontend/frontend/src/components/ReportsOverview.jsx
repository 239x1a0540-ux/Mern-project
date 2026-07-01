export default function ReportsOverview({ services }) {
  const total = services.length || 1;
  const completedCount = services.filter(s => s.status === "completed").length;
  const pendingCount = services.filter(s => s.status === "pending").length;
  const progressCount = services.filter(s => s.status === "progress").length;
  const totalRevenue = services.filter(s => s.status === "completed").reduce((sum, s) => sum + (s.cost || 0), 0);

  const serviceTypes = ["Oil Change", "Tyre Rotation", "Engine Check", "Brake Service", "AC Repair", "Full Service"];
  const typeDistribution = serviceTypes.map(type => ({
    label: type,
    count: services.filter(s => s.type === type).length
  }));

  return (
    <div className="dash-content" key="reports">
      <div className="reports-page">
        <div className="reports-top">
          <div className="report-card">
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--c-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Revenue</p>
            <p style={{ fontSize: "1.8rem", fontWeight: 700, fontFamily: "var(--font-head)", color: "var(--c-primary)", margin: "8px 0" }}>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--c-text-light)" }}>Completed bookings only</p>
          </div>

          <div className="report-card">
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--c-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Services</p>
            <p style={{ fontSize: "1.8rem", fontWeight: 700, fontFamily: "var(--font-head)", color: "var(--c-text-main)", margin: "8px 0" }}>
              {services.length}
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--c-text-light)" }}>All time booked count</p>
          </div>

          <div className="report-card">
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--c-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Completion Rate</p>
            <p style={{ fontSize: "1.8rem", fontWeight: 700, fontFamily: "var(--font-head)", color: "var(--c-success)", margin: "8px 0" }}>
              {services.length > 0 ? `${Math.round((completedCount / services.length) * 100)}%` : "0%"}
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--c-text-light)" }}>Out of total bookings</p>
          </div>
        </div>

        <div className="reports-bottom">
          <div className="rcard">
            <h4>Services by Type Breakdown</h4>
            <div style={{ marginTop: 12 }}>
              {typeDistribution.map(item => {
                const percentage = (item.count / total) * 100;
                return (
                  <div className="bar-row" key={item.label}>
                    <span className="bar-label">{item.label}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${percentage}%`, backgroundColor: "#3b82f6" }} />
                    </div>
                    <span className="bar-val">{item.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rcard">
            <h4>Status Breakdown</h4>
            <div className="donut-wrap" style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="donut-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--c-text-main)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--c-success)" }} /> Completed
                </span>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--c-text-muted)" }}>
                  {services.length > 0 ? Math.round((completedCount / total) * 100) : 0}%
                </span>
              </div>
              <div className="donut-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--c-text-main)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--c-warning)" }} /> Pending
                </span>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--c-text-muted)" }}>
                  {services.length > 0 ? Math.round((pendingCount / total) * 100) : 0}%
                </span>
              </div>
              <div className="donut-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--c-text-main)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--c-info)" }} /> In Progress
                </span>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--c-text-muted)" }}>
                  {services.length > 0 ? Math.round((progressCount / total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
