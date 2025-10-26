const tiposProductoData = {
  valid: { 
    nombre: 'ANILLO', 
    descripcion: 'Anillo de oro fino' 
  },
  invalid: { 
    nombre: '', 
    descripcion: '' 
  },
  limites: {
    nombreLargo: 'A'.repeat(65), 
    descripcionLarga: 'D'.repeat(256) 
  },
  busqueda: {
    termino: 'ANILLO' 
  }
};

module.exports = { tiposProductoData };
