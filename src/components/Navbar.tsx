import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { getSalonSettings } from '../services/settings';
import type { SalonSettings } from '../services/settings';
import '../styles/layout.css';
import StaggeredMenu from './StaggeredMenu';
import ThemeToggle from './ThemeToggle';

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
  <Link to="/" className="navbar__logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
    {logoUrl ? (
      <img src={logoUrl} alt={studioName || 'ZHA'} style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
    ) : (
      <>
        <span className="navbar__logo-name">{studioName || 'ZHA'}</span>
        <span className="navbar__logo-tagline">Hair Saloon</span>
      </>
    )}
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
      <header className={`navbar ${solid ? 'navbar--solid' : 'navbar--transparent'}`}>
        <div className="container navbar__inner">
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
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <ThemeToggle />
            <Link to="/book-appointment" className="btn btn-primary navbar__cta">
              Book Appointment
            </Link>
          </div>
        </div>
      </header>

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
