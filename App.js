import React, { useEffect } from 'react';
import { View} from 'react-native';
import Verification from './src/screens/Verification';
import { UsersProvider } from './src/UserProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PushNotification from "react-native-push-notification";
import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage";
import API from './src/components/API';
const storage = new MMKVStorage.Loader().withEncryption().initialize();

export default ()=>{

	const [token, setToken] = useMMKVStorage("token", storage, "");
	const [email, setEmail] = useMMKVStorage("email", storage, "");

	PushNotification.configure({
		onRegister: function (res) { 
			//console.log("TOKEN:", res.token);
			setToken(res.token)
		},

		onNotification: function (notification) {
			//console.log("NOTIFICATION 1:", notification);
			if (notification.foreground){
				console.log("Notificação chegou! App estava aberto!")
			}
		},

		onAction: function (notification) {
			console.log("ACTION:", notification.action);
			console.log("NOTIFICATION 2:", notification);
		},

		onRegistrationError: function(err) { console.error(err.message, err); },

		permissions: { alert: true, badge: true, sound: true },
		popInitialNotification: true,
		requestPermissions: true,
	});

	//toda vez que entrar no Aplicativo, manda pro BD a data/hora
	async function isGet(){
        await API('isgetapp', { email })
        .then((res)=>{ 
			//console.log("Entrou no App:",res.data.msg) 
		})
        .catch((e)=>{  
			console.log(e); 
		});
    }

	useEffect(() => { isGet() }, [])

	return (
		<SafeAreaProvider>
			<UsersProvider>
				<Verification />
			</UsersProvider>
		</SafeAreaProvider>
	);
};