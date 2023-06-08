import '../../scss/App.scss';
import './Messages.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AudioRecorder from '../../components/AudioRecorder/AudioRecorder';
import Tabs from '../../components/Tabs/Tabs';
import { IoSearch } from "react-icons/io5";
import { FiPhoneCall } from "react-icons/fi";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { FaRegPlusSquare } from "react-icons/fa";
import { format, formatDistanceToNow, parse, parseISO,addHours} from 'date-fns';
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import jwt_decode, { JwtPayload } from "jwt-decode";
import ReconnectingWebSocket from "reconnecting-websocket";
import Cookies from "js-cookie";
import { fr } from 'date-fns/locale';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import InputEmoji from 'react-input-emoji'

interface InterlocutorData {
    id: number;
    name: string;
    online: boolean;
    small_size_avatar: string;
    pseudo: string;
}

interface Message {
    sender: string;
    receiver: string;
    content: string;
    timestamp: string;
    read: boolean;
    sender_status: boolean;
    receiver_status: boolean;
    status: boolean;
    sender_avatar: string;
    receiver_avatar: string;
    receiver_id: string;
    sender_id: string;
}

interface MyJwtPayload extends JwtPayload {
    id?: string;
}

const Messages: React.FC = () => {
    const [receiverId, setReceiverId] = useState<string | null>(null);
    const [interlocutorData, setInterlocutorData] = useState<InterlocutorData | null>(null);
    const [ws, setWs] = useState<ReconnectingWebSocket | null>(null);
    const [messageText, setMessageText] = useState('');
    const [userID, setUserID] = useState<string | null>(null);
    const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<Message[]>([]);
    const messagesBoxRef = useRef<null | HTMLDivElement>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [firstConnect, setFirstConnect] = useState<boolean | true>(true);
    const { id } = useParams();
    const [searchValue, setSearchValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleSendMessage = () => {
        if (ws && receiverId && userID) {
            const messageToSend = {
                sender_id: userID,
                receiver_id: receiverId,
                content: messageText,
            };
            ws.send(JSON.stringify(messageToSend));
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current && messagesBoxRef.current) {
            const scrollHeight = messagesEndRef.current.offsetTop;
            messagesBoxRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const jwt = Cookies.get('jwt');
        if (jwt) {
            const decodedJwt: MyJwtPayload = jwt_decode(jwt);
            const userId = decodedJwt.id as string;
            setUserID(userId);
        }
        const elements = document.querySelectorAll('.react-input-emoji--button--icon');

        elements.forEach((element) => {
            element.classList.add('icon');
        });

        const buttonElement = document.querySelector('.react-input-emoji--button');

        const containerElement = document.querySelector('.react-input-emoji--container');

        if (buttonElement && containerElement) {
            // Insérer le bouton avant le conteneur dans le DOM
            if (containerElement.parentNode) {
                containerElement.parentNode.insertBefore(buttonElement, containerElement);
            }
        }
    }, []);

    useEffect(() => {
        if (firstConnect && id && receiverId) {
            setReceiverId(id);
            setFirstConnect(false);
        }
    }, [firstConnect, id, receiverId]);

    useEffect(() => {
        scrollToBottom();
        console.log(currentMessages)
    }, [currentMessages]);

    useEffect(() => {
        const toloadM = newMessage[0];

        if (toloadM) {
            const originalFormat = "yyyy-MM-dd HH:mm:ss";
            const newFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";

            const date = parse(toloadM.timestamp, originalFormat, new Date());

            if (!isNaN(date.getTime())) { // Vérifier si la date est valide
                const updatedDate = addHours(date, 2); // Ajouter 2 heures à la date

                const formattedTimestamp = format(updatedDate, newFormat);
                setCurrentMessages(prevMessages => [...prevMessages, { ...toloadM, timestamp: formattedTimestamp }]);
            } else {
                console.log('Invalid timestamp');
            }
        } else {
            console.log('toloadM is undefined');
        }
    }, [newMessage]);

    useEffect(() => {
        const fetchData = async () => {
            if (receiverId) {
                try {
                    const response = await axios.post('https://localhost:8000/api/reciverData', {
                        reciver_id: receiverId,
                    });
                    setInterlocutorData(response.data);
                } catch (error) {
                    console.error('Erreur lors de l\'appel à l\'API:', error);
                }
            }
        };

        fetchData();
    }, [receiverId]);


    useEffect(() => {
        if (interlocutorData) {
            const fetchMessages = async () => {
                try {
                    const response = await axios.post('https://localhost:8000/api/get-messages', {
                        interlocutor_id: interlocutorData.id
                    });
                    const messages = response.data.results;
                    setCurrentMessages(messages);
                } catch (error) {
                    console.error('Erreur lors de la récupération des messages:', error);
                }
            };

            fetchMessages();
        }
    }, [interlocutorData]);

    return (
        <div className="MessagesPage">
            <Header />
            <div className="message-page">
                <div className="page-inner">
                    <div className="messages-left-side">
                        <div className="message-searsh">
                            <IoSearch className="input-icon"  />
                            <input className="searsh" onChange={handleChange} placeholder="Search or start a new chat" type="text" />
                            <div className="tabs">
                                <Tabs setReceiverId={setReceiverId} searchValue={searchValue} setNewMessage={setNewMessage} setWs={setWs} />
                            </div>
                        </div>
                    </div>
                    <div className="messages-rig-side">
                        <div className="messages-rig-side-header">
                            <div className="user-box">
                                <div className="avatar">
                                    <img src={interlocutorData?.small_size_avatar} alt="" />
                                </div>
                                <div className="pseudo-and-status">
                                    <div className="ms-pseudo">
                                        <p>{interlocutorData?.pseudo}</p>
                                    </div>
                                    <div className="ms-status">
                                        <div className="ms-online">
                                            <div className={`dot ${interlocutorData?.online ? 'dot-online' : 'dot-offline'}`}></div>
                                            <div className="status-status">
                                                {interlocutorData?.online ? (
                                                    <p>Online</p>
                                                ) : (
                                                    <p>Offline</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="contact-box">
                                <FiPhoneCall className="phone-icon" />
                                <div className="video-icon-box">
                                    <HiOutlineVideoCamera className="vide-icon" />
                                </div>
                            </div>
                        </div>
                        <div className="messages-rig-side-messages-box" ref={messagesBoxRef}>
                            <div className="content">
                                {currentMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((message, index) => (
                                    <div
                                        key={index}
                                        ref={index === currentMessages.length - 1 ? messagesEndRef : null}
                                        className={`message-item ${message.sender_id === userID ? 'my-message' : 'their-message'}`}
                                    >
                                        <div className="message-content">
                                            {message.content}
                                        </div>
                                        {index === currentMessages.length - 1 && (
                                            <div className="message-timestamp">
                                                {formatDistanceToNow(parseISO(message.timestamp), { locale: fr, addSuffix: true })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="messages-rig-side-footer">
                            <div className="icons">
                                <FaRegPlusSquare className="icon" />
                            </div>
                            <div className="input-wrapper">
                                <InputEmoji
                                    value={messageText}
                                    onChange={setMessageText}
                                    cleanOnEnter
                                    onEnter={handleSendMessage}
                                    placeholder="Type a message"
                                />
                            </div>
                            <div className="micro">
                                <AudioRecorder />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Messages;
