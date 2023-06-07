import React from 'react';
import './ImageRightContetLeft.scss';

class ImageRightContetnLeft extends React.Component {
    render() {
        return (
            <div className="container-fluid twoSideWrapper mw-80">
                <div className="left-side col-6">
                    <h3 className="left-title">
                        Boost your productivity with our to-do app
                    </h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam.
                    </p>
                    <div className="home-buttons">
                        <button className="purpleButton">
                            Get started
                        </button>
                        <button className="white-button">
                            Talk to sales
                        </button>
                    </div>
                </div>
                <div className="right-side col-6">
                    <div className="right-image">
                        <img src="/img/frontImg/4.png" alt="" />
                    </div>
                </div>
            </div>
        );
    }
}

export default ImageRightContetnLeft;
