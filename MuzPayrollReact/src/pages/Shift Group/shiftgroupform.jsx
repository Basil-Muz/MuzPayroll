import React, { useEffect, useState,useRef } from 'react';
import './shiftgroupform.css';
import { FaSave} from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { IoNotificationsSharp } from "react-icons/io5";
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
import { GrMoon } from "react-icons/gr";
import { GrSun } from "react-icons/gr";
import { LiaAdjustSolid } from "react-icons/lia";
import Loading from '../../components/Loading/Loading';
function ShiftGroupForm({ toggleForm,data }) {

    const [position, setPosition] = useState({ x: 355, y: 43 });
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });
    const [flag, setFlag] = useState(false); // new state for flag from parent
    const [notifications, setNotifications] = useState([
  // { id: 1, msg: "Payroll processed successfully", status: true },
  // { id: 2, msg: "New policy update available", status: false },
  // { id: 3, msg: "System maintenance scheduled", status: true },
    ]);

    const [errors, setErrors] = useState({});
    const [notOpen, setNotOpen] = useState(false);

    const codeInputRef = useRef(null);

    const notifTimer = useRef(null);
const [form, setForm] = useState({
    code: "",
    name: "",
    shortName: "",
    TimeFrom: "",
    TimeTo:"",
    ShiftType:"",
    activeDate: new Date().toISOString().split('T')[0], // sets today's date
    Authorization: 'ENTRY',
    date: new Date().toISOString().split('T')[0],
  });
    // const [isOpenForm, setIsOpenForm] = useState(true);
    const [isVarified, setIsVarified] = useState(false);
    const [salaryHeads, setSalaryHead] = useState([]);
    
      useEffect(() => {
    if (flag===false && form.status) {
      codeInputRef.current.focus();
    }
  }, [flag]);

//   useEffect(() => {
//      axios.get("http://localhost:9082/getAllSalaryHead")
//         .then((res) => setSalaryHead(res.data))
//         .catch(console.error);
// }, []);

    useEffect(() => {
  if (data) {
    setForm(() => ({
        code: data.code,
        shortName: data.shortName,
        name: data.name,
        timefrom: data.timefrom,
        timeto: data.timeto,
        shifttype: data.shifttype,
        activeDate: data.activeDate,
        Authorization: data.Authorization,
        date: data.date,
      // ... any other fields
    }));
    setIsVarified(data.Authorization === "VERIFIED");
  }
   
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

  const handleMouseDown = (e) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (dragging.current) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };
const handleMouseUp = () => {
    dragging.current = false;
  };

    const validateEach = (name,value) => {
    const newErrors = {};
    if(value.trim() === "") {
        newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
    } 
    else {
    if (name === "code") {
        if (/\s/.test(value)) {
            newErrors.code = "Code must not contain spaces.";
        } else if (/[a-z]/.test(value)) {
            newErrors.code = "Lowercase letters are not allowed.";
        }
    } 
    }
     setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    }
    const validate = (form) => {
    const newErrors = {};

    if (!form.code) {
      newErrors.code = "Code is required.";
    } else if (/\s/.test(form.code)) {
      newErrors.code = "Code must not contain spaces.";
    } else if (/[a-z]/.test(form.code)) {
      newErrors.code = "Lowercase letters are not allowed.";
    }
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.shortName) newErrors.shortName = "Short Name is required.";
    if (!form.TimeFrom) newErrors.TimeFrom = "Time From is required.";
    if (!form.TimeTo) newErrors.TimeTo = "Time To is required.";
    if (!form.ShiftType) newErrors.ShiftType = "Shift Type is required.";
    
    // alert(JSON.stringify(newErrors));
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

  setForm(updatedForm);
  
  validateEach(name,value); // ✅ Pass the latest values
  };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched((prev) => ({ ...prev, [name]: true }));
//     validate();
//   };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (data) {
    //     form.code=data.code;
    //     form.name=data.name;
    //     form.shortName=data.shortName;
    //     form.recoveryHead=data.recoveryHead;
    //     form.description=data.description;
    //     form.activeDate=data.activeDate;
    //     form.status=data.status;
    //     form.date=data.date;
    // }
//     if (validate(form)) {
//        if(data){
//       if (data) {
//     try {
//         const response =axios.put(`http://localhost:9082/updateAdvanceType/${data.id}`, {
//             code: form.code,
//             name: form.name,
//             date: form.date,
//             shortName: form.shortName,
//             recoveryHead: form.recoveryHead,
//             description: form.description,
//             activeDate: form.activeDate,
//             status: form.status,
//         });
//         console.log(response.data);
//     } catch (error) {
//         console.error("Error updating advance type:", error);
//     }
//         alert(`Form Updation successfully!`);
//        }
//     }else{
//       axios.post('http://localhost:9082/saveAdvanceType',{
//         code: form.code,
//         name: form.name,
//         date: form.date,
//         shortName: form.shortName,
//         recoveryHead: form.recoveryHead,
//         description: form.description,
//         activeDate: form.activeDate,
//         status: form.status , // Or just boolean true/false
// });
      
//       alert("Form insertion successfully!");
// }
//       // Handle submit
//       toggleForm();
//     }
    
  };

  const handleClear = () => {
    if (!data) {
    setForm({
      code: "",
      name: "",
      shortName: "",
        TimeFrom: "",
        TimeTo:"",
        ShiftType:"",
      activeDate: new Date().toISOString().split('T')[0], // sets today's date
    });
    data=null;
    setErrors({});}
    else{
      setFlag(true);
      const timer=setTimeout(() => {
        setFlag(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  };

  const removeNotification = (id) => {
  setNotifications(prev =>
    prev.filter(notification => notification.id !== id)
  );
};

  return (
  <div className="modal-shift-form"  onClick={toggleForm}   // ⬅ click outside closes
  > 
    <div className="modal-content"
      onClick={(e) => e.stopPropagation()} // ⬅ prevent closing when clicking inside
       style={{
        // left: position.x,
        // top: position.y,
       
        userSelect: 'none',
      }}
  
    >
    <div className="modal-header"
    //  onMouseDown={handleMouseDown}
    //   onMouseMove={handleMouseMove}
    //   onMouseUp={handleMouseUp}
    //   onMouseLeave={handleMouseUp}
    //   style={ {cursor: dragging.current ? 'grabbing' : 'grab'}}
    >
        {/* <div className={`slide-container ${showSearch ? 'show' : 'hide'}`}>
        
      <Search/>
        
        </div> */}
    <div className="h3">Shift Group</div>
    <div className="header-icons">
       <div className="notifications" 
        onMouseEnter={handleNotifEnter}
        onMouseLeave={handleNotifLeave}>
                <IoNotificationsSharp size={19} style={{cursor:'pointer'}}/>
                {(notifications.length!=0)&&<div className="error-msgs">{notifications.length}</div>}
                {notOpen && (
      <div className="notifications-dropdown">
       {notifications.length > 0 ? (
               notifications.map((notification) => (
                   <p className="error-msg" key={notification.id} style={{color:'black'}}>{notification.msg} <RxCross2 size={20} color="red" onClick={() => removeNotification(notification.id)}/></p>
                   ))
               ) : (
               <p className="no-msg">no notifications</p>
               )}
      </div>
              )}
            </div>
        <div onClick={toggleForm} className="close"><RxCross2 size={15}/></div>
    </div>
    </div>
    <div className="main-model-content">
        <div className="full-content">
      {/* Code */}
      <div className="form-row">
        <label className="required" name="code">Code</label>
        <div className="input code">
          <input
            id='code'
            type="text"
            name="code"
            ref={codeInputRef}
            value={form.code}
            onChange={handleChange}
            autoComplete="off"
            disabled={isVarified} 
          />
        </div>
        </div>
        <div className="main-error">
         { errors.code && (
            <div className="error">{errors.code}</div>
          )}
          </div>
      </div>

      {/* Name */}
      <div className="full-content">
      <div className="form-row">
        <label className="required">Name</label>
        <div className="input name">
          <input
          id='name'
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={isVarified} 
          />
          </div>
          </div>
          <div className="main-error">
          { errors.name && (
            <div className="error">{errors.name}</div>
          )}
        </div>
      </div>

      {/* Short Name */}
      <div className="full-content">
      <div className="form-row">
        <label className="required">Short Name</label>
        <div className="input shortName">
          <input
          id='shortName'
            type="text"
            name="shortName"
            value={form.shortName}
            onChange={handleChange}
            disabled={isVarified} 
          />
            </div>
            </div>
            <div className="main-error">
          {errors.shortName && (
            <div className="error">{errors.shortName}</div>
          )}
        </div>
      </div>

      {/* Time From */}
      <div className="full-content">
      <div className="form-row">
        <label className="required">Time From</label>
        <div className="input timeFrom">
        <input
        type="time"
        name="TimeFrom"
        value={form.TimeFrom}
        onChange={handleChange}
        disabled={isVarified}
      />
        </div>
        </div>
        <div className="main-error">
          { errors.TimeFrom && (
            <div className="error">{errors.TimeFrom}</div>
          )}
        </div>
      </div>

       {/* Time To */}
      <div className="full-content">
      <div className="form-row">
        <label className="required">Time To</label>
        <div className="input timeTo">
        <input
        type="time"
        name="TimeTo"
        value={form.TimeTo}
        onChange={handleChange}
        disabled={isVarified}
      />
        </div>
        </div>
        <div className="main-error">
          { errors.TimeTo && (
            <div className="error">{errors.TimeTo}</div>
          )}
        </div>
      </div>

      {/* Shift Type */}
    <div className="full-content">
    <div className="form-row">
    <label className="required">Shift Type</label>

    <div className="shift-type-container">
      <div
        className={`shift-type ${form.ShiftType === "DAY" ? "active" : ""}`}
        onClick={() => !isVarified && setForm({ ...form, ShiftType: "DAY" })}>
    <GrSun />
      </div>

      <div
        className={`shift-type ${form.ShiftType === "NIGHT" ? "active" : ""}`}
        onClick={() => !isVarified && setForm({ ...form, ShiftType: "NIGHT" })}>
   <GrMoon />
      </div>

      <div
        className={`shift-type ${form.ShiftType === "GENERAL" ? "active" : ""}`}
        onClick={() => !isVarified && setForm({ ...form, ShiftType: "GENERAL" })}>
     <LiaAdjustSolid />
      </div>
    </div>
  </div>

  <div className="main-error">
    {errors.ShiftType && <div className="error">{errors.ShiftType}</div>}
  </div>
</div>


      {/* Active Date */}
      <div className="full-content">
      <div className="form-row">
        <label className='active-date'>Active Date</label>
        <div className="input activeDate">
            <input
            id='activeDate'
            type="date"
            name="activeDate"
            value={form.activeDate}
            onChange={handleChange}
            disabled={isVarified} 
          />
        </div>
      </div>
      </div>

      {/* Authorization */}
      <div className="full-content">
      <div className="form-row">
        <label>Authorization</label>
        <div className="input authorization">
          <select
          id='status'
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={isVarified} 
          >
            {isVarified && <option value="VERIFIED">VERIFIED:{data.date}</option>}
            {data &&!isVarified && <option value="ENTRY" >ENTRY:{data ? data.date : form.date}</option>}
            {data &&!isVarified && <option value="VERIFIED">VERIFIED:</option>}
            {/* <option value="ENTRY" >ENTRY:{data ? data.date : form.date}</option> */}
            {!data &&(<> <option value="ENTRY" >ENTRY:{data && data.date}</option>
            <option value="VERIFIED">VERIFIED:</option></>)}
          </select>
        </div>
      </div>
      </div>
    </div>

    <div className="form-buttons">
      <button className="save-btn" disabled={isVarified}  style={{ outline: 'none'}} onClick={handleSubmit}><FaSave size={20}  /></button>
      <button className="cancel-btn" disabled={isVarified}  style={{ outline: 'none'}} onClick={handleClear}><MdOutlineCancel  size={20} /></button>
    </div>
  </div>
  {/* {isOpenForm && (<div className="modal-backdrop"><AdvanceTypeForm /></div>
)} */}
 {flag &&  <Loading />}
</div>

  );
}

export default ShiftGroupForm;
