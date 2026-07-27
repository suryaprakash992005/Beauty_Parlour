import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          backgroundColor: '#0B0B0B',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        <div 
          className="book-loader" 
          style={{ 
            width: '32px', 
            height: '32px', 
            borderWidth: '3px', 
            borderColor: 'var(--admin-accent, #22C55E)', 
            borderTopColor: 'transparent' 
          }} 
        />
        <span style={{ color: 'var(--admin-text-secondary, rgba(255, 255, 255, 0.7))', fontSize: '14px', letterSpacing: '0.05em' }}>
          Verifying administrator session...
        </span>
      </div>
    );
  }

  if (!session || !user) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
