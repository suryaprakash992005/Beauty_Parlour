import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../styles/layout.css';
import StaggeredMenu from './StaggeredMenu';
import type { StaggeredMenuGroup } from './StaggeredMenu';
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

/** Two-section grouped menu for the mobile panel */
const menuGroups: StaggeredMenuGroup[] = [
  {
    heading: 'Services',
    items: [
      { label: 'Hair Cut',       link: '/services' },
      { label: 'Hair Coloring',  link: '/services' },
      { label: 'Hair Spa',       link: '/services' },
      { label: 'Keratin',        link: '/services' },
      { label: 'Facial',         link: '/services' },
      { label: 'Bridal Makeup',  link: '/services' },
      { label: 'Nail Art',       link: '/services' },
      { label: 'Waxing',         link: '/services' },
      { label: 'Pedicure',       link: '/services' },
      { label: 'Manicure',       link: '/services' },
    ],
  },
  {
    heading: 'Quick Links',
    items: [
      { label: 'Home',            link: '/' },
      { label: 'About',           link: '/about' },
      { label: 'Gallery',         link: '/gallery' },
      { label: 'Offers',          link: '/offers' },
      { label: 'Testimonials',    link: '/testimonials' },
      { label: 'Bridal Planner',  link: '/bridal-planner' },
      { label: 'Contact',         link: '/contact' },
      { label: 'Book Appointment',link: '/book-appointment' },
    ],
  },
];

const socialItems = [
  { label: 'Instagram', link: 'https://instagram.com/zhahairsaloon' },
  { label: 'Facebook',  link: 'https://facebook.com/zhahairsaloon' },
  { label: 'YouTube',   link: 'https://youtube.com/zhahairsaloon' },
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
        menuGroups={menuGroups}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={false}
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
