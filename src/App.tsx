import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/context/AdminContext";
import { AdminLayout } from "@/components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import MenuManagement from "./pages/MenuManagement";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import OrderSuccess from "./pages/OrderSuccess";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, Component, ErrorInfo, ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Robust Error Boundary to prevent "disappearing" website on crash
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 REACT CRASH DETECTED:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-rose-500/20 flex items-center justify-center mb-6 border border-rose-500/30">
            <span className="text-4xl">💥</span>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">System Failure</h1>
          <p className="text-slate-400 text-sm max-w-md font-medium mb-8">
            The application encountered a critical runtime error. We've logged the incident for immediate investigation.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-electric-blue text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(0,210,255,0.3)] active:scale-95 transition-all"
          >
            Restart Engine
          </button>
          <pre className="mt-12 p-4 bg-black/40 rounded-xl border border-white/5 text-[10px] text-rose-400/60 font-mono text-left max-w-2xl overflow-auto">
            {this.state.error?.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  useEffect(() => {
    // Global Error Monitoring
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('💥 UNCAUGHT EXCEPTION:', {
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error?.stack || event.error
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🌊 UNHANDLED PROMISE REJECTION:', {
        reason: event.reason?.message || event.reason,
        stack: event.reason?.stack
      });
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    console.warn('🚀 System initialized. Monitoring for runtime failures...');

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AdminProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-center" richColors />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/admin/login" element={<SignIn />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="menu" element={<MenuManagement />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="analytics" element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AdminProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
