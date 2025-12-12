import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import MasterPage from "./pages/Masters/MasterPage.jsx";
import Companyform from "./pages/company/Companyform";
import GeneralForm from "./pages/company/GeneralForm";
import DocumentsInfo from "./pages/company/DocumentsInfo";


function App() {
  return (
    <Routes>
      <Route path="/masters" element={<MasterPage />} />
      <Route path="/company" element={<Companyform />} />
      <Route path="/generalform" element={<GeneralForm />} />
      <Route path="/documentsinfo" element={<DocumentsInfo />} />

    </Routes>
  );
}

export default App;
