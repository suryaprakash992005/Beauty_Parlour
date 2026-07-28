import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Instagram, Facebook, Youtube } from './BrandIcons';
import { getSalonSettings } from '../services/settings';
import type { SalonSettings } from '../services/settings';
import '../styles/layout.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState<SalonSettings | null>(null);

  useEffect(() => {
    getSalonSettings()
      .then(data => setSettings(data))
      .catch(err => console.error('Failed to load footer settings:', err));
  }, []);

  const instagramLink = settings?.instagram || 'https://www.instagram.com/zha_aesthetic_salon/';
  const facebookLink = settings?.facebook || 'https://www.instagram.com/zha_aesthetic_salon/';
  const youtubeLink = settings?.youtube || 'https://www.instagram.com/zha_aesthetic_salon/';

  return (
    <footer className="footer" itemScope itemType="https://schema.org/WPFooter">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-md)' }}>
              {settings?.logoUrl && (
                <div className="navbar__logo-circle" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                  <img src={settings.logoUrl} alt={settings?.studioName || 'ZHa Aesthetic Salon — Best Salon in Namakkal'} className="navbar__logo-circle-img" loading="lazy" />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
                <span className="footer__logo-name" style={{ margin: 0 }}>
                  {settings?.studioName && settings.studioName.trim().toUpperCase() === 'ZHA' ? 'ZHa' : (settings?.studioName ? settings.studioName.trim() : 'ZHa')}
                </span>
                <span className="footer__logo-tagline" style={{ marginTop: '2px' }}>Aesthetic Salon</span>
              </div>
            </div>
            <p className="footer__desc">
              ZHa Aesthetic Salon is the best unisex beauty salon in Namakkal, located in Mohanur. 
              Offering expert hair styling, HD bridal makeup, keratin treatment, facials & luxury spa care.
            </p>
            <div className="footer__socials">
              {[
                { Icon: Instagram, href: instagramLink, label: 'Instagram' },
                { Icon: Facebook,  href: facebookLink, label: 'Facebook'  },
                { Icon: Youtube,   href: youtubeLink, label: 'YouTube'   },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} className="footer__social-link" aria-label={`Follow ZHa Aesthetic Salon on ${label}`} target="_blank" rel="noopener noreferrer">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer__col-title">Quick Links</h3>
            <ul className="footer__links">
              {[
                { label: 'Home',             to: '/'          },
                { label: 'Services in Namakkal', to: '/services'  },
                { label: 'About Us',         to: '/about'     },
                { label: 'Bridal Packages',  to: '/bridal-planner' },
                { label: 'Gallery',          to: '/gallery'   },
                { label: 'Offers',           to: '/offers'    },
                { label: 'Beauty Blog',      to: '/blogs'     },
                { label: 'Testimonials',     to: '/testimonials' },
                { label: 'Book Appointment', to: '/book-appointment' },
                { label: 'Contact',          to: '/contact'   },
              ].map(({ label, to }) => (
                <li key={label}><Link to={to} className="footer__link">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="footer__col-title">Contact Us</h3>
            <div className="footer__contact-item">
              <Phone size={16} className="footer__contact-icon" aria-hidden="true" />
              <a href="tel:+919688999188" style={{ color: 'inherit', textDecoration: 'none' }}>
                {settings?.phone || '+91 96889 99188 / +91 82709 04659'}
              </a>
            </div>
            <div className="footer__contact-item">
              <Mail size={16} className="footer__contact-icon" aria-hidden="true" />
              <a href={`mailto:${settings?.email || 'suryasuryaprakash2005@gmail.com'}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {settings?.email || 'suryasuryaprakash2005@gmail.com'}
              </a>
            </div>
            <div className="footer__contact-item">
              <MapPin size={16} className="footer__contact-icon" aria-hidden="true" />
              <a href="https://maps.app.goo.gl/BP8hTwHFbmMcDkHc9" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                {settings?.address || '1st Floor, MPS Traders Building, Opposite Taluka Office, Nehru Nagar, Mohanur, Namakkal District, Tamil Nadu - 637015'}
              </a>
            </div>
            <div className="footer__contact-item">
              <Clock size={16} className="footer__contact-icon" aria-hidden="true" />
              <span>
                {settings?.openHoursWeekdays || 'Mon–Fri: 9 AM – 9 PM'} | {settings?.openHoursWeekends || 'Sat–Sun: 7 AM – 9 PM'}
              </span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} ZHa Aesthetic Salon — Best Salon in Namakkal, Mohanur. All rights reserved.</span>
          <div className="footer__bottom-links">
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/blogs">Blog</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
