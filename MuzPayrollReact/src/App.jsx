import "./App.css";
import React from "react";
import { Router, Routes, Route } from "react-router-dom";
import Companyform from "./pages/company/Companyform";
import GeneralForm  from "./pages/company/GeneralForm";
import DocumentsInfo from "./pages/company/DocumentsInfo"
import MasterPage from "./pages/Masters/MasterPage";
import LoggedPage from "./pages/LoggedPage/loggedpage";
import LoginPage from "./pages/LoginPage/loginpage";
import ChangePassword from "./pages/changepassword/changepassword";
import Logout from "./components/logout/logout";
import ForgotPassword from "./pages/forgotpassword/forgotpassword";

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
        <Route path="/changepassword" element={<ChangePassword/>} /> 
        <Route path="/logout" element={< Logout/>} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />


      </Routes>


  );
}

export default App;

