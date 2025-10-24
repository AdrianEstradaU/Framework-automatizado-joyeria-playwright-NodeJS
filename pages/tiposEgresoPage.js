const { BasePage } = require('../helpers/base.page');

class TiposEgresoPage extends BasePage {
    constructor(page) {
        super(page);

        this.moduloJoyeria = page.locator('#menu-padre-16 > a span:has-text("Módulo de Joyeria")');
        this.menuParametros = page.locator('#menu-padre-17 > a:has-text("Parámetros")');
        this.submenu = page.locator('#tab-21:has-text("Tipos de Egreso")');

        this.btnCrear = page.locator('button[name="Crear"]');
        this.btnGuardar = page.locator('#boton_guardar');

        this.inputNombre = page.locator('input[name="joy_tipo_egreso[nombre_tipo_egreso]"]');
        this.textareaDescripcion = page.locator('textarea[name="joy_tipo_egreso[descripcion_tipo_egreso]"]');
        this.tabla = page.locator('#tabla_tipo_egreso tbody');
    }

    async abrirModulo() {
        await this.navigateMenu(this.moduloJoyeria, this.menuParametros, this.submenu);
    }

    async crear(nombre, descripcion) {
        await this.click(this.btnCrear);
        await this.fill(this.inputNombre, nombre);
        await this.fill(this.textareaDescripcion, descripcion);
        await this.click(this.btnGuardar);
    }

    async seleccionarFila(nombre) {
        await this.selectRowByText(this.tabla, nombre);
    }

    async validarToast(mensaje) {
        return await this.validateToastMessage(mensaje);
    }
}

module.exports = { TiposEgresoPage };
