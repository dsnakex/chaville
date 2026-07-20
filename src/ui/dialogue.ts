import { ouvrirCouche } from './modal'

export type Voix = 'detective' | 'pistache' | 'griffe' | 'narrateur'

const NOMS: Record<Voix, string> = {
  detective: 'Toi',
  pistache: 'Pistache',
  griffe: 'Commissaire Griffe',
  narrateur: '',
}

const AVATARS: Record<Voix, string> = {
  detective: '🐱',
  pistache: '🐭',
  griffe: '🐈‍⬛',
  narrateur: '✨',
}

/** Enchaîne des répliques ; se ferme après la dernière. */
export function dialogue(repliques: string[], voix: Voix = 'narrateur'): Promise<void> {
  return new Promise((resolve) => {
    const { fond, panneau, fermer } = ouvrirCouche('couche-dialogue')
    let i = 0

    const nom = NOMS[voix]
    panneau.innerHTML = `
      <div class="bulle bulle-${voix}">
        <div class="bulle-tete">
          <span class="avatar">${AVATARS[voix]}</span>
          ${nom ? `<span class="locuteur">${nom}</span>` : ''}
        </div>
        <p class="replique"></p>
        <div class="suite">Touche pour continuer ›</div>
      </div>`

    const p = panneau.querySelector<HTMLParagraphElement>('.replique')!
    const suite = panneau.querySelector<HTMLDivElement>('.suite')!

    const afficher = (): void => {
      p.textContent = repliques[i] ?? ''
      suite.textContent = i >= repliques.length - 1 ? 'Touche pour fermer ›' : 'Touche pour continuer ›'
    }

    const avancer = (): void => {
      i += 1
      if (i >= repliques.length) {
        fond.removeEventListener('click', avancer)
        fermer()
        resolve()
      } else {
        afficher()
      }
    }

    afficher()
    fond.addEventListener('click', avancer)
  })
}
