import React from 'react';
import './Doubleimage.scss';

class DoubleImage extends React.Component {
    render() {
        return (
            <div className="container wrapper">
                <div className="DoubleImage">
                    <div className="imgLeft">
                        <img src="/img/frontImg/1.png" alt="" />
                    </div>
                    <div className="imgRight">
                        <img src="/img/frontImg/2.png" alt="" />
                    </div>
                </div>
            </div>
        );
    }
}

export default DoubleImage;
