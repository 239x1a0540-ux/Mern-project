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
        <div className="vehicles-header">
          <h3>Registered Vehicles</h3>
          <p>{vehiclesList.length} vehicles found in database</p>
        </div>

        {vehiclesList.length === 0 ? (
          <div className="vehicles-header" style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "var(--c-text-muted)" }}>No registered vehicles found.</p>
          </div>
        ) : (
          <div className="vehicles-grid">
            {vehiclesList.map((v, idx) => (
              <div className="vehicle-card" key={v.plate || idx}>
                <div className="vc-top">
                  <div className="vc-icon">
                    <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  </div>
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
