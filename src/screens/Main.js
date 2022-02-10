import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import estilos from '../Estilos';
import UsersContext from '../UserProvider';

export default ()=>{
    const {users_data, dispatch} = useContext(UsersContext)


    return (
        <View style={estilos.viewScreen}>
            <Text style={{ color: 'white' }} >Principal</Text>
        </View>
	);
};

const stl = StyleSheet.create({

});