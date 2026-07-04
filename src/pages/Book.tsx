import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollReveal } from '../components/shared';
import '../styles/book.css';

const SERVICES_LIST = [
  'Hair Cut', 'Hair Coloring', 'Hair Spa', 'Keratin Treatment', 'Facial',
  'Bridal Makeup', 'Nail Art', 'Waxing', 'Threading', 'Pedicure', 'Manicure',
  'Silver Bridal Package', 'Gold Bridal Package', 'Diamond Luxury Bridal Package',
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

    const message = `🌸 *APPOINTMENT BOOKED - ZHA HAIR SALOON* 🌸
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
      const whatsappUrl = `https://wa.me/918270904659?text=${encodeURIComponent(message)}`;
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
              <h2 className="book-info__title">Why Choose ZHA Hair Saloon?</h2>
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
                <a href="tel:+919876543210" className="book-phone">+91 98765 43210</a>
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
