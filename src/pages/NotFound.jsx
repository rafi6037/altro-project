import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f2eb] flex flex-col items-center justify-center px-4 text-center">
      <Helmet>
        <title>404 — Page Not Found — Altro</title>
      </Helmet>

      <p className="text-[9rem] font-black text-[#1a5c38]/10 leading-none select-none">
        404
      </p>

      <div className="-mt-4 space-y-3">
        <h1 className="text-2xl font-bold text-[#0e1a12]">Page Not Found</h1>
        <p className="text-[#0e1a12]/60 text-sm max-w-xs mx-auto">
          Oops! The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#1a5c38] text-white font-semibold rounded-xl hover:bg-[#2a7d50] transition-colors shadow-md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <p className="mt-16 font-display text-3xl font-bold tracking-widest text-[#1a5c38]/20 select-none">
        ALTRO
      </p>
    </div>
  );
}
