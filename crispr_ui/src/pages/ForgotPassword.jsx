import { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function handleReset(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, newPassword })
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Something went wrong ❌");
    } else {
      navigate("/login");   // ✅ redirect silently
    }
  }

  return (
    <div className="login-container fade-in">
      <div className="login-card">

        <h2>Reset Password</h2>

        <form onSubmit={handleReset}>

          <input
            type="email"
            placeholder="Enter Email"
            className="login-input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="New Password"
            className="login-input"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button className="login-button">
            Update Password
          </button>

          <button
            type="button"
            className="login-button"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </form>

      </div>
    </div>
  );
}

export default ForgotPassword;