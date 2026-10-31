import React, { useState } from 'react'
import { Check, Copy, Link2, Share2 } from 'lucide-react'
import { EVENT_CONFIG } from '../config/eventConfig'
import { buildShareableInvitationUrl } from '../utils/whatsapp'

export default function ShareInvitation({ activeWaNumber, sectionRef }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = buildShareableInvitationUrl(activeWaNumber)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 3200)
    } catch {
      const input = document.createElement('textarea')
      input.value = shareUrl
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 3200)
    }
  }

  const handleNativeShare = async () => {
    const shareData = {
      title: `${EVENT_CONFIG.title} — ${EVENT_CONFIG.subtitle}`,
      text: `You are cordially invited by the Western Australia Education Network (WAEN) to the ${EVENT_CONFIG.title} — ${EVENT_CONFIG.subtitle} on ${EVENT_CONFIG.dateDisplay} at ${EVENT_CONFIG.venueName}.`,
      url: shareUrl,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        if (err && err.name === 'AbortError') return
      }
    }
    await copyToClipboard()
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Share Invitation Link"
      className="px-4 pb-8 sm:px-8 sm:pb-10 lg:px-0 lg:pt-6 lg:pb-0"
    >
      <div className="rounded-2xl border border-champagne/55 bg-white/90 p-5 sm:p-6 text-center shadow-sm">
        <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-lavender/75 border border-champagne/55 text-royal">
          <Link2 className="h-4 w-4" />
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-plum">
          Share Official Invitation
        </h3>
        <p className="mt-1 font-sans text-xs sm:text-sm text-plum/75 max-w-md mx-auto">
          Forward this digital invitation link to fellow school leaders, principals,
          or institutional representatives.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-lg mx-auto">
          <button
            type="button"
            onClick={copyToClipboard}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-champagne/75 bg-lavender/45 hover:bg-lavender px-4 py-3 text-xs sm:text-sm font-bold tracking-[0.12em] uppercase text-plum transition-all min-h-[48px]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-700 shrink-0" />
                <span className="text-emerald-800">Invitation Link Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-royal shrink-0" />
                <span>COPY INVITATION LINK</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-royal/25 bg-royal hover:bg-royal-light px-5 py-3 text-xs sm:text-sm font-semibold tracking-[0.1em] uppercase text-white transition-all min-h-[48px]"
          >
            <Share2 className="h-4 w-4 text-champagne-light shrink-0" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </section>
  )
}

