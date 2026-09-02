import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Target, 
  Eye, 
  Award, 
  Github, 
  Linkedin, 
  Globe, 
  Calendar, 
  Sparkles, 
  Layers, 
  GraduationCap, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function About() {
  const [coreTeam, setCoreTeam] = useState([]);
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    fetch('/api/members?status=core_team')
      .then(res => res.json())
      .then(data => {
        if (data && data.members) {
          const fac = data.members.find(m => m.year === 'Faculty');
          const students = data.members.filter(m => m.year !== 'Faculty');
          setFaculty(fac);
          setCoreTeam(students);
        }
      })
      .catch(() => {});
  }, []);

  const milestones = [
    {
      year: '2022',
      title: 'Club Genesis',
      desc: 'Founded by 5 passionate student developers with 2 Oculus Quest 2 headsets in a small corner of Computer Lab 2.'
    },
    {
      year: '2023',
      title: 'Spatial Lab Inauguration',
      desc: 'Formally recognized as the official university Extended Reality & Gaming research body; allocated dedicated room 402 with RTX workstations.'
    },
    {
      year: '2024',
      title: 'National SIH Champions',
      desc: 'Won 1st prize at the Smart India Hackathon for developing an immersive Disaster Simulation & Evacuation drill in WebXR.'
    },
    {
      year: '2025',
      title: 'Meta Academic Grant & Esports Arena',
      desc: 'Awarded 12 Meta Quest 3 units from Meta XR Developer grant and launched collegiate Esports tournament franchise.'
    },
    {
      year: '2026',
      title: 'NextGen 2.0 Spatial Hub',
      desc: 'Expanding into Apple Vision Pro spatial UI, 3D Gaussian Splatting, and national inter-collegiate gaming championships.'
    }
  ];

  return (
    <div className="about-page-root">
      {/* 1. Header Banner */}
      <section className="section" style={{ padding: '4rem 0 2rem 0', textAlign: 'center' }}>
        <div className="container">
          <div className="section-badge purple">
            <Users size={14} />
            <span>Behind NextGen AR/VR</span>
          </div>
          <h1 className="section-title">
            Engineering the <span className="gradient-text">Future of Spatial Reality</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '750px', margin: '0 auto' }}>
            We are an ambitious community of student researchers, game developers, 3D worldbuilders, and esports competitors united by our fascination with immersive technology.
          </p>
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div className="glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 240, 255, 0.12)', color: '#00F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Target size={24} />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '0.75rem' }}>Our Mission</h3>
              <p style={{ color: '#94A3B8', lineHeight: 1.7, fontSize: '0.98rem' }}>
                Democratize access to next-generation spatial computing hardware and empower every engineering student with the technical mastery, mentorship, and creative confidence to build real-world VR/AR and gaming software.
              </p>
            </div>

            <div className="glass-card purple-glow">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(138, 43, 226, 0.15)', color: '#D8B4FE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Eye size={24} />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '0.75rem' }}>Our Vision</h3>
              <p style={{ color: '#94A3B8', lineHeight: 1.7, fontSize: '0.98rem' }}>
                Establish our university as the nation's premier incubator for immersive technologies, producing industry-ready XR engineers, indie game creators, spatial computing researchers, and top-tier esports talent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Faculty Coordinator Spotlight */}
      {faculty && (
        <section className="section" style={{ background: 'rgba(12, 16, 26, 0.7)' }}>
          <div className="container">
            <div className="glass-card-static" style={{ border: '1px solid rgba(0, 240, 255, 0.3)', padding: '2.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2.5rem', alignItems: 'center' }}>
                <img
                  src={faculty.avatar_url}
                  alt={faculty.full_name}
                  style={{ width: '160px', height: '160px', borderRadius: '20px', objectFit: 'cover', border: '2px solid var(--accent-cyan)' }}
                />
                <div>
                  <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Faculty Coordinator & Academic Mentor</span>
                  <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '0.35rem' }}>{faculty.full_name}</h2>
                  <p style={{ color: '#00F0FF', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {faculty.branch} • {faculty.roll_no}
                  </p>
                  <p style={{ color: '#94A3B8', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                    "{faculty.bio} NextGen AR/VR bridges theoretical computer science with hands-on immersive hardware execution, giving our students an unparalleled edge in spatial computing careers."
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <a href={`mailto:${faculty.email}`} className="btn btn-sm btn-secondary">
                      <span>{faculty.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Core Leadership Team Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Users size={14} />
              <span>Core Leadership</span>
            </div>
            <h2 className="section-title">Meet the <span className="gradient-text">Executive Board</span></h2>
            <p className="section-subtitle">
              Student leaders guiding our technical wings, organizing hackathons, and running operations.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {coreTeam.map(member => (
              <div key={member.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <img
                  src={member.avatar_url}
                  alt={member.full_name}
                  style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0, 240, 255, 0.4)', marginBottom: '1.25rem' }}
                />
                <span className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>{member.role}</span>
                <h4 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>{member.full_name}</h4>
                <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
                  {member.domain}
                </p>
                <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
                  {member.bio}
                </p>
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto' }}>
                  {member.github_url && (
                    <a href={member.github_url} target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
                      <Github size={16} />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
                      <Linkedin size={16} />
                    </a>
                  )}
                  {member.portfolio_url && (
                    <a href={member.portfolio_url} target="_blank" rel="noreferrer" className="social-icon" aria-label="Portfolio">
                      <Globe size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Club Timeline */}
      <section className="section" style={{ background: 'rgba(10, 14, 22, 0.5)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge emerald">
              <Calendar size={14} />
              <span>Milestones</span>
            </div>
            <h2 className="section-title">Our Growth <span className="gradient-text-emerald">Timeline</span></h2>
            <p className="section-subtitle">
              From two headsets in 2022 to a multi-domain spatial computing and gaming powerhouse.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', borderLeft: '2px solid rgba(0, 240, 255, 0.3)', paddingLeft: '2rem' }}>
            {milestones.map((m, idx) => (
              <div key={idx} style={{ marginBottom: '2.5rem', position: 'relative' }}>
                {/* Node dot */}
                <div style={{
                  position: 'absolute',
                  left: '-2.6rem',
                  top: '0.2rem',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--accent-cyan)',
                  boxShadow: '0 0 12px var(--accent-cyan)',
                  border: '3px solid #07090E'
                }} />
                <span className="badge badge-cyan" style={{ marginBottom: '0.4rem' }}>{m.year}</span>
                <h4 style={{ fontSize: '1.35rem', color: '#FFFFFF', margin: '0.25rem 0 0.5rem 0' }}>{m.title}</h4>
                <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF', marginBottom: '1rem' }}>Want to Join Our Next Cohort?</h2>
          <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Explore open domain positions in AR/VR, Unreal Engine Game Development, 3D Art, AI, and E-Sports Operations.
          </p>
          <Link to="/join" className="btn btn-primary btn-lg">
            <span>Apply for Club Membership</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
