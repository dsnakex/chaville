import { ouvrirCouche } from '../ui/modal'
import { dialogue } from '../ui/dialogue'
import { fantomeGrisAvatar } from '../art'
import { carnet } from '../state'

/**
 * « La dernière danse » — confrontation finale en 3 manches.
 * Textes VERBATIM du pack narratif `da/session4-fantome-gris.md`.
 *
 * Règle d'or : AUCUN échec définitif. Une mauvaise réponse déclenche une
 * esquive élégante du Fantôme Gris ; après deux erreurs, Pistache souffle.
 * On ne peut donc jamais rester bloqué (« zéro punition cruelle »).
 */

interface Manche {
  amorce: string[]
  question: string
  options: string[]
  /** Index attendus (2 pour la manche 1, 1 sinon). */
  bonnes: number[]
  /** Nombre d'options à sélectionner avant de valider. */
  aChoisir: number
  /** Esquive du F.G. quand c'est faux. */
  esquive: string
  /** Coup de pouce de Pistache après 2 erreurs. */
  aide: string
}

const MANCHE_1: Manche = {
  amorce: [
    'Une silhouette se découpe devant la lune, près de la grande cheminée. Cape au vent, haut-de-forme. Jamais de face.',
    '« Te voilà enfin, chaton. Prouve-moi que tu sais d’où je viens. »',
  ],
  question: 'Choisis les DEUX indices de ton carnet qui désignent le même endroit.',
  options: [
    'Connaît les marées par cœur',
    'Porte des gants gris perle cousus main',
    'A volé « Les passages secrets de Chaville »',
    '« Premier en tout, autrefois »',
  ],
  bonnes: [2, 3],
  aChoisir: 2,
  esquive: '« Exact, mais tous les marins ont des marées, chaton. Cherche l’école, pas le métier. »',
  aide: 'les passages secrets et « premier en tout »… on n’apprend pas ça tout seul. On l’apprend dans une école, non ?',
}

const MANCHE_2A: Manche = {
  amorce: ['« Bien. Alors prouve-moi que tu sais ce que je voulais. »'],
  question: 'Que visait-il vraiment ?',
  options: ['Le collier de la Duchesse', 'La salle des trophées de l’Académie', 'Les croquettes de luxe'],
  bonnes: [1],
  aChoisir: 1,
  esquive: '« Joli. Mais un collier, c’est une babiole. Je visais plus haut, chaton. »',
  aide: 'relis sa dernière carte : « la salle des trophées de l’Académie m’attendait »…',
}

const MANCHE_2B: Manche = {
  amorce: ['« Et QUE voulais-je y prendre, d’après toi ? »'],
  question: 'Qu’allait-il y chercher ?',
  options: [
    'L’or de l’Académie',
    'Les médailles de Griffe',
    'La Médaille du Premier Détective — la sienne, gagnée autrefois',
  ],
  bonnes: [2],
  aChoisir: 1,
  esquive: '« De l’or ? Chaton, tu me vexes. Je ne vole que ce qui a une histoire. »',
  aide: 'Il a dit « premier en tout »… et on ne vole bien que ce qui nous a appartenu, non ?',
}

const MANCHE_3: Manche = {
  amorce: [
    'Griffe surgit alors de l’escalier de la tour, essoufflé — il n’a pas pu rester en bas.',
    '« Il y a vingt ans, j’avais un coéquipier. Le meilleur détective que l’Académie ait jamais formé. Le jour où plus aucune énigme ne lui a résisté… il a disparu. »',
    '« Alors, chaton. Dis mon nom. »',
  ],
  question: 'Dis son nom.',
  options: ['Balthazar', 'Barnabé', 'Bartholomé'],
  bonnes: [0],
  aChoisir: 1,
  esquive: '« Presque. Mais ce n’est pas moi, celui-là. Réfléchis encore, chaton. »',
  aide: 'écoute bien Griffe : il a dit « le meilleur que l’Académie ait formé ». Un nom d’autrefois, un peu solennel…',
}

/** Joue une manche ; ne rend la main que sur la bonne réponse. */
function jouerManche(m: Manche): Promise<void> {
  return new Promise((resolve) => {
    const { panneau, fermer } = ouvrirCouche('couche-jeu couche-confrontation')

    const scene = document.createElement('div')
    scene.className = 'confrontation-scene'
    scene.innerHTML = fantomeGrisAvatar(6, 110)
    panneau.appendChild(scene)

    const texte = document.createElement('p')
    texte.className = 'confrontation-texte'
    panneau.appendChild(texte)

    const zone = document.createElement('div')
    zone.className = 'choix'
    panneau.appendChild(zone)

    const aideZone = document.createElement('div')
    panneau.appendChild(aideZone)

    let erreurs = 0
    const selection = new Set<number>()

    const poser = (): void => {
      texte.textContent = m.question
      zone.replaceChildren()
      selection.clear()

      const boutons: HTMLButtonElement[] = []
      m.options.forEach((opt, i) => {
        const b = document.createElement('button')
        b.className = 'bouton bouton-choix'
        b.textContent = opt
        b.addEventListener('click', () => {
          if (m.aChoisir === 1) {
            valider([i], boutons, b)
            return
          }
          // Sélection multiple : on bascule, puis on valide à 2 choix.
          if (selection.has(i)) { selection.delete(i); b.classList.remove('selectionne') }
          else if (selection.size < m.aChoisir) { selection.add(i); b.classList.add('selectionne') }
          if (selection.size === m.aChoisir) {
            valider([...selection], boutons, null)
          }
        })
        boutons.push(b)
        zone.appendChild(b)
      })
    }

    const valider = (choix: number[], boutons: HTMLButtonElement[], bouton: HTMLButtonElement | null): void => {
      const bon =
        choix.length === m.bonnes.length && choix.every((c) => m.bonnes.includes(c))
      if (bon) {
        for (const b of boutons) { b.disabled = true; if (m.bonnes.includes(boutons.indexOf(b))) b.classList.add('juste') }
        texte.textContent = '« … Parfaitement exact. »'
        setTimeout(() => { fermer(); resolve() }, 1100)
        return
      }
      erreurs += 1
      if (bouton) { bouton.classList.add('faux'); bouton.disabled = true }
      texte.textContent = m.esquive
      if (erreurs >= 2) {
        aideZone.replaceChildren()
        const p = document.createElement('p')
        p.className = 'aide-pistache'
        p.textContent = `🐭 Pistache : ${m.aide}`
        aideZone.appendChild(p)
      }
      // On repose la question : aucune manche ne peut être perdue.
      setTimeout(poser, 1500)
    }

    // Amorce narrative, puis la question.
    let i = 0
    const suite = document.createElement('button')
    suite.className = 'bouton bouton-primaire'
    suite.textContent = 'Continuer ▸'
    const avancer = (): void => {
      i += 1
      if (i >= m.amorce.length) { suite.remove(); poser() }
      else texte.textContent = m.amorce[i]!
    }
    suite.addEventListener('click', avancer)
    texte.textContent = m.amorce[0]!
    panneau.appendChild(suite)
  })
}

/** Carte de visite finale, signée « — B. ». */
function carteFinale(): Promise<void> {
  return new Promise((resolve) => {
    const { panneau, fermer } = ouvrirCouche('couche-carte-fg')
    const carteEl = document.createElement('div')
    carteEl.className = 'carte-fg'
    const corps = document.createElement('p')
    corps.className = 'carte-fg-texte'
    corps.textContent =
      '« Première leçon, chaton : aucune serrure ne me retient. Ce n’était pas la fin — c’était l’entraînement. À bientôt, pour la revanche.'
    const sign = document.createElement('div')
    sign.className = 'carte-fg-signature'
    const nom = document.createElement('span')
    nom.textContent = '— B. »'
    const sp = document.createElement('span')
    sp.className = 'carte-fg-etincelle'
    sp.textContent = '✦'
    sign.append(nom, sp)
    carteEl.append(corps, sign)

    const suite = document.createElement('button')
    suite.className = 'bouton bouton-primaire carte-fg-suite'
    suite.textContent = 'Continuer ▸'
    suite.addEventListener('click', () => { fermer(); resolve() })
    panneau.append(carteEl, suite)
  })
}

/** Écran de fin « à suivre… ». */
function ecranASuivre(): Promise<void> {
  return new Promise((resolve) => {
    const { panneau, fermer } = ouvrirCouche('couche-fin')
    const bloc = document.createElement('div')
    bloc.className = 'ecran-fin'
    const titre = document.createElement('h2')
    titre.textContent = 'MYSTÈRES À CHAVILLE'
    const suite = document.createElement('p')
    suite.className = 'fin-asuivre'
    suite.textContent = 'à suivre…'
    const medaille = document.createElement('div')
    medaille.className = 'fin-medaille'
    medaille.textContent = '🏅'
    bloc.append(medaille, titre, suite)

    const bouton = document.createElement('button')
    bouton.className = 'bouton bouton-primaire'
    bouton.textContent = 'Retour à Chaville ▸'
    bouton.addEventListener('click', () => { fermer(); resolve() })
    bloc.appendChild(bouton)
    panneau.appendChild(bloc)
  })
}

/**
 * Déroulé complet : 3 manches → révélation → dénouement → carte finale →
 * écran « à suivre ». @returns toujours true (aucun échec possible).
 */
export async function lancerConfrontation(): Promise<boolean> {
  await jouerManche(MANCHE_1)
  await jouerManche(MANCHE_2A)
  await jouerManche(MANCHE_2B)
  await jouerManche(MANCHE_3)

  // --- La révélation ---
  await dialogue(
    ['Le Fantôme Gris applaudit lentement, retire son haut-de-forme et se retourne — chat gris perle aux yeux vifs, sourire en coin.'],
    'narrateur',
  )
  await dialogue(
    [
      '« Balthazar. Bonsoir, vieux frère de patrouille. »',
      'Il explique, sans se justifier : le meilleur détective du monde s’ennuyait — alors il est passé de l’autre côté du jeu, pour fabriquer des mystères dignes d’être résolus.',
      '« Les cartes de visite, chaton ? Un voleur qui ne veut pas être trouvé ne laisse pas de cartes. Je te cherchais. Tout voleur rêve d’un détective qui le mérite. »',
    ],
    'demasque',
  )

  // --- Le dénouement ---
  await dialogue(
    ['Il rend le livre des passages secrets : « Rends-le à la petite Plume, elle me manquait, cette bibliothèque. »',
     'Il salue bas comme au théâtre, et tend les pattes à Griffe : « Escorte-moi, vieux frère. Pour la forme. »'],
    'demasque',
  )
  await dialogue(
    ['Devant la ville rassemblée, Griffe te remet la Médaille d’Or de l’Académie.',
     '« Pas mal, chaton. Non — mieux que ça. Mieux que nous deux. »'],
    'griffe',
  )

  carnet.ajouterFragment('Démasqué : Balthazar, ancien élève de l’Académie et coéquipier de Griffe. Il s’ennuyait — il fabriquait des mystères dignes d’être résolus.')

  await dialogue(['Et au petit matin, sur la porte de la Gendarmerie, une dernière carte grise…'], 'narrateur')
  await carteFinale()
  await ecranASuivre()
  return true
}
