import './style.css'
import { Jeu } from './engine/game'
import { SCENES } from './scenes'
import { carnet } from './state'

const hote = document.getElementById('jeu')
if (!hote) throw new Error('Conteneur #jeu introuvable')

const jeu = new Jeu(hote, SCENES)

// On reprend là où le joueur s'était arrêté ; par défaut, la carte de Chaville.
const derniere = carnet.derniereScene()
const depart = derniere === 'hub' || SCENES.has(derniere) ? derniere : 'hub'
void jeu.aller(depart)

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
