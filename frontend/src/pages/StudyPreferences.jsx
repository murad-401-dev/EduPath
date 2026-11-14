import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function StudyPreferences({ isSetup }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [preferredDegree, setPreferredDegree] = useState("");
  const [preferredSubject, setPreferredSubject] = useState("");
  const [preferredCountry, setPreferredCountry] = useState("");
  const [budget, setBudget] = useState("");
  const [intake, setIntake] = useState("");
  const [researchInterest, setResearchInterest] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(!isSetup);

  useEffect(() => {
    if (!token || isSetup) return;

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
        setPreferredDegree(data.preferredDegree || "");
        setPreferredSubject(data.preferredSubject || "");
        setPreferredCountry(data.preferredCountry || "");
        setBudget(data.budget || "");
        setIntake(data.intake || "");
        setResearchInterest(data.researchInterest || "");
      } catch (err) {
        setError("Could not connect to the server. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token, isSetup]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!preferredDegree || !preferredSubject || !preferredCountry) {
      setError("Preferred degree, subject and country are required");
      return;
    }
    if (budget !== "" && Number(budget) < 0) {
      setError("Budget must be a positive number");
      return;
    }

    try {
      const response = await fetch("/api/users/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          preferredDegree,
          preferredSubject,
          preferredCountry,
          budget,
          intake,
          researchInterest
        })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }
      if (isSetup) {
        navigate("/dashboard");
      } else {
        setSuccess(data.message);
      }
    } catch (err) {
      setError("Could not connect to the server. Is the backend running?");
    }
  }

  if (!token) {
    return (
      <div className="card">
        <p>
          Please <Link to="/login">log in</Link> to set your study preferences.
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
      {isSetup && <p className="step-label">Step 2 of 2</p>}
      <h2>Study Preferences</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="preferredDegree">Preferred Degree *</label>
        <select
          id="preferredDegree"
          value={preferredDegree}
          onChange={(e) => setPreferredDegree(e.target.value)}
        >
          <option value="">-- Select degree --</option>
          <option value="MSc">MSc</option>
          <option value="PhD">PhD</option>
        </select>

        <label htmlFor="preferredSubject">Field of Study *</label>
        <input
          id="preferredSubject"
          type="text"
          placeholder="e.g. Computer Science"
          value={preferredSubject}
          onChange={(e) => setPreferredSubject(e.target.value)}
        />

        <label htmlFor="preferredCountry">Preferred Country *</label>
        <input
          id="preferredCountry"
          type="text"
          placeholder="e.g. Germany"
          value={preferredCountry}
          onChange={(e) => setPreferredCountry(e.target.value)}
        />

        <label htmlFor="budget">Yearly Tuition Budget (USD)</label>
        <input
          id="budget"
          type="number"
          placeholder="e.g. 15000"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <label htmlFor="intake">Preferred Intake</label>
        <select id="intake" value={intake} onChange={(e) => setIntake(e.target.value)}>
          <option value="">-- Select intake --</option>
          <option value="Spring 2027">Spring 2027</option>
          <option value="Fall 2027">Fall 2027</option>
          <option value="Spring 2028">Spring 2028</option>
          <option value="Fall 2028">Fall 2028</option>
        </select>

        <label htmlFor="researchInterest">Research Interests</label>
        <textarea
          id="researchInterest"
          rows="3"
          placeholder="e.g. Machine learning, software testing"
          value={researchInterest}
          onChange={(e) => setResearchInterest(e.target.value)}
        />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="btn">
          {isSetup ? "Save and Go to Dashboard" : "Save Preferences"}
        </button>
      </form>
    </div>
  );
}

export default StudyPreferences;
