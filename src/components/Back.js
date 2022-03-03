import React from 'react';
import { StyleSheet, View, ImageBackground, StatusBar, Dimensions } from 'react-native';
import backgroundImage from '../img/branco.jpg'

export default (props)=>{

    return(
        <ImageBackground source={backgroundImage} blurRadius={1} style={stl.background}>
            <StatusBar backgroundColor="#4460D9" translucent={true} barStyle="light-content"/>
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