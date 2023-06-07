import { useEffect, useReducer, useState } from 'react';
import './Header.scss';
import axios from 'axios';
import { useNavigate, Link, useLocation } from "react-router-dom";
import HelpIcon from '../Icons/HelpIson.tsx';
import SettingsIcon from '../Icons/Settings.tsx';
import UserIcon from '../Icons/UserIcon.tsx';
import SignOut from '../Icons/SignOut.tsx';

const initialState = {
    userId: 0,
    isLoggedIn: false,
    socket: null,
};

type State = {
    userId: number;
    isLoggedIn: boolean;
    socket: WebSocket | null;
};

type Action =
    | { type: "SETISLOGEDIN"; value: boolean }
    | { type: "SETUSERID"; value: number };

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SETISLOGEDIN":
            return { ...state, isLoggedIn: action.value };
        case "SETUSERID":
            return { ...state, userId: action.value };
        default:
            return state;
    }
};

function Header() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);

    const isCurrentPath = (path: string) => {
        return location.pathname === path;
    };

    useEffect(() => {
        const checkLoggedInStatus = async () => {
            try {
                const response = await axios.get("https://localhost:8000/api/checkLoginView", {
                    withCredentials: true,
                });
                if (response.data.status === 'logged in') {
                    dispatch({ type: 'SETISLOGEDIN', value: true });
                    dispatch({ type: 'SETUSERID', value: response.data.id });
                }
            } catch (error) {
                dispatch({ type: 'SETISLOGEDIN', value: false });
            }
        };

        checkLoggedInStatus();
    }, []);

    useEffect(() => {
        if (state.isLoggedIn && state.userId) {
            const newSocket = new WebSocket('wss://localhost:8001/ws/');

            newSocket.onopen = () => {
                // console.log('WebSocket connection opened');
                const data = {
                    user_id: state.userId
                };
                newSocket.send(JSON.stringify(data));
            };

            newSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.ping) {
                    newSocket.send(JSON.stringify({ pong: true })); // Envoie le pong au serveur
                }
            };

            newSocket.onclose = () => {
                console.log('WebSocket connection closed');
            };

            setSocket(newSocket);
            return () => {
                newSocket.close();
            };
        }
    }, [state.isLoggedIn, state.userId]);

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                "https://localhost:8000/api/logout",
                { user_id: state.userId },
                {
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                console.log("Logout successful:", response.data.message);
            }
            document.cookie.split(";").forEach((cookie) => {
                document.cookie = cookie
                    .replace(/^ +/, "")
                    .replace(/=.*/, `=; expires=${new Date().toUTCString()}; path=/;`);
            });

            dispatch({ type: 'SETISLOGEDIN', value: false });
            localStorage.clear();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleUserIconHover = () => {
        setShowDropdown(true);
    };

    const handleUserIconLeave = () => {
        setShowDropdown(false);
    };

    return (
        <div className="container">
            <header>
                <nav className="nav-left">
                    <Link className={`navLink ${isCurrentPath("/") ? "current" : ""}`} to="/">Home</Link>
                    {/*<Link className={`navLink ${isCurrentPath("/games") ? "current" : ""}`} to="/games">Games</Link>*/}
                    <Link className={`navLink ${isCurrentPath("/Messages") ? "current" : ""}`} to="/Messages">Message</Link>
                    {/*<Link className={`navLink ${isCurrentPath("/Contact") ? "current" : ""}`} to="/Contact">Contact</Link>*/}
                    {state.isLoggedIn ? (
                        <Link className={`navLink ${isCurrentPath("/Friends") ? "current" : ""}`} to="/Friends">Friends</Link>
                    ) : null}
                    <Link className={`navLink ${isCurrentPath("/Blog") ? "current" : ""}`} to="/Blog">Blog</Link>
                </nav>
                <div className="logo-container">
                    <h2 className="logo-top">Game</h2>
                    <h2 className="logo-bottom">On</h2>
                </div>
                <nav className="nav-right">
                    <Link className={`navLink ${isCurrentPath("/usecase") ? "current" : ""}`} to="/usecase">Serveur</Link>
                    <Link className={`navLink ${isCurrentPath("/solutions") ? "current" : ""}`} to="/solutions">Guid</Link>

                    {state.isLoggedIn && (
                        <Link className={`navLink ${isCurrentPath("/account") ? "current" : ""}`} to="/account">Room</Link>
                    )}
                    {!state.isLoggedIn && (
                        <Link className={`navLink ${isCurrentPath("/login") ? "current" : ""}`} to="/login">Login</Link>
                    )}
                    {state.isLoggedIn && (
                        <div className="usericon" onMouseEnter={handleUserIconHover} onMouseLeave={handleUserIconLeave}>
                            <img src="/img/userTest.png" alt="" />
                            {showDropdown && (
                                <div  className="dropdown">
                                    <SettingsIcon/>
                                    <HelpIcon />
                                    <UserIcon/>
                                    <div>
                                        <SignOut handleLogout={handleLogout} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </header>
        </div>
    );
}

export default Header;
