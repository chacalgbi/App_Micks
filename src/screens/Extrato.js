import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, BackHandler, FlatList } from 'react-native';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomSheet, ListItem } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import UsersContext from '../UserProvider';
import API from '../components/API';
import Msg from '../components/Msg';

export default (props)=>{
    const {users_data, dispatch} = useContext(UsersContext)
    const [isVisible, setIsVisible] = useState(false);
    const [daysVisible, setDaysVisible] = useState(false);
    const [seach, setSeach] = useState(false);
    const [namePlain, setNamePlain] = useState('');
    const [numDays, SetDays] = useState(30);
    const [conections, SetConections] = useState([]);
    const [warning, setWarning] = useState('Clique em + e selecione seu plano');
    const [total, setTotal] = useState('');

    const plans = users_data.descriSer.split(',')
    const login = users_data.login.split(',')
    const list = []

    const listDays = [
        {title: `Escolha a quantidade de dias`, containerStyle: { backgroundColor: '#4F4F4F' }, titleStyle: { color: 'white' }},
        {title: '01 Dia',  onPress: ()=>{ setDaysVisible(false); SetDays(1);   setIsVisible(true) }},
        {title: '05 Dias', onPress: ()=>{ setDaysVisible(false); SetDays(5);   setIsVisible(true) }},
        {title: '10 Dias', onPress: ()=>{ setDaysVisible(false); SetDays(10);  setIsVisible(true) }},
        {title: '30 Dias', onPress: ()=>{ setDaysVisible(false); SetDays(30);  setIsVisible(true) }},
        {title: '60 Dias', onPress: ()=>{ setDaysVisible(false); SetDays(60);  setIsVisible(true) }},
        {title: '90 Dias', onPress: ()=>{ setDaysVisible(false); SetDays(90);  setIsVisible(true) }},
        { title: 'Fechar', containerStyle: { backgroundColor: 'red' }, titleStyle: { color: 'white' }, onPress: () => setDaysVisible(false) }
    ]

    list.push({title: `Escolha o plano`, containerStyle: { backgroundColor: '#4F4F4F' }, titleStyle: { color: 'white' }})
    plans.map((item, index)=>{ list.push({title: `${item}`, onPress: ()=>{ getExtract(login[index], item) }}) })
    list.push({ title: 'Fechar', containerStyle: { backgroundColor: 'red' }, titleStyle: { color: 'white' }, onPress: () => setIsVisible(false) })

    function ConectionList(props){
        return(
            <View style={stl.conectionList}>
                <View style={stl.listItem}>
                    <Text style={stl.itemTitle}>Inicio: </Text>
                    <Text>{props.ad.item.inicio}  </Text>
                    <Text style={stl.itemTitle}>Fim: </Text>
                    <Text>{props.ad.item.fim}</Text>
                </View>
                
                <View style={stl.listItem}>
                    <Text style={stl.itemTitle}>Download: </Text>
                    <Text>{props.ad.item.download}  </Text>
                    <Text style={stl.itemTitle}>Upload: </Text>
                    <Text>{props.ad.item.upload}</Text>
                </View>

                <View style={stl.listItem}>
                    <Text style={stl.itemTitle}>Tempo: </Text>
                    <Text>{props.ad.item.tempo}  </Text>
                    <Text style={stl.itemTitle}>Total: </Text>
                    <Text>{props.ad.item.total}</Text>
                </View>
            </View>
        )
    }

    async function getExtract(login, plain){
        setNamePlain(plain)
        setSeach(true)
        setIsVisible(false)
        
        await API('conection', { login: login, dias: numDays })
        .then((res)=>{
            if(res.data.erroGeral){
                setWarning(res.data.msg)
                setTimeout(() => { setSeach(false) }, 500);

                if(res.data.erroGeral === 'nao'){
                    setTotal(`Total Download: ${res.data.totalDo}  Total Upload: ${res.data.totalUp}`)
                    SetConections(res.data.dados)
                }else{
                    setWarning(res.data.msg)
                }
            }
        })
        .catch((e)=>{
            //setWarning(e)
            console.log(e)
            setTimeout(() => { setSeach(false) }, 500);
        });
    }

    useEffect(() => {
        const backAction = () => { props.back(0); return true; };
        const backHandler = BackHandler.addEventListener( "hardwareBackPress", backAction );
        return () => backHandler.remove();
    }, []);

    return(
        <SafeAreaProvider style={{flex: 1, width: '100%'}}>
            <View style={stl.header}>
                <TouchableOpacity onPress={ ()=>{ props.back(0)} }>
                    <IconMaterial name='arrow-left-circle-outline' size={50} style={{color: "#4460D9"}} />
                </TouchableOpacity>
            </View>
            <View style={stl.body}>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>{warning}</Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 7}}>{namePlain}</Text>
                <Text style={{fontWeight: 'bold', fontSize: 13, marginBottom: 7, color: '#FF0000'}}>{total}</Text>
                <FlatList 
                    data={conections}
                    keyExtractor={item => `${item.id}`}
                    renderItem={(obj)=> <ConectionList ad={obj} /> }
                />
            </View>
            <TouchableOpacity onPress={ ()=>{ setIsVisible(true)} } style={stl.img}>
                <IconMaterial name='plus-circle' size={70} style={{color: "#4460D9"}} />
            </TouchableOpacity>

            <TouchableOpacity onPress={ ()=>{ setDaysVisible(true)} } style={stl.img1}>
                <IconMaterial name='calendar-clock' size={70} style={{color: "#006400"}} />
            </TouchableOpacity>

            <BottomSheet modalProps={{}} isVisible={isVisible}>
                {list.map((l, i) => (
                    <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress} >
                        <ListItem.Content>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>

            <BottomSheet modalProps={{}} isVisible={daysVisible}>
                {listDays.map((l, i) => (
                    <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress} >
                        <ListItem.Content>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>

            <Msg show={seach}
                showProgress={true}
                title="Aguarde..."
                message={`Verificando extrato do plano: ${namePlain}`}
                confirmButtonColor="#080"
                showCancelButton={true}
                showConfirmButton={false}
                onCancelPressed={() => { setSeach(false) }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />
        </SafeAreaProvider>
        
    )
}

const stl = StyleSheet.create({
    header:{
        marginTop: 28
    },
    conectionList:{
        flex: 1,
        backgroundColor: 'rgba(68, 96, 217, 0.2)',
        padding: 5,
        borderRadius: 15,
        marginBottom: 10
    },
    img:{
        position: 'absolute',
        right: 10,
        bottom: 5,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img1:{
        position: 'relative',
        left: 10,
        bottom: 5,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    body:{
        flex: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
    },
    listItem:{
        flexDirection: 'row'
    },
    itemTitle:{
        fontWeight: 'bold',
        fontSize: 15
    }
})