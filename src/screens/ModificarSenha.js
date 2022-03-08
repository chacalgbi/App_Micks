import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, BackHandler } from 'react-native';
import UsersContext from '../UserProvider';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../components/Button';
import AuthInput from '../components/AuthInput';
import API from '../components/API';
import Msg from '../components/Msg';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [userPass, setUserPass] = useState('')
    const [userPass2, setUserPass2] = useState('')
    const [warning, setWarning] = useState('')
    const [button, setButton] = useState('#4460D9');
    const [seach, setSeach] = useState(false);

    useEffect(() => {
        const backAction = () => { props.back(0); return true; };
        const backHandler = BackHandler.addEventListener( "hardwareBackPress", backAction );
        return () => backHandler.remove();
    }, []);

    function showErro(e){
        Alert.alert('Ops!', `${e}`)
    }

    async function redefinir(){
        const obj = {
            email: users_data.email,
            senha: userPass
        }

        await API('modify_password', obj)
        .then((res)=>{
            //console.log(res.data)
            setTimeout(()=>{ setSeach(false) }, 1500)

            if(res.data.erroGeral){
                setWarning(res.data.msg)

                if(res.data.erroGeral === 'nao'){
                    Alert.alert('Sucesso!', 'Sua senha foi alterada!')
                }else{
                    showErro('Erro interno, tente novamente mais tarde')
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
        if(userPass.length < 6 ){
            Alert.alert('Ops! senha muito curta!', "Digite uma senha com pelo menos 6 caracteres.")
        }else if(userPass !== userPass2){
            Alert.alert('Ops!!', "As senhas não conferem!")
        }else{
            setSeach(true)
            redefinir()
        }
    }

    return(
        <View style={{flex: 1, width: '100%'}}>
            <View style={stl.header}>
                <TouchableOpacity onPress={ ()=>{ props.back(0)} }>
                    <IconMaterial name='arrow-left-circle-outline' size={50} style={{color: "#4460D9"}} />
                </TouchableOpacity>
            </View>
            <View style={{flex: 9, width: '100%', justifyContent: "flex-start", alignItems: 'center'}}>
                <View style={stl.formContainer}>

                    <Text style={stl.title}>Mudar Senha</Text>

                    <AuthInput
                        icon={'key-variant'}
                        secureTextEntry={true}
                        autoCapitalize='none'
                        autoCorrect={false}
                        placeholder={'Digite a nova senha'} 
                        colorIcon={'#4460D9'}
                        style={stl.input} 
                        value={userPass}
                        onChangeText={ (v) => {setUserPass(v)} }
                    />
                    <AuthInput
                        icon={'key-variant'}
                        secureTextEntry={true}
                        autoCapitalize='none'
                        autoCorrect={false}
                        placeholder={'Confirme a nova senha'} 
                        colorIcon={'#4460D9'}
                        style={stl.input} 
                        value={userPass2}
                        onChangeText={ (v) => {setUserPass2(v)} }
                    />

                    <Button 
                        text='Modificar'
                        func={ ()=>{ checkForm() } }
                        colorText='#FFF'
                        colorButton={button}
                    />
                    <Text style={stl.warning}>{warning}</Text>

                    <Msg show={seach}
                        showProgress={true}
                        title="Aguarde..."
                        message={'Modificando senha...'}
                        confirmButtonColor="#080"
                        showCancelButton={false}
                        showConfirmButton={false}
                        onCancelPressed={() => { console.log('Cancelou') }}
                        onConfirmPressed={() => { console.log('Clicou em OK') }}
                    />

                </View>
            </View>
        </View>
    );

};

const stl = StyleSheet.create({
    header:{
        marginTop: 50,
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    title: {
        fontFamily: "Cochin",
        color: '#000000',
        fontSize: 25,
        textAlign: 'center',
        marginBottom: 10
    },
    formContainer: {
        padding: 20,
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
        color: '#000000',
        borderWidth: 2
    },
    warning:{
        color: '#000000',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10
    },
});