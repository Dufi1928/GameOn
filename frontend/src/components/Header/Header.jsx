import React, { useState, useEffect } from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoggedInStatus = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/user", {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                setIsLoggedIn(false);
            }
        };

        checkLoggedInStatus();
    }, []);

    const handleLogout = async () => {
    try {
        const response = await axios.post("http://localhost:8000/api/logout", {}, {
            withCredentials: true,
        });

        // Ajouter ces lignes pour vérifier et afficher le résultat de la requête de déconnexion
        if (response.status === 200) {
            console.log("Logout successful:", response.data.message);
        }

        setIsLoggedIn(false);
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

    return (
        <div className="container">
            <header>
                <nav className="nav-left">
                    <Link className="navLink" to="/">Home</Link>
                    <Link className="navLink" to="/About">About</Link>
                    <Link className="navLink" to="/games">Games</Link>
                    <Link className="navLink" to="/Contact">Contact</Link>
                </nav>
                <div className="logo-container">
                    <h2 className="logo-top">Game</h2>
                    <h2 className="logo-bottom">On</h2>
                </div>
                <nav className="nav-right">
                    <Link className="navLink" to="/usecase">Use cases</Link>
                    <Link className="navLink" to="/solutions">Solutions</Link>
                    <Link className="navLink" to="/Blog">Blog</Link>
                    {isLoggedIn && (
                        <Link className="navLink" to="/account">Account</Link>
                    )}
                    {isLoggedIn ? (
                        <button className="navLink" onClick={handleLogout}>Logout</button>
                    ) : (
                        <Link className="navLink" to="/login">Login</Link>
                    )}
                </nav>
            </header>
        </div>
    );
}

export default Header;
