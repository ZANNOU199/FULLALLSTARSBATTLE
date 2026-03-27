import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Update user info
          localStorage.setItem('admin_user', JSON.stringify(data.user));
          setIsAuthenticated(true);
        } else {
          // Token is invalid
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p>Vérification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
