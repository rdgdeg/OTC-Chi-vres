#!/usr/bin/env node

/**
 * Script de diagnostic pour vérifier si les modifications d'édition sont chargées
 * À exécuter dans la console du navigateur (F12)
 */

console.log('🔍 Diagnostic des modifications d\'édition admin...\n');

// Vérifier si React est chargé
if (typeof React !== 'undefined') {
  console.log('✅ React chargé');
} else {
  console.log('❌ React non chargé');
}

// Vérifier la version du build
const scripts = document.querySelectorAll('script[src*="index"]');
console.log(`\n📦 Scripts chargés: ${scripts.length}`);
scripts.forEach((script, i) => {
  const src = script.src;
  const hash = src.match(/index-([^.]+)\.js/);
  if (hash) {
    console.log(`   ${i + 1}. Hash du build: ${hash[1]}`);
  }
});

// Vérifier si on est sur la page admin
const isAdminPage = window.location.pathname.includes('/admin');
console.log(`\n📍 Page admin: ${isAdminPage ? '✅ Oui' : '❌ Non'}`);
console.log(`   URL actuelle: ${window.location.href}`);

// Vérifier le localStorage
const hasAuth = localStorage.getItem('supabase.auth.token') !== null;
console.log(`\n🔐 Authentification: ${hasAuth ? '✅ Présente' : '❌ Absente'}`);

// Instructions pour tester
console.log('\n📋 Pour tester l\'édition:');
console.log('1. Aller sur /admin');
console.log('2. Cliquer sur "Contenu"');
console.log('3. Choisir une catégorie (ex: "Où dormir")');
console.log('4. Cliquer sur l\'icône ✏️ d\'un élément');
console.log('5. Une modale devrait s\'ouvrir');

console.log('\n💡 Si la modale ne s\'ouvre pas:');
console.log('- Vérifier les erreurs dans la console');
console.log('- Vider le cache (Cmd+Shift+R)');
console.log('- Vérifier que le build est à jour sur Vercel');

console.log('\n🔍 Informations système:');
console.log(`   Navigateur: ${navigator.userAgent}`);
console.log(`   Date/Heure: ${new Date().toLocaleString()}`);
console.log(`   Cache: ${navigator.onLine ? 'En ligne' : 'Hors ligne'}`);
