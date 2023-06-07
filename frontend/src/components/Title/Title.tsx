import React from 'react';
import './Title.scss';

interface TitleProps {
    title: string;
}

class Title extends React.Component<TitleProps> {
    render() {
        return (
            <div className="container">
                <div className="title">
                    <h1 className="title">
                        {this.props.title}
                    </h1>
                </div>
            </div>
        );
    }
}

export default Title;
