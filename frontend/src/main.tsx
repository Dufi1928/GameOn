import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="799631150296-rgsacnb85t05u6tl0uv2mfd0anpsrlq4.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>
);
