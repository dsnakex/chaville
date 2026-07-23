import { defineConfig, type Plugin } from 'vite'
import { cpSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Les décors gardent une URL stable (/assets/decors/*.png) : le service worker
 * les précharge en dur et da/*.html y fait référence en relatif. Ils restent
 * donc à la racine du dépôt (pas dans public/, qui est réservé aux fichiers v1
 * et PWA) et sont recopiés tels quels dans dist/.
 */
function copierDecors(): Plugin {
  return {
    name: 'chaville-copier-decors',
    apply: 'build',
    closeBundle() {
      cpSync(resolve('assets'), resolve('dist/assets'), { recursive: true })
    },
  }
}

/**
 * Les prototypes v1/v2 (`academie.html`, `demo.html`) restent dans `public/`
 * comme archives versionnées, mais NE SONT PAS déployés : on les retire de
 * `dist/` après le build pour qu'aucune URL publique n'y mène. Le seul jeu
 * accessible en ligne est le mode aventure v3 (`aventure.html`).
 */
function exclureArchives(): Plugin {
  return {
    name: 'chaville-exclure-archives',
    apply: 'build',
    closeBundle() {
      for (const f of ['academie.html', 'demo.html']) {
        rmSync(resolve('dist', f), { force: true })
      }
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [copierDecors(), exclureArchives()],
  build: {
    // Les bundles vont dans dist/build/ pour ne pas entrer en collision
    // avec dist/assets/decors/ recopié à l'identique.
    assetsDir: 'build',
    rollupOptions: {
      input: {
        index: resolve('index.html'),
        aventure: resolve('aventure.html'),
      },
    },
  },
})
