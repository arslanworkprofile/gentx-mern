import React from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-display text-xl font-semibold text-black mb-4 pb-3 border-b border-gray-100">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const StepCard = ({ step, title, desc }) => (
  <div className="flex gap-5">
    <div className="w-10 h-10 bg-black text-white font-display text-lg font-semibold flex items-center justify-center flex-shrink-0">{step}</div>
    <div>
      <h3 className="font-semibold text-black text-sm mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  </div>
);

const EligibilityRow = ({ item, eligible }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50">
    <span className="text-sm text-gray-600">{item}</span>
    <span className={`text-xs font-medium tracking-widest uppercase px-2.5 py-1 ${eligible ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
      {eligible ? '✓ Eligible' : '✗ Final Sale'}
    </span>
  </div>
);

export default function ReturnPolicyPage() {
  return (
    <div className="pt-20 min-h-screen page-enter">
      {/* Header */}
      <div className="bg-gray-950 py-20 px-6 text-center">
        <p className="section-subtitle text-accent mb-3">Customer Care</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-white">Return Policy</h1>
        <p className="text-gray-400 text-sm mt-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Promise banner */}
      <div className="bg-accent py-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-display text-2xl font-semibold text-black">30-Day Hassle-Free Returns</p>
          <p className="text-black/70 text-sm mt-2">If you're not completely satisfied, we'll make it right — no questions asked.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          {[
            { num: '30', label: 'Days to return', icon: '📅' },
            { num: 'Free', label: 'Return shipping', icon: '🚚' },
            { num: '7', label: 'Days to refund', icon: '💳' },
          ].map(s => (
            <div key={s.label} className="border border-gray-100 p-6 text-center">
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="font-display text-2xl font-semibold text-black">{s.num}</p>
              <p className="text-xs text-gray-500 tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <Section title="1. Return Window">
          <p>You have <strong className="text-black">30 days</strong> from the date of delivery to initiate a return or exchange. Items must be returned in their original, unused condition with all tags attached and original packaging intact.</p>
          <p>We inspect all returned items upon receipt. Items that show signs of wear, washing, alteration, or damage will not be eligible for a refund and will be returned to you at your expense.</p>
        </Section>

        <Section title="2. Eligibility">
          <p className="mb-4">The following table summarises return eligibility at a glance:</p>
          <div className="border border-gray-100">
            <EligibilityRow item="Regular-priced clothing (unworn, tags on)" eligible={true} />
            <EligibilityRow item="Shoes (unworn, original box)" eligible={true} />
            <EligibilityRow item="Accessories (unopened)" eligible={true} />
            <EligibilityRow item="Outerwear & jackets (unworn, tags on)" eligible={true} />
            <EligibilityRow item="Sale / discounted items (>30% off)" eligible={false} />
            <EligibilityRow item="Underwear & swimwear" eligible={false} />
            <EligibilityRow item="Personalised or custom items" eligible={false} />
            <EligibilityRow item="Gift cards" eligible={false} />
          </div>
          <p className="mt-4 text-xs text-gray-400">* Items marked "Final Sale" at time of purchase are non-returnable and non-exchangeable.</p>
        </Section>

        <Section title="3. How to Return">
          <p className="mb-6">Returning an item is simple. Follow these steps:</p>
          <div className="space-y-6">
            <StepCard step="1" title="Contact Us" desc="Email arslan.workprofile@gmail.com or call +92 334 854 4492 with your order number and reason for return. We will respond within 24 hours with your Return Authorisation (RA) number." />
            <StepCard step="2" title="Pack Your Item" desc="Securely repack the item in its original packaging (or similar protective packaging). Include your RA number and order confirmation slip inside the parcel." />
            <StepCard step="3" title="Ship It Back" desc="Drop the parcel at your nearest courier outlet. For orders within Pakistan, we will arrange a free collection. International returns: shipping costs are the customer's responsibility unless the item is defective." />
            <StepCard step="4" title="Receive Your Refund" desc="Once we receive and inspect your return, we will process your refund within 3–7 business days to your original payment method." />
          </div>
        </Section>

        <Section title="4. Exchanges">
          <p>We offer free size and colour exchanges on all eligible items within the 30-day return window. To exchange an item:</p>
          <ul className="list-none space-y-2 mt-3">
            {[
              'Contact us with your order number and the size/colour you need',
              'We\'ll check availability and reserve your preferred item',
              'Return your original item — we\'ll dispatch the exchange once received',
              'If your preferred item is out of stock, a full refund will be issued',
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="5. Refund Methods">
          <p>Refunds are issued to the <strong className="text-black">original payment method</strong> used at checkout:</p>
          <ul className="list-none space-y-2 mt-3">
            {[
              'Credit/Debit Card — 3 to 7 business days (depending on your bank)',
              'Bank Transfer — 3 to 5 business days',
              'Cash on Delivery — store credit or bank transfer within 5 business days',
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">Original shipping charges are non-refundable unless the return is due to our error (wrong item, defective product).</p>
        </Section>

        <Section title="6. Defective or Wrong Items">
          <p>If you receive a defective, damaged, or incorrect item, we sincerely apologise. Please contact us within <strong className="text-black">48 hours</strong> of delivery with:</p>
          <ul className="list-none space-y-2 mt-3">
            {[
              'Your order number',
              'A clear photograph of the defect or incorrect item',
              'A brief description of the issue',
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">We will arrange a free return collection and send a replacement or issue a full refund, whichever you prefer.</p>
        </Section>

        <Section title="7. International Returns">
          <p>For international orders (outside Pakistan), the following applies:</p>
          <ul className="list-none space-y-2 mt-2">
            {[
              'Return shipping costs are the responsibility of the customer',
              'We recommend using a tracked shipping service — Gent X is not liable for lost return parcels',
              'Any import duties or taxes incurred on the return are the customer\'s responsibility',
              'Refunds are processed in PKR and converted to your local currency at the current exchange rate',
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Contact box */}
        <div className="bg-gray-950 text-white p-8 mt-6">
          <h2 className="font-display text-xl font-semibold mb-2">Need Help With a Return?</h2>
          <p className="text-gray-400 text-sm mb-6">Our team is here to make your return as smooth as possible. Reach out anytime:</p>
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
            <Link to="/privacy" className="text-xs tracking-widest uppercase text-gray-500 hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs tracking-widest uppercase text-gray-500 hover:text-accent transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-xs tracking-widest uppercase text-gray-500 hover:text-accent transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
