-- RUN THIS SCRIPT IN YOUR SUPABASE SQL EDITOR

-- 1. Create Site Settings Table
CREATE TABLE public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    site_name TEXT NOT NULL,
    tagline TEXT,
    contact_phone TEXT,
    contact_whatsapp TEXT,
    contact_email TEXT,
    hero_headline TEXT,
    hero_subheadline TEXT,
    hero_image TEXT,
    about_headline TEXT,
    about_text1 TEXT,
    about_text2 TEXT,
    about_image TEXT,
    section_hero BOOLEAN DEFAULT true,
    section_trust BOOLEAN DEFAULT true,
    section_about BOOLEAN DEFAULT true,
    section_menu BOOLEAN DEFAULT true,
    section_testimonials BOOLEAN DEFAULT true,
    advanced_content JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Blog Posts Table
CREATE TABLE public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT,
    author TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Orders Table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    total_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    type TEXT DEFAULT 'online',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Order Items Table
CREATE TABLE public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id),
    quantity INTEGER NOT NULL
);

-- 5. Create Reservations Table
CREATE TABLE public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guests INTEGER NOT NULL,
    special_requests TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SET UP ROW LEVEL SECURITY (RLS)
-- Note: Set to allow public/anon full access for this local migration as previously configured for menu_items.
-- In a real production environment, you should restrict INSERT/UPDATE/DELETE to authenticated Admins only.

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all access site_settings" ON public.site_settings FOR ALL USING (true);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all access blog_posts" ON public.blog_posts FOR ALL USING (true);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all access orders" ON public.orders FOR ALL USING (true);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all access order_items" ON public.order_items FOR ALL USING (true);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all access reservations" ON public.reservations FOR ALL USING (true);


-- 6. Insert Initial Default Site Settings
INSERT INTO public.site_settings (
    id, site_name, tagline, contact_phone, contact_whatsapp, contact_email,
    hero_headline, hero_subheadline, hero_image,
    about_headline, about_text1, about_text2, about_image
) VALUES (
    'global',
    'JOLLOF KIGALI',
    'Premium West African Dining',
    '+250 788 000 000',
    '250788000000',
    'hello@jollofkigali.com',
    'Refining West African Excellence.',
    'Experience the vibrant flavors of Nigeria in the heart of Rwanda. Modern, elegant, and uncompromisingly authentic.',
    'https://images.unsplash.com/photo-1628143494726-0e7880df966a?q=80&w=2000&auto=format&fit=crop',
    'The Soul of West Africa.',
    'Jollof Kigali was born from a passion to bring the rich culinary heritage of Nigeria to Rwanda.',
    'Our kitchen combines age-old family recipes with modern culinary techniques.',
    'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=1200&auto=format&fit=crop'
) ON CONFLICT (id) DO NOTHING;

-- 7. Configure Storage for Images
-- Run this to create the bucket (if creating buckets via SQL is supported in your Supabase tier; otherwise, you'll need to create it manually in the dashboard).
insert into storage.buckets (id, name, public) 
values ('jollof_images', 'jollof_images', true)
on conflict (id) do nothing;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'jollof_images' );

DROP POLICY IF EXISTS "Anon Upload Access" ON storage.objects;
create policy "Anon Upload Access"
on storage.objects for insert
with check ( bucket_id = 'jollof_images' );

DROP POLICY IF EXISTS "Anon Update Access" ON storage.objects;
create policy "Anon Update Access"
on storage.objects for update
using ( bucket_id = 'jollof_images' );

DROP POLICY IF EXISTS "Anon Delete Access" ON storage.objects;
create policy "Anon Delete Access"
on storage.objects for delete
using ( bucket_id = 'jollof_images' );
