const { BasePage } = require('./BasePage');

class ReporteEgresoPage extends BasePage {
  constructor(page) {
    super(page);

   
    this.moduloJoyeria = page.locator('#menu-padre-16 > a span:has-text("Módulo de Joyeria")');
    this.menuProcesos = page.locator('#menu-padre-19 > a:has-text("Reportes")');
    this.submenuEgresos = page.locator('#tab-28:has-text("Egresos por Fecha")');
    this.formReporteEngreso = page.locator('#form_reporte_egreso');

    this.selectUsuario = page.locator('select[name="reporte_egreso[id_usuario]"]');
    this.inputFechaInicio = page.locator('input[name="reporte_egreso[fecha_inicio]"]');
    this.inputFechaFin = page.locator('input[name="reporte_egreso[fecha_fin]"]');

    this.btnLimpiar = page.locator('button:has-text("Limpiar")');
    this.btnGenerar = page.locator('#boton_guardar');
    this.toastError = page.locator('.overhang-message', { hasText: 'El formato JSON solicitado ha fallado' });
  }



  async abrirModulo() {
    console.log(' Abriendo módulo de Compras...');
    await this.moduloJoyeria.waitFor({ state: 'visible', timeout: 10000 });
    await this.navigateMenu(this.moduloJoyeria, this.menuProcesos, this.submenuEgresos);
    await this.page.waitForTimeout(1000);
  }

 async seleccionarUsuario(nombreOValor) {
  console.log(' Seleccionando usuario en reporte...');
  await this.selectUsuario.waitFor({ state: 'visible', timeout: 20000 });
  await this.page.waitForTimeout(1500);
  const opciones = await this.page.$$eval(
    'select[name="reporte_egreso[id_usuario]"] option',
    opts => opts.map(o => o.textContent.trim())
  );
  console.log(' Opciones disponibles:', opciones);

  if (!opciones || opciones.length <= 1) {
    throw new Error('El select de usuarios no tiene opciones cargadas.');
  }
  await this.selectUsuario.selectOption({ label: nombreOValor }).catch(async () => {
    await this.selectUsuario.selectOption(nombreOValor);
  });

  console.log(`Usuario "${nombreOValor}" seleccionado correctamente.`);
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

module.exports = { ReporteEgresoPage };
