import "./App.css";
import React from "react";
import { Router, Routes, Route } from "react-router-dom";
import Companyform from "./pages/company/Companyform";
import GeneralForm  from "./pages/company/GeneralForm";
import DocumentsInfo from "./pages/company/DocumentsInfo"
import MasterPage from "./pages/Masters/MasterPage";
import LoggedPage from "./pages/LoggedPage/loggedpage";
import LoginPage from "./pages/LoginPage/loginpage";

function App() {
  return (
         <Routes>
        {/* <Route path="/" element={<Page />} /> */}
        <Route path="/" element={<LoginPage/>} /> 
        <Route path="/home" element={<LoggedPage />} />
        <Route path="/company" element={<Companyform />} />
        <Route path="/generalform" element={<GeneralForm />} />
        <Route path="/documentsinfo" element={<DocumentsInfo />} />
        <Route path="/masters" element={<MasterPage />} />

      </Routes>

  );
}

export default App;

