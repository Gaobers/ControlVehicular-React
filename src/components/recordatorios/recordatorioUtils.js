export function esActivo(valor) {

    if (
        valor === true ||
        valor === 1 ||
        valor === "true" ||
        valor === "Sí" ||
        valor === "Si"
    ) {
        return true;
    }

    if (
        valor === false ||
        valor === 0 ||
        valor === "false" ||
        valor === "No"
    ) {
        return false;
    }

    return true;
}


export function formatearKm(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return "Sin objetivo";
    }

    return `${Number(valor).toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 1
        }
    )} km`;
}


export function formatearFecha(fecha) {

    if (!fecha) {
        return "Sin fecha";
    }

    try {

        return new Date(
            `${fecha}T00:00:00`
        ).toLocaleDateString(
            "es-SV",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    } catch {

        return fecha;
    }
}


export function buscarMantenimiento(
    mantenimientos,
    id
) {

    return mantenimientos.find(
        (item) =>
            String(item.id) ===
            String(id)
    );
}


export function buscarVehiculo(
    vehiculos,
    id
) {

    return vehiculos.find(
        (item) =>
            String(item.id) ===
            String(id)
    );
}


export function obtenerNombreVehiculo(
    vehiculo
) {

    if (!vehiculo) {
        return "Vehículo no disponible";
    }

    return [
        vehiculo.marca,
        vehiculo.modelo,
        vehiculo.placa
            ? `• ${vehiculo.placa}`
            : ""
    ]
        .filter(Boolean)
        .join(" ");
}


export function calcularFechaRecordatorio(
    mantenimiento,
    recordatorio
) {

    if (!mantenimiento?.fechaObjetivo) {
        return null;
    }

    const fecha = new Date(
        `${mantenimiento.fechaObjetivo}T00:00:00`
    );

    const dias =
        Number(
            recordatorio?.diasAnticipacion ||
            0
        );

    fecha.setDate(
        fecha.getDate() - dias
    );

    return fecha;
}


export function calcularKmRecordatorio(
    mantenimiento,
    recordatorio
) {

    if (
        mantenimiento?.kilometrajeObjetivo ===
        null ||
        mantenimiento?.kilometrajeObjetivo ===
        undefined
    ) {
        return null;
    }

    return Math.max(
        0,

        Number(
            mantenimiento.kilometrajeObjetivo
        ) -
        Number(
            recordatorio?.kilometrosAnticipacion ||
            0
        )
    );
}


export function obtenerEstadoRecordatorio(
    recordatorio,
    mantenimiento,
    vehiculo
) {

    if (!esActivo(recordatorio?.activo)) {

        return {
            id: "INACTIVO",
            texto: "Inactivo",
            fondo: "#F1F5F9",
            color: "#64748B",
            borde: "#94A3B8"
        };
    }


    if (
        mantenimiento?.estado ===
        "REALIZADO"
    ) {

        return {
            id: "REALIZADO",
            texto: "Atendido",
            fondo: "#DCFCE7",
            color: "#15803D",
            borde: "#10B981"
        };
    }


    const hoy = new Date();

    hoy.setHours(
        0,
        0,
        0,
        0
    );


    const fechaObjetivo =
        mantenimiento?.fechaObjetivo
            ? new Date(
                `${mantenimiento.fechaObjetivo}T00:00:00`
            )
            : null;


    const fechaAviso =
        calcularFechaRecordatorio(
            mantenimiento,
            recordatorio
        );


    const kmActual =
        Number(
            vehiculo?.kilometrajeActual ||
            0
        );


    const kmObjetivo =
        mantenimiento
            ?.kilometrajeObjetivo !==
            null &&
        mantenimiento
            ?.kilometrajeObjetivo !==
            undefined

            ? Number(
                mantenimiento
                    .kilometrajeObjetivo
            )

            : null;


    const kmAviso =
        calcularKmRecordatorio(
            mantenimiento,
            recordatorio
        );


    const vencidoFecha =
        fechaObjetivo &&
        hoy > fechaObjetivo;


    const vencidoKm =
        kmObjetivo !== null &&
        kmActual > kmObjetivo;


    if (
        mantenimiento?.estado ===
        "VENCIDO" ||
        vencidoFecha ||
        vencidoKm
    ) {

        return {
            id: "VENCIDO",
            texto: "Vencido",
            fondo: "#FEE2E2",
            color: "#B91C1C",
            borde: "#EF4444"
        };
    }


    const avisoFecha =
        fechaAviso &&
        hoy >= fechaAviso;


    const avisoKm =
        kmAviso !== null &&
        kmActual >= kmAviso;


    if (
        mantenimiento?.estado ===
        "PROXIMO" ||
        avisoFecha ||
        avisoKm
    ) {

        return {
            id: "PROXIMO",
            texto: "Próximo",
            fondo: "#FEF3C7",
            color: "#B45309",
            borde: "#F59E0B"
        };
    }


    return {
        id: "PENDIENTE",
        texto: "Pendiente",
        fondo: "#EAF3FF",
        color: "#2563EB",
        borde: "#38BDF8"
    };
}