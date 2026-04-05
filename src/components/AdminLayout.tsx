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
    <div className={`flex h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-[#F8F9FA]'}`}>
      {/* Slim Sidebar */}
      <div className={`w-72 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-gray-200">
          <Link to="/admin" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            BABU
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
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
                    'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
                    isActive
                      ? isDarkMode
                        ? 'bg-indigo-600/20 text-indigo-400'
                        : 'bg-indigo-50 text-indigo-600'
                      : isDarkMode
                      ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                      : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>

                {/* Gradient Glow Indicator */}
                {isActive && (
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-r-full shadow-lg shadow-indigo-500/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} p-4 space-y-3`}>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              'w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200',
              isDarkMode
                ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            )}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="text-sm font-medium">{isDarkMode ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Nav */}
        <div className={`h-20 border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} flex items-center justify-between px-8`}>
          {/* Glassmorphism Search */}
          <div className={cn(
            'flex items-center space-x-2 px-4 py-2 rounded-xl backdrop-blur-md transition-all',
            isDarkMode
              ? 'bg-slate-700/50 border border-slate-600'
              : 'bg-white/30 border border-gray-200/50 hover:bg-white/50'
          )}>
            <Search className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search orders..."
              className={cn(
                'bg-transparent outline-none text-sm w-48',
                isDarkMode ? 'text-slate-200 placeholder-slate-400' : 'text-slate-900 placeholder-slate-500'
              )}
            />
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            <button className={cn(
              'relative p-2 rounded-lg transition-colors',
              isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
            )}>
              <Bell className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold`}>
              A
            </div>
            <button
              onClick={handleLogout}
              className={cn(
                'p-2 rounded-lg transition-colors ml-2',
                isDarkMode ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400' : 'hover:bg-gray-100 text-slate-600 hover:text-red-600'
              )}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-[#F8F9FA]'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};