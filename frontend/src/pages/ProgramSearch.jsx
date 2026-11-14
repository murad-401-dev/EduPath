import { useState, useEffect } from "react";

function ProgramSearch() {
  const [country, setCountry] = useState("");
  const [degree, setDegree] = useState("");
  const [subject, setSubject] = useState("");
  const [maxTuition, setMaxTuition] = useState("");
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [subjectList, setSubjectList] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchedSubject, setSearchedSubject] = useState("");

  async function loadSubjects() {
    try {
      const response = await fetch("/api/programs/subjects");
      if (response.ok) {
        setSubjectList(await response.json());
      }
    } catch (err) {
      setSubjectList([]);
    }
  }

  function getSuggestions() {
    const typed = subject.trim().toLowerCase();
    if (!typed) {
      return subjectList;
    }
    return subjectList.filter(
      (item) =>
        item.name.toLowerCase().includes(typed) ||
        item.shortNames.some((short) => short.toLowerCase().startsWith(typed))
    );
  }

  function fullSubjectName(text) {
    const typed = text.trim().toLowerCase();
    const found = subjectList.find((item) =>
      item.shortNames.some((short) => short.toLowerCase() === typed)
    );
    return found ? found.name : text.trim();
  }

  function chooseSubject(name) {
    setSubject(name);
    setShowSuggestions(false);
    setActiveIndex(-1);
    searchPrograms({ country, degree, subject: name, maxTuition });
  }

  function handleSubjectKeyDown(event) {
    const suggestions = getSuggestions();
    if (!showSuggestions || suggestions.length === 0) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((activeIndex + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(activeIndex <= 0 ? suggestions.length - 1 : activeIndex - 1);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      chooseSubject(suggestions[activeIndex].name);
    } else if (event.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  function highlight(text) {
    const typed = subject.trim();
    const start = text.toLowerCase().indexOf(typed.toLowerCase());
    if (!typed || start === -1) {
      return text;
    }
    return (
      <>
        {text.slice(0, start)}
        <mark>{text.slice(start, start + typed.length)}</mark>
        {text.slice(start + typed.length)}
      </>
    );
  }

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
        setSearchedSubject(filters.subject ? fullSubjectName(filters.subject) : "");
      }
    } catch (err) {
      setError("Could not connect to the server. Is the backend running?");
    }
    setLoading(false);
  }

  useEffect(() => {
    searchPrograms({});
    loadSubjects();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setShowSuggestions(false);
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
                <option value="">All countries</option>
                <option value="Australia">Australia</option>
                <option value="Canada">Canada</option>
                <option value="Finland">Finland</option>
                <option value="Germany">Germany</option>
                <option value="Italy">Italy</option>
                <option value="Japan">Japan</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Netherlands">Netherlands</option>
                <option value="South Korea">South Korea</option>
                <option value="Sweden">Sweden</option>
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

            <div className="suggest-box">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                placeholder="e.g. CS, SWE, AI"
                autoComplete="off"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setShowSuggestions(true);
                  setActiveIndex(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setShowSuggestions(false)}
                onKeyDown={handleSubjectKeyDown}
              />
              {showSuggestions && getSuggestions().length > 0 && (
                <ul className="suggest-list">
                  {getSuggestions().map((item, index) => (
                    <li
                      key={item.name}
                      className={index === activeIndex ? "suggest-item active" : "suggest-item"}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        chooseSubject(item.name);
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <div>
                        <span className="suggest-name">{highlight(item.name)}</span>
                        <span className="suggest-short">{item.shortNames.join(" · ")}</span>
                      </div>
                      <span className="suggest-count">{item.count} programs</span>
                    </li>
                  ))}
                </ul>
              )}
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
          <p>
            {programs.length} program(s) found
            {searchedSubject && (
              <>
                {" "}for <strong>{searchedSubject}</strong>
              </>
            )}
          </p>
          <div className="program-grid">
            {programs.map((program) => (
              <div className="card program-card" key={program._id}>
                <h3>{program.name}</h3>
                <p><strong>University:</strong> {program.university}</p>
                <p><strong>Country:</strong> {program.country}</p>
                <p><strong>Degree:</strong> {program.degree}</p>
                <p><strong>Subject:</strong> {program.subject}</p>
                <p>
                  <strong>Tuition:</strong>{" "}
                  {program.tuition === 0
                    ? "No tuition fee"
                    : typeof program.tuition === "number"
                    ? "About $" + program.tuition.toLocaleString() + " per year"
                    : "See official website"}
                </p>
                {program.tuitionNote && <p className="muted">{program.tuitionNote}</p>}
                {program.duration && <p><strong>Duration:</strong> {program.duration}</p>}
                {program.minCgpa && <p><strong>Minimum CGPA:</strong> {program.minCgpa.toFixed(2)}</p>}
                {program.minIelts && <p><strong>Minimum IELTS:</strong> {program.minIelts}</p>}
                {program.requirements && <p><strong>Requirements:</strong> {program.requirements}</p>}
                <p className="muted">Last verified: {program.lastVerified.slice(0, 10)}</p>
                <a href={program.applicationUrl} target="_blank" rel="noreferrer">
                  Official website
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramSearch;
