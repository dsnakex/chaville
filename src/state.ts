const CLE = 'chaville.aventure.v3'

export interface IndiceCarnet {
  id: string
  titre: string
  texte: string
  scene: string
}

export interface TemoignageCarnet {
  id: string
  nom: string
  role: string
  /** Clé de portrait (préset) ou personnage, pour le mini-avatar du carnet. */
  portrait: string
  citation: string
  scene: string
}

interface Sauvegarde {
  indices: IndiceCarnet[]
  temoignages: TemoignageCarnet[]
  resolus: string[]
  /** Lieux dont l'enquête est bouclée (déduction réussie). */
  enquetes: string[]
  /** Fragments de l'arc « Fantôme Gris », dans l'ordre d'obtention. */
  fg: string[]
  /** Croquettes d'or : monnaie des indices de Pistache. */
  croquettes: number
  /** Étincelles cachées déjà ramassées (une seule fois chacune). */
  etincelles: string[]
  /** Casse-têtes des habitants déjà réussis. */
  cassetetes: string[]
  derniereScene: string
}

const vide = (): Sauvegarde => ({
  indices: [],
  temoignages: [],
  resolus: [],
  enquetes: [],
  fg: [],
  croquettes: 0,
  etincelles: [],
  cassetetes: [],
  derniereScene: 'hub',
})

function charger(): Sauvegarde {
  try {
    const brut = localStorage.getItem(CLE)
    if (!brut) return vide()
    const s = JSON.parse(brut) as Partial<Sauvegarde>
    const d = vide()
    return {
      indices: Array.isArray(s.indices) ? s.indices : d.indices,
      temoignages: Array.isArray(s.temoignages) ? s.temoignages : d.temoignages,
      resolus: Array.isArray(s.resolus) ? s.resolus : d.resolus,
      enquetes: Array.isArray(s.enquetes) ? s.enquetes : d.enquetes,
      fg: Array.isArray(s.fg) ? s.fg : d.fg,
      croquettes: typeof s.croquettes === 'number' ? s.croquettes : d.croquettes,
      etincelles: Array.isArray(s.etincelles) ? s.etincelles : d.etincelles,
      cassetetes: Array.isArray(s.cassetetes) ? s.cassetetes : d.cassetetes,
      derniereScene: typeof s.derniereScene === 'string' ? s.derniereScene : d.derniereScene,
    }
  } catch {
    // localStorage indisponible (mode privé) : on joue sans sauvegarde.
    return vide()
  }
}

let etat = charger()
const abonnes = new Set<() => void>()

function persister(): void {
  try {
    localStorage.setItem(CLE, JSON.stringify(etat))
  } catch {
    /* pas de sauvegarde possible, le jeu continue */
  }
  for (const f of abonnes) f()
}

export const carnet = {
  indices: (): readonly IndiceCarnet[] => etat.indices,
  temoignages: (): readonly TemoignageCarnet[] => etat.temoignages,
  fgFragments: (): readonly string[] => etat.fg,

  estResolu: (id: string): boolean => etat.resolus.includes(id),
  enqueteResolue: (lieu: string): boolean => etat.enquetes.includes(lieu),

  ajouter(id: string, titre: string, texte: string, scene: string): void {
    if (!etat.resolus.includes(id)) etat.resolus.push(id)
    if (!etat.indices.some((i) => i.id === id)) etat.indices.push({ id, titre, texte, scene })
    persister()
  },

  ajouterTemoignage(t: TemoignageCarnet): void {
    if (!etat.temoignages.some((x) => x.id === t.id)) etat.temoignages.push(t)
    persister()
  },

  marquerResolu(id: string): void {
    if (!etat.resolus.includes(id)) {
      etat.resolus.push(id)
      persister()
    }
  },

  marquerEnquete(lieu: string): void {
    if (!etat.enquetes.includes(lieu)) {
      etat.enquetes.push(lieu)
      persister()
    }
  },

  // --- Arc du Fantôme Gris ---

  /** Ajoute un fragment (une seule fois). @returns true si c'est un nouveau. */
  ajouterFragment(texte: string): boolean {
    if (etat.fg.includes(texte)) return false
    etat.fg.push(texte)
    persister()
    return true
  },

  // --- Croquettes d'or (monnaie des indices de Pistache) ---

  croquettes: (): number => etat.croquettes,

  ajouterCroquettes(n: number): void {
    etat.croquettes += n
    persister()
  },

  /** Dépense une croquette. @returns false si le solde est insuffisant. */
  depenserCroquette(): boolean {
    if (etat.croquettes < 1) return false
    etat.croquettes -= 1
    persister()
    return true
  },

  etincelleRamassee: (id: string): boolean => etat.etincelles.includes(id),

  ramasserEtincelle(id: string, valeur: number): void {
    if (etat.etincelles.includes(id)) return
    etat.etincelles.push(id)
    etat.croquettes += valeur
    persister()
  },

  cassetetereussi: (id: string): boolean => etat.cassetetes.includes(id),

  marquerCassetete(id: string, recompense: number): void {
    if (etat.cassetetes.includes(id)) return
    etat.cassetetes.push(id)
    etat.croquettes += recompense
    persister()
  },

  derniereScene: (): string => etat.derniereScene,

  noterScene(id: string): void {
    etat.derniereScene = id
    persister()
  },

  reinitialiser(): void {
    etat = vide()
    persister()
  },

  surChangement(f: () => void): void {
    abonnes.add(f)
  },
}
