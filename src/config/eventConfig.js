/**
 * Official Event & Brand Configuration
 * Western Australian Curriculum — Karachi Launching Ceremony 2026
 */

export const EVENT_CONFIG = {
  kicker: 'INVITATION',
  envelopeCaption: 'YOU ARE CORDIALLY INVITED',
  title: 'Western Australian Curriculum',
  subtitle: 'Karachi Launching Ceremony',
  body: 'The Western Australia Education Network (WAEN) invites you to the official Karachi launch of the Western Australian Curriculum (Kindergarten – Year 12), following successful launches in Islamabad and Lahore.',

  // Date & Time (Pakistan Standard Time, UTC+05:00)
  dateDisplay: 'Thursday, 12 November 2026',
  timeDisplay: '10:00 AM – 01:00 PM',
  timezoneLabel: 'Pakistan Standard Time (PKT)',
  isoStart: '2026-11-12T10:00:00+05:00',
  isoEnd: '2026-11-12T13:00:00+05:00',

  // Venue
  venueName: 'Marriott Hotel, Karachi',
  venueAddress: '9 Abdullah Haroon Road, Civil Lines, Karachi, Pakistan',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Marriott+Hotel+Karachi+Abdullah+Haroon+Road',

  // Genuine Supplied Institutional Logos (in required order)
  logos: [
    {
      id: 'waen',
      name: 'Western Australia Education Network — WAEN Pakistan',
      shortName: 'WAEN Pakistan',
      purpleSrc: '/logos/waen-purple.png',
      whiteSrc: '/logos/waen-white.png',
    },
    {
      id: 'gov-wa',
      name: 'Government of Western Australia',
      shortName: 'Government of Western Australia',
      purpleSrc: '/logos/gov-wa-purple.png',
      whiteSrc: '/logos/gov-wa-white.png',
    },
    {
      id: 'scsa',
      name: 'School Curriculum and Standards Authority — SCSA International',
      shortName: 'SCSA International',
      purpleSrc: '/logos/scsa-purple.png',
      whiteSrc: '/logos/scsa-white.png',
    },
  ],

  crestAssets: {
    gold: '/logos/waen-crest-gold.png',
    purple: '/logos/waen-crest-purple.png',
    white: '/logos/waen-crest-white.png',
  },
}

/**
 * SECURITY NOTE ON WHATSAPP NUMBER CONFIGURATION:
 * ---------------------------------------------------------------------------
 * 1. Preferred Official Production Configuration:
 *    Set `VITE_WAEN_WHATSAPP_NUMBER=923XXXXXXXXX` in your deployment environment
 *    variables (Vercel / Netlify / Cloudflare Pages). When an environment-configured
 *    number is valid, it serves as the trusted source of truth.
 *
 * 2. Optional Query-Parameter Fallback (`?wa=923XXXXXXXXX`):
 *    Supported so an organizer can generate and distribute a single shareable
 *    invitation link before hardcoding an environment variable.
 *    IMPORTANT: Query-parameter-based numbers are NOT cryptographically
 *    authenticated—anyone editing the URL query string could substitute a
 *    different phone number. Therefore, for the official production deployment,
 *    always configure a fixed, verified WAEN WhatsApp number via
 *    `VITE_WAEN_WHATSAPP_NUMBER`!
 *
 * 3. Never invent or hardcode a placeholder WhatsApp number.
 */
export const OFFICIAL_WAEN_WHATSAPP = '923095500000' // Official WAEN number (0309-5500000)

export const ENV_WHATSAPP_NUMBER = (
  import.meta.env.VITE_WAEN_WHATSAPP_NUMBER || OFFICIAL_WAEN_WHATSAPP
).trim()

