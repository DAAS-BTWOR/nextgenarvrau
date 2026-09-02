import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Send, 
  AlertCircle, 
  Lock, 
  Unlock, 
  Glasses, 
  Layers, 
  Cpu, 
  Boxes, 
  Gamepad2, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../context/ToastContext';

export default function Join() {
  const toast = useToast();
  const [recruitmentStatus, setRecruitmentStatus] = useState({ is_open: true, batch_name: 'Fall 2026 Cohort' });
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    roll_no: '',
    branch: 'Computer Science & Engineering',
    year: '1st Year',
    email: '',
    phone: '',
    domains: ['AR/VR & Spatial Computing'],
    why_join: '',
    experience: '',
    portfolio_url: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch('/api/cms/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.recruitment_status) {
          setRecruitmentStatus(data.recruitment_status);
        }
      })
      .catch(() => {});
  }, []);

  const domainOptions = [
    { id: 'AR/VR & Spatial Computing', label: 'AR/VR & Spatial Computing', icon: <Glasses size={18} />, desc: 'WebXR, Unity XR, Meta Quest 3 development' },
    { id: 'Game Development', label: 'Unreal / Game Development', icon: <Layers size={18} />, desc: 'Unreal Engine 5.5, C++, gameplay shaders' },
    { id: 'AI & Spatial Intelligence', label: 'AI & Spatial Vision', icon: <Cpu size={18} />, desc: 'Gaussian Splatting, NeRFs, generative 3D ML' },
    { id: '3D Design & Worldbuilding', label: '3D Art & UI/UX Design', icon: <Boxes size={18} />, desc: 'Blender modeling, textures, spatial interface design' },
    { id: 'E-Sports Division', label: 'E-Sports League Operations', icon: <Gamepad2 size={18} />, desc: 'Competitive tactical gaming, LAN tournaments' }
  ];

  const handleDomainToggle = (domainId) => {
    setFormData(prev => {
      const exists = prev.domains.includes(domainId);
      if (exists) {
        if (prev.domains.length === 1) return prev; // Keep at least one
        return { ...prev, domains: prev.domains.filter(d => d !== domainId) };
      } else {
        return { ...prev, domains: [...prev.domains, domainId] };
      }
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.full_name.trim()) errs.full_name = 'Full name is required.';
    if (!formData.roll_no.trim()) errs.roll_no = 'Roll number / Register number is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      errs.phone = 'Please enter a valid phone number.';
    }
    if (!formData.why_join.trim()) {
      errs.why_join = 'Please tell us why you want to join.';
    } else if (formData.why_join.trim().length < 30) {
      errs.why_join = 'Please provide a slightly more detailed explanation (min 30 characters).';
    }
    if (formData.domains.length === 0) {
      errs.domains = 'Please select at least one domain of interest.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please resolve the highlighted form fields before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessData(data);
        toast.success('Application submitted successfully!');
        // Fire celebration confetti!
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      } else {
        toast.error(data.error || 'Failed to submit application.');
      }
    } catch (err) {
      toast.error('Network error while submitting application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="join-page-root">
      {/* 1. Header */}
      <section className="section" style={{ padding: '4rem 0 2rem 0', textAlign: 'center' }}>
        <div className="container">
          <div className="section-badge">
            <Sparkles size={14} />
            <span>Recruitment Portal</span>
          </div>
          <h1 className="section-title">
            Join the <span className="gradient-text">NextGen AR/VR Cohort</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '680px', margin: '0 auto' }}>
            Work on cutting-edge spatial computing projects, access dedicated VR hardware, and represent the university in national hackathons and esports tournaments.
          </p>
        </div>
      </section>

      {/* 2. Recruitment Status Banner */}
      <section className="container" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card-static" style={{
          border: recruitmentStatus.is_open ? '1px solid rgba(0, 255, 157, 0.4)' : '1px solid rgba(255, 51, 102, 0.4)',
          background: recruitmentStatus.is_open ? 'rgba(8, 30, 20, 0.6)' : 'rgba(30, 8, 15, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem 1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className={`badge ${recruitmentStatus.is_open ? 'badge-emerald' : 'badge-danger'}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              {recruitmentStatus.is_open ? <Unlock size={14} /> : <Lock size={14} />}
              {recruitmentStatus.is_open ? 'RECRUITMENT OPEN' : 'RECRUITMENT CLOSED'}
            </span>
            <span style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '1.02rem' }}>
              {recruitmentStatus.banner_message || (recruitmentStatus.is_open ? 'Applications are currently being accepted for review.' : 'Recruitment for this cycle is currently closed.')}
            </span>
          </div>
          {recruitmentStatus.is_open && recruitmentStatus.batch_name && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#00FF9D' }}>
              🎯 Batch: {recruitmentStatus.batch_name}
            </span>
          )}
        </div>
      </section>

      {/* 3. Main Content: Form or Success */}
      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          {successData ? (
            /* Success State Card */
            <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 2rem', border: '1px solid rgba(0, 255, 157, 0.4)' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(0, 255, 157, 0.15)', color: '#00FF9D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '2rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>Application Submitted!</h2>
              <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 1.75rem auto' }}>
                Thank you for applying to NextGen AR/VR! Our executive committee will review your profile and reach out via email/phone for the technical interview & orientation.
              </p>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px dashed rgba(0, 240, 255, 0.4)', borderRadius: '12px', padding: '1rem', display: 'inline-block', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.8rem', display: 'block', textTransform: 'uppercase' }}>Your Application Tracking ID</span>
                <span style={{ color: '#00F0FF', fontSize: '1.3rem', fontWeight: '700' }}>{successData.tracking_code}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                  onClick={() => {
                    setSuccessData(null);
                    setFormData({
                      full_name: '',
                      roll_no: '',
                      branch: 'Computer Science & Engineering',
                      year: '1st Year',
                      email: '',
                      phone: '',
                      domains: ['AR/VR & Spatial Computing'],
                      why_join: '',
                      experience: '',
                      portfolio_url: ''
                    });
                  }}
                  className="btn btn-secondary"
                >
                  Submit Another Response
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              {!recruitmentStatus.is_open && (
                <div style={{ background: 'rgba(255, 51, 102, 0.12)', border: '1px solid rgba(255, 51, 102, 0.3)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#FF8099' }}>
                  <AlertCircle size={20} />
                  <span>Notice: Recruitment is currently closed. Submissions submitted now will be placed in the backlog for the next cohort.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  1. Personal & Academic Credentials
                </h3>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Samar Singh"
                      value={formData.full_name}
                      onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    />
                    {errors.full_name && <span className="form-error">{errors.full_name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Roll Number / Register No. <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 24CS108"
                      value={formData.roll_no}
                      onChange={e => setFormData({ ...formData, roll_no: e.target.value })}
                    />
                    {errors.roll_no && <span className="form-error">{errors.roll_no}</span>}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Branch / Department <span className="required">*</span></label>
                    <select
                      className="form-select"
                      value={formData.branch}
                      onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Electrical & Electronics">Electrical & Electronics</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Other Department">Other Department</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Academic Year <span className="required">*</span></label>
                    <select
                      className="form-select"
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option value="1st Year">1st Year (Freshman)</option>
                      <option value="2nd Year">2nd Year (Sophomore)</option>
                      <option value="3rd Year">3rd Year (Junior)</option>
                      <option value="4th Year">4th Year (Senior)</option>
                      <option value="Postgraduate">Postgraduate / Masters</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      College / Personal Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. student@college.edu"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Phone / WhatsApp Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                </div>

                {/* 2. Technical Domain Selection */}
                <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', margin: '2rem 0 1.25rem 0', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  2. Area(s) of Interest & Specialization
                </h3>

                <div className="form-group">
                  <span style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '0.75rem', display: 'block' }}>
                    Select one or more domains you wish to contribute to:
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {domainOptions.map(domain => {
                      const isSelected = formData.domains.includes(domain.id);
                      return (
                        <div
                          key={domain.id}
                          onClick={() => handleDomainToggle(domain.id)}
                          style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            background: isSelected ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                            border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.4rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isSelected ? '#00F0FF' : '#FFFFFF', fontWeight: '600', fontSize: '0.95rem' }}>
                              {domain.icon}
                              <span>{domain.label}</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              style={{ accentColor: '#00F0FF' }}
                            />
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0 }}>{domain.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                  {errors.domains && <span className="form-error">{errors.domains}</span>}
                </div>

                {/* 3. Motivation & Experience */}
                <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', margin: '2rem 0 1.25rem 0', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  3. Motivation & Experience
                </h3>

                <div className="form-group">
                  <label className="form-label">
                    Why do you want to join NextGen AR/VR? <span className="required">*</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    placeholder="Tell us what excites you about spatial computing, VR, game dev, or esports, and what you hope to learn and build with our team..."
                    rows={4}
                    value={formData.why_join}
                    onChange={e => setFormData({ ...formData, why_join: e.target.value })}
                  />
                  {errors.why_join && <span className="form-error">{errors.why_join}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Prior Experience or Projects (Optional)
                  </label>
                  <textarea
                    className="form-textarea"
                    placeholder="Any previous experience with Unity, Unreal, Blender, Three.js, C#, competitive gaming, or video editing? (Complete beginners are also welcome!)"
                    rows={3}
                    value={formData.experience}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Portfolio / GitHub / LinkedIn / ArtStation Link (Optional)
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://github.com/your-username or https://artstation.com/your-profile"
                    value={formData.portfolio_url}
                    onChange={e => setFormData({ ...formData, portfolio_url: e.target.value })}
                  />
                </div>

                <div style={{ marginTop: '2.5rem', textAlign: 'right' }}>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={submitting}
                    style={{ minWidth: '220px' }}
                    id="submit-application-btn"
                  >
                    {submitting ? (
                      <span>Processing Application...</span>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Submit Application</span>
                      </>
                    )}
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
