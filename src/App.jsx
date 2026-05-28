import { useState, useEffect} from 'react'
import '/src/styles/App.css'
import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { db } from './firebaseconfig';
import ScrollToTop from './components/ScrollTop'; 

// Import all pages 
import Homepage from './pages/Homepage'
import SpecificAnim from './pages/SpecificAnim'
import UploadAnim from './pages/UploadAnim'
import UploadAnimCode from './pages/UploadAnimCode'
import ErrorPage from './pages/ErrorPage'
import Nav from './components/Navbar'
import Loader from './components/Loader'

function AnimatedRoutes () {
  const location = useLocation();

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
          path="/upload/code"
          element={
            <PageWrapper>
              <UploadAnimCode />
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
      transition={{duration: 0.6, ease: 'easeInOut'}}
    >
      {children}
    </motion.div>

  )
}
function App() {
  const [loading, setLoading] = useState(true);

  return (
    <BrowserRouter>
      {loading && (
        <Loader onFinish={() => setLoading(false)} />
      )}

      {!loading && (
        <>
          <ScrollToTop /> 
          <Nav />
          <AnimatedRoutes />
        </>
      )}
    </BrowserRouter>
  );
}

export default App