import { useState } from "react";

function StatusSearch({ isOpen, onApply }) {
  const [form, setForm] = useState({
    purpose: "",
    status: "ALL",
    verify: "ALL",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(form);
  };

  return (
    <form
      className={`search-sidebar1 ${isOpen ? "open" : "close"}`}
      onSubmit={handleSubmit}
    >
      <h3>Search</h3>

      <div className="search-section">
        <label>Group</label>
        <select
          value={form.purpose}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
        >
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

export default StatusSearch;
