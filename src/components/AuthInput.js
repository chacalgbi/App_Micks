import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default props => {
    return (
        <View style={[styles.container, props.style]}>
            <Icon name={props.icon} size={20} style={props.company ? styles.iconCompany : styles.iconUser} />
            <TextInput {...props} style={styles.input} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,
        backgroundColor: '#EEE',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconUser: {
        color: '#FF8C00',
        marginLeft: 20
    },
    iconCompany: {
        color: '#8A2BE2',
        marginLeft: 20
    },
    input: {
        marginLeft: 20,
        width: '70%'
    }
})