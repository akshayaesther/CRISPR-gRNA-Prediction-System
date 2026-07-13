import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔁 Toggle for forgot password
  const [isForgot, setIsForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔐 New password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e) {
  e.preventDefault();
  setErrorMsg("");

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");

    } else {
      setErrorMsg(data.message || "Login failed ❌");
    }

  } catch (error) {
    console.error(error);
    setErrorMsg("Server or Database not connected ❌");
  }
}
  function handleResetPassword(e) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && email === storedUser.email) {
      storedUser.password = newPassword;
      localStorage.setItem("user", JSON.stringify(storedUser));

      alert("Password updated successfully!");

      // 🔙 Go back to login
      setIsForgot(false);
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      alert("Email not found!");
    }
  }

  return (
    <div className="login-container fade-in">
      <div className="login-card">

        {/* 🔁 Title changes */}
        <h2>{isForgot ? "Reset Password" : "CRISPR DL Login"}</h2>

        {/* 🔐 LOGIN FORM */}
        {!isForgot && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter Gmail"
              className="login-input"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div style={{ position: "relative", marginBottom: "15px" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="login-input"
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box", margin: 0 }}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
              >
                👁️
              </span>
            </div>

            {/* 🔗 FORGOT PASSWORD */}
            <p
              style={{
                textAlign: "right",
                fontSize: "14px",
                color: "#00d4ff",
                cursor: "pointer",
                marginTop: "-5px"
              }}
              onClick={() => navigate("/forgot")}
            >
              Forgot Password?
            </p>

            <button className="login-button">Login</button>
            {errorMsg && (
              <p style={{ color: "#ff4d4d", textAlign: "center", marginTop: "15px", fontSize: "14px", fontWeight: "bold" }}>
                {errorMsg}
              </p>
            )}
          </form>
        )}

        {/* 🔄 RESET PASSWORD FORM */}
        {isForgot && (
          <form onSubmit={handleResetPassword}>
            <input
              type="email"
              placeholder="Enter your email"
              className="login-input"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div style={{ position: "relative", marginBottom: "15px" }}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="login-input"
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box", margin: 0 }}
                required
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
              >
                👁️
              </span>
            </div>

            <div style={{ position: "relative", marginBottom: "15px" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="login-input"
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box", margin: 0 }}
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
              >
                👁️
              </span>
            </div>

            <button className="login-button">Reset Password</button>

            {/* 🔙 BACK TO LOGIN */}
            <p
              style={{
                marginTop: "10px",
                color: "#00d4ff",
                cursor: "pointer"
              }}
              onClick={() => setIsForgot(false)}
            >
              Back to Login
            </p>
          </form>
        )}

        {/* REGISTER LINK (only in login view) */}
        {!isForgot && (
          <a href="/register" className="register-link">
            New user? Register
          </a>
        )}

      </div>
    </div>
  );
}

export default Login;