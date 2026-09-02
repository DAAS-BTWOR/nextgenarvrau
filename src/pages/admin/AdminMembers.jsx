import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Download, 
  Check, 
  X, 
  ExternalLink, 
  Eye, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';

export default function AdminMembers() {
  const { token } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'members'

  // Applications state
  const [applications, setApplications] = useState([]);
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [appSearch, setAppSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  // Members state
  const [members, setMembers] = useState([]);
  const [memberDomainFilter, setMemberDomainFilter] = useState('all');
  const [memberSearch, setMemberSearch] = useState('');

  // Member CRUD Modals
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({
    full_name: '',
    roll_no: '',
    branch: 'Computer Science',
    year: '2nd Year',
    domain: 'AR/VR & Spatial Computing',
    role: 'Member',
    email: '',
    phone: '',
    bio: '',
    avatar_url: '',
    status: 'active'
  });

  const fetchApplications = () => {
    let url = `/api/applications?status=${appStatusFilter}`;
    if (appSearch.trim()) url += `&search=${encodeURIComponent(appSearch.trim())}`;

    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data && data.applications) setApplications(data.applications);
      })
      .catch(() => {});
  };

  const fetchMembers = () => {
    let url = `/api/members?domain=${memberDomainFilter}`;
    if (memberSearch.trim()) url += `&search=${encodeURIComponent(memberSearch.trim())}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.members) setMembers(data.members);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (activeTab === 'applications') fetchApplications();
    else fetchMembers();
  }, [activeTab, appStatusFilter, appSearch, memberDomainFilter, memberSearch]);

  const handleReview = async (appId, status, notes = '') => {
    try {
      const res = await fetch(`/api/applications/${appId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, review_notes: notes })
      });

      if (res.ok) {
        toast.success(`Application marked as ${status}!`);
        setSelectedApp(null);
        fetchApplications();
      } else {
        toast.error('Failed to review application.');
      }
    } catch (err) {
      toast.error('Network error during review.');
    }
  };

  const handleOpenAddMember = () => {
    setEditingMember(null);
    setMemberForm({
      full_name: '',
      roll_no: '',
      branch: 'Computer Science',
      year: '2nd Year',
      domain: 'AR/VR & Spatial Computing',
      role: 'Member',
      email: '',
      phone: '',
      bio: '',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      status: 'active'
    });
    setMemberModalOpen(true);
  };

  const handleOpenEditMember = (m) => {
    setEditingMember(m);
    setMemberForm({ ...m });
    setMemberModalOpen(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    const isEdit = !!editingMember;
    const url = isEdit ? `/api/members/${editingMember.id}` : '/api/members';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(memberForm)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(isEdit ? 'Member updated successfully!' : 'Member added successfully!');
        setMemberModalOpen(false);
        fetchMembers();
      } else {
        toast.error(data.error || 'Failed to save member.');
      }
    } catch (err) {
      toast.error('Network error saving member.');
    }
  };

  const handleDeleteMember = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from active records?`)) return;

    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success('Member removed.');
        fetchMembers();
      } else {
        toast.error('Failed to delete member.');
      }
    } catch (err) {
      toast.error('Network error deleting member.');
    }
  };

  const handleExportCsv = (type) => {
    const url = type === 'members' ? '/api/admin/export/members.csv' : '/api/admin/export/applications.csv';
    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `nextgen_${type}_export.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.success(`${type} exported to CSV!`);
      })
      .catch(() => toast.error('Failed to download CSV.'));
  };

  return (
    <div className="admin-members-root">
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>Membership & Applications</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Review candidate applications and manage official club member records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {activeTab === 'members' ? (
            <>
              <button onClick={() => handleExportCsv('members')} className="btn btn-sm btn-secondary">
                <Download size={16} />
                <span>Export Members CSV</span>
              </button>
              <button onClick={handleOpenAddMember} className="btn btn-sm btn-primary">
                <Plus size={16} />
                <span>Add Member</span>
              </button>
            </>
          ) : (
            <button onClick={() => handleExportCsv('applications')} className="btn btn-sm btn-secondary">
              <Download size={16} />
              <span>Export Applications CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="admin-tab-bar">
        <button
          onClick={() => setActiveTab('applications')}
          className={`admin-tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
        >
          <UserCheck size={18} />
          <span>Applications Review Queue</span>
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`admin-tab-btn ${activeTab === 'members' ? 'active' : ''}`}
        >
          <Users size={18} />
          <span>Active Members Directory</span>
        </button>
      </div>

      {/* TAB 1: APPLICATIONS QUEUE */}
      {activeTab === 'applications' && (
        <div>
          <div className="admin-toolbar">
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['all', 'pending', 'approved', 'rejected'].map(st => (
                <button
                  key={st}
                  onClick={() => setAppStatusFilter(st)}
                  className={`btn btn-sm ${appStatusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {st}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="text"
                placeholder="Search applicant name / roll..."
                className="form-control"
                style={{ paddingLeft: '2.3rem', height: '38px', fontSize: '0.88rem' }}
                value={appSearch}
                onChange={e => setAppSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Roll / Register</th>
                  <th>Branch & Year</th>
                  <th>Domains</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                      No applications found matching criteria.
                    </td>
                  </tr>
                ) : (
                  applications.map(app => (
                    <tr key={app.id}>
                      <td>
                        <div style={{ color: '#FFFFFF', fontWeight: '600' }}>{app.full_name}</div>
                        <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{app.email}</div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{app.roll_no}</td>
                      <td style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>{app.branch} ({app.year})</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          {(Array.isArray(app.domains) ? app.domains : [app.domains]).map((d, i) => (
                            <span key={i} className="badge badge-purple" style={{ fontSize: '0.68rem' }}>{d}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ color: '#64748B', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                        {app.submitted_at ? app.submitted_at.slice(0, 10) : 'N/A'}
                      </td>
                      <td>
                        <span className={`badge ${app.status === 'approved' ? 'badge-emerald' : app.status === 'rejected' ? 'badge-danger' : 'badge-amber'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="btn btn-sm btn-secondary"
                            style={{ padding: '0.35rem 0.65rem' }}
                            title="Inspect Details"
                          >
                            <Eye size={14} />
                          </button>
                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleReview(app.id, 'approved')}
                                className="btn btn-sm btn-primary"
                                style={{ padding: '0.35rem 0.65rem' }}
                                title="Approve Applicant"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => handleReview(app.id, 'rejected')}
                                className="btn btn-sm btn-danger"
                                style={{ padding: '0.35rem 0.65rem' }}
                                title="Reject Applicant"
                              >
                                <X size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE MEMBERS DIRECTORY */}
      {activeTab === 'members' && (
        <div>
          <div className="admin-toolbar">
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['all', 'AR/VR', 'Game Development', 'AI', '3D Design', 'E-Sports'].map(d => (
                <button
                  key={d}
                  onClick={() => setMemberDomainFilter(d)}
                  className={`btn btn-sm ${memberDomainFilter === d ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="text"
                placeholder="Search member name / roll..."
                className="form-control"
                style={{ paddingLeft: '2.3rem', height: '38px', fontSize: '0.88rem' }}
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Roll No</th>
                  <th>Role</th>
                  <th>Domain</th>
                  <th>Branch & Year</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={m.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(m.full_name)}`}
                          alt={m.full_name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ color: '#FFFFFF', fontWeight: '600' }}>{m.full_name}</div>
                          <div style={{ color: '#64748B', fontSize: '0.78rem' }}>{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{m.roll_no}</td>
                    <td style={{ color: '#D8B4FE', fontWeight: '500', fontSize: '0.85rem' }}>{m.role}</td>
                    <td style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>{m.domain}</td>
                    <td style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{m.branch} ({m.year})</td>
                    <td>
                      <span className={`badge ${m.status === 'core_team' ? 'badge-purple' : m.status === 'alumni' ? 'badge-amber' : 'badge-emerald'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenEditMember(m)}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '0.35rem 0.65rem' }}
                          title="Edit Member"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m.id, m.full_name)}
                          className="btn btn-sm btn-danger"
                          style={{ padding: '0.35rem 0.65rem' }}
                          title="Delete Member"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Application Details Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Details: ${selectedApp.full_name}`}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Roll Number</span>
              <span style={{ color: '#00F0FF', fontWeight: '700' }}>{selectedApp.roll_no}</span>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Branch & Year</span>
              <span style={{ color: '#FFFFFF' }}>{selectedApp.branch} ({selectedApp.year})</span>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Email</span>
              <span style={{ color: '#FFFFFF' }}>{selectedApp.email}</span>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Phone</span>
              <span style={{ color: '#FFFFFF' }}>{selectedApp.phone}</span>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ color: '#64748B', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Interested Domains</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(Array.isArray(selectedApp.domains) ? selectedApp.domains : [selectedApp.domains]).map((d, i) => (
                <span key={i} className="badge badge-purple">{d}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ color: '#64748B', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Why they want to join:</span>
            <p style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.9rem', borderRadius: '8px', color: '#F1F5F9', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {selectedApp.why_join}
            </p>
          </div>

          {selectedApp.experience && (
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ color: '#64748B', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Prior Experience:</span>
              <p style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.9rem', borderRadius: '8px', color: '#94A3B8', fontSize: '0.88rem' }}>
                {selectedApp.experience}
              </p>
            </div>
          )}

          {selectedApp.portfolio_url && (
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ color: '#64748B', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Portfolio / GitHub</span>
              <a href={selectedApp.portfolio_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-secondary" style={{ display: 'inline-flex', gap: '0.4rem' }}>
                <ExternalLink size={14} />
                <span>{selectedApp.portfolio_url}</span>
              </a>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <button onClick={() => setSelectedApp(null)} className="btn btn-secondary">Close</button>
            {selectedApp.status === 'pending' && (
              <>
                <button
                  onClick={() => handleReview(selectedApp.id, 'rejected')}
                  className="btn btn-danger"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleReview(selectedApp.id, 'approved')}
                  className="btn btn-primary"
                >
                  Approve & Add to Members
                </button>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Member Add/Edit Modal */}
      {memberModalOpen && (
        <Modal
          isOpen={memberModalOpen}
          onClose={() => setMemberModalOpen(false)}
          title={editingMember ? `Edit Member: ${editingMember.full_name}` : 'Add New Club Member'}
        >
          <form onSubmit={handleSaveMember}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={memberForm.full_name}
                  onChange={e => setMemberForm({ ...memberForm, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Roll Number *</label>
                <input
                  type="text"
                  className="form-control"
                  value={memberForm.roll_no}
                  onChange={e => setMemberForm({ ...memberForm, roll_no: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Role Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Lead XR Engineer / Member"
                  value={memberForm.role}
                  onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Domain</label>
                <select
                  className="form-select"
                  value={memberForm.domain}
                  onChange={e => setMemberForm({ ...memberForm, domain: e.target.value })}
                >
                  <option value="AR/VR & Spatial Computing">AR/VR & Spatial Computing</option>
                  <option value="Game Development">Game Development</option>
                  <option value="AI & Spatial Intelligence">AI & Spatial Intelligence</option>
                  <option value="3D Design & Worldbuilding">3D Design & Worldbuilding</option>
                  <option value="E-Sports Division">E-Sports Division</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  value={memberForm.email}
                  onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={memberForm.status}
                  onChange={e => setMemberForm({ ...memberForm, status: e.target.value })}
                >
                  <option value="active">Active Member</option>
                  <option value="core_team">Core Leadership Team</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bio / Profile Description</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={memberForm.bio || ''}
                onChange={e => setMemberForm({ ...memberForm, bio: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setMemberModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Member Record
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
