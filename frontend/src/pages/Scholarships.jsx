import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Scholarships() {
  const token = localStorage.getItem("token");
  const [country, setCountry] = useState("");
  const [degree, setDegree] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResults, setAiResults] = useState({});
  const [aiChecking, setAiChecking] = useState([]);

  async function checkWithAI(scholarshipId) {
    setAiChecking((previous) => [...previous, scholarshipId]);
    try {
      const response = await fetch("/api/scholarships/" + scholarshipId + "/ai-check", {
        method: "POST",
        headers: { Authorization: "Bearer " + token }
      });
      const data = await response.json();
      const result = response.ok ? data : { error: data.message };
      setAiResults((previous) => ({ ...previous, [scholarshipId]: result }));
    } catch (err) {
      setAiResults((previous) => ({
        ...previous,
        [scholarshipId]: { error: "Could not connect to the server. Is the backend running?" }
      }));
    }
    setAiChecking((previous) => previous.filter((id) => id !== scholarshipId));
  }

  function aiBadgeClass(status) {
    if (status === "Eligible") return "badge badge-yes";
    if (status === "Partially Eligible") return "badge badge-partial";
    return "badge badge-no";
  }

  async function searchScholarships(filters) {
    setError("");
    setLoading(true);

    const params = new URLSearchParams();
    if (filters.country) params.append("country", filters.country);
    if (filters.degree) params.append("degree", filters.degree);

    try {
      const response = await fetch("/api/scholarships?" + params.toString(), {
        headers: { Authorization: "Bearer " + token }
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setResults([]);
      } else {
        setResults(data);
      }
    } catch (err) {
      setError("Could not connect to the server. Is the backend running?");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (token) {
      searchScholarships({});
    }
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    searchScholarships({ country, degree });
  }

  async function addToShortlist(scholarshipId) {
    setMessage("");
    try {
      const response = await fetch("/api/shortlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ itemType: "scholarship", itemId: scholarshipId })
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
          Please <Link to="/login">log in</Link> to search scholarships.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>Scholarships</h2>
        <form onSubmit={handleSubmit}>
          <div className="filter-row">
            <div>
              <label htmlFor="country">Country</label>
              <select id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">All countries</option>
                <option value="Australia">Australia</option>
                <option value="Europe">Europe</option>
                <option value="Germany">Germany</option>
                <option value="Japan">Japan</option>
                <option value="South Korea">South Korea</option>
                <option value="Turkey">Turkey</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="USA">USA</option>
              </select>
            </div>
            <div>
              <label htmlFor="degree">Degree</label>
              <select id="degree" value={degree} onChange={(e) => setDegree(e.target.value)}>
                <option value="">All degrees</option>
                <option value="MSc">MSc</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn">Search</button>
        </form>
        {message && <p className="success">{message}</p>}
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading scholarships...</p>}

      {!loading && !error && results.length === 0 && (
        <div className="card">
          <p>No scholarships found. Try changing the filters.</p>
        </div>
      )}

      <div className="program-grid">
        {results.map((item) => (
          <div className="card program-card" key={item.scholarship._id}>
            <h3>{item.scholarship.name}</h3>
            <p><strong>Provider:</strong> {item.scholarship.provider}</p>
            <p><strong>Study in:</strong> {item.scholarship.country}</p>
            <p><strong>Degree:</strong> {item.scholarship.degree === "Any" ? "MSc and PhD" : item.scholarship.degree}</p>
            <p><strong>Benefits:</strong> {item.scholarship.benefits}</p>
            {item.scholarship.minCgpa && (
              <p><strong>Minimum CGPA:</strong> {item.scholarship.minCgpa.toFixed(2)}</p>
            )}
            {item.scholarship.deadlineNote && (
              <p><strong>Deadline:</strong> {item.scholarship.deadlineNote}</p>
            )}
            {item.scholarship.howToApply && (
              <p><strong>How to apply:</strong> {item.scholarship.howToApply}</p>
            )}

            {item.missing.length > 0 && (
              <>
                <p className="list-title">Does not match your profile</p>
                <ul className="reason-list missing">
                  {item.missing.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </>
            )}

            {item.toConfirm.length > 0 && (
              <>
                <p className="list-title">Confirm on the official website</p>
                <ul className="reason-list">
                  {item.toConfirm.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </>
            )}

            {aiResults[item.scholarship._id] && (
              <div className="ai-box">
                <p className="ai-title">AI eligibility check</p>
                {aiResults[item.scholarship._id].error ? (
                  <p className="error">{aiResults[item.scholarship._id].error}</p>
                ) : (
                  <>
                    <span className={aiBadgeClass(aiResults[item.scholarship._id].status)}>
                      {aiResults[item.scholarship._id].status}
                    </span>
                    <p>{aiResults[item.scholarship._id].summary}</p>
                    {aiResults[item.scholarship._id].matchedRequirements.length > 0 && (
                      <>
                        <p className="list-title">You meet</p>
                        <ul className="reason-list">
                          {aiResults[item.scholarship._id].matchedRequirements.map((text, index) => (
                            <li key={index}>{text}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {aiResults[item.scholarship._id].missingRequirements.length > 0 && (
                      <>
                        <p className="list-title">You do not meet</p>
                        <ul className="reason-list missing">
                          {aiResults[item.scholarship._id].missingRequirements.map((text, index) => (
                            <li key={index}>{text}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {aiResults[item.scholarship._id].toVerify.length > 0 && (
                      <>
                        <p className="list-title">Please check yourself</p>
                        <ul className="reason-list verify">
                          {aiResults[item.scholarship._id].toVerify.map((text, index) => (
                            <li key={index}>{text}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            <p className="muted">
              Last verified: {item.scholarship.lastVerified.slice(0, 10)}
            </p>
            <div className="card-actions">
              <a href={item.scholarship.officialUrl} target="_blank" rel="noreferrer">
                Official website
              </a>
              <div className="card-buttons">
                <button
                  className="btn btn-small btn-ai"
                  disabled={aiChecking.includes(item.scholarship._id)}
                  onClick={() => checkWithAI(item.scholarship._id)}
                >
                  {aiChecking.includes(item.scholarship._id) ? "Checking with AI..." : "Check with AI"}
                </button>
                <button className="btn btn-small" onClick={() => addToShortlist(item.scholarship._id)}>
                  Add to Shortlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Scholarships;
