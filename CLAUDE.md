# Mystères à Chaville — instructions pour Claude Code

Jeu éducatif mobile (9–12 ans) : un jeune chat détective résout des enquêtes dans la ville de Chaville. Trois compétences travaillées en jouant : mémoire/observation, lecture/vocabulaire, maths/logique. Projet mené par Pascal ; la conception (scénario, décisions) se fait dans une session Claude Cowork séparée — ce fichier est la source de vérité côté code.

## Fichiers du dépôt
- `index.html` — menu d'accueil (PWA start_url)
- `academie.html` — jeu principal v2 : carte de Chaville, 6 enquêtes en mode « écrans » (observation chronométrée → questions → anagrammes → calculs → déduction)
- `demo.html` — démo « aventure » : scène du marché explorable, tap-to-move, pixel art dessiné par le code, PNJ, indices, carnet du détective
- `manifest.json`, `sw.js` — PWA installable et hors ligne. **À chaque déploiement, incrémenter le nom du cache dans `sw.js`** (`chaville-v2` → `chaville-v3`…), sinon les joueurs gardent l'ancienne version.
- `icon-192.png`, `icon-512.png` — icône chat détective pixel art
- Déploiement : Vercel importe ce dépôt ; chaque push sur `main` redéploie automatiquement.

## 🎨 Direction artistique « Heure bleue encrée » (validée le 19/07/2026 — canon officiel)
Le pixel art des prototypes est ABANDONNÉ. Tout nouveau visuel suit la DA validée dans Claude Design, documentée dans `da/direction-artistique.html` (scène canon + palette + symboles réutilisables) et `da/maquette-marche.html` (transposition de la scène du marché).
- **Signature** : silhouettes d'ardoise cernées d'un **trait d'encre #2F2A45** (stroke 3 décors, 2.2 personnages, linejoin round). Vieux bourg, pas de bord de mer.
- **Ciel** : dégradé heure bleue #2F2A45 → #5A4A72 → braise #C9776B à l'horizon. Étoiles/lune crème #FBF0D4.
- **Bâtiments** : ardoises #57506F / #615878 / prune #6E5A6B, toits #3B3554, légères rotations (±1,4–1,8°), hachures discrètes, colombages en traits d'encre épais.
- **Lumière** : elle vient des fenêtres, enseignes, réverbères et indices — or #F4C95D (dégradé #FBE3A2→#F4C95D), halos radiaux, flaques de lumière au sol (ellipses or, opacité .22–.25).
- **Enseignes** : lettrage or en Fredoka (letter-spacing 1.5) + panneau suspendu à pictogramme.
- **Personnages** : construction ronde, grands yeux #FFFDF5 à pupilles d'encre et reflet, museau crème. Détective : pelage #A9744F, chapeau à bande or, écharpe #C4574E, loupe cerclée d'or. Pistache : #B4AECB, carnet à la patte. Symboles SVG prêts : `#cat-det`, `#mouse-pal`, `#dW` (fenêtre dorée), `#spark`.
- **Brume** : ellipses #C7BBD4 floutées (blur 10, opacité .2–.28) au ras des pavés #4E4668→#37324E.
- **Pipeline hybride (validé le 20/07/2026)** : les décors des lieux sont des images générées par IA (`assets/decors/`, prompts archivés dans `assets/prompts.md`, référence de style : `port.png`). Tout le reste — personnages, PNJ, UI, brume animée, indices scintillants, éléments interactifs — est dessiné en vectoriel par le code, PAR-DESSUS ces fonds (voir `da/test-composite-port.html` pour l'assemblage type). Les symboles `#cat-det`, `#mouse-pal`, `#dW`, `#spark` de `da/direction-artistique.html` sont la référence des personnages.
- Les nouveaux personnages sont d'abord validés par Pascal dans Claude Design, puis intégrés en SVG dans ce vocabulaire ; les nouveaux décors sont générés par IA d'image avec `port.png` en référence et leur prompt est archivé dans `assets/prompts.md`.

## Contraintes techniques (à respecter)
- **Stack** : les fichiers v1 (`academie.html`, `demo.html`) sont des HTML autonomes ; à partir de la session 2, le projet migre vers **TypeScript + Vite** (multi-fichiers, build automatique sur Vercel). Aucun framework lourd, aucun CDN externe.
- **Graphisme — pipeline hybride** : les décors des lieux sont des images PNG (`assets/decors/`) ; TOUT le reste — personnages, PNJ, UI, effets, éléments interactifs — est dessiné par le code (SVG/Canvas) par-dessus ces fonds. L'ancienne règle « tout le graphisme est dessiné par le code » ne s'applique donc plus aux décors, uniquement au reste.
- **Mobile-first** : boutons tactiles larges, portrait, le canvas doit toujours tenir dans l'écran (`max-height: calc(100dvh - …)`), `image-rendering: pixelated`.
- Tout le texte du jeu est en **français**, ton chaleureux, adapté aux 9–12 ans.
- `localStorage` est autorisé (site déployé) — prévu pour la sauvegarde de progression.

## Règles d'écriture (importantes)
- **Signature narrative** : chaque affaire semble surnaturelle (bateau fantôme, grimoire ensorcelé…) mais la déduction révèle une explication rationnelle et attendrissante. La raison triomphe du « c'est magique ».
- **Zéro violence, zéro punition cruelle.** Les petits coupables ont des motifs touchants.
- Les indices ne doivent **jamais éliminer le vrai coupable**, et la déduction finale doit toujours laisser **au moins 2 suspects plausibles** (vérifier la cohérence à chaque nouvelle enquête).
- Personnages fixes : le héros (jeune détective), le **commissaire Griffe** (chartreux bougon, « chaton »), **Pistache** (souris gourmande, acolyte — c'est elle qui donne les indices d'aide).
- Difficulté progressive au fil de la carte : observation 25 s → 15 s, questions 3 → 4, mots 2 courts → 3 longs, calculs 1 → 2 étapes, suspects 5 → 7.

## ⚠️ SPOILERS — arc du Fantôme Gris (ne pas révéler dans l'interface avant l'enquête bonus)
Antagoniste fil rouge : le **Fantôme Gris**, maître voleur théâtral façon Carmen Sandiego, jamais cruel. Carte de visite grise « F.G. » après chaque enquête, un fragment d'indice par affaire (fil de gant élégant au Manoir, connaissance des marées au Port, vol du livre « Les passages secrets de Chaville » à la Bibliothèque, loge « M. Gris » au Théâtre, plan déjoué à la Tour de l'Horloge). Identité révélée uniquement dans l'enquête bonus « Les Toits de Chaville » : **Balthazar**, ancien élève brillant de l'Académie et ex-coéquipier de Griffe. Il est coincé par la logique, se rend avec panache, promet de s'évader (ouverture saison 2).

## Feuille de route (mode aventure = généraliser demo.html)
1. ✅ Démo marché (tap-to-move, carnet, teaser F.G.)
2. Moteur généralisé : sprites 4 directions, transitions de scènes, hub carte, scènes Manoir + Port
3. Scènes Bibliothèque + Théâtre + Tour · carnet persistant inter-enquêtes (+ page F.G.) · dialogues à choix
4. Fil rouge Fantôme Gris complet + enquête bonus des Toits + équilibrage
5. Sons/musique (WebAudio), polish animations, sauvegarde (localStorage)
6. Packaging Capacitor → APK Android (la PWA couvre déjà l'installation simple)

## Vérifications avant chaque push
- Syntaxe JS : extraire le `<script>` et `node --check`
- Cohérence des enquêtes : coupable jamais éliminé par les indices, ≥ 2 suspects restants avant la déduction, anagrammes ≠ mot cible, réponses QCM valides
- Tester l'affichage aux tailles téléphone (360×640) et desktop
- Incrémenter la version du cache `sw.js`
