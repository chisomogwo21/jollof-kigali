
import React from 'react';
import { useApp } from '../AppContext';

const About: React.FC = () => {
  const { settings } = useApp();
  const content = settings.pageContent.about;

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">Our Heritage</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 serif leading-tight">
              {content.headline.split(' ').map((word, i, arr) => (
                <React.Fragment key={i}>
                  {i === arr.length - 1 ? <span className="text-gold italic">{word}</span> : word + ' '}
                </React.Fragment>
              ))}
            </h1>
            <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
              <p>{content.storyText1}</p>
              <p>{content.storyText2}</p>
              <p>{content.storyText3}</p>
            </div>
          </div>
          <div className="relative">
            <img
              src={content.mainImage}
              alt="Brand Story Visual"
              className="rounded-sm grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl opacity-80"
            />
            <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-gold/30"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 pt-20 border-t border-white/5">
          <div className="text-center">
            <div className="mb-6 overflow-hidden aspect-video">
              <img src={content.visionImage} className="w-full h-full object-cover rounded-sm hover:scale-110 transition-transform duration-700" alt="Our Vision" />
            </div>
            <h3 className="text-2xl font-bold serif text-gold mb-4">Our Vision</h3>
            <p className="text-gray-500 text-sm leading-relaxed">To become the global benchmark for African fine dining, starting from the beautiful hills of Rwanda.</p>
          </div>
          <div className="text-center">
            <div className="mb-6 overflow-hidden aspect-video">
              <img src={content.qualityImage} className="w-full h-full object-cover rounded-sm hover:scale-110 transition-transform duration-700" alt="Quality First" />
            </div>
            <h3 className="text-2xl font-bold serif text-gold mb-4">Quality First</h3>
            <p className="text-gray-500 text-sm leading-relaxed">We source 80% of our spices directly from West Africa to ensure the unmistakable "Party Jollof" aroma.</p>
          </div>
          <div className="text-center">
            <div className="mb-6 overflow-hidden aspect-video">
              <img src={content.communityImage} className="w-full h-full object-cover rounded-sm hover:scale-110 transition-transform duration-700" alt="Community" />
            </div>
            <h3 className="text-2xl font-bold serif text-gold mb-4">Community</h3>
            <p className="text-gray-500 text-sm leading-relaxed">We believe in growth that includes our local community, sourcing fresh produce from Kigali's best local markets.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
