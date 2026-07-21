import type {
  JeuDevinette, JeuGrille, JeuMiroir, JeuSilhouette, JeuTaquin,
} from '../types'
import type { Socle } from './socle'

/**
 * Casse-têtes optionnels façon Layton — les trois familles du CLAUDE.md :
 *  · Logique & déduction : grille « qui habite où »
 *  · Spatial : taquin sur décor, silhouettes/rotations
 *  · Mots & codes : écriture miroir, devinettes
 * Aucun échec définitif : on réessaie librement, l'indice de Pistache est payant.
 */

const SVG_NS = 'http://www.w3.org/2000/svg'

// --- Mots & codes : devinette --------------------------------------------

export function jeuDevinette(jeu: JeuDevinette, s: Socle): void {
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
        s.gagner()
      } else {
        b.classList.add('faux'); b.disabled = true
        s.proposerIndice('relis bien la devinette : chaque mot compte. Tu peux réessayer autant que tu veux !')
      }
    })
    choix.appendChild(b)
  })
}

// --- Mots & codes : écriture miroir ---------------------------------------

export function jeuMiroir(jeu: JeuMiroir, s: Socle): void {
  const bloc = document.createElement('p')
  bloc.className = 'texte-miroir'
  bloc.textContent = jeu.texteMiroir
  const aide = document.createElement('p')
  aide.className = 'jeu-etape'
  aide.textContent = 'Astuce : tiens la page devant un miroir… ou incline la tête !'
  const question = document.createElement('p')
  question.className = 'question'
  question.textContent = jeu.question
  const choix = document.createElement('div')
  choix.className = 'choix'
  s.corps.append(bloc, aide, question, choix)

  jeu.reponses.forEach((texte, i) => {
    const b = document.createElement('button')
    b.className = 'bouton bouton-choix'
    b.textContent = texte
    b.addEventListener('click', () => {
      if (i === jeu.bonne) {
        b.classList.add('juste')
        s.gagner()
      } else {
        b.classList.add('faux'); b.disabled = true
        s.proposerIndice('lis les lettres de droite à gauche, comme dans un miroir.')
      }
    })
    choix.appendChild(b)
  })
}

// --- Spatial : quelle silhouette correspond ? -----------------------------

function miniSilhouette(o: { chapeau: boolean; cape: boolean; rot: number }): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', '-70 -190 140 200')
  svg.classList.add('mini-silhouette')
  const g = document.createElementNS(SVG_NS, 'g')
  g.setAttribute('transform', `rotate(${o.rot})`)
  g.setAttribute('fill', '#2F2A45')
  const p = (d: string): void => {
    const e = document.createElementNS(SVG_NS, 'path')
    e.setAttribute('d', d)
    g.appendChild(e)
  }
  // Corps : cape en cloche, ou silhouette étroite sans cape.
  if (o.cape) p('M0,-110 Q-30,-100 -38,-60 Q-46,-20 -34,0 L34,0 Q46,-20 38,-60 Q30,-100 0,-110 Z')
  else p('M0,-108 Q-16,-98 -18,-56 Q-20,-18 -16,0 L16,0 Q20,-18 18,-56 Q16,-98 0,-108 Z')
  const tete = document.createElementNS(SVG_NS, 'circle')
  tete.setAttribute('cx', '0'); tete.setAttribute('cy', '-118'); tete.setAttribute('r', '21')
  g.appendChild(tete)
  if (o.chapeau) {
    const bord = document.createElementNS(SVG_NS, 'ellipse')
    bord.setAttribute('cx', '0'); bord.setAttribute('cy', '-134')
    bord.setAttribute('rx', '29'); bord.setAttribute('ry', '6')
    g.appendChild(bord)
    const calotte = document.createElementNS(SVG_NS, 'rect')
    calotte.setAttribute('x', '-19'); calotte.setAttribute('y', '-176')
    calotte.setAttribute('width', '38'); calotte.setAttribute('height', '42'); calotte.setAttribute('rx', '3')
    g.appendChild(calotte)
  } else {
    // Oreilles pointues quand il n'y a pas de haut-de-forme.
    p('M-20,-132 L-26,-152 L-6,-140 Z')
    p('M20,-132 L26,-152 L6,-140 Z')
  }
  svg.appendChild(g)
  return svg
}

export function jeuSilhouette(jeu: JeuSilhouette, s: Socle): void {
  const question = document.createElement('p')
  question.className = 'question'
  question.textContent = jeu.question
  const grille = document.createElement('div')
  grille.className = 'grille-silhouettes'
  s.corps.append(question, grille)

  jeu.options.forEach((o, i) => {
    const b = document.createElement('button')
    b.className = 'carte-silhouette'
    b.appendChild(miniSilhouette(o))
    b.addEventListener('click', () => {
      if (i === jeu.bonne) {
        b.classList.add('juste')
        s.gagner()
      } else {
        b.classList.add('faux')
        setTimeout(() => b.classList.remove('faux'), 800)
        s.proposerIndice('cherche la cape ET le haut-de-forme — les deux à la fois.')
      }
    })
    grille.appendChild(b)
  })
}

// --- Logique & déduction : grille « qui habite où » -----------------------

export function jeuGrille(jeu: JeuGrille, s: Socle): void {
  const liste = document.createElement('ul')
  liste.className = 'indices-grille'
  for (const i of jeu.indices) {
    const li = document.createElement('li')
    li.textContent = i
    liste.appendChild(li)
  }
  const table = document.createElement('div')
  table.className = 'grille-logique'
  s.corps.append(liste, table)

  // Chaque sujet a un bouton qui fait défiler les valeurs possibles.
  const choix: number[] = jeu.sujets.map(() => 0)
  const boutons: HTMLButtonElement[] = []

  jeu.sujets.forEach((sujet, i) => {
    const ligne = document.createElement('div')
    ligne.className = 'ligne-grille'
    const nom = document.createElement('span')
    nom.className = 'grille-sujet'
    nom.textContent = sujet
    const b = document.createElement('button')
    b.className = 'bouton bouton-valeur'
    b.textContent = jeu.valeurs[0]!
    b.addEventListener('click', () => {
      choix[i] = (choix[i]! + 1) % jeu.valeurs.length
      b.textContent = jeu.valeurs[choix[i]!]!
      b.classList.remove('faux')
    })
    boutons.push(b)
    ligne.append(nom, b)
    table.appendChild(ligne)
  })

  const valider = document.createElement('button')
  valider.className = 'bouton bouton-primaire'
  valider.textContent = 'Vérifier ▸'
  valider.addEventListener('click', () => {
    const bon = choix.every((c, i) => c === jeu.solution[i])
    const doublon = new Set(choix).size !== choix.length
    if (bon) {
      boutons.forEach((b) => b.classList.add('juste'))
      s.gagner()
    } else {
      boutons.forEach((b, i) => { if (choix[i] !== jeu.solution[i]) b.classList.add('faux') })
      s.proposerIndice(
        doublon
          ? 'deux habitants ne peuvent pas être au même endroit — chaque réponse est différente !'
          : 'reprends les indices un par un, et élimine ce qui est impossible.',
      )
    }
  })
  s.corps.appendChild(valider)
}

// --- Spatial : taquin 3×3 sur un morceau de décor -------------------------

export function jeuTaquin(jeu: JeuTaquin, decor: string, s: Socle): void {
  const N = 3
  const image = jeu.image ?? decor
  const plateau = document.createElement('div')
  plateau.className = 'taquin'
  s.corps.appendChild(plateau)

  // Position 8 = case vide. `cases[pos]` = index de la tuile d'origine.
  let cases: number[] = [...Array(N * N).keys()]

  const voisins = (p: number): number[] => {
    const r = Math.floor(p / N), c = p % N
    const v: number[] = []
    if (r > 0) v.push(p - N)
    if (r < N - 1) v.push(p + N)
    if (c > 0) v.push(p - 1)
    if (c < N - 1) v.push(p + 1)
    return v
  }

  // Mélange par déplacements légaux : le taquin reste toujours résoluble.
  let vide = N * N - 1
  for (let i = 0; i < 120; i++) {
    const v = voisins(vide)
    const cible = v[Math.floor(Math.random() * v.length)]!
    cases[vide] = cases[cible]!
    cases[cible] = N * N - 1
    vide = cible
  }

  const resolu = (): boolean => cases.every((t, i) => t === i)

  const dessiner = (): void => {
    plateau.replaceChildren()
    cases.forEach((tuile, pos) => {
      const d = document.createElement('button')
      d.className = 'taquin-case'
      if (tuile === N * N - 1) {
        d.classList.add('vide')
      } else {
        const tr = Math.floor(tuile / N), tc = tuile % N
        d.style.backgroundImage = `url(${image})`
        // Le décor fait 768×1376 ; on cadre la zone demandée puis on découpe.
        d.style.backgroundSize = `${(768 / jeu.cadre.w) * N * 100}% ${(1376 / jeu.cadre.h) * N * 100}%`
        d.style.backgroundPosition =
          `${-((jeu.cadre.x / jeu.cadre.w) * N + tc) * 100}% ${-((jeu.cadre.y / jeu.cadre.h) * N + tr) * 100}%`
      }
      d.addEventListener('click', () => {
        if (!voisins(pos).includes(vide)) return
        cases[vide] = cases[pos]!
        cases[pos] = N * N - 1
        vide = pos
        dessiner()
        if (resolu()) {
          plateau.classList.add('juste')
          s.gagner()
        }
      })
      plateau.appendChild(d)
    })
  }
  dessiner()

  const melanger = document.createElement('button')
  melanger.className = 'bouton bouton-discret'
  melanger.textContent = 'Rien ne va plus — remélanger'
  melanger.addEventListener('click', () => {
    for (let i = 0; i < 60; i++) {
      const v = voisins(vide)
      const cible = v[Math.floor(Math.random() * v.length)]!
      cases[vide] = cases[cible]!
      cases[cible] = N * N - 1
      vide = cible
    }
    dessiner()
  })
  s.corps.appendChild(melanger)
}
