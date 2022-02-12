import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import UsersContext from '../UserProvider';
import Back from '../components/Back';
import Button from '../components/Button';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)

    function ZerarTudo(){
        props.set('setClearAll', '')
    }

    return(
            <View>
                <Button text='Clica ai' func={ZerarTudo} colorText='#FFF' colorButton='#FF4574' />
            </View>
    );

};

const stl = StyleSheet.create({

});