// React & Core
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

// Third-party Libraries
import { toast } from "react-hot-toast";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { FaSave } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import "react-datepicker/dist/react-datepicker.css";

// Context / Utils
import { useLoader } from "../../context/LoaderContext";
import { ensureMinDuration } from "../../utils/loaderDelay";
import { handleApiError } from "../../utils/errorToastResolver";
import { formatDate, toLocalIsoDate } from "../../utils/dateFormater";

// Styles
import "./ListItemForm.css";

function ListItemForm({
  entity,
  toggleForm,
  data,
  saveEntity,
  fetchEntityById,
  ENTITY_FIELD_MAP,
  children,
}) {
  const { showRailLoader, hideLoader } = useLoader();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      activeDate: new Date(),
      authorizationStatus: 0,
      withaffectdate: new Date(),
      activeYN: true,
    },
  });

  const [mode, setMode] = useState("INSERT");
  const [isVarified, setIsVarified] = useState(false);

  // Load full entity data if editing
  useEffect(() => {
    if (!data?.id) {
      setMode("INSERT");
      reset({
        activeDate: new Date(),
        authorizationStatus: 0,
        activeYN: true,
      });
      return;
    }

    const loadData = async () => {
      const startTime = Date.now();
      showRailLoader("Loading " + entity + " details...");
      try {
        let entityData = data;

        // If only id passed, fetch from API
        if (!data.code && fetchEntityById) {
          const res = await fetchEntityById(data.id);
          entityData = res.data;
        }

        reset({
          ...entityData,

          authorizationStatus:
            entityData.authorizationStatus === true ||
            entityData.authorizationStatus === 1
              ? 1
              : 0,

          activeDate: entityData.activeDate
            ? new Date(entityData.activeDate)
            : null,
        });

        setMode("UPDATE");
        setIsVarified(
          entityData.authorizationStatus === true ||
            entityData.authorizationStatus === 1,
        );
      } catch (error) {
        handleApiError(error, { entity });
      } finally {
        await ensureMinDuration(startTime, 800);
        hideLoader();
      }
    };

    loadData();
  }, [data]);

  // Submit handler
  const onSubmit = async (values) => {
    console.log("formData on save:", values);
    console.log("AUTH VALUE:", values.authorizationStatus);
    console.log("TYPE:", typeof values.authorizationStatus);
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      const value = values[key];

      if (value === null || value === undefined) return;
      if (value === "null") return;

      if (key === "authorizationStatus") {
        formData.append(key, Number(value)); // always 0 / 1
      } else if (key === "activeDate") {
        const formattedDate = new Date(value).toISOString().split("T")[0];
        formData.append(key, formattedDate);
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "true" : "false");
      } else {
        formData.append(key, value);
      }
    });

    const startTime = Date.now();
    showRailLoader("Saving " + entity + "...");
    try {
      const res = await saveEntity(formData, mode);

      if (res.data.success) {
        toast.success(entity + " saved successfully");
        toggleForm();
      } else {
        res.data.errors?.forEach((err) => toast.error(err));
      }
    } catch (error) {
      handleApiError(error, { entity });
    } finally {
      await ensureMinDuration(startTime, 1200);
      hideLoader();
    }
  };

  const handleClear = () => {
    reset();
    clearErrors();
  };

  return (
    <div className="modal-usergroup-form" onClick={toggleForm}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <div className="form-title">{entity}</div>
          <div className="close" onClick={toggleForm}>
            <RxCross2 size={15} />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("id")} />

          <div className="main-model-content">
            {/* CHILDREN FIELDS */}
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
                <label className="form-label">Active Date</label>
                <Controller
                  name="activeDate"
                  control={control}
                  rules={{ required: "Please select a date" }}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      className="form-control datepicker-input"
                      minDate={new Date()}
                      calendarClassName="custom-datepicker"
                      popperClassName="custom-datepicker-popper"
                    />
                  )}
                />
              </div>
            </div>

            {/* AUTHORIZATION STATUS */}
            <div className="full-content">
              <div className="form-row">
                <label className="form-label">Authorization</label>
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
                        value={options.find((opt) => opt.value === field.value)}
                        onChange={(option) => field.onChange(option.value)}
                        isDisabled={isVarified}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={handleClear}>
              <MdOutlineCancel size={18} />
              <span>Cancel</span>
            </button>

            <button type="submit" className="save-btn" disabled={isVarified}>
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
