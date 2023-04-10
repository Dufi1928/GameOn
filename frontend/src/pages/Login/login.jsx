import React, { useState } from "react";
import axios from "axios";
import "../../scss/App.scss";
import "./login.scss";
import { IoLockClosedOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";


import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import Futter from "../../components/Futter/Futter";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      document.cookie = `jwt=${response.data.jwt}; path=/`;
      navigate("/"); // Redirect to home page or any other page after successful login
    } catch (error) {
      setError("Email or password is incorrect");
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="login-container container">
        <div className="row loginPageContent ">
          <div className="col-7 leftSideLogin">
              <div className="login-img">
                <img
                  src="/img/login/Astronaut.svg"
                  alt="login-img"
                />
              </div>
                <div className="login_title">
                    <h3>Bienvenue à bord !</h3>
                    <p>Juste quelques clics avant de commencer !</p>
                </div>

              
          </div>
          <div className="col-5 rightSide">
            <h3>Bonjour</h3>
            <form onSubmit={handleSubmit}>
              <div className="my-form" >
                <div className=" input-icon-container">
                  <HiOutlineMail className="input-icon" />
                  <input
                    type="email"
                    className="input-with-icon"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="">
                <div className=" input-icon-container">
                  <IoLockClosedOutline className="input-icon" />
                  <input
                    type="password"
                    className=" input-with-icon"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="forgetButton">
                <a href="#"> Mot de passe oublié ? </a>
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="submit-button">
                  <button type="submit">
                    Connexion
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Futter />
    </div>
  );
}

export default Login;
