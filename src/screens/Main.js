import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Button, Overlay, Icon } from 'react-native-elements';
import UsersContext from '../UserProvider';
import Botao from '../components/Button';
import AuthInput from '../components/AuthInput';
import API from '../components/API';
import Msg from '../components/Msg';

OverlayComponentProps = {};

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [seach, setSeach] = useState(false);
    const [boletos, setBoletos] = useState([]);
    const [warning, setWarning] = useState('');

    function ZerarTudo(){
        props.set('setClearAll', '')
    }

    function showErro(e){
        Alert.alert('Ops!', `${e}`)
    }

    async function getBoletos(){
        let arrayCoder = users_data.codCli.split(',')
        console.log("Códigos de Cliente:")
        console.log(arrayCoder)

        let boletoTemp = []
        for (const [index, cod] of arrayCoder.entries()) {

            await API('faturas_app', {codcli: cod })
            .then((res)=>{
                console.log(res.data.boletos[0].cliente)

                setWarning(res.data.msg)
                if(res.data.erroGeral === 'nao'){
                    res.data.boletos.map((item, index)=>{
                        boletoTemp.push(item)
                        //console.log(`Boleto ${index} - ${item.cod_fatura}`)
                    })
                }else{
                    setButton('#B22222')
                }

            })
            .catch((e)=>{
                console.log(e);
                showErro('Erro interno, tente novamente mais tarde')
            });

        }
        
        setBoletos(boletoTemp)
        // Um console.log(boletos) aqui não vai aparecer os dados, pois essa variável só é mudada na próxima renderização
        setSeach(false)
        
    }

    useEffect(() => {
        getBoletos();
    }, [])

    function ListBoletos(props){
        const [visible, setVisible] = useState(false);

        const toggleOverlay = () => {
            setVisible(!visible);
        };

        return(
            <>
                <TouchableOpacity style={stl.viewBoletos1} onPress={toggleOverlay}>
                    <Text style={stl.warning}> Vencimento: {props.ad.item.vencimento}</Text>
                </TouchableOpacity>

                <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                    <Text>Valor a pagar: {props.ad.item.valor_a_pagar}</Text>
                    <Text>Descrição: {props.ad.item.decricao1}</Text>
                    <Text>Código de Barras: {props.ad.item.codBarra}</Text>
                    
                    <Button
                        icon={
                            <Icon
                            name="wrench"
                            type="font-awesome"
                            color="white"
                            size={25}
                            iconStyle={{ marginRight: 10 }}
                            />
                        }
                        title="Fechar"
                        onPress={toggleOverlay}
                    />
                </Overlay>
            </>
        )
    }

    return (
        <>
            <View style={stl.formContainer}>
            <FlatList 
                data={boletos}
                keyExtractor={item => `${item.cod_fatura}`}
                renderItem={(obj)=> <ListBoletos ad={obj} /> }
            />
            </View>
        </>
	);
};

const stl = StyleSheet.create({
    viewBoletos1:{
        backgroundColor: 'blue',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewBoletos2:{
        backgroundColor: 'red',
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        width: '95%',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    warning:{
        color: '#FFF',
        fontSize: 15,
    },
});