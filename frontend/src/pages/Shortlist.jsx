import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Shortlist() {
  const token = localStorage.getItem("token");
  const [programs, setPrograms] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [selectedScholarships, setSelectedScholarships] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadShortlist() {
    try {
      const response = await fetch("/api/shortlist", {
        headers: { Authorization: "Bearer " + token }
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }
      setPrograms(data.programs);
      setScholarships(data.scholarships);
    } catch (err) {
      setError("Could not connect to the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      loadShortlist();
    }
  }, []);

  async function removeItem(itemType, itemId) {
    setMessage("");
    try {
      const response = await fetch("/api/shortlist/" + itemType + "/" + itemId, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
      });
      const data = await response.json();
      setMessage(data.message);
      setSelectedPrograms(selectedPrograms.filter((id) => id !== itemId));
      setSelectedScholarships(selectedScholarships.filter((id) => id !== itemId));
      loadShortlist();
    } catch (err) {
      setMessage("Could not connect to the server. Is the backend running?");
    }
  }

  function toggleProgram(id) {
    if (selectedPrograms.includes(id)) {
      setSelectedPrograms(selectedPrograms.filter((item) => item !== id));
    } else {
      setSelectedPrograms([...selectedPrograms, id]);
    }
  }

  function toggleScholarship(id) {
    if (selectedScholarships.includes(id)) {
      setSelectedScholarships(selectedScholarships.filter((item) => item !== id));
    } else {
      setSelectedScholarships([...selectedScholarships, id]);
    }
  }

  if (!token) {
    return (
      <div className="card">
        <p>
          Please <Link to="/login">log in</Link> to see your shortlist.
        </p>
      </div>
    );
  }

  if (loading) {
    return <p>Loading shortlist...</p>;
  }

  const programsToCompare = programs.filter((p) => selectedPrograms.includes(p._id));
  const scholarshipsToCompare = scholarships.filter((s) => selectedScholarships.includes(s._id));

  return (
    <div>
      <div className="card">
        <h2>My Shortlist</h2>
        <p className="muted">Tick two or more items of the same type to compare them side by side.</p>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
      </div>

      <div className="card">
        <h3>Programs ({programs.length})</h3>
        {programs.length === 0 && (
          <p className="muted">
            No programs yet. Add them from <Link to="/matches">Matched Programs</Link>.
          </p>
        )}
        {programs.map((program) => (
          <div className="shortlist-row" key={program._id}>
            <label className="check-label">
              <input
                type="checkbox"
                checked={selectedPrograms.includes(program._id)}
                onChange={() => toggleProgram(program._id)}
              />
              {program.name} - {program.university}
            </label>
            <button className="btn-link" onClick={() => removeItem("program", program._id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      {programsToCompare.length >= 2 && (
        <div className="card table-wrap">
          <h3>Program Comparison</h3>
          <table className="compare-table">
            <thead>
              <tr>
                <th>Item</th>
                {programsToCompare.map((p) => (
                  <th key={p._id}>{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>University</td>
                {programsToCompare.map((p) => <td key={p._id}>{p.university}</td>)}
              </tr>
              <tr>
                <td>Degree</td>
                {programsToCompare.map((p) => <td key={p._id}>{p.degree}</td>)}
              </tr>
              <tr>
                <td>Subject</td>
                {programsToCompare.map((p) => <td key={p._id}>{p.subject}</td>)}
              </tr>
              <tr>
                <td>Tuition (USD/year)</td>
                {programsToCompare.map((p) => (
                  <td key={p._id}>{p.tuition === 0 ? "No tuition fee" : typeof p.tuition === "number" ? "About $" + p.tuition.toLocaleString() : "See official website"}</td>
                ))}
              </tr>
              <tr>
                <td>Duration</td>
                {programsToCompare.map((p) => <td key={p._id}>{p.duration || "-"}</td>)}
              </tr>
              <tr>
                <td>Minimum CGPA</td>
                {programsToCompare.map((p) => <td key={p._id}>{p.minCgpa || "-"}</td>)}
              </tr>
              <tr>
                <td>Requirements</td>
                {programsToCompare.map((p) => <td key={p._id}>{p.requirements || "-"}</td>)}
              </tr>
              <tr>
                <td>Country</td>
                {programsToCompare.map((p) => <td key={p._id}>{p.country}</td>)}
              </tr>
              <tr>
                <td>Fee details</td>
                {programsToCompare.map((p) => <td key={p._id}>{p.tuitionNote || "-"}</td>)}
              </tr>
              <tr>
                <td>Minimum IELTS</td>
                {programsToCompare.map((p) => <td key={p._id}>{p.minIelts || "-"}</td>)}
              </tr>
              <tr>
                <td>Official website</td>
                {programsToCompare.map((p) => (
                  <td key={p._id}>
                    <a href={p.applicationUrl} target="_blank" rel="noreferrer">Open</a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="card">
        <h3>Scholarships ({scholarships.length})</h3>
        {scholarships.length === 0 && (
          <p className="muted">
            No scholarships yet. Add them from <Link to="/scholarships">Scholarships</Link>.
          </p>
        )}
        {scholarships.map((scholarship) => (
          <div className="shortlist-row" key={scholarship._id}>
            <label className="check-label">
              <input
                type="checkbox"
                checked={selectedScholarships.includes(scholarship._id)}
                onChange={() => toggleScholarship(scholarship._id)}
              />
              {scholarship.name} - {scholarship.provider}
            </label>
            <button className="btn-link" onClick={() => removeItem("scholarship", scholarship._id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      {scholarshipsToCompare.length >= 2 && (
        <div className="card table-wrap">
          <h3>Scholarship Comparison</h3>
          <table className="compare-table">
            <thead>
              <tr>
                <th>Item</th>
                {scholarshipsToCompare.map((s) => (
                  <th key={s._id}>{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Provider</td>
                {scholarshipsToCompare.map((s) => <td key={s._id}>{s.provider}</td>)}
              </tr>
              <tr>
                <td>Study in</td>
                {scholarshipsToCompare.map((s) => <td key={s._id}>{s.country}</td>)}
              </tr>
              <tr>
                <td>Degree</td>
                {scholarshipsToCompare.map((s) => <td key={s._id}>{s.degree === "Any" ? "MSc and PhD" : s.degree}</td>)}
              </tr>
              <tr>
                <td>Benefits</td>
                {scholarshipsToCompare.map((s) => <td key={s._id}>{s.benefits}</td>)}
              </tr>
              <tr>
                <td>Minimum CGPA</td>
                {scholarshipsToCompare.map((s) => <td key={s._id}>{s.minCgpa ? s.minCgpa.toFixed(2) : "Not specified"}</td>)}
              </tr>
              <tr>
                <td>Work experience</td>
                {scholarshipsToCompare.map((s) => <td key={s._id}>{s.workExperienceYears ? s.workExperienceYears + " years" : "Not required"}</td>)}
              </tr>
              <tr>
                <td>Deadline</td>
                {scholarshipsToCompare.map((s) => <td key={s._id}>{s.deadlineNote || "-"}</td>)}
              </tr>
              <tr>
                <td>Official website</td>
                {scholarshipsToCompare.map((s) => (
                  <td key={s._id}>
                    <a href={s.officialUrl} target="_blank" rel="noreferrer">Open</a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Shortlist;
