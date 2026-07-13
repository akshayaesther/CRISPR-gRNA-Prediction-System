import React from "react";
import "./ScoreChart.css";

function ScoreChart({ score }) {

  const percent = Math.round(score * 100);
  const dash = 440 - (440 * percent) / 100;
  return (
    <div className="score-container">
      <div className="circle">
        <svg width="160" height="160">
          <circle
            cx="80"
            cy="80"
            r="70"
            className="bg"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            className="progress"
            style={{
              strokeDashoffset: 440 - (440 * percent) / 100
            }}
          />
        </svg>
      </div>
    </div>
  );
}

export default ScoreChart;