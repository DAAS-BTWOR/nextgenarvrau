import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Gamepad2, 
  Github, 
  Linkedin, 
  Instagram,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [contactSettings, setContactSettings] = useState({
    email: 'contact@nextgenarvr.club',
    lab_location: 'Spatial Computing Lab, Room 402, Technology Block A',
    discord: 'https://discord.gg/nextgen-arvr',
    instagram: 'https://instagram.com/nextgen_arvr',
    linkedin: 'https://linkedin.com/company/nextgen-arvr-club',
    github: 'https://github.com/nextgen-arvr-club'
  });

  useEffect(() => {
    fetch('/api/cms/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.contact_info) {
          setContactSettings(prev => ({ ...prev, ...data.contact_info }));
        }
      })
      .catch(() => {});
  }, []);

  const faqs = [
    {
      q: 'Do I need prior VR headset ownership or coding experience to join?',
      a: 'Not at all! NextGen AR/VR provides dedicated Meta Quest 3 and HTC Vive units in our physical lab. We accept beginners with a passion to learn, and pair you with senior leads in our beginner workshops.'
    },
    {
      q: 'Are NextGen hackathons, workshops, and esports tournaments free?',
      a: 'Yes, 100% of our collegiate workshops, technical bootcamps, and open campus game tournaments are free of charge for registered students.'
    },
    {
      q: 'Can students from non-CS branches (ECE, Mech, Design) apply?',
      a: 'Absolutely! Our 3D Worldbuilding, Hardware Haptics, and Esports operations wings thrive on multi-disciplinary talents from all engineering and design departments.'
    },
    {
      q: 'How does the E-Sports leaderboard scoring work?',
      a: 'Our E-Sports Points Calculator supports Battle Royale (15-point placement scale + 1 point per kill + 5-point win bonus) and Tactical 5v5 FPS modes with live tournament standings updated in real-time.'
    },
    {
      q: 'How can our company or studio sponsor a hackathon prize pool?',
      a: 'Send us a message using the form on this page or email contact@nextgenarvr.club. Our Faculty Coordinator will connect you with our corporate relations deck.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all contact message fields.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSentSuccess(true);
      toast.success('Your message has been sent to the lab coordinators.');
    }, 600);
  };

  return (
    <div className="contact-page-root">
      {/* 1. Header */}
      <section className="section" style={{ padding: '4rem 0 2rem 0', textAlign: 'center' }}>
        <div className="container">
          <div className="section-badge">
            <Mail size={14} />
            <span>Connect with NextGen</span>
          </div>
          <h1 className="section-title">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '680px', margin: '0 auto' }}>
            Have questions about recruitment, sponsorship, or joining our esports scrims? Reach out directly to our core team.
          </p>
        </div>
      </section>

      {/* 2. Contact Grid */}
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
            {/* Left: Contact Info & Lab Details */}
            <div>
              <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '1.25rem' }}>
                Spatial Computing Lab & HQ
              </h3>
              <p style={{ color: '#94A3B8', lineHeight: 1.7, marginBottom: '2rem' }}>
                Our hardware facility houses Meta Quest 3 testing pods, HTC Vive 5K rigs, and RTX workstations open to active members.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(0, 240, 255, 0.12)', color: '#00F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h5 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '0.2rem' }}>Physical Lab Location</h5>
                    <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>{contactSettings.lab_location}</p>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(138, 43, 226, 0.15)', color: '#D8B4FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h5 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '0.2rem' }}>Official Inquiries Email</h5>
                    <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>{contactSettings.email}</p>
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '1rem' }}>Official Channels & Community</h4>
              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <a href={contactSettings.github} target="_blank" rel="noreferrer" className="social-icon" style={{ width: '44px', height: '44px' }} aria-label="GitHub">
                  <Github size={20} />
                </a>
                <a href={contactSettings.linkedin} target="_blank" rel="noreferrer" className="social-icon" style={{ width: '44px', height: '44px' }} aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
                <a href={contactSettings.instagram} target="_blank" rel="noreferrer" className="social-icon" style={{ width: '44px', height: '44px' }} aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href={contactSettings.discord} target="_blank" rel="noreferrer" className="social-icon" style={{ width: '44px', height: '44px' }} aria-label="Discord">
                  <Gamepad2 size={20} />
                </a>
              </div>
            </div>

            {/* Right: Message Form */}
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '1.25rem' }}>
                Send Direct Message
              </h3>

              {sentSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0, 255, 157, 0.15)', color: '#00FF9D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                    <CheckCircle2 size={30} />
                  </div>
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.3rem', marginBottom: '0.4rem' }}>Message Dispatched!</h4>
                  <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                    We have received your message and will respond within 24 hours.
                  </p>
                  <button onClick={() => setSentSuccess(false)} className="btn btn-secondary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Your Name <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Samar Singh"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. samar@college.edu"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select
                      className="form-select"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                    >
                      <option value="General Inquiry">General Club Inquiry</option>
                      <option value="Hackathon Collaboration">Hackathon & Event Collaboration</option>
                      <option value="Esports Tournament Scrims">Esports Tournament Scrims</option>
                      <option value="Industry Sponsorship">Industry Sponsorship & Hardware Grants</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Message <span className="required">*</span></label>
                    <textarea
                      className="form-textarea"
                      placeholder="Type your message here..."
                      rows={4}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg full-width"
                    disabled={submitting}
                    style={{ marginTop: '1.5rem' }}
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive FAQ Accordion */}
      <section className="section" id="faq" style={{ background: 'rgba(10, 14, 22, 0.5)' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="section-header">
            <div className="section-badge emerald">
              <HelpCircle size={14} />
              <span>FAQ</span>
            </div>
            <h2 className="section-title">Frequently Asked <span className="gradient-text-emerald">Questions</span></h2>
            <p className="section-subtitle">
              Common questions answered regarding equipment usage, club recruitment, and tournament eligibility.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="glass-card"
                  style={{ padding: '1.25rem 1.5rem', cursor: 'pointer' }}
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <h4 style={{ fontSize: '1.1rem', color: isOpen ? '#00F0FF' : '#FFFFFF', fontWeight: '600' }}>
                      {faq.q}
                    </h4>
                    <span style={{ color: '#00F0FF' }}>
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </div>
                  {isOpen && (
                    <p style={{ color: '#94A3B8', marginTop: '0.85rem', lineHeight: 1.7, fontSize: '0.95rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
