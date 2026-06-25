import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Instagram, Facebook, Youtube } from './BrandIcons';
import '../styles/layout.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div>
            <div className="footer__logo-name">Luxéora</div>
            <div className="footer__logo-tagline">Beauty Studio</div>
            <p className="footer__desc">
              A premier luxury beauty destination crafted for the modern woman.
              Where every visit is an indulgent ritual of elegance and transformation.
            </p>
            <div className="footer__socials">
              {[
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Facebook,  href: '#', label: 'Facebook'  },
                { Icon: Youtube,   href: '#', label: 'YouTube'   },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} className="footer__social-link" aria-label={label}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="footer__col-title">Services</h3>
            <ul className="footer__links">
              {['Bridal Makeup', 'Hair Styling', 'Luxury Facial', 'Hair Spa', 'Nail Art',
                'Keratin Treatment', 'Skin Rejuvenation', 'Premium Spa'].map(s => (
                <li key={s}><Link to="/services" className="footer__link">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer__col-title">Quick Links</h3>
            <ul className="footer__links">
              {[
                { label: 'Home',             to: '/'          },
                { label: 'About Us',         to: '/about'     },
                { label: 'Bridal Packages',  to: '/bridal'    },
                { label: 'Gallery',          to: '/gallery'   },
                { label: 'Offers',           to: '/offers'    },
                { label: 'Testimonials',     to: '/testimonials' },
                { label: 'Book Appointment', to: '/book'      },
                { label: 'Contact',          to: '/contact'   },
              ].map(({ label, to }) => (
                <li key={label}><Link to={to} className="footer__link">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer__col-title">Contact Us</h3>
            <div>
              <div className="footer__contact-item">
                <MapPin size={15} className="footer__contact-icon" />
                <span>42, Rose Garden Lane, Luxury District, Mumbai — 400001</span>
              </div>
              <div className="footer__contact-item">
                <Phone size={15} className="footer__contact-icon" />
                <span>+91 98765 43210</span>
              </div>
              <div className="footer__contact-item">
                <Mail size={15} className="footer__contact-icon" />
                <span>hello@luxeorabeauty.com</span>
              </div>
              <div className="footer__contact-item">
                <Clock size={15} className="footer__contact-icon" />
                <span>Mon–Sat: 9 AM – 8 PM<br />Sunday: 10 AM – 6 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} Luxéora Beauty Studio. All rights reserved. Crafted with elegance.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service'].map(t => (
              <a key={t} href="#" style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.3)', transition: 'color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-champagne)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
