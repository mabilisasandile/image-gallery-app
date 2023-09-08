import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

const Home = () => {
    return (
        <View style={styles.container}>
            
            <Text style={styles.text}>IMAGE GALLERY</Text>
            <Text>Use this app to take photos by clicking the camera icon below.</Text>
            <Text>Or view saved photos by clicking the image icon below.</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2F4F4F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageView: {
        width: 100, 
        height: 100
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ffffff',
    }

});

export default Home;
