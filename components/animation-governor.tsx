"use client"

import { useEffect } from "react"

export default function AnimationGovernor() {
  useEffect(() => {
    const root = document.documentElement

    const apply = () => {
      if (document.hidden) {
        root.setAttribute("data-anim", "paused")
      } else {
        root.removeAttribute("data-anim")
      }

      // Save-Data / Reduced Motion hints
      const saveData = (navigator as any)?.connection?.saveData ? "1" : "0"
      root.setAttribute("data-save", saveData)
      const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      root.setAttribute("data-reduced-motion", prefersReduced ? "1" : "0")
    }

    apply()
    const onVis = () => apply()
    const onFocus = () => apply()
    const onBlur = () => apply()

    document.addEventListener("visibilitychange", onVis)
    window.addEventListener("focus", onFocus)
    window.addEventListener("blur", onBlur)

    return () => {
      document.removeEventListener("visibilitychange", onVis)
      window.removeEventListener("focus", onFocus)
      window.removeEventListener("blur", onBlur)
    }
  }, [])

  return null
}
