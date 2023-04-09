import React from 'react';
import './DoubleImage.scss';

class TitleDescButtonsSection extends React.Component {
    render() {
        return (
            <div className="container wrapper">
                <div className="DoubleImage">
                    <div className="imgLeft">
                        <img src="https://via.placeholder.com/570x375/F2F1FA" alt=""/>
                    </div>
                    <div className="imgRight">
                        <p>hello</p>
                        <img src="https://via.placeholder.com/570x375/F9F9FF" alt=""/>
                    </div>
                </div>
            </div>
        );
    }
}

export default TitleDescButtonsSection;
