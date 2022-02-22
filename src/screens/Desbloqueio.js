import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, BackHandler } from 'react-native';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import UsersContext from '../UserProvider';
import LottieView from 'lottie-react-native';
import Button from '../components/Button';
import API from '../components/API';
import Msg from '../components/Msg';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [warning, setWarning] = useState('Buscando planos suspensos');
    const [seach, setSeach] = useState(true);
    const [plainBlocked, setPlainBlocked] = useState('');
    const [ok, setOk] = useState(false);
    const [button, setButton] = useState('#4460D9');
    const [buttonText, setButtonText] = useState('Solicitar desbloqueio');

    async function verify(){
        await API('isBlocked', { codCli: users_data.codCli })
        .then((res)=>{
            if(res.data.erroGeral){
                setWarning(res.data.msg)
                setTimeout(() => { setSeach(false) }, 500);
                
                if(res.data.erroGeral === 'nao'){
                    let blocked = []
                    res.data.dados.map((item, index)=>{
                        if (item.suspenso === true){
                             blocked.push(item.codsercli)
                        }
                    })
                    let unique = [...new Set(blocked)]; // Tira todos os valores repetidos
                    if(unique.length === 0){
                        setWarning("Você não possui planos suspensos por débito!")
                        setButtonText('Tudo certo! :)')
                    }else{
                        setWarning("Você possui planos suspensos por débito!")
                        setPlainBlocked(unique)
                        console.log("Codsercli do plano bloqueado:", unique)
                    }
                }
            }
        })
        .catch((e)=>{
            console.log(e);
            setWarning(e)
        });
    }

    async function solicitar(){
        setButton('#4460D9')
        setOk(false)
        if(plainBlocked.length != 0){
            for (const [index, cod] of plainBlocked.entries()) {
                await API('desbloqueio', { codsercli: cod })
                .then((res)=>{
                    if(res.data.erroGeral){
                        setWarning(res.data.msg)
                        if(res.data.erroGeral === 'nao'){
                            setOk(true)
                            setButton('#3CB371')
                        }else{
                            setButton('#FF6347')
                        }
                    }
                })
                .catch((e)=>{
                    console.log(e);
                    setWarning(e)
                });
            }
        }
    }

    useEffect(() => {
        const backAction = () => { props.back(0); return true; };
        const backHandler = BackHandler.addEventListener( "hardwareBackPress", backAction );
        return () => backHandler.remove();
    }, []);

    useEffect(()=>{
        verify()
    }, [])

    return(
        <View style={{flex: 1, width: '100%'}}>
            <View style={stl.header}>
                <TouchableOpacity onPress={ ()=>{ props.back(0)} }>
                    <IconMaterial name='arrow-left-circle-outline' size={50} style={{color: "#4460D9"}} />
                </TouchableOpacity>
            </View>

            <View style={stl.body}>
                <Text style={stl.title}>{warning}</Text>
                <Button 
                    text={buttonText}
                    func={ ()=>{ solicitar() } }
                    colorText='#FFF'
                    colorButton={button}
                />
                <LottieView autoPlay={ok}    loop style={{ width: 200, height: 200 }} source={require('../img/ok.json')} />
            </View>

            <View style={stl.img}>
                <LottieView autoPlay loop style={{ width: 100, height: 100 }} source={require('../img/unlock.json')} />
            </View>

            <Msg show={seach}
                showProgress={true}
                title="Aguarde..."
                message={`Verificando seus planos`}
                confirmButtonColor="#080"
                showCancelButton={true}
                showConfirmButton={false}
                onCancelPressed={() => { setSeach(false) }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />

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