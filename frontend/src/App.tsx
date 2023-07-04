import './scss/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import Authentication from './pages/Aauthentication/Authentication.tsx';
import BlogList from './pages/BlogList/BlogList.tsx';
import Blog from './pages/Blog/Blog.tsx';
import Games from './pages/Games/Games';
import Contact from './pages/Contact/Contact.tsx';
import Guides from './pages/Guides/Guides.tsx';
import Guide from './pages/Guide/Guide.tsx';
import Messages from './pages/Messages/Messages.tsx';
import Friends from './pages/friends/Friends.tsx';
import User from './pages/User/User.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Authentication />} />
                <Route path="blog" element={<BlogList />} />
                <Route path="guides" element={<Guides />} />
                <Route path="guide/:id" element={<Guide />} />
                <Route path="blog/:id" element={<Blog />} />
                <Route path="games" element={<Games />} />
                <Route path="/messages/:id?" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="contact" element={<Contact />} />
                <Route  path="friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
                <Route  path="user/:id" element={<ProtectedRoute><User /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
