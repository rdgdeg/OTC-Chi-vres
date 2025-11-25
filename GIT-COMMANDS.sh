#!/bin/bash

# ===================================
# Git Commands - VisitChièvres.be
# ===================================
# Script pour commit et push des modifications

echo "🚀 Préparation du commit Git..."

# 1. Vérifier le statut
echo ""
echo "📊 Statut actuel:"
git status

# 2. Ajouter tous les fichiers
echo ""
echo "➕ Ajout des fichiers..."
git add .

# 3. Vérifier ce qui sera commité
echo ""
echo "📝 Fichiers à commiter:"
git status --short

# 4. Commit avec message détaillé
echo ""
echo "💾 Création du commit..."
git commit -F COMMIT-MESSAGE.txt

# 5. Afficher le dernier commit
echo ""
echo "✅ Commit créé:"
git log -1 --oneline

# 6. Push vers le remote
echo ""
echo "🌐 Push vers GitHub..."
read -p "Voulez-vous pusher maintenant? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    git push origin main
    echo "✅ Push terminé!"
else
    echo "⏸️  Push annulé. Utilisez 'git push origin main' plus tard."
fi

echo ""
echo "🎉 Terminé!"
echo ""
echo "📚 Fichiers principaux modifiés:"
echo "  - Mobile: 14 pages optimisées"
echo "  - Galerie: ImageUploader intégré"
echo "  - RLS: Scripts de correction créés"
echo "  - Docs: 15+ guides créés"
echo ""
echo "🔍 Prochaines étapes:"
echo "  1. Exécuter FIX-RLS-POLICIES.sql dans Supabase"
echo "  2. Exécuter FIX-STORAGE-POLICIES.sql dans Supabase"
echo "  3. Tester l'upload d'images"
echo "  4. Vérifier sur mobile"
echo ""
