import React, { useEffect, useState } from 'react'
import { EVENT_CONFIG } from '../config/eventConfig'

function calculateTimeState() {
  const now = Date.now()
  const start = new Date(EVENT_CONFIG.isoStart).getTime()
  const end = new Date(EVENT_CONFIG.isoEnd).getTime()

  if (now >= end) {
    return { status: 'concluded', days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  if (now >= start && now < end) {
    return { status: 'live', days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const diff = Math.max(0, start - now)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { status: 'upcoming', days, hours, minutes, seconds }
}

export default function CountdownTimer() {
  const [timeState, setTimeState] = useState(() => calculateTimeState())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeState(calculateTimeState())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (timeState.status === 'live') {
    return (
      <div className="mt-7 rounded-2xl border border-champagne/65 bg-royal-silk px-5 py-4 text-center text-white shadow-card">
        <span className="inline-flex items-center gap-2 font-decorative text-xs tracking-[0.24em] text-champagne-light uppercase">
          <span className="h-2 w-2 rounded-full bg-champagne-light animate-ping" />
          Ceremony In Progress
        </span>
        <p className="font-serif text-lg sm:text-xl mt-1">
          The Karachi Launch Ceremony is currently underway at {EVENT_CONFIG.venueName}.
        </p>
      </div>
    )
  }

  if (timeState.status === 'concluded') {
    return (
      <div className="mt-7 rounded-2xl border border-champagne/55 bg-lavender/60 px-5 py-4 text-center text-plum shadow-sm">
        <span className="font-decorative text-xs tracking-[0.22em] text-royal uppercase font-bold">
          Official Event Status
        </span>
        <p className="font-serif text-lg sm:text-xl font-bold mt-1">
          The Karachi Launching Ceremony (12 November 2026) has concluded.
        </p>
      </div>
    )
  }

  const units = [
    { label: 'Days', value: timeState.days },
    { label: 'Hours', value: timeState.hours },
    { label: 'Minutes', value: timeState.minutes },
    { label: 'Seconds', value: timeState.seconds },
  ]

  return (
    <div
      className="mt-7 sm:mt-8"
      aria-label="Countdown until the Karachi Launching Ceremony"
    >
      <p className="text-center text-gold-shimmer font-decorative text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-3.5">
        Ceremony Commences In
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3.5 max-w-md mx-auto">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="relative rounded-2xl border border-champagne/65 bg-gradient-to-b from-white via-lavender/25 to-lavender/65 px-2 py-3.5 sm:py-4 text-center shadow-sm"
          >
            <div className="font-serif font-extrabold text-2xl min-[375px]:text-3xl sm:text-4xl text-royal-shimmer tabular-nums leading-none">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="mt-1.5 font-display text-[9px] min-[375px]:text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase text-plum/80">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
