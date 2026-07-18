import { useState, useEffect } from 'react';
import { 
  Star, Search, Filter, ArrowUpDown, Trash2, CheckCircle2, EyeOff, Plus, X, AlertTriangle, Sparkles, Calendar, Loader2, Link2, RefreshCw, Unlink
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getReviews, updateReviewStatus, deleteReview, addReview } from '../../services/reviews';
import type { ReviewItem } from '../../services/reviews';
import { 
  getConnection, 
  saveConnection, 
  disconnectConnection, 
  syncGoogleReviews, 
  MOCK_GMB_PROFILES 
} from '../../services/googleBusiness';
import type { GoogleBusinessConnection } from '../../services/googleBusiness';

interface Toast {
  type: 'success' | 'error';
  message: string;
  id: number;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Search, Filter, Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'hidden' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest_rating'>('newest');

  // Add Review Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewDate, setNewReviewDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  // Google Business Profile Integration States
  const [connection, setConnection] = useState<GoogleBusinessConnection | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [oauthStep, setOauthStep] = useState<'profile' | 'connecting' | 'complete'>('profile');
  const [googleEmail, setGoogleEmail] = useState<string>('');
  const [selectedLocationId, setSelectedLocationId] = useState(MOCK_GMB_PROFILES[0].location_id);
  const [syncMode] = useState<'all' | 'new'>('all');
  const [autoApprove, setAutoApprove] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState<'idle' | 'auth' | 'fetch' | 'dedup' | 'save' | 'complete'>('idle');

  // Delete Confirmation States
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    fetchReviewsList();
    loadGmbConnection();
    checkAuthSession();
  }, []);

  const checkAuthSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        setGoogleEmail(session.user.email || '');
        
        // Auto-trigger location modal if redirecting back from OAuth and not connected yet
        const conn = await getConnection();
        if (!conn) {
          setOauthStep('profile');
          setShowConnectModal(true);
        }
      }
    } catch (err) {
      console.error('Error checking auth session:', err);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const fetchReviewsList = async () => {
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to load reviews.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await updateReviewStatus(id, true);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, published: true } : r));
      showToast('Review approved and published to website successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to approve review.', 'error');
    }
  };

  const handleHide = async (id: number) => {
    try {
      await updateReviewStatus(id, false);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, published: false } : r));
      showToast('Review successfully hidden from website.');
    } catch (err: any) {
      showToast(err.message || 'Failed to hide review.', 'error');
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId === null) return;
    try {
      await deleteReview(deleteConfirmId);
      setReviews(prev => prev.filter(r => r.id !== deleteConfirmId));
      showToast('Review deleted permanently.');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete review.', 'error');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const loadGmbConnection = async () => {
    try {
      const conn = await getConnection();
      setConnection(conn);
    } catch (err: any) {
      console.error('Failed to load GMB connection:', err);
    }
  };

  const handleGmbConnectOAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/admin/reviews',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) throw error;
    } catch (err: any) {
      showToast(err.message || 'Failed to start Google OAuth flow.', 'error');
    }
  };

  const handleGmbConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOauthStep('connecting');
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    try {
      await delay(900);
      const matchedProfile = MOCK_GMB_PROFILES.find(p => p.location_id === selectedLocationId);
      const locationName = matchedProfile ? matchedProfile.location_name : 'Zha Aesthetic Salon';
      const email = googleEmail || 'admin@zhahairsaloon.com';

      const conn = await saveConnection(selectedLocationId, locationName, email);
      setConnection(conn);

      setOauthStep('complete');
      await delay(800);
      showToast('Google Business Profile connected successfully!');
      setShowConnectModal(false);
      // Reset state
      setOauthStep('profile');
    } catch (err: any) {
      showToast(err.message || 'Connection failed.', 'error');
      setOauthStep('profile');
    }
  };

  const handleGmbDisconnect = async () => {
    try {
      await disconnectConnection();
      await supabase.auth.signOut();
      setConnection(null);
      setGoogleEmail('');
      showToast('Google Business Profile disconnected successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to disconnect.', 'error');
    }
  };

  const handleGmbSync = async () => {
    setSyncing(true);
    setSyncStep('auth');
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    try {
      await delay(600);
      setSyncStep('fetch');
      await delay(800);
      setSyncStep('dedup');
      await delay(600);
      setSyncStep('save');

      const result = await syncGoogleReviews(syncMode, autoApprove);
      
      await delay(500);
      setSyncStep('complete');
      await delay(850);

      // Reload connection info and reviews list
      await loadGmbConnection();
      await fetchReviewsList();

      if (result.noNewFound) {
        showToast('All synced reviews are duplicates. No new reviews inserted.', 'error');
      } else {
        showToast(`Sync Complete! Successfully synced ${result.syncedCount} new reviews. (${result.duplicatesSkipped} duplicates skipped)`);
      }
    } catch (err: any) {
      showToast(err.message || 'Synchronization failed.', 'error');
    } finally {
      setSyncing(false);
      setSyncStep('idle');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewText) return;
    setSaving(true);
    try {
      const added = await addReview({
        reviewer_name: newReviewName,
        rating: newReviewRating,
        review_text: newReviewText,
        review_date: newReviewDate,
        published: true, // manually added reviews are published by default
        google_review_id: null
      });
      setReviews(prev => [added, ...prev]);
      showToast('New review successfully created and published!');
      setShowAddModal(false);
      // Reset form
      setNewReviewName('');
      setNewReviewRating(5);
      setNewReviewText('');
      setNewReviewDate(new Date().toISOString().split('T')[0]);
    } catch (err: any) {
      showToast(err.message || 'Failed to create review.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Filter and Sort Processing
  const filteredAndSortedReviews = reviews
    .filter(r => {
      const matchesSearch = r.reviewer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.review_text.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === 'approved') matchesStatus = r.published === true;
      if (statusFilter === 'hidden') matchesStatus = r.published === false;
      if (statusFilter === 'pending') matchesStatus = r.published === null;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'highest_rating') {
        return b.rating - a.rating;
      }
      // default: newest
      return new Date(b.review_date).getTime() - new Date(a.review_date).getTime();
    });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div className="book-loader" style={{ width: '32px', height: '32px', borderTopColor: 'var(--admin-accent)' }} />
      </div>
    );
  }

  return (
    <div className="admin-page-wrapper">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <h2 className="admin-page-title">Reviews Management</h2>
          <p className="admin-page-desc">Moderate client testimonials imported via Google Business Profile integration or added manually.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          {!connection ? (
            <button 
              type="button"
              className="btn btn-outline" 
              onClick={handleGmbConnectOAuth}
              style={{ 
                borderColor: '#10b981', 
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.03)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          ) : (
            <>
              <button 
                type="button"
                className="btn btn-outline" 
                onClick={handleGmbSync}
                disabled={syncing}
                style={{ 
                  borderColor: '#10b981', 
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                <span>{syncing ? 'Syncing...' : 'Sync Reviews'}</span>
              </button>

              <button 
                type="button"
                className="btn btn-outline" 
                onClick={handleGmbDisconnect}
                style={{ 
                  borderColor: 'rgba(239, 68, 68, 0.5)', 
                  color: '#ef4444',
                  background: 'rgba(239, 68, 68, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Unlink size={14} />
                <span>Disconnect Business</span>
              </button>
            </>
          )}
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add Review
          </button>
        </div>
      </div>

      {/* Google Business Connection Card */}
      {connection && (
        <div className="admin-card animate-fadeIn" style={{ 
          padding: 'var(--space-md) var(--space-xl)', 
          marginBottom: 'var(--space-xl)', 
          border: '1px solid rgba(16, 185, 129, 0.25)', 
          background: 'rgba(16, 185, 129, 0.02)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981', fontWeight: 700 }}>
                Google Business Connected
              </div>
              <h4 style={{ margin: '2px 0 0 0', color: 'white', fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
                {connection.location_name}
              </h4>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-xl)', fontSize: '0.8rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--color-text-light)' }}>Account</span>
              <strong style={{ color: 'white' }}>{connection.connected_email}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--color-text-light)' }}>Last Sync</span>
              <strong style={{ color: 'white' }}>
                {connection.last_sync_time ? new Date(connection.last_sync_time).toLocaleString() : 'Never'}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="admin-card" style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-xl)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by reviewer name or content..." 
            className="form-input" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            style={{ paddingLeft: '36px' }}
          />
        </div>

        {/* Filter & Sort Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} style={{ color: 'var(--color-champagne)' }} />
            <select 
              className="form-input" 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value as any)}
              style={{ width: '140px', padding: '6px 12px' }}
            >
              <option value="all">All Reviews</option>
              <option value="approved">Approved</option>
              <option value="hidden">Hidden</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={14} style={{ color: 'var(--color-champagne)' }} />
            <select 
              className="form-input" 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value as any)}
              style={{ width: '160px', padding: '6px 12px' }}
            >
              <option value="newest">Newest First</option>
              <option value="highest_rating">Highest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Cards Grid */}
      {filteredAndSortedReviews.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-text-muted)' }}>
          {reviews.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'white', margin: 0, fontSize: '1.2rem' }}>No reviews imported yet</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0, marginBottom: '8px' }}>
                Connect your Google Business Profile to sync customer reviews automatically.
              </p>
              {!connection && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleGmbConnectOAuth}
                  style={{ 
                    borderColor: '#10b981', 
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              )}
            </div>
          ) : (
            "No reviews matched your filters."
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-lg)' }}>
          {filteredAndSortedReviews.map(review => (
            <div 
              key={review.id} 
              className="admin-card" 
              style={{ 
                padding: 'var(--space-xl)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                border: '1px solid var(--color-border)',
                position: 'relative',
                transition: 'transform 0.2s',
                background: 'var(--color-card-bg)'
              }}
            >
              {/* Badge Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'white' }}>
                  {review.reviewer_name}
                </h4>
                <span style={{ 
                  fontSize: '0.68rem', 
                  fontWeight: 600, 
                  padding: '3px 8px', 
                  borderRadius: '100px',
                  textTransform: 'uppercase',
                  background: review.published === true ? 'rgba(34, 197, 94, 0.1)' : review.published === false ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                  color: review.published === true ? '#22c55e' : review.published === false ? '#ef4444' : '#eab308'
                }}>
                  {review.published === true ? 'Approved' : review.published === false ? 'Hidden' : 'Pending'}
                </span>
              </div>

              {/* Star Rating */}
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < review.rating ? 'var(--color-champagne)' : 'none'} 
                    color={i < review.rating ? 'var(--color-champagne)' : 'rgba(255,255,255,0.1)'} 
                  />
                ))}
              </div>

              {/* Date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <Calendar size={12} />
                <span>{new Date(review.review_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                {review.google_review_id && (
                  <span style={{ marginLeft: 'auto', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600 }}>Imported from Google</span>
                )}
              </div>

              {/* Review Text */}
              <p style={{ 
                margin: 0, 
                fontSize: '0.82rem', 
                color: 'var(--color-text-light)', 
                lineHeight: '1.5',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical'
              }}>
                "{review.review_text}"
              </p>

              {/* Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '4px' }}>
                {review.published !== true && (
                  <button 
                    onClick={() => handleApprove(review.id!)}
                    className="btn btn-outline" 
                    style={{ fontSize: '0.72rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', borderColor: '#22c55e', color: '#22c55e' }}
                    title="Approve Review"
                  >
                    <CheckCircle2 size={12} /> Approve
                  </button>
                )}
                {review.published !== false && (
                  <button 
                    onClick={() => handleHide(review.id!)}
                    className="btn btn-outline" 
                    style={{ fontSize: '0.72rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', borderColor: '#ef4444', color: '#ef4444' }}
                    title="Hide Review"
                  >
                    <EyeOff size={12} /> Hide
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteClick(review.id!)}
                  className="btn btn-outline" 
                  style={{ fontSize: '0.72rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444' }}
                  title="Delete Permanent"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {deleteConfirmId !== null && (
        <div className="admin-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-2xl)', border: '1px solid var(--color-border)', animation: 'zoomIn 0.25s ease', textAlign: 'center' }}>
            <AlertTriangle size={44} style={{ color: '#ef4444', marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'white', margin: '0 0 10px 0' }}>Delete Review?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5', margin: '0 0 24px 0' }}>
              Are you sure you want to permanently delete this review? This action is irreversible.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleConfirmDelete} style={{ background: '#ef4444' }}>Delete Review</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Dialog Modal */}
      {showAddModal && (
        <div className="admin-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
          <form onSubmit={handleAddSubmit} className="admin-card admin-modal-card" style={{ width: '100%', maxWidth: '460px', padding: 'var(--space-2xl)', border: '1px solid var(--color-border)', animation: 'zoomIn 0.25s ease', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--color-champagne)' }} />
                Add New Review
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ color: 'var(--color-text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-reviewer-name">Reviewer Name *</label>
              <input 
                id="new-reviewer-name"
                type="text" 
                className="form-input" 
                placeholder="e.g. Shalini Sen" 
                value={newReviewName} 
                onChange={e => setNewReviewName(e.target.value)} 
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="new-review-rating">Rating (Stars) *</label>
                <select 
                  id="new-review-rating"
                  className="form-input" 
                  value={newReviewRating} 
                  onChange={e => setNewReviewRating(Number(e.target.value))}
                >
                  <option value="5">★★★★★ (5 Stars)</option>
                  <option value="4">★★★★☆ (4 Stars)</option>
                  <option value="3">★★★☆☆ (3 Stars)</option>
                  <option value="2">★★☆☆☆ (2 Stars)</option>
                  <option value="1">★☆☆☆☆ (1 Star)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="new-review-date">Review Date *</label>
                <input 
                  id="new-review-date"
                  type="date" 
                  className="form-input" 
                  value={newReviewDate} 
                  onChange={e => setNewReviewDate(e.target.value)} 
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-review-text">Review Content *</label>
              <textarea 
                id="new-review-text"
                className="form-input" 
                rows={4} 
                placeholder="Write the client testimonial here..." 
                value={newReviewText} 
                onChange={e => setNewReviewText(e.target.value)} 
                style={{ fontFamily: 'inherit', resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '8px' }}>
              <button className="btn btn-outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Creating...' : 'Create Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Connect Google Business Profile Modal */}
      {showConnectModal && (
        <div className="admin-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
          <form onSubmit={handleGmbConnectSubmit} className="admin-card admin-modal-card" style={{ width: '100%', maxWidth: '480px', padding: 'var(--space-2xl)', border: '1px solid var(--color-border)', animation: 'zoomIn 0.25s ease', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '4px' }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Connect Google Business
              </h3>
              <button type="button" onClick={() => setShowConnectModal(false)} style={{ color: 'var(--color-text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {oauthStep === 'profile' && (
              <>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.5' }}>
                  Authenticated as <span style={{ color: 'white', fontWeight: 600 }}>{googleEmail}</span>. Choose the location to sync reviews.
                </p>

                <div className="form-group">
                  <label className="form-label" htmlFor="gmb-profile-location">Google Business Location *</label>
                  <select 
                    id="gmb-profile-location"
                    className="form-input" 
                    value={selectedLocationId} 
                    onChange={e => setSelectedLocationId(e.target.value)}
                  >
                    {MOCK_GMB_PROFILES.map(p => (
                      <option key={p.location_id} value={p.location_id}>
                        {p.location_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <input 
                    id="gmb-auto-approve"
                    type="checkbox" 
                    checked={autoApprove} 
                    onChange={e => setAutoApprove(e.target.checked)} 
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-champagne)' }}
                  />
                  <label htmlFor="gmb-auto-approve" style={{ fontSize: '0.82rem', color: 'white', cursor: 'pointer' }}>
                    Automatically approve imported reviews
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '8px' }}>
                  <button className="btn btn-outline" type="button" onClick={() => setShowConnectModal(false)}>Cancel</button>
                  <button className="btn btn-primary" type="submit" style={{ background: '#10b981', borderColor: '#10b981' }}>
                    Connect Profile
                  </button>
                </div>
              </>
            )}

            {oauthStep === 'connecting' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '20px', minHeight: '220px' }}>
                <Loader2 size={44} className="animate-spin" style={{ color: '#10b981' }} />
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: 'white', fontFamily: 'var(--font-serif)', fontSize: '1.15rem' }}>
                    Connecting Google Business Profile...
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Authorizing OAuth tokens securely with Google My Business API...
                  </p>
                </div>
              </div>
            )}

            {oauthStep === 'complete' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '20px', minHeight: '220px' }}>
                <div style={{ animation: 'zoomIn 0.3s ease' }}>
                  <CheckCircle2 size={48} style={{ color: '#10b981' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: 'white', fontFamily: 'var(--font-serif)', fontSize: '1.15rem' }}>
                    Google Business Connected
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Saved connected profile state securely in Supabase.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Syncing Progress Overlay */}
      {syncing && (
        <div className="admin-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '440px', padding: 'var(--space-2xl)', border: '1px solid var(--color-border)', animation: 'zoomIn 0.2s ease', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            {syncStep !== 'complete' ? (
              <Loader2 size={40} className="animate-spin" style={{ color: '#10b981' }} />
            ) : (
              <div style={{ animation: 'zoomIn 0.3s ease' }}>
                <CheckCircle2 size={44} style={{ color: '#10b981' }} />
              </div>
            )}
            <div>
              <h4 style={{ margin: '0 0 6px 0', color: 'white', fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>
                {syncStep === 'auth' && 'Authenticating GMB API...'}
                {syncStep === 'fetch' && 'Retrieving Google Business Reviews...'}
                {syncStep === 'dedup' && 'Checking for Duplicate Reviews...'}
                {syncStep === 'save' && 'Saving New Reviews to Supabase...'}
                {syncStep === 'complete' && 'Sync Complete!'}
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                {syncStep === 'auth' && 'Validating secure credentials and location connection settings...'}
                {syncStep === 'fetch' && 'Requesting ratings, dates, and review text from Google Profile...'}
                {syncStep === 'dedup' && 'Filtering fetched reviews against current database review IDs...'}
                {syncStep === 'save' && 'Writing new verified reviews to your testimonials dashboard...'}
                {syncStep === 'complete' && 'All unique customer reviews successfully synced!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification Containers */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 9999 }}>
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            style={{ 
              background: toast.type === 'success' ? '#15803d' : '#b91c1c', 
              color: 'white', 
              padding: '12px 20px', 
              borderRadius: '8px', 
              fontSize: '0.82rem',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)', 
              animation: 'slideIn 0.3s ease-out', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}
          >
            <span>{toast.type === 'success' ? '✓' : '✕'}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
