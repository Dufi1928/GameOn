import { FC } from "react";
// @ts-ignore
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-Login';
import { FaFacebook } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

interface FacebookButtonProps {
    handleSignUpClick: (userData?: any) => void;
}
const FacebookButton: FC <FacebookButtonProps> = ({handleSignUpClick}) => {

    let navigate  = useNavigate();

    const responseFacebook = (response: ReactFacebookLoginInfo) => {
        console.log(response);

        const { name, email, picture } = response;
        console.log(name, email, picture);

        axios.post('https://localhost:8000/api/google-login', {
            provider: 'facebook',

            email: email,
        }).then(response => {
            let userData = response.data.user;

            if (userData.found == 'false' ) {
                userData.firstName = name.split(' ')[0];
                userData.lastName = name.split(' ')[1];
                handleSignUpClick(userData);
            }
            else if (userData.found === 'true') {
                console.log('User found, logging in...');
                document.cookie = `jwt=${userData.jwt}; path=/;`;
                localStorage.setItem('jwt', userData.jwt);
                navigate("/");
            }
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <FacebookLogin
            appId="939219304145680"
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
            cssClass="my_googleButton"
            icon={<FaFacebook size={24} />}
            textButton="Facebook"
        />
    );
}

export default FacebookButton;
