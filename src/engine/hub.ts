import { carnet } from '../state'

const SVG_NS = 'http://www.w3.org/2000/svg'

const el = <K extends keyof SVGElementTagNameMap>(
  nom: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] => {
  const e = document.createElementNS(SVG_NS, nom)
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v))
  return e
}

export interface LieuCarte {
  lieu: string
  /** Scène à charger au clic. */
  scene: string
  nom: string
  at: { x: number; y: number }
  /** Lieu dont l'enquête doit être bouclée pour déverrouiller celui-ci. */
  prereq?: string
  /** Toujours verrouillé (bonus à venir). */
  bonus?: boolean
}

/** Ordre narratif de Chaville, positionné sur assets/decors/carte.png (768×1376). */
export const LIEUX: LieuCarte[] = [
  { lieu: 'place', scene: 'grand-place', nom: 'La Grand-Place', at: { x: 300, y: 980 } },
  { lieu: 'port', scene: 'port', nom: 'Le Port', at: { x: 560, y: 1210 } },
  { lieu: 'manoir', scene: 'manoir', nom: 'Le Manoir', at: { x: 560, y: 150 } },
  { lieu: 'bibliotheque', scene: 'bibliotheque', nom: 'La Bibliothèque', at: { x: 505, y: 880 }, prereq: 'manoir' },
  { lieu: 'theatre', scene: 'theatre', nom: 'Le Théâtre', at: { x: 660, y: 900 }, prereq: 'bibliotheque' },
  { lieu: 'tour', scene: 'tour', nom: 'La Tour de l’Horloge', at: { x: 400, y: 470 }, prereq: 'theatre' },
  { lieu: 'toits', scene: 'toits', nom: 'Les Toits de Chaville', at: { x: 165, y: 620 }, bonus: true },
]

export function estDeverrouille(l: LieuCarte): boolean {
  if (l.bonus) return false
  if (!l.prereq) return true
  return carnet.enqueteResolue(l.prereq)
}

/** La carte-hub : un décor peint + des marqueurs vectoriels (cadenas / étoile). */
export class Hub {
  readonly racine: HTMLDivElement
  private readonly svg: SVGSVGElement

  constructor(private readonly surChoix: (scene: string) => void) {
    this.racine = document.createElement('div')
    this.racine.className = 'scene hub'

    const img = document.createElement('img')
    img.className = 'decor'
    img.src = '/assets/decors/carte.png'
    img.alt = 'La carte de Chaville'
    img.draggable = false
    this.racine.appendChild(img)

    this.svg = document.createElementNS(SVG_NS, 'svg')
    this.svg.setAttribute('viewBox', '0 0 768 1376')
    this.svg.classList.add('calque')
    this.racine.appendChild(this.svg)

    for (const l of LIEUX) this.marqueur(l)
  }

  private marqueur(l: LieuCarte): void {
    const ouvert = estDeverrouille(l)
    const resolu = carnet.enqueteResolue(l.lieu)

    const g = el('g', { class: 'lieu-marqueur', 'data-lieu': l.lieu })
    const socle = el('ellipse', {
      cx: l.at.x, cy: l.at.y + 34, rx: 30, ry: 9, fill: '#2F2A45', opacity: 0.35,
    })
    const halo = el('circle', {
      cx: l.at.x, cy: l.at.y, r: 30,
      fill: ouvert ? 'url(#dGlow)' : '#2F2A45',
      'fill-opacity': ouvert ? 0.8 : 0.5,
      stroke: '#F4C95D', 'stroke-width': 3,
    })
    g.append(socle, halo)

    const icone = el('text', {
      x: l.at.x, y: l.at.y + 10, 'text-anchor': 'middle', 'font-size': 28, 'font-family': 'Fredoka, sans-serif',
    })
    if (resolu) icone.textContent = '⭐'
    else if (!ouvert) icone.textContent = '🔒'
    else { icone.textContent = ''; halo.classList.add('scintille') }
    g.appendChild(icone)

    if (ouvert && !resolu) {
      // Étincelle « à faire » pour les enquêtes ouvertes non résolues.
      const spark = el('use', { href: '#spark', transform: `translate(${l.at.x} ${l.at.y}) scale(1.5)` })
      spark.classList.add('scintille')
      g.appendChild(spark)
    }

    const etiquette = el('g', { class: 'lieu-etiquette' })
    const largeur = Math.max(96, l.nom.length * 12 + 24)
    const rect = el('rect', {
      x: l.at.x - largeur / 2, y: l.at.y + 40, width: largeur, height: 30, rx: 12,
      fill: '#2F2A45', 'fill-opacity': ouvert ? 0.85 : 0.6, stroke: '#F4C95D', 'stroke-width': 1.5,
    })
    const txt = el('text', {
      x: l.at.x, y: l.at.y + 60, 'text-anchor': 'middle', 'font-size': 15,
      'font-family': 'Fredoka, sans-serif', fill: ouvert ? '#F4C95D' : '#C7BBD4',
    })
    txt.textContent = l.nom
    etiquette.append(rect, txt)
    g.appendChild(etiquette)

    // Cible tactile large.
    const cible = el('circle', { cx: l.at.x, cy: l.at.y, r: 46, fill: 'transparent' })
    cible.style.cursor = ouvert ? 'pointer' : 'not-allowed'
    g.appendChild(cible)

    if (ouvert) {
      g.addEventListener('click', () => this.surChoix(l.scene))
    } else {
      g.addEventListener('click', () => {
        g.classList.remove('secoue')
        void g.getBoundingClientRect()
        g.classList.add('secoue')
      })
    }

    this.svg.appendChild(g)
  }

  monter(parent: HTMLElement): void {
    parent.appendChild(this.racine)
  }

  demonter(): void {
    this.racine.remove()
  }
}
