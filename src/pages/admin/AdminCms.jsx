import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Save, 
  Lock, 
  Unlock, 
  Bell, 
  TrendingUp, 
  MapPin, 
  KeyRound, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminCms() {
  const { token } = useAuth();
  const toast = useToast();

  const [settings, setSettings] = useState({
    recruitment_status: { is_open: true, batch_name: 'Fall 2026 Cohort', banner_message: '🚀 Fall 2026 Recruitment is LIVE!' },
    announcement_banner: { active: true, title: 'Meta XR Hackathon Registrations Open!', link: '/events', badge: 'NEW' },
    club_stats: { members_count: '250+', projects_count: '24+', events_hosted: '50+', esports_pool_won: '$15,000+' },
    contact_info: { email: 'contact@nextgenarvr.club', lab_location: 'Room 402, Technology Block A', discord: 'https://discord.gg/nextgen-arvr', instagram: '', linkedin: '', github: '' }
  });

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [auditLogs, setAuditLogs] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchSettings = () => {
    fetch('/api/cms/settings')
      .then(res => res.json())
      .then(data => {
        if (data) setSettings(prev => ({ ...prev, ...data }));
      })
      .catch(() => {});

    fetch('/api/cms/audit-logs', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data && data.logs) setAuditLogs(data.logs);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSection = async (key, val) => {
    setSaving(true);
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key, value: val })
      });

      if (res.ok) {
        toast.success(`Updated ${key} settings!`);
        fetchSettings();
      } else {
        toast.error('Failed to update settings.');
      }
    } catch (err) {
      toast.error('Network error updating settings.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordForm)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Admin password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '' });
      } else {
        toast.error(data.error || 'Failed to update password.');
      }
    } catch (err) {
      toast.error('Network error changing password.');
    }
  };

  return (
    <div className="admin-cms-root">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>Site CMS & Content Controls</h1>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
          Dynamically toggle recruitment, edit announcements, update stats, and manage admin credentials without modifying code.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* 1. Recruitment Status Controls */}
        <div className="glass-card-static">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {settings.recruitment_status.is_open ? <Unlock className="text-emerald" size={20} /> : <Lock className="text-danger" size={20} />}
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>Club Recruitment Controls</h3>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#FFFFFF', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.recruitment_status.is_open}
                onChange={e => setSettings({
                  ...settings,
                  recruitment_status: { ...settings.recruitment_status, is_open: e.target.checked }
                })}
                style={{ accentColor: '#00FF9D', width: '20px', height: '20px' }}
              />
              <span style={{ fontWeight: '600' }}>Accepting New Member Applications (Status: {settings.recruitment_status.is_open ? 'OPEN' : 'CLOSED'})</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Cohort / Batch Name</label>
            <input
              type="text"
              className="form-control"
              value={settings.recruitment_status.batch_name || ''}
              onChange={e => setSettings({
                ...settings,
                recruitment_status: { ...settings.recruitment_status, batch_name: e.target.value }
              })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Public Recruitment Banner Message</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={settings.recruitment_status.banner_message || ''}
              onChange={e => setSettings({
                ...settings,
                recruitment_status: { ...settings.recruitment_status, banner_message: e.target.value }
              })}
            />
          </div>

          <button
            onClick={() => handleSaveSection('recruitment_status', settings.recruitment_status)}
            disabled={saving}
            className="btn btn-primary btn-sm"
            style={{ marginTop: '0.5rem' }}
          >
            <Save size={14} />
            <span>Publish Recruitment Settings</span>
          </button>
        </div>

        {/* 2. Homepage Announcement Ribbon */}
        <div className="glass-card-static">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Bell className="text-cyan" size={20} />
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>Homepage Ribbon Banner</h3>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#FFFFFF', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.announcement_banner?.active}
                onChange={e => setSettings({
                  ...settings,
                  announcement_banner: { ...settings.announcement_banner, active: e.target.checked }
                })}
                style={{ accentColor: '#00F0FF', width: '20px', height: '20px' }}
              />
              <span>Display Announcement Ribbon on Homepage</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Announcement Title</label>
            <input
              type="text"
              className="form-control"
              value={settings.announcement_banner?.title || ''}
              onChange={e => setSettings({
                ...settings,
                announcement_banner: { ...settings.announcement_banner, title: e.target.value }
              })}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Badge Label</label>
              <input
                type="text"
                className="form-control"
                value={settings.announcement_banner?.badge || ''}
                onChange={e => setSettings({
                  ...settings,
                  announcement_banner: { ...settings.announcement_banner, badge: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Target Link</label>
              <input
                type="text"
                className="form-control"
                value={settings.announcement_banner?.link || ''}
                onChange={e => setSettings({
                  ...settings,
                  announcement_banner: { ...settings.announcement_banner, link: e.target.value }
                })}
              />
            </div>
          </div>

          <button
            onClick={() => handleSaveSection('announcement_banner', settings.announcement_banner)}
            disabled={saving}
            className="btn btn-primary btn-sm"
            style={{ marginTop: '0.5rem' }}
          >
            <Save size={14} />
            <span>Update Banner</span>
          </button>
        </div>

        {/* 3. Club Stats Counters */}
        <div className="glass-card-static">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <TrendingUp className="text-purple" size={20} />
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>Club Impact Counters</h3>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Active Members</label>
              <input
                type="text"
                className="form-control"
                value={settings.club_stats?.members_count || ''}
                onChange={e => setSettings({
                  ...settings,
                  club_stats: { ...settings.club_stats, members_count: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">XR & Game Projects</label>
              <input
                type="text"
                className="form-control"
                value={settings.club_stats?.projects_count || ''}
                onChange={e => setSettings({
                  ...settings,
                  club_stats: { ...settings.club_stats, projects_count: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Events Hosted</label>
              <input
                type="text"
                className="form-control"
                value={settings.club_stats?.events_hosted || ''}
                onChange={e => setSettings({
                  ...settings,
                  club_stats: { ...settings.club_stats, events_hosted: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Esports Pool Won</label>
              <input
                type="text"
                className="form-control"
                value={settings.club_stats?.esports_pool_won || ''}
                onChange={e => setSettings({
                  ...settings,
                  club_stats: { ...settings.club_stats, esports_pool_won: e.target.value }
                })}
              />
            </div>
          </div>

          <button
            onClick={() => handleSaveSection('club_stats', settings.club_stats)}
            disabled={saving}
            className="btn btn-primary btn-sm"
            style={{ marginTop: '0.5rem' }}
          >
            <Save size={14} />
            <span>Save Stats</span>
          </button>
        </div>

        {/* 4. Security Password Changer */}
        <div className="glass-card-static">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <KeyRound className="text-cyan" size={20} />
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>Admin Security Credentials</h3>
          </div>

          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password (Min 6 chars)</label>
              <input
                type="password"
                className="form-control"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>
              <ShieldCheck size={14} />
              <span>Update Password</span>
            </button>
          </form>
        </div>
      </div>

      {/* 5. Complete Audit Logs Table */}
      <div className="glass-card-static" style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} className="text-cyan" /> Complete Audit Trail Records
        </h3>
        <div className="table-wrapper" style={{ maxHeight: '320px', overflowY: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Admin Operator</th>
                <th>Payload / Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id}>
                  <td>
                    <span className="badge badge-purple">{log.action}</span>
                  </td>
                  <td style={{ color: '#00F0FF', fontFamily: 'var(--font-mono)' }}>{log.admin_user}</td>
                  <td style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                    {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                  </td>
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
