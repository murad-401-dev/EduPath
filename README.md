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
| FR-04 University & Program Search | Done (3 demo programs) |

## Module 1 Work Distribution

| Member | Feature |
|---|---|
| Farhan Jaman Ayon (Member 1) | FR-01 Registration, Login & Profile, FR-04 University & Program Search |
| Md. Alimun Kabir (Member 2) | FR-02 Academic Information |
| Md. Murad Hasan Mim (Member 3) | FR-03 Study Preferences, Project Setup |

## How to Run

You need **Node.js** and **MongoDB** (local install or an Atlas connection string).

### 1. Backend

```bash
cd backend
npm install
npm run seed     # only the first time: adds the demo programs
npm run dev
```

Create `backend/.env` if it does not exist:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/edupath
JWT_SECRET=any_long_random_text
```

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

Protected routes need the header `Authorization: Bearer <token>`.

Example: `GET /api/programs?country=Bangladesh&degree=MSc&subject=computer`

## Program Data

`npm run seed` adds 3 demo MSc programs of Daffodil International University (CSE, Software
Engineering, Cyber Security). Program names come from the DIU prospectus, but the **tuition values
are placeholders**, not official fees. To add more programs, edit the `demoPrograms` list in
`backend/seedPrograms.js` and run `npm run seed` again.

## Project Structure

```
backend/
  server.js                       Starts Express, connects routes
  db.js                           Connects to MongoDB
  seedPrograms.js                 Adds programs from its list (npm run seed)
  models/User.js                  Student schema (account, academic info, preferences)
  models/Program.js               Graduate program schema
  routes/userRoutes.js            /api/users URLs -> controller functions
  routes/programRoutes.js         /api/programs URL -> controller function
  controllers/userController.js   Register, login, get/update profile
  controllers/academicController.js    Save academic information
  controllers/preferenceController.js  Save study preferences
  controllers/programController.js     Search programs with filters
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
```

## User Flow

```
Register -> Step 1: Academic Information -> Step 2: Study Preferences -> Dashboard ("Hi, <name>")
Login    -> Dashboard
Navbar (logged in): Home | Program Search | ⋮ menu (Profile Management, Logout)
```

## How a Request Flows

```
React page  --fetch("/api/...")-->  Vite proxy  -->  Express route
   --> (authMiddleware checks token)  --> controller  --> Mongoose model  --> MongoDB
   <-- JSON response (data or error message) shown on the page
```
