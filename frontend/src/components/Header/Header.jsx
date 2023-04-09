import React, { useState, useEffect } from 'react';
import FakeLink from '../FakeLink';
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
            await axios.post("http://localhost:8000/api/logout", {}, {
                withCredentials: true,
            });
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
                    <Link className="navLink" to="/Blog">Blog</Link>
                    <FakeLink to="/link2">About</FakeLink>
                    <FakeLink to="/link3">Blog</FakeLink>
                    <FakeLink to="/link4">Contact</FakeLink>
                </nav>
                <div className="logo-container">
                    <h2 className="logo-top">Game</h2>
                    <h2 className="logo-bottom">On</h2>
                </div>
                <nav className="nav-right">
                    <FakeLink to="/link5">Use cases</FakeLink>
                    <FakeLink to="/link6">Solutions</FakeLink>
                    <Link className="navLink" to="/signup">Sign Up</Link>
                    {isLoggedIn ? (
                        <FakeLink className="navLink" onClick={handleLogout}>Logout</FakeLink>
                    ) : (
                        <Link className="navLink" to="/login">Login</Link>
                    )}
                </nav>
            </header>
        </div>
    );
}

export default Header;
