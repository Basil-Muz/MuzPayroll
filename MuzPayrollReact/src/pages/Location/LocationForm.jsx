import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "../Location/LocationForm.css";
import GeneralForm from "../Location/GeneralForm.jsx";
import DocumentsInfo from "../Location/DocumentsInfo.jsx";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTopButton.jsx";
import Header from "../../components/Header/Header.jsx";
import ManinButtons from "../../components/MainButtons/MainButtons.jsx";

const LocationForm = forwardRef((props, ref) => {
  const generalFormRef = useRef();
  const documentsInfoRef = useRef();

  const [isDirty, setIsDirty] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [headerError, setHeaderError] = useState("");

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
      <div className="pagename">
        <h2>Location</h2>
      </div>
      <div
        className={`button-toggle ${showdiv === "generalinfo" ? "general-active" : showdiv === "docinfo" ? "doc-active" : ""}`}
      >
        <button
          className={`general ${showdiv === "generalinfo" ? "active-blue" : "inactive"}`}
          onClick={() => toggleDiv("generalinfo")}
        >
          General Info
        </button>

        <button
          className={`doc ${showdiv === "docinfo" ? "active-green" : "inactive"}`}
          onClick={() => toggleDiv("docinfo")}
        >
          Documents Info
        </button>
      </div>

      <div className="form-tabs-container">
        <Header backendError={headerError} />

        <div
          className={`form-tab ${showdiv === "generalinfo" ? "visible" : "hidden"}`}
        >
          <GeneralForm ref={generalFormRef} onBackendError={setHeaderError} />
        </div>

        <div
          className={`form-tab ${showdiv === "docinfo" ? "visible" : "hidden"}`}
        >
          <DocumentsInfo ref={documentsInfoRef} />
        </div>
      </div>
      <ManinButtons />

      <ScrollToTopButton />
    </div>
  );
});

export default LocationForm;
