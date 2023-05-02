import './scss/App.scss';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/home';
import Authentication from './pages/Authentication/authentication';
import Blog from './pages/Blog/blog';
import Games from './pages/Games/Games';
import Contact from './pages/Contact/Contact';
import About from './pages/About/About';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Authentication />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/games" element={<Games />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </Router>
    );
    }
export default App;
