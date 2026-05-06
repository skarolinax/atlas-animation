import { useState } from 'react'
import '/src/styles/App.css'
import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Import all pages 
import Homepage from './pages/Homepage'
import SpecificAnim from './pages/SpecificAnim'
import UploadAnim from './pages/UploadAnim'
import ErrorPage from './pages/ErrorPage'
import Nav from './components/Navbar'


function AnimatedRoutes () {
  const location = useLocation();
  console.log(location)

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/"
          element={
            <PageWrapper>
              <Homepage />
            </PageWrapper>
          }
          />
        <Route 
          path="/upload"
          element={
            <PageWrapper>
              <UploadAnim />
            </PageWrapper>
          }
          />
        <Route 
          path="/animation/:id"
          element={
            <PageWrapper>
              <SpecificAnim />
            </PageWrapper>
          }
          />

        <Route 
          path="*"
          element={
            <PageWrapper>
              <ErrorPage />
            </PageWrapper>
          }
          />
      </Routes>
    </AnimatePresence>
  )
}

function PageWrapper ({children}) {
  return (
    <motion.div 
      initial={{opacity: 0, y:20}}
      animate={{opacity:1, y:0}}
      exit={{opacity:0, y:-20}}
      transition={{duration: 0.3}}
    >
      {children}
    </motion.div>

  )
}
function App() {
  return (
    <BrowserRouter> {/*Only the content will be animated, nav static*/}
      <Nav />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App