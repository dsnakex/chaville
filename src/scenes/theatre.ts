import type { Scene, Suspect } from '../types'

const RIDEAU: Suspect = { id: 'rideau', nom: 'Rideau', role: 'Machiniste costaud', portrait: { espece: 'chat', fourrure: '#7C8698', ventre: '#E4E1D8', accent: '#5C6478', coiffe: 'casquette', habit: '#4A4058' } }
const MELODIE: Suspect = { id: 'melodie', nom: 'Mélodie', role: 'Harpiste rêveuse', portrait: { espece: 'chat', fourrure: '#C7A9C0', ventre: '#F2EDE0', accent: '#9A7A94', coiffe: 'aucune', habit: '#8A6B9A' } }
const FAUSSET: Suspect = { id: 'fausset', nom: 'Fausset', role: 'Ténor bavard', portrait: { espece: 'chat', fourrure: '#C9A25C', ventre: '#F2EDE0', accent: '#9A7A3E', coiffe: 'noeud', habit: '#33304A' } }
const PAILLETTE: Suspect = { id: 'paillette', nom: 'Paillette', role: 'Costumière étourdie', portrait: { espece: 'chat', fourrure: '#D9A6C0', ventre: '#F2EDE0', accent: '#F4C95D', coiffe: 'aucune', habit: '#C4844E' } }
const LUMIERE: Suspect = { id: 'lumiere', nom: 'Lumière', role: 'Éclairagiste précis', portrait: { espece: 'chat', fourrure: '#A8A39B', ventre: '#F2EDE0', accent: '#7C776E', coiffe: 'aucune', habit: '#5A5370' } }
const ECHO: Suspect = { id: 'echo', nom: 'Écho', role: 'Vieux souffleur discret', portrait: { espece: 'chat', fourrure: '#8F97A6', ventre: '#E4E1D8', accent: '#6A7182', coiffe: 'aucune', habit: '#4A4660', regard: 'endormi' } }

export const theatre: Scene = {
  id: 'theatre',
  nom: 'Le Théâtre',
  lieu: 'theatre',
  objectif: 'Retrouver la partition de la diva',
  decor: '/assets/decors/theatre.png',
  largeur: 768,
  hauteur: 1376,
  arrivee: { x: 300, y: 1250 },
  ambiance: 'La partition de Madame Sopranino a disparu, remplacée par des signes étranges. « Le théâtre est hanté ! » murmure-t-on.',
  zone: {
    yHaut: 1150, yBas: 1330, demiLargeurHaut: 300, demiLargeurBas: 360,
    centreX: 384, echelleLoin: 0.6, echelleProche: 1.05,
  },
  obstacles: [{ x: 620, y: 1000, w: 140, h: 90 }],
  brume: [{ x: 384, y: 1150, rx: 240, ry: 24, opacite: 0.12, duree: 20 }],
  hotspots: [
    {
      id: 'th-griffe', libelle: 'Griffe en coulisses', sorte: 'pnj',
      at: { x: 400, y: 770 }, station: { x: 400, y: 1180 }, voix: 'griffe',
      dialogue: [
        "Le théâtre hanté ? Mon œil. Le concert doit avoir lieu ce soir, chaton. File.",
        "La partition de la diva a disparu, remplacée par une feuille de signes étranges. Six personnes travaillaient en coulisses. Observe, décode, calcule — puis accuse.",
      ],
      indice: { titre: 'La partition volée', texte: "La partition de Madame Sopranino a disparu pendant l'essayage du costume, remplacée par des signes étranges. Six suspects en coulisses." },
    },
    {
      id: 'th-obs', libelle: 'La scène', sorte: 'jeu',
      at: { x: 400, y: 840 }, station: { x: 400, y: 1175 }, voix: 'detective',
      dialogue: ["La scène garde la mémoire de la répétition. Regardons vite."],
      jeu: {
        type: 'observation',
        consigne: 'Observe la scène. Quatre questions vont suivre.',
        duree: 18, cadre: { x: 60, y: 120, w: 650, h: 760 },
        questions: [
          { question: 'Que cousait Paillette ?', reponses: ['Un rideau rouge', 'Une cape dorée', 'Un chapeau', 'Un costume noir'], bonne: 1 },
          { question: 'Qui accordait sa harpe ?', reponses: ['Mélodie', 'Fausset', 'Lumière', 'Écho'], bonne: 0 },
          { question: 'Que buvait Madame Sopranino ?', reponses: ['Un lait chaud', 'Une tisane au miel', 'Un chocolat', 'De l’eau'], bonne: 1 },
          { question: 'Que faisait Rideau ?', reponses: ['Il balayait', 'Il accrochait un décor de lune', 'Il réglait les lumières', 'Il répétait'], bonne: 1 },
        ],
      },
      indice: { titre: 'Une cape dorée', texte: "Paillette cousait une cape dorée en coulisses pendant que les autres s'affairaient sur scène." },
    },
    {
      id: 'th-note', libelle: 'La fausse partition', sorte: 'jeu',
      at: { x: 430, y: 720 }, station: { x: 430, y: 1170 }, voix: 'pistache',
      dialogue: ["La « fausse partition »… n'est pas une partition ! C'est un message aux mots mélangés."],
      jeu: {
        type: 'message',
        consigne: 'Trois mots à remettre en ordre.',
        gabarit: 'Le {0} commence quand le {1} est fini — pense à la {2} !',
        mots: [
          { mot: 'SPECTACLE', indice: 'Ce qu’on vient voir au théâtre 🎭' },
          { mot: 'COSTUME', indice: 'La diva le porte sur scène 👗' },
          { mot: 'DOUBLURE', indice: 'Le tissu caché à l’intérieur d’un vêtement 🧵' },
        ],
      },
      indice: { titre: 'Le message des couturiers', texte: "« Le SPECTACLE commence quand le COSTUME est fini — pense à la DOUBLURE ! » Des mots de couture, pas de sortilège." },
    },
    {
      id: 'th-heure', libelle: 'L’heure de la diva', sorte: 'jeu',
      at: { x: 250, y: 860 }, station: { x: 280, y: 1170 }, voix: 'detective',
      dialogue: ["Pendant l'essayage du costume, dans la loge, qui était sur scène devant tout le monde ?"],
      jeu: {
        type: 'calcul',
        consigne: 'Calcule l’heure du début de préparation.',
        enonce: 'Le concert commence à 20 h 30. Il faut 45 minutes de maquillage puis 25 minutes de coiffure. À quelle heure la diva doit-elle commencer sa préparation ?',
        reponses: ['19 h 00', '19 h 20', '19 h 30', '19 h 50'], bonne: 1,
        revelation: 'La partition a disparu pendant l’essayage, dans la loge. Rideau, Mélodie, Fausset et Lumière étaient sur scène, devant tout le monde !',
      },
      indice: { titre: 'Tous sur scène', texte: "Pendant l'essayage du costume, Rideau, Mélodie, Fausset et Lumière étaient sur scène devant le public. Seule la loge comptait." },
    },
    {
      id: 'th-fils', libelle: 'Les fils dorés', sorte: 'jeu',
      at: { x: 560, y: 860 }, station: { x: 530, y: 1170 }, voix: 'detective',
      dialogue: ["Sur le pupitre, des petits fils dorés. Mesurons-les."],
      jeu: {
        type: 'calcul',
        consigne: 'Calcule la longueur totale de fil doré.',
        enonce: 'Sur le pupitre : 3 fils de 4 cm et 2 fils de 6 cm. Quelle longueur de fil doré en tout ?',
        reponses: ['18 cm', '20 cm', '24 cm', '36 cm'], bonne: 2,
        revelation: 'Des fils dorés, exactement comme la cape cousue en coulisses… Il ne reste que deux suspects : lequel des deux manie une aiguille ?',
      },
      indice: { titre: 'Des fils dorés', texte: "24 cm de fil doré sur le pupitre, comme la cape cousue en coulisses. Reste à savoir qui manie l'aiguille." },
    },
    {
      id: 'th-echo', libelle: 'Interroger Écho', sorte: 'temoin',
      at: { x: 700, y: 1000 }, station: { x: 610, y: 1175 },
      interrogatoire: {
        suspect: ECHO,
        intro: ['(à voix basse) Chut… on ne crie pas dans un théâtre. Que veux-tu savoir, petit ?'],
        questions: [
          { question: 'Cousez-vous, parfois ?', options: [
            { texte: 'Oui ?', reponse: 'Moi ? Mes pattes tremblent trop pour tenir une aiguille. Je souffle les textes, c’est tout.' },
            { texte: 'Qui coud, alors ?', reponse: 'La costumière, Paillette. Toujours pressée, toujours à ranger n’importe quoi n’importe où.' },
          ] },
          { question: 'Où étiez-vous à l’essayage ?', options: [
            { texte: 'Dans la loge ?', reponse: 'Dans mon trou de souffleur, sous la scène. Je n’ai pas mis une patte dans la loge.' },
          ] },
        ],
        temoignage: "Écho, les pattes tremblantes, ne coud pas. Il pointe Paillette, la costumière toujours pressée qui range tout de travers.",
      },
    },
    {
      id: 'th-deduction', libelle: 'Accuser un suspect', sorte: 'deduction',
      at: { x: 400, y: 1080 }, station: { x: 400, y: 1170 }, voix: 'pistache',
      requiert: ['th-obs', 'th-note', 'th-heure', 'th-fils'],
      dialogue: ['Une aiguille, des fils dorés, une loge… Qui accuses-tu, détective ?'],
      jeu: {
        type: 'deduction',
        consigne: 'Rideau, Mélodie, Fausset et Lumière étaient sur scène. Reste la loge : qui manie une aiguille ?',
        suspects: [RIDEAU, MELODIE, FAUSSET, PAILLETTE, LUMIERE, ECHO],
        ecartes: [0, 1, 2, 4],
        coupable: 3,
        aide: 'Une « partition » pleine de symboles de couture, des fils dorés… qui cousait une cape dorée ?',
        denouement: [
          "Paillette écarquille les yeux… puis éclate de rire : en cousant la cape dorée à toute vitesse, elle a rangé la partition dans la DOUBLURE et laissé son patron de couture sur le pupitre — voilà les « signes étranges » !",
          "On découd la cape, la partition est retrouvée, et Madame Sopranino chante si bien que même les souris du grenier applaudissent.",
          "Le théâtre n'était pas hanté… juste très étourdi !",
        ],
      },
    },
    {
      id: 'th-sortie', libelle: 'Retour à la carte', sorte: 'sortie',
      at: { x: 60, y: 1300 }, station: { x: 110, y: 1290 }, vers: 'hub', discret: true,
    },
  ],
}
