import React from 'react';
import FakeLink from '../FakeLink';
import './Header.scss';
import { Link } from 'react-router-dom';


class Header extends React.Component {
    render() {
        return (
            <div className="container">
                <header>
                <nav className="nav-left ">
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
                    <Link className="navLink" to="/login">Login</Link>
                </nav>

            </header>
            </div>
        );
    }
}

export default Header;
