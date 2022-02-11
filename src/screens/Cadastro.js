import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import UsersContext from '../UserProvider';
import Back from '../components/Back';
import Button from '../components/Button';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)

    function ZerarTudo(){
        dispatch({
            type: 'setClearAll',
            payload: users_data
        })
        console.log("Clicou")
        console.log(users_data)
    }

    return(
        <Back>
            <View>
                <Button text='Clica ai' func={ZerarTudo} colorText='#FFF' colorButton='#FF4574' />
            </View>
        </Back>
    );

};

const stl = StyleSheet.create({

});