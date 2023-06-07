import { FC } from 'react';

interface TabProps {
    name: string;
    isActive: boolean;
    onClick: () => void;
}

const Tab: FC<TabProps> = ({ name, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`tab-button ${isActive ? 'active' : ''}`}
        >
            {name}
        </button>
    );
}

export default Tab;
