import { useState, useEffect } from "react";

function ProgramSearch() {
  const [country, setCountry] = useState("Bangladesh");
  const [degree, setDegree] = useState("");
  const [subject, setSubject] = useState("");
  const [maxTuition, setMaxTuition] = useState("");
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function searchPrograms(filters) {
    setError("");
    setLoading(true);

    const params = new URLSearchParams();
    if (filters.country) params.append("country", filters.country);
    if (filters.degree) params.append("degree", filters.degree);
    if (filters.subject) params.append("subject", filters.subject);
    if (filters.maxTuition) params.append("maxTuition", filters.maxTuition);

    try {
      const response = await fetch("/api/programs?" + params.toString());
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setPrograms([]);
      } else {
        setPrograms(data);
      }
    } catch (err) {
      setError("Could not connect to the server. Is the backend running?");
    }
    setLoading(false);
  }

  useEffect(() => {
    searchPrograms({ country: "Bangladesh" });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (maxTuition !== "" && Number(maxTuition) < 0) {
      setError("Maximum tuition must be a positive number");
      return;
    }
    searchPrograms({ country, degree, subject, maxTuition });
  }

  return (
    <div>
      <div className="card">
        <h2>Search Graduate Programs</h2>

        <form onSubmit={handleSubmit}>
          <div className="filter-row">
            <div>
              <label htmlFor="country">Country</label>
              <select id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="Bangladesh">Bangladesh</option>
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

            <div>
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                placeholder="e.g. Computer"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="maxTuition">Max Tuition (USD/year)</label>
              <input
                id="maxTuition"
                type="number"
                placeholder="e.g. 20000"
                value={maxTuition}
                onChange={(e) => setMaxTuition(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn">Search</button>
        </form>
      </div>

      {error && <p className="error">{error}</p>}

      {loading && <p>Loading programs...</p>}

      {!loading && !error && programs.length === 0 && (
        <div className="card">
          <p>No programs found. Try changing the filters.</p>
        </div>
      )}

      {!loading && programs.length > 0 && (
        <div>
          <p>{programs.length} program(s) found</p>
          <div className="program-grid">
            {programs.map((program) => (
              <div className="card program-card" key={program._id}>
                <h3>{program.name}</h3>
                <p><strong>University:</strong> {program.university}</p>
                <p><strong>Country:</strong> {program.country}</p>
                <p><strong>Degree:</strong> {program.degree}</p>
                <p><strong>Subject:</strong> {program.subject}</p>
                <p><strong>Tuition:</strong> ${program.tuition.toLocaleString()} per year</p>
                {program.duration && <p><strong>Duration:</strong> {program.duration}</p>}
                {program.applicationUrl ? (
                  <a href={program.applicationUrl} target="_blank" rel="noreferrer">
                    Official application page
                  </a>
                ) : (
                  <p className="muted">Official link not available</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramSearch;
