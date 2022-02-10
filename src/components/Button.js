import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default (props) => {
    return(
        <TouchableOpacity onPress={props.func}>
            <View style={[styles.button, {backgroundColor: props.colorButton}]}>
                <Text style={[styles.buttonText, {color:props.colorText}]}>{props.text}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7
    },
    buttonText: {
        fontSize: 20
    }
});
