import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from './cartStore';
import { formatCurrency } from '../utils/formatCurrency';

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  if (!product) return null;

  const {
    name,
    slug,
    images = [],
    price,
    sale_price,
    category,
    tags = [],
    is_featured,
    stock,
    colors = [],
    sizes = [],
  } = product;

  const hasNew = Array.isArray(tags) && tags.some((t) => t?.toLowerCase() === 'new');
  const hasSale = sale_price != null && sale_price < price;
  const displayImage = images?.[0] ?? null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    const defaultColor = colors?.[0] ?? '';
    const defaultSize = sizes?.[0] ?? '';
    addItem(product, defaultColor, defaultSize, 1);
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <Link
      to={`/product/${slug}`}
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${
        hovered ? 'scale-[1.02]' : 'scale-100'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] bg-[#1a5c38]/10 overflow-hidden">
        {displayImage ? (
          <img
            src={displayImage}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-[#1a5c38]/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {hasSale && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              Sale
            </span>
          )}
          {hasNew && (
            <span className="bg-[#c9f230] text-[#0e1a12] text-xs font-bold px-2 py-0.5 rounded-full shadow">
              New
            </span>
          )}
          {is_featured && !hasNew && (
            <span className="bg-[#1a5c38] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              Featured
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-[#0e1a12] text-xs font-bold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Add - desktop hover only, hidden on mobile */}
        {stock > 0 && (
          <div
            className={`absolute bottom-0 left-0 right-0 hidden md:block transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0`}
          >
            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 text-sm font-semibold transition-colors ${
                adding
                  ? 'bg-[#c9f230] text-[#0e1a12]'
                  : 'bg-[#1a5c38] text-white hover:bg-[#2a7d50]'
              }`}
            >
              {adding ? '✓ Added!' : 'Add to Cart'}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col gap-1">
        {category && (
          <span className="text-xs text-[#1a5c38] font-medium capitalize">{category}</span>
        )}
        <h3 className="text-sm font-semibold text-[#0e1a12] line-clamp-2 leading-snug">{name}</h3>

        {/* Price */}
        <div className="mt-auto pt-1 flex items-baseline gap-2">
          {hasSale ? (
            <>
              <span className="text-base font-bold text-[#1a5c38]">
                {formatCurrency(sale_price)}
              </span>
              <span className="text-sm text-[#0e1a12]/40 line-through">
                {formatCurrency(price)}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-[#0e1a12]">{formatCurrency(price)}</span>
          )}
        </div>

        {/* Mobile Add to Cart */}
        {stock > 0 && (
          <button
            onClick={handleAddToCart}
            className={`md:hidden mt-2 w-full py-2 text-xs font-semibold rounded-lg transition-colors ${
              adding
                ? 'bg-[#c9f230] text-[#0e1a12]'
                : 'bg-[#1a5c38] text-white hover:bg-[#2a7d50]'
            }`}
          >
            {adding ? '✓ Added!' : 'Add to Cart'}
          </button>
        )}
      </div>
    </Link>
  );
}
