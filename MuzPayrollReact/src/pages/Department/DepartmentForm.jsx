import React, { useState, useEffect } from "react";
import axios from "axios";
// import "../designation/designationForm.css";

const DepartmentForm = ({ data, onClose, refresh }) => {
  const [form, setForm] = useState({
    code: "",
    name: "",
    shortName: "",
    description: "",
    activeDate: "",
    inActiveDate: "",
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (data) {
        await axios.put(
          `http://localhost:8087/department/${form.code}`,
          form
        );
      } else {
        await axios.post("http://localhost:8087/department", form);
      }
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h3>{data ? "Edit Department" : "New Department"}</h3>

        <input
          name="code"
          placeholder="Code"
          value={form.code}
          onChange={handleChange}
          disabled={!!data}
        />

        <input
          name="name"
          placeholder="Department Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="shortName"
          placeholder="Short Name"
          value={form.shortName}
          onChange={handleChange}
        />

        <input
          type="date"
          name="activeDate"
          value={form.activeDate}
          onChange={handleChange}
        />

        <input
          type="date"
          name="inActiveDate"
          value={form.inActiveDate || ""}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <div className="form-actions">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentForm;