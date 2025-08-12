"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  type: "dot" | "ring" | "line" | "triangle"
  angle: number
  speed: number
  pulsePhase: number
}

export default function AdvancedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | undefined>(undefined)
  const runningRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isPointerFine = window.matchMedia && window.matchMedia("(pointer: fine)").matches

    // Cap DPR to reduce fill rate
    const dpr = 1 // Math.min(window.devicePixelRatio || 1, 1.25)
    const resizeCanvas = () => {
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const createParticles = () => {
      const particles: Particle[] = []
      const baseCount = reduceMotion ? 16 : 40
      const particleCount = Math.min(baseCount, Math.floor((canvas.width * canvas.height) / 20000))

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 5 + 1.5,
          opacity: Math.random() * 0.6 + 0.2,
          color: [
            "#3B82F6",
            "#0EA5E9",
            "#06B6D4",
            "#8B5CF6",
            "#F59E0B",
            "#10B981",
            "#F97316",
            "#EC4899",
          ][Math.floor(Math.random() * 8)],
          type: reduceMotion ? "dot" : (["dot", "ring", "triangle"][Math.floor(Math.random() * 3)] as
            | "dot"
            | "ring"
            | "triangle"),
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 1.5 + 0.4,
          pulsePhase: Math.random() * Math.PI * 2,
        })
      }

      particlesRef.current = particles
    }

    runningRef.current = true
    resizeCanvas()
    createParticles()

    let last = performance.now()
    const frameInterval = 1000 / 30 // ~30 FPS

    const animate = () => {
      if (!runningRef.current || document.hidden) return
      const now = performance.now()
      const delta = now - last
      if (delta < frameInterval) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      last = now

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Update position slower
        particle.x += particle.vx * 0.5
        particle.y += particle.vy * 0.5
        particle.angle += 0.01
        particle.pulsePhase += 0.02

        const pulseScale = 1 + Math.sin(particle.pulsePhase) * 0.25

        // Mouse interaction (desktop only)
        if (isPointerFine && !reduceMotion) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy) || 1
          if (distance < 100) {
            const force = (100 - distance) / 100
            particle.vx += (dx / distance) * force * 0.004
            particle.vy += (dy / distance) * force * 0.004
            particle.opacity = Math.min(1, particle.opacity + 0.01)
          }
        }

        // Wrap
        if (particle.x < -50) particle.x = canvas.width + 50
        if (particle.x > canvas.width + 50) particle.x = -50
        if (particle.y < -50) particle.y = canvas.height + 50
        if (particle.y > canvas.height + 50) particle.y = -50

        // Draw
        ctx.save()
        ctx.globalAlpha = particle.opacity * (0.7 + Math.sin(particle.pulsePhase) * 0.3)
        ctx.fillStyle = ctx.strokeStyle = particle.color
        switch (particle.type) {
          case "dot":
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size * pulseScale, 0, Math.PI * 2)
            ctx.fill()
            break
          case "ring":
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size * 1.8 * pulseScale, 0, Math.PI * 2)
            ctx.lineWidth = 1
            ctx.stroke()
            break
          case "triangle":
            const t = particle.size * pulseScale
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y - t)
            ctx.lineTo(particle.x - t, particle.y + t)
            ctx.lineTo(particle.x + t, particle.y + t)
            ctx.closePath()
            ctx.stroke()
            break
          default:
            break
        }
        ctx.restore()

        // Sampled connections (avoid O(n^2))
        if (!reduceMotion && index % 3 === 0) {
          for (let j = index + 1; j < Math.min(index + 8, particlesRef.current.length); j += 2) {
            const other = particlesRef.current[j]
            const dx = particle.x - other.x
            const dy = particle.y - other.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 90) {
              ctx.save()
              ctx.globalAlpha = (1 - dist / 90) * 0.2
              ctx.strokeStyle = "rgba(59, 130, 246, 0.3)"
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(other.x, other.y)
              ctx.stroke()
              ctx.restore()
            }
          }
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerFine) return
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    if (isPointerFine) window.addEventListener("mousemove", handleMouseMove, { passive: true })

    const handleResize = () => {
      resizeCanvas()
      createParticles()
    }
    window.addEventListener("resize", handleResize)

    const onVis = () => {
      if (document.hidden) {
        runningRef.current = false
        if (animationRef.current) cancelAnimationFrame(animationRef.current)
      } else {
        runningRef.current = true
        last = performance.now()
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    document.addEventListener("visibilitychange", onVis)

    return () => {
      runningRef.current = false
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", handleResize)
      if (isPointerFine) window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [])

  return (
    <>
      {/* Main Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(circle at 20% 50%, #1e293b 0%, #020617 40%, #0f172a 100%)" }}
      />

      {/* Additional Background Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] animate-grid-move opacity-40"></div>

        {/* Holographic Scanning Lines */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-scan-vertical-ultra-slow"></div>
          <div className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-sky-400/15 to-transparent animate-scan-horizontal-ultra-slow"></div>
        </div>

        {/* Corner Frame Effects */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-blue-400/20 animate-corner-glow"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-sky-400/20 animate-corner-glow"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-purple-400/20 animate-corner-glow"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-orange-400/20 animate-corner-glow"></div>

        {/* Floating Geometric Elements */}
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-blue-500/8 to-sky-500/8 rounded-full blur-3xl animate-float-3d"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full blur-3xl animate-float-3d-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-500/6 to-amber-500/6 rounded-full blur-2xl animate-float-3d-slow"></div>

        {/* Additional Geometric Shapes */}
        <div className="absolute top-20 right-20 w-4 h-4 border-2 border-blue-400/30 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-32 left-32 w-6 h-6 border-2 border-purple-400/30 animate-bounce-3d"></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 border border-orange-400/30 rounded-full animate-pulse-glow"></div>

        {/* Radial Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-slate-950/20 to-slate-950/60"></div>
      </div>
    </>
  )
}
