"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Wifi,
  Phone,
  Mail,
  MapPin,
  Star,
  Zap,
  Shield,
  Users,
  Award,
  Network,
  Home,
  Building,
  Router,
  Wrench,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Clock,
  Target,
  Menu,
  X,
  Globe,
  Cpu,
  Signal,
  LogIn,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import LoadingScreen from "@/components/loading-screen"
import LiveChatWidget from "@/components/live-chat-widget"
import AdvancedBackground from "@/components/advanced-background"
import { ScrollAnimatedSection } from "@/components/scroll-animations"
import { PERSONIL } from "@/lib/personil"

// Data untuk paket internet
const internetPackages = [
  {
    id: 1,
    name: "Starter Home",
    speed: "10",
    price: "125",
    category: "rumah",
    fup: "Unlimited",
    features: ["Internet Unlimited", "CCTV Support", "24/7 Support", "Free Installation"],
    popular: true,
  },
  {
    id: 2,
    name: "Family Plus",
    speed: "20",
    price: "150",
    category: "rumah",
    fup: "Unlimited",
    features: ["Internet Unlimited", "CCTV Support", "24/7 Support", "Priority Support", "Free Installation"],
    popular: false,
  },
  {
    id: 3,
    name: "Power User",
    speed: "30",
    price: "185",
    category: "rumah",
    fup: "Unlimited",
    features: ["Internet Unlimited", "CCTV Support", "24/7 Support", "Gaming Optimized", "Free Installation"],
    popular: true,
  },
  {
    id: 4,
    name: "Business Pro",
    speed: "50",
    price: "250",
    category: "bisnis",
    fup: "Unlimited",
    features: [
      "Internet Unlimited",
      "CCTV Support",
      "24/7 Support",
      "Business Grade",
      "Static IP",
      "Free Installation",
    ],
    popular: false,
  },
  {
    id: 5,
    name: "Enterprise Max",
    speed: "100",
    price: "400",
    category: "bisnis",
    fup: "Unlimited",
    features: [
      "Internet Unlimited",
      "CCTV Support",
      "24/7 Priority Support",
      "Enterprise Grade",
      "Static IP",
      "Dedicated Bandwidth",
      "SLA Guarantee",
      "Free Installation",
    ],
    popular: true,
  },
]

// Data testimoni
const testimonials = [
  {
    id: 1,
    name: "Andi Pratama",
    role: "Content Creator",
    comment: "Internet super stabil buat streaming dan upload video. Gak pernah buffering lagi! Recommended banget!",
    rating: 5,
    avatar: "/young-man-smiling.png",
  },
  {
    id: 2,
    name: "Sarah Dewi",
    role: "Online Shop Owner",
    comment: "Sejak pakai KCBNet, toko online jadi lancar jaya. Customer service juga responsif banget.",
    rating: 5,
    avatar: "/young-professional-woman.png",
  },
  {
    id: 3,
    name: "Budi Santoso",
    role: "WFH Professional",
    comment: "Work from home jadi nyaman, video call HD tanpa lag. Worth it banget!",
    rating: 5,
    avatar: "/placeholder-g54z1.png",
  },
]

// Data FAQ
const faqData = [
  {
    question: "Apakah layanan tersedia di daerah saya?",
    answer:
      "Kami melayani wilayah Karawang dan sekitarnya. Untuk memastikan coverage area, silakan hubungi tim kami untuk survey lokasi gratis.",
  },
  {
    question: "Berapa lama proses aktivasi internet?",
    answer:
      "Proses aktivasi biasanya 1-3 hari kerja setelah survey lokasi selesai, tergantung kondisi infrastruktur di area Anda.",
  },
  {
    question: "Bagaimana sistem pembayarannya?",
    answer:
      "Pembayaran bulanan bisa melalui transfer bank, e-wallet, atau bayar langsung ke kantor. Tersedia juga paket tahunan dengan diskon khusus.",
  },
  {
    question: "Apakah ada biaya instalasi?",
    answer: "Saat ini kami sedang promo GRATIS biaya instalasi untuk semua paket! Promo terbatas, jadi buruan daftar.",
  },
  {
    question: "Bagaimana jika ada gangguan?",
    answer:
      "Tim support 24/7 siap membantu. Hubungi WhatsApp atau telepon kami, biasanya masalah bisa diselesaikan dalam 2-4 jam.",
  },
]

// Glitch text component
function GlitchText({ children, className = "" }: { children: string; className?: string }) {
  const [displayText, setDisplayText] = useState(children)

  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    const originalText = children

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.98) {
        let glitched = originalText
        const glitchIndex = Math.floor(Math.random() * originalText.length)
        const glitchChar = glitchChars[Math.floor(Math.random() * glitchChars.length)]
        glitched = originalText.substring(0, glitchIndex) + glitchChar + originalText.substring(glitchIndex + 1)
        setDisplayText(glitched)

        setTimeout(() => setDisplayText(originalText), 100)
      }
    }, 150)

    return () => clearInterval(glitchInterval)
  }, [children])

  return <span className={className}>{displayText}</span>
}

// Holographic card component
function HolographicCard({
  children,
  className = "",
  glowColor = "blue",
}: { children: React.ReactNode; className?: string; glowColor?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    // Throttle updates
    if (Date.now() - lastUpdate > 32) {
      // 30fps max
      const rect = cardRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      lastUpdate = Date.now()
    }
  }

  let lastUpdate = 0

  const glowColors = {
    blue: "rgba(59, 130, 246, 0.3)",
    purple: "rgba(139, 92, 246, 0.3)",
    green: "rgba(34, 197, 94, 0.3)",
    orange: "rgba(249, 115, 22, 0.3)",
    pink: "rgba(236, 72, 153, 0.3)",
  }

  return (
    <div ref={cardRef} className={`relative group ${className}`} onMouseMove={handleMouseMove}>
      {/* Holographic overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColors[glowColor as keyof typeof glowColors]} 0%, transparent 50%)`,
        }}
      />

      {/* Scanning lines */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan-card opacity-0 group-hover:opacity-100" />
      </div>

      {/* Corner frames */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-blue-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-sky-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-purple-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-orange-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {children}
    </div>
  )
}

// Audio visualizer component
function AudioVisualizer({ bars = 20, className = "" }: { bars?: number; className?: string }) {
  return (
    <div className={`flex items-end justify-center space-x-1 ${className}`}>
      {[...Array(bars)].map((_, i) => (
        <div
          key={i}
          className="bg-gradient-to-t from-blue-500 to-sky-400 rounded-full animate-audio-bars"
          style={{
            width: "2px",
            height: `${Math.random() * 20 + 5}px`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function KCBNetApp() {
  const [activeSection, setActiveSection] = useState("hero")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [packageFilter, setPackageFilter] = useState("semua")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  const filteredPackages =
    packageFilter === "semua" ? internetPackages : internetPackages.filter((pkg) => pkg.category === packageFilter)

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    setMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    // Throttle mouse updates
    if (Date.now() - lastMouseUpdate > 16) {
      // 60fps max
      setMousePosition({ x: e.clientX, y: e.clientY })
      lastMouseUpdate = Date.now()
    }
  }

  let lastMouseUpdate = 0

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 3000)

    const handleScroll = () => {
      const sections = ["hero", "about", "services", "packages", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <>
      {/* Loading Screen */}
      {!isLoaded && <LoadingScreen />}

      <div className="min-h-screen text-white overflow-x-hidden relative">
        {/* Advanced Background - Same as Loading Screen */}
        <AdvancedBackground />

        {/* Enhanced Mouse Follower */}
        <div
          className="fixed w-96 h-96 bg-gradient-radial from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none transition-all duration-700 ease-out z-10"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>

        {/* Futuristic Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <HolographicCard className="relative group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-sky-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-110 animate-logo-pulse">
                    <Image
                      src="/images/company-logo.png"
                      alt="KCBNet Logo"
                      width={24}
                      height={24}
                      className="sm:w-7 sm:h-7"
                    />
                  </div>
                </HolographicCard>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    <GlitchText>KCBNet.id</GlitchText>
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-400/80 font-medium animate-typewriter-slow">
                    Internet Tanpa Batas
                  </p>
                </div>
              </div>

              {/* Desktop Menu with Holographic Effects */}
              <div className="hidden lg:flex items-center space-x-8">
                {[
                  { id: "hero", label: "Beranda" },
                  { id: "about", label: "Tentang" },
                  { id: "services", label: "Layanan" },
                  { id: "packages", label: "Paket" },
                  { id: "contact", label: "Kontak" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative text-sm font-semibold transition-all duration-300 hover:scale-105 group ${
                      activeSection === item.id ? "text-blue-400" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-sky-400 rounded-full animate-pulse-glow"></div>
                    )}
                    <div className="absolute inset-0 bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </button>
                ))}

                {/* Stream Menu */}
                <a
                  href="https://flix.apps.avatar.net.id" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative text-sm font-semibold transition-all duration-300 hover:scale-105 group text-gray-300 hover:text-white"
                >
                  Stream
                  <div className="absolute inset-0 bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </a>

                {/* Login Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-sm font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 group relative"
                    >
                      <LogIn className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                      Masuk
                      <ChevronDown className="w-4 h-4 ml-2 transition-transform group-data-[state=open]:rotate-180" />
                      <div className="absolute inset-0 bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-xl">
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-blue-500/10 text-slate-300 hover:text-white transition-colors duration-300"
                      onClick={() => window.open('https://portal.kcbnet.id', '_blank')}
                    >
                      <Building className="w-4 h-4 mr-2" />
                      <span>Portal</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-blue-500/10 text-slate-300 hover:text-white transition-colors duration-300"
                      onClick={() => window.open('https://pelanggan.kcbnet.id', '_blank')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      <span>Pelanggan</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <HolographicCard>
                <Button
                  size="lg"
                  className="hidden lg:flex bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/25 border-0 font-semibold hover:scale-105 transition-all duration-300 group"
                >
                  <Phone className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  Hubungi Kami
                </Button>
              </HolographicCard>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white hover:bg-blue-500/10 p-2 hover:scale-110 transition-all duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>

            {/* Mobile Menu with Holographic Effect */}
            {mobileMenuOpen && (
              <div className="lg:hidden py-4 border-t border-slate-800/50 bg-slate-950/90 backdrop-blur-xl animate-slide-down">
                <div className="flex flex-col space-y-3">
                  {[
                    { id: "hero", label: "Beranda" },
                    { id: "about", label: "Tentang" },
                    { id: "services", label: "Layanan" },
                    { id: "packages", label: "Paket" },
                    { id: "contact", label: "Kontak" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-left text-base font-medium text-gray-300 hover:text-blue-400 transition-colors py-2 px-4 hover:bg-blue-500/10 rounded-lg group"
                    >
                      <span className="relative">
                        {item.label}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                      </span>
                    </button>
                  ))}
                  
                  {/* Stream Menu Mobile */}
                  <a
                    href="https://flix.apps.avatar.net.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-left text-base font-medium text-gray-300 hover:text-blue-400 transition-colors py-2 px-4 hover:bg-blue-500/10 rounded-lg group block"
                  >
                    <span className="relative">
                      Stream
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </span>
                  </a>
                  
                  {/* Mobile Login Menu */}
                  <div className="py-2 px-4">
                    <div className="text-base font-medium text-gray-300 mb-2">Masuk</div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => window.open('https://portal.kcbnet.id', '_blank')}
                        className="text-left text-sm text-slate-400 hover:text-blue-400 transition-colors py-1 hover:bg-blue-500/5 rounded group flex items-center"
                      >
                        <Building className="w-4 h-4 mr-2" />
                        Portal
                      </button>
                      <button
                        onClick={() => window.open('https://pelanggan.kcbnet.id', '_blank')}
                        className="text-left text-sm text-slate-400 hover:text-blue-400 transition-colors py-1 hover:bg-blue-500/5 rounded group flex items-center"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Pelanggan
                      </button>
                    </div>
                  </div>

                  <HolographicCard>
                    <Button
                      size="lg"
                      className="mt-3 mx-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/25 hover:scale-105 transition-all duration-300"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Hubungi Kami
                    </Button>
                  </HolographicCard>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section with Advanced Effects */}
        <section id="hero" className="relative pt-20 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 z-20">
          <div className="container mx-auto text-center relative">
            <div className="max-w-6xl mx-auto">
              {/* Professional Badge with Holographic Effect */}
              <ScrollAnimatedSection>
                <HolographicCard className="relative inline-block mb-12">
                  <Badge className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30 px-6 py-3 text-base font-semibold backdrop-blur-sm hover:scale-105 transition-all duration-300 animate-pulse-glow">
                    <Award className="w-5 h-5 mr-2 animate-spin-slow" />
                    <GlitchText>Provider Internet Terpercaya</GlitchText>
                  </Badge>
                </HolographicCard>
              </ScrollAnimatedSection>

              {/* Main Title with Advanced Effects */}
              <ScrollAnimatedSection>
                <div className="relative mb-12">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-white via-blue-100 to-sky-200 bg-clip-text text-transparent animate-gradient-shift font-mono">
                      <GlitchText>Koneksi Internet</GlitchText>
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent animate-gradient-shift">
                      <GlitchText>Masa Depan</GlitchText>
                    </span>
                    <div className="inline-flex items-center ml-3 sm:ml-6">
                      <HolographicCard>
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-sky-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 animate-float-3d hover:scale-110 transition-all duration-300">
                          <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-logo-pulse" />
                        </div>
                      </HolographicCard>
                    </div>
                  </h1>
                </div>
              </ScrollAnimatedSection>

              <ScrollAnimatedSection>
                <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-12 sm:mb-16 max-w-4xl mx-auto leading-relaxed font-medium px-4">
                  Nikmati pengalaman internet fiber optic berkualitas tinggi dengan teknologi terdepan.
                  <span className="text-blue-400 font-semibold animate-gradient-shift">
                    {" "}
                    Unlimited, stabil, dan support 24/7.
                  </span>
                </p>
              </ScrollAnimatedSection>

              {/* CTA Buttons with Holographic Effects */}
              <ScrollAnimatedSection>
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center mb-16 sm:mb-20 px-4">
                  <HolographicCard>
                    <Button
                      size="lg"
                      onClick={() => scrollToSection("packages")}
                      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 h-auto font-semibold shadow-xl shadow-blue-500/25 border-0 hover:scale-105 transition-all duration-300 w-full sm:w-auto group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-fast"></div>
                      <Globe className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      Lihat Paket Internet
                    </Button>
                  </HolographicCard>
                  <HolographicCard>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => scrollToSection("contact")}
                      className="border-2 border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:text-white text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 h-auto font-semibold backdrop-blur-sm bg-slate-900/30 hover:scale-105 transition-all duration-300 w-full sm:w-auto group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <MessageCircle className="w-5 h-5 mr-3 group-hover:bounce transition-all duration-300" />
                      Konsultasi Gratis
                    </Button>
                  </HolographicCard>
                </div>
              </ScrollAnimatedSection>

              {/* Stats Grid with Holographic Cards */}
              <ScrollAnimatedSection>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto px-4">
                  {[
                    { value: "1000+", label: "Pelanggan Aktif", icon: Users, color: "blue" },
                    { value: "99.9%", label: "Network Uptime", icon: Signal, color: "green" },
                    { value: "24/7", label: "Technical Support", icon: Clock, color: "purple" },
                    { value: "FREE", label: "Installation", icon: Award, color: "orange" },
                  ].map((stat, index) => (
                    <HolographicCard key={index} glowColor={stat.color} className="relative group">
                      <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 rounded-xl p-3 sm:p-4 text-center hover:bg-slate-800/30 hover:border-slate-700/30 transition-all duration-300 group-hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 relative overflow-hidden">
                        {/* Audio visualizer effect */}
                        <AudioVisualizer
                          bars={6}
                          className="absolute top-1 left-1 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                        />

                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-sky-400 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-all duration-300 animate-float-3d">
                          <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors duration-300 font-mono">
                          <GlitchText>{stat.value}</GlitchText>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-400 font-medium group-hover:text-slate-300 transition-colors duration-300 leading-tight">
                          {stat.label}
                        </div>
                      </div>
                    </HolographicCard>
                  ))}
                </div>
              </ScrollAnimatedSection>
            </div>
          </div>
        </section>

        {/* About Section with Futuristic Design */}
        <section id="about" className="relative py-16 sm:py-24 px-4 sm:px-6 z-20 bg-slate-900/10">
          <div className="container mx-auto relative">
            <ScrollAnimatedSection>
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent px-4 text-center font-mono">
                  <GlitchText>Tentang KCBNet</GlitchText>
                </h2>
                <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4 text-center">
                  CV. Kemilau Cahaya Barokah - Menyediakan solusi konektivitas internet terdepan untuk Indonesia digital
                </p>
                <AudioVisualizer bars={15} className="mt-8" />
              </div>
            </ScrollAnimatedSection>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <ScrollAnimatedSection>
                <div className="space-y-12">
                  <HolographicCard glowColor="blue">
                    <div className="group p-8 bg-slate-900/20 backdrop-blur-sm border border-slate-800/30 rounded-2xl hover:bg-slate-800/20 transition-all duration-300">
                      <h3 className="text-3xl font-bold mb-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300 font-mono">
                        <GlitchText>Misi Kami</GlitchText>
                      </h3>
                      <p className="text-slate-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                        Mendukung transformasi digital Indonesia dengan menyediakan layanan internet fiber optic
                        berkualitas tinggi, terjangkau, dan dapat diandalkan untuk semua kalangan masyarakat.
                      </p>
                    </div>
                  </HolographicCard>

                  <HolographicCard glowColor="orange">
                    <div className="group p-8 bg-slate-900/20 backdrop-blur-sm border border-slate-800/30 rounded-2xl hover:bg-slate-800/20 transition-all duration-300">
                      <h3 className="text-3xl font-bold mb-6 text-orange-400 group-hover:text-orange-300 transition-colors duration-300 font-mono">
                        <GlitchText>Visi Kami</GlitchText>
                      </h3>
                      <p className="text-slate-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                        Menjadi penyedia layanan internet terdepan yang menghubungkan setiap rumah dan bisnis dengan
                        koneksi internet stabil, cepat, dan berkualitas tinggi.
                      </p>
                    </div>
                  </HolographicCard>

                  <HolographicCard glowColor="purple">
                    <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 rounded-2xl p-8 hover:bg-slate-800/30 transition-all duration-300 group hover:scale-105">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-all duration-300 animate-float-3d">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 font-mono">
                            <GlitchText>Bapak Haryanto</GlitchText>
                          </div>
                          <div className="text-slate-400 font-medium group-hover:text-slate-300 transition-colors duration-300">
                            Direktur Operasional
                          </div>
                        </div>
                      </div>
                    </div>
                  </HolographicCard>
                </div>
              </ScrollAnimatedSection>

              <ScrollAnimatedSection>
                <div className="space-y-6">
                  {[
                    {
                      icon: Target,
                      title: "Customer Focus",
                      desc: "Kepuasan dan kepercayaan pelanggan adalah prioritas utama kami",
                      color: "blue",
                    },
                    {
                      icon: Shield,
                      title: "Advanced Technology",
                      desc: "Infrastruktur fiber optic terbaru dengan teknologi terdepan",
                      color: "green",
                    },
                    {
                      icon: Cpu,
                      title: "24/7 Monitoring",
                      desc: "Sistem monitoring real-time dan support teknis profesional",
                      color: "purple",
                    },
                  ].map((item, index) => (
                    <HolographicCard key={index} glowColor={item.color}>
                      <Card className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 hover:bg-slate-800/30 hover:border-slate-700/30 transition-all duration-300 group hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 relative overflow-hidden">
                        <CardContent className="p-8">
                          <div className="flex items-center space-x-6">
                            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-sky-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-float-3d">
                              <item.icon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300 font-mono">
                                <GlitchText>{item.title}</GlitchText>
                              </h4>
                              <p className="text-slate-300 group-hover:text-white transition-colors duration-300">
                                {item.desc}
                              </p>
                            </div>
                          </div>

                          {/* Audio visualizer in corner */}
                          <AudioVisualizer
                            bars={5}
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                          />
                        </CardContent>
                      </Card>
                    </HolographicCard>
                  ))}
                </div>
              </ScrollAnimatedSection>
            </div>
          </div>
        </section>

        {/* Personil Section with Slider */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6 z-20">
          <div className="container mx-auto relative">
            <ScrollAnimatedSection>
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent px-4 text-center font-mono">
                  <GlitchText>Tim Profesional</GlitchText>
                </h2>
                <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Bertemu dengan tim ahli yang siap memberikan layanan terbaik untuk kebutuhan internet Anda
                </p>
                <AudioVisualizer bars={12} className="mt-8" />
              </div>
            </ScrollAnimatedSection>

            {/* Personil Slider */}
            <ScrollAnimatedSection>
              <div className="relative">
                {/* Slider Container */}
                <div className="overflow-hidden">
                  <div className="flex space-x-6 animate-slide-infinite">
                    {[...PERSONIL, ...PERSONIL].map((person, index) => (
                      <HolographicCard key={`${person.slug}-${index}`} glowColor="blue">
                        <div className="flex-shrink-0 w-80 group">
                          <Card className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 hover:bg-slate-800/30 hover:border-slate-700/30 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 relative overflow-hidden">
                            <CardContent className="p-4">
                              {/* Audio visualizer background */}
                              <AudioVisualizer
                                bars={8}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                              />

                              {/* Full Image Display */}
                              <div className="relative">
                                <div className="w-full rounded-xl overflow-hidden shadow-xl shadow-blue-500/25 group-hover:scale-105 transition-all duration-300">
                                  <Image
                                    src={person.avatar}
                                    alt={`Personil ${person.name}`}
                                    width={320}
                                    height={200}
                                    className="w-full h-auto object-contain"
                                  />
                                </div>
                              </div>

                              {/* Optional: Link to detail (invisible overlay) */}
                              <Link href={`/personil/${person.slug}`} className="absolute inset-0 z-10">
                                <span className="sr-only">View {person.name} Profile</span>
                              </Link>
                            </CardContent>
                          </Card>
                        </div>
                      </HolographicCard>
                    ))}
                  </div>
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                  <HolographicCard>
                    <Link href="/personil">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-lg px-10 py-4 h-auto font-semibold shadow-xl shadow-blue-500/25 hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-fast"></div>
                        <Users className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        View All Team Members
                        <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </HolographicCard>
                </div>
              </div>
            </ScrollAnimatedSection>
          </div>
        </section>

        {/* Services Section with Advanced Effects */}
        <section id="services" className="relative py-16 sm:py-24 px-4 sm:px-6 z-20">
          <div className="container mx-auto relative">
            <ScrollAnimatedSection>
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent px-4 text-center font-mono">
                  <GlitchText>Layanan Kami</GlitchText>
                </h2>
                <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
                  Solusi konektivitas internet lengkap untuk berbagai kebutuhan digital Anda
                </p>
                <AudioVisualizer bars={10} className="mt-8" />
              </div>
            </ScrollAnimatedSection>

            {/* Services grid with holographic effects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  icon: Home,
                  title: "Internet Fiber Rumah",
                  desc: "Koneksi fiber optic berkecepatan tinggi untuk kebutuhan keluarga modern",
                  features: ["Unlimited Data", "Speed up to 100 Mbps", "Perfect for Streaming & Gaming"],
                  color: "blue",
                },
                {
                  icon: Building,
                  title: "Internet Business",
                  desc: "Solusi internet dedicated untuk produktivitas bisnis maksimal",
                  features: ["Dedicated Bandwidth", "Static IP Address", "Priority Technical Support"],
                  color: "green",
                },
                {
                  icon: Network,
                  title: "RT/RW Net Solution",
                  desc: "Solusi internet komunal untuk perumahan dan komplek residensial",
                  features: ["Cost Effective", "Easy Management", "Community Focused"],
                  color: "purple",
                },
                {
                  icon: Router,
                  title: "Network Installation",
                  desc: "Jasa instalasi dan konfigurasi jaringan profesional",
                  features: ["Free Site Survey", "Professional Installation", "Installation Warranty"],
                  color: "orange",
                },
                {
                  icon: Wrench,
                  title: "Technical Support",
                  desc: "Layanan pemeliharaan dan dukungan teknis 24/7",
                  features: ["Real-time Monitoring", "Fast Response Time", "Expert Technical Team"],
                  color: "pink",
                },
                {
                  icon: Shield,
                  title: "Security & CCTV",
                  desc: "Sistem keamanan terintegrasi dengan infrastruktur jaringan",
                  features: ["HD CCTV Quality", "Remote Monitoring", "Cloud Storage"],
                  color: "blue",
                },
              ].map((service, index) => (
                <ScrollAnimatedSection key={index}>
                  <HolographicCard glowColor={service.color}>
                    <Card className="group bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 hover:bg-slate-800/30 hover:border-slate-700/30 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 relative overflow-hidden">
                      <CardContent className="p-4 sm:p-6 text-center">
                        {/* Audio visualizer background */}
                        <AudioVisualizer
                          bars={8}
                          className="absolute top-2 left-2 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        />

                        <div className="relative mb-4">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-sky-400 rounded-xl flex items-center justify-center mx-auto shadow-xl shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-float-3d">
                            <service.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                          </div>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 font-mono">
                          <GlitchText>{service.title}</GlitchText>
                        </h3>
                        <p className="text-slate-300 mb-4 leading-relaxed group-hover:text-white transition-colors duration-300 text-sm">
                          {service.desc}
                        </p>
                        <ul className="space-y-1">
                          {service.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-slate-400 flex items-center justify-center group-hover:text-slate-300 transition-colors duration-300"
                            >
                              <CheckCircle className="w-3 h-3 text-blue-400 mr-2 flex-shrink-0 group-hover:text-blue-300 animate-pulse" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </HolographicCard>
                </ScrollAnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section with Futuristic Timeline */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6 z-20 bg-slate-900/10">
          <div className="container mx-auto relative">
            <ScrollAnimatedSection>
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent px-4 text-center font-mono">
                  <GlitchText>Proses Aktivasi</GlitchText>
                </h2>
                <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
                  Proses mudah dan cepat dalam 4 langkah sederhana untuk menikmati internet berkualitas tinggi
                </p>
                <AudioVisualizer bars={8} className="mt-8" />
              </div>
            </ScrollAnimatedSection>

            {/* Process grid with holographic timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  step: "01",
                  title: "Konsultasi",
                  desc: "Hubungi tim kami untuk konsultasi kebutuhan internet dan pilihan paket terbaik",
                  icon: MessageCircle,
                  color: "blue",
                },
                {
                  step: "02",
                  title: "Site Survey",
                  desc: "Tim teknis melakukan survey lokasi untuk memastikan kualitas sinyal optimal",
                  icon: MapPin,
                  color: "green",
                },
                {
                  step: "03",
                  title: "Installation",
                  desc: "Proses instalasi profesional dengan peralatan berkualitas tinggi dan standar industri",
                  icon: Wrench,
                  color: "purple",
                },
                {
                  step: "04",
                  title: "Activation",
                  desc: "Internet siap digunakan dengan konfigurasi optimal dan testing kualitas koneksi",
                  icon: Wifi,
                  color: "orange",
                },
              ].map((process, index) => (
                <ScrollAnimatedSection key={index}>
                  <HolographicCard glowColor={process.color}>
                    <div className="text-center group relative">
                      <div className="relative mb-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-sky-400 rounded-xl flex items-center justify-center mx-auto shadow-xl shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative animate-float-3d">
                          <span className="text-lg sm:text-xl font-bold text-white font-mono">
                            <GlitchText>{process.step}</GlitchText>
                          </span>
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                            <process.icon className="w-3 h-3 text-slate-800" />
                          </div>
                        </div>

                        {/* Connection line for desktop */}
                        {index < 3 && (
                          <div className="hidden sm:block absolute top-8 sm:top-10 left-full w-4 sm:w-6 h-0.5 bg-gradient-to-r from-blue-400 to-transparent"></div>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-400 transition-colors duration-300 font-mono">
                        <GlitchText>{process.title}</GlitchText>
                      </h3>
                      <p className="text-slate-300 leading-relaxed group-hover:text-white transition-colors duration-300 text-xs sm:text-sm">
                        {process.desc}
                      </p>

                      {/* Audio visualizer */}
                      <AudioVisualizer
                        bars={4}
                        className="mt-3 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                      />
                    </div>
                  </HolographicCard>
                </ScrollAnimatedSection>
              ))}
            </div>

            <ScrollAnimatedSection>
              <div className="text-center mt-16">
                <HolographicCard>
                  <Button
                    size="lg"
                    onClick={() => scrollToSection("contact")}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-lg px-10 py-4 h-auto font-semibold shadow-xl shadow-blue-500/25 hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-fast"></div>
                    Mulai Konsultasi
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </HolographicCard>
              </div>
            </ScrollAnimatedSection>
          </div>
        </section>

        {/* Packages Section with Holographic Cards */}
        <section id="packages" className="relative py-16 sm:py-24 px-4 sm:px-6 z-20">
          <div className="container mx-auto relative">
            <ScrollAnimatedSection>
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent px-4 text-center font-mono">
                  <GlitchText>Paket Internet</GlitchText>
                </h2>
                <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-12">
                  Pilih paket internet yang sesuai dengan kebutuhan dan anggaran Anda
                </p>

                {/* Package Filter with Holographic Effect */}
                <div className="flex justify-center space-x-4 mb-12">
                  {[
                    { id: "semua", label: "Semua Paket" },
                    { id: "rumah", label: "Residential" },
                    { id: "bisnis", label: "Business" },
                  ].map((filter) => (
                    <HolographicCard key={filter.id}>
                      <Button
                        variant={packageFilter === filter.id ? "default" : "outline"}
                        onClick={() => setPackageFilter(filter.id)}
                        className={
                          packageFilter === filter.id
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/25 border-0 hover:scale-105 transition-all duration-300 relative overflow-hidden"
                            : "border-2 border-slate-700/50 text-slate-300 hover:bg-slate-800/50 bg-slate-900/20 backdrop-blur-sm hover:scale-105 transition-all duration-300"
                        }
                        size="lg"
                      >
                        {packageFilter === filter.id && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-fast"></div>
                        )}
                        {filter.label}
                      </Button>
                    </HolographicCard>
                  ))}
                </div>

                <AudioVisualizer bars={35} className="mt-8" />
              </div>
            </ScrollAnimatedSection>

            {/* Packages grid with advanced holographic effects */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {filteredPackages.map((pkg, index) => (
                <ScrollAnimatedSection key={pkg.id}>
                  <HolographicCard glowColor={pkg.popular ? "orange" : "blue"}>
                    <Card
                      className={`relative group bg-slate-900/30 backdrop-blur-sm border-2 transition-all duration-500 hover:scale-105 hover:shadow-xl overflow-hidden ${
                        pkg.popular
                          ? "border-orange-500/50 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30"
                          : "border-slate-800/30 hover:border-slate-700/30 hover:shadow-blue-500/10"
                      }`}
                    >
                      {/* Audio visualizer background */}
                      <AudioVisualizer
                        bars={15}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      />

                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                          <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 text-xs font-bold shadow-lg animate-pulse-glow">
                            <Award className="w-3 h-3 mr-1 animate-spin-slow" />
                            <GlitchText>Popular</GlitchText>
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="text-center pb-4 pt-6 px-4">
                        <div className="relative mb-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-sky-400 rounded-xl flex items-center justify-center mx-auto shadow-xl shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-float-3d">
                            <Wifi className="w-7 h-7 text-white" />
                          </div>
                        </div>
                        <CardTitle className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 font-mono">
                          <GlitchText>{pkg.name}</GlitchText>
                        </CardTitle>
                        <div className="space-y-2">
                          <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 font-mono">
                            <GlitchText>{pkg.speed}</GlitchText> <span className="text-sm text-slate-400">Mbps</span>
                          </div>
                          <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                            Rp <GlitchText>{pkg.price}</GlitchText>K{" "}
                            <span className="text-xs text-slate-400">/month</span>
                          </div>
                          <div className="text-xs text-slate-400 font-medium">FUP: {pkg.fup}</div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4 px-4 pb-6">
                        <div className="space-y-2">
                          {pkg.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center text-xs text-slate-300 group-hover:text-white transition-colors duration-300"
                            >
                              <CheckCircle className="w-3 h-3 text-blue-400 mr-2 flex-shrink-0 group-hover:text-blue-300 animate-pulse" />
                              <span className="leading-tight">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <HolographicCard>
                            <Button
                              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg font-semibold hover:scale-105 transition-all duration-300 relative overflow-hidden text-sm py-2"
                              onClick={() => scrollToSection("contact")}
                              size="sm"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-fast"></div>
                              Choose Plan
                            </Button>
                          </HolographicCard>
                          <Button
                            variant="outline"
                            className="w-full border border-slate-700/50 text-slate-300 hover:bg-slate-800/50 bg-slate-900/20 backdrop-blur-sm hover:scale-105 transition-all duration-300 text-xs py-2"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </HolographicCard>
                </ScrollAnimatedSection>
              ))}
            </div>

            <ScrollAnimatedSection>
              <div className="text-center mt-16">
                <p className="text-slate-400 mb-6 text-lg">
                  *Harga sudah termasuk PPN 11%. Promo gratis instalasi terbatas!
                </p>
                <HolographicCard>
                  <Button
                    variant="outline"
                    onClick={() => scrollToSection("contact")}
                    className="border-2 border-orange-400/50 text-orange-400 hover:bg-orange-400/10 bg-orange-400/5 backdrop-blur-sm hover:scale-105 transition-all duration-300"
                    size="lg"
                  >
                    Custom Package Consultation
                  </Button>
                </HolographicCard>
              </div>
            </ScrollAnimatedSection>
          </div>
        </section>

        {/* Testimonials Section with Holographic Effects */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6 z-20 bg-slate-900/10">
          <div className="container mx-auto relative">
            <ScrollAnimatedSection>
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent px-4 text-center font-mono">
                  <GlitchText>Customer Reviews</GlitchText>
                </h2>
                <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
                  Dengar langsung dari pelanggan yang telah merasakan layanan berkualitas kami
                </p>
                <AudioVisualizer bars={25} className="mt-8" />
              </div>
            </ScrollAnimatedSection>

            {/* Testimonials grid with holographic cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {testimonials.map((testimonial, index) => (
                <ScrollAnimatedSection key={testimonial.id}>
                  <HolographicCard glowColor={["blue", "green", "purple"][index]}>
                    <Card className="group bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 hover:bg-slate-800/30 hover:border-slate-700/30 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 relative overflow-hidden">
                      <CardContent className="p-4 sm:p-6">
                        {/* Audio visualizer */}
                        <AudioVisualizer
                          bars={6}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        />

                        <div className="flex items-center space-x-4 mb-4">
                          <div className="relative">
                            <Image
                              src={testimonial.avatar || "/placeholder.svg"}
                              alt={testimonial.name}
                              width={60}
                              height={60}
                              className="rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300 font-mono">
                              <GlitchText>{testimonial.name}</GlitchText>
                            </h4>
                            <p className="text-slate-400 font-medium group-hover:text-slate-300 transition-colors duration-300 text-sm">
                              {testimonial.role}
                            </p>
                            <div className="flex space-x-1 mt-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 text-yellow-400 fill-current group-hover:scale-125 transition-transform duration-300 animate-pulse"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-300 italic leading-relaxed group-hover:text-white transition-colors duration-300 text-sm">
                          "{testimonial.comment}"
                        </p>
                      </CardContent>
                    </Card>
                  </HolographicCard>
                </ScrollAnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section with Futuristic Accordion */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6 z-20">
          <div className="container mx-auto max-w-4xl relative">
            <ScrollAnimatedSection>
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent px-4 text-center font-mono">
                  <GlitchText>Frequently Asked Questions</GlitchText>
                </h2>
                <p className="text-lg sm:text-xl text-slate-300">
                  Pertanyaan yang sering ditanyakan seputar layanan kami
                </p>
                <AudioVisualizer bars={30} className="mt-8" />
              </div>
            </ScrollAnimatedSection>

            <ScrollAnimatedSection>
              <Accordion type="single" collapsible className="space-y-6">
                {faqData.map((faq, index) => (
                  <HolographicCard key={index} glowColor={["blue", "green", "purple", "orange", "pink"][index]}>
                    <AccordionItem
                      value={`item-${index}`}
                      className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 rounded-2xl px-8 hover:bg-slate-800/30 transition-all duration-300 group hover:shadow-lg hover:shadow-blue-500/10 relative overflow-hidden"
                    >
                      <AccordionTrigger className="text-left hover:text-blue-400 text-lg font-semibold py-6 group-hover:text-blue-300 transition-colors duration-300 font-mono">
                        <GlitchText>{faq.question}</GlitchText>
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-300 text-base leading-relaxed pb-6 group-hover:text-white transition-colors duration-300">
                        {faq.answer}
                      </AccordionContent>

                      {/* Audio visualizer in corner */}
                      <AudioVisualizer
                        bars={6}
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      />
                    </AccordionItem>
                  </HolographicCard>
                ))}
              </Accordion>
            </ScrollAnimatedSection>

            <ScrollAnimatedSection>
              <div className="text-center mt-16">
                <p className="text-slate-300 mb-6 text-lg">Masih ada pertanyaan lain?</p>
                <HolographicCard>
                  <Button
                    onClick={() => scrollToSection("contact")}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-xl shadow-blue-500/25 hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-fast"></div>
                    <MessageCircle className="w-5 h-5 mr-3 group-hover:bounce transition-all duration-300" />
                    Contact Customer Service
                  </Button>
                </HolographicCard>
              </div>
            </ScrollAnimatedSection>
          </div>
        </section>

        {/* Contact Section with Advanced Holographic Forms */}
        <section id="contact" className="relative py-16 sm:py-24 px-4 sm:px-6 z-20 bg-slate-900/10">
          <div className="container mx-auto relative">
            <ScrollAnimatedSection>
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent px-4 text-center font-mono">
                  <GlitchText>Hubungi Kami</GlitchText>
                </h2>
                <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
                  Tim profesional kami siap melayani Anda 24/7. Pilih cara yang paling nyaman untuk menghubungi kami
                </p>
                <AudioVisualizer bars={40} className="mt-8" />
              </div>
            </ScrollAnimatedSection>

            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info with Holographic Cards */}
              <ScrollAnimatedSection>
                <div className="space-y-8">
                  <HolographicCard glowColor="blue">
                    <Card className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 hover:bg-slate-800/30 transition-all duration-300 group hover:shadow-xl hover:shadow-blue-500/10 relative overflow-hidden">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold mb-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300 font-mono">
                          <GlitchText>Contact Information</GlitchText>
                        </h3>

                        <div className="space-y-6">
                          {[
                            {
                              icon: Phone,
                              title: "Phone",
                              value: "+62 859-2502-1988",
                              desc: "Monday - Sunday, 24 hours",
                              color: "blue",
                            },
                            {
                              icon: MessageCircle,
                              title: "WhatsApp",
                              value: "+62 859-2502-1988",
                              desc: "Fast response, 24/7 available",
                              color: "green",
                            },
                            {
                              icon: Mail,
                              title: "Email",
                              value: "kcb.n3t@gmail.com",
                              desc: "Response within 2-4 hours",
                              color: "purple",
                            },
                            {
                              icon: MapPin,
                              title: "Office Address",
                              value:
                                "Perum Citra Permata Regency\nJL. Berlian 2 no 84, RT02/RW14\nCikampek Utara, Karawang\nJawa Barat",
                              desc: "Visit our office",
                              color: "orange",
                            },
                          ].map((contact, index) => (
                            <HolographicCard key={index} glowColor={contact.color}>
                              <div className="flex items-start space-x-6 p-6 bg-slate-800/20 rounded-2xl border border-slate-700/20 hover:bg-slate-700/20 transition-all duration-300 group hover:scale-105 relative overflow-hidden">
                                {/* Audio visualizer */}
                                <AudioVisualizer
                                  bars={4}
                                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                />

                                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-sky-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-float-3d">
                                  <contact.icon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                  <div className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors duration-300 font-mono">
                                    <GlitchText>{contact.title}</GlitchText>
                                  </div>
                                  <div className="text-slate-300 mb-2 whitespace-pre-line group-hover:text-white transition-colors duration-300">
                                    {contact.value}
                                  </div>
                                  <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                                    {contact.desc}
                                  </div>
                                </div>
                              </div>
                            </HolographicCard>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </HolographicCard>

                  <HolographicCard glowColor="orange">
                    <Card className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 hover:bg-slate-800/30 transition-all duration-300 group hover:shadow-xl hover:shadow-blue-500/10 relative overflow-hidden">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold mb-6 text-orange-400 group-hover:text-orange-300 transition-colors duration-300 font-mono">
                          <GlitchText>Coverage Area</GlitchText>
                        </h3>
                        <p className="text-slate-300 mb-6 text-lg group-hover:text-white transition-colors duration-300">
                          Wilayah yang sudah terjangkau layanan kami:
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            "Karawang Barat",
                            "Karawang Timur",
                            "Cikampek",
                            "Telukjambe",
                            "Klari",
                            "Rengasdengklok",
                          ].map((area) => (
                            <div
                              key={area}
                              className="flex items-center text-slate-300 group-hover:text-white transition-colors duration-300"
                            >
                              <CheckCircle className="w-5 h-5 text-blue-400 mr-3 group-hover:text-blue-300 group-hover:scale-125 transition-all duration-300 animate-pulse" />
                              {area}
                            </div>
                          ))}
                        </div>
                        <p className="text-slate-400 mt-6 group-hover:text-slate-300 transition-colors duration-300">
                          Area belum tersedia? Hubungi kami untuk info ekspansi!
                        </p>

                        {/* Audio visualizer */}
                        <AudioVisualizer
                          bars={12}
                          className="mt-6 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                        />
                      </CardContent>
                    </Card>
                  </HolographicCard>
                </div>
              </ScrollAnimatedSection>

              {/* Contact Form with Holographic Effects */}
              <ScrollAnimatedSection>
                <HolographicCard glowColor="purple">
                  <Card className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 hover:bg-slate-800/30 transition-all duration-300 group hover:shadow-xl hover:shadow-blue-500/10 relative overflow-hidden">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold mb-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300 font-mono">
                        <GlitchText>Send Message</GlitchText>
                      </h3>

                      <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-base font-semibold text-slate-300 mb-3 font-mono">
                              Full Name
                            </label>
                            <HolographicCard>
                              <input
                                type="text"
                                className="w-full px-6 py-4 bg-slate-800/30 border border-slate-700/30 rounded-xl text-white focus:border-blue-400 focus:outline-none backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/30 focus:scale-105 font-mono"
                                placeholder="Enter your full name"
                              />
                            </HolographicCard>
                          </div>
                          <div>
                            <label className="block text-base font-semibold text-slate-300 mb-3 font-mono">
                              Email/WhatsApp
                            </label>
                            <HolographicCard>
                              <input
                                type="text"
                                className="w-full px-6 py-4 bg-slate-800/30 border border-slate-700/30 rounded-xl text-white focus:border-blue-400 focus:outline-none backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/30 focus:scale-105 font-mono"
                                placeholder="Email or WhatsApp number"
                              />
                            </HolographicCard>
                          </div>
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-slate-300 mb-3 font-mono">
                            Message Type
                          </label>
                          <HolographicCard>
                            <select className="w-full px-6 py-4 bg-slate-800/30 border border-slate-700/30 rounded-xl text-white focus:border-blue-400 focus:outline-none backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/30 focus:scale-105 font-mono">
                              <option value="">Select message type</option>
                              <option value="subscription">New Subscription</option>
                              <option value="support">Technical Support</option>
                              <option value="inquiry">General Inquiry</option>
                            </select>
                          </HolographicCard>
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-slate-300 mb-3 font-mono">Message</label>
                          <HolographicCard>
                            <textarea
                              rows={5}
                              className="w-full px-6 py-4 bg-slate-800/30 border border-slate-700/30 rounded-xl text-white focus:border-blue-400 focus:outline-none backdrop-blur-sm transition-all duration-300 resize-none hover:bg-slate-700/30 focus:scale-105 font-mono"
                              placeholder="Write your message here..."
                            ></textarea>
                          </HolographicCard>
                        </div>

                        <HolographicCard>
                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-xl shadow-blue-500/25 font-semibold hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                            size="lg"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-fast"></div>
                            <MessageCircle className="w-5 h-5 mr-3 group-hover:bounce transition-all duration-300" />
                            Send Message
                          </Button>
                        </HolographicCard>
                      </form>

                      {/* Audio visualizer */}
                      <AudioVisualizer
                        bars={20}
                        className="mt-8 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                      />
                    </CardContent>
                  </Card>
                </HolographicCard>
              </ScrollAnimatedSection>
            </div>
          </div>
        </section>

        {/* Futuristic Footer */}
        <footer className="relative py-12 sm:py-16 px-4 sm:px-6 z-20 bg-slate-950/50 border-t border-slate-800/30">
          <div className="container mx-auto relative">
            <ScrollAnimatedSection>
              {/* Footer grid with holographic effects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
                <HolographicCard glowColor="blue">
                  <div className="group">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 hover:scale-110 transition-all duration-300 animate-float-3d">
                        <Image src="/images/company-logo.png" alt="KCBNet Logo" width={28} height={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white font-mono">
                          <GlitchText>KCBNet.id</GlitchText>
                        </h3>
                        <p className="text-sm text-blue-400 animate-typewriter-slow">Internet Tanpa Batas</p>
                      </div>
                    </div>
                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                      Penyedia layanan internet fiber optic terpercaya untuk rumah dan bisnis Anda.
                    </p>
                    <AudioVisualizer
                      bars={8}
                      className="mt-4 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                    />
                  </div>
                </HolographicCard>

                {[
                  {
                    title: "Services",
                    items: ["Fiber Internet Home", "Business Internet", "RT/RW Net", "CCTV & Security"],
                    color: "green",
                  },
                  {
                    title: "Company",
                    items: ["About Us", "Careers", "Blog", "Partnership"],
                    color: "purple",
                  },
                  {
                    title: "Support",
                    items: ["Customer Service", "FAQ", "Network Status", "Documentation"],
                    color: "orange",
                  },
                ].map((section, index) => (
                  <HolographicCard key={index} glowColor={section.color}>
                    <div className="group">
                      <h4 className="text-lg font-bold text-white mb-6 font-mono">
                        <GlitchText>{section.title}</GlitchText>
                      </h4>
                      <ul className="space-y-3 text-slate-400">
                        {section.items.map((item, idx) => (
                          <li
                            key={idx}
                            className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 transition-transform duration-300 group-hover:text-slate-300"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                      <AudioVisualizer
                        bars={6}
                        className="mt-4 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      />
                    </div>
                  </HolographicCard>
                ))}
              </div>
            </ScrollAnimatedSection>

            <ScrollAnimatedSection>
              <div className="border-t border-slate-800/30 mt-12 pt-8 text-center relative">
                <p className="text-slate-400 font-mono">© 2024 CV. Kemilau Cahaya Barokah. All rights reserved.</p>
                <AudioVisualizer bars={50} className="mt-4 opacity-30" />
              </div>
            </ScrollAnimatedSection>
          </div>
        </footer>

        {/* Live Chat Widget */}
        <LiveChatWidget />
      </div>
    </>
  )
}
