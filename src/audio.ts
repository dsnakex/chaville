import { carnet } from './state'

/**
 * Sons du jeu, synthétisés en WebAudio (aucun fichier externe).
 * Discrets, chaleureux, jamais agressifs — public enfant. Le son ne démarre
 * qu'au premier geste du joueur (politique navigateur) et respecte le drapeau
 * « muet » persistant de la sauvegarde.
 */

type Effet = 'bonne' | 'victoire' | 'etincelle'

let ctx: AudioContext | null = null

function contexte(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

/** Une note douce (onde sinus + petite enveloppe, sans attaque brutale). */
function note(freq: number, debut: number, duree: number, gainMax = 0.14): void {
  const c = ctx
  if (!c) return
  const t = c.currentTime + debut
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(gainMax, t + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duree)
  osc.connect(gain).connect(c.destination)
  osc.start(t)
  osc.stop(t + duree + 0.02)
}

// Petites phrases musicales (notes de la gamme, intervalles consonants).
const PHRASES: Record<Effet, () => void> = {
  // Deux notes qui montent : « c'est juste ».
  bonne: () => { note(587.33, 0, 0.16); note(880, 0.09, 0.22) },
  // Petit arpège de victoire (do-mi-sol-do).
  victoire: () => { note(523.25, 0, 0.18); note(659.25, 0.12, 0.18); note(783.99, 0.24, 0.2); note(1046.5, 0.36, 0.34, 0.16) },
  // Scintillement bref et aigu : ramassage d'étincelle.
  etincelle: () => { note(1174.66, 0, 0.1, 0.1); note(1567.98, 0.06, 0.14, 0.09) },
}

export const audio = {
  /** À appeler sur un geste utilisateur, pour débloquer l'AudioContext. */
  reveiller(): void {
    if (!carnet.muet()) contexte()
  },

  jouer(effet: Effet): void {
    if (carnet.muet()) return
    if (!contexte()) return
    PHRASES[effet]()
  },

  estMuet: (): boolean => carnet.muet(),

  /** Bascule le son ; @returns true si désormais muet. */
  basculer(): boolean {
    const muet = carnet.basculerMuet()
    if (!muet) contexte() // petit accusé sonore à la réactivation
    if (!muet) PHRASES.etincelle()
    return muet
  },
}
