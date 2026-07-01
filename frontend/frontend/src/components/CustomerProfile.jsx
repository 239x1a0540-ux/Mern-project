import { useState, useEffect } from "react";
import axios from "axios";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
}

export default function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullname: "", phone: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/profile", getAuthHeaders())
      .then(res => {
        setProfile(res.data.user);
        setEditForm({
          fullname: res.data.user.fullname,
          phone: res.data.user.phone || "",
          newPassword: "",
          confirmPassword: ""
        });
      })
      .catch(() => setAlert({ type: "error", msg: "Failed to load profile." }));
  }, []);

  async function handleSave() {
    if (editForm.newPassword) {
      if (editForm.newPassword.length < 8) {
        setAlert({ type: "error", msg: "Password must be at least 8 characters long." });
        return;
      }
      if (editForm.newPassword !== editForm.confirmPassword) {
        setAlert({ type: "error", msg: "Passwords do not match." });
        return;
      }
    }

    setLoading(true);
    setAlert(null);

    try {
      const response = await axios.put("http://localhost:5000/api/profile", {
        fullname: editForm.fullname,
        phone: editForm.phone,
        newPassword: editForm.newPassword
      }, getAuthHeaders());

      setProfile(response.data.user);
      localStorage.setItem("userName", response.data.user.fullname);
      setEditing(false);
      setAlert({ type: "success", msg: "Profile updated successfully!" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", msg: "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  }

  if (!profile) {
    return (
      <div className="p-6 max-w-6xl mx-auto w-full flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center justify-center text-gray-400 space-y-3">
          <iconify-icon icon="lucide:loader-2" class="text-3xl animate-spin text-orange-500"></iconify-icon>
          <p className="text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name ? name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "U";
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5 w-full">
      {alert && (
        <div className={`p-3 rounded-lg flex items-center space-x-2.5 text-xs font-medium mb-5 ${
          alert.type === 'error' 
            ? 'bg-red-50 border border-red-100 text-red-600' 
            : 'bg-emerald-50 border border-emerald-100 text-emerald-600'
        }`}>
          <iconify-icon icon={alert.type === 'error' ? "lucide:alert-circle" : "lucide:check-circle-2"} class="text-lg"></iconify-icon>
          <span>{alert.msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* LEFT COLUMN: Profile Info & Vehicles */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Top Profile Card */}
          <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
            {/* Orange Banner */}
            <div className="h-24 bg-orange-500 w-full relative"></div>
            
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-10 sm:-mt-12 mb-6 gap-4">
                {/* Avatar and Info */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                  <div className="w-24 h-24 rounded-2xl border-4 border-white bg-orange-100 shadow-sm flex items-center justify-center shrink-0 overflow-hidden relative">
                    {/* Placeholder Avatar */}
                    <span className="text-3xl font-black text-orange-500 tracking-tighter">
                      {getInitials(profile.fullname)}
                    </span>
                  </div>
                  <div className="pb-1">
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{profile.fullname}</h2>
                    <div className="flex items-center text-gray-500 text-xs mt-1.5 space-x-1.5 font-medium">
                      <iconify-icon icon="lucide:mail" class="text-sm text-gray-400"></iconify-icon>
                      <span>{profile.email}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="pb-1 shrink-0">
                  {!editing ? (
                    <button 
                      onClick={() => setEditing(true)}
                      className="flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-5 rounded-xl shadow-md shadow-orange-500/30 transition-all active:scale-95 text-xs"
                    >
                      <iconify-icon icon="lucide:pencil-line" class="text-base"></iconify-icon>
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setEditing(false);
                          setEditForm({ fullname: profile.fullname, phone: profile.phone || "", newPassword: "", confirmPassword: "" });
                        }}
                        className="bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 font-bold py-2 px-4 rounded-xl transition-all text-xs"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-5 rounded-xl shadow-md shadow-emerald-500/30 transition-all active:scale-95 flex items-center space-x-1.5 text-xs"
                      >
                        {loading && <iconify-icon icon="lucide:loader-2" class="animate-spin text-sm"></iconify-icon>}
                        <span>Save</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 mb-6"></div>

              {/* Profile Details Grid */}
              {editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block">Full Name</label>
                    <input 
                      type="text" 
                      value={editForm.fullname} 
                      onChange={e => setEditForm(prev => ({ ...prev, fullname: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block">Phone Number</label>
                    <input 
                      type="text" 
                      value={editForm.phone} 
                      placeholder="+91 98765 43210"
                      onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block">New Password</label>
                    <input 
                      type="password" 
                      value={editForm.newPassword} 
                      placeholder="••••••••"
                      onChange={e => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block">Confirm Password</label>
                    <input 
                      type="password" 
                      value={editForm.confirmPassword} 
                      placeholder="••••••••"
                      onChange={e => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-4">
                  <div>
                    <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-1">Full Name</p>
                    <p className="font-bold text-gray-900 text-sm">{profile.fullname}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-1">Email Address</p>
                    <p className="font-bold text-gray-900 text-sm">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-1">Phone Number</p>
                    <p className="font-bold text-gray-900 text-sm">{profile.phone || "+91 Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-1">Role</p>
                    <div className="inline-block px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 mt-0.5">
                      <span className="text-[8px] font-black tracking-widest uppercase">{profile.role === 'customer' ? 'Premium User' : profile.role}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-1">Member Since</p>
                    <p className="font-bold text-gray-900 text-sm">{new Date(profile.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-1">Location</p>
                    <p className="font-bold text-gray-900 text-sm">Hyderabad, India</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Registered Vehicles Card */}
          <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Registered Vehicles</h3>
                <p className="text-[11px] text-gray-500 font-medium">Vehicles linked to your account for fast booking</p>
              </div>
              <button className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center text-orange-500 transition-colors">
                <iconify-icon icon="lucide:plus" class="text-lg"></iconify-icon>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Existing Vehicle */}
              <div className="border border-orange-100 bg-orange-50/40 rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:bg-orange-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                    <iconify-icon icon="lucide:car" class="text-base"></iconify-icon>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs">AP045HA0540</h4>
                    <p className="text-[9px] font-semibold text-gray-500">Primary Vehicle</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors p-1.5">
                  <iconify-icon icon="lucide:trash-2" class="text-base"></iconify-icon>
                </button>
              </div>

              {/* Add Vehicle Button */}
              <button className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center space-x-1.5 text-gray-400 hover:bg-gray-50 hover:border-orange-300 hover:text-orange-500 transition-all font-semibold text-xs h-full min-h-[3.5rem]">
                <iconify-icon icon="lucide:plus-circle" class="text-base"></iconify-icon>
                <span>Add Another Vehicle</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Settings & Danger Zone */}
        <div className="lg:col-span-1 space-y-5">
          
          {/* Account Actions */}
          <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-5 md:p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Account Actions</h3>
            
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group">
                <div className="flex items-center space-x-2.5">
                  <iconify-icon icon="lucide:shield-check" class="text-blue-500 text-base"></iconify-icon>
                  <span className="font-semibold text-xs text-gray-700 group-hover:text-gray-900">Security & Privacy</span>
                </div>
                <iconify-icon icon="lucide:chevron-right" class="text-gray-300 group-hover:text-gray-400"></iconify-icon>
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group">
                <div className="flex items-center space-x-2.5">
                  <iconify-icon icon="lucide:bell" class="text-orange-500 text-base"></iconify-icon>
                  <span className="font-semibold text-xs text-gray-700 group-hover:text-gray-900">Notification Settings</span>
                </div>
                <iconify-icon icon="lucide:chevron-right" class="text-gray-300 group-hover:text-gray-400"></iconify-icon>
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group">
                <div className="flex items-center space-x-2.5">
                  <iconify-icon icon="lucide:credit-card" class="text-indigo-500 text-base"></iconify-icon>
                  <span className="font-semibold text-xs text-gray-700 group-hover:text-gray-900">Billing & Invoices</span>
                </div>
                <iconify-icon icon="lucide:chevron-right" class="text-gray-300 group-hover:text-gray-400"></iconify-icon>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-[1.5rem] border border-red-100 p-5 md:p-6 relative overflow-hidden">
            <h3 className="text-red-600 font-black tracking-widest text-[10px] uppercase mb-2">Danger Zone</h3>
            <p className="text-red-800/70 text-[11px] font-medium leading-relaxed">
              Deleting your account will remove all your booking history and vehicle data permanently.
            </p>
            <button className="mt-4 w-full bg-white hover:bg-red-600 text-red-600 hover:text-white font-bold py-2.5 px-3 rounded-xl border border-red-200 hover:border-red-600 shadow-sm transition-all active:scale-95 text-xs">
              Delete My Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
