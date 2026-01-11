// Types pour le système de gestion de contenu

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'hero' | 'section' | 'button' | 'list' | 'gallery';
  content: any;
  styles?: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    fontWeight?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
  position: {
    order: number;
    section: string;
  };
}

export interface TextBlock extends ContentBlock {
  type: 'text';
  content: {
    text: string;
    tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  };
}

export interface ImageBlock extends ContentBlock {
  type: 'image';
  content: {
    src: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
  };
}

export interface HeroBlock extends ContentBlock {
  type: 'hero';
  content: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    backgroundVideo?: string;
    buttons: Array<{
      text: string;
      link: string;
      style: 'primary' | 'secondary';
    }>;
  };
}

export interface SectionBlock extends ContentBlock {
  type: 'section';
  content: {
    title: string;
    subtitle?: string;
    children: ContentBlock[];
  };
}

export interface ButtonBlock extends ContentBlock {
  type: 'button';
  content: {
    text: string;
    link: string;
    style: 'primary' | 'secondary' | 'outline';
    size: 'small' | 'medium' | 'large';
  };
}

export interface ListBlock extends ContentBlock {
  type: 'list';
  content: {
    items: Array<{
      text: string;
      icon?: string;
    }>;
    style: 'bullet' | 'numbered' | 'icon';
  };
}

export interface GalleryBlock extends ContentBlock {
  type: 'gallery';
  content: {
    images: Array<{
      src: string;
      alt: string;
      caption?: string;
    }>;
    layout: 'grid' | 'carousel' | 'masonry';
    columns?: number;
  };
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  blocks: ContentBlock[];
  metadata: {
    description?: string;
    keywords?: string[];
    lastModified: string;
    modifiedBy: string;
  };
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  blocks: ContentBlock[];
  category: 'page' | 'section' | 'component';
}