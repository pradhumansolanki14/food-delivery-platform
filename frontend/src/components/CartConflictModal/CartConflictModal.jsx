import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { FiAlertTriangle, FiShoppingBag } from 'react-icons/fi';
import { Card, Button } from '../ui';

/**
 * CartConflictModal
 *
 * Shown when the customer tries to add a food item from a different
 * restaurant than the one currently in their cart.
 */
const CartConflictModal = () => {
  const {
    showCartConflictModal,
    pendingCartItem,
    confirmCartSwitch,
    cancelCartSwitch,
    food_list,
  } = useContext(StoreContext);

  if (!showCartConflictModal) return null;

  const pendingFood = pendingCartItem
    ? food_list.find(f => f._id === pendingCartItem.itemId)
    : null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && cancelCartSwitch()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-conflict-title"
    >
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-modal overflow-hidden animate-scaleIn">
        {/* Top green accent strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-emerald-600" />

        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <FiAlertTriangle className="text-emerald-500" size={24} />
          </div>

          {/* Title */}
          <h2
            id="cart-conflict-title"
            className="font-poppins font-extrabold text-slate-900 text-center text-lg mb-2"
          >
            Start a new cart?
          </h2>

          {/* Description */}
          <p className="text-slate-450 text-xs font-semibold text-center leading-relaxed mb-6">
            Your cart already has items from another restaurant.
            {pendingFood && (
              <>
                {' '}Adding{' '}
                <span className="font-bold text-slate-800">{pendingFood.name}</span>
                {' '}will clear your current cart.
              </>
            )}
            {!pendingFood && ' Adding this item will clear your current cart.'}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            {/* Confirm — clear and start fresh */}
            <Button
              onClick={confirmCartSwitch}
              variant="primary"
              size="md"
              className="w-full font-bold shadow-emerald-lg h-11"
            >
              Replace Cart
            </Button>
            
            {/* Cancel — keep existing cart */}
            <Button
              onClick={cancelCartSwitch}
              variant="outline"
              size="md"
              className="w-full font-bold h-11 text-slate-600 border-slate-200"
            >
              Keep Current Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartConflictModal;
