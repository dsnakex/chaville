import type { Hotspot, Point, Scene } from '../types'
import { Acteur, ANCRAGE_DETECTIVE, ANCRAGE_PISTACHE } from './actor'
import { contraindre, dansObstacle, distance, echelle, pousserHors } from './geom'
import { carnet } from '../state'
import { dialogue, dialogueChoix } from '../ui/dialogue'
import { montrerCarteFG } from '../ui/carte-fg'
import { bandeau } from '../ui/modal'
import { lancerMiniJeu } from '../minigames'
import { lancerConfrontation } from '../minigames/confrontation'
import { SPRITES_DETECTIVE, SPRITES_PISTACHE, PORTRAITS, corpsSVG, HAUTEUR_CORPS } from '../art'
import type { OptionsPortrait } from '../art'

const SVG_NS = 'http://www.w3.org/2000/svg'

const el = <K extends keyof SVGElementTagNameMap>(
  nom: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] => {
  const e = document.createElementNS(SVG_NS, nom)
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v))
  return e
}

/**
 * Décalage d'animation propre à chaque PNJ (0 → 3,9 s), dérivé de son id.
 * Les coordonnées sont souvent des multiples de 10 : un hash sur la position
 * les ferait respirer à l'unisson. Le hash sur l'identifiant les désynchronise.
 */
function decalageAnimation(id: string): string {
  let hash = 7
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 997
  return `${((hash % 40) / 10).toFixed(2)}s`
}

/** Position par défaut où le détective se plante pour interagir. */
const stationDe = (h: Hotspot, scene: Scene): Point =>
  pousserHors(contraindre(h.station ?? { x: h.at.x, y: h.at.y + 90 }, scene.zone), scene.obstacles)

export class VueScene {
  readonly racine: HTMLDivElement
  private readonly svg: SVGSVGElement
  private readonly gMarqueurs: SVGGElement
  /** Calque des PNJ déjà rencontrés : dessinés, mais non interactifs. */
  private readonly gStatiques: SVGGElement
  private readonly statiques = new Set<string>()
  private readonly detective: Acteur
  private readonly pistache: Acteur
  private readonly marqueurs = new Map<string, SVGGElement>()
  private rafId = 0
  private dernierTemps = 0
  private occupe = false
  private enAttente: Hotspot | null = null
  /** Temps écoulé sans que le joueur trouve un indice (astuce de Pistache). */
  private inactif = 0

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
      const e = el('ellipse', { cx: b.x, cy: b.y, rx: b.rx, ry: b.ry, fill: '#C7BBD4', opacity: b.opacite })
      e.style.animation = `derive ${b.duree}s ease-in-out infinite alternate`
      gBrume.appendChild(e)
    }
    this.svg.appendChild(gBrume)

    this.gStatiques = el('g', { class: 'pnj-statiques' })
    this.svg.appendChild(this.gStatiques)

    this.gMarqueurs = el('g', { class: 'marqueurs' })
    this.svg.appendChild(this.gMarqueurs)

    const gActeurs = el('g', {
      class: 'acteurs', stroke: '#2F2A45', 'stroke-width': 2.2, 'stroke-linejoin': 'round',
    })
    this.svg.appendChild(gActeurs)

    this.detective = new Acteur({
      sprites: SPRITES_DETECTIVE, ancrage: ANCRAGE_DETECTIVE, vitesse: 260, depart: scene.arrivee,
    })
    this.pistache = new Acteur({
      sprites: SPRITES_PISTACHE, ancrage: ANCRAGE_PISTACHE, vitesse: 300,
      depart: { x: scene.arrivee.x - 70, y: scene.arrivee.y + 10 },
    })
    gActeurs.append(this.detective.el, this.pistache.el)
    this.detective.maj(0, scene.zone)
    this.pistache.maj(0, scene.zone)

    for (const h of scene.hotspots) this.dessinerMarqueur(h)

    this.svg.addEventListener('click', this.surClic)
  }

  // --- Marqueurs ----------------------------------------------------------

  /** Un hotspot verrouillé (requiert) n'apparaît pas tant qu'il n'est pas prêt. */
  private estDisponible(h: Hotspot): boolean {
    if (h.requiert && !h.requiert.every((id) => carnet.estResolu(id))) return false
    return true
  }

  /** Un point déjà fait ne se redessine pas (indice, étincelle, casse-tête). */
  private dejaFait(h: Hotspot): boolean {
    if (h.sorte === 'etincelle') return carnet.etincelleRamassee(h.id)
    if (h.sorte === 'cassetete') return carnet.cassetetereussi(h.id)
    return carnet.estResolu(h.id)
  }

  /** Les PNJ restent en scène une fois qu'on leur a parlé (habitants du lieu). */
  private estPersonnage(h: Hotspot): boolean {
    return h.sorte === 'pnj' || h.sorte === 'temoin' || h.sorte === 'cassetete'
  }

  /**
   * Point d'ancrage d'un hotspot.
   *
   * `at` est le point du MARQUEUR, souvent posé en hauteur sur le décor (une
   * fenêtre éclairée, un cadran d'horloge). Un personnage, lui, doit se tenir
   * DEBOUT SUR LE SOL : on l'ancre donc au point de station — celui où le
   * détective vient déjà se planter pour lui parler, garanti dans la zone
   * marchable. Les objets (étincelle, jeu, déduction, sortie) restent sur `at`.
   */
  private ancrageDe(h: Hotspot): Point {
    return this.estPersonnage(h) ? stationDe(h, this.scene) : h.at
  }

  /** Version « décor » d'un PNJ : toujours dessiné, mais plus interactif. */
  private poserPnjStatique(h: Hotspot): void {
    if (this.statiques.has(h.id)) return
    const opts = this.portraitDe(h)
    if (!opts) return
    const sol = this.ancrageDe(h)
    const s = echelle(sol.y, this.scene.zone)
    const g = el('g', { class: 'pnj-statique', 'data-id': h.id })
    g.append(el('ellipse', { cx: sol.x, cy: sol.y + 2, rx: 30 * s, ry: 8 * s, fill: '#2F2A45', opacity: 0.28 }))
    const perso = el('g')
    perso.setAttribute('transform', `translate(${sol.x} ${sol.y}) scale(${s.toFixed(3)}) translate(0 -138)`)
    perso.innerHTML = corpsSVG(opts)
    perso.style.setProperty('--pnj-decalage', decalageAnimation(h.id))
    g.appendChild(perso)
    this.gStatiques.appendChild(g)
    this.statiques.add(h.id)
  }

  private dessinerMarqueur(h: Hotspot): void {
    if (h.sorte !== 'sortie' && this.dejaFait(h)) {
      // Un habitant déjà rencontré continue d'occuper son poste.
      if (this.estPersonnage(h)) this.poserPnjStatique(h)
      return
    }
    if (!this.estDisponible(h)) return
    if (this.marqueurs.has(h.id)) return

    const g = el('g', { class: 'marqueur', 'data-id': h.id })
    g.style.cursor = 'pointer'

    if (h.sorte === 'pnj' || h.sorte === 'temoin' || h.sorte === 'cassetete') {
      this.dessinerPersonnage(g, h, h.sorte === 'cassetete')
    } else if (h.sorte === 'etincelle') {
      // Étincelle cachée : discrète, sans halo — il faut la chercher.
      // Classe à part : le bouton loupe ne doit PAS la révéler (voir CSS).
      g.classList.add('marqueur-etincelle')
      const etincelle = el('use', {
        href: '#spark', transform: `translate(${h.at.x} ${h.at.y}) scale(0.75)`,
        opacity: 0.5, stroke: '#2F2A45', 'stroke-width': 1,
      })
      etincelle.classList.add('etincelle-cachee')
      etincelle.style.animationDelay = `${(h.at.x % 11) * 0.4}s`
      g.appendChild(etincelle)
    } else if (h.sorte === 'deduction') {
      const halo = el('circle', { cx: h.at.x, cy: h.at.y, r: 70, fill: 'url(#dGlow)' })
      halo.classList.add('halo-pulse')
      const anneau = el('circle', {
        cx: h.at.x, cy: h.at.y, r: 30, fill: '#2F2A45', 'fill-opacity': 0.6,
        stroke: '#F4C95D', 'stroke-width': 3,
      })
      const loupe = el('text', { x: h.at.x, y: h.at.y + 11, 'text-anchor': 'middle', 'font-size': 30 })
      loupe.textContent = '🔍'
      g.append(halo, anneau, loupe)
    } else if (h.sorte === 'sortie') {
      const pastille = el('circle', {
        cx: h.at.x, cy: h.at.y, r: 30, fill: '#2F2A45', 'fill-opacity': 0.55,
        stroke: '#F4C95D', 'stroke-width': 2.5,
      })
      const sens = h.at.x < this.scene.largeur / 2 ? -1 : 1
      const fleche = el('path', {
        d: `M${h.at.x - 10 * sens},${h.at.y - 12} L${h.at.x + 10 * sens},${h.at.y} L${h.at.x - 10 * sens},${h.at.y + 12}`,
        fill: 'none', stroke: '#F4C95D', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      })
      g.append(pastille, fleche)
    } else {
      // Objet interactif (indice / mini-jeu) : halo pulsant + étincelle d'or
      // cernée d'encre pour contraster même sur la brume claire.
      const halo = el('circle', { cx: h.at.x, cy: h.at.y, r: 44, fill: 'url(#dGlow)' })
      halo.classList.add('halo-pulse')
      halo.style.animationDelay = `${(h.at.x % 5) * 0.31}s`
      const taille = h.sorte === 'jeu' ? 1.8 : 1.4
      const etincelle = el('use', {
        href: '#spark', transform: `translate(${h.at.x} ${h.at.y}) scale(${taille})`,
        stroke: '#2F2A45', 'stroke-width': 1.3, 'stroke-linejoin': 'round',
      })
      etincelle.classList.add('scintille')
      etincelle.style.animationDelay = `${(h.at.x % 7) * 0.23}s`
      g.append(halo, etincelle)
    }

    // Cible tactile ≥ 44 px, posée sur le point d'ancrage : pour un personnage
    // le tap tombe donc sur son corps, pas sur le point du marqueur en hauteur.
    const cible = this.ancrageDe(h)
    g.appendChild(el('circle', { cx: cible.x, cy: cible.y, r: 56, fill: 'transparent' }))
    this.gMarqueurs.appendChild(g)
    this.marqueurs.set(h.id, g)
  }

  /** Portrait à dessiner pour un PNJ/témoin (rien de « zone invisible »). */
  private portraitDe(h: Hotspot): OptionsPortrait | null {
    if (h.personnage) return h.personnage
    if (h.interrogatoire) return h.interrogatoire.suspect.portrait
    if (h.voix && PORTRAITS[h.voix]) return PORTRAITS[h.voix]!
    return null
  }

  /**
   * Un PNJ interactif est DESSINÉ EN PIED (même traitement que le héros) :
   * corps entier du vocabulaire de `art.ts`, posé au sol, à l'échelle de sa
   * profondeur, avec ses micro-animations d'attente.
   */
  private dessinerPersonnage(g: SVGGElement, h: Hotspot, cassetete = false): void {
    const opts = this.portraitDe(h)
    // Le personnage est debout sur le sol, pas accroché au point du marqueur.
    const sol = this.ancrageDe(h)
    const s = echelle(sol.y, this.scene.zone)

    const ombre = el('ellipse', { cx: sol.x, cy: sol.y + 2, rx: 30 * s, ry: 8 * s, fill: '#2F2A45', opacity: 0.3 })
    const halo = el('circle', { cx: sol.x, cy: sol.y - 70 * s, r: 62 * s, fill: 'url(#dGlow)' })
    halo.classList.add('halo-pulse')
    g.append(ombre, halo)

    if (opts) {
      const perso = el('g', { class: 'pnj-corps-groupe' })
      // Pieds posés sur le point au sol (repère corps : pieds à y=138).
      perso.setAttribute('transform', `translate(${sol.x} ${sol.y}) scale(${s.toFixed(3)}) translate(0 -138)`)
      perso.innerHTML = corpsSVG(opts)
      // Décalage propre à chaque PNJ : personne ne respire à l'unisson.
      perso.style.setProperty('--pnj-decalage', decalageAnimation(h.id))
      g.appendChild(perso)
    } else {
      g.appendChild(el('use', { href: '#dW', transform: `translate(${sol.x - 9} ${sol.y - 13}) scale(1.3)` }))
    }

    // Bulle pulsante au-dessus de la tête : « parle-moi » ou « casse-tête ».
    const hauteur = opts ? HAUTEUR_CORPS : 128
    const bulle = el('g', { transform: `translate(${sol.x} ${(sol.y - hauteur * s).toFixed(1)})` })
    bulle.classList.add('scintille')
    bulle.append(
      el('circle', { cx: 0, cy: 0, r: 13, fill: '#F4C95D', stroke: '#2F2A45', 'stroke-width': 2 }),
      el('path', { d: 'M-4,11 L0,18 L5,11 Z', fill: '#F4C95D', stroke: '#2F2A45', 'stroke-width': 2, 'stroke-linejoin': 'round' }),
    )
    if (cassetete) {
      const piece = el('text', { x: 0, y: 5, 'text-anchor': 'middle', 'font-size': 14 })
      piece.textContent = '🧩'
      bulle.appendChild(piece)
    } else {
      const dots = el('g', { fill: '#2F2A45' })
      for (const dx of [-5, 0, 5]) dots.appendChild(el('circle', { cx: dx, cy: 0, r: 1.6 }))
      bulle.appendChild(dots)
    }
    g.appendChild(bulle)
  }

  /** Bouton loupe du HUD : fait scintiller fortement les points restants ~2 s. */
  montrerIndices(): void {
    this.gMarqueurs.classList.remove('reveler')
    void this.gMarqueurs.getBoundingClientRect()
    this.gMarqueurs.classList.add('reveler')
    setTimeout(() => this.gMarqueurs.classList.remove('reveler'), 2100)
  }

  /** Pistache oriente le joueur vers un point interactif encore non trouvé. */
  private soufflerAstuce(): void {
    const cible = this.scene.hotspots.find(
      (h) =>
        this.marqueurs.has(h.id) &&
        !carnet.estResolu(h.id) &&
        (h.sorte === 'jeu' || h.sorte === 'indice' || h.sorte === 'pnj' || h.sorte === 'temoin'),
    )
    if (!cible) return
    const phrase = cible.astuce ?? `Et si on allait voir ${cible.libelle.toLowerCase()} ?`
    bandeau(`🐭 « ${phrase} »`, 3800)
  }

  /** Après chaque résolution : fait apparaître les hotspots devenus disponibles. */
  private rafraichirMarqueurs(): void {
    for (const h of this.scene.hotspots) this.dessinerMarqueur(h)
  }

  // --- Interaction --------------------------------------------------------

  private surClic = (ev: MouseEvent): void => {
    if (this.occupe) return
    this.inactif = 0
    const p = this.pointScene(ev)
    if (!p) return
    // Pour un personnage, on vise son corps au sol — pas le point du marqueur.
    const cible = this.scene.hotspots.find(
      (h) => this.marqueurs.has(h.id) && distance(p, this.ancrageDe(h)) < 60,
    )
    if (cible) {
      this.enAttente = cible
      this.detective.allerVers(stationDe(cible, this.scene), this.scene.zone, this.scene.obstacles)
    } else {
      this.enAttente = null
      this.detective.allerVers(p, this.scene.zone, this.scene.obstacles)
    }
  }

  private pointScene(ev: MouseEvent): Point | null {
    const ctm = this.svg.getScreenCTM()
    if (!ctm) return null
    const pt = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(ctm.inverse())
    return { x: pt.x, y: pt.y }
  }

  private retirerMarqueur(id: string): void {
    this.marqueurs.get(id)?.remove()
    this.marqueurs.delete(id)
    // Un habitant ne disparaît pas de la scène : il reste à son poste.
    const h = this.scene.hotspots.find((x) => x.id === id)
    if (h && this.estPersonnage(h)) this.poserPnjStatique(h)
  }

  private async interagir(h: Hotspot): Promise<void> {
    this.occupe = true
    this.detective.regarder(h.at)

    if (h.sorte === 'sortie') {
      if (h.dialogue?.length) await dialogue(h.dialogue, h.voix ?? 'narrateur')
      this.occupe = false
      if (h.vers) this.surSortie(h.vers)
      return
    }

    if (h.sorte === 'etincelle') {
      const gain = h.recompense ?? 1
      carnet.ramasserEtincelle(h.id, gain)
      this.retirerMarqueur(h.id)
      bandeau(`✨ Une étincelle cachée ! +${gain} croquette${gain > 1 ? 's' : ''} d’or 🍪`)
      this.occupe = false
      return
    }

    if (h.sorte === 'cassetete' && h.jeu) {
      if (h.dialogue?.length) await dialogue(h.dialogue, h.voix ?? 'narrateur')
      const bon = await lancerMiniJeu(h.jeu, this.scene.decor)
      if (bon) {
        const gain = h.recompense ?? 2
        carnet.marquerCassetete(h.id, gain)
        this.retirerMarqueur(h.id)
        bandeau(`🧩 Casse-tête résolu ! +${gain} croquettes d’or 🍪`)
      } else {
        bandeau('Le casse-tête t’attendra — reviens quand tu veux.', 2200)
      }
      this.occupe = false
      return
    }

    if (h.sorte === 'temoin' && h.interrogatoire) {
      const it = h.interrogatoire
      await dialogueChoix({
        nom: `${it.suspect.nom} — ${it.suspect.role}`,
        voix: it.suspect.id,
        portrait: it.suspect.portrait,
        intro: it.intro,
        questions: it.questions,
      })
      carnet.ajouterTemoignage({
        id: h.id, nom: it.suspect.nom, role: it.suspect.role,
        portrait: it.suspect.id, citation: it.temoignage, scene: this.scene.nom,
      })
      carnet.marquerResolu(h.id)
      this.retirerMarqueur(h.id)
      bandeau(`💬 Témoignage noté : ${it.suspect.nom}`)
      this.occupe = false
      this.rafraichirMarqueurs()
      return
    }

    if (h.dialogue?.length) await dialogue(h.dialogue, h.voix ?? 'narrateur')

    if (h.sorte === 'confrontation') {
      await lancerConfrontation()
      carnet.marquerResolu(h.id)
      carnet.marquerEnquete(this.scene.lieu)
      this.retirerMarqueur(h.id)
      this.occupe = false
      this.surSortie('hub')
      return
    }

    if (h.sorte === 'deduction' && h.jeu?.type === 'deduction') {
      const bon = await lancerMiniJeu(h.jeu, this.scene.decor)
      if (bon) {
        carnet.marquerResolu(h.id)
        this.retirerMarqueur(h.id)
        await dialogue(h.jeu.denouement, 'narrateur')
        carnet.marquerEnquete(this.scene.lieu)
        // Carte de visite du Fantôme Gris (texte verbatim) + réaction.
        // Ne se redéclenche pas si l'enquête est rejouée.
        await montrerCarteFG(this.scene.lieu)
        this.occupe = false
        this.surSortie('hub')
      } else {
        bandeau('Reprends tes indices et reviens accuser quand tu es sûr.', 2400)
        this.occupe = false
      }
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
      this.retirerMarqueur(h.id)
      this.rafraichirMarqueurs()
    } else {
      bandeau('Tu pourras y revenir quand tu veux.', 2000)
    }
    this.occupe = false
  }

  // --- Boucle -------------------------------------------------------------

  private boucle = (t: number): void => {
    const dt = this.dernierTemps ? Math.min((t - this.dernierTemps) / 1000, 0.05) : 0
    this.dernierTemps = t

    const arrive = this.detective.maj(dt, this.scene.zone, this.scene.obstacles)

    const cote = this.detective.pos.x > this.scene.zone.centreX ? -1 : 1
    const suivi: Point = { x: this.detective.pos.x + cote * 78, y: this.detective.pos.y + 14 }
    if (distance(this.pistache.pos, suivi) > 34 && !dansObstacle(suivi, this.scene.obstacles)) {
      this.pistache.allerVers(suivi, this.scene.zone, this.scene.obstacles)
    }
    this.pistache.maj(dt, this.scene.zone, this.scene.obstacles)

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

    // Astuce spontanée de Pistache après ~35 s sans nouvel indice trouvé.
    // Suspendue pendant une interaction ou quand un panneau est ouvert.
    if (!this.occupe && !document.querySelector('.couche')) {
      this.inactif += dt
      if (this.inactif > 35) {
        this.inactif = 0
        this.soufflerAstuce()
      }
    } else {
      this.inactif = 0
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
