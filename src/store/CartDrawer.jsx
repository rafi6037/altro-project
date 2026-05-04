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
          className="fixed inset-0 bg-black/50 z-40 transition-opacity backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#1a5c38] shrink-0">
          <h2 className="text-base font-bold text-white flex items-center gap-2.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Shopping Bag
            {items.length > 0 && (
              <span className="bg-[#c9f230] text-[#0e1a12] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                {items.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#f5f2eb]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="w-20 h-20 rounded-full bg-[#1a5c38]/8 flex items-center justify-center">
                <svg className="w-9 h-9 text-[#1a5c38]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="text-[#0e1a12] font-semibold text-base mb-1">Your bag is empty</p>
                <p className="text-[#0e1a12]/45 text-sm">Add some items to get started</p>
              </div>
              <Link
                to="/"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#1a5c38] text-white text-sm font-semibold rounded-full hover:bg-[#2a7d50] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <ul className="space-y-2.5 mb-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm">
                    {/* Image */}
                    <div className="shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden bg-[#1a5c38]/8">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#1a5c38]/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-[#0e1a12] leading-snug line-clamp-2">{item.name}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 p-1 text-[#0e1a12]/25 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      {(item.color || item.size) && (
                        <p className="text-xs text-[#0e1a12]/40 mt-0.5">
                          {[item.color, item.size].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-[#1a5c38]">
                          {formatCurrency(item.sale_price ?? item.price)}
                        </span>
                        {/* Qty controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="w-6 h-6 rounded-full border border-[#1a5c38]/25 flex items-center justify-center text-[#1a5c38] hover:bg-[#1a5c38] hover:text-white hover:border-[#1a5c38] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                          >
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="text-sm font-semibold text-[#0e1a12] w-4 text-center tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-6 h-6 rounded-full border border-[#1a5c38]/25 flex items-center justify-center text-[#1a5c38] hover:bg-[#1a5c38] hover:text-white hover:border-[#1a5c38] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Coupon */}
              <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
                <p className="text-[10px] font-bold text-[#0e1a12]/40 uppercase tracking-widest mb-3">
                  Promo Code
                </p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#c9f230] text-[#0e1a12] text-xs font-bold px-2.5 py-1 rounded-lg">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-sm text-green-700 font-semibold">
                        -{formatCurrency(couponDiscount)}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-[#0e1a12]/40 hover:text-red-500 font-medium transition-colors"
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
                        placeholder="Enter code"
                        className="flex-1 border border-[#1a5c38]/15 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1a5c38]/50 bg-[#f5f2eb] placeholder-[#0e1a12]/30"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 py-2 bg-[#1a5c38] text-white text-sm font-semibold rounded-xl hover:bg-[#2a7d50] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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

              {/* Delivery Area */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-[10px] font-bold text-[#0e1a12]/40 uppercase tracking-widest mb-3">
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
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold border-2 transition-all ${
                        district === opt.value
                          ? 'border-[#1a5c38] bg-[#1a5c38] text-white'
                          : 'border-[#1a5c38]/15 text-[#0e1a12]/60 hover:border-[#1a5c38]/40'
                      }`}
                    >
                      {opt.label}
                      <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                        {formatCurrency(opt.fee)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-[#1a5c38]/8 px-5 py-4 bg-white space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#0e1a12]/55">
                <span>Subtotal</span>
                <span className="font-medium text-[#0e1a12]">{formatCurrency(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span className="font-medium">-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#0e1a12]/55">
                <span>Delivery</span>
                <span className="font-medium text-[#0e1a12]">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#0e1a12] pt-2 border-t border-[#1a5c38]/8">
                <span>Total</span>
                <span className="text-[#1a5c38]">{formatCurrency(total)}</span>
              </div>
            </div>
            <button
              onClick={onCheckout}
              disabled={items.length === 0}
              className="w-full py-3.5 bg-[#1a5c38] text-white font-bold rounded-2xl hover:bg-[#2a7d50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              Checkout
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
