import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Download, 
  Clock, 
  MapPin, 
  CheckCircle, 
  XCircle,
  Eye,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';

export default function AdminEvents() {
  const { token } = useAuth();
  const toast = useToast();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Workshop',
    event_date: '',
    event_time: '02:00 PM - 05:00 PM',
    venue: '',
    description: '',
    poster_url: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=800',
    is_registration_open: true,
    max_seats: 100,
    is_team_event: false,
    max_team_size: 4,
    tags: 'AR/VR, NextGen'
  });

  // Registrants viewer modal
  const [selectedEventRegistrants, setSelectedEventRegistrants] = useState(null);
  const [registrantsList, setRegistrantsList] = useState([]);
  const [loadingRegistrants, setLoadingRegistrants] = useState(false);

  const fetchEvents = () => {
    setLoading(true);
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data && data.events) setEvents(data.events);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      category: 'Workshop',
      event_date: new Date().toISOString().split('T')[0],
      event_time: '02:00 PM - 05:00 PM',
      venue: 'Room 402, Spatial VR Lab',
      description: '',
      poster_url: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=800',
      is_registration_open: true,
      max_seats: 100,
      is_team_event: false,
      max_team_size: 4,
      tags: 'AR/VR, Hands-on'
    });
    setEventModalOpen(true);
  };

  const handleOpenEdit = (ev) => {
    setEditingEvent(ev);
    setEventForm({
      ...ev,
      is_registration_open: ev.is_registration_open === 1,
      is_team_event: ev.is_team_event === 1,
      tags: Array.isArray(ev.tags) ? ev.tags.join(', ') : (ev.tags || '')
    });
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const isEdit = !!editingEvent;
    const url = isEdit ? `/api/events/${editingEvent.id}` : '/api/events';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventForm)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(isEdit ? 'Event updated successfully!' : 'Event created successfully!');
        setEventModalOpen(false);
        fetchEvents();
      } else {
        toast.error(data.error || 'Failed to save event.');
      }
    } catch (err) {
      toast.error('Network error saving event.');
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"?`)) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success('Event deleted.');
        fetchEvents();
      } else {
        toast.error('Failed to delete event.');
      }
    } catch (err) {
      toast.error('Network error deleting event.');
    }
  };

  const handleToggleRegistration = async (ev) => {
    const newStatus = ev.is_registration_open === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/events/${ev.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_registration_open: newStatus })
      });

      if (res.ok) {
        toast.success(`Registration ${newStatus === 1 ? 'Opened' : 'Closed'} for ${ev.title}`);
        fetchEvents();
      }
    } catch (err) {
      toast.error('Failed to toggle registration.');
    }
  };

  const handleViewRegistrants = (ev) => {
    setSelectedEventRegistrants(ev);
    setLoadingRegistrants(true);
    fetch(`/api/events/${ev.id}/registrants`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.registrants) setRegistrantsList(data.registrants);
      })
      .catch(() => toast.error('Failed to load registrants.'))
      .finally(() => setLoadingRegistrants(false));
  };

  const handleExportRegistrants = (evId, title) => {
    fetch(`/api/admin/export/registrants/${evId}.csv`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registrants_${title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.success('Registrant list exported to CSV!');
      })
      .catch(() => toast.error('Failed to export registrants.'));
  };

  return (
    <div className="admin-events-root">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>Events & Registrations</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Publish workshops, manage seat quotas, view attendees, and export CSV rosters.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Events Table */}
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Category</th>
              <th>Date & Time</th>
              <th>Venue</th>
              <th>Registrations</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(ev => {
              const isOpen = ev.is_registration_open === 1;
              return (
                <tr key={ev.id}>
                  <td>
                    <div style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '0.95rem' }}>{ev.title}</div>
                    <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{ev.slug}</div>
                  </td>
                  <td>
                    <span className="badge badge-purple">{ev.category}</span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                    <div>{ev.event_date}</div>
                    <div style={{ color: '#64748B', fontSize: '0.78rem' }}>{ev.event_time}</div>
                  </td>
                  <td style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>{ev.venue}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                        {ev.total_registrants || 0} / {ev.max_seats || 100}
                      </span>
                      <button
                        onClick={() => handleViewRegistrants(ev)}
                        className="btn btn-sm btn-secondary"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <Users size={12} /> View
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleRegistration(ev)}
                      className={`badge ${isOpen ? 'badge-emerald' : 'badge-danger'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle registration status"
                    >
                      {isOpen ? 'Registration Open' : 'Closed'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleOpenEdit(ev)}
                        className="btn btn-sm btn-secondary"
                        style={{ padding: '0.35rem 0.65rem' }}
                        title="Edit Event"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.id, ev.title)}
                        className="btn btn-sm btn-danger"
                        style={{ padding: '0.35rem 0.65rem' }}
                        title="Delete Event"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {eventModalOpen && (
        <Modal
          isOpen={eventModalOpen}
          onClose={() => setEventModalOpen(false)}
          title={editingEvent ? `Edit Event: ${editingEvent.title}` : 'Create New Club Event'}
          maxWidth="680px"
        >
          <form onSubmit={handleSaveEvent}>
            <div className="form-group">
              <label className="form-label">Event Title *</label>
              <input
                type="text"
                className="form-control"
                value={eventForm.title}
                onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={eventForm.category}
                  onChange={e => setEventForm({ ...eventForm, category: e.target.value })}
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="E-Sports">E-Sports Championship</option>
                  <option value="Game Jam">Game Jam</option>
                  <option value="Guest Lecture">Guest Lecture</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Max Seating Capacity</label>
                <input
                  type="number"
                  className="form-control"
                  value={eventForm.max_seats}
                  onChange={e => setEventForm({ ...eventForm, max_seats: parseInt(e.target.value, 10) })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Event Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={eventForm.event_date}
                  onChange={e => setEventForm({ ...eventForm, event_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Event Time</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="02:00 PM - 05:30 PM"
                  value={eventForm.event_time}
                  onChange={e => setEventForm({ ...eventForm, event_time: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Venue Location *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Spatial Computing Lab 402 or Main Auditorium"
                value={eventForm.venue}
                onChange={e => setEventForm({ ...eventForm, venue: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Poster Image URL</label>
              <input
                type="url"
                className="form-control"
                value={eventForm.poster_url}
                onChange={e => setEventForm({ ...eventForm, poster_url: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description *</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={eventForm.description}
                onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="WebXR, Unity, Oculus, Beginners"
                value={eventForm.tags}
                onChange={e => setEventForm({ ...eventForm, tags: e.target.value })}
              />
            </div>

            <div className="form-grid-2" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFFFFF', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={eventForm.is_registration_open}
                  onChange={e => setEventForm({ ...eventForm, is_registration_open: e.target.checked })}
                  style={{ accentColor: '#00F0FF', width: '18px', height: '18px' }}
                />
                <span>Registration Open</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFFFFF', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={eventForm.is_team_event}
                  onChange={e => setEventForm({ ...eventForm, is_team_event: e.target.checked })}
                  style={{ accentColor: '#8A2BE2', width: '18px', height: '18px' }}
                />
                <span>Enable Team Registration Mode</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
              <button type="button" onClick={() => setEventModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Event
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Registrants Viewer Drawer / Modal */}
      {selectedEventRegistrants && (
        <Modal
          isOpen={!!selectedEventRegistrants}
          onClose={() => setSelectedEventRegistrants(null)}
          title={`Registrants: ${selectedEventRegistrants.title}`}
          maxWidth="750px"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              Total Registered: <strong style={{ color: '#00F0FF' }}>{registrantsList.length}</strong> attendees
            </span>
            <button
              onClick={() => handleExportRegistrants(selectedEventRegistrants.id, selectedEventRegistrants.title)}
              className="btn btn-sm btn-secondary"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="table-wrapper" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Attendee Name</th>
                  <th>Roll No</th>
                  <th>Email & Phone</th>
                  <th>Type</th>
                  <th>Team Info</th>
                </tr>
              </thead>
              <tbody>
                {loadingRegistrants ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading registrants...</td></tr>
                ) : registrantsList.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>No registrants yet for this event.</td></tr>
                ) : (
                  registrantsList.map(r => (
                    <tr key={r.id}>
                      <td style={{ color: '#FFFFFF', fontWeight: '600' }}>{r.full_name}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{r.roll_no}</td>
                      <td style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                        <div>{r.email}</div>
                        <div>{r.phone}</div>
                      </td>
                      <td>
                        <span className={`badge ${r.is_team ? 'badge-purple' : 'badge-cyan'}`}>
                          {r.is_team ? 'Team' : 'Solo'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
                        {r.team_name ? (
                          <div>
                            <strong>{r.team_name}</strong>
                            <div style={{ color: '#64748B', fontSize: '0.72rem' }}>{r.team_members_info}</div>
                          </div>
                        ) : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}
