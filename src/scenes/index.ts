import type { Scene } from '../types'
import { grandPlace } from './grand-place'
import { port } from './port'
import { manoir } from './manoir'
import { bibliotheque } from './bibliotheque'
import { theatre } from './theatre'
import { tour } from './tour'
import { toits } from './toits'

export const SCENES = new Map<string, Scene>(
  [grandPlace, port, manoir, bibliotheque, theatre, tour, toits].map((s) => [s.id, s]),
)
