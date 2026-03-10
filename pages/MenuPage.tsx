
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { MENU_CATEGORIES } from '../data';

const MenuPage: React.FC = () => {
  const { menu, addToCart, settings } = useApp();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubcategory, setActiveSubcategory] = useState('All');
  const [selectingSoup, setSelectingSoup] = useState<any>(null);
  const [selectedProtein, setSelectedProtein] = useState('');
  const [selectedSwallow, setSelectedSwallow] = useState('');
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState('Medium');

  const content = settings.pageContent.menu;

  const SWALLOW_OPTIONS = [
    { name: 'Served with Gari', price: 0 },
    { name: 'Served with Semo', price: 0 },
    { name: 'Served with Poundo Yam', price: 3000 },
    { name: 'Served with Amala', price: 3000 },
    { name: 'Served with Plantain Flour', price: 3000 },
    { name: 'Served with Fufu', price: 3000 },
    { name: 'Served with Oatflour', price: 3000 },
  ];

  const SPICE_LEVELS = ['No Spice', 'Medium', 'Hot'];

  const mainCategories = ['All', ...Object.keys(MENU_CATEGORIES)];
  const availableSubcategories = activeCategory !== 'All' ? MENU_CATEGORIES[activeCategory as keyof typeof MENU_CATEGORIES] : [];

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubcategory('All');
  };

  const filteredMenu = menu.filter(item => {
    if (activeCategory === 'All' && item.category === 'Catering / Buffet') return false;
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    if (activeCategory !== 'All' && availableSubcategories?.length > 0 && activeSubcategory !== 'All' && item.subcategory !== activeSubcategory) return false;
    return true;
  });

  const handleAddToCart = (item: any) => {
    if (item.category === 'Catering / Buffet') {
      navigate('/reservations', { state: { specialRequest: `I am interested in booking the ${item.name}.` } });
      return;
    }

    if (item.category === 'Drinks') {
      addToCart(item);
      return;
    }

    const itemNameLower = item.name.toLowerCase();

    // Skip modal for fries/french fries
    if (itemNameLower.includes('fries')) {
      addToCart(item);
      return;
    }

    const isAbula = itemNameLower.includes('abula');
    const hasVariants = item.proteinPrices && Object.keys(item.proteinPrices).length > 0;

    // Open configuration modal for all food items to at least select spice level
    setSelectingSoup(item);
    setSelectedProtein(hasVariants ? Object.keys(item.proteinPrices)[0] : '');
    setSelectedSwallow(isAbula ? 'Included Amala' : SWALLOW_OPTIONS[0].name);
    setSelectedSpiceLevel('Medium');
  };

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 serif">{content.headline}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {content.subheadline}
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-col items-center gap-6 mb-16">
          <div className="flex flex-wrap justify-center gap-4">
            {mainCategories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-8 py-2 rounded-full border transition-all uppercase tracking-widest text-xs font-bold ${activeCategory === cat ? 'bg-gold border-gold text-black' : 'border-white/10 text-gray-400 hover:border-gold'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Subcategories (Only visible if the selected category has them) */}
          {availableSubcategories && availableSubcategories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveSubcategory('All')}
                className={`px-6 py-1.5 rounded-full border transition-all text-[10px] uppercase font-bold tracking-widest ${activeSubcategory === 'All' ? 'bg-white/20 border-white text-white' : 'border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300'}`}
              >
                All {activeCategory}
              </button>
              {availableSubcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  className={`px-6 py-1.5 rounded-full border transition-all text-[10px] uppercase font-bold tracking-widest ${activeSubcategory === sub ? 'bg-white/20 border-white text-white' : 'border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300'}`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredMenu.map(item => (
            <div key={item.id} className="group bg-[#111] border border-white/5 overflow-hidden transition-all duration-500 hover:border-gold/50">
              <div className="relative aspect-video overflow-hidden bg-black/50 flex items-center justify-center">
                <img src={item.image} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" alt={item.name} />
                {item.isChefRecommendation && (
                  <div className="absolute top-4 left-4 bg-gold text-black text-[10px] font-black uppercase px-2 py-1">Chef's Selection</div>
                )}
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold serif text-gold">{item.name}</h3>
                  {item.category !== 'Catering / Buffet' && (
                    <span className="text-lg font-bold">{item.price.toLocaleString()} RWF</span>
                  )}
                </div>
                {item.category === 'Catering / Buffet' ? (
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed whitespace-pre-wrap">{item.description}</p>
                ) : (
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3 h-12">{item.description}</p>
                )}
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full py-3 bg-white/5 hover:bg-gold hover:text-black transition-all font-bold uppercase tracking-widest text-xs border border-white/10"
                >
                  {item.category === 'Catering / Buffet' ? 'Book for Catering' : 'Add to Order'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Universal Configuration Modal */}
      {selectingSoup && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#111] p-6 max-w-md w-full border border-gold/30 relative max-h-[85vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-2xl font-bold serif text-gold mb-4 sticky top-0 bg-[#111] pt-2 z-10">Customize your {selectingSoup.name}</h3>

            {/* Protein / Variant Selection */}
            {selectingSoup.proteinPrices && Object.keys(selectingSoup.proteinPrices).length > 0 && (
              <div className={selectingSoup.subcategory === 'Soups' ? "mb-8" : "mb-6"}>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-white/10 pb-2">
                  {selectingSoup.subcategory === 'Soups' ? '1. Choose your protein base' : 'Choose Options'}
                </p>
                <div className="space-y-3">
                  {Object.entries(selectingSoup.proteinPrices).map(([proteinName, price]) => (
                    <label key={proteinName} className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${selectedProtein === proteinName ? 'border-gold bg-gold/5' : 'border-white/5 hover:border-white/20'}`}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          className="accent-gold mr-3"
                          name="protein"
                          checked={selectedProtein === proteinName}
                          onChange={() => setSelectedProtein(proteinName)}
                        />
                        <span className={`text-sm font-medium ${selectedProtein === proteinName ? 'text-gold' : 'text-gray-300'}`}>{proteinName}</span>
                      </div>
                      <span className="text-gray-400 text-xs font-bold">{(price as number).toLocaleString()} RWF</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Swallow Selection (Only for Soups and NOT Abula) */}
            {selectingSoup.subcategory === 'Soups' && !selectingSoup.name.toLowerCase().includes('abula') && (
              <>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-white/10 pb-2">
                  {selectingSoup.proteinPrices && Object.keys(selectingSoup.proteinPrices).length > 0 ? '2. Choose your Swallow' : '1. Choose your Swallow'}
                </p>
                <div className="space-y-3 mb-8">
                  {SWALLOW_OPTIONS.map(opt => (
                    <label key={opt.name} className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${selectedSwallow === opt.name ? 'border-gold bg-gold/5' : 'border-white/5 hover:border-white/20'}`}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          className="accent-gold mr-3"
                          name="swallow"
                          checked={selectedSwallow === opt.name}
                          onChange={() => setSelectedSwallow(opt.name)}
                        />
                        <span className={`text-sm font-medium ${selectedSwallow === opt.name ? 'text-gold' : 'text-gray-300'}`}>{opt.name}</span>
                      </div>
                      {opt.price > 0 && <span className="text-gold text-xs font-bold">+{opt.price.toLocaleString()} RWF</span>}
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* Spice Level Selection (For all non-drinks/catering items) */}
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-white/10 pb-2">
              Select Spice Level
            </p>
            <div className="space-y-3 mb-8">
              {SPICE_LEVELS.map(level => (
                <label key={level} className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${selectedSpiceLevel === level ? 'border-gold bg-gold/5' : 'border-white/5 hover:border-white/20'}`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      className="accent-gold mr-3"
                      name="spice"
                      checked={selectedSpiceLevel === level}
                      onChange={() => setSelectedSpiceLevel(level)}
                    />
                    <span className={`text-sm font-medium ${selectedSpiceLevel === level ? 'text-gold' : 'text-gray-300'}`}>{level}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectingSoup(null)}
                className="px-6 py-2 text-gray-500 uppercase font-bold text-xs tracking-widest hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const isSoup = selectingSoup.subcategory === 'Soups';
                  const isAbula = selectingSoup.name.toLowerCase().includes('abula');

                  // Only apply swallow modifier if it's a Soup (and not Abula)
                  const opt = (isSoup && !isAbula) ? SWALLOW_OPTIONS.find(o => o.name === selectedSwallow) : null;

                  const pPrice = selectingSoup.proteinPrices ? selectingSoup.proteinPrices[selectedProtein] : selectingSoup.price;
                  const valOfProteinToAdd = selectingSoup.proteinPrices ? (pPrice - selectingSoup.price) : 0;

                  addToCart(selectingSoup, opt?.name, opt?.price, selectedProtein, valOfProteinToAdd, selectedSpiceLevel);
                  setSelectingSoup(null);
                }}
                className="px-8 py-3 bg-gold text-black uppercase font-bold text-xs tracking-widest hover:bg-white transition-colors"
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;