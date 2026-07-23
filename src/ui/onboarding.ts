import { dialogue } from './dialogue'
import { carnet } from '../state'

/**
 * Onboarding de la première minute (Grand-Place, 1re entrée seulement).
 * Trois bulles de Pistache — marcher, ramasser l'étincelle tutorielle, le
 * carnet — précédées de l'offre des croquettes de bienvenue (une seule fois).
 * Non bloquant : se ferme au toucher, comme tout dialogue. Ne se rejoue jamais.
 */
export async function lancerOnboarding(): Promise<void> {
  if (carnet.onboardingVu()) return

  const avecCroquettes = carnet.offrirBienvenue(2)
  const bienvenue = avecCroquettes
    ? 'Bienvenue, détective ! Tiens, 2 croquettes d’or pour bien commencer. 🍪🍪'
    : 'Bienvenue, détective ! Prête à résoudre ta première enquête ?'

  await dialogue(
    [
      bienvenue,
      'Touche là où tu veux marcher — le détective y va tout seul, pas besoin de viser juste.',
      'Tu vois ce petit reflet doré qui brille sur la place ? Touche-le pour ramasser ta première étincelle d’or.',
      'Et ton carnet garde tout — indices, témoins, croquettes. Il t’attend là-haut, à droite. 📓',
    ],
    'pistache',
  )

  carnet.marquerOnboardingVu()
}
