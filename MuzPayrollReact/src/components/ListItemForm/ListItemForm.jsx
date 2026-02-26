// React & Core
import { useForm, Controller } from "react-hook-form";
import React, { useEffect, useState, useRef } from "react";

// Third-party Libraries
import Select from "react-select";
import { FaSave } from "react-icons/fa";
import { BsInbox } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import DatePicker from "react-datepicker";
import { MdOutlineCancel } from "react-icons/md";
import { IoNotificationsSharp } from "react-icons/io5";

// Context / Custom Hooks
import { useAuth } from "../../context/AuthProvider";
import { useLoader } from "../../context/LoaderContext";
import { useSetAmendmentData } from "../../hooks/useSetAmendmentData";

// Utils / Helpers
import { ensureMinDuration } from "../../utils/loaderDelay";
import { handleApiError } from "../../utils/errorToastResolver";
import { toLocalIsoDate, formatDate } from "../../utils/dateFormater";

// Styles (always last)
import "./ListItemForm.css";

function ListItemForm({
  entity,
  toggleForm,
  data,
  saveEntity,
  fetchEntityById,
  ENTITY_FIELD_MAP,
}) {
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
    // setError,
    clearErrors,
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
      [ENTITY_FIELD_MAP.activeYN]: true,
      withaffectdate: toLocalIsoDate(),
    },
  });
  const { setSeconderyFormData } = useSetAmendmentData({
    setValue,
    fieldMap: ENTITY_FIELD_MAP,
  });

  //   const [errors, setErrors] = useState({});
  const [notOpen, setNotOpen] = useState(false);

  const codeInputRef = useRef(null);

  const notifTimer = useRef(null);

  const [isVarified, setIsVarified] = useState(false);

  useEffect(() => {
    if (!flag) {
      codeInputRef.current?.focus();
    }
    // console.log("User dfhgdfgh",user)
  }, [flag]);

  useEffect(() => {
    setFocus("Code");
  }, []);

  const fetchFormDataById = async (data) => {
    const startTime = Date.now();
    // show loader
    showRailLoader("Fetching available " + entity + "..");
    try {
      console.log("Selected data",data)
      const response = await fetchEntityById(data);
      console.log("Data by id", response);
      setSeconderyFormData(response.data);
      if (response.data.authorizationStatus === true) setIsVarified(true);
    } catch (error) {
      console.error("Error fetching " + entity, error);
      handleApiError(error, {
        entity: entity,
      });
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
    }
  };

  useEffect(() => {
    // console.log("Data from parent", data);
    if (data) fetchFormDataById(data);
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

  //   const handleBlur = (e) => {
  //     const { name } = e.target;
  //     setTouched((prev) => ({ ...prev, [name]: true }));
  //     validate();
  //   };

  const onSubmit = async (values) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    const startTime = Date.now();
    // show loader
    showRailLoader("Saving " + entity + "…");
    try {
      if (!data)
        //  For fresh insert
        await saveEntity(formData, "INSERT");
      else await saveEntity(formData, "UPDATE"); //for edit

      // console.log("Save response",response);
    } catch (error) {
      console.error("Error updating " + entity + ":", error);
      handleApiError(error, {
        entity: entity,
      });
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
      toggleForm();
    }
  };

  const handleClear = () => {
    if (!data) {
      reset();

      clearErrors();
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
          <div className="form-title">{entity}</div>

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
                    className={`form-control ${errors[ENTITY_FIELD_MAP.code] ? "error" : ""} ${
                      isVarified ? "read-only" : ""
                    }`}
                    placeholder={`Enter Group Code ${ENTITY_FIELD_MAP.code}`}
                    disabled={isVarified}
                    {...register(ENTITY_FIELD_MAP.code, {
                      required: "Group Code is required",
                    })}
                  />
                  {errors[ENTITY_FIELD_MAP.code] && (
                    <span className="error-message">
                      {errors[ENTITY_FIELD_MAP.code].message}
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
                    className={`form-control ${errors[ENTITY_FIELD_MAP.name] ? "error" : ""} ${
                      isVarified ? "read-only" : ""
                    }`}
                    placeholder="Enter Group Name"
                    disabled={isVarified}
                    {...register(ENTITY_FIELD_MAP.name, {
                      required: "Group Name is required",
                    })}
                  />
                  {errors[ENTITY_FIELD_MAP.name] && (
                    <span className="error-message">
                      {errors[ENTITY_FIELD_MAP.name].message}
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
                    className={`form-control ${errors[ENTITY_FIELD_MAP.shortName] ? "error" : ""} ${
                      isVarified ? "read-only" : ""
                    }`}
                    placeholder="Enter Short Name"
                    disabled={isVarified}
                    {...register(ENTITY_FIELD_MAP.shortName, {
                      required: "Short Name is required",
                    })}
                  />
                  {errors[ENTITY_FIELD_MAP.shortName] && (
                    <span className="error-message">
                      {errors[ENTITY_FIELD_MAP.shortName].message}
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
                    className={`form-control ${errors[ENTITY_FIELD_MAP.desc] ? "error" : ""} ${
                      isVarified ? "read-only" : ""
                    }`}
                    placeholder="Enter Description"
                    rows={3}
                    disabled={isVarified}
                    {...register(ENTITY_FIELD_MAP.desc, {
                      required: "Description is required",
                    })}
                  />
                  {errors[ENTITY_FIELD_MAP.desc] && (
                    <span className="error-message">
                      {errors[ENTITY_FIELD_MAP.desc].message}
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
    </div>
  );
}

export default ListItemForm;
