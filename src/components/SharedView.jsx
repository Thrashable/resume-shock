import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import VisualResume from './VisualResume'
import { decompressData } from '../utils/shareLink'

export default function SharedView() {
  const location = useLocation()
  const [data, setData] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const hash = location.hash.slice(1)
    if (!hash) {
      setError(true)
      return
    }
    const parsed = decompressData(hash)
    if (!parsed || !parsed.name) {
      setError(true)
      return
    }
    const { _profileImage, ...resumeData } = parsed
    setData(resumeData)
    if (_profileImage) setProfileImage(_profileImage)
  }, [location.hash])

  if (error) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-display font-bold text-white dark:text-white">
            This link doesn't seem to work
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Ask the person who shared it to re-share it, or the link may have been truncated.
          </p>
          <a
            href="/"
            className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-accent text-black font-bold text-sm hover:bg-accent-light transition-colors"
          >
            Create Your Own
          </a>
        </motion.div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-3.5rem)] relative z-10"
    >
      <VisualResume data={data} profileImage={profileImage} showMatcher={false} />
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#06060C]/90 dark:bg-[#06060C]/90 border border-white/10 backdrop-blur-xl text-[10px] font-medium text-gray-400 hover:text-accent transition-colors"
        >
          Built with <span className="font-display font-bold text-white dark:text-white">RESUME<span className="text-accent">SHOCK</span></span>
        </a>
      </div>
    </motion.div>
  )
}
