import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../AppContext';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, image, url }) => {
    const { settings } = useApp();

    const siteName = settings?.siteName || 'Jollof Kigali';
    const defaultTagline = settings?.tagline || 'Modern West African Cuisine';
    const defaultDesc = settings?.pageContent?.about?.storyText1 || 'Experience the vibrant flavors of Nigeria in the heart of Rwanda. Modern, elegant, and uncompromisingly authentic.';
    const defaultImage = settings?.pageContent?.home?.heroImage || 'https://images.unsplash.com/photo-1628143494726-0e7880df966a?q=80&w=2000&auto=format&fit=crop';

    const seoTitle = title ? `${title} | ${siteName}` : `${siteName} | ${defaultTagline}`;
    const seoDesc = description || defaultDesc;
    const seoImage = image || defaultImage;
    const seoUrl = url ? `https://jollofkigali.com${url}` : 'https://jollofkigali.com'; // Change this to your actual prod domain

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{seoTitle}</title>
            <meta name="description" content={seoDesc} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={seoUrl} />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDesc} />
            <meta property="og:image" content={seoImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={seoUrl} />
            <meta property="twitter:title" content={seoTitle} />
            <meta property="twitter:description" content={seoDesc} />
            <meta property="twitter:image" content={seoImage} />
        </Helmet>
    );
};

export default SEO;
