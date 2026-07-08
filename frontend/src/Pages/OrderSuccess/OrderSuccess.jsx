import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiTruck, FiHome, FiArrowRight, FiShoppingBag, FiCheck } from 'react-icons/fi';
import { Button, Card, Badge } from '../../components/ui';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { 
          clearInterval(timer); 
          navigate('/myorders'); 
          return 0; 
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <Card 
        variant="default" 
        radius="3xl" 
        padding="none" 
        className="border border-slate-100 shadow-card flex flex-col items-center text-center max-w-md w-full animate-scaleIn overflow-hidden"
      >
        
        {/* Top green accent strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-emerald-600" />

        <div className="p-8 sm:p-10 flex flex-col items-center w-full">
          {/* Animated checkmark icon */}
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-25" />
            <div className="relative w-full h-full rounded-full bg-emerald-50 border-4 border-emerald-400 flex items-center justify-center text-emerald-500 shadow-sm">
              <FiCheck size={36} strokeWidth={2.5} />
            </div>
          </div>

          <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest mb-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50">
            Order Confirmed
          </span>
          
          <h1 className="font-poppins font-extrabold text-xl sm:text-2xl text-slate-900 mb-3 tracking-tight">
            Your food is on the way!
          </h1>
          
          <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-6 max-w-sm">
            We&apos;ve received your order and the kitchen is preparing your delicious meal. Estimated delivery is 30–45 minutes.
          </p>

          {/* Simple static progress list */}
          <div className="w-full space-y-2.5 mb-8 text-left">
            {[
              { icon: <FiCheckCircle size={14} />, label: 'Order Received', done: true },
              { icon: <FiClock size={14} />, label: 'Kitchen Preparing', done: true },
              { icon: <FiTruck size={14} />, label: 'Out for Delivery', done: false },
              { icon: <FiHome size={14} />, label: 'Delivered', done: false },
            ].map((step, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider ${
                  step.done 
                    ? 'bg-emerald-50/70 text-emerald-800 border border-emerald-100/30' 
                    : 'bg-slate-50 text-slate-400 border border-slate-100/50'
                }`}
              >
                <span className="flex-shrink-0">{step.icon}</span>
                <span className="flex-1 truncate">{step.label}</span>
                {step.done && (
                  <span className="text-emerald-600 flex-shrink-0">
                    <FiCheck size={14} strokeWidth={3} />
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              onClick={() => navigate('/myorders')} 
              variant="primary"
              size="lg"
              className="flex-1 font-bold shadow-emerald-lg h-11"
            >
              Track Order
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              size="lg"
              className="flex-1 font-bold h-11 text-slate-600 border-slate-200"
            >
              Order More
            </Button>
          </div>

          {/* Redirect timer */}
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6">
            Redirecting to track list in <span className="font-extrabold text-emerald-600">{countdown}s</span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default OrderSuccess;
