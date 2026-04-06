import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Phone, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  const orderId = location.state?.orderId;

  useEffect(() => {
    // Show the success toast when the page loads
    toast.success("Order placed successfully!", {
      description: "Your delicious meal is being prepared.",
      duration: 5000,
    });

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30"></div>
            <CheckCircle className="w-20 h-20 text-green-500 relative" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">Your order has been successfully placed</p>

        {/* Order Details */}
        {orderId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="font-mono text-lg font-bold text-blue-600 break-all">{orderId}</p>
          </div>
        )}

        {/* Estimated Time */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-gray-700 font-semibold">Estimated Time</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">30-40 minutes</p>
          <p className="text-sm text-gray-600 mt-1">Your delicious meal will arrive soon!</p>
        </div>

        {/* Info Cards */}
        <div className="space-y-2 mb-8 text-left">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Contact</p>
              <p className="text-sm font-semibold text-gray-800">We'll call if needed</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Tracking</p>
              <p className="text-sm font-semibold text-gray-800">Track your order in real-time</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/')}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Back to Home
          </Button>
          <Button 
            onClick={() => navigate('/orders')}
            variant="outline"
            className="w-full"
          >
            View Order Status
          </Button>
        </div>

        {/* Auto-redirect Counter */}
        <p className="text-xs text-gray-500 mt-6">
          Redirecting to home in {countdown}s...
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
