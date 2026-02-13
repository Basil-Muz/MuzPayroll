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

import { useLoader } from "../../context/LoaderContext";
import { ensureMinDuration } from "../../utils/loaderDelay";
import { useAuth } from "../../context/AuthProvider";

import { getCurrentFinYear, getFinYearOptions } from "../../utils/finyearUtils";
import { fetchCompanies, fetchBranch, fetchLocation, } from "../../services/home.service";
import { useSearchParams } from "react-router-dom";



function LoggedPage() {
  /* ================= HOOKS ================= */
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { showRailLoader, hideLoader } = useLoader();

  const { control, setValue } = useForm();

  /* ================= USER ID MAPPING ================= */
  const {
    userEntityHierarchyId: companyId = "",
    branchEntityHierarchyId: branchId = "",
    defaultEntityHierarchyId: locationId = "",
  } = user || {};

  /* ================= STATE ================= */
  const [companyList, setCompanyList] = useState([]);
  // const [companyName, setCompanyName] = useState("");
  const [branchList, setBranchList] = useState([]);
  const [locationList, setLocationList] = useState([]);

  const currentFinYear = getCurrentFinYear();
  const [finYear, setFinYear] = useState(currentFinYear);
  const finYearOptions = getFinYearOptions(currentFinYear);

  const [searchParams] = useSearchParams();
  const solutionId = searchParams.get("solutionId");

  const [selectedCompanyId, setSelectedCompanyId] = useState(companyId || "");
  const [selectedBranchId, setSelectedBranchId] = useState(branchId || "");
  const [selectedLocationId, setSelectedLocationId] = useState(locationId || "");



  const fieldsLocked = user?.fieldsLocked ?? true;
  const sidebarOpen = user?.sidebarOpen ?? false;
  const okEnabled = user?.okEnabled ?? true;
  const changeEnabled = user?.changeEnabled ?? false;

  /* ================= SYNC LOCAL STATE WITH USER ================= */
  useEffect(() => {
    if (!user) return;

    // Sync selected IDs with user context
    setSelectedCompanyId(user.userEntityHierarchyId || "");
    setSelectedBranchId(user.branchEntityHierarchyId || "");
    setSelectedLocationId(user.defaultEntityHierarchyId || "");

    // Update react-hook-form fields
    setValue("companyId", user.userEntityHierarchyId || "");
    setValue("branchId", user.branchEntityHierarchyId || "");
    setValue("locationId", user.defaultEntityHierarchyId || "");

    // Sync finYear
    setFinYear(user.finYear || getCurrentFinYear());
  }, [user, setValue]);

  /* ================= SYNC FORM WITH LOCAL STATE ================= */
  useEffect(() => {
    setValue("branchId", selectedBranchId);
    setValue("locationId", selectedLocationId);
  }, [selectedBranchId, selectedLocationId, setValue]);


  /* ================= USER INIT ================= */
  useEffect(() => {
    if (user) {
      setFinYear(user.finYear || getCurrentFinYear());
      return;
    }

    const finalSolutionId = Number(solutionId);
    if (!finalSolutionId) return;

    navigate(finalSolutionId === 1 ? "/payroll" : "/payrollemp", { replace: true });
  }, [user, solutionId, navigate]);


  /* ================= LOAD COMPANIES ================= */
  useEffect(() => {
    if (!user?.userMstId) return;

    const loadCompanies = async () => {
      try {
        const data = await fetchCompanies(user.userMstId);
        const companyArray = Array.isArray(data) ? data : [];

        setCompanyList(companyArray);

        if (companyArray.length > 0) {
          // Pick company: first matching user's companyId, else first
          const firstCompany =
            companyArray.find(
              (c) => String(c.entityHierarchyId) === String(companyId)
            ) || companyArray[0];

          const newCompanyId = String(firstCompany.entityHierarchyId);

          setSelectedCompanyId(newCompanyId);
          setValue("companyId", newCompanyId);

          // Clear branch and location because company changed
          setBranchList([]);
          setSelectedBranchId("");
          setValue("branchId", "");

          // setLocationList([]);
          // setSelectedLocationId("");
          // setValue("locationId", "");

          // // Update user context to reflect selected company
          // updateUser({
          //   ...user,
          //   userEntityHierarchyId: newCompanyId,
          //   branchEntityHierarchyId: "",
          //   defaultEntityHierarchyId: "",
          // });
        }
      } catch (error) {
        toast.error("Failed to load company");
        setCompanyList([]);
      }
    };

    loadCompanies();
  }, [user?.userMstId]);

  /* ================= LOAD BRANCHES ================= */
  useEffect(() => {
    if (!user?.userMstId || !selectedCompanyId) return;

    const loadBranches = async () => {
      const branchArray = await fetchBranch(user.userMstId, selectedCompanyId);
      const branches = Array.isArray(branchArray) ? branchArray : [];
      setBranchList(branches);

      if (branches.length > 0) {
        // pick user's branch or first
        const userBranch = branches.find(b => String(b.entityHierarchyId) === String(user.branchEntityHierarchyId));
        const firstBranch = userBranch || branches[0];

        const newBranchId = String(firstBranch.entityHierarchyId);
        setSelectedBranchId(newBranchId);       // << branch selected
        setValue("branchId", newBranchId);

        const updatedUser = { ...user, branchEntityHierarchyId: newBranchId, defaultEntityHierarchyId: "" };
        updateUser(updatedUser);
      }
    };

    loadBranches();
  }, [user?.userMstId, selectedCompanyId]);

  /* ================= LOAD LOCATIONS ================= */
  useEffect(() => {
    if (!user?.userMstId || !selectedCompanyId || !selectedBranchId) return;

    const loadLocations = async () => {
      try {
        const locationArray = await fetchLocation(user.userMstId, selectedCompanyId, selectedBranchId);
        const locations = Array.isArray(locationArray) ? locationArray : [];
        setLocationList(locations);

        if (locations.length > 0) {
          // pick user's saved location or first in list
          const userLocation = locations.find(
            (l) => String(l.userEntityHierarchyId) === String(user.defaultEntityHierarchyId)
          );
          const firstLocation = userLocation || locations[0];

          const newLocationId = String(firstLocation.userEntityHierarchyId);
          setSelectedLocationId(newLocationId);
          setValue("locationId", newLocationId);

          // Update user context **only if it’s empty**
          if (!user.defaultEntityHierarchyId) {
            const updatedUser = { ...user, defaultEntityHierarchyId: newLocationId };
            updateUser(updatedUser);
          }
        }
      } catch {
        toast.error("Failed to load locations");
        setLocationList([]);
      }
    };

    loadLocations();
  }, [user?.userMstId, selectedCompanyId, selectedBranchId, user, setValue, updateUser]);


  /* ================= SELECT OPTIONS ================= */
  const branchOptions = Array.isArray(branchList)
    ? branchList.map((b) => ({
      value: String(b.entityHierarchyId), // <-- use entityHierarchyId
      label: b.entityName,
    }))
    : [];

  const locationOptions = Array.isArray(locationList)
    ? locationList.map((l) => ({
      value: String(l.userEntityHierarchyId),
      label: l.entityName,
    }))
    : [];

  // const companyOption = companyName
  //   ? { value: companyId, label: companyName }
  //   : null;

  const loginDate = new Date().toISOString().split("T")[0];
  const finYearOption = finYearOptions.find(
    (opt) => opt.value === finYear
  );

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    if (fieldsLocked) return true;

    if (!selectedBranchId) {
      toast.error("Please select Branch");
      return false;
    }

    if (!selectedLocationId) {
      toast.error("Please select Location");
      return false;
    }

    return true;
  };

  /* ================= ACTIONS ================= */
  const handleOk = async () => {
    if (!validateForm()) return;

    const startTime = Date.now();
    showRailLoader("Applying branch and location changes…");

    try {
      const selectedBranch = branchList.find(b => String(b.entityHierarchyId) === selectedBranchId);
      const selectedLocation = locationList.find(l => String(l.userEntityHierarchyId) === selectedLocationId);

      const updatedUser = {
        ...user,
        userEntityHierarchyId: selectedCompanyId,
        branchEntityHierarchyId: selectedBranchId,
        branchName: selectedBranch?.entityName || "",
        defaultEntityHierarchyId: selectedLocationId,
        locationName: selectedLocation?.entityName || "",
        finYear,
        sidebarOpen: true,
        fieldsLocked: true,
        okEnabled: false,
        changeEnabled: true,
      };

      updateUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser)); // persist
    } finally {
      await ensureMinDuration(startTime, 1200);
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
  const companyOptions = Array.isArray(companyList)
  ? companyList.map((c) => ({
      value: String(c.entityHierarchyId),
      label: c.entityName,
    }))
  : [];


  /* ================= UI ================= */
  return (
    <>
      <Header />
      <div className="main-section">

        <Sidebar sidebarOpen={sidebarOpen} />

        <div className="logo-homesection">
          <div className="left-section">
            <img
              src={muzLogo}
              alt="logo"
              className="home-logo"
            />
          </div>

          <div className="logged-container">
            <div className="logged-box">
              <h2 className="logged-heading">
                Login Credentials
              </h2>

              <div className="logged-details">
                <label>Company</label>
                <Select
                  value={
                    companyOptions.find(
                      (opt) => opt.value === String(selectedCompanyId)
                    ) || null
                  }
                  options={companyOptions}
                  onChange={(opt) => {
                    const newCompanyId = opt?.value || "";

                    setSelectedCompanyId(newCompanyId);
                    setSelectedBranchId("");
                    setSelectedLocationId("");

                    setBranchList([]);
                    setLocationList([]);

                    setValue("branchId", "");
                    setValue("locationId", "");

                    updateUser({
                      ...user,
                      userEntityHierarchyId: newCompanyId,
                      branchEntityHierarchyId: "",
                      defaultEntityHierarchyId: "",
                    });
                  }}
                  isDisabled={fieldsLocked}
                  classNamePrefix="form-control-select"
                />
              </div>

              <div className="logged-details">
                <label>Login Date</label>
                <Select
                  value={{
                    value: loginDate,
                    label: loginDate,
                  }}
                  isDisabled
                  options={[
                    {
                      value: loginDate,
                      label: loginDate,
                    },
                  ]}
                  classNamePrefix="form-control-select"
                />
              </div>


              <div className="logged-details">
                <label>FinYear</label>
                <Select
                  value={finYearOption}
                  options={finYearOptions}
                  isDisabled={fieldsLocked}
                  onChange={(opt) =>
                    setFinYear(opt.value)
                  }
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
                      value={branchOptions.find(
                        (opt) => opt.value === String(field.value)
                      ) || null
                      }
                      onChange={(opt) => {
                        const newBranchId = opt?.value || "";
                        field.onChange(newBranchId);
                        setSelectedBranchId(newBranchId);

                        // Clear previous location
                        setSelectedLocationId("");
                        setLocationList([]);
                        setValue("locationId", "");

                        updateUser({
                          branchEntityHierarchyId: newBranchId,
                          defaultEntityHierarchyId: "", // clear location in user context
                        });
                      }}

                      isDisabled={fieldsLocked}
                      classNamePrefix="form-control-select"
                    />
                  )}
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
                          (opt) => opt.value === String(field.value)
                        ) || null
                      }
                      onChange={(opt) => {
                        const newLocationId = opt?.value || "";

                        field.onChange(newLocationId);
                        setSelectedLocationId(newLocationId);

                        updateUser({
                          defaultEntityHierarchyId: newLocationId,
                        });
                      }}

                      isDisabled={fieldsLocked}
                      classNamePrefix="form-control-select"
                    />
                  )}
                />
              </div>

              <div
                className="button-group"
                style={{ textAlign: "center" }}
              >
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
