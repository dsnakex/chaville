import type { OptionsPortrait } from './art'

export interface Point {
  x: number
  y: number
}

/** Rectangle de décor infranchissable (l'étal, une table…), en coord. de scène. */
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** Zone marchable : un trapèze, plus large en bas (près) qu'en haut (loin). */
export interface ZoneMarche {
  yHaut: number
  yBas: number
  demiLargeurHaut: number
  demiLargeurBas: number
  centreX: number
  /** Échelle du personnage au bord haut (loin) et au bord bas (près). */
  echelleLoin: number
  echelleProche: number
}

export type SorteHotspot =
  | 'indice' | 'pnj' | 'sortie' | 'jeu' | 'temoin' | 'deduction'
  /** Étincelle cachée dans le décor : donne des croquettes d'or. */
  | 'etincelle'
  /** Casse-tête optionnel proposé par un habitant. */
  | 'cassetete'
  /** Confrontation finale (enquête bonus des Toits). */
  | 'confrontation'

export interface Hotspot {
  id: string
  /** Libellé affiché dans la pastille au survol / à l'approche. */
  libelle: string
  sorte: SorteHotspot
  /** Position du marqueur dans le repère de la scène (768 × 1376). */
  at: Point
  /** Où le détective vient se placer pour interagir. Par défaut : sous le marqueur. */
  station?: Point
  /** Réplique(s) jouées à l'arrivée. */
  dialogue?: string[]
  /** Qui parle : change l'avatar et la couleur de la bulle. */
  voix?: Voix
  /** Indice ajouté au carnet une fois le hotspot résolu. */
  indice?: { titre: string; texte: string }
  /** Mini-jeu à réussir avant d'obtenir l'indice. */
  jeu?: MiniJeu
  /** Interrogatoire d'un témoin (dialogue à choix). */
  interrogatoire?: Interrogatoire
  /** Pour les sorties : identifiant de la scène de destination. */
  vers?: string
  /** Marqueur discret (sortie) plutôt qu'étincelle dorée. */
  discret?: boolean
  /** N'apparaît que si tous ces hotspots sont résolus (ex. la déduction finale). */
  requiert?: string[]
  /** Orientation soufflée par Pistache si le joueur cherche trop longtemps. */
  astuce?: string
  /** Portrait à dessiner sur place (PNJ). Par défaut : déduit de voix/interrogatoire. */
  personnage?: OptionsPortrait
  /** Croquettes d'or gagnées (étincelle cachée, casse-tête réussi). */
  recompense?: number
}

/** Voix connues du moteur de dialogue (avatars + couleur de bulle). */
export type Voix =
  | 'detective' | 'pistache' | 'griffe' | 'narrateur'
  | 'sardine' | 'moustache' | string

export interface Scene {
  id: string
  nom: string
  /** Identifiant du lieu sur la carte (pour la progression). */
  lieu: string
  /** Phrase d'objectif affichée dans le HUD. */
  objectif: string
  /** URL stable du décor PNG. */
  decor: string
  largeur: number
  hauteur: number
  arrivee: Point
  zone: ZoneMarche
  /** Rectangles infranchissables du décor. */
  obstacles?: Rect[]
  /** Bandeau d'ambiance affiché à l'entrée dans la scène. */
  ambiance: string
  /** Bancs de brume dérivante, en coordonnées de scène. */
  brume: { x: number; y: number; rx: number; ry: number; opacite: number; duree: number }[]
  hotspots: Hotspot[]
}

// ---------------------------------------------------------------------------
// Interrogatoires (dialogues à choix) et témoignages
// ---------------------------------------------------------------------------

export interface Suspect {
  id: string
  nom: string
  /** Rôle affiché (« Cuisinier persan »). */
  role: string
  portrait: OptionsPortrait
}

export interface Interrogatoire {
  suspect: Suspect
  /** Répliques d'accueil du témoin avant les questions. */
  intro: string[]
  /** Questions à choix ; chaque réponse renvoie une réplique. */
  questions: { question: string; options: { texte: string; reponse: string }[] }[]
  /** Citation retenue dans le carnet (section Témoignages). */
  temoignage: string
}

// ---------------------------------------------------------------------------
// Mini-jeux : observation, message codé (multi-mots), calcul, déduction
// ---------------------------------------------------------------------------

export interface JeuObservation {
  type: 'observation'
  consigne: string
  /** Secondes d'observation avant que la question tombe. */
  duree: number
  /** Zone du décor à observer, en coordonnées de scène. */
  cadre: { x: number; y: number; w: number; h: number }
  /** Une ou plusieurs questions QCM. */
  questions: { question: string; reponses: string[]; bonne: number }[]
}

/** Message codé « à trous » : une phrase gabarit + des mots à reconstituer. */
export interface JeuMessage {
  type: 'message'
  consigne: string
  /** Gabarit avec des {0}, {1}… remplacés par les mots trouvés. */
  gabarit: string
  mots: { mot: string; indice: string }[]
}

export interface JeuCalcul {
  type: 'calcul'
  consigne: string
  enonce: string
  reponses: string[]
  bonne: number
  /** Indice de raisonnement dévoilé après la bonne réponse. */
  revelation?: string
}

export interface JeuDeduction {
  type: 'deduction'
  consigne: string
  suspects: Suspect[]
  /** Index (dans `suspects`) déjà écartés par les indices : grisés. */
  ecartes: number[]
  /** Index du coupable dans `suspects`. */
  coupable: number
  /** Aide de Pistache en cas de mauvaise accusation. */
  aide: string
  /** Récit final (motif touchant) après la bonne accusation. */
  denouement: string[]
}

// --- Casse-têtes optionnels (modèle Layton, 3 familles du CLAUDE.md) --------

/** Mots & codes — devinette posée par un habitant. */
export interface JeuDevinette {
  type: 'devinette'
  consigne: string
  enonce: string
  reponses: string[]
  bonne: number
}

/** Mots & codes — écriture miroir. */
export interface JeuMiroir {
  type: 'miroir'
  consigne: string
  texteMiroir: string
  question: string
  reponses: string[]
  bonne: number
}

/** Spatial — quelle silhouette correspond ? */
export interface JeuSilhouette {
  type: 'silhouette'
  consigne: string
  question: string
  options: { chapeau: boolean; cape: boolean; rot: number }[]
  bonne: number
}

/** Logique & déduction — grille « qui habite où » (3 sujets × 3 valeurs). */
export interface JeuGrille {
  type: 'grille'
  consigne: string
  indices: string[]
  sujets: string[]
  valeurs: string[]
  /** solution[i] = index dans `valeurs` pour le sujet i. */
  solution: number[]
}

/** Spatial — taquin 3×3 sur un morceau de décor. */
export interface JeuTaquin {
  type: 'taquin'
  consigne: string
  /** Image source (décor de la scène par défaut). */
  image?: string
  cadre: { x: number; y: number; w: number; h: number }
}

export type CasseTete = JeuDevinette | JeuMiroir | JeuSilhouette | JeuGrille | JeuTaquin

export type MiniJeu =
  | JeuObservation | JeuMessage | JeuCalcul | JeuDeduction | CasseTete
