import { ouvrirCouche } from './modal'
import { PORTRAITS, portraitAvatar, type OptionsPortrait } from '../art'
import type { Voix } from '../types'

const NOMS: Record<string, string> = {
  detective: 'Toi',
  pistache: 'Pistache',
  griffe: 'Commissaire Griffe',
  sardine: 'Madame Sardine',
  moustache: 'Moustache',
  narrateur: '',
}

/** Fond du carré-portrait selon le locuteur (couleur d'habit de la planche). */
const FOND_AVATAR: Record<string, string> = {
  detective: '#57506F',
  pistache: '#4A4568',
  griffe: '#454E6B',
  sardine: '#4E5A6C',
  moustache: '#5B5442',
}

function avatarHTML(voix: string, portrait?: OptionsPortrait): string {
  const p = portrait ?? PORTRAITS[voix]
  if (!p) return ''
  const fond = FOND_AVATAR[voix] ?? '#57506F'
  return `<span class="avatar-portrait" style="background:${fond}">${portraitAvatar(p)}</span>`
}

/** Une bulle de dialogue (structure statique, textes injectés en textContent). */
function bulle(nom: string, voix: string, portrait?: OptionsPortrait): HTMLDivElement {
  const b = document.createElement('div')
  b.className = `bulle bulle-${voix}`
  b.innerHTML = `
    ${avatarHTML(voix, portrait)}
    <div class="bulle-corps">
      ${nom ? `<div class="locuteur"></div>` : ''}
      <p class="replique"></p>
    </div>`
  if (nom) b.querySelector('.locuteur')!.textContent = nom
  return b
}

/** Enchaîne des répliques ; se ferme après la dernière. */
export function dialogue(repliques: string[], voix: Voix = 'narrateur'): Promise<void> {
  return new Promise((resolve) => {
    const { fond, panneau, fermer } = ouvrirCouche('couche-dialogue')
    const nom = NOMS[voix] ?? ''
    const b = bulle(nom, voix)
    panneau.appendChild(b)

    const suite = document.createElement('div')
    suite.className = 'suite'
    b.querySelector('.bulle-corps')!.appendChild(suite)

    const p = b.querySelector<HTMLParagraphElement>('.replique')!
    let i = 0
    const afficher = (): void => {
      p.textContent = repliques[i] ?? ''
      suite.textContent = i >= repliques.length - 1 ? 'Toucher pour fermer ▸' : 'Toucher pour continuer ▸'
    }
    const avancer = (): void => {
      i += 1
      if (i >= repliques.length) {
        fond.removeEventListener('click', avancer)
        fermer()
        resolve()
      } else afficher()
    }
    afficher()
    fond.addEventListener('click', avancer)
  })
}

/**
 * Dialogue à choix (interrogatoire). Affiche les répliques d'intro puis la
 * question ; chaque option jouée renvoie la réplique du témoin. Se ferme quand
 * le joueur choisit « Ça ira, merci ». @returns rien (le témoignage est géré à part).
 */
export function dialogueChoix(opts: {
  nom: string
  voix: string
  portrait: OptionsPortrait
  intro: string[]
  questions: { question: string; options: { texte: string; reponse: string }[] }[]
}): Promise<void> {
  return new Promise((resolve) => {
    const { panneau, fermer } = ouvrirCouche('couche-dialogue couche-interro')
    const b = bulle(opts.nom, opts.voix, opts.portrait)
    panneau.appendChild(b)
    const p = b.querySelector<HTMLParagraphElement>('.replique')!
    const corps = b.querySelector<HTMLDivElement>('.bulle-corps')!

    const zoneChoix = document.createElement('div')
    zoneChoix.className = 'choix-interro'
    corps.appendChild(zoneChoix)

    const posees = new Set<number>()

    const montrerQuestions = (): void => {
      p.textContent = 'Que veux-tu lui demander ?'
      zoneChoix.replaceChildren()
      opts.questions.forEach((q, idx) => {
        const btn = document.createElement('button')
        btn.className = 'bouton bouton-choix'
        btn.textContent = (posees.has(idx) ? '✓ ' : '') + q.question
        btn.addEventListener('click', () => poserQuestion(idx))
        zoneChoix.appendChild(btn)
      })
      const fin = document.createElement('button')
      fin.className = 'bouton bouton-primaire'
      fin.textContent = 'Ça ira, merci ▸'
      fin.addEventListener('click', () => {
        fermer()
        resolve()
      })
      zoneChoix.appendChild(fin)
    }

    const poserQuestion = (idx: number): void => {
      const q = opts.questions[idx]!
      posees.add(idx)
      p.textContent = q.question
      zoneChoix.replaceChildren()
      q.options.forEach((opt) => {
        const btn = document.createElement('button')
        btn.className = 'bouton bouton-choix'
        btn.textContent = opt.texte
        btn.addEventListener('click', () => {
          p.textContent = opt.reponse
          zoneChoix.replaceChildren()
          const retour = document.createElement('button')
          retour.className = 'bouton bouton-primaire'
          retour.textContent = 'Continuer ▸'
          retour.addEventListener('click', montrerQuestions)
          zoneChoix.appendChild(retour)
        })
        zoneChoix.appendChild(btn)
      })
    }

    // Intro d'abord (une réplique par clic), puis le menu de questions.
    let i = 0
    const suite = document.createElement('div')
    const montrerIntro = (): void => { p.textContent = opts.intro[i] ?? '' }
    const avancerIntro = (): void => {
      i += 1
      if (i >= opts.intro.length) {
        suite.remove()
        montrerQuestions()
      } else montrerIntro()
    }
    if (opts.intro.length) {
      suite.className = 'bouton bouton-primaire suite-intro'
      suite.textContent = 'Continuer ▸'
      suite.addEventListener('click', avancerIntro)
      corps.appendChild(suite)
      montrerIntro()
    } else {
      montrerQuestions()
    }
  })
}
