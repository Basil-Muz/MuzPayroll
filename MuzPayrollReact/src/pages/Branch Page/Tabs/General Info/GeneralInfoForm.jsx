import {useEffect} from 'react';
import Select from "react-select";
import { Controller } from "react-hook-form";
import FloatingActionBar from '../../../../components/demo_buttons/FloatingActionBar';

export default function GeneralInfoForm({
  register,
  errors,
  watch,
  setValue,
  control,
  flags,
  // setError,
  // disabled = {false},
  // requiredMap = {},
}) {
  const watchName = watch("name");
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

  useEffect(()=>{
    const PatternName = /^[a-zA-Z\s-]+$/;
    if(!watchName || watchName.length<3 || !PatternName.test(watchName)) return;

    const shortName = watchName  
    .trim()
    .split(/\s+/)          // split by spaces
    .map(word => word[0])  // take first letter
    .join("")
    .toUpperCase();
    setValue('shortName',shortName)

  },[watchName, setValue])

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
                    render={({ field }) => (
                      <Select
                        options={countries}
                        placeholder="Select country"
                        isSearchable
                        classNamePrefix="form-control-select"
                        className={errors.company ? "error" : ""}
                        value={field.value}                // ✅ important
                        onChange={(option) => field.onChange(option)} // ✅ store full object
                      />
                    )}
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
                      }
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
                {/* Add more form fields as needed */}
              </div>
              
          </>
  );
}
