import React, { useState } from 'react';
import { StyleSheet, Modal, Text, View, TouchableWithoutFeedback, FlatList, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Button } from 'react-native-elements';

function AddressUnit(props){

    return (
        <View style={stl.containerAddress}>
            <View style={stl.view1}>
                <Text style={stl.item1}>{props.ad.item.adress}</Text>
            </View>
            <View style={stl.view2}>
                <Button
                    onPress={()=>{props.func(props.ad.item.id, props.ad.item.correct)}}
                    icon={{
                        name: 'home',
                        type: 'font-awesome',
                        size: 20,
                        color: 'white',
                    }}
                    iconContainerStyle={{ marginRight: 10 }}
                    titleStyle={{ fontWeight: '700' }}
                    buttonStyle={{
                        backgroundColor: 'rgba(90, 154, 230, 1)',
                        borderColor: 'transparent',
                        borderWidth: 0,
                        borderRadius: 25,
                    }}
                    containerStyle={{
                        width: 50,
                        marginHorizontal: 5,
                        marginVertical: 5,
                    }}
                />
            </View>
        </View>
    );
}

export default (props) => {

    function verifyCheck(id, correct){
        props.resp(correct) 
    }

    return (
        <Modal transparent={true} visible={props.isVisible} onRequestClose={props.onCancel} animationType='slide'>
            <TouchableWithoutFeedback onPress={props.onCancel}><View style={stl.background}></View></TouchableWithoutFeedback>
            
            <KeyboardAvoidingView behavior="padding" style={stl.key}>
                <View style={stl.container}>
                    <Text style={stl.header}>{props.dataClient.client.nome_cli.replace(/[^a-z0-9\s]/gi, "").substring(26, 0)}...</Text>
                    <Text style={stl.subHeader}>Confirme seu endereço</Text>

                    <FlatList 
                        data={props.dataClient.list}
                        keyExtractor={item => `${item.id}`}
                        renderItem={(obj)=> <AddressUnit ad={obj} func={verifyCheck} /> } // o spred operator serve para passar os items do OBJ como se fosse passando cada data separadamente.
                    />

                </View>
            </KeyboardAvoidingView>

            <TouchableWithoutFeedback onPress={props.onCancel}><View style={stl.background}></View></TouchableWithoutFeedback>
        </Modal>
    );
};

const stl = StyleSheet.create({
    background:{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    key:{
        flex: 4
    },
    container:{
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    containerAddress:{
        
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    view1:{
        height: 45,
        justifyContent: 'center',
        flex: 4,
    },
    item1:{
        fontSize: 17,
        color: '#FFF',
        fontStyle: 'italic',
        marginLeft: 10
    },
    view2:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item2:{
        fontSize: 16,
        color: '#FFF',
    },
    header:{
        backgroundColor: '#B13B44',
        color: '#FFF',
        textAlign: 'center',
        padding: 8,
        fontSize: 15
    },
    subHeader:{
        textAlign: 'center',
        padding: 8,
        fontSize: 18,
        color: '#FFF',
    },
});
