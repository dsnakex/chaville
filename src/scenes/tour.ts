import type { Scene, Suspect } from '../types'

const TIC: Suspect = { id: 'tic', nom: 'Tic', role: 'Horloger jumeau', portrait: { espece: 'chat', fourrure: '#9A8C6E', ventre: '#EDE4CE', accent: '#6B5A44', coiffe: 'casquette', habit: '#6B5A44' } }
const TAC: Suspect = { id: 'tac', nom: 'Tac', role: 'Horloger jumeau', portrait: { espece: 'chat', fourrure: '#9A8C6E', ventre: '#EDE4CE', accent: '#6B5A44', coiffe: 'casquette', habit: '#5A4A38' } }
// ⚠️ Planche « coupables » : ses plumes se détachent facilement — les plumes
// retrouvées dans les rouages sont un indice de l'enquête.
const HECTOR: Suspect = { id: 'hector', nom: 'Hector', role: 'Hibou de la tour', portrait: { espece: 'hibou', fourrure: '#8A7B6C', ventre: '#D8C4A0', accent: '#6E6255', habit: '#6B5540', accessoire: 'plume-envol', planche: 'hector', taille: 1.06 } }
const PERDRIX: Suspect = { id: 'perdrix', nom: 'Perdrix', role: 'Pie bavarde des toits', portrait: { espece: 'oiseau', fourrure: '#33333E', ventre: '#F2EDE0', accent: '#5A6488', coiffe: 'aucune', habit: '#2F2A45' } }
const MINUIT: Suspect = { id: 'minuit', nom: 'Minuit', role: 'Veilleuse de nuit', portrait: { espece: 'chat', fourrure: '#3F4A63', ventre: '#9098AE', accent: '#5A6488', coiffe: 'aucune', habit: '#2F2A45', regard: 'endormi' } }
const CARILLON: Suspect = { id: 'carillon', nom: 'Carillon', role: 'Sonneur des cloches', portrait: { espece: 'chat', fourrure: '#A8A39B', ventre: '#F2EDE0', accent: '#7C776E', coiffe: 'aucune', habit: '#7A5A44' } }
const LUCIOLE: Suspect = { id: 'luciole', nom: 'Luciole', role: 'Chatte des toits', portrait: { espece: 'chat', fourrure: '#C7A9C0', ventre: '#F2EDE0', accent: '#9A7A94', coiffe: 'aucune', habit: '#6E5A72' } }

export const tour: Scene = {
  id: 'tour',
  nom: 'La Tour de l’Horloge',
  lieu: 'tour',
  objectif: 'Comprendre pourquoi le temps s’est arrêté',
  decor: '/assets/decors/tour.png',
  largeur: 768,
  hauteur: 1376,
  arrivee: { x: 320, y: 1280 },
  ambiance: 'La grande horloge s’est arrêtée à minuit pile, la nuit de la pleine lune. Toute la ville est déréglée. Ta plus grande affaire.',
  zone: {
    yHaut: 1185, yBas: 1340, demiLargeurHaut: 300, demiLargeurBas: 358,
    centreX: 384, echelleLoin: 0.62, echelleProche: 1.05,
  },
  obstacles: [{ x: 20, y: 1040, w: 175, h: 160 }],
  brume: [{ x: 384, y: 1180, rx: 240, ry: 24, opacite: 0.14, duree: 23 }],
  hotspots: [
    {
      id: 'to-griffe', libelle: 'Griffe et l’horloge', sorte: 'pnj',
      at: { x: 400, y: 640 }, station: { x: 400, y: 1230 }, voix: 'griffe',
      dialogue: [
        "Toute la ville compte sur toi, chaton. Moi aussi. Ne te presse pas : observe.",
        "L'horloge s'est arrêtée à minuit pile. Plus de sonneries, toute la ville déréglée. On parle de fantôme dans la tour. Sept habitants la fréquentent. À toi de jouer.",
      ],
      indice: { titre: 'Minuit pile', texte: "La grande horloge s'est arrêtée à minuit pile, la nuit de la pleine lune. Sept habitants fréquentent la tour." },
    },
    {
      id: 'to-obs', libelle: 'La salle des rouages', sorte: 'jeu',
      at: { x: 400, y: 700 }, station: { x: 400, y: 1225 }, voix: 'detective',
      dialogue: ["Tout est figé à minuit. Regardons qui faisait quoi cette nuit-là."],
      jeu: {
        type: 'observation',
        consigne: 'Observe la tour. Quatre questions vont suivre.',
        duree: 15, cadre: { x: 40, y: 120, w: 690, h: 900 },
        questions: [
          { question: 'Sur quelle heure l’horloge s’est-elle arrêtée ?', reponses: ['21 h', '22 h', 'Minuit pile', '3 h'], bonne: 2 },
          { question: 'Que faisait Hector le hibou ?', reponses: ['Il dormait', 'Des allers-retours vers le sommet', 'Il chassait', 'Il chantait'], bonne: 1 },
          { question: 'Qu’y avait-il sur l’escalier ?', reponses: ['De la farine', 'Des plumes et des brindilles', 'Des feuilles', 'De la cire'], bonne: 1 },
          { question: 'Qui dormait dans la gouttière ?', reponses: ['Perdrix', 'Hector', 'Minuit', 'Luciole'], bonne: 0 },
        ],
      },
      indice: { titre: 'Plumes et allers-retours', texte: "Hector le hibou faisait des allers-retours vers le sommet. Des plumes et des brindilles jonchaient l'escalier. Perdrix, elle, dormait dans la gouttière." },
    },
    {
      id: 'to-note', libelle: 'Le message gratté', sorte: 'jeu',
      at: { x: 250, y: 900 }, station: { x: 260, y: 1220 }, voix: 'pistache',
      dialogue: ["Sur la porte de la tour, un message gratté maladroitement, les mots mélangés."],
      jeu: {
        type: 'message',
        consigne: 'Trois mots à remettre en ordre.',
        gabarit: 'Pardon pour le {0} : mes {1} dorment au chaud dans les {2}.',
        mots: [
          { mot: 'SILENCE', indice: 'Quand on n’entend plus rien du tout… chuuut 🤫' },
          { mot: 'PETITS', indice: 'Les bébés d’une maman 🐣' },
          { mot: 'ROUAGES', indice: 'Les roues dentées à l’intérieur d’une machine ⚙️' },
        ],
      },
      indice: { titre: 'Le message de la porte', texte: "« Pardon pour le SILENCE : mes PETITS dorment au chaud dans les ROUAGES. » Quelqu'un s'est installé dans le mécanisme." },
    },
    {
      id: 'to-sonneries', libelle: 'Les sonneries perdues', sorte: 'jeu',
      at: { x: 560, y: 700 }, station: { x: 520, y: 1220 }, voix: 'detective',
      dialogue: ["Depuis minuit, l'horloge se tait. Combien de sonneries manquées jusqu'à ce soir ?"],
      jeu: {
        type: 'calcul',
        consigne: 'Compte les sonneries manquées.',
        enonce: 'L’horloge sonne à chaque heure pile. Elle s’est tue cette nuit à minuit. Aujourd’hui à 18 h, combien de sonneries ont été manquées depuis minuit ?',
        reponses: ['12', '17', '18', '24'], bonne: 2,
        revelation: 'Le mécanisme s’est arrêté en pleine nuit, tout en douceur : quelque chose de léger s’y est installé pendant que la ville dormait…',
      },
      indice: { titre: 'Dix-huit sonneries perdues', texte: "18 sonneries manquées depuis minuit. Le mécanisme s'est arrêté en douceur : quelque chose de léger s'y est installé." },
    },
    {
      id: 'to-nid', libelle: 'Le nid mystérieux', sorte: 'jeu',
      at: { x: 560, y: 1160 }, station: { x: 540, y: 1220 }, voix: 'detective',
      dialogue: ["Dans les rouages, un nid ! Pesons ce qu'il contient."],
      jeu: {
        type: 'calcul',
        consigne: 'Calcule le poids des plumes.',
        enonce: 'Dans les rouages, un nid de 300 g. Il contient 20 brindilles de 10 g chacune ; le reste, ce sont des plumes. Combien pèsent les plumes ?',
        reponses: ['80 g', '100 g', '120 g', '200 g'], bonne: 1,
        revelation: 'Des brindilles et des plumes : l’habitant du nid a des ailes ! Aucun chat n’a de plumes… Il ne reste que deux suspects. Qui vivait la nuit ?',
      },
      indice: { titre: 'Un nid de plumes', texte: "100 g de plumes dans le nid : l'habitant a des ailes. Aucun chat n'a de plumes — restent les deux oiseaux, Hector et Perdrix." },
    },
    {
      id: 'to-perdrix', libelle: 'Interroger Perdrix', sorte: 'temoin',
      at: { x: 150, y: 1050 }, station: { x: 210, y: 1215 },
      interrogatoire: {
        suspect: PERDRIX,
        intro: ['Oh, un détective ! Un vrai ! Je bavarde, je bavarde, mais je n’ai RIEN fait, moi, hein !'],
        questions: [
          { question: 'Où dormiez-vous cette nuit ?', options: [
            { texte: 'Dans la gouttière ?', reponse: 'Dans ma gouttière, pardi, roulée en boule ! Je déteste le noir de la tour. Je n’y mets jamais les plumes la nuit.' },
            { texte: 'Dans les rouages ?', reponse: 'Dans les rouages ?! Avec toute cette graisse ? Jamais de la vie, ça salit les plumes !' },
          ] },
          { question: 'Qui monte au sommet, la nuit ?', options: [
            { texte: 'Vous savez ?', reponse: 'Hector, le hibou. Toute la nuit il monte et descend. Un vrai manège. Moi je dors, je vous dis !' },
          ] },
        ],
        temoignage: "Perdrix dormait dans sa gouttière, loin de la tour. Elle accuse Hector de monter et descendre toute la nuit.",
      },
    },
    {
      id: 'to-cassetete', libelle: 'La devinette des jumeaux', sorte: 'cassetete',
      at: { x: 660, y: 1150 }, station: { x: 600, y: 1215 }, voix: 'narrateur', recompense: 3,
      personnage: TIC.portrait,
      dialogue: [
        'Tic et Tac lèvent le nez de leurs rouages, parfaitement synchronisés : « Une devinette d’horloger, détective. Si tu la trouves, les croquettes sont pour toi. »',
      ],
      jeu: {
        type: 'devinette',
        consigne: 'Les jumeaux horlogers te posent leur devinette favorite.',
        enonce: 'Je tourne sans fin, j’ai deux aiguilles mais je ne couds jamais, et je dis toujours l’heure sans jamais parler. Qui suis-je ?',
        reponses: ['Une horloge', 'Une boussole', 'Une aiguille de sapin', 'Un moulin'],
        bonne: 0,
      },
    },
    // --- Étincelles cachées ---
    { id: 'to-etincelle-1', libelle: 'un reflet sur un rouage', sorte: 'etincelle', at: { x: 690, y: 760 }, recompense: 1 },
    { id: 'to-etincelle-2', libelle: 'un éclat sous l’escalier', sorte: 'etincelle', at: { x: 110, y: 1230 }, recompense: 1 },
    { id: 'to-etincelle-3', libelle: 'une lueur près de la cloche', sorte: 'etincelle', at: { x: 540, y: 120 }, recompense: 2 },
    {
      id: 'to-deduction', libelle: 'Accuser un suspect', sorte: 'deduction',
      at: { x: 400, y: 1090 }, station: { x: 400, y: 1220 }, voix: 'pistache',
      requiert: ['to-obs', 'to-note', 'to-sonneries', 'to-nid'],
      dialogue: ['Des plumes, des ailes, des allers-retours nocturnes… Qui accuses-tu, détective ?'],
      jeu: {
        type: 'deduction',
        consigne: 'Le nid est fait de plumes : l’habitant a des ailes. Aucun chat. Des deux oiseaux, qui vivait la nuit ?',
        suspects: [TIC, TAC, HECTOR, PERDRIX, MINUIT, CARILLON, LUCIOLE],
        ecartes: [0, 1, 4, 5, 6],
        coupable: 2,
        aide: 'Des plumes, des allers-retours vers le sommet en pleine nuit… Qui vole la nuit : la pie ou le hibou ?',
        denouement: [
          "Hector avoue de sa grosse voix : ses petits venaient d'éclore, et le sommet de la tour était le seul endroit au chaud. Ses allers-retours nocturnes, c'était pour les nourrir !",
          "Toute la ville construit un magnifique nichoir juste à côté du cadran, l'horloge repart dans un grand carillon…",
          "Et devant tout Chaville réuni, le commissaire Griffe te remet la MÉDAILLE D'OR de l'Académie : « Pas mal, chaton. Pas mal du tout. »",
        ],
      },
    },
    {
      id: 'to-sortie', libelle: 'Retour à la carte', sorte: 'sortie',
      at: { x: 60, y: 1310 }, station: { x: 110, y: 1300 }, vers: 'hub', discret: true,
    },
  ],
}
