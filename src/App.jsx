import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sparkles } from 'lucide-react'
import InvitationEnvelope from './components/InvitationEnvelope'
import FloatingAtmosphere from './components/FloatingAtmosphere'
import InvitationReveal from './components/InvitationReveal'
import EventDetails from './components/EventDetails'
import KarachiSkyline from './components/KarachiSkyline'
import RSVPForm from './components/RSVPForm'
import ShareInvitation from './components/ShareInvitation'
import WhatsAppLinkBuilder from './components/WhatsAppLinkBuilder'
import Footer from './components/Footer'
import MusicToggle from './components/MusicToggle'
import DesktopInvitationView from './components/DesktopInvitationView'
import { EVENT_CONFIG } from './config/eventConfig'
import { ceremonialAudio } from './utils/ambientAudio'
import {
  buildShareableInvitationUrl,
  resolveWhatsAppConfig,
} from './utils/whatsapp'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [showEnvelope, setShowEnvelope] = useState(true)
  const [envelopeKey, setEnvelopeKey] = useState(0)
  const [organizerOverride, setOrganizerOverride] = useState('')
  const [isSetupOpen, setIsSetupOpen] = useState(false)
  const [isRsvpInView, setIsRsvpInView] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)

  // Shared RSVP form state across mobile and laptop interfaces
  const [rsvpFormValues, setRsvpFormValues] = useState({
    fullName: '',
    institution: '',
    designation: '',
    attendees: 1,
  })

  const userMutedRef = useRef(false)
  const shareSectionRef = useRef(null)

  const waConfig = useMemo(
    () => resolveWhatsAppConfig(organizerOverride),
    [organizerOverride]
  )

  // Keep UI state synced with actual HTML5 <audio> playback state
  useEffect(() => {
    const unsubscribe = ceremonialAudio.subscribe((playing) => {
      setIsMusicPlaying(playing)
    })
    return unsubscribe
  }, [])

  // Attempt automatic low-volume music start as soon as the link opens;
  // if blocked by mobile browser autoplay policy, unlock immediately on first touch/tap
  useEffect(() => {
    ceremonialAudio.ensureAudio()
    ceremonialAudio.start()

    const unlockOnFirstGesture = (e) => {
      if (userMutedRef.current) return
      if (
        e &&
        e.target &&
        typeof e.target.closest === 'function' &&
        e.target.closest('[data-music-toggle="true"]')
      ) {
        return
      }
      if (!ceremonialAudio.isPlaying()) {
        ceremonialAudio.start()
      }
    }

    const events = ['pointerdown', 'touchstart', 'click', 'keydown']
    events.forEach((evt) =>
      window.addEventListener(evt, unlockOnFirstGesture, { passive: true })
    )

    return () => {
      events.forEach((evt) =>
        window.removeEventListener(evt, unlockOnFirstGesture)
      )
    }
  }, [])

  const handleStartMusic = useCallback(async () => {
    if (userMutedRef.current) return
    await ceremonialAudio.start()
  }, [])

  const handleToggleMusic = useCallback(async () => {
    if (ceremonialAudio.isPlaying()) {
      userMutedRef.current = true
      ceremonialAudio.stop()
    } else {
      userMutedRef.current = false
      await ceremonialAudio.start()
    }
  }, [])

  // Politely pause music when switching to WhatsApp or another browser tab
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        ceremonialAudio.stop()
      } else if (!userMutedRef.current) {
        ceremonialAudio.start()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      ceremonialAudio.stop()
    }
  }, [])

  // Allow discreet `?setup=1` shortcut for WAEN organizers
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('setup') === '1') {
      setShowEnvelope(false)
      setIsSetupOpen(true)
    }
  }, [])

  // Prevent background scrolling while 3D envelope scene is active
  useEffect(() => {
    if (showEnvelope) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      const timer = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 120)
      return () => clearTimeout(timer)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showEnvelope])

  // Hide mobile sticky RSVP bar when mobile RSVP section itself is visible
  useEffect(() => {
    const rsvpEl = document.getElementById('rsvp-section')
    if (!rsvpEl || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRsvpInView(entry.isIntersecting)
      },
      { threshold: 0.18 }
    )
    observer.observe(rsvpEl)
    return () => observer.disconnect()
  }, [showEnvelope])

  const handleOpenComplete = () => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setShowEnvelope(false)
  }

  const handleSkipAnimation = () => {
    handleStartMusic()
    window.scrollTo({ top: 0, behavior: 'instant' })
    setShowEnvelope(false)
  }

  const handleReopenInvitation = () => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setEnvelopeKey((k) => k + 1)
    setShowEnvelope(true)
  }

  const scrollToMobileRsvp = () => {
    const el = document.getElementById('rsvp-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleMobileShareAction = async () => {
    const shareUrl = buildShareableInvitationUrl(waConfig.number)
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
    if (shareSectionRef.current) {
      shareSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Floating Top-Right Music Toggle (Always shown during Envelope; shown on Mobile after reveal, while Laptop uses its integrated Top Toolbar button) */}
      <div className={showEnvelope ? 'block' : 'lg:hidden'}>
        <MusicToggle isPlaying={isMusicPlaying} onToggle={handleToggleMusic} />
      </div>

      {/* Scene One — Cinematic 3D Envelope Overlay (Mobile Vertical | Laptop Widescreen Split Stage) */}
      {showEnvelope && (
        <InvitationEnvelope
          key={envelopeKey}
          onOpenComplete={handleOpenComplete}
          onSkip={handleSkipAnimation}
          onStartMusic={handleStartMusic}
        />
      )}

      {/* =====================================================================
          INTERFACE A: MOBILE & TABLET (< 1024px) — Preserved Vertical VIP Card
         ===================================================================== */}
      <div
        className={`lg:hidden relative min-h-screen w-full bg-gradient-to-b from-lavender-soft via-lavender/65 to-lavender-soft py-0 sm:py-8 md:py-10 px-0 sm:px-4 transition-opacity duration-500 ${
          showEnvelope ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <main className="relative z-10 mx-auto w-full max-w-3xl">
          <article className="vip-paper-surface gold-ornamental-frame relative sm:rounded-[2rem] border-y sm:border border-champagne/70 shadow-luxury overflow-hidden pb-0">
            <FloatingAtmosphere />

            {/* Top Royal Purple & Champagne Gold Accent Strip */}
            <div className="h-2 w-full bg-gradient-to-r from-plum via-royal to-plum relative">
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-champagne/80" />
            </div>

            {/* Scene Two — Official Invitation Reveal & Institutional Logos */}
            <InvitationReveal isRevealed={!showEnvelope} />

            {/* Scene Three — Event Details, Countdown, Calendar & Directions */}
            <EventDetails onShareClick={handleMobileShareAction} />

            {/* Interactive WhatsApp RSVP Form */}
            <RSVPForm
              waConfig={waConfig}
              onOpenOrganizerSetup={() => setIsSetupOpen(true)}
              sectionId="rsvp-section"
              idPrefix="mobile"
              variant="mobile"
              formValues={rsvpFormValues}
              onFormValuesChange={setRsvpFormValues}
            />

            {/* Share Invitation Link */}
            <ShareInvitation
              activeWaNumber={waConfig.number}
              sectionRef={shareSectionRef}
            />

            {/* Scene Four — Panoramic Animated Karachi Skyline */}
            <KarachiSkyline variant="mobile" isRevealed={!showEnvelope} />

            {/* Institutional Footer + Reopen Invitation */}
            <Footer onReopenInvitation={handleReopenInvitation} />
          </article>
        </main>

        {/* Mobile Floating Sticky RSVP Action Pill */}
        {!showEnvelope && !isRsvpInView && (
          <div className="fixed bottom-4 inset-x-4 z-40 md:hidden pointer-events-none flex justify-center">
            <button
              type="button"
              onClick={scrollToMobileRsvp}
              className="pointer-events-auto flex items-center justify-center gap-2.5 rounded-full border border-champagne/80 bg-plum/95 backdrop-blur-md px-6 py-3.5 text-xs font-bold tracking-[0.18em] uppercase text-champagne-light shadow-[0_12px_30px_rgba(34,4,54,0.5)] active:scale-95 transition-transform"
            >
              <Sparkles className="h-4 w-4 text-champagne" />
              <span>Reserve Your Presence • RSVP</span>
            </button>
          </div>
        )}
      </div>

      {/* =====================================================================
          INTERFACE B: LAPTOP & DESKTOP (>= 1024px) — Dedicated Widescreen Suite
         ===================================================================== */}
      <div
        className={`hidden lg:block transition-opacity duration-500 ${
          showEnvelope ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <DesktopInvitationView
          isRevealed={!showEnvelope}
          waConfig={waConfig}
          onOpenOrganizerSetup={() => setIsSetupOpen(true)}
          onReopenInvitation={handleReopenInvitation}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
          formValues={rsvpFormValues}
          onFormValuesChange={setRsvpFormValues}
        />
      </div>

      {/* Optional Organizer WhatsApp Link Builder Modal (?setup=1) */}
      <WhatsAppLinkBuilder
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        currentNumber={waConfig.number}
        onApplyOrganizerNumber={(num) => setOrganizerOverride(num)}
      />
    </div>
  )
}
