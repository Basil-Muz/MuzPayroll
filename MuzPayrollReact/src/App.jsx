import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Companyform from "./pages/company/Companyform.jsx";
import BranchForm from "./pages/Branch/BranchForm.jsx";
import LocationForm from "./pages/Location/LocationForm.jsx";  

import GeneralForm from "./pages/company/GeneralForm";
import DocumentsInfo from "./pages/company/DocumentsInfo";
import MasterPage from "./pages/Masters/MasterPage.jsx";
import BranchGeneralForm from "./pages/Branch/GeneralForm.jsx";
import BranchDocumentsInfo from "./pages/Branch/DocumentsInfo.jsx";
 
import LocationGeneralForm from "./pages/Location/GeneralForm.jsx";
import LocationDocumentsInfo from "./pages/Location/DocumentsInfo.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MasterPage />} />
      <Route path="/company" element={<Companyform />} />
      <Route path="/generalform" element={<GeneralForm />} />
      <Route path="/documentsinfo" element={<DocumentsInfo />} />

      <Route path="/branch" element={<BranchForm />} />
      <Route path="/generalform" element={<BranchGeneralForm />} />
      <Route path="/documentsinfo" element={<BranchDocumentsInfo />} />

      <Route path="/location" element={<LocationForm />} />
      <Route path="/generalform" element={<LocationGeneralForm />} />
      <Route path="/documentsinfo" element={<LocationDocumentsInfo />} />
    </Routes>
  );
}

export default App;
