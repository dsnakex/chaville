/** Couche modale partagée par les dialogues, le carnet et les mini-jeux. */
export function ouvrirCouche(classe: string): {
  fond: HTMLDivElement
  panneau: HTMLDivElement
  fermer: () => void
} {
  const fond = document.createElement('div')
  fond.className = `couche ${classe}`

  const panneau = document.createElement('div')
  panneau.className = 'panneau'
  fond.appendChild(panneau)

  document.body.appendChild(fond)
  // Laisse le navigateur peindre l'état initial avant la transition d'entrée.
  requestAnimationFrame(() => fond.classList.add('visible'))

  const fermer = (): void => {
    fond.classList.remove('visible')
    setTimeout(() => fond.remove(), 220)
  }

  return { fond, panneau, fermer }
}

/** Petit bandeau d'information qui s'efface tout seul. */
export function bandeau(texte: string, duree = 2600): void {
  const el = document.createElement('div')
  el.className = 'bandeau'
  el.textContent = texte
  document.body.appendChild(el)
  requestAnimationFrame(() => el.classList.add('visible'))
  setTimeout(() => {
    el.classList.remove('visible')
    setTimeout(() => el.remove(), 300)
  }, duree)
}
