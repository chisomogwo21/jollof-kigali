
import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Save, Layout, Info, Phone, Home, FileText, Globe, Share2, Copy, Check } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import { SiteSettings } from '../types';
import { supabase } from '../lib/supabase';

const SiteSettingsAdmin: React.FC = () => {
  const { settings, updateSettings, generateShareLink } = useApp();
  const [activeTab, setActiveTab] = useState('general');
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [isModified, setIsModified] = useState(false);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handlePublish = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          site_name: localSettings.siteName,
          tagline: localSettings.tagline,
          contact_phone: localSettings.contact.phone,
          contact_whatsapp: localSettings.contact.whatsapp,
          contact_email: localSettings.contact.email,
          hero_headline: localSettings.pageContent.home.heroHeadline,
          hero_subheadline: localSettings.pageContent.home.heroSubheadline,
          hero_image: localSettings.pageContent.home.heroImage,
          about_headline: localSettings.pageContent.home.aboutHeadline,
          about_text1: localSettings.pageContent.home.aboutText1,
          about_text2: localSettings.pageContent.home.aboutText2,
          about_image: localSettings.pageContent.home.aboutImage,
          section_hero: localSettings.homepageSections.hero,
          section_trust: localSettings.homepageSections.trust,
          section_about: localSettings.homepageSections.about,
          section_menu: localSettings.homepageSections.menuPreview,
          section_testimonials: localSettings.homepageSections.testimonials,
          advanced_content: {
            home: localSettings.pageContent.home,
            about: localSettings.pageContent.about,
            contact: localSettings.pageContent.contact,
            menu: localSettings.pageContent.menu,
            reservations: localSettings.pageContent.reservations,
            blog: localSettings.pageContent.blog,
            address: localSettings.contact.address,
            openingHours: localSettings.openingHours,
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', 'global');

      if (error) throw error;

      updateSettings(localSettings);
      setIsModified(false);
      alert("Changes published! Your website is now up to date.");
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
    }
  };

  const handleCopyLink = () => {
    const link = generateShareLink();
    navigator.clipboard.writeText(link);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleUpdate = (field: string, subfield: string, value: any) => {
    setIsModified(true);
    setLocalSettings(prev => ({
      ...prev,
      [field]: {
        ...(prev[field as keyof SiteSettings] as any),
        [subfield]: value
      }
    }));
  };

  const handlePageContentUpdate = (page: string, field: string, value: any) => {
    setIsModified(true);
    setLocalSettings(prev => ({
      ...prev,
      pageContent: {
        ...prev.pageContent,
        [page]: {
          ...(prev.pageContent[page as keyof typeof prev.pageContent] as any),
          [field]: value
        }
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: Info },
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'about', label: 'About Page', icon: FileText },
    { id: 'menu', label: 'Menu Page', icon: FileText },
    { id: 'reservations', label: 'Reservations', icon: FileText },
    { id: 'blog', label: 'Blog Page', icon: FileText },
    { id: 'contact', label: 'Contact Page', icon: Phone },
    { id: 'layout', label: 'Layout Config', icon: Layout },
  ];

  return (
    <div className="space-y-6 lg:space-y-10 pb-20 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-black p-4 lg:p-6 border border-white/10 sticky top-[64px] lg:top-[80px] z-20 shadow-2xl">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold serif text-gold">Website CMS</h1>
          <p className="text-[9px] lg:text-[10px] uppercase tracking-widest text-gray-500">Edit and publish content across your entire platform</p>
        </div>
        <button
          onClick={handlePublish}
          disabled={!isModified}
          className={`flex items-center justify-center space-x-3 w-full sm:w-auto px-6 lg:px-10 py-3 lg:py-4 font-bold uppercase tracking-widest rounded-sm text-[10px] lg:text-xs transition-all shadow-lg ${isModified ? 'bg-gold text-black hover:bg-white' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
        >
          {isModified ? <Globe size={18} className="animate-pulse" /> : <Save size={18} />}
          <span>{isModified ? 'Publish Changes Live' : 'All Changes Published'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-nowrap lg:flex-wrap gap-2 overflow-x-auto lg:overflow-visible pb-4 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 border-b border-white/10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 lg:px-6 py-2 lg:py-3 rounded-sm text-[9px] lg:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-gold text-black' : 'bg-black/40 text-gray-500 hover:text-white'}`}
          >
            <tab.icon size={12} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-10">
        {activeTab === 'general' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-black/40 border border-white/5 p-8 rounded-sm space-y-6">
              <h3 className="text-[10px] uppercase tracking-widest text-gold font-black mb-4">Branding</h3>
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-2">Website Name</label>
                <input
                  className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm"
                  value={localSettings.siteName}
                  onChange={e => {
                    setIsModified(true);
                    setLocalSettings({ ...localSettings, siteName: e.target.value });
                  }}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-2">Tagline (Global)</label>
                <input
                  className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm"
                  value={localSettings.tagline}
                  onChange={e => {
                    setIsModified(true);
                    setLocalSettings({ ...localSettings, tagline: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 p-8 rounded-sm space-y-6">
              <h3 className="text-[10px] uppercase tracking-widest text-gold font-black mb-4">Core Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-2">Phone</label>
                  <input className="w-full bg-black border border-white/10 p-4 text-sm outline-none focus:border-gold" value={localSettings.contact.phone} onChange={e => handleUpdate('contact', 'phone', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-2">WhatsApp</label>
                  <input className="w-full bg-black border border-white/10 p-4 text-sm outline-none focus:border-gold" value={localSettings.contact.whatsapp} onChange={e => handleUpdate('contact', 'whatsapp', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-2">Business Email</label>
                <input className="w-full bg-black border border-white/10 p-4 text-sm outline-none focus:border-gold" value={localSettings.contact.email} onChange={e => handleUpdate('contact', 'email', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-2">Physical Address</label>
                <input className="w-full bg-black border border-white/10 p-4 text-sm outline-none focus:border-gold" value={localSettings.contact.address} onChange={e => handleUpdate('contact', 'address', e.target.value)} />
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 p-8 rounded-sm space-y-6 md:col-span-2">
              <h3 className="text-[10px] uppercase tracking-widest text-gold font-black mb-4">Opening Hours</h3>
              <p className="text-xs text-gray-500 mb-4 italic">Note: If weekday and weekend hours are identical, they will automatically combine on the website.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-2">Weekday Hours</label>
                  <input className="w-full bg-black border border-white/10 p-4 text-sm outline-none focus:border-gold" value={localSettings.openingHours.weekday} onChange={e => handleUpdate('openingHours', 'weekday', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-2">Weekend Hours</label>
                  <input className="w-full bg-black border border-white/10 p-4 text-sm outline-none focus:border-gold" value={localSettings.openingHours.weekend} onChange={e => handleUpdate('openingHours', 'weekend', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-black/40 border border-white/5 p-8 rounded-sm space-y-8">
              <h3 className="text-[10px] uppercase tracking-widest text-gold font-black mb-4">Hero Section</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-2">Top Text (Eyebrow)</label>
                    <input className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm" value={localSettings.pageContent.home.heroTopText} onChange={e => handlePageContentUpdate('home', 'heroTopText', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-2">Main Headline</label>
                    <textarea className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold h-24 text-sm" value={localSettings.pageContent.home.heroHeadline} onChange={e => handlePageContentUpdate('home', 'heroHeadline', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-2">Subheadline</label>
                    <textarea className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold h-32 text-sm" value={localSettings.pageContent.home.heroSubheadline} onChange={e => handlePageContentUpdate('home', 'heroSubheadline', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-2">Button 1 Text</label>
                      <input className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm" value={localSettings.pageContent.home.heroButton1Text} onChange={e => handlePageContentUpdate('home', 'heroButton1Text', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-2">Button 2 Text</label>
                      <input className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm" value={localSettings.pageContent.home.heroButton2Text} onChange={e => handlePageContentUpdate('home', 'heroButton2Text', e.target.value)} />
                    </div>
                  </div>
                </div>
                <ImageUpload label="Hero Background Image" value={localSettings.pageContent.home.heroImage} onChange={val => handlePageContentUpdate('home', 'heroImage', val)} />
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-black/40 border border-white/5 p-8 rounded-sm space-y-8">
              <h3 className="text-[10px] uppercase tracking-widest text-gold font-black mb-4">Trust Indicators</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-2">Number {num}</label>
                      <input className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm" value={(localSettings.pageContent.home as any)[`trustIndicator${num}Text`]} onChange={e => handlePageContentUpdate('home', `trustIndicator${num}Text`, e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-2">Label {num}</label>
                      <input className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm" value={(localSettings.pageContent.home as any)[`trustIndicator${num}Label`]} onChange={e => handlePageContentUpdate('home', `trustIndicator${num}Label`, e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Preview */}
            <div className="bg-black/40 border border-white/5 p-8 rounded-sm space-y-8">
              <h3 className="text-[10px] uppercase tracking-widest text-gold font-black mb-4">About Preview Section</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-2">Top Text</label>
                    <input className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm" value={localSettings.pageContent.home.aboutTopText} onChange={e => handlePageContentUpdate('home', 'aboutTopText', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-2">Headline</label>
                    <input className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm" value={localSettings.pageContent.home.aboutHeadline} onChange={e => handlePageContentUpdate('home', 'aboutHeadline', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-2">Text 1</label>
                    <textarea className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold h-24 text-sm" value={localSettings.pageContent.home.aboutText1} onChange={e => handlePageContentUpdate('home', 'aboutText1', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-2">Text 2</label>
                    <textarea className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold h-24 text-sm" value={localSettings.pageContent.home.aboutText2} onChange={e => handlePageContentUpdate('home', 'aboutText2', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-2">Button Text</label>
                    <input className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm" value={localSettings.pageContent.home.aboutButtonText} onChange={e => handlePageContentUpdate('home', 'aboutButtonText', e.target.value)} />
                  </div>
                </div>
                <ImageUpload label="About Preview Image" value={localSettings.pageContent.home.aboutImage} onChange={val => handlePageContentUpdate('home', 'aboutImage', val)} />
              </div>
            </div>

            {/* Menu Preview */}
            <div className="bg-black/40 border border-white/5 p-8 rounded-sm space-y-8">
              <h3 className="text-[10px] uppercase tracking-widest text-gold font-black mb-4">Menu Preview Section</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-2">Top Text</label>
                  <input className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm" value={localSettings.pageContent.home.menuTopText} onChange={e => handlePageContentUpdate('home', 'menuTopText', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-2">Headline</label>
                  <input className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm" value={localSettings.pageContent.home.menuHeadline} onChange={e => handlePageContentUpdate('home', 'menuHeadline', e.target.value)} />
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-black/40 border border-white/5 p-8 rounded-sm space-y-8">
              <h3 className="text-[10px] uppercase tracking-widest text-gold font-black mb-4">WhatsApp CTA Section</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-2">Headline</label>
                    <input className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm" value={localSettings.pageContent.home.whatsappHeadline} onChange={e => handlePageContentUpdate('home', 'whatsappHeadline', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-2">Button Text</label>
                    <input className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm" value={localSettings.pageContent.home.whatsappButtonText} onChange={e => handlePageContentUpdate('home', 'whatsappButtonText', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-2">Subheadline</label>
                  <textarea className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold h-24 text-sm" value={localSettings.pageContent.home.whatsappSubheadline} onChange={e => handlePageContentUpdate('home', 'whatsappSubheadline', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-black/40 border border-white/5 p-8 rounded-sm space-y-8">
            <h3 className="text-[10px] uppercase tracking-widest text-gold font-black mb-4">About Page Content</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-2">Headline</label>
                <input className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm" value={localSettings.pageContent.about.headline} onChange={e => handlePageContentUpdate('about', 'headline', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-2">Story Text 1</label>
                <textarea className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold h-24 text-sm" value={localSettings.pageContent.about.storyText1} onChange={e => handlePageContentUpdate('about', 'storyText1', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-2">Story Text 2</label>
                <textarea className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold h-24 text-sm" value={localSettings.pageContent.about.storyText2} onChange={e => handlePageContentUpdate('about', 'storyText2', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-2">Story Text 3</label>
                <textarea className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold h-24 text-sm" value={localSettings.pageContent.about.storyText3} onChange={e => handlePageContentUpdate('about', 'storyText3', e.target.value)} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-white/5">
              <ImageUpload label="Main Story Image" value={localSettings.pageContent.about.mainImage} onChange={val => handlePageContentUpdate('about', 'mainImage', val)} />
              <ImageUpload label="Vision Image" value={localSettings.pageContent.about.visionImage} onChange={val => handlePageContentUpdate('about', 'visionImage', val)} />
              <ImageUpload label="Quality Image" value={localSettings.pageContent.about.qualityImage} onChange={val => handlePageContentUpdate('about', 'qualityImage', val)} />
              <ImageUpload label="Community Image" value={localSettings.pageContent.about.communityImage} onChange={val => handlePageContentUpdate('about', 'communityImage', val)} />
            </div>
          </div>
        )}

        {/* Generic Page Content Editor for Contact, Menu, Reservations, Blog */}
        {['contact', 'menu', 'reservations', 'blog'].includes(activeTab) && (
          <div className="bg-black/40 border border-white/5 p-8 rounded-sm space-y-8">
            <h3 className="text-[10px] uppercase tracking-widest text-gold font-black mb-4">{activeTab} Page Header</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-2">Main Headline</label>
                <input
                  className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-sm"
                  value={(localSettings.pageContent as any)[activeTab].headline}
                  onChange={e => handlePageContentUpdate(activeTab, 'headline', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-2">Subheadline / Description</label>
                <textarea
                  className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold h-24 text-sm"
                  value={(localSettings.pageContent as any)[activeTab].subheadline}
                  onChange={e => handlePageContentUpdate(activeTab, 'subheadline', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}



        {activeTab === 'layout' && (
          <div className="bg-black/40 border border-white/5 p-8 rounded-sm space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest text-gold font-black mb-4">Visibility & Reordering</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(localSettings.homepageSections).map(([key, val]) => (
                <label key={key} className="flex items-center justify-between cursor-pointer p-4 bg-black/40 border border-white/5 hover:border-gold/30 transition-colors">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-gold"
                    checked={val}
                    onChange={e => handleUpdate('homepageSections', key, e.target.checked)}
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteSettingsAdmin;
