import { useState, useEffect, FC } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import '../../scss/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header/Header.tsx';
import Footer from '../../components/Footer/Footer.tsx';
import "./Friends.scss"
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


interface Friend {
    id: number;
    username: string;
    email: string;
    pseudo: string;
    online: boolean;
    age: number;
    gender: boolean;
    big_size_avatar: string;
}

interface DecodedJWT {
    id: number;
}

const Friends: FC = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [userId, setUserId] = useState<number | null>(null);

    const navigate = useNavigate();

    const handleCardClick = (id: number) => {
        navigate(`/user/${id}`);
    };


    useEffect(() => {
        const token = Cookies.get('jwt');
        if (token) {
            const decodedToken = jwt_decode<DecodedJWT>(token);
            setUserId(decodedToken.id);
            console.log('hello')
            console.log(userId)
        }
    }, []);

    useEffect(() => {
        if (userId) {
            console.log(`Récupération des amis pour l'ID utilisateur : ${userId}`);
            axios.post(`https://localhost:8000/api/friends`, { user_id: userId })
                .then(response => {
                    setFriends(response.data);
                })
                .catch(error => {
                    console.error('Une erreur s\'est produite lors de la récupération des amis !', error.response || error);
                });
        }
    }, [userId]);

    return (
        <div className="App">
            <Header/>
            <div className="pageWrapper">
                {friends.map(friend => (
                    <div className="userCard"  key={friend.id}  onClick={() => handleCardClick(friend.id)}>
                        <p className="pseudo">{friend.pseudo}</p>
                        <div className="hoverBox">
                            <p >{friend.pseudo}</p>
                            {friend.gender ? <p>Homme</p> : <p>Femme</p>}
                            <p >{friend.age}</p>
                        </div>
                        {friend.online ? <p className="status">Connecté</p> : <p className="status">offline</p>}
                        <img src={friend.big_size_avatar} alt=""/>
                    </div>
                ))}
            </div>
            <Footer/>
        </div>
    );
}

export default Friends;
