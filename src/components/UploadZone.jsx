import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'

export default function UploadZone({ accept, label, sublabel, icon, onFile, preview }) {
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }, [onFile])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleLeave = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
  }, [])

  const handleClick = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) onFile(file)
    }
    input.click()
  }, [accept, onFile])

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDrag}
      onDragEnter={handleDrag}
      onDragLeave={handleLeave}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 overflow-hidden
        ${dragging
          ? 'border-accent bg-accent/5 scale-[1.02] shadow-[0_0_40px_rgba(0,212,255,0.15)]'
          : 'border-gray-300 dark:border-white/10 hover:border-accent/40 bg-gray-50 dark:bg-white/[0.02]'
        }
      `}
    >
      {/* Glow effect on drag */}
      {dragging && (
        <div className="absolute inset-0 bg-gradient-radial from-accent/10 to-transparent pointer-events-none" />
      )}

      {preview ? (
        <div className="flex flex-col items-center gap-3 relative z-10">
          {preview}
          <p className="text-xs text-gray-500 dark:text-gray-500">Click to change</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300 ${
            dragging ? 'bg-accent/20 text-accent' : 'bg-accent/10 text-accent/70'
          }`}>
            {icon}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{sublabel}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
