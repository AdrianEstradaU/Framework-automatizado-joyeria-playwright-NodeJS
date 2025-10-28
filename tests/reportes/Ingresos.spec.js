const { test, expect } = require('@playwright/test');
const { ReporteIngresosPage } = require('../../pages/ReporteIngresosPage');

test.describe('Módulo: Reportes - Ingresos por Fecha', () => {
  let reportePage;

  test.beforeEach(async ({ page }) => {
    reportePage = new ReporteIngresosPage(page);
    await page.goto('/');
    await reportePage.abrirModulo();
  });

  test('AE-100: Verificar la funcionalidad del campo Usuario [Alta | Funcional]', async () => {
    await reportePage.seleccionarUsuario('6');
    const valor = await reportePage.selectUsuario.inputValue();
    expect(valor).toBe('6');
  });
test('AE-101: Verificar la funcionalidad del campo Fecha Inicio [Alta | Funcional]', async () => {
  await reportePage.seleccionarUsuario('1');
  await reportePage.ingresarFechas('01/10/2025', '');
  const fechaInicio = await reportePage.inputFechaInicio.inputValue();
  expect(fechaInicio.trim()).toBe('01/10/2025');
});

test('AE-102: Verificar la funcionalidad del campo Fecha Fin [Alta | Funcional]', async () => {
  await reportePage.seleccionarUsuario('1');
  await reportePage.ingresarFechas('', '27/10/2025');
  const fechaFin = await reportePage.inputFechaFin.inputValue();
  expect(fechaFin.trim()).toBe('27/10/2025');
});

  test('AE-103: Verificar la funcionalidad del botón Limpiar [Baja | Funcional]', async () => {
    await reportePage.seleccionarUsuario('1');
    await reportePage.ingresarFechas('01/10/2025', '27/10/2025');
    await reportePage.limpiarFormulario();

    await expect(reportePage.selectUsuario).toHaveValue('');
    await expect(reportePage.inputFechaInicio).toHaveValue('');
    await expect(reportePage.inputFechaFin).toHaveValue('');
  });

  test('AE-104: Verificar la funcionalidad del botón Generar PDF [Alta | Funcional]', async ({ page }) => {
    await reportePage.seleccionarUsuario('1');
    await reportePage.ingresarFechas('01/10/2025', '27/10/2025');
    const [descarga] = await Promise.all([
      page.waitForEvent('download'),
      reportePage.generarReporte()
    ]);
    const nombreArchivo = await descarga.suggestedFilename();
    expect(nombreArchivo).toContain('.pdf');
  });

  test('AE-105: Validar que la fecha fin no sea anterior a la fecha inicio [Alta | Funcional]', async ({ page }) => {
    await reportePage.seleccionarUsuario('6');
    await reportePage.ingresarFechas('27/10/2025', '01/10/2025');
    await reportePage.generarReporte();
    await expect(reportePage.toastError).toBeVisible();
  });

  test('AE-106: Validar mensaje de error al intentar generar reporte con datos vacios', async () => {
    await reportePage.limpiarFormulario();
    await reportePage.generarReporte();
    await expect(reportePage.toastError).toBeVisible();
  });
});
