import React from "react";

import {
    act,
    fireEvent,
    render,
    screen
} from "@testing-library/react-native";

import API from "../../api";
import { vehiculoService } from "../../services/vehiculoService";
import VehiculosScreen from "../VehiculosScreen";


jest.mock("../../services/vehiculoService", () => ({
    vehiculoService: {
        obtenerTodos: jest.fn(),
        crear: jest.fn(),
        actualizar: jest.fn(),
        eliminar: jest.fn()
    }
}));


jest.mock("@react-native-community/datetimepicker", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return function MockDateTimePicker() {
        return React.createElement(Text, null, "DateTimePicker nativo");
    };
});


const vehiculoToyota = {
    id: 1,
    propietarioId: 10,
    marca: "Toyota",
    modelo: "Corolla",
    anio: 2022,
    placa: "ABC-123",
    color: "Azul",
    kilometrajeActual: 1234.5,
    estado: "ACTIVO"
};

const vehiculoHonda = {
    id: 2,
    propietarioId: 11,
    marca: "Honda",
    modelo: "Civic",
    anio: 2020,
    placa: "XYZ-987",
    color: "Negro",
    kilometrajeActual: 67000,
    estado: "ARCHIVADO"
};


function renderPantalla(props = {}) {
    return render(
        <VehiculosScreen
            onVolver={() => {}}
            onLogout={() => {}}
            {...props}
        />
    );
}


function crearPromesaDiferida() {
    let resolver;
    const promise = new Promise((resolve) => {
        resolver = resolve;
    });

    return { promise, resolver };
}


describe("VehiculosScreen", () => {

    beforeEach(() => {
        vehiculoService.obtenerTodos.mockReset();
        vehiculoService.crear.mockReset();
        vehiculoService.actualizar.mockReset();
        vehiculoService.eliminar.mockReset();

        vehiculoService.crear.mockResolvedValue({});
        vehiculoService.actualizar.mockResolvedValue({});
        vehiculoService.eliminar.mockResolvedValue({});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });


    test("shows loading and then renders vehicles returned by the service", async () => {

        const request = crearPromesaDiferida();
        vehiculoService.obtenerTodos.mockReturnValue(request.promise);

        renderPantalla();

        expect(
            screen.getByText("Cargando vehículos...")
        ).toBeTruthy();

        await act(async () => {
            request.resolver([vehiculoToyota]);
        });

        expect(
            await screen.findByText("Toyota Corolla")
        ).toBeTruthy();

        expect(
            screen.getByText("ABC-123")
        ).toBeTruthy();

        expect(vehiculoService.obtenerTodos).toHaveBeenCalledTimes(1);
    });


    test("shows the empty state when no vehicles are returned", async () => {

        vehiculoService.obtenerTodos.mockResolvedValue([]);

        renderPantalla();

        expect(
            await screen.findByText("No se encontraron vehículos")
        ).toBeTruthy();

        expect(
            screen.getByText("0 vehículos registrados")
        ).toBeTruthy();
    });


    test("shows the service error while retaining the empty state", async () => {

        vehiculoService.obtenerTodos.mockRejectedValue(
            new Error("Error simulado")
        );

        renderPantalla();

        expect(
            await screen.findByText("No se pudieron cargar los vehículos.")
        ).toBeTruthy();

        expect(
            screen.getByText("No se encontraron vehículos")
        ).toBeTruthy();
    });


    test("filters the rendered list by search text and vehicle state", async () => {

        vehiculoService.obtenerTodos.mockResolvedValue([
            vehiculoToyota,
            vehiculoHonda
        ]);

        renderPantalla();

        expect(
            await screen.findByText("Toyota Corolla")
        ).toBeTruthy();

        expect(
            screen.getByText("Honda Civic")
        ).toBeTruthy();

        fireEvent.changeText(
            screen.getByPlaceholderText("Buscar por placa, marca o modelo..."),
            "ABC"
        );

        expect(
            screen.getByText("Toyota Corolla")
        ).toBeTruthy();

        expect(
            screen.queryByText("Honda Civic")
        ).toBeNull();

        fireEvent.changeText(
            screen.getByPlaceholderText("Buscar por placa, marca o modelo..."),
            ""
        );

        fireEvent.press(
            screen.getByText("Archivados")
        );

        expect(
            screen.getByText("Honda Civic")
        ).toBeTruthy();

        expect(
            screen.queryByText("Toyota Corolla")
        ).toBeNull();
    });


    test("opens the vehicle detail with the selected vehicle data", async () => {

        vehiculoService.obtenerTodos.mockResolvedValue([vehiculoToyota]);

        renderPantalla();

        expect(
            await screen.findByText("Toyota Corolla")
        ).toBeTruthy();

        fireEvent.press(
            screen.getByText("Ver detalle →")
        );

        expect(
            await screen.findByText("Información técnica y documentación")
        ).toBeTruthy();

        expect(
            screen.getByText("Editar vehículo")
        ).toBeTruthy();

        expect(
            screen.getByText("Archivar vehículo")
        ).toBeTruthy();
    });


    test("registers a vehicle and reloads the list with the service response", async () => {

        const vehiculoCreado = {
            ...vehiculoToyota,
            id: 3,
            marca: "Nissan",
            modelo: "Versa",
            placa: "NIS-345"
        };

        vehiculoService.obtenerTodos
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([vehiculoCreado]);

        renderPantalla();

        expect(
            await screen.findByText("No se encontraron vehículos")
        ).toBeTruthy();

        fireEvent.press(
            screen.getByText("+ Registrar")
        );

        expect(
            await screen.findByText("REGISTRAR VEHÍCULO")
        ).toBeTruthy();

        fireEvent.changeText(
            screen.getByPlaceholderText("Ej. 1"),
            "10"
        );

        fireEvent.changeText(
            screen.getByPlaceholderText("Toyota"),
            " Nissan "
        );

        fireEvent.changeText(
            screen.getByPlaceholderText("Corolla"),
            "Versa"
        );

        fireEvent.changeText(
            screen.getByPlaceholderText("2024"),
            "2024"
        );

        fireEvent.changeText(
            screen.getByPlaceholderText("P123456"),
            "nis-345"
        );

        fireEvent.press(
            screen.getByText("REGISTRAR VEHÍCULO")
        );

        expect(
            await screen.findByText("Vehículo registrado correctamente.")
        ).toBeTruthy();

        expect(vehiculoService.crear).toHaveBeenCalledWith({
            propietarioId: 10,
            marca: "Nissan",
            modelo: "Versa",
            anio: 2024,
            placa: "NIS-345",
            color: null,
            kilometrajeActual: 0,
            vin: null,
            motor: null
        });

        expect(
            await screen.findByText("Nissan Versa")
        ).toBeTruthy();

        expect(vehiculoService.obtenerTodos).toHaveBeenCalledTimes(2);
    });


    test("rejects unexpected Axios requests before they reach the network", async () => {

        await expect(
            API.get("/api/vehiculos/lista")
        ).rejects.toThrow(
            "Unexpected HTTP request in component tests: GET /api/vehiculos/lista"
        );
    });
});