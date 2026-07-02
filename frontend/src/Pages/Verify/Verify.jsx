import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const sessionId = searchParams.get("session_id");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await axios.post(url + "/api/order/verify", { success, sessionId });
      if (response.data.success) navigate("/order-success");
      else navigate("/");
    } catch (err) {
      console.error("Verification failed:", err);
      navigate("/");
    }
  };

  useEffect(() => {
    if (success && sessionId) verifyPayment();
  }, [success, sessionId]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 px-4">
      <div className="bg-white rounded-4xl shadow-card border border-slate-100 p-12 flex flex-col items-center gap-6 max-w-sm w-full">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"/>
          <div className="absolute inset-0 rounded-full border-4 border-transparent" style={{ borderTopColor: '#f97316', animation: 'rotate 0.8s linear infinite' }}/>
          <div className="absolute inset-3 rounded-full bg-orange-50 flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
        </div>
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-slate-900 mb-1">Verifying Payment</h2>
          <p className="text-sm text-slate-400">Confirming your order with Stripe...</p>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-pulse" style={{ width: '60%' }}/>
        </div>
        <p className="text-xs text-slate-300 text-center">Please don&apos;t close this window</p>
      </div>
    </div>
  );
};

export default Verify;
