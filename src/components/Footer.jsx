import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Glasses, 
  MapPin, 
  Mail, 
  Send, 
  Github, 
  Linkedin, 
  Instagram, 
  Gamepad2, 
  ShieldCheck,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <Link to="/" className="brand-logo footer-logo">
              <div className="logo-icon-box">
                <Glasses className="logo-svg-icon" size={22} />
              </div>
              <div className="logo-text-group">
                <span className="logo-main">NEXTGEN <span className="logo-accent">AR/VR</span></span>
                <span className="logo-tagline">COLLEGE TECH CLUB</span>
              </div>
            </Link>
            <p className="footer-desc">
              Pioneering immersive computing, WebXR, Unreal Engine game mechanics, and collegiate competitive E-Sports at our state-of-the-art campus spatial lab.
            </p>
            <div className="footer-socials">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://discord.gg" target="_blank" rel="noreferrer" className="social-icon" aria-label="Discord">
                <Gamepad2 size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Club Portals</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us & Team</Link></li>
              <li><Link to="/events">Events & Hackathons</Link></li>
              <li><Link to="/members">Members Directory</Link></li>
              <li><Link to="/join">Join the Club</Link></li>
              <li><Link to="/esports" className="text-magenta">E-Sports Hub <ArrowUpRight size={14} /></Link></li>
            </ul>
          </div>

          {/* Resources & Feedback */}
          <div className="footer-col">
            <h4 className="footer-heading">Community & Support</h4>
            <ul className="footer-links">
              <li><Link to="/feedback">Session Feedback</Link></li>
              <li><Link to="/contact">Contact Lab Team</Link></li>
              <li><Link to="/contact#faq">Frequently Asked Questions</Link></li>
              <li><Link to="/esports#calculator">Points Calculator</Link></li>
              <li><Link to="/admin/login" className="admin-footer-link"><ShieldCheck size={14} /> Admin Access</Link></li>
            </ul>
          </div>

          {/* Lab Location & Contact */}
          <div className="footer-col lab-col">
            <h4 className="footer-heading">Spatial VR Lab</h4>
            <div className="lab-info-item">
              <MapPin size={18} className="text-cyan" />
              <span>Room 402, Technology Block A, Campus Main Campus</span>
            </div>
            <div className="lab-info-item">
              <Mail size={18} className="text-cyan" />
              <span>contact@nextgenarvr.club</span>
            </div>
            <div className="lab-badge-box">
              <span className="badge badge-emerald">Open Mon - Sat</span>
              <span className="lab-hours">09:00 AM – 06:30 PM</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NextGen AR/VR Tech Club. Built with WebXR & Modern Engineering.</p>
          <div className="footer-bottom-links">
            <span className="powered-badge">Hardware Supported by Meta & Unity Academic Alliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
