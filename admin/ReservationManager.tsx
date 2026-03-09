
import React from 'react';
import { useApp } from '../AppContext';
import { Check, X, Calendar as CalIcon } from 'lucide-react';
import { ReservationStatus } from '../types';
import { supabase } from '../lib/supabase';

const ReservationManager: React.FC = () => {
  const { reservations, updateReservations } = useApp();

  const updateStatus = async (id: string, status: ReservationStatus) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: status })
        .eq('id', id);

      if (error) throw error;
      updateReservations(reservations.map(r => r.id === id ? { ...r, status } : r));
    } catch (err: any) {
      alert(`Failed to update reservation status: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold serif text-gold">Table Reservations</h1>

      <div className="bg-black/40 border border-white/5 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-black">Date & Time</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-black">Guest Info</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-black">Guests</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-black">Status</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(res => (
              <tr key={res.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <CalIcon size={14} className="text-gold" />
                    <div>
                      <p className="font-bold text-sm">{res.date}</p>
                      <p className="text-[10px] text-gray-500">{res.time}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-bold text-sm">{res.customerName}</p>
                  <p className="text-[10px] text-gray-500">{res.customerPhone}</p>
                  {res.specialRequests && <p className="text-[9px] text-gray-600 italic">"{res.specialRequests}"</p>}
                </td>
                <td className="p-4 text-sm">{res.guests} People</td>
                <td className="p-4">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-sm ${res.status === 'pending' ? 'bg-orange-500/20 text-orange-500' :
                    res.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                    {res.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-3">
                  {res.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(res.id, 'confirmed')}
                      className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-sm transition-all"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => updateStatus(res.id, 'cancelled')}
                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-sm transition-all"
                  >
                    <X size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr><td colSpan={5} className="p-20 text-center text-gray-600 italic">No reservations booked yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationManager;
