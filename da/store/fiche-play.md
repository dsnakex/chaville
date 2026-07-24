# Fiche Google Play — Mystères à Chaville
*Textes prêts à copier-coller. Éditeur : MaiTao Éditions. Généré le 24/07/2026. Source : `claude/diffusion-google-play-chaville.md`.*

## Identité (à saisir dans la console)
- **Nom de développeur affiché** : MaiTao Éditions
- **E-mail de contact** : maitao.editions@gmail.com
- **Nom de package** (permanent) : `fr.maitao.chaville`
- **Catégorie** : Jeux → Réflexion (Puzzle)
- **Tags** : enquête, détective, réflexion, éducatif, enfants
- **Langue par défaut** : Français (France)
- **Pays de diffusion** : France, Belgique, Suisse, Canada, Luxembourg
- **Site web** (optionnel) : https://chaville-2o8n.vercel.app/
- **URL politique de confidentialité** : https://<domaine>/confidentialite.html

## Nom de l'application (max 30)
```
Mystères à Chaville
```

## Description courte (max 80)
```
Jeux d'enquête pour enfants : observe, déchiffre, calcule et démasque le voleur.
```

## Description longue (max 4000)
```
Mystères à Chaville est un jeu d'enquête pour les enfants de 9 à 12 ans. Ton
enfant incarne un jeune chat détective qui résout des mystères dans la petite
ville de Chaville, de nuit, à la lueur des réverbères.

🔎 SIX ENQUÊTES + UNE GRANDE FINALE
Un collier disparu au manoir, un chalutier « fantôme » au port, un livre volé
à la bibliothèque… Chaque affaire semble surnaturelle, mais se résout par
l'observation et le raisonnement — jamais par la magie. Au fil des enquêtes,
un mystérieux voleur, le Fantôme Gris, laisse des indices… jusqu'à la
confrontation finale sur les toits de la ville.

🧠 QUATRE COMPÉTENCES TRAVAILLÉES EN JOUANT
• Observation et mémoire (retrouver le détail qui cloche)
• Lecture et vocabulaire (déchiffrer messages et codes)
• Calcul et logique (compter les indices, vérifier les alibis)
• Raisonnement spatial (casse-têtes à la manière du Professeur Layton)

💛 PENSÉ POUR LES ENFANTS ET RASSURANT POUR LES PARENTS
• 100 % GRATUIT — aucune publicité, aucun achat intégré. Aucun bouton ne
  coûte jamais d'argent.
• AUCUNE donnée collectée. Pas de compte, pas d'inscription, pas de traçage.
  Toute la progression reste sur l'appareil.
• Fonctionne HORS LIGNE une fois installé.
• Bienveillant : jamais de punition, jamais de compte à rebours stressant.
  Une erreur = une explication en douceur, et on réessaie autant qu'on veut.
• En français, avec un ton chaleureux adapté aux 9-12 ans.

🐱 UNE AVENTURE À EXPLORER
On se déplace d'un simple toucher, on fouille les décors, on interroge les
suspects, on remplit son carnet de détective et on gagne des croquettes d'or
en trouvant les étincelles cachées.

Un jeu conçu par un papa développeur, sans publicité et sans collecte de
données, pour que les enfants s'amusent en réfléchissant.
```

## Éléments graphiques (dans ce dossier `da/store/`)
- **Icône 512×512** : `public/icon-512.png` (chat détective gris, régénéré).
- **Feature graphic 1024×500** : `feature-graphic.png`.
- **Captures téléphone (1080×1920)** : `screenshot-1-place.png`, `screenshot-2-bibliotheque.png`, `screenshot-3-carte.png`, `screenshot-4-port.png`, `screenshot-5-manoir.png`.

## Classification du contenu (IARC)
Aucune violence, aucun contenu sensible → répondre « non » à toutes les catégories. Classification attendue : **PEGI 3 / Tout public**.

## Public cible & « Conçu pour les familles »
- Tranche d'âge : **9-12 ans** (inclut des moins de 13 ans → programme Familles).
- Déclarer : contenu adapté enfants, aucune publicité, aucune collecte.
- Politique de confidentialité obligatoire : fournie (`/confidentialite.html`).

## Sécurité des données (Data safety) — réponses
- Collecte de données utilisateur ? **Non** (tout en local, rien n'est transmis).
- Partage avec des tiers ? **Non.**
- Données chiffrées en transit ? **Sans objet** (aucune donnée ne quitte l'appareil).
- Suppression : via « Nouvelle partie » ou désinstallation.
- Publicité : **« Cette app ne contient pas de publicité. »**

## Rappel packaging
PWABuilder → AAB (TWA), package `fr.maitao.chaville`, Play App Signing activé (conserver la clé d'upload), `assetlinks.json` dans `public/.well-known/`. Téléverser d'abord en **test fermé** (12 testeurs / 14 jours) avant production.
