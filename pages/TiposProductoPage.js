const { BasePage } = require('../helpers/base.page');

class TiposProductoPage extends BasePage {
    constructor(page) {
        super(page);

        this.moduloJoyeria = page.locator('#menu-padre-16 > a span:has-text("Módulo de Joyeria")');
        this.menuParametros = page.locator('#menu-padre-17 > a:has-text("Parámetros")');
        this.submenu = page.locator('#tab-23:has-text("Tipos de Producto")');

        this.btnCrear = page.locator('button[name="Crear"]');
        this.btnGuardar = page.locator('#boton_guardar');

        this.inputNombre = page.locator('input[name="joy_tipo_producto[nombre_tipo_producto]"]');
        this.textareaDescripcion = page.locator('textarea[name="joy_tipo_producto[descripcion_tipo_producto]"]');
        this.tabla = page.locator('#tabla_tipo_producto tbody');
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

module.exports = { TiposProductoPage };