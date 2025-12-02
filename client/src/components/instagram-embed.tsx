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
        className="block border rounded-xl p-4 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 transition"
      >
        <p className="text-sm font-medium">Instagram embed blocked</p>
        <p className="text-xs opacity-60 mt-1">Click to view the post</p>
      </a>
    )
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
