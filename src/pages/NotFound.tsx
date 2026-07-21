import { Link } from 'react-router-dom';
import { SparklesText } from '../components/SparklesText';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import Breadcrumb from '../components/Breadcrumb';
import { useSEO } from '../hooks/useSEO';

export default function NotFound() {
  useSEO({
    title: '404 Page Not Found — ZHa Aesthetic Salon',
    description: 'The page you are looking for does not exist. Explore our hair styling, facials, and bridal services at ZHa Aesthetic Salon in Mohanur.',
    noIndex: true,
  });

  return (
    <main className="not-found-page">
      <section className="page-hero" style={{ height: '50vh', minHeight: '360px' }}>
        <div className="page-hero__bg" style={{ backgroundImage: "url('/salon_green_theme_1.jpg')" }} />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <Breadcrumb items={[{ label: '404 Not Found' }]} />
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>404 Error</div>
          <h1 className="page-hero__title">
            <SparklesText>Page Not Found</SparklesText>
          </h1>
          <p className="page-hero__subtitle">
            The requested page could not be found. Let us guide you back to our beauty offerings.
          </p>
        </div>
      </section>

      <section className="section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="container" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: '1.7' }}>
            We couldn't find what you were looking for. You can return to our homepage or explore our list of luxury salon services in Mohanur.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <InteractiveHoverButton to="/">
              Return Home
            </InteractiveHoverButton>
            <Link to="/services" className="btn btn-outline-white">
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
