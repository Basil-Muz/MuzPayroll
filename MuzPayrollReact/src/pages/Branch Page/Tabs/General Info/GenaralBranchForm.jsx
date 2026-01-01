import { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import GeneralInfoForm from "./GeneralInfoForm";
import AddressForm from "./AddressForm";
import ContactForm from "./ContactForm";
import "../../css/From.css";
import StepProgress from "./StepProgress";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import DocumentsTab from "../Documents Info/DocumentsTab";

const steps = ["General Info", "Address", "Contact", "Document Into"];

export default function GenaralBranchForm() {
  const [step, setStep] = useState(0);
  const [backendErrors, setBackendErrors] = useState({});
  const {
    register,
    handleSubmit,
    trigger,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  const watchedPincode = watch("branchPinCode");
  
  useEffect(() => {
    const date=new Date(); // current date
    // const createdAt = date.toLocaleDateString('en-GB'); //dd-mm-yyyy format
    // console.log("Created At:", createdAt);
    const formattedDate = date.toISOString().slice(0, 10); //yyyy-mm-dd format

    setValue("activeDate", formattedDate);
  }, [setValue]);

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


  /** Backend error mapping */
  const mapBackendErrors = (apiErrors) => {
    Object.entries(apiErrors).forEach(([field, message]) => {
      setError(field, { type: "server", message });
    });
  };

  const nextStep = async () => {
    const valid = await trigger();
    if (valid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data) => {
    try {
      console.log("Submitting:", data);

      //  Simulated backend error
      throw {
        response: {
          data: {
            errors: {
              email: "Email already exists",
              pincode: "Invalid pincode",
            },
          },
        },
      };
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) mapBackendErrors(apiErrors);
    }
  };

  return (
    <> 
   <div className="branch-container-tab">
  <div className="form-card">
    {/* Header */}
    <div className="form-header">
      <h1>Branch Registration</h1>
      <p>Register a new branch by filling in the details below</p>
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
              />
            </div>
          )}
          {step === 3 &&(
            <div className="form-section">
              {/* Documentation form fields */}
              <DocumentsTab
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                setError={setError}
              />
            </div>)}

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
            {step < steps.length - 1 ? (
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
            ) : (
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Complete Registration
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
</>
  );
}
