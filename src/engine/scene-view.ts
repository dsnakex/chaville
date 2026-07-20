import type { Hotspot, Point, Scene } from '../types'
import { Acteur, ANCRAGE_DETECTIVE, ANCRAGE_PISTACHE } from './actor'
import { contraindre, distance, echelle } from './geom'
import { carnet } from '../state'
import { dialogue } from '../ui/dialogue'
import { bandeau } from '../ui/modal'
import { lancerMiniJeu } from '../minigames'

const SVG_NS = 'http://www.w3.org/2000/svg'

const el = <K extends keyof SVGElementTagNameMap>(
  nom: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] => {
  const e = document.createElementNS(SVG_NS, nom)
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v))
  return e
}

/** Position par défaut où le détective se plante pour interagir. */
const stationDe = (h: Hotspot, scene: Scene): Point =>
  contraindre(h.station ?? { x: h.at.x, y: h.at.y + 90 }, scene.zone)

export class VueScene {
  readonly racine: HTMLDivElement
  private readonly svg: SVGSVGElement
  private readonly detective: Acteur
  private readonly pistache: Acteur
  private readonly marqueurs = new Map<string, SVGGElement>()
  private rafId = 0
  private dernierTemps = 0
  private occupe = false
  private enAttente: Hotspot | null = null

  constructor(
    private readonly scene: Scene,
    private readonly surSortie: (vers: string) => void,
  ) {
    this.racine = document.createElement('div')
    this.racine.className = 'scene'

    const img = document.createElement('img')
    img.className = 'decor'
    img.src = scene.decor
    img.alt = scene.nom
    img.draggable = false
    this.racine.appendChild(img)

    this.svg = document.createElementNS(SVG_NS, 'svg')
    this.svg.setAttribute('viewBox', `0 0 ${scene.largeur} ${scene.hauteur}`)
    this.svg.classList.add('calque')
    this.racine.appendChild(this.svg)

    // Ordre d'empilement de la DA : brume, halos, indices, personnages.
    const gBrume = el('g', { class: 'brume' })
    for (const b of scene.brume) {
      const e = el('ellipse', {
        cx: b.x, cy: b.y, rx: b.rx, ry: b.ry,
        fill: '#C7BBD4', opacity: b.opacite,
      })
      e.style.animation = `derive ${b.duree}s ease-in-out infinite alternate`
      gBrume.appendChild(e)
    }
    this.svg.appendChild(gBrume)

    const gMarqueurs = el('g', { class: 'marqueurs' })
    this.svg.appendChild(gMarqueurs)

    const gActeurs = el('g', {
      class: 'acteurs',
      stroke: '#2F2A45',
      'stroke-width': 2.2,
      'stroke-linejoin': 'round',
    })
    this.svg.appendChild(gActeurs)

    this.detective = new Acteur({
      symbole: '#cat-det',
      ancrage: ANCRAGE_DETECTIVE,
      vitesse: 260,
      depart: scene.arrivee,
    })
    this.pistache = new Acteur({
      symbole: '#mouse-pal',
      ancrage: ANCRAGE_PISTACHE,
      vitesse: 300,
      depart: { x: scene.arrivee.x - 70, y: scene.arrivee.y + 10 },
    })
    gActeurs.append(this.detective.el, this.pistache.el)

    // Pose la transformation tout de suite : sans ça les personnages
    // s'affichent au coin supérieur gauche jusqu'à la première frame.
    this.detective.maj(0, scene.zone)
    this.pistache.maj(0, scene.zone)

    for (const h of scene.hotspots) this.dessinerMarqueur(gMarqueurs, h)

    this.svg.addEventListener('click', this.surClic)
  }

  // --- Marqueurs ----------------------------------------------------------

  private dessinerMarqueur(parent: SVGGElement, h: Hotspot): void {
    if (h.sorte !== 'sortie' && carnet.estResolu(h.id)) return

    const g = el('g', { class: 'marqueur', 'data-id': h.id })
    g.style.cursor = 'pointer'

    if (h.sorte === 'pnj') {
      const halo = el('circle', { cx: h.at.x, cy: h.at.y, r: 58, fill: 'url(#dGlow)', opacity: 0.5 })
      const fen = el('use', { href: '#dW', transform: `translate(${h.at.x - 9} ${h.at.y - 13}) scale(1.3)` })
      g.append(halo, fen)
    } else if (h.sorte === 'sortie') {
      const pastille = el('circle', {
        cx: h.at.x, cy: h.at.y, r: 30,
        fill: '#2F2A45', 'fill-opacity': 0.55,
        stroke: '#F4C95D', 'stroke-width': 2.5,
      })
      // Le chevron pointe vers le bord de l'écran le plus proche.
      const sens = h.at.x < this.scene.largeur / 2 ? -1 : 1
      const fleche = el('path', {
        d:
          `M${h.at.x - 10 * sens},${h.at.y - 12} ` +
          `L${h.at.x + 10 * sens},${h.at.y} ` +
          `L${h.at.x - 10 * sens},${h.at.y + 12}`,
        fill: 'none', stroke: '#F4C95D', 'stroke-width': 4,
        'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      })
      g.append(pastille, fleche)
    } else {
      const taille = h.sorte === 'jeu' ? 1.7 : 1.3
      const etincelle = el('use', {
        href: '#spark',
        transform: `translate(${h.at.x} ${h.at.y}) scale(${taille})`,
      })
      etincelle.classList.add('scintille')
      etincelle.style.animationDelay = `${(h.at.x % 7) * 0.23}s`
      g.appendChild(etincelle)
    }

    // Cible tactile large : les doigts de 9 ans ne visent pas au pixel près.
    g.appendChild(el('circle', { cx: h.at.x, cy: h.at.y, r: 52, fill: 'transparent' }))

    parent.appendChild(g)
    this.marqueurs.set(h.id, g)
  }

  // --- Interaction --------------------------------------------------------

  private surClic = (ev: MouseEvent): void => {
    if (this.occupe) return

    const p = this.pointScene(ev)
    if (!p) return

    const cible = this.scene.hotspots.find(
      (h) => this.marqueurs.has(h.id) && distance(p, h.at) < 60,
    )

    if (cible) {
      this.enAttente = cible
      this.detective.allerVers(stationDe(cible, this.scene), this.scene.zone)
    } else {
      this.enAttente = null
      this.detective.allerVers(p, this.scene.zone)
    }
  }

  /** Convertit un clic écran en coordonnées de scène. */
  private pointScene(ev: MouseEvent): Point | null {
    const ctm = this.svg.getScreenCTM()
    if (!ctm) return null
    const pt = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(ctm.inverse())
    return { x: pt.x, y: pt.y }
  }

  private async interagir(h: Hotspot): Promise<void> {
    this.occupe = true
    this.detective.regarder(h.at)

    if (h.dialogue?.length) await dialogue(h.dialogue, h.voix ?? 'narrateur')

    if (h.sorte === 'sortie' && h.vers) {
      this.occupe = false
      this.surSortie(h.vers)
      return
    }

    let reussi = true
    if (h.jeu) reussi = await lancerMiniJeu(h.jeu, this.scene.decor)

    if (reussi) {
      if (h.indice) {
        carnet.ajouter(h.id, h.indice.titre, h.indice.texte, this.scene.nom)
        bandeau(`📓 Nouvel indice : ${h.indice.titre}`)
      } else {
        carnet.marquerResolu(h.id)
      }
      this.marqueurs.get(h.id)?.remove()
      this.marqueurs.delete(h.id)
    } else {
      bandeau('Tu pourras y revenir quand tu veux.', 2000)
    }

    this.occupe = false
  }

  // --- Boucle -------------------------------------------------------------

  private boucle = (t: number): void => {
    const dt = this.dernierTemps ? Math.min((t - this.dernierTemps) / 1000, 0.05) : 0
    this.dernierTemps = t

    const arrive = this.detective.maj(dt, this.scene.zone)

    // Pistache trotte derrière, du côté opposé au bord le plus proche.
    const cote = this.detective.pos.x > this.scene.zone.centreX ? -1 : 1
    const suivi: Point = {
      x: this.detective.pos.x + cote * 78,
      y: this.detective.pos.y + 14,
    }
    if (distance(this.pistache.pos, suivi) > 34) {
      this.pistache.allerVers(suivi, this.scene.zone)
    }
    this.pistache.maj(dt, this.scene.zone)

    // Les personnages passent devant ou derrière selon leur profondeur.
    const zD = echelle(this.detective.pos.y, this.scene.zone)
    const zP = echelle(this.pistache.pos.y, this.scene.zone)
    if (zP > zD && this.pistache.el.previousSibling === this.detective.el) {
      this.pistache.el.parentNode?.insertBefore(this.pistache.el, this.detective.el)
    } else if (zD >= zP && this.detective.el.previousSibling === this.pistache.el) {
      this.detective.el.parentNode?.insertBefore(this.detective.el, this.pistache.el)
    }

    if (arrive && this.enAttente && !this.occupe) {
      const h = this.enAttente
      this.enAttente = null
      void this.interagir(h)
    }

    this.rafId = requestAnimationFrame(this.boucle)
  }

  monter(parent: HTMLElement): void {
    parent.appendChild(this.racine)
    this.dernierTemps = 0
    this.rafId = requestAnimationFrame(this.boucle)
  }

  demonter(): void {
    cancelAnimationFrame(this.rafId)
    this.svg.removeEventListener('click', this.surClic)
    this.racine.remove()
  }
}
