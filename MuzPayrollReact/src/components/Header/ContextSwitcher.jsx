import React, { useState, useEffect, useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
// import axios from "axios";
// import debounce from "lodash/debounce";

import { useAuth } from "../../context/AuthProvider";
import { useLoader } from "../../context/LoaderContext";
import { ensureMinDuration } from "../../utils/loaderDelay";
import { handleApiError } from "../../utils/errorToastResolver";
import { fetchCompany } from "../../services/company.service";
import { fetchBranchesByCompany } from "../../services/branch.service";
import { fetchLocaion } from "../../services/location.service";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { fetchMainMenu } from "../../services/menu.service";
import { organizeMenuFromBackend } from "../../utils/menuUtils";
const API_CONFIG = {
  timeout: 10000,
  retries: 2,
};

const useApiCache = () => {
  const cache = useRef(new Map());

  const get = useCallback((key) => {
    const item = cache.current.get(key);
    if (item && Date.now() - item.timestamp < 5 * 60 * 1000) {
      return item.data;
    }
    return null;
  }, []);

  const set = useCallback((key, data) => {
    cache.current.set(key, {
      data,
      timestamp: Date.now(),
    });
  }, []);

  const clear = useCallback(() => {
    cache.current.clear();
  }, []);

  return { get, set, clear };
};

export const ContextSwitcher = React.memo(
  ({
    isOpen,
    onClose,
    onApply,
    initialData,
    //   onUpdate
  }) => {
    const { user, updateUser, updateMenus } = useAuth();
    const { showRailLoader, hideLoader } = useLoader();
    const apiCache = useApiCache();

    const hasResetRef = useRef(false); //ensure reseting only onece
    const errorShownRef = useRef(false); //ensuring the toast shows only onece
    const [companyList, setCompanyList] = useState([]);
    const [branchList, setBranchList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [loading, setLoading] = useState({
      company: false,
      branch: false,
      location: false,
    });

    const [options, setOptions] = useState({
      companies: [],
      branches: [],
      locations: [],
    });

    const { control, watch, setValue, handleSubmit, reset } = useForm({
      defaultValues: initialData,
    });

    // Watch form values

    // const formValues = watch();
    const selectedCompany = watch("company");
    const selectedBranch = watch("branch");
    const selectedLocation = watch("location");

    // console.log("sdfsd", selectedLocation.value);
    const userId = user?.userMstId;
    useEffect(() => {
      if (isOpen && initialData && !hasResetRef.current) {
        reset(initialData);
        hasResetRef.current = true;
      }

      if (!isOpen) {
        hasResetRef.current = false;
      }
    }, [isOpen, initialData, reset]);
    //Reset when modal closes:
    useEffect(() => {
      if (!isOpen) errorShownRef.current = false;
    }, [isOpen]);

    // Debounced branch fetch
    const fetchBranches = useCallback(
      async (companyId) => {
        if (!companyId) return;

        const cacheKey = `branches_${companyId}`;
        let formatted;

        const cached = apiCache.get(cacheKey);

        if (cached) {
          formatted = cached;
          setOptions((prev) => ({ ...prev, branches: formatted }));
        } else {
          setLoading((prev) => ({ ...prev, branch: true }));
          try {
            const response = await fetchBranchesByCompany(userId, companyId);

            formatted = response.data.map((b) => ({
              value: b.entityHierarchyId,
              label: b.entityName,
              data: b,
            }));
            setBranchList(formatted);
            setOptions((prev) => ({
              ...prev,
              branches: formatted,
              locations: [],
            }));

            apiCache.set(cacheKey, formatted);
          } catch (error) {
            handleApiError(error, { entity: "branch" });
            return;
          } finally {
            setLoading((prev) => ({ ...prev, branch: false }));
          }
        }

        const selectedBranchOption = formatted.find(
          (b) => String(b.value) === String(user.branchEntityHierarchyId),
        );

        setValue("branch", selectedBranchOption || null);
        setValue("location", null);
      },
      [setValue, apiCache, user?.branchEntityHierarchyId, userId],
    );
    // Fetch companies on open
    useEffect(() => {
      if (!isOpen) return;

      const cacheKey = `companies_${user?.companyId}`;
      const cached = apiCache.get(cacheKey);

      if (cached) {
        setOptions((prev) => ({ ...prev, companies: cached }));
        return;
      }
      // console.log("User details", user);
      const fetchCompanies = async () => {
        setLoading((prev) => ({ ...prev, company: true }));
        try {
          const response = await fetchCompany(userId);
          // console.log("companies ", response.data);
          const companies = Array.isArray(response.data)
            ? response.data
            : [response.data];

          const formatted = companies.map((c) => ({
            value: c.entityHierarchyId,
            label: c.entityName,
            data: c,
          }));
          setCompanyList(formatted);
          setOptions((prev) => ({ ...prev, companies: formatted }));
          apiCache.set(cacheKey, formatted);
        } catch (error) {
          if (!errorShownRef.current) {
            handleApiError(error, { entity: "company" });
            errorShownRef.current = true;
          }
        } finally {
          setLoading((prev) => ({ ...prev, company: false }));
        }
      };

      fetchCompanies();
      // fetchBranches(user.companyId);
    }, [isOpen, user?.companyId]);

    useEffect(() => {
      if (selectedCompany?.value) {
        fetchBranches(selectedCompany.value);
      }
    }, [selectedCompany]);

    // Fetch locations when branch changes
    useEffect(() => {
      if (!selectedBranch?.value) {
        setOptions((prev) => ({ ...prev, locations: [] }));
        return;
      }

      const fetchLocations = async () => {
        setLoading((prev) => ({ ...prev, location: true }));
        try {
          const response = await fetchLocaion(
            userId,
            selectedCompany.value,
            selectedBranch.value,
          );

          const formatted = response.data.map((l) => ({
            value: l.entityHierarchyId,
            label: l.entityName,
            data: l,
          }));
          setLocationList(formatted);
          setOptions((prev) => ({ ...prev, locations: formatted }));
          const selectedLocationOption = formatted.find(
            (b) => String(b.value) === String(user.defaultEntityHierarchyId),
          );

          setValue("location", selectedLocationOption || null);
        } catch (error) {
          handleApiError(error, { entity: "location" });
          setOptions((prev) => ({ ...prev, locations: [] }));
        } finally {
          setLoading((prev) => ({ ...prev, location: false }));
        }
      };

      fetchLocations();
    }, [selectedBranch, selectedCompany]);

    // Handle apply
    const handleApply = useCallback(
      async (data) => {
        if (data.company && data.branch) {
          onApply(data);
          const startTime = Date.now();
          showRailLoader("Applying branch and location changes…");

          try {
            // const selectedCompany = companyList.find(
            //   (b) => String(b.entityHierarchyId) === selectedCompany,
            // );

            // const selectedBranch = branchList.find(
            //   (b) => String(b.entityHierarchyId) === selectedBranch,
            // );

            // const selectedLocation = locationList.find(
            //   (l) => String(l.entityHierarchyId) === selectedLocation,
            // );
            // console.log("Comapny",selectedCompany.label);
            updateUser({
              ...user,
              userEntityHierarchyId: selectedCompany.value,
              companyName: selectedCompany?.label || "",
              branchEntityHierarchyId: selectedBranch.value,
              branchName: selectedBranch?.label || "",
              defaultEntityHierarchyId: selectedLocation.value,
              locationName: selectedLocation?.label || "",
            });
            const response = await fetchMainMenu(
              "MAIN_MENU",
              "LIST",
              user.userMstId,
              user.solutionId,
              selectedLocation?.value,
              1,
              null,
            );
            console.log("Main Menu", response);
            const organizedMenu = organizeMenuFromBackend(response.data);
            console.log("Organized menu", organizedMenu);
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
        }
      },

      [
        onApply,
        updateUser,
        user,
        selectedCompany,
        selectedBranch,
        selectedLocation,
        showRailLoader,
        hideLoader,
        updateMenus,
      ],
    );

    // Handle close with escape
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // In ContextSwitcher component, update these classes:
    return (
      <div
        className="context-switcher-modal"
        role="dialog"
        aria-label="Context switcher"
      >
        <div className="modal-backdrop" onClick={onClose} />

        <div className="context-modal-content">
          <div className="context-modal-header">
            <h3>
              <HiOutlineSwitchHorizontal className="icon" />
              Switch Context
            </h3>
            <button
              className="enhanced-close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit(handleApply)}>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="company-select">Company</label>
                <Controller
                  name="company"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      inputId="company-select"
                      options={options.companies}
                      isLoading={loading.company}
                      placeholder="Select company"
                      classNamePrefix="form-control-select"
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </div>

              <div className="form-field">
                <label htmlFor="branch-select">Branch</label>
                <Controller
                  name="branch"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      inputId="branch-select"
                      options={options.branches}
                      isLoading={loading.branch}
                      isDisabled={!selectedCompany}
                      placeholder="Select branch"
                      classNamePrefix="form-control-select"
                    />
                  )}
                />
              </div>

              <div className="form-field">
                <label htmlFor="location-select">Location</label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      inputId="location-select"
                      options={options.locations}
                      isLoading={loading.location}
                      isDisabled={!selectedBranch}
                      placeholder="Select location"
                      classNamePrefix="form-control-select"
                    />
                  )}
                />
              </div>
            </div>

            <div className="context-modal-footer">
              <button
                type="button"
                className="enhanced-btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="enhanced-btn-primary"
                disabled={!selectedCompany || !selectedBranch}
              >
                Apply Context
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  },
);

export default ContextSwitcher;
