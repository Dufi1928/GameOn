import React, { ReactElement, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute: React.FC<{ children: ReactElement }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.get('https://localhost:8000/api/user', {
                    withCredentials: true
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error(error);
                setIsAuthenticated(false);
            }

            setIsLoading(false);
        };

        checkAuthentication();
    }, []);

    if (isLoading) {
        // Afficher un indicateur de chargement si nécessaire
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
        return <Navigate to="/login" replace />;
    }

    // Si l'utilisateur est authentifié, rendre l'élément enfant
    return children;
};

export default ProtectedRoute;
