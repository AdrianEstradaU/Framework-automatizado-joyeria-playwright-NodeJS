const { BasePage } = require('./BasePage');

class ReporteIngresosPage extends BasePage {
  constructor(page) {
    super(page);

   
    this.moduloJoyeria = page.locator('#menu-padre-16 > a span:has-text("Módulo de Joyeria")');
    this.menuProcesos = page.locator('#menu-padre-19 > a:has-text("Reportes")');
    this.submenuIngresos = page.locator('#tab-27:has-text("Ingresos por Fecha")');
    this.formReporteIngreso = page.locator('#form_reporte_ingreso');

    this.selectUsuario = page.locator('select[name="reporte_ingreso[id_usuario]"]');
    this.inputFechaInicio = page.locator('input[name="reporte_ingreso[fecha_inicio]"]');
    this.inputFechaFin = page.locator('input[name="reporte_ingreso[fecha_fin]"]');

    this.btnLimpiar = page.locator('button:has-text("Limpiar")');
    this.btnGenerar = page.locator('#boton_guardar');
    this.toastError = page.locator('.overhang-message', { hasText: 'El formato JSON solicitado ha fallado' });
  }


  async abrirModulo() {
    await this.click(this.moduloJoyeria);
    await this.click(this.menuProcesos);
    await this.click(this.submenuIngresos);
  }

  async seleccionarUsuario(nombreOValor) {
    await this.selectUsuario.selectOption(nombreOValor);
  }

 async ingresarFechas(fechaInicio, fechaFin) {
  if (fechaInicio) {
    await this.inputFechaInicio.click();
    await this.inputFechaInicio.fill(''); 
    await this.inputFechaInicio.pressSequentially(fechaInicio, { delay: 50 });
  }
  if (fechaFin) {
    await this.inputFechaFin.click();
    await this.inputFechaFin.fill('');
    await this.inputFechaFin.pressSequentially(fechaFin, { delay: 50 });
  }
}

  async limpiarFormulario() {
    await this.click(this.btnLimpiar);
  }

  async generarReporte() {
    await this.click(this.btnGenerar);
  }
}

module.exports = { ReporteIngresosPage };
