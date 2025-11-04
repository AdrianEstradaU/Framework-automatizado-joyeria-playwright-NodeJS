const { test, expect } = require('@playwright/test');
const { VentasPage } = require('../../pages/VentasPage.js');
const { VentasData } = require('../../data/VentasData.js');
const logger = require("../../utils/loggers.js");
const { allure } = require('allure-playwright');
const { limpiarVentasCreadas, registrarVentaCreada } = require('../../utils/teardownVentas');

test.describe('Módulo Ventas', () => {
  let ventasPage;
  let cleanupContext;
  let cleanupPage;

  test.beforeAll(async ({ browser }) => {
    cleanupContext = await browser.newContext({
      storageState: 'fixtures/storageState.json'
    });
    cleanupPage = await cleanupContext.newPage();
  });

  test.beforeEach(async ({ page }) => {
    ventasPage = new VentasPage(page);
    await page.goto('/');
    await ventasPage.abrirModulo();
  });

  test.afterAll(async () => {
    await limpiarVentasCreadas(cleanupPage);
    await cleanupContext.close();
  }, 60000); 

  test('AE-TC-70: Crear una venta con datos válidos @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('AE-TC-70: Crear una venta con datos válidos');

    const data = VentasData.valid;
    await ventasPage.crearVenta(
      data.descripcion,
      data.precio,
      data.cantidad,
      data.formaPago,
      data.tipoVenta,
      data.tipoProducto
    );

    await ventasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    const existe = await ventasPage.verificarVentaExiste(data.descripcion);
    expect(existe).toBeTruthy();
    
    registrarVentaCreada(data.descripcion);
    
    logger.info('Venta creada correctamente y verificada en la tabla.');
  });

  test('AE-TC-71: Buscar ventas por término @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-71: Buscar ventas por término');

    await ventasPage.crearVentaRapida(VentasData.busqueda.termino, 100);
    await ventasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });

    await ventasPage.buscarVentas.fill(VentasData.busqueda.termino);
    await ventasPage.page.waitForTimeout(1000);

    const fila = ventasPage.tabla.locator(`tr:has-text("${VentasData.busqueda.termino}")`);
    expect(await fila.count()).toBeGreaterThan(0);
    
    registrarVentaCreada(VentasData.busqueda.termino);
    
    logger.info('Venta encontrada correctamente mediante búsqueda.');
  });

  test('AE-TC-72: Seleccionar un registro de ventas @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info('AE-TC-72: Seleccionar un registro de ventas');

    const fila = ventasPage.tabla.locator('tr').first();
    await fila.click();
    expect(await fila.evaluate(el => el.classList.contains('selected'))).toBeTruthy();
    logger.info('Registro seleccionado correctamente.');
  });

  test('AE-TC-73: Botones "Anterior" y "Siguiente" deshabilitados @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('Menor');
    logger.info('AE-TC-73: Validar botones Anterior y Siguiente deshabilitados');

    expect(await ventasPage.isAnteriorDisabled()).toBeTruthy();
    expect(await ventasPage.isSiguienteDisabled()).toBeTruthy();
    logger.info('Ambos botones están deshabilitados correctamente.');
  });

  test('AE-TC-74: Rechazo de venta con campos obligatorios vacíos @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-74: Rechazo con campos vacíos');

    await ventasPage.click(ventasPage.btnCrear);
    await ventasPage.page.waitForTimeout(1000);
    await ventasPage.click(ventasPage.btnGuardar);
    await ventasPage.page.waitForTimeout(2000);

    const errores = await ventasPage.page.locator('.error, .invalid-feedback, .text-danger').allTextContents();
    expect(errores.length).toBeGreaterThan(0);
    logger.info('Se detectaron errores por campos vacíos.');
  });

  test('AE-TC-75: Validar límite máximo de caracteres en descripción @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info('AE-TC-75: Validar longitud máxima de descripción');

    await ventasPage.crearVentaRapida(
      VentasData.limites.descripcionLargaValida,
      100
    );

    await ventasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    expect(await ventasPage.toastExito.isVisible()).toBeTruthy();
    
    registrarVentaCreada(VentasData.limites.descripcionLargaValida);
    
    logger.info('Venta creada correctamente con descripción dentro del límite.');
  });

  test('AE-TC-76: Validar límite máximo de caracteres en precio @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info('AE-TC-76: Validar longitud máxima en campo precio');

    await ventasPage.crearVentaRapida(
      'Anillo',
      VentasData.limites.preciolargovalido
    );

    await ventasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    expect(await ventasPage.toastExito.isVisible()).toBeTruthy();
    
    registrarVentaCreada('Anillo');
    
    logger.info('Venta con precio largo válida procesada correctamente.');
  });

  test('AE-TC-77: Crear venta con precio decimal @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-77: Crear venta con precio decimal');

    await ventasPage.crearVentaRapida('Anillo Decimal', 99.99);

    await ventasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    const existe = await ventasPage.verificarVentaExiste('Anillo Decimal');
    expect(existe).toBeTruthy();
    
    registrarVentaCreada('Anillo Decimal');
    
    logger.info('Venta con precio decimal creada y verificada.');
  });

  test('AE-TC-78: Rechazo de venta con precio negativo @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('AE-TC-78: Rechazo con precio negativo');
    
    await ventasPage.crearVentaRapida('Anillo Negativo', -50);

    await ventasPage.toastError.waitFor({ state: 'visible', timeout: 10000 });
    expect(await ventasPage.toastError.isVisible()).toBeTruthy();
    logger.info('Sistema rechazó correctamente el precio negativo.');
    
 
  });

  test('AE-TC-79: Validar que no se puedan ingresar letras en precio @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-79: Validar letras en campo precio');

    await ventasPage.click(ventasPage.btnCrear);
    await ventasPage.page.waitForTimeout(1000);

    await ventasPage.page.evaluate(() => {
      const input = document.querySelector('[name="joy_ingreso[precio_ingreso]"]');
      if (input) {
        input.value = 'ABC';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    const valor = await ventasPage.precio.inputValue();
    expect(valor).toBe('');
    logger.info('Campo precio no acepta letras correctamente.');
    
   
  });

  test('AE-TC-80: Rechazo por precio inválido y forma de pago vacía @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('AE-TC-80: Validar rechazo con precio inválido y forma de pago vacía');

    await ventasPage.crearVenta(
      'Anillo',
      VentasData.formatosInvalidos.precioTexto,
      '1',
      '', 
      VentasData.defaults.tipoVenta,
      VentasData.defaults.tipoProducto
    );
    await ventasPage.page.waitForTimeout(2000);

    const hayErrores = await ventasPage.page.locator('.error, .invalid-feedback, .overhang-message').count();
    expect(hayErrores).toBeGreaterThan(0);
    logger.info('Errores mostrados correctamente por datos inválidos.');
    
  
  });

  test('AE-TC-81: Rechazo por descripción y precio fuera de límite @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('AE-TC-81: Validar rechazo por valores fuera de límite');

    await ventasPage.crearVentaRapida(
      VentasData.limites.descripcionLarga,
      VentasData.limites.preciolargo
    );
    await ventasPage.page.waitForTimeout(2000);

    const hayError = await ventasPage.page.locator('.error, .overhang-message').count();
    expect(hayError).toBeGreaterThan(0);
    logger.info('Se detectaron correctamente errores por límites excedidos.');
    

  });

  test('AE-TC-82: Validar que no se puedan ingresar letras en cantidad @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-82: Validar que campo cantidad sea numérico');

    await ventasPage.click(ventasPage.btnCrear);
    await ventasPage.page.waitForTimeout(1000);

    const opciones = await ventasPage.cantidad.locator('option').allTextContents();
    const opcionesValidas = opciones.slice(1);
    const todasNumericas = opcionesValidas.every(opt => !isNaN(Number(opt.trim())));

    expect(todasNumericas).toBeTruthy();
    logger.info('Campo cantidad contiene únicamente opciones numéricas.');
    
  });
});