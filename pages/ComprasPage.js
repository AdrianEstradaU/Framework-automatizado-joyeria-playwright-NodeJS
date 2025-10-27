const { BasePage } = require('./BasePage');
const { ComprasData } = require('../data/ComprasData');

class ComprasPage extends BasePage {
  constructor(page) {
    super(page);

    this.moduloJoyeria = page.locator('#menu-padre-16 > a span:has-text("Módulo de Joyeria")');
    this.menuProcesos = page.locator('#menu-padre-18 > a:has-text("Procesos")');
    this.submenuCompras = page.locator('#tab-26:has-text("Compras")');
    this.btnOpciones = page.locator('button[name="Otras opciones"]');
    this.btnCrear = page.locator('button[name="Crear"]');
    this.btnGuardar = page.locator('#boton_guardar');
    this.btnEditar = page.locator('button[name="Editar"]');
    this.btnEliminar = page.locator('button[name="Eliminar"]');
    this.btnActualizar = page.locator('button[name="Actualizar"]');
    this.btnCerrar = page.locator('button:has-text("Cerrar")');
    this.btnConfirmarEliminar = page.locator('.overhang-yes-option');
    this.btnCancelarEliminar = page.locator('.overhang-no-option');
    this.btnAnterior = page.locator('#egreso_previous');
    this.btnSiguiente = page.locator('#egreso_next');

    this.tabla = page.locator('#egreso tbody');
    this.buscarCompras = page.locator('#egreso_filter input');

    this.descripcion = page.locator("[name='joy_egreso[descripcion_egreso]']");
    this.precio = page.locator("[name='joy_egreso[precio_egreso]']");
    this.cantidad = page.locator("[name='joy_egreso[cantidad]']");
    this.tipoEgreso = page.locator("[name='joy_egreso[id_tipo_egreso]']");
    this.proveedor = page.locator("[name='joy_egreso[id_proveedor]']");
    this.tipoProducto = page.locator("[name='joy_egreso[id_tipo_producto]']");
    this.subirImagen = page.locator("[name='joy_egreso[ruta_imagen]']");

    this.errorDescripcion = page.locator('#joy_egreso\\[descripcion_egreso\\]-error');
    this.errorPrecio = page.locator('#joy_egreso\\[precio_egreso\\]-error');
    this.errorCantidad = page.locator('#joy_egreso\\[cantidad\\]-error');
    this.errorTipoEgreso = page.locator('#joy_egreso\\[id_tipo_egreso\\]-error');
    this.errorProveedor = page.locator('#joy_egreso\\[id_proveedor\\]-error');
    this.errorTipoProducto = page.locator('#joy_egreso\\[id_tipo_producto\\]-error');

    this.toastExito = page.locator('.overhang-message', { hasText: 'El proceso se ha realizado exitosamente' });
    this.toastError = page.locator('.overhang-message', { hasText: 'El formato JSON solicitado ha fallado' });
    this.mensajeEliminar = page.locator('.overhang-message', { hasText: '¿Desea eliminar el registro seleccionado?' });
  }

  async abrirModulo() {
    console.log('Abriendo módulo de Compras...');
    await this.moduloJoyeria.waitFor({ state: 'visible', timeout: 10000 });
    await this.navigateMenu(this.moduloJoyeria, this.menuProcesos, this.submenuCompras);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async selectOptionSelect2ByValue(locator, text) {
    if (!text) return;

    try {
      const name = await locator.getAttribute('name');

      const success = await this.page.evaluate(({ name, text }) => {
        const select = document.querySelector(`[name="${name}"]`);
        if (!select) return false;

        const option = Array.from(select.options).find(opt => opt.text.trim().toUpperCase() === text.trim().toUpperCase());
        if (option) {
          select.value = option.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          if (window.$ && $(select).data('select2')) {
            $(select).val(option.value).trigger('change');
          }
          return true;
        }
        return false;
      }, { name, text });

      if (!success) console.warn(`No se encontró: ${text}`);
      await this.page.waitForTimeout(300);
    } catch (error) {
      console.warn(`Error: ${error.message}`);
    }
  }

  /**
   * Llena el campo cantidad con manejo especial para valores negativos
   */
  async fillCantidad(cantidad) {
    if (!cantidad) return;
    
    try {
      // Para valores negativos, usar evaluate para forzar el valor
      if (cantidad < 0) {
        await this.page.evaluate((val) => {
          const input = document.querySelector('[name="joy_egreso[cantidad]"]');
          if (input) {
            input.value = val;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, cantidad);
      } else {
        await this.cantidad.fill(cantidad.toString());
      }
      await this.page.waitForTimeout(300);
    } catch (error) {
      console.warn(`Error al llenar cantidad: ${error.message}`);
    }
  }

  /**
   * Llena el campo precio con manejo especial para valores negativos o texto
   */
  async fillPrecio(precio) {
    if (precio === undefined || precio === '') return;
    
    try {
      // Si es un número negativo o texto, usar evaluate
      if (typeof precio === 'string' || precio < 0) {
        await this.page.evaluate((val) => {
          const input = document.querySelector('[name="joy_egreso[precio_egreso]"]');
          if (input) {
            input.value = val;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, precio);
      } else {
        await this.precio.fill(precio.toString());
      }
      await this.page.waitForTimeout(300);
    } catch (error) {
      console.warn(`Error al llenar precio: ${error.message}`);
    }
  }

  async crearCompra(descripcion, precio, cantidad, tipoEgreso, proveedor, tipoProducto) {
    console.log('Iniciando creación de compra...');
    await this.click(this.btnCrear);
    await this.page.waitForTimeout(1000);

    if (descripcion) await this.descripcion.fill(descripcion);
    if (precio !== undefined && precio !== '') await this.fillPrecio(precio);
    if (cantidad) await this.fillCantidad(cantidad);
    if (tipoEgreso) await this.selectOptionSelect2ByValue(this.tipoEgreso, tipoEgreso);
    if (proveedor) await this.selectOptionSelect2ByValue(this.proveedor, proveedor);
    if (tipoProducto) await this.selectOptionSelect2ByValue(this.tipoProducto, tipoProducto);

    await this.click(this.btnGuardar);
  }

  async crearCompraRapida(descripcion, precio, opciones = {}) {
    const defaults = {
      cantidad: ComprasData.defaults.cantidad,
      tipoEgreso: ComprasData.defaults.tipoEgreso,
      proveedor: ComprasData.defaults.proveedor,
      tipoProducto: ComprasData.defaults.tipoProducto
    };
    const datos = { ...defaults, ...opciones };
    await this.crearCompra(
      descripcion,
      precio,
      datos.cantidad,
      datos.tipoEgreso,
      datos.proveedor,
      datos.tipoProducto
    );
  }

  async verificarCompraExiste(descripcion) {
    await this.page.waitForTimeout(500);
    const fila = this.tabla.locator(`tr:has(td:text-is("${descripcion}"))`);
    return (await fila.count()) > 0;
  }

  async eliminarCompra(descripcion) {
    const fila = this.tabla.locator(`tr:has(td:text-is("${descripcion}"))`);
    if (await fila.count() > 0) {
      await fila.locator('button[name="Eliminar"]').click();
      await this.mensajeEliminar.waitFor({ state: 'visible', timeout: 5000 });
      await this.click(this.btnConfirmarEliminar);
      await this.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    }
  }

  async isAnteriorDisabled() {
    return await this.btnAnterior.evaluate(node => node.classList.contains('disabled'));
  }

  async isSiguienteDisabled() {
    return await this.btnSiguiente.evaluate(node => node.classList.contains('disabled'));
  }
}

module.exports = { ComprasPage };