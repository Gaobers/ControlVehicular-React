import React, {useState} from "react";

import {
    ActivityIndicator,
    Pressable,
    Text,
    View
} from "react-native";

import AppHeader
    from "./common/AppHeader";

import ScreenContainer
    from "./common/ScreenContainer";

import VehiculoCard
    from "./vehiculos/VehiculoCard";

import VehiculoFiltros
    from "./vehiculos/VehiculoFiltros";

import VehiculoFormulario
    from "./vehiculos/VehiculoFormulario";

import VehiculoDetalle
    from "./vehiculos/VehiculoDetalle";

import {
    styles
} from "./vehiculos/vehiculosStyles";

import {
    useVehiculos
} from "../hooks/useVehiculos";

import RegistroKilometrajeVehiculo
    from "./kilometrajes/RegistroKilometrajeVehiculo";


export default function VehiculosScreen({
    onVolver,
    onLogout
}) {

    const {
        vehiculosFiltrados,
        resumen,

        cargando,
        guardando,
        mensaje,

        busqueda,
        setBusqueda,

        filtroEstado,
        setFiltroEstado,

        vehiculoSeleccionado,
        vehiculoEditando,

        formularioVisible,
        detalleVisible,

        cargarVehiculos,
        abrirNuevo,
        abrirDetalle,
        cerrarDetalle,
        abrirEdicion,
        cerrarFormulario,
        guardarVehiculo,
        confirmarArchivar,
        confirmarReactivar
    } = useVehiculos();

    const [
    vehiculoKilometraje,
    setVehiculoKilometraje
] = useState(null);

const abrirRegistroKilometraje = (
    vehiculo
) => {

    cerrarDetalle();

    setVehiculoKilometraje(
        vehiculo
    );
};


const volverDesdeKilometraje = () => {

    const vehiculo =
        vehiculoKilometraje;


    setVehiculoKilometraje(
        null
    );


    if (vehiculo) {

        abrirDetalle(
            vehiculo
        );
    }
};


const kilometrajeRegistrado =
    async () => {

        setVehiculoKilometraje(
            null
        );


        await cargarVehiculos();
    };


    if (vehiculoKilometraje) {

    return (

        <RegistroKilometrajeVehiculo

            vehiculo={
                vehiculoKilometraje
            }

            onVolver={
                volverDesdeKilometraje
            }

            onRegistrado={
                kilometrajeRegistrado
            }

            onLogout={
                onLogout
            }

        />
    );
}


    return (
        <View style={styles.screen}>

            <ScreenContainer>

                <AppHeader
                    subtitle="Gestión de vehículos"
                    onLogout={onLogout}
                />


                <View style={styles.moduleHeader}>

                    <View style={styles.moduleHeaderTop}>

                        <Pressable
                            style={styles.backButton}
                            onPress={onVolver}
                        >
                            <Text style={styles.backButtonText}>
                                ← Inicio
                            </Text>
                        </Pressable>


                        <Pressable
                            style={styles.registerButton}
                            onPress={abrirNuevo}
                        >
                            <Text style={styles.registerButtonText}>
                                + Registrar
                            </Text>
                        </Pressable>

                    </View>


                    <Text style={styles.title}>
                        Vehículos
                    </Text>

                    <Text style={styles.subtitle}>
                        {resumen.total}{" "}
                        {resumen.total === 1
                            ? "vehículo registrado"
                            : "vehículos registrados"}
                    </Text>

                </View>


                {mensaje && (

                    <View
                        style={[
                            styles.messageBox,

                            mensaje.tipo === "error"
                                ? styles.messageError
                                : styles.messageSuccess
                        ]}
                    >
                        <Text
                            style={[
                                styles.messageText,

                                mensaje.tipo === "error"
                                    ? styles.messageErrorText
                                    : styles.messageSuccessText
                            ]}
                        >
                            {mensaje.texto}
                        </Text>
                    </View>
                )}


                <VehiculoFiltros
                    busqueda={busqueda}
                    onBusquedaChange={setBusqueda}

                    filtroEstado={filtroEstado}
                    onFiltroEstadoChange={setFiltroEstado}

                    total={resumen.total}
                    activos={resumen.activos}
                    archivados={resumen.archivados}
                />





                <View style={styles.listHeader}>

                    <View>
                        <Text style={styles.listTitle}>
                            Listado
                        </Text>

                    <Text style={styles.listSubtitle}>
                        {vehiculosFiltrados.length}{" "}
                        {vehiculosFiltrados.length === 1
                            ? "resultado"
                            : "resultados"}
                    </Text>
                    </View>


                    <Pressable
                        style={styles.refreshButton}
                        onPress={cargarVehiculos}
                    >
                        <Text style={styles.refreshText}>
                            Actualizar
                        </Text>
                    </Pressable>

                </View>


                {cargando ? (

                    <View style={styles.loadingBox}>

                        <ActivityIndicator
                            size="large"
                            color="#0D3559"
                        />

                        <Text style={styles.loadingText}>
                            Cargando vehículos...
                        </Text>

                    </View>

                ) : vehiculosFiltrados.length === 0 ? (

                    <View style={styles.emptyCard}>

                        <Text style={styles.emptyTitle}>
                            No se encontraron vehículos
                        </Text>

                        <Text style={styles.emptyText}>
                            Cambia los filtros o registra un nuevo vehículo.
                        </Text>

                        <Pressable
                            style={styles.emptyButton}
                            onPress={abrirNuevo}
                        >
                            <Text style={styles.emptyButtonText}>
                                + Registrar vehículo
                            </Text>
                        </Pressable>

                    </View>

                ) : (

                    vehiculosFiltrados.map(
                        (vehiculo) => (

                            <VehiculoCard
                                key={vehiculo.id}
                                vehiculo={vehiculo}
                                onDetalle={abrirDetalle}
                            />
                        )
                    )
                )}

            </ScreenContainer>


            <VehiculoFormulario
                visible={formularioVisible}
                vehiculo={vehiculoEditando}
                guardando={guardando}
                onCerrar={cerrarFormulario}
                onGuardar={guardarVehiculo}
            />


<VehiculoDetalle

    visible={
        detalleVisible
    }

    vehiculo={
        vehiculoSeleccionado
    }

    onCerrar={
        cerrarDetalle
    }

    onEditar={
        abrirEdicion
    }

    onDesactivar={
        confirmarArchivar
    }

    onReactivar={
        confirmarReactivar
    }

    onRegistrarKilometraje={
        abrirRegistroKilometraje
    }
/>

        </View>
    );
}
