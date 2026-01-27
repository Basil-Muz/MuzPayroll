import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import axios from "axios";

import GeneralInfoForm from "./General Info/GeneralInfoForm";
import AddressForm from "./General Info/AddressForm";
import ContactForm from "./General Info/ContactForm";
import DocumentsTab from "./General Info/DocumentsTab";

import StepProgress from "./General Info/StepProgress";
import Header from "../../../components/Header/Header";
import FloatingActionBar from "../../../components/demo_buttons/FloatingActionBar";

import "../css/From.css";
import ThemeToggle from "../../../components/ThemeToggle/ThemeToggle";
import ScrollToTopButton from "../../../components/ScrollToTop/ScrollToTopButton";

const steps = ["General Info", "Address", "Contact", "Document Into"];
// let submitStatus = 0; //Toggle the submit or save button

export default function GenaralBranchForm() {
  const [step, setStep] = useState(0); // switch steps
  const [companyList, setCompanyList] = useState([]); //fetch companys
  // const [submitStatus, setSubmitStatus] = useState(1);

  //changes when the file attached
  // const [backendErrors, setBackendErrors] = useState([]);
  //pass the back end error to front end

  // const [addNewAmend, setAddNewAmend] = useState(false);
  // true when latest amned is verified enables the genarate button

  const [addingNewAmend, setAddingNewAmend] = useState(false); // enables the auth date and hide generate amned button

  const datePickerRef = useRef(null); //To focus the date picker
  // const authDateInputRef = useRef(null);
  const dateWrapperRef = useRef(null); // to scroll in to controller of date picker
  const generalInfoRef = useRef(null);
  const UserData = localStorage.getItem("loginData");
  // console.log("User data",UserData);
  const userObj = JSON.parse(UserData);
  const [isReadOnly, setIsReadOnly] = useState();

  //Convert the JSON string to objects
  const userCode = userObj.userCode.split("@", 1)[0];
  const companyId = userObj.companyId;
  // console.log("Logeeded data company", companyId);

  const [amendments, setAmendments] = useState([
    // {
    //   id: 3,
    //   authorizationStatus: 1,
    //   date: "2025-10-20",
    //   shortName: "TCS",
    //   pincode: 680732,
    //   branch: "Tata Consultancy Services",
    //   status: "active",
    //   activeDate: "2025-10-10",
    //   generatedBy: "Admin User",
    // },
    // {
    //   id: 2,
    //   authorizationStatus: 1,
    //   date: "2025-10-10",
    //   branch: "Tata Consultancy Services",
    //   status: "expired",
    //   activeDate: "2021-12-31",
    //   generatedBy: "System",
    // },
    // {
    //   id: 1,
    //   authorizationStatus: 1,
    //   date: "2025-01-01",
    //   status: "inactive",
    //   activeDate: "",
    //   generatedBy: "Manager",
    // },
  ]);
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
    watch,
    getValues,
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
      mode: inputMode,
      activeStatusYN: 1,
    },
  });

  const authDate = watch("withaffectdate"); //workflow of amend date then name logic

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
    branchForm: true,
    locationForm: false,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const watchedDocuments = watch("documents");
  // const watchedPincode = watch("branchPinCode");
  const { branchId } = useParams();
  // console.log("Submit status: ", step < steps.length - 1 && submitStatus == 1);
  const authorizationStatusOptions = [
    { label: "ENTRY", value: 0 },
    { label: "VERIFIED", value: 1 },
  ];

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

  if (selectedAmendment?.authorizationStatus === true) {
    amendmentAuthorizationOptions.push(
      {
        label: `ENTRY : ${selectedAmendment.authorizationDate}`,
        value: 0,
      },
      {
        label: `VERIFIED : ${selectedAmendment.authorizationDate}`,
        value: 1,
      },
    );
  }

  const isVerifiedAmendment = // Read-only VERIFIED mode
    selectedAmendment?.authorizationStatus === true && !addingNewAmend;

  // const hasUserChanges = Object.keys(dirtyFields).length > 0;
  const isLastStep = step === steps.length - 1;
  // const documentsValid = submitStatus === 0;
  const isAmendMode = amendments.length > 0;

  const canSave =
    !isVerifiedAmendment &&
    ((isAmendMode && isDirty) || (!isAmendMode && isLastStep));

  const toLocalDate = (date) =>
    date instanceof Date
      ? date.toLocaleDateString("en-CA") // yyyy-MM-dd
      : date;

  const fetchBranchAmendData = useCallback(
    async (branchId) => {
      try {
        const response = await axios.get(
          `http://localhost:8087/branch/getamendlist/${branchId}`,
        );

        setAmendments(response.data.branchDtoLogs || []); // Use the amends data
        // // delete response.data.companyDtoLogs;
        console.log("Amend response", amendments);
        setSelectedAmendment(response.data); //data form master table
        setValue("branchMstID", response.data.branchMstID);
        console.log("Selected response", selectedAmendment);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    },
    [setSelectedAmendment, setAmendments, setValue],
  );

  // console.log("Locaked ", isUnlocked || isVerifiedAmendment); //true
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

  const handleApiError = (error) => {
    // console.error("API Error:", error);

    // Network error (no response from server)
    if (!error.response) {
      toast.error("Unable to connect to server. Please check your network.");
      return;
    }
    // console.log("Error", error);
    const status = error.type;

    switch (status) {
      case 400:
        toast.error(error.errors[0]);
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
  };

  const latestAmendmentId = amendments.length
    ? amendments
        .filter((a) => a.authorizationStatus === false)
        .reduce(
          (max, cur) => (cur.amendNo > max.amendNo ? cur : max),
          amendments[0],
        )
    : null;

  useEffect(() => {
    setValue("mode", inputMode, { shouldDirty: false });
  }, [inputMode, setValue]);

  useEffect(() => {
    const date = new Date(); // current date
    const formattedDate = date.toISOString().split("T")[0]; //yyyy-mm-dd format
    // console.log("Active date",formattedDate)
    setValue("activeDate", formattedDate);
  }, [setValue]);

  const loadCompanyAndBranches = useCallback(async () => {
    try {
      const companyResponse = await axios.get(
        `http://localhost:8087/company/${companyId}`,
      );
      const company = companyResponse.data;

      // console.log("Company Listdasfgwsdrg:", company.companyMstID);

      const companyobj = {
        value: company.companyMstID,
        label: company.company,
      };
      setCompanyList([companyobj]);

      // console.log("Company List: ",company);
      // setCompanyList([company]);
      // setInitialCompanyId(company.companyMstID); // store it
    } catch (error) {
      // toast.error("Failed to load company:", error);
      handleApiError(error);
    }
  }, [companyId]);

  const handleGenerateAmendment = () => {
    setSelectedAmendment(null);
    setAddingNewAmend(true);
    setIsReadOnly(false);

    reset({
      ...getValues(), //  keep base data
      authorizationStatus: 0, // ENTRY
      // mode: "INSERT",
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

  // useEffect(() => {
  //   if (watchedDocuments && watchedDocuments.length > 0) {
  //     const emptyDoc = watchedDocuments.find((doc) => doc.file == null);
  //     submitStatus = emptyDoc ? 1 : 0;
  //     // console.log("Empty document flage", emptyDoc);
  //     // console.log("Watch documnest", watchedDocuments);
  //     // console.log("Submit status1 ", submitStatus);
  //   }
  // }, [watchedDocuments, file]);

  useEffect(() => {
    if (!branchId) return;
    fetchBranchAmendData(branchId);
  }, [branchId, fetchBranchAmendData]);

  // useEffect(() => {
  //   if (!watchedDocuments?.length) {
  //     setSubmitStatus(1);
  //     return;
  //   }

  //   const hasEmptyFile = watchedDocuments.some(
  //     (doc) => !doc?.file || doc.file.length === 0,
  //   );

  //   setSubmitStatus(hasEmptyFile ? 1 : 0);
  // }, [watchedDocuments]);

  useEffect(() => {
    loadCompanyAndBranches();
    // console.log("Company list response: ", companyList);
  }, [loadCompanyAndBranches]);

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
  //   console.log("Input ref:", authDateInputRef.current);
  //   console.log("DatePicker ref:", datePickerRef.current);
  // }, []);

  useEffect(() => {
    const date = new Date(); // current date
    const formattedDate = date.toISOString().slice(0, 10); //yyyy-mm-dd format
    setValue("activeDate", formattedDate);
  }, [setValue]);

  const setingData = useCallback(
    (selectedAmendment) => {
      setValue("shortName", selectedAmendment.shortName ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });

      setValue(
        "authorizationStatus",
        selectedAmendment.authorizationStatus ? 1 : 0, //  Status from back end is boolean(true/flase)
        {
          shouldDirty: false,
          shouldValidate: true,
        },
      );

      setValue("branch", selectedAmendment.branch ?? "", {
        shouldDirty: false,
        shouldValidate: true,
      });

      setValue("withaffectdate", selectedAmendment.withaffectdate ?? "", {
        shouldDirty: false,
        shouldValidate: false,
      });

      // setValue("companyImage", selectedAmendment.companyImage ?? "");

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
    [setValue],
  );

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
    setValue("mode", "UPDATE", { shouldDirty: false });
    setingData(amendments[index]);
  };

  const nextStep = async () => {
    const valid = await trigger();
    if (valid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const saveBranch = async (formData) => {
    const response = await fetch("http://localhost:8087/branch/save", {
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
      await trigger("documents"); //  validate all docs
      if (errors?.documents) {
        toast.error("Please complete the document details");
        return;
      }
      const payload = {
        ...data,
        userCode,
        authorizationDate: new Date().toISOString().split("T")[0],
      };
      // setValue("userCode", userCode);
      // setValue("authorizationDate", new Date());
      console.log("Submitting data", data);
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (key !== "companyImage") {
          formData.append(key, value);
        }
      });

      if (data.companyImage) {
        formData.append("companyImage", data.companyImage);
      }

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

      // const response = await fetch("http://localhost:8087/branch/save", {
      //   method: "POST",
      //   body: formData,
      // });

      // let result;
      // try {
      //   const responseText = await response.text();
      //   if (responseText) {
      //     console.log("response", responseText);
      //     result = JSON.parse(responseText);
      //   }
      // } catch (parseError) {
      //   toast.error("Error parsing response:", parseError);
      // }
      const result = await saveBranch(formData);
      if (result && result.success === true) {
        toast.success("Branch saved successfully!");
        // SAVE → VIEW → GENERATE AMENDMENT → SAVE AMENDMENT → VERIFY
        //  isVerifiedAmendment(true); //  lock
        const status = getValues("authorizationStatus");
        // console.log("Status ", status);
        // const status1 = watch("authorizationStatus");
        // console.log("Status1 ", status1);
        if (status === 1) {
          //activate amend mode
          setIsReadOnly(true);
          setAddingNewAmend(true);
        } else {
          setAddingNewAmend(false); // exit amend mode
          //setMode("VIEW"); // optional state
        }

        return;
      }

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
      //   }),
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
            <form
              className="form-container"
              onSubmit={() => {
                // await trigger("documents"); //  validate all docs
                if (errors?.documents) {
                  toast.error("Please complete the document details");
                  return;
                }
                handleSubmit(onSubmit);
              }}
            >
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
                      isReadOnly={isVerifiedAmendment || isReadOnly}
                      isUnlocked={isUnlocked || isVerifiedAmendment}
                      ref={generalInfoRef}
                      companys={companyList}
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
                      control={control}
                      setFocus={setFocus}
                      flags={formFlags}
                      isReadOnly={isVerifiedAmendment || isReadOnly}
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
                      setFocus={setFocus}
                      setValue={setValue}
                      setError={setError}
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
                      append={append}
                      remove={remove}
                      trigger={trigger} // validate the documents while adding new document
                      watchDocuments={watchedDocuments}
                      // onFileSelect={file} //Toggle the save when file selected
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
                              isDisabled={isReadOnly}
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
                                smoothFocus(); //  Focus to name after selecting the date
                              }, 0);
                            }}
                            dateFormat="dd/MM/yyyy"
                            // minDate={new Date()}
                            showMonthDropdown
                            onFocus={() => datePickerRef.current?.setOpen(true)}
                            showYearDropdown
                            customInput={
                              <input
                                // ref={authDateInputRef}
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
                    //.sort((a, b) => new Date(b.date) - new Date(a.date)) //  descending by date
                    .map((item, index) => {
                      // then map
                      const isSelected =
                        selectedAmendment?.amendNo === item.amendNo;
                      return (
                        <div
                          key={item.branchMstID}
                          className={`amend-pill 
                            ${item.amendNo == latestAmendmentId.amendNo ? "entry" : "verified"}
                            ${isSelected ? "selected" : ""}
                            
                          `}
                          title={
                            item.amendNo !== latestAmendmentId.amendNo
                              ? "This amendment has been verified and locked"
                              : ""
                          }
                          onClick={() => {
                            handleSelectAmendment(item.branchMstID, index);
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
                            {item.amendNo == latestAmendmentId.amendNo && (
                              <span className="pill-badge verified">
                                latest
                              </span>
                            )}
                            {item.authorizationStatus !== false &&
                              item.amendNo !== latestAmendmentId.amendNo && (
                                <span className="pill-badge verified">
                                  ✔ Verified
                                </span>
                              )}
                            {item.authorizationStatus == false &&
                              item.amendNo !== latestAmendmentId.amendNo && (
                                <span className="pill-badge verified">
                                  Entry
                                </span>
                              )}
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
              // onClick: () => window.location.reload(),
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
