# Mystères à Chaville — instructions pour Claude Code

Jeu éducatif mobile (9–12 ans) : un jeune chat détective résout des enquêtes dans la ville de Chaville. Quatre compétences travaillées en jouant : mémoire/observation, lecture/vocabulaire, maths/logique, et raisonnement spatial (via les casse-têtes). Projet mené par Pascal ; la conception (scénario, décisions) se fait dans une session Claude Cowork séparée — ce fichier est la source de vérité côté code.

## Fichiers du dépôt
Depuis la migration Vite (session 2), la racine ne contient plus que les pages entrées du build ; tout ce qui doit être servi tel quel vit dans `public/`.
- `index.html` — menu d'accueil (PWA start_url), entrée Vite
- `aventure.html` + `src/` — **mode aventure v3** en TypeScript : moteur de scènes tap-to-move, décors PNG + personnages vectoriels, carnet persistant, mini-jeux. Entrée Vite.
  - `src/engine/` — `game.ts` (orchestrateur, HUD, transitions), `hub.ts` (carte de Chaville, verrous/étoiles), `scene-view.ts` (rendu + interactions), `actor.ts` (marche, profondeur, 4 directions), `geom.ts` (trapèze + obstacles)
  - `src/scenes/` — une scène = un fichier de données (`grand-place`, `port`, `manoir`, `bibliotheque`, `theatre`, `tour`)
  - `src/minigames/` — `socle.ts` (ossature + achat d'indice en croquettes), enquête (observation, message codé, calcul, déduction), `puzzles.ts` (devinette, miroir, silhouette, grille, taquin), `confrontation.ts` (finale en 3 manches)
  - `src/ui/carte-fg.ts` — les 6 cartes de visite du Fantôme Gris, **textes verbatim** du pack narratif
  - `src/ui/` — `dialogue.ts` (bulles + interrogatoires à choix), `carnet.ts` (onglets Indices/Témoins/F.G.), `modal.ts`, `onboarding.ts` (3 bulles de la première minute)
  - `src/audio.ts` — sons WebAudio synthétisés (aucun fichier externe) : bonne réponse, victoire, étincelle ; respecte le drapeau `muet`
  - `src/art.ts` — sprites du héros (front/side/back), `corpsSVG()` (PNJ en pied, tenue + accessoire) et `portraitSVG()` (bustes : avatars de dialogue, déduction) ; la tête est partagée par les deux registres. Vocabulaire des planches `da/planches/`
  - `public/fonts/` — Fredoka + Nunito auto-hébergées (`.woff2`)
- `public/academie.html` — jeu v2 : carte de Chaville, 6 enquêtes en mode « écrans ». Servi tel quel, hors bundler.
- `public/demo.html` — démo pixel art v1, conservée en archive. Servie telle quelle.
- `public/manifest.json`, `public/sw.js` — PWA installable et hors ligne. **À chaque déploiement, incrémenter le nom du cache dans `sw.js`** (`chaville-v3` → `chaville-v4`…), sinon les joueurs gardent l'ancienne version.
- `public/icon-192.png`, `public/icon-512.png` — icône chat détective
- `assets/decors/` — décors PNG. **Restent à la racine** (pas dans `public/`) : leur URL doit être stable (`/assets/decors/*.png`) pour le préchargement du service worker et les références relatives de `da/`. Recopiés dans `dist/` par un plugin de `vite.config.ts`.
- `da/` — direction artistique (référence, non déployée). `da/planches/` contient les planches Claude Design validées (personnages, Fantôme Gris, UI, carte, lieux) — références visuelles de la session 3.
- Déploiement : Vercel importe ce dépôt et lance `npm run build` (`vercel.json`) ; chaque push sur `main` redéploie automatiquement.

## 🎨 Direction artistique « Heure bleue encrée » (validée le 19/07/2026 — canon officiel)
Le pixel art des prototypes est ABANDONNÉ. Tout nouveau visuel suit la DA validée dans Claude Design, documentée dans `da/direction-artistique.html` (scène canon + palette + symboles réutilisables) et `da/maquette-marche.html` (transposition de la scène du marché).
- **Signature** : silhouettes d'ardoise cernées d'un **trait d'encre #2F2A45** (stroke 3 décors, 2.2 personnages, linejoin round). Vieux bourg, pas de bord de mer.
- **Ciel** : dégradé heure bleue #2F2A45 → #5A4A72 → braise #C9776B à l'horizon. Étoiles/lune crème #FBF0D4.
- **Bâtiments** : ardoises #57506F / #615878 / prune #6E5A6B, toits #3B3554, légères rotations (±1,4–1,8°), hachures discrètes, colombages en traits d'encre épais.
- **Lumière** : elle vient des fenêtres, enseignes, réverbères et indices — or #F4C95D (dégradé #FBE3A2→#F4C95D), halos radiaux, flaques de lumière au sol (ellipses or, opacité .22–.25).
- **Enseignes** : lettrage or en Fredoka (letter-spacing 1.5) + panneau suspendu à pictogramme.
- **Personnages** : construction ronde, grands yeux #FFFDF5 à pupilles d'encre et reflet, museau crème. Détective : **chat gris tigré #8C93A8** (rayures/ombre #6E7488, ventre #F2EDE0, oreilles roses #E9AFBB — planche session 3 validée le 21/07/2026 ; abandon du brun #A9744F des prototypes), chapeau deerstalker #8C7461 à bande or, écharpe #C4574E, loupe cerclée d'or. Pistache : #B4AECB, foulard et carnet à la patte. Habitants : Griffe (chartreux #7C8698, képi), Madame Sardine (#8FA3B0, foulard à pois), Moustache (#A8A39B, casquette de tweed). Les personnages en pied vivent dans `src/art.ts` (poses front/side/back) et les portraits (bulles, interrogatoires, déduction) sont générés par `portraitSVG()` (chat/souris/hibou/écureuil/oiseau paramétrés).
- **Brume** : ellipses #C7BBD4 floutées (blur 10, opacité .2–.28) au ras des pavés #4E4668→#37324E.
- **Pipeline hybride (validé le 20/07/2026)** : les décors des lieux sont des images générées par IA (`assets/decors/`, prompts archivés dans `assets/prompts.md`, référence de style : `port.png`). Tout le reste — personnages, PNJ, UI, brume animée, indices scintillants, éléments interactifs — est dessiné en vectoriel par le code, PAR-DESSUS ces fonds (voir `da/test-composite-port.html` pour l'assemblage type). Les symboles `#cat-det`, `#mouse-pal`, `#dW`, `#spark` de `da/direction-artistique.html` sont la référence des personnages.
- Les nouveaux personnages sont d'abord validés par Pascal dans Claude Design, puis intégrés en SVG dans ce vocabulaire ; les nouveaux décors sont générés par IA d'image avec `port.png` en référence et leur prompt est archivé dans `assets/prompts.md`.
- **Fidélité aux planches (règle ferme) : ne JAMAIS approximer une forme qui existe déjà dans `da/planches/`.** Les planches contiennent le SVG source ; on en extrait les tracés (`d`) et on les transpose dans le repère de tête partagé de `src/art.ts` (le repère des planches : crâne centré en **(0,0)**), en laissant le trait d'encre 2.2 être hérité du groupe parent. Les têtes des personnages nommés vivent dans `TETES_PLANCHE` et sont activées par le champ `planche` de leur préset ; couvrent aujourd'hui `detective`, `griffe`, `sardine`, `moustache` (planches 1-2), `duchesse`, `plume`, `sopranino` (habitants n° 2), `barnabe`, `malo`, `paillette`, `hector`, `lontra` (coupables) et `demasque` (planche SPOILER). Le générateur paramétrique reste la base des **suspects génériques** uniquement.
  - **Corpulence = indice d'enquête** : les champs `taille` / `largeur` d'un préset mettent le corps ET le buste à l'échelle autour de la ligne de sol (les pieds ne bougent pas). Contractuel : Barnabé lit gros (grosses empreintes de farine), Malo nettement plus petit que les adultes (petites pattes). Lontra garde ses dents pointues + aspect mouillé, Hector ses plumes qui se détachent, Paillette ses fils dorés.
  - **⚠️ Confidentialité F.G.** : la tête du démasqué a la **clé neutre `demasque`** — jamais de fichier ni de clé au nom du personnage (les enfants fouillent le code). Le nom réel n'apparaît que là où la narration l'exige (`minigames/confrontation.ts`, `ui/dialogue.ts`).
  - La galerie de contrôle `da/galerie-personnages.html` est **générée depuis `src/art.ts`** — la régénérer après toute retouche des personnages.

## Règles d'affordance (playtest Pascal — s'appliquent à TOUTES les scènes)
Retour de playtest validé le 21/07/2026. Toute nouvelle scène doit les respecter (implémentées dans `src/engine/scene-view.ts` + `game.ts`).
1. **Aucune zone interactive invisible.** Chaque PNJ interactif est **dessiné EN PIED** — corps entier généré par `corpsSVG()` (`src/art.ts`), au même niveau de traitement que le héros : proportions rondes, trait d'encre 2.2, grands yeux, **tenue et accessoire distinctifs** (`tenue` : manteau/tablier/robe/gilet/écharpe · `accessoire` : carnet/poisson/livre/canne/éventail). Repère commun : pieds à y=138, tête réutilisée de `portraitSVG()`. Chaque objet interactif (horloge, caisses…) porte un **signal permanent** (étincelle d'or). Les **portraits en buste restent réservés** aux avatars de dialogue et aux alignements de suspects de la déduction.
   - **Micro-animations d'attente** (subtiles, jamais de gesticulation) : respiration lente (`.pnj-corps`), balancement de queue (`.pnj-queue`), clignement occasionnel (`.pnj-yeux`), désynchronisées par `--pnj-decalage` (hash de l'id du hotspot — pas de sa position, souvent multiple de 10).
   - Un PNJ déjà rencontré **reste à son poste** (calque `.pnj-statique`) : les habitants ne disparaissent pas de la scène.
   - PNJ nommés attendus à leur poste : Griffe, Madame Sardine, Moustache, la Duchesse (Manoir), Mademoiselle Plume (Bibliothèque), Madame Sopranino (Théâtre), et chaque témoin d'enquête.
2. **Affordance renforcée des indices** : halo pulsant large (`.halo-pulse`, échelle + opacité lentes), étincelle d'or **cerclée d'un trait d'encre #2F2A45** pour contraster sur les zones claires (brume), cible tactile **≥ 44 px** (cercle transparent r=56 en coord. scène).
3. **Bouton loupe 🔍 au HUD** (`hud-loupe`) : pressé, il fait scintiller fortement (~2 s) tous les points interactifs restants de la scène (`VueScene.montrerIndices()`).
4. **Coup de pouce de Pistache** : après ~35 s sans nouvel indice trouvé (et hors interaction/panneau), Pistache souffle spontanément une orientation en une phrase (`soufflerAstuce()`). Chaque hotspot peut définir une `astuce` ; sinon une phrase est générée depuis son `libelle`.

## Contraintes techniques (à respecter)
- **Stack** : les fichiers v1 (`academie.html`, `demo.html`) sont des HTML autonomes ; à partir de la session 2, le projet migre vers **TypeScript + Vite** (multi-fichiers, build automatique sur Vercel). Aucun framework lourd, aucun CDN externe. Les polices **Fredoka** (titres) et **Nunito** (corps) sont **auto-hébergées** en `.woff2` dans `public/fonts/` (jamais de lien Google Fonts).
- **Graphisme — pipeline hybride** : les décors des lieux sont des images PNG (`assets/decors/`) ; TOUT le reste — personnages, PNJ, UI, effets, éléments interactifs — est dessiné par le code (SVG/Canvas) par-dessus ces fonds. L'ancienne règle « tout le graphisme est dessiné par le code » ne s'applique donc plus aux décors, uniquement au reste.
- **Mobile-first** : boutons tactiles larges, portrait, la scène doit toujours tenir dans l'écran (testé à 360 × 640). `image-rendering: pixelated` ne s'applique **qu'aux écrans pixel art hérités** (`public/demo.html`) : les décors peints ne doivent jamais être rendus en pixelated.
- Tout le texte du jeu est en **français**, ton chaleureux, adapté aux 9–12 ans.
- `localStorage` est autorisé (site déployé) — prévu pour la sauvegarde de progression.

## Règles d'écriture (importantes)
- **Signature narrative** : chaque affaire semble surnaturelle (bateau fantôme, grimoire ensorcelé…) mais la déduction révèle une explication rationnelle et attendrissante. La raison triomphe du « c'est magique ».
- **Zéro violence, zéro punition cruelle.** Les petits coupables ont des motifs touchants.
- Les indices ne doivent **jamais éliminer le vrai coupable**, et la déduction finale doit toujours laisser **au moins 2 suspects plausibles** (vérifier la cohérence à chaque nouvelle enquête).
- Personnages fixes : le héros (jeune détective), le **commissaire Griffe** (chartreux bougon, « chaton »), **Pistache** (souris gourmande, acolyte — c'est elle qui donne les indices d'aide).
- Difficulté progressive au fil de la carte : observation 25 s → 15 s, questions 3 → 4, mots 2 courts → 3 longs, calculs 1 → 2 étapes, suspects 5 → 7.

## Casse-têtes (décision Cowork du 20/07/2026 — modèle Layton)
Trois familles retenues (le « calcul malin » type allumettes reste en réserve) :
- **Logique & déduction** : grilles logiques simples (« qui habite où », 3×3 avec icônes), pesées (trouver l'intrus en 2 pesées), suites à compléter
- **Spatial** : taquin (images = décors ou cartes-personnages), labyrinthes (guider Pistache dans les ruelles), ombres/rotations (« quelle silhouette correspond au suspect ? » — raccord Fantôme Gris)
- **Mots & codes** : messages en symboles à décoder, écriture miroir, devinettes à la Layton posées par les habitants
Intégration : un framework commun dans `src/minigames/` (énoncé, plateau interactif, validation, aide de Pistache). Certains casse-têtes sont **tissés dans les enquêtes** (pour varier les mini-jeux répétitifs), d'autres sont **optionnels, proposés par les habitants** dans les scènes — récompensés en croquettes d'or et rejouables dans la salle des archives. Le déplacement reste un véhicule d'exploration, JAMAIS une épreuve d'adresse (pas de plateforme, décision ferme).

## Économie des croquettes d'or (session 4)
- **Étincelles cachées** : 3-4 par scène, discrètes (pas de halo, scintillement rare), placées HORS des hotspots d'enquête. Ramassées une seule fois → croquettes d'or.
- **Indice de Pistache = 1 croquette**, proposé seulement après une erreur, jamais imposé. Le solde est affiché au HUD. **Réessayer reste toujours gratuit et illimité** : ne jamais rendre un mini-jeu bloquant faute de croquettes (règle « zéro punition cruelle »).
- **Casse-têtes optionnels** : au moins un par scène, proposé par un habitant (marqueur 🧩), récompensé en croquettes. Piocher dans les 3 familles du CLAUDE.md.

## ⚠️ SPOILERS — arc du Fantôme Gris (ne pas révéler dans l'interface avant l'enquête bonus)
**Pack narratif officiel : `da/session4-fantome-gris.md`** (rédigé par Cowork, validé par Pascal). Les 6 cartes, les fragments, les réactions et le déroulé de la finale y sont **VERBATIM** — ne jamais les réécrire. Le nom « Balthazar » ne doit apparaître nulle part avant la manche 3 de la confrontation (pas de fichier nommé d'après lui).
Antagoniste fil rouge : le **Fantôme Gris**, maître voleur théâtral façon Carmen Sandiego, jamais cruel. Carte de visite grise « F.G. » après chaque enquête, un fragment d'indice par affaire (fil de gant élégant au Manoir, connaissance des marées au Port, vol du livre « Les passages secrets de Chaville » à la Bibliothèque, loge « M. Gris » au Théâtre, plan déjoué à la Tour de l'Horloge). Identité révélée uniquement dans l'enquête bonus « Les Toits de Chaville » : **Balthazar**, ancien élève brillant de l'Académie et ex-coéquipier de Griffe. Il est coincé par la logique, se rend avec panache, promet de s'évader (ouverture saison 2).

## Feuille de route (mode aventure = généraliser demo.html)
1. ✅ Démo marché (tap-to-move, carnet, teaser F.G.)
2. ✅ Moteur généralisé (session 2) : migration TypeScript + Vite, moteur de scènes tap-to-move avec profondeur, transitions, carnet persistant (`localStorage`), scènes Grand-Place + Port, mini-jeux observation/message codé/calcul.
   ✅ (session 3) hub carte (`src/engine/hub.ts`, cadenas/étoiles), obstacles de décor (rectangles, glissement), sprites 4 directions (front/side/back).
3. ✅ Session 3 : scènes Manoir + Bibliothèque + Théâtre + Tour (enquêtes v2 portées depuis `public/academie.html`, mêmes coupables/indices), carnet persistant inter-enquêtes à onglets (Indices / Témoins / **page F.G.** vide jusqu'à la session 4), dialogues à choix (interrogatoires → témoignages), mini-jeu de **déduction** (accuser un suspect, écartés grisés). Personnages des planches intégrés en SVG.
4. ✅ Session 4 — fil rouge du Fantôme Gris : les 6 cartes de visite VERBATIM (`src/ui/carte-fg.ts`, pack `da/session4-fantome-gris.md`) en modal après chaque déduction + réaction Griffe/Pistache ; page F.G. du carnet à silhouette progressive (6 niveaux) et auto-résumé ; enquête bonus **Les Toits** (`src/scenes/toits.ts` : piste en 3 étapes puis confrontation en 3 manches sans échec définitif, révélation, dénouement, écran « à suivre »), déverrouillée aux 6 fragments avec marqueur 🎭. Enquêtes Marché (Moustache) et Port (Lontra) portées depuis `public/academie.html` — les 6 enquêtes ont désormais une déduction. **Étincelles cachées** (3-4/scène) → **croquettes d'or** ; l'aide de Pistache s'achète 1 croquette (solde au HUD, réessai toujours gratuit) ; un **casse-tête optionnel par scène** (devinette, miroir, silhouette, grille logique, taquin).
5. 🟡 Session 5 — finalisation pour diffusion : ✅ onboarding première minute (`src/ui/onboarding.ts`, 3 bulles Pistache à la 1re entrée Grand-Place, drapeau `onboardingVu`), ✅ croquettes de bienvenue (2, drapeau `bienvenue`) + 1re étincelle tutorielle (`tuto: true`), ✅ accueil épuré à une seule entrée `/aventure.html` + « Nouvelle partie » à double confirmation + écran « Pour les parents » (gratuit/sans pub/sans achat, confidentialité) dans `index.html`, ✅ archives `academie.html`/`demo.html` conservées dans `public/` mais retirées du build déployé (`exclureArchives` dans `vite.config.ts`) et du précache `sw.js`, ✅ son WebAudio (`src/audio.ts` : bonne réponse, victoire, étincelle) + bouton muet au HUD (drapeau `muet`). **Reste (session suivante)** : rejouabilité — salle des énigmes/archives (rejouer énigmes et casse-têtes, défis chronométrés), score de « flair » par enquête (baisse doucement à chaque erreur, ne bloque jamais), **album de cartes-personnages** à collectionner (illustrations : `da/planches/`), grades (chaton stagiaire → détective → inspecteur → commissaire). Jamais de streaks punitifs, de notifications de relance ni de compteurs qui expirent (public enfant).
6. Packaging Capacitor → APK Android (la PWA couvre déjà l'installation simple)

## Vérifications avant chaque push
- `npm run build` (lance `tsc --noEmit` puis le build Vite) ; pour les pages héritées de `public/`, extraire le `<script>` et `node --check`
- Cohérence des enquêtes : coupable jamais éliminé par les indices, ≥ 2 suspects restants avant la déduction, anagrammes ≠ mot cible, réponses QCM valides
- Tester l'affichage aux tailles téléphone (360×640) et desktop
- Incrémenter la version du cache `sw.js`
