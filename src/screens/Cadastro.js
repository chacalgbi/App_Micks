import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import UsersContext from '../UserProvider';
import Button from '../components/Button';
import AuthInput from '../components/AuthInput';
import InputMask from '../components/InputMask';
import API from '../components/API';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [userName, setUserName] = useState(users_data.name)
    const [userEmail, setUserEmail] = useState('chacalgbi@hotmail.com')
    const [userPass, setUserPass] = useState('123456')
    const [userPassConfirm, setUserPassConfirm] = useState('123456')
    const [warning, setWarning] = useState('')
    const [button, setButton] = useState('#080');
    const [cel, setCel] = useState('(77) 98818-8514');

    function showErro(e){
        Alert.alert('Ops!', `${e}`)
    }

    async function insert(){
        const obj = {
            cod_cli: users_data.codCli,
            nome: userName,
            email: userEmail,
            senha: userPass,
            doc: users_data.cliDOC,
            cel: cel
        }

        await API('insert_user', obj)
        .then((res)=>{
            console.log(res.data)

            if(res.data.erroGeral){
                setWarning(res.data.msg)

                if(res.data.erroGeral === 'nao'){
                    if(res.data.dados.errorBD === 'nao'){
                        props.set('setUserAppYes', userEmail)
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
        if(userName.length <= 4){
            Alert.alert('Ops! Nome muito curto!', "Digite um nome com pelo menos 5 caracteres.")
        }else if(userEmail.length < 10 ){
            Alert.alert('Ops! Email muito curto!', "Digite um email com pelo menos 10 caracteres.")
        }else if(userEmail.indexOf('@') == -1 || userEmail.indexOf('.') == -1){
            Alert.alert('Ops! Email inválido!', "Digite um email válido.")
        }else if(cel.length < 15){
            Alert.alert('Ops! Número de telefone inválido!', "Digite um número com 11 caracteres.")
        }else if(userPass.length < 6){
            Alert.alert('Ops! Senha muito curta!', "Digite uma senha com pelo menos 6 caracteres.")
        }else if(userPass !== userPassConfirm){
            Alert.alert('Ops! Senha não confere!', "A senha e a confirmação de senha não coincidem.")
        }else{
            insert()
        }
    }

    return(
            <View style={stl.formContainer}>
                <Text style={stl.title}>{users_data.name}</Text>
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
                <InputMask
                    icon={'whatsapp'}
                    keyboardType='numeric' 
                    placeholder={'Digite seu n° de celular'} 
                    colorIcon={'#8A2BE2'}
                    style={stl.input} 
                    value={cel}
                    mask={"([00]) [00000]-[0000]"}
                    onChangeText={ (formatted, extracted) => {setCel(formatted)} }
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
                    colorButton={button}
                />
                <Text style={stl.warning}>{warning}</Text>
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