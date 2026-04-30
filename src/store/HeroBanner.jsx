import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const AUTOPLAY_INTERVAL = 4000;

export default function HeroBanner({ slides = [] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  const count = slides.length;
  const hasSlides = count > 0;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % (count || 1));
  }, [count]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + (count || 1)) % (count || 1));
  }, [count]);

  useEffect(() => {
    if (!hasSlides || paused) return;
    intervalRef.current = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [hasSlides, paused, next]);

  // Reset to 0 when slides change
  useEffect(() => {
    setCurrent(0);
  }, [slides]);

  if (!hasSlides) {
    // Fallback static banner
    return (
      <section className="relative h-[60vh] md:h-[80vh] bg-[#1a5c38] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/hero.png')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl text-white font-bold leading-tight mb-4">
            ALTRO Clothing
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            Quality Attire from Bangladesh
          </p>
          <Link
            to="/#products"
            className="inline-flex items-center gap-2 bg-[#c9f230] text-[#0e1a12] font-bold px-8 py-3.5 rounded-full hover:bg-lime-300 transition-colors shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section
      className="relative h-[60vh] md:h-[80vh] overflow-hidden bg-[#0e1a12]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((s, idx) => (
        <div
          key={s.id ?? idx}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          aria-hidden={idx !== current}
        >
          {s.image_url ? (
            <img
              src={s.image_url}
              alt={s.title ?? ''}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#1a5c38]" />
          )}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/45" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="text-center px-4 max-w-3xl mx-auto">
          {slide.title && (
            <h1 className="font-display text-4xl md:text-6xl text-white font-bold leading-tight mb-4 drop-shadow-md">
              {slide.title}
            </h1>
          )}
          {slide.subtitle && (
            <p className="text-lg md:text-xl text-white/80 mb-8 drop-shadow">
              {slide.subtitle}
            </p>
          )}
          {slide.cta_text && slide.cta_url && (
            slide.cta_url.startsWith('/') ? (
              <Link
                to={slide.cta_url}
                className="inline-flex items-center gap-2 bg-[#c9f230] text-[#0e1a12] font-bold px-8 py-3.5 rounded-full hover:bg-lime-300 transition-colors shadow-lg"
              >
                {slide.cta_text}
              </Link>
            ) : (
              <a
                href={slide.cta_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#c9f230] text-[#0e1a12] font-bold px-8 py-3.5 rounded-full hover:bg-lime-300 transition-colors shadow-lg"
              >
                {slide.cta_text}
              </a>
            )
          )}
        </div>
      </div>

      {/* Prev Arrow */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Arrow */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`rounded-full transition-all duration-300 ${
                idx === current
                  ? 'w-6 h-2.5 bg-[#c9f230]'
                  : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
