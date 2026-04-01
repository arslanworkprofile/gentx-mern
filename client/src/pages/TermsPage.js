import React from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-display text-xl font-semibold text-black mb-4 pb-3 border-b border-gray-100">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function TermsPage() {
  return (
    <div className="min-h-screen page-enter" style={{ paddingTop: 80 }}>
      <div className="bg-gray-950 py-20 px-6 text-center">
        <p className="section-subtitle text-accent mb-3">Legal</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-white">Terms of Service</h1>
        <p className="text-gray-400 text-sm mt-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gray-50 border border-gray-200 p-5 mb-12 text-sm text-gray-600 leading-relaxed">
          Please read these Terms of Service carefully before using the Gent X website. By accessing or using our services, you agree to be bound by these terms. If you disagree with any part, please discontinue use of our website.
        </div>

        <Section title="1. Acceptance of Terms">
          <p>These Terms of Service ("Terms") govern your use of the Gent X website located at gentx.com ("Site") operated by Gent X. By using this Site, you confirm that you are at least 16 years of age and agree to comply with these Terms.</p>
        </Section>

        <Section title="2. Products and Pricing">
          <p>All prices on the Gent X website are listed in US Dollars (USD) unless otherwise stated. Prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time.</p>
          <p>We make every effort to display product colours, sizes, and descriptions accurately. However, we cannot guarantee that your device's display will accurately reflect the actual product. Slight variations may occur.</p>
          <p>In the event of a pricing error, we reserve the right to cancel any order placed at the incorrect price and will notify you promptly.</p>
        </Section>

        <Section title="3. Orders and Payment">
          <p>By placing an order, you are making an offer to purchase. We reserve the right to refuse or cancel any order for any reason, including stock unavailability, pricing errors, or suspected fraudulent activity.</p>
          <p>Payment must be completed in full at the time of checkout. We accept major credit/debit cards, bank transfers, and cash on delivery where available. All transactions are processed securely.</p>
        </Section>

        <Section title="4. Shipping and Delivery">
          <p>Estimated delivery times are provided at checkout and are approximations only. Gent X is not liable for delays caused by courier services, customs processes, or events beyond our control (force majeure).</p>
          <p>Risk of loss and title for products pass to you upon delivery. Free shipping is offered on orders exceeding the minimum threshold specified at checkout.</p>
        </Section>

        <Section title="5. Intellectual Property">
          <p>All content on this website — including logos, images, product descriptions, and design — is the intellectual property of Gent X and is protected by applicable copyright and trademark laws.</p>
          <p>You may not reproduce, distribute, modify, or use any content from this site for commercial purposes without our prior written consent.</p>
        </Section>

        <Section title="6. User Accounts">
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorised access to your account. Gent X is not liable for any loss resulting from unauthorised use of your account.</p>
          <p>We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or are inactive for extended periods.</p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>To the maximum extent permitted by law, Gent X shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products.</p>
          <p>Our total liability for any claim arising out of or relating to these Terms shall not exceed the amount you paid for the product giving rise to the claim.</p>
        </Section>

        <Section title="8. Governing Law">
          <p>These Terms are governed by the laws of Pakistan. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Pakistan.</p>
        </Section>

        <Section title="9. Changes to Terms">
          <p>We reserve the right to update these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after changes are posted constitutes your acceptance of the revised Terms.</p>
        </Section>

        {/* Contact */}
        <div className="bg-gray-950 text-white p-8 mt-4">
          <h2 className="font-display text-xl font-semibold mb-2">Legal Enquiries</h2>
          <p className="text-gray-400 text-sm mb-6">For questions about these Terms, please contact us:</p>
          <div className="space-y-3">
            <a href="mailto:arslan.workprofile@gmail.com" className="flex items-center gap-3 text-sm text-gray-300 hover:text-accent transition-colors">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              arslan.workprofile@gmail.com
            </a>
            <a href="tel:+923348544492" className="flex items-center gap-3 text-sm text-gray-300 hover:text-accent transition-colors">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              +92 334 854 4492
            </a>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 flex flex-wrap gap-4">
            <Link to="/privacy" className="text-xs tracking-widest uppercase text-gray-500 hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/returns" className="text-xs tracking-widest uppercase text-gray-500 hover:text-accent transition-colors">Return Policy</Link>
            <Link to="/contact" className="text-xs tracking-widest uppercase text-gray-500 hover:text-accent transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
