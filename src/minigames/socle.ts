import { ouvrirCouche } from '../ui/modal'
import { carnet } from '../state'

/**
 * Ossature commune des mini-jeux et casse-têtes.
 *
 * Économie des indices (session 4) : l'aide de Pistache s'achète 1 croquette
 * d'or. Réessayer reste TOUJOURS gratuit et illimité — l'absence de croquettes
 * ne bloque jamais la progression (règle « zéro punition cruelle »).
 */
export interface Socle {
  panneau: HTMLDivElement
  corps: HTMLDivElement
  pied: HTMLDivElement
  /** Propose l'indice de Pistache contre une croquette (jamais imposé). */
  proposerIndice(texte: string): void
  /** Explication offerte après une bonne réponse (toujours gratuite). */
  revelation(texte: string): void
  gagner(delai?: number): void
  abandonner(): void
}

export function creerSocle(
  titre: string,
  consigne: string,
  resolve: (ok: boolean) => void,
  classe = 'couche-jeu',
): Socle {
  const { panneau, fermer } = ouvrirCouche(classe)

  const h = document.createElement('h2')
  h.textContent = titre
  const c = document.createElement('p')
  c.className = 'consigne'
  c.textContent = consigne
  const corps = document.createElement('div')
  corps.className = 'corps-jeu'
  const zoneAide = document.createElement('div')
  zoneAide.className = 'zone-aide'
  const pied = document.createElement('div')
  pied.className = 'pied-jeu'
  panneau.append(h, c, corps, zoneAide, pied)

  let indiceAchete = false
  let fini = false

  const socle: Socle = {
    panneau, corps, pied,

    proposerIndice(texte: string): void {
      if (fini) return
      if (indiceAchete) return // l'indice reste affiché, pas de double achat
      zoneAide.replaceChildren()

      const bloc = document.createElement('div')
      bloc.className = 'offre-indice'

      const intro = document.createElement('p')
      intro.className = 'offre-texte'
      intro.textContent = '🐭 Pistache peut te souffler un indice.'

      const libre = document.createElement('p')
      libre.className = 'offre-libre'
      libre.textContent = 'Tu peux aussi réessayer autant que tu veux — c’est gratuit !'

      const acheter = document.createElement('button')
      acheter.className = 'bouton bouton-indice'
      const solde = carnet.croquettes()
      acheter.textContent = `Demander l’indice — 1 🍪 (tu en as ${solde})`
      acheter.addEventListener('click', () => {
        if (carnet.depenserCroquette()) {
          indiceAchete = true
          zoneAide.replaceChildren()
          const p = document.createElement('p')
          p.className = 'aide-pistache'
          p.textContent = `🐭 Pistache : ${texte}`
          zoneAide.appendChild(p)
        } else {
          intro.textContent =
            '🐭 Pistache n’a plus de croquettes… Cherche les étincelles cachées dans les décors !'
          acheter.disabled = true
        }
      })
      if (solde < 1) {
        acheter.disabled = true
        intro.textContent =
          '🐭 Pistache adore les croquettes d’or — cherche les étincelles cachées dans les décors !'
      }

      bloc.append(intro, acheter, libre)
      zoneAide.appendChild(bloc)
    },

    revelation(texte: string): void {
      zoneAide.replaceChildren()
      const p = document.createElement('p')
      p.className = 'aide-pistache revelation'
      p.textContent = texte
      zoneAide.appendChild(p)
    },

    gagner(delai = 620): void {
      if (fini) return
      fini = true
      setTimeout(() => { fermer(); resolve(true) }, delai)
    },

    abandonner(): void {
      if (fini) return
      fini = true
      fermer()
      resolve(false)
    },
  }

  const plusTard = document.createElement('button')
  plusTard.className = 'bouton bouton-discret'
  plusTard.textContent = 'Plus tard'
  plusTard.addEventListener('click', () => socle.abandonner())
  pied.appendChild(plusTard)

  return socle
}
