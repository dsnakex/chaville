import { ouvrirCouche } from './modal'
import { dialogue } from './dialogue'
import { carnet } from '../state'

/**
 * Les six cartes de visite du Fantôme Gris.
 * ⚠️ Textes VERBATIM (pack narratif `da/session4-fantome-gris.md`, validé par
 * Pascal) : ne jamais les réécrire. Seule la mise en page est libre.
 * Le corps + la signature recomposent exactement le texte d'origine.
 */
export interface CarteFG {
  /** Lieu dont la déduction déclenche la carte. */
  lieu: string
  texte: string
  signature: string
  fragment: string
  reaction: string
  voixReaction: 'griffe' | 'pistache'
  /** Carte 2 : un fil de gant gris perle est épinglé sur la carte. */
  filDeGant?: boolean
  /** Carte 6 : ouvre « Les Toits de Chaville ». */
  ouvreLesToits?: boolean
}

export const CARTES: CarteFG[] = [
  {
    lieu: 'place',
    texte:
      '« Bravo pour les croquettes, chaton. Mais pose-toi une question : qui a crocheté la serrure que ce brave Moustache n’aurait jamais su ouvrir ? Cette nuit-là, tu n’as vu que ce que je t’ai laissé voir.',
    signature: '— F.G. »',
    fragment: 'Sait crocheter les serrures les plus fines.',
    reaction: 'Griffe fronce les sourcils. « F.G. … Ça ne peut pas être lui. File, chaton. Et garde cette carte. »',
    voixReaction: 'griffe',
  },
  {
    lieu: 'manoir',
    texte:
      '« Un fermoir ne s’use pas en une nuit, chaton — il se lime. J’avais réservé ce collier pour ma collection ; ton cuisinier étourdi me l’a soufflé sans même le savoir. La prochaine fois, j’arriverai le premier.',
    signature: '— F.G. »',
    fragment: 'Porte des gants gris perle cousus main — une élégance d’un autre temps.',
    reaction: 'Pistache renifle le fil. « Cousu main ! Même la Duchesse n’en a pas des comme ça… »',
    voixReaction: 'pistache',
    filDeGant: true,
  },
  {
    lieu: 'port',
    texte:
      '« Un bateau fantôme… jolie rumeur, n’est-ce pas ? C’est moi qui l’ai soufflée aux pêcheurs : rien de tel qu’une histoire de fantôme pour vider les quais à marée basse. Tu connais tes tables de calcul, chaton. Moi, je connais mes marées.',
    signature: '— F.G. »',
    fragment: 'Connaît les marées par cœur — les quais n’ont aucun secret pour lui.',
    reaction: 'Griffe, sombre : « Les marées… Il n’y a qu’un endroit où l’on apprend à s’en servir comme ça. »',
    voixReaction: 'griffe',
  },
  {
    lieu: 'bibliotheque',
    texte:
      '« Ton petit copiste est attendrissant. Mais pendant que toute la ville cherchait des pages blanches, une seule page m’intéressait : la carte n° 17 des *Passages secrets de Chaville*. Elle manquait à ma collection. Plus maintenant.',
    signature: '— F.G. »',
    fragment:
      'A volé « Les passages secrets de Chaville » — il prépare un grand coup, quelque part SOUS la ville.',
    reaction: 'Pistache frissonne : « Des passages secrets ? Sous nos pattes ? Dis, on est obligés d’y aller ? »',
    voixReaction: 'pistache',
  },
  {
    lieu: 'theatre',
    texte:
      '« J’étais au balcon, loge n° 3. La diva a été magnifique — et toi aussi, je l’avoue. J’aime les belles mises en scène : j’étais premier en tout, autrefois. Même en théâtre. Surtout, chaton, ne t’arrête pas : tu es mon meilleur spectacle depuis des années.',
    signature: '— F.G. »',
    fragment:
      '« Premier en tout, autrefois. » Mais où apprend-on à la fois le théâtre, les serrures et les passages secrets ?',
    reaction: 'Griffe reste longtemps silencieux, puis : « Premier en tout… Oui. Il l’était. »',
    voixReaction: 'griffe',
  },
  {
    lieu: 'tour',
    texte:
      '« Tu m’as coûté cher, chaton. Pendant que toute la ville fixait son horloge muette, la salle des trophées de l’Académie m’attendait — à douze pas sous le cadran, la carte n° 17 est formelle. Un hibou et un détective auront suffi à défaire six mois de travail. Puisque tu tiens tant à me connaître : retrouve-moi sur les toits, à minuit. Viens seul. Bon, d’accord — avec la souris. Elle me fait rire.',
    signature: '— F.G. »',
    fragment: 'Visait la salle des trophées de l’Académie. Et maintenant… il t’invite.',
    reaction:
      'Griffe pose sa patte sur l’épaule du détective. « Alors c’est ce soir. Écoute-moi bien, chaton : quoi qu’il dise là-haut… il ne ment jamais. C’est ça qui le rend dangereux. »',
    voixReaction: 'griffe',
    ouvreLesToits: true,
  },
]

export const carteDuLieu = (lieu: string): CarteFG | undefined =>
  CARTES.find((c) => c.lieu === lieu)

/** Rend le texte en gérant l'emphase *…* du pack narratif. */
function texteAvecEmphase(p: HTMLElement, texte: string): void {
  const morceaux = texte.split(/\*([^*]+)\*/g)
  morceaux.forEach((m, i) => {
    if (i % 2 === 1) {
      const em = document.createElement('em')
      em.textContent = m
      p.appendChild(em)
    } else if (m) {
      p.appendChild(document.createTextNode(m))
    }
  })
}

/**
 * Affiche la carte de visite puis la réaction de Griffe/Pistache.
 * Ne se redéclenche pas si le fragment est déjà acquis (enquête rejouée).
 * @returns true si un nouveau fragment vient d'être ajouté.
 */
export async function montrerCarteFG(lieu: string): Promise<boolean> {
  const carte = carteDuLieu(lieu)
  if (!carte) return false
  if (carnet.fgFragments().includes(carte.fragment)) return false

  await new Promise<void>((resolve) => {
    const { fond, panneau, fermer } = ouvrirCouche('couche-carte-fg')

    const carteEl = document.createElement('div')
    carteEl.className = 'carte-fg'

    if (carte.filDeGant) {
      const fil = document.createElement('span')
      fil.className = 'carte-fg-fil'
      fil.setAttribute('aria-label', 'Un fil de gant gris perle épinglé')
      fil.innerHTML =
        '<svg viewBox="0 0 60 40" aria-hidden="true">' +
        '<path d="M6,32 C18,10 34,34 52,8" fill="none" stroke="#D8D3DE" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M6,32 C18,10 34,34 52,8" fill="none" stroke="#2F2A45" stroke-width="1" stroke-linecap="round" opacity=".35"/>' +
        '<circle cx="52" cy="8" r="4" fill="#C9C3D2" stroke="#2F2A45" stroke-width="1.5"/></svg>'
      carteEl.appendChild(fil)
    }

    const corps = document.createElement('p')
    corps.className = 'carte-fg-texte'
    texteAvecEmphase(corps, carte.texte)

    const sign = document.createElement('div')
    sign.className = 'carte-fg-signature'
    const sparkle = document.createElement('span')
    sparkle.className = 'carte-fg-etincelle'
    sparkle.textContent = '✦'
    const nom = document.createElement('span')
    nom.textContent = carte.signature
    sign.append(nom, sparkle)

    carteEl.append(corps, sign)

    const suite = document.createElement('button')
    suite.className = 'bouton bouton-primaire carte-fg-suite'
    suite.textContent = 'Continuer ▸'
    suite.addEventListener('click', () => {
      fond.removeEventListener('click', surFond)
      fermer()
      resolve()
    })

    const surFond = (ev: MouseEvent): void => {
      if (ev.target === fond) suite.click()
    }
    fond.addEventListener('click', surFond)

    panneau.append(carteEl, suite)
  })

  await dialogue([carte.reaction], carte.voixReaction)
  carnet.ajouterFragment(carte.fragment)
  return true
}
