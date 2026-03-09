
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Clock, MapPin, Phone, MessageCircle } from 'lucide-react';
import { useApp } from '../AppContext';

const Home: React.FC = () => {
  const { menu, settings } = useApp();
  const featured = menu.filter(item => item.isFeatured).slice(0, 3);
  const content = settings.pageContent.home;

  return (
    <div className="bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={content.heroImage}
            className="w-full h-full object-cover opacity-60 scale-105"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-[#0A0A0A]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-gold uppercase tracking-[0.4em] text-sm font-medium mb-4 block animate-fade-in">
            {content.heroTopText}
          </span>
          <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tight leading-tight serif">
            {content.heroHeadline.split(' ').map((word, i, arr) => (
              <React.Fragment key={i}>
                {i === arr.length - 1 ? <span className="text-gold italic">{word}</span> : word + ' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            {content.heroSubheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to={content.heroButton1Link} className="px-10 py-4 bg-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-all w-full sm:w-auto">
              {content.heroButton1Text}
            </Link>
            <Link to={content.heroButton2Link} className="px-10 py-4 border border-white/20 hover:bg-white/10 transition-all font-bold uppercase tracking-widest w-full sm:w-auto">
              {content.heroButton2Text}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-[1px] h-12 bg-white/30 mx-auto"></div>
        </div>
      </section>

      {/* Trust Indicators */}
      {settings.homepageSections.trust && (
        <section className="py-12 border-y border-white/5 bg-black/40">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-2 text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-400">{content.trustIndicator1Label}</p>
            </div>
            <div className="text-center">
              <h4 className="text-2xl font-bold text-gold serif">{content.trustIndicator1Text}</h4>
              <p className="text-xs uppercase tracking-widest text-gray-400">{content.trustIndicator2Label}</p>
            </div>
            <div className="text-center">
              <h4 className="text-2xl font-bold text-gold serif">{content.trustIndicator2Text}</h4>
              <p className="text-xs uppercase tracking-widest text-gray-400">{content.trustIndicator3Label}</p>
            </div>
            <div className="text-center">
              <h4 className="text-2xl font-bold text-gold serif">{content.trustIndicator3Text}</h4>
              <p className="text-xs uppercase tracking-widest text-gray-400">{content.trustIndicator4Label}</p>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {settings.homepageSections.about && (
        <section className="py-24 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src={content.aboutImage}
                className="w-full aspect-[4/5] object-cover rounded-sm shadow-2xl"
                alt="Intro Section Image"
              />
              <div className="absolute -bottom-8 -right-8 w-64 h-64 border-gold border-8 rounded-sm -z-10 hidden lg:block"></div>
            </div>
            <div>
              <span className="text-gold uppercase tracking-widest text-sm font-semibold mb-4 block">{content.aboutTopText}</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 serif">{content.aboutHeadline}</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {content.aboutText1}
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-10">
                {content.aboutText2}
              </p>
              <Link to={content.aboutButtonLink} className="flex items-center text-gold font-bold uppercase tracking-widest hover:translate-x-2 transition-transform">
                {content.aboutButtonText} <ChevronRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Menu Preview */}
      {settings.homepageSections.menuPreview && (
        <section className="py-24 bg-[#0F0F0F] px-4">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <span className="text-gold uppercase tracking-widest text-sm font-semibold mb-4 block">{content.menuTopText}</span>
            <h2 className="text-4xl md:text-5xl font-bold serif">{content.menuHeadline}</h2>
          </div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {featured.map(item => (
              <div key={item.id} className="group relative bg-[#1A1A1A] rounded-sm overflow-hidden hover:scale-[1.02] transition-transform duration-500">
                <div className="aspect-[4/3] overflow-hidden bg-black/50 flex items-center justify-center">
                  <img src={item.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold serif text-gold">{item.name}</h3>
                    <span className="text-gold font-bold">{item.price.toLocaleString()} RWF</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">{item.description}</p>
                  <Link to="/menu" className="text-xs uppercase tracking-widest font-bold border-b border-gold/40 pb-1 hover:border-gold transition-colors">
                    View full menu
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      <section className="py-20 bg-gold text-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 serif">{content.whatsappHeadline}</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto font-medium">
            {content.whatsappSubheadline}
          </p>
          <a
            href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g, '')}?text=Hi Jollof Kigali, I'd like to place an order.`}
            className="inline-flex items-center px-10 py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-900 transition-all rounded-sm"
          >
            <MessageCircle className="mr-3" /> {content.whatsappButtonText}
          </a>
        </div>
      </section>

      {/* Info Grid */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center p-8 border border-white/5">
            <Clock className="text-gold mb-6" size={40} />
            <h3 className="text-2xl font-bold mb-4 serif">Opening Hours</h3>
            {settings.openingHours.weekday === settings.openingHours.weekend ? (
              <p className="text-gray-400">Mon - Sun: {settings.openingHours.weekday}</p>
            ) : (
              <>
                <p className="text-gray-400">Mon - Fri: {settings.openingHours.weekday}</p>
                <p className="text-gray-400">Sat - Sun: {settings.openingHours.weekend}</p>
              </>
            )}
          </div>
          <div className="flex flex-col items-center text-center p-8 border border-white/5">
            <MapPin className="text-gold mb-6" size={40} />
            <h3 className="text-2xl font-bold mb-4 serif">Our Location</h3>
            <p className="text-gray-400">{settings.contact.address}</p>
            <p className="text-gray-400">Kigali, Rwanda</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 border border-white/5">
            <Phone className="text-gold mb-6" size={40} />
            <h3 className="text-2xl font-bold mb-4 serif">Reservations</h3>
            <p className="text-gray-400">{settings.contact.phone}</p>
            <p className="text-gray-400">{settings.contact.email}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
