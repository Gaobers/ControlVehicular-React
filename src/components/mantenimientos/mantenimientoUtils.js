export const ESTADOS_MANTENIMIENTO = [
    "PENDIENTE",
    "PROXIMO",
    "VENCIDO",
    "REALIZADO"
];

export function obtenerEstadoVisual(estado) {
    switch (estado) {
        case "VENCIDO":
            return {
                texto: "Vencido",
                fondo: "#FEE2E2",
                color: "#B91C1C",
                borde: "#EF4444"
            };

        case "PROXIMO":
            return {
                texto: "Próximo",
                fondo: "#FEF3C7",
                color: "#B45309",
                borde: "#F59E0B"
            };

        case "REALIZADO":
            return {
                texto: "Realizado",
                fondo: "#DCFCE7",
                color: "#15803D",
                borde: "#10B981"
            };

        default:
            return {
                texto: "Pendiente",
                fondo: "#E2E8F0",
                color: "#475569",
                borde: "#94A3B8"
            };
    }
}

export function formatearKm(valor) {
    if (
        valor === null ||
        valor === undefined ||
        valor === ""
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

export function obtenerNombreVehiculo(
    vehiculos,
    vehiculoId
) {
    const vehiculo = vehiculos.find(
        (item) =>
            String(item.id) ===
            String(vehiculoId)
    );

    if (!vehiculo) {
        return `Vehículo #${vehiculoId}`;
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

export function calcularKmRestantes(
    mantenimiento,
    vehiculo
) {
    if (
        mantenimiento?.kilometrajeObjetivo === null ||
        mantenimiento?.kilometrajeObjetivo === undefined
    ) {
        return null;
    }

    const objetivo = Number(
        mantenimiento.kilometrajeObjetivo
    );

    const actual = Number(
        vehiculo?.kilometrajeActual || 0
    );

    return objetivo - actual;
}