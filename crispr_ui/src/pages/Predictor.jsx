import { useState } from "react";
import "../styles/Predictor.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import DNAHelix from "../components/DNAHelix";
import LoadingAI from "../components/LoadingAI";
import ScoreChart from "../components/ScoreChart";
import DNASequence from "../components/DNASequence";
import axios from "axios";
import * as XLSX from "xlsx";

function Predictor() {
  const [loading, setLoading] = useState(false);
  const [sequence, setSequence] = useState("");
  const [score, setScore] = useState(null);
  const [batchResults, setBatchResults] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const logout = () => {
    navigate("/");
  }

  function predict() {

    setLoading(true);
    setTimeout(()=>{
      generatePrediction();
    }, 2000);
    
  }
  async function generatePrediction(){
    if (sequence.length !== 23) {
      alert("Please enter exactly 23 characters for the DNA sequence.");
      return;
    }
    
    setLoading(true);

    try {
      // ✅ Call the REAL AI Model (runs on 5001)
      const res = await axios.post("http://localhost:5001/predict", {
        sequence: sequence
      });
      
      let rawScore = parseFloat(res.data.score);
      // Ensure it displays like a percentage. If it's a probability (0-1), scale it.
      if (rawScore <= 1.0) {
        rawScore *= 100;
      }
      const finalScore = rawScore.toFixed(2);
      setScore(finalScore);

      // 🔥 SAVE TO DATABASE
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user._id) {
        await fetch("http://localhost:5000/save-prediction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: user._id, 
            sequence: sequence,
            result: finalScore
          })
        });
      }

      // ✅ Update Local Storage
      const history = JSON.parse(localStorage.getItem("predictions")) || [];
      history.push({
        sequence: sequence,
        score: parseFloat(finalScore)
      });
      localStorage.setItem("predictions", JSON.stringify(history));

    } catch (error) {
      console.log("Error generating prediction:", error);
      alert("Failed to reach the AI Model! Check if the python backend is running.");
      setScore(0);
    }

    setLoading(false);
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setScore(null);
    setBatchResults(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        let sequences = [];
        data.forEach(row => {
          row.forEach(cell => {
            if (typeof cell === 'string') {
              const cleaned = cell.trim().toUpperCase();
              if (cleaned.length === 23) {
                sequences.push(cleaned);
              }
            }
          });
        });

        // Deduplicate
        sequences = [...new Set(sequences)];

        if (sequences.length > 0) {
          generateBatchPrediction(sequences);
        } else {
          alert("No valid 23-character sequences found in the uploaded file.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error parsing file:", err);
        alert("Error parsing file. Please ensure it's a valid Excel or CSV file.");
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  async function generateBatchPrediction(sequences) {
    try {
      const res = await axios.post("http://localhost:5001/predict_batch", {
        sequences: sequences
      });
      
      let results = res.data.results;
      // Format scores
      results = results.map(r => {
        let rawScore = r.score;
        if (rawScore <= 1.0) {
          rawScore *= 100;
        }
        return { ...r, score: rawScore.toFixed(2) };
      });
      
      setBatchResults(results);
    } catch (error) {
      console.log("Error generating batch prediction:", error);
      alert("Failed to reach the AI Model or process batch! Check if the python backend is running.");
    }

    setLoading(false);
  }

  return (
    <div>
      <DNAHelix className="left-helix" />
      <DNAHelix className="right-helix" />
      <Navbar />

      <div className="predictor-container fade-in">


        <div className="predictor-card">

          <h2>gRNA Efficiency Predictor</h2>

          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#64ffda', textAlign: 'left' }}>Single Sequence:</h3>
          <input
            type="text"
            placeholder="Enter DNA sequence"
            className="predictor-input"
            maxLength={23}
            onChange={(e) => {
              setSequence(e.target.value);
              setScore(null);
              setBatchResults(null);
            }}
          />
          <DNASequence sequence={sequence} />
          <button
            className="predictor-button"
            onClick={predict}
          >

            Predict Efficiency

          </button>

          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#64ffda', textAlign: 'left' }}>Multi-Sequence(Upload Excel):</h3>
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileUpload} 
              style={{ color: '#fff', marginBottom: '15px' }}
            />
          </div>

          {loading && <LoadingAI />}

          {score && !batchResults && (

            <div className="result-box">

              Prediction Score: {score}%

              <ScoreChart score={score} />

            </div>


          )}

          {batchResults && (
            <div className="batch-results result-box fade-in" style={{ marginTop: '20px', overflowX: 'auto' }}>
              <h3 style={{ color: '#64ffda', marginBottom: '15px' }}>Ranked Sequences</h3>
              <table style={{ width: '100%', color: '#fff', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
                    <th style={{ padding: '10px' }}>Rank</th>
                    <th style={{ padding: '10px' }}>Sequence (23 chars)</th>
                    <th style={{ padding: '10px' }}>Score (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {batchResults.map((res, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <td style={{ padding: '10px' }}>#{idx + 1}</td>
                      <td style={{ padding: '10px', fontFamily: 'monospace', letterSpacing: '2px' }}>{res.sequence}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{res.score}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );

}

export default Predictor;



