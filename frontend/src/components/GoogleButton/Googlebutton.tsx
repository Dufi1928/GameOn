import {FC, useState} from "react";
// @ts-ignore
import {GoogleLoginResponse, useGoogleLogin} from '@react-oauth/google';
import {FcGoogle} from 'react-icons/fc';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const client_Id = "799631150296-rgsacnb85t05u6tl0uv2mfd0anpsrlq4.apps.googleusercontent.com";

interface GoogleButtonProps {
    handleSignUpClick: (userData: any) => void;
}

const GoogleButton: FC<GoogleButtonProps> = ({ handleSignUpClick }) => {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [loginError, setError] = useState<string | null>(null);

    const login = useGoogleLogin({
        clientId: client_Id,
        responseType: 'code',
        onSuccess: (response: GoogleLoginResponse) => {
            console.log("Code Response: ", response);
            if (response.code) {
                setLoading(true);
                setError(null);
                axios
                    .post('https://localhost:8000/api/google-login', { code: response.code, provider: 'google'})
                    .then((response) => {
                        const user = response.data.user;
                        console.log(response);
                        console.log(user.found);
                        if (user.found === 'false') {
                            console.log('User not found condition has been met');
                            handleSignUpClick(user);
                            console.log('hello');
                        }
                        else if (user.found === 'true') {
                            console.log('User found, logging in...');
                            document.cookie = `jwt=${response.data.user.jwt}; path=/;`;
                            localStorage.setItem('jwt', response.data.user.jwt);
                            console.log(response.data.user)
                            navigate("/");
                        }
                    })
                    .catch((error) => {
                        setError("Login failed: " + error);
                        console.error("Login failed: ", error);

                        if (error.response && error.response.data && error.response.data.user) {
                            return error.response.data.user;
                        }
                    })
                    .finally(() => setLoading(false));
            }
        },
        onFailure: ({ error }: { error: any }) => {
            console.error("Google Login Failed: ", error);
            setError("Google Login Failed: " + error);
        },
        // @ts-ignore
        flow: 'code',
    });

    return (
        <>
            {loginError && <p>{loginError}</p>}
            <button className="my_googleButton" onClick={login} disabled={isLoading}>
                {<FcGoogle className="icon" size={24} />}
                {isLoading ? "Logging in..." : "Google"}
            </button>
        </>
    );
}

export default GoogleButton;
