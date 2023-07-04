import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';

export function HomeScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Personnalisez votre expérience</Text>
            <Text style={styles.text}>
                Personnalisez votre expérience sur GAME ON en complétant votre profil utilisateur !
            </Text>
            <View style={styles.imagesBlock}>
                <Image
                    source={require('../../assets/images/home/1.png')}
                    style={styles.image}
                />
                <Image
                    source={require('../../assets/images/home/2.png')}
                    style={styles.image}
                />
            </View>
            <Text style={styles.title}>Un site créé pour le confort des gamers</Text>
            <Image
                source={require('../../assets/images/home/3.png')}
                style={styles.banner}
            />
            <View style={styles.sponsorsBlock}>
                <Image
                    source={require('../../assets/images/home/sponsor3.png')}
                    style={styles.sponsor}
                />
            </View>
            <Image
                source={require('../../assets/images/home/4.png')}
                style={styles.bigImage}
            />
            <Text style={styles.smallTitle}>Besoin de nouveaux team mates ?</Text>
            <Text style={styles.description}>
                À l’aide des fonctionnalités mis en place par GAME ON trouvé de nouveaux coéquipiers  et mettais vous en  vocal en créant votre propre room !
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => console.log("Button pressed")}>
                <Text style={styles.buttonText}>Click Me</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#221C3E',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    title: {
        color: '#9795B5',
        fontSize: 25,
        width: 320,
        fontWeight: 'bold',
        marginTop: 35,
        textAlign: 'center',
    },
    text: {
        color: '#9795B5',
        fontSize: 14,
        width: 300,
        marginTop: 35,
        textAlign: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 5,
    },
    banner: {
        width: 300,
        height: 150,
        borderRadius: 15,
        marginTop: 35,
    },
    sponsorsBlock: {
        marginTop: 25,
        flexDirection: 'row',
        backgroundColor: '#8D8DDA',
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: 90,
    },
    imagesBlock: {
        marginTop: 35,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    sponsor:{
        height: 55,
        width: 270,
    },
    bigImage:{
        marginTop: 35,
        width: 300,
        height: 200,
        borderRadius: 15,
    },
    smallTitle:{
        fontSize: 24,
        width: '80%',
        fontWeight: "bold",
        color: "#9795B5",
        marginTop: 35,
    },
    description:{
        color: "#9795B5",
        width: '80%',
        marginTop: 15,
    },
    button: {
        backgroundColor: '#7456D0',
        padding: 10,
        alignSelf: "flex-start",
        marginLeft: 40,
        borderRadius: 25,
        shadowColor: '#7456D0',
        width: '40%',
        marginTop: 20,
        shadowOffset: { width: 120, height: 70 },
        shadowOpacity: 0.8,
        shadowRadius: 25,
        elevation: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

});
