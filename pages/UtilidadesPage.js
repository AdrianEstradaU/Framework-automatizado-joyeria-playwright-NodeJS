const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class UtilidadesPage extends BasePage {
  constructor(page) {
    super(page);
    this.moduloJoyeria = page.locator('#menu-padre-16 > a span:has-text("Módulo de Joyeria")');
    this.menuProcesos = page.locator('#menu-padre-19 > a:has-text("Reportes")');
    this.submenuUtilidades = page.locator('#tab-30:has-text("Utilidades por Fecha")');
    
    this.formReporte = page.locator('#form_reporte_utilidad');
    this.fechaInicio = page.locator('input[name="reporte_utilidad[fecha_inicio]"]');
    this.fechaFin = page.locator('input[name="reporte_utilidad[fecha_fin]"]');
    this.btnLimpiar = page.locator('button:has-text("Limpiar")');
    this.btnGenerar = page.locator('#boton_guardar');
    this.resultadoUtilidad = page.locator('#resultado_utilidad');
    this.graficoPie = page.locator('#pieChart');
    this.cabeceraAviso = page.locator('#cabecera_reporte_utilidad');
    this.mensajeErrorFechaInicio = page.locator('em').filter({ hasText: 'Este campo es obligatorio' }).first();
    this.mensajeErrorFechaFin = page.locator('em').filter({ hasText: 'Este campo es obligatorio' }).last();
  }

  async abrirModulo() {
    await this.click(this.moduloJoyeria);
    await this.page.waitForTimeout(500);
    await this.click(this.menuProcesos);
    await this.page.waitForTimeout(500);
    await this.click(this.submenuUtilidades);
    await this.formReporte.waitFor({ state: 'visible' });
  }

  async llenarFechaInicio(fecha) {
    await this.fechaInicio.click();
    await this.fechaInicio.fill('');
    await this.fechaInicio.pressSequentially(fecha, { delay: 100 });
    await this.page.keyboard.press('Tab');
  }

  async llenarFechaFin(fecha) {
    await this.fechaFin.click();
    await this.fechaFin.fill('');
    await this.fechaFin.pressSequentially(fecha, { delay: 100 });
    await this.page.keyboard.press('Tab');
  }

  async clickLimpiar() {
    await this.btnLimpiar.click();
  }

  async clickGenerar() {
    await this.btnGenerar.click();
    await this.page.waitForTimeout(2000);
  }

  async obtenerValorFechaInicio() {
    const valor = await this.fechaInicio.inputValue();
    return valor.replace(/d\/mm\/yyyy$/i, '').trim();
  }

  async obtenerValorFechaFin() {
    const valor = await this.fechaFin.inputValue();
    return valor.replace(/d\/mm\/yyyy$/i, '').trim();
  }

  async esperarResultado() {
    await this.graficoPie.waitFor({ state: 'visible', timeout: 15000 });
  }

  async esperarCabeceraAviso() {
    await this.cabeceraAviso.waitFor({ state: 'visible' });
  }
}

module.exports = { UtilidadesPage };