import React from 'react';
import { StyleSheet, View, ImageBackground, StatusBar, Dimensions } from 'react-native';
import backgroundImage from '../img/branco.jpg'

export default (props)=>{

    return(
        <ImageBackground source={backgroundImage} blurRadius={2} style={stl.background}>
            <StatusBar backgroundColor="transparent" translucent={true} barStyle="dark-content"/>
            {props.children}
        </ImageBackground>
    );
};

const stl = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
});