import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import UsersContext from '../UserProvider';
import LottieView from 'lottie-react-native';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [warning, setWarning] = useState('');

    const faturas = users_data.codsercli.split(',')

    useEffect(() => {
        const backAction = () => { props.back(0); return true; };
        const backHandler = BackHandler.addEventListener( "hardwareBackPress", backAction );
        return () => backHandler.remove();
    }, []);

    return(
        <View style={{flex: 1, width: '100%'}}>
            <View style={stl.header}>
                <TouchableOpacity onPress={ ()=>{ props.back(0)} }>
                    <IconMaterial name='arrow-left-circle-outline' size={50} style={{color: "#4460D9"}} />
                </TouchableOpacity>
            </View>

            <View style={stl.body}>
                <FlatList 
                    data={faturas}
                    keyExtractor={item => `${Math.floor(Math.random() * 65536)}`}
                    renderItem={(obj)=> <Text style={{fontSize: 20}}>{`${obj.item}`}</Text> }
                    listEmptyComponent={()=>{ <Text style={{fontSize: 20}}>Você não possui planos</Text> }}
                    ItemSeparatorComponent={()=> { return <View style={{ height: 10 }} /> }}
                />
            </View>

            <View style={stl.img}>
                <LottieView autoPlay loop style={{ width: 100, height: 100 }} source={require('../img/unlock.json')} />
            </View>
        </View>
        
    )
}

const stl = StyleSheet.create({
    header:{
        marginTop: 25
    },
    img:{
        position: 'absolute',
        right: 10,
        bottom: 10,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    body:{
        flex: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
        fontSize: 18,
        marginBottom: 20
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