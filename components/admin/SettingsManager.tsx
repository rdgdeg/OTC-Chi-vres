import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, AlertCircle, Check, Globe, 
  Mail, Shield, Database, Palette, Bell,
  Key, Users, Server, Code, Eye
} from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  fields: SettingsField[];
}

interface SettingsField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'boolean' | 'number' | 'color' | 'email' | 'url';
  value: any;
  options?: { value: string; label: string }[];
  help?: string;
  required?: boolean;
}

export const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [activeSection, setActiveSection] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Configuration des sections de paramètres
  const settingsSections: SettingsSection[] = [
    {
      id: 'general',
      title: 'Général',
      description: 'Paramètres généraux du site',
      icon: Globe,
      fields: [
        {
          name: 'site_title',
          label: 'Titre du site',
          type: 'text',
          value: settings.site_title || 'Office de Tourisme de Chièvres',
          required: true
        },
        {
          name: 'site_description',
          label: 'Description du site',
          type: 'textarea',
          value: settings.site_description || 'Découvrez Chièvres et sa région',
          help: 'Description utilisée pour le SEO'
        },
        {
          name: 'site_url',
          label: 'URL du site',
          type: 'url',
          value: settings.site_url || 'https://visitchievres.be',
          required: true
        },
        {
          name: 'contact_email',
          label: 'Email de contact',
          type: 'email',
          value: settings.contact_email || 'info@visitchievres.be',
          required: true
        },
        {
          name: 'contact_phone',
          label: 'Téléphone',
          type: 'text',
          value: settings.contact_phone || '+32 68 64 14 00'
        },
        {
          name: 'address',
          label: 'Adresse',
          type: 'textarea',
          value: settings.address || 'Grand Place 1\n7950 Chièvres\nBelgique'
        }
      ]
    },
    {
      id: 'appearance',
      title: 'Apparence',
      description: 'Personnalisation visuelle',
      icon: Palette,
      fields: [
        {
          name: 'primary_color',
          label: 'Couleur principale',
          type: 'color',
          value: settings.primary_color || '#3B82F6'
        },
        {
          name: 'secondary_color',
          label: 'Couleur secondaire',
          type: 'color',
          value: settings.secondary_color || '#10B981'
        },
        {
          name: 'logo_url',
          label: 'Logo',
          type: 'url',
          value: settings.logo_url || ''
        },
        {
          name: 'favicon_url',
          label: 'Favicon',
          type: 'url',
          value: settings.favicon_url || ''
        },
        {
          name: 'items_per_page',
          label: 'Éléments par page',
          type: 'number',
          value: settings.items_per_page || 12,
          help: 'Nombre d\'éléments affichés par page dans les listes'
        }
      ]
    },
    {
      id: 'seo',
      title: 'SEO',
      description: 'Optimisation pour les moteurs de recherche',
      icon: Eye,
      fields: [
        {
          name: 'meta_title',
          label: 'Titre par défaut',
          type: 'text',
          value: settings.meta_title || 'Office de Tourisme de Chièvres'
        },
        {
          name: 'meta_description',
          label: 'Description par défaut',
          type: 'textarea',
          value: settings.meta_description || 'Découvrez Chièvres et sa région'
        },
        {
          name: 'meta_keywords',
          label: 'Mots-clés',
          type: 'text',
          value: settings.meta_keywords || 'tourisme, chièvres, belgique, hébergement'
        },
        {
          name: 'google_analytics_id',
          label: 'Google Analytics ID',
          type: 'text',
          value: settings.google_analytics_id || '',
          help: 'Format: GA-XXXXXXXXX-X'
        },
        {
          name: 'google_maps_api_key',
          label: 'Clé API Google Maps',
          type: 'text',
          value: settings.google_maps_api_key || ''
        }
      ]
    },
    {
      id: 'email',
      title: 'Email',
      description: 'Configuration des emails',
      icon: Mail,
      fields: [
        {
          name: 'smtp_host',
          label: 'Serveur SMTP',
          type: 'text',
          value: settings.smtp_host || ''
        },
        {
          name: 'smtp_port',
          label: 'Port SMTP',
          type: 'number',
          value: settings.smtp_port || 587
        },
        {
          name: 'smtp_username',
          label: 'Nom d\'utilisateur SMTP',
          type: 'text',
          value: settings.smtp_username || ''
        },
        {
          name: 'smtp_password',
          label: 'Mot de passe SMTP',
          type: 'text',
          value: settings.smtp_password || ''
        },
        {
          name: 'from_email',
          label: 'Email expéditeur',
          type: 'email',
          value: settings.from_email || 'noreply@visitchievres.be'
        },
        {
          name: 'from_name',
          label: 'Nom expéditeur',
          type: 'text',
          value: settings.from_name || 'Office de Tourisme de Chièvres'
        }
      ]
    },
    {
      id: 'security',
      title: 'Sécurité',
      description: 'Paramètres de sécurité',
      icon: Shield,
      fields: [
        {
          name: 'enable_registration',
          label: 'Autoriser les inscriptions',
          type: 'boolean',
          value: settings.enable_registration || false
        },
        {
          name: 'require_email_verification',
          label: 'Vérification email obligatoire',
          type: 'boolean',
          value: settings.require_email_verification || true
        },
        {
          name: 'session_timeout',
          label: 'Timeout de session (minutes)',
          type: 'number',
          value: settings.session_timeout || 60
        },
        {
          name: 'max_login_attempts',
          label: 'Tentatives de connexion max',
          type: 'number',
          value: settings.max_login_attempts || 5
        }
      ]
    },
    {
      id: 'api',
      title: 'API',
      description: 'Configuration des APIs externes',
      icon: Server,
      fields: [
        {
          name: 'weather_api_key',
          label: 'Clé API Météo',
          type: 'text',
          value: settings.weather_api_key || ''
        },
        {
          name: 'facebook_app_id',
          label: 'Facebook App ID',
          type: 'text',
          value: settings.facebook_app_id || ''
        },
        {
          name: 'instagram_access_token',
          label: 'Instagram Access Token',
          type: 'text',
          value: settings.instagram_access_token || ''
        },
        {
          name: 'mailchimp_api_key',
          label: 'Mailchimp API Key',
          type: 'text',
          value: settings.mailchimp_api_key || ''
        }
      ]
    }
  ];

  // Charger les paramètres
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // TODO: Implémenter le chargement des paramètres depuis Supabase
      const mockSettings = {
        site_title: 'Office de Tourisme de Chièvres',
        site_description: 'Découvrez Chièvres et sa région',
        site_url: 'https://visitchievres.be',
        contact_email: 'info@visitchievres.be',
        primary_color: '#3B82F6',
        secondary_color: '#10B981',
        items_per_page: 12
      };
      setSettings(mockSettings);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des paramètres' });
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder les paramètres
  const saveSettings = async () => {
    try {
      setSaving(true);
      // TODO: Implémenter la sauvegarde des paramètres
      console.log('Sauvegarde des paramètres:', settings);
      
      setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès' });
      
      // Effacer le message après 3 secondes
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  // Mettre à jour un paramètre
  const updateSetting = (name: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Rendu d'un champ
  const renderField = (field: SettingsField) => {
    const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <input
            type={field.type}
            value={field.value || ''}
            onChange={(e) => updateSetting(field.name, e.target.value)}
            className={baseClasses}
            required={field.required}
          />
        );
        
      case 'number':
        return (
          <input
            type="number"
            value={field.value || 0}
            onChange={(e) => updateSetting(field.name, parseInt(e.target.value) || 0)}
            className={baseClasses}
            required={field.required}
          />
        );
        
      case 'textarea':
        return (
          <textarea
            value={field.value || ''}
            onChange={(e) => updateSetting(field.name, e.target.value)}
            rows={3}
            className={baseClasses}
            required={field.required}
          />
        );
        
      case 'select':
        return (
          <select
            value={field.value || ''}
            onChange={(e) => updateSetting(field.name, e.target.value)}
            className={baseClasses}
            required={field.required}
          >
            <option value="">Sélectionner...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'boolean':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={field.value || false}
              onChange={(e) => updateSetting(field.name, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Activé</span>
          </label>
        );
        
      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={field.value || '#000000'}
              onChange={(e) => updateSetting(field.name, e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={field.value || '#000000'}
              onChange={(e) => updateSetting(field.name, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );
        
      default:
        return (
          <input
            type="text"
            value={field.value || ''}
            onChange={(e) => updateSetting(field.name, e.target.value)}
            className={baseClasses}
          />
        );
    }
  };

  const currentSection = settingsSections.find(s => s.id === activeSection);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
          <p className="text-gray-600">Configuration du site</p>
        </div>
        
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </>
          )}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <Check className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-sm p-4">
          <nav className="space-y-2">
            {settingsSections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <section.icon className="h-4 w-4 mr-3" />
                <div>
                  <div className="font-medium">{section.title}</div>
                  <div className="text-xs text-gray-500">{section.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          {currentSection && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <currentSection.icon className="h-5 w-5 mr-2" />
                  {currentSection.title}
                </h3>
                <p className="text-gray-600 mt-1">{currentSection.description}</p>
              </div>

              <div className="space-y-6">
                {currentSection.fields.map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(field)}
                    {field.help && (
                      <p className="mt-1 text-sm text-gray-500">{field.help}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};