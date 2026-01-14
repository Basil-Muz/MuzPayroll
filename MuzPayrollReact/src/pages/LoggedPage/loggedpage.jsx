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

  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    control,
    setValue,
    formState: { errors }
  } = useForm();

  const [companyName, setCompanyName] = useState("");

  //  Fields lock (restore from localStorage)
  const [fieldsLocked, setFieldsLocked] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("loginData") || "{}");
    return stored.fieldsLocked ?? true;
  });

  // Sidebar
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

  // Dropdown values
  const [companyId, setCompanyId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [finYear, setFinYear] = useState("");

  const [error, setError] = useState({});

  //  Dropdown lists
  const [companyList, setCompanyList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [backendError, setBackendError] = useState([]);


  // Load from localStorage
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    setCompanyId(String(user.companyId));
    setBranchId(String(user.branchId));
    setLocationId(String(user.locationId));
    setFinYear(user.finYear || getCurrentFinYear());


    fetchContextData(
      user.companyId,
      user.branchId,
      user.locationId,
      user.userCode
    );
  }, [user]);


  // Fetch dropdown data
  const fetchContextData = async (companyId, branchId, locationId, userCode) => {
    const res = await fetch(
      `http://localhost:8087/user-context?companyId=${companyId}&branchId=${branchId}&locationId=${locationId}&userCode=${userCode}`
    );

    const data = await res.json();

    const filteredBranches = (data.branchList || []).filter(
      b => b.companyEntity && String(b.companyEntity.companyMstID) === String(companyId)
    );
    if (filteredBranches.length === 0) {
      setBranchList([]);
      setLocationList([]);
      toast.error("No locations registered for this branch");
      return;
    }

    setBranchList(filteredBranches);
    setCompanyName(filteredBranches[0].companyEntity.company);

    const filteredLocations = (data.locationList || []).filter(
      l => l.branchEntity && String(l.branchEntity.branchMstID) === String(branchId)
    );

    if (filteredLocations.length === 0) {
      setLocationList([]);
      toast.error("No locations registered for this branch");
      return;
    }
    setLocationList(filteredLocations);



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


  /* ================= REACT-SELECT OPTIONS ================= */
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

  const finYearOption = finYear
    ? { value: finYear, label: finYear }
    : null;


  // ✅ FORM VALIDATION
  const validateForm = () => {
    const newErrors = {};

    if (branchList.length === 0) newErrors.branchId = "Branch is required";
    if (locationList.length === 0) newErrors.locationId = "Location is required";
    if (!finYear) newErrors.finYear = "Financial Year is required";

    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };



  // ✅ OK BUTTON
  const handleOk = () => {

    if (!validateForm()) return;
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
  const getCurrentFinYear = () => {
    const year = new Date().getFullYear();
    return `${year}-${year + 1}`;
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

                <Select
                  value={companyOption}
                  isDisabled={true}
                  placeholder="Company"
                  classNamePrefix="form-control-select"
                  options={companyOption ? [companyOption] : []}
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
                  rules={{ required: "Branch is required" }}
                  render={({ field }) => (
                    <Select
                      options={branchOptions}
                      placeholder="Select Branch"
                      isSearchable
                      value={
                        branchOptions.find(
                          opt => opt.value === field.value
                        ) || null
                      }
                      onChange={option => {
                        field.onChange(option.value);
                        setBranchId(option.value);
                        setValue("locationId", "");
                        setLocationId("");
                      }}
                      isDisabled={fieldsLocked}
                    />
                  )}
                />
                {errors.branchId && (
                  <p className="error-msg">{errors.branchId.message}</p>
                )}

              </div>

              <div className="logged-details">
                <label>FinYear</label>
                <Select
                  value={finYearOption}
                  isDisabled={true}
                  options={finYearOption ? [finYearOption] : []}
                  classNamePrefix="form-control-select"
                />
              </div>

              <div className="logged-details">
                <label>Location</label>
                <Controller
                  name="locationId"
                  control={control}
                  rules={{ required: "Location is required" }}
                  render={({ field }) => (
                    <Select
                      options={locationOptions}
                      placeholder="Select Location"
                      classNamePrefix={"form-control-select"}
                      isSearchable
                      value={
                        locationOptions.find(
                          opt => opt.value === field.value
                        ) || null
                      }
                      onChange={option => {
                        field.onChange(option.value);
                        setLocationId(option.value);
                      }}
                      isDisabled={fieldsLocked}
                    />
                  )}
                />
                {errors.locationId && (
                  <p className="error-msg">{errors.locationId.message}</p>
                )}
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
