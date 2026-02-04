
import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LoaderProvider } from "./context/LoaderContext";

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
   <LoaderProvider>
    <App />
    </LoaderProvider>
  </BrowserRouter>
)

