const tiposEgresoData = {
    valid: {
        nombre: 'Compra especial',
        descripcion: 'Compra realizada a un cliente preferencial'
    },
    invalid: {
        nombre: '',
        descripcion: ''
    },
    limites: {
        nombreMax: 'X'.repeat(51), // 51 caracteres para probar límite
        descripcionMax: 'Y'.repeat(255)
    }
};

module.exports = { tiposEgresoData };

