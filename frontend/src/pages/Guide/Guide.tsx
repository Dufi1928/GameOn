import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../scss/App.scss';
import './Guide.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import '../../components/PhotoCarousel/PhotoCarousel.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams } from "react-router-dom";
import {MdOutlineDateRange, MdOutlineMessage} from "react-icons/md";
import PhotoCarousel from '../../components/PhotoCarousel/PhotoCarousel';

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
    author: Author;
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
    created_at: string;
    author: Author;
    cover: string;
    cover_image: string;
    content_images: string[];
    comments: Comment[];
}

const Guide: React.FC = () => {
    const [guide, setGuide] = useState<GameGuide | null>(null);
    const { id } = useParams<{id: string}>(); // accessing id from URL parameters

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                const response = await axios.get<GameGuide>("https://mygameon.pro:8000/api/guide", {
                    params: {
                        id: id // sending id as query parameter
                    },
                    withCredentials: true,
                });
                setGuide(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching guide: ", error);
            }
        };
        fetchGuide();
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'MMMM dd, yyyy');
    };


    return (
        <div className="container">
            <Header />
            <div className="unique-guide-page">
                <div>
                    <div className="photo-container">
                        <img src={guide?.cover_image} alt=""/>
                    </div>
                    <div className="title-container">
                        <h1>{guide?.title}</h1>
                        <div className="title-futter">
                            <MdOutlineDateRange className="title-futter-icon"/>
                            <span>{guide?.created_at ? formatDate(guide?.created_at) : null}</span>
                            <MdOutlineMessage className="title-futter-icon"/>
                            <span>{guide?.comments.length}</span>
                        </div>
                    </div>
                    <div className="content-container" dangerouslySetInnerHTML={guide ? { __html: guide.content } : { __html: "" }} />

                </div>
            </div>
            <div className="caroussel">
                <PhotoCarousel images={guide?.content_images || []} />
            </div>
            <div className="unique-guide-page">
                <div className="comments-container">
                    {guide?.comments.slice(-5).map((comment) => (
                        <div className="comment-container-box" key={comment.id}>
                            <div className="user-info-box">
                                <div className="comment-ava-box">
                                    <img src={comment.author.avatar} alt=""/>
                                </div>
                                <div className="pseudo-box">
                                    <h2>{comment.author.pseudo}</h2>
                                </div>
                            </div>
                            <div className="comment-box">
                                <div className="comment-content">
                                    <p>{comment.content}</p>
                                    <p className="metadata"><MdOutlineDateRange className="title-futter-icon"/> {formatDate(comment.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Guide;
