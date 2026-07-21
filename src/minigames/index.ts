import type {
  JeuCalcul, JeuDeduction, JeuMessage, JeuObservation, MiniJeu, Suspect,
} from '../types'
import { creerSocle, type Socle } from './socle'
import { jeuDevinette, jeuGrille, jeuMiroir, jeuSilhouette, jeuTaquin } from './puzzles'
import { portraitAvatar } from '../art'

/**
 * Mini-jeux d'enquête (observation, message codé, calcul, déduction) et
 * casse-têtes optionnels (devinette, miroir, silhouette, grille, taquin).
 * Aucun échec définitif : on réessaie librement ; l'indice de Pistache est
 * proposé contre une croquette d'or, jamais imposé.
 */
export function lancerMiniJeu(jeu: MiniJeu, decor: string): Promise<boolean> {
  return new Promise((resolve) => {
    switch (jeu.type) {
      case 'observation':
        jeuObservation(jeu, decor, creerSocle('👀 Observe bien', jeu.consigne, resolve))
        break
      case 'message':
        jeuMessage(jeu, creerSocle('✏️ Message codé', jeu.consigne, resolve))
        break
      case 'calcul':
        jeuCalcul(jeu, creerSocle('🧮 À toi de calculer', jeu.consigne, resolve))
        break
      case 'deduction':
        jeuDeduction(jeu, creerSocle('🧠 Qui est le coupable ?', jeu.consigne, resolve, 'couche-jeu couche-deduction'))
        break
      case 'devinette':
        jeuDevinette(jeu, creerSocle('🧩 Devinette', jeu.consigne, resolve))
        break
      case 'miroir':
        jeuMiroir(jeu, creerSocle('🪞 Écriture miroir', jeu.consigne, resolve))
        break
      case 'silhouette':
        jeuSilhouette(jeu, creerSocle('👤 Quelle silhouette ?', jeu.consigne, resolve))
        break
      case 'grille':
        jeuGrille(jeu, creerSocle('🔢 Grille logique', jeu.consigne, resolve))
        break
      case 'taquin':
        jeuTaquin(jeu, decor, creerSocle('🧩 Taquin', jeu.consigne, resolve))
        break
    }
  })
}

const SVG_NS = 'http://www.w3.org/2000/svg'

// --- Observation / mémoire (une ou plusieurs questions) -------------------

function jeuObservation(jeu: JeuObservation, decor: string, s: Socle): void {
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
  s.corps.append(vue, chrono)

  let restant = jeu.duree
  chrono.textContent = `${restant} s`
  const tic = setInterval(() => {
    restant -= 1
    chrono.textContent = `${restant} s`
    if (restant <= 0) { clearInterval(tic); questionSuivante(0) }
  }, 1000)

  const questionSuivante = (idx: number): void => {
    s.corps.replaceChildren()
    if (idx >= jeu.questions.length) { s.gagner(120); return }
    const q = jeu.questions[idx]!
    const compteur = document.createElement('div')
    compteur.className = 'jeu-etape'
    compteur.textContent = `Question ${idx + 1} / ${jeu.questions.length}`
    const enonce = document.createElement('p')
    enonce.className = 'question'
    enonce.textContent = q.question
    const choix = document.createElement('div')
    choix.className = 'choix'
    s.corps.append(compteur, enonce, choix)
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
          s.proposerIndice('ferme les yeux et revois la scène — le détail était là, juste devant toi.')
        }
      })
      choix.appendChild(b)
    })
  }

  const stop = s.abandonner.bind(s)
  s.abandonner = (): void => { clearInterval(tic); stop() }
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

function jeuMessage(jeu: JeuMessage, s: Socle): void {
  const trouves: string[] = jeu.mots.map(() => '____')
  const phrase = document.createElement('p')
  phrase.className = 'message-phrase'
  s.corps.appendChild(phrase)
  const majPhrase = (): void => {
    phrase.textContent = jeu.gabarit.replace(/\{(\d+)\}/g, (_, n) => trouves[Number(n)] ?? '____')
  }
  majPhrase()

  const jouerMot = (idx: number): void => {
    if (idx >= jeu.mots.length) { s.gagner(650); return }
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
    s.corps.appendChild(bloc)

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
        s.proposerIndice(indice)
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
}

// --- Calcul (QCM) ---------------------------------------------------------

function jeuCalcul(jeu: JeuCalcul, s: Socle): void {
  const enonce = document.createElement('p')
  enonce.className = 'enonce'
  enonce.textContent = jeu.enonce
  const choix = document.createElement('div')
  choix.className = 'choix'
  s.corps.append(enonce, choix)

  jeu.reponses.forEach((texte, i) => {
    const b = document.createElement('button')
    b.className = 'bouton bouton-choix'
    b.textContent = texte
    b.addEventListener('click', () => {
      if (i === jeu.bonne) {
        b.classList.add('juste')
        // La révélation est un cadeau, pas un indice : toujours gratuite.
        if (jeu.revelation) s.revelation(jeu.revelation)
        s.gagner(jeu.revelation ? 1900 : 560)
      } else {
        b.classList.add('faux'); b.disabled = true
        s.proposerIndice("relis l'énoncé : il y a peut-être deux étapes avant la réponse.")
      }
    })
    choix.appendChild(b)
  })
}

// --- Déduction finale : accuser un suspect --------------------------------

function jeuDeduction(jeu: JeuDeduction, s: Socle): void {
  const grille = document.createElement('div')
  grille.className = 'grille-suspects'
  s.corps.appendChild(grille)

  jeu.suspects.forEach((sus: Suspect, i) => {
    const carte = document.createElement('button')
    const ecarte = jeu.ecartes.includes(i)
    carte.className = 'carte-suspect' + (ecarte ? ' ecarte' : '')
    carte.disabled = ecarte
    const av = document.createElement('span')
    av.className = 'suspect-portrait'
    av.innerHTML = portraitAvatar(sus.portrait, 76)
    const nom = document.createElement('span')
    nom.className = 'suspect-nom'
    nom.textContent = sus.nom
    const role = document.createElement('span')
    role.className = 'suspect-role'
    role.textContent = sus.role
    carte.append(av, nom, role)
    if (!ecarte) {
      carte.addEventListener('click', () => {
        if (i === jeu.coupable) {
          carte.classList.add('juste')
          grille.querySelectorAll('button').forEach((b) => ((b as HTMLButtonElement).disabled = true))
          s.gagner(700)
        } else {
          carte.classList.add('faux')
          s.proposerIndice(jeu.aide)
          setTimeout(() => carte.classList.remove('faux'), 900)
        }
      })
    }
    grille.appendChild(carte)
  })
}
