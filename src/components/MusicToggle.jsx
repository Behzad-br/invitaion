import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export default function MusicToggle({ isPlaying, onToggle }) {
  return (
    <button
      type="button"
      data-music-toggle="true"
      onClick={onToggle}
      aria-label={isPlaying ? 'Turn background music off' : 'Turn background music on'}
      title={isPlaying ? 'Turn Music Off' : 'Turn Music On'}
      className="fixed top-3.5 right-3.5 sm:top-5 sm:right-5 z-[60] inline-flex items-center gap-2 rounded-full border border-champagne/80 bg-plum/90 hover:bg-plum backdrop-blur-md px-3.5 py-2 text-[11px] font-semibold tracking-wider uppercase text-champagne-light shadow-lg transition-all active:scale-95"
    >
      {isPlaying ? (
        <>
          <Volume2 className="h-4 w-4 text-champagne-light" />
          <span>Music Off</span>
        </>
      ) : (
        <>
          <VolumeX className="h-4 w-4 text-lavender/75" />
          <span className="text-lavender/85">Music On</span>
        </>
      )}
    </button>
  )
}
