
export type OrderStatus = 'payment_pending' | 'pending' | 'confirmed' | 'delivered' | 'cancelled';
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  image: string;
  isFeatured: boolean;
  isChefRecommendation: boolean;
  proteinPrices?: Record<string, number>;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: { menuItemId: string; quantity: number }[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  type: 'online' | 'whatsapp';
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  specialRequests?: string;
}

// Added BlogPost interface to resolve errors in BlogPage.tsx
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  contact: {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
  openingHours: {
    weekday: string;
    weekend: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
  homepageSections: {
    hero: boolean;
    trust: boolean;
    about: boolean;
    menuPreview: boolean;
    testimonials: boolean;
  };
  pageContent: {
    home: {
      heroTopText: string;
      heroHeadline: string;
      heroSubheadline: string;
      heroImage: string;

      heroButton1Text: string;
      heroButton1Link: string;
      heroButton2Text: string;
      heroButton2Link: string;

      trustIndicator1Label: string;
      trustIndicator1Text: string;
      trustIndicator2Label: string;
      trustIndicator2Text: string;
      trustIndicator3Label: string;
      trustIndicator3Text: string;
      trustIndicator4Label: string;
      trustIndicator4Text: string;

      aboutTopText: string;
      aboutHeadline: string;
      aboutText1: string;
      aboutText2: string;
      aboutImage: string;
      aboutButtonText: string;
      aboutButtonLink: string;

      menuTopText: string;
      menuHeadline: string;

      whatsappHeadline: string;
      whatsappSubheadline: string;
      whatsappButtonText: string;
    };
    about: {
      headline: string;
      storyText1: string;
      storyText2: string;
      storyText3: string;
      mainImage: string;
      visionImage: string;
      qualityImage: string;
      communityImage: string;
    };
    contact: {
      headline: string;
      subheadline: string;
    };
    menu: {
      headline: string;
      subheadline: string;
    };
    reservations: {
      headline: string;
      subheadline: string;
    };
    blog: {
      headline: string;
      subheadline: string;
    };
  };
}