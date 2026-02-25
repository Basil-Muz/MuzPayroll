// React and core libraries
import { useState, useEffect, useRef, useCallback } from "react";

// Third-party libraries
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useParams } from "react-router-dom";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";

//  Hooks
import { useSaveForm } from "../../hooks/useSaveForm";
import { useFormClear } from "../../hooks/useFormClear";
import { useLoadBranch } from "../../hooks/useLoadBranch";
import { useFormStepper } from "../../hooks/useFormStepper";
import { useLoadCompany } from "../../hooks/useLoadCompany";
import { useGenerateAmend } from "../../hooks/useGenerateAmend";
import { useEntityAmendList } from "../../hooks/useEntityAmendList";
import { useSmoothFormFocus } from "../../hooks/useSmoothFormFocus";
import { useSetAmendmentData } from "../../hooks/useSetAmendmentData";

//  Services (API calls)
import { getLocationAmendList } from "../../services/location.service";
import { saveLocation } from "../../services/location.service";
//  Utils / helpers
import { formatDate } from "../../utils/dateFormater";
import { handleApiError } from "../../utils/errorToastResolver";

//  Constants
import { steps } from "../../constants/FormSteps";
import { COMMON_LOCATION_FIELD_MAP } from "../../constants/locationFieldMap";
//  Components
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import AddressForm from "../Branch Page/Tabs/General Info/AddressForm";
import ContactForm from "../Branch Page/Tabs/General Info/ContactForm";
import DocumentsTab from "../Branch Page/Tabs/General Info/DocumentsTab";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTopButton";
import GeneralInfoForm from "../Branch Page/Tabs/General Info/GeneralInfoForm";
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar";

// Styles
import "react-datepicker/dist/react-datepicker.css";

export default function GenaralLocationForm() {
  /* ------------------------------------------------------------------
   * 1. LOCAL STATE & REFS
   * ------------------------------------------------------------------ */
  const [addingNewAmend, setAddingNewAmend] = useState(false);

  const generalInfoRef = useRef(null);
  const dateWrapperRef = useRef(null);
  const cancelledRef = useRef(false);

  /* ------------------------------------------------------------------
   * 2. USER / SESSION DATA
   * ------------------------------------------------------------------ */
  const userObj = JSON.parse(localStorage.getItem("loginData"));
  const userCode = userObj.userCode.split("@", 1)[0];
  const companyId = userObj.companyId;

  /* ------------------------------------------------------------------
   * 3. ROUTE PARAMS
   * ------------------------------------------------------------------ */
  const { locationId } = useParams();

  /* ------------------------------------------------------------------
   * 4. DOMAIN / BUSINESS HOOKS
   * ------------------------------------------------------------------ */
  const {
    amendments,
    selectedAmendment,
    setSelectedAmendment,
    fetchEntityAmendData,
  } = useEntityAmendList({
    entity: "location",
    getEntityAmendList: getLocationAmendList,
    addingNewAmend,
    setAddingNewAmend,
  });

  const { loadCompany, companyList } = useLoadCompany();
  const { loadBranches, branchList } = useLoadBranch();

  /* ------------------------------------------------------------------
   * 5. FORM INITIALIZATION (React Hook Form)
   * ------------------------------------------------------------------ */
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
      userCode,
      authorizationDate: new Date().toISOString().split("T")[0],
      authorizationStatus: 0,
      activeStatusYN: 1,
      muzControllCodes: 15,
    },
  });

  /* ------------------------------------------------------------------
   * 6. DERIVED FORM STATE
   * ------------------------------------------------------------------ */
  const inputMode = amendments.length > 0 ? "UPDATE" : "INSERT";

  const authDate = useWatch({
    control,
    name: "withaffectdate",
  });

  const isUnlocked = amendments.length > 0 ? true : !!authDate;

  const isAmendMode = amendments.length > 0;
  const isVerifiedAmendment =
    selectedAmendment?.authorizationStatus === true && !addingNewAmend;

  /* ------------------------------------------------------------------
   * 7. UI / FLOW CONTROL HOOKS
   * ------------------------------------------------------------------ */
  const formFlags = {
    companyForm: false,
    branchForm: false,
    locationForm: true,
  };

  const { smoothFocus } = useSmoothFormFocus({ formFlags, setFocus });

  const { handleGenerateAmendment } = useGenerateAmend({
    setSelectedAmendment,
    setAddingNewAmend,
    reset,
    getValues,
    clearErrors,
  });

  const { onSubmit, step, setStep, datePickerRef } = useSaveForm({
    trigger,
    userCode,
    reset,
    entityId: locationId,
    amendments,
    refreshAmendments: fetchEntityAmendData,
    entity: " location ",
    saveEntity: saveLocation,
  });

  const { nextStep, prevStep } = useFormStepper({ trigger, setStep });

  /* ------------------------------------------------------------------
   * 8. FIELD ARRAYS & WATCHERS
   * ------------------------------------------------------------------ */
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const watchedDocuments = useWatch({
    control,
    name: "documents",
  });

  /* ------------------------------------------------------------------
   * 9. DERIVED OPTIONS & COMPUTED VALUES
   * ------------------------------------------------------------------ */
  const authorizationStatusOptions = [
    { label: "ENTRY", value: 0 },
    { label: "VERIFIED", value: 1 },
  ];

  const latestAmendmentId = amendments.length
    ? amendments
        .filter((a) => a.authorizationStatus === false)
        .reduce(
          (max, cur) => (cur.amendNo > max.amendNo ? cur : max),
          amendments[0],
        )
    : null;

  const amendmentAuthorizationOptions = [];

  if (selectedAmendment?.authorizationStatus === false) {
    amendmentAuthorizationOptions.push(
      { label: `ENTRY : ${selectedAmendment.authorizationDate}`, value: 0 },
      { label: "VERIFIED :", value: 1 },
    );
  }

  if (selectedAmendment?.authorizationStatus === true) {
    amendmentAuthorizationOptions.push({
      label: `VERIFIED : ${selectedAmendment.authorizationDate}`,
      value: 1,
    });
  }

  const isLastStep = step === steps.length - 1;

  const canSave =
    !isVerifiedAmendment &&
    ((isAmendMode && isDirty) || (!isAmendMode && isLastStep));

  /* ------------------------------------------------------------------
   * 10. DATA MAPPING HELPERS
   * ------------------------------------------------------------------ */
  const amendLength = amendments.length;

  const { setAmendmentData } = useSetAmendmentData({
    amendLenght: amendLength,
    setValue,
    fieldMap: COMMON_LOCATION_FIELD_MAP,
  });

  /* ------------------------------------------------------------------
   * 11. EVENT HANDLERS
   * ------------------------------------------------------------------ */
  const handleSelectAmendment = (_, index) => {
    setSelectedAmendment(amendments[index]);
    setAmendmentData(amendments[index]);
  };

  const { handleClear } = useFormClear({
    selectedAmendment,
    setAmendmentData,
    clearErrors,
    reset,
    userCode,
  });

  /* ------------------------------------------------------------------
   * 12. SIDE EFFECTS
   * ------------------------------------------------------------------ */
  const load = useCallback(async () => {
    try {
      loadBranches(companyId);
      loadCompany(companyId);
    } catch (err) {
      if (!cancelledRef.current) handleApiError(err);
    }
  }, [companyId, loadBranches, loadCompany]);

  useEffect(() => {
    setValue("mode", inputMode, { shouldDirty: false });
  }, [inputMode, setValue]);

  useEffect(() => {
    cancelledRef.current = false;
    load();
    return () => (cancelledRef.current = true);
  }, [load]);

  useEffect(() => {
    if (!locationId) return;
    fetchEntityAmendData(locationId);
  }, [locationId, fetchEntityAmendData]);

  useEffect(() => {
    if (!selectedAmendment) return;
    setAmendmentData(selectedAmendment);
  }, [selectedAmendment, setAmendmentData]);

  useEffect(() => {
    if (isVerifiedAmendment) return;

    const timer = setTimeout(() => {
      dateWrapperRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setTimeout(() => {
        document
          .querySelector(".withaffectdate")
          ?.focus({ preventScroll: true });
        datePickerRef.current?.setOpen(true);
      }, 500);
    }, 300);

    return () => clearTimeout(timer);
  }, [addingNewAmend, isVerifiedAmendment]);

  useEffect(() => {
    setValue("activeDate", new Date().toISOString().slice(0, 10));
  }, [setValue]);

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
                  {step < steps.length - 1 && (
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
                  )}
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
