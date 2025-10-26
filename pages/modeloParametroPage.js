const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class ModuloPage extends BasePage {
  constructor(page, config) {
    super(page);

    // Configuración específica del módulo
    this.moduloJoyeria = page.locator(config.moduloSelector);
    this.menuParametros = page.locator(config.menuSelector);
    this.submenu = page.locator(config.submenuSelector);

    this.btnCrear = page.locator(config.btnCrear || 'button[name="Crear"]');
    this.btnGuardar = page.locator(config.btnGuardar || '#boton_guardar');
    this.btnEditar = page.locator(config.btnEditar || 'button[name="Editar"]');
    this.btnEliminar = page.locator(config.btnEliminar || 'button[name="Eliminar"]');
    this.btnActualizar = page.locator(config.btnActualizar || 'button[name="Actualizar"]');

    this.inputNombre = page.locator(config.inputNombre);
    this.textareaDescripcion = page.locator(config.textareaDescripcion);
    this.tabla = page.locator(config.tabla);

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
    await this.navigateMenu(this.moduloJoyeria, this.menuParametros, this.submenu);
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
  await this.inputNombre.waitFor({ state: 'visible', timeout: 10000 });
  await this.fill(this.inputNombre, nuevoNombre);
  await this.fill(this.textareaDescripcion, nuevaDescripcion);
  await this.btnGuardar.scrollIntoViewIfNeeded();
  await this.click(this.btnGuardar);
  await this.page.waitForLoadState('networkidle');
}

 async seleccionarFila(nombre) {
  const fila = this.tabla.locator(`tr:has-text("${nombre}")`).first();
  await fila.waitFor({ state: 'visible', timeout: 10000 });
  await fila.scrollIntoViewIfNeeded();
  await fila.click();
  await this.page.waitForTimeout(500);

  const visible = await fila.isVisible();
  if (!visible) {
    throw new Error(`⚠️ No se encontró la fila con nombre "${nombre}" después del clic`);
  }

  await this.page.waitForLoadState('networkidle');
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
}

module.exports = { ModuloPage };
