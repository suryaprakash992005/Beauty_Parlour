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
            <div className="footer__logo-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.studioName} style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
              ) : (
                settings?.studioName || 'ZHA'
              )}
            </div>
            {!settings?.logoUrl && <div className="footer__logo-tagline">Hair Saloon</div>}
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

          {/* Contact */}
          <div>
            <h3 className="footer__col-title">Contact Us</h3>
            <div>
              <div className="footer__contact-item">
                <MapPin size={15} className="footer__contact-icon" />
                <span>{settings?.address || '42, Rose Garden Lane, Luxury District, Mumbai — 400001'}</span>
              </div>
              <div className="footer__contact-item">
                <Phone size={15} className="footer__contact-icon" />
                <span>{settings?.phone || '+91 98765 43210'}</span>
              </div>
              <div className="footer__contact-item">
                <Mail size={15} className="footer__contact-icon" />
                <span>{settings?.email || 'hello@zhahairsaloon.com'}</span>
              </div>
              <div className="footer__contact-item">
                <Clock size={15} className="footer__contact-icon" />
                <span>
                  {settings?.openHoursWeekdays || 'Mon–Sat: 9 AM – 8 PM'}
                  <br />
                  {settings?.openHoursWeekends || 'Sunday: 10 AM – 6 PM'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} {settings?.studioName || 'ZHA'} Hair Saloon. All rights reserved. Crafted with luxury.
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
