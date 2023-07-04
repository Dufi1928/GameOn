import React, { useState, useEffect } from "react";
import '../../scss/App.scss';
import './Guides.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import ReactHtmlParser from 'react-html-parser';
import {IoSearch} from "react-icons/io5";
import {useNavigate} from "react-router-dom";

interface Author {
    pseudo: string;
    avatar: string;
}
interface Game {
    id: number;
    title: string;
    icon: string;
}


interface Comment {
    id: number;
    author: Author[];
    content: string;
    created_at: string;
}

interface GameGuide {
    id: number;
    title: string;
    game: Game;
    content: string;
    description: string;
    steps: string[];
    author: Author;
    cover: string;
    cover_image: string;
    content_photos: string[];
    comments: Comment[];
}

const Guides: React.FC = () => {
    const [guides, setGuides] = useState<GameGuide[]>([]);
    const [searchValue, setVearchValue] =useState<string>("");
    const navigate = useNavigate();
    const handleGudeClick = (id: number) => {
        navigate(`/guide/${id}`);
    };

    const filteredGuides = guides.filter((guide: GameGuide) => {
        const lowercaseSearchValue = searchValue.toLowerCase();
        const lowercaseTitle = guide.title.toLowerCase();
        const lowercaseContent = guide.content.toLowerCase();

        return lowercaseTitle.includes(lowercaseSearchValue) || lowercaseContent.includes(lowercaseSearchValue);
    });

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await axios.get<GameGuide[]>("https://mygameon.pro:8000/api/guides");
                setGuides(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching guides: ", error);
            }
        };
        fetchGuides();
    }, []);

    const truncateContent = (content: string, maxLength: number) => {
        if (content.length > maxLength) {
            return content.substring(0, maxLength) + "...";
        }
        return content;
    };
    console.log(truncateContent)
    return (
        <>
            <Header />
            <div className="container guide-page-wrapper">
                <div className="game-logo-searsh">
                    <div className="game-logo">
                        {filteredGuides.length > 0 && (
                            <img src={filteredGuides[0].game.icon} alt="" />
                        )}
                    </div>
                    <div className="gude-searsh">
                        <IoSearch className="input-icon"  />
                        <input
                            className="searsh"
                            type="text"
                            placeholder="Search for..."
                            onChange={(e) => setVearchValue(e.target.value)}
                        />
                    </div>
                </div>


                {filteredGuides.map((guide: GameGuide) => (
                    <div className="guide-container" onClick={() => handleGudeClick(guide.id)} key={guide.id}>
                        <div className="guide-image-box">
                            <img src={guide.cover_image} alt="" />
                        </div>
                        <div className="guide-title-content">
                            <h2>{guide.title}</h2>
                            {/*<p>{ReactHtmlParser(truncateContent(guide.content, 250))}</p>*/}
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
};

export default Guides;
