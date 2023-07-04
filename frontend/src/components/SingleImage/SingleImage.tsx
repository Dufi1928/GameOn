import React from 'react';
import './SingleImage.scss';

class SingleImage extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="largeImage">
                    <img src="/img/frontImg/3.png" alt="" />
                </div>
            </div>
        );
    }
}

export default SingleImage;
