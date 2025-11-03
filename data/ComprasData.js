const ComprasData = {
  valid: {
    descripcion: 'Compra de anillos de plata',
    precio: 250,
    cantidad: 5,
    tipoEgreso: 'COMPRA NORMAL',
    proveedor: 'DIAMANTE AZUL',
    tipoProducto: 'ANILLOS PLATA 925 ITALIANA'
  },

  invalid: {
    descripcion: '',
    precio: '',
    cantidad: '',
    tipoEgreso: '',
    proveedor: '',
    tipoProducto: ''
  },

  limites: {
    descripcionLarga: 'D'.repeat(256),
    descripcionLargaValida: 'D'.repeat(255),
    precioLargo: '9'.repeat(310),
    precioLargoValido: '9'.repeat(308)
  },

  busqueda: {
    termino: 'Compra de anillos de plata'
  },

  formatosInvalidos: {
    precioTexto: 'ABC',      
    cantidadTexto: 'XYZ'     
  },
  FlujoCompras: {
    descripcion: 'Compras  anillo Flujo completo',
    precio: 200,
    cantidad: 5,
    tipoEgreso: 'COMPRA ESPECIAL 1',
    proveedor: 'DIAMANTE BLANCO',
    tipoProducto: 'ANILLO ESPECIAL'
  },

  defaults: {
    cantidad: 1,
    tipoEgreso: 'COMPRA NORMAL',
    proveedor: 'DIAMANTE AZUL',
    tipoProducto: 'ANILLOS PLATA 925 ITALIANA'
  }
};

module.exports = { ComprasData };
