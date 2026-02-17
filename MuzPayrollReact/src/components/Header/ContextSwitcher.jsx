import React, { useState, useEffect, useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
// import debounce from "lodash/debounce";

import { useAuth } from "../../context/AuthProvider";
import { useLoader } from "../../context/LoaderContext";
import { ensureMinDuration } from "../../utils/loaderDelay";
import { handleApiError } from "../../utils/errorToastResolver";
import { fetchBranchesByCompany } from "../../services/branch.service";
import { fetchLocaion } from "../../services/location.service";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

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
    const { user, updateUser } = useAuth();
    const { showRailLoader, hideLoader } = useLoader();
    const apiCache = useApiCache();

    const hasResetRef = useRef(false); //ensure reseting only onece
    const errorShownRef = useRef(false); //ensuring the toast shows only onece

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
    const userId = 3;
    // console.log("company and branch",selectedCompany.value,selectedBranch.value);
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

    // Fetch companies on open
    useEffect(() => {
      if (!isOpen) return;

      const cacheKey = `companies_${user.companyId}`;
      const cached = apiCache.get(cacheKey);

      if (cached) {
        setOptions((prev) => ({ ...prev, companies: cached }));
        return;
      }
      // console.log("User details",user)
      const fetchCompanies = async () => {
        setLoading((prev) => ({ ...prev, company: true }));
        try {
          const response = await axios.get(
            "http://localhost:8087/entity/fetchCompany",
            {
              params: { userId },
            },
          );
          console.log("companies ", response.data);
          const companies = Array.isArray(response.data)
            ? response.data
            : [response.data];

          const formatted = companies.map((c) => ({
            value: c.entityHierarchyId,
            label: c.entityName,
            data: c,
          }));

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
    }, [isOpen, user.companyId]);

    // Debounced branch fetch
    const fetchBranches = useCallback(
      async (companyId) => {
        if (!companyId) return;

        const cacheKey = `branches_${companyId}`;
        const cached = apiCache.get(cacheKey);

        if (cached) {
          setOptions((prev) => ({ ...prev, branches: cached }));
          return;
        }

        setLoading((prev) => ({ ...prev, branch: true }));
        const startTime = Date.now();

        try {
          const response = await fetchBranchesByCompany(userId, companyId);

          const formatted = response.data.map((b) => ({
            value: b.entityHierarchyId,
            label: b.entityName,
            data: b,
          }));

          setOptions((prev) => ({
            ...prev,
            branches: formatted,
            locations: [],
          }));
          apiCache.set(cacheKey, formatted);
          setValue("branch", null);
          setValue("location", null);
        } catch (error) {
          handleApiError(error, { entity: "branch" });
        } finally {
          await ensureMinDuration(startTime, 800);
          setLoading((prev) => ({ ...prev, branch: false }));
          hideLoader();
        }
      },
      [setValue, hideLoader],
    );

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

          setOptions((prev) => ({ ...prev, locations: formatted }));
        } catch (error) {
          handleApiError(error, { entity: "location" });
          setOptions((prev) => ({ ...prev, locations: [] }));
        } finally {
          setLoading((prev) => ({ ...prev, location: false }));
        }
      };

      fetchLocations();
    }, [selectedBranch]);

    // Handle apply
    const handleApply = useCallback(
      (data) => {
        if (data.company && data.branch) {
          onApply(data);
          //   updateUser({
          //     companyId: data.company.value,
          //     branchId: data.branch.value,
          //     locationId: data.location?.value || null,
          //   });
        }
        onClose();
      },
      [onApply, onClose, updateUser],
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
              <HiOutlineSwitchHorizontal className="icon"/>
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
                        if (value) {
                          fetchBranches(value.value);
                        }
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
