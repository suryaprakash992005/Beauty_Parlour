import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
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

const socialItems = [
  { label: 'Instagram', link: 'https://instagram.com/zhahairsaloon' },
  { label: 'Facebook', link: 'https://facebook.com/zhahairsaloon' },
  { label: 'YouTube', link: 'https://youtube.com/zhahairsaloon' }
];

const BrandLogo = () => (
  <Link to="/" className="navbar__logo">
    <span className="navbar__logo-name">ZHA</span>
    <span className="navbar__logo-tagline">Hair Saloon</span>
  </Link>
);

export default function Navbar() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`navbar ${solid ? 'navbar--solid' : 'navbar--transparent'}`}>
        <div className="container navbar__inner">
          {/* Logo */}
          <BrandLogo />

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
        logoElement={<BrandLogo />}
        accentColor="var(--color-rose-gold)"
        isFixed={true}
      />
    </>
  );
}
