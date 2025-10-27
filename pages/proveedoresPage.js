const { ModuloPage } = require('./modeloParametroPage');

class ProveedoresPage extends ModuloPage {
  constructor(page) {
    super(page, {
      moduloSelector: '#menu-padre-16 > a span:has-text("Módulo de Joyeria")',
      menuSelector: '#menu-padre-17 > a:has-text("Parámetros")',
      submenuSelector: '#tab-22:has-text("Proveedores")',
      inputNombre: 'input[name="joy_proveedor[nombre_proveedor]"]',
      textareaDescripcion: 'textarea[name="joy_proveedor[descripcion_proveedor]"]',
      tabla: '#proveedor tbody'
    });
  }
}

module.exports = { ProveedoresPage };
