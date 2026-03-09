
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, Order, Reservation, SiteSettings, BlogPost } from './types';
import { INITIAL_MENU, INITIAL_SETTINGS, INITIAL_POSTS } from './data';
import { supabase } from './lib/supabase'

interface AppContextType {
  menu: MenuItem[];
  orders: Order[];
  reservations: Reservation[];
  settings: SiteSettings;
  posts: BlogPost[];
  cart: { id: string; item: MenuItem; quantity: number; swallow?: string; swallowPrice?: number; protein?: string; proteinPrice?: number }[];
  isAdminAuthenticated: boolean;
  logoutAdmin: () => Promise<void>;
  addToCart: (item: MenuItem, swallow?: string, swallowPrice?: number, protein?: string, proteinPrice?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  updateSettings: (s: SiteSettings) => void;
  updateMenu: (m: MenuItem[]) => void;
  updateOrders: (o: Order[]) => void;
  updateReservations: (r: Reservation[]) => void;
  updatePosts: (p: BlogPost[]) => void;
  generateShareLink: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to encode/decode state for URL sharing
const encodeState = (data: any) => {
  try {
    const str = JSON.stringify(data);
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    return null;
  }
};

const decodeState = (base64: string) => {
  try {
    const str = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check for shared state in URL first
  const getSharedState = () => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('s');
    if (shared) {
      const decoded = decodeState(shared);
      if (decoded) return decoded;
    }
    return null;
  };

  const sharedState = getSharedState();

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [cart, setCart] = useState<{ id: string; item: MenuItem; quantity: number; swallow?: string; swallowPrice?: number; protein?: string; proteinPrice?: number }[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdminAuthenticated(!!session);
    });

    // Listen for changes on auth state (log in, log out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Menu
      const { data: menuData } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
      if (menuData) {
        setMenu(menuData.map(item => ({
          ...item,
          image: item.image_url,
          isFeatured: item.is_featured,
          isChefRecommendation: item.is_chef_recommendation,
          proteinPrices: item.protein_prices,
        })));
      }

      // Fetch Settings
      const { data: settingsData } = await supabase.from('site_settings').select('*').eq('id', 'global').single();
      if (settingsData) {
        setSettings({
          siteName: settingsData.site_name,
          tagline: settingsData.tagline,
          colors: INITIAL_SETTINGS.colors, // Keep colors local for now unless added to DB
          contact: {
            address: settingsData.advanced_content?.address || INITIAL_SETTINGS.contact.address,
            phone: settingsData.contact_phone,
            whatsapp: settingsData.contact_whatsapp,
            email: settingsData.contact_email,
          },
          openingHours: settingsData.advanced_content?.openingHours || INITIAL_SETTINGS.openingHours,
          socialLinks: INITIAL_SETTINGS.socialLinks,
          homepageSections: {
            hero: settingsData.section_hero,
            trust: settingsData.section_trust,
            about: settingsData.section_about,
            menuPreview: settingsData.section_menu,
            testimonials: settingsData.section_testimonials,
          },
          pageContent: {
            home: {
              ...INITIAL_SETTINGS.pageContent.home,
              ...(settingsData.advanced_content?.home || {}),
              heroHeadline: settingsData.hero_headline,
              heroSubheadline: settingsData.hero_subheadline,
              heroImage: settingsData.hero_image,
              aboutHeadline: settingsData.about_headline,
              aboutText1: settingsData.about_text1,
              aboutText2: settingsData.about_text2,
              aboutImage: settingsData.about_image,
            },
            about: settingsData.advanced_content?.about || INITIAL_SETTINGS.pageContent.about,
            contact: settingsData.advanced_content?.contact || INITIAL_SETTINGS.pageContent.contact,
            menu: settingsData.advanced_content?.menu || INITIAL_SETTINGS.pageContent.menu,
            reservations: settingsData.advanced_content?.reservations || INITIAL_SETTINGS.pageContent.reservations,
            blog: settingsData.advanced_content?.blog || INITIAL_SETTINGS.pageContent.blog,
          }
        });
      }

      // Fetch Posts
      const { data: postsData } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (postsData) {
        setPosts(postsData.map(post => ({
          ...post,
          image: post.image_url,
          date: post.created_at,
        })));
      }

      // Fetch Orders
      const { data: ordersData } = await supabase.from('orders').select(`
        *,
        order_items (
          menu_item_id,
          quantity
        )
      `).order('created_at', { ascending: false });

      if (ordersData) {
        setOrders(ordersData.map(order => ({
          id: order.id,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          customerEmail: order.customer_email || '',
          totalPrice: order.total_price,
          status: order.status as any,
          type: order.type as any,
          createdAt: order.created_at,
          items: order.order_items.map((item: any) => ({
            menuItemId: item.menu_item_id,
            quantity: item.quantity
          }))
        })));
      }

      // Fetch Reservations
      const { data: resData } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
      if (resData) {
        setReservations(resData.map(res => ({
          id: res.id,
          customerName: res.customer_name,
          customerPhone: res.customer_phone,
          customerEmail: res.customer_email || '',
          date: res.reservation_date,
          time: res.reservation_time,
          guests: res.guests,
          status: res.status as any,
          specialRequests: res.special_requests || '',
        })));
      }
    };

    fetchData();

    // Set up realtime subscriptions (optional, but good for admin dashboard)
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  const logoutAdmin = async () => {
    await supabase.auth.signOut();
  };

  const generateShareLink = () => {
    const state = { menu, settings, posts };
    const encoded = encodeState(state);
    const url = new URL(window.location.href.split('?')[0]);
    url.searchParams.set('s', encoded || '');
    return url.toString();
  };

  const addToCart = (item: MenuItem, swallow?: string, swallowPrice?: number, protein?: string, proteinPrice?: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id && i.swallow === swallow && i.protein === protein);
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: Math.random().toString(36).substr(2, 9), item, quantity: 1, swallow, swallowPrice, protein, proteinPrice }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.id !== cartItemId));
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{
      menu, orders, reservations, settings, cart, posts,
      isAdminAuthenticated, logoutAdmin,
      addToCart, removeFromCart, clearCart,
      updateSettings: setSettings,
      updateMenu: async (newMenu: MenuItem[]) => {
        setMenu(newMenu)
      },

      updateOrders: setOrders,
      updateReservations: setReservations,
      updatePosts: setPosts,
      generateShareLink
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
