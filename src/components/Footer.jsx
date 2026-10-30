import React from 'react'
import { MailOpen } from 'lucide-react'
import { EVENT_CONFIG } from '../config/eventConfig'

export default function Footer({ onReopenInvitation }) {
  const waenLogo = EVENT_CONFIG.logos[0]
  const scsaLogo = EVENT_CONFIG.logos[2]

  return (
    <footer className="relative rounded-b-[1.6rem] sm:rounded-b-[2rem] bg-royal-silk px-5 py-8 sm:px-8 sm:py-10 text-center text-white overflow-hidden">
      {/* Top Champagne Gold Border Accent */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-champagne to-transparent" />

      <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto">
        {/* Both WAEN & SCSA Official Logos */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <img
            src={waenLogo.whiteSrc}
            alt={waenLogo.name}
            loading="lazy"
            className="h-11 sm:h-13 max-h-14 w-auto object-contain opacity-95"
          />
          <span
            className="hidden min-[380px]:block h-10 w-[1px] bg-champagne/45"
            aria-hidden="true"
          />
          <img
            src={scsaLogo.whiteSrc}
            alt={scsaLogo.name}
            loading="lazy"
            className="h-10 sm:h-12 max-h-13 w-auto object-contain opacity-95"
          />
        </div>

        <p className="mt-4 font-script text-champagne-light text-2xl sm:text-3xl">
          Western Australian Curriculum • Kindergarten to Year 12
        </p>

        <p className="mt-1 text-xs text-lavender/80">
          {EVENT_CONFIG.subtitle} • {EVENT_CONFIG.dateDisplay} •{' '}
          {EVENT_CONFIG.venueName}
        </p>

        <div className="mt-6 flex items-center justify-center">
          <button
            type="button"
            onClick={onReopenInvitation}
            className="foil-sheen inline-flex items-center gap-2 rounded-full border border-champagne/75 bg-white/10 hover:bg-white/20 px-6 py-2.5 text-xs font-semibold tracking-[0.18em] uppercase text-champagne-light shadow-sm transition-all hover:scale-[1.03] active:scale-[0.98] min-h-[44px]"
          >
            <MailOpen className="h-4 w-4" />
            <span>Reopen Invitation</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 w-full text-[11px] text-lavender/55">
          © 2026 Western Australia Education Network (WAEN Pakistan) &amp; SCSA
          International. Official Event Invitation.
        </div>
      </div>
    </footer>
  )
}
