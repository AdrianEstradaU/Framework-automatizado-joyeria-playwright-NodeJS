const { BasePage } = require('./BasePage');

class VentasPage extends BasePage {
  constructor(page) {
    super(page);

    // Menús y navegación
    this.moduloJoyeria = page.locator('#menu-padre-16 > a span:has-text("Módulo de Joyeria")');
    this.menuParametros = page.locator('#menu-padre-18 > a:has-text("Procesos")');
    this.submenu = page.locator('#tab-25:has-text("Ventas")');

    // Botones
    this.btnCrear = page.locator('button[name="Crear"]');
    this.btnGuardar = page.locator('#boton_guardar');
    this.btnEditar = page.locator('button[name="Editar"]');
    this.btnEliminar = page.locator('button[name="Eliminar"]');
    this.btnActualizar = page.locator('button[name="Actualizar"]');
    this.btnCerrar = page.locator("//button[text()='Cerrar']");
    this.btnConfirmarEliminar = page.locator('.overhang-yes-option');
    this.btnCancelarEliminar = page.locator('.overhang-no-option');
    this.btnAnterior = page.locator('#ingreso_previous');
    this.btnSiguiente = page.locator('#ingreso_next');

    // Tabla y búsqueda
    this.tabla = page.locator('#ingreso tbody');
    this.buscarVentas = page.locator('#ingreso_filter input');

    // Campos de formulario
    this.descripcion = page.locator("[name='joy_ingreso[descripcion_ingreso]']");
    this.precio = page.locator("[name='joy_ingreso[precio_ingreso]']");
    this.cantidad = page.locator("[name='joy_ingreso[cantidad]']");
    this.formaPago = page.locator("[name='joy_ingreso[id_forma_pago]']");
    this.tipoVenta = page.locator("[name='joy_ingreso[id_tipo_ingreso]']");
    this.tipoProducto = page.locator("[name='joy_ingreso[id_tipo_producto]']");

    // Mensajes de error
    this.errorDescripcion = page.locator('.error:near([name="joy_ingreso[descripcion_ingreso]"])').first();
    this.errorPrecio = page.locator('.error:near([name="joy_ingreso[precio_ingreso]"])').first();
    this.errorCantidad = page.locator('.error:near([name="joy_ingreso[cantidad]"])').first();
    this.errorFormaPago = page.locator('.error:near([name="joy_ingreso[id_forma_pago]"])').first();
    this.errorTipoVenta = page.locator('.error:near([name="joy_ingreso[id_tipo_ingreso]"])').first();
    this.errorTipoProducto = page.locator('.error:near([name="joy_ingreso[id_tipo_producto]"])').first();

    // Mensajes toast
    this.toastExito = page.locator('.overhang-message', { hasText: 'El proceso se ha realizado exitosamente' });
    this.toastError = page.locator('.overhang-message', { hasText: 'El formato JSON solicitado ha fallado' });
    this.mensajeEliminar = page.locator('.overhang-message', { hasText: '¿Desea eliminar el registro seleccionado?' });
  }

  // Navegación
  async abrirModulo() {
    console.log('🌐 Abriendo módulo de Ventas...');
    await this.moduloJoyeria.waitFor({ state: 'visible', timeout: 10000 });
    await this.navigateMenu(this.moduloJoyeria, this.menuParametros, this.submenu);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  // Selección Select2 mejorada por valor
  async selectOptionSelect2ByValue(locator, text) {
    if (!text) return;
    
    console.log(` Seleccionando: ${text}`);
    
    try {
      const name = await locator.getAttribute('name');
      
      // Usar JavaScript para seleccionar directamente
      const success = await this.page.evaluate(({ name, text }) => {
        const select = document.querySelector(`[name="${name}"]`);
        if (!select) return false;
        
        // Buscar la opción por texto
        const options = Array.from(select.options);
        const option = options.find(opt => 
          opt.text.trim().toUpperCase() === text.trim().toUpperCase()
        );
        
        if (option) {
          select.value = option.value;
          
          // Disparar cambios para Select2
          select.dispatchEvent(new Event('change', { bubbles: true }));
          
          // Si usa jQuery Select2
          if (window.$ && $(select).data('select2')) {
            $(select).val(option.value).trigger('change');
          }
          
          return true;
        }
        return false;
      }, { name, text });
      
      if (success) {
        console.log(` ✅ Seleccionado: ${text}`);
      } else {
        console.warn(` ⚠️ No se encontró: ${text}`);
      }
      
      await this.page.waitForTimeout(300);
      
    } catch (error) {
      console.warn(` ❌ Error: ${error.message}`);
    }
  }

  // Método para cantidad (select normal)
  async selectCantidad(cantidad) {
    if (!cantidad) return;
    
    try {
      await this.cantidad.selectOption({ label: cantidad.toString() });
      console.log(` Cantidad seleccionada: ${cantidad}`);
    } catch (error) {
      // Intentar por valor si falla por label
      await this.cantidad.selectOption({ value: cantidad.toString() });
      console.log(` Cantidad seleccionada por valor: ${cantidad}`);
    }
  }

  // Crear venta
  async crearVenta(descripcion, precio, cantidad, formaPago, tipoVenta, tipoProducto) {
    console.log(' Iniciando creación de venta...');
    
    // Abrir modal
    await this.click(this.btnCrear);
    await this.page.waitForTimeout(1500);
    
    // Campos básicos
    if (descripcion) {
      await this.descripcion.fill(descripcion);
    }
    
    if (precio !== undefined && precio !== '') {
      try {
        await this.precio.fill(precio.toString());
      } catch (error) {
        console.warn(' No se pudo llenar el precio');
      }
    }
    
    // Cantidad (select normal)
    if (cantidad) {
      await this.selectCantidad(cantidad);
      await this.page.waitForTimeout(300);
    }
    
    // Select2 fields con valores predeterminados
    if (formaPago) {
      await this.selectOptionSelect2ByValue(this.formaPago, formaPago);
      await this.page.waitForTimeout(400);
    }
    
    if (tipoVenta) {
      await this.selectOptionSelect2ByValue(this.tipoVenta, tipoVenta);
      await this.page.waitForTimeout(400);
    }
    
    if (tipoProducto) {
      await this.selectOptionSelect2ByValue(this.tipoProducto, tipoProducto);
      await this.page.waitForTimeout(400);
    }
    
    // Guardar
    await this.click(this.btnGuardar);
    console.log(' Botón "Guardar" presionado');
  }

  // Método auxiliar para crear venta rápida con defaults
  async crearVentaRapida(descripcion, precio, opciones = {}) {
    const defaults = {
      cantidad: '2',
      formaPago: 'EN EFECTIVO',
      tipoVenta: 'VENTAS NORMALES',
      tipoProducto: 'ANILLOS PLATA 925 ITALIANA'
    };
    
    const datos = { ...defaults, ...opciones };
    
    await this.crearVenta(
      descripcion,
      precio,
      datos.cantidad,
      datos.formaPago,
      datos.tipoVenta,
      datos.tipoProducto
    );
  }

  // Verificar existencia en tabla
  async verificarVentaExiste(descripcion) {
    await this.page.waitForTimeout(500);
    const fila = this.tabla.locator(`tr:has(td:text-is("${descripcion}"))`);
    return (await fila.count()) > 0;
  }

  // Eliminar venta
  async eliminarVenta(descripcion) {
    const fila = this.tabla.locator(`tr:has(td:text-is("${descripcion}"))`);
    if (await fila.count() > 0) {
      await fila.locator('button[name="Eliminar"]').click();
      await this.mensajeEliminar.waitFor({ state: 'visible', timeout: 5000 });
      await this.click(this.btnConfirmarEliminar);
      await this.toastExito.waitFor({ state: 'visible', timeout: 10000 });
      console.log(` Venta "${descripcion}" eliminada con éxito`);
    } else {
      console.log(` Venta "${descripcion}" no encontrada`);
    }
  }

  // Verificar estado de botones de paginación
  async isAnteriorDisabled() {
    return await this.btnAnterior.evaluate(node => node.classList.contains('disabled'));
  }

  async isSiguienteDisabled() {
    return await this.btnSiguiente.evaluate(node => node.classList.contains('disabled'));
  }
}

module.exports = { VentasPage };