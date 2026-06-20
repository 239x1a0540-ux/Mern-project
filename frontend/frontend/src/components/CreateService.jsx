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

export default function CreateService({ onServiceAdded }) {
  const [form, setForm] = useState({
    vehicle: "",
    owner: "",
    type: "",
    date: "",
    cost: "",
    status: "pending",
    notes: ""
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleTypeChange(event) {
    const selectedType = event.target.value;
    const price = SERVICE_PRICES[selectedType] ?? "";
    setForm(prev => ({
      ...prev,
      type: selectedType,
      cost: price
    }));
  }

  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.vehicle || !form.owner || !form.type) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (form.date) {
      const selected = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      if (selected < today) {
        setErrorMessage("You cannot book a service for a past date.");
        return;
      }
    }

    setLoading(true);
    setErrorMessage("");

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
        status: form.status,
        notes: form.notes
      }, getAuthHeaders());

      setShowSuccess(true);
      if (onServiceAdded) onServiceAdded();

      setForm({
        vehicle: "",
        owner: "",
        type: "",
        date: "",
        cost: "",
        status: "pending",
        notes: ""
      });

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Failed to add service. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dash-content" key="add">
      <div className="add-service-page">
        <div className="add-form-card">
          <h3>Add New Service Book</h3>
          <p>Fill in the vehicle and customer details below</p>

          {showSuccess && (
            <div style={{
              backgroundColor: "#ecfdf5",
              border: "1px solid #a7f3d0",
              color: "#065f46",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "16px",
              fontSize: "0.85rem",
              fontWeight: 600
            }}>
              Service Added successfully!
            </div>
          )}

          {errorMessage && (
            <div style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#991b1b",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "16px",
              fontSize: "0.85rem",
              fontWeight: 600
            }}>
              {errorMessage}
            </div>
          )}

          {!showSuccess && (
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Vehicle Number *</label>
                  <input
                    placeholder="e.g. AP39AB1234"
                    value={form.vehicle}
                    onChange={e => setForm(prev => ({ ...prev, vehicle: e.target.value }))}
                  />
                </div>

                <div className="form-field">
                  <label>Owner Name *</label>
                  <input
                    placeholder="e.g. Ram Kumar"
                    value={form.owner}
                    onChange={e => setForm(prev => ({ ...prev, owner: e.target.value }))}
                  />
                </div>

                <div className="form-field">
                  <label>Service Type *</label>
                  <select value={form.type} onChange={handleTypeChange}>
                    <option value="">Select service…</option>
                    {Object.keys(SERVICE_PRICES).map(type => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Service Date</label>
                  <input
                    type="date"
                    value={form.date}
                    min={getTodayString()}
                    onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <div className="form-field">
                  <label>
                    Cost (₹) {form.cost !== "" && <span style={{ color: "#3b82f6", fontSize: "0.7rem" }}> (Auto-filled Rate)</span>}
                  </label>
                  <input
                    type="text"
                    value={form.cost !== "" ? `₹ ${form.cost}` : ""}
                    readOnly
                    placeholder="Auto-filled on selection"
                    style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                  />
                </div>

                <div className="form-field">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="pending">Pending</option>
                    <option value="progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-grid full" style={{ marginTop: 12 }}>
                <div className="form-field">
                  <label>Notes</label>
                  <input
                    placeholder="Optional notes..."
                    value={form.notes}
                    onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>

              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? "Adding..." : "Book Service"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
