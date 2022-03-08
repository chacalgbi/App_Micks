import React from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import TextInputMask from 'react-native-text-input-mask';

export default props => {
    return (
        <View style={[styles.container, props.style]}>
            <Icon name={props.icon} size={20} style={[styles.icon, {color: props.colorIcon}]} />
            <TextInputMask {...props} style={styles.input} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width - 20,
        height: 55,
        backgroundColor: '#FFF',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 10
    },
    input: {
        color: '#000000',
        backgroundColor: '#FFF',
        marginLeft: 10,
        marginRight: 10,
    }
})