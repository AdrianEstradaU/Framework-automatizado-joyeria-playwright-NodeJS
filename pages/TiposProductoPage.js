const { ModuloPage } = require('./modeloParametroPage');
class TiposProductoPage extends ModuloPage {

  constructor(page) {
    super(page, {
      moduloSelector: '#menu-padre-16 > a span:has-text("Módulo de Joyeria")',
      menuSelector: '#menu-padre-17 > a:has-text("Parámetros")',
      submenuSelector: '#tab-23:has-text("Tipos de Producto")',
      inputNombre: 'input[name="joy_tipo_producto[nombre_tipo_producto]"]',
      textareaDescripcion: 'textarea[name="joy_tipo_producto[descripcion_tipo_producto]"]',
      tabla: '#tipo_producto tbody'
    });
  }
}




module.exports = { TiposProductoPage };
