import { useEffect, useState } from 'react'

export function InstagramEmbed({ html, url }: { html: string; url: string }) {
  const [failed, setFailed] = useState(false)

  // Detect if embed.js was blocked (by adblockers, brave shield, etc)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!(window as any).instgrm) {
        setFailed(true)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (failed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="group block rounded-xl overflow-hidden border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 hover:bg-slate-100/60 dark:hover:bg-slate-800 transition"
      >
        <div className="aspect-square w-full flex flex-col items-center justify-center text-center px-6 py-8">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr from-pink-500 via-red-500 to-yellow-500">
            <svg
              className="h-5 w-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .3 2.5.5.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.5.4 1.3.5 2.5.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 2-.5 2.5-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.5.2-1.3.4-2.5.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.3-2.5-.5-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.5-.4-1.3-.5-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-2 .5-2.5.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .5-.2 1.3-.4 2.5-.5C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-2 .4-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.2.4-.3 1-.4 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.4 2 .2.5.4.8.7 1.1.3.3.6.5 1.1.7.4.2 1 .3 2 .4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 2-.4.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.2-.4.3-1 .4-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.4-2-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.4-.2-1-.3-2-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.2a6.8 6.8 0 1 1 0 13.6 6.8 6.8 0 0 1 0-13.6zm0 11.1a4.3 4.3 0 1 0 0-8.6 4.3 4.3 0 0 0 0 8.6zm5.1-11.8a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
            Instagram embed unavailable
          </p>
          <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">
            Tap to view this post on Instagram.
          </p>
        </div>
      </a>
    )
  }

  return (
    <div
      className="instagram-embed [&_blockquote]:m-0 [&_blockquote]:w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
