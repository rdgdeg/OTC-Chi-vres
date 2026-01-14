#!/bin/bash

# Script pour trouver toutes les requêtes Supabase sans filtre status='published'
# Usage: bash scripts/find-missing-status-filters.sh

echo "🔍 Recherche des requêtes Supabase sans filtre status..."
echo "=================================================="
echo ""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
total_files=0
issues_found=0

# Tables à vérifier
tables=("accommodations" "events" "places" "articles" "team_members" "walks")

for table in "${tables[@]}"; do
  echo -e "${YELLOW}📋 Vérification de la table: $table${NC}"
  echo "---"
  
  # Rechercher les fichiers avec des requêtes sur cette table
  files=$(grep -r "\.from('$table')" OTC-Chi-vres/services/ OTC-Chi-vres/components/ OTC-Chi-vres/pages/ 2>/dev/null | \
    grep -v "node_modules" | \
    grep -v ".git" | \
    cut -d: -f1 | \
    sort -u)
  
  if [ -z "$files" ]; then
    echo -e "${GREEN}✅ Aucune requête trouvée${NC}"
    echo ""
    continue
  fi
  
  # Pour chaque fichier trouvé
  while IFS= read -r file; do
    if [ -f "$file" ]; then
      total_files=$((total_files + 1))
      
      # Vérifier si le fichier contient un filtre status
      if grep -q "\.from('$table')" "$file" && ! grep -q "\.eq('status'" "$file"; then
        echo -e "${RED}❌ MANQUE FILTRE: $file${NC}"
        
        # Afficher les lignes concernées
        grep -n "\.from('$table')" "$file" | head -3
        echo ""
        
        issues_found=$((issues_found + 1))
      else
        echo -e "${GREEN}✅ OK: $file${NC}"
      fi
    fi
  done <<< "$files"
  
  echo ""
done

# Rechercher aussi les requêtes avec .select() directement
echo -e "${YELLOW}📋 Vérification des requêtes génériques${NC}"
echo "---"

generic_files=$(grep -r "supabase\.from(" OTC-Chi-vres/services/ OTC-Chi-vres/components/ OTC-Chi-vres/pages/ 2>/dev/null | \
  grep -v "node_modules" | \
  grep -v ".git" | \
  grep -v "\.eq('status'" | \
  cut -d: -f1 | \
  sort -u)

if [ ! -z "$generic_files" ]; then
  while IFS= read -r file; do
    if [ -f "$file" ]; then
      echo -e "${YELLOW}⚠️  À VÉRIFIER: $file${NC}"
    fi
  done <<< "$generic_files"
fi

echo ""
echo "=================================================="
echo -e "${YELLOW}📊 RÉSUMÉ${NC}"
echo "=================================================="
echo "Fichiers analysés: $total_files"
echo -e "${RED}Problèmes trouvés: $issues_found${NC}"
echo ""

if [ $issues_found -gt 0 ]; then
  echo -e "${RED}⚠️  Action requise: Ajouter .eq('status', 'published') aux requêtes identifiées${NC}"
  echo ""
  echo "Exemple de correction:"
  echo "  AVANT: .from('accommodations').select('*')"
  echo "  APRÈS: .from('accommodations').select('*').eq('status', 'published')"
  echo ""
  exit 1
else
  echo -e "${GREEN}✅ Tous les fichiers semblent corrects!${NC}"
  exit 0
fi
