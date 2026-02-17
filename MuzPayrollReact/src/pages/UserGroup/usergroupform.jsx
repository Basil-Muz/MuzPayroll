import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import "./usergroupform.css";
import { FaSave } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { IoNotificationsSharp } from "react-icons/io5";
// import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
import Loading from "../../components/Loaders/Loading";
import { saveUserGroup } from "../../services/user.service";
import { handleApiError } from "../../utils/errorToastResolver";
import { useAuth } from "../../context/AuthProvider";

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

  const toLocalIsoDate = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    // trigger,
    setError,
    // clearErrors,
    // setValue,
    reset,
    // setFocus,
    // watch,
    // getValues,
    // control,
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
    },
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

  //   useEffect(() => {
  //      axios.get("http://localhost:9082/getAllSalaryHead")
  //         .then((res) => setSalaryHead(res.data))
  //         .catch(console.error);
  // }, []);

  useEffect(() => {
    if (data) {
      reset({
        code: data.GroupCode,
        name: data.GroupName,
        shortName: data.ShortName,
        description: data.Description,
        activeDate: data.ActiveDate,
        authorization: data.Authorization,
      });
      setIsVarified(data.Authorization === "VERIFIED");
    }
  }, [data, reset]);

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
    console.log("save ciecked", values);
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    try {
      const response = await saveUserGroup(formData);
      console.log(response);
    } catch (error) {
      console.error("Error updating advance type:", error);
      handleApiError(error, {
        entity: "User group",
      });
    }
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
    // Handle submit
    toggleForm();
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
          <div className="h3">User Group</div>
          <div className="header-icons">
            <div
              className="notifications"
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
                    <p className="no-msg">no notifications</p>
                  )}
                </div>
              )}
            </div>
            <div onClick={toggleForm} className="close">
              <RxCross2 size={15} />
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="main-model-content">
            <div className="full-content">
              {/* Code */}
              <div className="group-form-field">
                <label className="group-form-label required">Group Code</label>
                <input
                  type="text"
                  className={`group-form-input ${errors.UgmCode ? "error" : ""} ${
                    isVarified ? "read-only" : ""
                  }`}
                  placeholder="Enter Group Code"
                  disabled={isVarified}
                  {...register("UgmCode", {
                    required: "Group Code is required",
                  })}
                />
                {errors.UgmCode && (
                  <span className="group-form-error">
                    {errors.UgmCode.message}
                  </span>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="full-content">
              <div className="group-form-field">
                <label className="group-form-label required">Group Name</label>
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
                  <span className="group-form-error">
                    {errors.UgmName.message}
                  </span>
                )}
              </div>
            </div>

            {/* Short Name */}
            <div className="full-content">
              <div className="group-form-field">
                <label className="group-form-label required">Short Name</label>
                <input
                  type="text"
                  className={`group-form-input ${errors.UgmShortName ? "error" : ""} ${
                    isVarified ? "read-only" : ""
                  }`}
                  placeholder="Enter Short Name"
                  disabled={isVarified}
                  {...register("UgmShortName", {
                    required: "Short Name is required",
                  })}
                />
                {errors.UgmShortName && (
                  <span className="group-form-error">
                    {errors.UgmShortName.message}
                  </span>
                )}
              </div>
            </div>
            {/* Description */}
            <div className="full-content description">
              <div className="group-form-field group-form-textarea">
                <label className="group-form-label required">Description</label>
                <textarea
                  className={`group-form-input ${errors.UgmDesc ? "error" : ""} ${
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
                  <span className="group-form-error">
                    {errors.UgmDesc.message}
                  </span>
                )}
              </div>
            </div>

            {/* Active Date */}
            <div className="full-content">
              <div className="group-form-field">
                <label className="group-form-label">Active Date</label>
                <input
                  type="date"
                  className={`group-form-input ${isVarified ? "read-only" : ""}`}
                  disabled={isVarified}
                  {...register("activeDate")}
                />
              </div>
            </div>

            {/* Authorization */}
            <div className="full-content">
              <div className="group-form-field">
                <label className="group-form-label">Authorization</label>
                <select
                  className={`group-form-input ${isVarified ? "read-only" : ""}`}
                  disabled={isVarified}
                  {...register("authorizationStatus")}
                >
                  {isVarified && (
                    <option value="1">VERIFIED : {data?.date}</option>
                  )}
                  {!isVarified && (
                    <>
                      <option value="0">ENTRY : {data?.date || ""}</option>
                      <option value="1">VERIFIED</option>
                    </>
                  )}
                </select>
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
