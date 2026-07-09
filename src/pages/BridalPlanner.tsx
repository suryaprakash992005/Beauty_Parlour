import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Crown,
  Clock,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { SparklesText } from '../components/SparklesText';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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

export default function BridalPlanner() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState('8270904659');

  useEffect(() => {
    import('../services/settings').then(({ getSalonSettings }) => {
      getSalonSettings().then(data => {
        if (data.whatsapp) {
          setWhatsapp(data.whatsapp.replace(/[^0-9]/g, ''));
        }
      }).catch(err => console.error(err));
    });
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

  const handleUpdateFamilyMember = (id: string, field: keyof FamilyMember, val: string) => {
    setValidationError(null);
    setFamilyMembers(prev =>
      prev.map(member => (member.id === id ? { ...member, [field]: val } : member))
    );
  };

  const handleRemoveFamilyMember = (id: string) => {
    setValidationError(null);
    setFamilyMembers(prev => prev.filter(member => member.id !== id));
  };

  // Navigations & Validations
  const validateStep = () => {
    if (step === 1) {
      if (!brideName.trim()) {
        setValidationError("Please enter the Bride's Full Name.");
        return false;
      }
      if (!weddingDate) {
        setValidationError("Please select your Wedding Date.");
        return false;
      }
    }
    if (step === 2) {
      const invalid = familyMembers.some(m => !m.name.trim());
      if (invalid) {
        setValidationError("Please enter a name for all added family members.");
        return false;
      }
    }
    if (step === 4) {
      if (trialDate && !trialTime) {
        setValidationError("Please select a Preferred Time Slot for your selected trial date.");
        return false;
      }
      if (!trialDate && trialTime) {
        setValidationError("Please select a Preferred Date for your selected trial time slot.");
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

  // Supabase Save
  const handleSavePlan = async () => {
    setLoading(true);
    const estimatedPrice = calculateTotal();

    const plannerData = {
      bride_name: brideName,
      wedding_date: weddingDate,
      selected_package: PACKAGES.find(p => p.id === selectedPkg)?.name || selectedPkg,
      family_members: familyMembers.map(m => ({ name: m.name, relation: m.relation, service: m.service })),
      trial_date: trialDate || null,
      trial_time: trialTime || null,
      additional_notes: notes || null,
      estimated_price: estimatedPrice
    };

    try {
      let finalId = '';
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('bridal_planners')
          .insert([plannerData])
          .select();

        if (error) throw error;
        if (data && data[0]) {
          finalId = data[0].id;
          setSavedId(finalId);
        }
      } else {
        // Fallback local simulated save
        const fallbackId = `local-${Math.random().toString(36).substring(2, 9)}`;
        const localSavedPlans = JSON.parse(localStorage.getItem('saved_bridal_plans') || '[]');
        localSavedPlans.push({ id: fallbackId, ...plannerData, created_at: new Date().toISOString() });
        localStorage.setItem('saved_bridal_plans', JSON.stringify(localSavedPlans));
        finalId = fallbackId;
        setSavedId(finalId);
      }

      // Format dates
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

      const whatsappMessage = `🌸 *BRIDAL PLAN CONFIRMED - ZHA HAIR SALOON* 🌸
----------------------------------------------
*Plan Reference ID:* ${finalId}
*Date:* ${new Date().toLocaleDateString(undefined, { dateStyle: 'medium' })}

✨ *BRIDE DETAILS:*
• *Name:* ${brideName}
• *Wedding Date:* ${formattedWeddingDate}

💖 *PLAN DETAILS:*
• *Selected Package:* ${packageName}${customDetailsText}
• *Trial Session:* ${formattedTrialDate} @ ${trialTime || 'N/A'}
${notes ? `• *Additional Notes:* ${notes}` : ''}

👥 *FAMILY SERVICES (${familyMembers.length}):*
${familyText}

----------------------------------------------
💰 *ESTIMATED TOTAL AMOUNT:* *₹${estimatedPrice.toLocaleString()}*
----------------------------------------------
Thank you for planning with us! Please share payment details (UPI/Online) for verification.
We look forward to serving you!`;

      setSuccess(true);
      const whatsappUrl = `https://wa.me/91${whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

    } catch (err: any) {
      console.error('Error saving plan to Supabase:', err);
      alert(`Database storage error: ${err.message || 'Saving failed. Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to booking form
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
      {/* Hero */}
      <section className="page-hero" style={{ height: '40vh', minHeight: '300px' }}>
        <div
          className="page-hero__bg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80')" }}
        />
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Bespoke Planning</div>
          <h1 className="page-hero__title">
            <SparklesText>Bridal Planner</SparklesText>
          </h1>
        </div>
      </section>

      <div className="planner-container">
        <div className="planner-card">
          {!success ? (
            <>
              {/* Step Indicators */}
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
                  >
                    {s.num}
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
                    <Calendar size={22} />
                    Wedding Details
                  </h2>
                  <div className="book-form">
                    <div className="form-group">
                      <label className="form-label" htmlFor="brideName">Bride's Full Name *</label>
                      <input
                        id="brideName"
                        className="form-input"
                        type="text"
                        placeholder="Name of the beautiful bride"
                        value={brideName}
                        onChange={e => setBrideName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="weddingDate">Wedding Date *</label>
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
                    Family Makeup Services
                  </h2>
                  <p className="section-subtitle" style={{ marginBottom: 'var(--space-md)' }}>
                    Add sisters, mothers, or bridesmaids who also need styling services (₹2,500 estimated per member).
                  </p>
                  
                  <div className="family-list">
                    {familyMembers.map((member) => (
                      <div key={member.id} className="family-row">
                        <input
                          className="form-input"
                          type="text"
                          placeholder="Member's Name"
                          value={member.name}
                          onChange={e => handleUpdateFamilyMember(member.id, 'name', e.target.value)}
                        />
                        <select
                          className="form-input form-select"
                          value={member.relation}
                          onChange={e => handleUpdateFamilyMember(member.id, 'relation', e.target.value)}
                        >
                          {RELATIONSHIP_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <select
                          className="form-input form-select"
                          value={member.service}
                          onChange={e => handleUpdateFamilyMember(member.id, 'service', e.target.value)}
                        >
                          {FAMILY_SERVICE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => handleRemoveFamilyMember(member.id)}
                          aria-label="Remove member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button type="button" className="btn-add w-100" onClick={handleAddFamilyMember}>
                    <Plus size={16} /> Add Family Member
                  </button>
                </div>
              )}

              {/* Step 3: Package Selection */}
              {step === 3 && (
                <div className="planner-step-fade">
                  <h2 className="planner-title">
                    <Crown size={22} />
                    Choose Your Package
                  </h2>
                  <div className="package-select-grid">
                    {PACKAGES.map(pkg => (
                      <div
                        key={pkg.id}
                        className={`package-select-card ${selectedPkg === pkg.id ? 'package-select-card--active' : ''}`}
                        onClick={() => setSelectedPkg(pkg.id)}
                      >
                        {selectedPkg === pkg.id && <span className="package-select-card__badge">Selected</span>}
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
                        Premium HD Makeup (+₹15,000)
                      </label>
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={customAddOns.sareeDraping}
                          onChange={e => setCustomAddOns(prev => ({ ...prev, sareeDraping: e.target.checked }))}
                        />
                        Luxury Saree Draping (+₹3,000)
                      </label>
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={customAddOns.nailArt}
                          onChange={e => setCustomAddOns(prev => ({ ...prev, nailArt: e.target.checked }))}
                        />
                        Gel Nail Extensions (+₹2,000)
                      </label>
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={customAddOns.hairSpa}
                          onChange={e => setCustomAddOns(prev => ({ ...prev, hairSpa: e.target.checked }))}
                        />
                        Luxury Hair Treatment (+₹2,500)
                      </label>
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={customAddOns.personalArtist}
                          onChange={e => setCustomAddOns(prev => ({ ...prev, personalArtist: e.target.checked }))}
                        />
                        Personal Day Artist (+₹10,000)
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
                    Schedule Trial Session
                  </h2>
                  <div className="book-form">
                    <div className="form-group">
                      <label className="form-label" htmlFor="trialDate">Preferred Date *</label>
                      <input
                        id="trialDate"
                        className="form-input"
                        type="date"
                        min={minDate}
                        max={weddingDate}
                        value={trialDate}
                        onChange={e => setTrialDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="trialTime">Preferred Time Slot *</label>
                      <select
                        id="trialTime"
                        className="form-input form-select"
                        value={trialTime}
                        onChange={e => setTrialTime(e.target.value)}
                        required
                      >
                        <option value="">Select time slot...</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="03:30 PM">03:30 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="notes">Additional Requests</label>
                      <textarea
                        id="notes"
                        className="form-input form-textarea"
                        rows={3}
                        placeholder="Any allergies, custom cosmetic products, or specific bridal looks you want to test..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Summary plan */}
              {step === 5 && (
                <div className="planner-step-fade">
                  <h2 className="planner-title">
                    <Sparkles size={22} />
                    Bridal Plan Summary
                  </h2>

                  <div className="summary-invoice">
                    <div className="invoice-header">
                      <h3 className="invoice-title">Personalized Bridal Plan</h3>
                      <div className="invoice-subtitle">ZHA Hair Saloon</div>
                    </div>

                    <div className="invoice-grid">
                      <div className="invoice-group">
                        <span className="invoice-label">Bride Name</span>
                        <span className="invoice-value">{brideName}</span>
                      </div>
                      <div className="invoice-group">
                        <span className="invoice-label">Wedding Date</span>
                        <span className="invoice-value">{new Date(weddingDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                      </div>
                      <div className="invoice-group">
                        <span className="invoice-label">Selected Package</span>
                        <span className="invoice-value">{PACKAGES.find(p => p.id === selectedPkg)?.name}</span>
                      </div>
                      <div className="invoice-group">
                        <span className="invoice-label">Trial Session</span>
                        <span className="invoice-value">
                          {new Date(trialDate).toLocaleDateString(undefined, { dateStyle: 'medium' })} @ {trialTime}
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
                            {PACKAGES.find(p => p.id === selectedPkg)?.name} (Base)
                            {selectedPkg === 'custom' && (
                              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                Custom Options: {[
                                  customAddOns.hdMakeup && 'HD Makeup',
                                  customAddOns.sareeDraping && 'Saree Draping',
                                  customAddOns.nailArt && 'Gel Nails',
                                  customAddOns.hairSpa && 'Hair Treatment',
                                  customAddOns.personalArtist && 'Personal Artist'
                                ].filter(Boolean).join(', ')}
                              </div>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
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
                              Family Makeup Services ({familyMembers.length} member{familyMembers.length > 1 ? 's' : ''})
                              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                {familyMembers.map(m => `${m.name} (${m.relation} - ${m.service})`).join(', ')}
                              </div>
                            </td>
                            <td style={{ textAlign: 'right' }}>₹{(familyMembers.length * 2500).toLocaleString()}</td>
                          </tr>
                        )}
                        <tr className="invoice-total-row">
                          <td>Estimated Total Price</td>
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
                  <button type="button" className="btn btn-primary" onClick={handleNext}>
                    Next <ArrowRight size={16} />
                  </button>
                ) : (
                  <InteractiveHoverButton onClick={handleSavePlan} disabled={loading}>
                    {loading ? 'Saving...' : 'Confirm & Save Plan'}
                  </InteractiveHoverButton>
                )}
              </div>
            </>
          ) : (
            /* Success screen */
            <div className="success-view planner-step-fade">
              <CheckCircle className="success-icon" size={68} />
              <h2 className="section-title">Your Bridal Plan is Saved!</h2>
              <p className="section-subtitle">
                Congratulations! Your personalized summary invoice is ready. We have successfully logged reference <strong>#{savedId || 'local'}</strong>.
              </p>
              
              <div className="success-actions">
                <InteractiveHoverButton onClick={handleBookNow}>
                  Book Appointment
                </InteractiveHoverButton>
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
