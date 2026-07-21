import { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { getSalonSettings, updateSalonSettings, uploadLogo } from '../../services/settings';
import type { SalonSettings } from '../../services/settings';

export default function AdminSettings() {
  const [settings, setSettings] = useState<SalonSettings>({
    studioName: 'Zha Aesthetic Salon',
    logoUrl: '',
    phone: '+91 98765 43210',
    whatsapp: '8270904659',
    email: 'appointments@zhahairsaloon.com',
    address: '102, Gold Crest Plaza, Bandra West, Mumbai, Maharashtra 400050',
    openHoursWeekdays: '09:00 AM - 08:00 PM',
    openHoursWeekends: '10:00 AM - 09:00 PM',
    instagram: 'https://instagram.com/zhahairsaloon',
    facebook: 'https://facebook.com/zhahairsaloon',
    youtube: 'https://youtube.com/zhahairsaloon',
    googleMaps: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSalonSettings()
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load settings:', err);
        setLoading(false);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalLogoUrl = settings.logoUrl;
      if (settings.logoUrl && settings.logoUrl.startsWith('data:')) {
        finalLogoUrl = await uploadLogo(settings.logoUrl);
      }

      const updated = await updateSalonSettings({
        ...settings,
        logoUrl: finalLogoUrl
      });

      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      alert(`Error saving settings: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div className="book-loader" style={{ width: '32px', height: '32px', borderTopColor: 'var(--admin-accent)' }} />
      </div>
    );
  }

  return (
    <div className="admin-page-wrapper" style={{ maxWidth: '850px' }}>
      <div className="admin-page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="admin-page-title">Website Settings</h2>
          <p className="admin-page-desc">Configure your business metadata, contact phone numbers, operating hours, and social channels.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Salon Branding Info */}
        <div>
          <h3 className="admin-card__title" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '8px', marginBottom: '16px' }}>
            Branding & Core Info
          </h3>
          <div className="admin-grid-2col-uneven">
            <div className="form-group">
              <label className="form-label" htmlFor="settings-studioName">Salon Name</label>
              <input 
                id="settings-studioName"
                className="form-input" 
                value={settings.studioName}
                onChange={e => setSettings(prev => ({ ...prev, studioName: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Upload Branding Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {settings.logoUrl && (
                  <img 
                    src={settings.logoUrl} 
                    alt="Logo Preview" 
                    style={{ width: '42px', height: '42px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} 
                  />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact and WhatsApp settings */}
        <div>
          <h3 className="admin-card__title" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '8px', marginBottom: '16px' }}>
            Contact & Coordination
          </h3>
          <div className="admin-grid-3col">
            <div className="form-group">
              <label className="form-label" htmlFor="settings-phone">Contact Number</label>
              <input 
                id="settings-phone"
                className="form-input" 
                value={settings.phone}
                onChange={e => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="settings-whatsapp">WhatsApp Number</label>
              <input 
                id="settings-whatsapp"
                className="form-input" 
                value={settings.whatsapp}
                onChange={e => setSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="settings-email">Email Address</label>
              <input 
                id="settings-email"
                className="form-input" 
                value={settings.email}
                onChange={e => setSettings(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '12px' }}>
            <label className="form-label" htmlFor="settings-address">Salon Physical Address</label>
            <textarea 
              id="settings-address"
              className="form-input" 
              rows={2} 
              value={settings.address}
              onChange={e => setSettings(prev => ({ ...prev, address: e.target.value }))}
              style={{ fontFamily: 'inherit', resize: 'vertical' }}
              required
            />
          </div>
          <div className="form-group" style={{ marginTop: '12px' }}>
            <label className="form-label" htmlFor="settings-googleMaps">Google Maps Embed URL</label>
            <textarea 
              id="settings-googleMaps"
              className="form-input" 
              rows={2} 
              value={settings.googleMaps}
              onChange={e => setSettings(prev => ({ ...prev, googleMaps: e.target.value }))}
              style={{ fontFamily: 'inherit', resize: 'vertical' }}
              placeholder="e.g. https://www.google.com/maps/embed?pb=..."
              required
            />
          </div>
        </div>

        {/* Operating Hours settings */}
        <div>
          <h3 className="admin-card__title" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '8px', marginBottom: '16px' }}>
            Operating Hours
          </h3>
          <div className="admin-grid-2col">
            <div className="form-group">
              <label className="form-label" htmlFor="settings-openHoursWeekdays">Weekdays (Mon - Fri)</label>
              <input 
                id="settings-openHoursWeekdays"
                className="form-input" 
                value={settings.openHoursWeekdays}
                onChange={e => setSettings(prev => ({ ...prev, openHoursWeekdays: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="settings-openHoursWeekends">Weekends (Sat - Sun)</label>
              <input 
                id="settings-openHoursWeekends"
                className="form-input" 
                value={settings.openHoursWeekends}
                onChange={e => setSettings(prev => ({ ...prev, openHoursWeekends: e.target.value }))}
                required
              />
            </div>
          </div>
        </div>

        {/* Social Media Link settings */}
        <div>
          <h3 className="admin-card__title" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '8px', marginBottom: '16px' }}>
            Social Media Channels
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="settings-instagram">Instagram Handle URL</label>
              <input 
                id="settings-instagram"
                className="form-input" 
                value={settings.instagram}
                onChange={e => setSettings(prev => ({ ...prev, instagram: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="settings-facebook">Facebook Page URL</label>
              <input 
                id="settings-facebook"
                className="form-input" 
                value={settings.facebook}
                onChange={e => setSettings(prev => ({ ...prev, facebook: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="settings-youtube">YouTube Channel URL</label>
              <input 
                id="settings-youtube"
                className="form-input" 
                value={settings.youtube}
                onChange={e => setSettings(prev => ({ ...prev, youtube: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', borderTop: '1px solid var(--admin-border)', paddingTop: '16px' }}>
          <button className="btn btn-primary" type="submit" disabled={saving} style={{ fontSize: '0.82rem' }}>
            <Save size={14} /> {saving ? 'Saving...' : 'Save Configuration'}
          </button>
          {saved && (
            <div style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
              <Check size={16} /> Changes saved successfully!
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
