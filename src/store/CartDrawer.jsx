import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from './cartStore';
import { useSettings } from '../hooks/useSettings';
import { validateCoupon } from '../utils/validateCoupon';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../utils/formatCurrency';

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { getSetting } = useSettings();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const items = useCartStore((s) => s.items);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const couponDiscount = useCartStore((s) => s.couponDiscount);
  const district = useCartStore((s) => s.district);
  const setDistrict = useCartStore((s) => s.setDistrict);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const dhakaFee = Number(getSetting('delivery_fee_dhaka', 60));
  const outsideFee = Number(getSetting('delivery_fee_outside', 120));
  const deliveryFee = district === 'dhaka' ? dhakaFee : outsideFee;

  const subtotal = items.reduce((sum, i) => {
    const unitPrice = i.sale_price ?? i.price;
    return sum + unitPrice * i.qty;
  }, 0);
  const total = subtotal - couponDiscount + deliveryFee;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const result = await validateCoupon(supabase, couponCode.trim(), subtotal);
    setCouponLoading(false);
    if (result.valid) {
      applyCoupon(result.coupon);
      setCouponCode('');
      setCouponError('');
    } else {
      setCouponError(result.error ?? 'Invalid coupon');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    setCouponError('');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-[#f5f2eb] z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a5c38]/10 shrink-0">
          <h2 className="text-lg font-semibold text-[#0e1a12] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1a5c38]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Your Cart
            {items.length > 0 && (
              <span className="bg-[#1a5c38] text-white text-xs font-bold rounded-full px-2 py-0.5">
                {items.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 rounded-full hover:bg-[#1a5c38]/10 transition-colors text-[#0e1a12]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            /* Empty Cart */
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
              <svg className="w-20 h-20 text-[#1a5c38]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-[#0e1a12]/60 text-base font-medium">Your cart is empty</p>
              <Link
                to="/"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#1a5c38] text-white text-sm font-semibold rounded-lg hover:bg-[#2a7d50] transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <ul className="space-y-3 mb-5">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
                    {/* Image */}
                    <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-[#1a5c38]/10">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-7 h-7 text-[#1a5c38]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0e1a12] truncate">{item.name}</p>
                      <p className="text-xs text-[#0e1a12]/50 mt-0.5">
                        {[item.color, item.size].filter(Boolean).join(' · ')}
                      </p>
                      <p className="text-sm font-bold text-[#1a5c38] mt-1">
                        {formatCurrency(item.sale_price ?? item.price)}
                      </p>

                      {/* Qty + Remove */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="w-7 h-7 rounded-full border border-[#1a5c38]/30 flex items-center justify-center text-[#1a5c38] hover:bg-[#1a5c38] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-sm font-semibold text-[#0e1a12] w-5 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-7 h-7 rounded-full border border-[#1a5c38]/30 flex items-center justify-center text-[#1a5c38] hover:bg-[#1a5c38] hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Coupon Section */}
              <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <p className="text-xs font-semibold text-[#0e1a12]/60 uppercase tracking-wide mb-2">
                  Coupon Code
                </p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#c9f230] text-[#0e1a12] text-xs font-bold px-2 py-1 rounded-md">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-sm text-green-700 font-medium">
                        -{formatCurrency(couponDiscount)}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-500 hover:text-red-700 font-medium underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Enter coupon code"
                        className="flex-1 border border-[#1a5c38]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5c38] bg-[#f5f2eb]"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 py-2 bg-[#1a5c38] text-white text-sm font-semibold rounded-lg hover:bg-[#2a7d50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {couponLoading ? '…' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-500 mt-1.5">{couponError}</p>
                    )}
                  </>
                )}
              </div>

              {/* Delivery Section */}
              <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <p className="text-xs font-semibold text-[#0e1a12]/60 uppercase tracking-wide mb-2">
                  Delivery Area
                </p>
                <div className="flex gap-2">
                  {[
                    { value: 'dhaka', label: 'Dhaka', fee: dhakaFee },
                    { value: 'outside', label: 'Outside Dhaka', fee: outsideFee },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDistrict(opt.value)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border-2 transition-all ${
                        district === opt.value
                          ? 'border-[#1a5c38] bg-[#1a5c38] text-white'
                          : 'border-[#1a5c38]/20 text-[#0e1a12]/70 hover:border-[#1a5c38]/50'
                      }`}
                    >
                      {opt.label}
                      <span className="block text-xs font-normal opacity-80 mt-0.5">
                        {formatCurrency(opt.fee)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary + Checkout */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-[#1a5c38]/10 px-5 py-4 bg-[#f5f2eb] space-y-2">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-[#0e1a12]/70">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#0e1a12]/70">
                <span>Delivery</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#0e1a12] pt-1 border-t border-[#1a5c38]/10">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            <button
              onClick={onCheckout}
              disabled={items.length === 0}
              className="w-full py-3 bg-[#1a5c38] text-white font-semibold rounded-xl hover:bg-[#2a7d50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              Proceed to Checkout
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
