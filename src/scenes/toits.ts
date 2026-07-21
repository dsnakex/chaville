import type { Scene } from '../types'

/**
 * « La dernière danse du Fantôme Gris » — enquête bonus, minuit sur les toits.
 * Structure différente des six enquêtes : pas de suspects ni de compteur
 * d'indices, mais une remontée de piste en 3 étapes puis une confrontation.
 * (Déroulé fidèle au pack narratif `da/session4-fantome-gris.md`.)
 */
export const toits: Scene = {
  id: 'toits',
  nom: 'Les Toits de Chaville',
  lieu: 'toits',
  objectif: 'Remonter la piste jusqu’à lui',
  decor: '/assets/decors/toits.png',
  largeur: 768,
  hauteur: 1376,
  arrivee: { x: 330, y: 1290 },
  ambiance: 'Minuit sur les toits. Griffe est resté en bas : « C’est ton affaire, chaton. C’est toi qu’il a choisi. »',
  zone: {
    yHaut: 1120, yBas: 1330, demiLargeurHaut: 280, demiLargeurBas: 340,
    centreX: 400, echelleLoin: 0.6, echelleProche: 1.0,
  },
  obstacles: [{ x: 600, y: 1130, w: 150, h: 110 }],
  brume: [
    { x: 300, y: 1120, rx: 260, ry: 30, opacite: 0.2, duree: 18 },
    { x: 540, y: 1170, rx: 210, ry: 24, opacite: 0.16, duree: 25 },
  ],
  hotspots: [
    {
      id: 'tt-montre', libelle: 'Une montre à gousset', sorte: 'jeu',
      at: { x: 470, y: 840 }, station: { x: 470, y: 1170 }, voix: 'detective',
      astuce: 'Et cette montre, accrochée à la cheminée — elle est à lui, non ?',
      dialogue: [
        'Une montre à gousset se balance à une cheminée. Elle n’est pas là par hasard : il veut qu’on la trouve.',
        'Elle n’est pas à l’heure… et ça, c’est un message.',
      ],
      jeu: {
        type: 'calcul',
        consigne: 'Retrouve la vraie heure — elle t’indiquera où aller.',
        enonce:
          'La montre du Fantôme Gris avance de 7 minutes par heure. Il l’a réglée à l’heure juste à 23 h. Elle indique maintenant 0 h 07. Quelle heure est-il vraiment ?',
        reponses: ['23 h 53', 'Minuit', '0 h 14', '1 h 07'], bonne: 1,
        revelation:
          'Une heure s’est écoulée : la montre a pris 7 minutes d’avance. Il est minuit pile — et les aiguilles de la VRAIE heure pointent le clocher.',
      },
    },
    {
      id: 'tt-partition', libelle: 'Une partition griffonnée', sorte: 'jeu',
      at: { x: 210, y: 975 }, station: { x: 255, y: 1175 }, voix: 'pistache',
      astuce: 'Il y a un papier coincé dans la gouttière, là-bas — va voir !',
      dialogue: [
        'Un bout de partition est coincé dans la gouttière. Mais les notes… ce ne sont pas des notes.',
        'C’est écrit à l’envers ! Comme dans un miroir.',
      ],
      jeu: {
        type: 'miroir',
        consigne: 'Le message est écrit en miroir. À toi de le lire.',
        texteMiroir: 'SUIS LA FUMÉE QUI NE MONTE PAS',
        question: 'Que dit le message ?',
        reponses: [
          'Suis la fumée qui ne monte pas',
          'Suis la lune qui ne se couche pas',
          'Fuis la fumée qui monte',
          'Suis la fumée qui monte',
        ],
        bonne: 0,
      },
    },
    {
      id: 'tt-silhouette', libelle: 'Une silhouette fugace', sorte: 'jeu',
      at: { x: 690, y: 815 }, station: { x: 585, y: 1165 }, voix: 'detective',
      astuce: 'Là — derrière les cheminées ! Quelque chose a bougé, j’en suis sûr.',
      dialogue: [
        'Une ombre file derrière les cheminées. Une seconde, pas plus.',
        'Cape au vent, quelque chose sur la tête… Laquelle de ces ombres est la sienne ?',
      ],
      jeu: {
        type: 'silhouette',
        consigne: 'Tu ne l’as vu qu’une seconde : cape au vent et haut-de-forme.',
        question: 'Quelle silhouette correspond au Fantôme Gris ?',
        options: [
          { chapeau: false, cape: true, rot: -8 },
          { chapeau: true, cape: true, rot: 6 },
          { chapeau: true, cape: false, rot: -4 },
          { chapeau: false, cape: false, rot: 8 },
        ],
        bonne: 1,
      },
    },
    {
      id: 'tt-confrontation', libelle: 'La grande cheminée', sorte: 'confrontation',
      at: { x: 420, y: 1085 }, station: { x: 420, y: 1180 }, voix: 'pistache',
      requiert: ['tt-montre', 'tt-partition', 'tt-silhouette'],
      astuce: 'La grande cheminée, là-bas… il nous attend. Tu es prêt ?',
      dialogue: ['Là-bas, devant la lune. Il ne se cache même plus. Tu es prêt, détective ?'],
    },
    // --- Étincelles cachées ---
    { id: 'tt-etincelle-1', libelle: 'un reflet sur une ardoise', sorte: 'etincelle', at: { x: 118, y: 1215 }, recompense: 1 },
    { id: 'tt-etincelle-2', libelle: 'un éclat près du fil à linge', sorte: 'etincelle', at: { x: 352, y: 940 }, recompense: 1 },
    { id: 'tt-etincelle-3', libelle: 'une lueur sur la cheminée', sorte: 'etincelle', at: { x: 704, y: 1055 }, recompense: 2 },
    {
      id: 'tt-sortie', libelle: 'Redescendre en ville', sorte: 'sortie',
      at: { x: 60, y: 1300 }, station: { x: 112, y: 1292 }, vers: 'hub', discret: true,
    },
  ],
}
