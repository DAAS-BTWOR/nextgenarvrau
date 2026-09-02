import React, { useState, useEffect } from 'react';
import { 
  MessageSquareQuote, 
  Star, 
  Download, 
  Filter, 
  Sparkles, 
  TrendingUp, 
  Users,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminFeedback() {
  const { token } = useAuth();
  const toast = useToast();

  const [feedbackList, setFeedbackList] = useState([]);
  const [stats, setStats] = useState({ total_responses: 0, overall_avg: 0, avg_content: 0, avg_organization: 0, avg_speaker: 0, distribution: {} });
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data && data.events) setEvents(data.events);
      })
      .catch(() => {});
  }, []);

  const fetchFeedback = () => {
    setLoading(true);
    let url = '/api/feedback';
    if (selectedEventId !== 'all') url += `?event_id=${selectedEventId}`;

    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setFeedbackList(data.feedback || []);
          setStats(data.stats || {});
        }
      })
      .catch(() => toast.error('Failed to load feedback data.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFeedback();
  }, [selectedEventId]);

  const handleExportCsv = () => {
    fetch('/api/admin/export/feedback.csv', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nextgen_event_feedback.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.success('Feedback exported to CSV!');
      })
      .catch(() => toast.error('Failed to export feedback.'));
  };

  return (
    <div className="admin-feedback-root">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>Event & Session Feedback</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Analyze attendee satisfaction, rating averages, and qualitative feedback.
          </p>
        </div>

        <button onClick={handleExportCsv} className="btn btn-secondary">
          <Download size={16} />
          <span>Export Feedback CSV</span>
        </button>
      </div>

      {/* Aggregate Score Cards */}
      <div className="admin-metrics-grid" style={{ marginBottom: '2rem' }}>
        <div className="metric-card">
          <div>
            <span className="metric-label">Overall Rating</span>
            <div className="metric-value" style={{ color: '#FFB800' }}>
              {stats.overall_avg ? `${stats.overall_avg} ★` : 'N/A'}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Total: {stats.total_responses} reviews</span>
          </div>
          <div className="metric-icon-box">
            <Star size={22} color="#FFB800" />
          </div>
        </div>

        <div className="metric-card purple">
          <div>
            <span className="metric-label">Content Rigor</span>
            <div className="metric-value" style={{ color: '#D8B4FE' }}>
              {stats.avg_content ? `${stats.avg_content} / 5` : 'N/A'}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Technical Depth</span>
          </div>
          <div className="metric-icon-box">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="metric-card emerald">
          <div>
            <span className="metric-label">Organization</span>
            <div className="metric-value" style={{ color: '#00FF9D' }}>
              {stats.avg_organization ? `${stats.avg_organization} / 5` : 'N/A'}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Time & Venue</span>
          </div>
          <div className="metric-icon-box">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="metric-card magenta">
          <div>
            <span className="metric-label">Speaker Mentorship</span>
            <div className="metric-value" style={{ color: '#FF007A' }}>
              {stats.avg_speaker ? `${stats.avg_speaker} / 5` : 'N/A'}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Guidance & Clarity</span>
          </div>
          <div className="metric-icon-box">
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card-static" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} className="text-cyan" />
          <span style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: '600' }}>Filter by Event:</span>
        </div>
        <select
          className="form-select"
          style={{ maxWidth: '380px' }}
          value={selectedEventId}
          onChange={e => setSelectedEventId(e.target.value)}
        >
          <option value="all">All Events & Sessions ({stats.total_responses})</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.title}</option>
          ))}
        </select>
      </div>

      {/* Feedback Entries List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {feedbackList.length === 0 ? (
          <div className="glass-card-static" style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
            No feedback entries found for this selection.
          </div>
        ) : (
          feedbackList.map(fb => {
            const avg = ((fb.rating_content + fb.rating_organization + fb.rating_speaker) / 3).toFixed(1);
            return (
              <div key={fb.id} className="glass-card-static">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '0.25rem' }}>{fb.event_title}</h4>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                      Submitted by: <strong style={{ color: '#CBD5E1' }}>{fb.author_name}</strong> {fb.author_email ? `(${fb.author_email})` : ''} • {fb.submitted_at?.slice(0, 16)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255, 184, 0, 0.12)', border: '1px solid rgba(255, 184, 0, 0.3)', borderRadius: '8px', padding: '0.35rem 0.75rem', color: '#FFB800', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '0.9rem' }}>
                      ★ {avg} Avg
                    </div>
                  </div>
                </div>

                {/* Score breakdown pills */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span className="badge badge-cyan">Content: {fb.rating_content}/5 ★</span>
                  <span className="badge badge-emerald">Organization: {fb.rating_organization}/5 ★</span>
                  <span className="badge badge-purple">Speaker: {fb.rating_speaker}/5 ★</span>
                </div>

                {/* Qualitative details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '10px' }}>
                  {fb.what_liked && (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#00FF9D', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.2rem' }}>What Worked Well</span>
                      <p style={{ color: '#CBD5E1', fontSize: '0.88rem', margin: 0 }}>{fb.what_liked}</p>
                    </div>
                  )}

                  {fb.what_improve && (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#FFB800', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.2rem' }}>Areas to Improve</span>
                      <p style={{ color: '#CBD5E1', fontSize: '0.88rem', margin: 0 }}>{fb.what_improve}</p>
                    </div>
                  )}

                  {fb.comments && (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#00F0FF', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.2rem' }}>Open Comments</span>
                      <p style={{ color: '#CBD5E1', fontSize: '0.88rem', margin: 0 }}>{fb.comments}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
