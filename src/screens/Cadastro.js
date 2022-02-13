import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import Balloon from 'react-native-balloon';
import UsersContext from '../UserProvider';
import Button from '../components/Button';
import AuthInput from '../components/AuthInput';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [userName, setUserName] = useState('Thomé Lucas')
    const [userEmail, setUserEmail] = useState('chacalgbi@hotmail.com')
    const [userPass, setUserPass] = useState('123456')
    const [userPassConfirm, setUserPassConfirm] = useState('123456')

    function ZerarTudo(){
        props.set('setClearAll', '')
    }

    function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    function checkForm(){
        if(userName.length <= 4){
            Alert.alert('Ops! Nome muito curto!', "Digite um nome com pelo menos 5 caracteres.")
        }else if(userEmail.length < 10 ){
            Alert.alert('Ops! Email muito curto!', "Digite um email com pelo menos 10 caracteres.")
        }else if(userEmail.indexOf('@') == -1 || userEmail.indexOf('.') == -1){
            Alert.alert('Ops! Email inválido!', "Digite um email válido.")
        }else if(userPass.length < 6){
            Alert.alert('Ops! Senha muito curta!', "Digite uma senha com pelo menos 6 caracteres.")
        }else if(userPass !== userPassConfirm){
            Alert.alert('Ops! Senha não confere!', "A senha e a confirmação de senha não coincidem.")
        }else{
            Alert.alert('OK', "Tudo certo!")
        }
    }

    return(
            <View style={stl.formContainer}>
                <Text style={stl.title}>{users_data.name}Teste</Text>
                <Text style={stl.subtitle}>Vamos fazer seu cadastro</Text>
                <AuthInput
                    icon={'account-plus-outline'}
                    keyboardType='default' 
                    placeholder={'Digite seu nome'} 
                    colorIcon={'#8A2BE2'}
                    style={stl.input} 
                    value={userName}
                    onChangeText={ (v) => {setUserName(v)} }
                />
                <AuthInput
                    icon={'at'}
                    keyboardType='email-address' 
                    placeholder={'Digite seu melhor email'} 
                    colorIcon={'#8A2BE2'}
                    style={stl.input} 
                    value={userEmail}
                    onChangeText={ (v) => {setUserEmail(v)} }
                />
                <AuthInput
                    icon={'key-variant'}
                    secureTextEntry={true}
                    placeholder={'Digite uma senha'} 
                    colorIcon={'#8A2BE2'}
                    style={stl.input} 
                    value={userPass}
                    onChangeText={ (v) => {setUserPass(v)} }
                />
                <AuthInput
                    icon={'shield-key-outline'}
                    secureTextEntry={true} 
                    placeholder={'Confirme sua senha'} 
                    colorIcon={'#8A2BE2'}
                    style={stl.input} 
                    value={userPassConfirm}
                    onChangeText={ (v) => {setUserPassConfirm(v)} }
                />
                <Button 
                    text='Cadastrar'
                    func={ ()=>{ checkForm() } }
                    colorText='#FFF'
                    colorButton={'#080'}
                />
            </View>
    );

};

const stl = StyleSheet.create({
    title: {
        fontFamily: "Cochin",
        color: '#FFF',
        fontSize: 50,
        textAlign: 'center',
        marginBottom: 10
    },
    subtitle: {
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
        width: '90%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
    },
});