import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export default function MusicToggle({ isPlaying, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
      title={isPlaying ? 'Mute Music' : 'Play Soft Music'}
      className="fixed top-3.5 right-3.5 sm:top-5 sm:right-5 z-[60] inline-flex items-center gap-2 rounded-full border border-champagne/75 bg-plum/90 hover:bg-plum backdrop-blur-md px-3.5 py-2 text-[11px] font-semibold tracking-wider uppercase text-champagne-light shadow-lg transition-all active:scale-95"
    >
      {isPlaying ? (
        <>
          <Volume2 className="h-4 w-4 text-champagne-light" />
          <span className="hidden min-[380px]:inline">Music On</span>
        </>
      ) : (
        <>
          <VolumeX className="h-4 w-4 text-lavender/70" />
          <span className="hidden min-[380px]:inline text-lavender/80">
            Music Off
          </span>
        </>
      )}
    </button>
  )
}
