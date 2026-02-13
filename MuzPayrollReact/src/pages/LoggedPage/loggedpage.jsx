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

  /* ================= USER INIT ================= */
  useEffect(() => {
    if (user) {
      setFinYear(user.finYear || getCurrentFinYear());

      setValue("branchId", branchId ? String(branchId) : "");
      setValue("locationId", locationId ? String(locationId) : "");
      return;
    }

    const finalSolutionId = Number(solutionId);

    if (!finalSolutionId) return; // safety check

    if (finalSolutionId === 1) {
      navigate("/payroll", { replace: true });
    } else {
      navigate("/payrollemp", { replace: true });
    }
    // setFinYear(user.finYear || getCurrentFinYear());

    // setValue("branchId", branchId ? String(branchId) : "");
    // setValue("locationId", locationId ? String(locationId) : "");
  }, [user, solutionId, navigate, setValue]);

  /* ================= LOAD COMPANIES ================= */
  useEffect(() => {
    if (!user?.userMstId) return;

    const loadCompanies = async () => {
      try {
        const data = await fetchCompanies(user.userMstId);
        const companyArray = Array.isArray(data) ? data : [];

        setCompanyList(companyArray);

        if (companyArray.length > 0) {
          const firstCompany =
            companyArray.find(
              (c) => String(c.entityHierarchyId) === String(companyId)
            ) || companyArray[0];

          setSelectedCompanyId(String(firstCompany.entityHierarchyId));
          // setCompanyName(firstCompany.entityName);
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
      try {
        const data = await fetchBranch(user.userMstId, selectedCompanyId);

        const branchArray = Array.isArray(data) ? data : [];

        setBranchList(branchArray);

        if (branchArray.length > 0) {
          const firstBranch =
            branchArray.find(
              (b) => String(b.entityHierarchyId) === String(branchId) // <-- use entityHierarchyId
            ) || branchArray[0];

          const newBranchId = String(firstBranch.entityHierarchyId); // <-- entityHierarchyId
          setSelectedBranchId(newBranchId);
          setValue("branchId", newBranchId);

          updateUser({
            branchEntityHierarchyId: newBranchId,
            defaultEntityHierarchyId: "",
          });
        }
      } catch {
        toast.error("Failed to load branches");
        setBranchList([]);
      }
    };

    loadBranches();
  }, [user?.userMstId, selectedCompanyId]);


  /* ================= LOAD LOCATIONS ================= */
  useEffect(() => {
    if (!user?.userMstId || !selectedCompanyId || !selectedBranchId) return;

    const loadLocations = async () => {
      try {
        const data = await fetchLocation(
          user.userMstId,
          selectedCompanyId,
          selectedBranchId
        );

        const locationArray = Array.isArray(data) ? data : [];

        setLocationList(locationArray);

        if (locationArray.length > 0) {
          const firstLocation =
            locationArray.find(
              (l) => String(l.userEntityHierarchyId) === String(locationId)
            ) || locationArray[0];

          setSelectedLocationId(String(firstLocation.userEntityHierarchyId));
          setValue("locationId", String(firstLocation.userEntityHierarchyId));
        }
      } catch {
        toast.error("Failed to load locations");
        setLocationList([]);
      }
    };

    loadLocations();
  }, [user?.userMstId, selectedCompanyId, selectedBranchId]);


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
      const selectedBranch = branchList.find(
        (b) => String(b.userEntityHierarchyId) === String(selectedBranchId)
      );

      const selectedLocation = locationList.find(
        (l) => String(l.userEntityHierarchyId) === String(selectedLocationId)
      );

      await updateUser({
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
      });
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
                    companyList
                      .map(c => ({
                        value: String(c.entityHierarchyId),
                        label: c.entityName
                      }))
                      .find(opt => opt.value === selectedCompanyId) || null
                  }
                  options={companyList.map(c => ({
                    value: String(c.entityHierarchyId),
                    label: c.entityName
                  }))}
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
                        setSelectedLocationId("");

                        setLocationList([]);
                        setValue("locationId", "");

                        updateUser({
                          branchEntityHierarchyId: newBranchId,
                          defaultEntityHierarchyId: "",
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
