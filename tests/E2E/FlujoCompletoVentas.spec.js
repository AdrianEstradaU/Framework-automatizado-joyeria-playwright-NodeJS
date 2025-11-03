const { test, expect } = require('@playwright/test');
const { FormasPagoPage } = require('../../pages/FormasPagoPage.js');
const { formasPagoData } = require('../../data/FormasPagodata.js');
const { TiposIngresoPage } = require('../../pages/TiposIngresoPage.js');
const { tiposIngresoData } = require('../../data/TiposIngresoData.js');
const { TiposProductoPage } = require('../../pages/TiposProductoPage.js');
const { tiposProductoData } = require('../../data/TiposProductoData.js');
const { VentasPage } = require('../../pages/VentasPage.js');
const { VentasData } = require('../../data/VentasData.js');
const { ReporteIngresosPage } = require('../../pages/ReporteIngresosPage.js');
const logger = require("../../utils/loggers.js");
const { allure } = require('allure-playwright');
const { log } = require('console');

test.describe('Flujo completo de Ventas', () => {
  test.setTimeout(90000);

  test('AE-TC-123: Flujo completo: crear parámetros, registrar venta y verificar reporte@E2E @Regression @positive', async ({ page }) => {
     allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('Alta');
    logger.info(' INICIO AE-TC-123: Flujo completo de Ventas ');
   logger.info(' Creando los parámetros necesarios para el flujo de ventas ');
    const tiposIngreso = new TiposIngresoPage(page);
    await page.goto('/');
    await tiposIngreso.abrirModulo();
    await tiposIngreso.crear(
      tiposIngresoData.flujoIngresos.nombreFlujo,
      tiposIngresoData.flujoIngresos.descripcionFlujo
    );
    await expect(await tiposIngreso.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
    await page.goto('/');

    logger.info(' Creando Forma de Pago para el flujo de ventas ');
    const formasPago = new FormasPagoPage(page);
    await formasPago.abrirModulo();
    await formasPago.crear(
      formasPagoData.FLujoPago.nombreFlujo,
      formasPagoData.FLujoPago.descripcionFlujo
    );
    await expect(await formasPago.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
    await page.goto('/');

    logger.info(' Creando Tipo de Producto para el flujo de ventas ');
    const tiposProducto = new TiposProductoPage(page);
    await tiposProducto.abrirModulo();
    await tiposProducto.crear(
      tiposProductoData.validFlujo.nombre,
      tiposProductoData.validFlujo.descripcion
    );
    await expect(await tiposProducto.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
    await page.goto('/');

   logger.info(' Registrando una nueva venta en el sistema ');
    const ventas = new VentasPage(page);
    await ventas.abrirModulo();
    await ventas.crearVenta(
      VentasData.flujoVentas.descripcion,
      VentasData.flujoVentas.precio,
      VentasData.flujoVentas.cantidad,
      VentasData.flujoVentas.formaPago,
      VentasData.flujoVentas.tipoVenta,
      VentasData.flujoVentas.tipoProducto
    );
    await expect(ventas.toastExito).toBeVisible();
    await page.goto('/');

    logger.info(' Generando y validando el reporte de ingresos ');
    const reporte = new ReporteIngresosPage(page);
    await reporte.abrirModulo();
    await reporte.seleccionarUsuario('6');
    await reporte.ingresarFechas('01/10/2025', '30/10/2025');

    const [descarga] = await Promise.all([
      page.waitForEvent('download'),
      reporte.generarReporte()
    ]);
logger.info('Descargando reporte de ingresos en PDF.');
    const nombreArchivo = 'Reporte_Ingresos_Flujo.pdf';
    await descarga.saveAs(`./downloads/${nombreArchivo}`);
    console.log(`Reporte generado correctamente: ./downloads/${nombreArchivo}`);

    const rutaTemporal = await descarga.path();
    expect(rutaTemporal).not.toBeNull();
    expect((await descarga.suggestedFilename()).endsWith('.pdf')).toBeTruthy();
    console.log('Validación final: el reporte de ingresos fue descargado correctamente.');
     logger.info(' FIN AE-TC-123: Flujo completo ejecutado exitosamente ');
  });
});
