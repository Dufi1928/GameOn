import { FC, ReactNode } from 'react';

interface TabPanelProps {
    isActive: boolean;
    children: ReactNode;
}

const TabPanel: FC<TabPanelProps> = ({ isActive, children }) => {
    return (
        <div className={`tab-panel ${isActive ? 'active' : ''}`}>
            {children}
        </div>
    );
}

export default TabPanel;
