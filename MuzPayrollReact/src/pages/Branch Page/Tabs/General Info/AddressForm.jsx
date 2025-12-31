import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function AddressForm({
  register,
  errors,
  disabled = false,
  requiredMap = {},
}) {

    const {
      // register,
      handleSubmit,
      trigger,
      setError,
      setValue,
      watch,
      // formState: { errors },
    } = useForm({ mode: "onBlur" });
    const watchedPincode = watch("branchPinCode");
    useEffect(() => {
      if (!watchedPincode || watchedPincode.length !== 6) return;
  
      const fetchLocationByPincode = async () => {
          try {
              // Example: India pincode API
              const response = await fetch(
                  `https://api.postalpincode.in/pincode/${watchedPincode}`
              );
              const data = await response.json();
  
              if (data[0]?.Status !== "Success") {
                  setError("branchPinCode", {
                      type: "manual",
                      message: "Invalid Pincode",
                  });
                  return;
              }
  
              const postOffice = data[0].PostOffice[0];
  
              // Auto-fill fields
              setValue("branchCountry", "India");
              setValue("branchState", postOffice.State);
              setValue("branchDistrict", postOffice.District);
              setValue("branchPlace", postOffice.Name);
  
              // Optional: Lat/Lng (if you use a geocoding API)
              setValue("branchLatitude", "");
              setValue("branchLongitude", "");
  
          } catch (error) {
              setError("branchPinCode", {
                  type: "manual",
                  message: "Unable to fetch location details",
              });
              console.error("Error fetching pincode data:", error);
          }
      };
    fetchLocationByPincode();
  }, [watchedPincode, setValue, setError]);
  return (
    <>
     {/* <div className="section-header">
                <span className="section-number">2</span>
                <h2 className="section-title">Address Details</h2>
                <span className="section-subtitle">Location information</span>
              </div> */}
              <div className="form-grid">
                <div className="branch-form-group">
                    <label className="form-label required">Address</label>
                    <textarea
                      type="text" 
                      className="form-control"
                      placeholder="Enter branch Address"
                      {...register('branchAddress', { required: true })}
                    />
                    {errors.branchAddress && (
                      <span className="error-message">Branch Address is required</span>
                    )}
                  </div>

                  <div className="branch-form-group">
                    <label className="form-label required">Pincode</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter branch Pincode"
                      maxLength={6}
                      inputMode="numeric"
                      {...register("branchPinCode", {
                        required: "Branch PinCode is required",
                        pattern: {
                                    value: /^[0-9]{6}$/,
                                    message: "Enter valid 6 digit pincode",
                                  },
                      })}
                    />
                    {errors.branchPinCode && (
                      <span className="error-message">Branch PinCode is required</span>
                    )}
                  </div>

                  <div className="branch-form-group">
                    <label className="form-label required"> Country</label>
                    <input
                      type="text" 
                      className="form-control"
                      placeholder="Enter branch Country"
                      {...register('branchCountry', { required: true })}
                    />
                    {errors.branchCountry && (
                      <span className="error-message">Branch Country is required</span>
                    )}
                  </div>

                  <div className="branch-form-group">
                    <label className="form-label required"> State</label>
                    <input
                      type="text" 
                      className="form-control"
                      placeholder="Enter branch State"
                      {...register('branchState', { required: true })}
                    />
                    {errors.branchState && (
                      <span className="error-message">Branch State is required</span>
                    )}
                  </div>

                  <div className="branch-form-group">
                    <label className="form-label required">District</label>
                    <input
                      type="text" 
                      className="form-control"
                      placeholder="Enter branch District"
                      {...register('branchDistrict', { required: true })}
                    />
                    {errors.branchDistrict && (
                      <span className="error-message">Branch District is required</span>
                    )}
                  </div>

                  <div className="branch-form-group">
                    <label className="form-label required">Place</label>
                    <input
                      type="text" 
                      className="form-control"
                      placeholder="Enter branch Place"
                      {...register('branchPlace', { required: true })}
                    />
                    {errors.branchPlace && (
                      <span className="error-message">Branch Place is required</span>
                    )}
                  </div>

                  <div className="branch-form-group">
                    <label className="form-label required"> Latitude</label>
                    <input
                      type="text" 
                      className="form-control"
                      placeholder="Enter branch Latitude"
                      {...register('branchLatitude', { required: true })}
                    />
                    {errors.branchLatitude && (
                      <span className="error-message"> Latitude is required</span>
                    )}
                  </div>

                  <div className="branch-form-group">
                    <label className="form-label required"> Longitude</label>
                    <input
                      type="text" 
                      className="form-control"
                      placeholder="Enter branch Longitude"
                      {...register('branchLongitude', { required: true })}
                    />
                    {errors.branchLongitude && (
                      <span className="error-message"> Longitude is required</span>
                    )}
                  </div>
                </div>
    </>
  );
}
