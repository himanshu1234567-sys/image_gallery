

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet, Dimensions } from 'react-native';



export const HomeScreen = () => {
    const [photos, setPhotos] = useState([]);
    useEffect(() => {
        console.log("helloooo");
        const fetchPhotos = async () => {
            try {
                const cachedPhotos = await AsyncStorage.getItem('cachedPhotos');
                if (cachedPhotos) {
                    setPhotos(JSON.parse(cachedPhotos));
                }

                const response = await fetch('https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s');
                const data = await response.json();
                if (data.photos && data.photos.photo) {
                    setPhotos(data.photos.photo);
                    AsyncStorage.setItem('cachedPhotos', JSON.stringify(data.photos.photo));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchPhotos();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: item.url_s }} />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={photos}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    imageContainer: {
        flex: 1,
        margin: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        flex: 1,
        aspectRatio: 1,
    },
});
