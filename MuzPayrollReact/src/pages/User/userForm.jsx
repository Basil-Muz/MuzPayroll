import React from "react";
import "./userForm.css";

import { FaSave } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

import { useForm, Controller } from "react-hook-form";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UserForm = ({ data, onClose }) => {

    const {
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            activeDate: new Date()
        }
    });
    return (
        <div className="user-modal-overlay">

            <div className="user-modal">

                {/* HEADER */}

                <div className="user-modal-header">
                    <h3>User</h3>

                    <button className="close-btn" onClick={onClose}>
                        <RxCross2 />
                    </button>
                </div>

                {/* BODY */}

                <div className="user-modal-body">

                    {/* LEFT FORM */}

                    <div className="user-form-left">

                        <div className="form-row">
                            <label>User Code</label>
                            <div className="code-group">
                                <input type="text" />
                                <span>@NRMS</span>
                            </div>
                        </div>

                        <div className="form-row">
                            <label>User Name</label>
                            <input type="text" />
                        </div>

                        <div className="form-row">
                            <label>User Type</label>
                            <select>
                                <option>Select Type</option>
                                <option>Admin</option>
                                <option>User</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <label>Mobile No</label>
                            <input type="text" />
                        </div>

                        <div className="form-row">
                            <label>Email</label>
                            <input type="email" />
                        </div>

                        <div className="form-row">
                            <label>Password</label>
                            <input type="password" />
                        </div>

                        <div className="form-row checkbox-row">
                            <label>Change password on next login</label>
                            <div className="checkbox-field">
                                <input type="checkbox" />
                            </div>
                        </div>

                        {/* Active Date */}

                        <div className="form-row">
                            <label>Active Date</label>

                            <Controller
                                name="activeDate"
                                control={control}
                                rules={{ required: "Please select a date" }}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholderText="Select date"
                                        className={`form-control ${errors.activeDate ? "error" : ""
                                            }`}
                                        selected={field.value}
                                        onChange={(date) => field.onChange(date)}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                )}
                            />
                        </div>

                        <div className="form-row">
                            <label>Authorization</label>
                            <select>
                                <option>ENTRY</option>
                                <option>VERIFIED</option>
                            </select>
                        </div>

                    </div>

                    {/* RIGHT IMAGE */}

                    <div className="user-form-right">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            alt="user"
                        />
                    </div>

                </div>

                {/* FOOTER */}

                <div className="user-modal-footer">

                    <button className="cancel-btn" onClick={onClose}>
                        <RxCross2 /> Cancel
                    </button>

                    <button className="save-btn">
                        <FaSave /> Save
                    </button>

                </div>

            </div>

        </div>
    );
};

export default UserForm;