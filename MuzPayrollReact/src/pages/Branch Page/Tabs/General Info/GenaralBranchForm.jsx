import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import GeneralInfoForm from "./GeneralInfoForm";
import AddressForm from "./AddressForm";
import ContactForm from "./ContactForm";
import DocumentsTab from "../Documents-Info/DocumentsTab";

import StepProgress from "./StepProgress";
import Header from "../../../../components/Header/Header";
import FloatingActionBar from "../../../../components/demo_buttons/FloatingActionBar";

import "../../css/From.css";
import ThemeToggle from "../../../../components/ThemeToggle/ThemeToggle";
import ScrollToTopButton from "../../../../components/ScrollToTop/ScrollToTopButton";

const steps = ["General Info", "Address", "Contact", "Document Into"];

export default function GenaralBranchForm() {
  const [step, setStep] = useState(0); //switch steps

  // const [backendErrors, setBackendErrors] = useState([]);
  //pass the back end error to front end

  // const [addNewAmend, setAddNewAmend] = useState(false);
  // true when latest amned is verified enables the genarate button

  const [addingNewAmend, setAddingNewAmend] = useState(false); // enables the auth date and hide generate amned button

  const datePickerRef = useRef(null);
  const authDateInputRef = useRef(null);
  const generalInfoRef = useRef(null);

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
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      documents: [
        {
          type: "",
          number: "",
          expiryDate: "",
          file: null,
          remarks: "",
        },
      ],
    },
  });

  const authDate = watch("authorizationDate"); //workflow of amend date then name logic

  const isUnlocked = !!authDate;

  // From content changes
  const [formFlags] = useState({
    companyForm: true,
    branchForm: false,
    locationForm: false,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  // const stored = localStorage.getItem("loginData");

  const watchedDocuments = watch("documents");
  // const watchedPincode = watch("branchPinCode");

  const amendmentTypeOptions = [
    { label: "ENTRY", value: "ENTRY" },
    { label: "VERIFIED", value: "VERIFIED" },
  ];

  const amendments = [
    // {
    //   id: 1,
    //   authorization: "VERIFIED",
    //   date: "2025-10-20",
    //   name: "Demo",
    //   company: "TCS",
    //   status: "active",
    //   expiryDate: "2025-10-10",
    //   generatedBy: "Admin User",
    // },
    // {
    //   id: 2,
    //   authorization: "VERIFIED",
    //   date: "2025-10-10",
    //   status: "expired",
    //   expiryDate: "2021-12-31",
    //   generatedBy: "System",
    // },
    // {
    //   id: 3,
    //   authorization: "VERIFIED",
    //   date: "2025-01-01",
    //   status: "inactive",
    //   expiryDate: "",
    //   generatedBy: "Manager",
    // },
  ];

  const latestAmendmentId = amendments.length
    ? amendments.reduce((latest, current) =>
        new Date(current.date) > new Date(latest.date) ? current : latest
      )
    : null;

  const [selectedAmendment, setSelectedAmendment] = useState(latestAmendmentId);

  // console.log("Selected item:", selectedAmendment);

  const amendmentAuthorizationOptions = [
    {
      label:
        selectedAmendment?.authorization === "ENTRY"
          ? `ENTRY : ${selectedAmendment.date}`
          : "ENTRY",
      value: "ENTRY",
    },
    {
      label:
        selectedAmendment?.authorization === "VERIFIED"
          ? `VERIFIED : ${selectedAmendment.date}`
          : "VERIFIED",
      value: "VERIFIED",
    },
  ];

  const isVerifiedAmendment = // Read-only VERIFIED mode
    selectedAmendment?.authorization === "VERIFIED" && !addingNewAmend;

  //for smooth focus
  const smoothFocus = (fieldName) => {
    const el = document.querySelector(`[name="name"]`);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      console.log("sgvwrg");
    }

    setFocus(fieldName); // RHF handles focus properly
  };

  useEffect(() => {
    if (isVerifiedAmendment) return;

    const timer = setTimeout(() => {
      authDateInputRef.current?.focus();
      datePickerRef.current?.setOpen(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [addingNewAmend, isVerifiedAmendment]);

  useEffect(() => {
    console.log("Input ref:", authDateInputRef.current);
    console.log("DatePicker ref:", datePickerRef.current);
  }, []);

  useEffect(() => {
    const date = new Date(); // current date
    const formattedDate = date.toISOString().slice(0, 10); //yyyy-mm-dd format
    setValue("activeDate", formattedDate);
  }, [setValue]);

  useEffect(() => {
    //Api call should bo here
    //after doing the api call then you must add the field values i added name and company for demo

    if (!selectedAmendment) return;

    setValue("name", selectedAmendment.name ?? "", {
      shouldDirty: false,
    });

    setValue("authorization", selectedAmendment.authorization, {
      shouldDirty: false,
      shouldValidate: true,
    });

    setValue("company", selectedAmendment.company ?? "", {
      shouldDirty: false,
    });
  }, [selectedAmendment, setValue]);

  const handleSelectAmendment = (id, index) => {
    setSelectedAmendment(amendments[index]);

    setValue("name", amendments[index].name);

    setValue("company", amendments[index].company, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const nextStep = async () => {
    const valid = await trigger();
    if (valid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      console.log("Submitting raw data:", data);

      /* -------------------------------
          Prepare documents JSON
        (NO FileList inside JSON)
      -------------------------------- */
      const documentsPayload = data.documents.map((doc) => {
        // Append file separately
        if (doc.file && doc.file.length > 0) {
          formData.append("files", doc.file[0]); //  backend handles array
        }

        return {
          type: doc.type,
          number: doc.number,
          expiryDate: doc.expiryDate,
          remarks: doc.remarks || "",
        };
      });

      /* -------------------------------
          Prepare final JSON payload
      -------------------------------- */
      const payload = {
        ...data,
        documents: documentsPayload,
      };

      // console.log("payload:", payload);

      //  VERY IMPORTANT: remove FileList from payload
      delete payload.documents?.file;

      /* -------------------------------
          Append JSON as Blob
      -------------------------------- */
      formData.append(
        "data",
        new Blob([JSON.stringify(payload)], {
          type: "application/json",
        })
      );

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
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        Object.entries(apiErrors).forEach(([field, message]) => {
          setError(field, { type: "server", message });
        });
      }
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
                      isUnlocked={isUnlocked}
                      ref={generalInfoRef}
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
                      flags={formFlags}
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
                        name="amendmentType"
                        control={control}
                        // rules={{ required: "Please select amendment type" }}
                        render={({ field }) => {
                          const selectedOption = amendmentTypeOptions.find(
                            (opt) => opt.value === "ENTRY"
                          );

                          return (
                            <Select
                              options={amendmentTypeOptions}
                              placeholder="Select amendment type"
                              isSearchable={false}
                              classNamePrefix="form-control-select"
                              className={errors.amendmentType ? "error" : ""}
                              value={selectedOption || null} //  label from options
                              onChange={(option) =>
                                field.onChange(option.value)
                              } //  store ONLY value
                            />
                          );
                        }}
                      />
                    </div>

                    <div className="amend-field">
                      <label className="form-label required">
                        Authorization date
                      </label>
                      <Controller
                        name="authorizationDate"
                        control={control}
                        rules={{ required: "Please select a date" }}
                        render={({ field }) => (
                          <DatePicker
                            ref={datePickerRef}
                            placeholderText="Select date"
                            className={`form-control datepicker-input ${
                              errors.authorizationDate ? "error" : ""
                            }`}
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(date) => {
                              field.onChange(
                                date ? date.toISOString().slice(0, 10) : null
                              );

                              setTimeout(() => {
                                smoothFocus("name"); //  Focus to name after selecting the date
                              }, 0);
                            }}
                            dateFormat="dd/MM/yyyy"
                            minDate={new Date()}
                            showMonthDropdown
                            onFocus={() => datePickerRef.current?.setOpen(true)}
                            showYearDropdown
                            customInput={
                              <input
                                ref={authDateInputRef}
                                className={`form-control datepicker-input ${
                                  errors.authorizationDate ? "error" : ""
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
                        name="authorization"
                        control={control}
                        rules={{ required: "Please select authorization" }}
                        render={({ field }) => {
                          const selectedOption =
                            amendmentAuthorizationOptions.find(
                              (opt) => opt.value === field.value
                            );

                          return (
                            <Select
                              options={amendmentAuthorizationOptions}
                              placeholder="Select authorization"
                              isSearchable={false}
                              isDisabled={isVerifiedAmendment}
                              classNamePrefix="form-control-select"
                              className={errors.authorization ? "error" : ""}
                              value={selectedOption} //  label from options
                              onChange={(option) =>
                                field.onChange(option.value)
                              } //  store ONLY value
                            />
                          );
                        }}
                      />
                    </div>
                    {latestAmendmentId.authorization === "VERIFIED" &&
                      !addingNewAmend && ( // Adding the new amend only if the latest amend is verified
                        <div
                          className="btn amend-generate"
                          onClick={() => {
                            // setAddNewAmend(true);
                            setSelectedAmendment(null); // unselect the all pills
                            setAddingNewAmend(true);
                            reset({
                              documents: [
                                {
                                  type: "",
                                  number: "",
                                  expiryDate: "",
                                  file: null,
                                  remarks: "",
                                },
                              ],
                              authorization: "",
                              name: "",
                              company: "",
                              shortName: "",
                              activeDate: new Date(),
                              pinCode: "",
                              address: "",
                              country: "",
                              state: "",
                              district: "",
                              place: "",
                              employerDesignation: "",
                              employerPhone: "",
                              employerEmail: "",
                              employerName: "",
                              landline: "",
                              phone: "",
                              email: "",
                            });
                            clearErrors();
                          }}
                        >
                          Generate Amendment
                        </div>
                      )}
                  </div>
                )}

                <div className="amend-container">
                  {[...amendments] // shallow copy to avoid mutating state
                    .sort((a, b) => new Date(b.date) - new Date(a.date)) //  descending by date
                    .map((item, index) => {
                      // then map
                      const isSelected = selectedAmendment?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          className={`amend-pill 
                            ${item.authorization === "ENTRY" ? "entry" : "verified"}
                            ${isSelected ? "selected" : ""}
                          `}
                          onClick={() => {
                            handleSelectAmendment(item.id, index);
                            // setAddNewAmend(false);
                            setAddingNewAmend(false);
                          }}
                        >
                          <div className="pill-left">
                            <span className="pill-index">{item.id}</span>
                            <div className="pill-info">
                              <span className="pill-type">
                                {item.authorization}
                              </span>
                              <span className="pill-date">
                                {new Date(item.date).toLocaleDateString(
                                  "en-GB"
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="pill-right">
                            {item.id == latestAmendmentId.id && (
                              <span className="pill-badge verified">
                                latest
                              </span>
                            )}
                            {item.authorization !== "ENTRY" &&
                              item.id !== latestAmendmentId.id && (
                                <span className="pill-badge verified">
                                  ✔ Verified
                                </span>
                              )}
                            {item.authorization == "ENTRY" &&
                              item.id !== latestAmendmentId.id && (
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
              disabled: step < steps.length - 1,
            },
            search: {
              // onClick: handleSearch,
              disabled: true,
            },
            clear: {
              // onClick: handleClear,
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
