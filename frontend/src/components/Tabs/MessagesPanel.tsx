import React, { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import Cookies from 'js-cookie';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { Decrypter } from '../Decrypter/Decrypter.tsx';
import axios from "axios";

interface Message {
    sender: string;
    receiver: string;
    content: string;
    encrypted_content_sender: string;
    encrypted_content_receiver: string;
    timestamp: string;
    receiver_content: string;
    sender_content: string;
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

const MessagesPanel: React.FC<MessagesPanelProps> = ({ setReceiverId, searchValue, setNewMessage, setWs }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userID, setUserID] = useState<string | null>(null);
    const [firstConnection, setFirstConnection] = useState<boolean | false>(false);
    const [myPrivateKey, setMyPrivateKey] = useState("");

    useEffect(() => {
        // Fetch the user ID from the JWT token stored in cookies
        const jwt = Cookies.get('jwt');
        if (jwt) {
            const decodedJwt: MyJwtPayload = jwt_decode(jwt);
            const userId = decodedJwt.id as string;
            setUserID(userId);
        }
    }, []);

    useEffect(() => {
        if (userID !== null) {
            // Fetch the user's private key from the server
            const fetchPrivateKey = async () => {
                try {
                    const response = await axios.post('https://mygameon.pro:8000/api/userinfo', {
                        userId: userID,
                    });
                    const myPrivateKeyResponse = response.data['private_key'];
                    setMyPrivateKey(myPrivateKeyResponse);
                } catch (error) {
                    console.error('Error calling API:', error);
                }
            };
            fetchPrivateKey();
        }
    }, [userID]);

    useEffect(() => {
        if (myPrivateKey !== null) {
            // Establish a WebSocket connection to the server
            const ws = new ReconnectingWebSocket(`wss://mygameon.pro:8001/ws/messages/`);
            setWs(ws);

            ws.onopen = () => {
                // Send the user ID to the server upon WebSocket connection
                const messageData = { user_id: userID };
                ws.send(JSON.stringify(messageData));
            };

            ws.onmessage = (event) => {
                const messageData = JSON.parse(event.data);
                console.log(messageData)
                if (messageData) {
                    // Decrypt the received messages using the user's private key
                    const decryptMessage = async (message: Message) => {
                        if (message.sender_id == userID){
                            console.log(userID)
                            console.log('cest pas mon message')
                            try {
                                message.content = await Decrypter(message.sender_content, myPrivateKey);
                                return message;
                            } catch (error) {
                                console.error('Error during decryption:', error);
                                return message;
                            }
                        }
                        else{
                            console.log(userID)
                            try {
                                message.content = await Decrypter(message.receiver_content, myPrivateKey);
                                return message;
                            } catch (error) {
                                console.error('Error during decryption:', error);
                                return message;
                            }
                        }
                    };

                    const messages = Array.isArray(messageData) ? messageData : [messageData];
                    // Decrypt and update the messages
                    Promise.all(messages.map(decryptMessage)).then(decryptedMessages => {
                        setNewMessage(decryptedMessages);
                        updateMessages(decryptedMessages);
                    });
                }

                const updateMessages = (decryptedMessages: Message[]) => {
                    setMessages((prevMessages) => {
                        const newMessages = decryptedMessages.map(decryptedMessage => {
                            const existingMessageIndex = prevMessages.findIndex(
                                (msg) =>
                                    (msg.sender_id === decryptedMessage.sender_id && msg.receiver_id === decryptedMessage.receiver_id) ||
                                    (msg.sender_id === decryptedMessage.receiver_id && msg.receiver_id === decryptedMessage.sender_id)
                            );

                            if (existingMessageIndex > -1) {
                                // If a message from the same sender and receiver is already in state, replace it with the updated content
                                const updatedMessages = [...prevMessages];
                                updatedMessages[existingMessageIndex] = {
                                    ...prevMessages[existingMessageIndex],
                                    content: decryptedMessage.content, // Update message content
                                    timestamp: decryptedMessage.timestamp,
                                };
                                return updatedMessages;
                            } else {
                                // If the message doesn't exist in state, add it to the list
                                return [...prevMessages, decryptedMessage];
                            }
                        });

                        return newMessages.flat();
                    });
                };

                if (!firstConnection && messageData.length > 0) {
                    const sortedMessages = messageData.sort((a: Message, b: Message) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                    const mostRecentMessage = sortedMessages[0];
                    setReceiverId(mostRecentMessage.receiver_id !== userID ? mostRecentMessage.receiver_id : mostRecentMessage.sender_id);
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
    }, [myPrivateKey]);

    const isMessageFromUser = (message: Message) => message.receiver_id === userID;

    return (
        <div className="content-box">
            {messages.filter((message) => {
                if (message) {
                    const pseudo = isMessageFromUser(message) ? message.sender : message.receiver;
                    return pseudo.toLowerCase().includes(searchValue.toLowerCase());
                }
            }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).reverse().map((message, index) => (
                message && (
                    <div onClick={() => setReceiverId(isMessageFromUser(message) ? message.sender_id : message.receiver_id)} className="user-interaction" key={index}>
                        <div className="avatar">
                            <img src={isMessageFromUser(message) ? message.sender_avatar : message.receiver_avatar} alt="" />
                        </div>
                        <div className="pseudo-status">
                            <div className="pseudo-status-inner">
                                <div
                                    className={`status-${isMessageFromUser(message) ? message.sender_status : message.receiver_status ? 'true' : 'false'}`}
                                ></div>
                                <p className="pseudo">{isMessageFromUser(message) ? message.sender : message.receiver}</p>
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
