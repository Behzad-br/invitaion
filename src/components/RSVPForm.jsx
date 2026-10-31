import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  Minus,
  Plus,
  Settings2,
} from 'lucide-react'
import { buildRSVPMessage, openWhatsAppRSVP } from '../utils/whatsapp'

gsap.registerPlugin(ScrollTrigger)

function WhatsAppIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.031 2C6.508 2 2.023 6.485 2.023 12.007c0 1.766.461 3.49 1.337 5.01L2 22l5.122-1.343a9.967 9.967 0 0 0 4.907 1.294h.004c5.522 0 10.007-4.485 10.007-10.007A9.975 9.975 0 0 0 19.11 4.87 9.972 9.972 0 0 0 12.031 2Zm5.826 14.122c-.246.693-1.432 1.326-1.995 1.41-.51.076-1.156.108-1.866-.117-.431-.137-.984-.319-1.693-.625-2.98-1.287-4.926-4.287-5.075-4.486-.148-.199-1.213-1.614-1.213-3.078 0-1.465.768-2.185 1.04-2.483.273-.298.595-.373.793-.373.198 0 .397.002.57.01.183.009.428-.07.669.511.248.596.842 2.06.916 2.209.075.149.124.323.025.521-.099.199-.149.323-.297.497-.149.174-.313.389-.446.522-.149.148-.304.31-.13.608.173.298.77 1.27 1.653 2.057 1.136 1.013 2.094 1.327 2.391 1.476.298.149.471.124.645-.075.173-.198.743-.868.942-1.166.198-.298.396-.248.669-.149.272.099 1.734.818 2.031.967.298.149.496.223.57.347.075.125.075.72-.171 1.413Z" />
    </svg>
  )
}

export default function RSVPForm({
  waConfig,
  onOpenOrganizerSetup,
  sectionId = 'rsvp-section',
  idPrefix = 'mobile',
  variant = 'mobile',
  formValues,
  onFormValuesChange,
}) {
  const sectionRef = useRef(null)
  const panelRef = useRef(null)

  const [localValues, setLocalValues] = useState({
    fullName: '',
    institution: '',
    designation: '',
    attendees: 1,
  })

  const values = formValues || localValues
  const updateValues = (patch) => {
    if (onFormValuesChange) {
      onFormValuesChange((prev) => ({ ...prev, ...patch }))
    } else {
      setLocalValues((prev) => ({ ...prev, ...patch }))
    }
  }

  const { fullName, institution, designation, attendees } = values

  const [errors, setErrors] = useState({})
  const [whatsappOpened, setWhatsappOpened] = useState(false)
  const [copiedMessage, setCopiedMessage] = useState(false)

  const isDesktop = variant === 'desktop'

  useEffect(() => {
    if (isDesktop) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(panelRef.current, { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [isDesktop])

  const validateFields = () => {
    const nextErrors = {}
    if (!fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.'
    }
    if (!institution.trim()) {
      nextErrors.institution = 'Please enter your school or institution name.'
    }
    const count = Number(attendees)
    if (!Number.isFinite(count) || count < 1 || count > 25) {
      nextErrors.attendees = 'Please enter a valid number of attendees (1–25).'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setWhatsappOpened(false)

    if (!validateFields()) return

    if (!waConfig.isConfigured) {
      setErrors((prev) => ({
        ...prev,
        config:
          'Official WAEN WhatsApp number is not configured yet. Please configure the WAEN number before opening WhatsApp, or copy your RSVP message below.',
      }))
      return
    }

    const launched = openWhatsAppRSVP(waConfig.number, {
      fullName,
      institution,
      designation,
      attendees,
    })

    if (!launched) return
    setWhatsappOpened(true)
  }

  const handleCopyFallback = async () => {
    if (!validateFields()) return
    const msg = buildRSVPMessage({
      fullName,
      institution,
      designation,
      attendees,
    })

    try {
      await navigator.clipboard.writeText(msg)
      setCopiedMessage(true)
      setTimeout(() => setCopiedMessage(false), 3500)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = msg
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedMessage(true)
      setTimeout(() => setCopiedMessage(false), 3500)
    }
  }

  const adjustAttendees = (delta) => {
    const current = Number(attendees) || 1
    updateValues({ attendees: Math.min(25, Math.max(1, current + delta)) })
  }

  const nameId = `${idPrefix}-rsvp-full-name`
  const instId = `${idPrefix}-rsvp-institution`
  const desigId = `${idPrefix}-rsvp-designation`
  const attId = `${idPrefix}-rsvp-attendees`
  const headingId = `${idPrefix}-rsvp-heading`
  const errNameId = `${idPrefix}-err-full-name`
  const errInstId = `${idPrefix}-err-institution`

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      aria-labelledby={headingId}
      className={
        isDesktop
          ? 'relative w-full'
          : 'relative px-4 pt-6 pb-8 sm:px-8 sm:pt-8 sm:pb-10 scroll-mt-6'
      }
    >
      <div
        ref={panelRef}
        className={
          isDesktop
            ? 'rounded-2xl border border-champagne/75 bg-gradient-to-b from-white via-white to-lavender/45 p-6 xl:p-7 shadow-[0_18px_45px_rgba(12,2,24,0.35)] text-plum'
            : 'rounded-3xl border border-champagne/65 bg-gradient-to-b from-lavender/50 via-white to-lavender/40 p-5 min-[375px]:p-6 sm:p-9 shadow-luxury'
        }
      >
        {!isDesktop && (
          <div className="text-center max-w-lg mx-auto">
            <span className="inline-block text-gold-shimmer font-decorative text-[11px] sm:text-xs font-bold tracking-[0.26em] uppercase">
              VIP Attendance Registration
            </span>
            <h2
              id={headingId}
              className="mt-1 font-serif text-3xl sm:text-4xl font-extrabold text-royal-shimmer"
            >
              Reserve Your Presence
            </h2>
            <p className="mt-2 font-sans text-sm sm:text-base text-plum/80">
              Kindly confirm your participation by providing your details below.
            </p>
          </div>
        )}

        {isDesktop && (
          <h2 id={headingId} className="sr-only">
            Reserve Your Presence
          </h2>
        )}

        {/* Clear Configuration Notice when WAEN WhatsApp number is not supplied yet */}
        {!waConfig.isConfigured && (
          <div
            role="status"
            className={`${
              isDesktop ? 'mb-4' : 'mt-6'
            } rounded-2xl border border-amber-500/45 bg-amber-50/90 p-4 text-left text-plum shadow-sm`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                <p className="font-semibold text-amber-950">
                  Organizer WhatsApp Number Required Before Dispatch
                </p>
                <p className="mt-1 text-amber-900/90">
                  To protect guests from sending RSVPs to an unverified number, direct
                  WhatsApp redirection is paused until the official WAEN WhatsApp
                  number is set via{' '}
                  <code className="font-mono text-[11px] bg-amber-100 px-1.5 py-0.5 rounded">
                    VITE_WAEN_WHATSAPP_NUMBER
                  </code>{' '}
                  or an organizer invitation link.
                </p>
                <button
                  type="button"
                  onClick={onOpenOrganizerSetup}
                  className="mt-2.5 inline-flex items-center gap-1.5 font-semibold text-royal hover:text-plum underline underline-offset-4"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  <span>Configure Official WAEN Number &amp; Shareable Link</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className={
            isDesktop
              ? 'space-y-4'
              : 'mt-6 sm:mt-7 space-y-4 sm:space-y-5'
          }
        >
          {/* Full Name (Required) */}
          <div>
            <label
              htmlFor={nameId}
              className="block text-xs sm:text-sm font-semibold tracking-wide text-plum mb-1.5"
            >
              Full Name <span className="text-royal">*</span>
            </label>
            <input
              id={nameId}
              name="fullName"
              type="text"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => {
                updateValues({ fullName: e.target.value })
                if (errors.fullName) setErrors({ ...errors, fullName: null })
              }}
              placeholder="e.g., Dr. Ayesha Siddiqui"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? errNameId : undefined}
              className={`w-full rounded-xl border bg-white px-4 ${
                isDesktop ? 'py-3 text-sm xl:text-base' : 'rounded-2xl py-3.5 text-base'
              } text-plum placeholder:text-plum/40 shadow-sm outline-none transition-all focus:ring-2 ${
                errors.fullName
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                  : 'border-champagne/65 focus:border-royal focus:ring-royal/20'
              }`}
            />
            {errors.fullName && (
              <p id={errNameId} className="mt-1.5 text-xs font-medium text-red-600">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* School / Institution Name (Required) */}
          <div>
            <label
              htmlFor={instId}
              className="block text-xs sm:text-sm font-semibold tracking-wide text-plum mb-1.5"
            >
              School / Institution Name <span className="text-royal">*</span>
            </label>
            <input
              id={instId}
              name="institution"
              type="text"
              required
              autoComplete="organization"
              value={institution}
              onChange={(e) => {
                updateValues({ institution: e.target.value })
                if (errors.institution) setErrors({ ...errors, institution: null })
              }}
              placeholder="Your School / Institution Name"
              aria-invalid={Boolean(errors.institution)}
              aria-describedby={errors.institution ? errInstId : undefined}
              className={`w-full rounded-xl border bg-white px-4 ${
                isDesktop ? 'py-3 text-sm xl:text-base' : 'rounded-2xl py-3.5 text-base'
              } text-plum placeholder:text-plum/40 shadow-sm outline-none transition-all focus:ring-2 ${
                errors.institution
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                  : 'border-champagne/65 focus:border-royal focus:ring-royal/20'
              }`}
            />
            {errors.institution && (
              <p id={errInstId} className="mt-1.5 text-xs font-medium text-red-600">
                {errors.institution}
              </p>
            )}
          </div>

          {/* Designation & Number of Attendees Row */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="sm:col-span-3">
              <label
                htmlFor={desigId}
                className="block text-xs sm:text-sm font-semibold tracking-wide text-plum mb-1.5"
              >
                Designation{' '}
                <span className="font-normal text-plum/55">(Optional)</span>
              </label>
              <input
                id={desigId}
                name="designation"
                type="text"
                autoComplete="organization-title"
                value={designation}
                onChange={(e) => updateValues({ designation: e.target.value })}
                placeholder="e.g., Principal / Head of Academics"
                className={`w-full rounded-xl border border-champagne/65 bg-white px-4 ${
                  isDesktop ? 'py-3 text-sm xl:text-base' : 'rounded-2xl py-3.5 text-base'
                } text-plum placeholder:text-plum/40 shadow-sm outline-none transition-all focus:border-royal focus:ring-2 focus:ring-royal/20`}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor={attId}
                className="block text-xs sm:text-sm font-semibold tracking-wide text-plum mb-1.5"
              >
                Number of Attendees
              </label>
              <div
                className={`flex items-center ${
                  isDesktop ? 'rounded-xl p-0.5' : 'rounded-2xl p-1'
                } border border-champagne/65 bg-white shadow-sm focus-within:border-royal focus-within:ring-2 focus-within:ring-royal/20`}
              >
                <button
                  type="button"
                  onClick={() => adjustAttendees(-1)}
                  aria-label="Decrease number of attendees"
                  className={`flex ${
                    isDesktop ? 'h-10 w-9' : 'h-11 w-11'
                  } shrink-0 items-center justify-center rounded-lg text-royal hover:bg-lavender/70 active:scale-95 transition`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  id={attId}
                  name="attendees"
                  type="number"
                  min={1}
                  max={25}
                  value={attendees}
                  onChange={(e) => updateValues({ attendees: e.target.value })}
                  className="w-full bg-transparent text-center text-base font-semibold text-plum outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => adjustAttendees(1)}
                  aria-label="Increase number of attendees"
                  className={`flex ${
                    isDesktop ? 'h-10 w-9' : 'h-11 w-11'
                  } shrink-0 items-center justify-center rounded-lg text-royal hover:bg-lavender/70 active:scale-95 transition`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {errors.attendees && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.attendees}
                </p>
              )}
            </div>
          </div>

          {errors.config && !waConfig.isConfigured && (
            <p className="text-xs sm:text-sm font-medium text-amber-800 bg-amber-100/80 border border-amber-300 rounded-xl px-3.5 py-2.5">
              {errors.config}
            </p>
          )}

          {/* Primary Confirm via WhatsApp CTA */}
          <div className="pt-1.5 space-y-2.5">
            <button
              type="submit"
              disabled={!waConfig.isConfigured}
              className={`w-full rounded-xl px-6 ${
                isDesktop ? 'py-3.5 min-h-[52px] text-sm' : 'rounded-2xl py-4 min-h-[56px] text-sm sm:text-base'
              } font-bold tracking-[0.14em] uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-md ${
                waConfig.isConfigured
                  ? 'foil-sheen bg-gradient-to-r from-royal via-royal-light to-plum text-white hover:shadow-luxury hover:scale-[1.01] active:scale-[0.99] border border-champagne/75'
                  : 'bg-plum/25 text-plum/55 cursor-not-allowed border border-plum/15 shadow-none'
              }`}
            >
              <WhatsAppIcon className="h-5 w-5 text-champagne-light shrink-0" />
              <span>CONFIRM VIA WHATSAPP</span>
              {waConfig.isConfigured && (
                <ExternalLink className="h-4 w-4 opacity-75 shrink-0" />
              )}
            </button>

            {/* Copy RSVP Message Fallback */}
            <button
              type="button"
              onClick={handleCopyFallback}
              className={`w-full ${
                isDesktop ? 'rounded-xl py-2.5 min-h-[42px] text-xs' : 'rounded-2xl py-3.5 min-h-[48px] text-xs sm:text-sm'
              } border border-champagne/65 bg-white hover:bg-lavender/50 active:scale-[0.99] px-5 font-semibold tracking-wider uppercase text-royal transition-all flex items-center justify-center gap-2`}
            >
              {copiedMessage ? (
                <>
                  <Check className="h-4 w-4 text-emerald-700" />
                  <span className="text-emerald-800">
                    RSVP Message Copied to Clipboard
                  </span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy RSVP Message (Fallback)</span>
                </>
              )}
            </button>
          </div>

          {/* Honest Post-Click Guidance */}
          {whatsappOpened && (
            <div
              role="status"
              className="rounded-xl border border-royal/30 bg-lavender/65 p-3.5 text-xs sm:text-sm text-plum leading-relaxed"
            >
              <p className="font-semibold text-royal">
                Complete Your Confirmation Inside WhatsApp
              </p>
              <p className="mt-1">
                WhatsApp has been launched with your formatted RSVP details. Please
                tap <strong>Send</strong> inside the WhatsApp chat window so the WAEN
                team receives your response.
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
