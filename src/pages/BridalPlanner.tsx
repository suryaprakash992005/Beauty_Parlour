import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Crown,
  Clock,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Check,
  ShieldCheck
} from 'lucide-react';
import { SparklesText } from '../components/SparklesText';
import Breadcrumb from '../components/Breadcrumb';
import { useSEO, PAGE_SEO } from '../hooks/useSEO';
import { getSalonSettings } from '../services/settings';
import '../styles/bridal-planner.css';

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  service: string;
}

interface CustomAddOns {
  hdMakeup: boolean;
  sareeDraping: boolean;
  nailArt: boolean;
  hairSpa: boolean;
  personalArtist: boolean;
}

const RELATIONSHIP_OPTIONS = ['Sister', 'Mother of Bride', 'Mother of Groom', 'Bridesmaid', 'Friend', 'Other'];
const FAMILY_SERVICE_OPTIONS = [
  'Makeup & Hair Styling',
  'Makeup Only',
  'Hair Styling Only',
  'Nail Paint/Art',
  'Saree Draping'
];

const PACKAGES = [
  { id: 'silver', name: 'Silver Bridal Package', price: 24999, desc: 'Elegant simplicity with HD makeup, hair setup, saree draping, and pre-bridal facial.' },
  { id: 'gold', name: 'Gold Bridal Package', price: 49999, desc: 'The signature experience featuring premium HD makeup, personal artist support, and nail art.' },
  { id: 'diamond', name: 'Diamond Luxury Bridal Package', price: 89999, desc: 'Celebrity-grade full glam, multi-day coverage, dedicated coordinator, and body scrub.' },
  { id: 'custom', name: 'Custom Bridal Package', price: 15000, desc: 'Build your own package. Choose only the premium treatments and styling options you need.' }
];

const STEP_LABELS = ['Bride Details', 'Family Services', 'Bridal Package', 'Trial Session', 'Summary Plan'];

export default function BridalPlanner() {
  useSEO({
    ...PAGE_SEO.bridal,
    breadcrumbs: [{ name: 'Bridal Planner', url: '/bridal-planner' }],
  });
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState('8270904659');

  useEffect(() => {
    getSalonSettings().then(data => {
      if (data.whatsapp) {
        setWhatsapp(data.whatsapp.replace(/[^0-9]/g, ''));
      }
    }).catch(err => console.error(err));
  }, []);

  // Form State
  const [brideName, setBrideName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  
  // Family State
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  
  // Package State
  const [selectedPkg, setSelectedPkg] = useState('gold');
  const [customAddOns, setCustomAddOns] = useState<CustomAddOns>({
    hdMakeup: false,
    sareeDraping: false,
    nailArt: false,
    hairSpa: false,
    personalArtist: false
  });

  // Trial State
  const [trialDate, setTrialDate] = useState('');
  const [trialTime, setTrialTime] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Calculations
  const calculateTotal = () => {
    let base = 0;
    const pkg = PACKAGES.find(p => p.id === selectedPkg);
    if (pkg) base = pkg.price;

    if (selectedPkg === 'custom') {
      if (customAddOns.hdMakeup) base += 15000;
      if (customAddOns.sareeDraping) base += 3000;
      if (customAddOns.nailArt) base += 2000;
      if (customAddOns.hairSpa) base += 2500;
      if (customAddOns.personalArtist) base += 10000;
    }

    const familyCost = familyMembers.length * 2500;
    return base + familyCost;
  };

  const handleAddFamilyMember = () => {
    setValidationError(null);
    setFamilyMembers(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        name: '',
        relation: RELATIONSHIP_OPTIONS[0],
        service: FAMILY_SERVICE_OPTIONS[0]
      }
    ]);
  };

  const handleRemoveFamilyMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateFamilyMember = (id: string, field: keyof FamilyMember, val: string) => {
    setFamilyMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: val } : m));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!brideName.trim()) {
        setValidationError('Please enter the bride\'s full name.');
        return false;
      }
      if (!weddingDate) {
        setValidationError('Please select your wedding date.');
        return false;
      }
    }
    if (step === 2) {
      for (const m of familyMembers) {
        if (!m.name.trim()) {
          setValidationError('Please fill in the name for all family members or remove empty rows.');
          return false;
        }
      }
    }
    if (step === 4) {
      if (!trialDate) {
        setValidationError('Please select a preferred date for your trial session.');
        return false;
      }
      if (!trialTime) {
        setValidationError('Please select a preferred time slot for your trial session.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    setValidationError(null);
    if (validateStep()) setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setValidationError(null);
    setStep(prev => prev - 1);
  };

  // Format and send to WhatsApp
  const handleSavePlan = async () => {
    setLoading(true);
    const estimatedPrice = calculateTotal();

    try {
      const fallbackId = `BP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setSavedId(fallbackId);
      const finalId = fallbackId;

      const formattedWeddingDate = new Date(weddingDate).toLocaleDateString(undefined, { dateStyle: 'medium' });
      const formattedTrialDate = trialDate ? new Date(trialDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A';
      const packageName = PACKAGES.find(p => p.id === selectedPkg)?.name || selectedPkg;

      let customDetailsText = '';
      if (selectedPkg === 'custom') {
        const activeAddOns = [
          customAddOns.hdMakeup && 'HD Makeup',
          customAddOns.sareeDraping && 'Saree Draping',
          customAddOns.nailArt && 'Gel Nails',
          customAddOns.hairSpa && 'Hair Treatment',
          customAddOns.personalArtist && 'Personal Artist'
        ].filter(Boolean);
        customDetailsText = ` (Custom Extras: ${activeAddOns.join(', ')})`;
      }

      let familyText = '';
      if (familyMembers.length > 0) {
        familyText = familyMembers.map(m => `• *${m.name}* (${m.relation} - ${m.service})`).join('\n');
      } else {
        familyText = '• *No family members added*';
      }

      const whatsappMessage = `🌸 *BRIDAL PLANNER CONFIRMATION — ZHA AESTHETIC SALON* 🌸
----------------------------------------------
*Reference ID:* ${finalId}
*Date Logged:* ${new Date().toLocaleDateString(undefined, { dateStyle: 'medium' })}

✨ *BRIDE DETAILS:*
• *Bride Name:* ${brideName}
• *Wedding Date:* ${formattedWeddingDate}

💖 *PACKAGE DETAILS:*
• *Package:* ${packageName}${customDetailsText}
• *Trial Session:* ${formattedTrialDate} @ ${trialTime || 'N/A'}
${notes ? `• *Special Notes:* ${notes}` : ''}

👥 *FAMILY SERVICES (${familyMembers.length}):*
${familyText}

----------------------------------------------
💰 *ESTIMATED TOTAL AMOUNT:* *₹${estimatedPrice.toLocaleString()}*
----------------------------------------------
Thank you for planning with ZHA Aesthetic Salon! We look forward to serving you!`;

      setSuccess(true);
      const whatsappUrl = `https://wa.me/91${whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

    } catch (err: any) {
      console.error('Error formatting plan redirect:', err);
      alert(`Error setting up WhatsApp redirect: ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    const selectedPackageName = PACKAGES.find(p => p.id === selectedPkg)?.name || 'Custom Bridal Package';
    navigate('/book-appointment', {
      state: {
        name: brideName,
        service: selectedPackageName,
        date: trialDate,
        time: trialTime,
        request: `Saved Bridal Plan Reference ID: ${savedId || 'local'}\nFamily Members Count: ${familyMembers.length}\nWedding Date: ${weddingDate}\nNotes: ${notes}`
      }
    });
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <main className="bridal-planner-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div
          className="page-hero__bg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80')" }}
        />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <Breadcrumb items={[{ label: 'Bridal Planner' }]} />
          <div className="section-label" style={{ color: 'var(--color-champagne)', marginTop: '8px' }}>
            ✨ Bespoke Bridal Planning
          </div>
          <h1 className="page-hero__title">
            <SparklesText>Bridal Makeup & Package Planner</SparklesText>
          </h1>
          <p className="page-hero__subtitle">
            Design your custom bridal makeover, trial session, and family packages with ZHA Aesthetic Salon.
          </p>
        </div>
      </section>

      {/* Main Wizard Container */}
      <div className="planner-container">
        <div className="planner-card">
          {!success ? (
            <>
              {/* Mobile Step Badge */}
              <div className="planner-mobile-step-badge">
                <div className="planner-mobile-step-badge__text">
                  <span className="planner-mobile-step-badge__dot" />
                  Step {step} of 5 — {STEP_LABELS[step - 1]}
                </div>
                <div className="planner-mobile-step-badge__count">
                  {Math.round((step / 5) * 100)}%
                </div>
              </div>

              {/* Desktop Step Indicator Bar */}
              <div className="planner-steps">
                <div className="planner-steps__progress" style={{ width: `${((step - 1) / 4) * 100}%` }} />
                {[
                  { num: 1, label: 'Bride' },
                  { num: 2, label: 'Family' },
                  { num: 3, label: 'Package' },
                  { num: 4, label: 'Trial' },
                  { num: 5, label: 'Summary' }
                ].map(s => (
                  <div
                    key={s.num}
                    className={`planner-step ${step === s.num ? 'planner-step--active' : ''} ${step > s.num ? 'planner-step--completed' : ''}`}
                    onClick={() => {
                      if (s.num < step) setStep(s.num);
                    }}
                  >
                    {step > s.num ? <Check size={16} /> : s.num}
                    <span className="planner-step__label">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Error Message banner */}
              {validationError && (
                <div className="planner-error-message">
                  <span>⚠️</span> {validationError}
                </div>
              )}

              {/* Step 1: Bride details */}
              {step === 1 && (
                <div className="planner-step-fade">
                  <h2 className="planner-title">
                    <Crown size={22} />
                    Bride & Event Details
                  </h2>
                  <div className="planner-form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="brideName">
                        Bride's Full Name <span className="form-label-req">*</span>
                      </label>
                      <input
                        id="brideName"
                        className="form-input"
                        type="text"
                        placeholder="e.g. Ananya Sharma"
                        value={brideName}
                        onChange={e => setBrideName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="weddingDate">
                        Wedding Date <span className="form-label-req">*</span>
                      </label>
                      <input
                        id="weddingDate"
                        className="form-input"
                        type="date"
                        min={minDate}
                        value={weddingDate}
                        onChange={e => setWeddingDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Family makeup services */}
              {step === 2 && (
                <div className="planner-step-fade">
                  <h2 className="planner-title">
                    <Users size={22} />
                    Family & Bridesmaids Makeover
                  </h2>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
                    Add sisters, mothers, or bridesmaids who also need professional styling services (₹2,500 estimated per member).
                  </p>
                  
                  <div className="family-list">
                    {familyMembers.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,0.01)', borderRadius: '14px', border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                        No family members added yet. Click below to include bridesmaids or family.
                      </div>
                    ) : (
                      familyMembers.map((member) => (
                        <div key={member.id} className="family-row">
                          <div className="family-field">
                            <span className="family-field__label">Member Name</span>
                            <input
                              className="form-input"
                              type="text"
                              placeholder="e.g. Priya Sharma"
                              value={member.name}
                              onChange={e => handleUpdateFamilyMember(member.id, 'name', e.target.value)}
                            />
                          </div>
                          <div className="family-field">
                            <span className="family-field__label">Relationship</span>
                            <select
                              className="form-input form-select"
                              value={member.relation}
                              onChange={e => handleUpdateFamilyMember(member.id, 'relation', e.target.value)}
                            >
                              {RELATIONSHIP_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                          <div className="family-field">
                            <span className="family-field__label">Requested Service</span>
                            <select
                              className="form-input form-select"
                              value={member.service}
                              onChange={e => handleUpdateFamilyMember(member.id, 'service', e.target.value)}
                            >
                              {FAMILY_SERVICE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => handleRemoveFamilyMember(member.id)}
                            aria-label="Remove member"
                            title="Remove member"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <button type="button" className="btn-add" onClick={handleAddFamilyMember}>
                    <Plus size={16} /> Add Family Member
                  </button>
                </div>
              )}

              {/* Step 3: Package Selection */}
              {step === 3 && (
                <div className="planner-step-fade">
                  <h2 className="planner-title">
                    <Sparkles size={22} />
                    Choose Your Bridal Package
                  </h2>
                  <div className="package-select-grid">
                    {PACKAGES.map(pkg => (
                      <div
                        key={pkg.id}
                        className={`package-select-card ${selectedPkg === pkg.id ? 'package-select-card--active' : ''}`}
                        onClick={() => setSelectedPkg(pkg.id)}
                      >
                        {selectedPkg === pkg.id && (
                          <span className="package-select-card__badge">
                            <Check size={12} /> SELECTED
                          </span>
                        )}
                        <div className="package-select-card__name">{pkg.name}</div>
                        <div className="package-select-card__price">
                          {pkg.id === 'custom' ? '₹15,000+' : `₹${pkg.price.toLocaleString()}`}
                        </div>
                        <div className="package-select-card__desc">{pkg.desc}</div>
                      </div>
                    ))}
                  </div>

                  {selectedPkg === 'custom' && (
                    <div className="custom-options">
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={customAddOns.hdMakeup}
                          onChange={e => setCustomAddOns(prev => ({ ...prev, hdMakeup: e.target.checked }))}
                        />
                        <span>Premium HD Makeup (+₹15,000)</span>
                      </label>
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={customAddOns.sareeDraping}
                          onChange={e => setCustomAddOns(prev => ({ ...prev, sareeDraping: e.target.checked }))}
                        />
                        <span>Luxury Saree Draping (+₹3,000)</span>
                      </label>
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={customAddOns.nailArt}
                          onChange={e => setCustomAddOns(prev => ({ ...prev, nailArt: e.target.checked }))}
                        />
                        <span>Gel Nail Extensions (+₹2,000)</span>
                      </label>
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={customAddOns.hairSpa}
                          onChange={e => setCustomAddOns(prev => ({ ...prev, hairSpa: e.target.checked }))}
                        />
                        <span>Luxury Hair Treatment (+₹2,500)</span>
                      </label>
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={customAddOns.personalArtist}
                          onChange={e => setCustomAddOns(prev => ({ ...prev, personalArtist: e.target.checked }))}
                        />
                        <span>Personal Day Artist (+₹10,000)</span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Trial appointment scheduling */}
              {step === 4 && (
                <div className="planner-step-fade">
                  <h2 className="planner-title">
                    <Clock size={22} />
                    Schedule Trial & Consultation
                  </h2>
                  <div className="planner-form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="trialDate">
                        Preferred Trial Date <span className="form-label-req">*</span>
                      </label>
                      <input
                        id="trialDate"
                        className="form-input"
                        type="date"
                        min={minDate}
                        max={weddingDate || undefined}
                        value={trialDate}
                        onChange={e => setTrialDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="trialTime">
                        Preferred Time Slot <span className="form-label-req">*</span>
                      </label>
                      <select
                        id="trialTime"
                        className="form-input form-select"
                        value={trialTime}
                        onChange={e => setTrialTime(e.target.value)}
                        required
                      >
                        <option value="">Select time slot...</option>
                        <option value="10:00 AM">10:00 AM (Morning)</option>
                        <option value="11:30 AM">11:30 AM (Late Morning)</option>
                        <option value="02:00 PM">02:00 PM (Afternoon)</option>
                        <option value="03:30 PM">03:30 PM (Late Afternoon)</option>
                        <option value="05:00 PM">05:00 PM (Evening)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '20px' }}>
                    <label className="form-label" htmlFor="notes">Additional Styling Requests / Notes</label>
                    <textarea
                      id="notes"
                      className="form-input form-textarea"
                      rows={3}
                      placeholder="Mention any allergies, preferred cosmetics brand, custom saree draping styles, or specific hair accessories..."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Summary plan */}
              {step === 5 && (
                <div className="planner-step-fade">
                  <h2 className="planner-title">
                    <ShieldCheck size={22} />
                    Personalized Bridal Estimate
                  </h2>

                  <div className="summary-invoice">
                    <div className="invoice-header">
                      <h3 className="invoice-title">Official Bridal Package Summary</h3>
                      <div className="invoice-subtitle">ZHA Aesthetic Salon • Premium Bridal Studio</div>
                    </div>

                    <div className="invoice-grid">
                      <div className="invoice-group">
                        <span className="invoice-label">Bride Name</span>
                        <span className="invoice-value">{brideName}</span>
                      </div>
                      <div className="invoice-group">
                        <span className="invoice-label">Wedding Date</span>
                        <span className="invoice-value">
                          {weddingDate ? new Date(weddingDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                        </span>
                      </div>
                      <div className="invoice-group">
                        <span className="invoice-label">Selected Package</span>
                        <span className="invoice-value">{PACKAGES.find(p => p.id === selectedPkg)?.name}</span>
                      </div>
                      <div className="invoice-group">
                        <span className="invoice-label">Trial Session</span>
                        <span className="invoice-value">
                          {trialDate ? new Date(trialDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'} @ {trialTime || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <table className="invoice-table">
                      <thead>
                        <tr>
                          <th>Service Description</th>
                          <th style={{ textAlign: 'right' }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong>{PACKAGES.find(p => p.id === selectedPkg)?.name}</strong> (Base Makeover & Styling)
                            {selectedPkg === 'custom' && (
                              <div style={{ fontSize: '12px', color: '#D4AF37', marginTop: '4px' }}>
                                Custom Extras: {[
                                  customAddOns.hdMakeup && 'HD Makeup',
                                  customAddOns.sareeDraping && 'Saree Draping',
                                  customAddOns.nailArt && 'Gel Nails',
                                  customAddOns.hairSpa && 'Hair Treatment',
                                  customAddOns.personalArtist && 'Personal Artist'
                                ].filter(Boolean).join(', ')}
                              </div>
                            )}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>
                            {selectedPkg === 'custom' ? (
                              `₹${(
                                15000 +
                                (customAddOns.hdMakeup ? 15000 : 0) +
                                (customAddOns.sareeDraping ? 3000 : 0) +
                                (customAddOns.nailArt ? 2000 : 0) +
                                (customAddOns.hairSpa ? 2500 : 0) +
                                (customAddOns.personalArtist ? 10000 : 0)
                              ).toLocaleString()}`
                            ) : (
                              `₹${PACKAGES.find(p => p.id === selectedPkg)?.price.toLocaleString()}`
                            )}
                          </td>
                        </tr>
                        {familyMembers.length > 0 && (
                          <tr>
                            <td>
                              <strong>Family & Guest Services</strong> ({familyMembers.length} member{familyMembers.length > 1 ? 's' : ''})
                              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                                {familyMembers.map(m => `${m.name} (${m.relation})`).join(', ')}
                              </div>
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{(familyMembers.length * 2500).toLocaleString()}</td>
                          </tr>
                        )}
                        <tr className="invoice-total-row">
                          <td>Estimated Total Investment</td>
                          <td style={{ textAlign: 'right' }}>₹{calculateTotal().toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="planner-actions">
                {step > 1 ? (
                  <button type="button" className="btn btn-outline" onClick={handleBack}>
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : (
                  <div />
                )}
                {step < 5 ? (
                  <button type="button" className="btn-next-step" onClick={handleNext}>
                    Next Step <ArrowRight size={16} />
                  </button>
                ) : (
                  <button type="button" className="btn-next-step" onClick={handleSavePlan} disabled={loading}>
                    {loading ? 'Processing...' : 'Confirm & Save Plan'} <Sparkles size={16} />
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Success screen */
            <div className="success-view planner-step-fade">
              <CheckCircle className="success-icon" size={72} />
              <h2 className="planner-title" style={{ border: 'none', marginBottom: '8px', fontSize: '2rem', justifyContent: 'center' }}>
                Your Bridal Plan is Confirmed!
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '15px', maxWidth: '520px', lineHeight: '1.6', margin: '0 auto' }}>
                Congratulations! Your personalized estimate reference ID is <strong>#{savedId || 'BP-2026'}</strong>. We have opened WhatsApp to connect directly with our senior bridal consultant.
              </p>
              
              <div className="success-actions">
                <button type="button" className="btn-next-step" style={{ justifyContent: 'center' }} onClick={handleBookNow}>
                  Book Appointment Now <ArrowRight size={16} />
                </button>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
