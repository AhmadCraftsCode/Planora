import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// 1. Get the URL from Vercel's settings
const v_url = import.meta.env.VITE_API_URL;

// 2. If it's missing (on Vercel), use your ACTUAL backend link as a hard backup
// REPLACE the link below with your real backend link from Vercel
const fallback_url = "https://planora-murex.vercel.app/"; 

axios.defaults.baseURL = v_url || fallback_url;

console.log("Planora is connecting to:", axios.defaults.baseURL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)