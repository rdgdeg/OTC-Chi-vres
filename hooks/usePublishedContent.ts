import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { getTableName, getTypeFilters } from '../services/contentMappings';

interface UsePublishedContentOptions {
  categoryId: string;
  filters?: Record<string, any>;
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
}

interface UsePublishedContentResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer uniquement le contenu publié
 * Garantit que seules les fiches avec status='published' sont affichées sur le frontend
 */
export function usePublishedContent<T = any>(
  options: UsePublishedContentOptions
): UsePublishedContentResult<T> {
  const { categoryId, filters = {}, orderBy = 'created_at', ascending = false, limit } = options;
  
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const tableName = getTableName(categoryId);
      const typeFilters = getTypeFilters(categoryId);

      // Construire la requête
      let query = supabase
        .from(tableName)
        .select('*')
        .eq('status', 'published'); // ⭐ FILTRE CRITIQUE : Seulement le contenu publié

      // Ajouter les filtres de type si nécessaire (pour la table places)
      if (typeFilters && typeFilters.length > 0) {
        query = query.in('type', typeFilters);
      }

      // Ajouter les filtres personnalisés
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      // Ordre
      query = query.order(orderBy, { ascending });

      // Limite
      if (limit) {
        query = query.limit(limit);
      }

      const { data: result, error: queryError } = await query;

      if (queryError) throw queryError;

      setData(result || []);
    } catch (err) {
      console.error(`Erreur lors du chargement du contenu publié (${categoryId}):`, err);
      setError(err as Error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId, JSON.stringify(filters), orderBy, ascending, limit]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook pour récupérer un seul élément publié par ID
 */
export function usePublishedItem<T = any>(
  categoryId: string,
  itemId: string | undefined
): UsePublishedContentResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!itemId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tableName = getTableName(categoryId);

      const { data: result, error: queryError } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', itemId)
        .eq('status', 'published') // ⭐ FILTRE CRITIQUE
        .single();

      if (queryError) throw queryError;

      setData(result ? [result] : []);
    } catch (err) {
      console.error(`Erreur lors du chargement de l'élément (${categoryId}/${itemId}):`, err);
      setError(err as Error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId, itemId]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook pour compter le contenu publié
 */
export function usePublishedCount(categoryId: string): {
  count: number;
  loading: boolean;
  error: Error | null;
} {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      setLoading(true);
      setError(null);

      try {
        const tableName = getTableName(categoryId);
        const typeFilters = getTypeFilters(categoryId);

        let query = supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published'); // ⭐ FILTRE CRITIQUE

        if (typeFilters && typeFilters.length > 0) {
          query = query.in('type', typeFilters);
        }

        const { count: result, error: queryError } = await query;

        if (queryError) throw queryError;

        setCount(result || 0);
      } catch (err) {
        console.error(`Erreur lors du comptage (${categoryId}):`, err);
        setError(err as Error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [categoryId]);

  return { count, loading, error };
}

/**
 * Vérifier si un élément est publié (utile pour les redirections)
 */
export async function isItemPublished(
  categoryId: string,
  itemId: string
): Promise<boolean> {
  try {
    const tableName = getTableName(categoryId);

    const { data, error } = await supabase
      .from(tableName)
      .select('status')
      .eq('id', itemId)
      .single();

    if (error) return false;

    return data?.status === 'published';
  } catch (err) {
    console.error('Erreur lors de la vérification du statut:', err);
    return false;
  }
}
