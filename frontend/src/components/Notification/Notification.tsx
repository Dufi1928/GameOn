import './Notification.scss';
import { useEffect, useState} from "react";
import axios from "axios";
import {TiUserAddOutline} from 'react-icons/ti'
import 'simplebar/dist/simplebar.min.css';

interface NotificationData {
    pseudo: string;
    id: number;
    sender: string;
}

const Notification = (props: { notifications: NotificationData[] }) => {
    const [notificationData, setNotificationData] = useState<NotificationData[]>([]);


    const senders = Array.isArray(props.notifications) ? props.notifications.map((notification) => notification.sender) : [];

    useEffect(() => {
        const sendIdsToAPI = async () => {
            try {
                const response = await axios.post('https://mygameon.pro:8000/api/pseudos', { senders });
                setNotificationData(response.data)
            } catch (error) {
                console.error(error);
            }
        };

        sendIdsToAPI();
    }, [props.notifications]);

    return (
        <div className="notification  ">
            <div className="scrollbar-container">

                {notificationData.map((notification, index) => (
                    <div className="notification-inner" key={index}>
                        <div className="user-add-box">
                            <TiUserAddOutline className="user-add-icon"/>
                        </div>
                        <div className="pseudo-box">
                            <p>
                                <b>{notification.pseudo}</b> <br/>Veux vous ajouter en amis
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notification;
