import type { Scene } from '../types'

/**
 * Le port, à l'heure bleue. Décor de référence de la DA.
 * Le quai est étroit ; le bateau et les caisses sont des obstacles.
 */
export const port: Scene = {
  id: 'port',
  nom: 'Le port',
  lieu: 'port',
  objectif: 'Suivre la piste des caisses jusqu’au quai',
  decor: '/assets/decors/port.png',
  largeur: 768,
  hauteur: 1376,
  arrivee: { x: 180, y: 1300 },
  ambiance: "Le phare balaie la brume. Sur le quai, une corde pend là où elle ne devrait pas.",
  zone: {
    yHaut: 1218, yBas: 1352, demiLargeurHaut: 250, demiLargeurBas: 288,
    centreX: 282, echelleLoin: 0.9, echelleProche: 1.2,
  },
  // Les caisses de poisson au premier plan à droite.
  obstacles: [{ x: 560, y: 1230, w: 180, h: 90 }],
  brume: [
    { x: 230, y: 1150, rx: 250, ry: 30, opacite: 0.2, duree: 19 },
    { x: 430, y: 1195, rx: 200, ry: 22, opacite: 0.15, duree: 26 },
  ],
  hotspots: [
    {
      id: 'port-cordage', libelle: "La bitte d'amarrage", sorte: 'jeu',
      at: { x: 130, y: 1178 }, station: { x: 150, y: 1268 }, voix: 'detective',
      dialogue: ["La corde du bateau est bien enroulée autour de la bitte. Trop bien, même."],
      jeu: {
        type: 'observation',
        consigne: "Observe la bitte d'amarrage et la corde. Une question t'attend juste après.",
        duree: 18, cadre: { x: 40, y: 1090, w: 300, h: 220 },
        questions: [
          { question: "Vers où part la corde depuis la bitte d'amarrage ?", reponses: ['Vers la droite, jusqu’au bateau', 'Vers la gauche, dans l’eau', 'Elle est coupée', 'Vers le phare'], bonne: 0 },
        ],
      },
      indice: {
        titre: 'Une corde bien nouée',
        texte: "La corde relie proprement la bitte au bateau. Personne n'est parti en catastrophe : celui qui est venu a pris le temps de tout rattacher.",
      },
    },
    {
      id: 'port-caisses', libelle: 'Les caisses de poisson', sorte: 'jeu',
      at: { x: 648, y: 1188 }, station: { x: 500, y: 1262 }, voix: 'pistache',
      dialogue: ["Les caisses du port ! Le même poisson dessiné que là-haut. Et un mot gravé au couteau, les lettres mélangées."],
      jeu: {
        type: 'message',
        consigne: 'Retrouve le mot gravé sur le couvercle de la caisse.',
        gabarit: 'Gravé sur la caisse : « {0} »',
        mots: [{ mot: 'GLACE', indice: 'Ce qu\'on met dans les caisses pour garder le poisson bien froid ❄️' }],
      },
      indice: {
        titre: 'Le mot gravé',
        texte: "« GLACE » gravé sur les caisses. Sans glace, le poisson ne tient pas la nuit — il fallait le déplacer avant qu'il ne soit perdu.",
      },
    },
    {
      id: 'port-phare', libelle: 'Le phare', sorte: 'jeu',
      at: { x: 632, y: 604 }, station: { x: 440, y: 1240 }, voix: 'detective',
      dialogue: ['Le phare tourne sans arrêt. Si je compte ses tours, je saurai quand quelqu\'un est passé.'],
      jeu: {
        type: 'calcul',
        consigne: 'Calcule combien de fois le phare a éclairé le quai.',
        enonce: 'Le faisceau balaie le quai toutes les 6 secondes. Entre 23 h 58 et minuit, cela fait 2 minutes complètes. Combien de fois le quai a-t-il été éclairé ?',
        reponses: ['12 fois', '18 fois', '20 fois', '24 fois'], bonne: 2,
        revelation: '120 secondes ÷ 6 = 20 passages de lumière. Impossible de traverser ce quai sans être vu au moins une fois !',
      },
      indice: {
        titre: 'Vingt passages de lumière',
        texte: "En 2 minutes (120 secondes), un faisceau toutes les 6 secondes éclaire le quai 20 fois. Impossible de traverser ce quai sans être vu.",
      },
    },
    {
      id: 'port-vers-place', libelle: 'Remonter en ville', sorte: 'sortie',
      at: { x: 508, y: 1232 }, station: { x: 470, y: 1280 }, vers: 'grand-place', voix: 'pistache',
      dialogue: ['La rampe remonte vers la Grand-Place. On retourne voir le commissaire ?'],
    },
  ],
}
