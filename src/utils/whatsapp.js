import { ENV_WHATSAPP_NUMBER, EVENT_CONFIG } from '../config/eventConfig'

/**
 * Strictly validates an international WhatsApp phone number:
 * - Digits ONLY (no `+`, spaces, hyphens, or parentheses)
 * - 10 to 15 digits per ITU-T E.164 international numbering plan
 * - Rejects obvious dummy patterns like `0000000000` or `X` placeholders
 */
export function isValidWhatsAppNumber(value) {
  if (!value || typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!/^[1-9]\d{9,14}$/.test(trimmed)) return false
  if (/^(\d)\1+$/.test(trimmed)) return false
  return true
}

/**
 * Sanitizes organizer input while preserving validation visibility
 */
export function cleanPhoneDigits(raw) {
  if (!raw || typeof raw !== 'string') return ''
  return raw.replace(/[^\d]/g, '')
}

/**
 * Resolves the active WAEN WhatsApp number in priority order:
 * 1. Verified build-time environment variable (`VITE_WAEN_WHATSAPP_NUMBER`), if valid.
 * 2. Organizer-supplied runtime override or `?wa=` query parameter, if valid.
 *
 * NOTE: Query-parameter numbers (`?wa=...`) are not authenticated. In official
 * production deployments, set `VITE_WAEN_WHATSAPP_NUMBER` so the verified WAEN
 * number is fixed and cannot be altered via URL parameters.
 */
export function resolveWhatsAppConfig(organizerOverride = '') {
  if (isValidWhatsAppNumber(ENV_WHATSAPP_NUMBER)) {
    return {
      number: ENV_WHATSAPP_NUMBER,
      source: 'env',
      isConfigured: true,
    }
  }

  if (isValidWhatsAppNumber(organizerOverride)) {
    return {
      number: organizerOverride.trim(),
      source: 'organizer',
      isConfigured: true,
    }
  }

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const waParam = (params.get('wa') || '').trim()
    if (isValidWhatsAppNumber(waParam)) {
      return {
        number: waParam,
        source: 'query',
        isConfigured: true,
      }
    }
  }

  return {
    number: '',
    source: 'none',
    isConfigured: false,
  }
}

/**
 * Builds the formatted RSVP message using dynamic guest form values.
 */
export function buildRSVPMessage({
  fullName,
  institution,
  designation,
  attendees,
}) {
  const safeName = (fullName || '').trim()
  const safeSchool = (institution || '').trim()
  const safeDesignation = (designation || '').trim() || 'Not specified'
  const count = Number(attendees) >= 1 ? String(Math.floor(Number(attendees))) : '1'

  return [
    'Hello WAEN Team,',
    '',
    'I would like to confirm my participation in the Western Australian Curriculum — Karachi Launching Ceremony.',
    '',
    `Full Name: ${safeName}`,
    '',
    `School / Institution: ${safeSchool}`,
    '',
    `Designation: ${safeDesignation}`,
    '',
    `Number of Attendees: ${count}`,
    '',
    `Event Date: ${EVENT_CONFIG.dateDisplay}`,
    '',
    `Time: ${EVENT_CONFIG.timeDisplay}`,
    '',
    `Venue: ${EVENT_CONFIG.venueName}`,
    '',
    'Thank you.',
  ].join('\n')
}

/**
 * Generates a properly URL-encoded `https://wa.me/NUMBER?text=ENCODED_MESSAGE` URL.
 */
export function buildWhatsAppRSVPUrl(whatsappNumber, formValues) {
  if (!isValidWhatsAppNumber(whatsappNumber)) {
    return null
  }
  const message = buildRSVPMessage(formValues)
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${whatsappNumber.trim()}?text=${encodedMessage}`
}

/**
 * Generates a direct native mobile app deep link (`whatsapp://send?phone=NUMBER&text=ENCODED_MESSAGE`)
 * so Android and iPhone open the installed WhatsApp app directly into the chat composer
 * instead of routing through a browser landing page or WhatsApp Web.
 */
export function buildWhatsAppNativeAppUrl(whatsappNumber, formValues) {
  if (!isValidWhatsAppNumber(whatsappNumber)) {
    return null
  }
  const message = buildRSVPMessage(formValues)
  const encodedMessage = encodeURIComponent(message)
  return `whatsapp://send?phone=${whatsappNumber.trim()}&text=${encodedMessage}`
}

/**
 * Detects mobile / tablet devices (Android, iPhone, iPad, iPod)
 */
export function isMobileDevice() {
  if (typeof navigator === 'undefined') return false
  if (navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean') {
    if (navigator.userAgentData.mobile) return true
  }
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
      navigator.userAgent || ''
    )
  ) {
    return true
  }
  // Also catch iOS/Android browsers even when "Desktop site" mode is toggled on
  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(pointer: coarse)').matches &&
    (navigator.maxTouchPoints || 0) >= 1
  ) {
    return true
  }
  return false
}

/**
 * Launches WhatsApp optimally for the visitor's device:
 * - On Mobile (iPhone / Android): Opens the native WhatsApp app directly via `whatsapp://send`
 *   so it never detours to WhatsApp Web, with a graceful `https://wa.me/` fallback if the app is absent.
 * - On Desktop: Opens `https://wa.me/NUMBER?text=...` in a new tab.
 */
export function openWhatsAppRSVP(whatsappNumber, formValues) {
  const webUrl = buildWhatsAppRSVPUrl(whatsappNumber, formValues)
  const nativeUrl = buildWhatsAppNativeAppUrl(whatsappNumber, formValues)
  if (!webUrl || !nativeUrl) return false

  if (isMobileDevice()) {
    let didLeaveBrowser = false
    const markLeft = () => {
      didLeaveBrowser = true
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        didLeaveBrowser = true
      }
    }

    window.addEventListener('blur', markLeft, { once: true })
    window.addEventListener('pagehide', markLeft, { once: true })
    document.addEventListener('visibilitychange', onVisibility)

    // Directly invoke the native WhatsApp mobile app chat screen
    window.location.href = nativeUrl

    // Fallback to universal wa.me link ONLY if native app did not open
    setTimeout(() => {
      window.removeEventListener('blur', markLeft)
      window.removeEventListener('pagehide', markLeft)
      document.removeEventListener('visibilitychange', onVisibility)

      if (!didLeaveBrowser && document.visibilityState === 'visible') {
        window.location.href = webUrl
      }
    }, 1600)

    return true
  }

  // Desktop browsers: open universal wa.me link
  const popup = window.open(webUrl, '_blank', 'noopener,noreferrer')
  if (!popup) {
    window.location.href = webUrl
  }
  return true
}

/**
 * Builds a clean, shareable invitation URL for schools.
 * Strictly excludes any guest personal details (name, school, designation, etc.)
 * so one link can be safely shared across all invited schools.
 */
export function buildShareableInvitationUrl(customWaNumber = '') {
  if (typeof window === 'undefined') return ''
  const url = new URL(window.location.origin + window.location.pathname)

  // Only include `?wa=` if no fixed env var is set and a valid number is supplied
  if (!isValidWhatsAppNumber(ENV_WHATSAPP_NUMBER)) {
    const candidate = customWaNumber.trim()
    if (isValidWhatsAppNumber(candidate)) {
      url.searchParams.set('wa', candidate)
    } else {
      const existing = new URLSearchParams(window.location.search).get('wa') || ''
      if (isValidWhatsAppNumber(existing.trim())) {
        url.searchParams.set('wa', existing.trim())
      }
    }
  }

  return url.toString()
}

