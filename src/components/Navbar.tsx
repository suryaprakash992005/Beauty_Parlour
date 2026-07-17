import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSalonSettings } from '../services/settings';
import type { SalonSettings } from '../services/settings';
import '../styles/layout.css';
import StaggeredMenu from './StaggeredMenu';
import ThemeToggle from './ThemeToggle';
import { Magnetic } from './shared';

const NAV_LINKS = [
  { label: 'Home',            to: '/' },
  { label: 'Services',        to: '/services' },
  { label: 'Bridal Planner',  to: '/bridal-planner' },
  { label: 'Gallery',         to: '/gallery' },
  { label: 'Offers',          to: '/offers' },
  { label: 'Testimonials',    to: '/testimonials' },
  { label: 'About',           to: '/about' },
  { label: 'Contact',         to: '/contact' },
];

const menuItems = [
  ...NAV_LINKS.map(l => ({
    label: l.label,
    ariaLabel: `Go to ${l.label} page`,
    link: l.to
  })),
  { label: 'Book Appointment', ariaLabel: 'Book an appointment', link: '/book-appointment' }
];

const BrandLogo = ({ logoUrl, studioName }: { logoUrl?: string; studioName?: string }) => (
  <Link to="/" className="navbar__logo-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
    <motion.div 
      className="navbar__logo-circle"
      whileHover={{ scale: 1.06, rotate: 3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={studioName || 'ZHA'} className="navbar__logo-circle-img" />
      ) : (
        <span className="navbar__logo-initial">{studioName ? studioName.charAt(0) : 'Z'}</span>
      )}
    </motion.div>
    <div className="navbar__logo-text-wrap" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
      <span className="navbar__logo-name">{studioName || 'ZHA'}</span>
      <span className="navbar__logo-tagline">HAIR SALOON</span>
    </div>
  </Link>
);

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [settings, setSettings] = useState<SalonSettings | null>(null);

  useEffect(() => {
    getSalonSettings()
      .then(data => setSettings(data))
      .catch(err => console.error('Failed to load navbar settings:', err));

    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const socialItems = [
    { label: 'Instagram', link: settings?.instagram || 'https://instagram.com/zhahairsaloon' },
    { label: 'Facebook', link: settings?.facebook || 'https://facebook.com/zhahairsaloon' },
    { label: 'YouTube', link: settings?.youtube || 'https://youtube.com/zhahairsaloon' }
  ];

  return (
    <>
      <div className="navbar-wrapper">
        <header className={`navbar ${solid ? 'navbar--solid' : 'navbar--transparent'}`}>
          <div className="navbar__inner">
            {/* Logo */}
            <BrandLogo logoUrl={settings?.logoUrl} studioName={settings?.studioName} />

            {/* Desktop nav */}
            <nav className="navbar__nav" aria-label="Primary navigation">
              {NAV_LINKS.map(l => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `navbar__link${isActive ? ' navbar__link--active' : ''}`
                  }
                  style={{ position: 'relative' }}
                >
                  {({ isActive }) => (
                    <>
                      <span>{l.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="activeNavIndicator"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            left: '15%',
                            width: '70%',
                            height: '2px',
                            background: 'var(--color-rose-gold)',
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <ThemeToggle />
              <Magnetic>
                <Link to="/book-appointment" className="navbar__whatsapp-btn">
                  <MessageSquare size={15} />
                  <span>Book on WhatsApp</span>
                </Link>
              </Magnetic>
            </div>
          </div>
        </header>
      </div>

      {/* Premium Staggered Mobile Menu (displays on <= 1024px) */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor={solid ? 'var(--color-rose-gold)' : '#fff'}
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={['#0b0b0b', '#D4AF37', '#181818']}
        logoElement={<BrandLogo logoUrl={settings?.logoUrl} studioName={settings?.studioName} />}
        accentColor="var(--color-rose-gold)"
        isFixed={true}
      />
    </>
  );
}
