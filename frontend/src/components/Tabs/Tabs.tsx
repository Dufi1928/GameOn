import React, { useState } from 'react';
import Tab from './Tab';
import TabPanel from './TabPanel';
import './Tabs.scss';
import MessagesPanel from './MessagesPanel.tsx'
import ReconnectingWebSocket from "reconnecting-websocket";

interface TabsProps {
    setReceiverId: React.Dispatch<React.SetStateAction<string | null>>;
    setWs: React.Dispatch<React.SetStateAction<ReconnectingWebSocket | null>>;
    setNewMessage: React.Dispatch<React.SetStateAction<Message[]>>;
    searchValue: string;
}
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

const Tabs: React.FC<TabsProps> = ({ setReceiverId, searchValue,  setWs, setNewMessage }) => {
    const [activeTab, setActiveTab] = useState<string>('Tab2');

    return (
        <>
            <div className="tabs-wrapper">
                <div className="tabs">
                    <Tab  name='Server' isActive={activeTab === 'Tab1'} onClick={() => setActiveTab('Tab1')} />
                    <Tab  name='Messages' isActive={activeTab === 'Tab2'} onClick={() => setActiveTab('Tab2')} />
                    <Tab  name='Room' isActive={activeTab === 'Tab3'} onClick={() => setActiveTab('Tab3')} />
                </div>

                <div className="tab-inner">
                    <TabPanel isActive={activeTab === 'Tab1'}>
                        Hello
                    </TabPanel>
                    <TabPanel isActive={activeTab === 'Tab2'}>
                        <MessagesPanel setReceiverId={setReceiverId} searchValue={searchValue}  setWs={setWs} setNewMessage={setNewMessage} />
                    </TabPanel>
                    <TabPanel isActive={activeTab === 'Tab3'}>
                        {/* ... contenu du Tab3 ... */}
                    </TabPanel>
                </div>
            </div>
        </>
    );
}

export default Tabs;
