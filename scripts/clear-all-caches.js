#!/usr/bin/env node

/**
 * CLEAR ALL CACHES - Nettoyage automatique des caches
 * 
 * Ce script nettoie automatiquement tous les caches possibles
 */

import fs from 'fs';
import path from 'path';

console.log('🧹 CLEAR ALL CACHES - Nettoyage automatique des caches');
console.log('======================================================\n');

async function clearAllCaches() {
  try {
    console.log('1️⃣ NETTOYAGE DES CACHES DE DÉVELOPPEMENT');
    console.log('------------------------------------------');
    
    // Dossiers de cache à nettoyer
    const cacheDirs = [
      'node_modules/.cache',
      '.next',
      'dist',
      '.vite',
      '.turbo'
    ];

    for (const dir of cacheDirs) {
      try {
        if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
          console.log(`✅ ${dir} supprimé`);
        } else {
          console.log(`⏭️  ${dir} n'existe pas`);
        }
      } catch (err) {
        console.log(`⚠️  Impossible de supprimer ${dir}: ${err.message}`);
      }
    }

    console.log('\n2️⃣ GÉNÉRATION DU SCRIPT DE NETTOYAGE NAVIGATEUR');
    console.log('------------------------------------------------');
    
    // Créer un script HTML pour nettoyer les caches navigateur
    const clearCacheScript = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nettoyage Cache - OTC Chièvres</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: green; font-weight: bold; }
        .warning { color: orange; font-weight: bold; }
        .error { color: red; font-weight: bold; }
        button { background: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
        button:hover { background: #005a87; }
        .cache-info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>🧹 Nettoyage des Caches - OTC Chièvres</h1>
    
    <div class="cache-info">
        <h3>État actuel des caches :</h3>
        <p id="cache-status">Vérification en cours...</p>
    </div>

    <h3>Actions de nettoyage :</h3>
    <button onclick="clearLocalStorage()">Vider localStorage</button>
    <button onclick="clearSessionStorage()">Vider sessionStorage</button>
    <button onclick="clearAllStorage()">Vider tout le stockage</button>
    <button onclick="forceReload()">Rechargement forcé</button>
    <button onclick="clearServiceWorker()">Nettoyer Service Worker</button>

    <div id="results"></div>

    <h3>Instructions manuelles :</h3>
    <ul>
        <li><strong>Chrome/Edge :</strong> Ctrl+Shift+R ou F12 > Application > Storage > Clear storage</li>
        <li><strong>Firefox :</strong> Ctrl+Shift+R ou F12 > Storage > Clear All</li>
        <li><strong>Safari :</strong> Cmd+Option+R</li>
    </ul>

    <script>
        function log(message, type = 'info') {
            const results = document.getElementById('results');
            const div = document.createElement('div');
            div.className = type;
            div.innerHTML = message;
            results.appendChild(div);
        }

        function clearLocalStorage() {
            try {
                const itemCount = localStorage.length;
                localStorage.clear();
                log(\`✅ localStorage vidé (\${itemCount} éléments supprimés)\`, 'success');
            } catch (err) {
                log(\`❌ Erreur localStorage: \${err.message}\`, 'error');
            }
        }

        function clearSessionStorage() {
            try {
                const itemCount = sessionStorage.length;
                sessionStorage.clear();
                log(\`✅ sessionStorage vidé (\${itemCount} éléments supprimés)\`, 'success');
            } catch (err) {
                log(\`❌ Erreur sessionStorage: \${err.message}\`, 'error');
            }
        }

        function clearAllStorage() {
            clearLocalStorage();
            clearSessionStorage();
            
            // Nettoyer les cookies du domaine actuel
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
            log('✅ Cookies supprimés', 'success');

            // Nettoyer IndexedDB si disponible
            if ('indexedDB' in window) {
                indexedDB.databases().then(databases => {
                    databases.forEach(db => {
                        indexedDB.deleteDatabase(db.name);
                    });
                    log('✅ IndexedDB nettoyé', 'success');
                }).catch(err => {
                    log(\`⚠️  IndexedDB: \${err.message}\`, 'warning');
                });
            }
        }

        function forceReload() {
            log('🔄 Rechargement forcé en cours...', 'warning');
            setTimeout(() => {
                location.reload(true);
            }, 1000);
        }

        function clearServiceWorker() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    registrations.forEach(registration => {
                        registration.unregister();
                    });
                    log('✅ Service Workers supprimés', 'success');
                }).catch(err => {
                    log(\`❌ Erreur Service Worker: \${err.message}\`, 'error');
                });
            } else {
                log('⏭️  Service Worker non supporté', 'warning');
            }
        }

        // Vérifier l'état des caches au chargement
        window.onload = function() {
            const localStorageSize = localStorage.length;
            const sessionStorageSize = sessionStorage.length;
            const cookieCount = document.cookie.split(';').length;
            
            document.getElementById('cache-status').innerHTML = \`
                • localStorage: \${localStorageSize} éléments<br>
                • sessionStorage: \${sessionStorageSize} éléments<br>
                • Cookies: \${cookieCount} éléments<br>
                • Dernière modification: \${new Date().toLocaleString('fr-FR')}
            \`;
        };
    </script>
</body>
</html>`;

    fs.writeFileSync('clear-cache.html', clearCacheScript);
    console.log('✅ Script de nettoyage créé : clear-cache.html');

    console.log('\n3️⃣ VÉRIFICATION DES FICHIERS DE CONFIGURATION');
    console.log('----------------------------------------------');
    
    // Vérifier les fichiers de configuration qui pourraient causer des problèmes de cache
    const configFiles = [
      'vite.config.ts',
      'vite.config.js', 
      'next.config.js',
      'webpack.config.js',
      'tailwind.config.js'
    ];

    for (const file of configFiles) {
      if (fs.existsSync(file)) {
        console.log(`📄 ${file} trouvé`);
        
        // Lire le contenu pour vérifier les paramètres de cache
        try {
          const content = fs.readFileSync(file, 'utf8');
          if (content.includes('cache') || content.includes('Cache')) {
            console.log(`   ⚠️  Contient des paramètres de cache`);
          }
        } catch (err) {
          console.log(`   ❌ Impossible de lire ${file}`);
        }
      }
    }

    console.log('\n4️⃣ INSTRUCTIONS FINALES');
    console.log('------------------------');
    
    console.log('🎯 ACTIONS EFFECTUÉES:');
    console.log('• Caches de développement nettoyés');
    console.log('• Script de nettoyage navigateur créé');
    console.log('• Fichiers de configuration vérifiés');
    
    console.log('\n🚀 PROCHAINES ÉTAPES:');
    console.log('1. Ouvrir clear-cache.html dans votre navigateur');
    console.log('2. Cliquer sur "Vider tout le stockage"');
    console.log('3. Redémarrer le serveur de développement');
    console.log('4. Tester les modifications en mode incognito');
    
    console.log('\n📋 COMMANDES À EXÉCUTER:');
    console.log('# Redémarrer le serveur');
    console.log('npm run dev');
    console.log('# ou');
    console.log('yarn dev');
    
    console.log('\n🔍 VÉRIFICATIONS:');
    console.log('• Les 14 pages sont-elles maintenant visibles ?');
    console.log('• Les modifications de bannières apparaissent-elles ?');
    console.log('• Le site fonctionne-t-il en mode incognito ?');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Exécuter le nettoyage
clearAllCaches();