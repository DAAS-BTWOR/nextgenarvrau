import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Gamepad2, 
  MessageSquareQuote, 
  Sparkles, 
  ArrowRight, 
  Check, 
  X, 
  Clock, 
  ShieldAlert, 
  Layers,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboard() {
  const { token } = useAuth();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = () => {
    setLoading(true);
    fetch('/api/cms/dashboard-stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(resData => {
        if (resData) setData(resData);
      })
      .catch(() => toast.error('Failed to load dashboard metrics.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [token]);

  const handleReviewApp = async (appId, status) => {
    try {
      const res = await fetch(`/api/applications/${appId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          review_notes: `Quick action reviewed from dashboard.`
        })
      });

      if (res.ok) {
        toast.success(`Application marked as ${status}!`);
        fetchDashboardStats();
      } else {
        toast.error('Failed to update application status.');
      }
    } catch (err) {
      toast.error('Network error updating application.');
    }
  };

  if (loading || !data) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--accent-cyan)' }}>
        <p>Loading Dashboard Analytics...</p>
      </div>
    );
  }

  const { metrics, recentApps, recentFeedback, auditLogs } = data;

  return (
    <div className="admin-dashboard-root">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#FFFFFF', marginBottom: '0.25rem' }}>Dashboard Overview</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem' }}>
            Real-time club health, pending applicant queues, and tournament operations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/events" className="btn btn-sm btn-primary">
            <PlusCircle size={16} />
            <span>Create Event</span>
          </Link>
          <Link to="/admin/members" className="btn btn-sm btn-secondary">
            <UserCheck size={16} />
            <span>Review Applications ({metrics.pendingApplications})</span>
          </Link>
        </div>
      </div>

      {/* 1. Metrics Grid */}
      <div className="admin-metrics-grid">
        <div className="metric-card">
          <div>
            <span className="metric-label">Active Members</span>
            <div className="metric-value">{metrics.activeMembers}</div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Total: {metrics.totalMembers} in records</span>
          </div>
          <div className="metric-icon-box">
            <Users size={22} />
          </div>
        </div>

        <div className="metric-card purple">
          <div>
            <span className="metric-label">Pending Applications</span>
            <div className="metric-value" style={{ color: metrics.pendingApplications > 0 ? '#FFB800' : '#FFFFFF' }}>
              {metrics.pendingApplications}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Requires Core Review</span>
          </div>
          <div className="metric-icon-box">
            <UserCheck size={22} />
          </div>
        </div>

        <div className="metric-card emerald">
          <div>
            <span className="metric-label">Upcoming Events</span>
            <div className="metric-value">{metrics.upcomingEvents}</div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{metrics.totalRegistrations} total registrants</span>
          </div>
          <div className="metric-icon-box">
            <Calendar size={22} />
          </div>
        </div>

        <div className="metric-card magenta">
          <div>
            <span className="metric-label">Feedback Avg Score</span>
            <div className="metric-value" style={{ color: '#FF007A' }}>
              {metrics.avgFeedback > 0 ? `${metrics.avgFeedback} ★` : 'N/A'}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>From {metrics.totalFeedback} reviews</span>
          </div>
          <div className="metric-icon-box">
            <MessageSquareQuote size={22} />
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Pending Applicants + Recent Feedback */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Pending Applications Box */}
        <div className="glass-card-static">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>Recent Member Applications</h3>
            <Link to="/admin/members" className="btn btn-sm btn-secondary">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentApps.length === 0 ? (
            <p style={{ color: '#64748B', textAlign: 'center', padding: '2rem 0' }}>No pending applications</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentApps.map(app => (
                <div
                  key={app.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                      <span style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '0.98rem' }}>{app.full_name}</span>
                      <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{app.roll_no}</span>
                      <span className={`badge ${app.status === 'approved' ? 'badge-emerald' : app.status === 'rejected' ? 'badge-danger' : 'badge-amber'}`} style={{ fontSize: '0.7rem' }}>
                        {app.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: 0 }}>
                      {app.branch} ({app.year}) • {Array.isArray(app.domains) ? app.domains.join(', ') : app.domains}
                    </p>
                  </div>

                  {app.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleReviewApp(app.id, 'approved')}
                        className="btn btn-sm btn-primary"
                        title="Approve & Add to Members"
                        style={{ padding: '0.4rem 0.6rem' }}
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleReviewApp(app.id, 'rejected')}
                        className="btn btn-sm btn-danger"
                        title="Reject Application"
                        style={{ padding: '0.4rem 0.6rem' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Feedback Feed */}
        <div className="glass-card-static">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>Recent Feedback Ratings</h3>
            <Link to="/admin/feedback" className="btn btn-sm btn-secondary">
              <span>All ({metrics.totalFeedback})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentFeedback.length === 0 ? (
            <p style={{ color: '#64748B', textAlign: 'center', padding: '2rem 0' }}>No feedback submissions yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentFeedback.map(fb => {
                const avg = ((fb.rating_content + fb.rating_organization + fb.rating_speaker) / 3).toFixed(1);
                return (
                  <div
                    key={fb.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '0.9rem 1.1rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '0.9rem' }}>{fb.event_title}</span>
                      <span style={{ color: '#FFB800', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '0.85rem' }}>
                        ★ {avg}
                      </span>
                    </div>
                    {fb.what_liked && (
                      <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: 0, fontStyle: 'italic' }}>
                        "{fb.what_liked.slice(0, 75)}..."
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. System Audit Log Stream */}
      <div className="glass-card-static">
        <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} className="text-cyan" /> System Activity & Audit Trail
        </h3>
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Operator</th>
                <th>Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.slice(0, 6).map(log => (
                <tr key={log.id}>
                  <td>
                    <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>{log.action}</span>
                  </td>
                  <td style={{ color: '#00F0FF', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{log.admin_user}</td>
                  <td style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}</td>
                  <td style={{ color: '#64748B', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{log.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
