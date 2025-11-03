const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage.js');
const { loginData } = require('../data/LoginData.js');
const logger = require("../utils/loggers.js");
const { allure } = require('allure-playwright');
test.describe('Login', () => {
  let login;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.goto();
  });
      
 test('AE-TC-01. Verificar mensaje de “Campo obligatorio” al enviar campos vacíos @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical'); 
    logger.info('Iniciando prueba AE-TC-01: Validar mensaje de campo obligatorio al enviar campos vacíos');
    
    await login.submitEmpty();
    logger.info('Se enviaron los campos vacíos');
    
    const mensaje = await login.validarPasswordRequired();
    logger.info(`Mensaje recibido: ${mensaje}`);
    
    await expect(mensaje).toContain('Este campo es obligatorio');
    logger.info('Validación exitosa: mensaje de campo obligatorio mostrado correctamente');
});

test('AE-TC-02. Verificar mensaje de error si el usuario contiene números o símbolos @Smoke @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal'); 
    logger.info('Iniciando prueba AE-TC-02: Validar usuario con números o símbolos');
    
    await login.login(
      loginData.usuarioConSimbolos.usuario,
      loginData.usuarioConSimbolos.password
    );
    logger.info(`Se ingresó usuario: ${loginData.usuarioConSimbolos.usuario}`);
    
    const mensaje = await login.validarUserFormatError();
    logger.info(`Mensaje recibido: ${mensaje}`);
    
    await expect(mensaje).toContain('Solo se permite letras y puntos');
    logger.info('Validación exitosa: mensaje de error de formato mostrado correctamente');
});

test('AE-TC-03. Verificar al ingresar una contraseña incorrecta muestre un mensaje de error @Smoke @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal'); 
    logger.info('Iniciando prueba AE-TC-03: Validar contraseña incorrecta');
    
    await login.login(
      loginData.contrasenaIncorrecta.usuario,
      loginData.contrasenaIncorrecta.password
    );
    logger.info(`Se ingresó usuario: ${loginData.contrasenaIncorrecta.usuario} con contraseña incorrecta`);
    
    const visible = await login.validarWrongPassword();
    logger.info(`Mensaje de contraseña incorrecta visible: ${visible}`);
    
    await expect(visible).toBe(true);
    logger.info('Validación exitosa: mensaje de contraseña incorrecta mostrado correctamente');
});

test('AE-TC-04. Verificar  al  ingresar con usuario no registrado @Smoke @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical'); 
    logger.info('Iniciando prueba AE-TC-04: Validar usuario no registrado');
    
    await login.login(
      loginData.usuarioNoRegistrado.usuario,
      loginData.usuarioNoRegistrado.password
    );
    logger.info(`Se ingresó usuario no registrado: ${loginData.usuarioNoRegistrado.usuario}`);
    
    const visible = await login.validarUserNotRegistered();
    logger.info(`Mensaje de usuario no registrado visible: ${visible}`);
    
    await expect(visible).toBe(true);
    logger.info('Validación exitosa: mensaje de usuario no registrado mostrado correctamente');
});
});