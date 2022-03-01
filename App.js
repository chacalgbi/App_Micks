import React from 'react';
import Verification from './src/screens/Verification';
import { UsersProvider } from './src/UserProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PushNotification from "react-native-push-notification";
import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage";
const storage = new MMKVStorage.Loader().withEncryption().initialize();

export default ()=>{
	const [token, setToken] = useMMKVStorage("token", storage, "");
	
	PushNotification.configure({
		onRegister: function (res) { 
			//console.log("TOKEN:", res.token);
			setToken(res.token)
		},

		onNotification: function (notification) {
			//console.log("NOTIFICATION 1:", notification);
			if (notification.foreground){
				//console.log("Notificação chegou! App estava aberto!")
			}
		},

		onAction: function (notification) {
			//console.log("ACTION:", notification.action);
			//console.log("NOTIFICATION 2:", notification);
		},

		onRegistrationError: function(err) { console.error(err.message, err); },

		permissions: { alert: true, badge: true, sound: true },
		popInitialNotification: true,
		requestPermissions: true,
	});

	return (
		<SafeAreaProvider>
			<UsersProvider>
				<Verification />
			</UsersProvider>
		</SafeAreaProvider>
	);
};