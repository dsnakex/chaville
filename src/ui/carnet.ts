import { carnet } from '../state'
import { ouvrirCouche } from './modal'

/** Carnet du détective : les indices récoltés, persistants entre les scènes. */
export function ouvrirCarnet(): void {
  const { panneau, fermer } = ouvrirCouche('couche-carnet')

  const titre = document.createElement('h2')
  titre.textContent = '📓 Carnet du détective'
  panneau.appendChild(titre)

  const indices = carnet.indices()

  if (indices.length === 0) {
    const vide = document.createElement('p')
    vide.className = 'carnet-vide'
    vide.textContent =
      "Ton carnet est encore tout neuf. Explore la ville et touche ce qui brille : chaque indice viendra s'écrire ici."
    panneau.appendChild(vide)
  } else {
    const liste = document.createElement('ul')
    liste.className = 'carnet-liste'
    for (const i of indices) {
      const li = document.createElement('li')

      const t = document.createElement('span')
      t.className = 'indice-titre'
      t.textContent = i.titre

      const lieu = document.createElement('span')
      lieu.className = 'indice-lieu'
      lieu.textContent = i.scene

      const txt = document.createElement('p')
      txt.textContent = i.texte

      li.append(t, lieu, txt)
      liste.appendChild(li)
    }
    panneau.appendChild(liste)

    const compte = document.createElement('p')
    compte.className = 'carnet-compte'
    compte.textContent = `${indices.length} indice${indices.length > 1 ? 's' : ''} récolté${indices.length > 1 ? 's' : ''}.`
    panneau.appendChild(compte)
  }

  const bouton = document.createElement('button')
  bouton.className = 'bouton'
  bouton.textContent = 'Refermer le carnet'
  bouton.addEventListener('click', fermer)
  panneau.appendChild(bouton)
}
