import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './components/Landing'
import Preview from './components/Preview'
import SharedView from './components/SharedView'
import ParticleBackground from './components/ParticleBackground'

function AnimatedRoutes({ resumeData, profileImage, onDataReady, onReset }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Landing onDataReady={onDataReady} />
          </motion.div>
        } />
        <Route path="/preview" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Preview data={resumeData} profileImage={profileImage} onReset={onReset} />
          </motion.div>
        } />
        <Route path="/view" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <SharedView />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function AppContent() {
  const [resumeData, setResumeData] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const location = useLocation()

  const handleDataReady = useCallback((data, image) => {
    setResumeData(data)
    setProfileImage(image)
  }, [])

  const handleReset = useCallback(() => {
    setResumeData(null)
    setProfileImage(null)
  }, [])

  const isSharedView = location.pathname === '/view'

  return (
    <div className="min-h-screen flex flex-col relative">
      <ParticleBackground />
      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/3 blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>
      <Navbar />
      <main className="flex-1">
        <AnimatedRoutes
          resumeData={resumeData}
          profileImage={profileImage}
          onDataReady={handleDataReady}
          onReset={handleReset}
        />
      </main>
      <Footer minimal={isSharedView} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
