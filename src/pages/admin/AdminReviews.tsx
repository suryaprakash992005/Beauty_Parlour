import { useState, useEffect } from 'react';
import { 
  Star, Search, Filter, ArrowUpDown, Trash2, CheckCircle2, EyeOff, Plus, X, AlertTriangle, Sparkles, Calendar 
} from 'lucide-react';
import { getReviews, updateReviewStatus, deleteReview, addReview } from '../../services/reviews';
import type { ReviewItem } from '../../services/reviews';

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

  // Delete Confirmation States
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    fetchReviewsList();
  }, []);

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
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)' }}>
        <div>
          <h2 className="admin-page-title">Reviews Management</h2>
          <p className="admin-page-desc">Moderate client testimonials imported from Google or added manually to showcase on the site.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Review
        </button>
      </div>

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
          No reviews matched your filters.
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
                  <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>Google Import</span>
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
