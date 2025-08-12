"use client"

import type React from "react"
import { useEffect, useRef } from "react"

export function useScrollAnimation() {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up", "is-inview")
            entry.target.classList.remove("opacity-0", "translate-y-8")
          } else {
            entry.target.classList.remove("is-inview")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return elementRef
}

export function ScrollAnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollAnimation()

  return (
    <div ref={ref} className={`opacity-0 translate-y-8 transition-all duration-700 ease-out pause-offscreen ${className}`}>
      {children}
    </div>
  )
}
