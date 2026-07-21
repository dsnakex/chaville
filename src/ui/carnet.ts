import { carnet } from '../state'
import { ouvrirCouche } from './modal'
import { PORTRAITS, portraitAvatar } from '../art'

type Onglet = 'indices' | 'temoignages' | 'fg'

/** Carnet du détective : indices, témoignages, et la page du Fantôme Gris. */
export function ouvrirCarnet(ongletInitial: Onglet = 'indices'): void {
  const { panneau, fermer } = ouvrirCouche('couche-carnet')

  const entete = document.createElement('div')
  entete.className = 'carnet-entete'
  const titre = document.createElement('h2')
  titre.textContent = 'Carnet du détective'
  const fermeBtn = document.createElement('button')
  fermeBtn.className = 'bouton-fermer'
  fermeBtn.setAttribute('aria-label', 'Fermer le carnet')
  fermeBtn.textContent = '✕'
  fermeBtn.addEventListener('click', fermer)
  const espaceur = document.createElement('span')
  espaceur.className = 'espaceur'
  entete.append(espaceur, titre, fermeBtn)
  panneau.appendChild(entete)

  const barreOnglets = document.createElement('div')
  barreOnglets.className = 'carnet-onglets'
  const corps = document.createElement('div')
  corps.className = 'carnet-corps'
  panneau.append(barreOnglets, corps)

  let actif: Onglet = ongletInitial

  const onglets: { cle: Onglet; libelle: string }[] = [
    { cle: 'indices', libelle: '🔎 Indices' },
    { cle: 'temoignages', libelle: '💬 Témoins' },
    { cle: 'fg', libelle: '🌫️ F.G.' },
  ]

  const rendre = (): void => {
    barreOnglets.replaceChildren()
    for (const o of onglets) {
      const b = document.createElement('button')
      b.className = 'onglet' + (o.cle === actif ? ' actif' : '')
      b.textContent = o.libelle
      b.addEventListener('click', () => {
        actif = o.cle
        rendre()
      })
      barreOnglets.appendChild(b)
    }
    corps.replaceChildren()
    if (actif === 'indices') rendreIndices(corps)
    else if (actif === 'temoignages') rendreTemoignages(corps)
    else rendreFG(corps)
  }

  rendre()
}

function rendreIndices(corps: HTMLElement): void {
  const indices = carnet.indices()
  const titre = document.createElement('div')
  titre.className = 'section-titre'
  titre.innerHTML = '<span>Indices trouvés</span>'
  const pastille = document.createElement('span')
  pastille.className = 'pastille-compte'
  pastille.textContent = String(indices.length)
  titre.appendChild(pastille)
  corps.appendChild(titre)

  if (indices.length === 0) {
    corps.appendChild(vide("Ton carnet est encore tout neuf. Explore la ville et touche ce qui brille : chaque indice viendra s'écrire ici."))
    return
  }
  const liste = document.createElement('ul')
  liste.className = 'liste-cartes'
  for (const i of indices) {
    const li = document.createElement('li')
    li.className = 'carte-indice'
    const t = document.createElement('span')
    t.className = 'carte-titre'
    t.textContent = i.titre
    const lieu = document.createElement('span')
    lieu.className = 'carte-lieu'
    lieu.textContent = i.scene
    const txt = document.createElement('p')
    txt.textContent = i.texte
    li.append(t, lieu, txt)
    liste.appendChild(li)
  }
  corps.appendChild(liste)
}

function rendreTemoignages(corps: HTMLElement): void {
  const temoins = carnet.temoignages()
  const titre = document.createElement('div')
  titre.className = 'section-titre'
  titre.innerHTML = '<span>Témoignages recueillis</span>'
  corps.appendChild(titre)

  if (temoins.length === 0) {
    corps.appendChild(vide('Personne n’a encore parlé. Va interroger les habitants : leurs mots se noteront ici.'))
    return
  }
  const liste = document.createElement('ul')
  liste.className = 'liste-cartes'
  for (const t of temoins) {
    const li = document.createElement('li')
    li.className = 'carte-temoin'
    const av = document.createElement('span')
    av.className = 'mini-portrait'
    const preset = PORTRAITS[t.portrait]
    if (preset) av.innerHTML = portraitAvatar(preset, 44)
    const col = document.createElement('div')
    col.className = 'temoin-col'
    const nom = document.createElement('span')
    nom.className = 'temoin-nom'
    nom.textContent = t.nom
    const cit = document.createElement('p')
    cit.className = 'temoin-cit'
    cit.textContent = `« ${t.citation} »`
    col.append(nom, cit)
    li.append(av, col)
    liste.appendChild(li)
  }
  corps.appendChild(liste)
}

function rendreFG(corps: HTMLElement): void {
  const fragments = carnet.fgFragments()
  const titre = document.createElement('div')
  titre.className = 'section-titre'
  titre.innerHTML = '<span>Le Fantôme Gris</span>'
  corps.appendChild(titre)

  if (fragments.length === 0) {
    const bloc = document.createElement('div')
    bloc.className = 'fg-vide'
    bloc.innerHTML =
      '<div class="fg-carte">F.G.</div>' +
      '<p>Une carte de visite grise, signée « F.G. ». Un voleur élégant rôderait dans Chaville…</p>' +
      '<p class="fg-note">Cette page se remplira au fil de tes enquêtes.</p>'
    corps.appendChild(bloc)
    return
  }
  const liste = document.createElement('ul')
  liste.className = 'liste-cartes'
  for (const f of fragments) {
    const li = document.createElement('li')
    li.className = 'carte-indice'
    li.textContent = f
    liste.appendChild(li)
  }
  corps.appendChild(liste)
}

function vide(texte: string): HTMLElement {
  const p = document.createElement('p')
  p.className = 'carnet-vide'
  p.textContent = texte
  return p
}
