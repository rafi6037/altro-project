import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../utils/formatCurrency';
import Badge from '../components/Badge';
import Navbar from '../store/Navbar';
import CartDrawer from '../store/CartDrawer';
import Footer from '../store/Footer';

const STATUS_STEPS = ['pending', 'accepted', 'processing', 'out_for_delivery', 'delivered'];
const STATUS_LABELS = ['Pending', 'Accepted', 'Processing', 'Out for Delivery', 'Delivered'];

const PAYMENT_LABELS = {
  bkash: 'bKash',
  nagad: 'Nagad',
  rocket: 'Rocket',
  cod: 'Cash on Delivery',
};

export default function Track() {
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const input = orderNumber.trim().toUpperCase();
    if (!input) return;
    setLoading(true);
    setOrder(null);
    setNotFound(false);

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', input)
      .single();

    setLoading(false);
    if (error || !data) {
      setNotFound(true);
    } else {
      setOrder(data);
      setNotFound(false);
    }
  };

  const statusIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;
  const isCancelled = order?.status === 'cancelled';

  const parsedItems = (() => {
    if (!order?.items) return [];
    try {
      return typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    } catch {
      return [];
    }
  })();

  const maskedName = order
    ? order.customer_name.split(' ')[0] + ' ***'
    : '';

  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      <Helmet>
        <title>Track Your Order — Altro</title>
        <meta name="description" content="Track your Altro order status in real time." />
      </Helmet>

      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => setCartOpen(false)}
      />

      <main className="max-w-2xl mx-auto px-4 py-16">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#0e1a12] mb-2">Track Your Order</h1>
          <p className="text-[#0e1a12]/60 text-sm">
            Enter your order number to check the delivery status
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. ALT-20250001"
            className="flex-1 border-2 border-[#1a5c38]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a5c38] bg-white font-mono uppercase"
            maxLength={20}
          />
          <button
            type="submit"
            disabled={loading || !orderNumber.trim()}
            className="px-6 py-3 bg-[#1a5c38] text-white font-semibold rounded-xl hover:bg-[#2a7d50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
            Track
          </button>
        </form>

        {/* Not Found */}
        {notFound && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
            <p className="text-red-600 font-semibold">Order not found</p>
            <p className="text-red-400 text-sm mt-1">
              Please check your order number and try again.
            </p>
          </div>
        )}

        {/* Order Found */}
        {order && (
          <div className="space-y-5">
            {/* Order Header */}
            <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs text-[#0e1a12]/40 uppercase tracking-wide">Order Number</p>
                <p className="text-xl font-bold text-[#1a5c38] font-mono mt-0.5">
                  {order.order_number}
                </p>
                {order.created_at && (
                  <p className="text-xs text-[#0e1a12]/40 mt-1">
                    Placed on{' '}
                    {new Date(order.created_at).toLocaleDateString('en-BD', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
              <Badge status={order.status} />
            </div>

            {/* Timeline or Cancelled */}
            {isCancelled ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
                <svg className="w-10 h-10 text-red-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 font-semibold">Order Cancelled</p>
                <p className="text-red-400 text-sm mt-1">
                  This order has been cancelled. Contact support for assistance.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-[#0e1a12] mb-5">Delivery Progress</h3>
                <div className="flex items-start gap-0">
                  {STATUS_STEPS.map((status, idx) => {
                    const isCompleted = idx < statusIndex;
                    const isCurrent = idx === statusIndex;
                    const isFuture = idx > statusIndex;

                    return (
                      <div key={status} className="flex-1 flex flex-col items-center relative">
                        {/* Connecting line (before this step) */}
                        {idx > 0 && (
                          <div
                            className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-0.5 ${
                              isCompleted || isCurrent ? 'bg-[#1a5c38]' : 'bg-[#1a5c38]/15'
                            }`}
                          />
                        )}

                        {/* Circle */}
                        <div
                          className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                            isCompleted
                              ? 'bg-[#1a5c38] text-white'
                              : isCurrent
                              ? 'bg-[#c9f230] text-[#0e1a12] ring-4 ring-[#c9f230]/30 animate-pulse'
                              : 'bg-[#1a5c38]/10 text-[#0e1a12]/30'
                          }`}
                        >
                          {isCompleted ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            idx + 1
                          )}
                        </div>

                        {/* Label */}
                        <p
                          className={`text-center mt-2 text-xs leading-tight ${
                            isCurrent
                              ? 'font-bold text-[#1a5c38]'
                              : isCompleted
                              ? 'font-medium text-[#0e1a12]/70'
                              : 'text-[#0e1a12]/30'
                          }`}
                          style={{ fontSize: '0.65rem' }}
                        >
                          {STATUS_LABELS[idx]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items */}
            {parsedItems.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-[#0e1a12] mb-3">Order Items</h3>
                <ul className="space-y-2">
                  {parsedItems.map((item, idx) => (
                    <li key={item.id ?? idx} className="flex justify-between items-start text-sm">
                      <div>
                        <p className="font-medium text-[#0e1a12]">
                          {item.name}{' '}
                          <span className="text-[#0e1a12]/50">× {item.qty}</span>
                        </p>
                        {(item.color || item.size) && (
                          <p className="text-xs text-[#0e1a12]/40">
                            {[item.color, item.size].filter(Boolean).join(' · ')}
                          </p>
                        )}
                      </div>
                      <span className="font-semibold text-[#0e1a12]">
                        {formatCurrency((item.sale_price ?? item.price) * item.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Summary Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0e1a12] mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#0e1a12]/60">
                  <span>Customer</span>
                  <span className="font-medium text-[#0e1a12]">{maskedName}</span>
                </div>
                <div className="flex justify-between text-[#0e1a12]/60">
                  <span>Payment</span>
                  <span className="font-medium text-[#0e1a12]">
                    {PAYMENT_LABELS[order.payment_method] ?? order.payment_method}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#0e1a12]/60">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(order.delivery_fee)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-[#0e1a12] pt-2 border-t border-[#1a5c38]/10">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
