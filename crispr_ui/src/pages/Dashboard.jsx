import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const predictions = JSON.parse(localStorage.getItem("predictions")) || [];
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPredictions, setTotalPredictions] = useState(0);
  useEffect(() => {
    fetch("http://localhost:5000/stats")
      .then(res => res.json())
      .then(data => {
        setTotalUsers(data.totalUsers);
        setTotalPredictions(data.totalPredictions);
      });
  }, []);
  return (

    <div>

      <Navbar />

      <div className="dashboard-container fade-in">
        <div className="dashboard-wrapper">
          <h2 className="greeting">
            Hi {user?.name || "User"} 👋
          </h2>
          <h1 className="dashboard-title">
            CRISPR DL Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Welcome to the AI powered gRNA prediction platform
          </p>
          <div className="analytics-row">
            <div className="analytics-card">
              <h3>👥Total Users</h3>
              <p>{totalUsers}</p>
            </div>
  
            <div className="analytics-card">
              <h3>🧬Sequences Predicted</h3>
              <p>{totalPredictions}</p>
            </div>
          </div>
          <div className="cards-row">
            <div className="card"
              onClick={() => navigate("/predict")}>
              <h2>🧬 Predictor</h2>
              <p>Predict gRNA efficiency using AI</p>
            </div>

            <div className="card"
              onClick={() => navigate("/dl-score")}>
              <h2>📊 DL Score</h2>
              <p>Visualize model prediction scores</p>
            </div>
            <div className="card">
              <h2>⚙️Settings</h2>
              <p
                className="account-link"
                onClick={() => navigate("/account")}
              >
                Manage Account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Dashboard;