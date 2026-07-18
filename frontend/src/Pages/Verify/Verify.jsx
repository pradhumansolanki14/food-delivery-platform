import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FiLock } from 'react-icons/fi';
import { StoreContext } from '../../context/StoreContext';
import { Card } from '../../components/ui';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const sessionId = searchParams.get("session_id");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await axios.post(url + "/api/order/verify", { success, sessionId });
      if (response.data.success) {
        navigate("/order-success");
      } else {
        navigate("/");
      }
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
      <Card 
        variant="default" 
        radius="3xl" 
        padding="lg" 
        className="shadow-card border border-slate-100 flex flex-col items-center gap-6 max-w-sm w-full p-8 sm:p-10 text-center"
      >
        {/* Animated Custom circular loader */}
        <div className="relative w-18 h-18">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
          <div className="absolute inset-2.5 rounded-full bg-emerald-50 flex items-center justify-center">
            <FiLock className="text-emerald-500" size={20} />
          </div>
        </div>

        <div>
          <h2 className="font-poppins font-extrabold text-lg text-slate-900 leading-tight">Verifying Payment</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Securing your order transaction with Razorpay...</p>
        </div>

        {/* Pulse indicator line */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-pulse w-2/3" />
        </div>

        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Please do not refresh or close this window.
        </p>
      </Card>
    </div>
  );
};

export default Verify;
