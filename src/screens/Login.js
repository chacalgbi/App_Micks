import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import UsersContext from '../UserProvider';
import Button from '../components/Button';
import AuthInput from '../components/AuthInput';
import API from '../components/API';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [userEmail, setUserEmail] = useState(users_data.email)
    const [userPass, setUserPass] = useState('123456')
    const [warning, setWarning] = useState('')
    const [button, setButton] = useState('#080');

    function showErro(e){
        Alert.alert('Ops!', `${e}`)
    }

    async function login(){
        const obj = {
            email: userEmail,
            senha: userPass,
        }

        await API('login', obj)
        .then((res)=>{
            console.log(res.data)

            if(res.data.erroGeral){
                setWarning(res.data.msg)

                if(res.data.erroGeral === 'nao'){
                    if(res.data.dados.errorBD === 'nao'){
                        let obj = {
                            codCli: res.data.dados.resposta[0].cod_cli,
                            codsercli: res.data.dados.resposta[0].codsercli,
                            nome: res.data.dados.resposta[0].nome,
                            email: res.data.dados.resposta[0].email,
                            doc: res.data.dados.resposta[0].doc,
                            descriSer: res.data.dados.resposta[0].descriSer,
                        }
                        props.set('setAppLoggedYes', obj)
                    }else{
                        showErro('Erro interno, tente novamente mais tarde')
                    }
                }else{
                    setButton('#B22222')
                }

            }

        })
        .catch((e)=>{
            console.log(e);
            showErro('Erro interno, tente novamente mais tarde')
        });
    }

    function checkForm(){
        if(userEmail.length < 10 ){
            Alert.alert('Ops! Email muito curto!', "Digite um email com pelo menos 10 caracteres.")
        }else if(userEmail.indexOf('@') == -1 || userEmail.indexOf('.') == -1){
            Alert.alert('Ops! Email inválido!', "Digite um email válido.")
        }else if(userPass.length < 6){
            Alert.alert('Ops! Senha muito curta!', "Digite uma senha com pelo menos 6 caracteres.")
        }else{
            login()
        }
    }

    return(
        <View style={stl.formContainer}>
            <Text style={stl.subtitle}>Faça seu Login</Text>
            <AuthInput
                icon={'at'}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                autoCompleteType='email'
                placeholder={'Email cadastrado'} 
                colorIcon={'#8A2BE2'}
                style={stl.input} 
                value={userEmail}
                onChangeText={ (v) => {setUserEmail(v)} }
            />
            <AuthInput
                icon={'key-variant'}
                secureTextEntry={true}
                autoCapitalize='none'
                autoCorrect={false}
                placeholder={'Digite uma senha'} 
                colorIcon={'#8A2BE2'}
                style={stl.input} 
                value={userPass}
                onChangeText={ (v) => {setUserPass(v)} }
            />
            <Button 
                text='Entrar'
                func={ ()=>{ checkForm() } }
                colorText='#FFF'
                colorButton={button}
            />
            <Text style={stl.warning}>{warning}</Text>
            <TouchableOpacity onPress={()=>{ props.set('setClearAll', {}) }}><Text style={{color: '#FFF', textDecorationLine: 'underline', paddingTop: 10}}>Novo usuário?</Text></TouchableOpacity>
        </View>
    );

};

const stl = StyleSheet.create({
    title: {
        fontFamily: "Cochin",
        color: '#FFF',
        fontSize: 25,
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
    warning:{
        color: '#FFF',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10
    },
});