import React, { createContext, useReducer, useState } from 'react';
import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage";

const storage = new MMKVStorage.Loader().withEncryption().initialize();
const UsersContext = createContext({})

export const UsersProvider = (props) => {

	const [clientMicks, setClientMicks] = useMMKVStorage("clientMicks", storage, "no");
	const [userApp, setUserApp]         = useMMKVStorage("userApp", storage, "no");
	const [appLogged, setAppLogged]     = useMMKVStorage("appLogged", storage, "no");
	const [codCli, setCodCli]           = useMMKVStorage("codCli", storage, []);
	const [cliCPF, setCliCPF]           = useMMKVStorage("cliCPF", storage, "");
	const [cliCnpj, setCliCnpj]         = useMMKVStorage("cliCnpj", storage, "");

	let contexto = {
        appLogged: appLogged,
        clientMicks: clientMicks,
        codCli: codCli,
        cliCPF: cliCPF,
        cliCnpj: cliCnpj,
		userApp: userApp
	}

    const acoes = {
        setClientMicksYes(data, action){
            setCliCPF(action.payload)
            setClientMicks('yes')
            
            let contexto1 = {
                appLogged: appLogged,
                clientMicks: 'yes',
                codCli: codCli,
                cliCPF: cliCPF,
                cliCnpj: cliCnpj,
                userApp: userApp
            }
            return contexto1
        },
        setClearAll(data, action){
            setClientMicks('no')
            setUserApp('no')
            setAppLogged('no')
            setCodCli("")
            setCliCPF("")
            let cleaned = {
                appLogged: appLogged,
                clientMicks: clientMicks,
                codCli: codCli,
                cliCPF: cliCPF,
                userApp: userApp
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