import type { Point, ZoneMarche } from '../types'

export const clamp = (v: number, min: number, max: number): number =>
  v < min ? min : v > max ? max : v

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

/** Position 0 (fond de scène) → 1 (premier plan) d'un point dans la zone marchable. */
export function profondeur(y: number, z: ZoneMarche): number {
  return clamp((y - z.yHaut) / (z.yBas - z.yHaut), 0, 1)
}

/** Échelle du personnage selon sa profondeur : petit au loin, grand au premier plan. */
export function echelle(y: number, z: ZoneMarche): number {
  return lerp(z.echelleLoin, z.echelleProche, profondeur(y, z))
}

/** Ramène un point dans le trapèze marchable (plus étroit au fond). */
export function contraindre(p: Point, z: ZoneMarche): Point {
  const y = clamp(p.y, z.yHaut, z.yBas)
  const demi = lerp(z.demiLargeurHaut, z.demiLargeurBas, profondeur(y, z))
  return { x: clamp(p.x, z.centreX - demi, z.centreX + demi), y }
}

export const distance = (a: Point, b: Point): number => Math.hypot(b.x - a.x, b.y - a.y)
