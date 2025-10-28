const { test, expect } = require('@playwright/test');
const { UtilidadesPage } = require('../../pages/UtilidadesPage');

test.describe('Módulo: Reporte de Utilidades', () => {
  let utilidadesPage;

  test.beforeEach(async ({ page }) => {
    utilidadesPage = new UtilidadesPage(page);
    await page.goto('/');
    await utilidadesPage.abrirModulo();
  });

  test('AE-116: Verificar la funcionalidad del campo de fecha inicio', async () => {
    await utilidadesPage.llenarFechaInicio('01/10/2025');
    expect(await utilidadesPage.obtenerValorFechaInicio()).toBe('01/10/2025');
  });

  test('AE-117: Verificar la funcionalidad del campo de fecha fin', async () => {
    await utilidadesPage.llenarFechaFin('10/10/2025');
    expect(await utilidadesPage.obtenerValorFechaFin()).toBe('10/10/2025');
  });

  test('AE-118: Verificar que fecha fin no pueda ser antes de fecha inicio', async () => {
    await utilidadesPage.llenarFechaInicio('10/10/2025');
    await utilidadesPage.llenarFechaFin('01/10/2025');
    await utilidadesPage.clickGenerar();
    await expect(utilidadesPage.toastError).toBeVisible();
    
  });

  test('AE-119: Verificar funcionalidad del botón Limpiar', async () => {
    await utilidadesPage.llenarFechaInicio('01/10/2025');
    await utilidadesPage.llenarFechaFin('28/10/2025');
    await utilidadesPage.clickLimpiar();
    expect(await utilidadesPage.obtenerValorFechaInicio()).toBe('');
    expect(await utilidadesPage.obtenerValorFechaFin()).toBe('');
  });

  test('AE-120: Verificar funcionalidad del botón Generar', async () => {
    await utilidadesPage.llenarFechaInicio('01/10/2025');
    await utilidadesPage.llenarFechaFin('28/10/2025');
    await utilidadesPage.clickGenerar();
    await expect(utilidadesPage.resultadoUtilidad).toContainText('UTILIDAD', { timeout: 15000 });
  });
  test('AE-121: Verificar funcionalidad de que no permita generar reportes con campos vacios en fechas', async () => {
  await utilidadesPage.llenarFechaInicio('01/10/2025');
  await utilidadesPage.llenarFechaFin('28/10/2025');
  await utilidadesPage.clickLimpiar();
  expect(await utilidadesPage.obtenerValorFechaInicio()).toBe('');
  expect(await utilidadesPage.obtenerValorFechaFin()).toBe('');
  await utilidadesPage.clickGenerar();
  await expect(utilidadesPage.mensajeErrorFechaInicio).toBeVisible();
  await expect(utilidadesPage.mensajeErrorFechaInicio).toHaveText('Este campo es obligatorio');
  await expect(utilidadesPage.mensajeErrorFechaFin).toBeVisible();
  await expect(utilidadesPage.mensajeErrorFechaFin).toHaveText('Este campo es obligatorio');
});

});