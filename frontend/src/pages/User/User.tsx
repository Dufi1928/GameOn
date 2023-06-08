import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../scss/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './User.scss';
import { useParams, useNavigate } from 'react-router-dom';

interface UserParams {
    [key: string]: string | undefined;
}

interface Game {
    icon: string;
}

interface UserData {
    favorite_games: Game[];
    id: number;
    small_size_avatar: string;
    big_size_avatar: string;
    short_description: string;
    username: string;
    pseudo: string;
    email: string;
}

function User() {
    const { id } = useParams<UserParams>();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [favoriteGameIcons, setFavoriteGameIcons] = useState<string[] | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            axios.get(`https://localhost:8000/api/user-detail/${id}`)
                .then((response) => {
                    setUserData(response.data);
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
                });
        }

    }, [id]);

    useEffect(() => {
        if (userData && userData.favorite_games) {
            const gameIcons = userData.favorite_games.map(game => game.icon);
            setFavoriteGameIcons(gameIcons);
        }
    }, [userData]);


    const sendFriendRequest = (user_id: number) => {
        axios.defaults.withCredentials = true;
        axios.post('https://localhost:8000/api/friend-request', { user_id })
            .then((response) => {
                console.log('Demande d\'ami envoyée avec succès'+ response);
                // Ajoutez ici le code pour gérer la réponse de la requête si nécessaire
            })
            .catch((error) => {
                console.error('Erreur lors de l\'envoi de la demande d\'ami :', error);
                // Ajoutez ici le code pour gérer l'erreur de la requête si nécessaire
            });
    };
    const goMessage = (id: number) => {
        if (id) {
            navigate(`/messages/${id}`);
        }
    };


    return (
        <div className="App">
            <Header />
            <div className="container my-user-page-wrapper">
                {userData &&
                    <>
                        <div className="user-ava-games">
                            <div className="avatar">
                                <img src={userData.small_size_avatar} alt="" />
                            </div>
                            <div className="games">
                                <div className="games-inner">
                                    {favoriteGameIcons && favoriteGameIcons.map((icon, index) => (
                                        <div className="game" key={index}>
                                            <img className="game-icon" src={icon} alt="game icon" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="user-info">
                            <div className="pseudo-with-buttons">
                                <div className="pseudo">{userData.pseudo}</div>
                                <div className="buttons">
                                    <button className="ms-button" onClick={() => goMessage(userData.id)}>
                                        Message
                                    </button>
                                    <button className="room-button">
                                        Room
                                    </button>
                                </div>
                            </div>
                            <div className="user-add" onClick={() => sendFriendRequest(userData.id)}>
                                + Ajouter à la friendlist
                            </div>
                            <div className="user-desc">
                                <p>{userData.short_description}</p>
                            </div>
                        </div>
                    </>
                }
            </div>

            <Footer />
        </div>
    );
}

export default User;
