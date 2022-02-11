import React from 'react';
import { View} from 'react-native';
import Verification from './src/screens/Verification';
import { UsersProvider } from './src/UserProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default ()=>{
	return (
		<SafeAreaProvider>
			<UsersProvider>
				<Verification />
			</UsersProvider>
		</SafeAreaProvider>
	);
};