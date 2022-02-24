import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import UsersContext from '../UserProvider';
import Button from '../components/Button';
import AuthInput from '../components/AuthInput';
import InputMask from '../components/InputMask';
import API from '../components/API';
import Msg from '../components/Msg';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [userName, setUserName] = useState(users_data.name)
    const [userEmail, setUserEmail] = useState('chacalgbi@hotmail.com')
    const [userPass, setUserPass] = useState('123456')
    const [userPassConfirm, setUserPassConfirm] = useState('123456')
    const [warning, setWarning] = useState('')
    const [seach, setSeach] = useState(false);
    const [button, setButton] = useState('#4460D9');
    const [cel, setCel] = useState('(77) 98818-8514');
    const colorMicks = '#4460D9'

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
            cel: cel,
            codsercli: users_data.codsercli,
            descriSer: users_data.descriSer,
            login: users_data.login
        }

        await API('insert_user', obj)
        .then((res)=>{
            //console.log(res.data)
            setTimeout(()=>{ setSeach(false) }, 1500) 
            

            if(res.data.erroGeral){
                setWarning(res.data.msg)

                if(res.data.erroGeral === 'nao'){
                    if(res.data.dados.errorBD === 'nao'){
                        setTimeout(()=>{ props.set('setUserAppYes', userEmail) }, 2000) 
                        
                    }else{
                        showErro('Erro interno, tente novamente mais tarde')
                    }
                }else{
                    setButton('#B22222')
                }

            }

        })
        .catch((e)=>{
            setSeach(false)
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
        <ScrollView style={stl.scroll}>
            <View style={stl.formContainer}>
                <Text style={stl.title}>{users_data.name}</Text>
                <Text style={stl.subtitle}>Vamos fazer seu cadastro</Text>
                <AuthInput
                    icon={'account-plus-outline'}
                    keyboardType='default' 
                    placeholder={'Digite seu nome'} 
                    colorIcon={colorMicks}
                    style={stl.input} 
                    value={userName}
                    onChangeText={ (v) => {setUserName(v)} }
                />
                <AuthInput
                    icon={'at'}
                    keyboardType='email-address' 
                    placeholder={'Digite seu melhor email'} 
                    colorIcon={colorMicks}
                    style={stl.input} 
                    value={userEmail}
                    onChangeText={ (v) => {setUserEmail(v)} }
                />
                <InputMask
                    icon={'whatsapp'}
                    keyboardType='numeric' 
                    placeholder={'Digite seu n° de celular'} 
                    colorIcon={colorMicks}
                    style={stl.input} 
                    value={cel}
                    mask={"([00]) [00000]-[0000]"}
                    onChangeText={ (formatted, extracted) => {setCel(formatted)} }
                />
                <AuthInput
                    icon={'key-variant'}
                    secureTextEntry={true}
                    placeholder={'Digite uma senha'} 
                    colorIcon={colorMicks}
                    style={stl.input} 
                    value={userPass}
                    onChangeText={ (v) => {setUserPass(v)} }
                />
                <AuthInput
                    icon={'shield-key-outline'}
                    secureTextEntry={true} 
                    placeholder={'Confirme sua senha'} 
                    colorIcon={colorMicks}
                    style={stl.input} 
                    value={userPassConfirm}
                    onChangeText={ (v) => {setUserPassConfirm(v)} }
                />
                <Button 
                    text='Cadastrar'
                    func={ ()=>{ setSeach(true); checkForm() } }
                    colorText='#FFF'
                    colorButton={button}
                />
                <Text style={stl.warning}>{warning}</Text>
                <TouchableOpacity onPress={()=>{ props.set('jaTenhoConta', {}) }}><Text style={{color: '#FFF', textDecorationLine: 'underline', paddingTop: 10}}>Já tenho uma conta</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>{ props.set('setClearAll', {}) }}><Text style={{color: '#FFF', textDecorationLine: 'underline', paddingTop: 10}}>Novo usuário?</Text></TouchableOpacity>
                <View style={stl.img}>
                <LottieView autoPlay loop style={{ width: 100, height: 100 }} source={require('../img/success.json')} />
                </View>
                
            </View>

            <Msg show={seach}
                showProgress={true}
                title="Aguarde..."
                message={`Comunicando com nosso servidor...`}
                confirmButtonColor="#080"
                showCancelButton={false}
                showConfirmButton={false}
                onCancelPressed={() => { console.log('Cancelou') }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />
            
        </ScrollView>
    );

};

const stl = StyleSheet.create({
    title: {
        fontFamily: "Cochin",
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 8
    },
    subtitle: {
        color: '#FFF',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10
    },
    scroll:{
        flex: 1,
    },
    img:{
        position: 'absolute',
        right: 5,
        bottom: 1,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    formContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        marginTop: 30,
        padding: 10,
        margin: 10,
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