export default function ContactForm({
  register,
  errors,
  flags,
  // watch,
  // setValue,
  // setError,
  // disabled = {branchEmail:false},
  // requiredMap = {},
}) {
  
  return (
    <>
      <div className="section-header">
        {/* <span className="section-number">3</span> */}
        <h3 className="section-title">{flags.branchForm && "Branch"}{flags.companyForm && "Company"}{flags.locationForm && "Location"} Contact Information</h3>
        <span className="section-subtitle">{flags.branchForm && "Branch"}{flags.companyForm && "Company"}{flags.locationForm && "Location"} Communication details</span>
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
          <span className="error-message">
            {errors.email.message}
          </span>
        )}
      </div>
      <div className="branch-form-group">
        <label className="form-label required">Phone</label>
        <input
        className={`form-control ${errors.phone ? "error" : ""}`}
          // disabled={disabled.phone}
          {...register('phone', { required: "Branch phone number required",
            pattern:{
              value: /^[0-9]{10}$/,
              message: "Please enter a valid phone number",
          }})}
        />
        {errors.phone && (
            <span className="error-message"> {errors.phone.message}</span>
          )}
      </div>

      <div className="branch-form-group">
        <label className="form-label">Landline</label>
        <input
        className={`form-control ${errors.landline ? "error" : ""}`}
          // disabled={disabled.landline}
          {...register('landline', { required: false ,
            pattern:{
              value: /^[0-9]{8}$/,
              message: "Please enter a valid landline number",
          }})}
        />
        {errors.landline && (
          <span className="error-message"> {errors.landline.message}</span>
        )}
      </div>
      </div>

      {!flags.branchForm && <div className="section-header">
        {/* <span className="section-number">3</span> */}
        <h3 className="section-title">Employer Contact Information</h3>
        <span className="section-subtitle">Employer Communication details</span>
      </div>}
      {!flags.branchForm && <div className="form-grid">
        <div className="branch-form-group">
        <label className="form-label">Name</label>
        <input
        className={`form-control ${errors.employerName ? "error" : ""}`}
          // disabled={disabled}
          {...register('employerName', { required: false , 
            pattern: {
              value: /^[a-zA-Z\u00C0-\u01FF\s'-]+$/,
              message: "Please enter a valid name",
            },
          })}
        />
        {errors.employerName && (
            <span className="error-message">{errors.employerName.message}</span>
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
        className={`form-control ${errors.employerPhone ? "error" : ""}`}
          // disabled={disabled}
          {...register('employerPhone', { required: false,
            pattern:{
              value: /^[0-9]{10}$/,
              message: "Please enter a valid phone number",
          }})}
        />
        {errors.employerPhone && (
            <span className="error-message"> {errors.employerPhone.message}</span>
          )}
      </div>

      <div className="branch-form-group">
        <label className="form-label">Designation</label>
        <input
        className={`form-control ${errors.employerDesignation ? "error" : ""}`}
          // disabled={disabled}
          {...register('employerDesignation', { required: false,
            pattern:{
              value: /^[a-zA-Z\u00C0-\u01FF\s'-]+$/,
              message: "Please enter a valid designation",
          }})}
        />
        {errors.employerDesignation && (
          <span className="error-message">{errors.employerDesignation.message}</span>
        )}
      </div>
      </div>}
    </>
  );
}
