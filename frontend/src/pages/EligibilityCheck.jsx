import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const countries = [
  "Australia",
  "Canada",
  "Finland",
  "Germany",
  "Italy",
  "Japan",
  "Malaysia",
  "Netherlands",
  "South Korea",
  "Sweden",
  "United Kingdom",
  "USA"
];

function EligibilityCheck() {
  const token = localStorage.getItem("token");
  const [searchParams] = useSearchParams();
  const programFromLink = searchParams.get("program") || "";

  const [country, setCountry] = useState("");
  const [degree, setDegree] = useState("");
  const [subject, setSubject] = useState("");
  const [filtersReady, setFiltersReady] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState(programFromLink);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    async function loadPreferredDegree() {
      if (token && !programFromLink) {
        try {
          const response = await fetch("/api/users/profile", {
            headers: { Authorization: "Bearer " + token }
          });
          const data = await response.json();
          if (response.ok && data.preferredDegree) {
            setDegree(data.preferredDegree);
          }
        } catch (err) {
          setError("Could not connect to the server. Is the backend running?");
        }
      }
      setFiltersReady(true);
    }

    loadPreferredDegree();
  }, []);

  useEffect(() => {
    if (!filtersReady) {
      return;
    }

    const timer = setTimeout(async () => {
      const params = new URLSearchParams();
      if (country) params.append("country", country);
      if (degree) params.append("degree", degree);
      if (subject.trim()) params.append("subject", subject.trim());

      try {
        const response = await fetch("/api/programs?" + params.toString());
        const data = await response.json();
        if (response.ok) {
          setPrograms(data);
          if (!data.some((program) => program._id === programId)) {
            setProgramId("");
          }
        }
      } catch (err) {
        setError("Could not connect to the server. Is the backend running?");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [filtersReady, country, degree, subject]);

  const programsByCountry = {};
  programs.forEach((program) => {
    if (!programsByCountry[program.country]) {
      programsByCountry[program.country] = [];
    }
    programsByCountry[program.country].push(program);
  });

  async function handleCheck(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!programId) {
      setError("Please select a program");
      return;
    }

    setChecking(true);
    try {
      const response = await fetch("/api/eligibility/" + programId, {
        method: "POST",
        headers: { Authorization: "Bearer " + token }
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Could not connect to the server. Is the backend running?");
    }
    setChecking(false);
  }

  if (!token) {
    return (
      <div className="card">
        <p>
          Please <Link to="/login">log in</Link> to check your eligibility.
        </p>
      </div>
    );
  }

  let badgeClass = "badge badge-no";
  if (result && result.status === "Eligible") badgeClass = "badge badge-yes";
  if (result && result.status === "Partially Eligible") badgeClass = "badge badge-partial";

  return (
    <div>
      <div className="card form-card eligibility-card">
        <h2>AI Eligibility Check</h2>
        <p className="muted">
          Your academic information is compared with the program requirements using Gemini AI.
        </p>
        <form onSubmit={handleCheck}>
          <div className="filter-row">
            <div>
              <label htmlFor="filterCountry">Country</label>
              <select id="filterCountry" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">All countries</option>
                {countries.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filterDegree">Degree</label>
              <select id="filterDegree" value={degree} onChange={(e) => setDegree(e.target.value)}>
                <option value="">All degrees</option>
                <option value="MSc">MSc</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label htmlFor="filterSubject">Subject</label>
              <input
                id="filterSubject"
                type="text"
                placeholder="e.g. CS, SWE, AI"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          <label htmlFor="program">Program ({programs.length} found)</label>
          <select
            id="program"
            value={programId}
            onChange={(e) => {
              setProgramId(e.target.value);
              setResult(null);
            }}
          >
            <option value="">-- Select a program --</option>
            {Object.keys(programsByCountry).map((countryName) => (
              <optgroup key={countryName} label={countryName}>
                {programsByCountry[countryName].map((program) => (
                  <option key={program._id} value={program._id}>
                    {program.university} - {program.name} ({program.degree})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn" disabled={checking}>
            {checking ? "Checking with AI..." : "Check Eligibility"}
          </button>
        </form>
      </div>

      {result && (
        <div className="card form-card eligibility-card">
          <h3>{result.program.name}</h3>
          <p className="muted">{result.program.university}</p>
          <p>
            <span className={badgeClass}>{result.status}</span>
          </p>
          {result.summary && <p>{result.summary}</p>}

          <h4>Matched requirements</h4>
          {result.matchedRequirements.length === 0 ? (
            <p className="muted">None</p>
          ) : (
            <ul>
              {result.matchedRequirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}

          <h4>Missing requirements</h4>
          {result.missingRequirements.length === 0 ? (
            <p className="muted">None</p>
          ) : (
            <ul>
              {result.missingRequirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default EligibilityCheck;
