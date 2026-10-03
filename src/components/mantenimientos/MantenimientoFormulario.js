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

import DatePickerField
    from "../common/DatePickerField";

export default function MantenimientoFormulario({
    mantenimiento = null,
    vehiculos = [],
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
        servicio,
        setServicio
    ] = useState("");

    const [
        tipoProgramacion,
        setTipoProgramacion
    ] = useState("AMBOS");

    const [
        fechaObjetivo,
        setFechaObjetivo
    ] = useState("");

    const [
        kilometrajeObjetivo,
        setKilometrajeObjetivo
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
        if (mantenimiento) {
            setVehiculoId(
                String(
                    mantenimiento.vehiculoId ??
                    ""
                )
            );

            setServicio(
                mantenimiento.servicio || ""
            );

            setFechaObjetivo(
                mantenimiento.fechaObjetivo ||
                ""
            );

            setKilometrajeObjetivo(
                mantenimiento.kilometrajeObjetivo !==
                null &&
                mantenimiento.kilometrajeObjetivo !==
                undefined
                    ? String(
                        mantenimiento.kilometrajeObjetivo
                    )
                    : ""
            );

            if (
                mantenimiento.fechaObjetivo &&
                mantenimiento.kilometrajeObjetivo !==
                null &&
                mantenimiento.kilometrajeObjetivo !==
                undefined
            ) {
                setTipoProgramacion("AMBOS");
            } else if (
                mantenimiento.fechaObjetivo
            ) {
                setTipoProgramacion("FECHA");
            } else {
                setTipoProgramacion("KM");
            }
        } else {
            setVehiculoId("");
            setServicio("");
            setFechaObjetivo("");
            setKilometrajeObjetivo("");
            setTipoProgramacion("AMBOS");
        }

        setError("");
        setMostrarVehiculos(false);
    }, [mantenimiento]);

    const vehiculoSeleccionado =
        vehiculos.find(
            (vehiculo) =>
                String(vehiculo.id) ===
                String(vehiculoId)
        );

    const guardar = () => {
        setError("");

        if (!vehiculoId) {
            setError(
                "Selecciona un vehículo."
            );
            return;
        }

        if (!servicio.trim()) {
            setError(
                "Ingresa el servicio de mantenimiento."
            );
            return;
        }

        const usaFecha =
            tipoProgramacion === "AMBOS" ||
            tipoProgramacion === "FECHA";

        const usaKm =
            tipoProgramacion === "AMBOS" ||
            tipoProgramacion === "KM";

        if (
            usaFecha &&
            !fechaObjetivo
        ) {
            setError(
                "Ingresa la fecha objetivo."
            );
            return;
        }

        let kilometraje = null;

        if (usaKm) {
            kilometraje = Number(
                String(
                    kilometrajeObjetivo
                ).replace(",", ".")
            );

            if (
                !Number.isFinite(kilometraje) ||
                kilometraje < 0
            ) {
                setError(
                    "Ingresa un kilometraje objetivo válido."
                );
                return;
            }
        }

        onGuardar({
            vehiculoId:
                Number(vehiculoId),

            servicio:
                servicio.trim(),

            estado:
                mantenimiento?.estado ||
                "PENDIENTE",

            fechaObjetivo:
                usaFecha
                    ? fechaObjetivo
                    : null,

            kilometrajeObjetivo:
                usaKm
                    ? kilometraje
                    : null
        });
    };

    return (
        <View>
            <View style={styles.section}>
                <Text style={styles.sectionNumber}>
                    1.
                </Text>

                <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>
                        Datos del servicio
                    </Text>

                    <Text style={styles.sectionSubtitle}>
                        Selección del activo y tipo de labor
                    </Text>
                </View>
            </View>

            <Text style={styles.label}>
                Vehículo asignado *
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
                        ? `${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo} • ${vehiculoSeleccionado.placa}`
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
                                key={vehiculo.id}
                                style={styles.dropdownItem}
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
                                <Text style={styles.dropdownTitle}>
                                    {vehiculo.marca}{" "}
                                    {vehiculo.modelo}
                                </Text>

                                <Text style={styles.dropdownSubtitle}>
                                    {vehiculo.placa}
                                </Text>
                            </Pressable>
                        )
                    )}
                </View>
            )}

            <Text style={styles.label}>
                Tipo de servicio *
            </Text>

            <TextInput
                style={styles.input}
                value={servicio}
                onChangeText={setServicio}
                placeholder="Ej. Cambio de aceite"
                placeholderTextColor="#94A3B8"
            />

            <View style={styles.programSection}>
                <View style={styles.section}>
                    <Text style={styles.sectionNumber}>
                        2.
                    </Text>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.sectionTitle}>
                            Programación del mantenimiento
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Define cuándo debe realizarse
                        </Text>
                    </View>
                </View>

                <View style={styles.modeSelector}>
                    <Modo
                        activo={
                            tipoProgramacion ===
                            "AMBOS"
                        }
                        titulo="Ambos"
                        subtitulo="Fecha y km"
                        onPress={() =>
                            setTipoProgramacion(
                                "AMBOS"
                            )
                        }
                    />

                    <Modo
                        activo={
                            tipoProgramacion ===
                            "FECHA"
                        }
                        titulo="Por fecha"
                        subtitulo="Límite temporal"
                        onPress={() =>
                            setTipoProgramacion(
                                "FECHA"
                            )
                        }
                    />

                    <Modo
                        activo={
                            tipoProgramacion ===
                            "KM"
                        }
                        titulo="Por odómetro"
                        subtitulo="Kilometraje"
                        onPress={() =>
                            setTipoProgramacion(
                                "KM"
                            )
                        }
                    />
                </View>

                {(tipoProgramacion === "AMBOS" ||
                    tipoProgramacion === "FECHA") && (
                    <>
                        <Text style={styles.label}>
                            Fecha objetivo *
                        </Text>

                <DatePickerField
                    value={fechaObjetivo}
                    onChange={setFechaObjetivo}
                    placeholder="Seleccionar fecha"
                />
                    </>
                )}

                {(tipoProgramacion === "AMBOS" ||
                    tipoProgramacion === "KM") && (
                    <>
                        <Text style={styles.label}>
                            Kilometraje objetivo *
                        </Text>

                        <View style={styles.kmBox}>
                            <TextInput
                                style={styles.kmInput}
                                value={
                                    kilometrajeObjetivo
                                }
                                onChangeText={
                                    setKilometrajeObjetivo
                                }
                                keyboardType="numeric"
                                placeholder="Ej. 65000"
                                placeholderTextColor="#94A3B8"
                            />

                            <Text style={styles.kmSuffix}>
                                km
                            </Text>
                        </View>
                    </>
                )}
            </View>

            {(error || errorExterno) ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>
                        {error || errorExterno}
                    </Text>
                </View>
            ) : null}

            <Pressable
                style={[
                    styles.saveButton,
                    guardando &&
                    styles.disabled
                ]}
                disabled={guardando}
                onPress={guardar}
            >
                {guardando ? (
                    <ActivityIndicator
                        color="#FFFFFF"
                    />
                ) : (
                    <Text style={styles.saveText}>
                        {mantenimiento
                            ? "GUARDAR CAMBIOS"
                            : "PROGRAMAR MANTENIMIENTO"}
                    </Text>
                )}
            </Pressable>

            <Pressable
                style={styles.cancelButton}
                onPress={onCancelar}
            >
                <Text style={styles.cancelText}>
                    Cancelar
                </Text>
            </Pressable>
        </View>
    );
}

function Modo({
    activo,
    titulo,
    subtitulo,
    onPress
}) {
    return (
        <Pressable
            style={[
                styles.mode,
                activo &&
                styles.modeActive
            ]}
            onPress={onPress}
        >
            <Text
                style={[
                    styles.modeTitle,
                    activo &&
                    styles.modeTitleActive
                ]}
            >
                {titulo}
            </Text>

            <Text
                style={[
                    styles.modeSubtitle,
                    activo &&
                    styles.modeSubtitleActive
                ]}
            >
                {subtitulo}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    section: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        marginBottom: 12
    },

    sectionNumber: {
        width: 27,
        height: 27,
        borderRadius: 7,
        backgroundColor: "#E5EDFF",
        color: "#1D4ED8",
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 11,
        fontWeight: "900",
        paddingTop: 6
    },

    sectionTitle: {
        color: "#172033",
        fontSize: 12,
        fontWeight: "900"
    },

    sectionSubtitle: {
        marginTop: 2,
        color: "#94A3B8",
        fontSize: 8
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

    input: {
        minHeight: 46,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "#E0E5EC",
        paddingHorizontal: 12,
        backgroundColor: "#FFFFFF",
        color: "#172033",
        fontSize: 10
    },

    programSection: {
        marginTop: 16,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E7EBF1",
        borderRadius: 13,
        padding: 13
    },

    modeSelector: {
        flexDirection: "row",
        backgroundColor: "#F1F4FF",
        borderRadius: 8,
        padding: 3
    },

    mode: {
        flex: 1,
        minHeight: 45,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4
    },

    modeActive: {
        backgroundColor: "#073B61"
    },

    modeTitle: {
        color: "#475569",
        fontSize: 8,
        fontWeight: "800"
    },

    modeTitleActive: {
        color: "#FFFFFF"
    },

    modeSubtitle: {
        color: "#94A3B8",
        fontSize: 6,
        marginTop: 2,
        textAlign: "center"
    },

    modeSubtitleActive: {
        color: "#BDD5E7"
    },

    kmBox: {
        minHeight: 46,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "#E0E5EC",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12
    },

    kmInput: {
        flex: 1,
        minHeight: 44,
        color: "#172033",
        fontSize: 10
    },

    kmSuffix: {
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

    disabled: {
        opacity: 0.6
    }
});