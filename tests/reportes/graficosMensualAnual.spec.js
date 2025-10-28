const { test, expect } = require('@playwright/test');
const { GraficoMensualAnualPage } = require('../../pages/GraficosMensualAnualPage');

test.describe('Módulo: Reportes - Gráficos Mensual/Anual', () => {
  let graficoPage;

  test.beforeEach(async ({ page }) => {
    graficoPage = new GraficoMensualAnualPage(page);
    await page.goto('/');
    await graficoPage.abrirModulo();
  });

  test('AE-114: Verificar funcionalidad de campo Tipo de Gráfico por Gestión [Media | Funcional]', async () => {
    await graficoPage.seleccionarTipoGrafico('Por Gestión');
    await graficoPage.seleccionarGestion('3'); // 2025
    await graficoPage.esperarGraficoAnio();
  });

  test('AE-115: Verificar funcionalidad de campo Tipo de Gráfico por Mes [Media | Funcional]', async () => {
    await graficoPage.seleccionarTipoGrafico('Por Mes');
    await graficoPage.seleccionarGestion('3'); // 2025
    await graficoPage.seleccionarMes('10'); // Octubre
    await graficoPage.esperarGraficoMes();
  });
});