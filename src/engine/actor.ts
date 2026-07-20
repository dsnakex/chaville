import type { Point, ZoneMarche } from '../types'
import { contraindre, distance, echelle } from './geom'

const SVG_NS = 'http://www.w3.org/2000/svg'

interface OptionsActeur {
  symbole: string
  /** Ordonnée des pieds dans le repère du symbole, pour poser le personnage au sol. */
  ancrage: number
  /** Vitesse de marche, en unités de scène par seconde. */
  vitesse: number
  depart: Point
}

/**
 * Personnage posé au sol, qui marche vers un point.
 * Le sol est le trapèze de la scène : l'échelle suit la profondeur.
 */
export class Acteur {
  readonly el: SVGGElement
  pos: Point
  private cible: Point
  private readonly ancrage: number
  private readonly vitesse: number
  private sens = 1
  private phase = 0

  constructor(o: OptionsActeur) {
    this.pos = { ...o.depart }
    this.cible = { ...o.depart }
    this.ancrage = o.ancrage
    this.vitesse = o.vitesse

    this.el = document.createElementNS(SVG_NS, 'g')
    const use = document.createElementNS(SVG_NS, 'use')
    use.setAttribute('href', o.symbole)
    this.el.appendChild(use)
  }

  get enMarche(): boolean {
    return distance(this.pos, this.cible) > 1.5
  }

  allerVers(p: Point, zone: ZoneMarche): void {
    this.cible = contraindre(p, zone)
  }

  /** Repositionne sans animation (entrée dans une scène). */
  placer(p: Point): void {
    this.pos = { ...p }
    this.cible = { ...p }
  }

  regarder(p: Point): void {
    if (Math.abs(p.x - this.pos.x) > 4) this.sens = p.x >= this.pos.x ? 1 : -1
  }

  /** @param dt secondes écoulées. @returns true si le personnage vient d'arriver. */
  maj(dt: number, zone: ZoneMarche): boolean {
    const d = distance(this.pos, this.cible)
    let arrive = false

    if (d > 1.5) {
      const pas = Math.min(d, this.vitesse * dt)
      const dx = (this.cible.x - this.pos.x) / d
      const dy = (this.cible.y - this.pos.y) / d
      if (Math.abs(this.cible.x - this.pos.x) > 4) this.sens = this.cible.x > this.pos.x ? 1 : -1
      this.pos.x += dx * pas
      this.pos.y += dy * pas
      this.phase += dt * 9
      arrive = distance(this.pos, this.cible) <= 1.5
    } else {
      // Léger balancement au repos, pour que la scène reste vivante.
      this.phase += dt * 1.8
    }

    const s = echelle(this.pos.y, zone)
    const bob = Math.sin(this.phase) * (this.enMarche ? 3.5 : 1.6)
    this.el.setAttribute(
      'transform',
      `translate(${this.pos.x.toFixed(1)} ${(this.pos.y + bob).toFixed(1)}) ` +
        `scale(${(s * this.sens).toFixed(3)} ${s.toFixed(3)}) ` +
        `translate(0 ${-this.ancrage})`,
    )
    return arrive
  }
}

/** Pieds du détective et de Pistache dans leurs symboles respectifs. */
export const ANCRAGE_DETECTIVE = 138
export const ANCRAGE_PISTACHE = 38
