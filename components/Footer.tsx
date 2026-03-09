
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Mail, Phone, Lock } from 'lucide-react';
import { useApp } from '../AppContext';

const Footer: React.FC = () => {
  const { settings } = useApp();

  return (
    <footer className="bg-black text-gray-400 pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter serif text-gold mb-6">{settings.siteName}</h2>
          <p className="leading-relaxed mb-8">
            The premier destination for authentic West African fine dining in Rwanda. Crafting culture, one plate at a time.
          </p>
          <div className="flex space-x-6">
            <a href={settings.socialLinks.instagram} className="hover:text-gold transition-colors"><Instagram size={20} /></a>
            <a href={settings.socialLinks.facebook} className="hover:text-gold transition-colors"><Facebook size={20} /></a>
            <a href={settings.socialLinks.twitter} className="hover:text-gold transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-widest text-white font-bold mb-6">Quick Links</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/menu" className="hover:text-gold transition-colors">View Menu</Link></li>
            <li><Link to="/reservations" className="hover:text-gold transition-colors">Book a Table</Link></li>
            <li><Link to="/order" className="hover:text-gold transition-colors">Order Online</Link></li>
            <li><Link to="/about" className="hover:text-gold transition-colors">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-widest text-white font-bold mb-6">Contact Info</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start"><MapPin size={18} className="mr-3 text-gold shrink-0" /> {settings.contact.address}</li>
            <li className="flex items-center"><Phone size={18} className="mr-3 text-gold shrink-0" /> {settings.contact.phone}</li>
            <li className="flex items-center"><Mail size={18} className="mr-3 text-gold shrink-0" /> {settings.contact.email}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-widest text-white font-bold mb-6">Opening Hours</h3>
          <ul className="space-y-4 text-sm">
            {settings.openingHours.weekday === settings.openingHours.weekend ? (
              <li>
                <span className="block text-xs uppercase text-gray-500 mb-1">Mon - Sun</span>
                {settings.openingHours.weekday}
              </li>
            ) : (
              <>
                <li>
                  <span className="block text-xs uppercase text-gray-500 mb-1">Weekdays</span>
                  {settings.openingHours.weekday}
                </li>
                <li>
                  <span className="block text-xs uppercase text-gray-500 mb-1">Weekends</span>
                  {settings.openingHours.weekend}
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest">
        <div className="flex items-center space-x-2">
          <p>&copy; 2026 Jollof Kigali. All Rights Reserved.</p>
        </div>
        <div className="flex space-x-8 mt-4 md:mt-0 items-center">
          <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          <Link to="/admin/login" className="flex items-center space-x-1 hover:text-gold transition-colors opacity-40 hover:opacity-100">
            <Lock size={12} />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
