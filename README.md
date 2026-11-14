# EduPath — Graduate Study and Scholarship Planning Platform

SE331 Software Engineering Design Capstone Project — Fall 2026
Daffodil International University — Group 01, Lab Section C1

**Team:** Farhan Jaman Ayon, Md. Alimun Kabir, Md. Murad Hasan Mim

EduPath helps students find suitable MSc/PhD programs and scholarships, check eligibility, and plan their applications.

## Tech Stack

- **Frontend:** React (with Vite), React Router, plain CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (local for development, MongoDB Atlas for deployment) using Mongoose
- **Authentication:** JWT, passwords hashed with bcryptjs

## Module 1 Progress

| Feature | Status |
|---|---|
| FR-01 Registration, Login & Profile | Done |
| FR-02 Academic Information | Done |
| FR-03 Study Preferences | Done |
| FR-04 University & Program Search | Done (27 real programs) |

## Module 1 Work Distribution

| Member | Feature |
|---|---|
| Farhan Jaman Ayon (Member 1) | FR-01 Registration, Login & Profile, FR-04 University & Program Search |
| Md. Alimun Kabir (Member 2) | FR-02 Academic Information |
| Md. Murad Hasan Mim (Member 3) | FR-03 Study Preferences, Project Setup |

## Module 2 Progress

| Feature | Status |
|---|---|
| FR-05 AI-Based Program Eligibility Checking (Gemini) | Done (needs `GEMINI_API_KEY`) |
| FR-06 Personalized Program Matching | Done |
| FR-07 Scholarship Search & Eligibility | Done (9 real scholarships) |
| FR-08 Program/Scholarship Comparison & Shortlisting | Done |

## Module 2 Work Distribution

| Member | Feature |
|---|---|
| Farhan Jaman Ayon (Member 1) | FR-07 Scholarship Search & Eligibility |
| Md. Alimun Kabir (Member 2) | FR-05 AI-Based Program Eligibility Checking, FR-08 Comparison & Shortlisting |
| Md. Murad Hasan Mim (Member 3) | FR-06 Personalized Program Matching, Module 2 Setup |

## How to Run

You need **Node.js** and **MongoDB** (local install or an Atlas connection string).

### 1. Backend

```bash
cd backend
npm install
npm run seed                # only the first time: adds the real programs
npm run seed-scholarships   # only the first time: adds the real scholarships
npm run dev
```

Create `backend/.env` if it does not exist:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/edupath
JWT_SECRET=any_long_random_text
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
```

Get a free Gemini API key from https://aistudio.google.com/app/apikey. Never commit it.

You should see `Server running on http://localhost:5000` and `MongoDB connected`.

### 2. Frontend (in a second terminal)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## API Endpoints

| Method | URL | Description | Login needed |
|---|---|---|---|
| POST | /api/users/register | Create an account | No |
| POST | /api/users/login | Log in, returns a JWT token | No |
| GET | /api/users/profile | Get the logged-in student's data | Yes |
| PUT | /api/users/profile | Update name and email | Yes |
| PUT | /api/users/academic | Save academic information | Yes |
| PUT | /api/users/preferences | Save study preferences | Yes |
| GET | /api/programs | Search programs. Optional query: `country`, `degree`, `subject`, `maxTuition` | No |
| GET | /api/programs/subjects | Subject suggestions with short names (CS, SWE, AI, IT) and program counts | No |
| POST | /api/eligibility/:programId | AI eligibility check with Gemini (FR-05) | Yes |
| GET | /api/matches | Programs in the preferred subject with matching score, highest first (FR-06) | Yes |
| GET | /api/scholarships | Scholarships with eligibility. Optional query: `country`, `degree` (FR-07) | Yes |
| POST | /api/scholarships/:id/ai-check | AI (Gemini) eligibility check for one scholarship: matched, missing, to verify, summary (FR-07) | Yes |
| GET | /api/shortlist | Shortlisted programs and scholarships (FR-08) | Yes |
| POST | /api/shortlist | Add `{ itemType: "program" or "scholarship", itemId }` (FR-08) | Yes |
| DELETE | /api/shortlist/:itemType/:itemId | Remove from shortlist (FR-08) | Yes |

Protected routes need the header `Authorization: Bearer <token>`.

Example: `GET /api/programs?country=Germany&degree=MSc&subject=computer`

## Subject Search

The Subject box on Program Search shows suggestions while you type, with the number of programs for
each subject. You can use the mouse or the arrow keys and Enter. Short names also work: `CS` or `CSE`
finds all Computer Science programs, `SWE` or `SE` finds Software Engineering, `AI`, `IT` and
`Web` work the same way. The short names are kept in one place, `backend/utils/subjects.js`, and
Program Matching (FR-06) uses the same list, so a preference of "CS" matches Computer Science programs.
Matches only shows programs in the preferred subject: AI shows AI programs, SWE shows Software
Engineering programs, and CS shows Computer Science programs (including AI and Web Engineering, which
are Computer Science subjects). Each program is then scored out of 100: degree 30, subject 30,
country 20, budget 10 and CGPA 10.

## Choosing a Program for AI Eligibility

The Eligibility page has Country, Degree and Subject filters (the CS / SWE short names work here
too). The Degree filter starts from the student's preferred degree, and the program list is grouped by
country. Every program card on Matches also has a **Check Eligibility** button that
opens `/eligibility?program=<id>` with that program already selected.

## AI Scholarship Check

Every scholarship card has a **Check with AI** button. Gemini compares the student profile with the
scholarship (citizenship, degree level, CGPA, IELTS, requirements, deadline) and returns:
- `status`: Eligible, Partially Eligible or Not Eligible
- `matchedRequirements`, `missingRequirements` and `toVerify` (things the profile does not record,
  such as work experience or age)
- a short `summary`, which also says if the round is closed

The AI uses only the stored scholarship data, and Gemini returns a fixed JSON structure
(response schema). Both AI features share `backend/utils/gemini.js`, which retries once if Gemini fails.

## Program Data

`npm run seed` adds 27 real MSc and PhD programs in the countries Bangladeshi students choose most:
- USA: UT Dallas, Arizona State, University at Buffalo, Northeastern
- United Kingdom: Glasgow, Leeds, Nottingham, Manchester, Edinburgh, Sheffield, Birmingham
- Europe: Passau and TU Chemnitz (Germany), Aalto (Finland), TU Delft (Netherlands), KTH (Sweden),
  Politecnico di Milano (Italy)
- Others: University of Saskatchewan and Concordia (Canada), University of Tokyo (Japan), KAIST
  (South Korea), Universiti Malaya (Malaysia), UNSW (Australia)

Requirements, fees and links were taken from each official university page on 14 November 2026.

- `tuition` is an approximate yearly amount in USD, converted only for comparison and budget
  matching. The exact official fee in the original currency is in `tuitionNote`.
- When a university does not publish a yearly fee for international students, `tuition` is left
  empty and the app shows "See official website". These programs are not shown when a maximum
  tuition filter is used.
- Every program has its official link (`applicationUrl`) and a `lastVerified` date. Fees and
  requirements change every year, so always check the official website before applying.

`npm run seed-scholarships` adds 9 real scholarships that Bangladeshi students can apply for:
Chevening, Commonwealth Master's, Fulbright (Bangladesh), DAAD (including EPOS), Erasmus Mundus,
MEXT (Embassy Recommendation), Global Korea Scholarship, Australia Awards (Bangladesh) and
Türkiye Scholarships. The details were taken from each official website on 14 November 2026,
and every scholarship stores its official link and last verified date. Each card lists
what does not match the profile (degree level, CGPA) and the requirements to confirm on the official
website. For a full eligibility result, the student clicks Check with AI. Deadlines and amounts change every year, so always check the
official website before applying.

## Project Structure

```
backend/
  server.js                       Starts Express, connects routes
  db.js                           Connects to MongoDB
  utils/gemini.js                 Shared Gemini call (JSON schema and one retry) used by both AI checks
  utils/subjects.js               Subject short names (CS, SWE, AI...) used by search and matching
  seedPrograms.js                 Adds programs from its list (npm run seed)
  models/User.js                  Student schema (account, academic info, preferences)
  models/Program.js               Graduate program schema
  routes/userRoutes.js            /api/users URLs -> controller functions
  routes/programRoutes.js         /api/programs URL -> controller function
  controllers/userController.js   Register, login, get/update profile
  controllers/academicController.js    Save academic information
  controllers/preferenceController.js  Save study preferences
  controllers/programController.js     Search programs with filters
  controllers/eligibilityController.js AI eligibility check with Gemini (FR-05)
  controllers/matchController.js       Matching score for each program (FR-06)
  controllers/scholarshipController.js Scholarship search and eligibility (FR-07)
  controllers/shortlistController.js   Add, view and remove shortlist items (FR-08)
  models/Scholarship.js           Scholarship schema
  routes/eligibilityRoutes.js, matchRoutes.js, scholarshipRoutes.js, shortlistRoutes.js
  seedScholarships.js             Adds real scholarships (npm run seed-scholarships)
  middleware/authMiddleware.js    Checks the JWT token before protected routes
  .env                            Secret settings (not uploaded to GitHub)
frontend/
  index.html                      The single HTML page React runs inside
  vite.config.js                  Dev server settings, forwards /api to the backend
  src/main.jsx                    Starts React
  src/App.jsx                     Navigation bar and page routes
  src/style.css                   All styling
  src/pages/Home.jsx              Landing page (logged out)
  src/pages/Register.jsx          Registration form
  src/pages/Login.jsx             Login form
  src/pages/Dashboard.jsx         "Hi, <name>" page after login
  src/pages/ProfileManagement.jsx Tabs: Profile / Academic Information / Study Preferences
  src/pages/Profile.jsx           Edit name and email
  src/pages/AcademicInfo.jsx      Academic information form (setup step 1 or edit)
  src/pages/StudyPreferences.jsx  Study preferences form (setup step 2 or edit)
  src/pages/ProgramSearch.jsx     Program search filters and result cards
  src/pages/EligibilityCheck.jsx  AI eligibility check (FR-05)
  src/pages/ProgramMatches.jsx    Matched programs with score (FR-06)
  src/pages/Scholarships.jsx      Scholarship search with eligibility (FR-07)
  src/pages/Shortlist.jsx         Shortlist and side-by-side comparison (FR-08)
```

## User Flow

```
Register -> Step 1: Academic Information -> Step 2: Study Preferences -> Dashboard ("Hi, <name>")
Login    -> Dashboard
Navbar (logged in): Home | Program Search | Eligibility | Matches | Scholarships | Shortlist | ⋮ menu (Profile Management, Logout)
```

## How a Request Flows

```
React page  --fetch("/api/...")-->  Vite proxy  -->  Express route
   --> (authMiddleware checks token)  --> controller  --> Mongoose model  --> MongoDB
   <-- JSON response (data or error message) shown on the page
```
