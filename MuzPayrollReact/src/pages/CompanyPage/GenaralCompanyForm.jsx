import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import { useParams } from "react-router-dom";
// import axios from "axios";
import { toast } from "react-hot-toast";
import DatePicker from "react-datepicker";

import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import GeneralInfoForm from "../Branch Page/Tabs/General Info/GeneralInfoForm";
import AddressForm from "../Branch Page/Tabs/General Info/AddressForm";
import ContactForm from "../Branch Page/Tabs/General Info/ContactForm";
import DocumentsTab from "../Branch Page/Tabs/General Info/DocumentsTab";

import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTopButton";

//Constants
import { COMMON_COMPANY_FIELD_MAP } from "../../constants/companyFieldMap";
import { steps } from "../../constants/FormSteps";

//service
import { getCompanyAmendList } from "../../services/company.service";
import { saveCompany } from "../../services/company.service"
//Hook (flow control)
import { useSetAmendmentData } from "../../hooks/useSetAmendmentData";
import { useEntityAmendList } from "../../hooks/useEntityAmendList";
import { useSmoothFormFocus } from "../../hooks/useSmoothFormFocus";
import { useGenerateAmend } from "../../hooks/useGenerateAmend";
import { useFormStepper } from "../../hooks/useFormStepper";
import { useSaveForm } from "../../hooks/useSaveForm";

//Utils (Helpers)
import { formatDate } from "../../utils/dateFormater";

import "react-datepicker/dist/react-datepicker.css";

export default function GenaralCompanyForm() {
  // const [submitStatus, setSubmitStatus] = useState(1);
  // const [selectedAmendment, setSelectedAmendment] = useState(null);
  // const [backendErrors, setBackendErrors] = useState([]);
  //pass the back end error to front end

  // const [addNewAmend, setAddNewAmend] = useState(false);
  // true when latest amned is verified enables the genarate button

  const [addingNewAmend, setAddingNewAmend] = useState(false); // enables the auth date and hide generate amned button

  // const authDateInputRef = useRef(null);
  const generalInfoRef = useRef(null);
  const UserData = localStorage.getItem("loginData");
  const userObj = JSON.parse(UserData);
  const dateWrapperRef = useRef(null); // to scroll in to controller of date picker

  // const [isReadOnly, setIsReadOnly] = useState();
  //Convert the JSON string to objects
  const userCode = userObj.userCode.split("@", 1)[0];

  const { companyId } = useParams();

  //Fetch company amend data
  const {
    amendments,
    // setAmendments,
    selectedAmendment,
    setSelectedAmendment,
    fetchEntityAmendData,
  } = useEntityAmendList({
    entity: "company",
    getEntityAmendList: getCompanyAmendList,
  });

  const inputMode = amendments.length > 0 ? "UPDATE" : "INSERT";
  // console.log("amends nmber", inputMode);
  const {
    register,
    handleSubmit,
    trigger,
    setError,
    clearErrors,
    setValue,
    reset,
    getValues,
    setFocus,
    watch,
    control,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onChange", //multi step formz
    // reValidateMode: "onChange",
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
      // mode: inputMode,once assign the value not changes
      activeStatusYN: 1,
    },
  });

  const amendLenght = amendments.length;

  //seting amend data with selected amend pill
  const { setAmendmentData } = useSetAmendmentData({
    amendLenght,
    setValue,
    fieldMap: COMMON_COMPANY_FIELD_MAP,
  });

  // From content changes
  const [formFlags] = useState({
    companyForm: true,
    branchForm: false,
    locationForm: false,
  });

  const { smoothFocus } = useSmoothFormFocus({
    formFlags,
    setFocus,
  });

  const authDate = useWatch({
    control,
    name: "withaffectdate",
  });

  //Handle the generate new amend
  const { handleGenerateAmendment } = useGenerateAmend({
    setSelectedAmendment,
    setAddingNewAmend,
    reset,
    getValues,
    clearErrors,
  });

  const { onSubmit, step, setStep, datePickerRef } = useSaveForm({
    trigger,
    //   errors,
    userCode,
    reset,
    companyId,
    amendments, // SAME STATE
    refreshAmendments: fetchEntityAmendData,
    entity:"company",
    saveEntity: saveCompany,
  });

  const { nextStep, prevStep } = useFormStepper({
    trigger,
    setStep,
  });

  //workflow of amend date then name logic
  let isUnlocked = !!authDate;
  if (amendments.length > 0) {
    isUnlocked = true;
  } else {
    isUnlocked = !!authDate;
  }

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

  // const amendmentAuthorizationOptions = [];

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

  // const hasUserChanges = Object.keys(dirtyFields).length > 0;
  const isLastStep = step === steps.length - 1;
  // const documentsValid = submitStatus === 0;
  const isAmendMode = amendments.length > 0;

  const canSave =
    !isVerifiedAmendment &&
    ((isAmendMode && isDirty) || (!isAmendMode && isLastStep));

  // console.log("Can save", canSave);
  // const canSave =
  //   !isVerifiedAmendment &&
  //   // Amendment mode: user changed something
  //   ((isAmendMode && hasUserChanges) ||
  //     // New entry mode: complete all steps + valid docs
  //     (!isAmendMode && isLastStep && documentsValid));

  // useEffect(() => {
  //   if (!watchedDocuments?.length) {
  //     console.log("Documents chnaged");
  //     setSubmitStatus(1);
  //     return;
  //   }

  //   const hasEmptyFile = watchedDocuments.some(
  //     (doc) => !doc?.file || doc.file.length === 0,
  //   );
  //   console.log("Documents chnaged", hasEmptyFile);
  //   setSubmitStatus(hasEmptyFile ? 1 : 0);
  // }, [watchedDocuments]);

  useEffect(() => {
    setValue("mode", inputMode, { shouldDirty: false });
  }, [inputMode, setValue]);

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

  //latest amend only entry amend with max amend number
  const latestAmendmentId = amendments.length
    ? amendments
        .filter((a) => a.authorizationStatus === false)
        .reduce(
          (max, cur) => (cur.amendNo > max.amendNo ? cur : max),
          amendments[0],
        )
    : null;

  useEffect(() => {
    if (!companyId) return;
    fetchEntityAmendData(companyId);
  }, [companyId, fetchEntityAmendData]);

  useEffect(() => {
    const date = new Date(); // current date
    const formattedDate = date.toISOString().split("T")[0]; //yyyy-mm-dd format
    // console.log("Active date",formattedDate)
    setValue("activeDate", formattedDate);
  }, [setValue]);

  useEffect(() => {
    //Api call should bo here
    //after doing the api call then you must add the field values i added name and company for demo

    if (!selectedAmendment) return;
    //Amend Auto selection whille loading
    setAmendmentData(selectedAmendment);
  }, [selectedAmendment, setAmendmentData]);

  const handleSelectAmendment = (id, index) => {
    // User Selecetion - Assign the amend data to feild
    setSelectedAmendment(amendments[index]);

    // setAmendmentData(amendments[index]);
    // setValue("shortName", amendments[index].shortName);

    // setValue("company", amendments[index].company, {
    //   shouldDirty: true,
    //   shouldValidate: true,
    // });
  };

  const handleClear = () => {
    if (selectedAmendment) {
      // Restore selected amendment values
      setAmendmentData(selectedAmendment);

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
                      isReadOnly={isVerifiedAmendment}
                      isUnlocked={isUnlocked || isVerifiedAmendment}
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
                      flags={formFlags}
                      isUnlocked={isUnlocked || isVerifiedAmendment}
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
                      control={control}
                      append={append}
                      remove={remove}
                      trigger={trigger} // validate the documents while adding new document
                      watchDocuments={watchedDocuments}
                      isUnlocked={isUnlocked || isVerifiedAmendment}
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
                          //     (opt) => opt.value === 1
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
                        ref={dateWrapperRef}
                        className="form-label required"
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

                      {console.log("asfafasdf")}
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
                    // .sort((a, b) => new Date(b.withaffectdate) - new Date(a.withaffectdate)) //  descending by date
                    .map((item, index) => {
                      // then map
                      const isSelected =
                        selectedAmendment?.amendNo === item.amendNo;
                      return (
                        <div
                          key={item.amendNo}
                          className={`amend-pill 
                            ${item.amendNo == latestAmendmentId.amendNo ? "entry" : "verified"}
                            ${isSelected ? "selected" : ""}
                            
                          `}
                          title={
                            item.amendNo !== latestAmendmentId.amendNo &&
                            "This amendment has been verified and locked"
                          }
                          onClick={() => {
                            handleSelectAmendment(item.locationMstID, index);
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
                            {/* {item.authorizationStatus == false &&
                              item.amendNo !==
                                latestAmendmentId.amendNo && (
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
              // disabled: step < steps.length - 1 && submitStatus == 1,
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
