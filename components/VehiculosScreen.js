import React, {
    useEffect,
    useState
} from "react";

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    ScrollView,
    ActivityIndicator,
    Alert,
    useWindowDimensions
} from "react-native";

import {
    vehiculoService
} from "../services/vehiculoService";


export default function VehiculosScreen({
    onVolver,
    onLogout
}) {

    const [vehiculos, setVehiculos] =
        useState([]);

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [error, setError] =
        useState("");

    const [mensaje, setMensaje] =
        useState("");


    const [propietarioId, setPropietarioId] =
        useState("");

    const [marca, setMarca] =
        useState("");

    const [modelo, setModelo] =
        useState("");

    const [anio, setAnio] =
        useState("");

    const [placa, setPlaca] =
        useState("");

    const [color, setColor] =
        useState("");

    const [
        kilometrajeActual,
        setKilometrajeActual
    ] = useState("");

    const [vin, setVin] =
        useState("");

    const [motor, setMotor] =
        useState("");

    const [editandoId, setEditandoId] =
        useState(null);

    const [estado, setEstado] =
        useState("ACTIVO");


    const { width } =
        useWindowDimensions();

    const esMovil =
        width < 650;


    useEffect(() => {

        cargarVehiculos();

    }, []);


    const obtenerMensajeError = (error) => {

        return (
            error?.response?.data?.mensaje ||
            error?.response?.data?.message ||
            error?.response?.data ||
            error?.message ||
            "Ocurrió un error inesperado"
        );
    };


    const cargarVehiculos = async () => {

        try {

            setCargando(true);
            setError("");

            const datos =
                await vehiculoService.obtenerTodos();

            setVehiculos(datos);

        } catch (error) {

            console.error(
                "Error al cargar vehículos:",
                error
            );

            setError(
                obtenerMensajeError(error)
            );

        } finally {

            setCargando(false);
        }
    };


    const limpiarFormulario = () => {

        setPropietarioId("");
        setMarca("");
        setModelo("");
        setAnio("");
        setPlaca("");
        setColor("");
        setKilometrajeActual("");
        setVin("");
        setMotor("");

        setEstado("ACTIVO");

        setEditandoId(null);
    };


    const validarFormulario = () => {

        if (
            !marca.trim() ||
            !modelo.trim() ||
            !anio.trim() ||
            !placa.trim() ||
            !kilometrajeActual.trim()
        ) {

            setError(
                "Marca, modelo, año, placa y kilometraje son obligatorios."
            );

            return false;
        }


        if (
            editandoId === null &&
            !propietarioId.trim()
        ) {

            setError(
                "El ID del propietario es obligatorio."
            );

            return false;
        }


        const anioNumero =
            Number(anio);

        if (
            !Number.isInteger(anioNumero) ||
            anioNumero < 1900 ||
            anioNumero > 2200
        ) {

            setError(
                "El año debe estar entre 1900 y 2200."
            );

            return false;
        }


        const kilometraje =
            Number(kilometrajeActual);

        if (
            Number.isNaN(kilometraje) ||
            kilometraje < 0
        ) {

            setError(
                "El kilometraje debe ser mayor o igual a cero."
            );

            return false;
        }


        return true;
    };


    const guardarVehiculo = async () => {

        setError("");
        setMensaje("");


        if (!validarFormulario()) {
            return;
        }


        try {

            setGuardando(true);


            /*
             * EDITAR
             */
            if (editandoId !== null) {

                const vehiculoModificado = {

                    marca:
                        marca.trim(),

                    modelo:
                        modelo.trim(),

                    anio:
                        Number(anio),

                    placa:
                        placa.trim().toUpperCase(),

                    color:
                        color.trim() || null,

                    kilometrajeActual:
                        Number(kilometrajeActual),

                    vin:
                        vin.trim()
                            ? vin.trim().toUpperCase()
                            : null,

                    motor:
                        motor.trim() || null,

                    estado
                };


                await vehiculoService.actualizar(
                    editandoId,
                    vehiculoModificado
                );


                setMensaje(
                    "Vehículo actualizado correctamente."
                );

            }


            /*
             * CREAR
             */
            else {

                const nuevoVehiculo = {

                    propietarioId:
                        Number(propietarioId),

                    marca:
                        marca.trim(),

                    modelo:
                        modelo.trim(),

                    anio:
                        Number(anio),

                    placa:
                        placa.trim().toUpperCase(),

                    color:
                        color.trim() || null,

                    kilometrajeActual:
                        Number(kilometrajeActual),

                    vin:
                        vin.trim()
                            ? vin.trim().toUpperCase()
                            : null,

                    motor:
                        motor.trim() || null
                };


                await vehiculoService.crear(
                    nuevoVehiculo
                );


                setMensaje(
                    "Vehículo registrado correctamente."
                );
            }


            limpiarFormulario();

            await cargarVehiculos();


        } catch (error) {

            console.error(
                "Error al guardar vehículo:",
                error
            );

            setError(
                obtenerMensajeError(error)
            );

        } finally {

            setGuardando(false);
        }
    };


    const seleccionarParaEditar = (
        vehiculo
    ) => {

        setError("");
        setMensaje("");

        setEditandoId(
            vehiculo.id
        );

        setPropietarioId(
            String(
                vehiculo.propietarioId
            )
        );

        setMarca(
            vehiculo.marca ?? ""
        );

        setModelo(
            vehiculo.modelo ?? ""
        );

        setAnio(
            String(
                vehiculo.anio ?? ""
            )
        );

        setPlaca(
            vehiculo.placa ?? ""
        );

        setColor(
            vehiculo.color ?? ""
        );

        setKilometrajeActual(
            String(
                vehiculo.kilometrajeActual ?? ""
            )
        );

        setVin(
            vehiculo.vin ?? ""
        );

        setMotor(
            vehiculo.motor ?? ""
        );

        setEstado(
            vehiculo.estado ?? "ACTIVO"
        );
    };


    const cancelarEdicion = () => {

        limpiarFormulario();

        setError("");
        setMensaje("");
    };


    const archivarVehiculo = (id) => {

        Alert.alert(
            "Archivar vehículo",
            "¿Deseas archivar este vehículo?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Archivar",
                    style: "destructive",

                    onPress: async () => {

                        try {

                            setError("");
                            setMensaje("");

                            await vehiculoService.eliminar(
                                id
                            );

                            setMensaje(
                                "Vehículo archivado correctamente."
                            );

                            await cargarVehiculos();

                        } catch (error) {

                            console.error(
                                "Error al archivar:",
                                error
                            );

                            setError(
                                obtenerMensajeError(error)
                            );
                        }
                    }
                }
            ]
        );
    };


    const activarVehiculo =
    async (vehiculo) => {

        try {

            setError("");
            setMensaje("");

            const vehiculoModificado = {

                marca:
                    vehiculo.marca,

                modelo:
                    vehiculo.modelo,

                anio:
                    vehiculo.anio,

                placa:
                    vehiculo.placa,

                color:
                    vehiculo.color,

                kilometrajeActual:
                    vehiculo.kilometrajeActual,

                vin:
                    vehiculo.vin,

                motor:
                    vehiculo.motor,

                estado: "ACTIVO"
            };


            await vehiculoService.actualizar(
                vehiculo.id,
                vehiculoModificado
            );


            setMensaje(
                "Vehículo activado correctamente."
            );


            await cargarVehiculos();

        } catch (error) {

            console.error(
                "Error al activar vehículo:",
                error
            );

            setError(
                obtenerMensajeError(error)
            );
        }
    };


const cerrarSesion = async () => {

    try {

        if (onLogout) {

            await onLogout();
        }

    } catch (error) {

        console.error(
            "Error al cerrar sesión:",
            error
        );
    }
};


const cantidadActivos =
    vehiculos.filter(
        vehiculo =>
            vehiculo.estado === "ACTIVO"
    ).length;


return (

    <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
    >

        <View style={styles.container}>


            {/* ENCABEZADO */}

            <View style={styles.header}>

                <View style={styles.headerTop}>

                    <View>

                        <Text style={styles.headerTitle}>
                            CONTROL VEHICULAR
                        </Text>

                        <Text style={styles.headerSubtitle}>
                            Administración de vehículos
                        </Text>

                    </View>


                    <View style={styles.headerActions}>

                        <Pressable
                            style={({ pressed }) => [
                                styles.backButton,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={onVolver}
                        >
                            <Text style={styles.backButtonText}>
                                {esMovil
                                    ? "←"
                                    : "← MENÚ"}
                            </Text>
                        </Pressable>


                        <Pressable
                            style={({ pressed }) => [
                                styles.logoutButton,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={cerrarSesion}
                        >
                            <Text style={styles.logoutText}>
                                {esMovil
                                    ? "SALIR"
                                    : "CERRAR SESIÓN"}
                            </Text>
                        </Pressable>

                    </View>

                </View>

            </View>


                {/* FORMULARIO */}

                <View style={styles.card}>

                    <Text style={styles.title}>

                        {editandoId !== null
                            ? "Editar vehículo"
                            : "Registrar vehículo"}

                    </Text>


                    {editandoId === null && (

                        <>
                            <Text style={styles.label}>
                                ID del propietario
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Ej. 1"
                                placeholderTextColor="#94A3B8"
                                value={propietarioId}
                                onChangeText={
                                    setPropietarioId
                                }
                                keyboardType="numeric"
                            />
                        </>

                    )}


                    <View
                        style={[
                            styles.row,
                            esMovil &&
                            styles.rowMobile
                        ]}
                    >

                        <View style={styles.field}>

                            <Text style={styles.label}>
                                Marca
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Ej. Toyota"
                                placeholderTextColor="#94A3B8"
                                value={marca}
                                onChangeText={setMarca}
                            />

                        </View>


                        <View style={styles.field}>

                            <Text style={styles.label}>
                                Modelo
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Ej. Corolla"
                                placeholderTextColor="#94A3B8"
                                value={modelo}
                                onChangeText={setModelo}
                            />

                        </View>

                    </View>


                    <View
                        style={[
                            styles.row,
                            esMovil &&
                            styles.rowMobile
                        ]}
                    >

                        <View style={styles.field}>

                            <Text style={styles.label}>
                                Año
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Ej. 2022"
                                placeholderTextColor="#94A3B8"
                                value={anio}
                                onChangeText={setAnio}
                                keyboardType="numeric"
                                maxLength={4}
                            />

                        </View>


                        <View style={styles.field}>

                            <Text style={styles.label}>
                                Número de placa
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Ej. P123456"
                                placeholderTextColor="#94A3B8"
                                value={placa}
                                onChangeText={setPlaca}
                                autoCapitalize="characters"
                            />

                        </View>

                    </View>


                    <View
                        style={[
                            styles.row,
                            esMovil &&
                            styles.rowMobile
                        ]}
                    >

                        <View style={styles.field}>

                            <Text style={styles.label}>
                                Color
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Ej. Gris"
                                placeholderTextColor="#94A3B8"
                                value={color}
                                onChangeText={setColor}
                            />

                        </View>


                        <View style={styles.field}>

                            <Text style={styles.label}>
                                Kilometraje actual
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Ej. 35000"
                                placeholderTextColor="#94A3B8"
                                value={kilometrajeActual}
                                onChangeText={
                                    setKilometrajeActual
                                }
                                keyboardType="numeric"
                            />

                        </View>

                    </View>


                    <Text style={styles.label}>
                        VIN
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Ej. JTDBR32E720123456"
                        placeholderTextColor="#94A3B8"
                        value={vin}
                        onChangeText={setVin}
                        autoCapitalize="characters"
                    />


                    <Text style={styles.label}>
                        Motor
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Ej. 1.8 gasolina"
                        placeholderTextColor="#94A3B8"
                        value={motor}
                        onChangeText={setMotor}
                    />


                    {editandoId !== null && (

                        <View style={styles.estadoBox}>

                            <Text style={styles.estadoLabel}>
                                Estado actual
                            </Text>

                            <Text
                                style={[
                                    styles.estadoValue,

                                    estado === "ACTIVO"
                                        ? styles.estadoActivo
                                        : styles.estadoArchivado
                                ]}
                            >
                                {estado}
                            </Text>

                        </View>

                    )}


                    {error ? (

                        <View style={styles.errorBox}>

                            <Text style={styles.errorText}>
                                {error}
                            </Text>

                        </View>

                    ) : null}


                    {mensaje ? (

                        <View style={styles.successBox}>

                            <Text style={styles.successText}>
                                {mensaje}
                            </Text>

                        </View>

                    ) : null}


                    <Pressable
                        disabled={guardando}
                        style={({ pressed }) => [

                            styles.saveButton,

                            pressed &&
                            styles.buttonPressed,

                            guardando &&
                            styles.disabledButton

                        ]}
                        onPress={guardarVehiculo}
                    >

                        {guardando ? (

                            <ActivityIndicator
                                size="small"
                                color="#ffffff"
                            />

                        ) : (

                            <Text style={styles.buttonText}>

                                {editandoId !== null
                                    ? "ACTUALIZAR VEHÍCULO"
                                    : "REGISTRAR VEHÍCULO"}

                            </Text>

                        )}

                    </Pressable>


                    {editandoId !== null && (

                        <Pressable
                            style={({ pressed }) => [

                                styles.cancelButton,

                                pressed &&
                                styles.buttonPressed

                            ]}
                            onPress={
                                cancelarEdicion
                            }
                        >

                            <Text style={styles.cancelText}>
                                CANCELAR EDICIÓN
                            </Text>

                        </Pressable>

                    )}

                </View>


                {/* RESUMEN */}

                <View style={styles.summaryRow}>

                    <View style={styles.summaryCard}>

                        <Text style={styles.summaryNumber}>
                            {vehiculos.length}
                        </Text>

                        <Text style={styles.summaryLabel}>
                            Registrados
                        </Text>

                    </View>


                    <View style={styles.summaryCard}>

                        <Text style={styles.summaryNumber}>
                            {cantidadActivos}
                        </Text>

                        <Text style={styles.summaryLabel}>
                            Activos
                        </Text>

                    </View>


                    <View style={styles.summaryCard}>

                        <Text style={styles.summaryNumber}>
                            {
                                vehiculos.length -
                                cantidadActivos
                            }
                        </Text>

                        <Text style={styles.summaryLabel}>
                            Archivados
                        </Text>

                    </View>

                </View>


                {/* LISTADO */}

                <View style={styles.listHeader}>

                    <Text style={styles.listTitle}>
                        Vehículos registrados
                    </Text>

                    <View style={styles.badge}>

                        <Text style={styles.badgeText}>
                            {vehiculos.length}
                        </Text>

                    </View>

                </View>


                {vehiculos.length === 0 ? (

                    <View style={styles.emptyBox}>

                        <Text style={styles.emptyTitle}>
                            No hay vehículos registrados
                        </Text>

                        <Text style={styles.emptyText}>
                            Los vehículos que registres aparecerán aquí.
                        </Text>

                    </View>

                ) : (

                    vehiculos.map(
                        (vehiculo) => (

                            <View
                                key={vehiculo.id}
                                style={[
                                    styles.vehicleCard,

                                    vehiculo.estado === "ARCHIVADO" &&
                                    styles.vehicleCardArchived
                                ]}
                            >

                                <View style={styles.vehicleHeader}>

                                    <View>

                                        <Text style={styles.vehiclePlate}>
                                            {vehiculo.placa}
                                        </Text>

                                        <Text style={styles.vehicleName}>
                                            {vehiculo.marca} {vehiculo.modelo}
                                        </Text>

                                    </View>


                                    <View
                                        style={[
                                            styles.statusBadge,

                                            vehiculo.estado === "ACTIVO"
                                                ? styles.statusActive
                                                : styles.statusArchived
                                        ]}
                                    >

                                        <Text
                                            style={[
                                                styles.statusText,

                                                vehiculo.estado === "ACTIVO"
                                                    ? styles.statusTextActive
                                                    : styles.statusTextArchived
                                            ]}
                                        >
                                            {vehiculo.estado}
                                        </Text>

                                    </View>

                                </View>


                                <Text style={styles.vehicleDetail}>
                                    Año: {vehiculo.anio}
                                </Text>

                                <Text style={styles.vehicleDetail}>
                                    Color: {vehiculo.color || "No especificado"}
                                </Text>

                                <Text style={styles.vehicleDetail}>
                                    Kilometraje: {vehiculo.kilometrajeActual}
                                </Text>

                                <Text style={styles.vehicleDetail}>
                                    Propietario: #{vehiculo.propietarioId}
                                </Text>

                                <Text style={styles.vehicleDetail}>
                                    VIN: {vehiculo.vin || "No especificado"}
                                </Text>

                                <Text style={styles.vehicleDetail}>
                                    Motor: {vehiculo.motor || "No especificado"}
                                </Text>


                                <View style={styles.actions}>

                                    <Pressable
                                        style={({ pressed }) => [

                                            styles.actionButton,
                                            styles.editButton,

                                            pressed &&
                                            styles.buttonPressed

                                        ]}
                                        onPress={() =>
                                            seleccionarParaEditar(
                                                vehiculo
                                            )
                                        }
                                    >

                                        <Text style={styles.actionText}>
                                            EDITAR
                                        </Text>

                                    </Pressable>


                                    {vehiculo.estado === "ACTIVO" ? (

                                        <Pressable
                                            style={({ pressed }) => [

                                                styles.actionButton,
                                                styles.archiveButton,

                                                pressed &&
                                                styles.buttonPressed

                                            ]}
                                            onPress={() =>
                                                archivarVehiculo(
                                                    vehiculo.id
                                                )
                                            }
                                        >

                                            <Text style={styles.actionText}>
                                                ARCHIVAR
                                            </Text>

                                        </Pressable>

                                    ) : (

                                        <Pressable
                                            style={({ pressed }) => [

                                                styles.actionButton,
                                                styles.activateButton,

                                                pressed &&
                                                styles.buttonPressed

                                            ]}
                                            onPress={() =>
                                                activarVehiculo(
                                                    vehiculo
                                                )
                                            }
                                        >

                                            <Text style={styles.actionText}>
                                                ACTIVAR
                                            </Text>

                                        </Pressable>

                                    )}

                                </View>

                            </View>

                        )
                    )

                )}

            </View>

        </ScrollView>
    );
}


const styles = StyleSheet.create({

    screen: {
        flex: 1,
        backgroundColor: "#eef2f7"
    },

    content: {
        paddingBottom: 40
    },

    container: {
        width: "100%",
        maxWidth: 1050,
        alignSelf: "center",
        padding: 18
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eef2f7"
    },

    loadingText: {
        marginTop: 12,
        color: "#64748b"
    },

   header: {
    backgroundColor: "#0B1F3A",
    padding: 20,
    borderRadius: 18,
    marginBottom: 20
},

headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF"
},

headerSubtitle: {
    fontSize: 12,
    color: "#B8C7D9",
    marginTop: 5
},

headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
},

headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
},

backButton: {
    backgroundColor: "#ffffff",
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
},

backButtonText: {
    color: "#0B1F3A",
    fontSize: 10,
    fontWeight: "800"
},

logoutButton: {
    backgroundColor: "#17385f",
    borderWidth: 1,
    borderColor: "#345475",
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
},

logoutText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800"
},

    card: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 18,
        elevation: 4,
        marginBottom: 20
    },

    title: {
        fontSize: 21,
        fontWeight: "bold",
        color: "#0B1F3A",
        marginBottom: 22
    },

    row: {
        flexDirection: "row",
        gap: 12
    },

    rowMobile: {
        flexDirection: "column",
        gap: 0
    },

    field: {
        flex: 1
    },

    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#334155",
        marginBottom: 8
    },

    input: {
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 14,
        color: "#0F172A",
        marginBottom: 17
    },

    estadoBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#f8fafc"
    },

    estadoLabel: {
        color: "#64748b",
        fontWeight: "600"
    },

    estadoValue: {
        fontWeight: "800"
    },

    estadoActivo: {
        color: "#16a34a"
    },

    estadoArchivado: {
        color: "#64748b"
    },

    saveButton: {
        backgroundColor: "#2563EB",
        padding: 16,
        borderRadius: 12,
        alignItems: "center"
    },

    disabledButton: {
        opacity: 0.7
    },

    buttonPressed: {
        opacity: 0.82
    },

    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 13
    },

    cancelButton: {
        padding: 14,
        alignItems: "center",
        marginTop: 8
    },

    cancelText: {
        color: "#64748B",
        fontWeight: "bold"
    },

    errorBox: {
        backgroundColor: "#fff1f2",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12
    },

    errorText: {
        color: "#be123c",
        fontSize: 12
    },

    successBox: {
        backgroundColor: "#f0fdf4",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12
    },

    successText: {
        color: "#15803d",
        fontSize: 12
    },

    summaryRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20
    },

    summaryCard: {
        flex: 1,
        backgroundColor: "#ffffff",
        padding: 15,
        borderRadius: 12
    },

    summaryNumber: {
        color: "#0B1F3A",
        fontSize: 20,
        fontWeight: "900"
    },

    summaryLabel: {
        color: "#64748b",
        fontSize: 11,
        marginTop: 3
    },

    listHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15
    },

    listTitle: {
        fontSize: 21,
        fontWeight: "bold",
        color: "#0B1F3A"
    },

    badge: {
        backgroundColor: "#2563EB",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginLeft: 10
    },

    badgeText: {
        color: "#FFFFFF",
        fontWeight: "bold"
    },

    emptyBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 25,
        alignItems: "center"
    },

    emptyTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#334155"
    },

    emptyText: {
        fontSize: 14,
        color: "#64748B",
        marginTop: 10,
        textAlign: "center"
    },

    vehicleCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 18,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: "#2563EB",
        elevation: 3
    },

    vehicleCardArchived: {
        borderLeftColor: "#94a3b8"
    },

    vehicleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },

    vehiclePlate: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0B1F3A"
    },

    vehicleName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#334155",
        marginTop: 4
    },

    vehicleDetail: {
        fontSize: 13,
        color: "#64748B",
        marginTop: 4
    },

    statusBadge: {
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 20,
        alignSelf: "flex-start"
    },

    statusActive: {
        backgroundColor: "#dcfce7"
    },

    statusArchived: {
        backgroundColor: "#e2e8f0"
    },

    statusText: {
        fontSize: 9,
        fontWeight: "800"
    },

    statusTextActive: {
        color: "#15803d"
    },

    statusTextArchived: {
        color: "#475569"
    },

    actions: {
        flexDirection: "row",
        marginTop: 18,
        gap: 10
    },

    actionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 9,
        alignItems: "center"
    },

    editButton: {
        backgroundColor: "#2563EB"
    },

    archiveButton: {
        backgroundColor: "#DC2626"
    },

    activateButton: {
        backgroundColor: "#16a34a"
    },

    actionText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 12
    }

});