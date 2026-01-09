import { useEffect, useState } from "react";

function ShiftGroupSearch({ onApply }) {
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
        <label>Group</label>
        <select
          value={form.purpose}
          onChange={(e) =>
            setForm({ ...form, purpose: e.target.value })
          }>
          <option value="">Select</option>
          <option value="Normal Shift">Normal Shift</option>
          <option value="Night Shift">Night Shift</option>
        </select>
      </div>

      <button className="search-button" type="submit">
        Apply
      </button>
    </form>
  );
}

export default ShiftGroupSearch;
