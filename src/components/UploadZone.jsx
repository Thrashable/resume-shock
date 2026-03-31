import { useCallback, useState } from 'react'

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
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDrag}
      onDragEnter={handleDrag}
      onDragLeave={handleLeave}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200
        ${dragging
          ? 'border-accent bg-accent/5 scale-[1.02]'
          : 'border-gray-300 dark:border-gray-700 hover:border-accent/50 hover:bg-gray-50 dark:hover:bg-gray-900'
        }
      `}
    >
      {preview ? (
        <div className="flex flex-col items-center gap-3">
          {preview}
          <p className="text-sm text-gray-500 dark:text-gray-400">Click to change</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            {icon}
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">{label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{sublabel}</p>
          </div>
        </div>
      )}
    </div>
  )
}
