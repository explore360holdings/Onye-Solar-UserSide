"use client"

import { useEffect, useState } from "react"

const stats = [
  { number: 500, suffix: "+", label: "Happy Customers" },
  { number: 10, suffix: " Years", label: "Warranty Coverage" },
  { number: 95, suffix: "%", label: "Efficiency Rating" },
  { number: 200, suffix: "+", label: "Installations" },
]

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("stats-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="stats-section" className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-1000 delay-${index * 200} ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <CountUp end={stat.number} duration={2} start={isVisible} suffix={stat.suffix} />
              </div>
              <div className="text-white/80 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CountUp({ end, duration, start, suffix }: { end: number; duration: number; start: boolean; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [start, end, duration])

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}
