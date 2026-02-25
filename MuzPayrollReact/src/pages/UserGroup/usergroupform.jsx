import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";

import "./usergroupform.css";

import { FaSave } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { IoNotificationsSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { BsInbox } from "react-icons/bs";

import Loading from "../../components/Loaders/Loading";

import {
  saveUserGroup,
  getUserGroupById,
  getUserGroupAmendById,
} from "../../services/usergroup.service";

// Utils
import { ensureMinDuration } from "../../utils/loaderDelay";
import { handleApiError } from "../../utils/errorToastResolver";
import {
  toDateString,
  toLocalIsoDate,
  formatDate,
} from "../../utils/dateFormater";

// Context / hooks
import { useSetAmendmentData } from "../../hooks/useSetAmendmentData";

import { useLoader } from "../../context/LoaderContext";
import { useAuth } from "../../context/AuthProvider";

import Select from "react-select";
import DatePicker from "react-datepicker";
import { USER_GROUP_FIELD_MAP } from "../../constants/userGroupMap";

// import axios from "axios";

function UserGroupForm({ toggleForm, data }) {
  //   const [position, setPosition] = useState({ x: 355, y: 43 });
  //   const dragging = useRef(false);
  //   const offset = useRef({ x: 0, y: 0 });
  const [flag, setFlag] = useState(false); // new state for flag from parent
  const [notifications, setNotifications] = useState([
    // { id: 1, msg: "Payroll processed successfully", status: true },
    // { id: 2, msg: "New policy update available", status: false },
    // { id: 3, msg: "System maintenance scheduled", status: true },
  ]);
  const { showRailLoader, hideLoader } = useLoader();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    // trigger,
    setError,
    // clearErrors,
    setValue,
    reset,
    setFocus,
    // watch,
    // getValues,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      authorizationStatus: 0,
      //   mode:"INSERT",
      entityMst: user.userEntityHierarchyId,
      userCode: user.userCode,
      authorizationDate: toLocalIsoDate(),
      activeDate: toLocalIsoDate(),
      UgmActiveYN: true,
      withaffectdate: toLocalIsoDate(),
    },
  });
  const { setAmendmentData } = useSetAmendmentData({
    setValue,
    fieldMap: USER_GROUP_FIELD_MAP,
  });

  //   const [errors, setErrors] = useState({});
  const [notOpen, setNotOpen] = useState(false);

  const codeInputRef = useRef(null);

  const notifTimer = useRef(null);
  //   const [form, setForm] = useState({
  //     GroupCode: "",
  //     GroupName: "",
  //     ShortName: "",
  //     Description: "",
  //     ActiveDate: new Date().toISOString().split("T")[0], // sets today's date
  // defaultValues: {
  //   authorization: "ENTRY",

  // }

  //   });
  // const [isOpenForm, setIsOpenForm] = useState(true);
  const [isVarified, setIsVarified] = useState(false);
  //   const [salaryHeads, setSalaryHead] = useState([]);

  useEffect(() => {
    if (!flag) {
      codeInputRef.current?.focus();
    }
    // console.log("User dfhgdfgh",user)
  }, [flag]);

  useEffect(() => {
    setFocus("UgmCode");
  }, []);

  const fetchFormDataById = async (data) => {
    const startTime = Date.now();
    // show loader
    showRailLoader("Fetching available user group…");
    try {
      const response = await getUserGroupById(data);
      console.log("Data by id", response);
      setAmendmentData(response.data);
      if (response.data.authorizationStatus === true) setIsVarified(true);
    } catch (error) {
      console.error("Error fetching user group:", error);
      handleApiError(error, {
        entity: "User group",
      });
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
    }
  };

  useEffect(() => {
    // console.log("Data from parent", data);

    if (data) fetchFormDataById(data);
    // if (data) {
    //   reset({
    //     code: data.GroupCode,
    //     name: data.GroupName,
    //     shortName: data.ShortName,
    //     description: data.Description,
    //     activeDate: data.ActiveDate
    //       ? new Date(data.ActiveDate + "T00:00:00")
    //       : null,
    //     authorization: data.Authorization,
    //   });
    //   setIsVarified(data.Authorization === "VERIFIED");
    // }
  }, [data]);

  const handleNotifEnter = () => {
    clearTimeout(notifTimer.current);
    setNotOpen(true);
  };

  const handleNotifLeave = () => {
    notifTimer.current = setTimeout(() => {
      setNotOpen(false);
    }, 300); // delay before hiding
  };

  //   const handleMouseDown = (e) => {
  //     dragging.current = true;
  //     offset.current = {
  //       x: e.clientX - position.x,
  //       y: e.clientY - position.y,
  //     };
  //   };

  //   const handleMouseMove = (e) => {
  //     if (dragging.current) {
  //       setPosition({
  //         x: e.clientX - offset.current.x,
  //         y: e.clientY - offset.current.y,
  //       });
  //     }
  //   };
  //   const handleMouseUp = () => {
  //     dragging.current = false;
  //   };

  //   const validateEach = (name, value) => {
  //     const newErrors = {};
  //     if (value.trim() === "") {
  //       newErrors[name] =
  //         `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
  //     } else {
  //       if (name === "GroupCode") {
  //         if (/\s/.test(value)) {
  //           newErrors.GroupCode = "Group Code must not contain spaces.";
  //         } else if (/[a-z]/.test(value)) {
  //           newErrors.GroupCode = "Lowercase letters are not allowed.";
  //         }
  //       }
  //     }
  //     setError(newErrors);
  //     return Object.keys(newErrors).length === 0;
  //   };
  //   const validate = (form) => {
  //     const newErrors = {};

  //     if (!form.GroupCode) {
  //       newErrors.GroupCode = "Group Code is required.";
  //     } else if (/\s/.test(form.GroupCode)) {
  //       newErrors.GroupCode = "Group Code must not contain spaces.";
  //     } else if (/[a-z]/.test(form.GroupCode)) {
  //       newErrors.GroupCode = "Lowercase letters are not allowed.";
  //     }
  //     if (!form.GroupName) newErrors.GroupName = "Group Name is required.";
  //     if (!form.ShortName) newErrors.ShortName = "Short Name is required.";
  //     if (!form.Description) newErrors.Description = "Description is required.";
  //     // alert(JSON.stringify(newErrors));
  //     setError(newErrors);
  //     return Object.keys(newErrors).length === 0;
  //   };

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     const updatedForm = { ...form, [name]: value };

  //     setForm(updatedForm);

  //     validateEach(name, value); // Pass the latest values
  //   };

  //   const handleBlur = (e) => {
  //     const { name } = e.target;
  //     setTouched((prev) => ({ ...prev, [name]: true }));
  //     validate();
  //   };

  const onSubmit = async (values) => {
    // e.preventDefault();
    // console.log("save ciecked", values.activeDate);
    // const payload = {
    //   ...values,
    //   activeDate: toDateString(values.activeDate),
    // };
    // comsole.log("sdfsdfsdf")
    // console.log("Datas", payload);
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    const startTime = Date.now();
    // show loader
    showRailLoader("Saving user groups…");
    try {
      if (!data)
        //  For fresh insert
        await saveUserGroup(formData, "INSERT");
      else await saveUserGroup(formData, "UPDATE"); //for edit

      // console.log("Save response",response);
    } catch (error) {
      console.error("Error updating advance type:", error);
      handleApiError(error, {
        entity: "User group",
      });
    } finally {
      //   alert(`Form Updation successfully!`);

      //   } else {
      //     axios.post("http://localhost:9082/saveAdvanceType", {
      //       code: form.code,
      //       name: form.name,
      //       date: form.date,
      //       shortName: form.shortName,
      //       recoveryHead: form.recoveryHead,
      //       description: form.description,
      //       activeDate: form.activeDate,
      //       status: form.status, // Or just boolean true/false
      //     });

      //     alert("Form insertion successfully!");
      //   }
      await ensureMinDuration(startTime, 1200);
      hideLoader();
      toggleForm();
    }
  };

  const handleClear = () => {
    if (!data) {
      reset();

      setError();
    } else {
      setFlag(true);
      const timer = setTimeout(() => {
        setFlag(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  return (
    <div
      className="modal-usergroup-form"
      onClick={toggleForm} // ⬅ click outside closes
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // ⬅ prevent closing when clicking inside
        style={{
          // left: position.x,
          // top: position.y,

          userSelect: "none",
        }}
      >
        <div
          className="modal-header"
          //  onMouseDown={handleMouseDown}
          //   onMouseMove={handleMouseMove}
          //   onMouseUp={handleMouseUp}
          //   onMouseLeave={handleMouseUp}
          //   style={ {cursor: dragging.current ? 'grabbing' : 'grab'}}
        >
          {/* <div className={`slide-container ${showSearch ? 'show' : 'hide'}`}>
        
      <Search/>
        
        </div> */}
          <div className="form-title">User Group</div>

          <div className="header-icons">
            <div
              className="usergroup-notifications"
              onMouseEnter={handleNotifEnter}
              onMouseLeave={handleNotifLeave}
            >
              <IoNotificationsSharp size={19} style={{ cursor: "pointer" }} />
              {notifications.length != 0 && (
                <div className="error-msgs">{notifications.length}</div>
              )}
              {notOpen && (
                <div className="notifications-dropdown">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <p
                        className="error-msg"
                        key={notification.id}
                        style={{ color: "black" }}
                      >
                        {notification.msg}{" "}
                        <RxCross2
                          size={20}
                          color="red"
                          onClick={() => removeNotification(notification.id)}
                        />
                      </p>
                    ))
                  ) : (
                    <div className="no-notifications">
                      <BsInbox size={48} />
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div onClick={toggleForm} title="Close" className="close">
              <RxCross2 size={15} />
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="main-model-content">
            <div className="full-content">
              {/* Code */}
              <div className="form-row">
                <label className="form-label required">Group Code</label>
                <div>
                  <input
                    type="text"
                    className={`form-control ${errors.UgmCode ? "error" : ""} ${
                      isVarified ? "read-only" : ""
                    }`}
                    placeholder="Enter Group Code"
                    disabled={isVarified}
                    {...register("UgmCode", {
                      required: "Group Code is required",
                    })}
                  />
                  {errors.UgmCode && (
                    <span className="error-message">
                      {errors.UgmCode.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="full-content">
              <div className="form-row">
                <label className="group-form-label required">Group Name</label>
                <div>
                  <input
                    type="text"
                    className={`form-control ${errors.UgmName ? "error" : ""} ${
                      isVarified ? "read-only" : ""
                    }`}
                    placeholder="Enter Group Name"
                    disabled={isVarified}
                    {...register("UgmName", {
                      required: "Group Name is required",
                    })}
                  />
                  {errors.UgmName && (
                    <span className="error-message">
                      {errors.UgmName.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Short Name */}
            <div className="full-content">
              <div className="form-row">
                <label className="group-form-label required">Short Name</label>
                <div>
                  <input
                    type="text"
                    className={`form-control ${errors.UgmShortName ? "error" : ""} ${
                      isVarified ? "read-only" : ""
                    }`}
                    placeholder="Enter Short Name"
                    disabled={isVarified}
                    {...register("UgmShortName", {
                      required: "Short Name is required",
                    })}
                  />
                  {errors.UgmShortName && (
                    <span className="error-message">
                      {errors.UgmShortName.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="full-content description">
              <div className="form-row group-form-textarea">
                <label className="group-form-label required">Description</label>
                <div>
                  <textarea
                    className={`form-control ${errors.UgmDesc ? "error" : ""} ${
                      isVarified ? "read-only" : ""
                    }`}
                    placeholder="Enter Description"
                    rows={3}
                    disabled={isVarified}
                    {...register("UgmDesc", {
                      required: "Description is required",
                    })}
                  />
                  {errors.UgmDesc && (
                    <span className="error-message">
                      {errors.UgmDesc.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Active Date */}
            <div className="full-content">
              <div className="form-row">
                <label className="group-form-label">Active Date</label>
                <Controller
                  name="activeDate" // feild name
                  control={control}
                  rules={{ required: "Please select a date" }}
                  render={({ field }) => {
                    // Convert the field value to a Date object for the picker
                    // const selectedDate = field.value
                    //   ? formatDate(field.value)
                    //   : null;

                    // console.log("Field value:", field.value);
                    // console.log("Selected date for picker:", selectedDate);
                    return (
                      <DatePicker
                        placeholderText="Select date"
                        disabled={isVarified}
                        className={`form-control datepicker-input ${
                          errors.activeDate ? "error" : ""
                        }`}
                        popperPlacement="bottom-start"
                        popperContainer={({ children }) => (
                          <div style={{ zIndex: 3000 }}>{children}</div>
                        )}
                        selected={field.value}
                        onChange={(date) => {
                          console.log("DatePicker onChange:", date);
                          // Convert Date object back to string for storage
                          field.onChange(date ? formatDate(date) : null);
                        }}
                        dateFormat="dd/MM/yyyy"
                        // minDate={new Date()}
                        // showMonthDropdown
                        // showYearDropdown
                        dropdownMode="select"
                        calendarClassName="custom-datepicker"
                        popperClassName="custom-datepicker-popper"
                      />
                    );
                  }}
                />
              </div>
            </div>

            {/* Authorization */}
            <div className="full-content">
              <div className="form-row">
                <label className="group-form-label">Authorization</label>
                <Controller
                  name="authorizationStatus"
                  control={control}
                  rules={{ required: "Please select authorization" }}
                  render={({ field }) => {
                    // Build options dynamically
                    const options = isVarified
                      ? [
                          {
                            value: 1,
                            label: `VERIFIED : ${data?.date || ""}`,
                          },
                        ]
                      : [
                          {
                            value: 0,
                            label: `ENTRY : ${data?.date || ""}`,
                          },
                          {
                            value: 1,
                            label: "VERIFIED",
                          },
                        ];

                    return (
                      <Select
                        options={options}
                        isSearchable={false}
                        isDisabled={isVarified}
                        classNamePrefix="form-control-select"
                        className={errors.authorizationStatus ? "error" : ""}
                        value={options.find((opt) => opt.value === field.value)}
                        onChange={(option) => field.onChange(option.value)}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 3000 }),
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              className="save-btn"
              disabled={isVarified}
              style={{ outline: "none" }}
              // onClick={handleSubmit}
            >
              <FaSave size={20} />
            </button>
            <button
              type="button"
              className="cancel-btn"
              disabled={isVarified}
              style={{ outline: "none" }}
              onClick={handleClear}
            >
              <MdOutlineCancel size={20} />
            </button>
          </div>
        </form>
      </div>

      {flag && <Loading />}
    </div>
  );
}

export default UserGroupForm;
