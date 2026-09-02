import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((msg, dur) => addToast(msg, 'success', dur), [addToast]);
  const error = useCallback((msg, dur) => addToast(msg, 'error', dur), [addToast]);
  const warning = useCallback((msg, dur) => addToast(msg, 'warning', dur), [addToast]);
  const info = useCallback((msg, dur) => addToast(msg, 'info', dur), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, warning, info, removeToast }}>
      {children}
      <div className="toast-container" style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '420px',
        width: 'calc(100% - 3rem)'
      }}>
        {toasts.map(toast => {
          const typeStyles = {
            success: { bg: 'rgba(10, 30, 20, 0.95)', border: '#00FF9D', color: '#00FF9D', icon: <CheckCircle size={20} /> },
            error: { bg: 'rgba(30, 10, 15, 0.95)', border: '#FF3366', color: '#FF3366', icon: <XCircle size={20} /> },
            warning: { bg: 'rgba(30, 25, 10, 0.95)', border: '#FFB800', color: '#FFB800', icon: <AlertTriangle size={20} /> },
            info: { bg: 'rgba(10, 25, 35, 0.95)', border: '#00F0FF', color: '#00F0FF', icon: <Info size={20} /> }
          }[toast.type] || { bg: 'rgba(15, 20, 30, 0.95)', border: '#00F0FF', color: '#00F0FF', icon: <Info size={20} /> };

          return (
            <div
              key={toast.id}
              style={{
                background: typeStyles.bg,
                border: `1px solid ${typeStyles.border}`,
                borderRadius: '12px',
                padding: '0.9rem 1.1rem',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                color: '#F1F5F9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.92rem' }}>
                <span style={{ color: typeStyles.color, display: 'flex', alignItems: 'center' }}>
                  {typeStyles.icon}
                </span>
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex'
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
