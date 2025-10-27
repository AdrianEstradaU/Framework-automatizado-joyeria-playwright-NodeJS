const loginData = {
    valid: { usuario: 'andres', password: 'A123456a' },
    vacio: { usuario: '', password: '' },
    usuarioNoRegistrado: { usuario: 'noexiste', password: 'A123456a' },
    contrasenaIncorrecta: { usuario: 'morgan.checa', password: 'wrongPass' },
    usuarioConSimbolos: { usuario: 'morg@123', password: 'A123456a' }
};

module.exports = { loginData };