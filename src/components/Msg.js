import React from 'react';
import { StyleSheet } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

export default (props)=>{
	return (
        <AwesomeAlert
            {...props}
            animatedValue={0.9}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            cancelText="Cancelar"
            confirmText="SIM"
        />
	);

};

const stl = StyleSheet.create({

});