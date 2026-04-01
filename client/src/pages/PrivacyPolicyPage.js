import React from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-display text-xl font-semibold text-black mb-4 pb-3 border-b border-gray-100">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen page-enter" style={{ paddingTop: 80 }}>
      {/* Header */}
      <div className="bg-gray-950 py-20 px-6 text-center">
        <p className="section-subtitle text-accent mb-3">Legal</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-white">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mt-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-accent/10 border border-accent/20 p-5 mb-12 text-sm text-gray-700 leading-relaxed">
          At <strong>Gent X</strong>, your privacy is our priority. This policy explains how we collect, use, and protect your personal information when you use our website and services. By using Gent X, you agree to the terms described below.
        </div>

        <Section title="1. Information We Collect">
          <p>We collect information you provide directly to us when you:</p>
          <ul className="list-none space-y-2 mt-2">
            {[
              'Create an account (name, email address, password)',
              'Place an order (billing/shipping address, phone number)',
              'Contact our support team (messages and correspondence)',
              'Sign up for our newsletter (email address)',
              'Leave a product review (name, review content)',
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">We may also automatically collect certain technical information when you visit our site, including IP address, browser type, pages visited, and browsing duration, to improve your experience.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>Your information is used exclusively to:</p>
          <ul className="list-none space-y-2 mt-2">
            {[
              'Process and fulfil your orders accurately and on time',
              'Send order confirmations, shipping updates, and delivery notifications',
              'Respond to your customer service requests and enquiries',
              'Send promotional emails if you have opted in (you may unsubscribe at any time)',
              'Personalise your shopping experience on our platform',
              'Detect and prevent fraud or unauthorised account access',
              'Comply with applicable legal and regulatory obligations',
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3"><strong className="text-black">We never sell your personal data to third parties.</strong> Your information is yours.</p>
        </Section>

        <Section title="3. Data Sharing">
          <p>We share your data only with trusted partners who are essential to operating our services:</p>
          <ul className="list-none space-y-2 mt-2">
            {[
              'Shipping and logistics providers (to deliver your orders)',
              'Payment processors (to securely handle transactions — we never store full card details)',
              'Cloud infrastructure providers (to host our website and databases securely)',
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">All third-party partners are contractually obligated to handle your data responsibly and in compliance with applicable privacy laws.</p>
        </Section>

        <Section title="4. Cookies">
          <p>We use cookies and similar technologies to enhance your experience. These include:</p>
          <ul className="list-none space-y-2 mt-2">
            {[
              'Essential cookies — required for core functionality such as your cart and login session',
              'Analytics cookies — to understand how visitors use our site (e.g. Google Analytics)',
              'Preference cookies — to remember your language and display preferences',
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">You can disable cookies in your browser settings. Note that disabling essential cookies may affect site functionality.</p>
        </Section>

        <Section title="5. Data Security">
          <p>We implement industry-standard security measures including:</p>
          <ul className="list-none space-y-2 mt-2">
            {[
              'SSL/TLS encryption for all data transmitted between your browser and our servers',
              'Encrypted password storage using bcrypt hashing',
              'JWT-based authentication with short-lived tokens',
              'Regular security reviews and updates',
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">While we take every precaution, no system is 100% immune to breaches. In the unlikely event of a data breach that affects you, we will notify you promptly.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>You have the right to:</p>
          <ul className="list-none space-y-2 mt-2">
            {[
              'Access — request a copy of the personal data we hold about you',
              'Correction — request we correct inaccurate or incomplete data',
              'Deletion — request we delete your account and associated data',
              'Opt-out — unsubscribe from marketing communications at any time',
              'Data portability — receive your data in a structured, machine-readable format',
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">To exercise any of these rights, please contact us at the details below.</p>
        </Section>

        <Section title="7. Data Retention">
          <p>We retain your personal data for as long as your account is active or as required to fulfil our legal obligations. Order records are retained for a minimum of 5 years for accounting and legal compliance. You may request deletion of your account at any time.</p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>Our services are intended for users aged 16 and above. We do not knowingly collect personal information from children under 16. If you believe we have inadvertently collected such data, please contact us immediately.</p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page. Continued use of our services after changes are posted constitutes your acceptance of the updated policy.</p>
        </Section>

        {/* Contact box */}
        <div className="bg-gray-950 text-white p-8 mt-4">
          <h2 className="font-display text-xl font-semibold mb-2">Privacy Enquiries</h2>
          <p className="text-gray-400 text-sm mb-6">For any questions, data requests, or privacy concerns, please reach out:</p>
          <div className="space-y-3">
            <a href="mailto:arslan.workprofile@gmail.com" className="flex items-center gap-3 text-sm text-gray-300 hover:text-accent transition-colors group">
              <div className="w-8 h-8 border border-gray-700 group-hover:border-accent flex items-center justify-center transition-colors flex-shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              arslan.workprofile@gmail.com
            </a>
            <a href="tel:+923348544492" className="flex items-center gap-3 text-sm text-gray-300 hover:text-accent transition-colors group">
              <div className="w-8 h-8 border border-gray-700 group-hover:border-accent flex items-center justify-center transition-colors flex-shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              +92 334 854 4492
            </a>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 flex flex-wrap gap-4">
            <Link to="/returns" className="text-xs tracking-widest uppercase text-gray-500 hover:text-accent transition-colors">Return Policy</Link>
            <Link to="/terms" className="text-xs tracking-widest uppercase text-gray-500 hover:text-accent transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-xs tracking-widest uppercase text-gray-500 hover:text-accent transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
