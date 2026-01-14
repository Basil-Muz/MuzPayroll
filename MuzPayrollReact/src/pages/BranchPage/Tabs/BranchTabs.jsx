// import { useState } from "react";
import GeneralTab from "../Tabs/General Info/GenaralBranchForm";
import DocumentsTab from "../Tabs/Documents Info/DocumentsTab";
import "../css/BranchTab.css";

export default function BranchTabs() {
//   const [activeTab, setActiveTab] = useState("general");
      // const [backendErrors, setBackendErrors] = useState([]);
  return (
    <>
    {/* <Header backendError=backendErrors /> */}
    <div className="branch-container">
      {/* Tabs Header */}
      <div className="tabs-header">
        {/* <button
          className={`tab-btn ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          General Info
        </button>

        <button
          className={`tab-btn ${activeTab === "documents" ? "active" : ""}`}
          onClick={() => setActiveTab("documents")}
        >
          Documents Info
        </button> */}
      </div>

      {/* Tabs Content */}
      <div className="tabs-content glass">
        <GeneralTab />
        {/* {activeTab === "documents" && <DocumentsTab />} */}
      </div>
    </div>
    </>
  );
}
