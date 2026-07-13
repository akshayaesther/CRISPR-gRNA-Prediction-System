import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    organization: "",
    country: ""
  });
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function getPasswordStrength(password) {
    if (password.length < 6) return "Weak";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return "Strong";
    return "Medium";
  }
  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (getPasswordStrength(user.password) !== "Strong") {
      setError("Password does not meet the requirements ❌");
      return;
    }

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match ❌");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Registration failed ❌");
        return;
      }

      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Server or Database not connected ❌");
    }
  }
  return (

    <div className="register-container  fade-in">

      <div className="register-card">

        <h2>Create Your Account</h2>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="register-input"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className={`register-input ${user.email
              ? isValidEmail(user.email)
                ? "valid"
                : "invalid"
              : ""
              }`}
            onChange={handleChange}
            required
          />
          <div className="input-group">
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="register-input"
                onChange={handleChange}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer"
                }}
              >
                👁️
              </span>
            </div>
            {user.password && getPasswordStrength(user.password) !== "Strong" && (
              <div className="strength-box">
                <div className="strength-bar">
                  <div
                    className={`strength-fill ${getPasswordStrength(user.password)}`}
                  ></div>
                </div>

                <p className={`strength-text ${getPasswordStrength(user.password)}`}>
                  {getPasswordStrength(user.password)} Password
                </p>

                <ul className="password-rules">
                  <li className={user.password.length >= 6 ? "valid" : ""}>
                    At least 6 characters
                  </li>
                  <li className={/[A-Z]/.test(user.password) ? "valid" : ""}>
                    One uppercase letter
                  </li>
                  <li className={/[0-9]/.test(user.password) ? "valid" : ""}>
                    One number
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="input-group">
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="register-input"
                onChange={handleChange}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer"
                }}
              >
                👁️
              </span>
            </div>
            {user.confirmPassword && user.password !== user.confirmPassword && (
              <p className={`match-text ${user.password === user.confirmPassword ? "match" : "no-match"
                }`}>
                {user.password === user.confirmPassword
                  ? "✅ Passwords match"
                  : "❌ Passwords do not match"}
              </p>
            )}

          </div>
          <select
            name="role"
            className="register-input"
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option>Student</option>
            <option>Researcher</option>
            <option>Scientist</option>
          </select>
          <input
            type="text"
            name="organization"
            placeholder="Organization / College"
            className="register-input"
            onChange={handleChange}
          />

          <input
            type="text"
            name="country"
            placeholder="Country"
            className="register-input"
            onChange={handleChange}
          />

          <button className="register-button">
            Register
          </button>
          {error && <p className="error-text" style={{ color: "#ff4d4d", textAlign: "center", marginTop: "15px", fontSize: "14px", fontWeight: "bold" }}>{error}</p>}
          {successMsg && <p className="success-text" style={{ color: "#4caf50", textAlign: "center", marginTop: "15px", fontSize: "14px", fontWeight: "bold" }}>{successMsg}</p>}
        </form>

        <p className="login-link" onClick={() => navigate("/login")}>
          Already have an account? Login
        </p>

      </div>

    </div>

  );
}

export default Register;