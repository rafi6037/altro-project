import { Link } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/#products', label: 'Products' },
  { to: '/track', label: 'Track Order' },
  { to: '/#about', label: 'About Us' },
];

export default function Footer() {
  const { getSetting } = useSettings();

  const logoUrl = getSetting('logo_url', '');
  const tagline = getSetting('footer_tagline', 'Quality attire crafted with care, right from Bangladesh.');
  const contactEmail = getSetting('contact_email', '');
  const contactPhone = getSetting('contact_phone', '');
  const facebookUrl = getSetting('social_facebook', '#');
  const instagramUrl = getSetting('social_instagram', '#');
  const whatsappUrl = getSetting('social_whatsapp', '#');

  return (
    <footer className="bg-[#0e1a12] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Col 1: Brand */}
          <div>
            <div className="mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt="ALTRO" className="h-10 w-auto object-contain brightness-200" />
              ) : (
                <span className="font-display text-2xl font-bold tracking-widest text-[#c9f230]">
                  ALTRO
                </span>
              )}
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">{tagline}</p>
            <p className="text-white/40 text-xs">
              Bringing premium Bangladeshi fashion to your doorstep.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9f230] mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-white/60 text-sm hover:text-[#c9f230] transition-colors flex items-center gap-1.5 group"
                  >
                    <svg
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#c9f230]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact + Social */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9f230] mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 mb-6">
              {contactEmail && (
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#c9f230] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {contactEmail}
                  </a>
                </li>
              )}
              {contactPhone && (
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#c9f230] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a
                    href={`tel:${contactPhone}`}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {contactPhone}
                  </a>
                </li>
              )}
            </ul>

            {/* Social Icons */}
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Follow Us</p>
              <div className="flex gap-3">
                {/* Facebook */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-[#c9f230]/20 transition-colors group"
                >
                  <svg className="w-4 h-4 text-white/60 group-hover:text-[#c9f230]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-[#c9f230]/20 transition-colors group"
                >
                  <svg className="w-4 h-4 text-white/60 group-hover:text-[#c9f230]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </a>
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-[#c9f230]/20 transition-colors group"
                >
                  <svg className="w-4 h-4 text-white/60 group-hover:text-[#c9f230]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Altro. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Made with ❤️ in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
