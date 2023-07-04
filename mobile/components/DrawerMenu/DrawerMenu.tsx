import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '../../pages/HomeScreen/HomeScreen';
import { Blogs } from '../../pages/Blogs/Blogs';
import { BlogPage } from '../../pages/BlogPage/BlogPage';
const Drawer = createDrawerNavigator();

export function DrawerMenu() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#221C3E',
                    },
                    headerTintColor: '#7456D0',
                    drawerStyle: {
                        backgroundColor: '#221C3E',
                        borderColor: '#7456D0',
                        width: 240,
                    },
                    drawerActiveTintColor: '#FFFFFF', // Couleur du texte de l'élément du menu sélectionné
                    drawerInactiveTintColor: '#FFFFFF', // Couleur du texte des autres éléments du menu
                    drawerActiveBackgroundColor: 'rgba(116, 86, 208, 0.2)', // Couleur de fond de l'élément du menu sélectionné
                    drawerItemStyle: {
                    },
                }}
            >
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Blogs" component={Blogs} />
                <Drawer.Screen name="BlogPage" component={BlogPage} />
                {/* Ajoutez plus d'écrans au besoin */}
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
