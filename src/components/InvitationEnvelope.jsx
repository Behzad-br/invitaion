import React, { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Calendar, MapPin, Sparkles } from 'lucide-react'
import { EVENT_CONFIG } from '../config/eventConfig'

export default function InvitationEnvelope({
  onOpenComplete,
  onSkip,
  onStartMusic,
}) {
  const stageRef = useRef(null)
  const desktopTopBarRef = useRef(null)
  const envelopeWrapRef = useRef(null)
  const flapRef = useRef(null)
  const cardRef = useRef(null)
  const innerGlowRef = useRef(null)
  const sealLeftRef = useRef(null)
  const sealRightRef = useRef(null)
  const sealGlowRef = useRef(null)
  const controlsRef = useRef(null)
  const captionRef = useRef(null)
  const burstContainerRef = useRef(null)
  const timelineRef = useRef(null)

  const [isOpening, setIsOpening] = useState(false)

  const [waenLogo, govWaLogo, scsaLogo] = EVENT_CONFIG.logos

  // Subtle twinkling starlight glints in background
  const ambientParticles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: `${6 + ((i * 19) % 88)}%`,
        top: `${8 + ((i * 23) % 82)}%`,
        size: 3 + (i % 3) * 1.5,
        isGold: i % 3 !== 0,
        delay: (i * 0.35) % 3,
      })),
    []
  )

  // Dispersion particles when seal breaks
  const burstParticles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2
        const distance = 68 + (i % 4) * 24
        return {
          id: i,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance - 14,
          size: 4 + (i % 3) * 2,
          isGold: i % 2 === 0,
        }
      }),
    []
  )

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            desktopTopBarRef.current,
            captionRef.current,
            envelopeWrapRef.current,
            controlsRef.current,
          ],
          { opacity: 1, y: 0 }
        )
        return
      }

      if (desktopTopBarRef.current) {
        gsap.fromTo(
          desktopTopBarRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        )
      }

      gsap.fromTo(
        captionRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      )

      gsap.fromTo(
        envelopeWrapRef.current,
        { opacity: 0, y: 18, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'power2.out',
          delay: 0.06,
        }
      )

      gsap.fromTo(
        controlsRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: 0.14 }
      )
    }, stageRef)

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
      ctx.revert()
    }
  }, [])

  const handleOpenInvitation = () => {
    if (isOpening) return
    setIsOpening(true)
    if (onStartMusic) onStartMusic()

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.to(stageRef.current, {
        opacity: 0,
        duration: 0.25,
        onComplete: onOpenComplete,
      })
      return
    }

    const burstDots = burstContainerRef.current
      ? Array.from(burstContainerRef.current.children)
      : []

    // Fast, crisp, cinematic sequence (~1.35s total)
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        onOpenComplete()
      },
    })
    timelineRef.current = tl

    // Hide CTA controls, top bar & caption swiftly
    const fadeTargets = [
      controlsRef.current,
      captionRef.current,
      desktopTopBarRef.current,
    ].filter(Boolean)

    tl.to(
      fadeTargets,
      {
        opacity: 0,
        y: -8,
        duration: 0.25,
        ease: 'power2.out',
      },
      0
    )

    // 1. Gold seal splits briskly
    tl.to(
      sealGlowRef.current,
      {
        scale: 1.6,
        opacity: 0.9,
        duration: 0.2,
        ease: 'power2.out',
      },
      0.02
    )
      .to(
        sealLeftRef.current,
        {
          x: -16,
          y: 4,
          rotation: -14,
          opacity: 0,
          duration: 0.3,
        },
        0.14
      )
      .to(
        sealRightRef.current,
        {
          x: 16,
          y: 4,
          rotation: 14,
          opacity: 0,
          duration: 0.3,
        },
        0.14
      )
      .to(
        sealGlowRef.current,
        {
          opacity: 0,
          scale: 2,
          duration: 0.28,
        },
        0.18
      )

    // 4. Particles disperse cleanly
    if (burstDots.length > 0) {
      tl.fromTo(
        burstDots,
        { opacity: 0, scale: 0.3, x: 0, y: 0 },
        {
          opacity: 1,
          scale: 1,
          x: (i) => burstParticles[i].dx,
          y: (i) => burstParticles[i].dy,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.008,
        },
        0.14
      ).to(
        burstDots,
        {
          opacity: 0,
          scale: 0.2,
          duration: 0.32,
          ease: 'power2.in',
        },
        0.48
      )
    }

    // 2. Envelope top flap rotates backward in 3D perspective
    tl.to(
      flapRef.current,
      {
        rotateX: 180,
        duration: 0.55,
        ease: 'power2.inOut',
        onUpdate: function () {
          if (this.progress() > 0.48 && flapRef.current) {
            flapRef.current.style.zIndex = '5'
          }
        },
      },
      0.26
    )

    tl.to(
      innerGlowRef.current,
      {
        opacity: 0.85,
        scale: 1.1,
        duration: 0.45,
        ease: 'power2.out',
      },
      0.38
    )

    tl.to(
      envelopeWrapRef.current,
      {
        y: 28,
        duration: 0.55,
      },
      0.42
    )

    // 3. White invitation card slides upward smoothly
    tl.to(
      cardRef.current,
      {
        yPercent: -60,
        scale: 1.03,
        boxShadow: '0 24px 50px -12px rgba(22, 3, 38, 0.55)',
        duration: 0.58,
        ease: 'power3.out',
      },
      0.5
    )

    // 5 & 6. Card expands cleanly and cross-fades into main invitation
    tl.set(cardRef.current, { zIndex: 45 }, 1.0)
      .to(
        cardRef.current,
        {
          yPercent: -16,
          scale: 1.32,
          duration: 0.48,
          ease: 'power2.inOut',
        },
        1.02
      )
      .to(
        stageRef.current,
        {
          opacity: 0,
          duration: 0.34,
          ease: 'power2.out',
        },
        1.16
      )
  }

  return (
    <div
      ref={stageRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-plum-deep px-4 py-6 sm:py-10 lg:px-10 xl:px-16 lg:py-7 select-none"
      style={{
        background:
          'radial-gradient(circle at 50% 30%, #641E82 0%, #35094F 48%, #1A0229 100%)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="VIP Digital Invitation Envelope"
    >
      {/* Elegant Curved Silk Background Ribbons */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="envRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#943FB8" stopOpacity="0.48" />
            <stop offset="50%" stopColor="#652080" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#35094F" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="envGoldLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D9B56E" stopOpacity="0" />
            <stop offset="50%" stopColor="#F5E4BC" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#D9B56E" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-120,180 C260,40 520,340 920,190 C1180,95 1350,210 1560,140 L1560,0 L-120,0 Z"
          fill="url(#envRibbon1)"
        />
        <path
          d="M-120,180 C260,40 520,340 920,190 C1180,95 1350,210 1560,140"
          fill="none"
          stroke="url(#envGoldLine)"
          strokeWidth="1.5"
        />
        <path
          d="M-140,760 C240,610 620,880 1040,700 C1260,605 1410,690 1580,650 L1580,920 L-140,920 Z"
          fill="url(#envRibbon1)"
        />
        <path
          d="M-140,760 C240,610 620,880 1040,700 C1260,605 1410,690 1580,650"
          fill="none"
          stroke="url(#envGoldLine)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Subtle Ambient Twinkling Dots */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {ambientParticles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.isGold ? '#F3DFAF' : '#EDE2FA',
              opacity: p.isGold ? 0.5 : 0.25,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Laptop/Desktop Top Institutional Crest Bar (Hidden on Mobile) */}
      <div
        ref={desktopTopBarRef}
        className="hidden lg:flex relative z-20 w-full max-w-7xl mx-auto items-center justify-between border-b border-champagne/30 pb-4 pr-36"
      >
        <div className="flex items-center gap-6">
          <img
            src={waenLogo.whiteSrc}
            alt={waenLogo.shortName}
            className="h-11 xl:h-12 w-auto object-contain opacity-95"
          />
          <span className="h-8 w-[1px] bg-champagne/40" />
          <img
            src={govWaLogo.whiteSrc}
            alt={govWaLogo.shortName}
            className="h-12 xl:h-13 w-auto object-contain opacity-95"
          />
          <span className="h-8 w-[1px] bg-champagne/40" />
          <img
            src={scsaLogo.whiteSrc}
            alt={scsaLogo.shortName}
            className="h-10 xl:h-11 w-auto object-contain opacity-95"
          />
        </div>

        <span className="text-gold-shimmer font-decorative text-[11px] font-bold tracking-[0.26em] uppercase">
          Official VIP Ceremony Portal
        </span>
      </div>

      {/* Responsive Stage: Vertical Stack on Mobile (<1024px) | Widescreen Split Stage on Laptop (>=1024px) */}
      <div className="relative z-20 flex-1 w-full max-w-7xl mx-auto flex flex-col items-center justify-between lg:grid lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:content-center lg:gap-x-10 xl:gap-x-16">
        {/* Top Heading on Mobile | Left Editorial Welcome Column on Laptop */}
        <div
          ref={captionRef}
          className="mt-2 sm:mt-4 lg:mt-0 flex flex-col items-center lg:items-start text-center lg:text-left px-2 lg:px-0 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-end"
        >
          <div className="flex items-center gap-2.5 sm:gap-4 mb-1 lg:mb-3">
            <span className="h-[1px] w-7 sm:w-14 lg:hidden bg-gradient-to-r from-transparent to-champagne/85" />
            <span className="hidden lg:inline-block h-2 w-2 rotate-45 border border-champagne bg-champagne/40" />
            <span className="text-gold-shimmer font-decorative text-xs sm:text-sm lg:text-xs xl:text-sm font-bold tracking-[0.26em] uppercase">
              {EVENT_CONFIG.envelopeCaption}
            </span>
            <span className="h-[1px] w-7 sm:w-14 lg:w-16 bg-gradient-to-l from-transparent to-champagne/85" />
          </div>

          {/* Laptop Editorial Headline */}
          <h1 className="hidden lg:block font-serif font-extrabold text-4xl xl:text-5xl text-white leading-[1.14] tracking-tight">
            {EVENT_CONFIG.title}
          </h1>

          <p className="font-sans font-bold text-xl sm:text-2xl lg:text-2xl xl:text-3xl tracking-wide text-champagne-light mt-1.5 lg:mt-2.5">
            Karachi Launch Ceremony 2026
          </p>

          {/* Laptop Date & Venue Quick Summary */}
          <div className="hidden lg:flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 pt-4 border-t border-champagne/25 text-xs xl:text-sm text-lavender/90">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-champagne shrink-0" />
              <span>{EVENT_CONFIG.dateDisplay}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-champagne shrink-0" />
              <span>{EVENT_CONFIG.venueName}</span>
            </span>
          </div>
        </div>

        {/* Centerpiece Steady 3D Luxury Envelope (Middle on Mobile | Right Showcase Stage on Laptop) */}
        <div className="my-auto lg:my-0 flex items-center justify-center w-full py-3 lg:py-0 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:row-span-2">
          <div className="perspective-stage w-full max-w-[390px] sm:max-w-[460px] lg:max-w-[540px] xl:max-w-[600px] flex justify-center">
            <div
              ref={envelopeWrapRef}
              onClick={handleOpenInvitation}
              className={`preserve-3d relative w-[88vw] max-w-[380px] sm:max-w-[450px] lg:w-full lg:max-w-[530px] xl:max-w-[580px] aspect-[16/11] rounded-xl shadow-envelope transition-transform duration-300 ${
                !isOpening ? 'cursor-pointer hover:scale-[1.018]' : ''
              }`}
            >
              {/* Warm Golden Aura Behind Envelope */}
              <div
                ref={innerGlowRef}
                className="pointer-events-none absolute -inset-4 lg:-inset-8 rounded-3xl bg-champagne/20 blur-2xl opacity-30 lg:opacity-45"
                style={{ zIndex: 1 }}
              />

              {/* Envelope Back & Satin Interior */}
              <div
                className="absolute inset-0 rounded-xl border border-champagne/45 overflow-hidden"
                style={{
                  background:
                    'linear-gradient(180deg, #2B0742 0%, #3E0D5C 60%, #2B0742 100%)',
                  zIndex: 4,
                }}
              >
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      'radial-gradient(#D9B56E 0.8px, transparent 0.8px)',
                    backgroundSize: '14px 14px',
                  }}
                />
              </div>

              {/* White Luxury Invitation Card Inside Envelope */}
              <div
                ref={cardRef}
                className="vip-paper-surface absolute left-[6%] right-[6%] top-[8%] bottom-[8%] rounded-lg border border-champagne/65 px-4 py-3 sm:px-6 sm:py-4 flex flex-col items-center justify-between text-center shadow-md"
                style={{ zIndex: 12 }}
              >
                <div className="w-full border border-champagne/45 rounded-md h-full px-3 py-2 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center gap-3 mb-1.5">
                    <img
                      src={EVENT_CONFIG.logos[0].purpleSrc}
                      alt={EVENT_CONFIG.logos[0].shortName}
                      className="h-6 sm:h-7 lg:h-8 w-auto object-contain opacity-95"
                    />
                    <span className="h-5 w-[1px] bg-champagne/70" />
                    <img
                      src={EVENT_CONFIG.logos[2].purpleSrc}
                      alt={EVENT_CONFIG.logos[2].shortName}
                      className="h-5 sm:h-6 lg:h-7 w-auto object-contain opacity-95"
                    />
                  </div>
                  <span className="font-decorative text-[9px] sm:text-[10px] tracking-[0.26em] text-champagne-dark uppercase font-bold">
                    {EVENT_CONFIG.kicker}
                  </span>
                  <h2 className="font-sans font-extrabold text-plum text-base sm:text-xl lg:text-2xl leading-tight mt-1">
                    {EVENT_CONFIG.title}
                  </h2>
                  <p className="font-sans font-semibold text-royal text-xs sm:text-sm lg:text-base tracking-wide mt-1">
                    {EVENT_CONFIG.subtitle}
                  </p>
                  <div className="mt-2 h-[1px] w-16 bg-gradient-to-r from-transparent via-champagne to-transparent" />
                </div>
              </div>

              {/* Envelope Left, Right & Bottom Folds */}
              <div
                className="foil-sheen pointer-events-none absolute inset-0 rounded-xl overflow-hidden"
                style={{ zIndex: 20 }}
              >
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 400 275"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="sideFoldL" x1="0%" y1="0%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor="#6D248A" />
                      <stop offset="100%" stopColor="#4A1263" />
                    </linearGradient>
                    <linearGradient id="sideFoldR" x1="100%" y1="0%" x2="0%" y2="50%">
                      <stop offset="0%" stopColor="#652080" />
                      <stop offset="100%" stopColor="#430F5B" />
                    </linearGradient>
                    <linearGradient id="bottomPocket" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#772A96" />
                      <stop offset="55%" stopColor="#581873" />
                      <stop offset="100%" stopColor="#35094F" />
                    </linearGradient>
                  </defs>

                  <polygon
                    points="0,0 205,146 0,275"
                    fill="url(#sideFoldL)"
                    stroke="#D9B56E"
                    strokeOpacity="0.48"
                    strokeWidth="1"
                  />
                  <polygon
                    points="400,0 195,146 400,275"
                    fill="url(#sideFoldR)"
                    stroke="#D9B56E"
                    strokeOpacity="0.48"
                    strokeWidth="1"
                  />
                  <polygon
                    points="0,275 168,136 232,136 400,275"
                    fill="url(#bottomPocket)"
                    stroke="#D9B56E"
                    strokeOpacity="0.78"
                    strokeWidth="1.25"
                  />
                </svg>

                <div className="absolute inset-[7px] rounded-lg border border-champagne/40 pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-3.5 inset-x-0 flex flex-col items-center justify-center pointer-events-none opacity-90">
                  <span className="text-gold-shimmer font-display text-[8px] sm:text-[9px] font-semibold tracking-[0.28em] uppercase">
                    WAEN PAKISTAN • OFFICIAL INVITATION
                  </span>
                </div>
              </div>

              {/* 3D Top Triangular Flap */}
              <div
                ref={flapRef}
                className="preserve-3d origin-top-hinge pointer-events-none absolute inset-x-0 top-0 h-[58%]"
                style={{ zIndex: 30 }}
              >
                <div className="backface-hidden absolute inset-0">
                  <svg
                    className="h-full w-full drop-shadow-[0_10px_14px_rgba(22,3,38,0.48)]"
                    viewBox="0 0 400 160"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="topFlapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#4F1569" />
                        <stop offset="65%" stopColor="#6B2487" />
                        <stop offset="100%" stopColor="#8130A1" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points="0,0 400,0 214,150 186,150"
                      fill="url(#topFlapGrad)"
                      stroke="#D9B56E"
                      strokeWidth="1.5"
                      strokeOpacity="0.88"
                    />
                    <polyline
                      points="14,6 190,141 210,141 386,6"
                      fill="none"
                      stroke="#F3DFAF"
                      strokeWidth="0.9"
                      strokeOpacity="0.58"
                    />
                  </svg>
                </div>

                <div
                  className="backface-hidden absolute inset-0"
                  style={{ transform: 'rotateX(180deg)' }}
                >
                  <svg
                    className="h-full w-full"
                    viewBox="0 0 400 160"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="flapInnerGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#EDE2FA" />
                        <stop offset="100%" stopColor="#D6BFEF" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points="0,0 400,0 214,150 186,150"
                      fill="url(#flapInnerGrad)"
                      stroke="#D9B56E"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>
              </div>

              {/* Dispersion Particle Burst Anchor at Seal Center */}
              <div
                ref={burstContainerRef}
                className="pointer-events-none absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2"
                style={{ zIndex: 42 }}
                aria-hidden="true"
              >
                {burstParticles.map((bp) => (
                  <span
                    key={bp.id}
                    className="absolute rounded-full opacity-0"
                    style={{
                      width: `${bp.size}px`,
                      height: `${bp.size}px`,
                      backgroundColor: bp.isGold ? '#F5E4BC' : '#C27AE8',
                    }}
                  />
                ))}
              </div>

              {/* Circular Decorative Gold Medallion Seal */}
              <div
                className="pointer-events-none absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 h-16 w-16 sm:h-20 sm:w-20 lg:h-22 lg:w-22"
                style={{ zIndex: 40 }}
              >
                <div
                  ref={sealGlowRef}
                  className="absolute inset-0 rounded-full bg-champagne/55 blur-md"
                />

                <div
                  ref={sealLeftRef}
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    clipPath: 'polygon(0 0, 52% 0, 48% 50%, 53% 100%, 0 100%)',
                  }}
                >
                  <GoldSealDisc />
                </div>

                <div
                  ref={sealRightRef}
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    clipPath: 'polygon(52% 0, 100% 0, 100% 100%, 53% 100%, 48% 50%)',
                  }}
                >
                  <GoldSealDisc />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Glowing CTA on Mobile | Left CTA Suite on Laptop */}
        <div
          ref={controlsRef}
          className="mb-2 sm:mb-4 lg:mb-0 lg:mt-7 flex flex-col items-center lg:items-start gap-3 w-full max-w-xs lg:max-w-sm lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start"
        >
          <button
            type="button"
            onClick={handleOpenInvitation}
            disabled={isOpening}
            className="foil-sheen animate-pulse-glow group relative w-full py-3.5 lg:py-4 px-7 rounded-full bg-gold-metallic text-plum-deep font-display font-bold text-xs sm:text-sm tracking-[0.2em] uppercase shadow-gold-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-plum" />
            <span>OPEN YOUR INVITATION</span>
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="text-xs tracking-[0.16em] uppercase text-lavender/75 hover:text-champagne-light py-1.5 px-4 lg:px-1 transition-colors underline underline-offset-4 decoration-champagne/40"
          >
            Skip Animation
          </button>
        </div>
      </div>
    </div>
  )
}

function GoldSealDisc() {
  return (
    <div
      className="h-full w-full rounded-full p-[3px] shadow-[0_8px_20px_rgba(20,2,36,0.65)]"
      style={{
        background:
          'conic-gradient(from 30deg, #B58D3D, #FFF1CA, #D9B56E, #9E762A, #F3DFAF, #B58D3D)',
      }}
    >
      <div className="h-full w-full rounded-full border border-plum/35 bg-gradient-to-br from-[#F5E4BC] via-[#D9B56E] to-[#AA8132] flex items-center justify-center p-2 shadow-inner">
        <div className="h-full w-full rounded-full border border-dashed border-plum/35 flex items-center justify-center p-1">
          <img
            src={EVENT_CONFIG.crestAssets.purple}
            alt=""
            className="h-full w-full object-contain opacity-90"
          />
        </div>
      </div>
    </div>
  )
}
