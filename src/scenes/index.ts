import type { Scene } from '../types'
import { grandPlace } from './grand-place'
import { port } from './port'

export const SCENES = new Map<string, Scene>([
  [grandPlace.id, grandPlace],
  [port.id, port],
])
