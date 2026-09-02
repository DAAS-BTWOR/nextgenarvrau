import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Glasses, 
  Menu, 
  X, 
  Sparkles, 
  Gamepad2, 
  Calendar, 
  Users, 
  MessageSquareQuote, 
  Send, 
  Shield, 
  Flame, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recruitmentOpen, setRecruitmentOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch recruitment status from CMS
  useEffect(() => {
    fetch('/api/cms/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.recruitment_status) {
          setRecruitmentOpen(data.recruitment_status.is_open !== false);
        }
      })
      .catch(() => {});
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Join Club', path: '/join', badge: recruitmentOpen ? 'HIRING' : null },
    { name: 'Events', path: '/events' },
    { name: 'Members', path: '/members' },
    { name: 'E-Sports Hub', path: '/esports', isEsports: true },
    { name: 'Feedback', path: '/feedback' },
    { name: 'Contact', path: '/contact' }
  ];

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" id="nav-brand-logo">
          <div className="logo-icon-box">
            <Glasses className="logo-svg-icon" size={24} />
            <div className="logo-glow-halo"></div>
          </div>
          <div className="logo-text-group">
            <span className="logo-main">NEXTGEN <span className="logo-accent">AR/VR</span></span>
            <span className="logo-tagline">SPATIAL & GAMING LAB</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`nav-item ${isActive ? 'active' : ''} ${link.isEsports ? 'esports-nav-item' : ''}`}
              >
                {link.isEsports && <Gamepad2 size={16} className="nav-esports-icon" />}
                <span>{link.name}</span>
                {link.badge && (
                  <span className="nav-badge-pill">{link.badge}</span>
                )}
                {isActive && <span className="active-dot"></span>}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Admin Action */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <Link to="/admin/dashboard" className="btn btn-sm btn-secondary nav-admin-btn" id="nav-admin-dashboard-btn">
              <Shield size={16} className="text-cyan" />
              <span>Admin Portal</span>
            </Link>
          ) : (
            <Link to="/admin/login" className="nav-admin-link" id="nav-admin-login-link" title="Admin Login">
              <Shield size={16} />
              <span className="hide-mobile">Admin</span>
            </Link>
          )}

          <Link to="/join" className="btn btn-sm btn-primary nav-cta-btn" id="nav-join-cta-btn">
            <span>Apply Now</span>
            <ArrowRight size={15} />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-toggle-btn"
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" id="mobile-drawer-menu">
          <div className="mobile-drawer-content">
            <div className="mobile-links-list">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`mobile-nav-item ${isActive ? 'active' : ''} ${link.isEsports ? 'esports' : ''}`}
                  >
                    <span className="mobile-link-name">
                      {link.isEsports && <Gamepad2 size={18} />}
                      {link.name}
                    </span>
                    {link.badge && <span className="badge badge-cyan">{link.badge}</span>}
                  </Link>
                );
              })}
            </div>

            <div className="mobile-drawer-actions">
              <Link to="/join" className="btn btn-primary btn-lg full-width">
                <span>Join NextGen Club</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/admin/login" className="btn btn-secondary full-width">
                <Shield size={18} />
                <span>Admin Login Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
