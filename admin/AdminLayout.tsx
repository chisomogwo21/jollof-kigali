import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Utensils, ShoppingCart, Calendar, Settings, LogOut, ArrowLeft, FileText, Menu, X } from 'lucide-react';
import { useApp } from '../AppContext';

const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAdmin, orders, reservations } = useApp();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'payment_pending').length;
  const pendingReservationsCount = reservations.filter(r => r.status === 'pending').length;

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, badge: 0 },
    { name: 'Menu Items', path: '/admin/menu', icon: Utensils, badge: 0 },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart, badge: pendingOrdersCount },
    { name: 'Reservations', path: '/admin/reservations', icon: Calendar, badge: pendingReservationsCount },
    { name: 'Blog Posts', path: '/admin/blog', icon: FileText, badge: 0 },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings, badge: 0 },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8 border-b border-white/10 flex items-center justify-between">
        <h1 className="text-xl font-bold serif text-gold tracking-tight">JOLLOF Admin</h1>
        <button
          className="lg:hidden text-gray-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={20} />
        </button>
      </div>
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 transition-colors rounded-sm uppercase tracking-widest text-[10px] font-bold ${isActive ? 'bg-gold text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex items-center space-x-3">
                <Icon size={16} />
                <span>{item.name}</span>
              </div>
              {item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${isActive ? 'bg-black text-gold' : 'bg-red-500 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-500/60 hover:text-red-500 text-[10px] uppercase font-bold tracking-widest hover:bg-red-500/5 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
        <Link to="/" className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-white text-[10px] uppercase font-bold tracking-widest transition-colors">
          <ArrowLeft size={16} />
          <span>Return to Site</span>
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-black border-r border-white/10 hidden lg:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/10 transform transition-transform duration-300 lg:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="h-16 lg:h-20 bg-black/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-[10px] lg:text-sm font-bold uppercase tracking-widest text-gray-400 truncate max-w-[150px] lg:max-w-none">
              {menuItems.find(i => i.path === location.pathname)?.name || 'Admin'}
            </h2>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] lg:text-xs font-bold uppercase tracking-widest">Admin User</p>
              <p className="text-[9px] lg:text-[10px] text-gray-500">Super Admin</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gold rounded-full flex items-center justify-center text-black font-bold text-xs lg:text-base">A</div>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
