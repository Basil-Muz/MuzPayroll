export default function ContactForm({
  register,
  errors,
  // watch,
  // setValue,
  // setError,
  disabled = {branchEmail:false},
  // requiredMap = {},
}) {
  
  return (
    <>
      <div className="section-header">
        {/* <span className="section-number">3</span> */}
        <h3 className="section-title">Branch Contact Information</h3>
        <span className="section-subtitle">Branch Communication details</span>
      </div>
      <div className="form-grid">
        <div className="branch-form-group">
        <label className="form-label required">Email</label>
        <input
        className={`form-control ${errors.branchEmail ? "error" : ""}`}
          disabled={disabled.branchEmail}
          {...register("branchEmail", {
            required: "Branch email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          })}
        />
        {errors.branchEmail && (
          <span className="error-message">
            {errors.branchEmail.message}
          </span>
        )}
      </div>
      <div className="branch-form-group">
        <label className="form-label required">Phone</label>
        <input
        className={`form-control ${errors.branchPhone ? "error" : ""}`}
          // disabled={disabled.branchPhone}
          {...register('branchPhone', { required: "Branch phone number required",
            pattern:{
              value: /^[0-9]{10}$/,
              message: "Please enter a valid phone number",
          }})}
        />
        {errors.branchPhone && (
            <span className="error-message"> {errors.branchPhone.message}</span>
          )}
      </div>

      <div className="branch-form-group">
        <label className="form-label">Landline</label>
        <input
        className={`form-control ${errors.branchLandline ? "error" : ""}`}
          // disabled={disabled.branchLandline}
          {...register('branchLandline', { required: false ,
            pattern:{
              value: /^[0-9]{8}$/,
              message: "Please enter a valid landline number",
          }})}
        />
        {errors.branchLandline && (
          <span className="error-message"> {errors.branchLandline.message}</span>
        )}
      </div>
      </div>
      <div className="section-header">
        {/* <span className="section-number">3</span> */}
        <h3 className="section-title">Employer Contact Information</h3>
        <span className="section-subtitle">Employer Communication details</span>
      </div>
      <div className="form-grid">
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
        <label className="form-label">Landline</label>
        <input
        className={`form-control ${errors.employerLandline ? "error" : ""}`}
          // disabled={disabled}
          {...register('employerLandline', { required: false,
            pattern:{
              value: /^[0-9]{8}$/,
              message: "Please enter a valid phone number",
          }})}
        />
        {errors.employerLandline && (
          <span className="error-message">{errors.employerLandline.message}</span>
        )}
      </div>
      </div>
    </>
  );
}
