import { useEffect } from "react";

export default function AddressForm({
  register,
  errors,
  watch,
  setValue,
  setError,
  // disabled = false,
  // requiredMap = {},
}) {

    // const {
    //   register,
    //   handleSubmit,
    //   trigger,
    //   setError,
    //   setValue,
    //   watch,
    //   formState: { errors },
    // } = useForm({ mode: "onBlur" });

    const watchedPincode = watch("branchPinCode");

  useEffect(() => {
    if (!watchedPincode || watchedPincode.length !== 6) return;

    const fetchLocationByPincode = async () => {
      try {
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

        const address = `${postOffice.Name}, ${postOffice.District}, ${postOffice.State}, India`;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const locationdata = await res.json();
        // console.log("srgfwergwer location",locationdata);
        if (locationdata.length > 0) {
          setValue("branchLatitude", locationdata[0].lat);
          setValue("branchLongitude", locationdata[0].lon);
        }
        setValue("branchCountry", "India");
        setValue("branchState", postOffice.State);
        setValue("branchDistrict", postOffice.District);
        setValue("branchPlace", postOffice.Name);

      } catch (err) {
        setError("branchPinCode", {
          type: "manual",
          message: "Unable to fetch location details "+err.msg,
        });
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
                      <span className="error-message">{errors.branchPinCode.message}</span>
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
                      {...register('branchPlace', { required: "Branch place required" ,
                        pattern:{
                          value: /^[a-zA-Z]+([a-zA-Z]+)*$/,
                          message: "Please enter a valid branch latitude"
                        },
                      })}
                    />
                    {errors.branchPlace && (
                      <span className="error-message">{errors.branchPlace.message}</span>
                    )}
                  </div>

                  <div className="branch-form-group">
                    <label className="form-label required"> Latitude</label>
                    <input
                      type="text" 
                      className="form-control"
                      placeholder="Enter branch Latitude"
                      {...register('branchLatitude', { required: "Branch latitude required" ,
                        pattern:{
                          value: /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})?$/,
                          message: "Please enter a valid branch latitude"
                        },
                      })}
                    />
                    {errors.branchLatitude && (
                      <span className="error-message">{errors.branchLatitude.message}</span>
                    )}
                  </div>

                  <div className="branch-form-group">
                    <label className="form-label required"> Longitude</label>
                    <input
                      type="text" 
                      className="form-control"
                      placeholder="Enter branch Longitude"
                      {...register('branchLongitude', { required: "Branch longitude required",
                         pattern:{
                          value: /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})?$/,
                          message: "Please enter a valid branch longitude"
                        },
                       })}
                    />
                    {errors.branchLongitude && (
                      <span className="error-message">{errors.branchLongitude.message}</span>
                    )}
                  </div>
                </div>
    </>
  );
}
