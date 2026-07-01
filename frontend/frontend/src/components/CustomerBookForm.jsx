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

const TIME_SLOTS = [
  "Morning (10:00 AM - 01:00 PM)",
  "Afternoon (01:00 PM - 04:00 PM)",
  "Evening (04:00 PM - 07:00 PM)"
];

export default function CustomerBookForm({ onServiceAdded, userName }) {
  const [form, setForm] = useState({
    vehicle: "",
    owner: userName || "",
    phone: "",
    type: "",
    date: "",
    time: "Morning (10:00 AM - 01:00 PM)",
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

  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.vehicle || !form.owner || !form.phone || !form.type) {
      setAlert({ type: "error", msg: "Please fill in all required fields." });
      return;
    }

    if (form.date) {
      const selected = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      if (selected < today) {
        setAlert({ type: "error", msg: "You cannot book a service for a past date." });
        return;
      }
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
        phone: form.phone,
        type: form.type,
        date: defaultDate,
        time: form.time,
        cost: form.cost || 0,
        status: "pending",
        notes: form.notes
      }, getAuthHeaders());

      setShowSuccess(true);
      if (onServiceAdded) onServiceAdded();

      setForm({
        vehicle: "",
        owner: userName || "",
        phone: "",
        type: "",
        date: "",
        time: "Morning (10:00 AM - 01:00 PM)",
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
    <div className="p-6 max-w-5xl mx-auto space-y-6 w-full flex-1 flex flex-col items-center">
      
      {/* Main Form Card */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm w-full overflow-hidden p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Service Registration</h2>
          <p className="text-gray-500 mt-1.5 text-xs md:text-sm">Enter your vehicle registration details and select a service rate</p>
        </div>

        {alert && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center space-x-2.5 text-xs font-medium">
            <iconify-icon icon="lucide:alert-circle" class="text-base"></iconify-icon>
            <span>{alert.msg}</span>
          </div>
        )}

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center p-10 text-center bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/30">
              <iconify-icon icon="lucide:check" class="text-2xl"></iconify-icon>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Service Booked Successfully!</h4>
            <p className="text-sm text-gray-600">Your service booking has been registered. We'll update the status shortly.</p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="mt-5 px-5 py-2 bg-white border border-emerald-200 text-emerald-700 font-semibold rounded-full hover:bg-emerald-100 transition-colors text-sm"
            >
              Book Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Vehicle Registration */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-900 block">Vehicle Registration Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <iconify-icon icon="lucide:credit-card" class="text-base"></iconify-icon>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. AP39AB1234"
                    value={form.vehicle}
                    onChange={e => setForm(prev => ({ ...prev, vehicle: e.target.value }))}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all hover:bg-gray-100/50"
                  />
                </div>
              </div>

              {/* Owner Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-900 block">Owner / Customer Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <iconify-icon icon="lucide:user" class="text-base"></iconify-icon>
                  </div>
                  <input
                    type="text"
                    placeholder="Pavan reddy"
                    value={form.owner}
                    onChange={e => setForm(prev => ({ ...prev, owner: e.target.value }))}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all hover:bg-gray-100/50"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-900 block">Phone Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <iconify-icon icon="lucide:phone" class="text-base"></iconify-icon>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all hover:bg-gray-100/50"
                  />
                </div>
              </div>

              {/* Select Service */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-900 block">Select Service *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
                    <iconify-icon icon="lucide:settings-2" class="text-base"></iconify-icon>
                  </div>
                  <select 
                    value={form.type} 
                    onChange={handleTypeChange}
                    className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all hover:bg-gray-100/50 appearance-none"
                  >
                    <option value="" disabled className="text-gray-400">Select service...</option>
                    {Object.keys(SERVICE_PRICES).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <iconify-icon icon="lucide:chevron-down" class="text-base"></iconify-icon>
                  </div>
                </div>
              </div>

              {/* Preferred Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-900 block">Preferred Date *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
                    <iconify-icon icon="lucide:calendar" class="text-base"></iconify-icon>
                  </div>
                  <input
                    type="date"
                    value={form.date}
                    min={getTodayString()}
                    onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all hover:bg-gray-100/50 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer z-0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <iconify-icon icon="lucide:calendar-days" class="text-base"></iconify-icon>
                  </div>
                </div>
              </div>

              {/* Service Cost */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-900 block">Estimated Service Cost (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <span className="font-semibold text-sm leading-none mt-0.5">₹</span>
                  </div>
                  <input
                    type="text"
                    value={form.cost !== "" ? form.cost.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}
                    placeholder="Select a service to see rate"
                    readOnly
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-100 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 placeholder-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Preferred Time Slot */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-900 block">Preferred Time Slot</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
                    <iconify-icon icon="lucide:clock" class="text-base"></iconify-icon>
                  </div>
                  <select 
                    value={form.time} 
                    onChange={e => setForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all hover:bg-gray-100/50 appearance-none"
                  >
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <iconify-icon icon="lucide:chevron-down" class="text-base"></iconify-icon>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Field */}
            <div className="space-y-1.5 mt-5">
              <label className="text-xs font-bold text-gray-900 block">Special Instructions / Notes</label>
              <textarea
                placeholder="Any specific requests (optional)"
                value={form.notes}
                onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                rows="3"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all hover:bg-gray-100/50 resize-none"
              ></textarea>
            </div>

            {/* Footer Row */}
            <div className="flex flex-col md:flex-row items-center justify-between pt-5 border-t border-gray-100 gap-4 mt-6">
              <div className="flex items-center space-x-2 bg-amber-50/80 px-3 py-2 rounded-lg border border-amber-100 text-amber-600">
                <iconify-icon icon="lucide:info" class="text-base"></iconify-icon>
                <span className="text-[10px] font-bold tracking-wide">Payment collected at center.</span>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95 group text-sm"
              >
                <iconify-icon icon={loading ? "lucide:loader" : "lucide:plus-circle"} class={`text-lg ${loading ? "animate-spin" : ""}`}></iconify-icon>
                <span>{loading ? "Submitting..." : "Book a New Service"}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Feature Badges at Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 shrink-0">
            <iconify-icon icon="lucide:shield-check" class="text-xl"></iconify-icon>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs">Certified Parts</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">100% genuine guaranteed</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 shrink-0">
            <iconify-icon icon="lucide:wrench" class="text-xl"></iconify-icon>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs">Expert Mechanics</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">Highly trained professionals</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500 shrink-0">
            <iconify-icon icon="lucide:clock-4" class="text-xl"></iconify-icon>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs">Fast Turnaround</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">Get your car back quicker</p>
          </div>
        </div>
      </div>

    </div>
  );
}
