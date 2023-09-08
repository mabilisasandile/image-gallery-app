
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Card } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


const ImageListScreen = () => {
    const [images, setImages] = useState([]);


    const db = SQLite.openDatabase('SQLite.db');

    useEffect(() => {
        getData();

    }, []);

    const getData = async () => {
        try {
            
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM photos', [], (_, results) => {
                        const imageData = results.rows._array;
                        console.log("Image collection", imageData);
                        setImages(imageData);

                    }
                );
            });
        } catch (error) {
            console.log('Error occurred while fetching: ', error);
            Alert.alert('Error', 'Images were not found!');
        }
    }



    const deleteImage = (itemId) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM photos WHERE id = ?',
                [itemId],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        console.log('Item deleted successfully');
                        Alert.alert('Success', 'Item deleted successfully.');
                    } else {
                        console.log('Item not found');
                        Alert.alert('Error', 'Item not found.');
                    }
                },
                error => console.log('Error deleting item: ', error)
            );
        });
    };



    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.text}>Images:</Text>
            {images.map((image, index) => (
                <View key={index}>
                    <Card style={styles.card}>
                        <Card.Title title="Image" />
                        <Card.Content>
                            <Image style={styles.savedImage} source={{ uri: image.image_url }} />
                            <TouchableOpacity onPress={() => deleteImage(image.id)} style={styles.btnIcon}>
                                <FontAwesomeIcon icon={faTrash} size={30} color='#2F4F4F' />
                                <Text>Delete</Text>
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                </View>
            ))}
        </ScrollView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    savedImage: {
        width: 150,
        height: 80,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ffffff',
    },
    card: {
        marginTop: 15,
        marginBottom: 15,
        height: 200,
        width: 300,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000000',
        shadowColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default ImageListScreen;
