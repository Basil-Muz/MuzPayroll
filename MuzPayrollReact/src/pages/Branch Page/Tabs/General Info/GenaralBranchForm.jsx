import { useState,useEffect } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import GeneralInfoForm from "./GeneralInfoForm";
import AddressForm from "./AddressForm";
import ContactForm from "./ContactForm";
import "../../css/From.css";
import StepProgress from "./StepProgress";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import DocumentsTab from "../Documents-Info/DocumentsTab";
import Header from "../../../../components/Header/Header";
import FloatingActionBar from "../../../../components/demo_buttons/FloatingActionBar";

const steps = ["General Info", "Address", "Contact", "Document Into"];

export default function GenaralBranchForm() {
  const [step, setStep] = useState(0); //switch steps
  // const [backendErrors, setBackendErrors] = useState([]); 
  //pass the back end error to front end

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    clearErrors,
    setValue,
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
          remarks: ""
        }
      ]
    }
  });

  // From content changes
  const [formFlags] = useState({
  companyForm: false,
  branchForm: true,
  locationForm: false
});

  const [selectedAmendment, setSelectedAmendment] = useState(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents"
  });

  const watchedDocuments = watch("documents");
  // const watchedPincode = watch("branchPinCode");
  
  const amendments = [
      {
    id: 1,
    type: "VERIFIED",
    authorizationLabel: "AUTHORIZATION : 01/01/2022",
    date: "2022-01-01",
    expiryDate: "2023-12-31",
    generatedBy: {
      name: "System",
      role: "Auto Generated",
      email: "system@company.com",
      mobile: null
    },
    changes: []
  },
  {
    id: 2,
    type: "VERIFIED",
    authorizationLabel: "ENTRY : 10/10/2025",
    date: "2025-10-10",
        country:"IN",
    name:"Demo6456",
    company:"TCS",
    expiryDate: "2026-10-09",
    generatedBy: {
      name: "HR Manager",
      role: "Manager",
      email: "hr@company.com",
      mobile: "+91 9898989898"
    },
    changes: [
      { field: "district", oldValue: "Ernakulam", newValue: "Thrissur" }
    ]
  },

    {
    id: 3,
    type: "ENTRY",
    authorizationLabel: "ENTRY : 20/10/2025",
    date: "2025-10-20",       
    expiryDate: null,
    country:"IN",
    name:"Demo",
    company:"TCS",
    generatedBy: {
      name: "Admin User",
      role: "System Administrator",
      email: "admin@company.com",
      mobile: "+91 9876543210"
    },
    changes: [
      { field: "companyName", oldValue: "Medical Advance Pvt Ltd", newValue: "Medical Advance Ltd" },
      { field: "pincode", oldValue: "680001", newValue: "680004" }
    ]
  },
];


  useEffect(() => {
    const date=new Date(); // current date
    // const createdAt = date.toLocaleDateString('en-GB'); //dd-mm-yyyy format
    // console.log("Created At:", createdAt);
    const formattedDate = date.toISOString().slice(0, 10); //yyyy-mm-dd format

    setValue("activeDate", formattedDate);
  }, [setValue]);

  useEffect(() => {
    //Api call should bo here
    //after doing the api call then you must add the field values i added name and company for demo
    
  if (!amendments?.length) return;

  // prevent infinite loop
  if (selectedAmendment !== null) return;

  const latest = amendments[amendments.length - 1];

  setSelectedAmendment(latest.id);

  setValue("name", latest.name, { shouldDirty: false });
  setValue("company", latest.company, { shouldDirty: false });
}, [amendments, selectedAmendment, setValue]);


const handleSelectAmendment = (id,index) => {
  setSelectedAmendment(id);
  setValue("name", amendments[index].name);
   setValue("company", amendments[index].company, {
    shouldDirty: true,
    shouldValidate: true,
  });
};

const latestAmendmentId = amendments.reduce((latest, current) => { //compute the latest amend Id
  return new Date(current.date) > new Date(latest.date)
    ? current
    : latest;
}).id;

// setBackendErrors(prev =>
//   JSON.stringify(prev) === JSON.stringify(errors) ? prev : errors
// );

  /** Backend error mapping */
  // const mapBackendErrors = (apiErrors) => {
  //   Object.entries(apiErrors).forEach(([field, message]) => {
  //     setError(field, { type: "server", message });
  //   });
  // };

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
       1️⃣ Prepare documents JSON
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
        remarks: doc.remarks || ""
      };
    });

    /* -------------------------------
        Prepare final JSON payload
    -------------------------------- */
    const payload = {
      ...data,
      documents: documentsPayload
    };
        console.log("payload:",payload)
    //  VERY IMPORTANT: remove FileList from payload
    delete payload.documents?.file;

    /* -------------------------------
        Append JSON as Blob
    -------------------------------- */
    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], {
        type: "application/json"
      })
    );

    /* -------------------------------
        Debug FormData (correct way)
    -------------------------------- */
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    for (const [key, value] of formData.entries()) {
  console.log(key, value instanceof File ? "FILE" : value);
}

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
        Registration</h1>
      <p>Register a new 
       {formFlags.locationForm && " company location "}
        {formFlags.companyForm && " company "}
        {formFlags.branchForm && " branch "} 
        by filling in the details below</p>
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
            className={`step-item ${index === step ? 'active' : ''} ${index < step ? 'completed' : ''}`}
          >
            <div className="step-icon">
              {index < step ? <IoMdCheckmarkCircleOutline size={20}/> : index + 1}
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
                clearErrors={ clearErrors}
                control={control}
                flags={formFlags}
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
                clearErrors={ clearErrors}
                control={control}
                flags={formFlags}
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
                watchDocuments={watchedDocuments}
              />
            </div>)}
            <div className="form-amend">
              {/* Documentation form fields */}
              
            </div>
        </div>
{/* Authorization + Amendments */}
<div className="amend-section">
  <div className="amend-header-row">
    <div className="amend-field">
      <label className="form-label">Authorization</label>
      <select className="form-control">
        <option>ENTRY : 10/10/2025</option>
        <option>GENERATE NEW : 20/10/2025</option>
        <option>AUTHORIZATION : 01/01/2022</option>
      </select>
    </div>

    <button className="btn amend-generate">
      Generate Amendment
    </button>
  </div>

<div className="amend-container">
  {[...amendments]  // shallow copy to avoid mutating state
  .sort((a, b) => new Date(b.date) - new Date(a.date)) //  descending by date
  .map((item, index) => { // then map
    const isSelected =
      selectedAmendment === item.id ||
      (selectedAmendment === null && item.id === latestAmendmentId);
    return (
      <div
        key={item.id}
        className={`amend-pill 
          ${item.type === "ENTRY" ? "entry" : "verified"}
          ${isSelected ? "selected" : ""}
        `}
        onClick={() => handleSelectAmendment(item.id,index)}
      >
        <div className="pill-left">
          <span className="pill-index">{item.id}</span>
          <div className="pill-info">
            <span className="pill-type">{item.type}</span>
            <span className="pill-date">
              {new Date(item.date).toLocaleDateString("en-GB")}
            </span>
          </div>
        </div>

        <div className="pill-right">
          {item.type !== "ENTRY" && (
            <span className="pill-badge verified">✔ Verified</span>
          )}
          {item.id === latestAmendmentId && (
            <span className="pill-badge latest">Latest</span>
          )}
        </div>
      </div>
    );
  })}
</div>


</div>



        {/* Form Actions */}
        <div className="branch-form-actions">
          <div>
            {step > 0 && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={prevStep}
              >
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
      disabled: step < steps.length - 1
    },
    search: {
      // onClick: handleSearch,
      disabled:true,
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
  }}/>
</div>

</>
  );
}
