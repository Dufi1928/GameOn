import "../../scss/App.scss";
import "./Authentication.scss";
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';


import Header from "../../components/Header/Header.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import Login from "../../components/Login/Login.tsx"
import SignUp from "../../components/SignUp/SignUp.tsx"


function Authentication() {
    const [email, setEmail] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [showComponent, setShowComponent] = useState("Login");
    const [parentStep, setParentStep] = useState(1);
    // @ts-ignore
    const updateParentStep = (newStep) => {
        setParentStep(newStep);
    };


    return (
        <div className="App">
            <Header />
            <div className="login-container container">
                <div className="row loginPageContent">
                    <div className="col-7 leftSideLogin">
                        <div className="login-img">
                            <img src="/img/login/Astronaut.svg" alt="login-img" />
                        </div>
                        <div className="login_title">
                            <h3>Bienvenue à bord !</h3>
                            <p>Juste quelques clics avant de commencer !</p>
                        </div>
                        {showComponent === "signup" && (
                            <div className="pagerWraper">
                                <ul className="pager">
                                    <li onClick={() => updateParentStep(1)} className={parentStep === 1 ? "active" : ""}></li>
                                    <li onClick={() => updateParentStep(2)} className={parentStep === 2 ? "active" : ""}></li>
                                    <li onClick={() => updateParentStep(3)} className={parentStep === 3 ? "active" : ""}></li>
                                </ul>
                            </div>
                        )}
                    </div>
                    {showComponent === "signup" ? (
                        <SignUp setParentStep={setParentStep} setShowComponent={setShowComponent} handleStep={updateParentStep} step={parentStep} setEmail={setEmail} setFirstName = {setFirstName} setLastName = {setLastName} email = {email} firstName ={firstName} lastName = {lastName}/>

                    ) : (
                        <Login setShowComponent={setShowComponent} setEmail={setEmail} setFirstName = {setFirstName} setLastName = {setLastName} email = {email} firstName ={firstName} lastName = {lastName}/>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default Authentication;
