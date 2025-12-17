import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./GeneralForm.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { IoClose } from "react-icons/io5";

const GeneralForm = forwardRef(({ onFormChange, onBackendError }, ref) => {
  let page = "company";
  const user_code = 1001;
  const [employerEditable, setemployerEditable] = useState(false);
  const [addressEditable, setAddressEditable] = useState(false);
  const [contactInfoEditable, setContactInfoEditable] = useState(false);
  const [imageUpload, setImageUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const codeInputRef = useRef(null);
  const calendarRef = useRef(null);

  const [startDate, setStartDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [inputsUnlocked, setInputsUnlocked] = useState(false);
  const [dateLocked, setDateLocked] = useState(false);
  const [isDateLocked, setIsDateLocked] = useState(false);
  const [authorization, setAuthorization] = useState("Active");
  const [todayDate, setTodayDate] = useState("");

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleSelect = () => {
    // store selected file (optional – remove if you don't need it)
    formik.setFieldValue("companyImage", file);

    // close popup
    setImageUpload(false);
  };

  const resetToInitialState = () => {
    // Formik reset
    formik.resetForm();

    // 🔒 Lock everything again
    setStartDate(null);
    setIsDateLocked(false);
    setDateLocked(false);
    setInputsUnlocked(false);

    // 📅 Show calendar again
    setShowCalendar(true);

    // 🖼 Clear image
    setFile(null);
    setError("");
    formik.setFieldValue("companyImage", null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Close popup
    setImageUpload(false);

    // Focus back to calendar
    focusWithTimeout(calendarRef);
  };

  const focusWithTimeout = (ref, delay = 100) => {
    setTimeout(() => {
      if (ref?.current) {
        if (typeof ref.current.scrollIntoView === "function") {
          ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (typeof ref.current.focus === "function") {
          ref.current.focus();
        }
      }
    }, delay);
  };

  const handleDateChange = (date) => {
    if (!dateLocked) {
      setStartDate(date);

      formik.setFieldValue("withaffectdate", date.toISOString().split("T")[0]);

      setShowCalendar(false);
      setInputsUnlocked(true);
      setIsDateLocked(true);
      focusWithTimeout(codeInputRef);
    }
  };
  useEffect(() => {
    if (page === "company") {
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
    initialValues: {
      // code: "",
      company: "",
      shortName: "",
      activeDate: new Date().toISOString().split("T")[0], // only date, not datetime
      address: "",
      address1: "",
      address2: "",
      country: "",
      state: "",
      district: "",
      place: "",
      pincode: "",
      latitude: "",
      longitude: "",
      landlineNumber: "",
      mobileNumber: "",
      email: "",
      employerName: "",
      designation: "",
      employerNumber: "",
      employerEmail: "",
      companyImage: null,
      withaffectdate: "",
      authorizationStatus: "0",
      user_code: user_code,
      authorizationDate: new Date().toISOString().split("T")[0],
    },
    validationSchema: Yup.object({
      // code: Yup.string()
      //   .required("Code is required")
      //   .test(
      //     "only-numbers-symbols",
      //     "Code must contain only numbers and symbols, no alphabets or spaces",
      //     (value) => /^[0-9\W_]+$/.test(value || ""),
      //   ),
      company: Yup.string().required("Company Name is required"),
      shortName: Yup.string().required("Short Name is required"),
      activeDate: Yup.string().required("Active Date is required"),
      address: Yup.string().required("Address is required"),
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
      district: Yup.string().required("District is required"),
      place: Yup.string().required("Place is required"),
      pincode: Yup.string()
        .matches(/^\d+$/, "Pincode must be only numbers")
        .required("Pincode is required"),
      latitude: Yup.string()
        .matches(/^\d+(\.\d+)?$/, "Latitude must be only numbers")
        .required("Latitude is required"),
      longitude: Yup.string()
        .matches(/^\d+(\.\d+)?$/, "Longitude must be only numbers")
        .required("Longitude is required"),
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
      withaffectdate: Yup.string().required("with affect date is required"),
    }),
    onSubmit: async (values) => {
      try {
        onBackendError([]); // clear previous backend error

        const formData = new FormData();

        // Append all fields except image
        Object.keys(values).forEach((key) => {
          if (key !== "companyImage") {
            formData.append(key, values[key]);
          }
        });

        // Append image if exists
        if (values.companyImage) {
          formData.append("companyImage", values.companyImage);
        }

        const response = await fetch("http://localhost:8087/saveCompany", {
          method: "POST",
          body: formData,
        });

        // 👇 READ BACKEND MESSAGE
        const message = await response.text();

        if (!response.ok) {
          // Field-level error (unique code)
          if (message.toLowerCase().includes("code")) {
            formik.setFieldError("code", message);
            onBackendError(prev => [
              ...(Array.isArray(prev) ? prev : []),//when prev is not array or null
                  { id: Date.now(), msg: message , status: false },
            ]); // show in header
  // } else {
            

          }
          return;
        }

        // ✅ SUCCESS
        alert("Company saved successfully!");
        resetToInitialState();
        } catch (error) {
          console.error(error);
          onBackendError(["Something went wrong. Please try again."]);
        }
    },
  });

  const cancelForm = () => {
    formik.resetForm();
    setStartDate(null);
    setDateLocked(false);
    setIsDateLocked(false);
    setInputsUnlocked(false);
    setAuthorization("entry");

    // ✅ Clear image
    setFile(null);
    setError("");
    formik.setFieldValue("companyImage", null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    focusWithTimeout(calendarRef);
  };

  useImperativeHandle(ref, () => ({
    // refresh: async () => {
    //   await loadCompanyAndBranches();
    // },
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
        <form onSubmit={formik.handleSubmit} className="Companyform">
          <div className="screenleft">
            <div className="genaralform">
              <div className="headertext">
                <h4>General Info</h4>
              </div>
              {/* {onBackendError.length > 0 && (
                <div className="backend-errors">
                  {onBackendError.length}
                </div>)} */}
              <label htmlFor="code" className="fancy-label">
                Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                ref={codeInputRef}
                onChange={(e) => {
                  onBackendError([]); // 👈 clear backend error
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                disabled={!startDate}
                value={formik.values.code}
                disabled
                className={
                  formik.touched.code && formik.errors.code ? "input-error" : ""
                }
              />
              {formik.touched.code && formik.errors.code ? (
                <div className="error">{formik.errors.code}</div>
              ) : null}

              <label htmlFor="company" className="fancy-label">
                Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!startDate}
                value={formik.values.company}
                className={
                  formik.touched.company && formik.errors.company
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.company && formik.errors.company ? (
                <div className="error">{formik.errors.company}</div>
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

              <button
                type="button"
                className="imageupload"
                onClick={() => setImageUpload(true)}
              >
                Image Upload
              </button>

              {imageUpload && (
                <div className="popup-overlay">
                  <div className="popup-box">
                    <div className="imagehead">
                      <h3 className="upload">Image Upload</h3>
                      <button
                        className="close-btn"
                        onClick={() => setImageUpload(false)}
                      >
                        <IoClose />
                      </button>
                    </div>
                    <label htmlFor="File" className="fancy-label">
                      Upload File
                    </label>
                    {/* FILE INPUT */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                        setError("");
                      }}
                    />

                    {/* SHOW SELECTED FILE */}
                    {file && (
                      <p className="file-selected">Selected: {file.name}</p>
                    )}

                    {/* ERROR MESSAGE */}
                    {error && (
                      <p style={{ color: "red", marginTop: "5px" }}>{error}</p>
                    )}

                    <p className="dimension-text">
                      Image dimension must be <b>490 × 350 px</b>
                    </p>

                    {/* SELECT BUTTON WITH VALIDATION */}
                    <button
                      type="button" // 👈 VERY IMPORTANT
                      className="select-btn"
                      onClick={() => {
                        if (!file) {
                          setError("Please upload an image.");
                          return;
                        }

                        const img = new Image();
                        img.src = URL.createObjectURL(file);

                        img.onload = () => {
                          // Optional dimension check
                          // if (img.width !== 490 || img.height !== 350) {
                          //   setError("Image must be exactly 490 × 350 pixels.");
                          //   return;
                          // }

                          // Store locally (Formik state only)
                          formik.setFieldValue("companyImage", file);

                          setImageUpload(false); // close popup
                        };
                      }}
                    >
                      Select and Close
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="address">
              <div className="headertext">
                <h4>Address</h4>

                <label className="edit-checkbox">
                  <input
                    type="checkbox"
                    checked={addressEditable}
                    onChange={handleAddressEditToggle}
                    disabled={!startDate || page === "company"}
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
                  formik.handleChange(e);
                  setSelectedState(e.target.value);
                  setSelectedDistrict("");
                  formik.setFieldValue("district", "");
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

              <label htmlFor="latitude" className="fancy-label">
                Latitude
              </label>
              <input
                type="text"
                id="latitude"
                name="latitude"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!addressEditable || !startDate}
                value={formik.values.latitude}
                className={
                  formik.touched.latitude && formik.errors.latitude
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.latitude && formik.errors.latitude ? (
                <div className="error">{formik.errors.latitude}</div>
              ) : null}

              <label htmlFor="longitude" className="fancy-label">
                Longitude
              </label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!addressEditable || !startDate}
                value={formik.values.longitude}
                className={
                  formik.touched.longitude && formik.errors.longitude
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.longitude && formik.errors.longitude ? (
                <div className="error">{formik.errors.longitude}</div>
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
                    disabled={!startDate || page === "company"}
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
                    disabled={!startDate || page === "company"}
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

          <div className="form-buttons">
            <button
              type="submit"
              className="submit-btn"
              onClick={formik.handleSubmit} // optional, Formik already handles this with type="submit"
            >
              Submit
            </button>
            <button type="button" className="cancel-btn" onClick={cancelForm}>
              Cancel
            </button>
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
