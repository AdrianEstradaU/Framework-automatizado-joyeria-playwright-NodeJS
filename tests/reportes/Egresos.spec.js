const { test, expect } = require('@playwright/test');
const { ReporteEgresoPage } = require('../../pages/ReporteEgresosPage');

test.describe('Módulo: Reportes - Egresos por Fecha', () => {
  let reportePage;

  test.beforeEach(async ({ page }) => {
    reportePage = new ReporteEgresoPage(page);
    await page.goto('/');
    await reportePage.abrirModulo();
  });

  test('AE-107: Verificar la funcionalidad del campo Usuario en Reporte de Egresos ', async () => {
    await reportePage.seleccionarUsuario('6');
    const valor = await reportePage.selectUsuario.inputValue();
    expect(valor).toBe('6');
  });

  test('AE-108: Verificar la funcionalidad del campo Fecha Inicio en Reporte de Egresos ', async () => {
    await reportePage.seleccionarUsuario('1');
    await reportePage.ingresarFechas('01/10/2025', '');
    const fechaInicio = await reportePage.inputFechaInicio.inputValue();
    expect(fechaInicio.trim()).toBe('01/10/2025');
  });

  test('AE-109: Verificar la funcionalidad del campo Fecha Fin en Reporte de Egresos ', async () => {
    await reportePage.seleccionarUsuario('1');
    await reportePage.ingresarFechas('', '27/10/2025');
    const fechaFin = await reportePage.inputFechaFin.inputValue();
    expect(fechaFin.trim()).toBe('27/10/2025');
  });

  test('AE-110: Verificar la funcionalidad del botón Limpiar en Reporte de Egresos ', async () => {
    await reportePage.seleccionarUsuario('1');
    await reportePage.ingresarFechas('01/10/2025', '27/10/2025');
    await reportePage.limpiarFormulario();

    await expect(reportePage.selectUsuario).toHaveValue('');
    await expect(reportePage.inputFechaInicio).toHaveValue('');
    await expect(reportePage.inputFechaFin).toHaveValue('');
  });

  test('AE-111: Verificar la funcionalidad del botón Generar PDF en Reporte de Egresos ', async ({ page }) => {
    await reportePage.seleccionarUsuario('1');
    await reportePage.ingresarFechas('01/10/2025', '27/10/2025');
    const [descarga] = await Promise.all([
      page.waitForEvent('download'),
      reportePage.generarReporte()
    ]);
    const nombreArchivo = await descarga.suggestedFilename();
    expect(nombreArchivo).toContain('.pdf');
  });

  test('AE-112: Validar que la fecha fin no sea anterior a la fecha inicio en Reporte de Egresos ', async ({ page }) => {
    await reportePage.seleccionarUsuario('6');
    await reportePage.ingresarFechas('27/10/2025', '01/10/2025');
    await reportePage.generarReporte();
    await expect(reportePage.toastError).toBeVisible();
  });

  test('AE-113: Validar mensaje de error al intentar generar reporte con datos vacíos en Reporte de Egresos', async () => {
    await reportePage.limpiarFormulario();
    await reportePage.generarReporte();
    await expect(reportePage.toastError).toBeVisible();
  });
});
