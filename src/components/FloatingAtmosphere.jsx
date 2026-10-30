import React, { useMemo } from 'react'

/**
 * Subtle Golden Sparkles & Ornamental Corner Filigree
 * Keeps the invitation clean, steady, and distraction-free while adding a refined luxury finish.
 */
export default function FloatingAtmosphere() {
  const sparkles = useMemo(
    () => [
      { id: 1, left: '5%', top: '12%', size: 12, delay: '0s', dur: '4.2s' },
      { id: 2, left: '93%', top: '15%', size: 13, delay: '1.1s', dur: '4.6s' },
      { id: 3, left: '7%', top: '52%', size: 11, delay: '2.0s', dur: '4.0s' },
      { id: 4, left: '92%', top: '56%', size: 12, delay: '0.7s', dur: '4.5s' },
      { id: 5, left: '10%', top: '86%', size: 12, delay: '1.4s', dur: '4.3s' },
      { id: 6, left: '89%', top: '88%', size: 12, delay: '2.2s', dur: '4.1s' },
    ],
    []
  )

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden z-[3]"
      aria-hidden="true"
    >
      {sparkles.map((s) => (
        <svg
          key={s.id}
          className="absolute animate-twinkle text-champagne/75"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: s.delay,
            animationDuration: s.dur,
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0C12.6 6.8 17.2 11.4 24 12C17.2 12.6 12.6 17.2 12 24C11.4 17.2 6.8 12.6 0 12C6.8 11.4 11.4 6.8 12 0Z" />
        </svg>
      ))}

      <CornerFiligree position="top-left" />
      <CornerFiligree position="top-right" />
    </div>
  )
}

function CornerFiligree({ position }) {
  const isRight = position === 'top-right'
  return (
    <svg
      className={`absolute top-5 ${
        isRight ? 'right-4 sm:right-6 -scale-x-100' : 'left-4 sm:left-6'
      } w-10 h-10 sm:w-13 sm:h-13 text-champagne/60`}
      viewBox="0 0 64 64"
      fill="none"
    >
      <path
        d="M2 46V12C2 6.477 6.477 2 12 2H46"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 34V14C8 10.686 10.686 8 14 8H34"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.65"
        strokeLinecap="round"
      />
      <circle cx="14" cy="14" r="2.2" fill="currentColor" />
    </svg>
  )
}
