import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./loggedpage.css";
import muzLogo from "../../assets/muzlogo_transparent.png";
import Sidebar from "../../components/SideBar/Sidebar";


function LoggedPage() {
  const navigate = useNavigate();

  // TRUE = fields disabled
  const [fieldsLocked, setFieldsLocked] = useState(true);

  // NEW: controls Change Credentials button
  const [changeDisabled, setChangeDisabled] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);



  // Selected values
  const [companyId, setCompanyId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [finYear, setFinYear] = useState("");

  // Dropdown lists
  const [companyList, setCompanyList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [finYearList, setFinYearList] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("loginData");
    if (!stored) return;

    const data = JSON.parse(stored);

    setCompanyId(data.companyId);
    setBranchId(data.branchId);
    setLocationId(data.locationId);
    setFinYear(data.finYearId);

    setCompanyList(data.companyList || []);
    setBranchList(data.branchList || []);
    setLocationList(data.locationList || []);
    setFinYearList(data.finYearList || []);
  }, []);

  // OK → lock fields + disable change button
const handleOk = () => {
  setFieldsLocked(true);
  setChangeDisabled(true);
  setShowSidebar(true);   // sidebar feature enabled
  setSidebarOpen(true); // CLOSED initially
};



  // Change Credentials → unlock fields
  const handleChangeCredentials = () => {
    setFieldsLocked(false);
  };

    // 👉 ADD THESE TWO FUNCTIONS HERE
//   const toggleSidebar = () => {
//     setSidebarOpen((prev) => !prev);
//   };

//   const closeSidebar = () => {
//     setSidebarOpen(false);
//   };

  return (
    <>
      <Header />
     
<div className="main-section">
    <Sidebar toggleMenu={sidebarOpen}/>
      <div className="logo-homesection">
       
        <div className="left-section">
          <img src={muzLogo} alt="logo" className="home-logo" />
        </div>

        <div className="logged-container">
          <div className="logged-box">
            <h2 className="logged-heading">Login Credentials</h2>

            <div className="logged-details">
              <label>Company</label>
              <select value={companyId} disabled={fieldsLocked} onChange={(e) => setCompanyId(e.target.value)}>
                <option value="">Select Company</option>
                {companyList.map((c) => (
                  <option key={c.id} value={c.id}>{c.company}</option>
                ))}
              </select>
            </div>

            <div className="logged-details">
              <label>Login Date</label>
              <input type="date" disabled value={new Date().toISOString().split("T")[0]} style={{ width: "524px" }} />
            </div>

            <div className="logged-details">
              <label>FinYear</label>
              <select value={finYear} disabled={fieldsLocked} onChange={(e) => setFinYear(e.target.value)}>
                <option value="">Select Year</option>
                <option value="2023-2024">2023 - 2024</option>
                <option value="2024-2025">2024 - 2025</option>
                <option value="2025-2026">2025 - 2026</option>
                <option value="2026-2027">2026 - 2027</option>
              </select>
            </div>

            <div className="logged-details">
              <label>Branch</label>
              <select value={branchId} disabled={fieldsLocked} onChange={(e) => setBranchId(e.target.value)}>
                <option value="">Select Branch</option>
                {branchList.map((b) => (
                  <option key={b.id} value={b.id}>{b.branch}</option>
                ))}
              </select>
            </div>

            <div className="logged-details">
              <label>Location</label>
              <select value={locationId} disabled={fieldsLocked} onChange={(e) => setLocationId(e.target.value)}>
                <option value="">Select Location</option>
                {locationList.map((l) => (
                  <option key={l.id} value={l.id}>{l.location}</option>
                ))}
              </select>
            </div>

            <div style={{ textAlign: "center", marginTop: "2px" }}>
              <button className="logged-btn" onClick={handleOk}>OK</button>

              <button
                className="logged-btn"
                onClick={handleChangeCredentials}
                disabled={changeDisabled}
                style={{ opacity: changeDisabled ? 0.5 : 1, cursor: changeDisabled ? "not-allowed" : "pointer" }}
              >
                Change Credentials
              </button>
            </div>
          </div>
        </div>
      </div>
</div>


      <Footer />
    </>
  );
}

export default LoggedPage;
