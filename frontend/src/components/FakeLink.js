import React, { Component } from 'react';

class FakeLink extends Component {
    handleClick(e) {
        e.preventDefault();
    }

    render() {
        const { children, ...rest } = this.props;
        return (
            <button className="navLink" onClick={(e) => this.handleClick(e)} {...rest}>
                {children}
            </button>
        );
    }
}

export default FakeLink;
