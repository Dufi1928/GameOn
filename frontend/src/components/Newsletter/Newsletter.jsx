import React from 'react';
import './Newsletter.scss';


class Newsletter extends React.Component {
    render() {
        return (
            <div className="container w-100 d-flex justify-content-center">
                <div className="newsletter-wrapper">
                    <form action="#">
                        <h3 className="newsletter-title">
                            Subscribe to our newsletter
                        </h3>
                        <input type="text" placeholder="Enter your email"/>
                        <button>
                            Suscribe
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Newsletter;
