import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

// Renders the first page of a PDF onto a canvas — a live "screenshot" of the
// resume so visitors can see it without having to download it first.
export default function PdfThumb({ url, width = 340 }) {
  const canvasRef = useRef(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    ;(async () => {
      try {
        const pdf = await pdfjsLib.getDocument({ url }).promise
        const page = await pdf.getPage(1)
        const unscaled = page.getViewport({ scale: 1 })
        const viewport = page.getViewport({ scale: width / unscaled.width })
        const canvas = canvasRef.current
        if (!canvas || cancelled) return
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
        if (!cancelled) setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [url, width])

  if (status === 'error') {
    return <p className="muted">couldn't render a preview — use the download link below.</p>
  }

  return (
    <div className="pdf-thumb">
      {status === 'loading' && <p className="muted">rendering preview…</p>}
      <canvas ref={canvasRef} style={{ display: status === 'ready' ? 'block' : 'none' }} />
    </div>
  )
}
