import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import UsersContext from '../UserProvider';
import estilo from '../Estilos';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)

    return(
        <View style={estilo.viewScreen}>
            <Text style={{ color: 'white' }}>Login</Text>
        </View>
    );

};

const stl = StyleSheet.create({

});