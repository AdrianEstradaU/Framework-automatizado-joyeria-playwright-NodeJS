const { test, expect } = require('@playwright/test');
const { ReporteEgresoPage } = require('../../pages/ReporteEgresosPage');
const logger = require("../../utils/loggers.js");
const { allure } = require('allure-playwright');

test.describe('Módulo: Reportes - Egresos por Fecha', () => {
  let reportePage;

  test.beforeEach(async ({ page }) => {
    reportePage = new ReporteEgresoPage(page);
    await page.goto('/');
    logger.info('Página principal cargada correctamente.');
    logger.info('Ingresando al módulo Reportes - Egresos por Fecha...');
    await reportePage.abrirModulo();
    logger.info('Módulo Reportes - Egresos por Fecha abierto exitosamente.');
  });

  test('AE-TC-107. Verificar la funcionalidad del campo Usuario en Reporte de Egresos @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-107: Verificar la funcionalidad del campo Usuario en Reporte de Egresos.');
    logger.info('Seleccionando usuario con ID = 6.');

    await reportePage.seleccionarUsuario('6');

    const valor = await reportePage.selectUsuario.inputValue();
    logger.info(`Valor obtenido del campo Usuario: ${valor}`);

    expect(valor).toBe('6');
    logger.info('Campo Usuario funciona correctamente.');
    logger.info('AE-TC-107 finalizado exitosamente.');
  });

  test('AE-TC-108. Verificar la funcionalidad del campo Fecha Inicio en Reporte de Egresos @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-108: Verificar la funcionalidad del campo Fecha Inicio en Reporte de Egresos.');
    logger.info('Seleccionando usuario con ID = 1 e ingresando fecha de inicio.');

    await reportePage.seleccionarUsuario('6');
    await reportePage.ingresarFechas('03/11/2025', '');

    const fechaInicio = await reportePage.inputFechaInicio.inputValue();
    logger.info(`Fecha de inicio ingresada: ${fechaInicio}`);

    expect(fechaInicio.trim()).toBe('03/11/2025');
    logger.info('Campo Fecha Inicio funciona correctamente.');
    logger.info('AE-TC-108 finalizado exitosamente.');
  });

  test('AE-TC-109. Verificar la funcionalidad del campo Fecha Fin en Reporte de Egresos @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-109: Verificar la funcionalidad del campo Fecha Fin en Reporte de Egresos.');
    logger.info('Seleccionando usuario con ID = 1 e ingresando fecha fin.');

    await reportePage.seleccionarUsuario('1');
    await reportePage.ingresarFechas('', '27/10/2025');

    const fechaFin = await reportePage.inputFechaFin.inputValue();
    logger.info(`Fecha fin ingresada: ${fechaFin}`);

    expect(fechaFin.trim()).toBe('27/10/2025');
    logger.info('Campo Fecha Fin funciona correctamente.');
    logger.info('AE-TC-109 finalizado exitosamente.');
  });

  test('AE-TC-110. Verificar la funcionalidad del botón Limpiar en Reporte de Egresos @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-110: Verificar la funcionalidad del botón Limpiar en Reporte de Egresos.');
    logger.info('Llenando campos de usuario y fechas antes de limpiar.');

    await reportePage.seleccionarUsuario('1');
    await reportePage.ingresarFechas('01/10/2025', '27/10/2025');
    await reportePage.limpiarFormulario();
    logger.info('Se ejecutó el botón Limpiar.');

    await expect(reportePage.selectUsuario).toHaveValue('');
    await expect(reportePage.inputFechaInicio).toHaveValue('');
    await expect(reportePage.inputFechaFin).toHaveValue('');
    logger.info('Todos los campos fueron limpiados correctamente.');
    logger.info('AE-TC-110 finalizado exitosamente.');
  });

  test('AE-TC-111. Verificar la funcionalidad del botón Generar PDF en Reporte de Egresos @Smoke @Regression @positive', async ({ page }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('AE-TC-111: Verificar la funcionalidad del botón Generar PDF en Reporte de Egresos.');
    logger.info('Llenando campos requeridos antes de generar el reporte.');

    await reportePage.seleccionarUsuario('1');
    await reportePage.ingresarFechas('01/10/2025', '27/10/2025');

    const [descarga] = await Promise.all([
      page.waitForEvent('download'),
      reportePage.generarReporte()
    ]);

    const nombreArchivo = await descarga.suggestedFilename();
    logger.info(`Archivo generado: ${nombreArchivo}`);

    expect(nombreArchivo).toContain('.pdf');
    logger.info('El reporte PDF se generó correctamente.');
    logger.info('AE-TC-111 finalizado exitosamente.');
  });

  test('AE-TC-112. Validar que la fecha fin no sea anterior a la fecha inicio en Reporte de Egresos @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('high');
    logger.info('AE-TC-112: Validar que la fecha fin no sea anterior a la fecha inicio en Reporte de Egresos.');
    logger.info('Intentando generar reporte con fechas inválidas.');
    test.fail(true, 'BUG-003: Sistema no valida fecha fin < fecha inicio en Egresos');
    await reportePage.seleccionarUsuario('6');
    await reportePage.ingresarFechas('27/10/2025', '01/10/2025');
    await reportePage.generarReporte();

    await expect(reportePage.toastError).toBeVisible();
    logger.info('Se mostró mensaje de error correctamente por fechas inválidas.');
    logger.info('AE-TC-112 finalizado exitosamente.');
  });

  test('AE-TC-113. Validar mensaje de error al intentar generar reporte con datos vacíos en Reporte de Egresos @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('high');
    logger.info('AE-TC-113: Validar mensaje de error al intentar generar reporte con datos vacíos en Reporte de Egresos.');
    logger.info('Limpiando campos e intentando generar el reporte.');

    await reportePage.limpiarFormulario();
    await reportePage.generarReporte();

    await expect(reportePage.toastError).toBeVisible();
    logger.info('Se mostró mensaje de error correctamente al generar reporte sin datos.');
    logger.info('AE-TC-113 finalizado exitosamente.');
  });
});
