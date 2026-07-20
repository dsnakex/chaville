import type { JeuAnagramme, JeuCalcul, JeuObservation, MiniJeu } from '../types'
import { ouvrirCouche } from '../ui/modal'

/**
 * Les trois compétences de la v1, rejouables depuis une scène :
 * observation/mémoire, lecture/vocabulaire, maths/logique.
 * Aucun échec définitif : on peut réessayer autant qu'on veut, Pistache aide.
 */
export function lancerMiniJeu(jeu: MiniJeu, decor: string): Promise<boolean> {
  switch (jeu.type) {
    case 'observation':
      return jeuObservation(jeu, decor)
    case 'anagramme':
      return jeuAnagramme(jeu)
    case 'calcul':
      return jeuCalcul(jeu)
  }
}

/** Ossature commune : titre, consigne, zone de jeu, aide de Pistache, abandon. */
function socle(
  panneau: HTMLDivElement,
  titre: string,
  consigne: string,
): { corps: HTMLDivElement; aide: (texte: string) => void; piedDePage: HTMLDivElement } {
  const h = document.createElement('h2')
  h.textContent = titre
  const c = document.createElement('p')
  c.className = 'consigne'
  c.textContent = consigne
  const corps = document.createElement('div')
  corps.className = 'corps-jeu'
  const piedDePage = document.createElement('div')
  piedDePage.className = 'pied-jeu'
  panneau.append(h, c, corps, piedDePage)

  let bulle: HTMLParagraphElement | null = null
  const aide = (texte: string): void => {
    if (!bulle) {
      bulle = document.createElement('p')
      bulle.className = 'aide-pistache'
      panneau.insertBefore(bulle, piedDePage)
    }
    bulle.textContent = `🐭 Pistache : ${texte}`
  }

  return { corps, aide, piedDePage }
}

function boutonAbandon(pied: HTMLDivElement, action: () => void): void {
  const b = document.createElement('button')
  b.className = 'bouton bouton-discret'
  b.textContent = 'Plus tard'
  b.addEventListener('click', action)
  pied.appendChild(b)
}

// --- Observation / mémoire ------------------------------------------------

function jeuObservation(jeu: JeuObservation, decor: string): Promise<boolean> {
  return new Promise((resolve) => {
    const { panneau, fermer } = ouvrirCouche('couche-jeu')
    const { corps, aide, piedDePage } = socle(panneau, '👀 Observe bien', jeu.consigne)

    const vue = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    vue.setAttribute('viewBox', `${jeu.cadre.x} ${jeu.cadre.y} ${jeu.cadre.w} ${jeu.cadre.h}`)
    vue.classList.add('vue-observation')
    const img = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    img.setAttribute('href', decor)
    img.setAttribute('x', '0')
    img.setAttribute('y', '0')
    img.setAttribute('width', '768')
    img.setAttribute('height', '1376')
    vue.appendChild(img)

    const chrono = document.createElement('div')
    chrono.className = 'chrono'
    corps.append(vue, chrono)

    let restant = jeu.duree
    chrono.textContent = `${restant} s`

    const tic = setInterval(() => {
      restant -= 1
      chrono.textContent = `${restant} s`
      if (restant <= 0) {
        clearInterval(tic)
        poserQuestion()
      }
    }, 1000)

    const poserQuestion = (): void => {
      vue.remove()
      chrono.remove()

      const q = document.createElement('p')
      q.className = 'question'
      q.textContent = jeu.question
      corps.appendChild(q)

      const choix = document.createElement('div')
      choix.className = 'choix'
      jeu.reponses.forEach((texte, idx) => {
        const b = document.createElement('button')
        b.className = 'bouton bouton-choix'
        b.textContent = texte
        b.addEventListener('click', () => {
          if (idx === jeu.bonne) {
            b.classList.add('juste')
            clearInterval(tic)
            setTimeout(() => {
              fermer()
              resolve(true)
            }, 550)
          } else {
            b.classList.add('faux')
            b.disabled = true
            aide("ce n'est pas ça. Ferme les yeux et revois la scène — il en reste d'autres à essayer !")
          }
        })
        choix.appendChild(b)
      })
      corps.appendChild(choix)
    }

    boutonAbandon(piedDePage, () => {
      clearInterval(tic)
      fermer()
      resolve(false)
    })
  })
}

// --- Lecture / vocabulaire ------------------------------------------------

/** Mélange les lettres en garantissant un ordre différent du mot d'origine. */
function melangerLettres(mot: string): string[] {
  const lettres = [...mot]
  if (lettres.length < 2) return lettres
  let essai = 0
  let melange = [...lettres]
  do {
    for (let i = melange.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[melange[i], melange[j]] = [melange[j]!, melange[i]!]
    }
    essai += 1
  } while (melange.join('') === mot && essai < 20)
  if (melange.join('') === mot) melange = [...lettres].reverse()
  return melange
}

function jeuAnagramme(jeu: JeuAnagramme): Promise<boolean> {
  return new Promise((resolve) => {
    const { panneau, fermer } = ouvrirCouche('couche-jeu')
    const { corps, aide, piedDePage } = socle(panneau, '✏️ Remets les lettres en ordre', jeu.consigne)

    const mot = jeu.mot.toUpperCase()
    const proposition: number[] = []

    const zone = document.createElement('div')
    zone.className = 'mot-en-cours'
    const banque = document.createElement('div')
    banque.className = 'banque-lettres'
    corps.append(zone, banque)

    const lettres = melangerLettres(mot)
    const boutons: HTMLButtonElement[] = []

    const redessiner = (): void => {
      zone.textContent = proposition.map((i) => lettres[i]).join(' ')
      if (proposition.length === 0) zone.textContent = '· '.repeat(mot.length).trim()
    }

    lettres.forEach((lettre, i) => {
      const b = document.createElement('button')
      b.className = 'bouton bouton-lettre'
      b.textContent = lettre
      b.addEventListener('click', () => {
        if (b.disabled) return
        b.disabled = true
        proposition.push(i)
        redessiner()
        if (proposition.length === mot.length) verifier()
      })
      boutons.push(b)
      banque.appendChild(b)
    })

    const verifier = (): void => {
      const essai = proposition.map((i) => lettres[i]).join('')
      if (essai === mot) {
        zone.classList.add('juste')
        setTimeout(() => {
          fermer()
          resolve(true)
        }, 650)
      } else {
        zone.classList.add('faux')
        aide(jeu.indice)
        setTimeout(() => {
          zone.classList.remove('faux')
          proposition.length = 0
          for (const b of boutons) b.disabled = false
          redessiner()
        }, 900)
      }
    }

    const effacer = document.createElement('button')
    effacer.className = 'bouton bouton-discret'
    effacer.textContent = 'Recommencer'
    effacer.addEventListener('click', () => {
      proposition.length = 0
      for (const b of boutons) b.disabled = false
      redessiner()
    })
    piedDePage.appendChild(effacer)

    redessiner()
    boutonAbandon(piedDePage, () => {
      fermer()
      resolve(false)
    })
  })
}

// --- Maths / logique ------------------------------------------------------

function jeuCalcul(jeu: JeuCalcul): Promise<boolean> {
  return new Promise((resolve) => {
    const { panneau, fermer } = ouvrirCouche('couche-jeu')
    const { corps, aide, piedDePage } = socle(panneau, '🧮 À toi de calculer', jeu.consigne)

    const enonce = document.createElement('p')
    enonce.className = 'enonce'
    enonce.textContent = jeu.enonce
    corps.appendChild(enonce)

    const ligne = document.createElement('div')
    ligne.className = 'ligne-reponse'
    const champ = document.createElement('input')
    champ.type = 'number'
    champ.inputMode = 'numeric'
    champ.className = 'champ-nombre'
    champ.setAttribute('aria-label', 'Ta réponse')
    ligne.appendChild(champ)
    if (jeu.unite) {
      const u = document.createElement('span')
      u.className = 'unite'
      u.textContent = jeu.unite
      ligne.appendChild(u)
    }
    corps.appendChild(ligne)

    let essais = 0
    const valider = document.createElement('button')
    valider.className = 'bouton'
    valider.textContent = 'Vérifier'
    valider.addEventListener('click', () => {
      if (champ.value.trim() === '') return
      if (Number(champ.value) === jeu.reponse) {
        champ.classList.add('juste')
        setTimeout(() => {
          fermer()
          resolve(true)
        }, 600)
      } else {
        essais += 1
        champ.classList.add('faux')
        setTimeout(() => champ.classList.remove('faux'), 700)
        aide(
          essais === 1
            ? "relis bien l'énoncé, il y a peut-être deux étapes avant la réponse."
            : 'pose l\'opération sur ton carnet, étape par étape. Tu y es presque !',
        )
      }
    })
    champ.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') valider.click()
    })
    corps.appendChild(valider)

    boutonAbandon(piedDePage, () => {
      fermer()
      resolve(false)
    })
    setTimeout(() => champ.focus(), 100)
  })
}
