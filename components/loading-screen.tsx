"use client"

import { useState, useEffect, useRef } from "react"
import { Zap, Wifi, Globe, Signal, Router, Network } from "lucide-react"
import Image from "next/image"

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [currentTip, setCurrentTip] = useState(0)
  const [glitchText, setGlitchText] = useState("KCBNet.id")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)
  const runningRef = useRef(true)

  const loadingTips = [
    "🚀 Menyiapkan koneksi fiber optic berkecepatan tinggi...",
    "⚡ Mengoptimalkan bandwidth untuk pengalaman terbaik...",
    "🛡️ Mengaktifkan sistem keamanan jaringan...",
    "🌐 Menghubungkan ke server global...",
    "📡 Kalibrasi sinyal untuk stabilitas maksimal...",
  ]

  // Advanced particle system (optimized)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isPointerFine = window.matchMedia && window.matchMedia("(pointer: fine)").matches

    // Cap device pixel ratio to reduce fill rate
    const dpr = 1 // Math.min(window.devicePixelRatio || 1, 1.25)
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
      type: "dot" | "ring" | "line"
      angle: number
      speed: number
    }> = []

    // Reduced particle count and simpler types on mobile or reduced motion
    const particleCount = reduceMotion ? 12 : isPointerFine ? 36 : 18
    const types: Array<"dot" | "ring" | "line"> = reduceMotion ? ["dot"] : ["dot", "ring"]

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 3 + 0.8,
        opacity: Math.random() * 0.5 + 0.2,
        color: ["#3B82F6", "#0EA5E9", "#06B6D4", "#8B5CF6", "#F59E0B"][Math.floor(Math.random() * 5)],
        type: types[Math.floor(Math.random() * types.length)],
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 1 + 0.5,
      })
    }

    runningRef.current = true
    let last = performance.now()
    const frameInterval = 1000 / 30 // ~30 FPS

    const animate = () => {
      if (!runningRef.current) return
      const now = performance.now()
      const delta = now - last
      if (delta < frameInterval) {
        rafId.current = requestAnimationFrame(animate)
        return
      }
      last = now

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.angle += 0.02

        // Mild mouse interaction only when pointer is fine
        if (isPointerFine && !reduceMotion) {
          const dx = mousePosition.current.x - particle.x
          const dy = mousePosition.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy) || 1
          if (distance < 100) {
            const force = (100 - distance) / 100
            particle.vx += (dx / distance) * force * 0.01
            particle.vy += (dy / distance) * force * 0.01
            particle.opacity = Math.min(1, particle.opacity + 0.01)
          }
        }

        // Boundary wrap
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.strokeStyle = particle.color
        switch (particle.type) {
          case "dot":
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
            ctx.fill()
            break
          case "ring":
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size * 1.6, 0, Math.PI * 2)
            ctx.lineWidth = 1
            ctx.stroke()
            break
          default:
            // Skip line type in optimized mode
            break
        }
        ctx.restore()

        // Lightweight connection sampling (avoid O(n^2))
        if (!reduceMotion && index % 4 === 0) {
          for (let j = index + 1; j < Math.min(index + 8, particles.length); j += 2) {
            const other = particles[j]
            const dx2 = particle.x - other.x
            const dy2 = particle.y - other.y
            const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2)
            if (dist < 90) {
              ctx.save()
              ctx.globalAlpha = (1 - dist / 90) * 0.25
              ctx.strokeStyle = "#3B82F6"
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

      rafId.current = requestAnimationFrame(animate)
    }

    rafId.current = requestAnimationFrame(animate)

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerFine) return
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }
    if (isPointerFine) window.addEventListener("mousemove", handleMouseMove, { passive: true })

    const onResize = () => resize()
    window.addEventListener("resize", onResize)

    return () => {
      runningRef.current = false
      if (rafId.current) cancelAnimationFrame(rafId.current)
      window.removeEventListener("resize", onResize)
      if (isPointerFine) window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Stop animation when hidden
  useEffect(() => {
    if (!isVisible) {
      runningRef.current = false
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [isVisible])

  // Progress and tips management (lighter)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setIsVisible(false), 500)
          return 100
        }
        return Math.min(100, prev + (Math.random() * 8 + 4))
      })
    }, 220)

    const tipTimer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % loadingTips.length)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearInterval(tipTimer)
    }
  }, [])

  // Glitch effect for text (slower + optional reduce motion)
  useEffect(() => {
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    const originalText = "KCBNet.id"

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.97) {
        const glitchIndex = Math.floor(Math.random() * originalText.length)
        const glitchChar = glitchChars[Math.floor(Math.random() * glitchChars.length)]
        const glitched = originalText.substring(0, glitchIndex) + glitchChar + originalText.substring(glitchIndex + 1)
        setGlitchText(glitched)
        setTimeout(() => setGlitchText(originalText), 120)
      }
    }, 300)

    return () => clearInterval(glitchInterval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Optimized Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at center, #1e293b 0%, #020617 70%)" }}
      />

      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:60px_60px] animate-grid-move"></div>
      </div>

      {/* Scanning Lines (kept subtle) */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan-vertical opacity-40"></div>
        <div className="absolute h-full w-1 bg-gradient-to-b from-transparent via-sky-400 to-transparent animate-scan-horizontal opacity-30"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Advanced Logo Section - lighter */}
        <div className="relative mb-10 mt-6">
          {/* Outer Rotating Ring */}
          <div className="absolute inset-0 w-36 h-36 sm:w-44 sm:h-44 mx-auto">
            <div className="w-full h-full border-2 border-blue-400/25 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 border border-sky-400/15 rounded-full animate-spin-reverse"></div>
          </div>

          {/* Pulsing Glow Effect */}
          <div className="absolute inset-0 w-36 h-36 sm:w-44 sm:h-44 mx-auto bg-blue-500/15 rounded-full blur-lg animate-pulse-glow"></div>

          {/* Logo Container */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-blue-500 via-sky-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/40 animate-float-3d">
            <Image src="/images/company-logo.png" alt="KCBNet Logo" width={72} height={72} className="sm:w-24 sm:h-24" />

            {/* Logo Particles (reduced) */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full animate-logo-particles"
                  style={{ left: `${25 + i * 15}%`, top: `${25 + i * 10}%`, animationDelay: `${i * 0.25}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Glitch Brand Text */}
        <div className="mb-6">
          <h1 className="text-5xl sm:text-6xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-200 to-sky-300 bg-clip-text text-transparent animate-gradient-shift font-mono tracking-wider">
              {glitchText}
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-blue-400 font-semibold animate-typewriter">Connecting Your Future</p>
        </div>

        {/* Progress Section */}
        <div className="w-full max-w-lg mx-auto mb-10">
          <div className="flex justify-between text-sm text-slate-300 mb-3">
            <span className="animate-pulse">Initializing...</span>
            <span className="font-mono text-blue-400">{Math.round(progress)}%</span>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full bg-slate-800/50 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-slate-700/50">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-sky-500/15 rounded-full"></div>
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer-fast"></div>
              <div className="absolute right-0 top-0 w-3 h-full bg-white/30 blur-sm animate-pulse"></div>
            </div>
          </div>

          {/* Progress Particles (reduced) */}
          <div className="relative mt-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full animate-progress-particles"
                style={{ left: `${(progress / 100) * 100}%`, animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        </div>

        {/* Loading Tips */}
        <div className="mb-10 h-14 flex items-center justify-center">
          <p className="text-base sm:text-lg text-slate-300 animate-fade-in-out px-4 text-center leading-relaxed">
            {loadingTips[currentTip]}
          </p>
        </div>

        {/* Loading Icons (kept, simplified effects) */}
        <div className="flex justify-center space-x-10">
          {[
            { icon: Wifi, delay: "0s", color: "text-blue-400" },
            { icon: Globe, delay: "0.2s", color: "text-sky-400" },
            { icon: Zap, delay: "0.4s", color: "text-purple-400" },
            { icon: Signal, delay: "0.6s", color: "text-green-400" },
            { icon: Router, delay: "0.8s", color: "text-orange-400" },
            { icon: Network, delay: "1s", color: "text-pink-400" },
          ].map(({ icon: Icon, delay, color }, index) => (
            <div key={index} className="relative" style={{ animationDelay: delay }}>
              <div className={`${color}`}>
                <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
            </div>
          ))}
        </div>

        {/* Audio Visualizer Effect (reduced + desktop only animation) */}
        <div className="flex justify-center space-x-1 mt-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-blue-500 to-sky-400 rounded-full md:animate-audio-bars"
              style={{ height: `${Math.random() * 24 + 8}px`, animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      </div>

      {/* Corner Effects */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-blue-400/25 animate-corner-glow"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-sky-400/25 animate-corner-glow"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-400/25 animate-corner-glow"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-orange-400/25 animate-corner-glow"></div>
    </div>
  )
}
