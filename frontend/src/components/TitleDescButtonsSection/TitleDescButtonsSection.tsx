import React from 'react';
import './TitleDescButtonsSection.scss';
import Title from '../Title/Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

class TitleDescButtonsSection extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="TitleDescButtonsSection">
                    <Title title="A dedicated team to grow your company" />
                    <p className="short-description">Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam neque ultrices.</p>
                    <div className="home-buttons">
                        <button className="purpleButton">
                            Get started
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                        <button className="white-button">
                            Talk to sales
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default TitleDescButtonsSection;
