import "../Header/Header.scss"
function SettingsIcon() {
    return (
        <svg className="settings-icon" width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_829_16235)">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.75 2.75C8.75 2.33579 8.41421 2 8 2C7.58579 2 7.25 2.33579 7.25 2.75V4.00879C5.43368 4.13698 4 5.65106 4 7.5V8.5C4 10.3489 5.43368 11.863 7.25 11.9912L7.25 17.25C7.25 17.6642 7.58579 18 8 18C8.41421 18 8.75 17.6642 8.75 17.25L8.75 11.9912C10.5663 11.863 12 10.3489 12 8.5V7.5C12 5.65106 10.5663 4.13698 8.75 4.00879V2.75ZM10.5 7.5C10.5 6.39543 9.60457 5.5 8.5 5.5H7.5C6.39543 5.5 5.5 6.39543 5.5 7.5V8.5C5.5 9.60457 6.39543 10.5 7.5 10.5H8.5C9.60457 10.5 10.5 9.60457 10.5 8.5V7.5Z" fill="#9B9B9B"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M15.25 2.75L15.25 8.00879C13.4337 8.13698 12 9.65106 12 11.5V12.5C12 14.3489 13.4337 15.863 15.25 15.9912L15.25 17.25C15.25 17.6642 15.5858 18 16 18C16.4142 18 16.75 17.6642 16.75 17.25L16.75 15.9912C18.5663 15.863 20 14.3489 20 12.5V11.5C20 9.65106 18.5663 8.13698 16.75 8.00879L16.75 2.75C16.75 2.33579 16.4142 2 16 2C15.5858 2 15.25 2.33579 15.25 2.75ZM15.5 9.5C14.3954 9.5 13.5 10.3954 13.5 11.5V12.5C13.5 13.6046 14.3954 14.5 15.5 14.5H16.5C17.6046 14.5 18.5 13.6046 18.5 12.5V11.5C18.5 10.3954 17.6046 9.5 16.5 9.5H15.5Z" fill="#9B9B9B"/>
            </g>
            <defs>
                <filter id="filter0_d_829_16235" x="-2" y="0" width="28" height="28" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="4"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_829_16235"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_829_16235" result="shape"/>
                </filter>
            </defs>
        </svg>
    );
}

export default SettingsIcon;