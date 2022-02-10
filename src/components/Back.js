import React from 'react';
import { StyleSheet, View, ImageBackground, StatusBar } from 'react-native';
import backgroundImage from '../img/fibra.jpg'

export default (props)=>{

    return(
        <ImageBackground source={backgroundImage} style={stl.background}>
            <StatusBar backgroundColor="transparent" translucent={true} barStyle="light-content"/>
            {props.children}
        </ImageBackground>
    );
};

const stl = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
});