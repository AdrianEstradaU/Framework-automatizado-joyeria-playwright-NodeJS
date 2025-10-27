  const { ModuloPage } = require('./modeloParametroPage');
class TiposIngresoPage extends ModuloPage {
 
    constructor(page) {
    super(page, {
      moduloSelector: '#menu-padre-16 > a span:has-text("Módulo de Joyeria")',
      menuSelector: '#menu-padre-17 > a:has-text("Parámetros")',
      submenuSelector: '#tab-21:has-text("Tipos de Ingreso")',
      inputNombre: 'input[name="joy_tipo_ingreso[nombre_tipo_ingreso]"]',
      textareaDescripcion: 'textarea[name="joy_tipo_ingreso[descripcion_tipo_ingreso]"]',
      tabla: '#tipo_ingreso tbody'
    });
  }
}



module.exports = { TiposIngresoPage };
