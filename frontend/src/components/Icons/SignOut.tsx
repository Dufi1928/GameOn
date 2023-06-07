import "../Header/Header.scss"

interface SignOutProps {
    handleLogout: () => void;
}

function SignOut(props: SignOutProps)  {
    return (
        <svg onClick={props.handleLogout} className="settings-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 10.7C13.3866 10.7 13.7 10.3866 13.7 10C13.7 9.6134 13.3866 9.3 13 9.3L13 10.7ZM2.50503 9.50502C2.23166 9.77839 2.23166 10.2216 2.50503 10.495L6.9598 14.9497C7.23316 15.2231 7.67638 15.2231 7.94975 14.9497C8.22311 14.6764 8.22311 14.2332 7.94975 13.9598L3.98995 10L7.94975 6.0402C8.22312 5.76683 8.22312 5.32362 7.94975 5.05025C7.67638 4.77688 7.23317 4.77688 6.9598 5.05025L2.50503 9.50502ZM13 9.3L3 9.3L3 10.7L13 10.7L13 9.3Z" fill="#9B9B9B"/>
            <path d="M10 6.5V5.5C10 4.11929 11.1193 3 12.5 3H14.5C15.8807 3 17 4.11929 17 5.5V14.5C17 15.8807 15.8807 17 14.5 17H12.5C11.1193 17 10 15.8807 10 14.5V14" stroke="#9B9B9B" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    );
}

export default SignOut;