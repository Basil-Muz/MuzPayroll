import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../Location/GeneralForm.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Country, State, City } from "country-state-city";
import axios from "axios";

const GeneralForm = forwardRef(({ onFormChange, onBackendError }, ref) => {
  let page = "location";
  const user_code = 1001;

  const [initialCompanyId, setInitialCompanyId] = useState("");
  const [initialBranchId, setInitialBranchId] = useState("");

  const [employerEditable, setemployerEditable] = useState(false);
  const [addressEditable, setAddressEditable] = useState(false);
  const [contactInfoEditable, setContactInfoEditable] = useState(false);
  const codeInputRef = useRef(null);
  const calendarRef = useRef(null);

  const [startDate, setStartDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [inputsUnlocked, setInputsUnlocked] = useState(false);
  const [dateLocked, setDateLocked] = useState(false);
  const [isDateLocked, setIsDateLocked] = useState(false);
  const [authorization, setAuthorization] = useState("Active");
  const [todayDate, setTodayDate] = useState("");

  const [companyList, setCompanyList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const countries = Country.getAllCountries();
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry)
    : [];
  const districts = selectedState
    ? City.getCitiesOfState(selectedCountry, selectedState)
    : [];

  const getLoginData = () => {
    const stored = localStorage.getItem("loginData");
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  };
  const loginData = getLoginData();
  // const user_code = loginData?.userCode;
  const companyId = loginData?.companyId;
  const defaultBranchId = loginData?.branchId;

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-GB"); // e.g., 15/09/2025
    setTodayDate(formatted);
  }, []);
  useEffect(() => {
    if (!startDate) {
      setShowCalendar(true);
    }
  }, []);

  const loadCompanyAndBranches = async () => {
    try {
      const companyResponse = await axios.get(
        `http://localhost:8087/company/${companyId}`,
      );

      const company = companyResponse.data;
      setCompanyList([company]);
      setInitialCompanyId(company.id);

      const branchResponse = await axios.get(
        `http://localhost:8087/branch/${companyId}`,
      );

      const branches = branchResponse.data;
      setBranchList(branches);

      if (branches.length > 0) {
        setInitialBranchId(branches[0].id);
      }
    } catch (error) {
      console.error("Failed to load company or branches:", error);
    }
  };

  const focusAndScrollToTop = (ref, delay = 100) => {
    setTimeout(() => {
      if (!ref?.current) return;

      // 1️⃣ Focus first
      if (typeof ref.current.focus === "function") {
        ref.current.focus({ preventScroll: true });
      }

      // 2️⃣ Then scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, delay);
  };

  const handleDateChange = (date) => {
    if (!dateLocked) {
      setStartDate(date);

      formik.setFieldValue("withaffectdate", date.toISOString().split("T")[0]);

      setShowCalendar(false);
      setInputsUnlocked(true);
      setIsDateLocked(true);
      focusAndScrollToTop(codeInputRef);
    }
  };
  useEffect(() => {
    if (page === "location") {
      setAddressEditable(true);
      setContactInfoEditable(true);
      setemployerEditable(true);
    } else {
      setemployerEditable(false);
      setAddressEditable(false);
      setContactInfoEditable(false);
    }
  }, [page]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const btn = document.querySelector(".react-datepicker__day");
      btn?.focus();
    });
  }, []);

  const handleAddressEditToggle = () => {
    if (addressEditable) {
      formik.setFieldValue("address", "");
      formik.setFieldValue("address1", "");
      formik.setFieldValue("address2", "");
      formik.setFieldValue("country", "");
      formik.setFieldValue("state", "");
      formik.setFieldValue("district", "");
      formik.setFieldValue("place", "");
      formik.setFieldValue("pincode", "");
      formik.setFieldValue("latitude", "");
      formik.setFieldValue("longitude", "");
      formik.setErrors({});
      formik.setTouched({});
    }
    setAddressEditable(!addressEditable);
  };

  const handlecontactInfoEditable = () => {
    if (contactInfoEditable) {
      formik.setFieldValue("landlineNumber", "");
      formik.setFieldValue("mobileNumber", "");
      formik.setFieldValue("email", "");
      formik.setErrors({});
      formik.setTouched({});
    }
    setContactInfoEditable(!contactInfoEditable);
  };

  const handleemployerEditable = () => {
    if (employerEditable) {
      formik.setFieldValue("employerName", "");
      formik.setFieldValue("designation", "");
      formik.setFieldValue("employerNumber", "");
      formik.setFieldValue("employerEmail", "");
      formik.setErrors({});
      formik.setTouched({});
    }
    setemployerEditable(!employerEditable);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      company: initialCompanyId,
      branch: initialBranchId,
      location: "",
      shortName: "",
      activeDate: new Date().toISOString().split("T")[0], // only date, not datetime
      esiRegion: "",
      address: "",
      address1: "",
      address2: "",
      country: "",
      state: "",
      district: "",
      place: "",
      pincode: "",
      landlineNumber: "",
      mobileNumber: "",
      email: "",
      employerName: "",
      designation: "",
      employerNumber: "",
      employerEmail: "",
      withaffectdate: "",
      authorizationStatus: "0",
      user_code: user_code,
      authorizationDate: new Date().toISOString().split("T")[0],
    },
    validationSchema: Yup.object({
      // company: Yup.string().required("Company is required"),
      branch: Yup.string().required("Branch is required"),
      location: Yup.string().required("Location Name is required"),
      shortName: Yup.string().required("Short Name is required"),
      activeDate: Yup.string().required("Active Date is required"),
      esiRegion: Yup.string().required("ESI Region is required"),
      address: Yup.string().required("Address is required"),
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
      district: Yup.string().required("District is required"),
      place: Yup.string().required("Place is required"),
      pincode: Yup.string()
        .matches(/^\d+$/, "Pincode must be only numbers")
        .required("Pincode is required"),
      landlineNumber: Yup.string()
        .matches(/^\d+$/, "Landline Number must be only numbers")
        .required("Landline Number is required"),
      mobileNumber: Yup.string()
        .matches(/^\d+$/, "Mobile Number must be only numbers")
        .required("Mobile Number is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      employerName: Yup.string().required("Employer Name is required"),
      designation: Yup.string().required("Designation is required"),
      employerNumber: Yup.string()
        .matches(/^\d+$/, "Employer Number must be only numbers")
        .required("Employer Number is required"),
      employerEmail: Yup.string()
        .email("Invalid email format")
        .required("Employer Email is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        onBackendError(""); // clear previous backend error
        const formattedValues = {
          ...values,
          activeDate: values.activeDate.split("T")[0], // Only date
          companyEntity: { id: values.company }, // 👈 nested objects
          branchEntity: { id: values.branch },
        };

        const response = await fetch("http://localhost:8087/location/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedValues),
        });

        // 👇 READ BACKEND MESSAGE
        const message = await response.text();

        if (!response.ok) {
          // Field-level error (unique code)
          if (message.toLowerCase().includes("code")) {
            formik.setFieldError("code", message);
          } else {
            onBackendError(message);
          }
          return;
        }

        alert("Location saved successfully!");
        resetToInitialState();
      } catch (error) {
        console.error(error);
        onBackendError("Something went wrong. Please try again.");
      }
    },
  });

  useEffect(() => {
    loadCompanyAndBranches();
  }, [companyId, defaultBranchId]);

  const cancelForm = () => {
    formik.resetForm();
    setStartDate(null);
    setDateLocked(false);
    setIsDateLocked(false);
    setInputsUnlocked(false);
    setAuthorization("entry");
    focusAndScrollToTop(calendarRef);
  };

  const resetToInitialState = () => {
    formik.resetForm({
      values: {
        ...formik.initialValues,
        company: initialCompanyId,
        branch: initialBranchId,
      },
    });

    setStartDate(null);
    setShowCalendar(true);
    setInputsUnlocked(false);
    setIsDateLocked(false);
    setDateLocked(false);

    setAddressEditable(true);
    setContactInfoEditable(true);
    setemployerEditable(true);

    focusAndScrollToTop(calendarRef);
  };

  useImperativeHandle(ref, () => ({
    refresh: async () => {
      await loadCompanyAndBranches();
    },
    resetForm: async () => {
      cancelForm();
    },
    save: async () => {
      console.log("Manual save triggered");
      await formik.validateForm();
      console.log("Validation errors:", formik.errors);
      await formik.submitForm();
    },
    isDirty: formik.dirty,
    isValid: formik.isValid,
  }));

  return (
    <div className="gen">
      <div className="form">
        <form onSubmit={formik.handleSubmit} className="locationform">
          <div className="screenleft">
            <div className="genaralform">
              <div className="headertext">
                <h4>General Info</h4>
              </div>

              <label htmlFor="company" className="fancy-label">
                Company
              </label>

              <select
                id="company"
                name="company"
                value={formik.values.company}
                disabled
              >
                {companyList.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.company}
                  </option>
                ))}
              </select>

              {formik.touched.company && formik.errors.company ? (
                <div className="error">{formik.errors.company}</div>
              ) : null}

              <label htmlFor="branch" className="fancy-label">
                Branch
              </label>
              <select
                id="branch"
                name="branch"
                value={formik.values.branch}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.branch && formik.errors.branch
                    ? "input-error"
                    : ""
                }
                disabled={!startDate}
              >
                <option value="">Select a branch</option>{" "}
                {/* optional placeholder */}
                {branchList.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.branch}
                  </option>
                ))}
              </select>

              {formik.touched.branch && formik.errors.branch && (
                <div className="error">{formik.errors.branch}</div>
              )}

              <label htmlFor="?Location" className="fancy-label">
                Name
              </label>
              <input
                type="text"
                id="location"
                name="location"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!startDate}
                value={formik.values.location}
                className={
                  formik.touched.location && formik.errors.location
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.location && formik.errors.location ? (
                <div className="error">{formik.errors.location}</div>
              ) : null}

              <label htmlFor="shortName" className="fancy-label">
                Short Name
              </label>
              <input
                type="text"
                id="shortName"
                name="shortName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!startDate}
                value={formik.values.shortName}
                className={
                  formik.touched.shortName && formik.errors.shortName
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.shortName && formik.errors.shortName ? (
                <div className="error">{formik.errors.shortName}</div>
              ) : null}

              <label htmlFor="activeDate" className="fancy-label">
                Active Date
              </label>

              <div className="active-date-wrapper">
                <div className="active-date-input">
                  <DatePicker
                    id="activeDate"
                    name="activeDate"
                    disabled={!startDate}
                    selected={
                      formik.values.activeDate
                        ? new Date(formik.values.activeDate)
                        : new Date() // fallback to today just in case
                    }
                    onChange={(date) => {
                      formik.setFieldValue("activeDate", date.toISOString());
                    }}
                    dateFormat="dd/MM/yyyy"
                    className={
                      formik.touched.activeDate && formik.errors.activeDate
                        ? "active-date-error"
                        : ""
                    }
                  />

                  <div className="active-date-icon">
                    <FaRegCalendarAlt />
                  </div>
                </div>
              </div>

              <label htmlFor="esiRegion" className="fancy-label">
                ESI Region
              </label>
              <input
                type="text"
                id="esiRegion"
                name="esiRegion"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!startDate}
                value={formik.values.esiRegion}
                className={
                  formik.touched.esiRegion && formik.errors.esiRegion
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.esiRegion && formik.errors.esiRegion ? (
                <div className="error">{formik.errors.esiRegion}</div>
              ) : null}
            </div>
            <div className="address">
              <div className="headertext">
                <h4>Address</h4>

                <label className="edit-checkbox">
                  <input
                    type="checkbox"
                    checked={addressEditable}
                    onChange={handleAddressEditToggle}
                    disabled={!startDate || page === "location"}
                  />
                  <span>Edit</span>
                </label>
              </div>

              <label htmlFor="address" className="fancy-label">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!addressEditable || !startDate}
                value={formik.values.address}
                className={
                  formik.touched.address && formik.errors.address
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.address && formik.errors.address ? (
                <div className="error">{formik.errors.address}</div>
              ) : null}

              <input
                type="text"
                id="address1"
                name="address1"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!addressEditable || !startDate}
                value={formik.values.address1}
                className={
                  formik.touched.address1 && formik.errors.address1
                    ? "input-error"
                    : ""
                }
              />
              <input
                type="text"
                id="address2"
                name="address2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!addressEditable || !startDate}
                value={formik.values.address2}
                className={
                  formik.touched.address2 && formik.errors.address2
                    ? "input-error"
                    : ""
                }
              />
              <label htmlFor="country" className="fancy-label">
                Country
              </label>

              <select
                id="country"
                name="country"
                onChange={(e) => {
                  formik.handleChange(e);
                  // Reset dependent states if needed
                  setSelectedCountry(e.target.value);
                  setSelectedState("");
                  setSelectedDistrict("");
                }}
                onBlur={formik.handleBlur}
                value={formik.values.country}
                disabled={!addressEditable || !startDate}
                className={
                  formik.touched.country && formik.errors.country
                    ? "input-error"
                    : ""
                }
              >
                <option value=""></option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>

              {formik.touched.country && formik.errors.country ? (
                <div className="error">{formik.errors.country}</div>
              ) : null}

              <label htmlFor="state" className="fancy-label">
                State
              </label>

              <select
                id="state"
                name="state"
                value={formik.values.state}
                onChange={(e) => {
                  formik.handleChange(e); // update Formik state value
                  setSelectedState(e.target.value); // update local state if you use it
                  setSelectedDistrict(""); // reset district when state changes
                  formik.setFieldValue("district", ""); // also reset district in Formik
                }}
                onBlur={formik.handleBlur}
                disabled={!addressEditable || !startDate || !selectedCountry}
                className={
                  formik.touched.state && formik.errors.state
                    ? "input-error"
                    : ""
                }
              >
                <option value=""></option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>

              {formik.touched.state && formik.errors.state ? (
                <div className="error">{formik.errors.state}</div>
              ) : null}

              <label htmlFor="district" className="fancy-label">
                District
              </label>

              <select
                id="district"
                name="district"
                value={formik.values.district}
                onChange={(e) => {
                  formik.handleChange(e); // Update Formik value
                  setSelectedDistrict(e.target.value); // Also update local state if needed
                }}
                onBlur={formik.handleBlur}
                disabled={!addressEditable || !startDate || !selectedState}
                className={
                  formik.touched.district && formik.errors.district
                    ? "input-error"
                    : ""
                }
              >
                <option value=""></option>
                {districts.map((district) => (
                  <option key={district.name} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>

              {formik.touched.district && formik.errors.district ? (
                <div className="error">{formik.errors.district}</div>
              ) : null}

              <label htmlFor="place" className="fancy-label">
                place
              </label>
              <input
                type="text"
                id="place"
                name="place"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!addressEditable || !startDate}
                value={formik.values.place}
                className={
                  formik.touched.place && formik.errors.place
                    ? "input-error"
                    : ""
                }
              />

              {formik.touched.place && formik.errors.place ? (
                <div className="error">{formik.errors.place}</div>
              ) : null}

              <label htmlFor="pincode" className="fancy-label">
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!addressEditable || !startDate}
                value={formik.values.pincode}
                className={
                  formik.touched.pincode && formik.errors.pincode
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.pincode && formik.errors.pincode ? (
                <div className="error">{formik.errors.pincode}</div>
              ) : null}
            </div>
          </div>
          <div className="screenright">
            <div className="ContactInfo">
              <div className="headertext2">
                <h4>Contact Info</h4>

                <label className="edit-checkbox">
                  <input
                    type="checkbox"
                    checked={contactInfoEditable}
                    onChange={handlecontactInfoEditable}
                    disabled={!startDate || page === "location"}
                  />
                  <span>Edit</span>
                </label>
              </div>
              <label htmlFor="landlineNumber" className="fancy-label">
                Landline Number
              </label>
              <input
                type="text"
                id="landlineNumber"
                name="landlineNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!contactInfoEditable || !startDate}
                value={formik.values.landlineNumber}
                className={
                  formik.touched.landlineNumber && formik.errors.landlineNumber
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.landlineNumber && formik.errors.landlineNumber ? (
                <div className="error">{formik.errors.landlineNumber}</div>
              ) : null}

              <label htmlFor="mobileNumber" className="fancy-label">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!contactInfoEditable || !startDate}
                value={formik.values.mobileNumber}
                className={
                  formik.touched.mobileNumber && formik.errors.mobileNumber
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
                <div className="error">{formik.errors.mobileNumber}</div>
              ) : null}

              <label htmlFor="email" className="fancy-label">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!contactInfoEditable || !startDate}
                value={formik.values.email}
                className={
                  formik.touched.email && formik.errors.email
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="error">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="EmployerInfo">
              <div className="headertext2">
                <h4>Employer Contact Info</h4>

                <label className="edit-checkbox">
                  <input
                    type="checkbox"
                    checked={employerEditable}
                    onChange={handleemployerEditable}
                    disabled={!startDate || page === "location"}
                  />
                  <span>Edit</span>
                </label>
              </div>
              <label htmlFor="employerName" className="fancy-label">
                Name
              </label>
              <input
                type="text"
                id="employerName"
                name="employerName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!employerEditable || !startDate}
                value={formik.values.employerName}
                className={
                  formik.touched.employerName && formik.errors.employerName
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.employerName && formik.errors.employerName ? (
                <div className="error">{formik.errors.employerName}</div>
              ) : null}

              <label htmlFor="designation" className="fancy-label">
                Designation
              </label>
              <input
                type="text"
                id="designation"
                name="designation"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!employerEditable || !startDate}
                value={formik.values.designation}
                className={
                  formik.touched.designation && formik.errors.designation
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.designation && formik.errors.designation ? (
                <div className="error">{formik.errors.designation}</div>
              ) : null}

              <label htmlFor="employerNumber" className="fancy-label">
                Number
              </label>
              <input
                type="text"
                id="employerNumber"
                name="employerNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!employerEditable || !startDate}
                value={formik.values.employerNumber}
                className={
                  formik.touched.employerNumber && formik.errors.employerNumber
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.employerNumber && formik.errors.employerNumber ? (
                <div className="error">{formik.errors.employerNumber}</div>
              ) : null}
              <label htmlFor="employerEmail" className="fancy-label">
                Email
              </label>
              <input
                type="text"
                id="employerEmail"
                name="employerEmail"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!employerEditable || !startDate}
                value={formik.values.employerEmail}
                className={
                  formik.touched.employerEmail && formik.errors.employerEmail
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.employerEmail && formik.errors.employerEmail ? (
                <div className="error">{formik.errors.employerEmail}</div>
              ) : null}
            </div>
          </div>
        </form>
      </div>

      <div className="secform">
        <div className="authorization">
          <label htmlFor="Authorization" className="authorization-label">
            Authorization
          </label>

          <div className="authorization-input-group">
            <select
              id="authorization"
              value={formik.values.authorizationStatus}
              onChange={(e) => {
                const today = new Date().toISOString().split("T")[0];

                formik.setFieldValue("authorizationStatus", e.target.value);
                formik.setFieldValue("authorizationDate", today);
              }}
              className="authorization-dropdown"
            >
              <option value="0">ENTRY</option>
              <option value="1">VERIFIED</option>
            </select>
          </div>
        </div>
        <div className="newbutton">
          <div className="calender">
            {!isDateLocked && (
              <div className="datepicker" ref={calendarRef}>
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  inline
                  autoFocus
                />
              </div>
            )}

            {/* Date input field */}
            <div className="date">
              <div className="left-box">1</div>

              <div className="icondate">
                <input
                  type="text"
                  id="withaffectdate"
                  name="withaffectdate"
                  value={
                    formik.values.withaffectdate
                      ? new Date(
                          formik.values.withaffectdate,
                        ).toLocaleDateString("en-GB")
                      : ""
                  }
                  readOnly
                />

                <FaRegCalendarAlt
                  style={{ color: "#28a745", fontSize: "19px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default GeneralForm;
