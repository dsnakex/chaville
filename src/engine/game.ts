import type { Scene } from '../types'
import { VueScene } from './scene-view'
import { carnet } from '../state'
import { ouvrirCarnet } from '../ui/carnet'
import { bandeau } from '../ui/modal'
import { DEFS } from '../art'

export class Jeu {
  private vue: VueScene | null = null
  private readonly plateau: HTMLDivElement
  private readonly titre: HTMLSpanElement
  private readonly compteur: HTMLSpanElement
  private enTransition = false

  constructor(
    private readonly hote: HTMLElement,
    private readonly scenes: Map<string, Scene>,
  ) {
    // Les symboles de la DA sont injectés une seule fois, hors écran.
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    defs.setAttribute('width', '0')
    defs.setAttribute('height', '0')
    defs.setAttribute('aria-hidden', 'true')
    defs.style.position = 'absolute'
    defs.innerHTML = DEFS
    document.body.appendChild(defs)

    const barre = document.createElement('header')
    barre.className = 'barre'

    const retour = document.createElement('a')
    retour.className = 'bouton-barre'
    retour.href = '/index.html'
    retour.textContent = '‹'
    retour.setAttribute('aria-label', "Revenir au menu")

    this.titre = document.createElement('span')
    this.titre.className = 'titre-lieu'

    const btnCarnet = document.createElement('button')
    btnCarnet.className = 'bouton-barre bouton-carnet'
    btnCarnet.setAttribute('aria-label', 'Ouvrir le carnet')
    btnCarnet.textContent = '📓'
    this.compteur = document.createElement('span')
    this.compteur.className = 'pastille'
    btnCarnet.appendChild(this.compteur)
    btnCarnet.addEventListener('click', ouvrirCarnet)

    barre.append(retour, this.titre, btnCarnet)

    this.plateau = document.createElement('div')
    this.plateau.className = 'plateau'

    this.hote.append(barre, this.plateau)

    carnet.surChangement(() => this.majCompteur())
    this.majCompteur()
  }

  private majCompteur(): void {
    const n = carnet.indices().length
    this.compteur.textContent = n > 0 ? String(n) : ''
    this.compteur.style.display = n > 0 ? '' : 'none'
  }

  async aller(id: string): Promise<void> {
    if (this.enTransition) return
    const scene = this.scenes.get(id)
    if (!scene) {
      bandeau('Ce lieu n’est pas encore ouvert — bientôt !')
      return
    }

    this.enTransition = true
    if (this.vue) {
      this.plateau.classList.add('fondu')
      await attendre(260)
      this.vue.demonter()
      this.vue = null
    }

    this.titre.textContent = scene.nom
    carnet.noterScene(scene.id)

    this.vue = new VueScene(scene, (vers) => void this.aller(vers))
    this.vue.monter(this.plateau)

    this.plateau.classList.remove('fondu')
    await attendre(60)
    this.enTransition = false

    bandeau(scene.ambiance, 3400)
  }
}

const attendre = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms))
