export default function GeneralInfoForm({
  register,
  errors,
  disabled = false,
  requiredMap = {},
}) {
  return (
    <>
      {/* <div className="section-header">
                <span className="section-number">1</span>
                <h2 className="section-title">General Information</h2>
                <span className="section-subtitle">Basic branch details</span>
              </div> */}
              <div className="form-grid">
                <div className="branch-form-group">
                  <label className="form-label required">Company</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Select Company"
                    {...register('company', { required: true })}
                  />
                  {errors.company && (
                    <span className="error-message">Company is required</span>
                  )}
                </div>

                <div className="branch-form-group">
                  <label className="form-label required">Branch Short Name</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Enter branch Short name"
                    {...register('branchShortName', { required: true })}
                  />
                  {errors.branchShortName && (
                    <span className="error-message">Branch Short name is required</span>
                  )}
                </div>

                <div className="branch-form-group">
                  <label className="form-label required">Branch Name</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Enter branch name"
                    {...register('branchName', { required: true })}
                  />
                  {errors.branchName && (
                    <span className="error-message">Branch name is required</span>
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
                  <input
                    type="date"
                    className="form-control"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("activeDate", { required: true })}
                  />
                  {errors.activeDate && (
                    <span className="error-message">Active Date is required</span>
                  )}
                </div>
                {/* Add more form fields as needed */}
              </div>
    </>
  );
}
