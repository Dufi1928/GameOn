import React, { FC, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import { useGoogleLogin, GoogleResponse, GoogleLoginResponse } from '@react-oauth/google';
import { IoLockClosedOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import "../../scss/App.scss";
import 'bootstrap/dist/css/bootstrap.css';
import './Login.scss'
import GoogleButton from "../GoogleButton/Googlebutton.tsx";
import FacebookButton from "../FacebookButton/FacebookButton.tsx";

interface LoginProps {
    setShowComponent: (component: string) => void;
    setEmail: (email: string) => void;
    setFirstName: (firstName: string) => void;
    setLastName: (lastName: string) => void;
    email: string;

}

interface LoginResponse {
    jwt: string;
}

const Login: FC<LoginProps> = ({ setShowComponent, setEmail, setFirstName, setLastName, email }) => {
    const [password, setPassword] = useState<string>("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const navigate = useNavigate();

    const clearInputsErrors = () => {
        setEmailError(null);
        setPasswordError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearInputsErrors();

        try {
            const response = await axios.post<LoginResponse>("https://localhost:8000/api/login", {
                email,
                password,
            });

            document.cookie = `jwt=${response.data.jwt}; path=/`;
            navigate("/");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const data = error.response?.data;
                setEmailError(data?.email || "Email or password is incorrect");
                setPasswordError(data?.password || "Email or password is incorrect");
            }
        }
    };

    const handleSignUpClick = (userData?: any) => {
        if (userData){
            setEmail(userData.email)
            setFirstName(userData.firstName)
            setLastName(userData.lastName)
        }
        setShowComponent("signup");
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
                                emailError ? "error" : ""
                            }`}
                            placeholder={emailError || "Email"}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearInputsErrors();
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
                                clearInputsErrors();
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
                <p>Or</p>
            </div>
            <div className="googleAndFacebookLogin">
                <GoogleButton handleSignUpClick={handleSignUpClick}/>
                <FacebookButton handleSignUpClick={handleSignUpClick}/>
            </div>
            <div className='hasnt-account'>
                <p className='text-center'>
                    Pas encore de compte ?
                </p>
                <button onClick={handleSignUpClick} className='my_googleButton'>
                    Inscription
                </button>
            </div>
        </div>
    );
}
export default Login;
