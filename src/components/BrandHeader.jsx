import React, { forwardRef } from 'react'
import { EVENT_CONFIG } from '../config/eventConfig'

/**
 * Displays the three genuine institutional logos in the official header:
 * 1. Western Australia Education Network — WAEN Pakistan
 * 2. Government of Western Australia
 * 3. School Curriculum and Standards Authority — SCSA International
 */
const BrandHeader = forwardRef(function BrandHeader({ variant = 'purple' }, ref) {
  const [waenLogo, govWaLogo, scsaLogo] = EVENT_CONFIG.logos
  const isWhite = variant === 'white'

  return (
    <header
      ref={ref}
      aria-label="Official Institutional Partners"
      className="w-full"
    >
      {/* Desktop & Mobile (>=350px) 3-Logo Horizontal Crest Row, gracefully stacking on 320px */}
      <div
        className={`w-full rounded-2xl px-3 py-3.5 sm:px-6 sm:py-5 border transition-all ${
          isWhite
            ? 'bg-royal-silk border-champagne/45 shadow-md'
            : 'bg-gradient-to-b from-white via-white to-lavender/45 border-champagne/45 shadow-sm'
        }`}
      >
        <div className="flex flex-col min-[355px]:flex-row items-center justify-between gap-3 min-[355px]:gap-2 sm:gap-5">
          {/* 1. WAEN Pakistan */}
          <div className="brand-logo-item flex-1 min-w-0 flex items-center justify-center">
            <img
              src={isWhite ? waenLogo.whiteSrc : waenLogo.purpleSrc}
              alt={waenLogo.name}
              loading="eager"
              decoding="async"
              className="h-10 min-[355px]:h-9 min-[390px]:h-10 sm:h-14 md:h-16 max-w-full w-auto object-contain select-none"
            />
          </div>

          {/* Ornamental Divider */}
          <div
            className="hidden min-[355px]:block h-9 sm:h-12 w-[1px] shrink-0 bg-gradient-to-b from-transparent via-champagne to-transparent opacity-80"
            aria-hidden="true"
          />
          <div
            className="block min-[355px]:hidden w-24 h-[1px] bg-gradient-to-r from-transparent via-champagne to-transparent opacity-70"
            aria-hidden="true"
          />

          {/* 2. Government of Western Australia */}
          <div className="brand-logo-item shrink-0 flex items-center justify-center px-1 sm:px-2">
            <img
              src={isWhite ? govWaLogo.whiteSrc : govWaLogo.purpleSrc}
              alt={govWaLogo.name}
              loading="eager"
              decoding="async"
              className="h-12 min-[355px]:h-11 min-[390px]:h-12 sm:h-16 md:h-[4.5rem] w-auto object-contain select-none"
            />
          </div>

          {/* Ornamental Divider */}
          <div
            className="hidden min-[355px]:block h-9 sm:h-12 w-[1px] shrink-0 bg-gradient-to-b from-transparent via-champagne to-transparent opacity-80"
            aria-hidden="true"
          />
          <div
            className="block min-[355px]:hidden w-24 h-[1px] bg-gradient-to-r from-transparent via-champagne to-transparent opacity-70"
            aria-hidden="true"
          />

          {/* 3. SCSA International */}
          <div className="brand-logo-item flex-[1.2] min-w-0 flex items-center justify-center">
            <img
              src={isWhite ? scsaLogo.whiteSrc : scsaLogo.purpleSrc}
              alt={scsaLogo.name}
              loading="eager"
              decoding="async"
              className="h-9 min-[355px]:h-8 min-[390px]:h-9 sm:h-13 md:h-15 max-h-14 sm:max-h-16 max-w-full w-auto object-contain select-none"
            />
          </div>
        </div>
      </div>
    </header>
  )
})

export default BrandHeader
