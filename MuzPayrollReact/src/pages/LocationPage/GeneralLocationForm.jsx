import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import axios from "axios";

import GeneralInfoForm from "../Branch Page/Tabs/General Info/GeneralInfoForm";
import AddressForm from "../Branch Page/Tabs/General Info/AddressForm";
import ContactForm from "../Branch Page/Tabs/General Info/ContactForm";
import DocumentsTab from "../Branch Page/Tabs/General Info/DocumentsTab";

// import StepProgress from "./General Info/StepProgress";
// import Header from "../../../components/Header/Header";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";

import "../Branch Page/css/From.css";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTopButton";

const steps = ["General Info", "Address", "Contact", "Document Into"];

export default function GenaralLocationForm() {
  const [step, setStep] = useState(0); //switch steps
  const [companyList, setCompanyList] = useState([]);
  const [branchList, setBranchList] = useState([]);

  // const [backendErrors, setBackendErrors] = useState([]);
  //pass the back end error to front end

  // const [addNewAmend, setAddNewAmend] = useState(false);
  // true when latest amned is verified enables the genarate button

  const [addingNewAmend, setAddingNewAmend] = useState(false); // enables the auth date and hide generate amned button

  const datePickerRef = useRef(null);
  // const authDateInputRef = useRef(null);
  const generalInfoRef = useRef(null);
  const dateWrapperRef = useRef(null);

  const cancelledRef = useRef(false);

  const UserData = localStorage.getItem("loginData");
  const userObj = JSON.parse(UserData);

  //Convert the JSON string to objects
  const userCode = userObj.userCode.split("@", 1)[0];
  const companyId = userObj.companyId;

  //Amend data
  const [amendments, setAmendments] = useState([]);

  //Mode for backend
  const inputMode = amendments.length > 0 ? "UPDATE" : "INSERT";

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    clearErrors,
    setValue,
    reset,
    setFocus,
    getValues,
    watch,
    control,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      //  mound with one document row default
      // documents: [
      //   {
      //     type: "",
      //     number: "",
      //     expiryDate: "",
      //     file: null,
      //     remarks: "",
      //   },
      // ],
      userCode: userCode, //User code from local storage
      authorizationDate: new Date().toISOString().split("T")[0], //  Date of save
      authorizationStatus: 0, // ENTRY
      // mode: inputMode,
      activeStatusYN: 1,
    },
  });

  const authDate = useWatch({
    control,
    name: "withaffectdate",
  });

  //workflow of amend date then name logic
  let isUnlocked = !!authDate;
  if (amendments.length > 0) {
    isUnlocked = true;
  } else {
    isUnlocked = !!authDate;
  }

  // From content changes
  const [formFlags] = useState({
    companyForm: false,
    branchForm: false,
    locationForm: true,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const watchedDocuments = useWatch({
    control,
    name: "documents",
  });

  // const watchedPincode = watch("branchPinCode");

  const authorizationStatusOptions = [
    { label: "ENTRY", value: 0 },
    { label: "VERIFIED", value: 1 },
  ];

  //latest amend only entry amend with max amend number
  const latestAmendmentId = amendments.length
    ? amendments
        .filter((a) => a.authorizationStatus === false)
        .reduce(
          (max, cur) => (cur.amendNo > max.amendNo ? cur : max),
          amendments[0],
        )
    : null;

  const [selectedAmendment, setSelectedAmendment] = useState(null);

  // console.log("Selected item:", selectedAmendment);

  const amendmentAuthorizationOptions = [];

  if (selectedAmendment?.authorizationStatus === false) {
    amendmentAuthorizationOptions.push(
      {
        label: `ENTRY : ${selectedAmendment.authorizationDate}`,
        value: 0,
      },
      {
        label: `VERIFIED :`,
        value: 1,
      },
    );
  }
  // console.log("Seletced amends", selectedAmendment);
  if (selectedAmendment?.authorizationStatus === true) {
    amendmentAuthorizationOptions.push(
      // {
      //   label: `ENTRY : ${selectedAmendment.withaffectdate}`,
      //   value: 0,
      // },
      {
        label: `VERIFIED : ${selectedAmendment.authorizationDate}`,
        value: 1,
      },
    );
  }

  const isVerifiedAmendment = // Read-only VERIFIED mode
    selectedAmendment?.authorizationStatus === true && !addingNewAmend;

  const isLastStep = step === steps.length - 1;
  // const documentsValid = submitStatus === 0;
  const isAmendMode = amendments.length > 0;

  const canSave =
    !isVerifiedAmendment &&
    ((isAmendMode && isDirty) || (!isAmendMode && isLastStep));

  const { locationId } = useParams();

  const toLocalDate = (date) =>
    date instanceof Date
      ? date.toLocaleDateString("en-CA") // yyyy-MM-dd
      : date;

  const fetchLocationAmendData = useCallback(
    async (locationId) => {
      try {
        const response = await axios.get(
          `http://localhost:8087/location/getamendlist/${locationId}`,
        );

        setAmendments(response.data.locationDtoLogs || []); // Use the amends data
        // delete response.data.companyDtoLogs;
        setSelectedAmendment(response.data); //data form master table
        console.log("Amend response", response.data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    },
    [setSelectedAmendment, setAmendments],
  );

  //for smooth focus
  const smoothFocus = (fieldName) => {
    const fieldNameFlage = formFlags.locationForm
      ? "location"
      : formFlags.companyForm
        ? "company"
        : formFlags.branchForm
          ? "branch"
          : fieldName;
    const el = document.querySelector(`[name=${fieldNameFlage}]`);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      console.log("sgvwrg");
    }

    setFocus(fieldNameFlage); // RHF handles focus properly
  };
  // selected date to an ISO string (toISOString()), which applies UTC timezone conversion.
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // yyyy-MM-dd
  };

  const handleGenerateAmendment = () => {
    setSelectedAmendment(null);
    setAddingNewAmend(true);
    // setIsReadOnly(false);                                                                                               
    reset({
      ...getValues(), //  keep base data
      authorizationStatus: 0, // ENTRY
      withaffectdate: "",
      // documents: [
      //   {
      //     type: "",
      //     number: "",
      //     expiryDate: "",
      //     file: null,
      //     remarks: "",
      //   },
      // ],
    });

    clearErrors();
  };

  const handleApiError = useCallback((error) => {
    console.error("API Error:", error);

    // Network error (no response from server)
    if (!error.body) {
      toast.error("Unable to connect to server. Please check your network.");
      return;
    }
    const status = error.response.type;

    switch (status) {
      case 400:
        toast.error(error.response.message[0]);
        break;
      case 401:
        toast.error("Session expired. Please login again.");
        break;
      case 403:
        toast.error("You do not have permission.");
        break;
      case 404:
        toast.error("Resource not found.");
        break;
      case 409:
        toast.error("Duplicate record exists.");
        break;
      case 500:
        toast.error("Server error. Please try again later.");
        break;
      default:
        toast.error("Unexpected error occurred.");
    }
  },[]);

  const load = useCallback(async () => {
    try {
      const [companyRes, branchRes] = await Promise.all([
        axios.get(`http://localhost:8087/company/${companyId}`),
        axios.get(`http://localhost:8087/branch/company/${companyId}`),
      ]);

      if (cancelledRef.current) return;

      setCompanyList([
        {
          value: companyRes.data.companyMstID,
          label: companyRes.data.company,
        },
      ]);

      setBranchList(
        branchRes.data.map((branch) => ({
          value: branch.branchMstID,
          label: branch.branch,
        })),
      );
    } catch (err) {
      if (!cancelledRef.current) {
        handleApiError(err);
      }
    }
  }, [companyId, handleApiError]);

  useEffect(() => {
    setValue("mode", inputMode, { shouldDirty: false });
  }, [inputMode, setValue]);

  useEffect(() => {
    cancelledRef.current = false;
    load();

    return () => {
      cancelledRef.current = true;
    };
  }, [load]);

  useEffect(() => {
    if (isVerifiedAmendment) return;

    const timer = setTimeout(() => {
      // Smooth scroll FIRST
      dateWrapperRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Wait until scroll animation finishes
      setTimeout(() => {
        const el = document.querySelector(".withaffectdate");

        if (el) {
          el.focus({ preventScroll: true }); //  NO JUMP
        }

        datePickerRef.current?.setOpen(true);
      }, 500); // match scroll duration
    }, 300);

    return () => clearTimeout(timer);
  }, [addingNewAmend, isVerifiedAmendment]);

  // useEffect(() => {
  //   // console.log("Input ref:", authDateInputRef.current);
  //   // console.log("DatePicker ref:", datePickerRef.current);
  // }, []);
  let amendLenght = amendments.length;
  useEffect(() => {
    const date = new Date(); // current date
    const formattedDate = date.toISOString().slice(0, 10); //yyyy-mm-dd format
    setValue("activeDate", formattedDate);
  }, [setValue]);

  const setingData = useCallback(
    (selectedAmendment) => {
      if (amendLenght > 0) {
        setValue("locationMstID", selectedAmendment.locationMstID ?? "", {
          shouldDirty: false,
          shouldValidate: true,
        });
      }
      setValue("location", selectedAmendment.location ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });

      setValue("shortName", selectedAmendment.shortName ?? "", {
        shouldDirty: false,
        shouldValidate: false,
      });

      setValue(
        "authorizationStatus",
        selectedAmendment.authorizationStatus ? 1 : 0,
        {
          shouldDirty: false,
          shouldValidate: true,
        },
      );

      setValue("withaffectdate", selectedAmendment.withaffectdate ?? "", {
        shouldDirty: false,
        shouldValidate: false,
      });

      setValue("esiRegion", selectedAmendment.esiRegion ?? "", {
        shouldDirty: false,
        shouldValidate: false,
      });

      setValue("company", selectedAmendment.company ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });

      // setValue("companyImage", selectedAmendment.companyImage ?? "");

      //seting in the local date format from db date
      setValue(
        "activeDate",
        selectedAmendment.activeDate
          ? selectedAmendment.activeDate
          : toLocalDate(new Date()),
        { shouldDirty: false },
      );

      setValue("pincode", selectedAmendment.pincode ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });

      setValue("address", selectedAmendment.address ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });

      setValue("country", selectedAmendment.country ?? "IN", {
        shouldDirty: false,
        shouldValidate: true,
      });

      setValue("state", selectedAmendment.state ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });
      setValue("district", selectedAmendment.district ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });
      setValue("place", selectedAmendment.place ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });
      setValue("email", selectedAmendment.email ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });
      setValue("mobileNumber", selectedAmendment.mobileNumber ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });
      setValue("landlineNumber", selectedAmendment.landlineNumber ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });
      setValue("employerName", selectedAmendment.employerName ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });
      setValue("employerEmail", selectedAmendment.employerEmail ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });
      setValue("employerNumber", selectedAmendment.employerNumber ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });
      setValue("designation", selectedAmendment.designation ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });
    },
    [setValue, amendLenght],
  );

  useEffect(() => {
    if (!locationId) return;
    fetchLocationAmendData(locationId);
  }, [locationId, fetchLocationAmendData]);

  useEffect(() => {
    //Api call should bo here
    //after doing the api call then you must add the field values i added name and company for demo

    if (!selectedAmendment) return;
    //Amend Auto selection whille loading
    setingData(selectedAmendment);
  }, [selectedAmendment, setingData]);

  const handleSelectAmendment = (id, index) => {
    //User Selecetion - Assign the amend data to feild
    setSelectedAmendment(amendments[index]);

    setingData(amendments[index]);
  };

  const nextStep = async () => {
    // switch next steps
    const valid = await trigger();
    if (valid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1); // switch to previos steps

  const saveLocation = async (formData) => {
    const response = await fetch("http://localhost:8087/location/save", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw {
        type: "HTTP_ERROR",
        status: response.status,
        body: text,
      };
    }

    const text = await response.text();
    const result = text ? JSON.parse(text) : null;

    if (!result?.success) {
      throw {
        type: "BUSINESS_ERROR",
        result,
      };
    }

    return result;
  };

  const onSubmit = async (data) => {
    try {
      setValue("userCode", userCode);
      setValue("authorizationDate", new Date());
      // console.log("Submitting data", data);

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== "companyImage") {
          formData.append(key, data[key]);
        }
      });

      // if (data.companyImage) {
      //   formData.append("companyImage", data.companyImage);
      // }

      await saveLocation(formData);
      toast.success("Location saved successfully!");

      // console.log("Saving Data", formData);
      // const response = await fetch("http://localhost:8087/location/save", {
      //   method: "POST",
      //   body: formData,
      // });
      // console.log("FormData contents:");
      // for (const [key, value] of formData.entries()) {
      //   if (value instanceof File) {
      //     console.log(key, {
      //       name: value.name,
      //       size: value.size,
      //       type: value.type,
      //     });
      //   } else {
      //     console.log(key, value);
      //   }
      // }

      // let result;
      // try {
      //   const responseText = await response.text();
      //   if (responseText) {
      //     result = JSON.parse(responseText);
      //   }
      // } catch (parseError) {
      //   console.error("Error parsing response:", parseError);
      // }

      // if (result && result.success === true) {
      //   toast.success("Location saved successfully!");
      //   return;
      // }

      /* -------------------------------
                Prepare documents JSON
              (NO FileList inside JSON)
            -------------------------------- */
      // const documentsPayload = data.documents.map((doc) => {
      //   // Append file separately
      //   if (doc.file && doc.file.length > 0) {
      //     formData.append("files", doc.file[0]); //  backend handles array
      //   }

      //   return {
      //     type: doc.type,
      //     number: doc.number,
      //     expiryDate: doc.expiryDate,
      //     remarks: doc.remarks || "",
      //   };
      // });

      /* -------------------------------
                Prepare final JSON payload
            -------------------------------- */
      // const payload = {
      //   ...data,
      //   documents: documentsPayload,
      // };

      // console.log("payload:", payload);

      //  VERY IMPORTANT: remove FileList from payload
      // delete payload.documents?.file;

      /* -------------------------------
                Append JSON as Blob
            -------------------------------- */
      // formData.append(
      //   "data",
      //   new Blob([JSON.stringify(payload)], {
      //     type: "application/json",
      //   })
      // );

      /* -------------------------------
                Debug FormData (correct way)
            -------------------------------- */
      // console.log("FormData entries:");
      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value instanceof File ? "FILE" : value);
      // }

      /* -------------------------------
                API CALL (example)
            -------------------------------- */
      // await fetch("/api/branch/save", {
      //   method: "POST",
      //   body: formData
      // });
    } catch (err) {
      // const apiErrors = err.response?.data?.errors;
      // if (apiErrors) {
      //   Object.entries(apiErrors).forEach(([field, message]) => {
      //     setError(field, { type: "server", message });
      //   });
      // }
      console.error("Submit failed:", err);

      handleApiError(err);
    }
  };

  const handleClear = () => {
    if (selectedAmendment) {
      // Restore selected amendment values
      setingData(selectedAmendment);

      clearErrors();
      toast.success("Changes cleared");
    } else {
      //  New record → reset to empty insert state
      reset({
        userCode,
        authorizationStatus: 0,
        withaffectdate: "",
        activeDate: new Date().toISOString().split("T")[0],
      });
    }
  };

  return (
    <>
      {/* <Header backendError={backendErrors}/> */}
      <div className="branch-container-tab">
        <div className="form-card">
          {/* Header */}
          <div className="form-header">
            <h1>
              {formFlags.locationForm && " Location "}
              {formFlags.companyForm && "Company "}
              {formFlags.branchForm && "Branch "}
              Registration
            </h1>
            <p>
              Register a new
              {formFlags.locationForm && " company location "}
              {formFlags.companyForm && " company "}
              {formFlags.branchForm && " branch "}
              by filling in the details below
            </p>
          </div>

          {/* Progress Steps */}
          <div className="progress-container">
            <div className="progress-steps">
              <div className="progress-line"></div>
              <div
                className="progress-fill"
                style={{ width: `${(step / (steps.length - 1)) * 74}%` }}
              ></div>

              {steps.map((stepItem, index) => (
                <div
                  key={index}
                  className={`step-item ${index === step ? "active" : ""} ${index < step ? "completed" : ""}`}
                >
                  <div className="step-icon">
                    {index < step ? (
                      <IoMdCheckmarkCircleOutline size={20} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="step-label">{stepItem}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="form-content">
            <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
              <div className="step-animate">
                {step === 0 && (
                  <div className="form-section">
                    <GeneralInfoForm
                      register={register}
                      errors={errors}
                      watch={watch}
                      setValue={setValue}
                      setError={setError}
                      clearErrors={clearErrors}
                      control={control}
                      setFocus={setFocus}
                      flags={formFlags}
                      isReadOnly={isVerifiedAmendment}
                      isUnlocked={isUnlocked || isVerifiedAmendment}
                      ref={generalInfoRef}
                      companys={companyList}
                      branchList={branchList}
                    />
                  </div>
                )}

                {step === 1 && (
                  <div className="form-section">
                    <AddressForm
                      register={register}
                      errors={errors}
                      watch={watch}
                      setValue={setValue}
                      setError={setError}
                      clearErrors={clearErrors}
                      setFocus={setFocus}
                      control={control}
                      flags={formFlags}
                      isUnlocked={isUnlocked || isVerifiedAmendment}
                      isReadOnly={isVerifiedAmendment}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="form-section">
                    {/* Contact form fields */}
                    <ContactForm
                      register={register}
                      errors={errors}
                      watch={watch}
                      setValue={setValue}
                      setFocus={setFocus}
                      setError={setError}
                      isUnlocked={isUnlocked || isVerifiedAmendment}
                      flags={formFlags}
                    />
                  </div>
                )}
                {step === 3 && (
                  <div className="form-section">
                    {/* Documentation form fields */}
                    <DocumentsTab
                      register={register}
                      errors={errors}
                      watch={watch}
                      setValue={setValue}
                      setError={setError}
                      fields={fields}
                      setFocus={setFocus}
                      append={append}
                      remove={remove}
                      trigger={trigger} // validate the documents while adding new document
                      watchDocuments={watchedDocuments}
                    />
                  </div>
                )}
                <div className="form-amend">
                  {/* Documentation form fields */}
                </div>
              </div>
              {/* Authorization + Amendments */}

              <div className="amend-section">
                {(amendments.length == 0 || addingNewAmend) && (
                  <div className="amend-header-row">
                    <div className="amend-field">
                      <label className="form-label required">
                        Authorization
                      </label>
                      <Controller
                        name="authorizationStatus"
                        control={control}
                        // rules={{ required: "Please select amendment type" }}
                        render={({ field }) => {
                          // const selectedOption =
                          //   authorizationStatusOptions.find(
                          //     (opt) => opt.value === "ENTRY"
                          //   );

                          return (
                            <Select
                              options={authorizationStatusOptions}
                              placeholder="Select amendment type"
                              isSearchable={false}
                              classNamePrefix="form-control-select"
                              className={
                                errors.authorizationStatus ? "error" : ""
                              }
                              value={authorizationStatusOptions.find(
                                (opt) => opt.value === field.value,
                              )}
                              onChange={(option) =>
                                field.onChange(option.value)
                              } //  store ONLY value
                            />
                          );
                        }}
                      />
                    </div>

                    <div className="amend-field">
                      <label
                        className="form-label required"
                        ref={dateWrapperRef}
                      >
                        Authorization date
                      </label>
                      <Controller
                        name="withaffectdate"
                        control={control}
                        rules={{ required: "Please select a date" }}
                        render={({ field }) => (
                          <DatePicker
                            ref={datePickerRef}
                            placeholderText="Select date"
                            className={`form-control datepicker-input withaffectdate${
                              errors.withaffectdate ? "error" : ""
                            }`}
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(date) => {
                              field.onChange(date ? formatDate(date) : null);

                              setTimeout(() => {
                                smoothFocus("name"); //  Focus to name after selecting the date
                              }, 0);
                            }}
                            dateFormat="dd/MM/yyyy"
                            // minDate={new Date()}
                            showMonthDropdown
                            onFocus={() => datePickerRef.current?.setOpen(true)}
                            showYearDropdown
                            customInput={
                              <input
                                className={`form-control datepicker-input ${
                                  errors.withaffectdate ? "error" : ""
                                }`}
                              />
                            }
                            dropdownMode="select"
                            calendarClassName="custom-datepicker"
                            popperClassName="custom-datepicker-popper"
                          />
                        )}
                      />
                    </div>
                  </div>
                )}

                {amendments.length > 0 && !addingNewAmend && (
                  <div className="amend-header-row">
                    <div className="amend-field">
                      <label className="form-label required">
                        Authorization
                      </label>
                      <Controller
                        name="authorizationStatus"
                        control={control}
                        rules={{ required: "Please select authorization" }}
                        render={({ field }) => (
                          <Select
                            options={amendmentAuthorizationOptions}
                            isSearchable={false}
                            isDisabled={isVerifiedAmendment}
                            classNamePrefix="form-control-select"
                            className={
                              errors.authorizationStatus ? "error" : ""
                            }
                            value={amendmentAuthorizationOptions.find(
                              (opt) => opt.value === field.value,
                            )}
                            onChange={(option) => field.onChange(option.value)}
                          />
                        )}
                      />
                      <input type="hidden" {...register("userCode")} />
                      <input type="hidden" {...register("authorizationDate")} />
                    </div>
                    {latestAmendmentId.authorizationStatus === true &&
                      !addingNewAmend && ( // Adding the new amend only if the latest amend is verified
                        <div
                          className="btn amend-generate"
                          onClick={handleGenerateAmendment}
                        >
                          Generate Amendment
                        </div>
                      )}
                  </div>
                )}

                <div className="amend-container">
                  {[...amendments] // shallow copy to avoid mutating state
                   // .sort((a, b) => new Date(b.date) - new Date(a.date)) //  descending by date
                    .map((item, index) => {
                      // then map
                      const isSelected =
                        selectedAmendment?.amendNo === item.amendNo;
                      return (
                        <div
                          key={item.amendNo}
                          className={`amend-pill 
                            ${item.amendNo === latestAmendmentId?.amendNo ? "entry" : "verified"}
                            ${isSelected ? "selected" : ""}
                          `}
                          onClick={() => {
                            handleSelectAmendment(item.amendNo, index);
                            // setAddNewAmend(false);
                            setAddingNewAmend(false);
                          }}
                        >
                          <div className="pill-left">
                            <span className="pill-index">{item.amendNo}</span>
                            <div className="pill-info">
                              <span className="pill-type">
                                {item.authorizationStatus === false
                                  ? "ENTRY"
                                  : "VERIFIED"}
                              </span>
                              <span className="pill-date">
                                {new Date(
                                  item.withaffectdate,
                                ).toLocaleDateString("en-GB")}
                              </span>
                            </div>
                          </div>

                          <div className="pill-right">
                            {item.authorizationStatus == false &&
                              item.amendNo == latestAmendmentId.amendNo && (
                                <span className="pill-badge verified">
                                  latest
                                </span>
                              )}
                            {item.authorizationStatus == true && (
                              <span className="pill-badge verified">
                                ✔ Verified
                              </span>
                            )}
                            {/* {item.authorizationStatus == false &&
                              item.amendNo !== latestAmendmentId.amendNo && (
                                <span className="pill-badge verified">
                                  Entry
                                </span>
                              )} */}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* 
<div className="amend-section">

</div> */}

              {/* Form Actions */}
              <div className="branch-form-actions">
                <div>
                  {step > 0 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={prevStep}
                    >
                      <svg
                        className="btn-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Previous
                    </button>
                  )}
                </div>

                <div>
                  {
                    step < steps.length - 1 && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={nextStep}
                      >
                        Next
                        <svg
                          className="btn-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    )
                    // : (
                    //   <button
                    //     type="submit" p-bott
                    //     className="btn btn-primary"
                    //   >
                    //     Complete Registration
                    //     <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    //     </svg>
                    //   </button>
                    // )
                  }
                </div>
              </div>
            </form>
          </div>
        </div>
        <FloatingActionBar
          actions={{
            save: {
              onClick: handleSubmit(onSubmit),
              // disabled:true,
              disabled: !canSave,
            },
            search: {
              // onClick: handleSearch,
              disabled: true,
            },
            clear: {
              onClick: handleClear,
              // disabled:true,
            },
            // delete: {
            //   // onClick: handleDelete,
            //   // disabled: !hasDeletePermission
            //   disabled: true,
            // },
            print: {
              // onClick: handlePrint,
              // disabled: isNewRecord
              disabled: true,
            },
            // new: {
            // onClick: toggleForm,
            //to toggle the designation form
            // },
            refresh: {
              onClick: load,
              // Refresh the page
            },
          }}
        />
      </div>
      <ThemeToggle></ThemeToggle>
      <ScrollToTopButton />
    </>
  );
}
