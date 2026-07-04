import { useState } from 'react';
import { Save, Check } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    studioName: 'ZHA Hair Saloon',
    phone: '+91 98765 43210',
    email: 'appointments@zhahairsaloon.com',
    address: '102, Gold Crest Plaza, Bandra West, Mumbai, Maharashtra 400050',
    openHoursWeekdays: '09:00 AM - 08:00 PM',
    openHoursWeekends: '10:00 AM - 09:00 PM',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-page-wrapper" style={{ maxWidth: '800px' }}>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Settings</h2>
          <p className="admin-page-desc">Configure your business metadata, profile settings, and hours.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <h3 className="admin-card__title">Business Information</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="settings-studioName">Salon Name</label>
            <input 
              id="settings-studioName"
              className="form-input" 
              value={settings.studioName}
              onChange={e => setSettings(prev => ({ ...prev, studioName: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="settings-phone">Contact Number</label>
            <input 
              id="settings-phone"
              className="form-input" 
              value={settings.phone}
              onChange={e => setSettings(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="settings-email">Email Address</label>
          <input 
            id="settings-email"
            className="form-input" 
            value={settings.email}
            onChange={e => setSettings(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="settings-address">Salon Address</label>
          <textarea 
            id="settings-address"
            className="form-input" 
            rows={3} 
            value={settings.address}
            onChange={e => setSettings(prev => ({ ...prev, address: e.target.value }))}
            style={{ fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        <h3 className="admin-card__title" style={{ marginTop: 'var(--space-md)' }}>Operating Hours</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="settings-openHoursWeekdays">Weekdays (Mon - Fri)</label>
            <input 
              id="settings-openHoursWeekdays"
              className="form-input" 
              value={settings.openHoursWeekdays}
              onChange={e => setSettings(prev => ({ ...prev, openHoursWeekdays: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="settings-openHoursWeekends">Weekends (Sat - Sun)</label>
            <input 
              id="settings-openHoursWeekends"
              className="form-input" 
              value={settings.openHoursWeekends}
              onChange={e => setSettings(prev => ({ ...prev, openHoursWeekends: e.target.value }))}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
          <button className="btn btn-primary" type="submit" style={{ fontSize: '0.82rem' }}>
            <Save size={14} /> Save Configuration
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
