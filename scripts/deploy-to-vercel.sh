#!/bin/bash

# Script de déploiement pour Vercel
# Ce script prépare et pousse les modifications vers Git pour déploiement automatique

echo "🚀 Déploiement vers Vercel via Git"
echo "=================================="

# Vérifier si nous sommes dans un dépôt Git
if [ ! -d ".git" ]; then
    echo "❌ Erreur: Ce n'est pas un dépôt Git"
    echo "Initialisation du dépôt Git..."
    git init
    git remote add origin https://github.com/votre-username/OTC-Chi-vres.git
fi

# Vérifier le statut Git
echo "📋 Statut Git actuel:"
git status

# Ajouter tous les fichiers modifiés
echo "📦 Ajout des fichiers modifiés..."
git add .

# Demander un message de commit
echo "💬 Entrez un message de commit (ou appuyez sur Entrée pour un message par défaut):"
read commit_message

if [ -z "$commit_message" ]; then
    commit_message="Mise à jour du gestionnaire de contenu des pages - $(date '+%Y-%m-%d %H:%M')"
fi

# Commit des modifications
echo "💾 Commit des modifications..."
git commit -m "$commit_message"

# Vérifier la branche actuelle
current_branch=$(git branch --show-current)
echo "🌿 Branche actuelle: $current_branch"

# Pousser vers le dépôt distant
echo "🚀 Push vers le dépôt distant..."
git push origin $current_branch

echo "✅ Déploiement terminé!"
echo "🌐 Vercel va automatiquement déployer les modifications."
echo "📱 Vérifiez le statut sur: https://vercel.com/dashboard"

# Afficher les derniers commits
echo ""
echo "📝 Derniers commits:"
git log --oneline -5