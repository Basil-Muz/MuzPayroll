import { useEffect, useState } from "react";

function PayrollGroupSearch({ onApply }) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    purpose: "",
    status: "ALL",
    verify: "ALL",
  });

  useEffect(() => {
    setTimeout(() => setOpen(true), 200);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(form);
  };

  return (
    <form
      className={`search-sidebar ${open ? "open" : ""}`}
      onSubmit={handleSubmit}>
      <h3>Search</h3>
     

      {/* PURPOSE */}
      <div className="search-section">
        <label>Purpose</label>
        <select
          value={form.purpose}
          onChange={(e) =>
            setForm({ ...form, purpose: e.target.value })
          }>
          <option value="">Select</option>
          <option value="minimum wages">Minimum Wages</option>
          <option value="DA Industry Group">DA Industry Group</option>
          <option value="attendance and leave">Attendance and Leave</option>
          <option value="holiday and off day">Holiday</option>
          <option value="shift group">Shift Group</option>
          <option value="salary head group">Salary Head Group</option>
          <option value="profession tax group">Profession Tax Group</option>
        </select>
      </div>

      {/* STATUS */}
      <div className="search-section">
        <label>Status</label>
        <label>
          <input
            type="radio"
            checked={form.status === "ACTIVE"}
            onChange={() =>
              setForm({ ...form, status: "ACTIVE" })
            }
          />{" "}
          Active
        </label>

        <label>
          <input
            type="radio"
            checked={form.status === "INACTIVE"}
            onChange={() =>
              setForm({ ...form, status: "INACTIVE" })
            }
          />{" "}
          Inactive
        </label>

        <label>
          <input
            type="radio"
            checked={form.status === "ALL"}
            onChange={() =>
              setForm({ ...form, status: "ALL" })
            }
          />{" "}
          All
        </label>
      </div>

      {/* VERIFICATION */}
      <div className="search-section">
        <label>
          <input
            type="radio"
            checked={form.verify === "VERIFIED"}
            onChange={() =>
              setForm({ ...form, verify: "VERIFIED" })
            }
          />{" "}
          Verified
        </label>

        <label>
          <input
            type="radio"
            checked={form.verify === "NOT_VERIFIED"}
            onChange={() =>
              setForm({ ...form, verify: "NOT_VERIFIED" })
            }
          />{" "}
          Not Verified
        </label>

        <label>
          <input
            type="radio"
            checked={form.verify === "ALL"}
            onChange={() =>
              setForm({ ...form, verify: "ALL" })
            }
          />{" "}
          All
        </label>
      </div>

      <button className="search-button" type="submit">
        Apply
      </button>
    </form>
  );
}

export default PayrollGroupSearch;
