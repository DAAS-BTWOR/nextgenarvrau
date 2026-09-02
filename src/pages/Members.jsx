import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Github, 
  Linkedin, 
  Globe, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  Award,
  GraduationCap
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Members() {
  const toast = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const domains = [
    { id: 'all', label: 'All Domains' },
    { id: 'AR/VR', label: 'AR/VR & Spatial' },
    { id: 'Game Development', label: 'Game Dev' },
    { id: 'AI', label: 'AI / Vision' },
    { id: '3D Design', label: '3D Worldbuilding' },
    { id: 'E-Sports', label: 'E-Sports' }
  ];

  const statuses = [
    { id: 'all', label: 'All Ranks' },
    { id: 'core_team', label: 'Core Leadership' },
    { id: 'active', label: 'Active Members' },
    { id: 'alumni', label: 'Alumni' }
  ];

  const fetchMembers = () => {
    setLoading(true);
    let url = '/api/members';
    const params = [];

    if (selectedDomain !== 'all') params.push(`domain=${encodeURIComponent(selectedDomain)}`);
    if (selectedStatus !== 'all') params.push(`status=${encodeURIComponent(selectedStatus)}`);
    if (searchQuery.trim()) params.push(`search=${encodeURIComponent(searchQuery.trim())}`);

    if (params.length > 0) url += `?${params.join('&')}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.members) {
          setMembers(data.members);
        }
      })
      .catch(() => toast.error('Failed to load members directory.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, [selectedDomain, selectedStatus, searchQuery]);

  return (
    <div className="members-page-root">
      {/* 1. Header */}
      <section className="section" style={{ padding: '4rem 0 2rem 0', textAlign: 'center' }}>
        <div className="container">
          <div className="section-badge">
            <Users size={14} />
            <span>Community Directory</span>
          </div>
          <h1 className="section-title">
            NextGen <span className="gradient-text">Member Records</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '680px', margin: '0 auto' }}>
            Discover our talented engineers, researchers, artists, and esports champions across all departments and graduating batches.
          </p>
        </div>
      </section>

      {/* 2. Filter Bar */}
      <section className="container" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card-static" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top row: Search & Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', minWidth: '300px', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="text"
                placeholder="Search member name, roll number, or role..."
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {statuses.map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStatus(st.id)}
                  className={`btn btn-sm ${selectedStatus === st.id ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Domain Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8', alignSelf: 'center', marginRight: '0.5rem' }}>Domain:</span>
            {domains.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDomain(d.id)}
                className={`badge ${selectedDomain === d.id ? 'badge-cyan' : 'badge-purple'}`}
                style={{ cursor: 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: selectedDomain === d.id ? 1 : 0.6 }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Members Grid */}
      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--accent-cyan)' }}>
              <p>Loading Member Profiles...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Users size={48} style={{ color: '#64748B', margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>No members match your query</h3>
              <p style={{ color: '#94A3B8' }}>Try searching by first name, domain, or resetting the filter pills.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
              {members.map(m => {
                const isCore = m.status === 'core_team';
                const isAlumni = m.status === 'alumni';

                return (
                  <div
                    key={m.id}
                    className={`glass-card ${isCore ? 'purple-glow' : ''}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      border: isCore ? '1px solid rgba(138, 43, 226, 0.4)' : (isAlumni ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--border-glass)')
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                      <img
                        src={m.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(m.full_name)}`}
                        alt={m.full_name}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '16px',
                          objectFit: 'cover',
                          border: isCore ? '2px solid #8A2BE2' : '2px solid var(--accent-cyan)',
                          flexShrink: 0
                        }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>{m.full_name}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                          {m.roll_no}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                      <span className={`badge ${isCore ? 'badge-purple' : (isAlumni ? 'badge-amber' : 'badge-cyan')}`} style={{ fontSize: '0.72rem' }}>
                        {m.role || 'Member'}
                      </span>
                      <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                        {m.year}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#94A3B8', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
                      ⚡ {m.domain}
                    </p>

                    {m.bio && (
                      <p style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
                        {m.bio}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.9rem', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{m.branch}</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {m.github_url && (
                          <a href={m.github_url} target="_blank" rel="noreferrer" className="social-icon" style={{ width: '30px', height: '30px' }} aria-label="GitHub">
                            <Github size={14} />
                          </a>
                        )}
                        {m.linkedin_url && (
                          <a href={m.linkedin_url} target="_blank" rel="noreferrer" className="social-icon" style={{ width: '30px', height: '30px' }} aria-label="LinkedIn">
                            <Linkedin size={14} />
                          </a>
                        )}
                        {m.portfolio_url && (
                          <a href={m.portfolio_url} target="_blank" rel="noreferrer" className="social-icon" style={{ width: '30px', height: '30px' }} aria-label="Portfolio">
                            <Globe size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
