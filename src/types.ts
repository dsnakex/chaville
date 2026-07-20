export interface Point {
  x: number
  y: number
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

export type SorteHotspot = 'indice' | 'pnj' | 'sortie' | 'jeu'

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
  voix?: 'detective' | 'pistache' | 'griffe' | 'narrateur'
  /** Indice ajouté au carnet une fois le hotspot résolu. */
  indice?: { titre: string; texte: string }
  /** Mini-jeu à réussir avant d'obtenir l'indice. */
  jeu?: MiniJeu
  /** Pour les sorties : identifiant de la scène de destination. */
  vers?: string
  /** Marqueur discret (sortie) plutôt qu'étincelle dorée. */
  discret?: boolean
}

export interface Scene {
  id: string
  nom: string
  /** URL stable du décor PNG. */
  decor: string
  largeur: number
  hauteur: number
  arrivee: Point
  zone: ZoneMarche
  /** Bandeau d'ambiance affiché à l'entrée dans la scène. */
  ambiance: string
  /** Bancs de brume dérivante, en coordonnées de scène. */
  brume: { x: number; y: number; rx: number; ry: number; opacite: number; duree: number }[]
  hotspots: Hotspot[]
}

// ---------------------------------------------------------------------------
// Mini-jeux pédagogiques (repris de la v1 : observation, vocabulaire, calcul)
// ---------------------------------------------------------------------------

export interface JeuObservation {
  type: 'observation'
  consigne: string
  /** Secondes d'observation avant que la question tombe. */
  duree: number
  /** Zone du décor à observer, en coordonnées de scène. */
  cadre: { x: number; y: number; w: number; h: number }
  question: string
  reponses: string[]
  bonne: number
}

export interface JeuAnagramme {
  type: 'anagramme'
  consigne: string
  mot: string
  indice: string
}

export interface JeuCalcul {
  type: 'calcul'
  consigne: string
  enonce: string
  reponse: number
  unite?: string
}

export type MiniJeu = JeuObservation | JeuAnagramme | JeuCalcul
