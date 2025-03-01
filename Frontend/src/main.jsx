import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css' // Import CSS
import './index.css'
import AppWithProvider from './Context/AppWithProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
<AppWithProvider />
</>

)
