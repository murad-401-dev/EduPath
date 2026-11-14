import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProgramMatches() {
  const token = localStorage.getItem("token");
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function loadMatches() {
      try {
        const response = await fetch("/api/matches", {
          headers: { Authorization: "Bearer " + token }
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.message);
          return;
        }
        setMatches(data);
      } catch (err) {
        setError("Could not connect to the server. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [token]);

  async function addToShortlist(programId) {
    setMessage("");
    try {
      const response = await fetch("/api/shortlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ itemType: "program", itemId: programId })
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Could not connect to the server. Is the backend running?");
    }
  }

  if (!token) {
    return (
      <div className="card">
        <p>
          Please <Link to="/login">log in</Link> to see your matched programs.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>Matched Programs</h2>
        <p className="muted">
          Only programs in your preferred subject are shown, scored out of 100 using your academic
          information and study preferences.
        </p>
        {message && <p className="success">{message}</p>}
      </div>

      {loading && <p>Loading matches...</p>}

      {error && (
        <div className="card">
          <p className="error">{error}</p>
          <p>
            <Link to="/profile">Go to Profile Management</Link>
          </p>
        </div>
      )}

      {!loading && !error && matches.length === 0 && (
        <div className="card">
          <p>No programs match your preferred subject yet.</p>
          <p className="muted">
            Try a broader subject such as CS in <Link to="/profile">Profile Management</Link>.
          </p>
        </div>
      )}

      <div className="program-grid">
        {matches.map((match) => (
          <div className="card program-card" key={match.program._id}>
            <h3>{match.program.name}</h3>
            <p>{match.program.university}, {match.program.country}</p>
            <p className="score-text">Match score: {match.score}%</p>
            <div className="score-bar">
              <div className="score-fill" style={{ width: match.score + "%" }}></div>
            </div>
            <ul className="reason-list">
              {match.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
            <div className="card-buttons">
              <Link className="btn btn-small btn-ai" to={"/eligibility?program=" + match.program._id}>
                Check Eligibility
              </Link>
              <button className="btn btn-small" onClick={() => addToShortlist(match.program._id)}>
                Add to Shortlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgramMatches;
