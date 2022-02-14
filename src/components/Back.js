import React from 'react';
import { StyleSheet, View, ImageBackground, StatusBar, Dimensions } from 'react-native';
import backgroundImage from '../img/azul.jpg'

export default (props)=>{

    return(
        <ImageBackground source={backgroundImage} blurRadius={2} style={stl.background}>
            <StatusBar backgroundColor="transparent" translucent={true} barStyle="light-content"/>
            {props.children}
        </ImageBackground>
    );
};

const stl = StyleSheet.create({
    background: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        alignItems: 'center',
        justifyContent: 'center'
    }
});