const tiposIngresoData = {
  valid: {
    nombre: 'VENTAS NORMALES 2',
    descripcion: 'Ingreso por ventas normales 2',
  },
  invalid: {
    nombre: '',
    descripcion: '',
  },
  limites: {
    nombreLargo: 'N'.repeat(65),
    descripcionLarga: 'D'.repeat(300),
  },
   flujoIngresos: {
    nombreFlujo: 'COMPRAS ESPECIALES 2',
    descripcionFlujo : 'Ingreso por compras especiales 2',
  },
  busqueda: {
    termino: 'VENTAS NORMALES',
  },
};

module.exports = { tiposIngresoData };
