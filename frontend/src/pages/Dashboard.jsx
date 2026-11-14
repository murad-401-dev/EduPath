import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const token = localStorage.getItem("token");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    async function loadProfile() {
      try {
        const response = await fetch("/api/users/profile", {
          headers: { Authorization: "Bearer " + token }
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.message);
          return;
        }
        setName(data.name);
      } catch (err) {
        setError("Could not connect to the server. Is the backend running?");
      }
    }

    loadProfile();
  }, [token]);

  if (!token) {
    return (
      <div className="card">
        <p>
          Please <Link to="/login">log in</Link> to see your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="hero">
      {error ? <p className="error">{error}</p> : <h1>Hi, {name}</h1>}
    </div>
  );
}

export default Dashboard;
