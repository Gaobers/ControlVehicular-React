import React from "react";

import {
    StyleSheet,
    TextInput
} from "react-native";


export default function DatePickerField({

    value,

    onChange

}) {

    return (

        <TextInput
            style={styles.input}

            value={
                value
            }

            onChangeText={
                onChange
            }

            type="date"
        />
    );
}


const styles = StyleSheet.create({

    input: {
        minHeight: 48,

        borderRadius: 9,

        borderWidth: 1,

        borderColor: "#E0E5EC",

        backgroundColor: "#FFFFFF",

        paddingHorizontal: 12,

        color: "#172033",

        fontSize: 14
    }
});