import { Country, State, City } from "country-state-city";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { useState, useEffect, useMemo } from "react";

export default function AddressForm({
  register,
  errors,
  watch,
  setValue,
  setError,
  control,
   clearErrors,
    // flags,
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

  const watchedPincode = watch("pinCode");
  // const countryOptions = useMemo(() => countryList().getData(), []);
  const [countryCode, setCountryCode] = useState("");
  const [stateCode, setStateCode] = useState("");

  useEffect(() => {
    if (!watchedPincode || watchedPincode.length !== 6) return; // Invalide pincode

    const fetchLocationByPincode = async () => {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${watchedPincode}`
        );
        const data = await response.json();
        
        if (data[0]?.Status !== "Success") {
          setError("pinCode", {
            type: "manual",
            message: "Invalid Pincode",
          });
          return;
        }

        const postOffice = data[0].PostOffice[0];
        // const address = `${postOffice.Name}, ${postOffice.District}, ${postOffice.State}, India`;
        // const res = await fetch(
        //   `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        // );
        // const locationdata = await res.json();
        // console.log("srgfwergwer location",locationdata);
        // if (locationdata.length > 0) {
        //   setValue("branchLatitude", locationdata[0].lat);
        //   setValue("branchLongitude", locationdata[0].lon);
        // }
          const countryIso = "IN";
        setCountryCode(countryIso);
        setValue("country", countryIso);
        const matchedState = State
        .getStatesOfCountry(countryIso)
        .find(
          (s) =>
            s.name.toLowerCase() ===
            postOffice.State.toLowerCase()
        );

      if (!matchedState) return;
        setValue("state", matchedState.isoCode);
        setStateCode(matchedState.isoCode); 
        // console.log("state", postOffice.State);
        //  District / City (store NAME)
        setValue("district", postOffice.District);
        setValue("place", postOffice.Name);
        clearErrors("country")
        clearErrors("state")
        clearErrors("district")
        clearErrors("place")
      } catch (err) {
        setError("pinCode", {
          type: "manual",
          message: "Unable to fetch location details "+err.msg,
        });
      }
    };
  fetchLocationByPincode();
  }, [watchedPincode, setValue, setError, clearErrors]);

  //filtering the list value, label format
const countryOptions = useMemo(
  () =>
    Country.getAllCountries().map((c) => ({
      value: c.isoCode,
      label: c.name,
    })),
  []
);

const stateOptions = useMemo(
  () =>
    countryCode
      ? State.getStatesOfCountry(countryCode).map((s) => ({
          value: s.isoCode,
          label: s.name,
        }))
      : [],
  [countryCode]
);

const districtOptions = useMemo(
  () =>
    countryCode && stateCode
      ? City.getCitiesOfState(countryCode, stateCode).map((d) => ({
          value: d.name,
          label: d.name,
        }))
      : [],
  [countryCode, stateCode]
);

  return (
    <>
     <div className="section-header">
        {/* <span className="section-number">2</span> */}
        <h2 className="section-title">Address Details</h2>
        <span className="section-subtitle">Location information</span>
      </div>
      <div className="form-grid">

        <div className="branch-form-group">
            <label className="form-label required">Pincode</label>
            <input
              type="text"
              className={`form-control ${errors.pinCode ? "error" : ""}`}
              placeholder="Enter Pincode"
              maxLength={6}
              inputMode="numeric"
              {...register("pinCode", {
                required: "PinCode is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Enter valid 6 digit pincode",
                },
              })}
            />
            {errors.pinCode && (
              <span className="error-message">{errors.pinCode.message}</span>
            )}
          </div>

        <div className="branch-form-group">
            <label className="form-label required">Address</label>
            <textarea
              type="text" 
               className={`form-control ${errors.pinCode ? "error" : ""}`}
              placeholder="Enter Address"
              {...register('address', { required: true })}
            />
            {errors.address && (
              <span className="error-message">Branch Address is required</span>
            )}
          </div>

          <div className="branch-form-group">
            <label className="form-label required">Country</label>
            <Controller
              name="country"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <Select
                  options={countryOptions}
                  placeholder="Select country"
                  isSearchable
                    onChange={(option) => {
                      field.onChange(option?.name);   // store ISO code
                      setCountryCode(option?.value || "");
                      setStateCode("");
                      setValue("state", "");
                      setValue("district", "");
                    }}
                  classNamePrefix="form-control-select"
                  className={errors.country ? "error" : ""}
                  value={
                    countryOptions.find(
                      (option) => option.value === field.value
                    ) || null
                  }             
                />
              )}
            />
  {errors.country && (
    <span className="error-message">
      {errors.country.message}
    </span>
  )}
</div>


          <div className="branch-form-group">
              <label className="form-label required">State</label>

              <Controller
              name="state"
              control={control}
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <Select
                  options={stateOptions}
                  placeholder="Select state"
                  isSearchable
                    onChange={(option) => {
                      field.onChange({
                        code: option.value,  // "KA"
                        name: option.name    // "Karnataka"
                      });   // store name
                      setStateCode(option?.value || "");
                      setValue("district", "");
                    }}
                  classNamePrefix="form-control-select"
                  className={errors.state ? "error" : ""}
                   value={
          stateOptions.find(
            (option) => option.value === field.value
          ) || null
        }        
                />
              )}
            />

  {errors.state && (
    <span className="error-message">
      {errors.state.message}
    </span>
  )}
</div>

<div className="branch-form-group">
  <label className="form-label required">District</label>

  <Controller
    name="district"
    control={control}
    rules={{ required: "District is required" }}
    render={({ field }) => (
      <Select
        options={districtOptions}
        placeholder="Select district"
        isSearchable
        isDisabled={!stateCode}
        classNamePrefix="form-control-select"
        className={errors.district ? "error" : ""}
        value={
          districtOptions.find(
            (option) => option.value === field.value
          ) || null
        }
        onChange={(option) =>
          field.onChange(option?.value)
        }
      />
    )}
  />

  {errors.district && (
    <span className="error-message">
      {errors.district.message}
    </span>
  )}
</div>

          <div className="branch-form-group">
            <label className="form-label required">Place</label>
            <input
              type="text" 
              className={`form-control ${errors.place ? "error" : ""}`}
              placeholder="Enter branch Place"
              {...register('place', { required: "Branch place required" ,
                pattern:{
                  value: /^[a-zA-Z ]*$/,
                  message: "Please enter a valid branch place"
                },
              })}
            />
            {errors.place && (
              <span className="error-message">{errors.place.message}</span>
            )}
          </div>

          {/* {flags.locationForm && <div className="branch-form-group">
            <label className="form-label">Latitude</label>
            <input
              type="text" 
              className={`form-control ${errors.branchLatitude ? "error" : ""}`}
              placeholder="Enter branch Latitude"
              {...register('branchLatitude', { 
                pattern:{
                  value: /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})?$/,
                  message: "Please enter a valid branch latitude"
                },
              })}
            />
            {errors.branchLatitude && (
              <span className="error-message">{errors.branchLatitude.message}</span>
            )}
          </div>}

          {flags.locationForm && <div className="branch-form-group">
            <label className="form-label">Longitude</label>
            <input
              type="text" 
              className={`form-control ${errors.branchLongitude ? "error" : ""}`}
              placeholder="Enter branch Longitude"
              {...register('branchLongitude', { 
                pattern:{
                  value: /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})?$/,
                  message: "Please enter a valid branch longitude"
                },
              })}
            />
            {errors.branchLongitude && (
              <span className="error-message">{errors.branchLongitude.message}</span>
            )}
          </div>} */}
        </div>
    </>
  );
}
