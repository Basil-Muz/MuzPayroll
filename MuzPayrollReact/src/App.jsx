import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import "./ToastStyles.css";
import "./common-form.css";

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

import BranchPageForm from "./pages/Branch Page/Tabs/GenaralBranchForm.jsx";
import CompanyPageForm from "./pages/CompanyPage/GenaralCompanyForm.jsx";
import LocationPageForm from "./pages/LocationPage/GeneralLocationForm.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";

import PayrollGroup from "./pages/payrollgroup/payrollgroup.jsx";
import PayrollGroupList from "./pages/payrollgroup/payrollgrouplist.jsx";
import PayrollGroupSearch from "./pages/payrollgroup/payrollgroupsearch.jsx";
// import UserGroup from "./pages/User Group/usergroup.jsx";
// import UserGroupForm from "./pages/User Group/usergroupform.jsx";
// import LocationGroup from "./pages/Location Group/locationgroup.jsx";
// import LocationGroupForm from "./pages/Location Group/locationgroupform.jsx";
// import ShiftGroup from "./pages/Shift Group/shiftgroup.jsx";
// import ShiftGroupSearch from "./pages/Shift Group/shiftgroupsearch.jsx";
// import ShiftGroupList from "./pages/Shift Group/shiftgrouplist.jsx";
function App() {
  return (
    <>
      <AuthProvider>
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
          <Route path="/designation" element={<Designation />} />
          <Route path="/branchform" element={<BranchPageForm />} />
          <Route path="/companyform" element={<CompanyPageForm />} />
          <Route path="/locationform" element={<LocationPageForm />} />
          {/* 
        <Route path="/payrollgroup" element={<PayrollGroup/>} />
      <Route path="/payrollgroupsearch" element={<PayrollGroupSearch/>} />
      <Route path="/payrollgrouplist" element={<PayrollGroupList/>} />
      <Route path="/usergroupform" element={<UserGroupForm/>} />
      <Route path="/usergroup" element={<UserGroup/>} />
      <Route path="/locationgroup" element={<LocationGroup/>} />
      <Route path="/locationgroupform" element={<LocationGroupForm/>} />
      <Route path="/shiftgroup" element={<ShiftGroup/>} />
      <Route path="/shiftgroupsearch" element={<ShiftGroupSearch/>} />
      <Route path="/shiftgrouplist" element={<ShiftGroupList/>} /> */}
        </Routes>
      </AuthProvider>
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          duration: 2800,
          style: {
            background: "var(--glass-bg)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
            borderRadius: "var(--radius-lg)",
            padding: "14px 16px",
            maxWidth: "420px",
            fontSize: "var(--text-sm)",
            backdropFilter: "blur(10px)",
          },

          // Default icon theme
          iconTheme: {
            primary: "var(--brand)",
            secondary: "var(--background)",
          },

          success: {
            style: {
              borderLeft: "3px solid var(--success)",
              background:
                "linear-gradient(135deg, var(--success-light), var(--glass-bg))",
            },
          },

          error: {
            style: {
              borderLeft: "4px solid var(--danger)",
              background:
                "linear-gradient(135deg, var(--danger-light), var(--glass-bg))",
            },
          },

          loading: {
            style: {
              borderLeft: "4px solid var(--brand)",
              background:
                "linear-gradient(135deg, var(--primary-light), var(--glass-bg))",
            },
          },
        }}
      />
    </>
  );
}
// Icons
const SuccessIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
      fill="#10B981"
    />
    <path
      d="M10 15.17L6.53 11.7C6.14 11.31 5.51 11.31 5.12 11.7C4.73 12.09 4.73 12.72 5.12 13.11L9.29 17.28C9.68 17.67 10.31 17.67 10.7 17.28L18.88 9.1C19.27 8.71 19.27 8.08 18.88 7.69C18.49 7.3 17.86 7.3 17.47 7.69L10 15.17Z"
      fill="white"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
      fill="#EF4444"
    />
    <path
      d="M12 13C12.5523 13 13 12.5523 13 12V8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8V12C11 12.5523 11.4477 13 12 13Z"
      fill="white"
    />
    <path
      d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
      fill="white"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
      fill="#3B82F6"
    />
    <path
      d="M12 17C12.5523 17 13 16.5523 13 16V12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V16C11 16.5523 11.4477 17 12 17Z"
      fill="white"
    />
    <path
      d="M12 9C12.5523 9 13 8.55228 13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8C11 8.55228 11.4477 9 12 9Z"
      fill="white"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Custom toast functions to match your color scheme
// export const showSuccessToast = (message) => {
//   return toast.success(message, {
//     style: {
//       borderLeft: "4px solid #10B981",
//     },
//   });
// };

// export const showErrorToast = (message) => {
//   return toast.error(message, {
//     style: {
//       borderLeft: "4px solid #EF4444",
//     },
//   });
// };

// export const showInfoToast = (message) => {
//   return toast(message, {
//     style: {
//       borderLeft: "4px solid #3B82F6",
//     },
//   });
// };
export default App;
