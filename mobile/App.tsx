import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { DrawerMenu } from './components/DrawerMenu/DrawerMenu';

export default function App() {
    return (
        <React.Fragment>
            <DrawerMenu />
            <StatusBar style="auto" backgroundColor="#221C3E" />
        </React.Fragment>
    );
}


