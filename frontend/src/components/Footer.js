import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <p className="footer__logo">GENT<span>X</span></p>
              <p className="footer__tagline">Redefining men's style with timeless elegance and contemporary craftsmanship.</p>
              <div className="footer__socials">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram /></a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FiFacebook /></a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FiTwitter /></a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FiYoutube /></a>
              </div>
            </div>

            <div className="footer__col">
              <p className="footer__col-title">Shop</p>
              <Link to="/shop/shirts">Shirts</Link>
              <Link to="/shop/pants">Pants</Link>
              <Link to="/shop/suits">Suits & Blazers</Link>
              <Link to="/shop/shoes">Shoes</Link>
              <Link to="/shop/jackets">Jackets</Link>
              <Link to="/shop/watches">Watches</Link>
              <Link to="/shop/accessories">Accessories</Link>
            </div>

            <div className="footer__col">
              <p className="footer__col-title">Customer Care</p>
              <Link to="/faq">FAQ</Link>
              <Link to="/shipping">Shipping & Returns</Link>
              <Link to="/size-guide">Size Guide</Link>
              <Link to="/track-order">Track Order</Link>
              <Link to="/contact">Contact Us</Link>
            </div>

            <div className="footer__col">
              <p className="footer__col-title">Newsletter</p>
              <p className="footer__newsletter-text">Get exclusive offers, style tips and early access to new arrivals.</p>
              <form className="footer__newsletter" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Your email address" />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} GentX. All rights reserved.</p>
          <div className="footer__bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
