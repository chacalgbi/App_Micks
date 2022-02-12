import React from 'react';
import { StyleSheet, Image, Dimensions, Animated } from 'react-native';
import logoMicks from '../img/avatar_micks.png';
import LottieView from 'lottie-react-native';
import { Text } from 'react-native-elements';

export default (props)=>{
	return (
        <Animated.View style={stl.container}>
			<Text h1 style={stl.texto}>Micks Fibra</Text>
            <Image style={stl.img} source={logoMicks} />
			<LottieView autoPlay loop style={{ width: 100, height: 100 }} source={require('../img/03.json')} />
        </Animated.View>
	);

};

const stl = StyleSheet.create({
	img:{
		width: Dimensions.get('window').width / 2,
		height: Dimensions.get('window').width / 2,
	},
	container:{
		justifyContent: 'center',
        alignItems: 'center',
	},
	texto:{
		color: '#FFF',
	}
});