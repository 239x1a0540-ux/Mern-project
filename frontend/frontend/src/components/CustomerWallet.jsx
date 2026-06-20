import { useState } from "react";

function getSpendingMetrics(services) {
  let monthly = 0;
  let yearly = 0;
  let lifetime = 0;
  let completedCount = 0;

  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  const currentYear = now.getFullYear();

  services.forEach(s => {
    // Only count completed bookings for actual spent money
    const cost = parseFloat(s.cost) || 0;
    
    // Parse date: Use updatedAt for completed services as it represents the completion date
    let dateToParse = s.date;
    if (s.status === "completed" && s.updatedAt) {
      dateToParse = s.updatedAt;
    }

    let d = new Date(dateToParse);
    if (isNaN(d.getTime())) {
      const parts = String(dateToParse).split(/[\s/\-]+/);
      if (parts.length === 3) {
        const year = parseInt(parts[2]);
        const monthStr = parts[1];
        let month = parseInt(parts[1]) - 1;
        if (isNaN(month)) {
          const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
          month = months.indexOf(monthStr.toLowerCase().substring(0, 3));
        }
        if (year > 1000 && month >= 0 && month <= 11) {
          d = new Date(year, month, 1);
        }
      }
    }

    if (s.status === "completed") {
      completedCount++;
      lifetime += cost;
      if (!isNaN(d.getTime())) {
        if (d.getFullYear() === currentYear) {
          yearly += cost;
          if (d.getMonth() === currentMonth) {
            monthly += cost;
          }
        }
      } else {
        // Fallback to yearly if parsing fails but it exists
        yearly += cost;
      }
    }
  });

  return { monthly, yearly, lifetime, completedCount };
}

export default function CustomerWallet({ services = [] }) {
  const { monthly, yearly, lifetime, completedCount } = getSpendingMetrics(services);

  // Filter completed services for transactional history
  const completedServices = services.filter(s => s.status === "completed");

  const formatCompletionDate = (s) => {
    if (s.updatedAt) {
      const d = new Date(s.updatedAt);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        });
      }
    }
    return s.date;
  };

  return (
    <div className="ud-content">
      {/* Spend Analytics Card */}
      <div className="ud-wallet-card" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}>
        <p className="ud-wallet-label">Lifetime Service Spending</p>
        <p className="ud-wallet-amount">₹{lifetime.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
        <div className="ud-wallet-btns" style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.8rem", fontWeight: 500 }}>
          <span>Active Bookings Count: {services.filter(s => s.status !== "completed").length}</span>
        </div>
      </div>

      {/* Spend Stats Grid */}
      <div className="ud-wallet-stats">
        <div className="ud-wstat">
          <p className="ud-wstat-label">Spent This Month</p>
          <p className="ud-wstat-val red">₹{monthly.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="ud-wstat">
          <p className="ud-wstat-label">Spent This Year</p>
          <p className="ud-wstat-val red">₹{yearly.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="ud-wstat">
          <p className="ud-wstat-label">Completed Services</p>
          <p className="ud-wstat-val green">{completedCount}</p>
        </div>
      </div>

      {/* Service Transaction History */}
      <div className="ud-panel-card">
        <div className="ud-panel-head">
          <h3>Service Payment History</h3>
          <span>{completedServices.length} transactions</span>
        </div>
        <div className="ud-tx-list" style={{ marginTop: "12px" }}>
          {completedServices.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "0.85rem", textAlign: "center", padding: "30px 0" }}>
              No service payments recorded yet. Completed services will appear here.
            </p>
          ) : (
            completedServices.map((s, i) => (
              <div 
                className="ud-tx-row" 
                key={s._id || i} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  padding: "12px", 
                  borderBottom: "1px solid #f3f4f6" 
                }}
              >
                <div className="ud-tx-info" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <strong style={{ fontSize: "0.85rem", color: "#1f2937" }}>{s.type}</strong>
                  <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                    Vehicle: {s.vehicle} | Completed: {formatCompletionDate(s)}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#ef4444" }}>
                    -₹{(s.cost || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span style={{ display: "block", fontSize: "0.65rem", color: "#10b981", fontWeight: 600 }}>Paid</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
