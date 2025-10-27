const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { loginData } = require('../data/logindata');

test.describe('Login', () => {
  let login;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.goto();
  });

  test('1. Verificar mensaje de “Campo obligatorio” al enviar campos vacíos', async () => {
    await login.submitEmpty();
    const mensaje = await login.validarPasswordRequired();
    await expect(mensaje).toContain('Este campo es obligatorio');
  });

  test('2. Verificar mensaje de error si el usuario contiene números o símbolos', async () => {
    await login.login(
      loginData.usuarioConSimbolos.usuario,
      loginData.usuarioConSimbolos.password
    );
    const mensaje = await login.validarUserFormatError();
    await expect(mensaje).toContain('Solo se permite letras y puntos');
  });

  test('3. Verificar al ingresar una contraseña incorrecta muestre un mensaje de error', async () => {
    await login.login(
      loginData.contrasenaIncorrecta.usuario,
      loginData.contrasenaIncorrecta.password
    );
    const visible = await login.validarWrongPassword();
    await expect(visible).toBe(true);
  });

  test('4. Verificar al ingresar usuario no registrado', async () => {
    await login.login(
      loginData.usuarioNoRegistrado.usuario,
      loginData.usuarioNoRegistrado.password
    );
    const visible = await login.validarUserNotRegistered();
    await expect(visible).toBe(true);
  });
});
