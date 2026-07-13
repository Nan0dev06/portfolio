import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

// Renders a PDF's first page onto a canvas at the container's actual display
// size × devicePixelRatio — like a real PDF viewer, not a fixed-size bitmap
// stretched by CSS (which is what made it blurry when maximized/zoomed).
// Re-rasterizes whenever the container is resized, and reports the page's
// intrinsic aspect ratio so the window can size itself to match the page.
export default function PdfThumb({ url, onAspectRatio }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const pageRef = useRef(null)
  const renderTaskRef = useRef(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  const render = () => {
    const page = pageRef.current
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const cssWidth = wrap?.clientWidth
    if (!page || !cssWidth) return

    const unscaled = page.getViewport({ scale: 1 })
    const dpr = Math.min(window.devicePixelRatio || 1, 3)
    const viewport = page.getViewport({ scale: (cssWidth / unscaled.width) * dpr })
    canvas.width = viewport.width
    canvas.height = viewport.height
    canvas.style.width = `${cssWidth}px`
    canvas.style.height = `${cssWidth * (unscaled.height / unscaled.width)}px`

    renderTaskRef.current?.cancel()
    const task = page.render({ canvasContext: canvas.getContext('2d'), viewport })
    renderTaskRef.current = task
    task.promise
      .then(() => setStatus('ready'))
      .catch((err) => {
        if (err?.name !== 'RenderingCancelledException') setStatus('error')
      })
  }

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    ;(async () => {
      try {
        const pdf = await pdfjsLib.getDocument({ url }).promise
        const page = await pdf.getPage(1)
        if (cancelled) return
        pageRef.current = page
        const unscaled = page.getViewport({ scale: 1 })
        onAspectRatio?.(unscaled.height / unscaled.width)
        render()
      } catch {
        if (!cancelled) setStatus('error')
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  // Re-render at the new size whenever the container resizes (e.g. maximize).
  // Belt-and-suspenders: ResizeObserver alone is enough in a normal foreground
  // tab, but some environments throttle its callback the same way they
  // throttle rAF in backgrounded tabs, so a cheap width-polling fallback
  // guarantees the re-rasterize actually happens regardless.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    let lastWidth = wrap.clientWidth
    const maybeRender = () => {
      const w = wrap.clientWidth
      if (w && w !== lastWidth) {
        lastWidth = w
        render()
      }
    }
    const ro = new ResizeObserver(maybeRender)
    ro.observe(wrap)
    const poll = setInterval(maybeRender, 400)
    return () => {
      ro.disconnect()
      clearInterval(poll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status === 'error') {
    return <p className="muted">couldn't render a preview — use the download link below.</p>
  }

  return (
    <div className="pdf-thumb" ref={wrapRef}>
      {status === 'loading' && <p className="muted">rendering preview…</p>}
      <canvas ref={canvasRef} style={{ display: status === 'ready' ? 'block' : 'none' }} />
    </div>
  )
}
