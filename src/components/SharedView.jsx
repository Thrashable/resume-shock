import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            This link doesn't seem to work
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Ask the person who shared it to re-share it, or the link may have been truncated.
          </p>
          <a
            href="/"
            className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-accent text-white font-medium hover:bg-accent-dark transition-colors"
          >
            Create Your Own
          </a>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <VisualResume data={data} profileImage={profileImage} />
      <div className="fixed bottom-4 right-4">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-accent transition-colors"
        >
          Built with RESUME<span className="text-accent font-bold">SHOCK</span>
        </a>
      </div>
    </div>
  )
}
