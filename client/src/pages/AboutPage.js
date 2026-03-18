import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const values = [
    { icon: '✦', title: 'Uncompromising Quality', desc: 'Every fabric is hand-selected. Every stitch is deliberate. We work only with mills and craftsmen who share our obsession with the finest materials.' },
    { icon: '◈', title: 'Modern Minimalism', desc: 'Clean lines, considered silhouettes, and a rejection of excess. Gent X designs endure beyond seasons because they are built on timeless principles.' },
    { icon: '❋', title: 'Crafted Consciously', desc: 'We believe premium fashion and responsible practices are not mutually exclusive. We work to reduce waste and build lasting relationships with our suppliers.' },
    { icon: '◉', title: 'The Gentleman\'s Standard', desc: 'Gent X was born from a belief that the modern man deserves clothing that speaks before he does — quietly, confidently, and without effort.' },
  ];

  return (
    <div className="pt-20 min-h-screen page-enter">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1400&h=600&fit=crop" alt="Gent X Story" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <p className="section-subtitle text-accent mb-4">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white leading-none max-w-xl">
            Made for Men.<br /><em className="italic">Built to Last.</em>
          </h1>
        </div>
      </div>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="section-subtitle mb-4">The Beginning</p>
            <h2 className="font-display text-3xl font-semibold mb-6 leading-snug">A brand born from a gap in the wardrobe</h2>
          </div>
          <div className="text-gray-600 text-sm leading-relaxed space-y-4">
            <p>Gent X was founded on a straightforward observation: there was no brand making truly premium menswear that didn't cost a small fortune or compromise on design. Men deserved better.</p>
            <p>We started with a single slim-fit shirt — one fabric, one fit, obsessively refined. The response told us we'd found something real. From there, we expanded deliberately, adding only what the modern gentleman's wardrobe actually needed.</p>
            <p>Today, Gent X offers a complete wardrobe from everyday essentials to occasion wear, all united by the same commitment to quality, proportion, and understated confidence.</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-950 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-subtitle text-accent mb-3">What We Stand For</p>
            <h2 className="font-display text-4xl font-semibold text-white">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map(v => (
              <div key={v.title} className="border border-gray-800 p-8 hover:border-accent transition-colors duration-300">
                <span className="text-accent text-2xl block mb-4">{v.icon}</span>
                <h3 className="font-display text-lg font-semibold text-white mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[['500+','Products crafted'],['98%','Customer satisfaction'],['30-day','Return window'],['24hr','Support response']].map(([num, label]) => (
              <div key={label}>
                <p className="font-display text-4xl font-semibold text-black">{num}</p>
                <p className="text-xs text-gray-500 tracking-wider mt-2 uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 px-6 text-center">
        <p className="section-subtitle text-accent mb-4">Ready to Experience Gent X?</p>
        <h2 className="font-display text-4xl font-semibold text-white mb-8">Shop the Collection</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/shop" className="btn-accent px-10 py-4">Browse All Products</Link>
          <Link to="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-black px-10 py-4">Get in Touch</Link>
        </div>
      </section>
    </div>
  );
}
