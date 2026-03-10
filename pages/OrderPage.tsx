import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Trash2, ShoppingCart, MessageCircle, CreditCard, Loader2, Smartphone, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

const OrderPage: React.FC = () => {
  const { cart, removeFromCart, clearCart, settings, updateOrders, orders } = useApp();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', note: '' });
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [placed, setPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMomoPrompt, setShowMomoPrompt] = useState(false);

  // Delivery Fee Logic
  const calculateDeliveryFee = (location: string) => {
    if (location === 'Nyarugenge, Kacyiru, Kimihurura, Remera, Kicukiro') return 2000;
    if (location === 'Kagugu, Kibagabaga, Gaculiro') return 3000;
    if (location === 'Kanombe, Ndera, Masaka, Gisozi, Kabeza, Nyamata') return 4000;
    return 0; // Default when empty
  };

  const subtotal = cart.reduce((acc, curr) => acc + (curr.item.price + (curr.swallowPrice || 0) + (curr.proteinPrice || 0)) * curr.quantity, 0);
  const takeawayCost = cart.reduce((acc, curr) => acc + (curr.item.subcategory === 'Soups' ? 1000 : 500) * curr.quantity, 0);
  const delivery = (subtotal > 0 && deliveryLocation !== '') ? calculateDeliveryFee(deliveryLocation) : 0;
  const total = subtotal + delivery + takeawayCost;

  const handleCheckoutInit = (type: 'online' | 'momo' | 'whatsapp') => {
    if (!formData.name || !formData.phone || deliveryLocation === '') {
      alert("Please enter your name, phone number, and choose your sector.");
      return;
    }

    if (type === 'momo') {
      setShowMomoPrompt(true);
      return;
    }

    processOrder(type);
  };

  const processOrder = async (type: 'online' | 'momo' | 'whatsapp') => {
    setIsSubmitting(true);

    const orderDetails = cart.map(i => `${i.item.name} ${i.protein ? `[${i.protein}]` : ''} ${i.swallow ? `w/ ${i.swallow}` : ''} (x${i.quantity})`).join(', ');
    const submissionData = {
      _subject: `New ${type.toUpperCase()} Order from ${formData.name}`,
      "Order Type": type,
      "Customer Name": formData.name,
      "Customer Phone": formData.phone,
      "Customer Email": formData.email,
      "Order Details": orderDetails,
      "Subtotal": `${subtotal.toLocaleString()} RWF`,
      "Takeaway": `${takeawayCost.toLocaleString()} RWF`,
      "Delivery Zone": deliveryLocation,
      "Delivery Fee": `${delivery.toLocaleString()} RWF`,
      "Total Price": `${total.toLocaleString()} RWF`,
      "Delivery Note": formData.note
    };

    // 'momo' orders require admin to verify payment first. Others fall back to 'pending'.
    const initialStatus = type === 'momo' ? 'payment_pending' : 'pending';

    try {
      // Submit to Formspree
      await fetch("https://formspree.io/f/mgoevezk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      // Submit to Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          total_price: total,
          status: initialStatus,
          type: type === 'momo' ? 'Mobile Money' : type
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert Order Items
      if (cart.length > 0) {
        const orderItems = cart.map(i => ({
          order_id: orderData.id,
          menu_item_id: i.item.id,
          quantity: i.quantity
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      if (type === 'whatsapp') {
        const message = `*New Order from Jollof Kigali*%0A---%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Order:*%0A${cart.map(i => `- ${i.item.name} ${i.protein ? `[${i.protein}] ` : ''}${i.swallow ? `with ${i.swallow}` : ''} x${i.quantity}`).join('%0A')}%0A---%0A*Subtotal:* ${subtotal.toLocaleString()} RWF%0A*Takeaway:* ${takeawayCost.toLocaleString()} RWF%0A*Delivery (${deliveryLocation}):* ${delivery.toLocaleString()} RWF%0A*Total:* ${total.toLocaleString()} RWF`;

        // Ensure the WhatsApp number strictly contains digits (removes + or spaces)
        let waNumber = settings.contact.whatsapp.replace(/\D/g, '');
        // If it starts with 0 instead of country code, we may need to handle that, but assuming 250 is standard
        if (waNumber.startsWith('078')) {
          waNumber = '25' + waNumber;
        }

        window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
      }

      clearCart();
      setShowMomoPrompt(false);
      setPlaced(true);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to process order. Please check your connection or try via WhatsApp directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placed) {
    return (
      <div className="pt-40 pb-24 px-4 text-center">
        <SEO title="Order Received" url="/order" />
        <h1 className="text-4xl md:text-6xl font-bold mb-6 serif text-gold">Thank You!</h1>
        <p className="text-xl text-gray-400 mb-10">Your order has been received. We are processing it now.</p>
        <button onClick={() => window.location.hash = '/'} className="px-8 py-3 bg-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative">
      <SEO
        title="Checkout Flow"
        description="Complete your order at Jollof Kigali. Enjoy the authentic taste of Nigeria delivered to your door."
        url="/order"
      />
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-12">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-10 serif flex items-center">
            <ShoppingCart className="mr-4 text-gold" /> Your Order
          </h1>

          {cart.length === 0 ? (
            <div className="bg-[#111] p-20 text-center border border-white/5">
              <p className="text-gray-500 mb-8">Your basket is empty.</p>
              <button onClick={() => window.location.hash = '/menu'} className="text-gold font-bold uppercase tracking-widest border-b border-gold/40 pb-1">Browse Menu</button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map(({ id, item, quantity, swallow, swallowPrice, protein, proteinPrice }) => (
                <div key={id} className="flex gap-6 bg-[#111] p-6 border border-white/5 relative group">
                  <img src={item.image} className="w-24 h-24 object-contain bg-black/50" alt={item.name} />
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold serif text-gold">{item.name}</h3>
                    {protein && <p className="text-xs text-white mb-1 opacity-80 uppercase tracking-widest">{protein}</p>}
                    {swallow && <p className="text-xs text-gold mb-1">↳ {swallow} {swallowPrice ? `(+${swallowPrice.toLocaleString()} RWF)` : ''}</p>}
                    <p className="text-gray-500 text-sm mb-2">{(item.price + (swallowPrice || 0) + (proteinPrice || 0)).toLocaleString()} RWF</p>
                    <p className="text-sm font-medium">Quantity: {quantity}</p>
                  </div>
                  <div className="text-right flex flex-col justify-between">
                    <p className="font-bold">{((item.price + (swallowPrice || 0) + (proteinPrice || 0)) * quantity).toLocaleString()} RWF</p>
                    <button onClick={() => removeFromCart(id)} className="text-red-500/60 hover:text-red-500 self-end transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Checkout Sidebar */}
        <div className="space-y-8">
          <div className="bg-[#111] p-8 border border-white/5 sticky top-32">
            <h2 className="text-2xl font-bold mb-6 serif">Checkout</h2>

            <div className="space-y-4 mb-8">
              <input
                type="text" placeholder="Full Name *"
                className="w-full bg-black border border-white/10 p-3 text-sm focus:border-gold outline-none transition-colors"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="text" placeholder="Phone Number *"
                className="w-full bg-black border border-white/10 p-3 text-sm focus:border-gold outline-none transition-colors"
                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
              <input
                type="email" placeholder="Email Address (Optional)"
                className="w-full bg-black border border-white/10 p-3 text-sm focus:border-gold outline-none transition-colors"
                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              <textarea
                placeholder="Delivery Notes (Room number, landmark...)"
                className="w-full bg-black border border-white/10 p-3 text-sm focus:border-gold outline-none h-24 transition-colors"
                value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })}
              ></textarea>
              <select
                className={`w-full bg-black border p-3 text-sm focus:border-gold outline-none transition-colors ${deliveryLocation === '' ? 'border-red-500/50 text-gray-400' : 'border-white/10 text-white'}`}
                value={deliveryLocation}
                onChange={e => setDeliveryLocation(e.target.value)}
              >
                <option value="" disabled>Choose sector *</option>
                <option value="Nyarugenge, Kacyiru, Kimihurura, Remera, Kicukiro">Nyarugenge, Kacyiru, Kimihurura, Remera, Kicukiro</option>
                <option value="Kagugu, Kibagabaga, Gaculiro">Kagugu, Kibagabaga, Gaculiro</option>
                <option value="Kanombe, Ndera, Masaka, Gisozi, Kabeza, Nyamata">Kanombe, Ndera, Masaka, Gisozi, Kabeza, Nyamata</option>
              </select>
            </div>

            <div className="space-y-2 mb-8 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Takeaway Packaging</span>
                <span>{takeawayCost.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery</span>
                <span>{delivery.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/10">
                <span>Total</span>
                <span className="text-gold">{total.toLocaleString()} RWF</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                disabled={cart.length === 0 || isSubmitting}
                onClick={() => handleCheckoutInit('momo')}
                className="w-full py-4 bg-[#FFCC00] text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center disabled:opacity-50 hover:bg-white transition-all mb-6"
              >
                {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Smartphone size={18} className="mr-2" />}
                Pay via Mobile Money
              </button>

              <div className="pt-6 border-t border-white/10 text-center">
                <p className="text-gray-400 text-sm mb-4">For more payment options, contact us</p>
                <button
                  disabled={cart.length === 0 || isSubmitting}
                  onClick={() => handleCheckoutInit('whatsapp')}
                  className="w-full py-4 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center disabled:opacity-50 transition-all font-serif"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <MessageCircle size={18} className="mr-2" />}
                  Order via WhatsApp
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Mobile Money Prompt Modal */}
      {showMomoPrompt && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#111] border border-gold/30 p-8 max-w-md w-full relative">
            <h3 className="text-2xl font-bold serif text-gold mb-2 flex items-center">
              <Smartphone className="mr-2" /> Mobile Money Payment
            </h3>
            <p className="text-sm text-gray-400 mb-6">Follow the instructions below to complete your order manually.</p>

            <div className="bg-black border border-white/10 p-6 mb-8 text-center">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Send Amount</p>
              <p className="text-3xl font-bold text-white mb-6">{total.toLocaleString()} RWF</p>

              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">To MTN MoMo Code</p>
              <p className="text-xl font-bold text-gold tracking-widest">004171</p>
              <p className="text-[10px] text-gray-500 mt-2 uppercase">Name: MANNY GLOBAL GRP</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => processOrder('momo')}
                disabled={isSubmitting}
                className="w-full py-4 bg-[#FFCC00] text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center disabled:opacity-50 hover:bg-white transition-colors"
              >
                {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <CheckCircle size={18} className="mr-2" />}
                I Have Sent The Money
              </button>
              <button
                onClick={() => setShowMomoPrompt(false)}
                disabled={isSubmitting}
                className="w-full py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                Cancel / Change Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
