import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage/loginpage'
import LoggedPage from './pages/LoggedPage/loggedpage'
import MasterPage from "./pages/Masters/MasterPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Companyform from "./pages/company/Companyform";
import GeneralForm  from "./pages/company/GeneralForm";
import DocumentsInfo from "./pages/company/DocumentsInfo"

function App() {
  return (
  <Routes>
    <Route path='/' element={<LoginPage/>}/>
    <Route path='/home' element={<LoggedPage/>}/>
    <Route path="/masters" element={<MasterPage />} />
     <Route path="/company" element={<Companyform />} />
      <Route path="/generalform" element={<GeneralForm />} />
      <Route path="/documentsinfo" element={<DocumentsInfo />} />
  </Routes>
  )
}

export default App
