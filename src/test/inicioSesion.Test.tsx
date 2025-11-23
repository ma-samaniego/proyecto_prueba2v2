//import
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import InicioSesion from "../pages/inicioSesion";

describe("Componente InicioSesion", () => {

  // PRUEBA 1: Verificar que los campos se muestren correctamente
  it("muestra los campos de correo, contraseña y botones", () => {
    render(
      <MemoryRouter>
        <InicioSesion onLoginSuccess={vi.fn()} onNavigateToRegister={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
  });

  // PRUEBA 2: Validar errores de formato y campo vacío
  it("muestra errores de formato y luego de campo vacío", async () => {
    render(
      <MemoryRouter>
        <InicioSesion onLoginSuccess={vi.fn()} onNavigateToRegister={vi.fn()} />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/correo electrónico/i);

    // Provocar error de formato
    fireEvent.change(emailInput, { target: { value: "test" } });
    expect(await screen.findByText(/formato de email no válido/i)).toBeInTheDocument();

    // Provocar error de campo vacío
    fireEvent.change(emailInput, { target: { value: "" } });
    expect(await screen.findByText(/el correo electrónico es obligatorio/i)).toBeInTheDocument();

    // Repetir para contraseña (solo para vacío)
    const passInput = screen.getByLabelText(/contraseña/i);
    fireEvent.change(passInput, { target: { value: "123" } });
    fireEvent.change(passInput, { target: { value: "" } });
    expect(await screen.findByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
  });

  // PRUEBA 3: Aceptar credenciales correctas
  it("llama a onLoginSuccess cuando se envían credenciales correctas", async () => {
    const onLoginSuccess = vi.fn();
    const onNavigateToRegister = vi.fn();

    render(
      <MemoryRouter>
        <InicioSesion
          onLoginSuccess={onLoginSuccess}
          onNavigateToRegister={onNavigateToRegister}
        />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passInput = screen.getByLabelText(/contraseña/i);
    const ingresarButton = screen.getByRole("button", { name: /ingresar/i });

    fireEvent.change(emailInput, { target: { value: "vega@gmail.com" } });
    fireEvent.change(passInput, { target: { value: "1234" } });

    await waitFor(() => {
        expect(ingresarButton).not.toBeDisabled();
    });

    fireEvent.click(ingresarButton);

    expect(onLoginSuccess).toHaveBeenCalled();
  });

  // PRUEBA 4: Navegación al registro
  it("llama a onNavigateToRegister al hacer clic en 'Registrate'", () => {
    const onLoginSuccess = vi.fn();
    const onNavigateToRegister = vi.fn();

    render(
      <MemoryRouter>
        <InicioSesion
          onLoginSuccess={onLoginSuccess}
          onNavigateToRegister={onNavigateToRegister}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /registrate/i }));

    expect(onNavigateToRegister).toHaveBeenCalled();
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });

}); // Fin del describe