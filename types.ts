
export interface Place {
  id: string;
  name: string;
  description: string;
  address: string;
  imageUrl: string;
  type: 'museum' | 'restaurant' | 'hotel' | 'shop' | 'walk' | 'cafe' | 'producer';
  rating?: number;
  phone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tags: string[];
  // Coordinates for Map
  lat?: number;
  lng?: number;
  // Specific for walks
  distance?: string;
  duration?: string;
  difficulty?: 'Facile' | 'Moyen' | 'Difficile';
  // Specific for Museums/Restaurants
  openingHours?: string;
  price?: string;
  practicalInfo?: string;
  galleryImages?: string[];
}

export interface NavItem {
  label: string;
  path?: string;
  children?: NavItem[];
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  category: 'adulte' | 'enfant' | 'teambuilding' | 'famille';
  price: string;
  duration: string;
  imageUrl: string;
  features: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string; // ISO string or formatted date
  day: number;
  month: string;
  description: string;
  location: string;
  category: 'folklore' | 'culture' | 'sport' | 'marché';
  imageUrl: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  imageUrl: string;
  category: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: 'souvenir' | 'livre' | 'terroir';
}

export interface PageContent {
  id: string; // e.g., 'home', 'museums'
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  introTitle?: string;
  introText?: string;
  // Generic fields for flexibility
  extraTitle?: string;
  extraText?: string;
  extraImage?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  description: string;
  imageUrl: string;
  order: number;
}