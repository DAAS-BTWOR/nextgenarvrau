import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Glasses, 
  Gamepad2, 
  Boxes, 
  Cpu, 
  Trophy, 
  Calendar, 
  Users, 
  Flame, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight,
  Clock,
  MapPin
} from 'lucide-react';
import CanvasHero from '../components/CanvasHero';

export default function Home() {
  const [cmsSettings, setCmsSettings] = useState({
    recruitment_status: { is_open: true, banner_message: '🚀 Fall 2026 Recruitment is LIVE!' },
    announcement_banner: { active: true, title: 'Meta Spatial Hackathon 2026 Registrations Open!', link: '/events', badge: 'FEATURED' },
    club_stats: { members_count: '250+', projects_count: '24+', events_hosted: '50+', esports_pool_won: '$15,000+' }
  });
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Fetch CMS settings
    fetch('/api/cms/settings')
      .then(res => res.json())
      .then(data => {
        if (data) setCmsSettings(data);
      })
      .catch(() => {});

    // Fetch upcoming events
    fetch('/api/events?type=upcoming')
      .then(res => res.json())
      .then(data => {
        if (data && data.events) {
          setFeaturedEvents(data.events.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  // Event countdown timer for the next upcoming event
  useEffect(() => {
    if (featuredEvents.length === 0) return;
    const targetDate = new Date(`${featuredEvents[0].event_date}T10:00:00`).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [featuredEvents]);

  const domainWings = [
    {
      title: 'AR/VR & Spatial Computing',
      desc: 'Architecting WebXR apps, Apple Vision Pro spatial concepts, and Meta Quest 3 hand-tracking simulations.',
      icon: <Glasses size={26} />,
      tags: ['WebXR', 'Meta Quest 3', 'Three.js', 'Unity XR'],
      colorClass: ''
    },
    {
      title: 'Next-Gen Game Development',
      desc: 'Crafting photorealistic environments, physics mechanics, and multiplayer architectures in Unreal Engine 5.5 and Unity.',
      icon: <Layers size={26} />,
      tags: ['Unreal Engine 5', 'C++', 'Shader Graph', 'Lumen & Nanite'],
      colorClass: 'purple'
    },
    {
      title: 'AI & Spatial Intelligence',
      desc: 'Integrating Gaussian Splatting, NeRFs, 3D generative diffusion, and real-time computer vision into VR environments.',
      icon: <Cpu size={26} />,
      tags: ['3D Gaussian Splats', 'Computer Vision', 'PyTorch', 'Spatial ML'],
      colorClass: 'emerald'
    },
    {
      title: '3D Art & Virtual Worldbuilding',
      desc: 'Sculpting cybernetic 3D avatars, sci-fi environments, and spatial UI/UX design systems optimized for 90 FPS rendering.',
      icon: <Boxes size={26} />,
      tags: ['Blender 3D', 'Substance 3D', 'Spatial UI', 'Optimized Meshes'],
      colorClass: 'purple'
    },
    {
      title: 'E-Sports Competitive Division',
      desc: 'Hosting inter-collegiate LAN championships, real-time match analytics, and tournament leaderboards for tactical titles.',
      icon: <Gamepad2 size={26} />,
      tags: ['Valorant', 'Battle Royale', 'Points Engine', 'LAN Arena'],
      colorClass: 'magenta'
    },
    {
      title: 'Immersive Tech Research',
      desc: 'Publishing undergraduate research on haptic feedback gloves, motion tracking sensors, and collaborative telepresence.',
      icon: <Sparkles size={26} />,
      tags: ['Haptics', 'Motion Capture', 'Peer Research', 'Conferences'],
      colorClass: ''
    }
  ];

  const hardwareArsenal = [
    { name: 'Meta Quest 3 (128GB)', count: '12 Units', desc: 'Full-color passthrough mixed reality with 4K+ infinite display' },
    { name: 'HTC Vive Focus 3', count: '4 Units', desc: '5K enterprise VR headset with sub-millimeter precision tracking' },
    { name: 'RTX 4090 Workstations', count: '8 Rigs', desc: 'High-compute GPU render nodes for Unreal Engine real-time raytracing' },
    { name: 'Sensory Haptic Gloves', count: '2 Pairs', desc: 'Precise finger-level force feedback for immersive physical interaction' }
  ];

  return (
    <div className="home-page-root">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <CanvasHero />
        <div className="hero-glow-blob-1" />
        <div className="hero-glow-blob-2" />

        <div className="container hero-content">
          <div className="hero-pill-badge">
            <span className="pill-dot animate-pulse-glow" />
            <span>Next-Generation Spatial Computing & Esports Lab</span>
          </div>

          <h1 className="hero-title">
            Immerse. Innovate. <br />
            <span className="gradient-text">Shape Virtual Worlds.</span>
          </h1>

          <p className="hero-subtitle">
            We are the premier collegiate tech club pushing the frontiers of Extended Reality (XR), Game Engineering, Spatial AI, and Competitive E-Sports.
          </p>

          <div className="hero-cta-group">
            <Link to="/join" className="btn btn-primary btn-lg" id="hero-join-btn">
              <span>Join Club for Fall '26</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/events" className="btn btn-secondary btn-lg" id="hero-events-btn">
              <Calendar size={18} />
              <span>Explore Events</span>
            </Link>
            <Link to="/esports" className="btn btn-esports btn-lg" id="hero-esports-btn">
              <Gamepad2 size={18} />
              <span>E-Sports Hub</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="stats-banner-grid">
            <div className="stat-card">
              <span className="stat-number">{cmsSettings.club_stats?.members_count || '250+'}</span>
              <span className="stat-label">Active Builders</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{cmsSettings.club_stats?.projects_count || '24+'}</span>
              <span className="stat-label">XR & Game Projects</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{cmsSettings.club_stats?.events_hosted || '50+'}</span>
              <span className="stat-label">Workshops & Jams</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{cmsSettings.club_stats?.esports_pool_won || '$15,000+'}</span>
              <span className="stat-label">Esports Pool Won</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Announcement Banner from CMS */}
      {cmsSettings.announcement_banner?.active && (
        <section className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="announcement-ribbon">
            <div className="announcement-left">
              <span className="badge badge-magenta">{cmsSettings.announcement_banner.badge || 'HOT'}</span>
              <span className="announcement-text">{cmsSettings.announcement_banner.title}</span>
            </div>
            <Link to={cmsSettings.announcement_banner.link || '/events'} className="btn btn-sm btn-secondary">
              <span>View Details</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* 3. Featured Upcoming Event Reel + Countdown */}
      {featuredEvents.length > 0 && (
        <section className="section" style={{ background: 'rgba(10, 14, 22, 0.4)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <Flame size={14} />
                <span>Upcoming Spotlight</span>
              </div>
              <h2 className="section-title">Major Club <span className="gradient-text">Milestone Event</span></h2>
              <p className="section-subtitle">
                Join our next flagship workshop or hackathon. Spots fill up fast—register directly below.
              </p>
            </div>

            {/* Countdown Banner Card */}
            <div className="glass-card-static" style={{ marginBottom: '2.5rem', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>{featuredEvents[0].category}</span>
                  <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '0.4rem' }}>{featuredEvents[0].title}</h3>
                  <div style={{ display: 'flex', gap: '1.25rem', color: '#94A3B8', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                    <span>📅 {featuredEvents[0].event_date} ({featuredEvents[0].event_time})</span>
                    <span>📍 {featuredEvents[0].venue}</span>
                  </div>
                </div>

                {/* Live Countdown Clock */}
                <div style={{ display: 'flex', gap: '0.75rem', textAlign: 'center' }}>
                  <div style={{ background: 'rgba(0, 240, 255, 0.08)', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '10px', padding: '0.6rem 0.9rem', minWidth: '60px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#00F0FF', display: 'block' }}>{countdown.days}</span>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#64748B' }}>Days</span>
                  </div>
                  <div style={{ background: 'rgba(0, 240, 255, 0.08)', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '10px', padding: '0.6rem 0.9rem', minWidth: '60px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#00F0FF', display: 'block' }}>{countdown.hours}</span>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#64748B' }}>Hours</span>
                  </div>
                  <div style={{ background: 'rgba(0, 240, 255, 0.08)', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '10px', padding: '0.6rem 0.9rem', minWidth: '60px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#00F0FF', display: 'block' }}>{countdown.minutes}</span>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#64748B' }}>Mins</span>
                  </div>
                  <div style={{ background: 'rgba(0, 240, 255, 0.08)', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '10px', padding: '0.6rem 0.9rem', minWidth: '60px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#00F0FF', display: 'block' }}>{countdown.seconds}</span>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#64748B' }}>Secs</span>
                  </div>
                </div>

                <Link to="/events" className="btn btn-primary">
                  <span>Register Now</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Event Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {featuredEvents.map(event => (
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
                    <p className="event-desc-snippet">{event.description.slice(0, 110)}...</p>
                    <div className="event-footer">
                      <div className="event-spots-info">
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{event.spots_remaining} spots remaining</span>
                        <div className="spots-bar-bg">
                          <div
                            className="spots-bar-fill"
                            style={{ width: `${Math.min(100, Math.max(10, ((event.total_registrants || 0) / (event.max_seats || 100)) * 100))}%` }}
                          />
                        </div>
                      </div>
                      <Link to="/events" className="btn btn-sm btn-secondary">
                        <span>Details</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Domain Wings Showcase */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge purple">
              <Boxes size={14} />
              <span>Wings & Domains</span>
            </div>
            <h2 className="section-title">Explore Our <span className="gradient-text">Technical Wings</span></h2>
            <p className="section-subtitle">
              Every member chooses their primary specialization domain while collaborating on multi-disciplinary capstone projects.
            </p>
          </div>

          <div className="domains-grid">
            {domainWings.map((domain, idx) => (
              <div key={idx} className={`domain-card ${domain.colorClass}`}>
                <div className="domain-icon-wrapper">
                  {domain.icon}
                </div>
                <h3 className="domain-title">{domain.title}</h3>
                <p className="domain-desc">{domain.desc}</p>
                <div className="domain-tech-tags">
                  {domain.tags.map((t, i) => (
                    <span key={i} className="domain-tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Spatial Lab & Hardware Arsenal */}
      <section className="section" style={{ background: 'rgba(13, 17, 26, 0.6)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge emerald">
              <Cpu size={14} />
              <span>Lab Infrastructure</span>
            </div>
            <h2 className="section-title">State of the Art <span className="gradient-text-emerald">VR Arsenal</span></h2>
            <p className="section-subtitle">
              Club members get round-the-clock physical access to top-tier spatial computing hardware, testing rigs, and GPU workstations.
            </p>
          </div>

          <div className="hardware-grid">
            {hardwareArsenal.map((item, idx) => (
              <div key={idx} className="hardware-card">
                <div className="hardware-icon-box">
                  <Glasses size={28} />
                </div>
                <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '0.25rem' }}>{item.name}</h4>
                <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>{item.count}</span>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Ready to Join CTA */}
      <section className="section" style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="glass-card" style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08) 0%, rgba(138, 43, 226, 0.12) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '24px',
            padding: '3.5rem 2rem',
            textAlign: 'center'
          }}>
            <span className="section-badge">Ready to Transcend?</span>
            <h2 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginBottom: '1rem' }}>
              Build the Metaverse With Us.
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
              No previous VR headset ownership required. If you have passion for 3D graphics, coding, game design, or competitive esports, there is a place for you.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/join" className="btn btn-primary btn-lg">
                <span>Submit Membership Application</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg">
                <Users size={18} />
                <span>Meet the Team</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
