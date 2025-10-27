const { ModuloPage } = require('./modeloParametroPage');

class TiposEgresoPage extends ModuloPage {
  constructor(page) {
    super(page, {
      moduloSelector: '#menu-padre-16 > a span:has-text("Módulo de Joyeria")',
      menuSelector: '#menu-padre-17 > a:has-text("Parámetros")',
      submenuSelector: '#tab-24:has-text("Tipos de Egreso")',
      inputNombre: 'input[name="joy_tipo_egreso[nombre_tipo_egreso]"]',
      textareaDescripcion: 'textarea[name="joy_tipo_egreso[descripcion_tipo_egreso]"]',
      tabla: '#tipo_egreso tbody',
      selectRol: 'select[name="joy_tipo_egreso[id_rol]"]'
     });
    }
     
 
}



module.exports = { TiposEgresoPage };
