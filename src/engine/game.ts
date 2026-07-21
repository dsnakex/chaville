import type { Scene } from '../types'
import { VueScene } from './scene-view'
import { Hub } from './hub'
import { carnet } from '../state'
import { ouvrirCarnet } from '../ui/carnet'
import { bandeau } from '../ui/modal'
import { DEFS } from '../art'

export class Jeu {
  private vue: VueScene | null = null
  private hub: Hub | null = null
  private sceneCourante: Scene | null = null
  private readonly plateau: HTMLDivElement
  private readonly hud: HTMLElement
  private readonly objectifTexte: HTMLSpanElement
  private readonly pastilleCarnet: HTMLSpanElement
  private readonly compteurIndices: HTMLSpanElement
  private readonly retour: HTMLButtonElement
  private enTransition = false

  constructor(
    private readonly hote: HTMLElement,
    private readonly scenes: Map<string, Scene>,
  ) {
    // Symboles de la DA injectés une seule fois, hors écran.
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    defs.setAttribute('width', '0'); defs.setAttribute('height', '0')
    defs.setAttribute('aria-hidden', 'true'); defs.style.position = 'absolute'
    defs.innerHTML = DEFS
    document.body.appendChild(defs)

    // --- HUD (planche « barre de jeu ») ---
    this.hud = document.createElement('header')
    this.hud.className = 'hud'

    const rangee1 = document.createElement('div')
    rangee1.className = 'hud-rangee'

    this.retour = document.createElement('button')
    this.retour.className = 'hud-bouton hud-retour'
    this.retour.setAttribute('aria-label', 'Retour')
    this.retour.textContent = '‹'
    this.retour.addEventListener('click', () => this.surRetour())

    const objectif = document.createElement('div')
    objectif.className = 'hud-objectif'
    const label = document.createElement('span')
    label.className = 'hud-label'
    label.textContent = 'OBJECTIF'
    this.objectifTexte = document.createElement('span')
    this.objectifTexte.className = 'hud-objectif-texte'
    objectif.append(label, this.objectifTexte)

    const btnCarnet = document.createElement('button')
    btnCarnet.className = 'hud-bouton hud-carnet'
    btnCarnet.setAttribute('aria-label', 'Ouvrir le carnet')
    btnCarnet.innerHTML = '<span class="hud-carnet-icone">📓</span><span class="hud-carnet-label">CARNET</span>'
    this.pastilleCarnet = document.createElement('span')
    this.pastilleCarnet.className = 'hud-pastille'
    btnCarnet.appendChild(this.pastilleCarnet)
    btnCarnet.addEventListener('click', () => ouvrirCarnet())

    rangee1.append(this.retour, objectif, btnCarnet)

    const rangee2 = document.createElement('div')
    rangee2.className = 'hud-rangee hud-rangee-compteur'
    this.compteurIndices = document.createElement('span')
    this.compteurIndices.className = 'hud-compteur'
    rangee2.appendChild(this.compteurIndices)

    this.hud.append(rangee1, rangee2)

    this.plateau = document.createElement('div')
    this.plateau.className = 'plateau'

    this.hote.append(this.hud, this.plateau)

    carnet.surChangement(() => this.majHud())
  }

  private majHud(): void {
    const total = carnet.indices().length
    this.pastilleCarnet.textContent = total > 0 ? String(total) : ''
    this.pastilleCarnet.style.display = total > 0 ? '' : 'none'

    if (this.sceneCourante) {
      const cibles = this.sceneCourante.hotspots.filter((h) => h.indice)
      const trouves = cibles.filter((h) => carnet.estResolu(h.id)).length
      this.compteurIndices.textContent = `🔎 ${trouves}/${cibles.length} indices`
      this.compteurIndices.style.display = cibles.length ? '' : 'none'
    } else {
      this.compteurIndices.style.display = 'none'
    }
  }

  private surRetour(): void {
    if (this.sceneCourante) void this.aller('hub')
    else window.location.href = '/index.html'
  }

  async aller(id: string): Promise<void> {
    if (this.enTransition) return
    this.enTransition = true

    if (this.vue) { this.plateau.classList.add('fondu'); await attendre(260); this.vue.demonter(); this.vue = null }
    if (this.hub) { this.plateau.classList.add('fondu'); await attendre(260); this.hub.demonter(); this.hub = null }

    if (id === 'hub') {
      this.sceneCourante = null
      this.objectifTexte.textContent = 'Choisis une enquête'
      this.retour.textContent = '⌂'
      this.retour.setAttribute('aria-label', 'Menu')
      carnet.noterScene('hub')
      this.hub = new Hub((scene) => void this.aller(scene))
      this.hub.monter(this.plateau)
      this.plateau.classList.remove('fondu')
      await attendre(60)
      this.enTransition = false
      this.majHud()
      return
    }

    const scene = this.scenes.get(id)
    if (!scene) {
      bandeau('Ce lieu n’est pas encore ouvert — bientôt !')
      this.enTransition = false
      void this.aller('hub')
      return
    }

    this.sceneCourante = scene
    this.objectifTexte.textContent = scene.objectif
    this.retour.textContent = '‹'
    this.retour.setAttribute('aria-label', 'Retour à la carte')
    carnet.noterScene(scene.id)

    this.vue = new VueScene(scene, (vers) => void this.aller(vers))
    this.vue.monter(this.plateau)
    this.plateau.classList.remove('fondu')
    await attendre(60)
    this.enTransition = false
    this.majHud()
    bandeau(scene.ambiance, 3400)
  }
}

const attendre = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms))
