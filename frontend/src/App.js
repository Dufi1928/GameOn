import './scss/App.scss';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/home';
import Login from './pages/Login/login';
import Blog from './pages/Blog/blog';
import SignUp from './pages/Sign Up/signUp';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/blog" element={<Blog />} />
            </Routes>
        </Router>
    );
    }
export default App;
