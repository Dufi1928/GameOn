import React, { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import Cookies from 'js-cookie';
import jwt_decode, { JwtPayload } from 'jwt-decode';

interface Message {
    sender: string;
    receiver: string;
    content: string;
    encrypted_content_sender: string;
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

interface MessagesPanelProps {
    setReceiverId: React.Dispatch<React.SetStateAction<string | null>>;
    setWs: React.Dispatch<React.SetStateAction<ReconnectingWebSocket | null>>;
    setNewMessage: React.Dispatch<React.SetStateAction<Message[]>>;
    searchValue: string;
}

const MessagesPanel: React.FC<MessagesPanelProps> = ({ setReceiverId, searchValue, setNewMessage, setWs,  }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userID, setUserID] = useState<string | null>(null);
    const [firstConnection, setFirstConnection] = useState<boolean | false>(false);

    useEffect(() => {
        const jwt = Cookies.get('jwt');
        if (jwt) {
            const decodedJwt: MyJwtPayload = jwt_decode(jwt);
            const userId = decodedJwt.id as string;
            setUserID(userId);
        }
    }, []);

    useEffect(() => {
        if (userID !== null) {
            const ws = new ReconnectingWebSocket(`wss://localhost:8001/ws/messages/`);
            setWs(ws);
            ws.onopen = () => {
                const messageData = { user_id: userID };
                ws.send(JSON.stringify(messageData));
            };

            ws.onmessage = (event) => {
                const messageData = JSON.parse(event.data);
                setNewMessage([messageData]);
                if (messageData) {
                    setMessages((prevMessages) => {
                        const existingMessageIndex = prevMessages.findIndex(
                            (msg) =>
                                (msg.sender_id === messageData.sender_id && msg.receiver_id === messageData.receiver_id) ||
                                (msg.sender_id === messageData.receiver_id && msg.receiver_id === messageData.sender_id)
                        );

                        // If a message from the same sender and receiver is already in state, replace it
                        if (existingMessageIndex > -1) {
                            // Un message du même expéditeur et destinataire existe déjà, nous mettons à jour le contenu
                            const updatedMessages = [...prevMessages];
                            updatedMessages[existingMessageIndex] = {
                                ...prevMessages[existingMessageIndex],
                                content: messageData.content, // Mise à jour du contenu du message
                                timestamp: messageData.timestamp, // Mise à jour du contenu du message
                            };
                            return updatedMessages;
                        } else {
                            const newMessages = Array.isArray(messageData) ? [...messageData] : [messageData];
                            return [...newMessages, ...prevMessages]; // Ajouter les nouveaux messages au début du tableau
                        }
                    });
                }
                if (!firstConnection && messageData[0]) {
                    setReceiverId(messageData[0].receiver_id !== userID ? messageData[0].receiver_id : messageData[0].sender_id);
                    setFirstConnection(true);
                }
            };

            ws.onerror = (error) => {
                console.log(`WebSocket error: ${error}`);
            };

            ws.onclose = () => {
                console.log('WebSocket connection closed');
            };

            return () => {
                ws.close();
            };
        }
    }, [userID]);


    return (
        <div className="content-box">
            {messages.filter((message) => {
                if (message) {
                    const pseudo = message.receiver_id === userID ? message.sender : message.receiver;
                    return pseudo.toLowerCase().includes(searchValue.toLowerCase());
                }
            }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).reverse().map((message, index) => (
                message && (
                    <div onClick={() => setReceiverId(message.receiver_id !== userID ? message.receiver_id : message.sender_id)} className="user-interaction" key={index}>
                        <div className="avatar">
                            <img src={message.receiver_id === userID ? message.sender_avatar : message.receiver_avatar} alt="" />
                        </div>
                        <div className="pseudo-status">
                            <div className="pseudo-status-inner">
                                <div
                                    className={`status-${message.receiver_id === userID ? message.sender_status : message.receiver_status ? 'true' : 'false'
                                    }`}
                                ></div>
                                <p className="pseudo">{message.receiver_id === userID ? message.sender : message.receiver}</p>
                            </div>
                            <p className="pseudo-status-message">{message.content.slice(0, 15)}</p>
                        </div>
                    </div>
                )
            ))}
        </div>
    );
};

export default MessagesPanel;
