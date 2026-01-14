/**
 * Mappings centralisés pour la gestion du contenu
 * Évite les incohérences entre admin et frontend
 */

// Mapping des catégories vers les tables Supabase
export const TABLE_MAPPING: Record<string, string> = {
  accommodations: 'accommodations',
  events: 'events',
  team: 'team_members',
  blog: 'articles',
  walks: 'places', // Filtré par type='walk'
  dining: 'places', // Filtré par type IN ('restaurant','cafe','bar')
  heritage: 'places', // Filtré par type IN ('museum','monument','heritage')
  activities: 'places' // Filtré par type IN ('activity','experience')
};

// Mapping des champs titre selon le type de contenu
export const TITLE_FIELD_MAPPING: Record<string, string> = {
  accommodations: 'name',
  places: 'name',
  walks: 'name',
  dining: 'name',
  heritage: 'name',
  activities: 'name',
  events: 'title',
  blog: 'title',
  articles: 'title',
  team: 'name',
  team_members: 'name'
};

// Mapping des types pour les tables partagées (places)
export const TYPE_FILTERS: Record<string, string[]> = {
  walks: ['walk'],
  dining: ['restaurant', 'cafe', 'bar', 'brasserie'],
  heritage: ['museum', 'monument', 'heritage', 'church'],
  activities: ['activity', 'experience', 'leisure', 'sport']
};

// Standardisation des noms de champs (éviter les doublons)
export const FIELD_STANDARDIZATION: Record<string, Record<string, string>> = {
  blog: {
    // Utiliser toujours ces champs
    title: 'title',
    excerpt: 'excerpt',
    author: 'author',
    category: 'category'
  },
  team: {
    role: 'role',
    bio: 'bio',
    skills: 'skills',
    sort_order: 'sort_order'
  },
  walks: {
    gpx_file: 'gpx_file',
    pdf_document: 'pdf_document',
    starting_point: 'starting_point'
  },
  events: {
    location: 'location',
    entry_price: 'entry_price'
  }
};

// Obtenir le nom de la table pour une catégorie
export const getTableName = (categoryId: string): string => {
  return TABLE_MAPPING[categoryId] || 'places';
};

// Obtenir le champ titre pour une catégorie
export const getTitleField = (categoryId: string): string => {
  const tableName = getTableName(categoryId);
  return TITLE_FIELD_MAPPING[tableName] || TITLE_FIELD_MAPPING[categoryId] || 'name';
};

// Obtenir les filtres de type pour une catégorie
export const getTypeFilters = (categoryId: string): string[] | null => {
  return TYPE_FILTERS[categoryId] || null;
};

// Vérifier si une catégorie utilise la table places
export const usesPlacesTable = (categoryId: string): boolean => {
  return getTableName(categoryId) === 'places';
};

// Obtenir le nom de champ standardisé
export const getStandardField = (categoryId: string, fieldName: string): string => {
  const standards = FIELD_STANDARDIZATION[categoryId];
  return standards?.[fieldName] || fieldName;
};

// Statuts valides
export const VALID_STATUSES = ['draft', 'published', 'archived'] as const;
export type ContentStatus = typeof VALID_STATUSES[number];

// Vérifier si un statut est valide
export const isValidStatus = (status: string): status is ContentStatus => {
  return VALID_STATUSES.includes(status as ContentStatus);
};

// Obtenir le label d'un statut
export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    published: 'Publié',
    draft: 'Brouillon',
    archived: 'Archivé'
  };
  return labels[status] || status;
};

// Obtenir la couleur d'un statut
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Types de contenu disponibles
export const CONTENT_TYPES = {
  ACCOMMODATION: 'accommodation',
  RESTAURANT: 'restaurant',
  CAFE: 'cafe',
  BAR: 'bar',
  MUSEUM: 'museum',
  MONUMENT: 'monument',
  HERITAGE: 'heritage',
  WALK: 'walk',
  ACTIVITY: 'activity',
  EVENT: 'event',
  ARTICLE: 'article',
  TEAM_MEMBER: 'team_member'
} as const;

export type ContentType = typeof CONTENT_TYPES[keyof typeof CONTENT_TYPES];
