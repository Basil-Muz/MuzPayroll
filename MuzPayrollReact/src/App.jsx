import { useState } from "react";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Companyform from "./pages/company/Companyform";
import GeneralForm  from "./pages/company/GeneralForm";
import DocumentsInfo from "./pages/company/DocumentsInfo"

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Page />} /> */}
        <Route path="/company" element={<Companyform />} />
        <Route path="/generalform" element={<GeneralForm />} />
        <Route path="/documentsinfo" element={<DocumentsInfo />} />
      </Routes>
    </Router>
  );
}

export default App;