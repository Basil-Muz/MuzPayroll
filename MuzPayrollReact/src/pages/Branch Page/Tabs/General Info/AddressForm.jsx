import { Country, State, City } from "country-state-city";
import { Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";

export default function AddressForm({
  register,
  errors,
  watch,
  setValue,
  setError,
  control,
  clearErrors,
  isReadOnly,
  setFocus,
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

  // const countryOptions = useMemo(() => countryList().getData(), []);
  const [countryCode, setCountryCode] = useState("");
  const [stateCode, setStateCode] = useState("");

  const [placeList, setPlaceList] = useState([]);
  const prevPincodeRef = useRef(null); // track the old pincode
  // const inputPinRef=useRef(null);
  const [isPincodeResolved, setIsPincodeResolved] = useState(false); // disable the selected boxs

  const pinCodeRegister = register("pincode", {
    required: "Pincode is required",
    pattern: {
      value: /^[0-9]{6}$/,
      message: "Enter valid 6 digit pincode",
    },
  });

  // const pincodeSelection=(firstPlace)=>{
  // const place = watch("place");
  // if(!place){
  //   setValue("place", firstPlace, {
  //         shouldDirty: true,
  //       });
  // }
  // }

  // useEffect(() => {
  // if (!watchedPincode || watchedPincode.length !== 6) return;

  const fetchLocationByPincode = useCallback(
    async (pincode) => {
      if (!pincode || pincode.length !== 6) return;

      // prevent duplicate calls for same pincode
      if (prevPincodeRef.current === pincode) return;

      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = await response.json();
        console.log("Pincode response",data)
        if (data[0]?.Status !== "Success") {
          setError("pincode", {
            type: "manual",
            message: "Invalid Pincode",
          });
          return;
        }
        setIsPincodeResolved(true);
        const postOffices = data[0].PostOffice;

        const mappedPlaces = postOffices.map((po) => ({
          label: po.Name,
          value: po.Name,
        }));

        console.log("Function Exccecuted");
        setPlaceList(mappedPlaces);

        const currentPlace = watch("place");
        const placeExists = mappedPlaces.some((p) => p.value === currentPlace);

        // set default place ONLY if invalid
        if (!placeExists) {
          setValue("place", mappedPlaces[0]?.value, { shouldDirty: false });
        }

        // Country
        setValue("country", "IN");

        // State
        const matchedState = State.getStatesOfCountry("IN").find(
          (s) => s.name.toLowerCase() === postOffices[0].State.toLowerCase()
        );

        if (matchedState) {
          setCountryCode("IN");
          setStateCode(matchedState.isoCode);
          setValue("state", matchedState.isoCode);
        }


        
        // District
        setValue("district", postOffices[0].District);
        console.log("Distruct",postOffices[0].District)
        clearErrors(["country", "state", "district", "place"]);

        prevPincodeRef.current = pincode;
      } catch (err) {
        setError("pincode", {
          type: "manual",
          message: "Unable to fetch location details" + err,
        });
      }
    },
    [setValue, setError, watch, clearErrors, setCountryCode, setStateCode]
  );
  //Debounce - request is only sent after a user has stopped performing an action
  const debounceRef = useRef(null);

  const handlePincodeChange = (value) => {
    // remove dobounding the api calls
    // clear previous timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // user editing → unlock fields
    setIsPincodeResolved(false);

    if (value.length !== 6) return;

    // wait before calling API
    debounceRef.current = setTimeout(() => {
      fetchLocationByPincode(value);
    }, 500); // 500ms debounce
  };

  useEffect(() => {
    setFocus("pincode");
  }, [setFocus]);

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
  // React detects a render → effect → state → render loop solving React Hooks lifecycle warning
  const pincode = useWatch({
    control,
    name: "pincode",
  });

  useEffect(() => {
    if (pincode && pincode.length === 6) {
      fetchLocationByPincode(pincode);
    }
  }, [fetchLocationByPincode, pincode]);

  return (
    <>
      <div className="form-section-header">
        {/* <span className="section-number">2</span> */}
        <h2 className="section-title">Address Details</h2>
        <span className="section-subtitle">Location information</span>
      </div>
      <div className="form-grid">
        <div className="branch-form-group">
          <label className="form-label required">Pincode</label>
          <input
            type="text"
            disabled={isReadOnly}
            // ref={inputPinRef}
            className={`form-control ${errors.pincode ? "error" : ""} ${isReadOnly ? "read-only" : ""}`}
            placeholder="Enter pincode"
            maxLength={6}
            autoComplete="new-password" // off the suggesstions
            inputMode="numeric"
            {...pinCodeRegister}
            onChange={(e) => {
              pinCodeRegister.onChange(e); //  let RHF handle validation first
              handlePincodeChange(e.target.value);
            }}
          />
          {errors.pincode && (
            <span className="error-message">{errors.pincode.message}</span>
          )}
        </div>

        <div className="branch-form-group">
          <label className="form-label required">Address</label>
          <textarea
            type="text"
            disabled={isReadOnly}
            className={`form-control ${errors.address ? "error" : ""} ${isReadOnly ? "read-only" : ""}`}
            placeholder="Enter Address"
            {...register("address", { required: true })}
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
                isDisabled={isReadOnly || isPincodeResolved}
                isSearchable
                classNamePrefix="form-control-select"
                className={`${errors.country ? "error" : ""} ${isReadOnly ? "read-only" : ""}`}
                value={
                  countryOptions.find(
                    (option) => option.value === field.value
                  ) || null
                }
                onChange={(option) => {
                  field.onChange(option.value); // STORE ISO CODE ("IN")
                  setCountryCode(option.value);
                  setStateCode("");
                  setValue("state", "");
                  setValue("district", "");
                }}
              />
            )}
          />

          {errors.country && (
            <span className="error-message">{errors.country.message}</span>
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
                isDisabled={isReadOnly || !countryCode || isPincodeResolved}
                isSearchable
                classNamePrefix="form-control-select"
                className={`${errors.state ? "error" : ""} ${isReadOnly ? "read-only" : ""}`}
                value={
                  stateOptions.find((option) => option.value === field.value) ||
                  null
                }
                onChange={(option) => {
                  field.onChange(option.value); // ✅ "KA"
                  setStateCode(option.value);
                  setValue("district", "");
                }}
              />
            )}
          />

          {errors.state && (
            <span className="error-message">{errors.state.message}</span>
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
                isDisabled={isReadOnly || !stateCode || isPincodeResolved}
                // isDisabled={true}
                isSearchable
                classNamePrefix="form-control-select"
                className={`${errors.district ? "error" : ""} ${isReadOnly ? "read-only" : ""}`}
                value={
                  districtOptions.find(
                    (option) => option.value === field.value
                  ) || null
                }
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />

          {errors.district && (
            <span className="error-message">{errors.district.message}</span>
          )}
        </div>

        <div className="branch-form-group">
          <label className="form-label required">Place</label>
          {/* <input
              type="text"
              disabled={isReadOnly}
              className={`form-control ${errors.place ? "error" : ""} ${isReadOnly ? "read-only" : ""}`}
              placeholder="Enter branch Place"
              {...register('place', { required: "Branch place required" ,
                pattern:{
                  value: /^[a-zA-Z ]*$/,
                  message: "Please enter a valid branch place"
                },
              })}
            /> */}

          <Controller
            name="place"
            control={control}
            rules={{ required: "Place is required" }}
            render={({ field }) => {
              const selectedOption = placeList.find(
                (opt) => opt.value === field.value
              );

              return (
                <Select
                  options={placeList}
                  placeholder="Select place"
                  isDisabled={isReadOnly || !placeList.length}
                  isSearchable
                  classNamePrefix="form-control-select"
                  className={`${errors.place ? "error" : ""} ${isReadOnly ? "read-only" : ""}`}
                  value={selectedOption || null}
                  onChange={(option) => {
                    field.onChange(option.value); // ✅ store STRING
                  }}
                />
              );
            }}
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
