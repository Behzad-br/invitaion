/**
 * Official Event & Brand Configuration
 * Western Australian Curriculum — Karachi Launch Ceremony 2026
 */

export const EVENT_CONFIG = {
  kicker: 'INVITATION',
  envelopeCaption: 'YOU ARE CORDIALLY INVITED',
  title: 'Western Australian Curriculum',
  subtitle: 'Karachi Launch Ceremony',
  body: 'The Western Australia Education Network (WAEN) invites you to the Official Karachi Launch Ceremony of the Western Australian Curriculum (Kindergarten to Year 12), following successful launches in Islamabad and Lahore.',

  // Date & Time (Pakistan Standard Time, UTC+05:00)
  dateDisplay: 'Thursday, 12 November 2026',
  timeDisplay: '10:00 AM to 1:00 PM',
  timezoneLabel: 'Pakistan Standard Time (PKT)',
  isoStart: '2026-11-12T10:00:00+05:00',
  isoEnd: '2026-11-12T13:00:00+05:00',

  // Venue
  venueName: 'Governor Hall, Karachi',
  venueAddress: 'Governor Hall, Karachi, Pakistan',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Governor+Hall+Karachi',

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
 *    Set `VITE_WAEN_WHATSAPP_NUMBER=923095500000` in your deployment environment
 *    variables (Vercel / Netlify / Cloudflare Pages).
 *
 * 2. Optional Query-Parameter Fallback (`?wa=923XXXXXXXXX`):
 *    Query-parameter-based numbers are not cryptographically authenticated;
 *    prefer a fixed verified WAEN number in environment configuration.
 */
export const OFFICIAL_WAEN_WHATSAPP = '923095500000' // Official WAEN number (0309-5500000)

export const ENV_WHATSAPP_NUMBER = (
  import.meta.env.VITE_WAEN_WHATSAPP_NUMBER || OFFICIAL_WAEN_WHATSAPP
).trim()
