
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { MenuItem } from '../types';
import { MENU_CATEGORIES } from '../data';
import ImageUpload from './components/ImageUpload';
import { supabase } from '../lib/supabase';


const MenuManager: React.FC = () => {
  const { menu, updateMenu } = useApp();
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      return;
    }

    // refresh menu
    updateMenu(menu.filter(i => i.id !== id));
  };


  const handleSave = async () => {
    if (!editingItem) return;

    if (!editingItem.name) {
      alert("Name is required");
      return;
    }

    if (editingItem.category !== 'Catering / Buffet' && !editingItem.price) {
      alert("Price is required for non-catering items");
      return;
    }

    if (editingItem.id) {
      // 🔄 UPDATE
      const { error } = await supabase
        .from('menu_items')
        .update({
          name: editingItem.name,
          description: editingItem.description,
          price: editingItem.price,
          category: editingItem.category,
          image_url: editingItem.image,
          is_featured: editingItem.isFeatured,
          is_chef_recommendation: editingItem.isChefRecommendation,
          subcategory: editingItem.subcategory || null,
          protein_prices: editingItem.proteinPrices || null,
        })
        .eq('id', editingItem.id);

      if (error) {
        alert(error.message);
        return;
      }

    } else {
      // ➕ INSERT
      const { error } = await supabase
        .from('menu_items')
        .insert([
          {
            name: editingItem.name,
            description: editingItem.description,
            price: editingItem.price,
            category: editingItem.category,
            image_url: editingItem.image,
            is_featured: editingItem.isFeatured,
            is_chef_recommendation: editingItem.isChefRecommendation,
            subcategory: editingItem.subcategory || null,
            protein_prices: editingItem.proteinPrices || null,
          },
        ]);

      if (error) {
        alert(error.message);
        return;
      }
    }

    // 🔥 REFRESH MENU FROM DATABASE (NO PAGE RELOAD)
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      const formatted = data.map(item => ({
        ...item,
        image: item.image_url,
        isFeatured: item.is_featured,
        isChefRecommendation: item.is_chef_recommendation,
        proteinPrices: item.protein_prices,
      }));

      updateMenu(formatted);
    }

    setEditingItem(null);
  };



  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl lg:text-2xl font-bold serif text-gold">Menu Management</h1>
        <button
          onClick={() => setEditingItem({ name: '', price: 0, category: Object.keys(MENU_CATEGORIES)[0], subcategory: Object.values(MENU_CATEGORIES)[0][0] || '', description: '', isFeatured: false, isChefRecommendation: false, image: '', proteinPrices: {} })}
          className="flex items-center space-x-2 bg-gold text-black px-4 lg:px-6 py-2 rounded-sm font-bold uppercase tracking-widest text-[10px] lg:text-xs w-full sm:w-auto justify-center"
        >
          <Plus size={16} /> <span>Add New Dish</span>
        </button>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 lg:p-4">
          <div className="bg-[#111] border border-white/10 p-4 lg:p-8 w-full max-w-2xl space-y-6 overflow-y-auto max-h-[95vh]">
            <h2 className="text-xl lg:text-2xl serif text-gold mb-6">{editingItem.id ? 'Edit Item' : 'New Item'}</h2>

            <ImageUpload
              label="Dish Photo"
              value={editingItem.image || ''}
              onChange={(val) => setEditingItem({ ...editingItem, image: val })}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Dish Name</label>
                <input placeholder="e.g. Suya Beef" className="w-full bg-black border border-white/10 p-3 outline-none focus:border-gold" value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} />
              </div>
              {editingItem.category !== 'Catering / Buffet' && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Price (RWF)</label>
                  <input placeholder="0" type="number" step="any" min="0" className="w-full bg-black border border-white/10 p-3 outline-none focus:border-gold" value={editingItem.price || ''} onChange={e => setEditingItem({ ...editingItem, price: Math.round(Number(e.target.value)) || 0 })} />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Category</label>
                <select
                  className="w-full bg-black border border-white/10 p-3 outline-none focus:border-gold"
                  value={editingItem.category}
                  onChange={e => {
                    const cat = e.target.value;
                    const subcat = MENU_CATEGORIES[cat as keyof typeof MENU_CATEGORIES]?.[0] || '';
                    setEditingItem({ ...editingItem, category: cat, subcategory: subcat });
                  }}
                >
                  <option value="" disabled>Select Category</option>
                  {Object.keys(MENU_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Subcategory</label>
                <select
                  className={`w-full bg-black border border-white/10 p-3 outline-none focus:border-gold ${(!editingItem.category || MENU_CATEGORIES[editingItem.category as keyof typeof MENU_CATEGORIES]?.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  value={editingItem.subcategory || ''}
                  onChange={e => setEditingItem({ ...editingItem, subcategory: e.target.value })}
                  disabled={!editingItem.category || MENU_CATEGORIES[editingItem.category as keyof typeof MENU_CATEGORIES]?.length === 0}
                >
                  <option value="">None</option>
                  {editingItem.category && MENU_CATEGORIES[editingItem.category as keyof typeof MENU_CATEGORIES]?.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Manual Image URL (Optional)</label>
                <input placeholder="https://..." className="w-full bg-black border border-white/10 p-3 outline-none focus:border-gold" value={editingItem.image} onChange={e => setEditingItem({ ...editingItem, image: e.target.value })} />
              </div>
            </div>

            {/* Universal Item Variant Builder */}
            {editingItem.category !== 'Catering / Buffet' && (
              <div className="bg-[#1a1a1a] p-6 border border-white/5 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-gold font-bold uppercase tracking-widest text-xs">Item Variations & Sizes</h3>
                    <p className="text-[10px] text-gray-400">Add options like "3-4 People", "5-7 People", or "With Seafood".</p>
                  </div>
                  <button
                    onClick={() => {
                      const current = { ...(editingItem.proteinPrices || {}) };
                      current['New Protein Option'] = editingItem.price || 0;
                      setEditingItem({ ...editingItem, proteinPrices: current });
                    }}
                    className="text-xs uppercase font-bold tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2"
                  >
                    + Add Option
                  </button>
                </div>

                {editingItem.proteinPrices && Object.entries(editingItem.proteinPrices).map(([key, price], index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        const current = { ...(editingItem.proteinPrices || {}) };
                        const val = current[key];
                        delete current[key];
                        current[newKey] = val;
                        setEditingItem({ ...editingItem, proteinPrices: current });
                      }}
                      className="flex-grow bg-black border border-white/10 p-3 outline-none focus:border-gold text-sm"
                      placeholder="e.g. With Goatmeat"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">RWF</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => {
                          const current = { ...(editingItem.proteinPrices || {}) };
                          current[key] = Math.round(Number(e.target.value)) || 0;
                          setEditingItem({ ...editingItem, proteinPrices: current });
                        }}
                        className="w-32 bg-black border border-white/10 p-3 outline-none focus:border-gold text-sm"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const current = { ...(editingItem.proteinPrices || {}) };
                        delete current[key];
                        setEditingItem({ ...editingItem, proteinPrices: current });
                      }}
                      className="text-red-500/50 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {(!editingItem.proteinPrices || Object.keys(editingItem.proteinPrices).length === 0) && (
                  <p className="text-xs text-gray-500 italic">No variations added. The base price will be used.</p>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Description</label>
              <textarea placeholder="Ingredients, preparation method..." className="w-full bg-black border border-white/10 p-3 outline-none focus:border-gold h-24" value={editingItem.description} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}></textarea>
            </div>

            <div className="flex space-x-8">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={editingItem.isFeatured} onChange={e => setEditingItem({ ...editingItem, isFeatured: e.target.checked })} className="accent-gold" />
                <span className="text-xs uppercase tracking-widest font-bold">Featured Dish</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={editingItem.isChefRecommendation} onChange={e => setEditingItem({ ...editingItem, isChefRecommendation: e.target.checked })} className="accent-gold" />
                <span className="text-xs uppercase tracking-widest font-bold">Chef's Selection</span>
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button onClick={() => setEditingItem(null)} className="px-6 py-2 text-gray-400 uppercase font-bold tracking-widest text-xs hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-10 py-3 bg-gold text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-lg">
                {editingItem.id ? 'Save Changes' : 'Create Dish'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-black/40 border border-white/5 overflow-hidden rounded-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px] lg:min-w-0">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-black">Dish</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-black">Category</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-black">Price</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menu.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-4">
                      <img src={item.image} className="w-12 h-12 object-cover rounded-sm border border-white/10" alt="" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-sm">{item.name}</p>
                          {item.isFeatured && <div className="text-blue-500" title="Featured"><CheckCircle size={10} /></div>}
                          {item.isChefRecommendation && <div className="text-gold" title="Chef Recommendation"><CheckCircle size={10} /></div>}
                        </div>
                        <p className="text-[10px] text-gray-500 truncate w-48">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-medium uppercase tracking-widest text-gray-400">
                    {item.category}
                    {item.subcategory && <span className="block text-[9px] text-gray-600 truncate max-w-[120px]">↳ {item.subcategory}</span>}
                  </td>
                  <td className="p-4 font-bold text-gold text-sm">
                    {item.category === 'Catering / Buffet' ? '-' : `${item.price.toLocaleString()} RWF`}
                  </td>
                  <td className="p-4 text-right space-x-4">
                    <button onClick={() => setEditingItem(item)} className="text-gray-500 hover:text-white transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-900 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MenuManager;
