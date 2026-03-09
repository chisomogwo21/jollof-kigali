
import React from 'react';
import { useApp } from '../AppContext';
import { Check, X, Eye } from 'lucide-react';
import { OrderStatus } from '../types';
import { supabase } from '../lib/supabase';

const OrderManager: React.FC = () => {
  const { orders, updateOrders, menu } = useApp();

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: status })
        .eq('id', id);

      if (error) throw error;
      updateOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch (err: any) {
      alert(`Failed to update order status: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold serif text-gold">Incoming Orders</h1>

      <div className="bg-black/40 border border-white/5 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-black">Customer</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-black">Order Summary</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-black">Total</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-black">Status</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-sm">{order.customerName}</p>
                  <p className="text-[10px] text-gray-500">{order.customerPhone}</p>
                </td>
                <td className="p-4">
                  <p className="text-[11px] text-gray-400">
                    {order.items.map(i => {
                      const item = menu.find(m => m.id === i.menuItemId);
                      return `${item?.name || 'Item'} x${i.quantity}`;
                    }).join(', ')}
                  </p>
                </td>
                <td className="p-4 font-bold text-gold text-sm">{order.totalPrice.toLocaleString()} RWF</td>
                <td className="p-4">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-sm ${order.status === 'payment_pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      order.status === 'pending' ? 'bg-orange-500/20 text-orange-500' :
                        order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-500' :
                          order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                            'bg-red-500/20 text-red-500'
                    }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-right space-x-3">
                  {order.status === 'payment_pending' && (
                    <button
                      onClick={() => updateStatus(order.id, 'confirmed')}
                      className="p-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded-sm transition-all"
                      title="Confirm Payment Received"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(order.id, 'confirmed')}
                      className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-sm transition-all"
                      title="Confirm Order"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(order.id, 'delivered')}
                      className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-sm transition-all"
                      title="Mark as Delivered"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => updateStatus(order.id, 'cancelled')}
                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-sm transition-all"
                    title="Cancel Order"
                  >
                    <X size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="p-20 text-center text-gray-600 italic">No orders available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManager;
