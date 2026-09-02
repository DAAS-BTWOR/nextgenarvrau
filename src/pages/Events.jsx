import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Layers, 
  Gamepad2, 
  Ticket,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';

export default function Events() {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, upcoming, past, Workshop, Hackathon, E-Sports
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registerEvent, setRegisterEvent] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [submittingReg, setSubmittingReg] = useState(false);

  const [regForm, setRegForm] = useState({
    full_name: '',
    roll_no: '',
    email: '',
    phone: '',
    branch: 'Computer Science',
    year: '2nd Year',
    is_team: false,
    team_name: '',
    team_members_info: ''
  });

  const [errors, setErrors] = useState({});

  const fetchEvents = () => {
    setLoading(true);
    let url = '/api/events';
    const params = [];

    if (activeTab === 'upcoming') params.push('type=upcoming');
    else if (activeTab === 'past') params.push('type=past');
    else if (['Workshop', 'Hackathon', 'E-Sports'].includes(activeTab)) params.push(`category=${activeTab}`);

    if (searchQuery.trim()) params.push(`search=${encodeURIComponent(searchQuery.trim())}`);

    if (params.length > 0) url += `?${params.join('&')}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.events) {
          setEvents(data.events);
        }
      })
      .catch(() => toast.error('Failed to load events.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [activeTab, searchQuery]);

  const handleOpenRegister = (event) => {
    setRegisterEvent(event);
    setRegistrationSuccess(null);
    setRegForm({
      full_name: '',
      roll_no: '',
      email: '',
      phone: '',
      branch: 'Computer Science',
      year: '2nd Year',
      is_team: event.is_team_event === 1,
      team_name: '',
      team_members_info: ''
    });
    setErrors({});
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!regForm.full_name.trim()) errs.full_name = 'Full name is required.';
    if (!regForm.roll_no.trim()) errs.roll_no = 'Roll number is required.';
    if (!regForm.email.trim()) errs.email = 'Email is required.';
    if (!regForm.phone.trim()) errs.phone = 'Phone is required.';
    if (regForm.is_team && !regForm.team_name.trim()) errs.team_name = 'Team name is required for team events.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmittingReg(true);

    try {
      const res = await fetch(`/api/events/${registerEvent.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      });

      const data = await res.json();

      if (res.ok) {
        setRegistrationSuccess(data);
        toast.success('Registration successful!');
        fetchEvents();
        try {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      } else {
        toast.error(data.error || 'Failed to complete registration.');
      }
    } catch (err) {
      toast.error('Network error during event registration.');
    } finally {
      setSubmittingReg(false);
    }
  };

  return (
    <div className="events-page-root">
      {/* 1. Header */}
      <section className="section" style={{ padding: '4rem 0 2rem 0', textAlign: 'center' }}>
        <div className="container">
          <div className="section-badge">
            <Calendar size={14} />
            <span>Club Calendar</span>
          </div>
          <h1 className="section-title">
            Hackathons, Workshops & <span className="gradient-text">Gaming Tournaments</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '680px', margin: '0 auto' }}>
            Level up your engineering skills in hands-on bootcamps, compete in 36-hour hackathons, or showcase your esports dominance.
          </p>
        </div>
      </section>

      {/* 2. Filter Tabs & Search */}
      <section className="container" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Events' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'Workshop', label: 'Workshops' },
              { id: 'Hackathon', label: 'Hackathons' },
              { id: 'E-Sports', label: 'E-Sports' },
              { id: 'past', label: 'Archive / Past' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search event title, venue..."
              className="form-control"
              style={{ paddingLeft: '2.4rem', height: '40px' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 3. Event Cards Grid */}
      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--accent-cyan)' }}>
              <div className="animate-pulse-glow" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #00F0FF', borderTopColor: 'transparent', margin: '0 auto 1rem auto', animation: 'spin 1s linear infinite' }} />
              <p>Loading NextGen Events Calendar...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Calendar size={48} style={{ color: '#64748B', margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>No events found</h3>
              <p style={{ color: '#94A3B8' }}>Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
              {events.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-poster-box">
                    <img src={event.poster_url} alt={event.title} className="event-poster-img" />
                    <span className="badge badge-cyan event-category-badge">{event.category}</span>
                  </div>

                  <div className="event-body">
                    <div className="event-meta-row">
                      <span className="event-meta-item"><Calendar size={14} /> {event.event_date}</span>
                      <span className="event-meta-item"><Clock size={14} /> {event.event_time}</span>
                    </div>

                    <h3 className="event-title">{event.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                      📍 {event.venue}
                    </p>
                    <p className="event-desc-snippet">{event.description.slice(0, 120)}...</p>

                    {/* Tags */}
                    {event.tags && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                        {(Array.isArray(event.tags) ? event.tags : JSON.parse(event.tags || '[]')).map((tag, idx) => (
                          <span key={idx} className="badge badge-purple" style={{ fontSize: '0.7rem' }}>{tag}</span>
                        ))}
                      </div>
                    )}

                    <div className="event-footer">
                      <div className="event-spots-info">
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                          {event.is_full ? 'Event Full' : `${event.spots_remaining} of ${event.max_seats} spots left`}
                        </span>
                        <div className="spots-bar-bg">
                          <div
                            className="spots-bar-fill"
                            style={{
                              width: `${Math.min(100, Math.max(8, ((event.total_registrants || 0) / (event.max_seats || 100)) * 100))}%`,
                              background: event.is_full ? '#FF3366' : 'var(--accent-cyan)'
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="btn btn-sm btn-secondary"
                        >
                          Details
                        </button>
                        {event.is_registration_open === 1 && !event.is_full && (
                          <button
                            onClick={() => handleOpenRegister(event)}
                            className="btn btn-sm btn-primary"
                          >
                            Register
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Event Details Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
          maxWidth="700px"
        >
          <img
            src={selectedEvent.poster_url}
            alt={selectedEvent.title}
            style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }}
          />
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span className="badge badge-cyan">{selectedEvent.category}</span>
            <span className="badge badge-purple">{selectedEvent.is_team_event ? `Team Event (Up to ${selectedEvent.max_team_size || 4})` : 'Solo Event'}</span>
            <span className="badge badge-emerald">{selectedEvent.spots_remaining} Spots Available</span>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
            <p style={{ color: '#F1F5F9', marginBottom: '0.3rem' }}>📅 Date & Time: {selectedEvent.event_date} | {selectedEvent.event_time}</p>
            <p style={{ color: '#00F0FF' }}>📍 Venue: {selectedEvent.venue}</p>
          </div>

          <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>About this Session</h4>
          <p style={{ color: '#94A3B8', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            {selectedEvent.description}
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button onClick={() => setSelectedEvent(null)} className="btn btn-secondary">Close</button>
            {selectedEvent.is_registration_open === 1 && !selectedEvent.is_full && (
              <button
                onClick={() => {
                  const ev = selectedEvent;
                  setSelectedEvent(null);
                  handleOpenRegister(ev);
                }}
                className="btn btn-primary"
              >
                Proceed to Register
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* 5. Registration Modal */}
      {registerEvent && (
        <Modal
          isOpen={!!registerEvent}
          onClose={() => setRegisterEvent(null)}
          title={`Register: ${registerEvent.title}`}
          maxWidth="640px"
        >
          {registrationSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0, 255, 157, 0.15)', color: '#00FF9D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>You're Registered!</h3>
              <p style={{ color: '#94A3B8', marginBottom: '1.5rem' }}>
                Your pass has been generated. Show your Ticket ID at the venue desk on event day.
              </p>
              <div style={{ background: 'rgba(0, 240, 255, 0.08)', border: '1px dashed var(--accent-cyan)', padding: '1rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.75rem', display: 'block' }}>EVENT PASS TICKET CODE</span>
                <span style={{ color: '#00F0FF', fontSize: '1.4rem', fontWeight: '800' }}>{registrationSuccess.ticket_id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => setRegisterEvent(null)} className="btn btn-primary">Done</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Diya Sen"
                    value={regForm.full_name}
                    onChange={e => setRegForm({ ...regForm, full_name: e.target.value })}
                  />
                  {errors.full_name && <span className="form-error">{errors.full_name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Roll Number <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 23IT044"
                    value={regForm.roll_no}
                    onChange={e => setRegForm({ ...regForm, roll_no: e.target.value })}
                  />
                  {errors.roll_no && <span className="form-error">{errors.roll_no}</span>}
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="student@college.edu"
                    value={regForm.email}
                    onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={regForm.phone}
                    onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>

              {/* Team Registration Mode */}
              {registerEvent.is_team_event === 1 && (
                <div style={{ background: 'rgba(138, 43, 226, 0.08)', border: '1px solid rgba(138, 43, 226, 0.3)', borderRadius: '12px', padding: '1.25rem', margin: '1rem 0' }}>
                  <h4 style={{ fontSize: '1rem', color: '#D8B4FE', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} /> Team Registration Details (Max {registerEvent.max_team_size || 4} Members)
                  </h4>
                  <div className="form-group">
                    <label className="form-label">Team Name <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Nexus VR Squad"
                      value={regForm.team_name}
                      onChange={e => setRegForm({ ...regForm, team_name: e.target.value })}
                    />
                    {errors.team_name && <span className="form-error">{errors.team_name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Teammates Roll Numbers / Names</label>
                    <textarea
                      className="form-textarea"
                      placeholder="1. Member 2 (Name, Roll No)&#10;2. Member 3 (Name, Roll No)..."
                      rows={2}
                      value={regForm.team_members_info}
                      onChange={e => setRegForm({ ...regForm, team_members_info: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setRegisterEvent(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submittingReg} className="btn btn-primary">
                  {submittingReg ? 'Confirming Registration...' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
