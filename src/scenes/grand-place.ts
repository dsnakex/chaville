import type { Scene } from '../types'

/**
 * La Grand-Place, de nuit. Point de départ de l'aventure.
 * Mystère d'ouverture : l'horloge a sonné treize coups et les caisses
 * du marché se sont vidées. Ça sent le fantôme… ou pas.
 */
export const grandPlace: Scene = {
  id: 'grand-place',
  nom: 'La Grand-Place',
  decor: '/assets/decors/place.png',
  largeur: 768,
  hauteur: 1376,
  arrivee: { x: 300, y: 1250 },
  ambiance: 'Les pavés luisent encore de brume. Quelque part, une horloge a menti cette nuit.',
  zone: {
    yHaut: 1085,
    yBas: 1345,
    demiLargeurHaut: 300,
    demiLargeurBas: 372,
    centreX: 384,
    echelleLoin: 0.62,
    echelleProche: 1.15,
  },
  brume: [
    { x: 250, y: 1075, rx: 270, ry: 34, opacite: 0.22, duree: 17 },
    { x: 540, y: 1120, rx: 230, ry: 26, opacite: 0.16, duree: 23 },
  ],
  hotspots: [
    {
      id: 'gp-griffe',
      libelle: 'La fenêtre éclairée',
      sorte: 'pnj',
      at: { x: 676, y: 828 },
      station: { x: 620, y: 1130 },
      voix: 'griffe',
      dialogue: [
        "Ah, te voilà, chaton. Tu tombes bien : la place entière raconte n'importe quoi depuis ce matin.",
        "Cette nuit, l'horloge a sonné treize coups. Treize. Et à l'aube, les caisses de poisson de l'étal étaient vides.",
        "Tout le monde crie au fantôme. Moi je dis qu'un fantôme, ça ne soulève pas des caisses en bois.",
        "Alors tu vas faire ce que tu sais faire : regarder, lire, compter. Trois indices ici, et tu descends au port. Pistache te suit.",
      ],
      indice: {
        titre: 'La consigne de Griffe',
        texte:
          "Treize coups d'horloge cette nuit, et les caisses de l'étal vidées avant l'aube. Griffe refuse la piste du fantôme : il veut des faits.",
      },
    },
    {
      id: 'gp-etal',
      libelle: "L'étal du marché",
      sorte: 'jeu',
      at: { x: 468, y: 1058 },
      station: { x: 468, y: 1175 },
      voix: 'detective',
      dialogue: [
        "L'étal est encore monté, la lanterne allumée. Celui qui est venu n'était pas pressé de tout ranger.",
        'Regarde bien avant de conclure quoi que ce soit.',
      ],
      jeu: {
        type: 'observation',
        consigne: "Observe l'étal et ce qu'il y a autour. Tu auras une question juste après.",
        duree: 20,
        cadre: { x: 330, y: 860, w: 330, h: 320 },
        question: "Sous l'étal, les caisses portent toutes le même dessin. Lequel ?",
        reponses: ['Un poisson', 'Une étoile', 'Une clé', 'Une couronne'],
        bonne: 0,
      },
      indice: {
        titre: 'Des caisses à poissons',
        texte:
          "Les caisses de l'étal sont marquées d'un poisson : elles viennent de la poissonnerie du port, pas du marché.",
      },
    },
    {
      id: 'gp-poissonnerie',
      libelle: 'La poissonnerie',
      sorte: 'jeu',
      at: { x: 118, y: 900 },
      station: { x: 150, y: 1140 },
      voix: 'pistache',
      dialogue: [
        "La poissonnerie est fermée, mais regarde l'ardoise dans la vitrine — il y a un mot à moitié effacé.",
        "Les lettres sont toutes là, elles sont juste dans le désordre. Tu m'aides ?",
      ],
      jeu: {
        type: 'anagramme',
        consigne: "Remets les lettres dans l'ordre pour retrouver le mot de l'ardoise.",
        mot: 'MAREE',
        indice:
          "c'est le mouvement de la mer, qui monte et qui descend deux fois par jour. Commence par un M !",
      },
      indice: {
        titre: "Le mot de l'ardoise",
        texte:
          "Sur l'ardoise de la poissonnerie : « MARÉE ». Quelqu'un surveillait l'heure de la marée cette nuit-là.",
      },
    },
    {
      id: 'gp-horloge',
      libelle: "L'horloge de la tour",
      sorte: 'jeu',
      at: { x: 519, y: 288 },
      station: { x: 470, y: 1105 },
      voix: 'detective',
      dialogue: [
        "L'horloge de la tour. Elle a l'air parfaitement normale, en plein jour.",
        'Treize coups, ça ne veut rien dire… sauf si on compte vraiment ce qu\'elle aurait dû sonner.',
      ],
      jeu: {
        type: 'calcul',
        consigne: 'Compte les coups que l\'horloge aurait dû sonner cette nuit-là.',
        enonce:
          "L'horloge de Chaville sonne le nombre d'heures : 1 coup à 1 h, 12 coups à minuit. Cette nuit, elle a sonné à 23 h — c'est-à-dire 11 coups — puis de nouveau à minuit. Combien de coups aurait-elle dû sonner en tout sur ces deux heures ?",
        reponse: 23,
        unite: 'coups',
      },
      indice: {
        titre: 'Treize coups impossibles',
        texte:
          "De 23 h à minuit, l'horloge doit sonner 11 puis 12 coups, soit 23 en tout. Les treize coups entendus d'affilée ne correspondent à aucune heure : ce n'était pas l'horloge.",
      },
    },
    {
      id: 'gp-vers-port',
      libelle: 'Descendre au port',
      sorte: 'sortie',
      at: { x: 52, y: 1215 },
      station: { x: 105, y: 1235 },
      vers: 'port',
      voix: 'pistache',
      dialogue: ['La ruelle descend droit au port. Ça sent le varech et le poisson frais. Tu viens ?'],
    },
  ],
}
