import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scene Four — Animated Karachi Skyline
 * Features iconic Karachi heritage & modern silhouettes including Mazar-e-Quaid
 * with a glowing golden ceremonial halo, twinkling sky stars, Frere Hall spires,
 * Merewether Clock Tower, silk ribbons, and mirrored water reflection.
 */
export default function KarachiSkyline() {
  const containerRef = useRef(null)
  const skylineGroupRef = useRef(null)
  const haloRef = useRef(null)
  const reflectionRef = useRef(null)
  const ribbonBackRef = useRef(null)
  const ribbonFrontRef = useRef(null)
  const goldStroke1Ref = useRef(null)
  const goldStroke2Ref = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const ctx = gsap.context(() => {
      const buildings = containerRef.current.querySelectorAll('.skyline-building')
      const stars = containerRef.current.querySelectorAll('.sky-star')

      if (prefersReducedMotion) {
        gsap.set([skylineGroupRef.current, buildings, reflectionRef.current], {
          opacity: 1,
          y: 0,
        })
        return
      }

      // Gentle continuous breathing glow behind Mazar-e-Quaid
      if (haloRef.current) {
        gsap.to(haloRef.current, {
          scale: 1.12,
          opacity: 0.85,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          transformOrigin: '605px 155px',
        })
      }

      // Twinkling stars in the Karachi twilight sky
      if (stars.length) {
        gsap.to(stars, {
          opacity: 0.95,
          scale: 1.25,
          duration: 1.8,
          stagger: {
            each: 0.28,
            repeat: -1,
            yoyo: true,
          },
          ease: 'sine.inOut',
        })
      }

      // Skyline rises smoothly and quickly into view
      gsap.fromTo(
        skylineGroupRef.current,
        { y: 18, opacity: 0.4 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Buildings reveal briskly from left to right
      gsap.fromTo(
        buildings,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.42,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Subtle light reflection fades in underneath
      gsap.fromTo(
        reflectionRef.current,
        { opacity: 0, scaleY: 0.85 },
        {
          opacity: 0.55,
          scaleY: 1,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Flowing purple ribbons move at different speeds on scroll
      gsap.to(ribbonBackRef.current, {
        x: -26,
        y: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to(ribbonFrontRef.current, {
        x: 28,
        y: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      })

      // Fine gold lines animate along ribbon edges
      ;[goldStroke1Ref.current, goldStroke2Ref.current].forEach((pathEl) => {
        if (!pathEl) return
        const length = pathEl.getTotalLength ? pathEl.getTotalLength() : 1200
        gsap.fromTo(
          pathEl,
          { strokeDasharray: length, strokeDashoffset: length * 0.75 },
          {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 84%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      aria-label="Karachi Architectural Heritage Illustration"
      className="relative pt-4 pb-2 overflow-hidden select-none"
    >
      <div className="text-center px-4 mb-2">
        <span className="inline-block text-gold-shimmer font-decorative text-[10px] sm:text-xs font-bold tracking-[0.26em] uppercase">
          Celebrating Educational Excellence in Karachi
        </span>
      </div>

      <div className="relative w-full">
        <svg
          className="w-full h-auto block"
          viewBox="0 0 1200 310"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Purple and gold Karachi skyline featuring Mazar-e-Quaid"
        >
          <defs>
            <linearGradient id="skyGlow" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#EDE2FA" stopOpacity="0" />
              <stop offset="65%" stopColor="#E1CEF7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#652080" stopOpacity="0.22" />
            </linearGradient>

            <radialGradient id="mazarAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F5E4BC" stopOpacity="0.62" />
              <stop offset="55%" stopColor="#D9B56E" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#EDE2FA" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="farSkyline" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#9B62B8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#652080" stopOpacity="0.58" />
            </linearGradient>

            <linearGradient id="midSkyline" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#6F258C" />
              <stop offset="100%" stopColor="#35094F" />
            </linearGradient>

            <linearGradient id="mazarGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#8130A1" />
              <stop offset="55%" stopColor="#581873" />
              <stop offset="100%" stopColor="#35094F" />
            </linearGradient>

            <linearGradient id="ribbonSilkA" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#652080" stopOpacity="0.14" />
              <stop offset="50%" stopColor="#8634A8" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#35094F" stopOpacity="0.14" />
            </linearGradient>

            <linearGradient id="goldEdge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D9B56E" stopOpacity="0.1" />
              <stop offset="30%" stopColor="#F5E4BC" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#D9B56E" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#D9B56E" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="waterReflect" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#652080" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#D9B56E" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#EDE2FA" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Soft Lavender Horizon Glow */}
          <rect x="0" y="15" width="1200" height="230" fill="url(#skyGlow)" />

          {/* Twinkling Golden Sky Stars */}
          <g fill="#D9B56E">
            <circle className="sky-star" cx="145" cy="58" r="2.2" opacity="0.35" />
            <circle className="sky-star" cx="290" cy="42" r="2.6" opacity="0.4" />
            <circle className="sky-star" cx="445" cy="64" r="2.0" opacity="0.3" />
            <circle className="sky-star" cx="605" cy="28" r="2.8" opacity="0.5" />
            <circle className="sky-star" cx="760" cy="52" r="2.2" opacity="0.35" />
            <circle className="sky-star" cx="920" cy="46" r="2.5" opacity="0.4" />
            <circle className="sky-star" cx="1055" cy="68" r="2.1" opacity="0.35" />
          </g>

          {/* Radiant Golden Halo Behind Mazar-e-Quaid */}
          <g ref={haloRef}>
            <circle cx="605" cy="155" r="108" fill="url(#mazarAura)" />
            <circle
              cx="605"
              cy="155"
              r="82"
              stroke="#D9B56E"
              strokeOpacity="0.32"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
          </g>

          {/* Back Flowing Silk Ribbon */}
          <g ref={ribbonBackRef}>
            <path
              d="M-80,145 C210,65 490,205 810,120 C1010,68 1140,115 1290,95 L1290,245 L-80,245 Z"
              fill="url(#ribbonSilkA)"
            />
            <path
              ref={goldStroke1Ref}
              d="M-80,145 C210,65 490,205 810,120 C1010,68 1140,115 1290,95"
              stroke="url(#goldEdge)"
              strokeWidth="1.5"
              fill="none"
            />
          </g>

          {/* Main Karachi Skyline Silhouette (Left to Right Reveal) */}
          <g ref={skylineGroupRef}>
            <path
              className="skyline-building"
              d="M40,240 L40,185 L72,185 L72,162 L106,162 L106,240 Z M185,240 L185,152 L222,152 L222,240 Z M860,240 L860,156 L902,156 L902,240 Z M1045,240 L1045,168 L1088,168 L1088,190 L1120,190 L1120,240 Z"
              fill="url(#farSkyline)"
            />

            {/* 1. Clifton Coastal Towers */}
            <g className="skyline-building">
              <path
                d="M78,240 L78,136 L96,122 L114,136 L114,240 Z"
                fill="url(#midSkyline)"
              />
              <rect x="122" y="150" width="34" height="90" fill="url(#midSkyline)" />
              <line x1="96" y1="108" x2="96" y2="122" stroke="#D9B56E" strokeWidth="1.3" />
            </g>

            {/* 2. Merewether Clock Tower */}
            <g className="skyline-building">
              <path
                d="M196,240 L196,158 L204,158 L204,130 L215,96 L226,130 L226,158 L234,158 L234,240 Z"
                fill="url(#midSkyline)"
              />
              <circle cx="215" cy="144" r="5" fill="#EDE2FA" fillOpacity="0.88" />
            </g>

            {/* 3. Habib Bank Plaza & I.I. Chundrigar Towers */}
            <g className="skyline-building">
              <path
                d="M262,240 L262,126 L312,126 L312,240 Z"
                fill="url(#midSkyline)"
              />
              <rect x="272" y="114" width="20" height="12" fill="#4D1566" />
              <line x1="282" y1="96" x2="282" y2="114" stroke="#D9B56E" strokeWidth="1.2" />
              <rect x="322" y="148" width="40" height="92" fill="#4D1566" />
            </g>

            {/* 4. Frere Hall Twin Heritage Spires */}
            <g className="skyline-building">
              <path
                d="M382,240 L382,174 L394,146 L406,174 L466,174 L476,152 L486,174 L496,240 Z"
                fill="url(#midSkyline)"
              />
              <path
                d="M416,240 L416,204 C416,194 428,194 428,204 L428,240 Z M440,240 L440,204 C440,194 452,194 452,204 L452,240 Z"
                fill="#EDE2FA"
                fillOpacity="0.38"
              />
            </g>

            {/* 5. Centerpiece: Mazar-e-Quaid */}
            <g className="skyline-building">
              <polygon points="502,240 520,222 690,222 708,240" fill="#481260" />
              <polygon points="524,222 538,208 672,208 686,222" fill="#5A1A75" />

              <path
                d="M558,136 C558,92 652,92 652,136 Z"
                fill="url(#mazarGrad)"
                stroke="#D9B56E"
                strokeWidth="1.5"
              />
              <line x1="605" y1="88" x2="605" y2="103" stroke="#F5E4BC" strokeWidth="1.8" />
              <circle cx="605" cy="86" r="2.6" fill="#F5E4BC" />

              <polygon
                points="546,208 554,136 656,136 664,208"
                fill="url(#mazarGrad)"
                stroke="#D9B56E"
                strokeOpacity="0.7"
                strokeWidth="1.2"
              />

              <path
                d="M585,208 L585,168 C585,150 625,150 625,168 L625,208 Z"
                fill="#2B0742"
                stroke="#F5E4BC"
                strokeOpacity="0.82"
                strokeWidth="1.1"
              />
            </g>

            {/* 6. Empress Market Gothic Tower */}
            <g className="skyline-building">
              <path
                d="M726,240 L726,178 L758,178 L758,140 L770,115 L782,140 L782,178 L814,178 L814,240 Z"
                fill="url(#midSkyline)"
              />
            </g>

            {/* 7. MCB Tower & Modern Financial District */}
            <g className="skyline-building">
              <path
                d="M838,240 L838,116 L868,108 L882,116 L882,240 Z"
                fill="url(#midSkyline)"
              />
              <line x1="862" y1="88" x2="862" y2="109" stroke="#D9B56E" strokeWidth="1.4" />
              <rect x="910" y="142" width="44" height="98" fill="#4B1364" />
            </g>

            {/* 8. Marine Promenade Silhouette */}
            <g className="skyline-building">
              <path
                d="M972,240 L972,130 C972,116 1012,116 1012,130 L1012,240 Z"
                fill="url(#midSkyline)"
              />
              <rect x="1024" y="160" width="46" height="80" fill="#581873" />
              <rect x="1080" y="178" width="42" height="62" fill="#430F5B" />
            </g>
          </g>

          {/* Front Flowing Silk Ribbon + Gold Trim */}
          <g ref={ribbonFrontRef}>
            <path
              d="M-60,238 C280,212 580,256 910,224 C1065,209 1165,228 1260,220 L1260,244 L-60,244 Z"
              fill="#652080"
              fillOpacity="0.24"
            />
            <path
              ref={goldStroke2Ref}
              d="M-60,236 C280,210 580,254 910,222 C1065,207 1165,226 1260,218"
              stroke="url(#goldEdge)"
              strokeWidth="1.7"
              fill="none"
            />
          </g>

          {/* Horizon Gold Baseline */}
          <line
            x1="40"
            y1="240"
            x2="1160"
            y2="240"
            stroke="url(#goldEdge)"
            strokeWidth="1.6"
          />

          {/* Subtle Mirrored Light Reflection Underneath */}
          <g ref={reflectionRef} style={{ transformOrigin: '600px 240px' }}>
            <ellipse cx="600" cy="256" rx="510" ry="18" fill="url(#waterReflect)" />
            <ellipse cx="605" cy="264" rx="150" ry="16" fill="#D9B56E" fillOpacity="0.2" />
            <line
              x1="280"
              y1="252"
              x2="920"
              y2="252"
              stroke="#D9B56E"
              strokeOpacity="0.4"
              strokeWidth="0.9"
              strokeDasharray="10 8"
            />
            <line
              x1="410"
              y1="264"
              x2="795"
              y2="264"
              stroke="#652080"
              strokeOpacity="0.24"
              strokeWidth="1"
              strokeDasharray="6 10"
            />
            <line
              x1="510"
              y1="276"
              x2="695"
              y2="276"
              stroke="#D9B56E"
              strokeOpacity="0.32"
              strokeWidth="0.8"
            />
          </g>
        </svg>
      </div>
    </section>
  )
}
