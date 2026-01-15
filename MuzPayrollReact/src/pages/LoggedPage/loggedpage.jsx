import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./loggedpage.css";
import muzLogo from "../../assets/muzlogo_transparent.png";
import Sidebar from "../../components/SideBar/Sidebar";
import { useAuth } from "../../context/AuthProvider";
import { toast } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

function LoggedPage() {

  /* ================= HELPER FUNCTIONS ================= */
  function getCurrentFinYear() {
    const year = new Date().getFullYear();
    return `${year}-${year + 1}`;
  }

  /* ================= HOOKS ================= */
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    control,
    setValue,
    formState: { errors }
  } = useForm();

  /* ================= STATE ================= */

  const [companyName, setCompanyName] = useState("");

  const [fieldsLocked, setFieldsLocked] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("loginData") || "{}");
    return stored.fieldsLocked ?? true;
  });

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("loginData") || "{}");
    return stored.sidebarOpen === true;
  });

  const [okEnabled, setOkEnabled] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("loginData") || "{}");
    return stored.okEnabled ?? true;
  });

  const [changeEnabled, setChangeEnabled] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("loginData") || "{}");
    return stored.changeEnabled ?? false;
  });

  const [companyId, setCompanyId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [finYear, setFinYear] = useState("");

  const [error, setError] = useState({});
  const [backendError, setBackendError] = useState([]);

  const [companyList, setCompanyList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [locationList, setLocationList] = useState([]);

  /* ================= EFFECTS ================= */

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    setCompanyId(String(user.companyId));
    setBranchId(String(user.branchId));
    setLocationId(String(user.locationId));
    setFinYear(user.finYear || getCurrentFinYear());

    setValue("branchId", String(user.branchId));
    setValue("locationId", String(user.locationId));

    fetchContextData(
      user.companyId,
      user.branchId,
      user.locationId,
      user.userCode
    );
  }, [user]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("loginData"));
    if (!stored || fieldsLocked || !branchId) return;

    fetchContextData(
      companyId,
      branchId,
      locationId || stored.locationId,
      stored.userCode
    );
  }, [branchId]);

  /* ================= API ================= */
  const fetchContextData = async (companyId, branchId, locationId, userCode) => {
    if (!companyId || !branchId) return;

    const res = await fetch(
      `http://localhost:8087/user-context?companyId=${companyId}&branchId=${branchId}&locationId=${locationId}&userCode=${userCode}`
    );

    const data = await res.json();

    const filteredBranches = (data.branchList || []).filter(
      b =>
        b.companyEntity &&
        String(b.companyEntity.companyMstID) === String(companyId)
    );

    if (filteredBranches.length === 0) {
      setBranchList([]);
      setLocationList([]);
      toast.error("No branches found");
      return;
    }

    setBranchList(filteredBranches);
    setCompanyName(filteredBranches[0].companyEntity.company);

    const filteredLocations = (data.locationList || []).filter(
      l =>
        l.branchEntity &&
        String(l.branchEntity.branchMstID) === String(branchId)
    );

    if (filteredLocations.length === 0) {
      setLocationList([]);
      toast.error("No locations registered for this branch");
      return;
    }

    setLocationList(filteredLocations);

    /* OLD LOGIC RESTORED: auto select first location */
    const selectedLocation =
      filteredLocations.find(
        l => String(l.locationMstID) === String(locationId)
      ) || filteredLocations[0];

    setLocationId(String(selectedLocation.locationMstID));
    setValue("locationId", String(selectedLocation.locationMstID));

    const stored = JSON.parse(localStorage.getItem("loginData") || {});
    localStorage.setItem(
      "loginData",
      JSON.stringify({
        ...stored,
        locationId: selectedLocation.locationMstID,
        locationName: selectedLocation.location
      })
    );
  };

  /* ================= SELECT OPTIONS ================= */
  const branchOptions = branchList.map(b => ({
    value: String(b.branchMstID),
    label: b.branch
  }));

  const locationOptions = locationList.map(l => ({
    value: String(l.locationMstID),
    label: l.location
  }));

  const companyOption = companyName
    ? { value: companyId, label: companyName }
    : null;

  const loginDate = new Date().toISOString().split("T")[0];
  const defaultFinYear = finYear || getCurrentFinYear();

  const finYearOptions = [
    { value: defaultFinYear, label: defaultFinYear },
    { value: "2024-2025", label: "2024-2025" },
    { value: "2025-2026", label: "2025-2026" },
    { value: "2027-2028", label: "2027-2028" }
  ];

  const finYearOption = finYearOptions.find(opt => opt.value === finYear);

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};

    if (!branchId) newErrors.branchId = "Branch is required";
    if (!locationId) newErrors.locationId = "Location is required";
    if (!finYear) newErrors.finYear = "Financial Year is required";

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= ACTIONS ================= */

  const handleOk = () => {
    if (!validateForm()) return;

    const stored = JSON.parse(localStorage.getItem("loginData") || {});
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
        changeEnabled: true
      })
    );

    setSidebarOpen(true);
    setFieldsLocked(true);
    setOkEnabled(false);
    setChangeEnabled(true);
  };

  const handleChangeCredentials = () => {
    const stored = JSON.parse(localStorage.getItem("loginData"));

    localStorage.setItem(
      "loginData",
      JSON.stringify({
        ...stored,
        fieldsLocked: false,
        okEnabled: true,
        changeEnabled: false
      })
    );

    setFieldsLocked(false);
    setOkEnabled(true);
    setChangeEnabled(false);
  };

  /* ================= UI ================= */
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
                <Select
                  value={companyOption}
                  isDisabled
                  options={companyOption ? [companyOption] : []}
                  classNamePrefix="form-control-select"
                />
              </div>

              <div className="logged-details">
                <label>Login Date</label>
                <Select
                  value={{ value: loginDate, label: loginDate }}
                  isDisabled
                  options={[{ value: loginDate, label: loginDate }]}
                  classNamePrefix="form-control-select"
                />
              </div>

              <div className="logged-details">
                <label>Branch</label>
                <Controller
                  name="branchId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={branchOptions}
                      value={branchOptions.find(opt => opt.value === field.value) || null}
                      onChange={opt => {
                        field.onChange(opt.value);
                        setBranchId(opt.value);
                      }}
                      isDisabled={fieldsLocked}
                      classNamePrefix="form-control-select"
                    />
                  )}
                />
              </div>

              <div className="logged-details">
                <label>FinYear</label>
                <Select
                  value={finYearOption}
                  options={finYearOptions}
                  isDisabled={fieldsLocked}
                  onChange={opt => setFinYear(opt.value)}
                  classNamePrefix="form-control-select"
                />
              </div>

              <div className="logged-details">
                <label>Location</label>
                <Controller
                  name="locationId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={locationOptions}
                      value={locationOptions.find(opt => opt.value === field.value) || null}
                      onChange={opt => {
                        field.onChange(opt.value);
                        setLocationId(opt.value);
                      }}
                      isDisabled={fieldsLocked}
                      classNamePrefix="form-control-select"
                    />
                  )}
                />
              </div>

              <div style={{ textAlign: "center"}} className="button-group">
                <button className="logged-btn" onClick={handleOk} disabled={!okEnabled}>
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
