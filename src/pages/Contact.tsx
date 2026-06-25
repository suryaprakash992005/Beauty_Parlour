import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Instagram, Facebook, Youtube } from '../components/BrandIcons';
import { useScrollReveal } from '../components/shared';

export default function Contact() {
  useScrollReveal();
  return (
    <main>
      <section className="page-hero">
        <div className="page-hero__bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=1400&q=80')" }} />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Get In Touch</div>
          <h1 className="page-hero__title">Contact Us</h1>
          <p className="page-hero__subtitle">We would love to hear from you. Reach out for appointments, queries, and collaborations.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* Info */}
            <div className="contact-info reveal-left">
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', color: 'var(--color-brown-deep)', marginBottom: 'var(--space-xl)' }}>
                We're Here For You
              </h2>

              {[
                { Icon: MapPin,  label: 'Visit Us',   val: '42, Rose Garden Lane, Luxury District, Mumbai — 400001', href: 'https://maps.google.com' },
                { Icon: Phone,   label: 'Call Us',    val: '+91 98765 43210', href: 'tel:+919876543210' },
                { Icon: Mail,    label: 'Email Us',   val: 'hello@luxeorabeauty.com', href: 'mailto:hello@luxeorabeauty.com' },
                { Icon: Clock,   label: 'Open Hours', val: 'Mon–Sat: 9 AM – 8 PM  |  Sunday: 10 AM – 6 PM', href: null },
              ].map(({ Icon, label, val, href }) => (
                <div key={label} className="contact-item">
                  <div className="contact-item__icon-wrap">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="contact-item__label">{label}</div>
                    {href ? (
                      <a href={href} className="contact-item__val" target="_blank" rel="noopener noreferrer">{val}</a>
                    ) : (
                      <div className="contact-item__val">{val}</div>
                    )}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 'var(--space-2xl)' }}>
                <div className="contact-item__label" style={{ marginBottom: 'var(--space-md)' }}>Follow Us</div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  {[
                    { Icon: Instagram,      href: 'https://instagram.com', label: 'Instagram' },
                    { Icon: Facebook,       href: 'https://facebook.com',  label: 'Facebook'  },
                    { Icon: Youtube,        href: 'https://youtube.com',   label: 'YouTube'   },
                    { Icon: MessageCircle,  href: 'https://wa.me/919876543210', label: 'WhatsApp' },
                  ].map(({ Icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className="footer__social-link"
                      style={{ background: 'var(--color-blush)', borderColor: 'var(--color-border)', color: 'var(--color-rose-gold)' }}
                      aria-label={label}>
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="contact-map reveal-right">
              <iframe
                title="Luxéora Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1160907028!2d72.74109995!3d19.08250475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1687000000000"
                width="100%"
                height="420"
                style={{ border: 0, borderRadius: 'var(--radius-xl)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: var(--space-5xl);
          align-items: start;
        }
        .contact-info { display: flex; flex-direction: column; gap: var(--space-xl); }
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-lg);
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          background: var(--color-white);
          transition: box-shadow 0.3s ease;
        }
        .contact-item:hover { box-shadow: var(--shadow-md); }
        .contact-item__icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--color-blush);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-rose-gold);
          flex-shrink: 0;
        }
        .contact-item__label {
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }
        .contact-item__val {
          font-size: var(--text-base);
          color: var(--color-brown-deep);
          margin-top: 2px;
          line-height: 1.6;
          font-weight: 500;
        }
        a.contact-item__val:hover { color: var(--color-rose-gold); }
        .contact-map { border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-lg); }
        @media (max-width: 900px) {
          .contact-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
