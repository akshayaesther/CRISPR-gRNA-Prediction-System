import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Predictor from "./pages/Predictor";
import ManageAccount from "./pages/ManageAccount";
import ForgotPassword from "./pages/ForgotPassword";
import DLScore from "./pages/DLScore";


function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/predict" element={<Predictor />} />

        <Route path="/account" element={<ManageAccount />} /> 

        <Route path="/forgot" element={<ForgotPassword />} />

        <Route path="/dl-score" element={<DLScore />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;