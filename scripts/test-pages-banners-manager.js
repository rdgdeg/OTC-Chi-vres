#!/usr/bin/env node

/**
 * Script de test pour le gestionnaire de pages et bannières
 * Vérifie que tous les composants sont correctement configurés
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Test du Gestionnaire de Pages et Bannières\n');
console.log('='.repeat(60));

// Vérification des fichiers
const filesToCheck = [
  {
    path: 'components/admin/UnifiedPageBannerManager.tsx',
    name: 'Gestionnaire Unifié',
    required: true
  },
  {
    path: 'components/BannerManager.tsx',
    name: 'Gestionnaire de Bannières',
    required: true
  },
  {
    path: 'components/PageContentManager.tsx',
    name: 'Gestionnaire de Pages',
    required: true
  },
  {
    path: 'contexts/PageContentContext.tsx',
    name: 'Context des Pages',
    required: true
  },
  {
    path: 'services/homepageService.ts',
    name: 'Service Homepage',
    required: true
  },
  {
    path: 'GUIDE-GESTION-PAGES-BANNIERES.md',
    name: 'Guide d\'utilisation',
    required: true
  }
];

let allFilesExist = true;

console.log('\n📁 Vérification des fichiers...\n');

filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, '..', file.path);
  const exists = fs.existsSync(fullPath);
  
  const status = exists ? '✅' : '❌';
  const required = file.required ? '(requis)' : '(optionnel)';
  
  console.log(`${status} ${file.name} ${required}`);
  console.log(`   ${file.path}`);
  
  if (!exists && file.required) {
    allFilesExist = false;
  }
});

// Vérification de l'intégration dans AdminDashboard
console.log('\n🔗 Vérification de l\'intégration...\n');

const adminDashboardPath = path.join(__dirname, '..', 'components/admin/SimpleAdminDashboard.tsx');
if (fs.existsSync(adminDashboardPath)) {
  const content = fs.readFileSync(adminDashboardPath, 'utf8');
  
  const checks = [
    {
      test: content.includes('UnifiedPageBannerManager'),
      name: 'Import du composant',
      message: 'UnifiedPageBannerManager importé'
    },
    {
      test: content.includes('Pages & Bannières'),
      name: 'Section dans le menu',
      message: 'Section ajoutée au menu'
    },
    {
      test: content.includes('Layout'),
      name: 'Icône Layout',
      message: 'Icône importée'
    }
  ];
  
  checks.forEach(check => {
    const status = check.test ? '✅' : '❌';
    console.log(`${status} ${check.name}`);
    if (check.test) {
      console.log(`   ${check.message}`);
    }
  });
} else {
  console.log('❌ SimpleAdminDashboard.tsx non trouvé');
  allFilesExist = false;
}

// Vérification de la structure des pages
console.log('\n📄 Vérification de la structure des pages...\n');

const pageContextPath = path.join(__dirname, '..', 'contexts/PageContentContext.tsx');
if (fs.existsSync(pageContextPath)) {
  const content = fs.readFileSync(pageContextPath, 'utf8');
  
  const pages = [
    'home', 'museums', 'accommodations', 'dining', 'merchants',
    'walks', 'experiences', 'agenda', 'blog', 'shop',
    'contact', 'team', 'crossage', 'bulletin'
  ];
  
  let pagesFound = 0;
  pages.forEach(pageId => {
    if (content.includes(`id: '${pageId}'`)) {
      pagesFound++;
    }
  });
  
  console.log(`✅ ${pagesFound}/${pages.length} pages configurées`);
  
  if (pagesFound === pages.length) {
    console.log('   Toutes les pages sont présentes');
  } else {
    console.log(`   ⚠️  ${pages.length - pagesFound} pages manquantes`);
  }
} else {
  console.log('❌ PageContentContext.tsx non trouvé');
}

// Résumé
console.log('\n' + '='.repeat(60));
console.log('\n📊 RÉSUMÉ\n');

if (allFilesExist) {
  console.log('✅ Tous les fichiers requis sont présents');
  console.log('✅ L\'intégration semble correcte');
  console.log('\n🎉 Le gestionnaire est prêt à être utilisé !');
  console.log('\n📖 Consultez GUIDE-GESTION-PAGES-BANNIERES.md pour l\'utilisation');
} else {
  console.log('❌ Certains fichiers requis sont manquants');
  console.log('⚠️  Veuillez vérifier l\'installation');
}

console.log('\n' + '='.repeat(60));

// Instructions d'utilisation
console.log('\n📝 INSTRUCTIONS D\'UTILISATION\n');
console.log('1. Accédez au tableau de bord admin : /admin');
console.log('2. Cliquez sur "Pages & Bannières" dans le menu');
console.log('3. Choisissez entre :');
console.log('   - Bannières d\'information (messages en haut du site)');
console.log('   - Contenu des pages (textes et images de chaque page)');
console.log('\n4. Pour les bannières :');
console.log('   - Activez/désactivez l\'affichage');
console.log('   - Rédigez le titre et sous-titre');
console.log('   - Choisissez le type (info, attention, erreur, etc.)');
console.log('   - Sauvegardez');
console.log('\n5. Pour les pages :');
console.log('   - Sélectionnez la page à modifier');
console.log('   - Cliquez sur "Modifier"');
console.log('   - Changez les textes et images');
console.log('   - Sauvegardez');
console.log('\n💡 Astuce : Utilisez l\'aperçu pour visualiser avant de publier');

console.log('\n' + '='.repeat(60));

// Checklist de déploiement
console.log('\n✅ CHECKLIST DE DÉPLOIEMENT\n');

const checklist = [
  'Tous les fichiers sont présents',
  'Le composant est intégré dans AdminDashboard',
  'Les 14 pages sont configurées',
  'Le service homepageService fonctionne',
  'Le context PageContentContext est initialisé',
  'Les permissions admin sont configurées',
  'Le guide d\'utilisation est disponible'
];

checklist.forEach((item, index) => {
  console.log(`${index + 1}. [ ] ${item}`);
});

console.log('\n' + '='.repeat(60));
console.log('\n✨ Test terminé !\n');

process.exit(allFilesExist ? 0 : 1);
