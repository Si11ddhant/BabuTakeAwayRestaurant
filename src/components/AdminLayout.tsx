import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, ChefHat, Menu, Users, Settings, Home, Moon, Sun, Bell, Search, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

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
  const { user, role, loading, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login', { state: { from: location } });
    }
  }, [user, loading, navigate, location]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
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
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-[#F8F9FA]'}`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Slim Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 w-72 transform lg:transform-none transition-transform duration-300 ease-in-out z-50 flex flex-col border-r shadow-2xl lg:shadow-none",
        isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo Section */}
        <div className={cn(
          "h-20 flex items-center justify-between px-6 border-b",
          isDarkMode ? "border-slate-700" : "border-gray-200"
        )}>
          <Link to="/admin" className="text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            BABU DASH
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className={cn("w-5 h-5", isDarkMode ? "text-slate-400" : "text-slate-500")} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
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
                    'flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 active:scale-[0.98]',
                    isActive
                      ? isDarkMode
                        ? 'bg-indigo-600/20 text-indigo-400 shadow-lg shadow-indigo-600/10'
                        : 'bg-indigo-50 text-indigo-600 shadow-sm'
                      : isDarkMode
                      ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                      : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900'
                  )}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", isActive && "scale-110")} />
                  <span className="text-sm font-black uppercase tracking-widest">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className={cn(
          "p-4 border-t space-y-2",
          isDarkMode ? "border-slate-700" : "border-gray-200"
        )}>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              'w-full flex items-center justify-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 font-bold text-xs uppercase tracking-widest',
              isDarkMode
                ? 'bg-slate-700/50 text-yellow-400 hover:bg-slate-700 shadow-inner'
                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            )}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{isDarkMode ? 'Light' : 'Dark'} Mode</span>
          </button>
          
          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center justify-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 font-bold text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10',
              isDarkMode ? 'hover:text-red-400' : ''
            )}
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Nav */}
        <header className={cn(
          "h-20 border-b flex items-center justify-between px-4 sm:px-8 shrink-0 z-30",
          isDarkMode ? "bg-slate-800/50 border-slate-700 backdrop-blur-md" : "bg-white border-gray-200 shadow-sm"
        )}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95"
            >
              <Menu className={cn("w-6 h-6", isDarkMode ? "text-slate-400" : "text-slate-600")} />
            </button>

            {/* Glassmorphism Search - Hidden on tiny screens */}
            <div className={cn(
              'hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl backdrop-blur-md transition-all group focus-within:ring-2 focus-within:ring-indigo-500/20',
              isDarkMode
                ? 'bg-slate-700/50 border border-slate-600'
                : 'bg-gray-100 border border-transparent'
            )}>
              <Search className={cn("w-4 h-4 transition-colors", isDarkMode ? "text-slate-500 group-focus-within:text-indigo-400" : "text-slate-400 group-focus-within:text-indigo-600")} />
              <input
                type="text"
                placeholder="Search anything..."
                className={cn(
                  'bg-transparent outline-none text-sm w-40 lg:w-64 font-medium',
                  isDarkMode ? 'text-slate-200 placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                )}
              />
            </div>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className={cn(
              'relative p-2.5 rounded-xl transition-all active:scale-95',
              isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-slate-600'
            )}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
            </button>
            
            <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 hidden sm:block mx-2" />
            
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className={cn(
                "hidden sm:flex flex-col items-end",
                isDarkMode ? "text-slate-300" : "text-slate-700"
              )}>
                <span className="text-xs font-black uppercase tracking-widest leading-none mb-1">Admin User</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">System Root</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 transform group-hover:scale-105 transition-transform">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8",
          isDarkMode ? "bg-slate-900" : "bg-[#F8F9FA]"
        )}>
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};