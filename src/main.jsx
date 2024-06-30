import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { WheatherApp } from './components/WheatherApp'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WheatherApp />
  </React.StrictMode>,
)
