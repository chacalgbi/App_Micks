import React from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import UsersContext from '../UserProvider';
import logoMicks from '../img/avatar_micks.png';
import Back from '../components/Back';

export default (props)=>{
	return (
        <Back>
            <Image style={stl.img} source={logoMicks} />
        </Back>
	);

};

const stl = StyleSheet.create({
	img:{
		width: Dimensions.get('window').width / 2,
		height: Dimensions.get('window').width / 2,
	}
});