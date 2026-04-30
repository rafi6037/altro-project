import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateCartItemId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      couponDiscount: 0,
      district: 'outside',

      addItem: (product, color, size, qty = 1) => {
        const { items } = get();
        const existing = items.find(
          (i) =>
            i.product_id === product.id &&
            i.color === color &&
            i.size === size
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === existing.id ? { ...i, qty: i.qty + qty } : i
            ),
          });
        } else {
          const newItem = {
            id: generateCartItemId(),
            product_id: product.id,
            name: product.name,
            image: product.images?.[0] ?? null,
            price: product.price,
            sale_price: product.sale_price ?? null,
            color,
            size,
            qty,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (cartItemId) => {
        set({ items: get().items.filter((i) => i.id !== cartItemId) });
      },

      updateQty: (cartItemId, qty) => {
        if (qty < 1) return;
        set({
          items: get().items.map((i) =>
            i.id === cartItemId ? { ...i, qty } : i
          ),
        });
      },

      clearCart: () => set({ items: [], appliedCoupon: null, couponDiscount: 0 }),

      applyCoupon: (coupon) => {
        const { items } = get();
        const subtotal = items.reduce((sum, i) => {
          const unitPrice = i.sale_price ?? i.price;
          return sum + unitPrice * i.qty;
        }, 0);
        let discount = 0;
        if (coupon.discount_type === 'percent') {
          discount = (subtotal * coupon.discount_value) / 100;
        } else {
          discount = coupon.discount_value;
        }
        set({ appliedCoupon: coupon, couponDiscount: Math.min(discount, subtotal) });
      },

      removeCoupon: () => set({ appliedCoupon: null, couponDiscount: 0 }),

      setDistrict: (district) => set({ district }),
    }),
    {
      name: 'altro-cart',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);