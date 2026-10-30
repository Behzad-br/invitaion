import React, { useEffect, useState } from 'react'
import {
  Check,
  Copy,
  Link2,
  Share2,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react'
import { ENV_WHATSAPP_NUMBER, EVENT_CONFIG } from '../config/eventConfig'
import {
  cleanPhoneDigits,
  isValidWhatsAppNumber,
} from '../utils/whatsapp'

export default function WhatsAppLinkBuilder({
  isOpen,
  onClose,
  currentNumber,
  onApplyOrganizerNumber,
}) {
  const [rawInput, setRawInput] = useState(currentNumber || '')
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [appliedLive, setAppliedLive] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setRawInput(currentNumber || '')
      setCopiedUrl(false)
      setAppliedLive(false)
    }
  }, [isOpen, currentNumber])

  if (!isOpen) return null

  const trimmed = rawInput.trim()
  const hasForbiddenChars = /[+\s\-()]/.test(trimmed)
  const startsWithLocalZero = /^0\d+/.test(trimmed)
  const isValid = isValidWhatsAppNumber(trimmed)
  const hasFixedEnv = isValidWhatsAppNumber(ENV_WHATSAPP_NUMBER)

  const generatedLink = (() => {
    if (typeof window === 'undefined') return ''
    const url = new URL(window.location.origin + window.location.pathname)
    if (isValid) {
      url.searchParams.set('wa', trimmed)
    }
    return url.toString()
  })()

  const handleAutoClean = () => {
    let digits = cleanPhoneDigits(rawInput)
    if (digits.startsWith('00')) {
      digits = digits.slice(2)
    } else if (digits.startsWith('03') && digits.length === 11) {
      // Helpful conversion for standard Pakistani mobile format 03XX -> 923XX
      digits = '92' + digits.slice(1)
    }
    setRawInput(digits)
  }

  const handleCopyGeneratedLink = async () => {
    if (!isValid) return
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 3200)
    } catch {
      const el = document.createElement('textarea')
      el.value = generatedLink
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 3200)
    }
  }

  const handleApplyAndActivate = () => {
    if (!isValid) return
    const nextUrl = new URL(window.location.origin + window.location.pathname)
    nextUrl.searchParams.set('wa', trimmed)
    window.history.replaceState({}, '', nextUrl.toString())
    onApplyOrganizerNumber(trimmed)
    setAppliedLive(true)
    setTimeout(() => {
      onClose()
    }, 650)
  }

  const handleShareGeneratedLink = async () => {
    if (!isValid) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${EVENT_CONFIG.title} — ${EVENT_CONFIG.subtitle}`,
          text: `Official VIP Digital Invitation — ${EVENT_CONFIG.title} (${EVENT_CONFIG.subtitle}), ${EVENT_CONFIG.dateDisplay} at ${EVENT_CONFIG.venueName}.`,
          url: generatedLink,
        })
        return
      } catch (err) {
        if (err && err.name === 'AbortError') return
      }
    }
    await handleCopyGeneratedLink()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-plum-deep/75 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="organizer-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-champagne/65 bg-white p-5 sm:p-7 shadow-2xl max-h-[92dvh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-display text-[10px] font-semibold tracking-[0.25em] text-royal uppercase">
              WAEN Organizer Utility
            </span>
            <h3
              id="organizer-modal-title"
              className="mt-1 font-serif text-2xl font-bold text-plum"
            >
              WhatsApp RSVP &amp; Shareable Link Setup
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close organizer setup"
            className="rounded-full p-2 text-plum/70 hover:bg-lavender/70 hover:text-plum transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {hasFixedEnv && (
          <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-50 p-3.5 text-xs text-emerald-950">
            <strong>Production Environment Number Active:</strong>{' '}
            <code className="font-mono">{ENV_WHATSAPP_NUMBER}</code> is locked via{' '}
            <code className="font-mono">VITE_WAEN_WHATSAPP_NUMBER</code>. All school
            invitations automatically route RSVPs to this verified number.
          </div>
        )}

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="organizer-wa-input"
              className="block text-xs sm:text-sm font-semibold text-plum mb-1.5"
            >
              Official WAEN WhatsApp Number (International Format)
            </label>
            <input
              id="organizer-wa-input"
              type="text"
              inputMode="numeric"
              value={rawInput}
              onChange={(e) => {
                setRawInput(e.target.value)
                setCopiedUrl(false)
              }}
              placeholder="923XXXXXXXXX (digits only, no + or spaces)"
              className="w-full rounded-xl border border-champagne/75 bg-lavender/20 px-4 py-3.5 font-mono text-base text-plum placeholder:text-plum/35 outline-none focus:border-royal focus:bg-white focus:ring-2 focus:ring-royal/20"
            />

            {/* Real-time Validation Guidance */}
            {trimmed.length > 0 && !isValid && (
              <div className="mt-2 rounded-xl bg-amber-50 border border-amber-300/80 p-3 text-xs text-amber-950 space-y-1.5">
                {hasForbiddenChars && (
                  <p>
                    Remove <code className="font-mono">+</code>, spaces, or dashes —
                    use digits only (e.g., <code className="font-mono">923001234567</code>).
                  </p>
                )}
                {startsWithLocalZero && (
                  <p>
                    Replace leading <code className="font-mono">0</code> with country
                    code <code className="font-mono">92</code> (Pakistan) or{' '}
                    <code className="font-mono">61</code> (Australia).
                  </p>
                )}
                {!hasForbiddenChars && !startsWithLocalZero && (
                  <p>
                    Enter a valid 10–15 digit international WhatsApp number starting
                    with country code.
                  </p>
                )}
                {(hasForbiddenChars || startsWithLocalZero) && (
                  <button
                    type="button"
                    onClick={handleAutoClean}
                    className="inline-flex items-center gap-1 font-semibold text-royal underline underline-offset-2"
                  >
                    Auto-format to international digits
                  </button>
                )}
              </div>
            )}

            {isValid && (
              <p className="mt-1.5 text-xs font-medium text-emerald-700 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                <span>Valid international WhatsApp number ({trimmed})</span>
              </p>
            )}
          </div>

          {/* Generated Shareable Invitation Link */}
          {isValid && (
            <div className="rounded-2xl border border-champagne/65 bg-lavender/35 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-royal">
                <Link2 className="h-4 w-4" />
                <span>Shareable Multi-School Invitation Link</span>
              </div>
              <div className="rounded-xl bg-white border border-champagne/50 px-3 py-2.5 font-mono text-xs text-plum break-all select-all">
                {generatedLink}
              </div>
              <p className="text-[11px] text-plum/70 leading-relaxed">
                Contains no guest names or school details — you can send this single
                link to all invited principals and schools.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCopyGeneratedLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-champagne/80 bg-white hover:bg-lavender/60 px-4 py-3 text-xs font-bold tracking-wider uppercase text-plum transition min-h-[44px]"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-700" />
                      <span className="text-emerald-800">Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-royal" />
                      <span>Copy Invitation Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShareGeneratedLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-royal hover:bg-royal-light px-4 py-3 text-xs font-bold tracking-wider uppercase text-white transition min-h-[44px]"
                >
                  <Share2 className="h-4 w-4 text-champagne-light" />
                  <span>Share Link</span>
                </button>
              </div>

              {!hasFixedEnv && (
                <button
                  type="button"
                  onClick={handleApplyAndActivate}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gold-metallic px-4 py-3 text-xs font-bold tracking-wider uppercase text-plum-deep shadow-sm transition hover:brightness-105 min-h-[44px]"
                >
                  {appliedLive ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Activated on This Page</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Activate Number on Current Invitation</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Production Security Guidance */}
          <div className="rounded-xl border border-plum/15 bg-plum/[0.03] p-3.5 text-[11px] sm:text-xs text-plum/80 leading-relaxed flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-royal shrink-0 mt-0.5" />
            <div>
              <strong className="text-plum">Production Security Recommendation:</strong>{' '}
              Query-parameter numbers (<code className="font-mono">?wa=...</code>) are
              convenient for instant link sharing but are not authenticated. For your
              official public deployment, set{' '}
              <code className="font-mono bg-lavender/70 px-1 py-0.5 rounded">
                VITE_WAEN_WHATSAPP_NUMBER={isValid ? trimmed : '923XXXXXXXXX'}
              </code>{' '}
              in your hosting environment variables.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

