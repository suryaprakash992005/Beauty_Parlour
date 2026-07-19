import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollReveal } from '../components/shared';
import { getSalonSettings } from '../services/settings';
import '../styles/book.css';

const SERVICES_LIST = [
  // ── HAIR CARE & STYLING ──
  "Women's Haircut",
  "Hair Trim",
  "Blow Dry",
  "Hair Wash & Blow Dry",
  "Hair Styling",
  "Curling",
  "Straightening (Styling)",
  "Ironing",
  "Party Hairstyle",
  "Bridal Hairstyle",
  "Formal Updo",
  "Hair Spa",
  "Deep Conditioning",
  "Scalp Detox",
  "Keratin Treatment",
  "Hair Smoothening",
  "Hair Rebonding",
  "Botox Hair Treatment",
  "Hair Extensions",

  // ── SKIN CARE & FACIALS ──
  "Basic Clean-Up",
  "Fruit Clean-Up",
  "De-Tan Clean-Up",
  "Hydrating Facial",
  "Glow Facial",
  "Brightening Facial",
  "Anti-Aging Facial",
  "Gold Facial",
  "Diamond Facial",
  "Vitamin C Facial",
  "Acne Control Facial",

  // ── HAIR REMOVAL & WAXING ──
  "Full Body Wax",
  "Half Arms",
  "Full Arms",
  "Half Legs",
  "Full Legs",
  "Underarms",
  "Rica Wax",
  "Chocolate Wax",
  "Honey Wax",
  "Liposoluble Wax",

  // ── THREADING ──
  "Eyebrows",
  "Upper Lip",
  "Chin",
  "Forehead",
  "Full Face",

  // ── BRIDAL MAKEUP & PACKAGES ──
  "Bridal Makeup",
  "HD Bridal Makeup",
  "Airbrush Bridal Makeup",
  "Engagement Makeup",
  "Reception Makeup",
  "Bridal Touch-Up",
  "Saree Draping",
  "Bridal Hair Styling",
  "Pre-Bridal Grooming Package",

  // ── NAILS & GROOMING ──
  "Manicure",
  "Pedicure"
];

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
];

interface FormState {
  name: string; phone: string; email: string;
  service: string; date: string; time: string;
  request: string;
}

export default function Book() {
  useScrollReveal();
  const location = useLocation();
  const prefilled = (location.state as Partial<FormState> | null) || {};

  const [form, setForm] = useState<FormState>({
    name: prefilled.name || '',
    phone: prefilled.phone || '',
    email: prefilled.email || '',
    service: prefilled.service || '',
    date: prefilled.date || '',
    time: prefilled.time || '',
    request: prefilled.request || '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [whatsapp, setWhatsapp] = useState('8270904659');
  const [phoneDisplay, setPhoneDisplay] = useState('+91 82709 04659');

  useEffect(() => {
    getSalonSettings().then(data => {
      if (data.whatsapp) {
        setWhatsapp(data.whatsapp.replace(/[^0-9]/g, ''));
      }
      if (data.phone) {
        setPhoneDisplay(data.phone);
      }
    }).catch(err => console.error('Failed to load booking whatsapp:', err));
  }, []);

  useEffect(() => {
    if (prefilled.service) {
      setForm(prev => ({
        ...prev,
        service: prefilled.service || prev.service,
        request: prefilled.request || prev.request
      }));
    }
  }, [location.state]);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim() || !form.phone.trim() || !form.service || !form.date || !form.time) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    setLoading(true);

    const formattedDate = new Date(form.date).toLocaleDateString(undefined, { dateStyle: 'medium' });

    const message = `🌸 *APPOINTMENT BOOKED - ZHA AESTHETIC SALON* 🌸
----------------------------------------------
*Date:* ${formattedDate}
*Time:* ${form.time}

✨ *CUSTOMER DETAILS:*
• *Name:* ${form.name}
• *Phone:* ${form.phone}
${form.email ? `• *Email:* ${form.email}` : ''}

💅 *SERVICE REQUESTED:*
• *Service:* ${form.service}
${form.request ? `• *Special Request:* ${form.request}` : ''}

----------------------------------------------
Thank you for booking with us! We look forward to serving you!`;

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      const whatsappUrl = `https://wa.me/91${whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }, 1500);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <main className="book-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero__bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=1400&q=80')" }} />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Reserve Your Visit</div>
          <h1 className="page-hero__title">Book Your Appointment</h1>
          <p className="page-hero__subtitle">Secure your luxury beauty experience with just a few details below.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="book-layout">
            {/* Info Panel */}
            <aside className="book-info reveal-left">
              <h2 className="book-info__title">Why Choose Zha Aesthetic Salon?</h2>
              <ul className="book-info__list">
                {[
                  ['🏅', 'Certified Professionals with years of experience'],
                  ['✂️', 'Premium Hair Styling and coloring services'],
                  ['👰', 'Bridal Makeup Experts for your special day'],
                  ['💅', 'Luxury Nail Care and creative nail art design'],
                  ['✨', 'Aesthetic Environment built for ultimate relaxation'],
                  ['❤️', '1000+ Happy Customers who trust us daily'],
                ].map(([icon, text], i) => (
                  <li key={i} className="book-info__item">
                    <span className="book-info__icon">{icon}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <div className="book-contact-strip">
                <p>Need help choosing? Call us:</p>
                <a href={`tel:${phoneDisplay.replace(/[^0-9+]/g, '')}`} className="book-phone">{phoneDisplay}</a>
              </div>
            </aside>

            {/* Form */}
            <div className="book-form-wrap reveal-right">
              {submitted ? (
                <div className="book-success">
                  <div className="book-success__icon">✨</div>
                  <h2 className="book-success__title">Appointment Requested!</h2>
                  <p className="book-success__desc">
                    Thank you, <strong>{form.name}</strong>! We've received your booking request.
                    Our team will confirm your appointment within 2 hours via WhatsApp & Email.
                  </p>
                  <Link to="/" className="btn btn-primary mt-xl">Back to Home</Link>
                </div>
              ) : (
                <form className="book-form" onSubmit={handleSubmit} noValidate>
                  <div className="book-form__title">Your Details</div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Full Name *</label>
                      <input id="name" className="form-input" type="text" required placeholder="Your beautiful name"
                        value={form.name} onChange={set('name')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Phone Number *</label>
                      <input id="phone" className="form-input" type="tel" required placeholder="+91 XXXXX XXXXX"
                        value={form.phone} onChange={set('phone')} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input id="email" className="form-input" type="email" placeholder="your@email.com"
                      value={form.email} onChange={set('email')} />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="service">Service *</label>
                    <select id="service" className="form-input form-select" required
                      value={form.service} onChange={set('service')}>
                      <option value="">Select a service...</option>
                      {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="date">Preferred Date *</label>
                      <input id="date" className="form-input" type="date" required min={minDate}
                        value={form.date} onChange={set('date')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="time">Preferred Time *</label>
                      <select id="time" className="form-input form-select" required
                        value={form.time} onChange={set('time')}>
                        <option value="">Select time...</option>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="request">Special Request</label>
                    <textarea id="request" className="form-input form-textarea" rows={3}
                      placeholder="Any specific requests, allergies, or preferences we should know..."
                      value={form.request} onChange={set('request')} />
                  </div>

                  <button
                    type="submit"
                    id="submit-booking"
                    className="btn btn-primary book-form__submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="book-loader" /> Booking...</>
                    ) : (
                      <>✨ Confirm Appointment</>
                    )}
                  </button>

                  <p className="book-form__note">
                    By booking, you agree to our cancellation policy. Free cancellation up to 24 hours before your appointment.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
