import './scss/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import Authentication from './pages/Aauthentication/Authentication.tsx';
import Blog from './pages/Blog/Blog.tsx';
import Games from './pages/Games/Games';
import Contact from './pages/Contact/Contact';
import Messages from './pages/Messages/Messages.tsx';
import Friends from './pages/friends/Friends.tsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Authentication />} />
                <Route path="blog" element={<Blog />} />
                <Route path="games" element={<Games />} />
                <Route path="messages" element={<Messages />} />
                <Route path="contact" element={<Contact />} />
                <Route path="friends" element={<Friends />} />
            </Routes>
        </Router>
    );
}

export default App;
