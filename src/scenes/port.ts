import type { Scene, Suspect } from '../types'

/**
 * Le Port — « Le chalutier fantôme » (enquête v2 n°2). Coupable : Lontra.
 * Décor de référence de la DA. Le quai est étroit ; les caisses font obstacle.
 */
const BARBE: Suspect = { id: 'barbe', nom: 'Barbe-Grise', role: 'Capitaine, vieux loup de mer', portrait: { espece: 'chat', fourrure: '#8A8F9C', ventre: '#E4E1D8', accent: '#6A7182', coiffe: 'casquette', habit: '#3F4A63', regard: 'severe' } }
const MARINETTE: Suspect = { id: 'marinette', nom: 'Marinette', role: 'Matelote rousse', portrait: { espece: 'chat', fourrure: '#C97B4A', ventre: '#F2EDE0', accent: '#A85A2E', coiffe: 'casquette', habit: '#4A6480' } }
const GASPARD: Suspect = { id: 'gaspard', nom: 'Gaspard', role: 'Gardien du phare', portrait: { espece: 'chat', fourrure: '#A8A39B', ventre: '#F2EDE0', accent: '#7C776E', coiffe: 'aucune', habit: '#5A5370' } }
const PLUME_P: Suspect = { id: 'plumep', nom: 'Plume', role: 'Poissonnière blanche', portrait: { espece: 'chat', fourrure: '#E7E2D6', ventre: '#F7F3EA', accent: '#C9B79C', coiffe: 'foulard-pois', habit: '#59677A' } }
// ⚠️ Planche « coupables » : loutre et non ourson — petites dents pointues
// (corde rongée) et fourrure d'aspect mouillé (traces humides) sont des indices.
const LONTRA: Suspect = { id: 'lontra', nom: 'Lontra', role: 'Loutre joueuse de passage', portrait: { espece: 'chat', fourrure: '#7A5A44', ventre: '#D9C3A5', accent: '#A88960', habit: '#6E4E38', accessoire: 'poisson', planche: 'lontra', taille: 0.94, largeur: 1.08 } }
const RITON: Suspect = { id: 'riton', nom: 'Riton', role: 'Rat des quais, solitaire', portrait: { espece: 'souris', fourrure: '#9A9384', ventre: '#E4E1D8', accent: '#C9A0A8', coiffe: 'aucune', habit: '#6B5A44' } }

export const port: Scene = {
  id: 'port',
  nom: 'Le Port',
  lieu: 'port',
  objectif: 'Démasquer le chalutier fantôme',
  decor: '/assets/decors/port.png',
  largeur: 768,
  hauteur: 1376,
  arrivee: { x: 180, y: 1300 },
  ambiance: 'Chaque nuit, des caisses de sardines disparaissent. Et les pêcheurs jurent avoir vu un chalutier sans équipage glisser dans la brume…',
  zone: {
    yHaut: 1218, yBas: 1352, demiLargeurHaut: 250, demiLargeurBas: 288,
    centreX: 282, echelleLoin: 0.9, echelleProche: 1.2,
  },
  obstacles: [{ x: 560, y: 1230, w: 180, h: 90 }],
  brume: [
    { x: 230, y: 1150, rx: 250, ry: 30, opacite: 0.2, duree: 19 },
    { x: 430, y: 1195, rx: 200, ry: 22, opacite: 0.15, duree: 26 },
  ],
  hotspots: [
    {
      id: 'po-griffe', libelle: 'Le commissaire Griffe', sorte: 'pnj',
      at: { x: 300, y: 1150 }, station: { x: 300, y: 1250 }, voix: 'griffe',
      astuce: 'Le commissaire nous attend sur le quai.',
      dialogue: [
        'Un bateau fantôme ? Balivernes. Trouve-moi la vraie explication, chaton.',
        'Chaque nuit, des caisses de sardines disparaissent des quais. Six habitués traînent par ici. Observe, décode, calcule — puis accuse.',
      ],
      indice: {
        titre: 'Le chalutier fantôme',
        texte: 'Des caisses de sardines disparaissent chaque nuit. Les pêcheurs parlent d’un chalutier sans équipage. Six suspects fréquentent les quais.',
      },
    },
    {
      id: 'po-obs', libelle: 'Le quai dans la brume', sorte: 'jeu',
      at: { x: 430, y: 1120 }, station: { x: 400, y: 1245 }, voix: 'detective',
      astuce: 'Regardons le quai avant que la brume ne remonte.',
      dialogue: ['Le quai garde la mémoire de la nuit. Observons vite, avant la marée.'],
      jeu: {
        type: 'observation',
        consigne: 'Observe le quai. Quatre questions vont suivre.',
        duree: 22, cadre: { x: 40, y: 900, w: 690, h: 420 },
        questions: [
          { question: 'Que faisait Lontra sur le quai ?', reponses: ['Elle dormait', 'Des glissades sur la rampe', 'Elle pêchait', 'Elle chargeait des caisses'], bonne: 1 },
          { question: 'Combien de caisses de sardines étaient empilées ?', reponses: ['5', '6', '7', '8'], bonne: 2 },
          { question: 'Qui allumait le phare ?', reponses: ['Barbe-Grise', 'Marinette', 'Gaspard', 'Plume'], bonne: 2 },
          { question: 'Que réparait le capitaine Barbe-Grise ?', reponses: ['Une voile', 'Un filet', 'Une ancre', 'Un tonneau'], bonne: 1 },
        ],
      },
      indice: {
        titre: 'La nuit sur les quais',
        texte: 'Lontra faisait des glissades sur la rampe, 7 caisses étaient empilées, Gaspard allumait le phare et Barbe-Grise réparait un filet.',
      },
    },
    {
      id: 'po-bouteille', libelle: 'Une bouteille à la mer', sorte: 'jeu',
      at: { x: 130, y: 1178 }, station: { x: 150, y: 1268 }, voix: 'pistache',
      astuce: 'Une bouteille flotte près du quai — il y a un papier dedans !',
      dialogue: ['Une bouteille flotte près du quai. Dedans, un message aux mots mélangés…'],
      jeu: {
        type: 'message',
        consigne: 'Deux mots à remettre en ordre.',
        gabarit: 'Les caisses glissent avec le {0} jusqu’aux {1} du vieux phare.',
        mots: [
          { mot: 'COURANT', indice: 'C’est l’eau qui pousse tout sur son passage 🌊' },
          { mot: 'ROCHERS', indice: 'Les gros cailloux au pied du phare 🪨' },
        ],
      },
      indice: {
        titre: 'Le message de la bouteille',
        texte: '« Les caisses glissent avec le COURANT jusqu’aux ROCHERS du vieux phare. » Personne ne les porte : elles dérivent.',
      },
    },
    {
      id: 'po-registre', libelle: 'Le registre du port', sorte: 'jeu',
      at: { x: 648, y: 1188 }, station: { x: 500, y: 1262 }, voix: 'detective',
      astuce: 'Le registre du port note tout — allons compter les caisses.',
      dialogue: ['Le registre du port note chaque disparition. Cherchons la règle.'],
      jeu: {
        type: 'calcul',
        consigne: 'Continue la suite du registre.',
        enonce:
          'Le registre du port : lundi 2 caisses disparues, mardi 4, mercredi 6, jeudi 8… Si cela continue, combien de caisses disparaîtront vendredi ?',
        reponses: ['9', '10', '12', '14'], bonne: 1,
        revelation: 'Chaque nuit il en disparaît davantage : le voleur nourrit une famille qui s’agrandit. Et des traces toutes mouillées mènent du quai jusqu’à la mer !',
      },
      indice: {
        titre: 'Une famille qui s’agrandit',
        texte: 'La suite monte de 2 en 2 : 10 caisses vendredi. Le voleur nourrit une famille qui s’agrandit, et laisse des traces mouillées vers la mer.',
      },
    },
    {
      id: 'po-corde', libelle: 'L’amarre rongée', sorte: 'jeu',
      at: { x: 632, y: 604 }, station: { x: 440, y: 1240 }, voix: 'detective',
      astuce: 'L’amarre du chalutier est en morceaux — mesurons-la.',
      dialogue: ['L’amarre du chalutier n’a pas été coupée au couteau. Regarde ces marques…'],
      jeu: {
        type: 'calcul',
        consigne: 'Calcule la longueur de corde manquante.',
        enonce: 'L’amarre du chalutier mesurait 12 m. On n’en retrouve que 3 morceaux de 3 m chacun. Combien de mètres de corde ont disparu ?',
        reponses: ['1 m', '3 m', '6 m', '9 m'], bonne: 1,
        revelation: 'La corde a été rongée par de petites dents pointues. Aucun chat ne laisse des marques pareilles !',
      },
      indice: {
        titre: 'De petites dents pointues',
        texte: '12 − (3 × 3) = 3 m manquants. La corde a été rongée par de petites dents pointues : aucun chat ne laisse ces marques.',
      },
    },
    {
      id: 'po-gaspard', libelle: 'Interroger Gaspard', sorte: 'temoin',
      at: { x: 640, y: 700 }, station: { x: 470, y: 1250 },
      interrogatoire: {
        suspect: GASPARD,
        intro: ['Du haut de mon phare, je vois tout. Enfin… presque tout. Cette brume, quelle plaie.'],
        questions: [
          { question: 'Avez-vous vu le bateau fantôme ?', options: [
            { texte: 'Vraiment un fantôme ?', reponse: 'J’ai vu le chalutier glisser tout seul, oui. Mais un fantôme qui ronge les cordes ? Permettez-moi d’en douter.' },
            { texte: 'Dans quel sens glissait-il ?', reponse: 'Vers les rochers, toujours vers les rochers. Comme s’il suivait le courant… ce qu’il faisait, sans doute.' },
          ] },
          { question: 'Qui traîne sur les quais la nuit ?', options: [
            { texte: 'Des habitués ?', reponse: 'Riton le rat, tout seul comme toujours. Et cette loutre joueuse, Lontra — elle et sa famille font des glissades jusqu’à l’eau.' },
          ] },
        ],
        temoignage: 'Gaspard a vu le chalutier dériver vers les rochers, porté par le courant. Il cite Riton, solitaire, et Lontra qui glisse jusqu’à l’eau avec sa famille.',
      },
    },
    {
      id: 'po-cassetete', libelle: 'Le taquin du capitaine', sorte: 'cassetete',
      at: { x: 200, y: 1050 }, station: { x: 220, y: 1255 }, voix: 'narrateur', recompense: 3,
      personnage: BARBE.portrait,
      dialogue: [
        'Barbe-Grise te tend une plaque de bois découpée en morceaux : « Un vieux jeu de bord, moussaillon. Remets l’image d’aplomb et je te paie en croquettes. »',
      ],
      jeu: {
        type: 'taquin',
        consigne: 'Fais glisser les morceaux pour reconstituer l’image du port.',
        cadre: { x: 384, y: 900, w: 384, h: 384 },
      },
    },
    // --- Étincelles cachées ---
    { id: 'po-etincelle-1', libelle: 'un reflet sur la bitte', sorte: 'etincelle', at: { x: 96, y: 1240 }, recompense: 1 },
    { id: 'po-etincelle-2', libelle: 'un éclat dans la coque', sorte: 'etincelle', at: { x: 470, y: 1080 }, recompense: 1 },
    { id: 'po-etincelle-3', libelle: 'une lueur au pied du phare', sorte: 'etincelle', at: { x: 690, y: 830 }, recompense: 2 },
    {
      id: 'po-deduction', libelle: 'Accuser un suspect', sorte: 'deduction',
      at: { x: 300, y: 1300 }, station: { x: 300, y: 1320 }, voix: 'pistache',
      requiert: ['po-obs', 'po-bouteille', 'po-registre', 'po-corde'],
      dialogue: ['De petites dents pointues, des traces mouillées, une famille qui s’agrandit… Qui accuses-tu ?'],
      jeu: {
        type: 'deduction',
        consigne: 'Aucun chat ne ronge une amarre. Restent ceux qui ont de petites dents pointues.',
        suspects: [BARBE, MARINETTE, GASPARD, PLUME_P, LONTRA, RITON],
        ecartes: [0, 1, 2, 3],
        coupable: 4,
        aide: 'De petites dents pointues, des traces mouillées, une famille qui adore nager et les sardines…',
        denouement: [
          'Pas de fantôme : Lontra et sa famille de loutres, affamées, rongeaient les amarres — et le courant poussait doucement le chalutier vers les rochers, où elles récupéraient les caisses.',
          'Dans la brume, on aurait juré un bateau fantôme !',
          'Les pêcheurs, soulagés, déposent maintenant chaque soir un panier de sardines pour les loutres.',
        ],
      },
    },
    {
      id: 'po-vers-place', libelle: 'Remonter en ville', sorte: 'sortie',
      at: { x: 508, y: 1232 }, station: { x: 470, y: 1280 }, vers: 'grand-place', voix: 'pistache',
      dialogue: ['La rampe remonte vers le marché. On retourne voir le commissaire ?'],
    },
    {
      id: 'po-sortie', libelle: 'Retour à la carte', sorte: 'sortie',
      at: { x: 60, y: 1330 }, station: { x: 110, y: 1322 }, vers: 'hub', discret: true,
    },
  ],
}
