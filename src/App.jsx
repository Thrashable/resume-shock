import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './components/Landing'
import Preview from './components/Preview'
import SharedView from './components/SharedView'

export default function App() {
  const [resumeData, setResumeData] = useState(null)
  const [profileImage, setProfileImage] = useState(null)

  const handleDataReady = useCallback((data, image) => {
    setResumeData(data)
    setProfileImage(image)
  }, [])

  const handleReset = useCallback(() => {
    setResumeData(null)
    setProfileImage(null)
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing onDataReady={handleDataReady} />} />
            <Route path="/preview" element={<Preview data={resumeData} profileImage={profileImage} onReset={handleReset} />} />
            <Route path="/view" element={<SharedView />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
