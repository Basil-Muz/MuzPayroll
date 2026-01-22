import { useState, useEffect } from "react";
import { useRef } from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageCropModal from "./ImageCropModal";
const VITE_API_BASE_URL = "http://localhost:8087";

const GeneralInfoForm = function GeneralInfoForm({
  register,
  errors,
  // watch,
  setValue,
  clearErrors,
  control,
  flags,
  setError,
  isReadOnly,
  isUnlocked,
  setFocus,
  companys,
  branchList,
  // disabled = {false},
  // requiredMap = {},
}) {
  // const watchName = watch("name");
  // const [imageSrc,setImageSrc]=useState(null);
  const [rawImage, setRawImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const isLocked = !isUnlocked;
  // const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);

  const fieldName = flags.locationForm
    ? "location"
    : flags.companyForm
      ? "company"
      : flags.branchForm
        ? "branch"
        : "name";

  const UserData = localStorage.getItem("loginData");
  const userObj = JSON.parse(UserData);

  const branchId = userObj.branchId;
  console.log("Branches:", branchId);
  // console.log("Branch sgsg", UserData);

  const formatLocalDate = (date) => date.toLocaleDateString("en-CA"); // yyyy-MM-dd

  useEffect(() => {
    if (companys?.length > 0) {
      setValue("companyEntity", companys[0].value);
    }

    if (branchList?.length > 0) {
      // The branchId is string but in branchList it is integer
      setValue("branchEntity", parseInt(branchId), {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
    console.log("General info branch :", branchList);
  }, [companys, setValue, branchList, branchId]);

  useEffect(() => {
    if (isLocked) {
      setTimeout(() => {
        nameInputRef.current?.focus();
        // setIsCompanyMenuOpen(true);
      }, 120);
      // console.log("Field Name :",fieldName);
      setFocus("name");
    }
  }, [isUnlocked, isLocked, setFocus, fieldName]);

  // useImperativeHandle(ref, () => ({
  //   focusName() {
  //   nameInputRef.current?.focus();
  // },
  // }));
  // const watchCompany = watch("company");
  // if(watchCompany){
  //   console.log("Comapny: ",register.company);
  // }

  //   const locations = [
  //   { value: "Kochi", label: "Kochi" },
  //   { value: "Kolkata", label: "Kolkata" },
  //   { value: "Hyderabad", label: "Hyderabad" },
  //     { value: "Bengaluru", label: "Bengaluru" },
  // ];

  // useEffect(()=>{
  //   const PatternName = /^[a-zA-Z\s-]+$/;
  //   if(!watchName || watchName.length<3 || !PatternName.test(watchName)) return;

  //   const shortName = watchName
  //   .trim()
  //   .split(/\s+/)          // split by spaces
  //   .map(word => word[0])  // take first letter
  //   .join("")
  //   .toUpperCase();
  //   setValue('shortName',shortName)

  // },[watchName, setValue])

  // const validateImageDimension = (file, width, height) => {
  //   return new Promise((resolve) => {
  //     const img = new Image();
  //     const url = URL.createObjectURL(file);

  //     img.onload = () => {
  //       URL.revokeObjectURL(url);
  //       if (img.width === width && img.height === height) {
  //         resolve(true);
  //       } else {
  //         resolve(`Image must be exactly ${width} × ${height}px`);
  //       }
  //     };

  //     img.onerror = () => {
  //       resolve("Invalid image file");
  //     };

  //     img.src = url;
  //   });
  // };

  return (
    <>
      <div className={`gen-form ${isLocked ? "locked" : ""}`}>
        <div className={`form-section-header `}>
          {/* <span className="section-number">1</span> */}
          <h2 className="section-title">General Information</h2>
          <span className="section-subtitle">
            Basic
            {flags.locationForm && " company location "}
            {flags.companyForm && " company "}
            {flags.branchForm && " branch "}
            details
          </span>
        </div>
        <div className="form-grid">
          {!flags.companyForm && (
            <div className="branch-form-group">
              <label className="form-label required">Company</label>
              {/* <input 
                    type="text" 
                    className={`form-control ${errors.company ? "error" : ""}`}
                    placeholder="Select Company"
                    {...register('company', { required: "Company is required",
                      pattern:{
                        value:/^[a-zA-Z0-9\s-]*$/,
                        message:"Please enter valide company",
                      }
                      })}
                  /> */}
              <Controller
                name="companyEntity"
                // ref={(!flags.companyForm)  ? firstFieldRef : null}
                control={control}
                disabled={isReadOnly}
                rules={{ required: "Please select a company" }}
                render={({ field }) => {
                  const selectedOption = companys.find(
                    (opt) => opt.value === field.value,
                  );
                  // onchange={setIsCompanyMenuOpen(true)}
                  return (
                    <Select
                      options={companys}
                      placeholder="Select company"
                      // ref={!flags.companyForm ? nameInputRef : null}
                      isDisabled={isReadOnly}
                      isSearchable
                      // menuIsOpen={isCompanyMenuOpen? true : null}
                      // onMenuClose={() => setIsCompanyMenuOpen(false)}
                      classNamePrefix="form-control-select"
                      className={`${errors.companyEntity ? "error" : ""} ${isReadOnly ? "read-only" : ""}`}
                      value={selectedOption || null} //                   label comes from options
                      onChange={(option) => {
                        field.onChange(option.value);
                        // setIsCompanyMenuOpen(!isCompanyMenuOpen)
                      }}
                      // store ONLY value
                    />
                  );
                }}
              />

              {errors.companyEntity && (
                <span className="error-message">
                  {errors.companyEntity.message}
                </span>
              )}
            </div>
          )}

          {!flags.companyForm && !flags.branchForm && (
            <div className="branch-form-group">
              <label className="form-label required">Branch</label>
              <Controller
                name="branchEntity"
                control={control}
                rules={{ required: "Please select a branch" }}
                render={({ field }) => {
                  const selectedOption = branchList.find(
                    (opt) => opt.value === field.value,
                  );
                  return (
                    <Select
                      options={branchList}
                      placeholder="Select branch"
                      isSearchable
                      isDisabled={isReadOnly}
                      classNamePrefix="form-control-select"
                      className={`${errors.branchEntity ? "error" : ""} ${isReadOnly ? "read-only" : ""}`}
                      value={selectedOption || null} // important
                      onChange={(option) => field.onChange(option.value)} // store full object
                    />
                  );
                }}
              />
              {errors.branchEntity && (
                <span className="error-message">
                  {errors.branchEntity.message}
                </span>
              )}
            </div>
          )}

          {/* {(!flags.companyForm && !flags.branchForm) && <div className="branch-form-group">
                  <label className="form-label required">Location</label>
                  <Controller
                    name="location"
                    control={control}
                    rules={{ required: "Please select a location" }}
                    render={({ field }) => (
                      <Select
                        options={locations}
                        placeholder="Select location"
                        isSearchable
                        classNamePrefix="form-control-select"
                        className={errors.location ? "error" : ""}
                        value={field.value}                //  important
                        onChange={(option) => field.onChange(option)} //  store full object
                      />
                    )}
                  />
                  {errors.location && (
                    <span className="error-message">{errors.location.message}</span>
                  )}
                </div>} */}

          <div className="branch-form-group">
            <label className="form-label required">
              {flags.locationForm && "Location "}
              {flags.companyForm && "Company "}
              {flags.branchForm && "Branch "}
              Name
            </label>
            <input
              type="text"
              // ref={nameInputRef}
              className={`form-control ${errors[fieldName] ? "error" : ""} ${isReadOnly ? "read-only" : ""}`}
              placeholder="Enter name"
              disabled={isReadOnly}
              {...register(fieldName, {
                required: `Name is required ${fieldName}`,
                pattern: {
                  value: /^[a-zA-Z\s-]+$/,
                  message: "Please enter valide name",
                },
                onChange: (e) => {
                  const value = e.target.value;

                  if (value.length < 3) return;

                  const short = value
                    .trim()
                    .split(/\s+/)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase();
                  setValue("shortName", short, {
                    shouldDirty: true,
                    shouldValidate: false,
                  });
                  clearErrors("shortName");
                },
              })}
            />
            {errors[fieldName] && (
              <span className="error-message">{errors[fieldName].message}</span>
            )}
          </div>

          <div className="branch-form-group">
            <label className="form-label required">
              {flags.locationForm && "Location "}
              {flags.companyForm && "Company "}
              {flags.branchForm && "Branch "}
              Short Name
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              className={`form-control ${errors.shortName ? "error" : ""} ${isReadOnly ? "read-only" : ""}`}
              placeholder="eg: TCS, IBM , SAP.."
              {...register("shortName", {
                required: "short name is required",
                pattern: {
                  value: /^[A-Z0-9]*$/,
                  message: "Please enter valide name",
                },
              })}
            />
            {errors.shortName && (
              <span className="error-message">{errors.shortName.message}</span>
            )}
          </div>

          {/* <div className="branch-form-group">
                  <label className="form-label required">Branch Code</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Enter branch code"
                    {...register('branchCode', { required: true })}
                  />
                  <span className="text-hint">Unique identifier for the branch</span>
                </div> */}

          <div className="branch-form-group">
            <label className="form-label required">Active Date</label>
            <Controller
              name="activeDate" // feild name
              control={control}
              rules={{ required: "Please select a date" }}
              render={({ field }) => (
                <DatePicker
                  placeholderText="Select date"
                  disabled={isReadOnly}
                  className={`form-control datepicker-input ${
                    errors.activeDate ? "error" : ""
                  }`}
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? formatLocalDate(date) : null)
                  }
                  dateFormat="dd/MM/yyyy"
                  // minDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  calendarClassName="custom-datepicker"
                  popperClassName="custom-datepicker-popper"
                />
              )}
            />
            {errors.activeDate && (
              <span className="error-message">Active Date is required</span>
            )}
          </div>

          {flags.locationForm && (
            <div className="branch-form-group">
              <label className="form-label required">ESI Reagion</label>
              <input
                type="text"
                disabled={isReadOnly}
                className={`form-control ${errors.esiRegion ? "error" : ""} ${isReadOnly ? "read-only" : ""}`}
                placeholder="Enter ESI Reagion"
                {...register("esiRegion", {
                  required: "ESI Reagion is required",
                  pattern: {
                    value: /^[a-zA-Z\s-]+$/,
                    message: "Please enter valide ESI Reagion",
                  },
                })}
              />
              {errors.esiRegion && (
                <span className="error-message">
                  {errors.esiRegion.message}
                </span>
              )}
            </div>
          )}

          {flags.companyForm && (
            <div className="branch-form-group">
              <label className="form-label required">
                Company Image (300 × 250)
              </label>

              <div className="image-upload-container">
                <Controller
                  name="companyImage"
                  control={control}
                  rules={{ required: "Company image is required" }}
                  render={({ field }) => (
                    <div className="image-upload-wrapper">
                      {/* Upload Area */}
                      <div className="image-upload-area">
                        <input
                          type="file"
                          disabled={isReadOnly}
                          id="company-image-upload"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            // Validate file type
                            if (!file.type.match("image/(png|jpeg|jpg)")) {
                              setError("companyImage", {
                                type: "manual",
                                message:
                                  "Only PNG, JPG and JPEG files are allowed",
                              });
                              return;
                            }

                            // Validate file size (5MB max)
                            if (file.size > 5 * 1024 * 1024) {
                              setError("companyImage", {
                                type: "manual",
                                message: "File size must be less than 5MB",
                              });
                              return;
                            }

                            setRawImage(file);
                            setShowCropper(true);
                          }}
                          className={`image-input ${isReadOnly ? "read-only" : ""}`}
                        />

                        {!field.value && (
                          <label
                            htmlFor="company-image-upload"
                            className="upload-label"
                          >
                            <div className="upload-icon">
                              <svg
                                width="22"
                                height="22"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                            </div>

                            <div className="upload-text">
                              <span className="upload-title">
                                Click to upload
                              </span>
                              <span className="upload-subtitle">
                                PNG or JPG (Max 5MB)
                              </span>
                              <span className="upload-dimensions">
                                Recommended: 300 × 250 pixels
                              </span>
                            </div>
                          </label>
                        )}

                        {/* Image Preview */}
                        {field.value && (
                          <div className="image-preview">
                            <div className="preview-container">
                              {typeof field.value === "string" ? (
                                // If it's a URL (from existing image)
                                <img
                                  // src={field.value}
                                  src={`${VITE_API_BASE_URL}${field.value}`}
                                  alt="Company preview"
                                  className="preview-image"
                                />
                              ) : (
                                // If it's a File object (new upload)
                                <div className="preview-thumbnail">
                                  <div>
                                    <span className="file-icon">
                                      <svg
                                        width="20"
                                        height="20"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          stroke="currentColor"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                  <div className="file-name-section">
                                    <span className="file-name">
                                      {field.value.name}
                                    </span>
                                    <span className="file-size">
                                      {(field.value.size / 1024 / 1024).toFixed(
                                        2,
                                      )}{" "}
                                      MB
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="preview-actions">
                              <button
                                type="button"
                                className="btn-change-image"
                                onClick={() =>
                                  document
                                    .getElementById("company-image-upload")
                                    .click()
                                }
                              >
                                Change Image
                              </button>
                              <button
                                type="button"
                                className="btn-remove-image"
                                onClick={() => {
                                  field.onChange(null);
                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = "";
                                  }
                                }}
                                aria-label="Remove image"
                              >
                                {" "}
                                Remove
                                {/* <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg> */}
                              </button>
                              {showCropper && (
                                <button
                                  type="button"
                                  className="btn-crop-image"
                                  onClick={() => setShowCropper(true)}
                                >
                                  Edit Crop
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Error Message */}
                      {errors.companyImage && (
                        <div className="error-message">
                          {/* <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg> */}
                          {errors.companyImage.message}
                        </div>
                      )}

                      {/* Crop Modal */}
                      {showCropper && (
                        <ImageCropModal
                          file={rawImage}
                          aspectRatio={300 / 250}
                          onClose={() => setShowCropper(false)}
                          onSave={(croppedFile) => {
                            field.onChange(croppedFile);
                            setShowCropper(false);
                          }}
                        />
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          )}
          {/* Add more form fields as needed */}
        </div>
      </div>
    </>
  );
};
export default GeneralInfoForm;
