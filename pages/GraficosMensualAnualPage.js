const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class GraficoMensualAnualPage extends BasePage {
  constructor(page) {
    super(page);

    this.moduloJoyeria = page.locator('#menu-padre-16 > a span:has-text("Módulo de Joyeria")');
    this.menuProcesos = page.locator('#menu-padre-19 > a:has-text("Reportes")');
    this.submenuGraficos = page.locator('#tab-29:has-text("Gráficos Mensual/Anual")');

    this.tipoGrafico = page.locator('select[name="joy_gestion[tipo]"]');
    this.gestion = page.locator('select[name="joy_gestion[id_gestion]"]');
    this.mes = page.locator('select[name="joy_gestion[id_mes]"]');
    this.graficoAnio = page.locator('#grafico_anio');
    this.graficoMes = page.locator('#grafico_mes');
    this.canvasBar = page.locator('#barChart');
    this.canvasArea = page.locator('#AreaChart');
  }

  async abrirModulo() {
    await this.click(this.moduloJoyeria);
    await this.click(this.menuProcesos);
    await this.click(this.submenuGraficos);
  }

  async seleccionarSelect2(selectLocator, valor) {
    await selectLocator.evaluate((select, val) => {
      select.value = val;
      if (window.jQuery) {
        window.jQuery(select).trigger('change');
      }
    }, valor);
    await this.page.waitForTimeout(800);
  }

  async seleccionarTipoGrafico(texto) {
    const valor = texto === 'Por Gestión' ? 'gestion' : 'mes';
    await this.seleccionarSelect2(this.tipoGrafico, valor);
  }

  async seleccionarGestion(valor) {
    await this.seleccionarSelect2(this.gestion, valor);
  }

  async seleccionarMes(valor) {
    await this.seleccionarSelect2(this.mes, valor);
  }

  async esperarGraficoAnio() {
    await this.page.waitForFunction(
      () => {
        const el = document.querySelector('#grafico_anio');
        return el && el.style.display !== 'none';
      },
      { timeout: 10000 }
    );
    
    await expect(this.graficoAnio).toBeVisible();
    await expect(this.canvasBar).toBeVisible();
  }

  async esperarGraficoMes() {
    await this.page.waitForFunction(
      () => {
        const el = document.querySelector('#grafico_mes');
        return el && el.style.display !== 'none';
      },
      { timeout: 10000 }
    );
    
    await expect(this.graficoMes).toBeVisible();
    await expect(this.canvasArea).toBeVisible();
  }
}

module.exports = { GraficoMensualAnualPage };