import { useEffect, useState } from 'react';

const useAdminAuth = (): boolean => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const validateToken = () => {
            const token = localStorage.getItem('adminToken');
            setIsAuthenticated(!!token); // Set to true if token exists
        };

        validateToken();

        window.addEventListener('storage', validateToken);

        return () => {
            window.removeEventListener('storage', validateToken);
        };
    }, []);

    return isAuthenticated;
};

export default useAdminAuth;
