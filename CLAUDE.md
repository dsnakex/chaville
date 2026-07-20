# Mystères à Chaville — instructions pour Claude Code

Jeu éducatif mobile (9–12 ans) : un jeune chat détective résout des enquêtes dans la ville de Chaville. Trois compétences travaillées en jouant : mémoire/observation, lecture/vocabulaire, maths/logique. Projet mené par Pascal ; la conception (scénario, décisions) se fait dans une session Claude Cowork séparée — ce fichier est la source de vérité côté code.

## Fichiers du dépôt
- `index.html` — menu d'accueil (PWA start_url)
- `academie.html` — jeu principal v2 : carte de Chaville, 6 enquêtes en mode « écrans » (observation chronométrée → questions → anagrammes → calculs → déduction)
- `demo.html` — démo « aventure » : scène du marché explorable, tap-to-move, pixel art dessiné par le code, PNJ, indices, carnet du détective
- `manifest.json`, `sw.js` — PWA installable et hors ligne. **À chaque déploiement, incrémenter le nom du cache dans `sw.js`** (`chaville-v2` → `chaville-v3`…), sinon les joueurs gardent l'ancienne version.
- `icon-192.png`, `icon-512.png` — icône chat détective pixel art
- Déploiement : Vercel importe ce dépôt ; chaque push sur `main` redéploie automatiquement.

## Contraintes techniques (à respecter)
- **Un seul fichier HTML par jeu** : CSS et JS inline, aucun asset externe, aucun framework, aucun CDN. Tout le graphisme est dessiné par le code (pixel art via matrices de caractères sur canvas, emojis pour les props).
- **Mobile-first** : boutons tactiles larges, portrait, le canvas doit toujours tenir dans l'écran (`max-height: calc(100dvh - …)`), `image-rendering: pixelated`.
- Tout le texte du jeu est en **français**, ton chaleureux, adapté aux 9–12 ans.
- `localStorage` est autorisé (site déployé) — prévu pour la sauvegarde de progression.

## Direction artistique

Pipeline hybride (validé le 20/07/2026) : les décors des lieux sont des images générées par IA (assets/decors/, prompts archivés dans assets/prompts.md, référence de style : port.png). Tout le reste — personnages, UI, brume animée, indices scintillants, éléments interactifs — est dessiné en vectoriel par le code, PAR-DESSUS ces fonds. Les symboles #cat-det, #mouse-pal, #spark de da/direction-artistique.html sont la référence des personnages.

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
