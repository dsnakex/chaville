import type { Point, Rect, ZoneMarche } from '../types'

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

/** Le point (les pieds du personnage) est-il dans un obstacle de décor ? */
export function dansObstacle(p: Point, obstacles?: readonly Rect[]): boolean {
  if (!obstacles) return false
  for (const o of obstacles) {
    if (p.x >= o.x && p.x <= o.x + o.w && p.y >= o.y && p.y <= o.y + o.h) return true
  }
  return false
}

/** Repousse un point hors des obstacles vers le bord le plus proche. */
export function pousserHors(p: Point, obstacles?: readonly Rect[]): Point {
  if (!obstacles) return p
  let out = p
  for (const o of obstacles) {
    if (out.x >= o.x && out.x <= o.x + o.w && out.y >= o.y && out.y <= o.y + o.h) {
      // Distance à chacun des quatre bords ; on sort par le plus court.
      const gauche = out.x - o.x
      const droite = o.x + o.w - out.x
      const haut = out.y - o.y
      const bas = o.y + o.h - out.y
      const min = Math.min(gauche, droite, haut, bas)
      if (min === gauche) out = { x: o.x - 1, y: out.y }
      else if (min === droite) out = { x: o.x + o.w + 1, y: out.y }
      else if (min === haut) out = { x: out.x, y: o.y - 1 }
      else out = { x: out.x, y: o.y + o.h + 1 }
    }
  }
  return out
}
