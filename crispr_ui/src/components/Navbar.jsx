import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  return (

    <div className="navbar">

      <h3>CRISPR DL Platform</h3>

      <div className="nav-buttons">
        <button onClick={()=>navigate("/predict")}>
          Predictor
        </button>
        <button onClick={()=>navigate("/dashboard")}>
          Dashboard</button>
        <button onClick={logout}>
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;