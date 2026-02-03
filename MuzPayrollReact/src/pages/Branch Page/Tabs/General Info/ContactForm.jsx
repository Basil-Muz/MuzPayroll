import { useEffect } from "react";
export default function ContactForm({
  register,
  errors,
  flags,
  setFocus,
  // watch,
  // setValue,
  // setError,
  // disabled = {branchEmail:false},
  // requiredMap = {},
}) {
  useEffect(() => {
    setFocus("email");
  }, [setFocus]);
  return (
    <>
      <div className="form-section-header">
        {/* <span className="section-number">3</span> */}
        <h3 className="section-title">
          {flags.branchForm && "Branch"}
          {flags.companyForm && "Company"}
          {flags.locationForm && "Location"} Contact Information
        </h3>
        <span className="section-subtitle">
          {flags.branchForm && "Branch"}
          {flags.companyForm && "Company"}
          {flags.locationForm && "Location"} Communication details
        </span>
      </div>
      <div className="form-grid">
        <div className="branch-form-group">
          <label className="form-label required">Email</label>
          <input
            className={`form-control ${errors.email ? "error" : ""}`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <span className="error-message">{errors.email.message}</span>
          )}
        </div>
        <div className="branch-form-group">
          <label className="form-label required">Phone</label>
          <input
            className={`form-control ${errors.mobileNumber ? "error" : ""}`}
            // disabled={disabled.mobileNumber}
            {...register("mobileNumber", {
              required: "Branch phone number required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid phone number",
              },
            })}
          />
          {errors.mobileNumber && (
            <span className="error-message">
              {" "}
              {errors.mobileNumber.message}
            </span>
          )}
        </div>

        <div className="branch-form-group">
          <label className="form-label">Landline</label>
          <input
            className={`form-control ${errors.landlineNumber ? "error" : ""}`}
            // disabled={disabled.landlineNumber}
            {...register("landlineNumber", {
              required: false,
              pattern: {
                value: /^(0\d{2,4}[- ]?)?\d{6,8}$/,
                message: "Please enter a valid landlineNumber number",
              },
            })}
          />
          {errors.landlineNumber && (
            <span className="error-message">
              {" "}
              {errors.landlineNumber.message}
            </span>
          )}
        </div>
      </div>

      {!flags.branchForm && (
        <div className="form-section-header">
          {/* <span className="section-number">3</span> */}
          <h3 className="section-title">Employer Contact Information</h3>
          <span className="section-subtitle">
            Employer Communication details
          </span>
        </div>
      )}
      {!flags.branchForm && (
        <div className="form-grid">
          <div className="branch-form-group">
            <label className="form-label">Name</label>
            <input
              className={`form-control ${errors.employerName ? "error" : ""}`}
              // disabled={disabled}
              {...register("employerName", {
                required: false,
                pattern: {
                  value: /^[a-zA-Z\u00C0-\u01FF\s'-]+$/,
                  message: "Please enter a valid name",
                },
              })}
            />
            {errors.employerName && (
              <span className="error-message">
                {errors.employerName.message}
              </span>
            )}
          </div>

          <div className="branch-form-group">
            <label className="form-label">Email</label>
            <input
              className={`form-control ${errors.employerEmail ? "error" : ""}`}
              // disabled={disabled}
              {...register("employerEmail", {
                // required: "Employer Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.employerEmail && (
              <span className="error-message">
                {errors.employerEmail.message}
              </span>
            )}
          </div>
          <div className="branch-form-group">
            <label className="form-label">Phone</label>
            <input
              className={`form-control ${errors.employerNumber ? "error" : ""}`}
              // disabled={disabled}
              {...register("employerNumber", {
                required: false,
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid phone number",
                },
              })}
            />
            {errors.employerNumber && (
              <span className="error-message">
                {" "}
                {errors.employerNumber.message}
              </span>
            )}
          </div>

          <div className="branch-form-group">
            <label className="form-label">Designation</label>
            <input
              className={`form-control ${errors.designation ? "error" : ""}`}
              // disabled={disabled}
              {...register("designation", {
                required: false,
                pattern: {
                  value: /^[a-zA-Z\u00C0-\u01FF\s'-]+$/,
                  message: "Please enter a valid designation",
                },
              })}
            />
            {errors.designation && (
              <span className="error-message">
                {errors.designation.message}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
