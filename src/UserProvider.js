import React, { createContext, useReducer, useState } from 'react';
import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage";

const storage = new MMKVStorage.Loader().withEncryption().initialize();
const UsersContext = createContext({})

export const UsersProvider = (props) => {

	const [clientMicks, setClientMicks] = useMMKVStorage("clientMicks", storage, "no");
	const [userApp, setUserApp]         = useMMKVStorage("userApp", storage, "no");
	const [appLogged, setAppLogged]     = useMMKVStorage("appLogged", storage, "no");
	const [codCli, setCodCli]           = useMMKVStorage("codCli", storage, "");
	const [cliDOC, setCliDOC]           = useMMKVStorage("cliDOC", storage, "");
	const [name, setName]               = useMMKVStorage("name", storage, "");
	const [email, setEmail]             = useMMKVStorage("email", storage, "");

	let contexto = {
        appLogged: appLogged,
        clientMicks: clientMicks,
        codCli: codCli,
        cliDOC: cliDOC,
        name: name,
		userApp: userApp,
        email, email
	}

    const acoes = {
        setClientMicksYes(data, action){
            setCliDOC(action.payload.cliDOC)
            setCodCli(action.payload.codCli)
            setName(action.payload.name)
            setClientMicks('yes')
            let contexto1 = {
                appLogged: appLogged,
                clientMicks: 'yes',
                codCli: action.payload.codCli,
                cliDOC: action.payload.cliDOC,
                name: action.payload.name,
                userApp: userApp,
                email: email
            }
            return contexto1
        },
        setUserAppYes(data, action){
            setUserApp('yes')
            setClientMicks('yes')
            setEmail(action.payload)
            let contexto1 = {
                appLogged: appLogged,
                clientMicks: 'yes',
                codCli: codCli,
                cliDOC: cliDOC,
                name: name,
                userApp: 'yes',
                email: action.payload
            }
            return contexto1
        },
        setAppLoggedYes(data, action){
            setUserApp('yes')
            setClientMicks('yes')
            setAppLogged('yes')
            let contexto1 = {
                appLogged: 'yes',
                clientMicks: 'yes',
                codCli: codCli,
                cliDOC: cliDOC,
                name: name,
                userApp: 'yes',
                email: email
            }
            return contexto1
        },
        setClearAll(data, action){
            setClientMicks()
            setUserApp()
            setAppLogged()
            setCodCli()
            setCliDOC()
            setName()
            setEmail()
            let cleaned = {
                appLogged: appLogged,
                clientMicks: clientMicks,
                codCli: codCli,
                cliDOC: cliDOC,
                name: name,
                userApp: userApp,
                email: email
            }
            return cleaned
        }
    }

    //Reducer evolui o estado, muda os valores que estão dentro do obj "contexto" e deixa ele disponível em todo o App
    function reducer(data, action){
        const funcao = acoes[action.type] // Se houver uma função dentro de 'acoes' com o nome passado por 'action.type', atribui ela a essa variável 'funcao'
        return funcao ? funcao(data, action) : data // Se a funcão existir, passa os parametros e executa ela, senão, retorna os mesmos usuários.
    }

    const [users_data, dispatch] = useReducer(reducer, contexto)

    return (
        <UsersContext.Provider value={{ users_data, dispatch }}>
            {props.children}
        </UsersContext.Provider>
    )
}

export default UsersContext