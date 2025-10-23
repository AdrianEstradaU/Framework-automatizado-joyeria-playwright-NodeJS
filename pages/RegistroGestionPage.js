const { BasePage } = require('../helpers/base.page');

class RegistroGestionPage extends BasePage {
    constructor(page) {
        super(page);

        this.moduloJoyeria = page.locator('#menu-padre-16 > a span:has-text("Módulo de Joyeria")');
        this.menuParametros = page.locator('#menu-padre-17 > a:has-text("Parámetros")');
        this.submenu = page.locator('#tab-31:has-text("Registro de Gestión")');

        this.btnCrear = page.locator('button[name="Crear"]');
        this.btnGuardar = page.locator('#boton_guardar');

        this.inputAnio = page.locator('input[name="joy_gestion[anio]"]');
        this.tabla = page.locator('#tabla_gestion tbody');
    }

    async abrirModulo() {
        await this.navigateMenu(this.moduloJoyeria, this.menuParametros, this.submenu);
    }

    async crear(anio) {
        await this.click(this.btnCrear);
        await this.fill(this.inputAnio, anio);
        await this.click(this.btnGuardar);
    }

    async seleccionarFila(anio) {
        await this.selectRowByText(this.tabla, anio);
    }

    async validarToast(mensaje) {
        return await this.validateToastMessage(mensaje);
    }
}

module.exports = { RegistroGestionPage };
