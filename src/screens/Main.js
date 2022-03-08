import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Image, SpeedDial} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import UsersContext from '../UserProvider';
import Msg from '../components/Msg';
import Boleto from './Boleto';
import Desbloqueio from './Desbloqueio';
import Extrato from './Extrato';
import ModificarSenha from './ModificarSenha';
import RatingAvaliable from './RatingAvaliable';
import Atendimento from './Atendimento';
import {baner} from '../components/variables';

export default props => {
  const {users_data, dispatch} = useContext(UsersContext);
  const [tela, setTela] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [open, setOpen] = React.useState(false);

  function HomeScreen() {
    return (
      <SafeAreaProvider style={stl.container}>
        <View style={stl.header}>
          <Image
            source={{uri: baner}}
            containerStyle={stl.item}
            PlaceholderContent={<ActivityIndicator />}
            resizeMode="contain"
          />
        </View>
        <View style={stl.body}>
          <View style={stl.items}>
            <TouchableOpacity
              onPress={() => {
                setTela(1);
              }}
              style={stl.itemMenu}>
              <LottieView
                autoPlay
                loop
                style={{width: 100, height: 100}}
                source={require('../img/pay1.json')}
              />
              <Text style={{fontSize: 15}}>Faturas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTela(3);
              }}
              style={stl.itemMenu}>
              <LottieView
                autoPlay
                loop
                style={{width: 100, height: 100}}
                source={require('../img/wifi.json')}
              />
              <Text style={{fontSize: 15}}>Extrato de Conexão</Text>
            </TouchableOpacity>
          </View>
          <View style={stl.items}></View>
        </View>
        <View style={stl.footer}></View>

        <Msg
          show={confirm}
          showProgress={false}
          title="Atenção!"
          message="Deseja fazer Logout no App?"
          confirmButtonColor="#4460D9"
          showCancelButton={true}
          showConfirmButton={true}
          onCancelPressed={() => {
            setConfirm(false);
          }}
          onConfirmPressed={() => {
            props.set('jaTenhoConta', {});
          }}
        />

        <SpeedDial
          isOpen={open}
          icon={{name: 'menu', color: '#FFF'}}
          openIcon={{name: 'close', color: '#FFF'}}
          onOpen={() => setOpen(!open)}
          onClose={() => setOpen(!open)}
          transitionDuration={10}
        >

          <SpeedDial.Action
            icon={{name: 'lock-open', color: '#fff'}}
            title="Desbloqueio provisório"
            onPress={() => {
              setOpen(!open);
              setTela(2);
            }}
          />
          <SpeedDial.Action
            icon={{name: 'contact-support', color: '#fff'}}
            title="Suporte whatsApp"
            onPress={() => {
              setOpen(!open);
              Linking.openURL(
                'https://api.whatsapp.com/send?phone=5577988023452',
              );
            }}
          />
          <SpeedDial.Action
            icon={{name: 'contact-phone', color: '#fff'}}
            title="Relatar problema"
            onPress={() => {
              setOpen(!open);
              setTela(6);
            }}
          />
          <SpeedDial.Action
            icon={{name: 'sentiment-satisfied', color: '#fff'}}
            title="Avalie a Micks"
            onPress={() => {
              setOpen(!open);
              setTela(5);
            }}
          />
          <SpeedDial.Action
            icon={{name: 'edit', color: '#fff'}}
            title="Alterar senha"
            onPress={() => {
              setOpen(!open);
              setTela(4);
            }}
          />
          <SpeedDial.Action
            icon={{name: 'exit-to-app', color: '#fff'}}
            title="Fazer logoff"
            onPress={() => {
              setOpen(!open);
              setConfirm(true);
            }}
          />
        </SpeedDial>
      </SafeAreaProvider>
    );
  }

  function backTela(num) {
    setTela(num);
  }

  function Telas() {
    if (tela === 0) {
      return <HomeScreen />;
    }
    if (tela === 1) {
      return <Boleto back={backTela} />;
    }
    if (tela === 2) {
      return <Desbloqueio back={backTela} />;
    }
    if (tela === 3) {
      return <Extrato back={backTela} />;
    }
    if (tela === 4) {
      return <ModificarSenha back={backTela} />;
    }
    if (tela === 5) {
      return <RatingAvaliable back={backTela} />;
    }
    if (tela === 6) {
      return <Atendimento back={backTela} />;
    }
  }

  return Telas();
};

const stl = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flex: 3,
    width: '100%',
    height: '100%',
  },
  item: {
    flex: 1,
    width: null,
    height: null,
  },
  body: {
    flex: 7,
  },
  items: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemMenu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textFooter: {
    fontSize: 12,
    marginLeft: 8,
    marginTop: 5,
  },
  openListPlains: {
    fontSize: 20,
    textDecorationLine: 'underline',
    textDecorationColor: '#6959CD',
    fontWeight: 'bold',
  },
  viewOpenModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerA: {
    flex: 5,
  },
  footerB: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
