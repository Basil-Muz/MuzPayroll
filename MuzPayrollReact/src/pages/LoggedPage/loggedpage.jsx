import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./loggedpage.css";
import muzLogo from "../../assets/muzlogo_transparent.png";
import Sidebar from "../../components/SideBar/Sidebar";

function LoggedPage() {
  console.log(" LoggedPage component rendered");
  const navigate = useNavigate();

  const loginDataRef = React.useRef(null);

  const [companyName, setCompanyName] = useState("");

  //  Fields lock
  const [fieldsLocked, setFieldsLocked] = useState(true);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("loginData") || "{}");
    return stored.sidebarOpen === true;
  });

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
  const [backendError, setBackendError] = useState([]);
  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("loginData");
    if (!stored) {
      navigate("/login");
      return;
    }

    const data = JSON.parse(stored);
    loginDataRef.current = data; // IMPORTANT

    setCompanyId(String(data.companyId));
    setBranchId(String(data.branchId));
    setLocationId(String(data.locationId));
    setFinYear(data.finYear || "");

    fetchContextData(
      data.companyId,
      data.branchId,
      data.locationId,
      data.userCode
    );
  }, []);


  // Fetch dropdown data
  const fetchContextData = async (companyId, branchId, locationId, userCode) => {
    const res = await fetch(
      `http://localhost:8087/user-context?companyId=${companyId}&branchId=${branchId}&locationId=${locationId}&userCode=${userCode}`
    );

    const data = await res.json();

    const filteredBranches = (data.branchList || []).filter(
      b => b.companyEntity && String(b.companyEntity.companyMstID) === String(companyId)
    );

    const filteredLocations = (data.locationList || []).filter(
      l => l.branchEntity && String(l.branchEntity.branchMstID) === String(branchId)
    );

    if (filteredBranches.length > 0) {
      setCompanyName(filteredBranches[0].companyEntity.company);
    }

    setBranchList(filteredBranches);
    setLocationList(filteredLocations);

    if (filteredLocations.length > 0) {
      const selectedLocation = filteredLocations.find(
        l => String(l.locationMstID) === String(locationId)
      );

      if (selectedLocation) {
        const stored = JSON.parse(localStorage.getItem("loginData") || "{}");

        localStorage.setItem(
          "loginData",
          JSON.stringify({
            ...stored,
            locationName: selectedLocation.location, // ✅ location name
          })
        );
      }
    }

  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("loginData"));
    if (!stored || fieldsLocked) return;

    fetchContextData(
      companyId,
      branchId,
      locationId,
      stored.userCode
    );
  }, [branchId]);


  // ✅ OK BUTTON
  const handleOk = () => {
    const stored = JSON.parse(localStorage.getItem("loginData") || "{}");

    const selectedBranch = branchList.find(
      b => String(b.branchMstID) === String(branchId)
    );

    const selectedLocation = locationList.find(
      l => String(l.locationMstID) === String(locationId)
    );

    localStorage.setItem(
      "loginData",
      JSON.stringify({
        ...stored,
        companyId,
        branchId,
        branchName: selectedBranch?.branch || "",
        locationId,
        locationName: selectedLocation?.location || "",
        finYear,
        sidebarOpen: true,
        fieldsLocked: true,
        okEnabled: false,
        changeEnabled: true,
      })
    );

    setSidebarOpen(true);
    setFieldsLocked(true);
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
      <Header backendError={backendError} />
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
                <select disabled>
                  <option>
                    {companyName || "Company"}
                  </option>
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
                  onChange={(e) => setBranchId(e.target.value)}>
                    
                  {/* <option value="">Select Branch</option> */}
                  {branchList.map((b) => (
                    <option key={b.branchMstID} value={b.branchMstID}>
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
                  onChange={(e) => setLocationId(e.target.value)}>

                  {/* <option value="">Select Location</option> */}
                  {locationList.map((l) => (
                    <option key={l.locationMstID} value={l.locationMstID}>
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
                  disabled={!changeEnabled}>
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
