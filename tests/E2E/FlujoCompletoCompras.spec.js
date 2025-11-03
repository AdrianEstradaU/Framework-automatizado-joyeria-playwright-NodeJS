const { test, expect } = require('@playwright/test');
const { TiposEgresoPage } = require('../../pages/TiposEgresoPage.js');
const { tiposEgresoData } = require('../../data/TiposEgresoData.js');
const { ProveedoresPage } = require('../../pages/ProveedoresPage.js');
const { proveedoresData } = require('../../data/ProveedoresData.js');
const { TiposProductoPage } = require('../../pages/TiposProductoPage.js');
const { tiposProductoData } = require('../../data/TiposProductoData.js');
const { ComprasPage } = require('../../pages/ComprasPage.js');
const { ComprasData } = require('../../data/ComprasData.js');
const { ReporteEgresoPage } = require('../../pages/ReporteEgresosPage.js');
const logger = require("../../utils/loggers.js");
const { allure } = require('allure-playwright');

test.describe('Flujo completo de compras', () => {
      test.setTimeout(90000);
  test('AE-TC-122:Flujo completo: crear parámetros, registrar compra y verificar reporte @E2E @Regression @positive', async ({ page }) => {
  allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('Alta');
    logger.info(' INICIO AE-TC-122: Flujo completo de compras ');
    const tiposEgreso = new TiposEgresoPage(page);
    await page.goto('/');
    await tiposEgreso.abrirModulo();
    await tiposEgreso.crear(
      tiposEgresoData.validFlujo.nombre,
      tiposEgresoData.validFlujo.descripcion,
      tiposEgresoData.validFlujo.rol
    );
    logger.info(`Creando Tipo de Egreso: ${tiposEgresoData.validFlujo.nombre}`);
    await expect(await tiposEgreso.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
    await page.goto('/');
    const proveedor = new ProveedoresPage(page);
    await proveedor.abrirModulo();
    await proveedor.crear(
      proveedoresData.validFlujo.nombre,
      proveedoresData.validFlujo.descripcion,
      proveedoresData.validFlujo.rol
    );
    logger.info(`Creando Proveedor: ${proveedoresData.validFlujo.nombre}`);
    await expect(await proveedor.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
    await page.goto('/');
    const tipoProducto = new TiposProductoPage(page);
    await tipoProducto.abrirModulo();
    await tipoProducto.crear(
      tiposProductoData.validFlujo.nombre,
      tiposProductoData.validFlujo.descripcion
    );
    logger.info(`Creando Tipo de Producto: ${tiposProductoData.validFlujo.nombre}`);
    await expect(await tipoProducto.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
    await page.goto('/');
    const compra = new ComprasPage(page);
    await compra.abrirModulo();
    await compra.crearCompra(
      ComprasData.FlujoCompras.descripcion,
      ComprasData.FlujoCompras.precio,
      ComprasData.FlujoCompras.cantidad,
      ComprasData.FlujoCompras.tipoEgreso,
      ComprasData.FlujoCompras.proveedor,
      ComprasData.FlujoCompras.tipoProducto
    );
    logger.info('Registrando nueva compra en el sistema.');
    await expect(compra.toastExito).toBeVisible();
    await page.goto('/');
    const reporte = new ReporteEgresoPage(page);
    await reporte.abrirModulo();
    await reporte.seleccionarUsuario('6');
    await reporte.ingresarFechas('01/10/2025', '30/10/2025');
    const [descarga] = await Promise.all([
  page.waitForEvent('download'),
  reporte.generarReporte()
]);
  logger.info('Generando reporte de egresos en PDF.');
    const nombreArchivo = 'Reporte_Egresos_Flujo.pdf';
    await descarga.saveAs(`./downloads/${nombreArchivo}`);
    console.log(`Reporte generado correctamente: ./downloads/${nombreArchivo}`);

    const rutaTemporal = await descarga.path();
    expect(rutaTemporal).not.toBeNull(); 
    expect((await descarga.suggestedFilename()).endsWith('.pdf')).toBeTruthy(); 
   logger.info('Validación de reporte: archivo PDF descargado correctamente.');
   logger.info(' FIN AE-TC-122: Flujo completo ejecutado exitosamente ');
    });
});
