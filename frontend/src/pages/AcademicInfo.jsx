import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function AcademicInfo({ isSetup }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [degree, setDegree] = useState("");
  const [major, setMajor] = useState("");
  const [university, setUniversity] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [ieltsScore, setIeltsScore] = useState("");
  const [toeflScore, setToeflScore] = useState("");
  const [greScore, setGreScore] = useState("");
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
        setDegree(data.degree || "");
        setMajor(data.major || "");
        setUniversity(data.university || "");
        setCgpa(data.cgpa || "");
        setGraduationYear(data.graduationYear || "");
        setIeltsScore(data.ieltsScore || "");
        setToeflScore(data.toeflScore || "");
        setGreScore(data.greScore || "");
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

    if (!degree || !major || !university || cgpa === "" || graduationYear === "") {
      setError("Degree, major, university, CGPA and graduation year are required");
      return;
    }
    if (Number(cgpa) < 0 || Number(cgpa) > 4) {
      setError("CGPA must be between 0 and 4");
      return;
    }
    if (ieltsScore !== "" && (Number(ieltsScore) < 0 || Number(ieltsScore) > 9)) {
      setError("IELTS score must be between 0 and 9");
      return;
    }
    if (toeflScore !== "" && (Number(toeflScore) < 0 || Number(toeflScore) > 120)) {
      setError("TOEFL score must be between 0 and 120");
      return;
    }
    if (greScore !== "" && (Number(greScore) < 260 || Number(greScore) > 340)) {
      setError("GRE score must be between 260 and 340");
      return;
    }

    try {
      const response = await fetch("/api/users/academic", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          degree,
          major,
          university,
          cgpa,
          graduationYear,
          ieltsScore,
          toeflScore,
          greScore
        })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }
      if (isSetup) {
        navigate("/setup/preferences");
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
          Please <Link to="/login">log in</Link> to add your academic information.
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
      {isSetup && <p className="step-label">Step 1 of 2</p>}
      <h2>Academic Information</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="degree">Current / Completed Degree *</label>
        <select id="degree" value={degree} onChange={(e) => setDegree(e.target.value)}>
          <option value="">-- Select degree --</option>
          <option value="BSc">BSc</option>
          <option value="BBA">BBA</option>
          <option value="BA">BA</option>
          <option value="MSc">MSc</option>
          <option value="MBA">MBA</option>
          <option value="MA">MA</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="major">Major / Subject *</label>
        <input
          id="major"
          type="text"
          placeholder="e.g. Software Engineering"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
        />

        <label htmlFor="university">University *</label>
        <input
          id="university"
          type="text"
          placeholder="e.g. Daffodil International University"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
        />

        <label htmlFor="cgpa">CGPA (out of 4.00) *</label>
        <input
          id="cgpa"
          type="number"
          step="0.01"
          value={cgpa}
          onChange={(e) => setCgpa(e.target.value)}
        />

        <label htmlFor="graduationYear">Graduation Year *</label>
        <input
          id="graduationYear"
          type="number"
          placeholder="e.g. 2026"
          value={graduationYear}
          onChange={(e) => setGraduationYear(e.target.value)}
        />

        <h3>Test Scores (optional)</h3>

        <label htmlFor="ieltsScore">IELTS (0 - 9)</label>
        <input
          id="ieltsScore"
          type="number"
          step="0.5"
          value={ieltsScore}
          onChange={(e) => setIeltsScore(e.target.value)}
        />

        <label htmlFor="toeflScore">TOEFL iBT (0 - 120)</label>
        <input
          id="toeflScore"
          type="number"
          value={toeflScore}
          onChange={(e) => setToeflScore(e.target.value)}
        />

        <label htmlFor="greScore">GRE (260 - 340)</label>
        <input
          id="greScore"
          type="number"
          value={greScore}
          onChange={(e) => setGreScore(e.target.value)}
        />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="btn">
          {isSetup ? "Save and Continue" : "Save Academic Information"}
        </button>
      </form>
    </div>
  );
}

export default AcademicInfo;
