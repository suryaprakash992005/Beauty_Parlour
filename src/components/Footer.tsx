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

  const instagramLink = settings?.instagram || 'https://instagram.com/zhahairsaloon';
  const facebookLink = settings?.facebook || 'https://facebook.com/zhahairsaloon';
  const youtubeLink = settings?.youtube || 'https://youtube.com/zhahairsaloon';

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-md)' }}>
              {settings?.logoUrl && (
                <div className="navbar__logo-circle" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                  <img src={settings.logoUrl} alt={settings?.studioName || 'ZHA'} className="navbar__logo-circle-img" />
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
              A premier luxury salon destination for professional hair styling, 
              bridal makeup, nail art, and skincare experts.
            </p>
            <div className="footer__socials">
              {[
                { Icon: Instagram, href: instagramLink, label: 'Instagram' },
                { Icon: Facebook,  href: facebookLink, label: 'Facebook'  },
                { Icon: Youtube,   href: youtubeLink, label: 'YouTube'   },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} className="footer__social-link" aria-label={label} target="_blank" rel="noopener noreferrer">
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
                { label: 'About Us',         to: '/about'     },
                { label: 'Bridal Planner',   to: '/bridal-planner' },
                { label: 'Gallery',          to: '/gallery'   },
                { label: 'Offers',           to: '/offers'    },
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
              <Phone size={16} className="footer__contact-icon" />
              <span>{settings?.phone || '+91 9688999188'}</span>
            </div>
            <div className="footer__contact-item">
              <Mail size={16} className="footer__contact-icon" />
              <span>{settings?.email || 'suryasuryaprakash2005@gmail.com'}</span>
            </div>
            <div className="footer__contact-item">
              <MapPin size={16} className="footer__contact-icon" />
              <span>{settings?.address || '1st floor, MPS Traders Building, opposite to Taluka Office, Nehru Nagar, Mohanur, Tamil Nadu 637015'}</span>
            </div>
            <div className="footer__contact-item">
              <Clock size={16} className="footer__contact-icon" />
              <span>
                {settings?.openHoursWeekdays || 'Mon–Fri: 9 AM – 9 PM'}
                <br />
                {settings?.openHoursWeekends || 'Sat-Sun: 7 AM – 9 PM'}
              </span>
            </div>
          </div>
        </div>

        <div className="container footer__bottom">
          <div className="footer__copyright">
            © {year} {settings?.studioName || 'ZHA'} Aesthetic Salon. All rights reserved. Crafted with luxury.
          </div>
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
