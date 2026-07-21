import type { Scene } from '../types'

/**
 * La Grand-Place, de nuit. Enquête d'ouverture (les treize coups d'horloge).
 * Sert aussi d'introduction au mode aventure : pas de déduction formelle ici,
 * on récolte des indices avant de descendre au port.
 */
export const grandPlace: Scene = {
  id: 'grand-place',
  nom: 'La Grand-Place',
  lieu: 'place',
  objectif: 'Comprendre les treize coups de cette nuit',
  decor: '/assets/decors/place.png',
  largeur: 768,
  hauteur: 1376,
  arrivee: { x: 300, y: 1250 },
  ambiance: 'Les pavés luisent encore de brume. Quelque part, une horloge a menti cette nuit.',
  zone: {
    yHaut: 1085, yBas: 1345, demiLargeurHaut: 300, demiLargeurBas: 372,
    centreX: 384, echelleLoin: 0.62, echelleProche: 1.15,
  },
  // L'étal du marché : on ne marche plus au travers.
  obstacles: [{ x: 360, y: 1080, w: 190, h: 70 }],
  brume: [
    { x: 250, y: 1075, rx: 270, ry: 34, opacite: 0.22, duree: 17 },
    { x: 540, y: 1120, rx: 230, ry: 26, opacite: 0.16, duree: 23 },
  ],
  hotspots: [
    {
      id: 'gp-griffe', libelle: 'La fenêtre éclairée', sorte: 'pnj',
      at: { x: 676, y: 828 }, station: { x: 620, y: 1130 }, voix: 'griffe',
      dialogue: [
        "Ah, te voilà, chaton. Tu tombes bien : la place entière raconte n'importe quoi depuis ce matin.",
        "Cette nuit, l'horloge a sonné treize coups. Treize. Et à l'aube, les caisses de poisson de l'étal étaient vides.",
        "Tout le monde crie au fantôme. Moi je dis qu'un fantôme, ça ne soulève pas des caisses en bois.",
        "Alors tu vas faire ce que tu sais faire : regarder, lire, compter. Trois indices ici, et tu descends au port.",
      ],
      indice: {
        titre: 'La consigne de Griffe',
        texte: "Treize coups d'horloge cette nuit, et les caisses de l'étal vidées avant l'aube. Griffe refuse la piste du fantôme : il veut des faits.",
      },
    },
    {
      id: 'gp-etal', libelle: "L'étal du marché", sorte: 'jeu',
      at: { x: 468, y: 1058 }, station: { x: 500, y: 1180 }, voix: 'detective',
      dialogue: ["L'étal est encore monté, la lanterne allumée. Celui qui est venu n'était pas pressé de tout ranger."],
      jeu: {
        type: 'observation',
        consigne: "Observe l'étal et ce qu'il y a autour. Une question t'attend juste après.",
        duree: 20, cadre: { x: 330, y: 860, w: 330, h: 320 },
        questions: [
          { question: "Sous l'étal, les caisses portent toutes le même dessin. Lequel ?", reponses: ['Un poisson', 'Une étoile', 'Une clé', 'Une couronne'], bonne: 0 },
        ],
      },
      indice: {
        titre: 'Des caisses à poissons',
        texte: "Les caisses de l'étal sont marquées d'un poisson : elles viennent de la poissonnerie du port, pas du marché.",
      },
    },
    {
      id: 'gp-poissonnerie', libelle: 'La poissonnerie', sorte: 'jeu',
      at: { x: 118, y: 900 }, station: { x: 150, y: 1140 }, voix: 'pistache',
      dialogue: ["La poissonnerie est fermée, mais regarde l'ardoise dans la vitrine — un mot à moitié effacé, les lettres dans le désordre."],
      jeu: {
        type: 'message',
        consigne: "Remets les lettres dans l'ordre pour retrouver le mot de l'ardoise.",
        gabarit: 'Sur l’ardoise : « {0} »',
        mots: [{ mot: 'MAREE', indice: 'Le mouvement de la mer, qui monte et descend deux fois par jour 🌊' }],
      },
      indice: {
        titre: "Le mot de l'ardoise",
        texte: "Sur l'ardoise de la poissonnerie : « MARÉE ». Quelqu'un surveillait l'heure de la marée cette nuit-là.",
      },
    },
    {
      id: 'gp-horloge', libelle: "L'horloge de la tour", sorte: 'jeu',
      at: { x: 519, y: 288 }, station: { x: 470, y: 1105 }, voix: 'detective',
      dialogue: ["L'horloge de la tour. Treize coups, ça ne veut rien dire… sauf si on compte vraiment ce qu'elle aurait dû sonner."],
      jeu: {
        type: 'calcul',
        consigne: 'Compte les coups que l\'horloge aurait dû sonner cette nuit-là.',
        enonce: "L'horloge sonne le nombre d'heures : 11 coups à 23 h, 12 coups à minuit. Combien de coups en tout sur ces deux heures ?",
        reponses: ['22 coups', '23 coups', '24 coups', '25 coups'], bonne: 1,
        revelation: "De 23 h à minuit, ça fait 11 + 12 = 23 coups. Les treize coups d'affilée ne collent à aucune heure : ce n'était pas l'horloge !",
      },
      indice: {
        titre: 'Treize coups impossibles',
        texte: "De 23 h à minuit, l'horloge doit sonner 11 puis 12 coups, soit 23 en tout. Les treize coups entendus d'affilée ne correspondent à aucune heure : ce n'était pas l'horloge.",
      },
    },
    {
      id: 'gp-vers-port', libelle: 'Descendre au port', sorte: 'sortie',
      at: { x: 52, y: 1215 }, station: { x: 105, y: 1235 }, vers: 'port', voix: 'pistache',
      dialogue: ['La ruelle descend droit au port. Ça sent le varech et le poisson frais. Tu viens ?'],
    },
  ],
}
