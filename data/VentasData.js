const VentasData = {
    valid: { 
    descripcion: 'Anillo de oro finos',
    precio:100, 
    cantidad:2, 
    formaPago:'EN EFECTIVO', 
    tipoVenta:'VENTAS NORMALES', 
    tipoProducto:'ANILLOS PLATA 925 ITALIANA'
    
  },
  invalid: { 
    descripcion: '',
    precio:"", 
    cantidad:"", 
    formaPago:'', 
    tipoVenta:'', 
    tipoProducto:''

  },

  limites: {
    preciolargo: 'A'.repeat(310), 
    descripcionLarga: 'D'.repeat(256),
    preciolargovalido: '9'.repeat(308),
    descripcionLargaValida: 'D'.repeat(255)
  },
  busqueda: {
    termino: 'Anillo de oro finos' 
  },
   formatosInvalidos: {
    precioTexto: 'ABC',         // intento de escribir texto en número
    cantidadTexto: 'XYZ'        // intento de escribir texto en número
  },
   defaults: {
    cantidad: '2',
    formaPago: 'EN EFECTIVO',
    tipoVenta: 'VENTAS NORMALES',
    tipoProducto: 'ANILLOS PLATA 925 ITALIANA'
  }
};
module.exports = { VentasData };