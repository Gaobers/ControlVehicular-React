import { useEffect, useMemo, useState } from "react";
import { Alert, Platform } from "react-native";
import { vehiculoService } from "../services/vehiculoService";

export function useVehiculos() {
    const [vehiculos, setVehiculos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("TODOS");

    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
    const [vehiculoEditando, setVehiculoEditando] = useState(null);

    const [formularioVisible, setFormularioVisible] = useState(false);
    const [detalleVisible, setDetalleVisible] = useState(false);

    const [mensaje, setMensaje] = useState(null);

    useEffect(() => {
        cargarVehiculos();
    }, []);

    const cargarVehiculos = async () => {
        try {
            setCargando(true);

            const respuesta = await vehiculoService.obtenerTodos();

            setVehiculos(
                Array.isArray(respuesta)
                    ? respuesta
                    : []
            );
        } catch (error) {
            if (error.response?.status === 404) {
                setVehiculos([]);
                return;
            }

            mostrarError(
                error,
                "No se pudieron cargar los vehículos."
            );
        } finally {
            setCargando(false);
        }
    };

    const mostrarExito = (texto) => {
        setMensaje({
            tipo: "exito",
            texto
        });
    };

    const mostrarError = (error, predeterminado) => {
        const status = error?.response?.status;

        let texto =
            error?.response?.data?.mensaje ||
            error?.response?.data?.message ||
            predeterminado;

        if (typeof error?.response?.data === "string") {
            texto = error.response.data;
        }

        if (status === 401) {
            texto = "Tu sesión no es válida.";
        }

        if (status === 403) {
            texto = "No tienes autorización para realizar esta operación.";
        }

        setMensaje({
            tipo: "error",
            texto
        });
    };

    const abrirNuevo = () => {
        setVehiculoEditando(null);
        setMensaje(null);
        setFormularioVisible(true);
    };

    const abrirDetalle = (vehiculo) => {
        setVehiculoSeleccionado(vehiculo);
        setDetalleVisible(true);
    };

    const cerrarDetalle = () => {
        setDetalleVisible(false);
        setVehiculoSeleccionado(null);
    };

    const abrirEdicion = (vehiculo) => {
        setDetalleVisible(false);
        setVehiculoEditando(vehiculo);
        setFormularioVisible(true);
    };

    const cerrarFormulario = () => {
        if (guardando) return;

        setFormularioVisible(false);
        setVehiculoEditando(null);
    };

    const guardarVehiculo = async (datos) => {
        try {
            setGuardando(true);
            setMensaje(null);

            if (vehiculoEditando) {
                await vehiculoService.actualizar(
                    vehiculoEditando.id,
                    {
                        ...datos,
                        estado:
                            vehiculoEditando.estado ||
                            "ACTIVO"
                    }
                );

                mostrarExito(
                    "Vehículo actualizado correctamente."
                );
            } else {
                await vehiculoService.crear(datos);

                mostrarExito(
                    "Vehículo registrado correctamente."
                );
            }

            setFormularioVisible(false);
            setVehiculoEditando(null);

            await cargarVehiculos();
        } catch (error) {
            mostrarError(
                error,
                vehiculoEditando
                    ? "No se pudo actualizar el vehículo."
                    : "No se pudo registrar el vehículo."
            );
        } finally {
            setGuardando(false);
        }
    };

    const archivar = async (vehiculo) => {
        try {
            await vehiculoService.eliminar(vehiculo.id);

            cerrarDetalle();

            mostrarExito(
                "Vehículo archivado correctamente."
            );

            await cargarVehiculos();
        } catch (error) {
            mostrarError(
                error,
                "No se pudo archivar el vehículo."
            );
        }
    };

    const confirmarArchivar = (vehiculo) => {
        const texto =
            `¿Deseas archivar ${vehiculo.marca} ${vehiculo.modelo}?`;

        if (Platform.OS === "web") {
            if (globalThis.confirm?.(texto)) {
                archivar(vehiculo);
            }

            return;
        }

        Alert.alert(
            "Archivar vehículo",
            texto,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Archivar",
                    style: "destructive",
                    onPress: () => archivar(vehiculo)
                }
            ]
        );
    };

    const reactivar = async (vehiculo) => {
        try {
            await vehiculoService.actualizar(
                vehiculo.id,
                {
                    propietarioId: vehiculo.propietarioId,
                    marca: vehiculo.marca,
                    modelo: vehiculo.modelo,
                    anio: vehiculo.anio,
                    placa: vehiculo.placa,
                    color: vehiculo.color ?? null,
                    kilometrajeActual:
                        Number(
                            vehiculo.kilometrajeActual || 0
                        ),
                    vin: vehiculo.vin ?? null,
                    motor: vehiculo.motor ?? null,
                    estado: "ACTIVO"
                }
            );

            cerrarDetalle();

            mostrarExito(
                "Vehículo reactivado correctamente."
            );

            await cargarVehiculos();
        } catch (error) {
            mostrarError(
                error,
                "No se pudo reactivar el vehículo."
            );
        }
    };

    const confirmarReactivar = (vehiculo) => {
        const texto =
            `¿Deseas reactivar ${vehiculo.marca} ${vehiculo.modelo}?`;

        if (Platform.OS === "web") {
            if (globalThis.confirm?.(texto)) {
                reactivar(vehiculo);
            }

            return;
        }

        Alert.alert(
            "Reactivar vehículo",
            texto,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Reactivar",
                    onPress: () => reactivar(vehiculo)
                }
            ]
        );
    };

    const vehiculosFiltrados = useMemo(() => {
        const texto = busqueda
            .trim()
            .toLowerCase();

        return vehiculos.filter((vehiculo) => {
            if (
                filtroEstado !== "TODOS" &&
                vehiculo.estado !== filtroEstado
            ) {
                return false;
            }

            if (!texto) return true;

            const contenido = [
                vehiculo.marca,
                vehiculo.modelo,
                vehiculo.placa,
                vehiculo.color,
                vehiculo.propietarioId
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return contenido.includes(texto);
        });
    }, [
        vehiculos,
        busqueda,
        filtroEstado
    ]);

    const resumen = useMemo(() => ({
        total: vehiculos.length,

        activos:
            vehiculos.filter(
                (v) => v.estado === "ACTIVO"
            ).length,

        archivados:
            vehiculos.filter(
                (v) => v.estado === "ARCHIVADO"
            ).length
    }), [vehiculos]);

    return {
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
    };
}