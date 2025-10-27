const { test, expect } = require('@playwright/test');
const { VentasPage } = require('../../pages/VentasPage');
const { VentasData } = require('../../data/VentasData');

test.describe('Módulo Ventas', () => {
  let ventasPage;

  test.beforeEach(async ({ page }) => {
    ventasPage = new VentasPage(page);
    await page.goto('/');
    await ventasPage.abrirModulo();
  });

  test('AE-70: Crear una venta con datos válidos', async () => {
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
  });

  test('AE-71: Buscar ventas por término', async () => {
    await ventasPage.crearVentaRapida(VentasData.busqueda.termino, 100);
    await ventasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    
    await ventasPage.buscarVentas.fill(VentasData.busqueda.termino);
    await ventasPage.page.waitForTimeout(1000);
    
    const fila = ventasPage.tabla.locator(`tr:has-text("${VentasData.busqueda.termino}")`);
    expect(await fila.count()).toBeGreaterThan(0);
  });

  test('AE-72: Seleccionar un registro de ventas', async () => {
    const fila = ventasPage.tabla.locator('tr').first();
    await fila.click();
    expect(await fila.evaluate(el => el.classList.contains('selected'))).toBeTruthy();
  });

  test('AE-73: Botones "Anterior" y "Siguiente" deshabilitados', async () => {
    expect(await ventasPage.isAnteriorDisabled()).toBeTruthy();
    expect(await ventasPage.isSiguienteDisabled()).toBeTruthy();
  });

  test('AE-74: Rechazo de venta con campos obligatorios vacíos', async () => {
    await ventasPage.click(ventasPage.btnCrear);
    await ventasPage.page.waitForTimeout(1000);
    await ventasPage.click(ventasPage.btnGuardar);
    await ventasPage.page.waitForTimeout(2000);
    const errores = await ventasPage.page.locator('.error, .invalid-feedback, .text-danger').allTextContents();
    expect(errores.length).toBeGreaterThan(0);
  });

  test('AE-75: Validar límite máximo de caracteres en descripción', async () => {
    await ventasPage.crearVentaRapida(
      VentasData.limites.descripcionLargaValida,
      100
    );
    
    await ventasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    expect(await ventasPage.toastExito.isVisible()).toBeTruthy();
  });

  test('AE-76: Validar límite máximo de caracteres en precio', async () => {
    await ventasPage.crearVentaRapida(
      'Anillo',
      VentasData.limites.preciolargovalido
    );
    
    await ventasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    expect(await ventasPage.toastExito.isVisible()).toBeTruthy();
  });

  test('AE-77: Crear venta con precio decimal', async () => {
    await ventasPage.crearVentaRapida('Anillo Decimal', 99.99);
    
    await ventasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    const existe = await ventasPage.verificarVentaExiste('Anillo Decimal');
    expect(existe).toBeTruthy();
  });

  test('AE-78: Rechazo de venta con precio negativo', async () => {
    await ventasPage.crearVentaRapida('Anillo Negativo', -50);
    
    await ventasPage.toastError.waitFor({ state: 'visible', timeout: 10000 });
    expect(await ventasPage.toastError.isVisible()).toBeTruthy();
  });

  test('AE-79: Validar que no se puedan ingresar letras en precio', async () => {
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
  });

  test('AE-80: Rechazo por precio inválido y forma de pago vacía', async () => {
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
  });

  test('AE-81: Rechazo por descripción y precio fuera de límite', async () => {
    await ventasPage.crearVentaRapida(
      VentasData.limites.descripcionLarga,
      VentasData.limites.preciolargo
    );
    await ventasPage.page.waitForTimeout(2000);
    const hayError = await ventasPage.page.locator('.error, .overhang-message').count();
    expect(hayError).toBeGreaterThan(0);
  });

  test('AE-82: Validar que no se puedan ingresar letras en cantidad', async () => {
    await ventasPage.click(ventasPage.btnCrear);
    await ventasPage.page.waitForTimeout(1000);
    // La cantidad es un select, verificar que solo tenga opciones numéricas
    const opciones = await ventasPage.cantidad.locator('option').allTextContents();
    const opcionesValidas = opciones.slice(1);
    const todasNumericas = opcionesValidas.every(opt => !isNaN(Number(opt.trim())));
    
    expect(todasNumericas).toBeTruthy();
  });
});