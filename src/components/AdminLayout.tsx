import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, ChefHat, Menu, Users, Settings, 
  Home, Moon, Sun, Bell, Search, LogOut, X,
  Zap, Shield, Heart, ExternalLink, Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Orders', href: '/admin/orders', icon: ChefHat },
  { name: 'Menu', href: '/admin/menu', icon: Menu },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, role, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Check authentication
  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.warn('👮‍♂️ AdminLayout: Unauthenticated access attempt to /admin - redirecting to login');
        navigate('/admin/login', { state: { from: location } });
      } else if (role && role !== 'admin') {
        console.warn('👮‍♂️ AdminLayout: Non-admin access attempt (role:', role, ') - redirecting home');
        navigate('/');
      } else {
        console.log('✅ AdminLayout: Authenticated as admin (', user.email, ')');
      }
    }
  }, [user, loading, role, navigate, location]);

  // Show loading state
  if (loading) {
    console.log('🔄 AdminLayout: Showing initialization spinner...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0E14]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto"></div>
          <p className="text-slate-400 mt-4 font-black uppercase tracking-[0.2em] text-[10px]">Initializing System...</p>
        </div>
      </div>
    );
  }

  // Final gate to prevent rendering of dashboard before auth checks complete
  if (!user || (role && role !== 'admin')) {
    console.log('🚧 AdminLayout: Access denied or redirecting...');
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0E14] text-slate-300 selection:bg-electric-blue/30">
      {/* Radial Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/5 rounded-full blur-[120px]" />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Slim Glassmorphic Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 w-64 transform lg:transform-none transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-50 flex flex-col",
        "bg-[#0B0E14]/60 backdrop-blur-2xl border-r border-white/5",
        isSidebarOpen ? "translate-x-0 shadow-[20px_0_50px_rgba(0,0,0,0.5)]" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo Section */}
        <div className="h-24 flex items-center justify-between px-8">
          <Link to="/admin" className="group flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center shadow-[0_0_20px_rgba(0,210,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,210,255,0.5)] transition-all duration-500">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase group-hover:tracking-widest transition-all duration-500">
              BABU<span className="text-electric-blue">DASH</span>
            </span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2 custom-scrollbar">
          <div className="px-4 mb-6">
            <Link 
              to="/" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-electric-blue hover:bg-electric-blue/5 hover:border-electric-blue/20 transition-all duration-300 group/exit"
            >
              <Globe className="w-4 h-4 transition-transform group-hover/exit:rotate-12" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">View Live Site</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover/exit:opacity-100 transition-opacity" />
            </Link>
          </div>

          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Core Modules</p>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className="relative group block"
              >
                <div
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 active:scale-[0.98]',
                    isActive
                      ? 'bg-electric-blue/10 text-white shadow-[inset_0_0_20px_rgba(0,210,255,0.1)] border border-electric-blue/20'
                      : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                  )}
                >
                  <div className={cn(
                    "relative transition-all duration-300",
                    isActive && "text-electric-blue"
                  )}>
                    <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110")} />
                    {isActive && (
                      <div className="absolute inset-0 blur-md bg-electric-blue/50 opacity-50" />
                    )}
                  </div>
                  <span className={cn(
                    "text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                    isActive ? "translate-x-1" : "group-hover:translate-x-1"
                  )}>
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active-pill"
                      className="absolute left-[-16px] w-1 h-6 bg-electric-blue rounded-r-full shadow-[0_0_15px_#00D2FF]"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-neon-purple/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-neon-purple" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-tighter">Pro Security</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Protection</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Nav */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-30 bg-[#0B0E14]/40 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90"
            >
              <Menu className="w-6 h-6 text-slate-400" />
            </button>

            {/* Futuristic Search */}
            <div className="hidden sm:flex items-center space-x-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/5 focus-within:border-electric-blue/40 focus-within:bg-white/10 transition-all group w-80">
              <Search className="w-4 h-4 text-slate-500 group-focus-within:text-electric-blue transition-colors" />
              <input
                type="text"
                placeholder="EXECUTE SEARCH..."
                className="bg-transparent outline-none text-[10px] font-black tracking-[0.1em] text-slate-200 placeholder-slate-600 w-full"
              />
            </div>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center gap-4 text-right">
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">System Admin</p>
                <p className="text-[8px] font-bold text-electric-blue uppercase tracking-widest">Root Access Granted</p>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
            </div>

            <button className="relative p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group active:scale-90">
              <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-electric-blue rounded-full border-2 border-[#0B0E14] shadow-[0_0_10px_#00D2FF]" />
            </button>
            
            <div className="relative group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-electric-blue to-neon-purple p-[1px] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
                <div className="w-full h-full rounded-2xl bg-[#0B0E14] flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-electric-blue/20 to-neon-purple/20 flex items-center justify-center text-white font-black text-sm tracking-tighter">
                    SA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-[1600px] mx-auto p-6 sm:p-10">
            <Outlet />
          </div>

          {/* Mobile Back to Website FAB */}
          <div className="lg:hidden fixed bottom-6 right-6 z-[60]">
            <Link
              to="/"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-electric-blue text-white shadow-[0_0_20px_rgba(0,210,255,0.4)] backdrop-blur-xl border border-white/20 active:scale-90 transition-all duration-300"
            >
              <Globe className="w-6 h-6" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};