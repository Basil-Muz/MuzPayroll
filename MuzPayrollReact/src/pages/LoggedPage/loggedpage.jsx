import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./loggedpage.css";
import muzLogo from "../../assets/muzlogo_transparent.png";
import Sidebar from "../../components/SideBar/Sidebar";

function LoggedPage() {
  const navigate = useNavigate();

  //  Fields lock
  const [fieldsLocked, setFieldsLocked] = useState(true);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //  Button states (ONLY ONE TRUE)
  const [okEnabled, setOkEnabled] = useState(true);
  const [changeEnabled, setChangeEnabled] = useState(false);

  // Dropdown values
  const [companyId, setCompanyId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [finYear, setFinYear] = useState("");


  //  Dropdown lists
  const [companyList, setCompanyList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [locationList, setLocationList] = useState([]);

  // Load from localStorage
  useEffect(() => {
  const stored = localStorage.getItem("loginData");

  if (!stored) {
    navigate("/login");
    return;
  }

  const data = JSON.parse(stored);

  setCompanyId(Number(data.companyId));
  setBranchId(Number(data.branchId));
  setLocationId(Number(data.locationId));
  setFinYear(data.finYear || "");

  setSidebarOpen(data.sidebarOpen === true);

  // Restore UI state
  setFieldsLocked(data.fieldsLocked ?? true);
  setOkEnabled(data.okEnabled ?? true);
  setChangeEnabled(data.changeEnabled ?? false);

  fetchContextData(
    data.companyId,
    data.branchId,
    data.locationId,
    data.userCode
  );
}, [navigate]);


  // Fetch dropdown data
  const fetchContextData = async (companyId, branchId, locationId, userCode ) => {
    try {
      const res = await fetch(
     `http://localhost:8087/user-context?companyId=${companyId}&branchId=${branchId}&locationId=${locationId}&userCode=${userCode}`
      );
      const data = await res.json();
      

      setCompanyList(data.companyList || []);
      setBranchList(data.branchList || []);
      setLocationList(data.locationList || []);


      const stored = JSON.parse(localStorage.getItem("loginData"));

    localStorage.setItem(
      "loginData",
      JSON.stringify({
        ...stored,
        userName: data.userName,
        locationName: data.locationName,
      })
    );

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ OK BUTTON
  const handleOk = () => {
  const stored = JSON.parse(localStorage.getItem("loginData"));

  localStorage.setItem(
    "loginData",
    JSON.stringify({
      ...stored,
      companyId,
      branchId,
      locationId,
      finYear,
      sidebarOpen: true,
      fieldsLocked: true,
      okEnabled: false,
      changeEnabled: true,
    })
  );

  setSidebarOpen(true);

  setFieldsLocked(true);
  setSidebarOpen(true);
  setOkEnabled(false);
  setChangeEnabled(true);
};


  // 🔁 CHANGE CREDENTIALS
 const handleChangeCredentials = () => {
  const stored = JSON.parse(localStorage.getItem("loginData"));

  localStorage.setItem(
    "loginData",
    JSON.stringify({
      ...stored,
      fieldsLocked: false,
      okEnabled: true,
      changeEnabled: false,
    })
  );

  setFieldsLocked(false);
  setOkEnabled(true);
  setChangeEnabled(false);
};


  return (
    <>
      <Header />
      <div className="main-section">
        <Sidebar forceOpen={sidebarOpen} />

        <div className="logo-homesection">
          <div className="left-section">
            <img src={muzLogo} alt="logo" className="home-logo" />
          </div>

          <div className="logged-container">
            <div className="logged-box">
              <h2 className="logged-heading">Login Credentials</h2>

              <div className="logged-details">
                <label>Company</label>
                <select value={companyId} disabled>
                  <option value="">Select Company</option>
                  {companyList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="logged-details">
                <label>Login Date</label>
                <input
                  type="date"
                  disabled
                  value={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="logged-details">
                <label>Branch</label>
                <select
                  value={branchId}
                  disabled={fieldsLocked}
                  onChange={(e) => setBranchId(e.target.value)}
                >
                  <option value="">Select Branch</option>
                  {branchList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.branch}
                    </option>
                  ))}
                </select>
              </div>

              <div className="logged-details">
                <label>FinYear</label>
              <select value={finYear} disabled={fieldsLocked}
              onChange={(e) => setFinYear(e.target.value)}>
                <option value="">Select Year</option>
                <option value="2023-2024">2023 - 2024</option>
                <option value="2024-2025">2024 - 2025</option>
                <option value="2025-2026">2025 - 2026</option>
                <option value="2026-2027">2026 - 2027</option>
              </select>

              </div>

              <div className="logged-details">
                <label>Location</label>
                <select
                  value={locationId}
                  disabled={fieldsLocked}
                  onChange={(e) => setLocationId(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {locationList.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.location}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  className="logged-btn"
                  onClick={handleOk}
                  disabled={!okEnabled}
                >
                  OK
                </button>

                <button
                  className="logged-btn"
                  onClick={handleChangeCredentials}
                  disabled={!changeEnabled}
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
