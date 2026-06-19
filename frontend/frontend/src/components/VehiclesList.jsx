export default function VehiclesList({ services }) {
  const vehiclesMap = {};

  services.forEach(s => {
    const plate = s.vehicle;
    if (!plate) return;

    if (!vehiclesMap[plate]) {
      vehiclesMap[plate] = {
        plate: plate,
        owner: s.owner || "Unknown",
        type: s.type || "Service",
        count: 0,
        active: false
      };
    }

    vehiclesMap[plate].count += 1;
    if (s.status === "pending" || s.status === "progress") {
      vehiclesMap[plate].active = true;
    }
  });

  const vehiclesList = Object.values(vehiclesMap);

  return (
    <div className="dash-content" key="vehicles">
      <div className="vehicles-page">
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "12px 18px"
        }}>
          <h3>Registered Vehicles</h3>
          <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>{vehiclesList.length} vehicles found in database</p>
        </div>

        {vehiclesList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#ffffff", borderRadius: 8, border: "1px solid #e5e7eb" }}>
            <p style={{ color: "#9ca3af" }}>No registered vehicles found.</p>
          </div>
        ) : (
          <div className="vehicles-grid">
            {vehiclesList.map((v, idx) => (
              <div className="vehicle-card" key={v.plate || idx}>
                <div className="vc-top">
                  <span className="vc-plate">{v.plate}</span>
                </div>
                <div>
                  <p className="vc-name">{v.owner}</p>
                  <p className="vc-type">Last: {v.type}</p>
                </div>
                <div className="vc-bottom">
                  <span className="vc-services">{v.count} booking(s)</span>
                  <span className={`badge ${v.active ? "progress" : "completed"}`}>
                     {v.active ? "Active" : "Completed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
