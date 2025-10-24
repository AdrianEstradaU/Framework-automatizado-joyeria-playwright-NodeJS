const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class TiposIngresoPage extends BasePage {
  constructor(page) {
    super(page);

   
    this.moduloJoyeria = page.locator('#menu-padre-16 > a span:has-text("Módulo de Joyeria")');
    this.menuParametros = page.locator('#menu-padre-17 > a:has-text("Parámetros")');
    this.submenuTiposIngreso = page.locator('#tab-21:has-text("Tipos de Ingreso")');

    
    this.btnCrear = page.locator('button[name="Crear"]');
    this.btnGuardar = page.locator('#boton_guardar');
    this.btnEditar = page.locator('button[name="Editar"]');
    this.btnEliminar = page.locator('button[name="Eliminar"]');
    this.btnActualizar = page.locator('button[name="Actualizar"]');

   
    this.inputNombre = page.locator('input[name="joy_tipo_ingreso[nombre_tipo_ingreso]"]');
    this.textareaDescripcion = page.locator('textarea[name="joy_tipo_ingreso[descripcion_tipo_ingreso]"]');

    
    this.tabla = page.locator('#tipo_ingreso tbody');

    
    this.toastMessage = page.locator('.overhang-message');
    this.toastExito = page.locator('.overhang-message', { hasText: 'El proceso se ha realizado exitosamente' });
    this.toastJsonError = page.locator('.overhang-message', { hasText: 'El formato JSON solicitado ha fallado.' });
    this.toastCamposRequeridos = page.locator('.overhang-message', { hasText: 'Complete los campos requeridos' });

   
    this.mensajeEliminar = page.locator('.overhang-message', { hasText: '¿Desea eliminar el registro seleccionado?' });
    this.btnConfirmarEliminar = page.locator('.overhang-yes-option');
    this.btnCancelarEliminar = page.locator('.overhang-no-option');
  }

  
  async abrirModulo() {
    await this.moduloJoyeria.waitFor({ state: 'visible', timeout: 10000 });
    await this.navigateMenu(this.moduloJoyeria, this.menuParametros, this.submenuTiposIngreso);
    await this.tabla.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  
  async crear(nombre, descripcion) {
    await this.click(this.btnCrear);
    await this.waitForVisible(this.inputNombre);
    await this.fill(this.inputNombre, nombre);
    await this.fill(this.textareaDescripcion, descripcion);
    await this.click(this.btnGuardar);
    await this.page.waitForLoadState('networkidle');
  }

  
  async editar(nombreBuscar, nuevoNombre, nuevaDescripcion) {
    await this.seleccionarFila(nombreBuscar);
    await this.click(this.btnEditar);
    await this.waitForVisible(this.inputNombre);

    await this.inputNombre.scrollIntoViewIfNeeded();
    await this.textareaDescripcion.scrollIntoViewIfNeeded();

    await this.fill(this.inputNombre, nuevoNombre);
    await this.fill(this.textareaDescripcion, nuevaDescripcion);

    await this.btnGuardar.scrollIntoViewIfNeeded();
    await this.click(this.btnGuardar);
    await this.page.waitForLoadState('networkidle');
  }


  async confirmarEliminacion() {
    await this.mensajeEliminar.waitFor({ state: 'visible', timeout: 5000 });
    await this.btnConfirmarEliminar.scrollIntoViewIfNeeded();
    await this.click(this.btnConfirmarEliminar);
    await this.toastExito.waitFor({ state: 'visible', timeout: 8000 });
  }

  async cancelarEliminacion() {
    await this.mensajeEliminar.waitFor({ state: 'visible', timeout: 5000 });
    await this.click(this.btnCancelarEliminar);
  }

  async validarToast(mensajeEsperado = 'El proceso se ha realizado exitosamente') {
    try {
      await this.toastMessage.waitFor({ state: 'visible', timeout: 8000 });
      const texto = await this.toastMessage.textContent();
      return texto.includes(mensajeEsperado);
    } catch {
      return false;
    }
  }

  async validarErrorJson() {
    try {
      await this.toastJsonError.waitFor({ state: 'visible', timeout: 8000 });
      const texto = await this.toastJsonError.textContent();
      return texto.includes('El formato JSON solicitado ha fallado.');
    } catch {
      return false;
    }
  }

  
  async seleccionarFila(nombre) {
    const fila = this.tabla.locator(`tr:has-text("${nombre}")`).first();
    await fila.waitFor({ state: 'visible', timeout: 8000 });
    await fila.scrollIntoViewIfNeeded();
    await fila.click();
    await this.page.waitForFunction(
      (text) => {
        const row = [...document.querySelectorAll('tr.selected')].find(r => r.textContent.includes(text));
        return !!row;
      },
      nombre,
      { timeout: 8000 }
    );
    await this.page.waitForLoadState('networkidle');
  }

  async seleccionarFilaEspecial(nombre) {
    const fila = this.tabla.locator(`tr:has-text("${nombre}")`).first();
    await fila.waitFor({ state: 'visible', timeout: 15000 });
    await fila.scrollIntoViewIfNeeded();
    await fila.click();
    await this.page.waitForTimeout(500);
    await expect(fila).toBeVisible();
  }
}

module.exports = { TiposIngresoPage };
