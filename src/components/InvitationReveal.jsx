import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import BrandHeader from './BrandHeader'
import { EVENT_CONFIG } from '../config/eventConfig'

export default function InvitationReveal({ isRevealed }) {
  const sectionRef = useRef(null)
  const headerWrapRef = useRef(null)
  const kickerRef = useRef(null)
  const lineLeftRef = useRef(null)
  const lineRightRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const flourishPathRef = useRef(null)
  const ornamentRef = useRef(null)
  const bodyCardRef = useRef(null)

  useEffect(() => {
    if (!isRevealed) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const ctx = gsap.context(() => {
      const logoItems = headerWrapRef.current
        ? headerWrapRef.current.querySelectorAll('.brand-logo-item')
        : []

      if (prefersReducedMotion) {
        gsap.set(
          [
            headerWrapRef.current,
            logoItems,
            kickerRef.current,
            lineLeftRef.current,
            lineRightRef.current,
            titleRef.current,
            subtitleRef.current,
            ornamentRef.current,
            bodyCardRef.current,
          ],
          { opacity: 1, y: 0, scaleX: 1 }
        )
        return
      }

      // Fast, smooth entrance — everything settles firmly in place with zero ongoing bounce
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      tl.fromTo(
        headerWrapRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.38 }
      )

      if (logoItems.length) {
        tl.fromTo(
          logoItems,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.36, stagger: 0.06 },
          '-=0.28'
        )
      }

      tl.fromTo(
        kickerRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35 },
        '-=0.22'
      )
        .fromTo(
          [lineLeftRef.current, lineRightRef.current],
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.42 },
          '-=0.3'
        )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.45 },
          '-=0.28'
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.42 },
          '-=0.3'
        )

      if (flourishPathRef.current) {
        const len = flourishPathRef.current.getTotalLength
          ? flourishPathRef.current.getTotalLength()
          : 260
        tl.fromTo(
          flourishPathRef.current,
          { strokeDasharray: len, strokeDashoffset: len, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, duration: 0.6 },
          '-=0.32'
        )
      }

      tl.fromTo(
        ornamentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35 },
        '-=0.42'
      ).fromTo(
        bodyCardRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45 },
        '-=0.3'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [isRevealed])

  return (
    <section
      id="invitation-hero"
      ref={sectionRef}
      aria-labelledby="invitation-main-heading"
      className="relative px-4 pt-5 pb-7 sm:px-8 sm:pt-8 sm:pb-10 lg:px-12 lg:pt-10 lg:pb-12 overflow-hidden scroll-mt-6"
    >
      {/* Subtle Stationary Silk Purple & Gold Corner Ribbons */}
      <svg
        className="pointer-events-none absolute -top-10 -right-12 w-64 sm:w-96 h-auto opacity-85"
        viewBox="0 0 400 260"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="silkCurveR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#652080" stopOpacity="0.18" />
            <stop offset="60%" stopColor="#35094F" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#EDE2FA" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M60,-20 C140,85 260,55 420,160 L420,-20 Z"
          fill="url(#silkCurveR)"
        />
        <path
          d="M45,-15 C135,95 255,65 415,175"
          stroke="#D9B56E"
          strokeOpacity="0.6"
          strokeWidth="1.3"
        />
      </svg>

      <svg
        className="pointer-events-none absolute -bottom-10 -left-12 w-60 sm:w-80 h-auto opacity-80"
        viewBox="0 0 360 220"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="silkCurveL" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#652080" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#EDE2FA" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-20,40 C95,120 200,95 310,230 L-20,230 Z"
          fill="url(#silkCurveL)"
        />
        <path
          d="M-15,30 C105,112 208,90 320,225"
          stroke="#D9B56E"
          strokeOpacity="0.55"
          strokeWidth="1.2"
        />
      </svg>

      {/* Three Genuine Institutional Logos (Stationary & Crisp) */}
      <div ref={headerWrapRef} className="relative z-10">
        <BrandHeader variant="purple" />
      </div>

      {/* Main Ceremonial Content (Clean, Steady, Uncluttered) */}
      <div className="relative z-10 mt-8 sm:mt-10 lg:mt-12 text-center max-w-2xl lg:max-w-3xl mx-auto px-1">
        {/* INVITATION Kicker */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 lg:mb-5">
          <span
            ref={lineLeftRef}
            className="h-[1.5px] w-10 sm:w-20 lg:w-28 origin-right bg-gradient-to-r from-transparent via-royal to-champagne"
          />
          <span
            ref={kickerRef}
            className="text-gold-shimmer font-decorative text-xs sm:text-base lg:text-lg font-bold tracking-[0.34em] uppercase"
          >
            {EVENT_CONFIG.kicker}
          </span>
          <span
            ref={lineRightRef}
            className="h-[1.5px] w-10 sm:w-20 lg:w-28 origin-left bg-gradient-to-l from-transparent via-royal to-champagne"
          />
        </div>

        {/* Main Heading in Playfair Display: Western Australian Curriculum */}
        <h1
          id="invitation-main-heading"
          ref={titleRef}
          className="font-serif font-extrabold text-[1.95rem] leading-[1.18] min-[375px]:text-[2.25rem] sm:text-5xl lg:text-6xl text-royal-shimmer tracking-tight"
        >
          {EVENT_CONFIG.title}
        </h1>

        {/* Clean Straight Subheading: Karachi Launch Ceremony */}
        <div ref={subtitleRef} className="mt-2.5 sm:mt-3.5 flex flex-col items-center">
          <p className="font-sans font-bold text-lg min-[375px]:text-xl sm:text-2xl text-royal tracking-wide px-2">
            {EVENT_CONFIG.subtitle}
          </p>

          <svg
            className="w-44 sm:w-60 h-4 mt-1 text-champagne"
            viewBox="0 0 260 22"
            fill="none"
            aria-hidden="true"
          >
            <path
              ref={flourishPathRef}
              d="M12,11 C65,2 105,19 130,11 C155,3 195,20 248,11"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Gold Ornamental Divider */}
        <div
          ref={ornamentRef}
          className="my-5 sm:my-6 lg:my-7 flex items-center justify-center gap-3"
          aria-hidden="true"
        >
          <span className="h-[1px] w-14 sm:w-24 lg:w-32 bg-gradient-to-r from-transparent to-champagne" />
          <span className="inline-block h-2 w-2 rotate-45 border border-champagne bg-champagne/35" />
          <span className="text-gold-shimmer font-decorative text-xs tracking-[0.26em] uppercase font-bold">
            2026
          </span>
          <span className="inline-block h-2 w-2 rotate-45 border border-champagne bg-champagne/35" />
          <span className="h-[1px] w-14 sm:w-24 lg:w-32 bg-gradient-to-l from-transparent to-champagne" />
        </div>

        {/* Official Invitation Body Text (Stationary & Easy to Read) */}
        <div
          ref={bodyCardRef}
          className="rounded-2xl border border-champagne/55 bg-gradient-to-b from-white via-lavender/20 to-white px-5 py-5 sm:px-8 sm:py-6 lg:px-12 lg:py-8 shadow-sm"
        >
          <p className="font-sans text-[15px] min-[375px]:text-base sm:text-lg lg:text-[1.18rem] leading-relaxed sm:leading-[1.85] text-plum/90 max-w-2xl mx-auto">
            <strong className="font-bold text-plum">
              The Western Australia Education Network (WAEN)
            </strong>{' '}
            invites you to the Official Karachi Launch Ceremony of the Western
            Australian Curriculum{' '}
            <strong className="font-bold text-plum">
              (Kindergarten to Year 12)
            </strong>
            , following successful launches in Islamabad and Lahore.
          </p>
        </div>
      </div>
    </section>
  )
}
