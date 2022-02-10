import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import UsersContext from '../UserProvider';
import estilo from '../Estilos';
import AuthInput from '../components/AuthInput';
import Back from '../components/Back';
import Button from '../components/Button';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [texto, setTexto] = useState("Lucas")

    function ZerarTudo(){
        dispatch({
            type: 'setClearAll',
            payload: users_data
        })
    }

    return(
        <Back>
            <View style={stl.formContainer}>
                <Button text='Clica ai' func={ZerarTudo} colorText='#FFF' colorButton='#FF4574' />
                <Text style={{ color: 'white' }}>Cadastro</Text>
                <AuthInput icon='user' placeholder='Nome' style={stl.input} value={texto} onChangeText={ (v) => setTexto(v) } />

            </View>
        </Back>
    );

};

const stl = StyleSheet.create({
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        width: '90%'
    },
});