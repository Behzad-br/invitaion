import { EVENT_CONFIG } from '../config/eventConfig'

/**
 * Generates and downloads a standards-compliant RFC 5545 `.ics` calendar invite
 * for Thursday, 12 November 2026, 10:00 AM – 01:00 PM Pakistan Standard Time (UTC+05:00).
 *
 * 10:00 AM PKT = 05:00:00 UTC (`20261112T050000Z`)
 * 01:00 PM PKT = 08:00:00 UTC (`20261112T080000Z`)
 */
export function downloadEventICS() {
  const nowUtc = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')

  const description = [
    'Official Karachi Launching Ceremony of the Western Australian Curriculum (Kindergarten – Year 12).',
    'Hosted by the Western Australia Education Network (WAEN Pakistan) in association with the Government of Western Australia and SCSA International.',
    '',
    'Date: Thursday, 12 November 2026',
    'Time: 10:00 AM – 01:00 PM (Pakistan Standard Time)',
    'Venue: Marriott Hotel, Karachi',
  ].join('\\n')

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WAEN Pakistan//Western Australian Curriculum Karachi Launch 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Karachi',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0500',
    'TZOFFSETTO:+0500',
    'TZNAME:PKT',
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    'UID:waen-karachi-launch-20261112@waenpakistan.org',
    `DTSTAMP:${nowUtc}`,
    'DTSTART;TZID=Asia/Karachi:20261112T100000',
    'DTEND;TZID=Asia/Karachi:20261112T130000',
    `SUMMARY:${EVENT_CONFIG.title} — ${EVENT_CONFIG.subtitle}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${EVENT_CONFIG.venueName}, 9 Abdullah Haroon Road, Karachi, Pakistan`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Western Australian Curriculum — Karachi Launching Ceremony tomorrow at 10:00 AM',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  const icsContent = icsLines.join('\r\n')
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'WAEN-Karachi-Launching-Ceremony-2026.ics')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

