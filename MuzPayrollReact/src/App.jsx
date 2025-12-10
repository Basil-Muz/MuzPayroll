import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage/loginpage'
import LoggedPage from './pages/LoggedPage/loggedpage'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
  <Routes>
    <Route path='/' element={<LoginPage/>}/>
    <Route path='/home' element={<LoggedPage/>}/>|
 
  </Routes>
  )
}

export default App
