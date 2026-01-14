import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import { Mail, Phone } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { TeamMember } from '../types';
import EditableImage from '../components/EditableImage';
import { useAuth } from '../contexts/AuthContext';

const Team: React.FC = () => {
  const { hasPermission } = useAuth();
  
  // Vérifier si l'utilisateur peut éditer le contenu
  const canEdit = hasPermission('users', 'update');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('status', 'published') // Seulement les membres publiés
        .order('sort_order', { ascending: true }); // Tri par sort_order

      if (error) {
        console.error('Error fetching team members:', error);
        setTeamMembers([]);
      } else {
        // Filtrer les membres visibles
        const visibleMembers = (data || []).filter(member => member.is_visible !== false);
        setTeamMembers(visibleMembers);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpdate = async (memberId: string, newImageUrl: string) => {
    try {
      // Update database with new image URL
      const { error } = await supabase
        .from('team_members')
        .update({ featured_image: newImageUrl })
        .eq('id', memberId);

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      // Update local state
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? { ...member, featured_image: newImageUrl } : member
        )
      );
      
      console.log('Team member updated successfully');
    } catch (error: any) {
      console.error('Error updating team member:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero 
        title="Notre Équipe"
        subtitle="Des passionnés à votre service pour vous faire découvrir Chièvres"
        imageUrl="https://picsum.photos/id/1015/1920/600"
        height="small"
      />

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Introduction */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 mb-4 sm:mb-6">
            Une équipe dévouée et passionnée
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            L'équipe de l'Office du Tourisme de Chièvres est composée de professionnels passionnés 
            par leur région. Nous sommes là pour vous accueillir, vous conseiller et vous faire 
            découvrir les richesses de notre territoire.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {teamMembers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600 text-lg">
                Aucun membre de l'équipe à afficher pour le moment.
              </p>
            </div>
          ) : (
            teamMembers.map((member) => (
              <div 
                key={member.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Photo */}
                <EditableImage
                  src={member.featured_image || member.imageUrl || 'https://picsum.photos/id/1005/400/400'}
                  alt={member.name}
                  onImageUpdate={(newUrl) => handleImageUpdate(member.id, newUrl)}
                  folder="team"
                  aspectRatio="square"
                  editable={canEdit}
                />

                {/* Info */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-semibold text-sm sm:text-base mb-3 sm:mb-4">
                    {member.role || member.position}
                  </p>
                  <p className="text-slate-600 text-sm sm:text-base mb-4 sm:mb-5 leading-relaxed">
                    {member.bio || member.description}
                  </p>

                  {/* Compétences / Spécialités */}
                  {member.skills && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Compétences
                      </p>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {member.skills}
                      </p>
                    </div>
                  )}

                  {/* Contact */}
                  {(member.email || member.phone) && (
                    <div className="space-y-2 border-t border-slate-100 pt-4">
                      {member.email && (
                        <a 
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors text-sm group touch-manipulation"
                        >
                          <Mail className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="break-all">{member.email}</span>
                        </a>
                      )}
                      {member.phone && (
                        <a 
                          href={`tel:${member.phone.replace(/\s/g, '')}`}
                          className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors text-sm group touch-manipulation"
                        >
                          <Phone className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <span>{member.phone}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 sm:mt-16 bg-slate-50 rounded-2xl p-6 sm:p-10 text-center border border-slate-100">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-800 mb-3 sm:mb-4">
            Besoin d'aide pour organiser votre visite ?
          </h3>
          <p className="text-slate-600 text-base sm:text-lg mb-5 sm:mb-6 max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions 
            et vous aider à préparer votre séjour à Chièvres.
          </p>
          <a 
            href="/contact"
            className="inline-block bg-primary text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-slate-800 active:scale-98 transition-all shadow-lg touch-manipulation text-sm sm:text-base"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </div>
  );
};

export default Team;
