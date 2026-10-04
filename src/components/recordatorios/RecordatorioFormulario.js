import React, {
    useEffect,
    useState
} from "react";

import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

import {
    buscarVehiculo,
    esActivo,
    obtenerNombreVehiculo
} from "./recordatorioUtils";


export default function RecordatorioFormulario({
    recordatorio = null,
    recordatorios = [],
    mantenimientos = [],
    vehiculos = [],
    guardando = false,
    errorExterno = "",
    onGuardar,
    onCancelar
}) {

    const [
        mantenimientoId,
        setMantenimientoId
    ] = useState("");


    const [
        diasAnticipacion,
        setDiasAnticipacion
    ] = useState("");


    const [
        kilometrosAnticipacion,
        setKilometrosAnticipacion
    ] = useState("");


    const [
        mostrarMantenimientos,
        setMostrarMantenimientos
    ] = useState(false);

   const mantenimientosDisponibles =
    mantenimientos.filter(
        (mantenimiento) => {

            const esActual =
                String(
                    mantenimiento.id
                ) ===
                String(
                    recordatorio?.mantenimientoId
                );


            // Si estoy editando, siempre permito
            // conservar la relación actual.
            if (esActual) {
                return true;
            }


            // Debe existir el vehículo relacionado.
            const vehiculoRelacionado =
                buscarVehiculo(
                    vehiculos,
                    mantenimiento.vehiculoId
                );


            if (!vehiculoRelacionado) {
                return false;
            }


            // No ofrecer vehículos archivados.
            if (
                vehiculoRelacionado.estado ===
                "ARCHIVADO"
            ) {
                return false;
            }


            // Un mantenimiento realizado ya
            // no necesita un recordatorio nuevo.
            if (
                mantenimiento.estado ===
                "REALIZADO"
            ) {
                return false;
            }


            /*
             * Conserva este bloque solamente
             * si tu sistema permite un único
             * recordatorio activo por mantenimiento.
             */
            const yaTieneRecordatorio =
                recordatorios.some(
                    (item) =>
                        esActivo(
                            item.activo
                        ) &&
                        String(
                            item.mantenimientoId
                        ) ===
                        String(
                            mantenimiento.id
                        ) &&
                        String(
                            item.id
                        ) !==
                        String(
                            recordatorio?.id
                        )
                );


            return !yaTieneRecordatorio;
        }
    );

    const [
        error,
        setError
    ] = useState("");


    useEffect(() => {

        if (recordatorio) {

            setMantenimientoId(
                String(
                    recordatorio
                        .mantenimientoId ??
                    ""
                )
            );

            setDiasAnticipacion(
                String(
                    recordatorio
                        .diasAnticipacion ??
                    0
                )
            );

            setKilometrosAnticipacion(
                String(
                    recordatorio
                        .kilometrosAnticipacion ??
                    0
                )
            );

        } else {

            setMantenimientoId("");

            setDiasAnticipacion(
                "7"
            );

            setKilometrosAnticipacion(
                "500"
            );
        }


        setError("");

        setMostrarMantenimientos(
            false
        );

    }, [
        recordatorio
    ]);


    const mantenimiento =
        mantenimientos.find(
            (item) =>
                String(item.id) ===
                String(
                    mantenimientoId
                )
        );


    const vehiculo =
        mantenimiento
            ? buscarVehiculo(
                vehiculos,
                mantenimiento
                    .vehiculoId
            )
            : null;


    const guardar = () => {

        setError("");


        if (!mantenimientoId) {

            setError(
                "Selecciona un mantenimiento."
            );

            return;
        }


        const dias =
            Number(
                diasAnticipacion ||
                0
            );


        const km =
            Number(
                kilometrosAnticipacion ||
                0
            );


        if (
            !Number.isInteger(dias) ||
            dias < 0
        ) {

            setError(
                "Los días de anticipación deben ser un número entero no negativo."
            );

            return;
        }


        if (
            !Number.isFinite(km) ||
            km < 0
        ) {

            setError(
                "Los kilómetros de anticipación deben ser válidos."
            );

            return;
        }


        onGuardar({

            mantenimientoId:
                Number(
                    mantenimientoId
                ),

            diasAnticipacion:
                dias,

            kilometrosAnticipacion:
                km
        });
    };


    return (

        <View>

            <View style={styles.sectionHeader}>

                <View style={styles.number}>
                    <Text style={styles.numberText}>
                        1
                    </Text>
                </View>


                <View style={{ flex: 1 }}>

                    <Text style={styles.sectionTitle}>
                        Mantenimiento asociado
                    </Text>

                    <Text style={styles.sectionSubtitle}>
                        Selecciona qué mantenimiento deseas vigilar.
                    </Text>

                </View>

            </View>


            <Text style={styles.label}>
                Mantenimiento *
            </Text>


            <Pressable
                style={styles.select}

                onPress={() =>
                    setMostrarMantenimientos(
                        !mostrarMantenimientos
                    )
                }
            >

                <Text
                    style={
                        mantenimiento
                            ? styles.selectText
                            : styles.placeholder
                    }
                >
                    {mantenimiento
                        ? mantenimiento.servicio
                        : "Seleccionar mantenimiento"}
                </Text>


                <Text style={styles.arrow}>
                    ⌄
                </Text>

            </Pressable>


            {mostrarMantenimientos && (

                <View style={styles.dropdown}>

                    {mantenimientosDisponibles.map(
                        (item) => {

                            const vehiculoItem =
                                buscarVehiculo(
                                    vehiculos,
                                    item.vehiculoId
                                );


                            return (

                                <Pressable
                                    key={
                                        item.id
                                    }

                                    style={
                                        styles.dropdownItem
                                    }

                                    onPress={() => {

                                        setMantenimientoId(
                                            String(
                                                item.id
                                            )
                                        );

                                        setMostrarMantenimientos(
                                            false
                                        );
                                    }}
                                >

                                    <Text style={styles.dropdownTitle}>
                                        {item.servicio}
                                    </Text>

                                    <Text style={styles.dropdownSubtitle}>
                                        {obtenerNombreVehiculo(
                                            vehiculoItem
                                        )}
                                    </Text>

                                </Pressable>
                            );
                        }
                    )}

                </View>
            )}


            {mantenimiento && (

                <View style={styles.selectedCard}>

                    <Text style={styles.selectedService}>
                        {mantenimiento.servicio}
                    </Text>

                    <Text style={styles.selectedVehicle}>
                        {obtenerNombreVehiculo(
                            vehiculo
                        )}
                    </Text>

                </View>
            )}


            <View style={styles.rulesCard}>

                <View style={styles.sectionHeader}>

                    <View style={styles.number}>
                        <Text style={styles.numberText}>
                            2
                        </Text>
                    </View>


                    <View style={{ flex: 1 }}>

                        <Text style={styles.sectionTitle}>
                            Configuración del aviso
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Define cuánto antes deseas recibir el recordatorio.
                        </Text>

                    </View>

                </View>


                <Text style={styles.label}>
                    Días de anticipación
                </Text>


                <View style={styles.inputWithSuffix}>

                    <TextInput
                        style={styles.inputFlex}

                        value={
                            diasAnticipacion
                        }

                        onChangeText={(valor) =>
                            setDiasAnticipacion(
                                valor.replace(
                                    /[^0-9]/g,
                                    ""
                                )
                            )
                        }

                        keyboardType="numeric"

                        placeholder="7"

                        placeholderTextColor="#94A3B8"
                    />


                    <Text style={styles.suffix}>
                        días
                    </Text>

                </View>


                <Text style={styles.label}>
                    Kilómetros de anticipación
                </Text>


                <View style={styles.inputWithSuffix}>

                    <TextInput
                        style={styles.inputFlex}

                        value={
                            kilometrosAnticipacion
                        }

                        onChangeText={(valor) =>
                            setKilometrosAnticipacion(
                                valor.replace(
                                    /[^0-9.]/g,
                                    ""
                                )
                            )
                        }

                        keyboardType="numeric"

                        placeholder="500"

                        placeholderTextColor="#94A3B8"
                    />


                    <Text style={styles.suffix}>
                        km
                    </Text>

                </View>

            </View>


            {(error || errorExterno) ? (

                <View style={styles.errorBox}>

                    <Text style={styles.errorText}>
                        {error ||
                            errorExterno}
                    </Text>

                </View>

            ) : null}


            <Pressable
                style={[
                    styles.saveButton,

                    guardando &&
                    styles.disabled
                ]}

                disabled={
                    guardando
                }

                onPress={
                    guardar
                }
            >

                {guardando ? (

                    <ActivityIndicator
                        color="#FFFFFF"
                    />

                ) : (

                    <Text style={styles.saveText}>
                        {recordatorio
                            ? "GUARDAR CAMBIOS"
                            : "CREAR RECORDATORIO"}
                    </Text>
                )}

            </Pressable>


            <Pressable
                style={styles.cancelButton}

                onPress={
                    onCancelar
                }
            >

                <Text style={styles.cancelText}>
                    Cancelar
                </Text>

            </Pressable>

        </View>
    );
}


const styles = StyleSheet.create({

    sectionHeader: {
        flexDirection: "row",

        alignItems: "flex-start",

        gap: 8,

        marginBottom: 11
    },


    number: {
        width: 28,

        height: 28,

        borderRadius: 7,

        backgroundColor: "#E5EDFF",

        alignItems: "center",

        justifyContent: "center"
    },


    numberText: {
        color: "#1D4ED8",

        fontSize: 10,

        fontWeight: "900"
    },


    sectionTitle: {
        color: "#172033",

        fontSize: 12,

        fontWeight: "900"
    },


    sectionSubtitle: {
        marginTop: 2,

        color: "#94A3B8",

        fontSize: 8,

        lineHeight: 12
    },


    label: {
        marginTop: 11,

        marginBottom: 6,

        color: "#334155",

        fontSize: 9,

        fontWeight: "800"
    },


    select: {
        minHeight: 46,

        borderRadius: 9,

        borderWidth: 1,

        borderColor: "#E0E5EC",

        backgroundColor: "#FFFFFF",

        paddingHorizontal: 12,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between"
    },


    selectText: {
        flex: 1,

        color: "#172033",

        fontSize: 10
    },


    placeholder: {
        color: "#94A3B8",

        fontSize: 10
    },


    arrow: {
        color: "#64748B"
    },


    dropdown: {
        marginTop: 5,

        borderRadius: 9,

        borderWidth: 1,

        borderColor: "#E0E5EC",

        backgroundColor: "#FFFFFF",

        overflow: "hidden"
    },


    dropdownItem: {
        padding: 11,

        borderBottomWidth: 1,

        borderBottomColor: "#EEF1F5"
    },


    dropdownTitle: {
        color: "#334155",

        fontSize: 10,

        fontWeight: "800"
    },


    dropdownSubtitle: {
        marginTop: 3,

        color: "#94A3B8",

        fontSize: 8
    },


    selectedCard: {
        marginTop: 8,

        padding: 10,

        borderRadius: 9,

        backgroundColor: "#F1F4FF"
    },


    selectedService: {
        color: "#172033",

        fontSize: 10,

        fontWeight: "900"
    },


    selectedVehicle: {
        color: "#64748B",

        fontSize: 8,

        marginTop: 3
    },


    rulesCard: {
        marginTop: 16,

        padding: 13,

        backgroundColor: "#FFFFFF",

        borderRadius: 13,

        borderWidth: 1,

        borderColor: "#E7EBF1"
    },


    inputWithSuffix: {
        minHeight: 46,

        borderRadius: 9,

        borderWidth: 1,

        borderColor: "#E0E5EC",

        backgroundColor: "#FFFFFF",

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 12
    },


    inputFlex: {
        flex: 1,

        minHeight: 44,

        color: "#172033",

        fontSize: 10
    },


    suffix: {
        color: "#64748B",

        fontSize: 9,

        fontWeight: "700"
    },


    errorBox: {
        marginTop: 13,

        padding: 10,

        borderRadius: 8,

        backgroundColor: "#FEE2E2"
    },


    errorText: {
        color: "#B91C1C",

        fontSize: 9,

        fontWeight: "700"
    },


    saveButton: {
        minHeight: 48,

        marginTop: 17,

        borderRadius: 9,

        backgroundColor: "#073B61",

        alignItems: "center",

        justifyContent: "center"
    },


    saveText: {
        color: "#FFFFFF",

        fontSize: 9,

        fontWeight: "900"
    },


    cancelButton: {
        minHeight: 42,

        marginTop: 7,

        borderRadius: 8,

        backgroundColor: "#FFFFFF",

        alignItems: "center",

        justifyContent: "center"
    },


    cancelText: {
        color: "#64748B",

        fontSize: 9,

        fontWeight: "700"
    },

    warningBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#FFF7ED"
},

warningText: {
    color: "#9A3412",
    fontSize: 12,
    lineHeight: 17
},


    disabled: {
        opacity: 0.6
    }
});