import type { Point, Rect, ZoneMarche } from '../types'
import { contraindre, dansObstacle, distance, echelle, pousserHors } from './geom'

const SVG_NS = 'http://www.w3.org/2000/svg'

/** Les trois poses dessinées ; « left » = « side » retourné horizontalement. */
export interface JeuDeSprites {
  front: string
  side: string
  back: string
}

interface OptionsActeur {
  sprites: JeuDeSprites
  /** Ordonnée des pieds dans le repère du symbole, pour poser le personnage au sol. */
  ancrage: number
  /** Vitesse de marche, en unités de scène par seconde. */
  vitesse: number
  depart: Point
}

type Direction = 'front' | 'back' | 'side'

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
  private readonly sprites: JeuDeSprites
  private readonly use: SVGUseElement
  private sens = 1
  private phase = 0
  private direction: Direction = 'front'

  constructor(o: OptionsActeur) {
    this.pos = { ...o.depart }
    this.cible = { ...o.depart }
    this.ancrage = o.ancrage
    this.vitesse = o.vitesse
    this.sprites = o.sprites

    this.el = document.createElementNS(SVG_NS, 'g')
    this.use = document.createElementNS(SVG_NS, 'use')
    this.use.setAttribute('href', o.sprites.front)
    this.el.appendChild(this.use)
  }

  /** Choisit la pose selon le vecteur de déplacement (front/back/side). */
  private orienter(dx: number, dy: number): void {
    let dir: Direction
    if (Math.abs(dx) > Math.abs(dy) * 1.1) {
      dir = 'side'
      this.sens = dx >= 0 ? 1 : -1
    } else {
      dir = dy < 0 ? 'back' : 'front'
    }
    if (dir !== this.direction) {
      this.direction = dir
      this.use.setAttribute('href', this.sprites[dir])
    }
  }

  get enMarche(): boolean {
    return distance(this.pos, this.cible) > 1.5
  }

  allerVers(p: Point, zone: ZoneMarche, obstacles?: readonly Rect[]): void {
    this.cible = pousserHors(contraindre(p, zone), obstacles)
  }

  /** Repositionne sans animation (entrée dans une scène). */
  placer(p: Point): void {
    this.pos = { ...p }
    this.cible = { ...p }
    this.direction = 'front'
    this.use.setAttribute('href', this.sprites.front)
  }

  regarder(p: Point): void {
    this.orienter(p.x - this.pos.x, p.y - this.pos.y)
  }

  /** @param dt secondes écoulées. @returns true si le personnage vient d'arriver. */
  maj(dt: number, zone: ZoneMarche, obstacles?: readonly Rect[]): boolean {
    const d = distance(this.pos, this.cible)
    let arrive = false

    if (d > 1.5) {
      const pas = Math.min(d, this.vitesse * dt)
      const ux = (this.cible.x - this.pos.x) / d
      const uy = (this.cible.y - this.pos.y) / d
      this.orienter(this.cible.x - this.pos.x, this.cible.y - this.pos.y)

      // Glissement le long des obstacles : on tente le pas complet, puis
      // seulement en x, puis seulement en y ; sinon on reste sur place.
      const candidats: Point[] = [
        { x: this.pos.x + ux * pas, y: this.pos.y + uy * pas },
        { x: this.pos.x + ux * pas, y: this.pos.y },
        { x: this.pos.x, y: this.pos.y + uy * pas },
      ]
      const libre = candidats.find((c) => !dansObstacle(c, obstacles))
      if (libre) {
        this.pos = libre
      } else {
        // Coincé : on abandonne la cible pour ne pas rester bloqué à pousser.
        this.cible = { ...this.pos }
      }
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
