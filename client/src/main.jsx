// DO NOT CHANGE THIS FILE

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.jsx'

import axios from 'axios';
axios.defaults.baseURL = 'https://shiny-funicular-g45r67xx7j9qfwr56-5173.app.github.dev/';

// DO NOT CHANGE THIS FILE

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Home />
  </StrictMode>,
)

// DO NOT CHANGE THIS FILE
