import React, { useState, useEffect } from 'react';
import { 
  MessageSquareQuote, 
  Star, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ThumbsUp, 
  HelpCircle,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../context/ToastContext';

export default function Feedback() {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    event_id: '',
    rating_content: 5,
    rating_organization: 5,
    rating_speaker: 5,
    what_liked: '',
    what_improve: '',
    comments: '',
    is_anonymous: false,
    author_name: '',
    author_email: ''
  });

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data && data.events) {
          setEvents(data.events);
          if (data.events.length > 0) {
            setFormData(prev => ({ ...prev, event_id: String(data.events[0].id) }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const StarRating = ({ value, onChange, label }) => {
    const [hover, setHover] = useState(0);

    return (
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label className="form-label" style={{ margin: 0 }}>{label}</label>
          <span style={{ color: '#FFB800', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '0.95rem' }}>
            {value} / 5 Stars
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              type="button"
              key={star}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0.3rem',
                display: 'flex',
                transition: 'transform 0.15s ease'
              }}
            >
              <Star
                size={28}
                fill={(hover || value) >= star ? '#FFB800' : 'transparent'}
                color={(hover || value) >= star ? '#FFB800' : '#475569'}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const selectedEv = events.find(ev => ev.id === parseInt(formData.event_id, 10));

      const payload = {
        event_id: formData.event_id ? parseInt(formData.event_id, 10) : null,
        event_title: selectedEv ? selectedEv.title : 'General Club Feedback',
        rating_content: formData.rating_content,
        rating_organization: formData.rating_organization,
        rating_speaker: formData.rating_speaker,
        what_liked: formData.what_liked,
        what_improve: formData.what_improve,
        comments: formData.comments,
        author_name: formData.is_anonymous ? 'Anonymous Member' : formData.author_name,
        author_email: formData.is_anonymous ? '' : formData.author_email
      };

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setSubmittedSuccess(true);
        toast.success('Feedback recorded. Thank you!');
        try {
          confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
        } catch (e) {}
      } else {
        toast.error(data.error || 'Failed to submit feedback.');
      }
    } catch (err) {
      toast.error('Network error during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page-root">
      {/* 1. Header */}
      <section className="section" style={{ padding: '4rem 0 2rem 0', textAlign: 'center' }}>
        <div className="container">
          <div className="section-badge">
            <MessageSquareQuote size={14} />
            <span>Community Voice</span>
          </div>
          <h1 className="section-title">
            Event & Session <span className="gradient-text">Feedback</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '650px', margin: '0 auto' }}>
            Your honest ratings and critiques directly shape upcoming workshops, hackathon problem statements, and speaker sessions.
          </p>
        </div>
      </section>

      {/* 2. Form Container */}
      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          {submittedSuccess ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 2rem', border: '1px solid rgba(0, 255, 157, 0.4)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0, 255, 157, 0.15)', color: '#00FF9D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>Feedback Recorded!</h2>
              <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
                Thank you for taking the time to share your review. Our organizing leads review all feedback to continually elevate NextGen events.
              </p>
              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  setFormData({
                    event_id: events[0] ? String(events[0].id) : '',
                    rating_content: 5,
                    rating_organization: 5,
                    rating_speaker: 5,
                    what_liked: '',
                    what_improve: '',
                    comments: '',
                    is_anonymous: false,
                    author_name: '',
                    author_email: ''
                  });
                }}
                className="btn btn-primary"
              >
                Submit Feedback for Another Session
              </button>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <form onSubmit={handleSubmit}>
                {/* Event Selector */}
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label">
                    Select Event or Session <span className="required">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.event_id}
                    onChange={e => setFormData({ ...formData, event_id: e.target.value })}
                  >
                    <option value="">General Club Session / Tech Talks</option>
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} ({ev.event_date})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3 Rating Scales */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '1.25rem' }}>
                    1. Session Ratings (1 to 5 Stars)
                  </h4>

                  <StarRating
                    label="Workshop / Hackathon Content & Technical Rigor"
                    value={formData.rating_content}
                    onChange={val => setFormData({ ...formData, rating_content: val })}
                  />

                  <StarRating
                    label="Event Organization, Venue, & Time Management"
                    value={formData.rating_organization}
                    onChange={val => setFormData({ ...formData, rating_organization: val })}
                  />

                  <StarRating
                    label="Mentor / Speaker Guidance & Clarity"
                    value={formData.rating_speaker}
                    onChange={val => setFormData({ ...formData, rating_speaker: val })}
                  />
                </div>

                {/* Qualitative Questions */}
                <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '1rem' }}>
                  2. Qualitative Insights
                </h4>

                <div className="form-group">
                  <label className="form-label">What did you enjoy most about this session?</label>
                  <textarea
                    className="form-textarea"
                    placeholder="e.g. Hands-on coding examples, live shader debugging on VR headsets..."
                    rows={3}
                    value={formData.what_liked}
                    onChange={e => setFormData({ ...formData, what_liked: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">What could we improve for next time?</label>
                  <textarea
                    className="form-textarea"
                    placeholder="e.g. Longer Q&A duration, pre-install guides sent earlier..."
                    rows={3}
                    value={formData.what_improve}
                    onChange={e => setFormData({ ...formData, what_improve: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Any additional topics you want us to cover?</label>
                  <textarea
                    className="form-textarea"
                    placeholder="e.g. Apple VisionOS gesture recognition, multiplayer WebSockets for VR..."
                    rows={2}
                    value={formData.comments}
                    onChange={e => setFormData({ ...formData, comments: e.target.value })}
                  />
                </div>

                {/* Identity / Anonymous Option */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#FFFFFF', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.is_anonymous}
                        onChange={e => setFormData({ ...formData, is_anonymous: e.target.checked })}
                        style={{ accentColor: '#00F0FF', width: '18px', height: '18px' }}
                      />
                      <span>Submit anonymously (Keep my identity hidden)</span>
                    </label>
                  </div>

                  {!formData.is_anonymous && (
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Your Name (Optional)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Sneha Roy"
                          value={formData.author_name}
                          onChange={e => setFormData({ ...formData, author_name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Your Email (Optional)</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="sneha.roy@college.edu"
                          value={formData.author_email}
                          onChange={e => setFormData({ ...formData, author_email: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right', marginTop: '2rem' }}>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={submitting}
                    style={{ minWidth: '200px' }}
                  >
                    {submitting ? 'Submitting Feedback...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
