import { useEffect, useReducer, useState, useRef } from 'react';
import './Header.scss';
import axios from 'axios';
import { useNavigate, Link, useLocation } from "react-router-dom";
import HelpIcon from '../Icons/HelpIson.tsx';
import SettingsIcon from '../Icons/Settings.tsx';
import UserIcon from '../Icons/UserIcon.tsx';
import SignOut from '../Icons/SignOut.tsx';
import Notification from '../Notification/Notification.tsx';
import { IoMdNotificationsOutline } from 'react-icons/io';

const initialState = {
    userId: 0,
    isLoggedIn: false,
    socket: null,
    notif: false,
    notifData: {},
};

type State = {
    userId: number;
    isLoggedIn: boolean;
    socket: WebSocket | null;
    notif: boolean;
    notifData: any;
};

type Action =
    | { type: "SETISLOGEDIN"; value: boolean }
    | { type: "SETUSERID"; value: number }
    | { type: "SETNOTIF"; value: boolean }
    | { type: "SETNOTIFDATA"; value: any };

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SETISLOGEDIN":
            return { ...state, isLoggedIn: action.value };
        case "SETUSERID":
            return { ...state, userId: action.value };
        case "SETNOTIF":
            return { ...state, notif: action.value };
        case "SETNOTIFDATA":
            return { ...state, notifData: action.value };
        default:
            return state;
    }
};

function Header() {
    const [state, dispatch] = useReducer(reducer, initialState);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const notificationClicked = useRef(false);
    const isCurrentPath = (path: string) => {
        return location.pathname === path;
    };

    useEffect(() => {
        const checkLoggedInStatus = async () => {
            try {
                const response = await axios.get("https://mygameon.pro:8000/api/checkLoginView", {
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

        const checkNotification = async () => {
            try {
                const response = await axios.get(
                    "https://mygameon.pro:8000x`/api/notifications",
                    { withCredentials: true }
                );
                if (Object.keys(response.data).length > 0) {
                    dispatch({ type: 'SETNOTIF', value: true });
                    dispatch({ type: 'SETNOTIFDATA', value: response.data });
                } else {
                    dispatch({ type: 'SETNOTIF', value: false });
                }
            } catch (error) {
                console.error(error);
                dispatch({ type: 'SETNOTIF', value: false });
            }
        };
        checkLoggedInStatus();
        checkNotification();
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node) &&
                !(event.target instanceof HTMLElement && event.target.classList.contains("notification-icon"))
            ) {
                setShowNotification(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up the listeners when the component unmounts
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (state.isLoggedIn && state.userId) {
            const newSocket = new WebSocket('wss://mygameon.pro:8001/ws/');

            newSocket.onopen = () => {
                const data = {
                    user_id: state.userId
                };
                newSocket.send(JSON.stringify(data));
            };

            newSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.ping) {
                    newSocket.send(JSON.stringify({ pong: true }));
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
                "https://mygameon.pro:8000/api/logout",
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

    const handleNotificationClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setShowNotification((prevState) => !prevState);
        notificationClicked.current = true;
    };


    return (
        <div className="container">
            <header>
                <nav className="nav-left">
                    <Link className={`navLink ${isCurrentPath("/") ? "current" : ""}`} to="/">Home</Link>
                    {state.isLoggedIn && (
                        <Link className={`navLink ${isCurrentPath("/Messages") ? "current" : ""}`} to="/Messages">Message</Link>
                    )}
                    {state.isLoggedIn ? (
                        <Link className={`navLink ${isCurrentPath("/Friends") ? "current" : ""}`} to="/Friends">Friends</Link>
                    ) : null}
                    <Link className={`navLink ${isCurrentPath("/BlogList") ? "current" : ""}`} to="/Blog">Blog</Link>
                </nav>
                <div className="logo-container">
                    <h2 className="logo-top">Game</h2>
                    <h2 className="logo-bottom">On</h2>
                </div>
                <nav className="nav-right">
                    <Link className={`navLink ${isCurrentPath("/usecase") ? "current" : ""}`} to="/usecase">Serveur</Link>
                    <Link className={`navLink ${isCurrentPath("/guides") ? "current" : ""}`} to="/guides">Guid</Link>
                    {state.isLoggedIn && (
                        <Link className={`navLink ${isCurrentPath("/account") ? "current" : ""}`} to="/account">Room</Link>
                    )}
                    {!state.isLoggedIn && (
                        <Link className={`navLink ${isCurrentPath("/login") ? "current" : ""}`} to="/login">Login</Link>
                    )}
                    {state.isLoggedIn && (
                        <div className={state.notif ? "notification-icon notif" : "notification-icon"} onClick={handleNotificationClick}>
                            <IoMdNotificationsOutline className={state.notif ? "with-notif" : "without-notif"} />
                            {showNotification && (
                                <div className="notif-wrapper" ref={notificationRef} onClick={e => e.stopPropagation()}>
                                    <Notification notifications={state.notifData} />
                                </div>
                            )}
                        </div>
                    )}
                    {state.isLoggedIn && (
                        <div className="user-icon" onMouseEnter={handleUserIconHover} onMouseLeave={handleUserIconLeave}>
                            <img src="/img/userTest.png" alt="" />
                            {showDropdown && (
                                <div className="dropdown">
                                    <SettingsIcon />
                                    <HelpIcon />
                                    <UserIcon />
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
