import React from 'react';
import './SingleImage.scss';


class SingleImage extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="largeImage">
                    <img src="https://via.placeholder.com/800x405/F9F9FF" alt=""/>
                </div>
            </div>
        )
    }
}

export default SingleImage;
