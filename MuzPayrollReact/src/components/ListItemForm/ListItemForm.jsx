// React & Core
import { useForm, Controller } from "react-hook-form";
import React, { useEffect, useState, useRef } from "react";

// Third-party Libraries
import { toast } from "react-hot-toast";
import Select from "react-select";
import { FaSave } from "react-icons/fa";
import { BsInbox } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import DatePicker from "react-datepicker";
import { MdOutlineCancel } from "react-icons/md";
import { IoNotificationsSharp } from "react-icons/io5";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
// import { Controller } from "react-hook-form";

// Context / Custom Hooks
import { useAuth } from "../../context/AuthProvider";
import { useLoader } from "../../context/LoaderContext";
import { useSetAmendmentData } from "../../hooks/useSetAmendmentData";

// Utils / Helpers
import { ensureMinDuration } from "../../utils/loaderDelay";
import { handleApiError } from "../../utils/errorToastResolver";
import { toLocalIsoDate, formatDate } from "../../utils/dateFormater";
import { GrSun, GrMoon } from "react-icons/gr";
import { LiaAdjustSolid } from "react-icons/lia";

// Styles (always last)
import "./ListItemForm.css";

function ListItemForm({
  entity,
  toggleForm,
  data,
  saveEntity,
  fetchEntityById,
  ENTITY_FIELD_MAP,
  children,
  showCode = true,
  showName = true,
  showShortName = true
}) {

  const { showRailLoader, hideLoader } = useLoader();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
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
      authorizationStatus: 0,
      [ENTITY_FIELD_MAP.entityMst]: user.userEntityHierarchyId,
      userId: user.userMstId,
      userCode: user.userCode,
      authorizationDate: toLocalIsoDate(),
      activeDate: toLocalIsoDate(),
      [ENTITY_FIELD_MAP.activeYN]: true,
      withaffectdate: toLocalIsoDate(),
    },
  });

  const [isVarified, setIsVarified] = useState(false);

  const onSubmit = async (values) => {

    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    const startTime = Date.now();
    showRailLoader("Saving " + entity + "...");

    try {

      if (!data) {
        await saveEntity(formData, "INSERT");
      } else {
        await saveEntity(formData, "UPDATE");
      }

      toast.success(entity + " saved successfully");

    } catch (error) {

      handleApiError(error, { entity });

    } finally {

      await ensureMinDuration(startTime, 1200);
      hideLoader();
      toggleForm();

    }
  };

  return (

    <div className="modal-usergroup-form" onClick={toggleForm}>

      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}

        <div className="modal-header">
          <div className="form-title">{entity}</div>

          <div className="close" onClick={toggleForm}>
            <RxCross2 size={15} />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="main-model-content">

            {/* CODE FIELD */}

            {showCode && (
              <div className="full-content">

                <div className="form-row">
                  <label className="form-label required">
                    Group Code
                  </label>

                  <div>

                    <input
                      type="text"
                      className={`form-control ${errors[ENTITY_FIELD_MAP.code] ? "error" : ""
                        } ${isVarified ? "read-only" : ""}`}
                      placeholder="Enter Group Code"
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
            )}

            {/* NAME FIELD */}

            {showName && (
              <div className="full-content">

                <div className="form-row">

                  <label className="group-form-label required">
                    Group Name
                  </label>

                  <div>

                    <input
                      type="text"
                      className={`form-control ${errors[ENTITY_FIELD_MAP.name] ? "error" : ""
                        } ${isVarified ? "read-only" : ""}`}
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
            )}

            {/* SHORT NAME FIELD */}

            {showShortName && (
              <div className="full-content">

                <div className="form-row">

                  <label className="group-form-label required">
                    Short Name
                  </label>

                  <div>

                    <input
                      type="text"
                      className={`form-control ${errors[ENTITY_FIELD_MAP.shortName] ? "error" : ""
                        } ${isVarified ? "read-only" : ""}`}
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
            )}

            {/* CUSTOM FIELDS FROM CHILD COMPONENT */}

            {children &&
              children({
                register,
                control,
                errors,
                setValue,
                watch,
                isVarified,
              })}

            {/* ACTIVE DATE */}

            <div className="full-content">

              <div className="form-row">

                <label className="group-form-label">
                  Active Date
                </label>

                <Controller
                  name="activeDate"
                  control={control}
                  rules={{ required: "Please select a date" }}
                  render={({ field }) => (

                    <DatePicker
                      selected={field.value}
                      onChange={(date) =>
                        field.onChange(date ? formatDate(date) : null)
                      }
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      minDate={new Date()}
                    />

                  )}
                />

              </div>

            </div>

            {/* AUTHORIZATION */}

            <div className="full-content">

              <div className="form-row">

                <label className="group-form-label">
                  Authorization
                </label>

                <Controller
                  name="authorizationStatus"
                  control={control}
                  render={({ field }) => {

                    const options = [
                      { value: 0, label: "ENTRY" },
                      { value: 1, label: "VERIFIED" },
                    ];

                    return (

                      <Select
                        classNamePrefix="form-control-select"
                        options={options}
                        isSearchable={false}
                        value={options.find(
                          (opt) => opt.value === field.value
                        )}
                        onChange={(option) =>
                          field.onChange(option.value)
                        }
                      />

                    );
                  }}
                />

              </div>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                reset();
                clearErrors();
              }}
            >
              <MdOutlineCancel size={18} />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={isVarified}
            >
              <FaSave size={18} />
              <span>Save</span>
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ListItemForm;