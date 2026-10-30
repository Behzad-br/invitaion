import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Calendar,
  CalendarPlus,
  Check,
  Clock,
  MapPin,
  Navigation,
  Share2,
} from 'lucide-react'
import CountdownTimer from './CountdownTimer'
import { EVENT_CONFIG } from '../config/eventConfig'
import { downloadEventICS } from '../utils/calendar'

gsap.registerPlugin(ScrollTrigger)

function DetailCard({ icon: Icon, label, primary, secondary }) {
  return (
    <div className="detail-card group relative h-full rounded-2xl border border-champagne/65 bg-gradient-to-b from-white via-white to-lavender/45 p-5 sm:p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-luxury">
      <div className="relative mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-full border border-champagne/75 bg-gradient-to-br from-white to-lavender/80 text-royal shadow-sm">
        <Icon className="h-5 w-5 text-royal" strokeWidth={1.9} />
      </div>

      <span className="block text-gold-shimmer font-decorative text-[11px] font-bold tracking-[0.26em] uppercase">
        {label}
      </span>

      <h3 className="mt-1.5 font-serif text-xl sm:text-[1.35rem] font-bold text-plum leading-snug">
        {primary}
      </h3>

      {secondary && (
        <p className="mt-1 font-sans text-xs text-royal/75">{secondary}</p>
      )}
    </div>
  )
}

export default function EventDetails({ onShareClick }) {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const actionsRef = useRef(null)
  const [calendarSaved, setCalendarSaved] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const ctx = gsap.context(() => {
      const cards = sectionRef.current.querySelectorAll('.detail-card')

      if (prefersReducedMotion) {
        gsap.set([headingRef.current, cards, actionsRef.current], {
          opacity: 1,
          y: 0,
        })
        return
      }

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      )

      gsap.fromTo(
        cards,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      )

      gsap.fromTo(
        actionsRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: actionsRef.current,
            start: 'top 94%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleCalendarDownload = () => {
    downloadEventICS()
    setCalendarSaved(true)
    setTimeout(() => setCalendarSaved(false), 3500)
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="ceremony-details-heading"
      className="relative px-4 py-7 sm:px-8 sm:py-9"
    >
      <div className="mx-auto mb-6 h-[1px] max-w-md bg-gradient-to-r from-transparent via-champagne/80 to-transparent" />

      <div ref={headingRef} className="text-center mb-6 sm:mb-7">
        <span className="inline-block text-gold-shimmer font-decorative text-[11px] sm:text-xs font-bold tracking-[0.26em] uppercase">
          Ceremony Schedule &amp; Venue
        </span>
        <h2
          id="ceremony-details-heading"
          className="mt-1 font-serif text-3xl sm:text-4xl font-extrabold text-royal-shimmer"
        >
          Event Details
        </h2>
      </div>

      {/* Three Crisp, Stationary Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <DetailCard
          icon={Calendar}
          label="DATE"
          primary={EVENT_CONFIG.dateDisplay}
          secondary="Official Karachi Launch"
        />
        <DetailCard
          icon={Clock}
          label="TIME"
          primary={EVENT_CONFIG.timeDisplay}
          secondary={EVENT_CONFIG.timezoneLabel}
        />
        <DetailCard
          icon={MapPin}
          label="VENUE"
          primary={EVENT_CONFIG.venueName}
          secondary="Abdullah Haroon Road, Karachi"
        />
      </div>

      {/* Live Countdown Timer */}
      <CountdownTimer />

      {/* Three Functional Action Buttons */}
      <div
        ref={actionsRef}
        className="mt-7 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto"
      >
        <button
          type="button"
          onClick={handleCalendarDownload}
          className="flex items-center justify-center gap-2.5 rounded-xl border border-champagne/65 bg-white hover:bg-lavender/60 active:scale-[0.99] px-4 py-3.5 text-sm font-semibold text-plum shadow-sm transition-all duration-200 min-h-[48px]"
        >
          {calendarSaved ? (
            <>
              <Check className="h-4 w-4 text-emerald-700 shrink-0" />
              <span className="text-emerald-800">Calendar (.ics) Downloaded</span>
            </>
          ) : (
            <>
              <CalendarPlus className="h-4 w-4 text-royal shrink-0" />
              <span>Add to Calendar</span>
            </>
          )}
        </button>

        <a
          href={EVENT_CONFIG.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 rounded-xl border border-champagne/65 bg-white hover:bg-lavender/60 active:scale-[0.99] px-4 py-3.5 text-sm font-semibold text-plum shadow-sm transition-all duration-200 min-h-[48px]"
        >
          <Navigation className="h-4 w-4 text-royal shrink-0" />
          <span>Get Directions</span>
        </a>

        <button
          type="button"
          onClick={onShareClick}
          className="foil-sheen flex items-center justify-center gap-2.5 rounded-xl border border-champagne/75 bg-gradient-to-r from-royal to-plum hover:from-royal-light hover:to-royal active:scale-[0.99] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 min-h-[48px]"
        >
          <Share2 className="h-4 w-4 text-champagne-light shrink-0" />
          <span>Share Invitation</span>
        </button>
      </div>
    </section>
  )
}
