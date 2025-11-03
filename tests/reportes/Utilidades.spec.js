const { test, expect } = require('@playwright/test');
const { UtilidadesPage } = require('../../pages/UtilidadesPage');
const logger = require("../../utils/loggers.js");
const { allure } = require('allure-playwright');

test.describe('Módulo: Reporte de Utilidades', () => {
  let utilidadesPage;

  test.beforeEach(async ({ page }) => {
    utilidadesPage = new UtilidadesPage(page);
    await page.goto('/');
    logger.info('Página principal cargada correctamente.');
    logger.info('Ingresando al módulo Reporte de Utilidades...');
    await utilidadesPage.abrirModulo();
    logger.info('Módulo Reporte de Utilidades abierto exitosamente.');
  });

  test('AE-TC-116. Verificar la funcionalidad del campo Fecha Inicio @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-116: Verificar la funcionalidad del campo Fecha Inicio.');

    await utilidadesPage.llenarFechaInicio('01/10/2025');
    logger.info('Fecha inicio ingresada: 01/10/2025.');

    const valor = await utilidadesPage.obtenerValorFechaInicio();
    expect(valor).toBe('01/10/2025');
    logger.info('Campo Fecha Inicio validado correctamente.');

    logger.info('AE-TC-116 finalizado exitosamente.');
  });

  test('AE-TC-117. Verificar la funcionalidad del campo Fecha Fin @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-117: Verificar la funcionalidad del campo Fecha Fin.');

    await utilidadesPage.llenarFechaFin('10/10/2025');
    logger.info('Fecha fin ingresada: 10/10/2025.');

    const valor = await utilidadesPage.obtenerValorFechaFin();
    expect(valor).toBe('10/10/2025');
    logger.info('Campo Fecha Fin validado correctamente.');

    logger.info('AE-TC-117 finalizado exitosamente.');
  });

  test('AE-TC-118. Validar que la Fecha Fin no pueda ser anterior a la Fecha Inicio @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('AE-TC-118: Validar restricción de fechas.');

    await utilidadesPage.llenarFechaInicio('10/10/2025');
    await utilidadesPage.llenarFechaFin('01/10/2025');
    logger.info('Fecha inicio: 10/10/2025 | Fecha fin: 01/10/2025.');

    await utilidadesPage.clickGenerar();
    logger.info('Intentando generar reporte con fechas inválidas.');

    await expect(utilidadesPage.toastError).toBeVisible();
    logger.info('Mensaje de error por fechas inválidas mostrado correctamente.');

    logger.info('AE-TC-118 finalizado exitosamente.');
  });

  test('AE-TC-119. Verificar funcionalidad del botón Limpiar @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info('AE-TC-119: Verificar funcionalidad del botón Limpiar.');

    await utilidadesPage.llenarFechaInicio('01/10/2025');
    await utilidadesPage.llenarFechaFin('28/10/2025');
    logger.info('Fechas ingresadas: inicio=01/10/2025, fin=28/10/2025.');

    await utilidadesPage.clickLimpiar();
    logger.info('Se presionó el botón Limpiar.');

    const fechaInicio = await utilidadesPage.obtenerValorFechaInicio();
    const fechaFin = await utilidadesPage.obtenerValorFechaFin();
    expect(fechaInicio).toBe('');
    expect(fechaFin).toBe('');

    logger.info('Campos de fecha limpiados correctamente.');
    logger.info('AE-TC-119 finalizado exitosamente.');
  });

  test('AE-TC-120. Verificar funcionalidad del botón Generar @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('AE-TC-120: Verificar funcionalidad del botón Generar.');

    await utilidadesPage.llenarFechaInicio('01/10/2025');
    await utilidadesPage.llenarFechaFin('28/10/2025');
    logger.info('Fechas ingresadas correctamente.');

    await utilidadesPage.clickGenerar();
    logger.info('Se hizo clic en el botón Generar reporte.');

    await expect(utilidadesPage.resultadoUtilidad).toContainText('UTILIDAD', { timeout: 15000 });
    logger.info('Reporte generado y validado exitosamente.');

    logger.info('AE-TC-120 finalizado exitosamente.');
  });

  test('AE-TC-121. Validar que no se permita generar reporte con campos de fechas vacíos @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('high');
    logger.info('AE-TC-121: Validar restricción al generar reporte sin fechas.');

    await utilidadesPage.llenarFechaInicio('01/10/2025');
    await utilidadesPage.llenarFechaFin('28/10/2025');
    await utilidadesPage.clickLimpiar();
    logger.info('Campos de fecha vaciados correctamente.');

    const fechaInicio = await utilidadesPage.obtenerValorFechaInicio();
    const fechaFin = await utilidadesPage.obtenerValorFechaFin();
    expect(fechaInicio).toBe('');
    expect(fechaFin).toBe('');

    await utilidadesPage.clickGenerar();
    logger.info('Intentando generar reporte sin fechas.');

    await expect(utilidadesPage.mensajeErrorFechaInicio).toBeVisible();
    await expect(utilidadesPage.mensajeErrorFechaInicio).toHaveText('Este campo es obligatorio');
    await expect(utilidadesPage.mensajeErrorFechaFin).toBeVisible();
    await expect(utilidadesPage.mensajeErrorFechaFin).toHaveText('Este campo es obligatorio');

    logger.info('Mensajes de validación por campos vacíos mostrados correctamente.');
    logger.info('AE-TC-121 finalizado exitosamente.');
  });
});
