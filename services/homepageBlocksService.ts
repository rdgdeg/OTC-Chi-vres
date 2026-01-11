import { supabase } from './supabaseClient';

export interface HomepageBlock {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  icon_name?: string;
  background_color: string;
  text_color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateHomepageBlockData {
  title: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  icon_name?: string;
  background_color?: string;
  text_color?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateHomepageBlockData extends Partial<CreateHomepageBlockData> {}

class HomepageBlocksService {
  // Récupérer tous les blocs actifs triés par ordre
  async getAllBlocks(): Promise<HomepageBlock[]> {
    try {
      const { data, error } = await supabase
        .from('homepage_blocks')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Erreur lors de la récupération des blocs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des blocs:', error);
      return [];
    }
  }

  // Récupérer tous les blocs (pour l'admin)
  async getAllBlocksForAdmin(): Promise<HomepageBlock[]> {
    try {
      const { data, error } = await supabase
        .from('homepage_blocks')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Erreur lors de la récupération des blocs admin:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des blocs admin:', error);
      return [];
    }
  }

  // Récupérer un bloc par ID
  async getBlockById(id: string): Promise<HomepageBlock | null> {
    try {
      const { data, error } = await supabase
        .from('homepage_blocks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du bloc:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du bloc:', error);
      return null;
    }
  }

  // Créer un nouveau bloc
  async createBlock(blockData: CreateHomepageBlockData): Promise<HomepageBlock | null> {
    try {
      const { data, error } = await supabase
        .from('homepage_blocks')
        .insert([{
          ...blockData,
          background_color: blockData.background_color || '#f3f4f6',
          text_color: blockData.text_color || '#1f2937',
          sort_order: blockData.sort_order || 0,
          is_active: blockData.is_active ?? true
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du bloc:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la création du bloc:', error);
      return null;
    }
  }

  // Mettre à jour un bloc
  async updateBlock(id: string, blockData: UpdateHomepageBlockData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('homepage_blocks')
        .update(blockData)
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la mise à jour du bloc:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du bloc:', error);
      return false;
    }
  }

  // Supprimer un bloc
  async deleteBlock(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('homepage_blocks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression du bloc:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du bloc:', error);
      return false;
    }
  }

  // Réorganiser les blocs
  async reorderBlocks(blocks: { id: string; sort_order: number }[]): Promise<boolean> {
    try {
      const updates = blocks.map(block => 
        supabase
          .from('homepage_blocks')
          .update({ sort_order: block.sort_order })
          .eq('id', block.id)
      );

      const results = await Promise.all(updates);
      
      for (const result of results) {
        if (result.error) {
          console.error('Erreur lors de la réorganisation:', result.error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la réorganisation des blocs:', error);
      return false;
    }
  }

  // Activer/désactiver un bloc
  async toggleBlockStatus(id: string, isActive: boolean): Promise<boolean> {
    return this.updateBlock(id, { is_active: isActive });
  }
}

export const homepageBlocksService = new HomepageBlocksService();