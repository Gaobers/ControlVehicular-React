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

import DatePickerField
    from "../common/DatePickerField";


const crearInicial = () => ({
    vehiculoId: "",
    categoriaId: "",
    monto: "",
    moneda: "USD",
    fecha: "",
    descripcion: "",
    numeroComprobante: "",
    proveedor: "",
    activo: true
});


export default function GastoFormulario({

    visible,

    gasto,

    vehiculos,

    guardando,

    onCerrar,

    onGuardar

}) {

    const [
        formulario,
        setFormulario
    ] = useState(
        crearInicial()
    );


    const [
        mostrarVehiculos,
        setMostrarVehiculos
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    useEffect(() => {

        if (gasto) {

            setFormulario({
                vehiculoId:
                    String(
                        gasto.vehiculoId ??
                        ""
                    ),

                categoriaId:
                    String(
                        gasto.categoriaId ??
                        ""
                    ),

                monto:
                    String(
                        gasto.monto ??
                        ""
                    ),

                moneda:
                    gasto.moneda ||
                    "USD",

                fecha:
                    gasto.fecha ||
                    "",

                descripcion:
                    gasto.descripcion ||
                    "",

                numeroComprobante:
                    gasto.numeroComprobante ||
                    "",

                proveedor:
                    gasto.proveedor ||
                    "",

                activo:
                    gasto.activo !== false
            });

        } else {

            setFormulario(
                crearInicial()
            );
        }


        setError("");

        setMostrarVehiculos(false);

    }, [
        gasto,
        visible
    ]);


    const actualizar = (
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


    const nombreVehiculo = (
        vehiculo
    ) => {

        return [
            vehiculo.marca,
            vehiculo.modelo,
            vehiculo.placa
                ? `(${vehiculo.placa})`
                : ""
        ]
            .filter(Boolean)
            .join(" ");
    };


    const vehiculoSeleccionado =
        vehiculos.find(
            (vehiculo) =>
                String(vehiculo.id) ===
                String(
                    formulario.vehiculoId
                )
        );


    const guardar = () => {

        setError("");


        if (
            !formulario.vehiculoId ||
            !formulario.categoriaId ||
            !formulario.monto ||
            !formulario.fecha
        ) {

            setError(
                "Completa los campos obligatorios."
            );

            return;
        }


        const monto =
            Number(
                String(
                    formulario.monto
                ).replace(",", ".")
            );


        if (
            !Number.isFinite(monto) ||
            monto <= 0
        ) {

            setError(
                "El monto debe ser mayor que cero."
            );

            return;
        }


        onGuardar({
            vehiculoId:
                Number(
                    formulario.vehiculoId
                ),

            categoriaId:
                Number(
                    formulario.categoriaId
                ),

            monto,

            moneda:
                formulario.moneda
                    .trim()
                    .toUpperCase(),

            fecha:
                formulario.fecha,

            descripcion:
                formulario.descripcion
                    .trim() ||
                null,

            numeroComprobante:
                formulario.numeroComprobante
                    .trim() ||
                null,

            proveedor:
                formulario.proveedor
                    .trim() ||
                null,

            ...(gasto
                ? {
                    activo:
                        formulario.activo
                }
                : {})
        });
    };


    return (

        <Modal
            visible={visible}

            animationType="slide"

            transparent={false}

            onRequestClose={
                onCerrar
            }
        >

            <View style={styles.screen}>

                <View style={styles.header}>

                    <Pressable
                        onPress={
                            onCerrar
                        }
                    >

                        <Text style={styles.cancelText}>
                            ← Cancelar
                        </Text>

                    </Pressable>


                    <Text style={styles.headerTitle}>
                        {gasto
                            ? "Editar gasto"
                            : "Registrar gasto"}
                    </Text>


                    <View style={{ width: 50 }} />

                </View>


                <ScrollView
                    contentContainerStyle={
                        styles.content
                    }

                    keyboardShouldPersistTaps="handled"
                >

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

                        <Text>⌄</Text>

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

                                            actualizar(
                                                "vehiculoId",
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
                                                styles.dropdownText
                                            }
                                        >
                                            {nombreVehiculo(
                                                vehiculo
                                            )}
                                        </Text>

                                    </Pressable>
                                )
                            )}

                        </View>
                    )}


                    <Campo
                        label="ID de categoría * (No hay modulo construido)"

                        value={
                            formulario.categoriaId
                        }

                        onChangeText={(valor) =>
                            actualizar(
                                "categoriaId",
                                valor.replace(
                                    /[^0-9]/g,
                                    ""
                                )
                            )
                        }

                        keyboardType="numeric"

                        placeholder="Ej. 1"
                    />


                    <Text style={styles.label}>
                        Monto *
                    </Text>


                    <View style={styles.moneyBox}>

                        <Text style={styles.currency}>
                            {formulario.moneda}
                        </Text>

                        <TextInput
                            style={styles.moneyInput}

                            value={
                                formulario.monto
                            }

                            onChangeText={(valor) =>
                                actualizar(
                                    "monto",
                                    valor
                                )
                            }

                            keyboardType="decimal-pad"

                            placeholder="0.00"

                            placeholderTextColor="#94A3B8"
                        />

                    </View>


                    <Text style={styles.label}>
                        Fecha *
                    </Text>

                    <DatePickerField
                        value={formulario.fecha}
                        onChange={(fecha) =>
                            actualizar(
                                "fecha",
                                fecha
                            )
                        }
                        placeholder="Seleccionar fecha"
                    />


                    <Campo
                        label="N.º de comprobante / factura"

                        value={
                            formulario.numeroComprobante
                        }

                        onChangeText={(valor) =>
                            actualizar(
                                "numeroComprobante",
                                valor
                            )
                        }

                        placeholder="Ej. B-00481"
                    />


                    <Campo
                        label="Proveedor"

                        value={
                            formulario.proveedor
                        }

                        onChangeText={(valor) =>
                            actualizar(
                                "proveedor",
                                valor
                            )
                        }

                        placeholder="Ej. Taller Central Toyota"
                    />


                    <Text style={styles.label}>
                        Descripción / observaciones
                    </Text>


                    <TextInput
                        style={[
                            styles.input,
                            styles.textArea
                        ]}

                        value={
                            formulario.descripcion
                        }

                        onChangeText={(valor) =>
                            actualizar(
                                "descripcion",
                                valor
                            )
                        }

                        placeholder="Agrega detalles sobre el gasto"

                        placeholderTextColor="#94A3B8"

                        multiline
                    />


                    {error ? (

                        <View style={styles.errorBox}>

                            <Text style={styles.errorText}>
                                {error}
                            </Text>

                        </View>

                    ) : null}


                    <Pressable
                        style={[
                            styles.saveButton,

                            guardando &&
                            styles.disabled
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

                            <Text style={styles.saveText}>
                                {gasto
                                    ? "Guardar cambios"
                                    : "Registrar gasto"}
                            </Text>
                        )}

                    </Pressable>


                    <Pressable
                        style={styles.bottomCancel}

                        onPress={
                            onCerrar
                        }
                    >

                        <Text style={styles.bottomCancelText}>
                            Cancelar
                        </Text>

                    </Pressable>

                </ScrollView>

            </View>

        </Modal>
    );
}


function Campo({
    label,
    ...props
}) {

    return (

        <View style={styles.field}>

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

    screen: {
        flex: 1,

        backgroundColor: "#F5F7FB"
    },


    header: {
        minHeight: 62,

        paddingHorizontal: 16,

        backgroundColor: "#FFFFFF",

        borderBottomWidth: 1,

        borderBottomColor: "#E8ECF2",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between"
    },


    cancelText: {
        color: "#2563EB",

        fontSize: 10,

        fontWeight: "700"
    },


    headerTitle: {
        color: "#172033",

        fontSize: 14,

        fontWeight: "900"
    },


    content: {
        padding: 16,

        paddingBottom: 35
    },


    field: {
        marginTop: 13
    },


    label: {
        color: "#334155",

        fontSize: 10,

        fontWeight: "800",

        marginBottom: 6
    },


    input: {
        minHeight: 46,

        borderRadius: 9,

        borderWidth: 1,

        borderColor: "#E0E5EC",

        paddingHorizontal: 12,

        backgroundColor: "#FFFFFF",

        color: "#172033",

        fontSize: 11
    },


    textArea: {
        minHeight: 95,

        paddingTop: 12,

        textAlignVertical: "top"
    },


    select: {
        minHeight: 46,

        borderWidth: 1,

        borderColor: "#E0E5EC",

        borderRadius: 9,

        backgroundColor: "#FFFFFF",

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


    dropdown: {
        marginTop: 5,

        backgroundColor: "#FFFFFF",

        borderWidth: 1,

        borderColor: "#E0E5EC",

        borderRadius: 9,

        overflow: "hidden"
    },


    dropdownItem: {
        padding: 12,

        borderBottomWidth: 1,

        borderBottomColor: "#EEF1F5"
    },


    dropdownText: {
        color: "#334155",

        fontSize: 10
    },


    moneyBox: {
        minHeight: 55,

        backgroundColor: "#FFFFFF",

        borderRadius: 10,

        borderWidth: 1,

        borderColor: "#E0E5EC",

        paddingHorizontal: 12,

        flexDirection: "row",

        alignItems: "center"
    },


    currency: {
        color: "#0284C7",

        fontSize: 13,

        fontWeight: "900",

        marginRight: 15
    },


    moneyInput: {
        flex: 1,

        minHeight: 53,

        color: "#172033",

        fontSize: 17,

        fontWeight: "900"
    },


    errorBox: {
        marginTop: 13,

        padding: 10,

        borderRadius: 8,

        backgroundColor: "#FEE2E2"
    },


    errorText: {
        color: "#B91C1C",

        fontSize: 10
    },


    saveButton: {
        minHeight: 48,

        marginTop: 20,

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


    bottomCancel: {
        minHeight: 42,

        marginTop: 8,

        borderRadius: 8,

        backgroundColor: "#FFFFFF",

        alignItems: "center",

        justifyContent: "center"
    },


    bottomCancelText: {
        color: "#475569",

        fontSize: 9,

        fontWeight: "700"
    },


    disabled: {
        opacity: 0.6
    }
});