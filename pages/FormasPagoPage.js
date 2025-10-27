const { ModuloPage } = require('./modeloParametroPage');

class FormasPagoPage extends ModuloPage {
  constructor(page) {
    super(page, {
      moduloSelector: '#menu-padre-16 > a span:has-text("Módulo de Joyeria")',
      menuSelector: '#menu-padre-17 > a:has-text("Parámetros")',
      submenuSelector: '#tab-20:has-text("Formas de Pago")',
      inputNombre: 'input[name="joy_forma_pago[nombre_forma_pago]"]',
      textareaDescripcion: 'textarea[name="joy_forma_pago[descripcion_forma_pago]"]',
      tabla: '#forma_pago tbody'
    });
  }
}

module.exports = { FormasPagoPage };
