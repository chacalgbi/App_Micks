import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import UsersContext from '../UserProvider';
import Button from '../components/Button';
import AuthInput from '../components/AuthInput';
import API from '../components/API';
import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage";
import Msg from '../components/Msg';

const storage = new MMKVStorage.Loader().withEncryption().initialize();

export default (props)=>{
    const [token, setToken] = useMMKVStorage("token", storage, "");
    const {users_data, dispatch} = useContext(UsersContext)
    const [userEmail, setUserEmail] = useState(users_data.email)
    const [userPass, setUserPass] = useState('')
    const [warning, setWarning] = useState('')
    const [msg, setMsg] = useState('')
    const [button, setButton] = useState('#4460D9');
    const [seach, setSeach] = useState(false);
    const [redefinition, setRedefinition] = useState(false);
    const [showProgress, setShowProgress] = useState(true);

    function showErro(e){
        Alert.alert('Ops!', `${e}`)
    }

    function checkEmail(){
        if(userEmail.length < 10 ){
            Alert.alert('Ops! Email muito curto!', "Digite um email com pelo menos 10 caracteres.")
        }else if(userEmail.indexOf('@') == -1 || userEmail.indexOf('.') == -1){
            Alert.alert('Ops! Email inválido!', "Digite um email válido.")
        }else{
            setRedefinition(true)
        }
    }

    async function login(){
        setSeach(true)
        const obj = {
            email: userEmail,
            senha: userPass,
            token: token
        }

        await API('login', obj)
        .then((res)=>{
            //console.log(res.data)
            setTimeout(()=>{ setSeach(false) }, 1500)

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
                            login: res.data.dados.resposta[0].login,
                        }
                        setTimeout(()=>{ props.set('setAppLoggedYes', obj) }, 2000)
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

    async function redefinitionPassword(){
        await API('esqueci_senha', {email: userEmail})
        .then((res)=>{
            //console.log(res.data)
            setShowProgress(false)
            setWarning(res.data.msg)
            setMsg(res.data.msg)
            setTimeout(()=>{ setSeach(false) }, 5000)
        })
        .catch((e)=>{
            setSeach(false)
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
                colorIcon={'#4460D9'}
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
                colorIcon={'#4460D9'}
                style={stl.input} 
                value={userPass}
                onChangeText={ (v) => {setUserPass(v)} }
            />
            <Button 
                text='Entrar'
                func={ ()=>{ setMsg('Fazendo Login...'); checkForm() } }
                colorText='#FFF'
                colorButton={button}
            />
            <Text style={stl.warning}>{warning}</Text>
            
            <TouchableOpacity onPress={()=>{ props.set('setClearAll', {}) }}><Text style={{color: '#FFF', textDecorationLine: 'underline', paddingTop: 10}}>Novo usuário?</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{ checkEmail() }}><Text style={{color: '#FFF', textDecorationLine: 'underline', paddingTop: 10}}>Esqueci minha senha</Text></TouchableOpacity>

            <Msg show={seach}
                showProgress={showProgress}
                title="Aguarde..."
                message={msg}
                confirmButtonColor="#080"
                showCancelButton={false}
                showConfirmButton={false}
                onCancelPressed={() => { console.log('Cancelou') }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />

            <Msg show={redefinition}
                showProgress={false}
                title="REDEFINIR SENHA"
                message={`Desenha enviar a redefinição de senha para o email ${userEmail}?`}
                confirmButtonColor="#080"
                showCancelButton={true}
                showConfirmButton={true}
                onCancelPressed={() => { setRedefinition(false) }}
                onConfirmPressed={() => { 
                    setRedefinition(false)
                    setMsg(`Aguarde alguns segundos, enviando redefinição de senha para o email ${userEmail}.`)
                    setSeach(true)
                    redefinitionPassword()
                }}
            />

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