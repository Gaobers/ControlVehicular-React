import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";


export default function BottomNav({

    activo = "inicio",

    onInicio,

    onVehiculos,

    onServicios

}) {

    const opcion = (
        id,
        icono,
        texto,
        accion
    ) => {

        const seleccionado =
            activo === id;


        return (

            <Pressable
                style={({ pressed }) => [
                    styles.item,

                    pressed &&
                    styles.pressed
                ]}

                onPress={
                    accion
                }
            >

                <Text
                    style={[
                        styles.icon,

                        seleccionado &&
                        styles.active
                    ]}
                >
                    {icono}
                </Text>


                <Text
                    style={[
                        styles.text,

                        seleccionado &&
                        styles.active
                    ]}
                >
                    {texto}
                </Text>

            </Pressable>
        );
    };


    return (

        <View style={styles.nav}>

            {opcion(
                "inicio",
                "⌂",
                "Inicio",
                onInicio
            )}


            {opcion(
                "vehiculos",
                "VH",
                "Vehículos",
                onVehiculos
            )}


            {opcion(
                "servicios",
                "SV",
                "Servicios",
                onServicios
            )}

        </View>
    );
}


const styles = StyleSheet.create({

    nav: {
        position: "absolute",

        left: 0,
        right: 0,
        bottom: 0,

        minHeight: 72,

        backgroundColor: "#FFFFFF",

        borderTopWidth: 1,
        borderTopColor: "#E4E8EF",

        flexDirection: "row",

        justifyContent: "space-around",

        alignItems: "center",

        paddingVertical: 8
    },


    item: {
        flex: 1,

        minHeight: 54,

        alignItems: "center",

        justifyContent: "center"
    },


    pressed: {
        opacity: 0.65
    },


    icon: {
        color: "#94A3B8",

        fontSize: 14,

        fontWeight: "900"
    },


    text: {
        marginTop: 4,

        color: "#94A3B8",

        fontSize: 11,

        fontWeight: "700"
    },


    active: {
        color: "#0D3559"
    }
});