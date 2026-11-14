import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const token = localStorage.getItem("token");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

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
        setEmail(data.email);
      } catch (err) {
        setError("Could not connect to the server. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email) {
      setError("Name and email are required");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ name, email })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }
      setSuccess(data.message);
    } catch (err) {
      setError("Could not connect to the server. Is the backend running?");
    }
  }

  if (!token) {
    return (
      <div className="card">
        <p>
          Please <Link to="/login">log in</Link> to view your profile.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card form-card">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="card form-card">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="btn">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
