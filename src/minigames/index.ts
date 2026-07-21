import type {
  JeuCalcul, JeuDeduction, JeuMessage, JeuObservation, MiniJeu, Suspect,
} from '../types'
import { ouvrirCouche } from '../ui/modal'
import { portraitAvatar } from '../art'

/**
 * Mini-jeux pédagogiques : observation/mémoire, message codé (lecture/vocab),
 * calcul (maths), et déduction finale. Aucun échec définitif : on réessaie
 * autant qu'on veut, Pistache aide à chaque erreur.
 */
export function lancerMiniJeu(jeu: MiniJeu, decor: string): Promise<boolean> {
  switch (jeu.type) {
    case 'observation': return jeuObservation(jeu, decor)
    case 'message': return jeuMessage(jeu)
    case 'calcul': return jeuCalcul(jeu)
    case 'deduction': return jeuDeduction(jeu)
  }
}

function socle(
  panneau: HTMLDivElement,
  titre: string,
  consigne: string,
): { corps: HTMLDivElement; aide: (t: string) => void; pied: HTMLDivElement } {
  const h = document.createElement('h2')
  h.textContent = titre
  const c = document.createElement('p')
  c.className = 'consigne'
  c.textContent = consigne
  const corps = document.createElement('div')
  corps.className = 'corps-jeu'
  const pied = document.createElement('div')
  pied.className = 'pied-jeu'
  panneau.append(h, c, corps, pied)

  let bulle: HTMLParagraphElement | null = null
  const aide = (t: string): void => {
    if (!bulle) {
      bulle = document.createElement('p')
      bulle.className = 'aide-pistache'
      panneau.insertBefore(bulle, pied)
    }
    bulle.textContent = `🐭 Pistache : ${t}`
  }
  return { corps, aide, pied }
}

function boutonAbandon(pied: HTMLDivElement, action: () => void): void {
  const b = document.createElement('button')
  b.className = 'bouton bouton-discret'
  b.textContent = 'Plus tard'
  b.addEventListener('click', action)
  pied.appendChild(b)
}

const SVG_NS = 'http://www.w3.org/2000/svg'

// --- Observation / mémoire (une ou plusieurs questions) -------------------

function jeuObservation(jeu: JeuObservation, decor: string): Promise<boolean> {
  return new Promise((resolve) => {
    const { panneau, fermer } = ouvrirCouche('couche-jeu')
    const { corps, aide, pied } = socle(panneau, '👀 Observe bien', jeu.consigne)

    const vue = document.createElementNS(SVG_NS, 'svg')
    vue.setAttribute('viewBox', `${jeu.cadre.x} ${jeu.cadre.y} ${jeu.cadre.w} ${jeu.cadre.h}`)
    vue.classList.add('vue-observation')
    const img = document.createElementNS(SVG_NS, 'image')
    img.setAttribute('href', decor)
    img.setAttribute('x', '0'); img.setAttribute('y', '0')
    img.setAttribute('width', '768'); img.setAttribute('height', '1376')
    vue.appendChild(img)

    const chrono = document.createElement('div')
    chrono.className = 'chrono'
    corps.append(vue, chrono)

    let restant = jeu.duree
    chrono.textContent = `${restant} s`
    const tic = setInterval(() => {
      restant -= 1
      chrono.textContent = `${restant} s`
      if (restant <= 0) { clearInterval(tic); questionSuivante(0) }
    }, 1000)

    const questionSuivante = (idx: number): void => {
      corps.replaceChildren()
      if (idx >= jeu.questions.length) {
        fermer(); resolve(true); return
      }
      const q = jeu.questions[idx]!
      const compteur = document.createElement('div')
      compteur.className = 'jeu-etape'
      compteur.textContent = `Question ${idx + 1} / ${jeu.questions.length}`
      const enonce = document.createElement('p')
      enonce.className = 'question'
      enonce.textContent = q.question
      const choix = document.createElement('div')
      choix.className = 'choix'
      corps.append(compteur, enonce, choix)
      q.reponses.forEach((texte, i) => {
        const b = document.createElement('button')
        b.className = 'bouton bouton-choix'
        b.textContent = texte
        b.addEventListener('click', () => {
          if (i === q.bonne) {
            b.classList.add('juste')
            setTimeout(() => questionSuivante(idx + 1), 480)
          } else {
            b.classList.add('faux'); b.disabled = true
            aide("ce n'est pas ça. Ferme les yeux, revois la scène — il en reste d'autres à essayer !")
          }
        })
        choix.appendChild(b)
      })
    }

    boutonAbandon(pied, () => { clearInterval(tic); fermer(); resolve(false) })
  })
}

// --- Message codé : plusieurs mots à reconstituer -------------------------

function melangerLettres(mot: string): string[] {
  const lettres = [...mot]
  if (lettres.length < 2) return lettres
  let melange = [...lettres]
  let essai = 0
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

function jeuMessage(jeu: JeuMessage): Promise<boolean> {
  return new Promise((resolve) => {
    const { panneau, fermer } = ouvrirCouche('couche-jeu')
    const { corps, aide, pied } = socle(panneau, '✏️ Message codé', jeu.consigne)

    const trouves: string[] = jeu.mots.map(() => '____')
    const phrase = document.createElement('p')
    phrase.className = 'message-phrase'
    corps.appendChild(phrase)
    const majPhrase = (): void => {
      phrase.textContent = jeu.gabarit.replace(/\{(\d+)\}/g, (_, n) => trouves[Number(n)] ?? '____')
    }
    majPhrase()

    const jouerMot = (idx: number): void => {
      if (idx >= jeu.mots.length) { setTimeout(() => { fermer(); resolve(true) }, 650); return }
      const { mot, indice } = jeu.mots[idx]!
      const cible = mot.toUpperCase()

      const bloc = document.createElement('div')
      bloc.className = 'message-mot'
      const consigneMot = document.createElement('p')
      consigneMot.className = 'jeu-etape'
      consigneMot.textContent = `Mot ${idx + 1} / ${jeu.mots.length} — indice : ${indice}`
      const zone = document.createElement('div')
      zone.className = 'mot-en-cours'
      const banque = document.createElement('div')
      banque.className = 'banque-lettres'
      bloc.append(consigneMot, zone, banque)
      corps.appendChild(bloc)

      const lettres = melangerLettres(cible)
      const proposition: number[] = []
      const boutons: HTMLButtonElement[] = []
      const redessiner = (): void => {
        zone.textContent = proposition.length
          ? proposition.map((i) => lettres[i]).join(' ')
          : '· '.repeat(cible.length).trim()
      }
      const verifier = (): void => {
        const essai = proposition.map((i) => lettres[i]).join('')
        if (essai === cible) {
          zone.classList.add('juste')
          trouves[idx] = cible
          majPhrase()
          setTimeout(() => { bloc.remove(); jouerMot(idx + 1) }, 700)
        } else {
          zone.classList.add('faux')
          aide(indice)
          setTimeout(() => {
            zone.classList.remove('faux')
            proposition.length = 0
            for (const b of boutons) b.disabled = false
            redessiner()
          }, 850)
        }
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
          if (proposition.length === cible.length) verifier()
        })
        boutons.push(b)
        banque.appendChild(b)
      })
      const recommencer = document.createElement('button')
      recommencer.className = 'bouton bouton-discret'
      recommencer.textContent = 'Recommencer ce mot'
      recommencer.addEventListener('click', () => {
        proposition.length = 0
        for (const b of boutons) b.disabled = false
        zone.classList.remove('faux')
        redessiner()
      })
      bloc.appendChild(recommencer)
      redessiner()
    }

    jouerMot(0)
    boutonAbandon(pied, () => { fermer(); resolve(false) })
  })
}

// --- Calcul (QCM) ---------------------------------------------------------

function jeuCalcul(jeu: JeuCalcul): Promise<boolean> {
  return new Promise((resolve) => {
    const { panneau, fermer } = ouvrirCouche('couche-jeu')
    const { corps, aide, pied } = socle(panneau, '🧮 À toi de calculer', jeu.consigne)

    const enonce = document.createElement('p')
    enonce.className = 'enonce'
    enonce.textContent = jeu.enonce
    const choix = document.createElement('div')
    choix.className = 'choix'
    corps.append(enonce, choix)

    let essais = 0
    jeu.reponses.forEach((texte, i) => {
      const b = document.createElement('button')
      b.className = 'bouton bouton-choix'
      b.textContent = texte
      b.addEventListener('click', () => {
        if (i === jeu.bonne) {
          b.classList.add('juste')
          if (jeu.revelation) aide(jeu.revelation.replace(/^🐭[^:]*:\s*/, ''))
          setTimeout(() => { fermer(); resolve(true) }, jeu.revelation ? 1600 : 550)
        } else {
          essais += 1
          b.classList.add('faux'); b.disabled = true
          aide(essais === 1
            ? "relis bien l'énoncé, il y a peut-être deux étapes avant la réponse."
            : 'pose l\'opération sur ton carnet, étape par étape. Tu y es presque !')
        }
      })
      choix.appendChild(b)
    })

    boutonAbandon(pied, () => { fermer(); resolve(false) })
  })
}

// --- Déduction finale : accuser un suspect --------------------------------

function jeuDeduction(jeu: JeuDeduction): Promise<boolean> {
  return new Promise((resolve) => {
    const { panneau, fermer } = ouvrirCouche('couche-jeu couche-deduction')
    const { corps, aide, pied } = socle(panneau, '🧠 Qui est le coupable ?', jeu.consigne)

    const grille = document.createElement('div')
    grille.className = 'grille-suspects'
    corps.appendChild(grille)

    jeu.suspects.forEach((s: Suspect, i) => {
      const carte = document.createElement('button')
      const ecarte = jeu.ecartes.includes(i)
      carte.className = 'carte-suspect' + (ecarte ? ' ecarte' : '')
      carte.disabled = ecarte
      const av = document.createElement('span')
      av.className = 'suspect-portrait'
      av.innerHTML = portraitAvatar(s.portrait, 76)
      const nom = document.createElement('span')
      nom.className = 'suspect-nom'
      nom.textContent = s.nom
      const role = document.createElement('span')
      role.className = 'suspect-role'
      role.textContent = s.role
      carte.append(av, nom, role)
      if (!ecarte) {
        carte.addEventListener('click', () => {
          if (i === jeu.coupable) {
            carte.classList.add('juste')
            grille.querySelectorAll('button').forEach((b) => ((b as HTMLButtonElement).disabled = true))
            setTimeout(() => { fermer(); resolve(true) }, 700)
          } else {
            carte.classList.add('faux')
            aide(jeu.aide)
            setTimeout(() => carte.classList.remove('faux'), 900)
          }
        })
      }
      grille.appendChild(carte)
    })

    boutonAbandon(pied, () => { fermer(); resolve(false) })
  })
}
