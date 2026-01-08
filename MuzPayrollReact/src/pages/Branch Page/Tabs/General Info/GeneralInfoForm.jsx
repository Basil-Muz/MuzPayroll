import {useState , useRef} from 'react';
import Select from "react-select";
import { Controller } from "react-hook-form";
import FloatingActionBar from '../../../../components/demo_buttons/FloatingActionBar';
import ImageCropModal from "./ImageCropModal";

export default function GeneralInfoForm({
  register,
  errors,
  // watch,
  setValue,
  clearErrors,
  control,
  flags,
  setError,
  // disabled = {false},
  // requiredMap = {},
}) {
  // const watchName = watch("name");
  // const [imageSrc,setImageSrc]=useState(null);
  const [rawImage, setRawImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef(null);
  // const watchCompany = watch("company");
  // if(watchCompany){
  //   console.log("Comapny: ",register.company);
  // }
  const countries = [
  { value: "TCS", label: "Tata Consultancy Services" },
  { value: "NGI", label: "Nissan Digital India LLP" },
  { value: "AT", label: "Accubits Technologies" },
  { value: "UST", label: "UST Global" },
];

  const branches = [
  { value: "IMC", label: "Infosys Mysore Campus" },
  { value: "TPC", label: "Tidel Park Chennai" },
  { value: "IK", label: "InfoPark Kochi" },
];

//   const locations = [
//   { value: "Kochi", label: "Kochi" },
//   { value: "Kolkata", label: "Kolkata" },
//   { value: "Hyderabad", label: "Hyderabad" },
//     { value: "Bengaluru", label: "Bengaluru" },
// ]; 


  // useEffect(()=>{
  //   const PatternName = /^[a-zA-Z\s-]+$/;
  //   if(!watchName || watchName.length<3 || !PatternName.test(watchName)) return;

  //   const shortName = watchName  
  //   .trim()
  //   .split(/\s+/)          // split by spaces
  //   .map(word => word[0])  // take first letter
  //   .join("")
  //   .toUpperCase();
  //   setValue('shortName',shortName)

  // },[watchName, setValue])

// const validateImageDimension = (file, width, height) => {
//   return new Promise((resolve) => {
//     const img = new Image();
//     const url = URL.createObjectURL(file);

//     img.onload = () => {
//       URL.revokeObjectURL(url);
//       if (img.width === width && img.height === height) {
//         resolve(true);
//       } else {
//         resolve(`Image must be exactly ${width} × ${height}px`);
//       }
//     };

//     img.onerror = () => {
//       resolve("Invalid image file");
//     };

//     img.src = url;
//   });
// };

  return (
    <>
      <div className="section-header">
                {/* <span className="section-number">1</span> */}
                <h2 className="section-title">General Information</h2>
                <span className="section-subtitle">Basic 
                  {flags.locationForm && " company location "}
                  {flags.companyForm && " company "}
                  {flags.branchForm && " branch "} 
                  details</span>
              </div>
              <div className="form-grid">
                {!flags.companyForm  && <div className="branch-form-group">
                  <label className="form-label required">Company</label>
                  {/* <input 
                    type="text" 
                    className={`form-control ${errors.company ? "error" : ""}`}
                    placeholder="Select Company"
                    {...register('company', { required: "Company is required",
                      pattern:{
                        value:/^[a-zA-Z0-9\s-]*$/,
                        message:"Please enter valide company",
                      }
                 })}
                  /> */}
                  <Controller
                    name="company"
                    control={control}
                    rules={{ required: "Please select a company" }}
                    render={({ field }) => {
                    const selectedOption = countries.find(
                      (opt) => opt.value === field.value
                    );

                      return (
                        <Select
                          options={countries}
                          placeholder="Select company"
                          isSearchable
                          classNamePrefix="form-control-select"
                          className={errors.company ? "error" : ""}
                          value={selectedOption || null}                     //                   label comes from options
                          onChange={(option) => field.onChange(option.value)} //                    store ONLY value
                        />
                      );
                    }}
                  />

                  {errors.company && (
                    <span className="error-message">{errors.company.message}</span>
                  )}
                </div>}

                {(!flags.companyForm && !flags.branchForm) && <div className="branch-form-group">
                  <label className="form-label required">Branch</label>
                  <Controller
                    name="branch"
                    control={control}
                    rules={{ required: "Please select a branch" }}
                    render={({ field }) => (
                      <Select
                        options={branches}
                        placeholder="Select branch"
                        isSearchable
                        classNamePrefix="form-control-select"
                        className={errors.branch ? "error" : ""}
                        value={field.value}                // ✅ important
                        onChange={(option) => field.onChange(option)} // ✅ store full object
                      />
                    )}
                  />
                  {errors.branch && (
                    <span className="error-message">{errors.branch.message}</span>
                  )}
                </div>}

                {/* {(!flags.companyForm && !flags.branchForm) && <div className="branch-form-group">
                  <label className="form-label required">Location</label>
                  <Controller
                    name="location"
                    control={control}
                    rules={{ required: "Please select a location" }}
                    render={({ field }) => (
                      <Select
                        options={locations}
                        placeholder="Select location"
                        isSearchable
                        classNamePrefix="form-control-select"
                        className={errors.location ? "error" : ""}
                        value={field.value}                // ✅ important
                        onChange={(option) => field.onChange(option)} // ✅ store full object
                      />
                    )}
                  />
                  {errors.location && (
                    <span className="error-message">{errors.location.message}</span>
                  )}
                </div>} */}

                <div className="branch-form-group">
                  <label className="form-label required">
                    {flags.locationForm && "Location "}
                  {flags.companyForm && "Company "}
                  {flags.branchForm && "Branch "} 
                    Name</label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.name ? "error" : ""}`}
                    placeholder="Enter name"
                    {...register('name', { required: "Name is required",
                      pattern:{
                        value: /^[a-zA-Z\s-]+$/,
                        message:"Please enter valide name",
                      },
                      onChange: (e) => {
      const value = e.target.value;

      if (value.length < 3) return;

      const short = value
        .trim()
        .split(/\s+/)
        .map(w => w[0])
        .join("")
        .toUpperCase();

      setValue("shortName", short, {
        shouldDirty: true,
        shouldValidate: false
      });
      clearErrors("shortName");
    }
                    })}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name.message}</span>
                  )}
                </div>

                <div className="branch-form-group">
                  <label className="form-label required">
                      {flags.locationForm && "Location "}
                  {flags.companyForm && "Company "}
                  {flags.branchForm && "Branch "} 
                    Short Name</label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.shortName ? "error" : ""}`}
                    placeholder="eg: TCS, IBM , SAP.."
                    {...register('shortName', { required: "short name is required",
                      pattern:{
                        value:/^[A-Z0-9]*$/,
                        message:"Please enter valide name",
                      },
                      
                    })}
                  />
                  {errors.shortName && (
                    <span className="error-message">{errors.shortName.message}</span>
                  )}
                </div>
                
                {/* <div className="branch-form-group">
                  <label className="form-label required">Branch Code</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Enter branch code"
                    {...register('branchCode', { required: true })}
                  />
                  <span className="text-hint">Unique identifier for the branch</span>
                </div> */}
                
                <div className="branch-form-group">
                  <label className="form-label required">Active Date</label>
                  <input
                    type="date"
                    className={`form-control ${errors.activeDate? "error" : ""}`}
                    min={new Date().toISOString().split("T")[0]}
                    {...register("activeDate", { required: true })}
                  />
                  {errors.activeDate && (
                    <span className="error-message">Active Date is required</span>
                  )}
                </div>

                {flags.locationForm && <div className="branch-form-group">
                  <label className="form-label required">ESI Reagion</label>
                  <input
                    type="text"
                    className={`form-control ${errors.esiReagion ? "error" : ""}`}
                    placeholder='Enter ESI Reagion'
                    {...register("esiReagion", { required: "ESI Reagion is required",
                      pattern:{
                        value: /^[a-zA-Z\s-]+$/,
                        message:"Please enter valide ESI Reagion",
                      }
                    })}
                  />
                  {errors.esiReagion && (
                    <span className="error-message">{errors.esiReagion.message}</span>
                  )}
                </div>}

                {flags.companyForm && (
                <div className="branch-form-group">
  <label className="form-label required">
    Company Image (300 × 250)
  </label>
  
  <div className="image-upload-container">
    <Controller
      name="companyImage"
      control={control}
      rules={{ required: "Company image is required" }}
      render={({ field }) => (
        <div className="image-upload-wrapper">
          {/* Upload Area */}
          <div className="image-upload-area">
            <input
              type="file"
              id="company-image-upload"
              accept="image/png,image/jpeg,image/jpg"
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                // Validate file type
                if (!file.type.match('image/(png|jpeg|jpg)')) {
                  setError("companyImage", {
                    type: "manual",
                    message: "Only PNG, JPG and JPEG files are allowed"
                  });
                  return;
                }
                
                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                  setError("companyImage", {
                    type: "manual",
                    message: "File size must be less than 5MB"
                  });
                  return;
                }
                
                setRawImage(file);
                setShowCropper(true);
              }}
              className="image-input"
            />
            
          { !field.value && <label htmlFor="company-image-upload" className="upload-label">
              <div className="upload-icon">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <div className="upload-text">
                <span className="upload-title">Click to upload</span>
                <span className="upload-subtitle">PNG or JPG (Max 5MB)</span>
                <span className="upload-dimensions">Recommended: 300 × 250 pixels</span>
              </div>
            </label>}
            
            {/* Image Preview */}
            {field.value && (
              <div className="image-preview">
                <div className="preview-container">
                  {typeof field.value === 'string' ? (
                    // If it's a URL (from existing image)
                    <img 
                      src={field.value} 
                      alt="Company preview" 
                      className="preview-image"
                    />
                  ) : (
                    // If it's a File object (new upload)
                    <div className="preview-thumbnail">
                      <div>
                        <span className="file-icon">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </span>
                      </div>
                      <div className='file-name-section'>
                      <span className="file-name">
                        {field.value.name}
                      </span>
                      <span className="file-size">
                        {(field.value.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      </div>
                    </div>
                  )}
                  
                  
                </div>
                
                <div className="preview-actions">
                  <button
                    type="button"
                    className="btn-change-image"
                    onClick={() => document.getElementById('company-image-upload').click()}
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={() => {
                      field.onChange(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    aria-label="Remove image"
                  > Remove
                    {/* <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg> */}
                  </button>
                  {showCropper && (
                    <button
                      type="button"
                      className="btn-crop-image"
                      onClick={() => setShowCropper(true)}
                    >
                      Edit Crop
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Error Message */}
          {errors.companyImage && (
            <div className="error-message">
              {/* <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg> */}
              {errors.companyImage.message}
            </div>
          )}
          
          {/* Crop Modal */}
          {showCropper && (
            <ImageCropModal
              file={rawImage}
              aspectRatio={300/250}
              onClose={() => setShowCropper(false)}
              onSave={croppedFile => {
                field.onChange(croppedFile);
                setShowCropper(false);
              }}
            />
          )}
        </div>
      )}
    />
  </div>
</div>
        )}
                {/* Add more form fields as needed */}
              </div>
              
          </>
  );
}
