import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, BackHandler } from 'react-native';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomSheet, ListItem, Image } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import UsersContext from '../UserProvider';
import LottieView from 'lottie-react-native';
import Button from '../components/Button';
import API from '../components/API';
import Msg from '../components/Msg';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [isVisible, setIsVisible] = useState(false);
    const [seach, setSeach] = useState(false);
    const [namePlain, setNamePlain] = useState('');

    const plans = users_data.descriSer.split(',')
    const login = users_data.login.split(',')
    const list = []

    list.push({title: `Escolha o plano`, containerStyle: { backgroundColor: '#4F4F4F' }, titleStyle: { color: 'white' }})
    plans.map((item, index)=>{
        list.push({title: `${item}`, onPress: ()=>{ getExtract(login[index], item) }})
    })
    list.push({ title: 'Fechar', containerStyle: { backgroundColor: 'red' }, titleStyle: { color: 'white' }, onPress: () => setIsVisible(false) })

    function getExtract(login, plain){
        setNamePlain(plain)
        setSeach(true)
        setIsVisible(false)
        console.log(login)
    }

    useEffect(() => {
        const backAction = () => { props.back(0); return true; };
        const backHandler = BackHandler.addEventListener( "hardwareBackPress", backAction );
        return () => backHandler.remove();
    }, []);

    return(
        <SafeAreaProvider style={{flex: 1, width: '100%'}}>
            <View style={stl.header}>
                <TouchableOpacity onPress={ ()=>{ props.back(0)} }>
                    <IconMaterial name='arrow-left-circle-outline' size={50} style={{color: "#4460D9"}} />
                </TouchableOpacity>
            </View>
            <View style={stl.body}>
                <Text>Conexão</Text>
            </View>
            <TouchableOpacity onPress={ ()=>{ setIsVisible(true)} } style={stl.img}>
                <IconMaterial name='plus-circle' size={80} style={{color: "#4460D9"}} />
            </TouchableOpacity>

            <BottomSheet modalProps={{}} isVisible={isVisible}>
                {list.map((l, i) => (
                    <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress} >
                        <ListItem.Content>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>

            <Msg show={seach}
                showProgress={true}
                title="Aguarde..."
                message={`Verificando extrato do plano: ${namePlain}`}
                confirmButtonColor="#080"
                showCancelButton={true}
                showConfirmButton={false}
                onCancelPressed={() => { setSeach(false) }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />
        </SafeAreaProvider>
        
    )
}

const stl = StyleSheet.create({
    header:{
        marginTop: 25
    },
    img:{
        position: 'absolute',
        right: 10,
        bottom: 5,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    body:{
        flex: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginTop: 10,
        marginBottom: 30,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 30

    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title:{
        fontSize: 22,
        margin: 20
    },
    subtitle:{
        fontSize: 14,
    },
    warning:{
        color: '#FFF',
        fontSize: 15,
    },
    viewBoletos1:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    viewBoletos2:{
        backgroundColor: 'red',
    },
    textList:{
        fontSize: 20,
    },
    textModal:{
        fontSize: 16,
        padding: 3,
        marginLeft: 5
    }
})