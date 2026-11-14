import { useState } from "react";
import Profile from "./Profile.jsx";
import AcademicInfo from "./AcademicInfo.jsx";
import StudyPreferences from "./StudyPreferences.jsx";

function ProfileManagement() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div>
      <div className="tabs">
        <button
          className={activeTab === "profile" ? "tab active" : "tab"}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={activeTab === "academic" ? "tab active" : "tab"}
          onClick={() => setActiveTab("academic")}
        >
          Academic Information
        </button>
        <button
          className={activeTab === "preferences" ? "tab active" : "tab"}
          onClick={() => setActiveTab("preferences")}
        >
          Study Preferences
        </button>
      </div>

      {activeTab === "profile" && <Profile />}
      {activeTab === "academic" && <AcademicInfo />}
      {activeTab === "preferences" && <StudyPreferences />}
    </div>
  );
}

export default ProfileManagement;
