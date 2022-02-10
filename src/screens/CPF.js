import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements';
import UsersContext from '../UserProvider';
import estilo from '../Estilos';
import AuthInput from '../components/AuthInput';
import Back from '../components/Back';
import Button from '../components/Button';
import API from '../components/API';
import Msg from '../components/Msg';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [cpf, setCpf] = useState('');
    const [warning, setWarning] = useState('');
    const [button, setButton] = useState('#080');
    const [seach, setSeach] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [check1, setCheck1] = useState(false);

    function success(client, cliArray){

    }

    function showErro(e){

    }

    function formatCpf(num){
        let formatado = num.replace(/\D+/g, "");
        let final = '';
        if(formatado.length == 11){
            final = formatado.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{2})/, "$1.$2.$3-$4");
        }else{
            final = formatado;
        }
        return final;
    }

    async function getCPFIntegrator(cpf){
        const cpfFormated = formatCpf(cpf)
        console.log(cpfFormated)

        await API('cpf',{cpf: cpfFormated})
        .then((res)=>{
            console.log(res.data)
            
            setTimeout(()=>{ setSeach(false) }, 1000)

            if(res.data.erroGeral){
                setWarning(res.data.msg)

                if(res.data.erroGeral === 'nao'){
                    if(res.data.dados.errorBD === 'nao'){
                        let arrayCodCli = []
                        res.data.dados.resposta.map((item, index)=>{
                            arrayCodCli.push(item.codigo)
                        })
                        success(res.data.dados.resposta[0], arrayCodCli)
                    }else{
                        showErro('Erro interno, tente novamente mais tarde')
                    }
                }else{
                    setCpf('')
                    setButton('#B22222')
                }

            }

        })
        .catch((e)=>{
            setSeach(false)
            console.log(e);
        });

    }

	return (
        <Back>
            <View style={stl.formContainer}>
                <Text style={stl.title}>Olá Cliente</Text>
                <Text style={stl.subtitle}>Digite seu {check1 ? 'CNPJ' : 'CPF'}</Text>

                <View style={stl.viewCpfOrCnpj}>
                    <CheckBox center 
                        checkedIcon={ <Icon name="radio-button-checked" type="material" color="red" size={25} /> }
                        uncheckedIcon={ <Icon name="radio-button-unchecked" type="material" color="green" size={25} /> }
                        checked={check1} onPress={ () => setCheck1(!check1) } />
                    <Text style={stl.cpfOrCnpj}>{check1 ? 'CPF?' : 'CNPJ?'}</Text>
                </View>
                
                

                <AuthInput icon={check1 ? 'aws' : 'user'} keyboardType='numeric' placeholder={check1 ? 'CNPJ: 33.444.555/0001-66' : 'CPF: 123.456.789-00'} style={stl.input} value={cpf} onChangeText={ (v) => {setCpf(v); setButton('#080')} } />
                <Button text='Verificar' func={ ()=>{ getCPFIntegrator(cpf); setSeach(true) } } colorText='#FFF' colorButton={button} />
                <Text style={stl.warning}>{warning}</Text>
            </View>
            <Msg show={seach}
                showProgress={true}
                title="Aguarde..."
                message="Buscando seu CPF em nosso sistema."
                confirmButtonColor="#080"
                showCancelButton={false}
                showConfirmButton={false}
                onCancelPressed={() => { console.log('Cancelou') }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />
            <Msg show={confirm}
                showProgress={true}
                title="Aguarde..."
                message="Buscando seu CPF em nosso sistema."
                confirmButtonColor="#080"
                showCancelButton={true}
                showConfirmButton={true}
                onCancelPressed={() => { console.log('Cancelou') }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />
        </Back>
	);

};

const stl = StyleSheet.create({
    title: {
        fontFamily: "Cochin",
        color: '#FFF',
        fontSize: 50,
        textAlign: 'center',
        marginBottom: 10
    },
    subtitle: {
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
        width: '90%',
        borderRadius: 30
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
    },
    warning:{
        color: '#FFF',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10
    },
    cpfOrCnpj:{
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
    },
    viewCpfOrCnpj:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 30
    }
});