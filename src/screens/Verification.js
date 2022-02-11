import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Main from './Main';
import Splash from './Splash';
import Cadastro from './Cadastro';
import Login from './Login';
import CPF from './CPF';
import Back from '../components/Back';
import UsersContext from '../UserProvider';

export default (props)=>{
    const [state, setState] = useState(true)
	const {users_data, dispatch} = useContext(UsersContext)

    state ? setTimeout(()=>{ setState(false) }, 200) : console.log("Dados Usuário",users_data)
/*
    if(state){
        return <Splash />
    }else if(users_data.clientMicks === 'no'){
        return <CPF />
    }else if(users_data.userApp === 'no'){
        return <Cadastro />
    }else if(users_data.appLogged === 'no'){
        return <Login />
    }else{
        return <Main />
    }
*/
    return(
        <Back>
            { state && <Splash />}
            { state === false && users_data.clientMicks === 'no'  && <CPF />}
            { state === false && users_data.clientMicks === 'yes' && <Cadastro />}
        </Back>
    )

};