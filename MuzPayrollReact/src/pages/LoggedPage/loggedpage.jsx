import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./loggedpage.css";
import muzLogo from "../../assets/muzlogo_transparent.png";
import Sidebar from "../../components/SideBar/Sidebar";

import { toast } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import LoadingPage from "../../components/Loaders/Loading";

import { useLoader } from "../../context/LoaderContext";
import { ensureMinDuration } from "../../utils/loaderDelay";

import { useAuth } from "../../context/AuthProvider";

import { getCurrentFinYear, getFinYearOptions } from "../../utils/finyearUtils";



function LoggedPage() {

  /* ================= HOOKS ================= */
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const {
    control,
    setValue,
    // getValues,
    formState: { errors },
  } = useForm();



  /* ================= STATE ================= */

  const [companyName, setCompanyName] = useState("");

  const { showRailLoader, hideLoader } = useLoader();

  const fieldsLocked = user?.fieldsLocked ?? true;
  const sidebarOpen = user?.sidebarOpen ?? false;
  const okEnabled = user?.okEnabled ?? true;
  const changeEnabled = user?.changeEnabled ?? false;


  const [companyId, setCompanyId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [locationId, setLocationId] = useState("");
  const currentFinYear = getCurrentFinYear();
  const [finYear, setFinYear] = useState(currentFinYear);
  const finYearOptions = getFinYearOptions(currentFinYear);

  const [backendError] = useState([]);

  const [branchList, setBranchList] = useState([]);
  const [locationList, setLocationList] = useState([]);

  /* ================= EFFECTS ================= */

  useEffect(() => {


    if (!user) {
      navigate("/");
      return;
    }



    setCompanyId(String(user.companyId || ""));
    setBranchId(String(user.branchId || ""));
    setLocationId(String(user.locationId || ""));

    setFinYear(user.finYear || getCurrentFinYear());

    setValue("branchId", user.branchId ? String(user.branchId) : "");
    setValue("locationId", user.locationId ? String(user.locationId) : "");


    if (!user?.companyId || !user?.branchId) return;


    fetchContextData(
      user.companyId,
      user.branchId,
      user.locationId,
      user.userCode,
    );
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (user.fieldsLocked) return;
    if (!branchId) return;

    fetchContextData(
      user.companyId,
      branchId,
      locationId || user.locationId,
      user.userCode
    );
  }, [branchId, locationId, user?.fieldsLocked, user?.companyId]);




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



      // CASE: Branch exists but NO location
      if (
        errorMsg.toLowerCase().includes("location") ||
        errorMsg.toLowerCase().includes("no location")
      ) {
        // clear location ONLY if it exists
        if (user.locationId) {
          updateUser({
            locationId: "",
            locationName: "",
          });
        }
        return;
      }

      //  CASE: Company / Branch invalid → clear both
      setBranchList([]);
      setLocationList([]);

      setBranchId("");
      setLocationId("");

      setValue("branchId", "");
      setValue("locationId", "");

      updateUser({

        branchId: "",
        branchName: "",
        locationId: "",
        locationName: "",
      });

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

    /* ================= LOCATION (FIX HERE) ================= */
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

    if (
      String(user.locationId) !== String(selectedLocation.locationMstID)
    ) {
      updateUser({
        userCode: user.userCode || userCode,
        locationId: selectedLocation.locationMstID,
        locationName: selectedLocation.location,
      });
    }
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


  const handleOk = async () => {
    if (!validateForm()) return;
    const startTime = Date.now();
    // show loader
    showRailLoader("Applying branch and location changes…");

    try {
      const selectedBranch = branchList.find(
        (b) => String(b.branchMstID) === String(branchId),
      );

      const selectedLocation = locationList.find(
        (l) => String(l.locationMstID) === String(locationId),
      );

      // await global update
      await updateUser({

        branchId,
        branchName: selectedBranch?.branch || "",
        locationId,
        locationName: selectedLocation?.location || "",
        finYear,
        sidebarOpen: true,
        fieldsLocked: true,
        okEnabled: false,
        changeEnabled: true,
      });

    } finally {
      await ensureMinDuration(startTime, 1200);
      // hide loader ONLY at the end
      hideLoader();
    }
  };

  const handleChangeCredentials = () => {


    updateUser({

      fieldsLocked: false,
      okEnabled: true,
      changeEnabled: false,
    });


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
      {/* <LoadingPage /> */}
      <Footer />
    </>
  );
}

export default LoggedPage;
