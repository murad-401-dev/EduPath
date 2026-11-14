import { useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AcademicInfo from "./pages/AcademicInfo.jsx";
import StudyPreferences from "./pages/StudyPreferences.jsx";
import ProfileManagement from "./pages/ProfileManagement.jsx";
import ProgramSearch from "./pages/ProgramSearch.jsx";
import EligibilityCheck from "./pages/EligibilityCheck.jsx";
import ProgramMatches from "./pages/ProgramMatches.jsx";
import Scholarships from "./pages/Scholarships.jsx";
import Shortlist from "./pages/Shortlist.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setMenuOpen(false);
    navigate("/login");
  }

  return (
    <div>
      <nav className="navbar">
        <Link to={token ? "/dashboard" : "/"} className="logo">
          EduPath
        </Link>

        {!token && (
          <div className="nav-links">
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </div>
        )}

        {token && (
          <div className="nav-links">
            <Link to="/dashboard">Home</Link>
            <Link to="/programs">Program Search</Link>
            <Link to="/eligibility">Eligibility</Link>
            <Link to="/matches">Matches</Link>
            <Link to="/scholarships">Scholarships</Link>
            <Link to="/shortlist">Shortlist</Link>

            <div className="menu">
              <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                ⋮
              </button>
              {menuOpen && (
                <div className="dropdown">
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>
                    Profile Management
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Home />} />
          <Route path="/register" element={<Register setToken={setToken} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />

          <Route path="/setup/academic" element={<AcademicInfo isSetup={true} />} />
          <Route path="/setup/preferences" element={<StudyPreferences isSetup={true} />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfileManagement />} />
          <Route path="/programs" element={<ProgramSearch />} />

          <Route path="/eligibility" element={<EligibilityCheck />} />
          <Route path="/matches" element={<ProgramMatches />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/shortlist" element={<Shortlist />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
