import React from 'react';
import { Link } from 'react-router-dom';

const PHONE         = '+923348544492';
const PHONE_DISPLAY = '+92 334 854 4492';
const EMAIL         = 'arslan.workprofile@gmail.com';
const WHATSAPP_URL  = `https://wa.me/${PHONE}`;

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-gray-800">

          {/* Brand col */}
          <div className="md:col-span-2">
            <Link to="/">
              <span className="font-display text-2xl font-semibold text-white">Gent<span className="text-accent"> X</span></span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-500 max-w-xs">
              Crafted for the modern gentleman. Premium fashion with uncompromising attention to detail.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-accent transition-colors group">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                {EMAIL}
              </a>
              <a href={`tel:${PHONE}`} className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-accent transition-colors group">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {PHONE_DISPLAY}
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-green-400 transition-colors group">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.136.561 4.14 1.543 5.875L0 24l6.324-1.509A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.005-1.371l-.36-.213-3.731.889.934-3.619-.234-.373A9.818 9.818 0 1112 21.818z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {[
            { title: 'Shop', links: [['All Products','/shop'],['Shirts','/shop?category=shirts'],['Jackets','/shop?category=jackets'],['Suits','/shop?category=suits'],['Accessories','/shop?category=accessories']] },
            { title: 'Account', links: [['Sign In','/login'],['Register','/register'],['Dashboard','/dashboard'],['My Orders','/orders'],['Profile','/profile']] },
            { title: 'Company', links: [['About Us','/about'],['Contact Us','/contact'],['Return Policy','/returns'],['Privacy Policy','/privacy'],['Terms of Service','/terms']] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-xs text-white tracking-[0.2em] uppercase font-medium mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-gray-500 hover:text-accent transition-colors duration-200">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} Gent X. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-gray-600 hover:text-accent transition-colors">Privacy</Link>
            <Link to="/terms"   className="text-xs text-gray-600 hover:text-accent transition-colors">Terms</Link>
            <Link to="/returns" className="text-xs text-gray-600 hover:text-accent transition-colors">Returns</Link>
            <Link to="/contact" className="text-xs text-gray-600 hover:text-accent transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-gray-700 font-mono">Secure checkout · SSL encrypted</p>
        </div>
      </div>
    </footer>
  );
}
