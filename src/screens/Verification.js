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

    state ? setTimeout(()=>{ setState(false) }, 500) : console.log("Dados Usuário",users_data)

    function set(type, payload){
        console.log(`UsersContext: Type: ${type}, Payload: ${payload}`)
        dispatch({
            type: type,
            payload: payload
        })
    }

    function Screens(){
        if(state){
            return <Splash />
        }else if(users_data.clientMicks === 'yes'){
            return <CPF set={set} />
        }else if(users_data.userApp === 'no'){
            return <Cadastro set={set} />
        }else if(users_data.appLogged === 'no'){
            return <Login set={set} />
        }else{
            return <Main set={set} />
        }
    }

    return(
        <Back>
            { Screens() }
        </Back>
    )

};