import React from 'react';
import './Title.scss';
class Title extends React.Component {
    
    render() {
        return (
            <div className="container">
                <div className="title">
                    <h1 className="title">
                        {this.props.title}
                    </h1>
                </div>
            </div>
        )
    }
}

export default Title;
