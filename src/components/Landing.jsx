import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import UploadZone from './UploadZone'
import PrivacyBadge from './PrivacyBadge'
import { extractTextFromPDF, parseResume } from '../utils/resumeParser'
import { resizeImage } from '../utils/imageUtils'

export default function Landing({ onDataReady }) {
  const navigate = useNavigate()
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfName, setPdfName] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePDF = useCallback((file) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }
    setPdfFile(file)
    setPdfName(file.name)
    setError('')
  }, [])

  const handleImage = useCallback(async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }
    const resized = await resizeImage(file)
    setProfileImage(resized)
    setError('')
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!pdfFile) return
    setLoading(true)
    setError('')
    try {
      const lines = await extractTextFromPDF(pdfFile)
      const resumeData = parseResume(lines)
      onDataReady(resumeData, profileImage)
      navigate('/preview')
    } catch (err) {
      setError('Failed to parse PDF. Please try a different file.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [pdfFile, profileImage, onDataReady, navigate])

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
            RESUME<span className="text-accent">SHOCK</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Turn your boring PDF into a resume that actually gets looked at.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Free. No signup. No data stored. 100% private.
          </p>
          <div className="mt-4">
            <PrivacyBadge />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 w-full max-w-2xl grid sm:grid-cols-2 gap-4"
        >
          <UploadZone
            accept=".pdf"
            label="Resume PDF"
            sublabel="Drag & drop or click to browse (.pdf)"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            onFile={handlePDF}
            preview={pdfName ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{pdfName}</span>
              </div>
            ) : null}
          />
          <UploadZone
            accept=".jpg,.jpeg,.png,.webp"
            label="Profile Picture"
            sublabel="Optional — .jpg, .png, or .webp"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            onFile={handleImage}
            preview={profileImage ? (
              <img src={profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover ring-2 ring-accent/30" />
            ) : null}
          />
        </motion.div>

        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={handleGenerate}
          disabled={!pdfFile || loading}
          className={`
            mt-8 px-8 py-3.5 rounded-xl font-bold text-white text-lg transition-all duration-200
            ${pdfFile && !loading
              ? 'bg-accent hover:bg-accent-dark shadow-lg shadow-accent/25 hover:shadow-accent/40 cursor-pointer'
              : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            }
          `}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Parsing...
            </span>
          ) : (
            'Generate My Resume'
          )}
        </motion.button>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 w-full max-w-4xl grid sm:grid-cols-3 gap-8"
        >
          {[
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
              title: 'Privacy First',
              desc: 'Everything runs in your browser. Your resume data never touches a server.',
            },
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
              title: 'Instant Results',
              desc: 'Upload your PDF and get a beautiful visual resume in seconds. No waiting.',
            },
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />,
              title: 'Shareable',
              desc: 'Get a link you can send to employers. They see a polished resume page.',
            },
          ].map((feat, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {feat.icon}
                </svg>
              </div>
              <h3 className="mt-3 font-bold text-gray-900 dark:text-white">{feat.title}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{feat.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
