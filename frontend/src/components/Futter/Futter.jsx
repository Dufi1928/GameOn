import React, { Component } from 'react';
import './Futter.scss';

class Futter extends Component {
    data = [
        {
            title: 'Product',
            links: ['Features',
                    'Pricing',
                    'Case studies',
                    'Review',
                    'Updates'
                ],
        },
        {
            title: 'Company',
            links: ['About',
                    'ContactUs',
                    'Careers',
                    'Culture',
                    'Blog'
                ],
        },
        {
            title: 'Support',
            links: ['Getting started',
                    'Help center',
                    'Server status',
                    'Report a blog',
                    'Chat support'
                ],
        },
        {
            title: 'Downloads',
            links: ['iOS',
                    'Android',
                    'Mac',
                    'Windows',
                    'Chrome'
                ],
        },
        {
            title: 'Follow us',
            links: ['Facebook',
                    'Twitter',
                    'Instagram',
                    'Linkedin',
                    'You tube'
                ],
        },
    ];

    render() {
        return (
            <div className="futter">
                <div className="container futter-container">
                {this.data.map((column, index) => (
                    <div className="column" key={index}>
                        <h3>{column.title}</h3>
                        <ul>
                            {column.links.map((link, linkIndex) => (
                                <li key={linkIndex}>{link}</li>
                            ))}
                        </ul>
                    </div>
                ))}
                </div>
                <div className="container">
                    <hr/>
                </div>
                <div className="container logo-copyright">
                    <div className="futter-logo">
                        <h2 className="logo-top">Game</h2>
                        <h2 className="logo-bottom">On</h2>
                    </div>
                    <div className="copyright">
                        <p>Copyright © 2023 izPrey | All Rights Reserved</p>
                    </div>
                </div>
            </div>
            
        );
    }
}
export default Futter;
