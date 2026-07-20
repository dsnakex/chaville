const CLE = 'chaville.aventure.v1'

export interface IndiceCarnet {
  id: string
  titre: string
  texte: string
  scene: string
}

interface Sauvegarde {
  indices: IndiceCarnet[]
  resolus: string[]
  derniereScene: string
}

const vide = (): Sauvegarde => ({ indices: [], resolus: [], derniereScene: 'grand-place' })

function charger(): Sauvegarde {
  try {
    const brut = localStorage.getItem(CLE)
    if (!brut) return vide()
    const s = JSON.parse(brut) as Partial<Sauvegarde>
    return {
      indices: Array.isArray(s.indices) ? s.indices : [],
      resolus: Array.isArray(s.resolus) ? s.resolus : [],
      derniereScene: typeof s.derniereScene === 'string' ? s.derniereScene : 'grand-place',
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

  estResolu: (id: string): boolean => etat.resolus.includes(id),

  ajouter(id: string, titre: string, texte: string, scene: string): void {
    if (!etat.resolus.includes(id)) etat.resolus.push(id)
    if (!etat.indices.some((i) => i.id === id)) etat.indices.push({ id, titre, texte, scene })
    persister()
  },

  marquerResolu(id: string): void {
    if (!etat.resolus.includes(id)) {
      etat.resolus.push(id)
      persister()
    }
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
