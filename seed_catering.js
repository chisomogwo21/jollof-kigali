import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://javbjmhmmjuijsvdczjg.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphdmJqbWhtbWp1aWpzdmRjempnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NjQ5ODMsImV4cCI6MjA4ODE0MDk4M30.J4blX4_mTuP2oCodIFGkyPwxukuktfci_mT90bcloTg';

const supabase = createClient(supabaseUrl, supabaseKey);

const items = [
    {
        name: 'Basic Menu',
        description: 'RICE:\nJollof Rice\nFried Rice or Coconut Rice\nWhite Rice\n\nPROTEIN:\nBeef\nChicken\nAssorted Meat\n\nOTHER ITEMS:\nSpaghetti\nPlantain\nColeslaw\nStew\nFruit Salad',
        price: 20000,
        category: 'Catering / Buffet',
        subcategory: 'Basic menu',
        image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
        is_featured: false,
        is_chef_recommendation: false
    },
    {
        name: 'Gold Menu',
        description: 'RICE:\nJollof Rice\nFried Rice or Coconut Rice\nWhite Rice\n\nPROTEIN:\nChicken\nBeef\nAssorted Meat\n\nSOUPS:\nEgusi\nOkro\nEforiro\n\nOTHER ITEMS:\nPlantain\nColeslaw\nStew\nGari and Semo\nFruit Salad\nFresh Juice',
        price: 35000,
        category: 'Catering / Buffet',
        subcategory: 'Gold menu',
        image_url: 'https://images.unsplash.com/photo-1628143494726-0e7880df966a?q=80&w=800&auto=format&fit=crop',
        is_featured: false,
        is_chef_recommendation: true
    },
    {
        name: 'Premium Menu',
        description: 'RICE:\nJollof Rice\nShrimp Fried Rice\nCoconut Rice\nWhite Rice\n\nPROTEIN:\nBeef\nChicken\nFish\nAssorted Meat\n\nSOUPS:\nOkro\nEgusi\nEforiro\n\nOTHER ITEMS:\nPepper Soup\nColeslaw\nGarden Salad\nStew\nGari, Semo, Poundo Yam\nFruit Salad\nFresh Juice\nSoft Drinks\nMineral Water',
        price: 40000,
        category: 'Catering / Buffet',
        subcategory: 'Premium menu',
        image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop',
        is_featured: true,
        is_chef_recommendation: true
    }
];

async function seed() {
    console.log('Seeding catering items...');
    const { data, error } = await supabase
        .from('menu_items')
        .insert(items);

    if (error) {
        console.error('Error inserting:', error);
    } else {
        console.log('Successfully inserted items!');
    }
}

seed();
