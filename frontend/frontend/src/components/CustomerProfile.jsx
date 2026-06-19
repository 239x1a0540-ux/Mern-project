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
      <div className="ud-content">
        <div className="ud-profile-card" style={{ textAlign: "center", padding: 40 }}>
          <p style={{ color: "#9ca3af" }}>Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ud-content">
      <div className="ud-profile-card">
        {alert && (
          <div className={`ud-alert ${alert.type}`}>{alert.msg}</div>
        )}

        <div className="ud-profile-header">
          <div>
            <p className="ud-profile-name">{profile.fullname}</p>
            <p className="ud-profile-email">{profile.email}</p>
            <span className="ud-profile-role">{profile.role}</span>
          </div>
        </div>

        {editing ? (
          <div className="ud-profile-fields">
            <div className="ud-form-field">
              <label>Full Name</label>
              <input value={editForm.fullname} onChange={e => setEditForm(prev => ({ ...prev, fullname: e.target.value }))} />
            </div>
            <div className="ud-form-field">
              <label>Phone Number</label>
              <input value={editForm.phone} placeholder="+91 98765 43210" onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))} />
            </div>
            <div className="ud-form-field">
              <label>New Password (leave blank to keep current)</label>
              <input type="password" value={editForm.newPassword} placeholder="••••••••" onChange={e => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))} />
            </div>
            <div className="ud-form-field">
              <label>Confirm New Password</label>
              <input type="password" value={editForm.confirmPassword} placeholder="••••••••" onChange={e => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button className="ud-form-submit" style={{ flex: 1, marginTop: 0 }} disabled={loading} onClick={handleSave}>
                {loading ? "Saving…" : "Save Changes"}
              </button>
              <button className="ud-profile-edit-btn" style={{ marginTop: 0 }} onClick={() => {
                setEditing(false);
                setEditForm(prev => ({ ...prev, newPassword: "", confirmPassword: "" }));
              }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="ud-profile-fields">
              <div className="ud-profile-row"><label>Full Name</label><span>{profile.fullname}</span></div>
              <div className="ud-profile-row"><label>Email</label><span>{profile.email}</span></div>
              <div className="ud-profile-row"><label>Phone</label><span>{profile.phone || "Not set"}</span></div>
              <div className="ud-profile-row"><label>Role</label><span style={{ textTransform: "capitalize" }}>{profile.role}</span></div>
              <div className="ud-profile-row">
                <label>Member Since</label>
                <span>
                  {new Date(profile.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
            <button className="ud-profile-edit-btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}
