import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [status, setStatus] = useState("loading");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus("unauthorized");
      return;
    }

    axios
      .get("http://localhost:5000/api/verify-token", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.message === "Token is valid") {
          const role = res.data.user.role;
          setUserRole(role);

          if (!allowedRoles || allowedRoles.includes(role)) {
            setStatus("authorized");
          } else {
            setStatus("wrong-role");
          }
        } else {
          setStatus("unauthorized");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        setStatus("unauthorized");
      });
  }, [allowedRoles]);

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f8fafc",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "4px solid #e2e8f0",
              borderTopColor: "#6366f1",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#64748b", fontSize: "0.88rem" }}>
            Verifying authentication…
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  if (status === "wrong-role") {
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
