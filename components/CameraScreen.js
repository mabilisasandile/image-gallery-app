
import React, { useState, useEffect, useRef } from 'react';
import {
    View, StyleSheet, SafeAreaView,
    Image, Text, TouchableOpacity, Alert
} from 'react-native';
import { shareAsync } from 'expo-sharing';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShare, faXmark, faCamera } from '@fortawesome/free-solid-svg-icons';
import * as SQLite from 'expo-sqlite';


const CameraScreen = () => {

    let cameraRef = useRef();
    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [photo, setPhoto] = useState();




    // Create a database and table to store the photos
    const db = SQLite.openDatabase('SQLite.db');
    

    

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasCameraPermission(cameraPermission.status === "granted");
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
        })();

        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY AUTOINCREMENT, image_url TEXT)',
                [],
                () => console.log('Table created successfully.'),
                error => console.log('Error creating table: ', error)
            );
        });
    
    }, []);

    //Request permission to access the device's location
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setHasLocationPermission(status === 'granted');
        })();
    }, []);

    if (hasCameraPermission === undefined) {
        return <Text>Requesting permissions...</Text>
    } else if (!hasCameraPermission) {
        return <Text>Permission for camera not granted. Please change this in settings.</Text>
    } else if (!hasLocationPermission) {
        return <Text>Permission for location not granted. Please change this in settings.</Text>
    }



    
      
    //Retrieve the device's current location
    const getCurrentLocation = async () => {
        const { coords } = await Location.getCurrentPositionAsync();
        const { latitude, longitude } = coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    };



    //Capture the image
    const handleTakeImage = async () => {
        if (cameraRef.current) {
            let options = {
                quality: 1,
                base64: true,
                exif: false
            };

            let newPhoto = await cameraRef.current.takePictureAsync(options);
            if (newPhoto) {
                setPhoto(newPhoto);
                getCurrentLocation();
            }
        }
    };

    if (photo) {

        // Save image into SQLite database
        let savePhoto = () => {
            try {

                const image =` ${photo.uri}`;

                console.log("Taken pic uri:", image);

                db.transaction(tx => {
                    tx.executeSql(
                        'INSERT INTO photos (image_url) VALUES (?)',
                        [image],
                        () => {
                            console.log("Saved image uri:", photo.uri);
                            console.log('Photo saved successfully.');
                            Alert.alert('Success', 'Photo saved successfully.');
                        }
                    );
                });
            } catch (error) {
                console.log('Error saving photo: ', error);
                Alert.alert('Error', 'Failed to save photo.');
            }
        };

        let sharePic = () => {
            shareAsync(photo.uri).then(() => {
                setPhoto(undefined);
            });
        };

        return (
            <SafeAreaView style={styles.container}>
                <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={sharePic} style={styles.btnIcon}>
                        <FontAwesomeIcon icon={faShare} size={30} color='#2F4F4F' />
                        <Text>share</Text>
                    </TouchableOpacity>

                    {hasMediaLibraryPermission &&
                        <TouchableOpacity onPress={savePhoto} style={styles.btnSave}>
                            <Text style={{ color: "#ffffff" }}>Save</Text>
                        </TouchableOpacity>
                    }

                    <TouchableOpacity onPress={() => setPhoto(undefined)} style={styles.btnIcon}>
                        <FontAwesomeIcon icon={faXmark} size={30} color='#2F4F4F' />
                        <Text>Discard</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.container} ref={ref => (cameraRef.current = ref)}></Camera>
            <TouchableOpacity style={styles.btnCamera} onPress={handleTakeImage}>
            <FontAwesomeIcon icon={faCamera} size={30} color='#2F4F4F' />
                <Text style={{ color: "#ffffff" }}>Take Photo</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: 360,
    },
    btnIcon: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: '#dcdcdc',
        shadowColor: '#000000',
        width: 100,
        padding: 5,
        margin: 10,
    },
    btnSave: {
        backgroundColor: '#2F4F4F',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        width: 100,
        padding: 20,
        margin: 5,
        borderRadius: 501
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    btnCamera: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center', 
        borderRadius: 50,
        borderWidth: 1,
        width: 60,
        height: 60,
        padding: 27,
        margin: 10
    },
    preview: {
        alignSelf: 'stretch',
        flex: 1
    }
});

export default CameraScreen;
