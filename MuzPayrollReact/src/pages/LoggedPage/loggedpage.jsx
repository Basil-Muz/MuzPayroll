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
    getValues,
    formState: { errors },
  } = useForm();



  // console.log(" Auth user:", user);
  // console.log(" Stored loginData:", JSON.parse(localStorage.getItem("loginData")));


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
    const stored = JSON.parse(localStorage.getItem("loginData"));

    if (!user && !stored) {
      navigate("/");
      return;
    }

    const source = user || stored;

    setCompanyId(String(source.companyId));
    setBranchId(String(source.branchId));
    setLocationId(String(source.locationId));
    setFinYear(source.finYear || getCurrentFinYear());

    setValue("branchId", String(source.branchId));
    setValue("locationId", String(source.locationId));

    fetchContextData(
      source.companyId,
      source.branchId,
      source.locationId,
      source.userCode,
    );
  }, [user]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("loginData"));
    if (!stored || fieldsLocked || !branchId) return;

    fetchContextData(
      companyId,
      branchId,
      locationId || stored.locationId,
      stored.userCode,
    );
  }, [branchId, fieldsLocked, companyId]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("loginData"));

    if (!stored) return;

    // Restore UI state
    setCompanyId(String(stored.companyId));
    setBranchId(String(stored.branchId));
    setLocationId(String(stored.locationId));
    setFinYear(stored.finYear || getCurrentFinYear());

    setCompanyName(stored.companyName || "");

    // Restore sidebar / button state
    setSidebarOpen(stored.sidebarOpen === true);
    setFieldsLocked(stored.fieldsLocked !== false);
    setOkEnabled(stored.okEnabled !== false);
    setChangeEnabled(stored.changeEnabled === true);
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("loginData"));
    if (!stored) return;

    fetchContextData(
      stored.companyId,
      stored.branchId,
      stored.locationId,
      stored.userCode,
    );
  }, []);

  /* ================= API ================= */
  const fetchContextData = async (
    companyId,
    branchId,
    locationId,
    userCode,
  ) => {
    // console.log("fetchContextData called");

    if (!companyId || !branchId) {
      // console.log(" Missing companyId / branchId");
      return;
    }

    const res = await fetch(
      `http://localhost:8087/user-context?companyId=${companyId}&branchId=${branchId}&locationId=${locationId}&userCode=${userCode}`,
    );
    // console.log("API URL:", res.url);

    const response = await res.json();
    // console.log("API raw response:", response);

    if (response.statusCode === 400) {
      const errorMsg = response.errors?.[0] || "Invalid context";
      toast.error(errorMsg);

      const stored = JSON.parse(localStorage.getItem("loginData") || "{}");

      // ✅ CASE: Branch exists but NO location
      if (
        errorMsg.toLowerCase().includes("location") ||
        errorMsg.toLowerCase().includes("no location")
      ) {
        //  clear ONLY location
        // setLocationList([]);
        // setLocationId("");
        // setValue("locationId", "");

        localStorage.setItem(
          "loginData",
          JSON.stringify({
            ...stored,
            locationId: "",
            locationName: "",
          }),
        );

        return;
      }

      //  CASE: Company / Branch invalid → clear both
      setBranchList([]);
      setLocationList([]);

      setBranchId("");
      setLocationId("");

      setValue("branchId", "");
      setValue("locationId", "");

      localStorage.setItem(
        "loginData",
        JSON.stringify({
          ...stored,
          branchId: "",
          branchName: "",
          locationId: "",
          locationName: "",
        }),
      );

      return;
    }

    const data = response.data;

    /* ================= BRANCH (✅ FIX HERE) ================= */
    const branchListFromApi =
      data.branchList || data.branches || data.branchMstList || [];

    if (branchListFromApi.length === 0) {
      // console.error(" No branches from backend");
      setBranchList([]);
      setLocationList([]);
      toast.error("No branches found");
      return;
    }

    setBranchList(branchListFromApi);

    if (data.company && data.company.company) {
      setCompanyName(data.company.company);
    }

    /* ================= LOCATION (✅ FIX HERE) ================= */
    const locationListFromApi =
      data.locationList || data.locations || data.locationMstList || [];

    if (locationListFromApi.length === 0) {
      // console.error(" No locations from backend");
      setLocationList([]);
      toast.error("No locations registered for this branch");
      return;
    }

    setLocationList(locationListFromApi);

    const selectedLocation =
      locationListFromApi.find(
        (l) => String(l.locationMstID) === String(locationId),
      ) || locationListFromApi[0];

    // console.log("selectedLocation:", selectedLocation);

    setLocationId(String(selectedLocation.locationMstID));
    setValue("locationId", String(selectedLocation.locationMstID));

    const stored = JSON.parse(localStorage.getItem("loginData") || {});

    localStorage.setItem(
      "loginData",
      JSON.stringify({
        ...stored,
        userCode: stored.userCode || userCode,
        locationId: selectedLocation.locationMstID,
        locationName: selectedLocation.location,
      }),
    );
  };

  /* ================= SELECT OPTIONS ================= */
  const branchOptions = branchList.map((b) => ({
    value: String(b.branchMstID),
    label: b.branch,
  }));

  const locationOptions = locationList.map((l) => ({
    value: String(l.locationMstID),
    label: l.location,
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
    { value: "2027-2028", label: "2027-2028" },
  ];

  const finYearOption = finYearOptions.find((opt) => opt.value === finYear);

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    if (fieldsLocked) return true;

    if (!branchId) {
      toast.error("Please select Branch");
      return false;
    }

    if (!locationId) {
      toast.error("Please select Location");
      return false;
    }

    return true;
  };

  /* ================= ACTIONS ================= */

  const handleOk = () => {
    if (!validateForm()) return;

    const stored = JSON.parse(localStorage.getItem("loginData") || {});
    const selectedBranch = branchList.find(
      (b) => String(b.branchMstID) === String(branchId),
    );
    const selectedLocation = locationList.find(
      (l) => String(l.locationMstID) === String(locationId),
    );

    localStorage.setItem(
      "loginData",
      JSON.stringify({
        ...stored,
        userCode: stored.userCode,
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
      }),
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
        userCode: stored.userCode,
        branchId: stored.branchId,
        locationId: stored.locationId,
        fieldsLocked: false,
        okEnabled: true,
        changeEnabled: false,
      }),
    );

    setFieldsLocked(false);
    setOkEnabled(true);
    setChangeEnabled(false);
  };

  // console.log(" branchOptions:", branchOptions);
  // console.log(" locationOptions:", locationOptions);
  // console.log(" selected branchId:", branchId);
  // console.log(" selected locationId:", locationId);

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
                      value={
                        branchOptions.find((opt) => opt.value === branchId) ||
                        null
                      }
                      onChange={(opt) => {
                        if (!opt) {
                          field.onChange("");
                          setBranchId("");
                          return;
                        }
                        field.onChange(opt.value);
                        setBranchId(opt.value);
                        setValue("branchId", opt.value);
                        setLocationList([]);
                        setValue("locationId", "");
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
                  onChange={(opt) => setFinYear(opt.value)}
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
                      value={
                        locationOptions.find(
                          (opt) => opt.value === locationId,
                        ) || null
                      }
                      onChange={(opt) => {
                        if (!opt) {
                          field.onChange("");
                          setLocationId("");
                          return;
                        }
                        field.onChange(opt.value);
                        setLocationId(opt.value);
                      }}
                      isDisabled={fieldsLocked}
                      classNamePrefix="form-control-select"
                    />
                  )}
                />
              </div>

              <div style={{ textAlign: "center" }} className="button-group">
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
