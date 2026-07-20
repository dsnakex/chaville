/**
 * Vocabulaire graphique de la DA « Heure bleue encrée ».
 * Les symboles sont repris à l'identique de da/direction-artistique.html —
 * c'est la référence canon des personnages, ne pas les redessiner ici.
 */

export const PALETTE = {
  encre: '#2F2A45',
  or: '#F4C95D',
  orClair: '#FBE3A2',
  creme: '#FBF0D4',
  brume: '#C7BBD4',
  ardoise: '#57506F',
  braise: '#C9776B',
  pave: '#4E4668',
} as const

/** Bloc <defs> injecté une seule fois par page. */
export const DEFS = `
<defs>
  <linearGradient id="dWin" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FBE3A2"></stop><stop offset="1" stop-color="#F4C95D"></stop>
  </linearGradient>
  <radialGradient id="dGlow">
    <stop offset="0" stop-color="#F4C95D" stop-opacity="0.9"></stop>
    <stop offset="1" stop-color="#F4C95D" stop-opacity="0"></stop>
  </radialGradient>
  <filter id="dBlur" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="10"></feGaussianBlur>
  </filter>

  <g id="cat-det">
    <path d="M-30,100 C-64,96 -72,60 -46,54 C-60,66 -54,88 -26,90 Z" fill="#8F6242"></path>
    <ellipse cx="0" cy="95" rx="36" ry="42" fill="#A9744F"></ellipse>
    <ellipse cx="0" cy="106" rx="21" ry="29" fill="#EBD9BC"></ellipse>
    <ellipse cx="-15" cy="135" rx="11" ry="7" fill="#8F6242"></ellipse>
    <ellipse cx="15" cy="135" rx="11" ry="7" fill="#8F6242"></ellipse>
    <path d="M-34,0 L-44,-24 L-14,-12 Z" fill="#A9744F"></path>
    <path d="M-32,-4 L-38,-18 L-20,-11 Z" fill="#E8B48B" stroke="none"></path>
    <path d="M34,0 L44,-24 L14,-12 Z" fill="#A9744F"></path>
    <path d="M32,-4 L38,-18 L20,-11 Z" fill="#E8B48B" stroke="none"></path>
    <circle cx="0" cy="28" r="36" fill="#A9744F"></circle>
    <ellipse cx="0" cy="42" rx="17" ry="12" fill="#EBD9BC"></ellipse>
    <circle cx="-14" cy="24" r="9.5" fill="#FFFDF5"></circle>
    <circle cx="14" cy="24" r="9.5" fill="#FFFDF5"></circle>
    <circle cx="-13" cy="25" r="5.8" fill="#2F2A45" stroke="none"></circle>
    <circle cx="15" cy="25" r="5.8" fill="#2F2A45" stroke="none"></circle>
    <circle cx="-11" cy="23" r="2" fill="#FFFFFF" stroke="none"></circle>
    <circle cx="17" cy="23" r="2" fill="#FFFFFF" stroke="none"></circle>
    <path d="M-4.5,35 L4.5,35 L0,40 Z" fill="#D96C5C" stroke="none"></path>
    <path d="M0,40 Q0,45 -5,46 M0,40 Q0,45 5,46" fill="none" stroke="#2F2A45" stroke-width="1.6" stroke-linecap="round"></path>
    <g stroke="#2F2A45" stroke-width="1.2" opacity="0.45" stroke-linecap="round">
      <path d="M-19,37 L-34,34"></path><path d="M-19,42 L-33,43"></path>
      <path d="M19,37 L34,34"></path><path d="M19,42 L33,43"></path>
    </g>
    <circle cx="-9" cy="36" r="1" fill="#8F6242" stroke="none"></circle>
    <circle cx="9" cy="36" r="1" fill="#8F6242" stroke="none"></circle>
    <ellipse cx="0" cy="6" rx="39" ry="8.5" fill="#75604B"></ellipse>
    <path d="M-36,6 Q-38,-28 0,-31 Q38,-28 36,6 Q0,-4 -36,6 Z" fill="#8C7461"></path>
    <path d="M-33,3 Q0,-7 33,3" fill="none" stroke="#F4C95D" stroke-width="4" stroke-linecap="round"></path>
    <path d="M-26,56 Q0,72 26,56 L26,70 Q0,86 -26,70 Z" fill="#C4574E"></path>
    <path d="M12,72 Q20,96 10,112 L-4,106 Q6,92 0,74 Z" fill="#C4574E"></path>
    <path d="M10,112 L7,120 M2,109 L-1,117" stroke="#F4C95D" stroke-width="2.5" stroke-linecap="round" fill="none"></path>
    <path d="M24,74 L50,56" stroke="#A9744F" stroke-width="14" stroke-linecap="round" fill="none"></path>
    <circle cx="52" cy="54" r="8.5" fill="#B08154"></circle>
    <path d="M54,50 L66,34" stroke="#6B4A36" stroke-width="6" stroke-linecap="round" fill="none"></path>
    <circle cx="74" cy="24" r="17" fill="#CFE3EA" fill-opacity="0.55" stroke="#F4C95D" stroke-width="5"></circle>
    <path d="M65,17 A13,13 0 0 1 74,11" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" opacity="0.85"></path>
  </g>

  <g id="mouse-pal">
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
  </g>

  <g id="dW">
    <rect x="-3" y="-3" width="24" height="32" rx="5" fill="#F4C95D" opacity="0.28" stroke="none"></rect>
    <rect x="0" y="0" width="18" height="26" rx="3" fill="url(#dWin)" stroke="#2F2A45" stroke-width="2"></rect>
    <path d="M9,1 V25 M1,13 H17" stroke="#2F2A45" stroke-width="1.3" opacity="0.7"></path>
  </g>

  <path id="spark" d="M0,-8 L2.2,-2.2 8,0 2.2,2.2 0,8 -2.2,2.2 -8,0 -2.2,-2.2 Z" fill="#F4C95D"></path>
</defs>
`
