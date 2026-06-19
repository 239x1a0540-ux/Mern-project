import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

function calculatePasswordStrength(password) {
  if (!password) return { score: 0, label: "", cls: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const scoreClass = ["", "weak", "fair", "good", "strong"][score];
  const scoreLabel = ["", "Weak", "Fair", "Good", "Strong"][score];
  return { score, cls: scoreClass, label: scoreLabel };
}

function validateField(name, value, passwordToMatch = "") {
  const val = (value || "").trim();
  if (name === "name") {
    if (!val) return "Full name is required.";
    if (val.length < 2) return "Must be at least 2 characters.";
  }
  if (name === "email") {
    if (!val) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address.";
  }
  if (name === "phone") {
    if (!val) return "Phone number is required.";
    if (!/^\+?[\d\s\-()]{7,15}$/.test(val)) return "Invalid phone number.";
  }
  if (name === "password") {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
  }
  if (name === "confirmPassword") {
    if (!value) return "Please confirm your password.";
    if (value !== passwordToMatch) return "Passwords do not match.";
  }
  return "";
}

function InputField({ id, name, label, type = "text", placeholder, value, onChange, onBlur, error, touched }) {
  const isInvalid = touched && !!error;
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrapper">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="off"
          className={isInvalid ? "is-invalid" : ""}
        />
      </div>
      {isInvalid && <p className="field-error">{error}</p>}
    </div>
  );
}

function LoginForm({ onSuccess, switchTab }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    setAlertMessage(null);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setTouched({ email: true, password: true });

    const emailErr = validateField("email", form.email);
    const passwordErr = validateField("password", form.password);
    setErrors({ email: emailErr, password: passwordErr });

    if (emailErr || passwordErr) return;

    setLoading(true);
    setAlertMessage(null);
    try {
      const response = await axios.post("http://localhost:5000/api/login", form);
      if (response.data.message === "success") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.name);
        localStorage.setItem("userRole", response.data.role);
        onSuccess(response.data.name, response.data.role);
      } else {
        setAlertMessage({ type: "error", msg: "Incorrect email or password." });
      }
    } catch (err) {
      setAlertMessage({
        type: "error",
        msg: err?.response?.data?.message || "Login failed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tab-panel">
      {alertMessage && (
        <div className={`form-alert ${alertMessage.type}`}>{alertMessage.msg}</div>
      )}
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <InputField
          id="l-email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          touched={touched.email}
        />

        <InputField
          id="l-password"
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          touched={touched.password}
        />

        <div className="terms-row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <input
              id="l-remember"
              type="checkbox"
              className="terms-checkbox"
            />
            <label htmlFor="l-remember" className="terms-text">Remember me</label>
          </div>
          <a
            className="terms-link"
            href="#forgot"
            style={{ fontSize: "0.78rem" }}
            onClick={e => {
              e.preventDefault();
              switchTab("forgot");
            }}
          >
            Forgot password?
          </a>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <span>
              <span className="btn-spinner" /> Signing in…
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="divider">or</div>

        <p className="login-redirect">
          Don't have an account?{" "}
          <a
            href="#signup"
            onClick={e => {
              e.preventDefault();
              switchTab("signup");
            }}
          >
            Create one
          </a>
        </p>
      </form>
    </div>
  );
}

function ForgotForm({ switchTab }) {
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [touched, setTouched] = useState({ email: false, password: false, confirmPassword: false });
  const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value, name === "confirmPassword" ? prev.password : value) }));
    setAlertMessage(null);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value, form.password) }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setTouched({ email: true, password: true, confirmPassword: true });

    const emailErr = validateField("email", form.email);
    const passwordErr = validateField("password", form.password);
    const confirmErr = validateField("confirmPassword", form.confirmPassword, form.password);
    setErrors({ email: emailErr, password: passwordErr, confirmPassword: confirmErr });

    if (emailErr || passwordErr || confirmErr) return;

    setLoading(true);
    setAlertMessage(null);
    try {
      const response = await axios.post("http://localhost:5000/api/reset-password", {
        email: form.email,
        newPassword: form.password
      });
      setAlertMessage({
        type: "success",
        msg: response.data.message || "Password reset successful!"
      });
      setTimeout(() => {
        switchTab("login");
      }, 2000);
    } catch (err) {
      setAlertMessage({
        type: "error",
        msg: err?.response?.data?.message || "Failed to reset password. Please try again."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tab-panel">
      {alertMessage && (
        <div className={`form-alert ${alertMessage.type}`}>{alertMessage.msg}</div>
      )}
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <InputField
          id="f-email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          touched={touched.email}
        />

        <InputField
          id="f-password"
          name="password"
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          touched={touched.password}
        />

        <InputField
          id="f-confirmPassword"
          name="confirmPassword"
          label="Confirm New Password"
          type="password"
          placeholder="Confirm new password"
          value={form.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <span>
              <span className="btn-spinner" /> Resetting…
            </span>
          ) : (
            "Reset Password"
          )}
        </button>

        <p className="login-redirect" style={{ marginTop: 20 }}>
          Remember your password?{" "}
          <a
            href="#login"
            onClick={e => {
              e.preventDefault();
              switchTab("login");
            }}
          >
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}

function SignupForm({ onSuccess, switchTab }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const pwdStrength = calculatePasswordStrength(form.password);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    setAlertMessage(null);
  }, []);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const allTouched = { name: true, email: true, phone: true, password: true };
    setTouched(allTouched);

    const validationErrors = {
      name: validateField("name", form.name),
      email: validateField("email", form.email),
      phone: validateField("phone", form.phone),
      password: validateField("password", form.password)
    };
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(err => err !== "");
    if (hasErrors) {
      setAlertMessage({ type: "error", msg: "Please fill in all fields correctly." });
      return;
    }

    if (!termsAccepted) {
      setAlertMessage({ type: "error", msg: "Please accept the Terms of Service to continue." });
      return;
    }

    setLoading(true);
    setAlertMessage(null);
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        fullname: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.name || form.name);
      localStorage.setItem("userRole", response.data.role || "user");
      onSuccess(form.name, response.data.role || "user");
    } catch (err) {
      setAlertMessage({
        type: "error",
        msg: err?.response?.data?.message || "Registration failed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tab-panel">
      {alertMessage && (
        <div className={`form-alert ${alertMessage.type}`}>{alertMessage.msg}</div>
      )}
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <InputField
          id="r-name"
          name="name"
          label="Full Name"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
        />

        <InputField
          id="r-email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          touched={touched.email}
        />

        <InputField
          id="r-phone"
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone}
          touched={touched.phone}
        />

        <InputField
          id="r-password"
          name="password"
          label="Password"
          type="password"
          placeholder="Minimum 8 characters"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          touched={touched.password}
        />

        {form.password && (
          <div className="strength-bar-container">
            <div className="strength-bars">
              {[1, 2, 3, 4].map(index => (
                <div
                  key={index}
                  className={`strength-bar ${pwdStrength.score >= index ? `active-${pwdStrength.cls}` : ""}`}
                />
              ))}
            </div>
            <span className={`strength-label ${pwdStrength.cls}`}>
              {pwdStrength.score > 0 && `Password strength: ${pwdStrength.label}`}
            </span>
          </div>
        )}

        <div className="terms-row">
          <input
            id="r-terms"
            type="checkbox"
            className="terms-checkbox"
            checked={termsAccepted}
            onChange={e => setTermsAccepted(e.target.checked)}
          />
          <label htmlFor="r-terms" className="terms-text">
            I agree to the <a className="terms-link" href="#terms">Terms of Service</a> and <a className="terms-link" href="#privacy">Privacy Policy</a>
          </label>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <span>
              <span className="btn-spinner" /> Creating account…
            </span>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="divider">or</div>

        <p className="login-redirect">
          Already have an account?{" "}
          <a
            href="#login"
            onClick={e => {
              e.preventDefault();
              switchTab("login");
            }}
          >
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}

function SuccessScreen({ name, onContinue }) {
  return (
    <div className="register-page" style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" }}>
      <div style={{
        textAlign: "center",
        backgroundColor: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: 8,
        padding: "40px",
        maxWidth: 360,
      }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#111827", marginBottom: 8 }}>
          Account created!
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#4b5563", marginBottom: 24, lineHeight: 1.5 }}>
          Your account for <strong>{name}</strong> is ready.
        </p>
        <button className="submit-btn" style={{ marginTop: 0 }} onClick={onContinue}>
          Sign In Now
        </button>
      </div>
    </div>
  );
}

export default function AuthPage({ defaultTab = "signup" }) {
  const [tab, setTab] = useState(defaultTab);
  const [successState, setSuccessState] = useState(null);
  const navigate = useNavigate();

  if (successState) {
    return (
      <SuccessScreen
        name={successState.name}
        onContinue={() => {
          setSuccessState(null);
          setTab("login");
        }}
      />
    );
  }

  return (
    <div className="register-page">
      <section className="register-panel">
        <div className="form-header">
          <h2>
            {tab === "signup" ? "Create your account" : tab === "login" ? "Sign in to your account" : "Reset your password"}
          </h2>
          <p>
            {tab === "signup" ? "Fill in your details to get started" : tab === "login" ? "Enter your credentials to continue" : "Enter your email and new password to reset"}
          </p>
        </div>

        {tab !== "forgot" && (
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === "signup" ? "active" : ""}`}
              type="button"
              onClick={() => setTab("signup")}
            >
              Sign Up
            </button>
            <button
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              type="button"
              onClick={() => setTab("login")}
            >
              Login
            </button>
          </div>
        )}

        {tab === "login" ? (
          <LoginForm
            key="login"
            onSuccess={(name, role) => {
              navigate(role === "admin" ? "/admin" : "/dashboard");
            }}
            switchTab={setTab}
          />
        ) : tab === "signup" ? (
          <SignupForm
            key="signup"
            onSuccess={(name, role) => setSuccessState({ name, role })}
            switchTab={setTab}
          />
        ) : (
          <ForgotForm
            key="forgot"
            switchTab={setTab}
          />
        )}
      </section>
    </div>
  );
}
