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
import FloatingActionBar from "../../components/demo_buttons/FloatingActionBar.jsx";

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
      <FloatingActionBar
        actions={{
          save: {
            onClick: () => {
              if (generalFormRef.current?.save) {
                generalFormRef.current.save();
              }
            },
            disabled: false,
            // disabled: isViewMode || isSubmitted
          },
          search: {
            // onClick: handleSearch,
            disabled: true,
          },
          clear: {
            onClick: () => {
              if (generalFormRef.current) generalFormRef.current.resetForm();
              if (documentsInfoRef.current)
                documentsInfoRef.current.resetForm();
            },
            // disabled:true,
          },
          delete: {
            // onClick: handleDelete,
            // disabled: !hasDeletePermission
            disabled: true,
          },
          // print: {
          //   // onClick: handlePrint,
          //   // disabled: isNewRecord
          //   disabled: true,
          // },
          // new: {
          //   // onClick: toggleForm,
          //   //to toggle the designation form
          // },
          refresh: {
            onClick: () => {
              if (generalFormRef.current?.refresh)
                generalFormRef.current.refresh();
            },
            disabled: true,
          },
        }}
      />{" "}
      <ScrollToTopButton />
    </div>
  );
});

export default LocationForm;
