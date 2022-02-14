import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements';
import UsersContext from '../UserProvider';
import AuthInput from '../components/AuthInput';
import Button from '../components/Button';
import API from '../components/API';
import Msg from '../components/Msg';
import ConfirmAddress from './ConfirmAddress';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [cpf, setCpf] = useState('014.397.495-58');
    const [warning, setWarning] = useState('');
    const [msg, setMsg] = useState('');
    const [button, setButton] = useState('#080');
    const [seach, setSeach] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [check1, setCheck1] = useState(false);
    const [checkClientOk, setCheckClientOk] = useState(false);
    const [objClient, setObjClient] = useState([]);

    let documentFormated = '';

    function success(client, cod, listAddress, doc){
        let temp = {
            client: client,
            cod: cod,
            list: listAddress,
            doc: doc
        }
        setObjClient(temp)
        setCheckClientOk(true)
    }

    function showErro(e){
        Alert.alert('Ops!', `${e}`)
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

    function formatCnpf(num){
        let formatado = num.replace(/\D+/g, "");
        let final = '';
        if(formatado.length == 14){
            final = formatado.replace(/(\d{2})?(\d{3})?(\d{3})?(\d{4})?(\d{2})/, "$1.$2.$3/$4-$5");
        }else{
            final = formatado;
        }
        return final;
    }

    function respAddress(value){

        console.log('Valor é: ', value)
        setCheckClientOk(false)
        setCpf('')
        setWarning('')
        setConfirm(true)

        if(value === true){ 
            setMsg("Redirecionando para a tela de cadastro.")

            const dataClient = {
                cliDOC: objClient.doc,
                codCli: objClient.cod,
                name: objClient.client.nome_cli.replace(/[^a-z0-9\s]/gi, "").substring(26, 0)
            }

            console.log("Objeto")
            console.log(dataClient)

            //Os dois setTimeout abaixo foram necessários para não dar vazamento de memória, problema ocorria quando
            //chamava a props.set e renderizava outra tela e o modal da MSG ainda não tinha terminado e ele fazia
            //parte somente dessa tela! Lembrar disso ao longo de outras telas.
            setTimeout(()=>{ setConfirm(false); }, 3200)
            setTimeout(()=>{ props.set('setClientMicksYes', dataClient) }, 4000)
        }else{
            setMsg("O endereço incorreto! Tente novamente.")
            setTimeout(()=>{ setConfirm(false) }, 4000)
        }

    }

    async function handleRequisition(num, type){
        const obj = type === 'cpf' ? {cpf : num} : {cnpj: num}

        await API(type, obj)
        .then((res)=>{
            console.log(res.data.msg)
            
            setTimeout(()=>{ setSeach(false) }, 1000)

            if(res.data.erroGeral){
                setWarning(res.data.msg)

                if(res.data.erroGeral === 'nao'){
                    if(res.data.dados.errorBD === 'nao'){
                        let CodCli = ''
                        res.data.dados.resposta.map((item, index)=>{
                            CodCli += item.codigo
                            CodCli += ','
                        })
                        const str = CodCli.substring(0, CodCli.length - 1);
                        success(res.data.dados.resposta[0], str, res.data.listAdress, num)
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
            showErro('Erro interno, tente novamente mais tarde')
        });
    }

    function getCPFIntegrator(num){
        let type = ''

        if(check1){
            type = 'cnpj'
            documentFormated = formatCnpf(num)
        }else{
            type = 'cpf'
            documentFormated = formatCpf(num)
        }

        handleRequisition(documentFormated, type)
    }

	return (
        <>
            {
                checkClientOk && <ConfirmAddress resp={respAddress} isVisible={checkClientOk} dataClient={objClient} onCancel={()=>{ setCheckClientOk(false) }} />
            }
            
            <View style={stl.formContainer}>
                <Text style={stl.title}>Olá Cliente</Text>
                <Text style={stl.subtitle}>Digite seu {check1 ? 'CNPJ' : 'CPF'}</Text>

                <View style={stl.viewCpfOrCnpj}>
                    <CheckBox center 
                        checkedIcon={ <Icon name="radio-button-checked" type="material" color="#8A2BE2" size={25} /> }
                        uncheckedIcon={ <Icon name="radio-button-unchecked" type="material" color="#FF8C00" size={25} /> }
                        checked={check1} onPress={ () => setCheck1(!check1) }
                    />
                    <Text style={stl.cpfOrCnpj}>{check1 ? 'CPF ?' : 'CNPJ ?'}</Text>
                </View>

                <AuthInput
                    icon={check1 ? 'domain' : 'account-circle'}
                    keyboardType='numeric' 
                    placeholder={check1 ? 'CNPJ: 33.444.555/0001-66' : 'CPF: 123.456.789-00'} 
                    colorIcon={check1 ? '#8A2BE2' : '#FF8C00'}
                    style={stl.input} 
                    value={cpf}
                    onChangeText={ (v) => {setCpf(v); setButton('#080')} }
                />
                <Button 
                    text='Verificar'
                    func={ ()=>{ getCPFIntegrator(cpf); setSeach(true) } }
                    colorText='#FFF'
                    colorButton={button}
                />
                <Text style={stl.warning}>{warning}</Text>
            </View>

            <Msg show={seach}
                showProgress={true}
                title="Aguarde..."
                message={`Buscando seu ${check1 ? 'CNPJ' : 'CPF'} em nosso sistema.`}
                confirmButtonColor="#080"
                showCancelButton={false}
                showConfirmButton={false}
                onCancelPressed={() => { console.log('Cancelou') }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />
            <Msg show={confirm}
                showProgress={true}
                title="Aviso"
                message={msg}
                confirmButtonColor="#191970"
                showCancelButton={false}
                showConfirmButton={false}
                onCancelPressed={() => { console.log('Cancelou') }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />
        </>
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
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
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
        paddingRight: 15
    },
    viewCpfOrCnpj:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 30
    }
});