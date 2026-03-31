export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        <p>
          Built by{' '}
          <a
            href="https://x.com/Kutto"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline font-medium"
          >
            Kutto
          </a>
        </p>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Open Source
          </span>
          <a
            href="https://github.com/kutto"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
