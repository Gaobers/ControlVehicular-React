import React, {
    useState
} from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import DateTimePicker
    from "@react-native-community/datetimepicker";


function convertirFecha(valor) {

    if (!valor) {
        return new Date();
    }

    const [
        anio,
        mes,
        dia
    ] = valor
        .split("-")
        .map(Number);

    return new Date(
        anio,
        mes - 1,
        dia
    );
}


function formatearFecha(fecha) {

    const anio =
        fecha.getFullYear();

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const dia =
        String(
            fecha.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${anio}-${mes}-${dia}`;
}


export default function DatePickerField({

    value,

    onChange,

    placeholder =
        "Seleccionar fecha",

    minimumDate,

    maximumDate

}) {

    const [
        mostrar,
        setMostrar
    ] = useState(false);


    return (

        <View>

            <Pressable
                style={styles.field}
                onPress={() =>
                    setMostrar(true)
                }
            >

                <Text
                    style={
                        value
                            ? styles.value
                            : styles.placeholder
                    }
                >
                    {value ||
                        placeholder}
                </Text>


                <Text style={styles.icon}>
                    ▣
                </Text>

            </Pressable>


            {mostrar && (

                <DateTimePicker
                    value={
                        convertirFecha(
                            value
                        )
                    }

                    mode="date"

                    display="default"

                    minimumDate={
                        minimumDate
                    }

                    maximumDate={
                        maximumDate
                    }

                    onChange={(
                        event,
                        fecha
                    ) => {

                        setMostrar(
                            false
                        );


                        if (
                            event.type ===
                            "dismissed"
                        ) {
                            return;
                        }


                        if (fecha) {

                            onChange(
                                formatearFecha(
                                    fecha
                                )
                            );
                        }
                    }}
                />
            )}

        </View>
    );
}


const styles = StyleSheet.create({

    field: {
        minHeight: 48,

        borderRadius: 9,

        borderWidth: 1,

        borderColor: "#E0E5EC",

        backgroundColor: "#FFFFFF",

        paddingHorizontal: 12,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between"
    },


    value: {
        color: "#172033",

        fontSize: 14
    },


    placeholder: {
        color: "#94A3B8",

        fontSize: 14
    },


    icon: {
        color: "#64748B",

        fontSize: 15
    }
});