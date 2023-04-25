import '../../scss/App.scss';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header/Header';
import Futter from '../../components/Futter/Futter';
function Games() {
    return (
        <div className="App">
            <Header/>
            <Futter/>
        </div>
    );
    }
export default Games;
