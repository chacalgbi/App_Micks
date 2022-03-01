import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, BackHandler } from 'react-native';
import UsersContext from '../UserProvider';
import { Rating } from 'react-native-elements';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import API from '../components/API';
import Msg from '../components/Msg';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [seach, setSeach] = useState(false);

    useEffect(() => {
        const backAction = () => { props.back(0); return true; };
        const backHandler = BackHandler.addEventListener( "hardwareBackPress", backAction );
        return () => backHandler.remove();
    }, []);

    function showErro(e){
        Alert.alert('Ops!', `${e}`)
    }

    async function evaluation(rating){
        setSeach(true)
        const obj = {
            email: users_data.email,
            nota: rating
        }

        await API('evaluation', obj)
        .then((res)=>{
            setTimeout(()=>{ setSeach(false) }, 1000)
            if(res.data.erroGeral){
                if(res.data.erroGeral === 'nao'){
                    Alert.alert('Sucesso!', 'Sua avaliação foi salva!')
                }else{
                    showErro('Erro interno, tente novamente mais tarde')
                }
            }
        })
        .catch((e)=>{
            console.log(e);
            showErro('Erro interno, tente novamente mais tarde')
        });
    }

    return(
        <View style={{flex: 1, width: '100%'}}>
            <View style={stl.header}>
                <TouchableOpacity onPress={ ()=>{ props.back(0)} }>
                    <IconMaterial name='arrow-left-circle-outline' size={50} style={{color: "#4460D9"}} />
                </TouchableOpacity>
            </View>
            <View style={{flex: 9, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <View style={stl.formContainer}>
                    <Text style={stl.question}>Como você avalia o serviço da Micks?</Text>
                    <Rating
                        type="custom"
                        ratingColor="#4460D9"
                        ratingCount={10}
                        startingValue={0}
                        imageSize={32}
                        onFinishRating={evaluation}
                        showRating
                        style={{ paddingVertical: 10 }}
                    />

                    <Msg show={seach}
                        showProgress={true}
                        title="Aguarde..."
                        message={'Enviando sua avaliação'}
                        confirmButtonColor="#080"
                        showCancelButton={false}
                        showConfirmButton={false}
                        onCancelPressed={() => { console.log('Cancelou') }}
                        onConfirmPressed={() => { console.log('Clicou em OK') }}
                    />
                </View>
            </View>
        </View>

    );

};

const stl = StyleSheet.create({
    formContainer: {
        flex: 1,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    question:{
        fontSize: 20
    },
    header:{
        marginTop: 25,
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
});