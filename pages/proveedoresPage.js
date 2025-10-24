const { BasePage } = require('./BasePage');

class ProveedoresPage extends BasePage {
    constructor(page) {
        super(page);

        this.moduloJoyeria = page.locator('#menu-padre-16 > a span:has-text("Módulo de Joyeria")');
        this.menuParametros = page.locator('#menu-padre-17 > a:has-text("Parámetros")');
        this.submenu = page.locator('#tab-22:has-text("Proveedores")');

        this.btnCrear = page.locator('button[name="Crear"]');
        this.btnGuardar = page.locator('#boton_guardar');
        this.btnEliminar = page.locator('button[name="Eliminar"]');
        this.btnActualizar = page.locator('button[name="Actualizar"]');
        this.btnEditar = page.locator('button[name="Editar"]');

        this.inputNombre = page.locator('input[name="joy_proveedor[nombre_proveedor]"]');
        this.textareaDescripcion = page.locator('textarea[name="joy_proveedor[descripcion_proveedor]"]');
        this.tabla = page.locator('#tabla_proveedor tbody');
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

module.exports = { ProveedoresPage };
