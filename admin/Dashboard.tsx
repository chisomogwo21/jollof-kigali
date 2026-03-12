
import React from 'react';
import { useApp } from '../AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { orders, reservations, menu } = useApp();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalRevenue = currentMonthOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  const stats = [
    { label: 'Revenue (This Month)', value: `${totalRevenue.toLocaleString()} RWF`, icon: DollarSign, color: 'text-green-500' },
    { label: 'Active Orders', value: orders.filter(o => o.status === 'pending' || o.status === 'payment_pending').length, icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Reservations', value: reservations.length, icon: Users, color: 'text-purple-500' },
    { label: 'Menu Items', value: menu.length, icon: TrendingUp, color: 'text-gold' },
  ];

  const chartData = [
    { name: 'Mon', revenue: 400000 },
    { name: 'Tue', revenue: 300000 },
    { name: 'Wed', revenue: 200000 },
    { name: 'Thu', revenue: 278000 },
    { name: 'Fri', revenue: 189000 },
    { name: 'Sat', revenue: 239000 },
    { name: 'Sun', revenue: 349000 },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-black/40 border border-white/5 p-4 lg:p-6 rounded-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 lg:p-3 rounded-sm bg-white/5 ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-xl lg:text-2xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-black/40 border border-white/5 p-4 lg:p-8 rounded-sm">
          <h3 className="text-[10px] lg:text-sm uppercase tracking-widest text-gray-400 font-bold mb-6 lg:mb-8">Weekly Revenue Trend</h3>
          <div className="h-64 lg:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '4px' }} />
                <Line type="monotone" dataKey="revenue" stroke="#C5A059" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-black/40 border border-white/5 p-4 lg:p-8 rounded-sm overflow-hidden">
          <h3 className="text-[10px] lg:text-sm uppercase tracking-widest text-gray-400 font-bold mb-6 lg:mb-8">Recent Orders (This Month)</h3>
          <div className="space-y-6">
            {currentMonthOrders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <p className="text-sm font-bold">{order.customerName}</p>
                  <p className="text-[10px] text-gray-500 uppercase">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gold font-bold">{order.totalPrice.toLocaleString()} RWF</p>
                  <p className={`text-[9px] uppercase font-bold ${order.status === 'pending' || order.status === 'payment_pending' ? 'text-orange-500' : 'text-green-500'}`}>{order.status.replace('_', ' ')}</p>
                </div>
              </div>
            ))}
            {currentMonthOrders.length === 0 && <p className="text-center text-gray-600 italic py-10">No orders this month yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
