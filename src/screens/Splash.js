import React, { useEffect } from 'react';
import { StyleSheet, Image, Dimensions, Animated } from 'react-native';
import logoMicks from '../img/avatar_micks.png';
import LottieView from 'lottie-react-native';
import { Text } from 'react-native-elements';
import API from '../components/API';
import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage";
const storage = new MMKVStorage.Loader().withEncryption().initialize();

export default (props)=>{
	const [email, setEmail] = useMMKVStorage("email", storage, "");

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
		color: '#4F4F4F',
	}
});