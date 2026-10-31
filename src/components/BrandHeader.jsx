import React, { forwardRef } from 'react'
import { EVENT_CONFIG } from '../config/eventConfig'

/**
 * Displays the genuine institutional logos prominently:
 * 1. Western Australia Education Network — WAEN Pakistan
 * 2. Government of Western Australia
 * 3. School Curriculum and Standards Authority — SCSA International
 *
 * On mobile (<560px), WAEN and SCSA sit side-by-side at full readable height
 * beneath the centered Coat of Arms so both WAEN and SCSA are unmistakably clear.
 * On larger screens (>=560px), all three sit side-by-side in one ceremonial row.
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
      <div
        className={`w-full rounded-2xl px-3.5 py-4 sm:px-6 sm:py-5 lg:px-10 lg:py-6 border transition-all ${
          isWhite
            ? 'bg-royal-silk border-champagne/45 shadow-md'
            : 'bg-gradient-to-b from-white via-white to-lavender/45 border-champagne/55 shadow-sm'
        }`}
      >
        {/* Mobile Layout (<560px): Centered Coat of Arms + Prominent Side-by-Side WAEN & SCSA */}
        <div className="flex flex-col items-center gap-3.5 min-[560px]:hidden">
          <div className="brand-logo-item flex items-center justify-center">
            <img
              src={isWhite ? govWaLogo.whiteSrc : govWaLogo.purpleSrc}
              alt={govWaLogo.name}
              loading="eager"
              decoding="async"
              className="h-14 w-auto object-contain select-none"
            />
          </div>

          <div
            className="w-40 h-[1px] bg-gradient-to-r from-transparent via-champagne to-transparent opacity-80"
            aria-hidden="true"
          />

          <div className="w-full grid grid-cols-2 items-center gap-3">
            <div className="brand-logo-item flex items-center justify-center border-r border-champagne/50 pr-2.5">
              <img
                src={isWhite ? waenLogo.whiteSrc : waenLogo.purpleSrc}
                alt={waenLogo.name}
                loading="eager"
                decoding="async"
                className="h-11 min-[390px]:h-12 max-w-full w-auto object-contain select-none"
              />
            </div>

            <div className="brand-logo-item flex items-center justify-center pl-1">
              <img
                src={isWhite ? scsaLogo.whiteSrc : scsaLogo.purpleSrc}
                alt={scsaLogo.name}
                loading="eager"
                decoding="async"
                className="h-10 min-[390px]:h-11 max-w-full w-auto object-contain select-none"
              />
            </div>
          </div>
        </div>

        {/* Tablet & Desktop Layout (>=560px): 3-Column Horizontal Ceremonial Crest */}
        <div className="hidden min-[560px]:flex items-center justify-between gap-4 sm:gap-6 lg:gap-10 max-w-4xl mx-auto">
          {/* 1. WAEN Pakistan */}
          <div className="brand-logo-item flex-1 min-w-0 flex items-center justify-center">
            <img
              src={isWhite ? waenLogo.whiteSrc : waenLogo.purpleSrc}
              alt={waenLogo.name}
              loading="eager"
              decoding="async"
              className="h-13 sm:h-15 md:h-16 lg:h-[4.5rem] max-h-20 max-w-full w-auto object-contain select-none"
            />
          </div>

          <div
            className="h-12 lg:h-16 w-[1px] shrink-0 bg-gradient-to-b from-transparent via-champagne to-transparent opacity-85"
            aria-hidden="true"
          />

          {/* 2. Government of Western Australia */}
          <div className="brand-logo-item shrink-0 flex items-center justify-center px-2 lg:px-4">
            <img
              src={isWhite ? govWaLogo.whiteSrc : govWaLogo.purpleSrc}
              alt={govWaLogo.name}
              loading="eager"
              decoding="async"
              className="h-16 md:h-[4.5rem] lg:h-[5.25rem] w-auto object-contain select-none"
            />
          </div>

          <div
            className="h-12 lg:h-16 w-[1px] shrink-0 bg-gradient-to-b from-transparent via-champagne to-transparent opacity-85"
            aria-hidden="true"
          />

          {/* 3. SCSA International */}
          <div className="brand-logo-item flex-[1.15] min-w-0 flex items-center justify-center">
            <img
              src={isWhite ? scsaLogo.whiteSrc : scsaLogo.purpleSrc}
              alt={scsaLogo.name}
              loading="eager"
              decoding="async"
              className="h-12 sm:h-14 md:h-15 lg:h-[4.25rem] max-h-20 max-w-full w-auto object-contain select-none"
            />
          </div>
        </div>
      </div>
    </header>
  )
})

export default BrandHeader
