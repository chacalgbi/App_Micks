import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, BackHandler, Dimensions, ScrollView } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import UsersContext from '../UserProvider';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import API from '../components/API';
import Msg from '../components/Msg';
import InputMask from '../components/InputMask';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [seach, setSeach] = useState(false)
    const [selectedCodsercli, setSelectedCodsercli] = useState("")
    const [motivo, setMotivo] = useState("")
    const [cel, setCel] = useState('')
    const [obs, setObs] = useState("")
    const [button, setButton] = useState('#4460D9')
    const [msg, setMsg] = useState('')

    const planos    = users_data.descriSer.split(',')
    const codsercli = users_data.codsercli.split(',')
    const codCli    = users_data.codCli.split(',')[0]
    const array_motivos = ["Internet lenta", "Sem internet", "Financeiro", "Outros"]
    const array_planos = []
    planos.map((item, index)=>{ array_planos.push({id: codsercli[index], nome: item}) })

    useEffect(() => {
        const backAction = () => { props.back(0); return true; };
        const backHandler = BackHandler.addEventListener( "hardwareBackPress", backAction );
        return () => backHandler.remove();
    }, []);

    function showErro(e){
        Alert.alert('Ops!', `${e}`)
    }

    async function abrirAtendimento(obj){
        setSeach(true)

        await API('atendimento', obj)
        .then((res)=>{
            setTimeout(()=>{ setSeach(false) }, 1500)
            if(res.data.erroGeral){
                if(res.data.erroGeral === 'nao'){
                    let resposta = `${res.data.msg} - Em breve entraremos em contato`
                    setMsg(resposta)
                    Alert.alert('Aten????o!', resposta)
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

    function checkForm(){
        if(selectedCodsercli == ''){
            Alert.alert('Ops!', "Selecione um plano!")
        }else if(motivo == '' ){
            Alert.alert('Ops!', "Selecione um motivo")
        }else if(cel.length < 15){
            Alert.alert('Ops! N??mero de telefone inv??lido!', "Digite um n??mero com 11 caracteres.")
        }else if(obs.length < 15){
            Alert.alert('Ops! Descri????o muito curta!', "Digite uma descri????o mais detalhada!")
        }else{
            let obj = {
                codsercli: selectedCodsercli,
                motivo: motivo,
                cel: cel,
                obs: obs,
                codcli: codCli
            }
            abrirAtendimento(obj)
        }
    }

    return(
        <ScrollView style={{flex: 1, width: '100%'}}>
            <View style={stl.header}>
                <TouchableOpacity onPress={ ()=>{ props.back(0)} }>
                    <IconMaterial name='arrow-left-circle-outline' size={50} style={{color: "#4460D9"}} />
                </TouchableOpacity>
            </View>
            <View style={{flex: 9, width: '100%', alignItems: 'center'}}>
                <View style={stl.formContainer}>
                    
                    <Picker selectedValue={selectedCodsercli} style={stl.box} onValueChange={(item, index) => setSelectedCodsercli(item)} >
                        <Picker.Item key={`${0}`} label="Selecione o plano" value="" />
                        {
                            array_planos.map((item, index)=>{ return <Picker.Item key={`${index+1}`} label={`${item.nome}`} value={`${item.id}`} /> })
                        }
                    </Picker>

                    <Picker selectedValue={motivo} style={stl.box} onValueChange={(item, index) => setMotivo(item)} >
                        <Picker.Item key={`${0}`} label="Selecione o motivo" value="" />
                        {
                            array_motivos.map((item, index)=>{ return <Picker.Item key={`${index+1}`} label={`${item}`} value={`${item}`} /> })
                        }
                    </Picker>
                    
                    <InputMask
                        icon={'whatsapp'}
                        keyboardType='numeric' 
                        placeholder={'Digite seu n?? de contato'} 
                        colorIcon='#4460D9'
                        style={stl.input} 
                        value={cel}
                        mask={"([00]) [00000]-[0000]"}
                        onChangeText={ (formatted, extracted) => {setCel(formatted)} }
                    />

                    <View style={stl.buttonView}>
                        <Icon name='alert' size={20} style={{color: '#4460D9', marginLeft: 10, marginRight: 10}} />
                        <TextInput 
                            placeholder={'Descreva seu problema'} 
                            multiline
                            numberOfLines={3}
                            value={obs}
                            onChangeText={ (v) => {setObs(v)} }
                            style={stl.problem}
                         />
                    </View>

                    <Button 
                        text='Relatar'
                        func={ ()=>{ checkForm() } }
                        colorText='#FFF'
                        colorButton={button}
                    />
                    <Text style={{margin: 10, fontSize: 20}}>{msg}</Text>

                    <Msg show={seach}
                        showProgress={true}
                        title="Aguarde..."
                        message={'Enviando sua solicita????o'}
                        confirmButtonColor="#080"
                        showCancelButton={false}
                        showConfirmButton={false}
                        onCancelPressed={() => { console.log('Cancelou') }}
                        onConfirmPressed={() => { console.log('Clicou em OK') }}
                    />
                </View>
            </View>
        </ScrollView>

    );

};

const stl = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        width: '80%'
    },
    question:{
        color: '#000000',
        fontSize: 20
    },
    header:{
        marginTop: 50,
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    box:{
        height: 50,
        width: Dimensions.get('window').width - 20,
        margin: 10,
        backgroundColor: '#4460D9',
        borderWidth: 2,
        color: '#FFF'
    },
    input: {
        height: 50,
        margin: 10,
        backgroundColor: '#FFF',
        borderWidth: 2
    },
    buttonView:{
        height: 100,
        width: Dimensions.get('window').width - 20,
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    problem:{
        color: '#000000',
        height: 85,
        width: Dimensions.get('window').width - 75,
    }
});