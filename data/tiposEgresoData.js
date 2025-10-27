const tiposEgresoData = {
  valid: {
    nombre: 'Compra especial',
    descripcion: 'Compra realizada a un cliente preferencial',
    rol: 'Vendedor de Joyeria'
  },
  invalid: {
    nombre: '',          
    descripcion: '',
    rol: ''
  },
  limites: {
    nombreLargo: 'X'.repeat(51),        // 51 caracteres para límite de nombre
    descripcionLarga: 'Y'.repeat(256)   // 255 caracteres para límite de descripción
  },
  busqueda: {
    termino: 'Compra'    // Para tests de búsqueda
  }
};

module.exports = { tiposEgresoData };
