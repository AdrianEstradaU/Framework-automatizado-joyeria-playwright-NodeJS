const { test, expect } = require('@playwright/test');
const { GraficosMensualAnualPage } = require('../../pages/GraficosMensualAnualPage.js');
const logger = require("../../utils/loggers.js");
const { allure } = require('allure-playwright');

test.describe('Módulo: Reportes - Gráficos Mensual/Anual', () => {
  let graficoPage;

  test.beforeEach(async ({ page }) => {
    graficoPage = new GraficoMensualAnualPage(page);
    await page.goto('/');
    logger.info('Página principal cargada correctamente.');
    logger.info('Ingresando al módulo Reportes - Gráficos Mensual/Anual...');
    await graficoPage.abrirModulo();
    logger.info('Módulo Reportes - Gráficos Mensual/Anual abierto exitosamente.');
  });

  test('AE-TC-114. Verificar funcionalidad de campo Tipo de Gráfico por Gestión @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-114: Verificar funcionalidad de campo Tipo de Gráfico por Gestión.');
    logger.info('Seleccionando tipo de gráfico "Por Gestión".');

    await graficoPage.seleccionarTipoGrafico('Por Gestión');
    logger.info('Tipo de gráfico seleccionado: Por Gestión.');

    await graficoPage.seleccionarGestion('3'); // Gestión 2025
    logger.info('Gestión seleccionada: 2025.');

    await graficoPage.esperarGraficoAnio();
    logger.info('Gráfico anual cargado correctamente.');

    logger.info('AE-TC-114 finalizado exitosamente.');
  });

  test('AE-TC-115. Verificar funcionalidad de campo Tipo de Gráfico por Mes @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-115: Verificar funcionalidad de campo Tipo de Gráfico por Mes.');
    logger.info('Seleccionando tipo de gráfico "Por Mes".');

    await graficoPage.seleccionarTipoGrafico('Por Mes');
    logger.info('Tipo de gráfico seleccionado: Por Mes.');

    await graficoPage.seleccionarGestion('3'); // Gestión 2025
    logger.info('Gestión seleccionada: 2025.');

    await graficoPage.seleccionarMes('11'); // 
    logger.info('Mes seleccionado: Noviembre (11).');

    await graficoPage.esperarGraficoMes();
    logger.info('Gráfico mensual cargado correctamente.');

    logger.info('AE-TC-115 finalizado exitosamente.');
  });
});
