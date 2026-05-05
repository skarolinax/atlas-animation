import { useState } from 'react'
import '/src/styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import all pages 
import Homepage from './pages/Homepage'
import SpecificAnim from './pages/SpecificAnim'
import UploadAnim from './pages/UploadAnim'
import ErrorPage from './pages/ErrorPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/upload" element={<UploadAnim />} />
        <Route path="/animation/:id" element={<SpecificAnim />} /> {/* Will become dynamic */}

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App