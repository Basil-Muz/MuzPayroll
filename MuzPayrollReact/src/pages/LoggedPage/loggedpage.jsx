import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-hot-toast";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/SideBar/Sidebar";
import muzLogo from "../../assets/muzlogo_transparent.png";

import { useLoader } from "../../context/LoaderContext";
import { useAuth } from "../../context/AuthProvider";
import { ensureMinDuration } from "../../utils/loaderDelay";
import { getCurrentFinYear, getFinYearOptions } from "../../utils/finyearUtils";
import {
  fetchCompanies,
  fetchBranch,
  fetchLocation,
} from "../../services/home.service";
import { fetchMainMenu } from "../../services/menu.service";

import { useLocation } from "react-router-dom";

import "./loggedpage.css";
import { handleApiError } from "../../utils/errorToastResolver";
import { organizeMenuFromBackend } from "../../utils/menuUtils";

function LoggedPage() {
  const navigate = useNavigate();

  const { user, updateUser, updateMenus } = useAuth();

  const { showRailLoader, hideLoader } = useLoader();
  const { control, setValue } = useForm();
  const [searchParams] = useSearchParams();
  const solutionId = searchParams.get("solutionId");
  const location = useLocation();

  const [companyList, setCompanyList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [userChangedCompany, setUserChangedCompany] = useState(false);
  const [userChangedBranch, setUserChangedBranch] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState(
    user?.defaultEntityHierarchyId || "",
  );

  const currentFinYear = getCurrentFinYear();
  const [finYear, setFinYear] = useState(currentFinYear);
  const finYearOptions = getFinYearOptions(currentFinYear);


  const [selectedCompanyId, setSelectedCompanyId] = useState(
    user?.userEntityHierarchyId || "",
  );
  const [selectedBranchId, setSelectedBranchId] = useState(
    user?.branchEntityHierarchyId || "",
  );

  const fieldsLocked = user?.fieldsLocked ?? false;
  const sidebarOpen = user?.sidebarOpen ?? false;
  const okEnabled = user?.okEnabled ?? true;
  const changeEnabled = user?.changeEnabled ?? false;

  // ================= Sync form with user context =================
  useEffect(() => {
    if (!user) return;

    setSelectedCompanyId(user.userEntityHierarchyId || "");
    setSelectedBranchId(user.branchEntityHierarchyId || "");
    setSelectedLocationId(user.defaultEntityHierarchyId || "");
    setFinYear(user.finYear || currentFinYear);

    setValue("companyId", user.userEntityHierarchyId || "");
    setValue("branchId", user.branchEntityHierarchyId || "");
    setValue("locationId", user.defaultEntityHierarchyId || "");
  }, [user, location.pathname, setValue]);

  // ================= Redirect if no user =================
  useEffect(() => {
    if (user) return;
    const finalSolutionId = Number(solutionId);
    if (!finalSolutionId) return;
    navigate(finalSolutionId === 1 ? "/payroll" : "/payrollemp", {
      replace: true,
    });
  }, [user, solutionId, navigate]);
  // console.log("Use id", user);
  // ================= Load companies =================

  useEffect(() => {
    if (!user?.userMstId) return;

    const loadCompanies = async () => {
      try {
        const data = await fetchCompanies(user.userMstId);
        const companies = Array.isArray(data) ? data : [];

        if (companies.length === 0) {
          toast.error("No companies available");
          setCompanyList([]);
          return;
        }

        setCompanyList(companies);

        const defaultCompany =
          companies.find(
            (c) =>
              String(c.entityHierarchyId) ===
              String(user?.userEntityHierarchyId)
          ) || companies[0];

        const companyId = String(defaultCompany.entityHierarchyId);

        setSelectedCompanyId(companyId);
        setValue("companyId", companyId);

       
      } catch (error) {
        toast.error("Failed to load companies");
        setCompanyList([]);
      }
    };

    loadCompanies();
  }, [user?.userMstId]);

  // ================= Load branches =================
  useEffect(() => {
    if (!user?.userMstId || !selectedCompanyId) return;

    const loadBranches = async () => {
      try {
        const data = await fetchBranch(user.userMstId, selectedCompanyId);
        const branches = Array.isArray(data) ? data : [];

        setBranchList(branches);

        if (branches.length === 0) {
          if (userChangedCompany) {
            toast.error("No branches available for selected company");
          }

          setSelectedBranchId("");
          setLocationList([]);
          setSelectedLocationId("");
          setValue("branchId", "");
          setValue("locationId", "");
          return;
        }

        const defaultBranch =
          branches.find(
            (b) =>
              String(b.entityHierarchyId) ===
              String(user?.branchEntityHierarchyId)
          ) || branches[0];

        const branchId = String(defaultBranch.entityHierarchyId);

        setSelectedBranchId(branchId);
        setValue("branchId", branchId);

      } catch (error) {
        toast.error("Failed to load branches");
        setBranchList([]);
        setSelectedBranchId("");
      }
    };

    loadBranches();
  }, [user?.userMstId, selectedCompanyId]);

  /* ================= Load locations ================= */
  useEffect(() => {
    if (!user?.userMstId || !selectedCompanyId || !selectedBranchId) {
      setLocationList([]);
      setSelectedLocationId("");
      setValue("locationId", "");
      return;
    }

    const loadLocations = async () => {
      const startTime = Date.now();
      showRailLoader("Loading locations...");

      try {
        const data = await fetchLocation(
          user.userMstId,
          selectedCompanyId,
          selectedBranchId
        );

        const locations = Array.isArray(data) ? data : [];

        setLocationList(locations);

        if (locations.length === 0) {
          if (userChangedBranch) {
            toast.error("No locations available for selected branch");
          }

          setSelectedLocationId("");
          setValue("locationId", "");
          return;
        }

        const defaultLocation =
          locations.find(
            (l) =>
              String(l.entityHierarchyId) ===
              String(user?.defaultEntityHierarchyId)
          ) || locations[0];

        const locationId = String(defaultLocation.entityHierarchyId);

        setSelectedLocationId(locationId);
        setValue("locationId", locationId);

      } catch (error) {
        toast.error("Failed to load locations");
        setLocationList([]);
        setSelectedLocationId("");
      } finally {
        await ensureMinDuration(startTime, 600);
        hideLoader();
      }
    };

    loadLocations();
  }, [
    user?.userMstId,
    selectedCompanyId,
    selectedBranchId,

  ]);

  // ================= Select options =================
  const companyOptions = companyList.map((c) => ({
    value: String(c.entityHierarchyId),
    label: c.entityName,
  }));
  const branchOptions = branchList.map((b) => ({
    value: String(b.entityHierarchyId),
    label: b.entityName,
  }));
  const locationOptions = locationList.map((l) => ({
    value: String(l.entityHierarchyId),
    label: l.entityName,
  }));

  const finYearOption = finYearOptions.find((opt) => opt.value === finYear);

  // ================= Validation =================
  const validateForm = () => {
    // ALWAYS validate before saving
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

  // ================= Actions =================
  const handleOk = async () => {
    if (!validateForm()) return;

    const startTime = Date.now();
    showRailLoader("Applying branch and location changes…");

    try {
      const selectedCompany = companyList.find(
        (b) => String(b.entityHierarchyId) === selectedCompanyId,
      );

      const selectedBranch = branchList.find(
        (b) => String(b.entityHierarchyId) === selectedBranchId,
      );

      const selectedLocation = locationList.find(
        (l) => String(l.entityHierarchyId) === selectedLocationId,
      );
      // console.log("Comapny",selectedCompany);
      updateUser({
        ...user,
        userEntityHierarchyId: selectedCompanyId,
        companyName: selectedCompany?.entityName || "",
        branchEntityHierarchyId: selectedBranchId,
        branchName: selectedBranch?.entityName || "",
        defaultEntityHierarchyId: selectedLocationId,
        locationName: selectedLocation?.entityName || "",
        finYear,
        sidebarOpen: true,
        fieldsLocked: true,
        okEnabled: false,
        changeEnabled: true,
      });
      const response = await fetchMainMenu(
        "MAIN_MENU",
        "LIST",
        user.userMstId,
        user.solutionId,
        selectedLocationId,
        1,
        null,
      );
      // console.log("Main Menu", response);
      const organizedMenu = organizeMenuFromBackend(response.data);
      // console.log("Organized menu", organizedMenu);
      updateMenus(organizedMenu);
    } catch (error) {
      // console.log("Error" + error);
      handleApiError(error, {
        entity: "menu",
      });
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
    }
  };
  //CHANGE HERE — pass object instead of function
  const handleChangeCredentials = () => {
    updateUser({
      ...user,
      fieldsLocked: false,
      okEnabled: true,
      changeEnabled: false,
    });
  };

  const loginDate = new Date().toISOString().split("T")[0];

  // ================= UI =================
  return (
    <>
      <Header />
      <div className="main-section">
        <Sidebar sidebarOpen={sidebarOpen} />
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
                  value={
                    companyOptions.find(
                      (opt) => opt.value === selectedCompanyId,
                    ) || null
                  }
                  options={companyOptions}
                  onChange={(opt) => {
                    const newId = opt?.value || "";
                    setUserChangedCompany(true);   //  mark manual change
                    setSelectedCompanyId(newId);
                    setSelectedBranchId("");
                    setSelectedLocationId("");
                    setBranchList([]);
                    setLocationList([]);
                    setValue("branchId", "");
                    setValue("locationId", "");
                  }}
                  isDisabled={fieldsLocked}
                  classNamePrefix="form-control-select"
                />
              </div>

              <div className="logged-details">
                <label>Login Date</label>
                <Select
                  value={{ value: loginDate, label: loginDate }}
                  options={[{ value: loginDate, label: loginDate }]}
                  isDisabled
                  classNamePrefix="form-control-select"
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
                <label>Branch</label>
                <Controller
                  name="branchId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={
                        branchOptions.find(
                          (opt) => opt.value === field.value,
                        ) || null
                      }
                      options={branchOptions}
                      onChange={(opt) => {
                        const newId = opt?.value || "";
                        setUserChangedBranch(true);   // mark manual change
                        field.onChange(newId);
                        setSelectedBranchId(newId);
                        setSelectedLocationId("");
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
                <label>Location</label>
                <Controller
                  name="locationId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={
                        locationOptions.find(
                          (opt) => opt.value === field.value,
                        ) ||
                        locationOptions.find(
                          (opt) => opt.value === selectedLocationId,
                        ) ||
                        null
                      }
                      options={locationOptions}
                      onChange={(opt) => {
                        const newId = opt?.value || "";
                        field.onChange(newId);
                        setSelectedLocationId(newId);
                      }}
                      isDisabled={fieldsLocked || locationOptions.length === 0}
                      placeholder={
                        locationOptions.length === 0
                          ? "Select..."
                          : "Select Location"
                      }
                      classNamePrefix="form-control-select"
                    />
                  )}
                />
              </div>

              <div className="button-group" style={{ textAlign: "center" }}>
                <button
                  className="logged-btn"
                  onClick={handleOk}
                  disabled={
                    !selectedCompanyId ||
                    !selectedBranchId ||
                    !selectedLocationId ||
                    !okEnabled
                  }
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
