/**
 * Background MP3 Audio Controller (/audio/background-music.mp3)
 * Plays the supplied background music track at a soft, low volume (0.14),
 * attempts immediate autoplay when the invitation link opens, seamlessly unlocks
 * on first touch if browser autoplay policy requires a gesture, and provides
 * instant Mute / Unmute control at the top of the screen.
 */

const TARGET_LOW_VOLUME = 0.14 // Gentle low background volume ("low voice")

class BackgroundMusicController {
  constructor() {
    this.audio = null
    this.fadeInterval = null
    this.listeners = new Set()
  }

  ensureAudio() {
    if (typeof window === 'undefined') return null
    if (!this.audio) {
      const el = new Audio('/audio/background-music.mp3')
      el.loop = true
      el.preload = 'auto'
      el.playsInline = true
      el.setAttribute('playsinline', '')
      el.setAttribute('webkit-playsinline', '')
      el.volume = TARGET_LOW_VOLUME

      el.addEventListener('play', () => this.notify(true))
      el.addEventListener('pause', () => this.notify(false))
      el.addEventListener('ended', () => this.notify(false))

      this.audio = el
    }
    return this.audio
  }

  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notify(isPlaying) {
    this.listeners.forEach((cb) => {
      try {
        cb(isPlaying)
      } catch {
        // ignore listener errors
      }
    })
  }

  clearFade() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval)
      this.fadeInterval = null
    }
  }

  fadeInToLowVolume() {
    const el = this.ensureAudio()
    if (!el) return
    this.clearFade()
    let current = 0.03
    el.volume = current
    this.fadeInterval = setInterval(() => {
      current = Math.min(TARGET_LOW_VOLUME, current + 0.015)
      el.volume = current
      if (current >= TARGET_LOW_VOLUME) {
        this.clearFade()
      }
    }, 55)
  }

  async start() {
    const el = this.ensureAudio()
    if (!el) return false

    if (!el.paused) {
      el.volume = TARGET_LOW_VOLUME
      this.notify(true)
      return true
    }

    try {
      el.volume = 0.03
      await el.play()
      this.fadeInToLowVolume()
      this.notify(true)
      return true
    } catch {
      this.notify(false)
      return false
    }
  }

  stop() {
    this.clearFade()
    if (this.audio && !this.audio.paused) {
      this.audio.pause()
    }
    this.notify(false)
  }

  isPlaying() {
    return Boolean(this.audio && !this.audio.paused)
  }
}

export const ceremonialAudio = new BackgroundMusicController()
