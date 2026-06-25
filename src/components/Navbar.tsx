import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import '../styles/layout.css';

const NAV_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'Services',   to: '/services' },
  { label: 'Bridal',     to: '/bridal' },
  { label: 'Gallery',    to: '/gallery' },
  { label: 'Offers',     to: '/offers' },
  { label: 'About',      to: '/about' },
  { label: 'Contact',    to: '/contact' },
];

export default function Navbar() {
  const [solid,     setSolid]     = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isTransparent = !solid && !menuOpen;

  return (
    <>
      <header className={`navbar ${isTransparent ? 'navbar--transparent' : 'navbar--solid'}`}>
        <div className="container navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
            <span className="navbar__logo-name">Luxéora</span>
            <span className="navbar__logo-tagline">Beauty Studio</span>
          </Link>

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

          <Link to="/book" className="btn btn-primary navbar__cta">
            Book Appointment
          </Link>

          {/* Hamburger */}
          <button
            className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`navbar__overlay${menuOpen ? ' navbar__overlay--visible' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu */}
      <nav
        className={`navbar__mobile${menuOpen ? ' navbar__mobile--open' : ''}`}
        aria-label="Mobile navigation"
      >
        <button
          style={{ alignSelf: 'flex-end', color: 'var(--color-brown-deep)', marginBottom: '1rem' }}
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
        {NAV_LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className="navbar__mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
        <Link
          to="/book"
          className="btn btn-primary mt-lg"
          onClick={() => setMenuOpen(false)}
          style={{ textAlign: 'center', justifyContent: 'center' }}
        >
          Book Appointment
        </Link>
      </nav>
    </>
  );
}
