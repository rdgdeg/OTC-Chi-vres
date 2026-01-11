// Configuration de la page d'accueil
export const homePageConfig = {
  // Bande d'information
  infoBanner: {
    message: "Fermeture du bureau le 11 novembre (férié) - Réouverture le 12 novembre à 9h",
    type: "announcement" as const,
    dismissible: true,
    enabled: true
  },

  // Hero section
  hero: {
    title: "Bienvenue à Chièvres,",
    subtitle: "la Cité des Aviateurs !",
    description: [
      "Suivez notre crosseur, emblème du crossage al' tonne, et partez à la découverte d'une ville riche en histoire, traditions et vie associative.",
      "Chièvres séduit par son patrimoine médiéval, ses événements festifs et ses associations qui font vibrer la ville tout au long de l'année.",
      "Venez juger par vous-même et explorez les trésors de notre cité !"
    ],
    backgroundImage: "https://picsum.photos/id/1047/1920/1080",
    videoUrl: "/videos/chievres-intro.mp4", // À ajouter dans le dossier public
    buttons: {
      primary: {
        text: "Découvrir Chièvres",
        link: "/musees"
      },
      secondary: {
        text: "Voir l'agenda",
        link: "/agenda"
      }
    }
  },

  // Actualités
  news: {
    title: "Actualités",
    subtitle: "Les dernières nouvelles de Chièvres et de l'Office du Tourisme",
    items: [
      {
        id: 1,
        title: "Ouverture de la nouvelle exposition au Musée de la Vie Rurale",
        excerpt: "Découvrez \"Artisans d'autrefois\", une exposition temporaire qui met en lumière les métiers traditionnels de notre région.",
        image: "https://picsum.photos/id/1051/400/300",
        date: "15 janvier 2026",
        category: "Culture",
        readTime: "3 min"
      },
      {
        id: 2,
        title: "Festival du Crossage 2026 : Save the Date !",
        excerpt: "Le traditionnel Festival du Crossage al'tonne aura lieu le premier weekend de septembre. Préparez-vous à vivre une expérience unique !",
        image: "https://picsum.photos/id/1052/400/300",
        date: "12 janvier 2026",
        category: "Événement",
        readTime: "2 min"
      },
      {
        id: 3,
        title: "Nouveaux circuits de randonnée balisés",
        excerpt: "Trois nouveaux parcours de découverte ont été aménagés pour vous faire découvrir les trésors cachés de notre campagne.",
        image: "https://picsum.photos/id/1053/400/300",
        date: "8 janvier 2026",
        category: "Nature",
        readTime: "4 min"
      }
    ]
  },

  // Coups de cœur
  favorites: {
    title: "Nos coups de cœur",
    subtitle: "Les sites emblématiques et incontournables de l'entité de Chièvres",
    items: [
      {
        id: 1,
        title: "Église Saint-Martin",
        image: "https://picsum.photos/id/1041/600/400",
        description: "Monument historique classé du XIIe siècle"
      },
      {
        id: 2,
        title: "Le Crossage al'tonne",
        image: "https://picsum.photos/id/1042/600/400",
        description: "Tradition folklorique unique de Chièvres"
      },
      {
        id: 3,
        title: "Château de Ladeuze",
        image: "https://picsum.photos/id/1043/600/400",
        description: "Patrimoine architectural remarquable"
      },
      {
        id: 4,
        title: "Sentiers de randonnée",
        image: "https://picsum.photos/id/1044/600/400",
        description: "Découvrez la nature environnante"
      },
      {
        id: 5,
        title: "Place Charles II",
        image: "https://picsum.photos/id/1045/600/400",
        description: "Cœur historique de la cité"
      },
      {
        id: 6,
        title: "Musée de la Vie Rurale",
        image: "https://picsum.photos/id/1046/600/400",
        description: "Plongez dans l'histoire locale"
      }
    ]
  },

  // Newsletter
  newsletter: {
    title: "Inscrivez-vous à notre newsletter",
    subtitle: "Restez connecté avec Chièvres ! Recevez nos actus, événements et bons plans directement dans votre boîte mail.",
    buttonText: "S'inscrire",
    successMessage: "Merci ! Vous êtes maintenant inscrit(e) à notre newsletter.",
    errorMessage: "Veuillez entrer une adresse email valide",
    disclaimer: "En vous inscrivant, vous acceptez de recevoir nos communications. Vous pouvez vous désabonner à tout moment."
  },

  // Réseaux sociaux
  social: {
    title: "Suivez-nous !",
    subtitle: "Pour ne rien manquer de nos actualités, événements et nouveautés, suivez-nous sur Facebook !",
    links: {
      facebook: "https://facebook.com/otchievres",
      instagram: "https://instagram.com/otchievres"
    }
  }
};

export default homePageConfig;