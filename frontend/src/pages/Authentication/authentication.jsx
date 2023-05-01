import React, { useState } from "react";
import "../../scss/App.scss";
import "./authentication.scss";
import 'bootstrap/dist/css/bootstrap.css';

import Header from "../../components/Header/Header";
import Futter from "../../components/Futter/Futter";
import Login from "../../components/Login/Login";
import SignUp from "../../components/SignUp/SignUp";

function Authentication() {

    return (
        <div className="App">
            <Header />
            <div className="login-container container">
                <div className="row loginPageContent ">
                    <div className="col-7 leftSideLogin">
                        <div className="login-img">
                            <img src="/img/login/Astronaut.svg" alt="login-img" />
                        </div>
                        <div className="login_title">
                            <h3>Bienvenue à bord !</h3>
                            <p>Juste quelques clics avant de commencer !</p>
                        </div>
                    </div>
                    {/*<Login />*/}
                    <SignUp />
                </div>
            </div>


            <Futter />
        </div>
    );
}

export default Authentication;