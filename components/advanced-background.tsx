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
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      const particles: Particle[] = []
      const particleCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 12000))

      // Create different types of particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 6 + 2,
          opacity: Math.random() * 0.8 + 0.2,
          color: [
            "#3B82F6", // Blue
            "#0EA5E9", // Sky
            "#06B6D4", // Cyan
            "#8B5CF6", // Purple
            "#F59E0B", // Amber
            "#EF4444", // Red
            "#10B981", // Emerald
            "#F97316", // Orange
            "#EC4899", // Pink
          ][Math.floor(Math.random() * 9)],
          type: ["dot", "ring", "line", "triangle"][Math.floor(Math.random() * 4)] as
            | "dot"
            | "ring"
            | "line"
            | "triangle",
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 2 + 0.5,
          pulsePhase: Math.random() * Math.PI * 2,
        })
      }

      particlesRef.current = particles
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Update position dengan speed yang lebih lambat
        particle.x += particle.vx * 0.5
        particle.y += particle.vy * 0.5
        particle.angle += 0.01 // dari 0.02
        particle.pulsePhase += 0.02 // dari 0.03

        // Pulse effect
        const pulseScale = 1 + Math.sin(particle.pulsePhase) * 0.3

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 120) {
          // dari 200
          const force = (120 - distance) / 120
          particle.vx += (dx / distance) * force * 0.005 // dari 0.01
          particle.vy += (dy / distance) * force * 0.005
          particle.opacity = Math.min(1, particle.opacity + 0.02)
        }

        // Boundary check with wrapping
        if (particle.x < -50) particle.x = canvas.width + 50
        if (particle.x > canvas.width + 50) particle.x = -50
        if (particle.y < -50) particle.y = canvas.height + 50
        if (particle.y > canvas.height + 50) particle.y = -50

        // Draw particle based on type
        ctx.save()
        ctx.globalAlpha = particle.opacity * (0.6 + Math.sin(particle.pulsePhase) * 0.4)
        ctx.fillStyle = particle.color
        ctx.strokeStyle = particle.color

        switch (particle.type) {
          case "dot":
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size * pulseScale, 0, Math.PI * 2)
            ctx.fill()

            // Hapus bagian ini untuk performa lebih baik
            // ctx.shadowBlur = 20
            // ctx.shadowColor = particle.color
            ctx.fill()
            break

          case "ring":
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size * 2 * pulseScale, 0, Math.PI * 2)
            ctx.lineWidth = 2
            ctx.stroke()

            // Inner ring
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size * pulseScale, 0, Math.PI * 2)
            ctx.lineWidth = 1
            ctx.stroke()
            break

          case "line":
            const lineLength = particle.size * 4 * pulseScale
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(
              particle.x + Math.cos(particle.angle) * lineLength,
              particle.y + Math.sin(particle.angle) * lineLength,
            )
            ctx.lineWidth = 2
            ctx.stroke()
            break

          case "triangle":
            const triSize = particle.size * pulseScale
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y - triSize)
            ctx.lineTo(particle.x - triSize, particle.y + triSize)
            ctx.lineTo(particle.x + triSize, particle.y + triSize)
            ctx.closePath()
            ctx.stroke()
            break
        }
        ctx.restore()

        // Connect nearby particles with lines
        particlesRef.current.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            // dari 150
            // Hanya render setiap 3 frame
            if (index % 3 === 0) {
              ctx.save()
              ctx.globalAlpha = (1 - distance / 100) * 0.2 // dari 0.3
              ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - distance / 100) * 0.3})`
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.stroke()
              ctx.restore()
            }
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleResize = () => {
      resizeCanvas()
      createParticles()
    }

    resizeCanvas()
    createParticles()
    animate()

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      {/* Main Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 20% 50%, #1e293b 0%, #020617 40%, #0f172a 100%)",
        }}
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
