import React, { useState } from "react";
import axios from "axios";
import "../../scss/App.scss";
import "./Login.scss";
import { IoLockClosedOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import 'bootstrap/dist/css/bootstrap.css';

import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import FacebookLogin from 'react-facebook-login';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const clearEmailError = () => {
        setEmailError("");
    };

    const responseFacebook = async (response) => {
        if (response) {
            if (response.accessToken) {
                try {
                    console.log("Posting to server...");
                    const serverResponse = await axios.post("http://localhost:8000/api/facebook-login", {
                        access_token: response.accessToken,
                        provider: "facebook",
                    });
                    console.log(serverResponse);

                    // Save JWT token to a cookie and navigate to the homepage
                    document.cookie = `jwt=${serverResponse.data.jwt}; path=/`;
                    navigate("/");

                } catch (error) {
                    console.log("Facebook Authentication Error:", error);
                }
            }
        }
    };

    const googleLogin = useGoogleLogin({
    // onSuccess is called when the Google API returns a successful response
    onSuccess: async (response) => {
        console.log("Google API Response:", response);

        // Check if there's a response
        if (response) {
            if (response.access_token) {
                try {
                    console.log("Posting to server...");

                    // Send the access_token to the server
                    const serverResponse = await axios.post("http://localhost:8000/api/google-login", {
                        access_token: response.access_token,
                        provider: "google",
                    });
                    console.log("Server Response:", serverResponse);

                    // Save JWT token to a cookie and navigate to the homepage
                    document.cookie = `jwt=${serverResponse.data.jwt}; path=/`;
                    navigate("/");
                } catch (error) {
                    console.log("Google Authentication Error:", error);
                    // Handle the error from your server or display a message
                }
            } else {
                console.log("Google Authentication Error:", response);
                // Handle the error or display a message
            }
        } else {
            console.log("No response from Google API.");
            // Handle the case when there's no response or display a message
        }
    },

    // onFailure is called when the Google API returns an error response
    onFailure: (error) => {
        console.log("Google Authentication Error12:", error);
        // Handle the error or display a message
    },
});
    const clearPasswordError = () => {
        setPasswordError("");
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");

        try {
            const response = await axios.post("http://localhost:8000/api/login", {
                email,
                password,
            });

            document.cookie = `jwt=${response.data.jwt}; path=/`;
            navigate("/");
        } catch (error) {
            setEmailError("Le email incorrect");
            setPasswordError("Mot de passe incorrect");

            if (error.response && error.response.data) {
                if (error.response.data.email) {
                    setEmailError(error.response.data.email);
                }
                if (error.response.data.password) {
                    setPasswordError(error.response.data.password);
                }
            } else {
                setEmailError("Email or password is incorrect");
                setPasswordError("Email or password is incorrect");
            }
        }
    };

    return (
        <div className="col-5 rightSide">
                        <h3>Bonjour</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="my-form">
                                <div className="input-icon-container">
                                    <HiOutlineMail className="input-icon" />
                                    <input
                                        type="email"
                                        className={`input-with-icon ${
                                            emailError ? "error" : "Email Incorrect"
                                        }`}
                                        placeholder={emailError || "Email"}
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            clearEmailError();
                                        }}
                                        required
                                    />
                                    {emailError && (
                                        <div className="error-message">{emailError}</div>
                                    )}
                                </div>
                            </div>
                            <div className="my-form">
                                <div className="input-icon-container">
                                    <IoLockClosedOutline className="input-icon" />
                                    <input
                                        type="password"
                                        className={`input-with-icon ${passwordError ? "error" : ""}`}
                                        placeholder={passwordError || "Password"}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            clearPasswordError();
                                        }}
                                        required
                                    />
                                    {passwordError && (
                                        <div className="error-message">{passwordError}</div>
                                    )}
                                </div>
                            </div>
                            <div className="forgetButton">
                                <a href="http://localhost:3000/Blog"> Mot de passe oublié ? </a>
                            </div>
                            <div className="submit-button">
                                <button type="submit">Connexion</button>
                            </div>
                        </form>
                        <div className="orLine">
                            <p>
                                Or
                            </p>

                        </div>
                        <div className="googleAndFacebookLogin">
                            <button className="my_googleButton" onClick={() => googleLogin()}>
                                <FcGoogle size={24} /> Google
                            </button>
                            <FacebookLogin
                                appId="939219304145680"
                                fields="name,email,picture"
                                callback={responseFacebook}
                                cssClass="my_googleButton"
                                icon={<FaFacebook className="icon" size={24}  />}
                                textButton="Facebook"
                            />
                        </div>
                        <div className='hasnt-account'>
                            <p className='text-center'>
                                Pas encore de compte ?
                            </p>
                            <button className='my_googleButton'>
                                Inscription
                            </button>
                        </div>
                    </div>
    );
}

export default Login;