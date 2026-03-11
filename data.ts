
import { MenuItem, SiteSettings, BlogPost } from './types';

export const MENU_CATEGORIES = {
  "Starters": ["Salads and Light meals"],
  "Main meals": ["Soups", "Rice", "Proteins", "Other specialties", "The Grill"],
  "Sharing Platters": ["Meat Galore", "Rice"],
  "Sides & Extras": [],
  "Drinks": ["Cocktail", "Mocktails", "Special tea"],
  "Catering / Buffet": ["Basic menu", "Gold menu", "Premium menu"]
};

export const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Signature Party Jollof',
    description: 'Smoky, long-grain parboiled rice cooked in a rich tomato and scotch bonnet base. Served with golden fried plantain and spicy grilled chicken.',
    price: 15000,
    category: 'Main meals',
    subcategory: 'Rice',
    image: 'https://images.unsplash.com/photo-1628143494726-0e7880df966a?q=80&w=800&auto=format&fit=crop',
    isFeatured: true,
    isChefRecommendation: true,
  },
  {
    id: '2',
    name: 'Pounded Yam & Egusi',
    description: 'Freshly pounded yam (Iyan) served with a rich, melon seed soup (Egusi) thickened with spinach, crayfish, and tender slow-cooked beef.',
    price: 18000,
    category: 'Main meals',
    subcategory: 'Soups',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=800&auto=format&fit=crop',
    isFeatured: true,
    isChefRecommendation: false,
  },
  {
    id: '3',
    name: 'Spiced Beef Suya',
    description: 'Traditional Hausa street food specialty. Thinly sliced beef skewers rubbed with Yaji (peanut spice) and flame-grilled to perfection.',
    price: 12000,
    category: 'Starters',
    subcategory: 'Salads and Light meals',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop',
    isFeatured: false,
    isChefRecommendation: true,
  },
  {
    id: '4',
    name: 'Assorted Meat Pepper Soup',
    description: 'A light, intensely aromatic and spicy broth made with traditional Nigerian herbs, spices, and a variety of tender meats.',
    price: 10000,
    category: 'Main meals',
    subcategory: 'Soups',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop',
    isFeatured: false,
    isChefRecommendation: false,
  },
  {
    id: '5',
    name: 'Fried Plantain (Dodo)',
    description: 'Sweet, ripe plantains sliced and deep-fried until caramelized and golden brown. The perfect side for any Nigerian meal.',
    price: 5000,
    category: 'Sides & Extras',
    subcategory: '',
    image: 'https://images.unsplash.com/photo-1594911776742-990798e6c510?q=80&w=800&auto=format&fit=crop',
    isFeatured: false,
    isChefRecommendation: false,
  },
  {
    id: '6',
    name: 'Asun (Spicy Goat)',
    description: 'Succulent pieces of goat meat seasoned with scotch bonnet peppers and onions, slow-roasted for a deep smoky flavor.',
    price: 14000,
    category: 'Starters',
    subcategory: 'Salads and Light meals',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=800&auto=format&fit=crop',
    isFeatured: true,
    isChefRecommendation: false,
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'JOLLOF KIGALI',
  tagline: 'Premium West African Dining',
  colors: {
    primary: '#C5A059',
    secondary: '#0A0A0A',
    accent: '#FFFFFF',
  },
  contact: {
    address: 'KG 18 Ave, Kigali',
    phone: '+250 788 500 171',
    whatsapp: '250788500171',
    email: 'hello@jollofkigali.com',
  },
  openingHours: {
    weekday: '12:00 PM - 11:00 PM',
    weekend: '12:00 PM - 11:00 PM',
  },
  socialLinks: {
    instagram: 'https://instagram.com/jollofkigali',
    facebook: 'https://facebook.com/jollofkigali',
    twitter: 'https://twitter.com/jollofkigali',
  },
  homepageSections: {
    hero: true,
    trust: true,
    about: true,
    menuPreview: true,
    testimonials: true,
  },
  pageContent: {
    home: {
      heroTopText: "ESTABLISHED IN KIGALI",
      heroHeadline: "Refining West African Excellence.",
      heroSubheadline: "Experience the vibrant flavors of Nigeria in the heart of Rwanda. Modern, elegant, and uncompromisingly authentic.",
      heroImage: "https://images.unsplash.com/photo-1628143494726-0e7880df966a?q=80&w=2000&auto=format&fit=crop",

      heroButton1Text: "Order Online",
      heroButton1Link: "/menu",
      heroButton2Text: "Book a Table",
      heroButton2Link: "/reservations",

      trustIndicator1Label: "4.9/5 Google Reviews",
      trustIndicator1Text: "5,000+",
      trustIndicator2Label: "Happy Diners",
      trustIndicator2Text: "100%",
      trustIndicator3Label: "Authentic Spices",
      trustIndicator3Text: "2023",
      trustIndicator4Label: "Award Winning Cuisine",
      trustIndicator4Text: "",

      aboutTopText: "Our Story",
      aboutHeadline: "The Soul of West Africa.",
      aboutText1: "Jollof Kigali was born from a passion to bring the rich culinary heritage of Nigeria to Rwanda. We believe that food is a universal language, and Jollof is its most vibrant dialect.",
      aboutText2: "Our kitchen combines age-old family recipes with modern culinary techniques, sourcing only the finest spices and freshest local produce to create a dining experience that is both nostalgic and avant-garde.",
      aboutImage: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=1200&auto=format&fit=crop",
      aboutButtonText: "Learn more about us",
      aboutButtonLink: "/about",

      menuTopText: "Signature Dishes",
      menuHeadline: "Authentic Flavors",

      whatsappHeadline: "Instant Orders via WhatsApp",
      whatsappSubheadline: "Prefer to chat? Order your favorite meal directly through WhatsApp for lightning-fast delivery and personalized service.",
      whatsappButtonText: "Chat & Order"
    },
    about: {
      headline: "Authenticity in Every Grain.",
      storyText1: "Jollof Kigali was founded on a simple yet profound premise: that the vibrant, soulful flavors of West Africa deserve a stage that matches their complexity.",
      storyText2: "Our journey began in the kitchens of Lagos, where recipes were passed down through generations like precious heirlooms. Today, we bring those secrets to the heart of Kigali, blending traditional techniques with modern culinary artistry.",
      storyText3: "Every dish we serve is a tribute to the farmers, the spice-merchants, and the grandmothers who defined our palate. We don't just serve food; we serve culture.",
      mainImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop",
      visionImage: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=600&auto=format&fit=crop",
      qualityImage: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=600&auto=format&fit=crop",
      communityImage: "https://images.unsplash.com/photo-1594911776742-990798e6c510?q=80&w=600&auto=format&fit=crop"
    },
    contact: {
      headline: "Get in Touch.",
      subheadline: "Whether you're planning an event, inquiring about our menu, or just want to say hello, we'd love to hear from you."
    },
    menu: {
      headline: "Our Menu",
      subheadline: "Savor the rich, authentic flavors of West Africa, prepared with premium ingredients and passion."
    },
    reservations: {
      headline: "Book a Table",
      subheadline: "Join us for an unforgettable West African fine dining experience."
    },
    blog: {
      headline: "The Kitchen Table",
      subheadline: "Insights, stories, and culinary secrets from the heart of Jollof Kigali."
    }
  }
};

// Added initial blog posts data
export const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Secret to the Perfect Party Jollof',
    excerpt: 'Discover the traditional techniques and spice blends that make our signature Jollof rice the talk of Kigali.',
    author: 'Chef Adebayo',
    date: '2024-03-15',
    image: 'https://images.unsplash.com/photo-1628143494726-0e7880df966a?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Sourcing Local: The Best Markets in Kigali',
    excerpt: 'A guide to where we find our freshest produce and how we support Rwandan farmers through local sourcing.',
    author: 'Management',
    date: '2024-03-10',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop'
  }
];
