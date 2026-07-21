/**
 * Vocabulaire graphique de la DA « Heure bleue encrée » (planches session 3).
 *
 * Deux registres :
 *  - DEFS : symboles de personnages EN PIED pour la marche dans les scènes
 *    (détective + Pistache, en 3 poses front/back/side), plus #dW et #spark.
 *  - portraitSVG() : générateur de PORTRAITS (buste) paramétrique, utilisé pour
 *    les bulles de dialogue, les interrogatoires et la déduction. Un seul moteur
 *    couvre les habitants nommés ET tous les suspects des enquêtes.
 *
 * Référence : da/planches/Planche personnages(.dc.html) + …secondaires. Le
 * détective est un chat gris tigré #8C93A8 (planche validée le 21/07/2026).
 */

export const PALETTE = {
  encre: '#2F2A45',
  or: '#F4C95D',
  orClair: '#FBE3A2',
  orFonce: '#8A6B3F',
  creme: '#FBF0D4',
  cremeCarte: '#F3E6C4',
  brume: '#C7BBD4',
  ardoise: '#57506F',
  braise: '#C9776B',
  pave: '#4E4668',
} as const

// ---------------------------------------------------------------------------
// Symboles EN PIED (marche). Repère commun : tête vers y≈0, pieds vers y≈135
// pour le détective (ancrage 138) et y≈35 pour Pistache (ancrage 38), afin que
// changer de pose ne fasse pas « sauter » le personnage.
// ---------------------------------------------------------------------------

const DET_FRONT = `
  <g id="det-front">
    <path d="M-30,100 C-64,96 -72,60 -46,54 C-60,66 -54,88 -26,90 Z" fill="#6E7488"></path>
    <ellipse cx="0" cy="95" rx="36" ry="42" fill="#8C93A8"></ellipse>
    <ellipse cx="0" cy="106" rx="21" ry="29" fill="#F2EDE0"></ellipse>
    <ellipse cx="-15" cy="135" rx="11" ry="7" fill="#6E7488"></ellipse>
    <ellipse cx="15" cy="135" rx="11" ry="7" fill="#6E7488"></ellipse>
    <path d="M-34,0 L-44,-24 L-14,-12 Z" fill="#8C93A8"></path>
    <path d="M-32,-4 L-38,-18 L-20,-11 Z" fill="#E9AFBB" stroke="none"></path>
    <path d="M34,0 L44,-24 L14,-12 Z" fill="#8C93A8"></path>
    <path d="M32,-4 L38,-18 L20,-11 Z" fill="#E9AFBB" stroke="none"></path>
    <circle cx="0" cy="28" r="36" fill="#8C93A8"></circle>
    <ellipse cx="0" cy="42" rx="17" ry="12" fill="#F2EDE0"></ellipse>
    <circle cx="-14" cy="24" r="9.5" fill="#FFFDF5"></circle>
    <circle cx="14" cy="24" r="9.5" fill="#FFFDF5"></circle>
    <circle cx="-13" cy="25" r="5.8" fill="#2F2A45" stroke="none"></circle>
    <circle cx="15" cy="25" r="5.8" fill="#2F2A45" stroke="none"></circle>
    <circle cx="-11" cy="23" r="2" fill="#FFFFFF" stroke="none"></circle>
    <circle cx="17" cy="23" r="2" fill="#FFFFFF" stroke="none"></circle>
    <path d="M-4.5,35 L4.5,35 L0,40 Z" fill="#D96C5C" stroke="none"></path>
    <path d="M0,40 Q0,45 -5,46 M0,40 Q0,45 5,46" fill="none" stroke="#2F2A45" stroke-width="1.6" stroke-linecap="round"></path>
    <g stroke="#2F2A45" stroke-width="1.2" opacity="0.4" stroke-linecap="round">
      <path d="M-19,37 L-34,34"></path><path d="M-19,42 L-33,43"></path>
      <path d="M19,37 L34,34"></path><path d="M19,42 L33,43"></path>
    </g>
    <ellipse cx="0" cy="6" rx="39" ry="8.5" fill="#75604B"></ellipse>
    <path d="M-36,6 Q-38,-28 0,-31 Q38,-28 36,6 Q0,-4 -36,6 Z" fill="#8C7461"></path>
    <path d="M-33,3 Q0,-7 33,3" fill="none" stroke="#F4C95D" stroke-width="4" stroke-linecap="round"></path>
    <path d="M-26,56 Q0,72 26,56 L26,70 Q0,86 -26,70 Z" fill="#C4574E"></path>
    <path d="M12,72 Q20,96 10,112 L-4,106 Q6,92 0,74 Z" fill="#C4574E"></path>
    <path d="M10,112 L7,120 M2,109 L-1,117" stroke="#F4C95D" stroke-width="2.5" stroke-linecap="round" fill="none"></path>
    <path d="M24,74 L50,56" stroke="#8C93A8" stroke-width="14" stroke-linecap="round" fill="none"></path>
    <circle cx="52" cy="54" r="8.5" fill="#9BA1B4"></circle>
    <path d="M54,50 L66,34" stroke="#6B4A36" stroke-width="6" stroke-linecap="round" fill="none"></path>
    <circle cx="74" cy="24" r="17" fill="#CFE3EA" fill-opacity="0.55" stroke="#F4C95D" stroke-width="5"></circle>
    <path d="M65,17 A13,13 0 0 1 74,11" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" opacity="0.85"></path>
  </g>`

const DET_SIDE = `
  <g id="det-side">
    <path d="M-34,96 C-66,86 -70,54 -46,52 C-58,64 -50,84 -28,84 Z" fill="#6E7488"></path>
    <ellipse cx="4" cy="92" rx="40" ry="40" fill="#8C93A8"></ellipse>
    <ellipse cx="18" cy="104" rx="18" ry="26" fill="#F2EDE0"></ellipse>
    <ellipse cx="-8" cy="133" rx="10" ry="7" fill="#6E7488"></ellipse>
    <ellipse cx="20" cy="133" rx="10" ry="7" fill="#8C93A8"></ellipse>
    <path d="M6,-2 L-6,-24 L22,-12 Z" fill="#8C93A8"></path>
    <path d="M6,-4 L-2,-18 L16,-11 Z" fill="#E9AFBB" stroke="none"></path>
    <circle cx="16" cy="26" r="34" fill="#8C93A8"></circle>
    <path d="M44,20 Q58,24 56,34 Q50,36 44,34 Z" fill="#F2EDE0"></path>
    <path d="M56,29 L62,29" stroke="#2F2A45" stroke-width="1.4" stroke-linecap="round"></path>
    <path d="M50,30 L52,34 L48,34 Z" fill="#D96C5C" stroke="none"></path>
    <circle cx="24" cy="22" r="8.5" fill="#FFFDF5"></circle>
    <circle cx="26" cy="23" r="5" fill="#2F2A45" stroke="none"></circle>
    <circle cx="28" cy="21" r="1.7" fill="#FFFFFF" stroke="none"></circle>
    <ellipse cx="16" cy="6" rx="37" ry="8" fill="#75604B"></ellipse>
    <path d="M-22,6 Q-20,-26 16,-29 Q52,-26 50,6 Q16,-3 -22,6 Z" fill="#8C7461"></path>
    <path d="M-19,3 Q16,-6 47,3" fill="none" stroke="#F4C95D" stroke-width="3.6" stroke-linecap="round"></path>
    <path d="M-10,54 Q6,66 22,56 L20,72 Q4,82 -10,70 Z" fill="#C4574E"></path>
    <path d="M-14,60 Q-22,84 -14,102 L-2,96 Q-8,80 -4,64 Z" fill="#C4574E"></path>
  </g>`

const DET_BACK = `
  <g id="det-back">
    <path d="M30,100 C64,96 72,60 46,54 C60,66 54,88 26,90 Z" fill="#6E7488"></path>
    <ellipse cx="0" cy="95" rx="36" ry="42" fill="#7E869C"></ellipse>
    <ellipse cx="-15" cy="135" rx="11" ry="7" fill="#6E7488"></ellipse>
    <ellipse cx="15" cy="135" rx="11" ry="7" fill="#6E7488"></ellipse>
    <path d="M-34,0 L-44,-24 L-14,-12 Z" fill="#7E869C"></path>
    <path d="M34,0 L44,-24 L14,-12 Z" fill="#7E869C"></path>
    <circle cx="0" cy="28" r="36" fill="#7E869C"></circle>
    <ellipse cx="0" cy="6" rx="39" ry="8.5" fill="#6C583F"></ellipse>
    <path d="M-36,6 Q-38,-28 0,-31 Q38,-28 36,6 Q0,16 -36,6 Z" fill="#7C6653"></path>
    <path d="M-33,7 Q0,17 33,7" fill="none" stroke="#F4C95D" stroke-width="4" stroke-linecap="round"></path>
    <path d="M-24,54 Q0,66 24,54 L22,74 Q0,84 -22,74 Z" fill="#B14A42"></path>
  </g>`

const PIS_FRONT = `
  <g id="pis-front">
    <path d="M17,26 Q42,32 44,12 Q45,-2 33,0" fill="none" stroke="#9D93B5" stroke-width="4" stroke-linecap="round"></path>
    <ellipse cx="0" cy="16" rx="16" ry="20" fill="#B4AECB"></ellipse>
    <ellipse cx="-2" cy="22" rx="9" ry="12" fill="#EDE6F2"></ellipse>
    <circle cx="-11" cy="-15" r="9" fill="#B4AECB"></circle>
    <circle cx="-11" cy="-15" r="5" fill="#F0B9C6" stroke="none"></circle>
    <circle cx="11" cy="-15" r="9" fill="#B4AECB"></circle>
    <circle cx="11" cy="-15" r="5" fill="#F0B9C6" stroke="none"></circle>
    <circle cx="0" cy="-2" r="13" fill="#B4AECB"></circle>
    <circle cx="-5" cy="-4" r="4.6" fill="#FFFDF5"></circle>
    <circle cx="5" cy="-4" r="4.6" fill="#FFFDF5"></circle>
    <circle cx="-4.4" cy="-3.6" r="2.8" fill="#2F2A45" stroke="none"></circle>
    <circle cx="5.6" cy="-3.6" r="2.8" fill="#2F2A45" stroke="none"></circle>
    <circle cx="-3.6" cy="-4.6" r="1" fill="#FFFFFF" stroke="none"></circle>
    <circle cx="6.4" cy="-4.6" r="1" fill="#FFFFFF" stroke="none"></circle>
    <circle cx="0" cy="3" r="2.6" fill="#E58BA0" stroke="none"></circle>
    <path d="M-8,10 L8,10 L0,18 Z" fill="#F4C95D"></path>
    <g transform="rotate(-10 10 18)">
      <rect x="5" y="11" width="11" height="14" rx="2" fill="#F7EFDC" stroke="#2F2A45" stroke-width="1.5"></rect>
      <path d="M8,16 L13,16 M8,19 L13,19" stroke="#2F2A45" stroke-width="1" opacity="0.5"></path>
    </g>
    <ellipse cx="-7" cy="35" rx="5" ry="3" fill="#9D93B5"></ellipse>
    <ellipse cx="6" cy="35" rx="5" ry="3" fill="#9D93B5"></ellipse>
  </g>`

const PIS_SIDE = `
  <g id="pis-side">
    <path d="M-14,24 Q-40,30 -42,10 Q-43,-4 -31,-2" fill="none" stroke="#9D93B5" stroke-width="4" stroke-linecap="round"></path>
    <ellipse cx="0" cy="16" rx="17" ry="19" fill="#B4AECB"></ellipse>
    <ellipse cx="6" cy="22" rx="9" ry="11" fill="#EDE6F2"></ellipse>
    <circle cx="-2" cy="-14" r="9" fill="#B4AECB"></circle>
    <circle cx="-2" cy="-14" r="5" fill="#F0B9C6" stroke="none"></circle>
    <circle cx="4" cy="-2" r="13" fill="#B4AECB"></circle>
    <path d="M15,-1 Q22,0 21,5 Q17,6 14,4 Z" fill="#EDE6F2"></path>
    <circle cx="19" cy="1" r="2.2" fill="#E58BA0" stroke="none"></circle>
    <circle cx="7" cy="-4" r="4.6" fill="#FFFDF5"></circle>
    <circle cx="8.4" cy="-3.6" r="2.8" fill="#2F2A45" stroke="none"></circle>
    <circle cx="9.2" cy="-4.6" r="1" fill="#FFFFFF" stroke="none"></circle>
    <path d="M-6,10 L10,10 L2,17 Z" fill="#F4C95D"></path>
    <ellipse cx="-4" cy="34" rx="5" ry="3" fill="#9D93B5"></ellipse>
    <ellipse cx="8" cy="34" rx="5" ry="3" fill="#9D93B5"></ellipse>
  </g>`

const PIS_BACK = `
  <g id="pis-back">
    <path d="M-17,26 Q-42,32 -44,12 Q-45,-2 -33,0" fill="none" stroke="#9D93B5" stroke-width="4" stroke-linecap="round"></path>
    <ellipse cx="0" cy="16" rx="16" ry="20" fill="#A79FC0"></ellipse>
    <circle cx="-11" cy="-13" r="9" fill="#A79FC0"></circle>
    <circle cx="11" cy="-13" r="9" fill="#A79FC0"></circle>
    <circle cx="0" cy="-2" r="13" fill="#A79FC0"></circle>
    <path d="M-8,8 L8,8 L0,16 Z" fill="#E0B94E"></path>
    <ellipse cx="-7" cy="35" rx="5" ry="3" fill="#9D93B5"></ellipse>
    <ellipse cx="6" cy="35" rx="5" ry="3" fill="#9D93B5"></ellipse>
  </g>`

export const DEFS = `
<defs>
  <linearGradient id="dWin" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FBE3A2"></stop><stop offset="1" stop-color="#F4C95D"></stop>
  </linearGradient>
  <radialGradient id="dGlow">
    <stop offset="0" stop-color="#F4C95D" stop-opacity="0.9"></stop>
    <stop offset="1" stop-color="#F4C95D" stop-opacity="0"></stop>
  </radialGradient>
  ${DET_FRONT}${DET_SIDE}${DET_BACK}
  ${PIS_FRONT}${PIS_SIDE}${PIS_BACK}
  <g id="dW">
    <rect x="-3" y="-3" width="24" height="32" rx="5" fill="#F4C95D" opacity="0.28" stroke="none"></rect>
    <rect x="0" y="0" width="18" height="26" rx="3" fill="url(#dWin)" stroke="#2F2A45" stroke-width="2"></rect>
    <path d="M9,1 V25 M1,13 H17" stroke="#2F2A45" stroke-width="1.3" opacity="0.7"></path>
  </g>
  <path id="spark" d="M0,-8 L2.2,-2.2 8,0 2.2,2.2 0,8 -2.2,2.2 -8,0 -2.2,-2.2 Z" fill="#F4C95D"></path>
</defs>
`

/** Jeux de symboles directionnels passés à Acteur. */
export const SPRITES_DETECTIVE = { front: '#det-front', side: '#det-side', back: '#det-back' }
export const SPRITES_PISTACHE = { front: '#pis-front', side: '#pis-side', back: '#pis-back' }

// ---------------------------------------------------------------------------
// Portraits (buste) paramétriques — pour dialogues, interrogatoires, déduction.
// Repère : viewBox conseillé « -60 -70 120 120 ». Tête centrée vers (0,-6).
// ---------------------------------------------------------------------------

export type Espece = 'chat' | 'souris' | 'hibou' | 'ecureuil' | 'oiseau'
export type Regard = 'normal' | 'severe' | 'endormi' | 'surpris'
export type Coiffe =
  | 'aucune' | 'deerstalker' | 'kepi' | 'foulard-pois' | 'casquette'
  | 'beret' | 'chef' | 'monocle' | 'noeud' | 'haut-de-forme'

export interface OptionsPortrait {
  espece: Espece
  fourrure: string
  ventre?: string
  accent?: string
  regard?: Regard
  coiffe?: Coiffe
  /** Couleur du vêtement suggéré sur les épaules. */
  habit?: string
}

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

function oreilles(espece: Espece, fourrure: string, accent: string): string {
  switch (espece) {
    case 'souris':
      return `<circle cx="-26" cy="-30" r="17" fill="${fourrure}"></circle>
        <circle cx="-26" cy="-30" r="9" fill="${accent}" stroke="none"></circle>
        <circle cx="26" cy="-30" r="17" fill="${fourrure}"></circle>
        <circle cx="26" cy="-30" r="9" fill="${accent}" stroke="none"></circle>`
    case 'hibou':
      return `<path d="M-34,-30 L-40,-52 L-18,-40 Z" fill="${fourrure}"></path>
        <path d="M34,-30 L40,-52 L18,-40 Z" fill="${fourrure}"></path>`
    case 'ecureuil':
      return `<path d="M-30,-30 Q-42,-52 -22,-46 Q-16,-40 -18,-32 Z" fill="${fourrure}"></path>
        <path d="M30,-30 Q42,-52 22,-46 Q16,-40 18,-32 Z" fill="${fourrure}"></path>
        <path d="M-30,-34 Q-38,-48 -24,-44" fill="${accent}" stroke="none" opacity="0.7"></path>
        <path d="M30,-34 Q38,-48 24,-44" fill="${accent}" stroke="none" opacity="0.7"></path>`
    case 'oiseau':
      return `<path d="M-24,-32 L-30,-46 L-12,-38 Z" fill="${fourrure}"></path>
        <path d="M24,-32 L30,-46 L12,-38 Z" fill="${fourrure}"></path>`
    case 'chat':
    default:
      return `<path d="M-30,-24 L-40,-50 L-12,-36 Z" fill="${fourrure}"></path>
        <path d="M-28,-28 L-34,-44 L-16,-35 Z" fill="${accent}" stroke="none"></path>
        <path d="M30,-24 L40,-50 L12,-36 Z" fill="${fourrure}"></path>
        <path d="M28,-28 L34,-44 L16,-35 Z" fill="${accent}" stroke="none"></path>`
  }
}

function museau(espece: Espece, ventre: string): string {
  if (espece === 'hibou' || espece === 'oiseau') {
    return `<ellipse cx="0" cy="2" rx="18" ry="14" fill="${ventre}"></ellipse>
      <path d="M0,0 L7,10 L0,16 L-7,10 Z" fill="#E9A64E" stroke="#2F2A45" stroke-width="1.6"></path>`
  }
  const nez = espece === 'souris' ? '#E58BA0' : '#D96C5C'
  return `<ellipse cx="0" cy="14" rx="17" ry="12" fill="${ventre}"></ellipse>
    <path d="M-4.5,10 L4.5,10 L0,15 Z" fill="${nez}" stroke="none"></path>
    <path d="M0,15 Q0,20 -5,21 M0,15 Q0,20 5,21" fill="none" stroke="#2F2A45" stroke-width="1.5" stroke-linecap="round"></path>`
}

function yeux(regard: Regard, fourrure: string): string {
  const blanc = (cx: number): string =>
    `<circle cx="${cx}" cy="-4" r="9.5" fill="#FFFDF5"></circle>`
  const pupille = (cx: number, r = 5.8): string =>
    `<circle cx="${cx}" cy="-3" r="${r}" fill="#2F2A45" stroke="none"></circle>
     <circle cx="${cx + 2}" cy="-5" r="1.8" fill="#FFFFFF" stroke="none"></circle>`
  switch (regard) {
    case 'severe':
      return `${blanc(-14)}${blanc(14)}${pupille(-14)}${pupille(14)}
        <path d="M-24,-6 A9,9 0 0 1 -4,-6 Z" fill="${fourrure}" stroke="none"></path>
        <path d="M24,-6 A9,9 0 0 1 4,-6 Z" fill="${fourrure}" stroke="none"></path>
        <path d="M-25,-13 L-6,-9 M25,-13 L6,-9" stroke="#2F2A45" stroke-width="2.4" stroke-linecap="round"></path>`
    case 'endormi':
      return `<path d="M-23,-3 Q-14,3 -5,-3 M5,-3 Q14,3 23,-3" fill="none" stroke="#2F2A45" stroke-width="2.4" stroke-linecap="round"></path>`
    case 'surpris':
      return `<circle cx="-14" cy="-4" r="11" fill="#FFFDF5"></circle>
        <circle cx="14" cy="-4" r="11" fill="#FFFDF5"></circle>
        ${pupille(-14, 4)}${pupille(14, 4)}`
    case 'normal':
    default:
      return `${blanc(-14)}${blanc(14)}${pupille(-14)}${pupille(14)}`
  }
}

function coiffeSVG(coiffe: Coiffe): string {
  switch (coiffe) {
    case 'deerstalker':
      return `<ellipse cx="0" cy="-24" rx="40" ry="9" fill="#75604B"></ellipse>
        <path d="M-37,-24 Q-39,-58 0,-61 Q39,-58 37,-24 Q0,-34 -37,-24 Z" fill="#8C7461"></path>
        <path d="M-34,-27 Q0,-37 34,-27" fill="none" stroke="#F4C95D" stroke-width="4" stroke-linecap="round"></path>`
    case 'kepi':
      return `<path d="M-34,-30 Q0,-40 34,-30 L34,-24 Q0,-30 -34,-24 Z" fill="#333D56"></path>
        <path d="M-32,-33 Q0,-56 32,-33 Q0,-42 -32,-33 Z" fill="#3F4A63"></path>
        <path d="M-30,-31 Q0,-38 30,-31" fill="none" stroke="#F4C95D" stroke-width="3"></path>
        <circle cx="0" cy="-44" r="4.5" fill="#F4C95D" stroke="none"></circle>`
    case 'foulard-pois':
      return `<path d="M-38,-22 Q0,-56 38,-22 Q0,-34 -38,-22 Z" fill="#B96A4B"></path>
        <circle cx="-18" cy="-30" r="2.6" fill="#F2EDE0" stroke="none"></circle>
        <circle cx="4" cy="-38" r="2.6" fill="#F2EDE0" stroke="none"></circle>
        <circle cx="22" cy="-28" r="2.6" fill="#F2EDE0" stroke="none"></circle>
        <path d="M34,-24 Q46,-20 42,-10 Q38,-16 30,-18 Z" fill="#B96A4B"></path>`
    case 'casquette':
      return `<path d="M-36,-28 Q0,-38 36,-28 Q0,-32 -36,-28 Z" fill="#6B4A36"></path>
        <path d="M-34,-30 Q0,-52 34,-30 Q0,-40 -34,-30 Z" fill="#7C5A44"></path>
        <path d="M20,-29 Q42,-28 40,-22 Q30,-25 18,-26 Z" fill="#55391F"></path>`
    case 'beret':
      return `<path d="M-34,-28 Q0,-52 34,-28 Q0,-36 -34,-28 Z" fill="#7A4E86"></path>
        <circle cx="0" cy="-50" r="4" fill="#5E3A68" stroke="none"></circle>`
    case 'chef':
      return `<rect x="-26" y="-40" width="52" height="18" rx="6" fill="#F5F1E6"></rect>
        <path d="M-26,-38 Q-34,-58 -14,-52 Q-4,-64 8,-54 Q22,-62 26,-44 Z" fill="#F5F1E6"></path>`
    case 'haut-de-forme':
      return `<ellipse cx="0" cy="-26" rx="34" ry="7" fill="#2B2740"></ellipse>
        <rect x="-22" y="-58" width="44" height="34" rx="3" fill="#33304A"></rect>
        <rect x="-22" y="-34" width="44" height="6" fill="#8A6B3F"></rect>`
    case 'monocle':
      return `<circle cx="14" cy="-4" r="13" fill="none" stroke="#F4C95D" stroke-width="2.5"></circle>
        <path d="M14,9 L20,22" stroke="#8A6B3F" stroke-width="1.5"></path>`
    case 'noeud':
      return `<path d="M-30,-28 Q-8,-32 0,-24 Q8,-32 30,-28 Q8,-24 0,-24 Q-8,-24 -30,-28 Z" fill="#C4574E"></path>
        <circle cx="0" cy="-25" r="4" fill="#A8433B" stroke="none"></circle>`
    case 'aucune':
    default:
      return ''
  }
}

function moustaches(): string {
  return `<g stroke="#6E6559" stroke-width="3" stroke-linecap="round" fill="none">
      <path d="M-14,16 Q-34,12 -44,18"></path><path d="M-14,20 Q-32,20 -42,26"></path>
      <path d="M14,16 Q34,12 44,18"></path><path d="M14,20 Q32,20 42,26"></path>
    </g>`
}

/** Portrait buste complet, prêt à insérer dans un <svg viewBox="-60 -70 120 128">. */
export function portraitSVG(o: OptionsPortrait): string {
  const fourrure = o.fourrure
  const ventre = o.ventre ?? '#F2EDE0'
  const accent = o.accent ?? '#E9AFBB'
  const habit = o.habit ?? '#57506F'
  const grosse = o.coiffe === 'casquette' && o.espece === 'chat'

  const epaules = `<path d="M-46,58 Q-46,24 0,24 Q46,24 46,58 Z" fill="${habit}" stroke="#2F2A45" stroke-width="2.4" stroke-linejoin="round"></path>
    <ellipse cx="0" cy="28" rx="20" ry="10" fill="${fourrure}" stroke="none"></ellipse>`

  return `<g stroke="#2F2A45" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
    ${epaules}
    ${oreilles(o.espece, fourrure, accent)}
    <circle cx="0" cy="-2" r="${grosse ? 38 : 34}" fill="${fourrure}"></circle>
    ${museau(o.espece, ventre)}
    ${o.espece === 'chat' && o.coiffe === 'casquette' ? moustaches() : ''}
    ${yeux(o.regard ?? 'normal', fourrure)}
    ${coiffeSVG(o.coiffe ?? 'aucune')}
  </g>`
}

// --- Présets des personnages nommés (planches) -----------------------------

export const PORTRAITS: Record<string, OptionsPortrait> = {
  detective: { espece: 'chat', fourrure: '#8C93A8', ventre: '#F2EDE0', accent: '#E9AFBB', coiffe: 'deerstalker', habit: '#C4574E' },
  pistache: { espece: 'souris', fourrure: '#B4AECB', ventre: '#EDE6F2', accent: '#F0B9C6', coiffe: 'aucune', habit: '#9D93B5' },
  griffe: { espece: 'chat', fourrure: '#7C8698', ventre: '#E8E4DA', accent: '#8A94A6', regard: 'severe', coiffe: 'kepi', habit: '#4A5470' },
  sardine: { espece: 'chat', fourrure: '#8FA3B0', ventre: '#F2EDE0', accent: '#A6B5C0', coiffe: 'foulard-pois', habit: '#59677A' },
  moustache: { espece: 'chat', fourrure: '#A8A39B', ventre: '#F2EDE0', accent: '#B8B3A9', coiffe: 'casquette', habit: '#8A7B5C' },
  /** Visage révélé du Fantôme Gris — n'apparaît QU'APRÈS la manche 3. */
  demasque: { espece: 'chat', fourrure: '#BFBCCE', ventre: '#E8E6EF', accent: '#A5A2BB', coiffe: 'haut-de-forme', habit: '#8E8AA6' },
}

// ---------------------------------------------------------------------------
// Le Fantôme Gris (planche `da/planches/Planche Fantôme Gris.dc.html`).
// Règle de la planche : JAMAIS de visage tant qu'il n'est pas démasqué —
// silhouette gris perle, cape, haut-de-forme, gants. Repère : y=0 au sol,
// sommet du chapeau à y=-176.
// ---------------------------------------------------------------------------

export const PALETTE_FG = {
  perle: '#BFBCCE',
  cape: '#8E8AA6',
  chapeau: '#625D7A',
  bord: '#55506B',
  col: '#A5A2BB',
  gants: '#E8E6EF',
  argent: '#D8D5E4',
} as const

/**
 * Silhouette du Fantôme Gris, de l'ombre d'encre au personnage complet.
 * @param niveau 0 → 6 (nombre de fragments réunis) : la silhouette se précise.
 */
export function fantomeGrisSVG(niveau: number): string {
  const n = Math.max(0, Math.min(6, niveau))
  const encre = '#2F2A45'
  // Jusqu'à 4 fragments : aplat d'encre. À 5 : la couleur monte. À 6 : complet.
  const ombre = n < 5
  const c = (couleur: string): string => (ombre ? encre : couleur)
  const opacite = [0.14, 0.28, 0.42, 0.58, 0.75, 0.9, 1][n]!
  const cerne = n >= 3 ? `stroke="${encre}" stroke-width="3" stroke-linejoin="round"` : 'stroke="none"'
  const or = n >= 4 ? '#F4C95D' : c('#F4C95D')
  const details = n >= 5

  return `<g opacity="${opacite}" ${cerne} fill="none">
    <path d="M28,-8 Q56,-4 60,-28 Q62,-44 48,-40" fill="none" stroke="${c(PALETTE_FG.perle)}" stroke-width="6" stroke-linecap="round"></path>
    <path d="M0,-110 Q-30,-100 -38,-60 Q-46,-20 -34,0 L34,0 Q46,-20 38,-60 Q30,-100 0,-110 Z" fill="${c(PALETTE_FG.cape)}"></path>
    ${details ? `<path d="M-30,-70 Q-34,-36 -28,-8" fill="none" stroke="${PALETTE_FG.argent}" stroke-width="2.5" opacity="0.7"></path>` : ''}
    <path d="M-20,-106 Q0,-120 20,-106 L14,-94 Q0,-104 -14,-94 Z" fill="${c(PALETTE_FG.col)}"></path>
    <circle cx="0" cy="-118" r="21" fill="${c(PALETTE_FG.perle)}"></circle>
    <ellipse cx="0" cy="-134" rx="29" ry="6" fill="${c(PALETTE_FG.bord)}"></ellipse>
    <rect x="-19" y="-176" width="38" height="42" rx="3" fill="${c(PALETTE_FG.chapeau)}"></rect>
    <path d="M-19,-142 H19" stroke="${or}" stroke-width="3.5"></path>
    <path d="M30,-78 Q48,-72 54,-60" fill="none" stroke="${c(PALETTE_FG.cape)}" stroke-width="10" stroke-linecap="round"></path>
    <circle cx="57" cy="-57" r="7" fill="${c(PALETTE_FG.gants)}"></circle>
  </g>`
}

/** Silhouette autonome (page F.G. du carnet, avatar de confrontation). */
export function fantomeGrisAvatar(niveau: number, taille = 120): string {
  return `<svg class="silhouette-fg" viewBox="-80 -190 160 200" width="${taille}" height="${taille * 1.25}" aria-hidden="true">${fantomeGrisSVG(niveau)}</svg>`
}

/** Rend un portrait complet dans un <svg> autonome (avatar de bulle, etc.). */
export function portraitAvatar(o: OptionsPortrait, taille = 84): string {
  return `<svg class="portrait" viewBox="-60 -70 120 128" width="${taille}" height="${taille}" aria-hidden="true">${portraitSVG(o)}</svg>`
}

export { esc }
