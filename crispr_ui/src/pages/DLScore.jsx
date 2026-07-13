import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DLScore.css";
import Navbar from "../components/Navbar";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DLScore = () => {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("all");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchData = async () => {
      try {
        if (!user || !user._id) {
          // Provide mock data if no user exists so the chart still renders correctly and doesn't break
          setData([
            { name: "#1", score: 75, date: new Date(Date.now() - 5 * 86400000) },
            { name: "#2", score: 82, date: new Date(Date.now() - 3 * 86400000) },
            { name: "#3", score: 91, date: new Date(Date.now() - 1 * 86400000) },
          ]);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/prediction/${user._id}`
        );

        const formatted = res.data.map((item, index) => ({
          name: `#${index + 1}`,
          score: parseFloat(item.result),
          date: new Date(item.createdAt)
        }));

        setData(formatted);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

  }, []);

  const getFilteredData = () => {
    if (range === "all") return data;

    const days = range === "7" ? 7 : 30;
    const now = new Date();

    return data.filter(item => {
      const diff = (now - item.date) / (1000 * 60 * 60 * 24);
      return diff <= days;
    });
  };

  const filteredData = getFilteredData();

  const best = Math.max(...filteredData.map(d => d.score), 0);

  const avg = filteredData.length
    ? +(filteredData.reduce((sum, item) => sum + item.score, 0) / filteredData.length).toFixed(2)
    : 0;

  const chartData = {
    labels: filteredData.map(d => d.name),
    datasets: [
      {
        label: 'Score (%)',
        data: filteredData.map(d => d.score),
        borderColor: '#6366f1',
        backgroundColor: '#6366f1',
        borderWidth: 3,
        pointBackgroundColor: '#6366f1',
        pointRadius: 5,
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        padding: 10,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#94a3b8' },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };

  return (
    <div className="dl-page">
      <Navbar />

      <div className="dl-wrapper">

        <h1 className="dl-title">DL Score Analytics</h1>
        <div className="filter-bar">
          <button onClick={() => setRange("all")}>All</button>
          <button onClick={() => setRange("7")}>Last 7 Days</button>
          <button onClick={() => setRange("30")}>Last 30 Days</button>
        </div>
        {/* 🔥 Stats Cards */}
        <div className="dl-stats">
          <div className="stat-card">
            <p>Best Score</p>
            <h2>{best}%</h2>
          </div>

          <div className="stat-card">
            <p>Average</p>
            <h2>{avg}%</h2>
          </div>

          <div className="stat-card">
            <p>Total Predictions</p>
            <h2>{data.length}</h2>
          </div>
        </div>

        {/* 📊 Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Score Trend</h3>

          <div className="chart-wrapper" style={{ height: '350px', width: '100%', position: 'relative' }}>
             <Line data={chartData} options={chartOptions} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DLScore;