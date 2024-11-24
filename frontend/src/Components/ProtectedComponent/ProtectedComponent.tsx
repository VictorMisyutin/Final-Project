import React, { ReactNode, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                return;
            }
            try {
                const response = await fetch('http://localhost:4000/api/users/verify', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if (response.ok) {
                    setIsAuthenticated(true);
                    setError(null);
                } else {
                    setIsAuthenticated(false);
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to authenticate');
                }
            } catch (error: any){
                setIsAuthenticated(false);
                setError('Network error, please try again later.');
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>Loading...</p>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace={true} />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
