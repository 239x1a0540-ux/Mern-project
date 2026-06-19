import { useState } from "react";
import axios from "axios";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
}

const SERVICE_PRICES = {
  "Oil Change": 850,
  "Tyre Rotation": 400,
  "Engine Check": 500,
  "Brake Service": 600,
  "AC Repair": 1200,
  "Full Service": 2500,
  "Wheel Alignment": 350,
  "Battery Check": 300,
  "Car Wash": 199
};

export default function CustomerBookForm({ onServiceAdded, userName }) {
  const [form, setForm] = useState({
    vehicle: "",
    owner: userName || "",
    type: "",
    date: "",
    cost: "",
    notes: ""
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  function handleTypeChange(event) {
    const selectedType = event.target.value;
    const price = SERVICE_PRICES[selectedType] ?? "";
    setForm(prev => ({
      ...prev,
      type: selectedType,
      cost: price
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.vehicle || !form.owner || !form.type) {
      setAlert({ type: "error", msg: "Please fill in all required fields." });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const defaultDate = form.date || new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });

      await axios.post("http://localhost:5000/api/services", {
        vehicle: form.vehicle,
        owner: form.owner,
        type: form.type,
        date: defaultDate,
        cost: form.cost || 0,
        status: "pending",
        notes: form.notes
      }, getAuthHeaders());

      setShowSuccess(true);
      if (onServiceAdded) onServiceAdded();

      setForm({
        vehicle: "",
        owner: userName || "",
        type: "",
        date: "",
        cost: "",
        notes: ""
      });

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setAlert({
        type: "error",
        msg: err?.response?.data?.message || "Failed to book service."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ud-content">
      <div className="ud-form-card">
        <h3>Book a Service</h3>
        <p>Enter your vehicle registration details and select a service rate</p>

        {alert && (
          <div className={`ud-alert ${alert.type}`}>{alert.msg}</div>
        )}

        {showSuccess ? (
          <div className="ud-form-success">
            <h4>Service Booked Successfully!</h4>
            <p>Your service booking has been registered. We'll update the status shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="ud-form-grid">
              <div className="ud-form-field">
                <label>Vehicle Registration Number *</label>
                <input
                  placeholder="e.g. AP39AB1234"
                  value={form.vehicle}
                  onChange={e => setForm(prev => ({ ...prev, vehicle: e.target.value }))}
                />
              </div>

              <div className="ud-form-field">
                <label>Owner / Customer Name *</label>
                <input
                  placeholder="Your name"
                  value={form.owner}
                  onChange={e => setForm(prev => ({ ...prev, owner: e.target.value }))}
                />
              </div>

              <div className="ud-form-field">
                <label>Select Service *</label>
                <select value={form.type} onChange={handleTypeChange}>
                  <option value="">Select service…</option>
                  {Object.keys(SERVICE_PRICES).map(type => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="ud-form-field">
                <label>Preferred Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="ud-form-field">
                <label>
                  Service Cost (₹) {form.cost !== "" && <span style={{ color: "#3b82f6", fontSize: ".7rem" }}> (Standard Rate)</span>}
                </label>
                <input
                  type="text"
                  value={form.cost !== "" ? `₹ ${form.cost}` : ""}
                  placeholder="Select a service type rate"
                  readOnly
                  style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                />
              </div>

              <div className="ud-form-field">
                <label>Special Instructions / Notes</label>
                <input
                  placeholder="Any specific requests (optional)"
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>

            <button type="submit" className="ud-form-submit" disabled={loading}>
              {loading ? "Submitting..." : "Book Service"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
