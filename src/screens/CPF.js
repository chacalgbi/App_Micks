import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements';
import UsersContext from '../UserProvider';
import AuthInput from '../components/AuthInput';
import Button from '../components/Button';
import API from '../components/API';
import Msg from '../components/Msg';
import ConfirmAddress from './ConfirmAddress';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [cpf, setCpf] = useState('');
    const [warning, setWarning] = useState('');
    const [msg, setMsg] = useState('');
    const [button, setButton] = useState('#4460D9');
    const [seach, setSeach] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [check1, setCheck1] = useState(false);
    const [checkClientOk, setCheckClientOk] = useState(false);
    const [objClient, setObjClient] = useState([]);

    let documentFormated = '';

    function success(client, cod, codsercli, descriSer, login, listAddress, doc){
        let temp = {
            client: client,
            cod: cod,
            codsercli: codsercli,
            descriSer: descriSer,
            list: listAddress,
            doc: doc,
            login: login
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

        //console.log('Valor ??: ', value)
        setCheckClientOk(false)
        setCpf('')
        setWarning('')
        setConfirm(true)

        if(value === true){ 
            setMsg("Redirecionando para a tela de cadastro.")

            const dataClient = {
                cliDOC: objClient.doc,
                codCli: objClient.cod,
                codsercli: objClient.codsercli,
                descriSer: objClient.descriSer,
                login: objClient.login,
                name: objClient.client.nome_cli.replace(/[^a-z0-9\s]/gi, "").substring(26, 0)
            }

            console.log("Objeto")
            console.log(dataClient)

            //Os dois setTimeout abaixo foram necess??rios para n??o dar vazamento de mem??ria, problema ocorria quando
            //chamava a props.set e renderizava outra tela e o modal da MSG ainda n??o tinha terminado e ele fazia
            //parte somente dessa tela! Lembrar disso ao longo de outras telas.
            setTimeout(()=>{ setConfirm(false); }, 3200)
            setTimeout(()=>{ props.set('setClientMicksYes', dataClient) }, 4000)
        }else{
            setMsg("O endere??o incorreto! Tente novamente.")
            setTimeout(()=>{ setConfirm(false) }, 4000)
        }

    }

    async function handleRequisition(num, type){
        const obj = type === 'cpf' ? {cpf : num} : {cnpj: num}

        await API(type, obj)
        .then((res)=>{
            //console.log(res.data.msg)
            
            setTimeout(()=>{ setSeach(false) }, 1000)

            if(res.data.erroGeral){
                setWarning(res.data.msg)

                if(res.data.erroGeral === 'nao'){
                    if(res.data.dados.errorBD === 'nao'){
                        let CodCli = ''
                        let CodSerCli = ''
                        let DescriSer = ''
                        let login = ''
                        let cod_cli_temp1 = 0
                        res.data.dados.resposta.map((item, index)=>{

                            //Inicio - Usado pra verificar se tem codcli iguais, se tiver salvar s?? um.
                            if(cod_cli_temp1 != item.codigo){
                                CodCli += item.codigo
                                CodCli += ','
                            }
                            cod_cli_temp1 = item.codigo
                            // Fim

                            CodSerCli += item.codsercli.trim()
                            CodSerCli += ','

                            DescriSer += item.descri_ser.trim()
                            DescriSer += ','

                            login += item.login.trim()
                            login += ','
                        })
                        const str = CodCli.substring(0, CodCli.length - 1);
                        const str1 = CodSerCli.substring(0, CodSerCli.length - 1);
                        const str2 = DescriSer.substring(0, DescriSer.length - 1);
                        const str3 = login.substring(0, login.length - 1);

                        success(res.data.dados.resposta[0], str, str1, str2, str3, res.data.listAdress, num)
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
            showErro(`Erro interno: ${e}`)
        });
    }

    function getCPFIntegrator(num){
        let type = ''

        if(num.length < 11){
            Alert.alert('Ops! N??meros insuficientes', 'Digite um CPF com 11 caracteres')
        }else if(num.length > 11){
            Alert.alert('Ops! Voc?? digitou muitos n??meros', 'Digite um CPF com 11 caracteres')
        }else{
            setSeach(true)

            if(check1){
                type = 'cnpj'
                documentFormated = formatCnpf(num)
            }else{
                type = 'cpf'
                documentFormated = formatCpf(num)
            }
    
            handleRequisition(documentFormated, type)
        }
    }

	return (
        <>
            {
                checkClientOk && <ConfirmAddress resp={respAddress} isVisible={checkClientOk} dataClient={objClient} onCancel={()=>{ setCheckClientOk(false) }} />
            }
            
            <View style={stl.formContainer}>
                <Text style={stl.title}>Ol?? Cliente</Text>
                <Text style={stl.subtitle}>Digite seu {check1 ? 'CNPJ' : 'CPF'}</Text>

                <AuthInput
                    icon={check1 ? 'domain' : 'account-circle'}
                    keyboardType='numeric' 
                    placeholder={check1 ? 'CNPJ: 33.444.555/0001-66' : 'CPF: 123.456.789-00'} 
                    colorIcon={check1 ? '#00CCD3' : '#4460D9'}
                    style={stl.input} 
                    value={cpf}
                    onChangeText={ (v) => {setCpf(v); setButton('#080')} }
                />
                <Button 
                    text='Verificar'
                    func={ ()=>{ getCPFIntegrator(cpf) } }
                    colorText='#FFF'
                    colorButton={check1 ? '#00CCD3' : '#4460D9'}
                />

                <View style={stl.viewCpfOrCnpj}>
                    <CheckBox center 
                        checkedIcon={ <Icon name="radio-button-checked" type="material" color="#00CCD3" size={35} /> }
                        uncheckedIcon={ <Icon name="radio-button-unchecked" type="material" color="#4460D9" size={35} /> }
                        checked={check1} onPress={ () => setCheck1(!check1) }
                    />
                    <Text style={stl.cpfOrCnpj}>{check1 ? 'CPF ?' : 'CNPJ ?'}</Text>
                </View>

                <Text style={stl.warning}>{warning}</Text>
                <TouchableOpacity onPress={()=>{ props.set('jaTenhoConta', {}) }}><Text style={{color: '#000000', textDecorationLine: 'underline', paddingTop: 10}}>J?? tenho uma conta</Text></TouchableOpacity>
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
                showProgress={false}
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
        color: '#000000',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10
    },
    subtitle: {
        color: '#000000',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    formContainer: {
        padding: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
        borderWidth: 2
    },
    warning:{
        color: '#000000',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10
    },
    cpfOrCnpj:{
        color: '#000000',
        fontSize: 20,
        textAlign: 'center',
        paddingRight: 15
    },
    viewCpfOrCnpj:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});