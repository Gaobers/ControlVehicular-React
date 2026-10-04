import React, {
    useEffect,
    useMemo,
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


function formatearKm(
    valor
) {

    return `${Number(
        valor || 0
    ).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }
    )} km`;
}


function nombreVehiculo(
    vehiculo
) {

    if (!vehiculo) {
        return "Vehículo";
    }


    return [
        vehiculo.marca,
        vehiculo.modelo
    ]
        .filter(Boolean)
        .join(" ");
}


export default function KilometrajeFormulario({

    registro = null,

    vehiculos = [],

    vehiculoPreseleccionado = null,

    kilometrajeReferencia = null,

    guardando = false,

    errorExterno = "",

    onGuardar,

    onCancelar

}) {

    const [
        vehiculoId,
        setVehiculoId
    ] = useState("");


    const [
        kilometraje,
        setKilometraje
    ] = useState("");


    const [
        observacion,
        setObservacion
    ] = useState("");


    const [
        mostrarVehiculos,
        setMostrarVehiculos
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    useEffect(() => {

        if (registro) {

            setVehiculoId(
                String(
                    registro.vehiculoId ??
                    ""
                )
            );

            setKilometraje(
                String(
                    registro.kilometraje ??
                    ""
                )
            );

            setObservacion(
                registro.observacion ||
                ""
            );

        } else {

            setVehiculoId(
                vehiculoPreseleccionado
                    ? String(
                        vehiculoPreseleccionado.id
                    )
                    : ""
            );

            setKilometraje("");

            setObservacion("");
        }


        setError("");

        setMostrarVehiculos(false);

    }, [
        registro,
        vehiculoPreseleccionado
    ]);


    const vehiculoSeleccionado =
        useMemo(() => {

            if (
                vehiculoPreseleccionado
            ) {

                return vehiculoPreseleccionado;
            }


            return vehiculos.find(
                (vehiculo) =>
                    String(vehiculo.id) ===
                    String(vehiculoId)
            );

        }, [
            vehiculoId,
            vehiculos,
            vehiculoPreseleccionado
        ]);


    const referencia =
        useMemo(() => {

            if (
                kilometrajeReferencia !==
                null &&
                kilometrajeReferencia !==
                undefined
            ) {

                return Number(
                    kilometrajeReferencia
                );
            }


            if (registro) {

                return Number(
                    registro.kilometraje ||
                    0
                );
            }


            if (
                vehiculoSeleccionado
            ) {

                return Number(
                    vehiculoSeleccionado
                        .kilometrajeActual ||
                    0
                );
            }


            return 0;

        }, [
            kilometrajeReferencia,
            registro,
            vehiculoSeleccionado
        ]);


    const nuevoKm =
        Number(
            String(
                kilometraje || ""
            ).replace(",", ".")
        );


    const diferencia =
        Number.isFinite(
            nuevoKm
        )
            ? nuevoKm - referencia
            : 0;


    const guardar = () => {

        setError("");


        if (
            !registro &&
            !vehiculoId
        ) {

            setError(
                "Selecciona un vehículo."
            );

            return;
        }


        if (
            kilometraje.trim() ===
            ""
        ) {

            setError(
                "Ingresa el nuevo kilometraje."
            );

            return;
        }


        if (
            !Number.isFinite(
                nuevoKm
            ) ||
            nuevoKm < 0
        ) {

            setError(
                "Ingresa un kilometraje válido."
            );

            return;
        }


        if (
            nuevoKm <
            referencia
        ) {

            setError(
                `El kilometraje no puede ser menor a ${formatearKm(
                    referencia
                )}.`
            );

            return;
        }


        if (
            observacion.length >
            255
        ) {

            setError(
                "La observación no puede superar los 255 caracteres."
            );

            return;
        }


        if (registro) {

            onGuardar({
                kilometraje:
                    nuevoKm,

                observacion:
                    observacion
                        .trim() ||
                    null,

                activo:
                    registro.activo !==
                    false
            });

            return;
        }


        onGuardar({
            vehiculoId:
                Number(
                    vehiculoId
                ),

            kilometraje:
                nuevoKm,

            observacion:
                observacion
                    .trim() ||
                null
        });
    };


    return (

        <View>

            {/* VEHÍCULO */}

            {!registro &&
            !vehiculoPreseleccionado ? (

                <>

                    <Text style={styles.label}>
                        Vehículo *
                    </Text>


                    <Pressable
                        style={styles.select}

                        onPress={() =>
                            setMostrarVehiculos(
                                !mostrarVehiculos
                            )
                        }
                    >

                        <Text
                            style={
                                vehiculoSeleccionado
                                    ? styles.selectText
                                    : styles.placeholder
                            }
                        >
                            {vehiculoSeleccionado
                                ? nombreVehiculo(
                                    vehiculoSeleccionado
                                )
                                : "Seleccionar vehículo"}
                        </Text>


                        <Text style={styles.arrow}>
                            ⌄
                        </Text>

                    </Pressable>


                    {mostrarVehiculos && (

                        <View style={styles.dropdown}>

                            {vehiculos.map(
                                (vehiculo) => (

                                    <Pressable
                                        key={
                                            vehiculo.id
                                        }

                                        style={
                                            styles.dropdownItem
                                        }

                                        onPress={() => {

                                            setVehiculoId(
                                                String(
                                                    vehiculo.id
                                                )
                                            );

                                            setMostrarVehiculos(
                                                false
                                            );
                                        }}
                                    >

                                        <Text
                                            style={
                                                styles.dropdownTitle
                                            }
                                        >
                                            {nombreVehiculo(
                                                vehiculo
                                            )}
                                        </Text>

                                        <Text
                                            style={
                                                styles.dropdownSubtitle
                                            }
                                        >
                                            {vehiculo.placa}
                                        </Text>

                                    </Pressable>
                                )
                            )}

                        </View>
                    )}

                </>

            ) : null}


            {/* VEHÍCULO SELECCIONADO */}

            {vehiculoSeleccionado && (

                <View style={styles.vehicleCard}>

                    <View style={styles.vehicleTop}>

                        <View style={styles.vehicleIcon}>

                            <Text style={styles.vehicleIconText}>
                                VH
                            </Text>

                        </View>


                        <View style={{ flex: 1 }}>

                            <Text style={styles.vehicleName}>
                                {nombreVehiculo(
                                    vehiculoSeleccionado
                                )}
                            </Text>

                            <Text style={styles.vehiclePlate}>
                                {vehiculoSeleccionado.placa}
                            </Text>

                        </View>


                        <View style={styles.operativoBadge}>

                            <Text style={styles.operativoText}>
                                ACTIVO
                            </Text>

                        </View>

                    </View>


                    <View style={styles.actualRow}>

                        <View>

                            <Text style={styles.actualLabel}>
                                ÚLTIMO KILOMETRAJE
                            </Text>

                            <Text style={styles.actualMeta}>
                                Lectura de referencia
                            </Text>

                        </View>


                        <Text style={styles.actualValue}>
                            {formatearKm(
                                referencia
                            )}
                        </Text>

                    </View>

                </View>
            )}


            {/* NUEVO KILOMETRAJE */}

            <View style={styles.formCard}>

                <Text style={styles.sectionTitle}>
                    {registro
                        ? "Modificar kilometraje"
                        : "Nuevo kilometraje"}
                </Text>


                <Text style={styles.sectionDescription}>
                    {registro
                        ? "Actualiza la lectura registrada."
                        : "Ingresa el kilometraje total acumulado que marca el odómetro."}
                </Text>


                <View style={styles.kmInputBox}>

                    <TextInput
                        style={styles.kmInput}

                        value={
                            kilometraje
                        }

                        onChangeText={
                            setKilometraje
                        }

                        keyboardType="decimal-pad"

                        placeholder="Ingresa km"

                        placeholderTextColor="#94A3B8"
                    />


                    <Text style={styles.kmSuffix}>
                        km
                    </Text>

                </View>


                <View style={styles.differenceRow}>

                    <Text style={styles.differenceLabel}>
                        Diferencia de recorrido:
                    </Text>


                    <Text
                        style={[
                            styles.differenceValue,

                            diferencia < 0 &&
                            styles.differenceError
                        ]}
                    >
                        {kilometraje
                            ? `${diferencia >= 0 ? "+" : ""}${diferencia.toLocaleString(
                                "en-US",
                                {
                                    maximumFractionDigits: 1
                                }
                            )} km`
                            : "-"}
                    </Text>

                </View>


                <Text style={styles.label}>
                    Observación
                </Text>


                <TextInput
                    style={styles.observationInput}

                    value={
                        observacion
                    }

                    onChangeText={(valor) =>
                        setObservacion(
                            valor.slice(
                                0,
                                255
                            )
                        )
                    }

                    multiline

                    maxLength={255}

                    placeholder="Ej. Lectura tomada durante revisión general"

                    placeholderTextColor="#94A3B8"
                />


                <Text style={styles.counter}>
                    {observacion.length}/255
                </Text>


                <View style={styles.dateInfo}>

                    <View style={styles.dateIcon}>

                        <Text style={styles.dateIconText}>
                            ⏱
                        </Text>

                    </View>


                    <View style={{ flex: 1 }}>

                        <Text style={styles.dateTitle}>
                            Fecha de lectura
                        </Text>

                        <Text style={styles.dateText}>
                            Se registrará automáticamente al guardar.
                        </Text>

                    </View>

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
                        {registro
                            ? "GUARDAR CAMBIOS"
                            : "REGISTRAR KILOMETRAJE"}
                    </Text>
                )}

            </Pressable>


            {onCancelar && (

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
            )}

        </View>
    );
}


const styles = StyleSheet.create({

    label: {
        marginTop: 13,

        marginBottom: 6,

        color: "#334155",

        fontSize: 10,

        fontWeight: "800"
    },


    select: {
        minHeight: 46,

        backgroundColor: "#FFFFFF",

        borderWidth: 1,

        borderColor: "#E0E5EC",

        borderRadius: 9,

        paddingHorizontal: 12,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between"
    },


    selectText: {
        color: "#172033",

        fontSize: 11
    },


    placeholder: {
        color: "#94A3B8",

        fontSize: 11
    },


    arrow: {
        color: "#64748B"
    },


    dropdown: {
        marginTop: 5,

        backgroundColor: "#FFFFFF",

        borderRadius: 9,

        borderWidth: 1,

        borderColor: "#E0E5EC",

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

        fontWeight: "700"
    },


    dropdownSubtitle: {
        marginTop: 2,

        color: "#94A3B8",

        fontSize: 8
    },


    vehicleCard: {
        marginTop: 8,

        padding: 13,

        backgroundColor: "#FFFFFF",

        borderRadius: 13,

        borderWidth: 1,

        borderColor: "#E7EBF1"
    },


    vehicleTop: {
        flexDirection: "row",

        alignItems: "center",

        gap: 9
    },


    vehicleIcon: {
        width: 42,

        height: 42,

        borderRadius: 9,

        backgroundColor: "#073B61",

        alignItems: "center",

        justifyContent: "center"
    },


    vehicleIconText: {
        color: "#FFFFFF",

        fontSize: 9,

        fontWeight: "900"
    },


    vehicleName: {
        color: "#172033",

        fontSize: 12,

        fontWeight: "900"
    },


    vehiclePlate: {
        color: "#64748B",

        fontSize: 8,

        marginTop: 2
    },


    operativoBadge: {
        paddingHorizontal: 7,

        paddingVertical: 4,

        borderRadius: 7,

        backgroundColor: "#DCFCE7"
    },


    operativoText: {
        color: "#15803D",

        fontSize: 7,

        fontWeight: "900"
    },


    actualRow: {
        marginTop: 11,

        backgroundColor: "#F1F4FF",

        borderRadius: 8,

        padding: 10,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between"
    },


    actualLabel: {
        color: "#64748B",

        fontSize: 7,

        fontWeight: "900"
    },


    actualMeta: {
        color: "#94A3B8",

        fontSize: 7,

        marginTop: 2
    },


    actualValue: {
        color: "#17325C",

        fontSize: 15,

        fontWeight: "900"
    },


    formCard: {
        marginTop: 15,

        backgroundColor: "#FFFFFF",

        borderRadius: 13,

        borderWidth: 1,

        borderColor: "#E7EBF1",

        padding: 13
    },


    sectionTitle: {
        color: "#172033",

        fontSize: 12,

        fontWeight: "900"
    },


    sectionDescription: {
        marginTop: 3,

        color: "#64748B",

        fontSize: 8,

        lineHeight: 13
    },


    kmInputBox: {
        marginTop: 12,

        minHeight: 51,

        borderRadius: 9,

        backgroundColor: "#F1F4FF",

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 12
    },


    kmInput: {
        flex: 1,

        minHeight: 49,

        color: "#172033",

        fontSize: 16,

        fontWeight: "900",

        textAlign: "center"
    },


    kmSuffix: {
        color: "#64748B",

        fontSize: 10,

        fontWeight: "800"
    },


    differenceRow: {
        marginTop: 7,

        paddingHorizontal: 5,

        flexDirection: "row",

        justifyContent: "space-between"
    },


    differenceLabel: {
        color: "#94A3B8",

        fontSize: 8
    },


    differenceValue: {
        color: "#0284C7",

        fontSize: 8,

        fontWeight: "900"
    },


    differenceError: {
        color: "#DC2626"
    },


    observationInput: {
        minHeight: 80,

        borderWidth: 1,

        borderColor: "#E0E5EC",

        borderRadius: 9,

        padding: 10,

        textAlignVertical: "top",

        color: "#172033",

        fontSize: 10
    },


    counter: {
        marginTop: 4,

        textAlign: "right",

        color: "#94A3B8",

        fontSize: 7
    },


    dateInfo: {
        marginTop: 13,

        backgroundColor: "#F1F4FF",

        borderRadius: 9,

        padding: 10,

        flexDirection: "row",

        alignItems: "center",

        gap: 9
    },


    dateIcon: {
        width: 32,

        height: 32,

        borderRadius: 16,

        backgroundColor: "#DDE8FF",

        alignItems: "center",

        justifyContent: "center"
    },


    dateIconText: {
        fontSize: 11
    },


    dateTitle: {
        color: "#334155",

        fontSize: 9,

        fontWeight: "800"
    },


    dateText: {
        color: "#64748B",

        fontSize: 8,

        marginTop: 2
    },


    errorBox: {
        marginTop: 12,

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

        marginTop: 16,

        borderRadius: 9,

        backgroundColor: "#073B61",

        alignItems: "center",

        justifyContent: "center"
    },


    saveText: {
        color: "#FFFFFF",

        fontSize: 10,

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


    disabled: {
        opacity: 0.6
    }
});