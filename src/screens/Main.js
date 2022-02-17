import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import UsersContext from '../UserProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Msg from '../components/Msg';
import Botao from '../components/Button';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [tela, setTela] = useState(0)
    const [confirm, setConfirm] = useState(false);
    
    const openModalLogoff = () => {
        setConfirm(true);
    };

    function HomeScreen() {
        
        return (
            <View style={stl.container}>
                <View style={stl.header}>
                    <Text>Cabeçalho</Text>
                </View>
                <View style={stl.body}>
                    <Text>Corpo</Text>
                </View>
                <View style={stl.footer}>
                    <View style={stl.footerA}>
                        <Text>Texto A</Text>
                    </View>
                    <TouchableOpacity style={stl.footerB} onPress={ ()=>{ setConfirm(true) } }>
                        <Icon name='exit-run' size={30} style={{color: "#0000FF"}} />
                    </TouchableOpacity>
                </View>

                <Msg show={confirm}
                    showProgress={false}
                    title="Atenção!"
                    message='Deseja fazer Logout no App?'
                    confirmButtonColor="#FF6347"
                    showCancelButton={true}
                    showConfirmButton={true}
                    onCancelPressed={() => { setConfirm(false)}}
                    onConfirmPressed={() => { props.set("jaTenhoConta", {}) }}
                />

            </View>
        );
    }

    function Telas(){
        if(tela === 0){ return <HomeScreen /> }
    }

    return(
        <>
            {
                Telas()
            }
        </>
    )
}

const stl = StyleSheet.create({
    container:{
        flex: 1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    },
    header:{
        flex: 1,
        backgroundColor: "#90EE90"
    },
    body:{
        flex: 7,
        backgroundColor: "#B0C4DE"
    },
    footer:{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "#DCDCDC"
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