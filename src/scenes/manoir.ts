import type { Scene, Suspect } from '../types'

// Suspects du bal (portés depuis academie.html, enquête « Le collier de la Duchesse »).
const LEO: Suspect = { id: 'leo', nom: 'Léo', role: 'Majordome siamois', portrait: { espece: 'chat', fourrure: '#D8CDBA', ventre: '#F2EDE0', accent: '#6E5A4A', coiffe: 'noeud', habit: '#2B2740' } }
const ZOE: Suspect = { id: 'zoe', nom: 'Zoé', role: 'Danseuse tricolore', portrait: { espece: 'chat', fourrure: '#E8A87C', ventre: '#F2EDE0', accent: '#C4574E', coiffe: 'noeud', habit: '#C77DA0' } }
const BARNABE: Suspect = { id: 'barnabe', nom: 'Barnabé', role: 'Cuisinier persan', portrait: { espece: 'chat', fourrure: '#E7E2D6', ventre: '#F7F3EA', accent: '#C9B79C', coiffe: 'chef', habit: '#EDE6D6' } }
const FILOU: Suspect = { id: 'filou', nom: 'Filou', role: 'Magicien roux', portrait: { espece: 'chat', fourrure: '#C97B4A', ventre: '#F2EDE0', accent: '#A85A2E', coiffe: 'haut-de-forme', habit: '#33304A' } }
const LUNA: Suspect = { id: 'luna', nom: 'Luna', role: 'Pianiste noire', portrait: { espece: 'chat', fourrure: '#4E4A5E', ventre: '#B7B2C4', accent: '#6A6478', coiffe: 'noeud', habit: '#2F2A45' } }

export const manoir: Scene = {
  id: 'manoir',
  nom: 'Le Manoir',
  lieu: 'manoir',
  objectif: 'Retrouver le collier de la Duchesse',
  decor: '/assets/decors/manoir.png',
  largeur: 768,
  hauteur: 1376,
  arrivee: { x: 300, y: 1250 },
  ambiance: 'Grand bal au manoir. À 21 h 30, le collier de la Duchesse a disparu — et déjà on parle de fantôme.',
  zone: {
    yHaut: 1150, yBas: 1330, demiLargeurHaut: 300, demiLargeurBas: 366,
    centreX: 384, echelleLoin: 0.6, echelleProche: 1.05,
  },
  obstacles: [{ x: 40, y: 1160, w: 250, h: 90 }],
  brume: [{ x: 300, y: 1150, rx: 250, ry: 26, opacite: 0.14, duree: 21 }],
  hotspots: [
    {
      id: 'ma-griffe', libelle: 'La Duchesse et Griffe', sorte: 'pnj',
      at: { x: 384, y: 780 }, station: { x: 384, y: 1180 }, voix: 'griffe',
      dialogue: [
        "La Duchesse est une amie, chaton. Ne me déçois pas.",
        "Hier soir, grand bal. À 21 h 30, elle pousse un cri : son collier de perles, envolé. Cinq chats travaillaient ici ce soir-là.",
        "Observe la scène du bal, lis ce qui traîne, compte les alibis. Ensuite, tu accuseras.",
      ],
      indice: { titre: 'Le collier disparu', texte: "Le collier de la Duchesse a disparu vers 21 h 30, pendant le bal. Cinq employés étaient présents : Léo, Zoé, Barnabé, Filou, Luna." },
    },
    {
      id: 'ma-obs', libelle: 'La salle de bal', sorte: 'jeu',
      at: { x: 250, y: 640 }, station: { x: 300, y: 1180 }, voix: 'detective',
      dialogue: ["Toute la soirée est encore là, figée dans les tableaux. Qui faisait quoi ?"],
      jeu: {
        type: 'observation',
        consigne: 'Observe le bal. Trois questions vont suivre.',
        duree: 25, cadre: { x: 40, y: 500, w: 690, h: 520 },
        questions: [
          { question: 'Que faisait Filou pendant le bal ?', reponses: ['Il dansait', 'Il servait les boissons', 'Un tour de magie', 'Il dormait'], bonne: 2 },
          { question: 'Qui jouait du piano ?', reponses: ['Zoé', 'Luna', 'Léo', 'La Duchesse'], bonne: 1 },
          { question: 'Que préparait Barnabé à la cuisine ?', reponses: ['Une soupe', 'Des croquettes', 'Un gâteau', 'Une salade'], bonne: 2 },
        ],
      },
      indice: { titre: 'Chacun à son poste', texte: "Filou faisait un tour de magie, Luna jouait du piano, Barnabé préparait un gâteau à la cuisine." },
    },
    {
      id: 'ma-note', libelle: 'La note froissée', sorte: 'jeu',
      at: { x: 470, y: 820 }, station: { x: 470, y: 1180 }, voix: 'pistache',
      dialogue: ["Dans le couloir, une note froissée par terre. Les mots sont tout mélangés…"],
      jeu: {
        type: 'message',
        consigne: 'Reconstitue la note : deux mots à remettre en ordre.',
        gabarit: 'Le collier est caché à la {0}, dans le pot de {1}.',
        mots: [
          { mot: 'CUISINE', indice: 'La pièce où on prépare les repas 🍳' },
          { mot: 'FARINE', indice: 'Poudre blanche pour faire les gâteaux 🥖' },
        ],
      },
      indice: { titre: 'La note du couloir', texte: "« Le collier est caché à la CUISINE, dans le pot de FARINE. » Le collier n'a pas quitté le manoir." },
    },
    {
      id: 'ma-alibis', libelle: 'Les alibis du bal', sorte: 'jeu',
      at: { x: 384, y: 540 }, station: { x: 360, y: 1170 }, voix: 'detective',
      dialogue: ["Le tour de magie de Filou était devant TOUS les invités. Voyons combien de temps il a duré."],
      jeu: {
        type: 'calcul',
        consigne: 'Calcule la durée du tour de magie.',
        enonce: 'Le collier a disparu entre 21 h 00 et 21 h 30. Le tour de magie de Filou, devant tous les invités, a duré de 20 h 50 à 21 h 20, et Zoé a dansé pendant tout le tour. Combien de minutes a duré le tour ?',
        reponses: ['20 minutes', '30 minutes', '40 minutes', '70 minutes'], bonne: 1,
        revelation: 'Filou et Zoé étaient devant tous les invités de 20 h 50 à 21 h 20 : impossible de filer à la cuisine sans être vus !',
      },
      indice: { titre: "L'alibi de Filou et Zoé", texte: "Filou et Zoé étaient devant tous les invités jusqu'à 21 h 20 : difficile de filer à la cuisine sans être vus." },
    },
    {
      id: 'ma-farine', libelle: 'Les traces de farine', sorte: 'jeu',
      at: { x: 520, y: 1150 }, station: { x: 520, y: 1210 }, voix: 'detective',
      dialogue: ["Sur le tapis, des empreintes blanches. Comptons-les avant qu'on ne les efface."],
      jeu: {
        type: 'calcul',
        consigne: 'Compte les empreintes de farine.',
        enonce: 'Sur le tapis du couloir : 4 rangées de 6 empreintes, toutes couvertes de farine. Combien d’empreintes en tout ?',
        reponses: ['10', '18', '24', '46'], bonne: 2,
        revelation: 'Des empreintes de farine qui mènent à la cuisine… Et Luna n’a jamais quitté son piano : tous les invités l’ont entendue jouer sans s’arrêter.',
      },
      indice: { titre: 'Les traces de farine', texte: "24 empreintes de farine mènent à la cuisine. Luna n'a jamais quitté son piano : on l'a entendue jouer sans arrêt." },
    },
    {
      id: 'ma-leo', libelle: 'Interroger Léo', sorte: 'temoin',
      at: { x: 120, y: 760 }, station: { x: 160, y: 1180 },
      interrogatoire: {
        suspect: LEO,
        intro: ['Un vol, chez la Duchesse ? Quelle honte pour le service. Demandez, détective.'],
        questions: [
          { question: 'Où étiez-vous à 21 h 30 ?', options: [
            { texte: 'Au salon', reponse: 'Au salon, je servais les boissons. Il y avait foule, on peut vous le confirmer.' },
            { texte: 'À la cuisine', reponse: "À la cuisine ? Jamais pendant le service ! C'est le domaine de Barnabé, ça." },
          ] },
          { question: 'Avez-vous vu quelqu’un près de la cuisine ?', options: [
            { texte: 'Oui, qui ?', reponse: "Barnabé y était, forcément, c'est son gâteau. Il en sortait couvert de farine, le pauvre." },
          ] },
        ],
        temoignage: "Léo servait au salon devant les invités. Il a vu Barnabé sortir de la cuisine couvert de farine.",
      },
    },
    {
      id: 'ma-cassetete', libelle: 'L’énigme du majordome', sorte: 'cassetete',
      at: { x: 680, y: 1120 }, station: { x: 620, y: 1190 }, voix: 'narrateur', recompense: 3,
      personnage: LEO.portrait,
      dialogue: [
        'Léo redresse son nœud papillon : « Puisque vous enquêtez, détective… La Duchesse a trois invités d’honneur et je ne sais plus qui loge où. Aidez-moi, je vous en prie. »',
      ],
      jeu: {
        type: 'grille',
        consigne: 'Trois invités, trois chambres. Range chacun à sa place.',
        indices: [
          'La Duchesse dort dans la chambre Bleue.',
          'Le Baron n’aime pas le rouge — ce n’est donc pas la chambre Rouge.',
          'La Comtesse a la chambre qui reste.',
        ],
        sujets: ['La Duchesse', 'Le Baron', 'La Comtesse'],
        valeurs: ['Chambre Bleue', 'Chambre Verte', 'Chambre Rouge'],
        solution: [0, 1, 2],
      },
    },
    // --- Étincelles cachées ---
    { id: 'ma-etincelle-1', libelle: 'un reflet sur le lustre', sorte: 'etincelle', at: { x: 384, y: 540 }, recompense: 1 },
    { id: 'ma-etincelle-2', libelle: 'un éclat sous la rampe', sorte: 'etincelle', at: { x: 640, y: 1035 }, recompense: 1 },
    { id: 'ma-etincelle-3', libelle: 'une lueur sur le parquet', sorte: 'etincelle', at: { x: 180, y: 1300 }, recompense: 2 },
    {
      id: 'ma-deduction', libelle: 'Accuser un suspect', sorte: 'deduction',
      at: { x: 384, y: 1050 }, station: { x: 384, y: 1170 }, voix: 'pistache',
      requiert: ['ma-obs', 'ma-note', 'ma-alibis', 'ma-farine'],
      dialogue: ['Tu as tout, détective. La cuisine, la farine, les alibis… Qui accuses-tu ?'],
      jeu: {
        type: 'deduction',
        consigne: 'La note dit « cuisine » et « farine ». Filou, Zoé et Luna avaient un alibi. Qui reste-t-il ?',
        suspects: [LEO, ZOE, BARNABE, FILOU, LUNA],
        ecartes: [1, 3, 4],
        coupable: 2,
        aide: 'Pense aux alibis : qui était devant tout le monde ? Et ces traces de farine, elles mènent à la cuisine…',
        denouement: [
          "C'était Barnabé, le cuisinier ! Mais surprise : ce n'est pas un voleur.",
          "Le fermoir du collier s'était cassé et les perles étaient tombées dans son saladier. Il l'avait caché dans le pot de farine, le temps de le réparer, pour faire une surprise à la Duchesse.",
          "La Duchesse a ri, et tout le manoir a partagé le gâteau.",
        ],
      },
    },
    {
      id: 'ma-sortie', libelle: 'Retour à la carte', sorte: 'sortie',
      at: { x: 60, y: 1300 }, station: { x: 110, y: 1290 }, vers: 'hub', discret: true,
    },
  ],
}
