import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, MapPin, Phone, User, AlertCircle, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutProps {
  cart: CartItem[];
  orderType: 'delivery' | 'takeaway';
  onClose: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, orderType, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (orderType === 'delivery' && !formData.address.trim()) {
      setError('Please enter your delivery address');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Create guest order record
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          order_type: orderType,
          total_amount: totalAmount,
          status: 'new',
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        })
        .select()
        .single();

      if (orderError) throw orderError;

      console.log('✅ Order created:', orderData);
      setSuccess(true);

      // Show success for 2 seconds then redirect
      setTimeout(() => {
        onClose();
        navigate('/order-success', { state: { orderId: orderData.id } });
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to place order';
      console.error('❌ Order error:', errorMessage);
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-[2rem] p-10 max-w-md w-full flex flex-col items-center animate-fade-in-up">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
            <CheckCircle className="h-20 w-20 text-green-500 relative z-10" />
          </div>
          <h2 className="text-3xl font-black text-center mb-3 tracking-tighter uppercase">Order Placed!</h2>
          <p className="text-gray-500 text-center text-xs font-black uppercase tracking-widest leading-relaxed">
            Your feast is being prepared with love. Redirecting you to track it...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-fade-in-up">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-black tracking-tighter uppercase">Complete Order</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center gap-4 animate-shake">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-red-700 text-[10px] font-black uppercase tracking-tight">{error}</p>
          </div>
        )}

        {/* Order Summary - Native App Style */}
        <div className="mb-8 bg-charcoal text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 blur-2xl" />
          
          <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Summary</h3>
          <div className="space-y-3 mb-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-[11px] font-black uppercase tracking-tight text-gray-400">
                <span>{item.name} × {item.quantity}</span>
                <span className="text-white">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 flex justify-between items-end">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Total Amount</p>
              <p className="text-2xl font-black text-primary tracking-tighter mt-1">₹{totalAmount.toFixed(0)}</p>
            </div>
            <div className="bg-white/5 px-3 py-1 rounded-full border border-white/5">
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">{orderType}</span>
            </div>
          </div>
        </div>

        {/* Customer Details Form */}
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="SAHIL KHAN"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="h-12 pl-12 bg-gray-50 border-transparent rounded-2xl text-[11px] font-black uppercase tracking-widest focus:bg-white focus:border-primary/20 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="h-12 pl-12 bg-gray-50 border-transparent rounded-2xl text-[11px] font-black uppercase tracking-widest focus:bg-white focus:border-primary/20 transition-all"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {orderType === 'delivery' && (
            <div className="space-y-2">
              <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Delivery Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                <textarea
                  id="address"
                  name="address"
                  placeholder="STREET, AREA, LANDMARK..."
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full h-24 pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl text-[11px] font-black uppercase tracking-widest focus:bg-white focus:border-primary/20 focus:outline-none transition-all resize-none"
                  disabled={loading}
                />
              </div>
            </div>
          )}
        </form>

        {/* Action Buttons */}
        <div className="mt-10 flex gap-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePlaceOrder}
            className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
