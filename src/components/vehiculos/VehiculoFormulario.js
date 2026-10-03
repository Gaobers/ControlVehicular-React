import React, {
    useEffect,
    useState
} from "react";

import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";


const formularioInicial = {

    propietarioId: "",

    marca: "",

    modelo: "",

    anio: "",

    placa: "",

    color: "",

    kilometrajeActual: "",

    vin: "",

    motor: ""
};


export default function VehiculoFormulario({

    visible,

    vehiculo,

    guardando,

    onCerrar,

    onGuardar

}) {

    const [
        formulario,
        setFormulario
    ] = useState(formularioInicial);


    const [
        error,
        setError
    ] = useState("");


    useEffect(() => {

        if (vehiculo) {

            setFormulario({

                propietarioId:
                    String(
                        vehiculo.propietarioId ??
                        ""
                    ),

                marca:
                    vehiculo.marca ??
                    "",

                modelo:
                    vehiculo.modelo ??
                    "",

                anio:
                    String(
                        vehiculo.anio ??
                        ""
                    ),

                placa:
                    vehiculo.placa ??
                    "",

                color:
                    vehiculo.color ??
                    "",

                kilometrajeActual:
                    String(
                        vehiculo.kilometrajeActual ??
                        ""
                    ),

                vin:
                    vehiculo.vin ??
                    "",

                motor:
                    vehiculo.motor ??
                    ""
            });

        } else {

            setFormulario(
                formularioInicial
            );
        }


        setError("");

    }, [
        vehiculo,
        visible
    ]);


    const actualizarCampo = (
        campo,
        valor
    ) => {

        setFormulario(
            (actual) => ({
                ...actual,
                [campo]: valor
            })
        );
    };


    const validar = () => {

        if (
            !formulario.propietarioId ||
            !formulario.marca.trim() ||
            !formulario.modelo.trim() ||
            !formulario.anio ||
            !formulario.placa.trim()
        ) {

            setError(
                "Completa los campos obligatorios."
            );

            return false;
        }


        const anio =
            Number(
                formulario.anio
            );


        if (
            !Number.isInteger(anio) ||
            anio < 1900 ||
            anio > 2200
        ) {

            setError(
                "Ingresa un año válido."
            );

            return false;
        }


        const kilometraje =
            Number(
                String(
                    formulario.kilometrajeActual ||
                    "0"
                ).replace(",", ".")
            );


        if (
            !Number.isFinite(kilometraje) ||
            kilometraje < 0
        ) {

            setError(
                "El kilometraje debe ser válido y no negativo."
            );

            return false;
        }


        return true;
    };


    const guardar = () => {

        setError("");


        if (!validar()) {
            return;
        }


        onGuardar({

            propietarioId:
                Number(
                    formulario.propietarioId
                ),

            marca:
                formulario.marca.trim(),

            modelo:
                formulario.modelo.trim(),

            anio:
                Number(
                    formulario.anio
                ),

            placa:
                formulario.placa
                    .trim()
                    .toUpperCase(),

            color:
                formulario.color.trim() ||
                null,

            kilometrajeActual:
                Number(
                    String(
                        formulario.kilometrajeActual ||
                        "0"
                    ).replace(",", ".")
                ),

            vin:
                formulario.vin.trim() ||
                null,

            motor:
                formulario.motor.trim() ||
                null
        });
    };


    return (

        <Modal
            visible={visible}

            transparent

            animationType="slide"

            onRequestClose={
                onCerrar
            }
        >

            <View style={styles.overlay}>

                <View style={styles.modal}>

                    <View style={styles.header}>

                        <View>

                            <Text style={styles.titulo}>
                                {vehiculo
                                    ? "Editar vehículo"
                                    : "Registrar vehículo"}
                            </Text>

                            <Text style={styles.subtitulo}>
                                Completa la información del vehículo
                            </Text>

                        </View>


                        <Pressable
                            style={styles.cerrar}
                            onPress={
                                onCerrar
                            }
                        >
                            <Text style={styles.cerrarTexto}>
                                ✕
                            </Text>
                        </Pressable>

                    </View>


                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >

                        <Campo
                            label="ID del propietario * (No hay modulo construido)"

                            value={
                                formulario.propietarioId
                            }

                            onChangeText={(valor) =>
                                actualizarCampo(
                                    "propietarioId",
                                    valor.replace(
                                        /[^0-9]/g,
                                        ""
                                    )
                                )
                            }

                            keyboardType="numeric"

                            placeholder="Ej. 1"
                        />


                        <Campo
                            label="Marca *"

                            value={
                                formulario.marca
                            }

                            onChangeText={(valor) =>
                                actualizarCampo(
                                    "marca",
                                    valor
                                )
                            }

                            placeholder="Toyota"
                        />


                        <Campo
                            label="Modelo *"

                            value={
                                formulario.modelo
                            }

                            onChangeText={(valor) =>
                                actualizarCampo(
                                    "modelo",
                                    valor
                                )
                            }

                            placeholder="Corolla"
                        />


                        <View style={styles.dobleFila}>

                            <View style={styles.columna}>

                                <Campo
                                    label="Año *"

                                    value={
                                        formulario.anio
                                    }

                                    onChangeText={(valor) =>
                                        actualizarCampo(
                                            "anio",
                                            valor.replace(
                                                /[^0-9]/g,
                                                ""
                                            )
                                        )
                                    }

                                    keyboardType="numeric"

                                    placeholder="2024"
                                />

                            </View>


                            <View style={styles.columna}>

                                <Campo
                                    label="Placa *"

                                    value={
                                        formulario.placa
                                    }

                                    onChangeText={(valor) =>
                                        actualizarCampo(
                                            "placa",
                                            valor
                                                .toUpperCase()
                                        )
                                    }

                                    placeholder="P123456"
                                />

                            </View>

                        </View>


                        <Campo
                            label="Color"

                            value={
                                formulario.color
                            }

                            onChangeText={(valor) =>
                                actualizarCampo(
                                    "color",
                                    valor
                                )
                            }

                            placeholder="Negro"
                        />


                        <Campo
                            label="Kilometraje actual"

                            value={
                                formulario.kilometrajeActual
                            }

                            onChangeText={(valor) =>
                                actualizarCampo(
                                    "kilometrajeActual",
                                    valor
                                )
                            }

                            keyboardType="decimal-pad"

                            placeholder="35000.0"
                        />


                        <Campo
                            label="VIN"

                            value={
                                formulario.vin
                            }

                            onChangeText={(valor) =>
                                actualizarCampo(
                                    "vin",
                                    valor
                                )
                            }

                            placeholder="Número de identificación vehicular"
                        />


                        <Campo
                            label="Motor"

                            value={
                                formulario.motor
                            }

                            onChangeText={(valor) =>
                                actualizarCampo(
                                    "motor",
                                    valor
                                )
                            }

                            placeholder="1.8 gasolina"
                        />


                        {error ? (

                            <View style={styles.errorBox}>

                                <Text style={styles.errorTexto}>
                                    {error}
                                </Text>

                            </View>

                        ) : null}


                        <Pressable
                            style={[
                                styles.guardar,

                                guardando &&
                                styles.deshabilitado
                            ]}
                            onPress={
                                guardar
                            }
                            disabled={
                                guardando
                            }
                        >

                            {guardando ? (

                                <ActivityIndicator
                                    color="#FFFFFF"
                                />

                            ) : (

                                <Text style={styles.guardarTexto}>
                                    {vehiculo
                                        ? "GUARDAR CAMBIOS"
                                        : "REGISTRAR VEHÍCULO"}
                                </Text>
                            )}

                        </Pressable>


                        <Pressable
                            style={styles.cancelar}
                            onPress={
                                onCerrar
                            }
                        >

                            <Text style={styles.cancelarTexto}>
                                CANCELAR
                            </Text>

                        </Pressable>

                    </ScrollView>

                </View>

            </View>

        </Modal>
    );
}


function Campo({
    label,
    ...props
}) {

    return (

        <View style={styles.campo}>

            <Text style={styles.label}>
                {label}
            </Text>

            <TextInput
                style={styles.input}

                placeholderTextColor="#94A3B8"

                {...props}
            />

        </View>
    );
}


const styles = StyleSheet.create({

    overlay: {
        flex: 1,

        backgroundColor:
            "rgba(15, 23, 42, 0.45)",

        justifyContent: "flex-end"
    },


    modal: {
        maxHeight: "92%",

        backgroundColor: "#FFFFFF",

        borderTopLeftRadius: 22,

        borderTopRightRadius: 22,

        paddingHorizontal: 18,

        paddingTop: 18,

        paddingBottom: 25
    },


    header: {
        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "flex-start",

        marginBottom: 8
    },


    titulo: {
        color: "#172033",

        fontSize: 20,

        fontWeight: "900"
    },


    subtitulo: {
        color: "#7C8798",

        fontSize: 10,

        marginTop: 3
    },


    cerrar: {
        width: 34,
        height: 34,

        borderRadius: 17,

        backgroundColor: "#F1F5F9",

        justifyContent: "center",
        alignItems: "center"
    },


    cerrarTexto: {
        color: "#475569",

        fontWeight: "800"
    },


    campo: {
        marginTop: 12
    },


    label: {
        color: "#334155",

        fontSize: 10,

        fontWeight: "800",

        marginBottom: 6
    },


    input: {
        minHeight: 45,

        borderWidth: 1,

        borderColor: "#DCE2E9",

        borderRadius: 9,

        paddingHorizontal: 12,

        color: "#172033",

        backgroundColor: "#FAFBFC",

        fontSize: 12
    },


    dobleFila: {
        flexDirection: "row",

        gap: 10
    },


    columna: {
        flex: 1
    },


    errorBox: {
        marginTop: 14,

        padding: 10,

        backgroundColor: "#FEE2E2",

        borderRadius: 8
    },


    errorTexto: {
        color: "#B91C1C",

        fontSize: 10
    },


    guardar: {
        minHeight: 48,

        marginTop: 20,

        borderRadius: 9,

        backgroundColor: "#0D3559",

        justifyContent: "center",

        alignItems: "center"
    },


    guardarTexto: {
        color: "#FFFFFF",

        fontSize: 10,

        fontWeight: "900"
    },


    deshabilitado: {
        opacity: 0.6
    },


    cancelar: {
        minHeight: 43,

        marginTop: 8,

        borderRadius: 9,

        backgroundColor: "#EFF3F8",

        justifyContent: "center",

        alignItems: "center"
    },


    cancelarTexto: {
        color: "#64748B",

        fontSize: 9,

        fontWeight: "800"
    }
});