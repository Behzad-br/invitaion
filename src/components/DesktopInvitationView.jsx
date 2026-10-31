import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  Calendar,
  CalendarPlus,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Link2,
  MailOpen,
  MapPin,
  Navigation,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react'
import RSVPForm from './RSVPForm'
import KarachiSkyline from './KarachiSkyline'
import { EVENT_CONFIG } from '../config/eventConfig'
import { downloadEventICS } from '../utils/calendar'
import { buildShareableInvitationUrl } from '../utils/whatsapp'

function calculateDesktopCountdown() {
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
  return {
    status: 'upcoming',
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function DesktopInvitationView({
  isRevealed,
  waConfig,
  onOpenOrganizerSetup,
  onReopenInvitation,
  isMusicPlaying,
  onToggleMusic,
  formValues,
  onFormValuesChange,
}) {
  const rootRef = useRef(null)
  const topBarRef = useRef(null)
  const leftFolioRef = useRef(null)
  const rightConciergeRef = useRef(null)

  const [calendarSaved, setCalendarSaved] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [countdown, setCountdown] = useState(() => calculateDesktopCountdown())

  const [waenLogo, govWaLogo, scsaLogo] = EVENT_CONFIG.logos
  const shareUrl = buildShareableInvitationUrl(waConfig.number)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateDesktopCountdown())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Brisk, smooth entrance on laptop reveal — settles permanently with zero ongoing motion
  useEffect(() => {
    if (!isRevealed) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [topBarRef.current, leftFolioRef.current, rightConciergeRef.current],
          { opacity: 1, y: 0, x: 0 }
        )
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      tl.fromTo(
        topBarRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.38 }
      )
        .fromTo(
          leftFolioRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.45 },
          '-=0.24'
        )
        .fromTo(
          rightConciergeRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.45 },
          '-=0.34'
        )
    }, rootRef)

    return () => ctx.revert()
  }, [isRevealed])

  const handleCalendarDownload = () => {
    downloadEventICS()
    setCalendarSaved(true)
    setTimeout(() => setCalendarSaved(false), 3500)
  }

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 3200)
    } catch {
      const input = document.createElement('textarea')
      input.value = shareUrl
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 3200)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${EVENT_CONFIG.title} — ${EVENT_CONFIG.subtitle}`,
          text: `The Western Australia Education Network (WAEN) invites you to the Official Karachi Launch Ceremony of the Western Australian Curriculum on ${EVENT_CONFIG.dateDisplay} at ${EVENT_CONFIG.venueName}.`,
          url: shareUrl,
        })
        return
      } catch (err) {
        if (err && err.name === 'AbortError') return
      }
    }
    await handleCopyInviteLink()
  }

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden px-6 xl:px-12 py-5 xl:py-6 text-white"
      style={{
        background:
          'radial-gradient(circle at 16% 14%, #672085 0%, #35094F 46%, #1B032B 100%)',
      }}
    >
      {/* Subtle Ambient Widescreen Royal Silk Curves & Champagne Light Pools */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 left-12 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-[28rem] w-[28rem] rounded-full bg-royal-light/20 blur-3xl" />
        <svg
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 1600 960"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M-100,150 C340,20 720,280 1180,120 C1380,50 1520,110 1700,80"
            fill="none"
            stroke="#D9B56E"
            strokeOpacity="0.35"
            strokeWidth="1.2"
          />
          <path
            d="M-100,840 C380,700 840,940 1280,780 C1450,720 1560,760 1700,735"
            fill="none"
            stroke="#D9B56E"
            strokeOpacity="0.3"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* 1. TOP WIDESCREEN INSTITUTIONAL CREST & UTILITY TOOLBAR */}
      <header
        ref={topBarRef}
        aria-label="Official Institutional Partners and Ceremony Controls"
        className="relative z-20 mx-auto w-full max-w-[1440px] rounded-2xl border border-champagne/55 bg-white/95 backdrop-blur-md px-5 xl:px-7 py-3 shadow-[0_16px_40px_rgba(14,2,26,0.45)] flex items-center justify-between gap-4 text-plum"
      >
        {/* All Three Genuine Supplied Logos Side-by-Side */}
        <div className="flex items-center gap-4 xl:gap-7 min-w-0">
          <img
            src={waenLogo.purpleSrc}
            alt={waenLogo.name}
            loading="eager"
            className="h-11 xl:h-13 w-auto object-contain select-none"
          />
          <span
            className="h-9 w-[1px] bg-gradient-to-b from-transparent via-champagne to-transparent shrink-0"
            aria-hidden="true"
          />
          <img
            src={govWaLogo.purpleSrc}
            alt={govWaLogo.name}
            loading="eager"
            className="h-12 xl:h-14 w-auto object-contain select-none"
          />
          <span
            className="h-9 w-[1px] bg-gradient-to-b from-transparent via-champagne to-transparent shrink-0"
            aria-hidden="true"
          />
          <img
            src={scsaLogo.purpleSrc}
            alt={scsaLogo.name}
            loading="eager"
            className="h-10 xl:h-12 w-auto object-contain select-none"
          />
        </div>

        {/* Right Desktop Action Toolbar (Calendar, Venue Map, Reopen, Music Toggle) */}
        <div className="flex items-center gap-2 xl:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCalendarDownload}
            className="inline-flex items-center gap-1.5 rounded-full border border-champagne/70 bg-lavender/45 hover:bg-lavender px-3.5 py-2 text-[11px] font-bold tracking-[0.1em] uppercase text-plum transition-colors"
          >
            {calendarSaved ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-700" />
                <span className="text-emerald-800">Saved (.ics)</span>
              </>
            ) : (
              <>
                <CalendarPlus className="h-3.5 w-3.5 text-royal" />
                <span>Add to Calendar</span>
              </>
            )}
          </button>

          <a
            href={EVENT_CONFIG.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-champagne/70 bg-lavender/45 hover:bg-lavender px-3.5 py-2 text-[11px] font-bold tracking-[0.1em] uppercase text-plum transition-colors"
          >
            <Navigation className="h-3.5 w-3.5 text-royal" />
            <span>Venue Map</span>
          </a>

          <button
            type="button"
            onClick={onReopenInvitation}
            className="inline-flex items-center gap-1.5 rounded-full border border-champagne/70 bg-white hover:bg-lavender/55 px-3.5 py-2 text-[11px] font-bold tracking-[0.1em] uppercase text-royal transition-colors"
          >
            <MailOpen className="h-3.5 w-3.5" />
            <span>Reopen Envelope</span>
          </button>

          <button
            type="button"
            data-music-toggle="true"
            onClick={onToggleMusic}
            aria-label={
              isMusicPlaying
                ? 'Turn background music off'
                : 'Turn background music on'
            }
            title={isMusicPlaying ? 'Turn Music Off' : 'Turn Music On'}
            className="inline-flex items-center gap-1.5 rounded-full border border-champagne/85 bg-plum hover:bg-royal px-4 py-2 text-[11px] font-bold tracking-[0.12em] uppercase text-champagne-light shadow-sm transition-colors"
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="h-3.5 w-3.5 text-champagne-light" />
                <span>Music Off</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5 text-lavender/80" />
                <span className="text-lavender/90">Music On</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. MAIN WIDESCREEN SPLIT-STAGE ROYAL BOOK-SPREAD */}
      <main className="relative z-20 mx-auto my-5 w-full max-w-[1440px] flex-1 grid grid-cols-12 gap-6 xl:gap-8 items-stretch">
        {/* LEFT PANE (7 Columns): Grand Ivory & Gold Ceremonial Invitation Manifesto */}
        <article
          ref={leftFolioRef}
          aria-labelledby="desktop-invitation-title"
          className="col-span-7 vip-paper-surface gold-ornamental-frame relative rounded-[1.75rem] border border-champagne/85 shadow-[0_28px_70px_rgba(10,1,20,0.55)] overflow-hidden flex flex-col justify-between text-plum"
        >
          {/* Top Royal & Champagne Gold Ribbon */}
          <div className="h-2 w-full bg-gradient-to-r from-plum via-royal to-plum relative shrink-0">
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-champagne/85" />
          </div>

          {/* Upper Editorial Manifesto Content */}
          <div className="relative z-10 px-8 xl:px-12 pt-7 xl:pt-9 pb-3">
            {/* Editorial Kicker & Year */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rotate-45 border border-champagne bg-champagne/45" />
                <span className="text-gold-shimmer font-decorative text-xs xl:text-sm font-bold tracking-[0.32em] uppercase">
                  {EVENT_CONFIG.kicker}
                </span>
                <span className="h-[1.5px] w-16 xl:w-24 bg-gradient-to-r from-champagne to-transparent" />
              </div>

              <span className="rounded-full border border-champagne/65 bg-lavender/55 px-3.5 py-1 font-decorative text-[10px] font-bold tracking-[0.22em] text-royal uppercase">
                Official Launch
              </span>
            </div>

            {/* Grand Widescreen Heading */}
            <h1
              id="desktop-invitation-title"
              className="font-serif font-extrabold text-[2.5rem] xl:text-[3.2rem] leading-[1.1] text-royal-shimmer tracking-tight"
            >
              {EVENT_CONFIG.title}
            </h1>

            {/* Clean Straight Subtitle + Gold Flourish */}
            <div className="mt-2 flex items-center gap-4 flex-wrap">
              <p className="font-sans font-bold text-xl xl:text-2xl tracking-wide text-royal">
                {EVENT_CONFIG.subtitle}
              </p>
              <svg
                className="w-36 xl:w-44 h-5 text-champagne shrink-0"
                viewBox="0 0 220 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6,10 C52,2 88,18 110,10 C132,2 168,18 214,10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Official Client-Approved Invitation Body Callout */}
            <div className="mt-5 rounded-2xl border border-champagne/60 border-l-4 border-l-royal bg-gradient-to-r from-lavender/45 via-white to-lavender/20 px-6 py-4 xl:py-5 shadow-sm">
              <p className="font-sans text-[15px] xl:text-[1.06rem] leading-[1.75] text-plum/95">
                <strong className="font-bold text-plum">
                  The Western Australia Education Network (WAEN)
                </strong>{' '}
                invites you to the Official Karachi Launch Ceremony of the{' '}
                <strong className="font-bold text-plum">
                  Western Australian Curriculum (Kindergarten to Year 12)
                </strong>
                , following successful launches in Islamabad and Lahore.
              </p>
            </div>

            {/* 3-Column Horizontal Schedule & Venue Pillars */}
            <div className="mt-5 grid grid-cols-3 gap-3 xl:gap-4">
              <div className="rounded-2xl border border-champagne/65 bg-white/95 p-3.5 xl:p-4 shadow-sm flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-champagne/70 bg-lavender/60 text-royal">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-gold-shimmer font-decorative text-[10px] font-bold tracking-[0.22em] uppercase">
                    Date
                  </span>
                  <p className="mt-0.5 font-serif text-sm xl:text-[15px] font-bold text-plum leading-snug">
                    {EVENT_CONFIG.dateDisplay}
                  </p>
                  <p className="mt-0.5 text-[11px] text-royal/75">
                    Official Launch Day
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-champagne/65 bg-white/95 p-3.5 xl:p-4 shadow-sm flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-champagne/70 bg-lavender/60 text-royal">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-gold-shimmer font-decorative text-[10px] font-bold tracking-[0.22em] uppercase">
                    Time
                  </span>
                  <p className="mt-0.5 font-serif text-sm xl:text-[15px] font-bold text-plum leading-snug">
                    {EVENT_CONFIG.timeDisplay}
                  </p>
                  <p className="mt-0.5 text-[11px] text-royal/75">
                    Pakistan Standard Time
                  </p>
                </div>
              </div>

              <a
                href={EVENT_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-champagne/65 bg-white/95 hover:bg-lavender/35 p-3.5 xl:p-4 shadow-sm flex items-start gap-3 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-champagne/70 bg-lavender/60 text-royal group-hover:bg-royal group-hover:text-white transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1 text-gold-shimmer font-decorative text-[10px] font-bold tracking-[0.22em] uppercase">
                    <span>Venue</span>
                    <ExternalLink className="h-2.5 w-2.5 text-champagne-dark" />
                  </span>
                  <p className="mt-0.5 font-serif text-sm xl:text-[15px] font-bold text-plum leading-snug">
                    {EVENT_CONFIG.venueName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-royal/75 group-hover:text-royal underline-offset-2 group-hover:underline">
                    View on Google Maps
                  </p>
                </div>
              </a>
            </div>

            {/* Widescreen Horizontal Royal Silk Countdown Ribbon */}
            <div className="mt-4 rounded-2xl border border-champagne/70 bg-royal-silk px-5 xl:px-6 py-3.5 text-white shadow-card flex items-center justify-between gap-4">
              {countdown.status === 'upcoming' && (
                <>
                  <div>
                    <span className="block text-gold-shimmer font-decorative text-[10px] xl:text-[11px] font-bold tracking-[0.24em] uppercase">
                      Ceremony Commences In
                    </span>
                    <p className="mt-0.5 text-xs text-lavender/85">
                      12 November 2026 • 10:00 AM PKT • {EVENT_CONFIG.venueName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 xl:gap-2.5">
                    {[
                      { label: 'Days', value: countdown.days },
                      { label: 'Hrs', value: countdown.hours },
                      { label: 'Min', value: countdown.minutes },
                      { label: 'Sec', value: countdown.seconds },
                    ].map((unit) => (
                      <div
                        key={unit.label}
                        className="min-w-[54px] xl:min-w-[60px] rounded-xl border border-champagne/55 bg-white/10 px-2.5 py-1.5 text-center backdrop-blur-sm"
                      >
                        <div className="font-serif text-xl xl:text-2xl font-extrabold text-champagne-light tabular-nums leading-none">
                          {String(unit.value).padStart(2, '0')}
                        </div>
                        <div className="mt-1 font-display text-[9px] font-semibold tracking-[0.14em] uppercase text-lavender/85">
                          {unit.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {countdown.status === 'live' && (
                <div className="w-full flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-decorative text-xs tracking-[0.24em] text-champagne-light uppercase font-bold">
                    <span className="h-2.5 w-2.5 rounded-full bg-champagne-light animate-ping" />
                    Ceremony In Progress
                  </span>
                  <span className="font-serif text-sm xl:text-base text-white">
                    Currently underway at {EVENT_CONFIG.venueName}
                  </span>
                </div>
              )}

              {countdown.status === 'concluded' && (
                <div className="w-full flex items-center justify-between">
                  <span className="font-decorative text-xs tracking-[0.22em] text-champagne-light uppercase font-bold">
                    Official Event Status
                  </span>
                  <span className="font-serif text-sm xl:text-base text-white">
                    The Karachi Launch Ceremony (12 November 2026) has concluded.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Panoramic Karachi Skyline Anchored Along Bottom of Left Ceremonial Folio */}
          <div className="relative z-10 mt-auto pt-1">
            <KarachiSkyline variant="desktop" isRevealed={isRevealed} />
          </div>
        </article>

        {/* RIGHT PANE (5 Columns): Dedicated Royal Velvet VIP Concierge & RSVP Desk */}
        <aside
          ref={rightConciergeRef}
          aria-label="VIP Attendance Concierge and Share Suite"
          className="col-span-5 rounded-[1.75rem] border border-champagne/70 bg-gradient-to-b from-[#2E0846]/95 via-[#3D0C5C]/95 to-[#230436]/95 backdrop-blur-md p-6 xl:p-7 shadow-[0_28px_70px_rgba(10,1,20,0.55)] flex flex-col justify-between gap-5"
        >
          {/* Top Concierge Title Header */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-champagne/55 bg-white/10 px-3.5 py-1">
                <img
                  src={EVENT_CONFIG.crestAssets.gold}
                  alt=""
                  className="h-4 w-4 object-contain"
                />
                <span className="font-decorative text-[10px] font-bold tracking-[0.22em] text-champagne-light uppercase">
                  VIP Attendance Concierge
                </span>
              </div>

              <span className="text-[11px] font-medium text-lavender/75">
                Direct WhatsApp Confirmation
              </span>
            </div>

            <h2 className="mt-3 font-serif text-2xl xl:text-[2rem] font-extrabold text-white leading-tight">
              Reserve Your Presence
            </h2>
            <p className="mt-1 font-sans text-xs xl:text-sm text-lavender/85 leading-relaxed">
              Kindly enter your details below to confirm your institutional
              attendance with the WAEN Pakistan team.
            </p>
          </div>

          {/* Interactive White RSVP Folio Card */}
          <RSVPForm
            waConfig={waConfig}
            onOpenOrganizerSetup={onOpenOrganizerSetup}
            sectionId="desktop-rsvp-section"
            idPrefix="desktop"
            variant="desktop"
            formValues={formValues}
            onFormValuesChange={onFormValuesChange}
          />

          {/* Share Official Invitation Concierge Bar */}
          <div className="rounded-2xl border border-champagne/45 bg-white/10 backdrop-blur-sm p-4 xl:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-champagne/60 bg-plum/80 text-champagne-light">
                <Link2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-base xl:text-lg font-bold text-white leading-snug">
                  Share Official Invitation
                </h3>
                <p className="mt-0.5 text-xs text-lavender/80 leading-relaxed">
                  Forward this digital invitation link to fellow school leaders,
                  principals, or institutional representatives.
                </p>
              </div>
            </div>

            <div className="mt-3.5 flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="foil-sheen flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gold-metallic px-4 py-2.5 text-xs font-bold tracking-[0.14em] uppercase text-plum-deep shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-transform min-h-[42px]"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-900 shrink-0" />
                    <span className="text-emerald-950">Invitation Link Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-plum-deep shrink-0" />
                    <span>Copy Invitation Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-champagne/65 bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase text-champagne-light transition-colors min-h-[42px]"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* 3. SLIM DESKTOP INSTITUTIONAL SIGNATURE BAR */}
      <footer className="relative z-20 mx-auto w-full max-w-[1440px] border-t border-champagne/25 pt-3.5 flex items-center justify-between gap-4 text-[11px] xl:text-xs text-lavender/75">
        <div className="flex items-center gap-4">
          <img
            src={waenLogo.whiteSrc}
            alt={waenLogo.shortName}
            className="h-7 w-auto object-contain opacity-90"
          />
          <span className="h-4 w-[1px] bg-champagne/35" aria-hidden="true" />
          <img
            src={scsaLogo.whiteSrc}
            alt={scsaLogo.shortName}
            className="h-6 w-auto object-contain opacity-90"
          />
          <span className="text-lavender/65 ml-1">
            © 2026 Western Australia Education Network (WAEN Pakistan) &amp; SCSA
            International.
          </span>
        </div>

        <div className="font-sans font-semibold text-xs xl:text-sm tracking-wide text-champagne-light">
          Western Australian Curriculum • Kindergarten to Year 12
        </div>
      </footer>
    </div>
  )
}
