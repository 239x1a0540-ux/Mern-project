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
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Total Revenue</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#3b82f6", marginTop: 4 }}>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: 4 }}>Completed bookings only</p>
          </div>

          <div className="report-card">
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Total Services</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f59e0b", marginTop: 4 }}>
              {services.length}
            </p>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: 4 }}>All time booked count</p>
          </div>

          <div className="report-card">
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Completion Rate</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#10b981", marginTop: 4 }}>
              {services.length > 0 ? `${Math.round((completedCount / services.length) * 100)}%` : "0%"}
            </p>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: 4 }}>Out of total bookings</p>
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
            <div className="donut-wrap" style={{ marginTop: 12 }}>
              <div className="donut-legend">
                <div className="donut-row">
                  <span className="donut-dot-label">
                    <span className="donut-dot" style={{ backgroundColor: "#10b981" }} /> Completed
                  </span>
                  <span className="donut-pct">
                    {services.length > 0 ? Math.round((completedCount / total) * 100) : 0}%
                  </span>
                </div>
                <div className="donut-row">
                  <span className="donut-dot-label">
                    <span className="donut-dot" style={{ backgroundColor: "#f59e0b" }} /> Pending
                  </span>
                  <span className="donut-pct">
                    {services.length > 0 ? Math.round((pendingCount / total) * 100) : 0}%
                  </span>
                </div>
                <div className="donut-row">
                  <span className="donut-dot-label">
                    <span className="donut-dot" style={{ backgroundColor: "#3b82f6" }} /> In Progress
                  </span>
                  <span className="donut-pct">
                    {services.length > 0 ? Math.round((progressCount / total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
