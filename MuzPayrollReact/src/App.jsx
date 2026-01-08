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

import LoginPage from "./pages/LoginPage/loginpage.jsx";
import LoggedPage from "./pages/LoggedPage/loggedpage.jsx";

import ChangePassword from "./pages/changepassword/changepassword.jsx";
import Logout from "./components/logout/logout.jsx";
import ForgotPassword from "./pages/forgotpassword/forgotpassword.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import Designation from "./pages/designation/designation.jsx";
import PayrollGroup from "./pages/payrollgroup/payrollgroup.jsx";
import PayrollGroupList from "./pages/payrollgroup/payrollgrouplist.jsx";
import PayrollGroupSearch from "./pages/payrollgroup/payrollgroupsearch.jsx";
function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Page />} /> */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<LoggedPage />} />
      <Route path="/company" element={<Companyform />} />
      <Route path="/generalform" element={<GeneralForm />} />
      <Route path="/documentsinfo" element={<DocumentsInfo />} />
      <Route path="/masters" element={<MasterPage />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/settings" element={<Settings />} />

      <Route path="/branch" element={<BranchForm />} />
      <Route path="/generalform" element={<BranchGeneralForm />} />
      <Route path="/documentsinfo" element={<BranchDocumentsInfo />} />

      <Route path="/location" element={<LocationForm />} />
      <Route path="/generalform" element={<LocationGeneralForm />} />
      <Route path="/documentsinfo" element={<LocationDocumentsInfo />} />
      <Route path="/designation" element={<Designation/>} />
      <Route path="/payrollgroup" element={<PayrollGroup/>} />
      <Route path="/payrollgroupsearch" element={<PayrollGroupSearch/>} />
      <Route path="/payrollgrouplist" element={<PayrollGroupList/>} />
    </Routes>
  );
}

export default App;
