import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Instagram, Facebook, Youtube } from '../components/BrandIcons';
import { useScrollReveal } from '../components/shared';
import { SparklesText } from '../components/SparklesText';
import { getSalonSettings } from '../services/settings';
import type { SalonSettings } from '../services/settings';
import Breadcrumb from '../components/Breadcrumb';
import { useSEO, PAGE_SEO } from '../hooks/useSEO';

export default function Contact() {
  useSEO({
    ...PAGE_SEO.contact,
    breadcrumbs: [{ name: 'Contact', url: '/contact' }],
  });
  useScrollReveal();
  const [settings, setSettings] = useState<SalonSettings | null>(null);

  useEffect(() => {
    getSalonSettings()
      .then(data => setSettings(data))
      .catch(err => console.error('Failed to load contact settings:', err));
  }, []);

  const contactItems = [
    { 
      Icon: MapPin,  
      label: 'Visit Us',   
      val: settings?.address || '1st Floor, MPS Traders Building, Opposite Taluka Office, Nehru Nagar, Mohanur, Namakkal District, Tamil Nadu - 637015', 
      href: 'https://maps.app.goo.gl/BP8hTwHFbmMcDkHc9' 
    },
    { 
      Icon: Phone,   
      label: 'Call Us',    
      val: settings?.phone || '+91 96889 99188 / +91 82709 04659', 
      href: 'tel:+919688999188' 
    },
    { 
      Icon: Mail,    
      label: 'Email Us',   
      val: settings?.email || 'suryasuryaprakash2005@gmail.com', 
      href: `mailto:${settings?.email || 'suryasuryaprakash2005@gmail.com'}` 
    },
    { 
      Icon: Clock,   
      label: 'Open Hours', 
      val: `${settings?.openHoursWeekdays || 'Mon–Fri: 9 AM – 9 PM'}  |  ${settings?.openHoursWeekends || 'Sat–Sun: 7 AM – 9 PM'}`, 
      href: null 
    },
  ];

  const socialLinks = [
    { Icon: Instagram,      href: settings?.instagram || 'https://www.instagram.com/zha_aesthetic_salon/', label: 'Instagram' },
    { Icon: Facebook,       href: settings?.facebook || 'https://www.instagram.com/zha_aesthetic_salon/',  label: 'Facebook'  },
    { Icon: Youtube,        href: settings?.youtube || 'https://www.instagram.com/zha_aesthetic_salon/',   label: 'YouTube'   },
    { Icon: MessageCircle,  href: `https://wa.me/919688999188`, label: 'WhatsApp' },
  ];

  return (
    <main>
      <section className="page-hero">
        <div className="page-hero__bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=1400&q=80')" }} />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <Breadcrumb items={[{ label: 'Contact' }]} />
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Contact The Best Salon in Namakkal</div>
          <h1 className="page-hero__title">
            <SparklesText>Contact ZHa Aesthetic Salon</SparklesText>
          </h1>
          <p className="page-hero__subtitle">Located in Mohanur, Namakkal District. Reach out for haircuts, HD bridal makeup & keratin appointments.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* Info */}
            <div className="contact-info reveal-left">
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', color: 'var(--color-text)', marginBottom: 'var(--space-xl)' }}>
                We're Here For You
              </h2>

              {contactItems.map(({ Icon, label, val, href }) => (
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
                  {socialLinks.map(({ Icon, href, label }) => (
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
                title="Zha Aesthetic Salon Location in Mohanur Namakkal"
                src={settings?.googleMaps || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15664.846542152861!2d78.140733!3d11.078496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baa250882e75cb7%3A0x8673a5a7b6070624!2sMohanur%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000"}
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
          background: var(--color-bg-dark);
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
          color: var(--color-champagne-light, #e8c98a);
        }
        .contact-item__val {
          font-size: var(--text-base);
          color: #ffffff;
          margin-top: 2px;
          line-height: 1.6;
          font-weight: 500;
        }
        a.contact-item__val:hover { color: var(--color-champagne); }
        .contact-map { border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-lg); }
        @media (max-width: 900px) {
          .contact-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
