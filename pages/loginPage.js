// loginPage.js
const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);

        this.inputUsuario = page.locator('input[name="seg_usuario[login]"]');
        this.inputPassword = page.locator('input[name="seg_usuario[password]"]');
        
        this.btnLogin = page.locator('#enviar');

        this.passwordRequired = page.locator('#seg_usuario\\[password\\]-error');
        this.userFormatError = page.locator('#seg_usuario\\[login\\]-error');

       this.wrongPasswordError = page.locator('.overhang-message', { hasText: 'Contraseña erronea' });
        this.userNotRegisteredError = page.locator('.overhang-message:text("El nombre de usuario que introdujo no es la correcta o está inactivo, vuelva a intentarlo por favor.")');
    }

    
    async goto() {
        await this.page.goto('https://pruebas-3-3hjs.onrender.com');
    }
   
    async fillUsuario(usuario) {
        await this.fill(this.inputUsuario, usuario);
    }

    async fillPassword(password) {
        await this.fill(this.inputPassword, password);
    }

    async clickLogin() {
        await this.click(this.btnLogin);
    }

    async login(usuario, password) {
        await this.fillUsuario(usuario);
        await this.fillPassword(password);
        await this.clickLogin();
    }

    async submitEmpty() {
        await this.click(this.btnLogin);
    }


    async validarPasswordRequired() {
        await this.passwordRequired.waitFor({ state: 'visible' });
        return this.passwordRequired.textContent();
    }

    async validarUserFormatError() {
        await this.userFormatError.waitFor({ state: 'visible' });
        return this.userFormatError.textContent();
    }

    async validarWrongPassword() {
        await this.wrongPasswordError.waitFor({ state: 'visible' });
        return this.wrongPasswordError.isVisible();
    }

    async validarUserNotRegistered() {
        await this.userNotRegisteredError.waitFor({ state: 'visible' });
        return this.userNotRegisteredError.isVisible();
    }

   
    async validarError(mensaje) {
        return await this.validateToastMessage(mensaje);
    }
}

module.exports = { LoginPage };
