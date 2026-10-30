/**
 * Soft Ceremonial Ambient Piano & Warm Pad Audio Engine (Web Audio API)
 * Produces a gentle, soothing instrumental progression ("halka sa background music")
 * with zero external MP3 dependencies, instant start on user gesture, and auto-pause
 * when switching to WhatsApp or another tab.
 */

// Warm Eb Major / Ab Major ceremonial chord progression (frequencies in Hz)
const CHORD_PROGRESSION = [
  // Ebmaj7: Eb3, Bb3, D4, G4, Bb4
  [155.56, 233.08, 293.66, 392.0, 466.16],
  // Cm9: C3, G3, Bb3, D4, Eb4
  [130.81, 196.0, 233.08, 293.66, 311.13],
  // Abmaj9: Ab2, Eb3, G3, Bb3, C4
  [103.83, 155.56, 196.0, 233.08, 261.63],
  // Bb6/9: Bb2, F3, G3, C4, D4
  [116.54, 174.61, 196.0, 261.63, 293.66],
]

class CeremonialAudioEngine {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.isPlaying = false
    this.chordIndex = 0
    this.schedulerTimer = null
  }

  init() {
    if (this.ctx) return
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return

    this.ctx = new AudioCtx()
    this.masterGain = this.ctx.createGain()
    // Keep volume soft and gentle ("halka sa background music")
    this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime)

    // Gentle low-pass warmth filter + subtle echo delay for concert-hall softness
    this.filter = this.ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.frequency.setValueAtTime(1350, this.ctx.currentTime)

    this.delay = this.ctx.createDelay(1.0)
    this.delay.delayTime.setValueAtTime(0.38, this.ctx.currentTime)

    this.delayFeedback = this.ctx.createGain()
    this.delayFeedback.gain.setValueAtTime(0.26, this.ctx.currentTime)

    this.delayWet = this.ctx.createGain()
    this.delayWet.gain.setValueAtTime(0.28, this.ctx.currentTime)

    this.filter.connect(this.masterGain)
    this.filter.connect(this.delay)
    this.delay.connect(this.delayFeedback)
    this.delayFeedback.connect(this.delay)
    this.delay.connect(this.delayWet)
    this.delayWet.connect(this.masterGain)

    this.masterGain.connect(this.ctx.destination)
  }

  playFeltPianoNote(freq, startTime, duration = 3.4, velocity = 0.14) {
    if (!this.ctx || !this.filter) return

    const noteGain = this.ctx.createGain()
    noteGain.gain.setValueAtTime(0.0001, startTime)
    // Soft felt-piano attack and long warm decay
    noteGain.gain.linearRampToValueAtTime(velocity, startTime + 0.06)
    noteGain.gain.exponentialRampToValueAtTime(
      velocity * 0.35,
      startTime + duration * 0.45
    )
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

    // Fundamental sine + delicate triangle harmonic for warm acoustic character
    const oscMain = this.ctx.createOscillator()
    oscMain.type = 'sine'
    oscMain.frequency.setValueAtTime(freq, startTime)

    const oscWarm = this.ctx.createOscillator()
    oscWarm.type = 'triangle'
    oscWarm.frequency.setValueAtTime(freq * 2, startTime)

    const overtoneGain = this.ctx.createGain()
    overtoneGain.gain.setValueAtTime(0.08, startTime)
    overtoneGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.65)

    oscMain.connect(noteGain)
    oscWarm.connect(overtoneGain)
    overtoneGain.connect(noteGain)
    noteGain.connect(this.filter)

    oscMain.start(startTime)
    oscWarm.start(startTime)
    oscMain.stop(startTime + duration + 0.05)
    oscWarm.stop(startTime + duration + 0.05)
  }

  playWarmPadBass(freq, startTime, duration = 4.2) {
    if (!this.ctx || !this.filter) return

    const padGain = this.ctx.createGain()
    padGain.gain.setValueAtTime(0.0001, startTime)
    padGain.gain.linearRampToValueAtTime(0.075, startTime + 0.9)
    padGain.gain.linearRampToValueAtTime(0.055, startTime + duration - 0.9)
    padGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, startTime)

    osc.connect(padGain)
    padGain.connect(this.filter)

    osc.start(startTime)
    osc.stop(startTime + duration + 0.05)
  }

  scheduleMeasure() {
    if (!this.isPlaying || !this.ctx) return

    const now = this.ctx.currentTime + 0.05
    const chord = CHORD_PROGRESSION[this.chordIndex % CHORD_PROGRESSION.length]
    this.chordIndex += 1

    // Soft sustained root bass pad
    this.playWarmPadBass(chord[0], now, 4.3)

    // Gentle arpeggiated felt-piano notes across the 4.2s bar
    const offsets = [0, 0.55, 1.1, 1.75, 2.55, 3.3]
    const pattern = [chord[1], chord[2], chord[3], chord[4], chord[3], chord[2]]

    pattern.forEach((noteFreq, idx) => {
      const vel = idx === 3 ? 0.13 : 0.095
      this.playFeltPianoNote(noteFreq, now + offsets[idx], 3.1, vel)
    })
  }

  async start() {
    this.init()
    if (!this.ctx) return false

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume()
      } catch {
        return false
      }
    }

    if (this.isPlaying) return true
    this.isPlaying = true

    const now = this.ctx.currentTime
    this.masterGain.gain.cancelScheduledValues(now)
    this.masterGain.gain.setValueAtTime(
      Math.max(0.0001, this.masterGain.gain.value),
      now
    )
    // Gentle fade-in to a soft, pleasant background level (0.22)
    this.masterGain.gain.linearRampToValueAtTime(0.22, now + 1.2)

    this.scheduleMeasure()
    this.schedulerTimer = setInterval(() => {
      if (this.isPlaying && this.ctx && this.ctx.state === 'running') {
        this.scheduleMeasure()
      }
    }, 4200)

    return true
  }

  stop() {
    this.isPlaying = false
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer)
      this.schedulerTimer = null
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.setValueAtTime(
        Math.max(0.0001, this.masterGain.gain.value),
        now
      )
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)
    }
  }
}

export const ceremonialAudio = new CeremonialAudioEngine()

