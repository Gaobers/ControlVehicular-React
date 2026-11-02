import React from "react";

import {
    fireEvent,
    render,
    screen
} from "@testing-library/react-native";

import { vehiculoService } from "../../services/vehiculoService";
import MenuScreen from "../MenuScreen";


jest.mock("../../services/vehiculoService", () => ({
    vehiculoService: {
        obtenerTodos: jest.fn()
    }
}));


describe("MenuScreen", () => {

    beforeEach(() => {
        vehiculoService.obtenerTodos.mockReset();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });


    test("renders the dashboard content and routes module and logout actions", () => {

        vehiculoService.obtenerTodos.mockResolvedValue([]);

        const onVehiculos = jest.fn();
        const onServicios = jest.fn();
        const onLogout = jest.fn();

        render(
            <MenuScreen
                onVehiculos={onVehiculos}
                onServicios={onServicios}
                onLogout={onLogout}
            />
        );

        expect(
            screen.getByText("Panel de Administración")
        ).toBeTruthy();

        expect(
            screen.getByText("Sistema Control Vehicular")
        ).toBeTruthy();

        expect(
            screen.getByText("Gestión de Vehículos")
        ).toBeTruthy();

        expect(
            screen.getByText("Servicios del Vehículo")
        ).toBeTruthy();

        fireEvent.press(
            screen.getByText("Gestionar vehículos")
        );

        fireEvent.press(
            screen.getByText("Gestionar servicios")
        );

        fireEvent.press(
            screen.getByText("↪")
        );

        expect(onVehiculos).toHaveBeenCalledTimes(1);
        expect(onServicios).toHaveBeenCalledTimes(1);
        expect(onLogout).toHaveBeenCalledTimes(1);
    });


    test("shows the vehicle count returned by the service", async () => {

        vehiculoService.obtenerTodos.mockResolvedValue([
            { id: 1, marca: "Toyota", modelo: "Corolla" },
            { id: 2, marca: "Honda", modelo: "Civic" }
        ]);

        render(
            <MenuScreen
                onVehiculos={() => {}}
                onServicios={() => {}}
                onLogout={() => {}}
            />
        );

        expect(
            await screen.findByText("2 vehículo(s) registrado(s)")
        ).toBeTruthy();

        expect(vehiculoService.obtenerTodos).toHaveBeenCalledTimes(1);
    });


    test("shows the empty vehicle count when the service returns an empty list", async () => {

        vehiculoService.obtenerTodos.mockResolvedValue([]);

        render(
            <MenuScreen
                onVehiculos={() => {}}
                onServicios={() => {}}
                onLogout={() => {}}
            />
        );

        expect(
            await screen.findByText("0 vehículo(s) registrado(s)")
        ).toBeTruthy();

        expect(
            await screen.findByText("Sincronizado")
        ).toBeTruthy();
    });


    test("shows the offline state when loading the vehicle count fails", async () => {

        vehiculoService.obtenerTodos.mockRejectedValue(
            new Error("Fallo de prueba")
        );

        jest.spyOn(console, "error").mockImplementation(() => {});

        render(
            <MenuScreen
                onVehiculos={() => {}}
                onServicios={() => {}}
                onLogout={() => {}}
            />
        );

        expect(
            await screen.findByText("Sin conexión")
        ).toBeTruthy();

        expect(
            screen.getByText("0 vehículo(s) registrado(s)")
        ).toBeTruthy();
    });
});