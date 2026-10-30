import React, { useEffect, useMemo, useRef, useState } from 'react'
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
import { EVENT_CONFIG } from './config/eventConfig'
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

  const shareSectionRef = useRef(null)

  const waConfig = useMemo(
    () => resolveWhatsAppConfig(organizerOverride),
    [organizerOverride]
  )

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
      // Refresh ScrollTrigger measurements once main invitation is interactive
      const timer = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 120)
      return () => clearTimeout(timer)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showEnvelope])

  // Hide mobile sticky RSVP bar when RSVP section itself is visible on screen
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
    window.scrollTo({ top: 0, behavior: 'instant' })
    setShowEnvelope(false)
  }

  const handleReopenInvitation = () => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setEnvelopeKey((k) => k + 1)
    setShowEnvelope(true)
  }

  const scrollToRsvp = () => {
    const el = document.getElementById('rsvp-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleShareAction = async () => {
    const shareUrl = buildShareableInvitationUrl(waConfig.number)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${EVENT_CONFIG.title} — ${EVENT_CONFIG.subtitle}`,
          text: `You are cordially invited by WAEN to the ${EVENT_CONFIG.title} — ${EVENT_CONFIG.subtitle} on ${EVENT_CONFIG.dateDisplay} at ${EVENT_CONFIG.venueName}.`,
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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-lavender-soft via-lavender/65 to-lavender-soft py-0 sm:py-8 md:py-12 px-0 sm:px-4">
      {/* Desktop Surrounding Luxury Silk Curves & Subtle Sparkles */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden hidden sm:block"
        aria-hidden="true"
      >
        <div className="absolute -top-36 -left-36 h-96 w-96 rounded-full bg-royal/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-champagne/15 blur-3xl" />
        <div className="absolute -bottom-36 left-1/4 h-96 w-96 rounded-full bg-plum/10 blur-3xl" />
      </div>

      {/* Scene One — Cinematic 3D Envelope Overlay */}
      {showEnvelope && (
        <InvitationEnvelope
          key={envelopeKey}
          onOpenComplete={handleOpenComplete}
          onSkip={handleSkipAnimation}
        />
      )}

      {/* Main Luxury VIP Printed-Style Digital Invitation Card */}
      <main
        className={`relative z-10 mx-auto w-full max-w-3xl transition-opacity duration-500 ${
          showEnvelope ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <article className="vip-paper-surface gold-ornamental-frame relative sm:rounded-[2rem] border-y sm:border border-champagne/70 shadow-luxury overflow-hidden pb-0">
          {/* Ambient Twinkling Golden Starlight & Corner Filigree */}
          <FloatingAtmosphere />

          {/* Top Royal Purple & Champagne Gold Accent Strip */}
          <div className="h-2 w-full bg-gradient-to-r from-plum via-royal to-plum relative">
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-champagne/80" />
          </div>

          {/* Scene Two — Official Invitation Reveal & 3 Genuine Institutional Logos */}
          <InvitationReveal isRevealed={!showEnvelope} />

          {/* Scene Three — Event Details, Countdown, Calendar & Directions */}
          <EventDetails onShareClick={handleShareAction} />

          {/* Scene Five — Interactive WhatsApp RSVP Registration */}
          <RSVPForm
            waConfig={waConfig}
            onOpenOrganizerSetup={() => setIsSetupOpen(true)}
            sectionId="rsvp-section"
          />

          {/* Shareable Multi-School Invitation Panel */}
          <ShareInvitation
            activeWaNumber={waConfig.number}
            sectionRef={shareSectionRef}
          />

          {/* Scene Four — Animated Karachi Skyline Featuring Mazar-e-Quaid */}
          <KarachiSkyline />

          {/* Institutional Footer + Reopen Invitation */}
          <Footer onReopenInvitation={handleReopenInvitation} />
        </article>
      </main>

      {/* Mobile Floating Sticky RSVP Action Pill (auto-hides inside RSVP form) */}
      {!showEnvelope && !isRsvpInView && (
        <div className="fixed bottom-4 inset-x-4 z-40 md:hidden pointer-events-none flex justify-center">
          <button
            type="button"
            onClick={scrollToRsvp}
            className="pointer-events-auto flex items-center justify-center gap-2.5 rounded-full border border-champagne/80 bg-plum/95 backdrop-blur-md px-6 py-3.5 text-xs font-bold tracking-[0.18em] uppercase text-champagne-light shadow-[0_12px_30px_rgba(34,4,54,0.5)] active:scale-95 transition-transform"
          >
            <Sparkles className="h-4 w-4 text-champagne" />
            <span>Reserve Your Presence • RSVP</span>
          </button>
        </div>
      )}

      {/* Discreet Organizer WhatsApp Link Builder Modal */}
      <WhatsAppLinkBuilder
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        currentNumber={waConfig.number}
        onApplyOrganizerNumber={(num) => setOrganizerOverride(num)}
      />
    </div>
  )
}

