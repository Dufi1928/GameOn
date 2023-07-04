import  { FC, useState, useEffect } from "react";
import "../../scss/App.scss";
import "./SignUp.scss";
import { IoLockClosedOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import 'bootstrap/dist/css/bootstrap.css';
import GoogleButton from "../GoogleButton/Googlebutton.tsx";
import FacebookButton from "../FacebookButton/FacebookButton.tsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SignUpProps {
    setParentStep: (step: number) => void;
    setShowComponent: (component: string) => void;
    handleStep: (newStep: number) => void;
    setFirstName: React.Dispatch<React.SetStateAction<string>>;
    setLastName: React.Dispatch<React.SetStateAction<string>>;
    jwt?: string; // Made optional
    step?: number | null;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    initialEmail?: string; // Made optional
    email: string;
    firstName: string;
    lastName: string;
    initialFirstName?: string; // Made optional
    initialLastName?: string; // Made optional
}


interface Game {
    id: number;
    title: string;
    icon: string;
    selected: boolean;
}

const SignUp: FC<SignUpProps> = ({ setParentStep, step = null, initialEmail, initialFirstName, initialLastName }) => {
    const [firstName, setFirstName] = useState<string>(initialFirstName || "");
    const [lastName, setLastName] = useState<string>(initialLastName || "");
    const [pseudo, setPseudo] = useState<string>("");
    const [email, setEmail] = useState<string>(initialEmail || "");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [pseudoError, setPseudoError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [games, setGames] = useState<Game[]>([]);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [selectedGamesCount, setSelectedGamesCount] = useState<number>(0);
    const [selectedGamesIds, setSelectedGamesIds] = useState<Array<number>>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch('https://mygameon.pro:8000/api/games/');
                const data = await response.json();
                setGames(data as Game[]);
            } catch (error) {
                console.log(error);
            }
        };

        fetchGames();
    }, []);

    const handleSignUpClick = (userData?: any) => {
        if (userData) {
            console.log(userData);
            // setEmail(userData.email);
            // setFirstName(userData.firstName);
            // setLastName(userData.lastName);
        }
    };

    const clearEmailError = () => {
        setEmailError("");
    };
    const clearPseudoError = () => {
        setPseudoError("");
    };
    const clearPasswordError = () => {
        setPasswordError("");
    };

    const handleNextStep = async () => {
        try {
            const response = await axios.post<SignUpProps>(
                "https://mygameon.pro:8000/api/CheckIfUserExist",
                {
                    email,
                    pseudo,
                    password,
                }
            );
            console.log(response);
            if (step && step < 3) {
                if (password !== confirmPassword) {
                    setPasswordError("The passwords must be identical");
                } else {
                    setParentStep(step + 1);
                }
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const data = error.response?.data;

                if (data.error_email === "User with this email already exists" && data.error_pseudo === "User with this pseudo already exists") {
                    setEmailError(data?.email || "User with this email already exists");
                    setPseudoError(data?.pseudo || "User with this pseudo already exists");
                } else if (data.error_email === "User with this email already exists") {
                    setEmailError(data?.email || "User with this email already exists");
                } else if (data.error_pseudo === "User with this pseudo already exists") {
                    setPseudoError(data?.pseudo || "User with this pseudo already exists");
                } else if (password !== confirmPassword) {
                    setPasswordError("The passwords must be identical");
                }
            }
        }
    };

    const handlePreviousStep = () => {
        if (step && step > 1) {
            setParentStep(step - 1);
        }
    };
    const handleGameSelection = (gameIndex: number) => {
        const updatedGames = [...games];
        const selectedGames = updatedGames.filter((game) => game.selected);
        const selectedTemporaryGamesIds = selectedGames.map((game) => game.id);
        setSelectedGamesIds(selectedTemporaryGamesIds);

        if (
            selectedGames.length === 5 &&
            !updatedGames[gameIndex].selected
        ) {
            return;
        }
        updatedGames[gameIndex].selected = !updatedGames[gameIndex].selected;
        setGames(updatedGames);

        const mySelectedGamesCount = updatedGames.filter((game) => game.selected).length;
        setSelectedGamesCount(mySelectedGamesCount);
    };
    const hendelRegister = async () => {
        try {
            const response = await axios.post<SignUpProps>(
                "https://mygameon.pro:8000/api/Register",
                {
                    firstName,
                    lastName,
                    email,
                    pseudo,
                    password,
                    selectedGamesIds,
                }
            );
            document.cookie = `jwt=${response.data.jwt}; path=/`;
            if (response.data.jwt) {
                localStorage.setItem('jwt', response.data.jwt);
            }
            navigate("/");
        } catch (error: unknown) {
            setParentStep(1);
            console.log(error);
        }
    };


    return (
        <div className="col-5 rightSide">
            <h3>Bonjour</h3>
            {step === 1 && (
                <>
                    <div className="my-form">
                        <div className="input-icon-container">
                            <input
                                className={`input-without-icon`}
                                placeholder="Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="my-form">
                        <div className="input-icon-container">
                            <input
                                className={`input-without-icon`}
                                placeholder="Surname"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="my-form">
                        <div className="input-icon-container">
                            <input
                                className={`input-without-icon ${pseudoError ? "error" : ""}`}
                                placeholder={pseudoError || "Pseudo"}
                                value={pseudo}
                                onChange={(e) => {
                                    setPseudo(e.target.value);
                                    clearPseudoError();
                                }}
                                required
                            />
                            {pseudoError && (
                                <div className="error-message">{pseudoError}</div>
                            )}
                        </div>
                    </div>
                    <div className="my-form">
                        <div className="input-icon-container">
                            <HiOutlineMail className="input-icon" />
                            <input
                                type="email"
                                className={`input-with-icon ${emailError ? "error" : ""}`}
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
                    <div className="input-icon-container">
                        <IoLockClosedOutline className="input-icon" />
                        <input
                            type={passwordVisible ? "text" : "password"}
                            className={`input-with-icon ${passwordError ? "error" : ""}`}
                            placeholder={passwordError || "Password"}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                clearPasswordError();
                            }}
                            required
                        />
                        <div
                            className="eye-icon-container"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? (
                                <AiOutlineEyeInvisible className="eye-icon" />
                            ) : (
                                <AiOutlineEye className="eye-icon" />
                            )}
                        </div>
                        {passwordError && (
                            <div className="error-message">{passwordError}</div>
                        )}
                    </div>
                    <div className="my-form">
                        <div className="input-icon-container">
                            <IoLockClosedOutline className="input-icon" />
                            <input
                                type={confirmPasswordVisible ? "text" : "password"}
                                className={`input-with-icon ${
                                    passwordError ? "error" : ""
                                }`}
                                placeholder={passwordError || "Confirm Password"}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    clearPasswordError();
                                }}
                                required
                            />
                            <div
                                className="eye-icon-container"
                                onClick={() =>
                                    setConfirmPasswordVisible(!confirmPasswordVisible)
                                }
                            >
                                {confirmPasswordVisible ? (
                                    <AiOutlineEyeInvisible className="eye-icon" />
                                ) : (
                                    <AiOutlineEye className="eye-icon" />
                                )}
                            </div>
                            {passwordError && (
                                <div className="error-message">{passwordError}</div>
                            )}
                        </div>
                    </div>
                    <div className="submit-button">
                        <button onClick={handleNextStep} type="submit">
                            Next
                        </button>
                    </div>
                </>
            )}
            {step === 1 && (
                <>
                    <div className="orLine">
                        <p>Déjà un compte ?</p>
                    </div>
                    <div className="googleAndFacebookLogin">
                        <GoogleButton handleSignUpClick={handleSignUpClick} />
                        <FacebookButton handleSignUpClick={handleSignUpClick} />
                    </div>
                </>
            )}
            {step === 2 && (
                <>
                    <div className="chosegame">
                        {games.slice(0, 15).map((game, index) => (
                            <div
                                className={`game ${game.selected ? "selected" : ""}`}
                                onClick={() => handleGameSelection(index)}
                                key={game.id}
                            >
                                <img src={game.icon} alt={game.title} />
                            </div>
                        ))}
                    </div>
                    <div className="submit-button">
                        <button
                            onClick={handlePreviousStep}
                            className="step_button"
                            type="submit"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextStep}
                            className="step_button"
                            type="submit"
                            disabled={selectedGamesCount === 0 || selectedGamesCount > 5}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
            {step === 3 && (
                <>
                    <div className="verifContainer">
                        <div className="d-flex verifData">
                            <h4>
                                Name: <span>{firstName}</span>
                            </h4>
                        </div>
                        <div className="d-flex verifData">
                            <h4>
                                Surname: <span>{lastName}</span>
                            </h4>
                        </div>
                        <div className="d-flex verifData">
                            <h4>
                                Email: <span>{email}</span>
                            </h4>
                        </div>
                        <div className="d-flex verifData">
                            <h4>
                                Pseudo: <span>{pseudo}</span>
                            </h4>
                        </div>
                        <div className="verifChosegame">
                            {games
                                .filter((game) => game.selected)
                                .map((game) => (
                                    <div className="verifGame" key={game.id}>
                                        <img src={game.icon} alt={game.title} />
                                    </div>
                                ))}
                        </div>
                        <div className="submit-button">
                            <button onClick={hendelRegister} type="submit">
                                Create Account
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SignUp;
