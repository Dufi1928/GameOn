import { FC } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import axios, { AxiosError } from 'axios';
import { useNavigate } from "react-router-dom";

interface GoogleButtonProps {
    handleSignUpClick: (userData: any) => void;
}

const GoogleButton: FC<GoogleButtonProps> = ({ handleSignUpClick }) => {
    const navigate = useNavigate();

    const login = useGoogleLogin({
        "onSuccess": (response: any) => {
            console.log("Code Response: ", response);
            if ('code' in response) {
                axios
                    .post('https://mygameon.pro:8000/api/google-login', { code: response.code, provider: 'google' })
                    .then((response: any) => {
                        const user = response.data.user;
                        console.log(response);
                        console.log(user.found);
                        if (user.found === 'false') {
                            console.log('User not found condition has been met');
                            handleSignUpClick(user);
                            console.log('hello');
                        } else if (user.found === 'true') {
                            console.log('User found, logging in...');
                            document.cookie = `jwt=${response.data.user.jwt}; path=/;`;
                            localStorage.setItem('jwt', response.data.user.jwt);
                            console.log(response.data.user);
                            navigate("/");
                        }
                    })
                    .catch((error: AxiosError) => {
                        console.error("Login failed: ", error);
                        if (error.response && (error.response.data as any).user) {
                            return (error.response.data as any).user;
                        }
                    });
            }
        },
        onFailure: ({ error }: { error: Error & { response?: any } }) => {
            console.error("Google Login Failed: ", error);
        },
        // @ts-ignore
        flow: 'code',
    });

    return (
        <>
            <button className="my_googleButton" onClick={login}>
                <FcGoogle className="icon" size={24} />
                Google
            </button>
        </>
    );
}

export default GoogleButton;
