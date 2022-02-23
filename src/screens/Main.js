import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BottomSheet, ListItem, Image } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import UsersContext from '../UserProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Msg from '../components/Msg';
import Boleto from './Boleto';
import Desbloqueio from './Desbloqueio';
import Extrato from './Extrato';
import { baner } from '../components/variables'

export default (props)=>{

    const BASE_URI = 'https://source.unsplash.com/random?sig=';
    const {users_data, dispatch} = useContext(UsersContext)
    const [tela, setTela] = useState(0)
    const [confirm, setConfirm] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const plans = users_data.descriSer.split(',')
    const list = []

    list.push({title: `${users_data.name}`, containerStyle: { backgroundColor: '#4F4F4F' }, titleStyle: { color: 'white' }})
    plans.map((item, index)=>{ list.push({title: `${item}`}) })
    list.push({ title: 'Fechar', containerStyle: { backgroundColor: 'red' }, titleStyle: { color: 'white' }, onPress: () => setIsVisible(false) })

    function HomeScreen() {
        
        return (
            <SafeAreaProvider style={stl.container}>
                <View style={stl.header}>
                    <Image
                        source={{ uri: baner }}
                        containerStyle={stl.item}
                        PlaceholderContent={<ActivityIndicator />}
                        resizeMode='contain'
                    />
                </View>
                <View style={stl.body}>
                    <View style={stl.items}>
                        <TouchableOpacity onPress={ ()=>{ setTela(1) } } style={stl.itemMenu}>
                            <LottieView autoPlay loop style={{ width: 100, height: 100 }} source={require('../img/pay1.json')} />
                            <Text style={{fontSize: 15}}>Faturas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ ()=>{ setTela(3) } } style={stl.itemMenu}>
                            <LottieView autoPlay loop style={{ width: 100, height: 100 }} source={require('../img/wifi.json')} />
                            <Text style={{fontSize: 15}}>Extrato de Conexão</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={stl.items}>
                        <TouchableOpacity onPress={ ()=>{ setTela(2) } } style={stl.itemMenu}>
                            <LottieView autoPlay loop style={{ width: 100, height: 100 }} source={require('../img/unlock.json')} />
                            <Text style={{fontSize: 15}}>Desbloqueio Provisório</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  style={stl.itemMenu}>
                            <LottieView autoPlay loop style={{ width: 100, height: 100 }} source={require('../img/info.json')} />
                            <Text style={{fontSize: 15}}>Informações</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={stl.footer}>
                    <View style={stl.footerA}>
                        <TouchableOpacity style={stl.viewOpenModal} onPress={ ()=>{ setIsVisible(true) } }>
                            <Icon name='format-list-bulleted-square' size={30} style={{color: "#4460D9"}} />
                            <Text style={stl.openListPlains}>Listar Planos</Text>
                        </TouchableOpacity>
                        
                    </View>
                    <TouchableOpacity style={stl.footerB} onPress={ ()=>{ setConfirm(true) } }>
                        <Icon name='exit-run' size={30} style={{color: "#000000"}} />
                    </TouchableOpacity>
                </View>

                <Msg show={confirm}
                    showProgress={false}
                    title="Atenção!"
                    message='Deseja fazer Logout no App?'
                    confirmButtonColor="#4460D9"
                    showCancelButton={true}
                    showConfirmButton={true}
                    onCancelPressed={() => { setConfirm(false)}}
                    onConfirmPressed={() => { props.set("jaTenhoConta", {}) }}
                />

                <BottomSheet modalProps={{}} isVisible={isVisible}>
                    {list.map((l, i) => (
                        <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress} >
                            <ListItem.Content>
                                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </BottomSheet>

            </SafeAreaProvider>
        );
    }

    function backTela(num){
        setTela(num)
    }

    function Telas(){
        if(tela === 0){ return <HomeScreen /> }
        if(tela === 1){ return <Boleto back={backTela} /> }
        if(tela === 2){ return <Desbloqueio back={backTela} /> }
        if(tela === 3){ return <Extrato back={backTela} /> }
    }

    return Telas()
}

const stl = StyleSheet.create({
    container:{
        flex: 1,
        width: '100%',
        height: '100%',
    },
    header:{
        flex: 3,
        width: '100%',
        height: '100%',
    },
    item: {
        flex: 1,
        width: null,
        height: null
    },
    body:{
        flex: 7,
    },
    items:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemMenu:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textFooter:{
        fontSize: 12,
        marginLeft: 8,
        marginTop: 5
    },
    openListPlains:{
        fontSize: 20,
        textDecorationLine: 'underline',
        textDecorationColor: '#6959CD',
        fontWeight: 'bold'
    },
    viewOpenModal:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerA:{
        flex: 5,
    },
    footerB:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})