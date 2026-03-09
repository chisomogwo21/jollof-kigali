
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { Lock, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password required.');
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid administrative credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-black border border-white/10 p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold serif text-gold mb-2 tracking-tighter">JOLLOF Admin</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Secure Access Point</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Admin Email</label>
            <input
              type="email"
              required
              autoFocus
              className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold transition-colors text-white text-sm mb-4"
              placeholder="admin@jollofkigali.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Admin Password</label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                className="w-full bg-black border border-white/10 p-4 pl-12 outline-none focus:border-gold transition-colors text-white text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            </div>
            {error && <p className="text-red-500 text-[10px] mt-2 uppercase font-bold tracking-widest">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gold text-black font-bold uppercase tracking-[0.2em] hover:bg-white transition-all"
          >
            Access Dashboard
          </button>
        </form>

        <div className="mt-8 text-center pt-8 border-t border-white/5">
          <button
            onClick={() => navigate('/')}
            className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-white flex items-center justify-center mx-auto transition-colors"
          >
            <ArrowLeft size={14} className="mr-2" /> Back to Website
          </button>
        </div>
      </div>
      <p className="mt-8 text-[9px] text-gray-700 uppercase tracking-widest">Authorized Personnel Only</p>
    </div>
  );
};

export default AdminLogin;
