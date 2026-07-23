import type { Scene, Suspect } from '../types'
import { PORTRAITS } from '../art'

/**
 * Le Marché de Chaville — « L'affaire des croquettes volées » (enquête v2 n°0).
 * Première enquête : coupable Moustache. C'est elle qui déclenche la première
 * carte de visite du Fantôme Gris.
 */
const MOUSTACHE: Suspect = { id: 'moustache', nom: 'Moustache', role: 'Gros chat gris, casquette', portrait: PORTRAITS.moustache! }
const CARAMEL: Suspect = { id: 'caramel', nom: 'Caramel', role: 'Gros chat roux, écharpe', portrait: { espece: 'chat', fourrure: '#C97B4A', ventre: '#F2EDE0', accent: '#A85A2E', coiffe: 'aucune', habit: '#C4574E' } }
const PERLE: Suspect = { id: 'perle', nom: 'Perle', role: 'Petite chatte blanche', portrait: { espece: 'chat', fourrure: '#E7E2D6', ventre: '#F7F3EA', accent: '#C9B79C', coiffe: 'noeud', habit: '#9AA0B8' } }
const REGLISSE: Suspect = { id: 'reglisse', nom: 'Réglisse', role: 'Chat noir tout mince', portrait: { espece: 'chat', fourrure: '#3F4A63', ventre: '#9098AE', accent: '#5A6488', coiffe: 'noeud', habit: '#2F2A45' } }
const TIGROU: Suspect = { id: 'tigrou', nom: 'Tigrou', role: 'Petit chat tigré, lunettes', portrait: { espece: 'chat', fourrure: '#C9A25C', ventre: '#F2EDE0', accent: '#9A7A3E', coiffe: 'monocle', habit: '#5A5370' } }

export const grandPlace: Scene = {
  id: 'grand-place',
  nom: 'Le Marché',
  lieu: 'place',
  objectif: 'Retrouver les croquettes de Madame Sardine',
  decor: '/assets/decors/place.png',
  largeur: 768,
  hauteur: 1376,
  arrivee: { x: 300, y: 1250 },
  ambiance: 'Cette nuit, un sac entier de croquettes de luxe a disparu du stand de Madame Sardine.',
  zone: {
    yHaut: 1085, yBas: 1345, demiLargeurHaut: 300, demiLargeurBas: 372,
    centreX: 384, echelleLoin: 0.62, echelleProche: 1.15,
  },
  obstacles: [{ x: 360, y: 1080, w: 190, h: 70 }],
  brume: [
    { x: 250, y: 1075, rx: 270, ry: 34, opacite: 0.22, duree: 17 },
    { x: 540, y: 1120, rx: 230, ry: 26, opacite: 0.16, duree: 23 },
  ],
  hotspots: [
    {
      id: 'gp-griffe', libelle: 'Le commissaire Griffe', sorte: 'pnj',
      at: { x: 676, y: 828 }, station: { x: 620, y: 1130 }, voix: 'griffe',
      astuce: 'Le commissaire attend là-bas, sous la fenêtre éclairée.',
      dialogue: [
        'Une affaire simple pour commencer, chaton. Ouvre l’œil, et le bon.',
        'Cette nuit, quelqu’un a dévalisé le stand de Madame Sardine : un sac entier de croquettes de luxe a disparu. Cinq chats se trouvaient au marché hier soir…',
        'Observe la scène, lis ce qui traîne, compte — puis tu accuseras.',
      ],
      indice: {
        titre: 'Les croquettes volées',
        texte: 'Un sac de croquettes de luxe a disparu du stand de Madame Sardine cette nuit. Cinq chats étaient au marché : Moustache, Caramel, Perle, Réglisse et Tigrou.',
      },
    },
    {
      id: 'gp-obs', libelle: 'Le stand de Madame Sardine', sorte: 'jeu',
      at: { x: 468, y: 1058 }, station: { x: 500, y: 1180 }, voix: 'detective',
      astuce: 'Et si on regardait le stand de plus près ?',
      dialogue: ['Tout le marché est encore en place. Regardons qui faisait quoi hier soir.'],
      jeu: {
        type: 'observation',
        consigne: 'Observe le marché. Trois questions vont suivre.',
        duree: 25, cadre: { x: 330, y: 860, w: 330, h: 320 },
        questions: [
          { question: 'Que faisait Moustache près du stand ?', reponses: ['Il buvait un lait', 'Il reniflait les croquettes', 'Il lisait le journal', 'Il dormait'], bonne: 1 },
          { question: 'Qui lisait le journal ?', reponses: ['Perle', 'Caramel', 'Tigrou', 'Réglisse'], bonne: 2 },
          { question: 'Quelle heure indiquait l’horloge ?', reponses: ['18 h', '19 h', '20 h', '21 h'], bonne: 1 },
        ],
      },
      indice: {
        titre: 'Chacun à sa place',
        texte: 'Moustache reniflait les croquettes, Tigrou lisait le journal, et l’horloge indiquait 19 h.',
      },
    },
    {
      id: 'gp-papier', libelle: 'Un papier déchiré', sorte: 'jeu',
      at: { x: 118, y: 900 }, station: { x: 150, y: 1140 }, voix: 'pistache',
      astuce: 'Il y a un bout de papier près du stand — va voir !',
      dialogue: ['Près du stand, tu trouves un bout de papier déchiré…'],
      jeu: {
        type: 'message',
        consigne: 'Deux mots à remettre en ordre.',
        gabarit: 'Rendez-vous à {0} près de la {1} pour partager le festin.',
        mots: [
          { mot: 'MINUIT', indice: 'L’heure où les deux aiguilles sont tout en haut… 🕛' },
          { mot: 'FONTAINE', indice: 'On y boit de l’eau, sur la place du village ⛲' },
        ],
      },
      indice: {
        titre: 'Le mot du festin',
        texte: '« Rendez-vous à MINUIT près de la FONTAINE pour partager le festin. » Le voleur voulait partager, pas revendre.',
      },
    },
    {
      id: 'gp-empreinte', libelle: 'Une empreinte de patte', sorte: 'jeu',
      at: { x: 300, y: 1150 }, station: { x: 300, y: 1210 }, voix: 'detective',
      astuce: 'Cette empreinte devant le stand… elle est bien grande, non ?',
      dialogue: ['Devant le stand, une empreinte de patte. Le vétérinaire va nous aider à la lire.'],
      jeu: {
        type: 'calcul',
        consigne: 'Compte les suspects assez lourds pour cette empreinte.',
        enonce:
          'L’empreinte mesure 6 cm. Seuls les chats de plus de 5 kg laissent des empreintes de plus de 5 cm. Carnet de pesée : Moustache 7 kg, Caramel 6 kg, Perle 3 kg, Réglisse 4 kg, Tigrou 3 kg. Combien de suspects pèsent plus de 5 kg ?',
        reponses: ['1', '2', '3', '4'], bonne: 1,
        revelation: 'L’empreinte est grande : le voleur est un gros chat (plus de 5 kg). Perle, Réglisse et Tigrou sont hors de cause !',
      },
      indice: {
        titre: 'Un gros chat',
        texte: 'Seuls Moustache (7 kg) et Caramel (6 kg) dépassent 5 kg. Perle, Réglisse et Tigrou sont hors de cause.',
      },
    },
    {
      id: 'gp-coffre', libelle: 'Le coffre du témoin', sorte: 'jeu',
      at: { x: 519, y: 288 }, station: { x: 470, y: 1105 }, voix: 'detective',
      astuce: 'Et si on regardait l’horloge, là-haut ?',
      dialogue: ['Le pigeon a tout vu ! Mais il a enfermé son témoignage dans un coffre à code.'],
      jeu: {
        type: 'calcul',
        consigne: 'Trouve le code du coffre.',
        enonce: 'Sur le coffre, il est écrit : Code = (6 × 7) + 10. Quel est le code ?',
        reponses: ['42', '52', '62', '67'], bonne: 1,
        revelation: 'Le témoignage du pigeon : « J’ai vu le voleur de dos… il avait un poil gris et quelque chose sur la tête ! »',
      },
      indice: {
        titre: 'Le témoignage du pigeon',
        texte: 'Code 52. Le pigeon a vu le voleur de dos : un poil gris, et quelque chose sur la tête.',
      },
    },
    {
      id: 'gp-sardine', libelle: 'Interroger Madame Sardine', sorte: 'temoin',
      at: { x: 232, y: 900 }, station: { x: 250, y: 1150 },
      interrogatoire: {
        suspect: { id: 'sardine', nom: 'Madame Sardine', role: 'Poissonnière du marché', portrait: PORTRAITS.sardine! },
        intro: ['Mes croquettes de luxe ! Toute une nuit de travail, envolée. Trouve-moi ça, petit détective !'],
        questions: [
          { question: 'Le sac était-il fermé à clé ?', options: [
            { texte: 'À clé ?', reponse: 'Le coffre du stand, oui ! Une belle serrure. Et pourtant elle était ouverte, sans une éraflure. Va comprendre.' },
            { texte: 'Qui avait la clé ?', reponse: 'Moi seule. Et elle n’a pas quitté ma poche de la nuit, je vous le jure.' },
          ] },
          { question: 'Qui rôdait près du stand ?', options: [
            { texte: 'Vous avez vu quelqu’un ?', reponse: 'Le gros Moustache reniflait mes croquettes toute la soirée. Mais c’est un brave, vous savez… il n’a jamais fait de mal à personne.' },
          ] },
        ],
        temoignage: 'Madame Sardine avait la seule clé du coffre — et la serrure a été ouverte sans une éraflure. Elle défend Moustache, « un brave ».',
      },
    },
    {
      // Le casse-tête est posé par Tigrou, PAS par Madame Sardine : elle tient
      // déjà son stand un peu plus loin (gp-sardine) et se retrouverait en double.
      id: 'gp-cassetete', libelle: 'La devinette du marché', sorte: 'cassetete',
      at: { x: 640, y: 1120 }, station: { x: 600, y: 1190 }, voix: 'narrateur', recompense: 2,
      personnage: TIGROU.portrait,
      dialogue: ['Tigrou relève ses lunettes : « Pendant que tu es là, petit détective… J’ai une devinette qui me trotte dans la tête depuis ce matin. Tu me la résous ? »'],
      jeu: {
        type: 'devinette',
        consigne: 'Tigrou te pose une devinette.',
        enonce: 'Il est à toi, pourtant ce sont les autres qui s’en servent bien plus souvent que toi. Qu’est-ce que c’est ?',
        reponses: ['Ton nom', 'Ton chapeau', 'Ton ombre', 'Ta maison'],
        bonne: 0,
      },
    },
    // --- Étincelles cachées ---
    { id: 'gp-etincelle-1', libelle: 'un reflet sous l’étal', sorte: 'etincelle', at: { x: 404, y: 1128 }, recompense: 1, tuto: true },
    { id: 'gp-etincelle-2', libelle: 'un éclat sur le réverbère', sorte: 'etincelle', at: { x: 726, y: 812 }, recompense: 1 },
    { id: 'gp-etincelle-3', libelle: 'une lueur dans le pavé', sorte: 'etincelle', at: { x: 168, y: 1290 }, recompense: 1 },
    { id: 'gp-etincelle-4', libelle: 'un scintillement au tonneau', sorte: 'etincelle', at: { x: 34, y: 1010 }, recompense: 2 },
    {
      id: 'gp-deduction', libelle: 'Accuser un suspect', sorte: 'deduction',
      at: { x: 384, y: 1240 }, station: { x: 384, y: 1280 }, voix: 'pistache',
      requiert: ['gp-obs', 'gp-papier', 'gp-empreinte', 'gp-coffre'],
      dialogue: ['Un gros chat, au poil gris, avec quelque chose sur la tête… Qui accuses-tu ?'],
      jeu: {
        type: 'deduction',
        consigne: 'Perle, Réglisse et Tigrou sont trop légers. Reste un gros chat gris, avec quelque chose sur la tête.',
        suspects: [MOUSTACHE, CARAMEL, PERLE, REGLISSE, TIGROU],
        ecartes: [2, 3, 4],
        coupable: 0,
        aide: 'Relis les indices : un GROS chat, au poil GRIS, avec quelque chose sur la tête…',
        denouement: [
          'C’était bien Moustache : un gros chat gris de 7 kg, avec sa casquette sur la tête.',
          'Il voulait organiser un festin surprise à minuit près de la fontaine… sans demander la permission !',
          'Il a tout rendu, s’est excusé auprès de Madame Sardine, et l’a invitée au festin.',
        ],
      },
    },
    {
      id: 'gp-vers-port', libelle: 'Descendre au port', sorte: 'sortie',
      at: { x: 52, y: 1215 }, station: { x: 105, y: 1235 }, vers: 'port', voix: 'pistache',
      dialogue: ['La ruelle descend droit au port. Ça sent le varech et le poisson frais. Tu viens ?'],
    },
    {
      id: 'gp-sortie', libelle: 'Retour à la carte', sorte: 'sortie',
      at: { x: 716, y: 1300 }, station: { x: 664, y: 1292 }, vers: 'hub', discret: true,
    },
  ],
}
