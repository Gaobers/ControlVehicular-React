import React from "react";

import {
    act,
    fireEvent,
    render,
    screen
} from "@testing-library/react-native";

import { authService } from "../../services/authService";
import LoginScreen from "../LoginScreen";


jest.mock("../../services/authService", () => ({
    authService: {
        login: jest.fn()
    }
}));


describe("LoginScreen", () => {

    beforeEach(() => {
        authService.login.mockReset();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });


    test("renders the credential fields and login action", () => {

        render(
            <LoginScreen onLoginSuccess={() => {}} />
        );

        expect(
            screen.getByPlaceholderText("Ingresa tu correo")
        ).toBeTruthy();

        expect(
            screen.getByPlaceholderText("Ingresa tu contraseña")
        ).toBeTruthy();

        expect(
            screen.getByText("INGRESAR")
        ).toBeTruthy();
    });


    test("shows validation when required fields are empty", () => {

        const onLoginSuccess = jest.fn();

        render(
            <LoginScreen onLoginSuccess={onLoginSuccess} />
        );

        fireEvent.press(
            screen.getByText("INGRESAR")
        );

        expect(
            screen.getByText("Correo y contraseña son obligatorios")
        ).toBeTruthy();

        expect(authService.login).not.toHaveBeenCalled();
        expect(onLoginSuccess).not.toHaveBeenCalled();
    });


    test("shows loading while authentication is pending and calls success on a token response", async () => {

        let resolver;
        const respuestaLogin = new Promise((resolve) => {
            resolver = resolve;
        });

        authService.login.mockReturnValue(respuestaLogin);

        const onLoginSuccess = jest.fn();

        render(
            <LoginScreen onLoginSuccess={onLoginSuccess} />
        );

        fireEvent.changeText(
            screen.getByPlaceholderText("Ingresa tu correo"),
            "usuario@example.invalid"
        );

        fireEvent.changeText(
            screen.getByPlaceholderText("Ingresa tu contraseña"),
            "clave-de-prueba"
        );

        fireEvent.press(
            screen.getByText("INGRESAR")
        );

        expect(
            await screen.findByText("Iniciando sesión...")
        ).toBeTruthy();

        expect(authService.login).toHaveBeenCalledWith(
            "usuario@example.invalid",
            "clave-de-prueba"
        );

        await act(async () => {
            resolver({ token: "token-de-prueba" });
        });

        expect(onLoginSuccess).toHaveBeenCalledTimes(1);
        expect(
            screen.queryByText("Iniciando sesión...")
        ).toBeNull();
    });


    test("shows the service error returned during authentication", async () => {

        authService.login.mockRejectedValue(
            new Error("Servicio no disponible")
        );

        jest.spyOn(console, "error").mockImplementation(() => {});

        const onLoginSuccess = jest.fn();

        render(
            <LoginScreen onLoginSuccess={onLoginSuccess} />
        );

        fireEvent.changeText(
            screen.getByPlaceholderText("Ingresa tu correo"),
            "usuario@example.invalid"
        );

        fireEvent.changeText(
            screen.getByPlaceholderText("Ingresa tu contraseña"),
            "clave-de-prueba"
        );

        fireEvent.press(
            screen.getByText("INGRESAR")
        );

        expect(
            await screen.findByText("Servicio no disponible")
        ).toBeTruthy();

        expect(onLoginSuccess).not.toHaveBeenCalled();
    });


    test("reports a response that does not contain a token", async () => {

        authService.login.mockResolvedValue({});

        const onLoginSuccess = jest.fn();

        render(
            <LoginScreen onLoginSuccess={onLoginSuccess} />
        );

        fireEvent.changeText(
            screen.getByPlaceholderText("Ingresa tu correo"),
            "usuario@example.invalid"
        );

        fireEvent.changeText(
            screen.getByPlaceholderText("Ingresa tu contraseña"),
            "clave-de-prueba"
        );

        fireEvent.press(
            screen.getByText("INGRESAR")
        );

        expect(
            await screen.findByText("El servidor no devolvió un token")
        ).toBeTruthy();

        expect(onLoginSuccess).not.toHaveBeenCalled();
    });
});