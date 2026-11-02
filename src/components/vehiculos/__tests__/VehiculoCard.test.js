import React from "react";

import {
    fireEvent,
    render,
    screen
} from "@testing-library/react-native";

import VehiculoCard from "../VehiculoCard";


describe("VehiculoCard", () => {

    test("renders vehicle details and forwards selection", () => {

        const vehiculo = {
            id: 12,
            propietarioId: 7,
            marca: "Toyota",
            modelo: "Corolla",
            anio: 2022,
            placa: "ABC-123",
            color: "Azul",
            kilometrajeActual: 1234.5,
            estado: "ACTIVO"
        };

        const onDetalle = jest.fn();

        render(
            <VehiculoCard
                vehiculo={vehiculo}
                onDetalle={onDetalle}
            />
        );

        expect(
            screen.getByText("Toyota Corolla")
        ).toBeTruthy();

        expect(
            screen.getByText("ABC-123")
        ).toBeTruthy();

        expect(
            screen.getByText("Propietario #7")
        ).toBeTruthy();

        expect(
            screen.getByText("2022 • Azul")
        ).toBeTruthy();

        expect(
            screen.getByText("1,234.5 km")
        ).toBeTruthy();

        expect(
            screen.getByText("Al día")
        ).toBeTruthy();

        fireEvent.press(
            screen.getByText("Ver detalle →")
        );

        expect(onDetalle).toHaveBeenCalledWith(vehiculo);
    });


    test("shows the archived status", () => {

        render(
            <VehiculoCard
                vehiculo={{
                    marca: "Honda",
                    modelo: "Civic",
                    estado: "ARCHIVADO"
                }}
            />
        );

        expect(
            screen.getByText("Archivado")
        ).toBeTruthy();
    });


    test("shows the implemented fallbacks for missing optional data", () => {

        render(
            <VehiculoCard
                vehiculo={{
                    id: 8,
                    estado: "ACTIVO"
                }}
            />
        );

        expect(
            screen.getByText("Vehículo")
        ).toBeTruthy();

        expect(
            screen.getByText("SIN PLACA")
        ).toBeTruthy();

        expect(
            screen.getByText("Propietario #-")
        ).toBeTruthy();

        expect(
            screen.getByText("Sin datos adicionales")
        ).toBeTruthy();

        expect(
            screen.getByText("0.0 km")
        ).toBeTruthy();
    });
});