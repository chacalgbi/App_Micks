import React from 'react';
import { View} from 'react-native';
import Verification from './src/screens/Verification';
import { UsersProvider } from './src/UserProvider';

export default ()=>{
	return (
		<UsersProvider>
			<Verification />
		</UsersProvider>
	);
};