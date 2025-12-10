import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "../company/Companyform.css";
import GeneralForm from "../company/GeneralForm.jsx";
import DocumentsInfo from "../company/DocumentsInfo.jsx";

const Companyform = forwardRef((props, ref) => {
  const generalFormRef = useRef();
  const documentsInfoRef = useRef();

    const [isDirty, setIsDirty] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleFormChange = (dirty, valid) => {
    setIsDirty(dirty);
    setIsValid(valid);
  };


  useImperativeHandle(ref, () => ({
    resetForms() {
      if (generalFormRef.current) generalFormRef.current.resetForm();
      if (documentsInfoRef.current) documentsInfoRef.current.resetForm();
    },
    refresh() {
      if (generalFormRef.current?.refresh) generalFormRef.current.refresh();
    },
    save() {
      if (generalFormRef.current?.save) generalFormRef.current.save();
    },
  }));

  const [showdiv, setShowdiv] = useState("generalinfo");

  const toggleDiv = (divName) => {
    setShowdiv(divName);
  };

  return (
    <div className="location-form">
      <div
        className={`button-toggle ${showdiv === "generalinfo" ? "general-active" : showdiv === "docinfo" ? "doc-active" : ""}`}
      >
        <button
          className={`general ${showdiv === "generalinfo" ? "active-blue" : "inactive"}`}
          onClick={() => toggleDiv("generalinfo")}
        >
          General Info
        </button>

        {/* <button
          className={`doc ${showdiv === "docinfo" ? "active-green" : "inactive"}`}
          onClick={() => toggleDiv("docinfo")}
        >
          Documents Info
        </button> */}
      </div>

      <div className="form-tabs-container">
        <div
          className={`form-tab ${showdiv === "generalinfo" ? "visible" : "hidden"}`}
        >
          <GeneralForm ref={generalFormRef} />
        </div>

        <div
          className={`form-tab ${showdiv === "docinfo" ? "visible" : "hidden"}`}
        >
          <DocumentsInfo ref={documentsInfoRef} />
        </div>
      </div>
    </div>
  );
});

export default Companyform;