import type { Scene, Suspect } from '../types'
import { PORTRAITS } from '../art'

const ARCHIBALD: Suspect = { id: 'archibald', nom: 'Archibald', role: 'Vieux savant au monocle', portrait: { espece: 'chat', fourrure: '#9AA0A8', ventre: '#E8E4DA', accent: '#7C828C', coiffe: 'monocle', habit: '#5A5370', regard: 'severe' } }
const GRIOTTE: Suspect = { id: 'griotte', nom: 'Griotte', role: 'Grande poétesse au béret', portrait: { espece: 'chat', fourrure: '#B98A96', ventre: '#F2EDE0', accent: '#8A5A66', coiffe: 'beret', habit: '#7A4E86' } }
const BASILE: Suspect = { id: 'basile', nom: 'Basile', role: 'Relieur costaud', portrait: { espece: 'chat', fourrure: '#9A8A6C', ventre: '#EDE4CE', accent: '#6B4A36', coiffe: 'casquette', habit: '#6B4A36' } }
const COLETTE: Suspect = { id: 'colette', nom: 'Colette', role: 'Conteuse au châle', portrait: { espece: 'chat', fourrure: '#C7A98C', ventre: '#F2EDE0', accent: '#9A5B5B', coiffe: 'foulard-pois', habit: '#9A5B5B' } }
const MALO: Suspect = { id: 'malo', nom: 'Malo', role: 'Chaton apprenti, timide', portrait: { espece: 'chat', fourrure: '#A9B0C0', ventre: '#F2EDE0', accent: '#E9AFBB', coiffe: 'aucune', habit: '#6E7488' } }
const NOISETTE: Suspect = { id: 'noisette', nom: 'Noisette', role: 'Écureuil curieux', portrait: { espece: 'ecureuil', fourrure: '#B5713C', ventre: '#EAD7B4', accent: '#E0C9A0', coiffe: 'aucune', habit: '#7C5A44' } }
const SAPHIR: Suspect = { id: 'saphir', nom: 'Saphir', role: 'Grand chat qui dort au chaud', portrait: { espece: 'chat', fourrure: '#3F4A63', ventre: '#9098AE', accent: '#5A6488', coiffe: 'aucune', habit: '#2F2A45', regard: 'endormi' } }

export const bibliotheque: Scene = {
  id: 'bibliotheque',
  nom: 'La Bibliothèque',
  lieu: 'bibliotheque',
  objectif: 'Percer le secret du grimoire aux pages blanches',
  decor: '/assets/decors/bibliotheque.png',
  largeur: 768,
  hauteur: 1376,
  arrivee: { x: 280, y: 1250 },
  ambiance: 'Les mots s’effacent des livres de Mademoiselle Plume. Un grimoire ensorcelé ? La raison dira le contraire.',
  zone: {
    yHaut: 1150, yBas: 1330, demiLargeurHaut: 300, demiLargeurBas: 360,
    centreX: 384, echelleLoin: 0.6, echelleProche: 1.05,
  },
  obstacles: [{ x: 250, y: 1160, w: 300, h: 70 }],
  brume: [{ x: 384, y: 1150, rx: 240, ry: 24, opacite: 0.12, duree: 22 }],
  hotspots: [
    {
      id: 'bi-griffe', libelle: 'Mademoiselle Plume', sorte: 'pnj',
      at: { x: 384, y: 830 }, station: { x: 384, y: 1180 }, voix: 'griffe',
      dialogue: [
        "Des mots qui s'effacent tout seuls ? Il y a forcément un truc, chaton. Trouve-le.",
        "Chaque matin, de nouveaux livres aux pages toutes blanches. Sept habitués fréquentent la salle. Observe, lis, compte — puis accuse.",
      ],
      indice: { titre: 'Les pages blanches', texte: "Chaque nuit, des livres se vident de leurs mots. Sept habitués fréquentent la bibliothèque de Mademoiselle Plume." },
    },
    {
      id: 'bi-plume', libelle: 'Mademoiselle Plume', sorte: 'pnj',
      at: { x: 160, y: 1195 }, station: { x: 215, y: 1220 }, voix: 'narrateur',
      personnage: PORTRAITS.plume!,
      astuce: 'Mademoiselle Plume est près de son bureau — commence par elle.',
      dialogue: [
        'Mademoiselle Plume serre un livre contre elle : « Chaque matin, de nouveaux ouvrages aux pages toutes blanches. Toutes blanches ! »',
        '« On me parle de grimoire ensorcelé. Moi, je crois surtout qu’on me vole mes contes. Aidez-moi, je vous en prie. »',
      ],
    },
    {
      id: 'bi-obs', libelle: 'La salle de lecture', sorte: 'jeu',
      at: { x: 384, y: 900 }, station: { x: 384, y: 1175 }, voix: 'detective',
      dialogue: ["La salle garde la trace de chacun. Regardons bien avant que la bougie ne s'éteigne."],
      jeu: {
        type: 'observation',
        consigne: 'Observe la salle. Quatre questions vont suivre.',
        duree: 20, cadre: { x: 40, y: 560, w: 690, h: 560 },
        questions: [
          { question: 'Que recousait Basile ?', reponses: ['Un rideau', 'Un vieux livre', 'Un coussin', 'Une écharpe'], bonne: 1 },
          { question: 'Sur quoi écrivait Griotte ?', reponses: ['Un carnet rouge', 'Une ardoise', 'Un parchemin', 'Un carnet bleu'], bonne: 0 },
          { question: 'Qu’y avait-il sur la table du fond ?', reponses: ['Des lunettes', 'Une bougie encore tiède', 'Un encrier', 'Une loupe'], bonne: 1 },
          { question: 'Qui dormait sur le radiateur ?', reponses: ['Noisette', 'Malo', 'Saphir', 'Archibald'], bonne: 2 },
        ],
      },
      indice: { titre: 'Une bougie tiède', texte: "Sur la table du fond, une bougie encore tiède : quelqu'un a veillé ici cette nuit. Saphir, lui, dormait sur le radiateur." },
    },
    {
      id: 'bi-note', libelle: 'La note aux mots mêlés', sorte: 'jeu',
      at: { x: 250, y: 860 }, station: { x: 280, y: 1175 }, voix: 'pistache',
      dialogue: ["Glissée dans un livre aux pages blanches, une note aux mots mélangés."],
      jeu: {
        type: 'message',
        consigne: 'Trois mots à remettre en ordre.',
        gabarit: 'J’emprunte chaque {0} pour préparer une {1} à la fête du {2}.',
        mots: [
          { mot: 'HISTOIRE', indice: 'On la raconte le soir, elle commence par « Il était une fois » 📖' },
          { mot: 'SURPRISE', indice: 'On la cache jusqu’au dernier moment 🎁' },
          { mot: 'PRINTEMPS', indice: 'La saison des fleurs, juste après l’hiver 🌸' },
        ],
      },
      indice: { titre: 'La note dans le livre', texte: "« J'emprunte chaque HISTOIRE pour préparer une SURPRISE à la fête du PRINTEMPS. » Personne n'efface les mots : on emprunte des contes." },
    },
    {
      id: 'bi-bougie', libelle: 'La cire de bougie', sorte: 'jeu',
      at: { x: 384, y: 840 }, station: { x: 420, y: 1170 }, voix: 'detective',
      dialogue: ["La bougie a fondu cette nuit. Sa hauteur nous dira combien de temps quelqu'un a lu ici."],
      jeu: {
        type: 'calcul',
        consigne: 'Calcule combien d’heures la bougie a brûlé.',
        enonce: 'La bougie brûle 2 cm par heure. Elle mesurait 12 cm, il n’en reste que 4 cm. Combien d’heures a-t-elle brûlé cette nuit ?',
        reponses: ['2 heures', '3 heures', '4 heures', '8 heures'], bonne: 2,
        revelation: 'Quelqu’un a lu ici 4 heures en pleine nuit. Or Archibald jouait du violon et Colette contait des histoires au concert du village : ils ont un alibi !',
      },
      indice: { titre: 'Quatre heures de veille', texte: "La bougie a brûlé 4 heures cette nuit. Archibald et Colette étaient au concert du village : ils ont un alibi." },
    },
    {
      id: 'bi-echelle', libelle: 'L’échelle du rayon', sorte: 'jeu',
      at: { x: 630, y: 780 }, station: { x: 560, y: 1170 }, voix: 'detective',
      dialogue: ["Des traces de pattes sur les barreaux. Jusqu'où montait le lecteur mystère ?"],
      jeu: {
        type: 'calcul',
        consigne: 'Trouve le barreau le plus haut atteint.',
        enonce: 'L’échelle compte 15 barreaux. D’après les traces, le lecteur ne monte jamais plus haut que le barreau 15 − 8. Quel barreau ?',
        reponses: ['5', '6', '7', '8'], bonne: 2,
        revelation: 'Le barreau 7, c’est tout en bas : notre lecteur a de toutes petites pattes… tachées d’encre ! Griotte, Basile et Saphir sont bien trop grands.',
      },
      indice: { titre: 'De petites pattes', texte: "Le lecteur mystère ne monte pas au-delà du barreau 7 : de toutes petites pattes tachées d'encre. Griotte, Basile et Saphir sont trop grands." },
    },
    {
      id: 'bi-archibald', libelle: 'Interroger Archibald', sorte: 'temoin',
      at: { x: 120, y: 860 }, station: { x: 150, y: 1175 },
      interrogatoire: {
        suspect: ARCHIBALD,
        intro: ['Un grimoire ensorcelé ? Balivernes, jeune détective. La science déteste les fantômes.'],
        questions: [
          { question: 'Où étiez-vous cette nuit ?', options: [
            { texte: 'Au concert du village', reponse: 'Au concert, mon violon à la patte. Colette y contait des histoires ; nous y étions tous deux jusqu’à l’aube.' },
            { texte: 'Ici, à lire', reponse: 'À mon âge, lire quatre heures dans le froid ? Certainement pas. J’étais au concert !' },
          ] },
          { question: 'Qui a de petites pattes, ici ?', options: [
            { texte: 'Réfléchissez…', reponse: 'Les petites pattes ? Le jeune Malo, sans doute. Il apprend tout juste à écrire — ses doigts sont toujours pleins d’encre.' },
          ] },
        ],
        temoignage: "Archibald était au concert avec Colette toute la nuit. Il glisse que Malo a de petites pattes tachées d'encre.",
      },
    },
    {
      id: 'bi-cassetete', libelle: 'Le livre à l’envers', sorte: 'cassetete',
      at: { x: 660, y: 1120 }, station: { x: 600, y: 1190 }, voix: 'narrateur', recompense: 3,
      personnage: GRIOTTE.portrait,
      dialogue: [
        'Griotte relève son béret : « Un poète s’amuse, détective. J’ai recopié une phrase à l’envers, comme Léonard. Sauras-tu la lire ? »',
      ],
      jeu: {
        type: 'miroir',
        consigne: 'Griotte écrit ses brouillons en miroir. Déchiffre-la.',
        texteMiroir: 'LE SILENCE EST UNE PAGE BLANCHE',
        question: 'Que dit la phrase de Griotte ?',
        reponses: [
          'Le silence est une page blanche',
          'Le silence est une page noire',
          'Le livre est une page blanche',
          'Le silence est un long chemin',
        ],
        bonne: 0,
      },
    },
    // --- Étincelles cachées ---
    { id: 'bi-etincelle-1', libelle: 'un reflet sur le globe', sorte: 'etincelle', at: { x: 520, y: 1035 }, recompense: 1 },
    { id: 'bi-etincelle-2', libelle: 'un éclat dans le poêle', sorte: 'etincelle', at: { x: 118, y: 905 }, recompense: 1 },
    { id: 'bi-etincelle-3', libelle: 'une lueur sur l’échelle', sorte: 'etincelle', at: { x: 690, y: 620 }, recompense: 2 },
    {
      id: 'bi-deduction', libelle: 'Accuser un suspect', sorte: 'deduction',
      at: { x: 384, y: 1080 }, station: { x: 384, y: 1170 }, voix: 'pistache',
      requiert: ['bi-obs', 'bi-note', 'bi-bougie', 'bi-echelle'],
      dialogue: ['Alibis, petites pattes, contes empruntés… Qui accuses-tu, détective ?'],
      jeu: {
        type: 'deduction',
        consigne: 'Archibald et Colette avaient un alibi. Griotte, Basile et Saphir sont trop grands. Qui reste-t-il ?',
        suspects: [ARCHIBALD, GRIOTTE, BASILE, COLETTE, MALO, NOISETTE, SAPHIR],
        ecartes: [0, 1, 2, 3, 6],
        coupable: 4,
        aide: 'De toutes petites pattes, des taches d’encre… qui apprend à écrire, ici ?',
        denouement: [
          "Malo avoue en rougissant : chaque nuit, il emportait les recueils de contes et laissait ses cahiers vierges à la place — voilà les « pages blanches » !",
          "Il recopiait les plus belles histoires à la bougie pour préparer un spectacle surprise à la fête du printemps.",
          "Mademoiselle Plume, émue, lui offre une vraie carte de bibliothèque… et le rôle de conteur au spectacle.",
        ],
      },
    },
    {
      id: 'bi-sortie', libelle: 'Retour à la carte', sorte: 'sortie',
      at: { x: 60, y: 1300 }, station: { x: 110, y: 1290 }, vers: 'hub', discret: true,
    },
  ],
}
