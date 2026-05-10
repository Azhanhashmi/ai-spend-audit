import { useEffect, useRef } from 'react'

interface StarfieldProps {
  starColor?: string
  bgColor?: string
  speed?: number
  quantity?: number
  opacity?: number
}

export function Starfield({
  starColor = 'rgba(255,255,255,0.9)',
  bgColor = 'rgba(0,0,0,1)',
  speed = 0.5,
  quantity = 400,
  opacity = 1,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = 0, h = 0, cx = 0, cy = 0, z = 0

    interface Star { x: number; y: number; depth: number; px: number; py: number }
    let stars: Star[] = []

    function resize() {
      const parent = canvas!.parentElement
      if (!parent) return
      w = parent.clientWidth
      h = parent.clientHeight
      cx = w / 2
      cy = h / 2
      z = (w + h) / 2
      canvas!.width = w
      canvas!.height = h
    }

    function init() {
      resize()
      stars = Array.from({ length: quantity }, () => ({
        x: Math.random() * w * 2 - cx * 2,
        y: Math.random() * h * 2 - cy * 2,
        depth: Math.random() * z,
        px: 0,
        py: 0,
      }))
    }

    function frame() {
      ctx!.fillStyle = bgColor
      ctx!.fillRect(0, 0, w, h)
      ctx!.strokeStyle = starColor

      for (const s of stars) {
        s.px = cx + (s.x / s.depth) * (quantity / 2)
        s.py = cy + (s.y / s.depth) * (quantity / 2)

        s.depth -= speed
        if (s.depth <= 0) {
          s.x = Math.random() * w * 2 - cx * 2
          s.y = Math.random() * h * 2 - cy * 2
          s.depth = z
        }

        const nx = cx + (s.x / s.depth) * (quantity / 2)
        const ny = cy + (s.y / s.depth) * (quantity / 2)
        const size = (1 - s.depth / z) * 2

        if (s.px > 0 && s.px < w && s.py > 0 && s.py < h) {
          ctx!.globalAlpha = opacity * (1 - s.depth / z)
          ctx!.lineWidth = size
          ctx!.beginPath()
          ctx!.moveTo(s.px, s.py)
          ctx!.lineTo(nx, ny)
          ctx!.stroke()
        }
      }

      ctx!.globalAlpha = 1
      animId = requestAnimationFrame(frame)
    }

    init()
    frame()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [starColor, bgColor, speed, quantity, opacity])

  return (
    <div className="absolute inset-0 w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}