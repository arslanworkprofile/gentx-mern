import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────
// EMAILJS SETUP — replace these 3 values with yours from emailjs.com
// Sign up free at https://emailjs.com → Email Services → Add Service
// Then create a template and copy your IDs here
const EMAILJS_SERVICE_ID = 'service_stob3h5';
const EMAILJS_TEMPLATE_ID = 'template_uk15xdg';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'Dsb803w43USzAaTNr';   // e.g. 'abcDEFghiJKL'
// ─────────────────────────────────────────────────────────────

const PHONE        = '+923348544492';
const PHONE_DISPLAY = '+92 334 854 4492';
const EMAIL        = 'arslan.workprofile@gmail.com';
const WHATSAPP_URL = `https://wa.me/${PHONE}`;

const InfoCard = ({ icon, title, value, href, sub }) => (
  <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
    className="flex gap-5 p-6 border border-gray-100 hover:border-black transition-all duration-300 group">
    <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-black transition-colors duration-300">
      {icon}
    </div>
    <div>
      <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">{title}</p>
      <p className="text-sm font-medium text-black group-hover:text-accent transition-colors">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </a>
);

export default function ContactPage() {
  const formRef = useRef(null);
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields'); return;
    }

    setSending(true);
    try {
      // Send email via EmailJS
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setSent(true);
      toast.success("Message sent! We'll reply within 24 hours.");
    } catch (err) {
      console.error('EmailJS error:', err);
      toast.error('Failed to send message. Please try WhatsApp or email us directly.');
    } finally {
      setSending(false);
    }
  };

  // Also open WhatsApp with message pre-filled
  const openWhatsApp = () => {
    const text = `Hi, I'm ${form.name || 'a customer'}. ${form.message || ''}`.trim();
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen page-enter" style={{ paddingTop: 80 }}>
      {/* Header */}
      <div className="bg-gray-950 py-20 px-6 text-center">
        <p className="section-subtitle text-accent mb-3">Get in Touch</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-white">Contact Us</h1>
        <p className="text-gray-400 text-sm mt-4 max-w-md mx-auto">We're here to help. Whether it's a question about sizing, an order query, or just a chat about style — reach out.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Left — contact info */}
          <div>
            <div className="mb-8">
              <p className="section-subtitle mb-2">Reach Us Directly</p>
              <h2 className="font-display text-3xl font-semibold">We reply within 24 hours</h2>
            </div>

            <div className="space-y-4 mb-10">
              <InfoCard
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
                title="Email" value={EMAIL} href={`mailto:${EMAIL}`} sub="We reply within 24 hours"
              />
              <InfoCard
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>}
                title="Phone / WhatsApp" value={PHONE_DISPLAY} href={`tel:${PHONE}`} sub="Mon–Sat, 10am–8pm PKT"
              />
              <InfoCard
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.561 4.14 1.543 5.875L0 24l6.324-1.509A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.005-1.371l-.36-.213-3.731.889.934-3.619-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>}
                title="WhatsApp" value="Chat on WhatsApp" href={WHATSAPP_URL} sub="Quick replies guaranteed"
              />
            </div>

            <div className="bg-gray-50 p-6 border-l-4 border-accent">
              <h3 className="font-medium text-sm mb-3">Support Hours</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between"><span>Monday – Friday</span><span className="font-medium text-black">10:00 AM – 8:00 PM PKT</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="font-medium text-black">11:00 AM – 6:00 PM PKT</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="text-gray-400">Closed</span></div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">Quick Help</p>
              <div className="grid grid-cols-2 gap-2">
                {[['Return Policy','/returns'],['Privacy Policy','/privacy'],['Terms of Service','/terms'],['My Orders','/orders']].map(([label, to]) => (
                  <Link key={label} to={to}
                    className="text-xs border border-gray-200 px-3 py-2.5 hover:border-black hover:text-black transition-colors text-gray-600 text-center tracking-wide">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-semibold mb-2">Message Received!</h3>
                <p className="text-gray-500 text-sm mb-6">Thank you for reaching out. Our team will get back to you at <strong>{form.email}</strong> within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }); }}
                  className="btn-secondary text-sm px-6 py-3">Send Another Message</button>
              </div>
            ) : (
              <div>
                <div className="mb-8">
                  <p className="section-subtitle mb-2">Send a Message</p>
                  <h2 className="font-display text-3xl font-semibold">We'd love to hear from you</h2>
                </div>

                {/* 
                  EmailJS reads input names directly from the form.
                  Make sure your EmailJS template uses: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
                */}
                <form ref={formRef} onSubmit={handle} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-field">Name *</label>
                      <input
                        name="from_name"
                        className="input-field"
                        value={form.name}
                        onChange={e => setForm(f => ({...f, name: e.target.value}))}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="label-field">Email *</label>
                      <input
                        type="email"
                        name="from_email"
                        className="input-field"
                        value={form.email}
                        onChange={e => setForm(f => ({...f, email: e.target.value}))}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-field">Subject</label>
                    <select
                      name="subject"
                      className="input-field"
                      value={form.subject}
                      onChange={e => setForm(f => ({...f, subject: e.target.value}))}
                    >
                      <option value="">Select a topic</option>
                      <option value="Order Issue">Order Issue</option>
                      <option value="Return / Exchange">Return / Exchange</option>
                      <option value="Product Enquiry">Product Enquiry</option>
                      <option value="Shipping Question">Shipping Question</option>
                      <option value="Payment Issue">Payment Issue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Message *</label>
                    <textarea
                      name="message"
                      className="input-field resize-none"
                      rows={6}
                      value={form.message}
                      onChange={e => setForm(f => ({...f, message: e.target.value}))}
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <div className="space-y-3">
                    <button type="submit" disabled={sending} className="btn-primary w-full py-4 disabled:opacity-60">
                      {sending ? 'Sending...' : 'Send Message'}
                    </button>
                    <button type="button" onClick={openWhatsApp}
                      className="w-full py-3.5 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.136.561 4.14 1.543 5.875L0 24l6.324-1.509A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.005-1.371l-.36-.213-3.731.889.934-3.619-.234-.373A9.818 9.818 0 1112 21.818z"/>
                      </svg>
                      Send via WhatsApp Instead
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    Or reach us instantly on{' '}
                    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-green-600 hover:underline font-medium">WhatsApp</a>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-black py-14 px-6 text-center mt-10">
        <p className="text-gray-400 text-xs tracking-widest uppercase mb-3">Prefer to chat directly?</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-medium text-sm px-8 py-4 transition-colors duration-200">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.136.561 4.14 1.543 5.875L0 24l6.324-1.509A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.005-1.371l-.36-.213-3.731.889.934-3.619-.234-.373A9.818 9.818 0 1112 21.818z"/>
          </svg>
          Chat on WhatsApp — {PHONE_DISPLAY}
        </a>
      </div>
    </div>
  );
}
