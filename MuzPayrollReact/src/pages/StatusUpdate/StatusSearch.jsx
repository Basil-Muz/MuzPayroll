import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import axios from "axios";

const StatusSearch = forwardRef(({ isOpen, onApply, hasData }, ref) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      option: "",
      status: "Active",
    },
  });

  const selectRef = useRef(null);
  const [options, setOptions] = useState([]);

  const mockOptions = [
    { value: "OPT001", label: "Option One" },
    { value: "OPT002", label: "Option Two" },
  ];

  useEffect(() => {
    setOptions(mockOptions);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => selectRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useImperativeHandle(ref, () => ({
    clearSearch() {
      reset({ option: "", status: "Active" });
    },
    refreshSearch() {},
  }));

  /* ===== APPLY ===== */
  const onSubmit = async (filters) => {
    try {
      const res = await axios.get(
        filters.status === "Active"
          ? "http://localhost:8087/company/activecompanylist"
          : "http://localhost:8087/company/inactivecompanylist",
        { params: filters },
      );

      onApply(res.data, filters.status);
    } catch (err) {
      console.error(err);

      const mockData = [
        {
          code: "OPT001",
          name: "Option One",
          activeDate: "2024-01-01",
          inactiveDate: "",
        },
        {
          code: "OPT002",
          name: "Option Two",
          activeDate: "2023-05-01",
          inactiveDate: "2024-12-31",
        },
      ];

      onApply(mockData, filters.status);
    }
  };

  return (
    <form
      className={`search-sidebar1 ${isOpen ? "open" : "close"}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3>Search</h3>

      {/* OPTION */}
      <Controller
        name="option"
        control={control}
        render={({ field }) => (
          <Select
            ref={selectRef}
            options={options}
            placeholder="Select option"
            value={options.find((o) => o.value === field.value) || null}
            onChange={(o) => field.onChange(o.value)}
            isDisabled={hasData}
          />
        )}
      />

      {/* STATUS */}
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <div className="search-radio">
            <label>
              <input
                type="radio"
                checked={field.value === "Active"}
                onChange={() => field.onChange("Active")}
                disabled={hasData}
              />
              Active
            </label>
            <label>
              <input
                type="radio"
                checked={field.value === "Inactive"}
                onChange={() => field.onChange("Inactive")}
                disabled={hasData}
              />
              Inactive
            </label>
          </div>
        )}
      />

      <button type="submit" className="btn btn-primary" disabled={hasData}>
        Apply
      </button>
    </form>
  );
});

export default StatusSearch;
