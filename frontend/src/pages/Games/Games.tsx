import '../../scss/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Games.scss';
import {useEffect, useState} from "react";

interface Game {
    id: number;
    title: string;
    icon: string;
    selected: boolean;
}

function Games(){

    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch('https://mygameon.pro:8000/api/games/');
                const data = await response.json();
                setGames(data as Game[]);
            } catch (error) {
                console.log(error);
            }
        };

        fetchGames();
    }, []);



    return (
        <div className="App">
            <Header />
            <div className="pageWrapper">
                <h1>Tous les jeux</h1>
                <div className="gamesList">
                    {games.map((game) => (
                        <div key={game.id} className="gameItem">
                            <img src={game.icon} alt={game.title} />
                            <h3>{game.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Games;
