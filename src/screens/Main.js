import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Overlay, Icon } from 'react-native-elements';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Pdf from 'react-native-pdf';
import UsersContext from '../UserProvider';
import Botao from '../components/Button';
import AuthInput from '../components/AuthInput'

import API from '../components/API';
import Msg from '../components/Msg';

OverlayComponentProps = {};

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)

    const [boletos, setBoletos] = useState([]);
    const [warning, setWarning] = useState('');
    const [info, setInfo] = useState(false);
    const [codcli, setCodCli] = useState('');

    function ZerarTudo(){
        props.set('setClearAll', '')
    }

    function showErro(e){
        Alert.alert('Ops!', `${e}`)
    }

    async function getBoletos(codigo = ''){
        let arrayCoder = []

        if(codigo === ''){
            arrayCoder = users_data.codCli.split(',')
        }else{
            arrayCoder = [`${codigo}`]
        }
        
        setInfo(true)
        console.log("Códigos de Cliente:")
        console.log(arrayCoder)

        let boletoTemp = []
        for (const [index, cod] of arrayCoder.entries()) {

            await API('faturas_app', {codcli: cod }).then((res)=>{
                console.log(res.data)

                setWarning(res.data.msg)
                if(res.data.erroGeral === 'nao'){
                    res.data.boletos.map((item, index)=>{
                        boletoTemp.push(item)
                        //console.log(`Boleto ${index} - ${item.cod_fatura}`)
                    })
                }else{
                    setWarning(res.data.msg)
                }

            })
            .catch((e)=>{
                console.log(e);
                showErro(e)
            });

        }
        
        if(boletoTemp.length > 0){
            setBoletos(boletoTemp) // Um console.log(boletos) aqui não vai aparecer os dados, pois essa variável só é mudada na próxima renderização
        }
        
        setInfo(false)
        
    }

    useEffect(() => {
        //getBoletos();
    }, [])

    function ListEmpty(){
        return(
            <View>
                <Text style={stl.warning}>Erro ao carregar os Boletos, tente novamente mais tarde.</Text>
            </View>
        )
    }

    const DayWelk = (number) => {
        switch (number) {
            case 1:
                return 'segunda'
            case 2:
                return 'terça'
            case 3:
                return 'quarta'
            case 4:
                return 'quinta'
            case 5:
                return 'sexta'
            case 6:
                return 'sabado'
            case 0:
                return 'domingo'
        }
    }
    
    const dataDayFormat = () => {
        var data = new Date()
        dia = data.getDate().toString()
        diaF = (dia.length == 1) ? '0' + dia : dia
        mes = (data.getMonth() + 1).toString() //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes
        anoF = data.getFullYear();
        hora = String(data.getHours())
        horaF = (hora.length == 1) ? '0' + hora  : hora
        minutos = String(data.getMinutes())
        minutosF = (minutos.length == 1) ? '0' + minutos  : minutos
        segundos = String(data.getSeconds())
        segundosf = (segundos.length == 1) ? '0'+segundos : segundos
        weekF = DayWelk(data.getDay())
    
        return {
            dateHour: `${diaF}/${mesF}/${anoF}-${horaF}:${minutosF}:${segundosf}`,
            dateAll: `${diaF}/${mesF}/${anoF}`,
            hourAll: `${horaF}:${minutosF}:${segundosf}`,
            hour: `${horaF}`,
            minutes: minutosF,
            seconds: segundosf,
            day: diaF,
            month: mesF,
            year: anoF,
            week: weekF
        }
    
    }

    function ListBoletos(props){
        const [visible, setVisible] = useState(false);
        const [iconColorCod, setIconColorCod] = useState('#008ea9');
        const [copyText, setCopyText] = useState('Copiar cód. barra');
        const [iconColorPdf, setIconColorPdf] = useState('#008ea9');
        const [copyTextPdf, setCopyTextPdf] = useState('Baixar fatura');
        const source = { uri: `${props.ad.item.linkPDF}`, cache: false };

        const toggleOverlay = () => {
            setVisible(!visible);
        };

        function cor(date){
            let dateNow = dataDayFormat().dateAll
            let temp = date.split('/');
            let vencer = `${temp[2]}-${temp[1]}-${temp[0]}`;
            let hoje = new Date();
            let vencer1 = new Date(vencer)

            if(dateNow === date){
                return '#FFFF00'
            }else{
                if(hoje > vencer1){
                    return '#FF0000' //vencidas
                }else{
                    return '#345B33' // Em dia
                }
            }
        }

        function information(days){
            if(days == 0){
                return 'Sua Fatura vence hoje!'
            }else if(days > 0){
                return `Fatura vencida a ${Math.abs(days)} dias!`
            }else{
                return ''
            }
        }

        function downloadPdf(){
            let data = props.ad.item.vencimento.replace(/\//g, "_")
            let dirs = ReactNativeBlobUtil.fs.dirs;
            ReactNativeBlobUtil.config({
                path: dirs.DownloadDir + '/' + data + '_boleto.pdf',
                appendExt: 'pdf',
                addAndroidDownloads: {
                    notification: true,
                    title: 'Fatura Micks',
                    description: 'Boleto Micks Telecom',
                    mime: 'application/pdf',
                    mediaScannable: true,
                },
                fileCache: true,
            })
            .fetch('GET', `${props.ad.item.linkPDF}`,{},)
            .then((res) => {
                console.log('The file saved to ', res.path());
            })
            .catch((errorMessage, statusCode) => {
                console.log(errorMessage);
            });
        }

        return(
            <>
                <TouchableOpacity style={stl.viewBoletos1} onPress={toggleOverlay}>
                    <IconMaterial name='file-pdf-box' size={35} style={{ marginLeft: 1, color: cor(props.ad.item.vencimento) }} />
                    <Text style={stl.textList}>  R${props.ad.item.valor_a_pagar} - {props.ad.item.vencimento}</Text>
                </TouchableOpacity>
                <View style={{alignItems: 'flex-end'}}>
                    <Text>{information(props.ad.item.dias_vencidos)}</Text>
                </View>

                <Overlay isVisible={visible} onBackdropPress={toggleOverlay} style={stl.over}>

                    <Text style={stl.textModal}>Descrição: {props.ad.item.decricao1}</Text>
                    <Text style={stl.textModal}>Tipo: {props.ad.item.descricao2}</Text>
                    <Text style={[stl.textModal, {color: 'red'}]}>Vencimento: {props.ad.item.vencimento} - Valor: R${props.ad.item.valor_a_pagar}</Text>
                    <Text style={stl.textModal}>Dias em Atraso: { props.ad.item.dias_vencidos > 0 ? props.ad.item.dias_vencidos : 0}</Text>
                    
                    <View style={stl.viewCod}>
                        <TouchableOpacity style={stl.buttonCopy} onPress={ ()=>{ Clipboard.setString(`${props.ad.item.codBarra}`); setIconColorCod('#008000'); setCopyText('Cod. copiado!') } }>
                            <IconMaterial name='clipboard-check-multiple' size={35} style={{ color: iconColorCod }} />
                            <View style={{flex: 2, fontSize: 10}}><Text style={stl.textModal}>{copyText}</Text></View>
                        </TouchableOpacity> 
                        <TouchableOpacity style={stl.buttonCopy} onPress={ ()=>{  setIconColorPdf('#008000'); setCopyTextPdf('Download concluido!'); downloadPdf() } }>
                            <IconMaterial name='file-pdf-box' size={35} style={{ color: iconColorPdf }} />
                            <View style={{flex: 2, fontSize: 10}}><Text style={stl.textModal}>{copyTextPdf}</Text></View>
                        </TouchableOpacity>
                    </View>
                   
                    <View style={stl.container}>
                        <Pdf
                            source={source}
                            fitPolicy={0}
                            scale={2.5}
                            minScale={1.0}
                            maxScale={4.0}
                            onLoadComplete={(numberOfPages,filePath) => {
                                console.log(`Number of pages: ${numberOfPages}`);
                            }}
                            onPageChanged={(page,numberOfPages) => {
                                console.log(`Current page: ${page}`);
                            }}
                            onError={(error) => {
                                console.log(error);
                            }}
                            onPressLink={(uri) => {
                                console.log(`Link pressed: ${uri}`);
                            }}
                            style={stl.pdf}/>
                    </View>

                </Overlay>

            </>
        )
    }

    return (
        <>
            <Text style={stl.title}>{users_data.name}</Text>
            <View style={stl.formContainer}>
            <FlatList 
                data={boletos}
                keyExtractor={item => `${Math.floor(Math.random() * 65536)}`}
                renderItem={(obj)=> <ListBoletos ad={obj} /> }
                listEmptyComponent={()=>{ <ListEmpty /> }}
                ItemSeparatorComponent={()=> { return <View style={{ height: 10 }} /> }}
            />
            </View>
            <Text style={stl.subtitle}>{warning}</Text>

            <Msg show={info}
                showProgress={true}
                title="Aguarde..."
                message={'Buscando suas faturas em nosso sistema'}
                confirmButtonColor="#080"
                showCancelButton={false}
                showConfirmButton={false}
                onCancelPressed={() => { console.log('Cancelou') }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />

            <Botao
                text='Zerar'
                func={ ()=>{ ZerarTudo() } }
                colorText='#FFFFFF'
                colorButton='#FF0000'
            />

            <Botao
                text='Buscar CodCli'
                func={ ()=>{ getBoletos(codcli) } }
                colorText='#FFFFFF'
                colorButton='#00FF00'
            />

            <AuthInput
                icon='account-circle'
                keyboardType='numeric'
                colorIcon='#FF8C00'
                value={codcli}
                onChangeText={ (v)=>{setCodCli(v) } }
            />
        </>
	);
};

const stl = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    buttonCopy:{
        flex: 3,
        borderWidth: 3,
        borderColor: '#008ea9',
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 5,
        paddingLeft: 5
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    },
    over:{
        flex: 1,
        width: '90%'
    },
    title:{
        fontSize: 18,
        marginBottom: 20
    },
    subtitle:{
        fontSize: 14,
    },
    viewCod:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    viewBoletos1:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    viewBoletos2:{
        backgroundColor: 'red',
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        padding: 5,
        width: '95%',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    warning:{
        color: '#FFF',
        fontSize: 15,
    },
    textList:{
        fontSize: 20,
    },
    textModal:{
        fontSize: 16,
        padding: 3,
        marginLeft: 5
    }
});