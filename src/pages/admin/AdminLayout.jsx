import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Gamepad2, 
  MessageSquareQuote, 
  Sliders, 
  LogOut, 
  ExternalLink,
  Glasses
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast.info('Logged out from admin suite.');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Members & Apps', path: '/admin/members', icon: <Users size={18} /> },
    { name: 'Events & Registrants', path: '/admin/events', icon: <Calendar size={18} /> },
    { name: 'E-Sports Operations', path: '/admin/esports', icon: <Gamepad2 size={18} /> },
    { name: 'Feedback & Ratings', path: '/admin/feedback', icon: <MessageSquareQuote size={18} /> },
    { name: 'Site CMS & Settings', path: '/admin/cms', icon: <Sliders size={18} /> }
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="logo-icon-box" style={{ width: '36px', height: '36px' }}>
            <Glasses size={20} className="logo-svg-icon" />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#FFFFFF', lineHeight: 1.1 }}>
              NEXTGEN <span style={{ color: '#00F0FF' }}>ADMIN</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>CONTROL PANEL</span>
          </div>
        </div>

        {/* Navigation items */}
        <ul className="admin-nav-list">
          {navItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                id={`admin-nav-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                <div className="admin-nav-link-main">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {admin?.username?.slice(0, 1).toUpperCase() || 'A'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ color: '#FFFFFF', fontSize: '0.88rem', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {admin?.username || 'Admin'}
              </div>
              <div style={{ color: '#64748B', fontSize: '0.72rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {admin?.email || 'admin@nextgenarvr.club'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Link to="/" target="_blank" className="btn btn-sm btn-secondary" style={{ flex: 1 }} title="View Public Portal">
              <ExternalLink size={14} />
              <span>Public Site</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-sm btn-danger" style={{ flex: 1 }} title="Log out">
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Outlet Wrapper */}
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield size={18} className="text-cyan" />
            <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
              AUTHENTICATED AS: <strong style={{ color: '#00F0FF' }}>{admin?.role?.toUpperCase() || 'SUPER_ADMIN'}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-emerald">System Healthy</span>
            <Link to="/" className="btn btn-sm btn-secondary">
              <ExternalLink size={14} />
              <span>Visit Portal</span>
            </Link>
          </div>
        </header>

        <main className="admin-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
