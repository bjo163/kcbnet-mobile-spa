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

  const loadingTips = [
    "🚀 Menyiapkan koneksi fiber optic berkecepatan tinggi...",
    "⚡ Mengoptimalkan bandwidth untuk pengalaman terbaik...",
    "🛡️ Mengaktifkan sistem keamanan jaringan...",
    "🌐 Menghubungkan ke server global...",
    "📡 Kalibrasi sinyal untuk stabilitas maksimal...",
  ]

  // Advanced particle system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

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

    // Create advanced particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: ["#3B82F6", "#0EA5E9", "#06B6D4", "#8B5CF6", "#F59E0B"][Math.floor(Math.random() * 5)],
        type: ["dot", "ring", "line"][Math.floor(Math.random() * 3)] as "dot" | "ring" | "line",
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 2 + 1,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.angle += 0.02

        // Mouse interaction
        const dx = mousePosition.current.x - particle.x
        const dy = mousePosition.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          const force = (150 - distance) / 150
          particle.vx += (dx / distance) * force * 0.02
          particle.vy += (dy / distance) * force * 0.02
          particle.opacity = Math.min(1, particle.opacity + 0.02)
        }

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particle based on type
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
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
            ctx.lineWidth = 1
            ctx.stroke()
            break
          case "line":
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(
              particle.x + Math.cos(particle.angle) * particle.size * 3,
              particle.y + Math.sin(particle.angle) * particle.size * 3,
            )
            ctx.lineWidth = 2
            ctx.stroke()
            break
        }
        ctx.restore()

        // Connect nearby particles
        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.save()
            ctx.globalAlpha = (1 - distance / 120) * 0.3
            ctx.strokeStyle = "#3B82F6"
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
            ctx.restore()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Progress and tips management
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setIsVisible(false), 800)
          return 100
        }
        return prev + Math.random() * 12
      })
    }, 200)

    const tipTimer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % loadingTips.length)
    }, 2000)

    return () => {
      clearInterval(timer)
      clearInterval(tipTimer)
    }
  }, [])

  // Glitch effect for text
  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    const originalText = "KCBNet.id"

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        let glitched = originalText
        const glitchIndex = Math.floor(Math.random() * originalText.length)
        const glitchChar = glitchChars[Math.floor(Math.random() * glitchChars.length)]
        glitched = originalText.substring(0, glitchIndex) + glitchChar + originalText.substring(glitchIndex + 1)
        setGlitchText(glitched)

        setTimeout(() => setGlitchText(originalText), 100)
      }
    }, 150)

    return () => clearInterval(glitchInterval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Advanced Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at center, #1e293b 0%, #020617 70%)" }}
      />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid-move"></div>
      </div>

      {/* Holographic Scanning Lines */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan-vertical opacity-60"></div>
        <div className="absolute h-full w-1 bg-gradient-to-b from-transparent via-sky-400 to-transparent animate-scan-horizontal opacity-40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Advanced Logo Section - FIXED POSITION */}
        <div className="relative mb-12 mt-8">
          {/* Outer Rotating Ring */}
          <div className="absolute inset-0 w-40 h-40 sm:w-48 sm:h-48 mx-auto">
            <div className="w-full h-full border-2 border-blue-400/30 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 border border-sky-400/20 rounded-full animate-spin-reverse"></div>
            <div className="absolute inset-4 border border-purple-400/10 rounded-full animate-spin-slow"></div>
          </div>

          {/* Pulsing Glow Effect */}
          <div className="absolute inset-0 w-40 h-40 sm:w-48 sm:h-48 mx-auto bg-blue-500/20 rounded-full blur-xl animate-pulse-glow"></div>

          {/* Logo Container - USING COMPANY LOGO */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-500 via-sky-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/50 animate-float-3d">
            <Image
              src="/images/company-logo.png"
              alt="KCBNet Logo"
              width={80}
              height={80}
              className="sm:w-24 sm:h-24 animate-logo-pulse"
            />

            {/* Logo Particles */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full animate-logo-particles"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${20 + i * 8}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Energy Rings */}
          <div className="absolute inset-0 w-40 h-40 sm:w-48 sm:h-48 mx-auto">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 border border-blue-400/20 rounded-full animate-energy-ring"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  transform: `scale(${1 + i * 0.2})`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Glitch Brand Text */}
        <div className="mb-8">
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-200 to-sky-300 bg-clip-text text-transparent animate-gradient-shift font-mono tracking-wider">
              {glitchText}
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-blue-400 font-semibold animate-typewriter">Connecting Your Future</p>
        </div>

        {/* Advanced Progress Section */}
        <div className="w-full max-w-lg mx-auto mb-12">
          <div className="flex justify-between text-sm text-slate-300 mb-4">
            <span className="animate-pulse">Initializing...</span>
            <span className="font-mono text-blue-400">{Math.round(progress)}%</span>
          </div>

          {/* Multi-layered Progress Bar */}
          <div className="relative w-full bg-slate-800/50 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-slate-700/50">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-sky-500/20 rounded-full"></div>

            {/* Main progress */}
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-fast"></div>

              {/* Pulse effect */}
              <div className="absolute right-0 top-0 w-4 h-full bg-white/40 blur-sm animate-pulse"></div>
            </div>

            {/* Scanning line */}
            <div className="absolute top-0 left-0 w-1 h-full bg-white/80 animate-scan-progress"></div>
          </div>

          {/* Progress Particles */}
          <div className="relative mt-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full animate-progress-particles"
                style={{
                  left: `${(progress / 100) * 100}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Loading Tips */}
        <div className="mb-12 h-16 flex items-center justify-center">
          <p className="text-base sm:text-lg text-slate-300 animate-fade-in-out px-4 text-center leading-relaxed">
            {loadingTips[currentTip]}
          </p>
        </div>

        {/* Advanced Loading Icons */}
        <div className="flex justify-center space-x-12">
          {[
            { icon: Wifi, delay: "0s", color: "text-blue-400" },
            { icon: Globe, delay: "0.2s", color: "text-sky-400" },
            { icon: Zap, delay: "0.4s", color: "text-purple-400" },
            { icon: Signal, delay: "0.6s", color: "text-green-400" },
            { icon: Router, delay: "0.8s", color: "text-orange-400" },
            { icon: Network, delay: "1s", color: "text-pink-400" },
          ].map(({ icon: Icon, delay, color }, index) => (
            <div key={index} className="relative group" style={{ animationDelay: delay }}>
              <div className={`animate-bounce-3d ${color}`}>
                <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              {/* Icon glow */}
              <div className={`absolute inset-0 ${color} opacity-50 blur-lg animate-pulse`}>
                <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              {/* Ripple effect */}
              <div className="absolute inset-0 border-2 border-current rounded-full animate-ripple opacity-30"></div>
            </div>
          ))}
        </div>

        {/* Audio Visualizer Effect */}
        <div className="flex justify-center space-x-1 mt-8">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-blue-500 to-sky-400 rounded-full animate-audio-bars"
              style={{
                height: `${Math.random() * 30 + 10}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner Effects */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-blue-400/30 animate-corner-glow"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-sky-400/30 animate-corner-glow"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-400/30 animate-corner-glow"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-orange-400/30 animate-corner-glow"></div>
    </div>
  )
}
